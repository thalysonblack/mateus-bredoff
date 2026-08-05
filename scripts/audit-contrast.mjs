/**
 * Auditoria de contraste MEDIDA NO PIXEL RENDERIZADO.
 *
 * Não estima a partir de `color` vs `background-color` — isso mente quando há
 * blend mode, opacity, imagem de fundo ou gradiente atrás do texto (este repo
 * já escondeu três bugs assim). Em vez disso: recorta a bbox de cada nó de
 * texto, converte o PNG em RGB cru com ffmpeg e calcula a razão de contraste
 * entre o pixel mais claro e o mais escuro daquele recorte.
 *
 * Uso: node scripts/audit-contrast.mjs [url]
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ ESTADO: AFERIDO EM PÁGINA CONTROLADA, COM DERIVA CONHECIDA EM PÁGINA REAL.
 *
 * **Não use o número absoluto deste script como prova em página real.** Para par
 * de cor chapada sobre cor chapada — que é a maioria — a fórmula WCAG sobre os
 * valores de cor é determinística, custa dez linhas e não tem nenhum destes
 * problemas. Este medidor é para o que a fórmula NÃO alcança: texto sobre foto,
 * sob `mix-blend-mode`, sobre gradiente.
 *
 * O que foi consertado (ver `aferir-contraste.html`): o `clip` do
 * `page.screenshot` é em coordenadas de DOCUMENTO e o script passava o rect de
 * `getClientRects()`, que é de VIEWPORT. No topo da página os dois coincidem, e
 * é por isso que o defeito atravessou quatro rodadas de correção de método sem
 * morrer — toda verificação rápida confirmava um script quebrado. Aferido
 * depois do conserto: 21,00 / 6,48 / 4,54 / 2,30 batem o valor teórico e dão
 * IDÊNTICOS em três condições (28px no topo, 12px, e 14000px abaixo).
 *
 * O QUE AINDA DERIVA, e que a página de aferição não expõe: em página real,
 * pares idênticos medem diferente. Os quatro links do rodapé da /about são
 * todos `#616B6F` sobre `#142126`, que a fórmula põe em 3,01:1, e mediram
 *
 *     Email 2,77   Behance 2,74   Instagram 2,60   X.com 2,47
 *
 * O desvio é MONOTÔNICO com a posição vertical: quanto mais baixo o elemento,
 * mais baixo o número. Sobra um deslocamento progressivo do recorte.
 *
 * Já descartado, medindo — não repita este trabalho:
 *   · não é o `.grain` (removido por script, valores idênticos);
 *   · não é antialiasing (12px acerta igual a 28px na aferição);
 *   · não é o Lenis mover por transform (ele usa scroll nativo: medido
 *     `scrollY` = `scrollMax`, `transform: none` em html, body e main).
 *
 * Suspeita não testada, por onde começar: **`captureBeyondViewport`**. Quando o
 * clip cai fora da viewport atual o Chrome compõe a captura além dela, e o
 * padrão mudou entre versões do Puppeteer — é candidato natural a um
 * deslocamento que cresce com a distância ao viewport, que é exatamente a
 * assinatura observada. Vale testar fixando `captureBeyondViewport: false` com
 * o clip de volta em coordenadas de viewport, e reaferir nos três blocos.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.argv[2] ?? 'http://127.0.0.1:4599/';
const TMP_PNG = '/tmp/mb-contrast-clip.png';
const TMP_RAW = '/tmp/mb-contrast-clip.raw';

const lum = (r, g, b) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * Contraste do recorte: fundo = luminância MODAL (o que ocupa mais área),
 * texto = o extremo oposto ao fundo.
 *
 * Não use percentil simétrico aqui: num recorte de 12px de altura, os pixels
 * de glifo cheio de um mono fino são bem menos de 1% da área, então qualquer
 * trim generoso descarta o texto e devolve o antialiasing — foi assim que a
 * primeira versão deste script "mediu" branco-sobre-preto em 2:1.
 */
