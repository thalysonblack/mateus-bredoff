/**
 * Scout de REFERÊNCIA — mineração de MECÂNICA, não réplica.
 *
 * Referência de terceiro: copia-se o GESTO (estrutura, interação, composição),
 * nunca a matéria (fonte, cor, imagem). Por isso, além do que o `audit-framer`
 * colhe, este extrai mixBlendMode / filter / position fixed|sticky / backdrop
 * dos nós grandes — é onde a mecânica vive e a geometria não denuncia.
 *
 * Nasceu apontado para o noartmusic.com (a referência de agosto/26) e virou
 * genérico na segunda vez que precisei dele: scout que só sabe minerar um site
 * é um script morto no dia seguinte.
 *
 * uso: node scripts/scout-ref.mjs <url> [width]
 *      node scripts/scout-ref.mjs https://bleibtgleich.dev 1600
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [urlArg, wArg = '1600'] = process.argv.slice(2);
if (!urlArg) {
  console.error('uso: node scripts/scout-ref.mjs <url> [width]');
  process.exit(1);
}
const alvo = new URL(urlArg.startsWith('http') ? urlArg : `https://${urlArg}`);
const BASE = alvo.origin;
const rotaArg = alvo.pathname;
const W = +wArg;
/* uma pasta por domínio: minerar duas referências não mistura as fatias */
const OUT = `/tmp/scout-${alvo.hostname.replace(/[^a-z0-9]/gi, '-')}`;
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const page = await browser.newPage();
const fontesBaixadas = new Set();
page.on('response', (r) => {
  const u = r.url();
  if (/\.(woff2?|ttf|otf)(\?|$)/i.test(u)) fontesBaixadas.add(u);
});

await page.setViewport({ width: W, height: 1000, deviceScaleFactor: 2 });
await page.goto(BASE + rotaArg, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);

/* rolar tudo antes de medir — lazy-mount trunca em silêncio */
await page.evaluate(async () => {
  const passo = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += passo) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 300));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const dados = await page.evaluate(() => {
  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0';
  };

  const tipo = new Map();
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
      s.fontWeight, s.fontSize, s.lineHeight, s.letterSpacing, s.textTransform,
    ].join(' | ');
    const t = tipo.get(chave) || { n: 0, amostra: '' };
    t.n++;
    if (!t.amostra) t.amostra = proprio.slice(0, 60);
    tipo.set(chave, t);
    textos.push({ t: proprio.slice(0, 160), size: s.fontSize });
  }

  const fundos = new Map();
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 40000) continue;
    const bg = getComputedStyle(el).backgroundColor;
    if (bg === 'rgba(0, 0, 0, 0)') continue;
    fundos.set(bg, (fundos.get(bg) || 0) + 1);
  }

  /* MECÂNICA: nós com blend, filter, fixed/sticky ou transform relevante */
  const mecanica = [];
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 10000) continue;
    const interessa =
      s.mixBlendMode !== 'normal' ||
      (s.filter !== 'none' && s.filter !== '') ||
      s.position === 'fixed' || s.position === 'sticky' ||
      (s.backdropFilter && s.backdropFilter !== 'none');
    if (!interessa) continue;
    mecanica.push({
      tag: el.tagName.toLowerCase(),
      cls: el.className?.toString().slice(0, 60) || null,
      box: `${Math.round(r.width)}x${Math.round(r.height)}`,
      blend: s.mixBlendMode !== 'normal' ? s.mixBlendMode : undefined,
      filter: s.filter !== 'none' ? s.filter.slice(0, 80) : undefined,
      pos: ['fixed', 'sticky'].includes(s.position) ? s.position : undefined,
      backdrop: s.backdropFilter !== 'none' ? s.backdropFilter : undefined,
      texto: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) || undefined,
    });
  }

  const imagens = [...document.querySelectorAll('img')].filter(visivel).map((i) => ({
    src: (i.currentSrc || i.src).slice(0, 120),
    natural: `${i.naturalWidth}x${i.naturalHeight}`,
    exibida: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
  }));
  const videos = [...document.querySelectorAll('video')]
    .map((v) => ({ src: (v.currentSrc || v.src || '').slice(0, 120), loop: v.loop, autoplay: v.autoplay }))
    .filter((v) => /\.(mp4|webm|m3u8)/.test(v.src));

  const raiz = document.querySelector('main, #main, body');
  const secoes = [...(raiz?.children || [])].flatMap(function achatar(el) {
    const r = el.getBoundingClientRect();
    if (r.height < 80) return [];
    const filhos = [...el.children].filter((c) => c.getBoundingClientRect().height > 200);
    if (filhos.length > 1 && el.children.length < 12) return filhos.flatMap(achatar);
    return [{
      tag: el.tagName.toLowerCase(),
      cls: el.className?.toString().slice(0, 50) || null,
      altura: Math.round(r.height),
      topo: Math.round(r.top + window.scrollY),
      bg: getComputedStyle(el).backgroundColor,
      texto: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 200),
    }];
  });

  const links = [...document.querySelectorAll('a[href]')]
    .map((a) => ({ t: a.innerText.trim().slice(0, 40), href: a.getAttribute('href') }))
    .filter((l) => l.t);

  return {
    titulo: document.title,
    altura: document.body.scrollHeight,
    tipografia: [...tipo.entries()].sort((a, b) => b[1].n - a[1].n).map(([k, v]) => ({ estilo: k, nos: v.n, amostra: v.amostra })),
    fundos: [...fundos.entries()].sort((a, b) => b[1] - a[1]),
    mecanica, imagens, videos, secoes, links,
    copy: textos.slice(0, 80),
  };
});

dados.fontesBaixadas = [...fontesBaixadas];

/* fatias pra leitura visual */
const slug = rotaArg.replace(/\//g, '_') || '_home';
const nFatias = Math.min(14, Math.ceil(dados.altura / 1000));
for (let i = 0; i < nFatias; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * 1000);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUT}/${W}${slug}-${String(i).padStart(2, '0')}.png` });
}

console.error(`✓ ${dados.altura}px, ${dados.secoes.length} seções, ${dados.mecanica.length} nós de mecânica, ${nFatias} fatias`);
writeFileSync(`${OUT}/scout-${W}${slug}.json`, JSON.stringify(dados, null, 2));
console.log(`${OUT}/scout-${W}${slug}.json`);
