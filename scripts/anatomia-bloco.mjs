/**
 * Anatomia de UM BLOCO de uma página — o zoom que o `scout-ref` não dá.
 *
 * O scout mede a página inteira (tipografia por frequência, paleta, mecânica).
 * Quando o pedido é "copia o rodapé daquele site", o que falta é a ANATOMIA:
 * a árvore do bloco, com box, papel de cada nó, e os estilos que definem o
 * ritmo (corpo, entrelinha, tracking, caixa, cor, borda, gap).
 *
 * uso: node scripts/anatomia-bloco.mjs <url> <alvo> [width]
 *      alvo = seletor CSS   ("footer")
 *           | texto:PALAVRA (acha o ancestral-bloco que contém a palavra)
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [urlArg, alvo, wArg = '1600'] = process.argv.slice(2);
if (!urlArg || !alvo) {
  console.error('uso: node scripts/anatomia-bloco.mjs <url> <seletor|texto:PALAVRA> [width]');
  process.exit(1);
}
const url = new URL(urlArg.startsWith('http') ? urlArg : `https://${urlArg}`);
const OUT = `/tmp/anatomia-${url.hostname.replace(/[^a-z0-9]/gi, '-')}`;
mkdirSync(OUT, { recursive: true });
const nome = alvo.replace(/[^a-z0-9]/gi, '-').toLowerCase();

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: +wArg, height: 1000, deviceScaleFactor: 2 });
await page.goto(url.href, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
/* ⚠ rolar com WHEEL, não `window.scrollTo`: site com scroll virtual (Lenis,
   transform) ignora o segundo e o levantamento sai como se a página fosse uma
   tela só. O cursor precisa estar sobre o conteúdo. */
await page.mouse.move(+wArg / 2, 500);
for (let i = 0; i < 24; i++) {
  await page.mouse.wheel({ deltaY: 900 });
  await new Promise((r) => setTimeout(r, 450));
}
await new Promise((r) => setTimeout(r, 1200));

const dados = await page.evaluate((alvo) => {
  let raiz = null;
  if (alvo.startsWith('texto:')) {
    const palavra = alvo.slice(6).toLowerCase();
    /* o menor bloco alto que contém a palavra e tem estrutura própria */
    const cands = [...document.querySelectorAll('section, footer, div')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 200 && (el.innerText || '').toLowerCase().includes(palavra);
    });
    raiz = cands.sort((a, b) =>
      a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0] || null;
  } else {
    raiz = document.querySelector(alvo);
  }
  if (!raiz) return { erro: 'alvo não encontrado' };

  const rr = raiz.getBoundingClientRect();
  const base = { x: rr.left + window.scrollX, y: rr.top + window.scrollY };

  const no = (el, prof) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const proprio = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    return {
      prof,
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString() || '').slice(0, 70) || undefined,
      texto: proprio.slice(0, 90) || undefined,
      box: `${Math.round(r.width)}x${Math.round(r.height)} @ ${Math.round(r.left + window.scrollX - base.x)},${Math.round(r.top + window.scrollY - base.y)}`,
      tipo: proprio
        ? `${s.fontFamily.split(',')[0].replace(/["']/g, '')} ${s.fontWeight} ${s.fontSize}/${s.lineHeight} ls:${s.letterSpacing} ${s.textTransform}`
        : undefined,
      cor: proprio ? s.color : undefined,
      bg: s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : undefined,
      display: /flex|grid/.test(s.display)
        ? `${s.display} ${s.flexDirection || ''} gap:${s.gap} cols:${s.gridTemplateColumns?.slice(0, 60) || '-'} align:${s.alignItems} just:${s.justifyContent}`
        : undefined,
      pad: s.padding !== '0px' ? s.padding : undefined,
      borda: s.borderTopWidth !== '0px' || s.borderBottomWidth !== '0px' || s.borderLeftWidth !== '0px'
        ? `${s.borderTopWidth}/${s.borderRightWidth}/${s.borderBottomWidth}/${s.borderLeftWidth} ${s.borderTopColor}`
        : undefined,
      href: el.getAttribute?.('href') || undefined,
      img: el.tagName === 'IMG' ? (el.currentSrc || el.src).slice(0, 110) : undefined,
      svg: el.tagName === 'SVG' || el.tagName === 'svg' ? 'svg' : undefined,
      opacity: s.opacity !== '1' ? s.opacity : undefined,
    };
  };

  const arvore = [];
  (function anda(el, prof) {
    if (prof > 9) return;
    arvore.push(no(el, prof));
    for (const c of el.children) anda(c, prof + 1);
  })(raiz, 0);

  return {
    alvo,
    box: `${Math.round(rr.width)}x${Math.round(rr.height)}`,
    topoNaPagina: Math.round(rr.top + window.scrollY),
    alturaPagina: document.body.scrollHeight,
    texto: (raiz.innerText || '').trim().slice(0, 1200),
    nos: arvore.filter((n) => n.texto || n.display || n.borda || n.img || n.bg || n.svg),
    total: arvore.length,
  };
}, alvo);

if (dados.erro) { console.error(dados.erro); await browser.close(); process.exit(2); }

/* recorte do bloco */
const el = await page.evaluateHandle((alvo) => {
  if (alvo.startsWith('texto:')) {
    const palavra = alvo.slice(6).toLowerCase();
    return [...document.querySelectorAll('section, footer, div')]
      .filter((el) => el.getBoundingClientRect().height > 200 && (el.innerText || '').toLowerCase().includes(palavra))
      .sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
  }
  return document.querySelector(alvo);
}, alvo);
await el.asElement()?.scrollIntoView();
await new Promise((r) => setTimeout(r, 900));
await el.asElement()?.screenshot({ path: `${OUT}/${nome}.png` });

writeFileSync(`${OUT}/${nome}.json`, JSON.stringify(dados, null, 2));
console.error(`✓ ${dados.box} — ${dados.nos.length}/${dados.total} nós`);
console.log(`${OUT}/${nome}.png\n${OUT}/${nome}.json`);
await browser.close();
