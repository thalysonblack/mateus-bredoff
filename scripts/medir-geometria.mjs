/**
 * Geometria medida do original — o que o `audit-framer.mjs` não colhe.
 *
 * O audit responde "que tipografia e que cor", que é metade da réplica. A outra
 * metade é ONDE as coisas ficam: margem lateral, início da coluna de conteúdo,
 * largura de card, gap, altura de cada faixa. Replicar tipografia certa em
 * coluna errada continua não sendo réplica.
 *
 * Colhe, por rota:
 *   - todo nó de texto que pinta, com rect absoluto (x/y/w/h) e estilo
 *   - toda img/video com rect e proporção exibida
 *   - a coluna em que cada coisa começa, para o eixo x virar grade e não achismo
 *
 * uso: node scripts/medir-geometria.mjs /about 1600
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://mateusbredoff.framer.website';
const [rota = '/about', wArg = '1600'] = process.argv.slice(2);
const W = +wArg;
const OUT = '/tmp/framer-geo';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: 1000 });
/* Aceita URL inteira para poder medir a réplica local com o MESMO código do
   original — dois medidores diferentes comparam duas medições, não duas telas. */
await page.goto(rota.startsWith('http') ? rota : BASE + rota, {
  waitUntil: 'networkidle2',
  timeout: 90000,
});
await page.evaluate(() => document.fonts.ready);

/* O Framer só monta o que entra em viewport — sem rolar tudo antes, metade das
   seções não existe no DOM e a medição sai truncada sem avisar. */
await page.evaluate(async () => {
  const passo = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += passo) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 250));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const dados = await page.evaluate(() => {
  const round = (n) => Math.round(n * 10) / 10;
  const sy = window.scrollY;

  const textos = [];
  const vistos = new Set();
  document.querySelectorAll('*').forEach((el) => {
    /* Só nós FOLHA de texto: um <div> pai herda o estilo e duplica a medida
       com um rect que é o do bloco, não o da linha. */
    const filhoTexto = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim(),
    );
    if (!filhoTexto) return;
    const t = el.textContent.trim();
    if (!t) return;

    /* A caixa da PRIMEIRA LINHA DE TEXTO, não a do elemento.
       O bounding do elemento inclui padding e borda: um rótulo com
       `padding-top: 24px` mede 24px acima de onde a letra realmente está, e a
       comparação com o original — que põe o padding num wrapper — acusa uma
       diferença que não existe na tela. Foi assim que este script mostrou −8px
       num espaçamento que estava certo. */
    let r = el.getBoundingClientRect();
    const faixa = document.createRange();
    faixa.selectNodeContents(el);
    const linhas = faixa.getClientRects();
    if (linhas.length) r = linhas[0];
    if (r.width < 1 || r.height < 1) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.opacity === '0') return;
    const chave = `${t.slice(0, 40)}|${round(r.x)}|${round(r.y + sy)}`;
    if (vistos.has(chave)) return;
    vistos.add(chave);
    textos.push({
      t: t.slice(0, 70),
      x: round(r.x),
      y: round(r.y + sy),
      w: round(r.width),
      h: round(r.height),
      fs: s.fontSize,
      lh: s.lineHeight,
      ls: s.letterSpacing,
      fw: s.fontWeight,
      cor: s.color,
      tt: s.textTransform,
      /* Branco puro em cima de foto quase sempre é `difference` disfarçado —
         medir a cor sem medir o blend faz a réplica pintar branco chapado. */
      blend: s.mixBlendMode === 'normal' ? undefined : s.mixBlendMode,
    });
  });

  const midias = [];
  document.querySelectorAll('img, video').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    midias.push({
      tag: el.tagName.toLowerCase(),
      src: (el.currentSrc || el.src || '').slice(0, 120),
      x: round(r.x),
      y: round(r.y + sy),
      w: round(r.width),
      h: round(r.height),
      fit: getComputedStyle(el).objectFit,
      natural: el.naturalWidth ? `${el.naturalWidth}x${el.naturalHeight}` : null,
    });
  });

  /* Faixas: filhos diretos com altura de seção. Dá o ritmo vertical da página
     sem eu ter que somar rect de texto na mão. */
  const faixas = [];
  const anda = (el, prof) => {
    for (const f of el.children) {
      const r = f.getBoundingClientRect();
      if (r.height < 80 || r.width < window.innerWidth * 0.5) continue;
      const s = getComputedStyle(f);
      faixas.push({
        prof,
        tag: f.tagName.toLowerCase(),
        y: round(r.y + sy),
        h: round(r.height),
        w: round(r.width),
        bg: s.backgroundColor,
        txt: f.textContent.trim().slice(0, 45),
      });
      if (prof < 4) anda(f, prof + 1);
    }
  };
  anda(document.body, 0);

  return {
    altura: document.body.scrollHeight,
    viewport: window.innerWidth,
    textos: textos.sort((a, b) => a.y - b.y || a.x - b.x),
    midias: midias.sort((a, b) => a.y - b.y),
    faixas,
  };
});

const nome = `${rota.replace(/\//g, '_') || '_'}-${W}.json`;
writeFileSync(`${OUT}/${nome}`, JSON.stringify(dados, null, 1));
console.log(`${OUT}/${nome} — altura ${dados.altura}, ${dados.textos.length} textos, ${dados.midias.length} mídias`);
await browser.close();
