/**
 * Levantamento MEDIDO do site publicado do cliente (Framer), para a réplica.
 *
 * Não é screenshot para olhar: é extração de valores computados. Replicar de
 * olho reproduz a aparência aproximada e erra escala, entrelinha e ritmo — que
 * é justamente onde a cópia se denuncia.
 *
 * Por rota, colhe:
 *   - tipografia REAL usada (família + peso + tamanho + entrelinha + tracking),
 *     agrupada por frequência, para separar o sistema do acidente
 *   - paleta medida (cor de texto e de fundo, com contagem de nós)
 *   - a árvore de seções na ordem do documento, com altura e texto-âncora
 *   - todo asset (img/video/bg) com URL e dimensão natural
 *   - fontes que o navegador realmente baixou (via requests)
 *
 * uso: node scripts/audit-framer.mjs [rota] [width]
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://mateusbredoff.framer.website';
const ROTAS = [
  '/', '/about', '/work',
  '/work/stag/', '/work/votare/', '/work/alex-archer/',
  '/work/trivo/', '/work/ferraci/', '/work/proxima/',
];

const [rotaArg, wArg = '1600'] = process.argv.slice(2);
const alvos = rotaArg ? [rotaArg] : ROTAS;
const W = +wArg;
const OUT = '/tmp/framer-audit';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const relatorio = {};

for (const rota of alvos) {
  const page = await browser.newPage();
  const fontesBaixadas = new Set();
  const erros = [];
  page.on('response', (r) => {
    const u = r.url();
    if (/\.(woff2?|ttf|otf)(\?|$)/i.test(u)) fontesBaixadas.add(u);
  });
  page.on('pageerror', (e) => erros.push(e.message));

  await page.setViewport({ width: W, height: 1000, deviceScaleFactor: 2 });
  await page.goto(BASE + rota, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);

  /* O Framer só monta o que entra em viewport. Sem rolar a página inteira
     antes de medir, metade das seções não existe no DOM e o levantamento sai
     truncado sem avisar. */
  await page.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });

  const dados = await page.evaluate(() => {
    const visivel = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0';
    };

    /* Tipografia: só nós que REALMENTE pintam texto. Um <div> herda font-size
       do pai e infla a contagem com estilo que ninguém vê. */
    const tipo = new Map();
    const cores = new Map();
    const textos = [];
    for (const el of document.querySelectorAll('*')) {
      const proprio = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim())
        .join(' ');
      if (!proprio || !visivel(el)) continue;
      const s = getComputedStyle(el);
      const chave = [
        s.fontFamily.split(',')[0].replace(/["']/g, ''),
        s.fontWeight,
        s.fontSize,
        s.lineHeight,
        s.letterSpacing,
        s.textTransform,
      ].join(' | ');
      const t = tipo.get(chave) || { n: 0, amostra: '' };
      t.n++;
      if (!t.amostra) t.amostra = proprio.slice(0, 48);
      tipo.set(chave, t);
      cores.set(s.color, (cores.get(s.color) || 0) + 1);
      textos.push({ t: proprio.slice(0, 120), size: s.fontSize, fam: s.fontFamily.split(',')[0].replace(/["']/g, '') });
    }

    /* Fundos: percorre só quem pinta área grande — o resto é ruído. */
    const fundos = new Map();
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width * r.height < 40000) continue;
      const bg = getComputedStyle(el).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)') continue;
      fundos.set(bg, (fundos.get(bg) || 0) + 1);
    }

    const imagens = [...document.querySelectorAll('img')]
      .filter(visivel)
      .map((i) => ({
        src: i.currentSrc || i.src,
        natural: `${i.naturalWidth}x${i.naturalHeight}`,
        exibida: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
        alt: i.alt || null,
        fit: getComputedStyle(i).objectFit,
      }));

    const videos = [...document.querySelectorAll('video')].map((v) => ({
      src: v.currentSrc || v.src || [...v.querySelectorAll('source')].map((s) => s.src).join(','),
      poster: v.poster || null,
      loop: v.loop, muted: v.muted, autoplay: v.autoplay,
    }));

    /* Seções na ordem do documento: filhos diretos de alto nível com altura
       relevante. É o esqueleto que a réplica precisa reproduzir. */
    const raiz = document.querySelector('#main, [data-framer-name="Desktop"], body');
    const secoes = [...(raiz?.children || [])].flatMap(function achatar(el) {
      const r = el.getBoundingClientRect();
      if (r.height < 80) return [];
      const filhos = [...el.children].filter((c) => c.getBoundingClientRect().height > 200);
      if (filhos.length > 1 && el.children.length < 12) {
        return filhos.flatMap(achatar);
      }
      return [{
        tag: el.tagName.toLowerCase(),
        nome: el.getAttribute('data-framer-name') || el.className?.toString().slice(0, 40) || null,
        altura: Math.round(r.height),
        bg: getComputedStyle(el).backgroundColor,
        texto: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 160),
      }];
    });

    return {
      titulo: document.title,
      meta: document.querySelector('meta[name="description"]')?.content || null,
      altura: document.body.scrollHeight,
      tipografia: [...tipo.entries()].sort((a, b) => b[1].n - a[1].n).map(([k, v]) => ({ estilo: k, nos: v.n, amostra: v.amostra })),
      cores: [...cores.entries()].sort((a, b) => b[1] - a[1]),
      fundos: [...fundos.entries()].sort((a, b) => b[1] - a[1]),
      imagens, videos, secoes,
      copy: textos,
    };
  });

  dados.fontesBaixadas = [...fontesBaixadas];
  dados.erros = erros;
  relatorio[rota] = dados;

  /* Fotografia em fatias, para conferência visual da réplica depois. */
  const slug = rota.replace(/\//g, '_') || '_home';
  const nFatias = Math.min(12, Math.ceil(dados.altura / 1000));
  for (let i = 0; i < nFatias; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 1000);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${W}${slug}-${String(i).padStart(2, '0')}.png` });
  }

  console.error(`✓ ${rota} — ${dados.altura}px, ${dados.imagens.length} img, ${dados.tipografia.length} estilos, ${nFatias} fatias`);
  await page.close();
}

await browser.close();

/* Uma rota por chamada escreve arquivo PRÓPRIO. Antes a saída era sempre
   `audit-<W>.json` e quatro chamadas seguidas deixavam só a última no disco —
   o levantamento parecia completo e tinha uma rota só. */
const sufixo = rotaArg ? `-${rotaArg.replace(/\//g, '_')}` : '';
const arquivo = `${OUT}/audit-${W}${sufixo}.json`;
writeFileSync(arquivo, JSON.stringify(relatorio, null, 2));
console.log(arquivo);