function measureClip(buf, w, h) {
  writeFileSync(TMP_PNG, buf);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', TMP_PNG,
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', TMP_RAW]);
  const raw = execFileSync('cat', [TMP_RAW], { maxBuffer: 1 << 28, encoding: 'buffer' });
  const n = Math.floor(raw.length / 3);
  if (!n) return null;

  // histograma por luminância quantizada em 256 níveis
  const hist = new Float64Array(256);
  const count = new Int32Array(256);
  for (let i = 0; i + 2 < raw.length; i += 3) {
    const L = lum(raw[i], raw[i + 1], raw[i + 2]);
    const bin = Math.min(255, Math.round(L * 255));
    count[bin]++;
    hist[bin] += L;
  }
  let bgBin = 0;
  for (let b = 1; b < 256; b++) if (count[b] > count[bgBin]) bgBin = b;
  const bgL = hist[bgBin] / count[bgBin];

  // extremo oposto ao fundo, com trim de 0.2% só pra matar pixel solto/artefato
  const trim = Math.max(0, Math.floor(n * 0.002));
  let acc = 0, fgL = bgL;
  if (bgBin > 127) {
    for (let b = 0; b < 256; b++) { acc += count[b]; if (acc > trim) { fgL = hist[b] / count[b]; break; } }
  } else {
    for (let b = 255; b >= 0; b--) { acc += count[b]; if (acc > trim) { fgL = hist[b] / count[b]; break; } }
  }

  const inkPixels = bgBin > 127
    ? count.slice(0, Math.max(1, bgBin - 12)).reduce((a, c) => a + c, 0)
    : count.slice(Math.min(255, bgBin + 12)).reduce((a, c) => a + c, 0);

  return {
    ratio: +ratio(bgL, fgL).toFixed(2),
    bg: +bgL.toFixed(4),
    fg: +fgL.toFixed(4),
    inkPixels, // 0 = nada de texto no recorte → medida inválida, não aprovação
    samples: n, w, h,
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 1000, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const report = {};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  /*
   * Força o estado final da revelação em vez de esperar por ela.
   *
   * Framer Motion mantém `initial: {opacity: 0}` como STYLE INLINE e só resolve
   * quando o elemento entra na viewport com `amount: 0.35`. Esperar não é
   * confiável: se o scroll deixa o nó parcialmente visível, o reveal nunca
   * dispara e o recorte mede um retângulo vazio — foi o que reprovou 94 de 119
   * nós como "invisíveis" quando eles estão perfeitamente legíveis na tela.
   *
   * `opacity: 1 !important` no CSS vence style inline sem `!important`, então
   * isto destrava tudo de uma vez. Só a opacidade: mexer em `transform` também
   * moveria layout que depende dele, e a caixa é re-lida depois de qualquer forma.
   */
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = `*,*::before,*::after{opacity:1!important;animation:none!important;transition:none!important}`;
    document.head.appendChild(s);
  });
  await new Promise((r) => setTimeout(r, 2500));

  const pararScroll = () =>
    page.evaluate(
      () =>
        new Promise((res) => {
          let ultimo = -1;
          let iguais = 0;
          const tick = () => {
            const y = window.scrollY;
            if (y === ultimo) {
              if (++iguais >= 5) return res(y);
            } else {
              iguais = 0;
              ultimo = y;
            }
            requestAnimationFrame(tick);
          };
          tick();
        }),
    );

  /*
   * UMA varredura de rolagem, não uma por nó.
   *
   * Com o clip em coordenadas de documento, a foto não depende mais de onde a
   * página está — rolar serve só para DISPARAR o que espera o scroll (reveal
   * por ScrollTrigger, imagem `lazy`, montagem sob demanda). Feito isso uma vez,
   * os ~70 nós são fotografados sem mexer mais na página: some o custo de 70
   * idas e vindas e some junto a chance de a página estar em movimento na hora
   * da foto.
   *
   * Rola com roda de verdade porque é o único gesto que o Lenis interpola como
   * faria com o usuário — `window.scrollTo` não move scroll interpolado.
   */
  for (let i = 0; i < 40; i++) {
    const fim = await page.evaluate(
      () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 2,
    );
    if (fim) break;
    await page.mouse.wheel({ deltaY: vp.height * 0.8 });
    await new Promise((r) => setTimeout(r, 160));
  }
  await pararScroll();
  /* O reveal ainda precisa de tempo: `animation:none` não segura Framer Motion
     nem GSAP, que animam por WAAPI/rAF. */
  await new Promise((r) => setTimeout(r, 900));

  /* A coleta vem DEPOIS da varredura, e a ordem é obrigatória: o SplitText
     reescreve o innerHTML dos parágrafos revelados, destruindo os nós que já
     tivessem recebido `data-audit-idx`. Coletando antes, 160 dos 164 nós da
     /about viravam referência morta e o relatório saía com 4 — verde, curto e
     mentiroso. Medir o DOM DEPOIS de tudo que o scroll dispara é também o que
     corresponde ao que o usuário enxerga. */
  const nodes = await page.evaluate(() => {
    const out = [];
    let idx = 0;
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const t = (n.textContent || '').trim();
      if (t.length < 2) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      // Caixa da PRIMEIRA LINHA do texto, não a bbox do elemento: a bbox inclui
      // padding e pode encostar na borda, e aí o recorte mede o fundo de fora
      // (foi o que fez a calibração devolver 21:1 pra tudo).
      const range = document.createRange();
      range.selectNodeContents(n);
      const rects = [...range.getClientRects()].filter((r) => r.width > 3 && r.height > 3);
      range.detach();
      if (!rects.length) continue;
      const r = rects.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
      if (r.width < 4 || r.height < 4) continue;
      const px = parseFloat(cs.fontSize);
      const bold = +cs.fontWeight >= 700;
      const id = String(idx++);
      el.setAttribute('data-audit-idx', id);
      out.push({
        id,
        label: t.slice(0, 42).replace(/\s+/g, ' '),
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 44),
        fontPx: px,
        // WCAG "texto grande": >=24px, ou >=18.66px em bold
        large: px >= 24 || (bold && px >= 18.66),
        color: cs.color,
        top: Math.round(r.top + window.scrollY),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
      });
    }
    return out;
  });

  /*
   * ⚠ ERRO DE MÉTODO Nº 5, o mais caro: `window.scrollTo` NÃO POSICIONA A
   * PÁGINA quando o scroll é do Lenis.
   *
   * O que acontecia: `scrollTo` movia o scroll nativo, o Lenis puxava de volta
   * para a posição interpolada dele, e a página seguia DESLIZANDO enquanto o
   * script media. A caixa era lida num instante e o `screenshot({clip})` saía
   * em outro, algumas centenas de milissegundos depois — o recorte caía num
   * pedaço qualquer da página.
   *
   * O sintoma denunciava a causa: quanto MAIS LONGA a página, maior a distância
   * que o Lenis percorria entre a leitura e a foto, e pior a medida. Os mesmos
   * elementos do rodapé mediam 5,4:1 em `/work` (2000px) e 2,3:1 em
   * `/work/alex-archer` (13800px). Contraste não depende do comprimento da
   * página — o recorte é que saía do lugar. Isso reprovou creme sobre petróleo
   * com 1,3:1 quando o valor real é 13,3:1.
   *
   * A correção tem duas partes, e as duas são necessárias:
   *   1. ESPERAR O SCROLL PARAR de verdade (polling de rAF até `scrollY` ficar
   *      igual por 5 quadros), em vez de dormir 900ms e torcer;
   *   2. PROVAR que a caixa não se moveu: re-ler o rect DEPOIS da foto e
   *      descartar a medida se ele andou. Sem essa prova, o dia em que outra
   *      coisa mexer no scroll o medidor volta a mentir em silêncio — e um
   *      medidor que mente é pior que medidor nenhum.
   */

  /* Recorte EXATO da caixa de linha, re-lida no momento do uso. Vive numa
     função só porque é chamada DUAS vezes por nó: antes da foto para definir o
     clip, e depois para provar que nada se moveu. */
  const lerCaixa = (id) =>
    page.evaluate((id) => {
      const el = document.querySelector(`[data-audit-idx="${id}"]`);
      if (!el) return null;
      const node = [...el.childNodes].find((c) => c.nodeType === 3 && (c.textContent || '').trim().length > 1);
      if (!node) return null;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter((r) => r.width > 3 && r.height > 3);
      range.detach();
      if (!rects.length) return null;
      const r = rects.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
      return {
        x: Math.max(0, Math.round(r.left)),
        y: Math.round(r.top),
        /* `sy` do MESMO instante da leitura: o clip do screenshot é em
           coordenadas de DOCUMENTO, então y+sy é o que vale para a foto, e ler
           o scroll separado abriria a janela para ele mudar no meio. */
        sy: Math.round(window.scrollY),
        width: Math.max(1, Math.round(r.width)),
        height: Math.max(1, Math.round(r.height)),
      };
    }, id);

  const results = [];
  for (const n of nodes) {
    const box = await lerCaixa(n.id);    if (!box) continue;
    /*
     * ⚠ ERRO DE MÉTODO Nº 6, e a causa REAL de o medidor mentir em página longa:
     * o `clip` do `page.screenshot` é em coordenadas de DOCUMENTO, não de
     * viewport (o Puppeteer captura além da viewport por padrão). O script
     * passava o rect de `getClientRects()`, que é relativo à VIEWPORT.
     *
     * No topo da página os dois referenciais coincidem e tudo media certo — foi
     * o que fez o defeito sobreviver. Rolado 13682px, o clip pedia o pixel do
     * documento em y=742: o meio de um espaçador em branco. Todo texto abaixo
     * da primeira tela era medido contra o pedaço errado da página, e o erro
     * crescia com o comprimento dela.
     *
     * Aferido: com o clip em documento, o mesmo par de cores mede 21,00:1 no
     * topo E 14000px abaixo. Sem a soma, o de baixo media o fundo vazio.
     */
    let buf;
    try {
      buf = await page.screenshot({
        clip: { x: box.x, y: box.y + box.sy, width: box.width, height: box.height },
        encoding: 'binary',
      });
    } catch { continue; }

    /* A PROVA de que o recorte é válido: se a caixa andou entre a leitura e a
       foto, o pixel medido é de outro lugar da página. Descartar é a única
       resposta honesta — o nó vai para `unmeasured`, nunca para "aprovado". */
    const box2 = await lerCaixa(n.id);
    if (
      !box2 ||
      Math.abs(box2.y + box2.sy - (box.y + box.sy)) > 1 ||
      Math.abs(box2.x - box.x) > 1
    ) {
      results.push({
        ...n, measured: null, required: n.large ? 3 : 4.5,
        inkPixels: 0, pass: false, invalid: true,
        motivo: 'a caixa se moveu entre a leitura e a foto',
      });
      continue;
    }

    const m = measureClip(buf, box.width, box.height);
    if (!m) continue;
    const min = n.large ? 3 : 4.5;
    results.push({
      ...n, measured: m.ratio, required: min,
      inkPixels: m.inkPixels,
      pass: m.ratio >= min,
      // recorte sem pixel de tinta: o nó não pintou onde dissemos que pintaria
      invalid: m.inkPixels === 0,
    });
  }

  const fmt = (r) => ({
    text: r.label, tag: r.tag, cls: r.cls, fontPx: r.fontPx,
    color: r.color, measured: r.measured, required: r.required,
    inkPixels: r.inkPixels, at: `y=${r.top}`,
  });

  report[vp.name] = {
    checked: results.length,
    failures: results.filter((r) => !r.pass && !r.invalid).sort((a, b) => a.measured - b.measured).map(fmt),
    unmeasured: results.filter((r) => r.invalid).map(fmt),
    todos: results.map((r) => `${r.measured}:1 — "${r.label}"`),
    worstPasses: results.filter((r) => r.pass)
      .sort((a, b) => a.measured - b.measured).slice(0, 6)
      .map((r) => `${r.measured}:1 (min ${r.required}) — "${r.label}" ${r.fontPx}px ${r.cls}`),
  };
  await page.close();
}

try { unlinkSync(TMP_PNG); unlinkSync(TMP_RAW); } catch {}
console.log(JSON.stringify(report, null, 2));
await browser.close();
