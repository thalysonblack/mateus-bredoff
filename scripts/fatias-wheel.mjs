/**
 * Fatias de uma página que rola com SCROLL VIRTUAL (Lenis, transform, fixed).
 *
 * ⚠ `window.scrollTo` não move esse tipo de página — o `scout-ref` rola assim e
 * volta com `document.body.scrollHeight === innerHeight`, como se o site fosse
 * uma tela só. Aqui a rolagem é `page.mouse.wheel`, o mesmo gesto do usuário.
 *
 * Colhe, por fatia: screenshot + innerText do que está em viewport. Para quando
 * o texto para de mudar duas vezes seguidas (fim da página) ou no teto.
 *
 * uso: node scripts/fatias-wheel.mjs <url> [width] [maxFatias]
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [urlArg, wArg = '1600', maxArg = '18'] = process.argv.slice(2);
if (!urlArg) { console.error('uso: node scripts/fatias-wheel.mjs <url> [width] [max]'); process.exit(1); }
const url = new URL(urlArg.startsWith('http') ? urlArg : `https://${urlArg}`);
const OUT = `/tmp/fatias-${url.hostname.replace(/[^a-z0-9]/gi, '-')}${url.pathname.replace(/\//g, '_')}`;
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: +wArg, height: 1000, deviceScaleFactor: 1 });
await page.goto(url.href, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));
/* ⚠ o wheel sai do PONTO onde o cursor está: em (0,0) muitos sites com scroll
   virtual ignoram o evento. Centralize antes de rolar. */
await page.mouse.move(+wArg / 2, 500);

const passos = [];
let iguais = 0, anterior = '';
for (let i = 0; i < +maxArg; i++) {
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` });
  const texto = await page.evaluate(() => {
    const dentro = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,a,span,button')) {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0 || r.width < 4) continue;
      const proprio = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!proprio) continue;
      const s = getComputedStyle(el);
      if (s.opacity === '0' || s.visibility === 'hidden') continue;
      dentro.push(`${Math.round(r.top)},${Math.round(r.left)} [${s.fontSize}/${s.fontWeight} ${s.fontFamily.split(',')[0].replace(/["']/g, '')}${s.textTransform !== 'none' ? ' ' + s.textTransform : ''}] ${proprio.slice(0, 110)}`);
    }
    return dentro.join('\n');
  });
  passos.push({ fatia: i, texto });
  if (texto === anterior) { if (++iguais >= 2) break; } else iguais = 0;
  anterior = texto;
  await page.mouse.wheel({ deltaY: 900 });
  await new Promise((r) => setTimeout(r, 900));
}

writeFileSync(`${OUT}/fatias.txt`, passos.map((p) => `═══ fatia ${p.fatia} ═══\n${p.texto}`).join('\n\n'));
console.error(`✓ ${passos.length} fatias em ${OUT}`);
console.log(OUT);
await browser.close();
