// Fotografa uma rota em fatias de viewport, rolando com wheel real (Lenis).
// uso: node scripts/shoot-page.mjs <url> <prefixo> [width] [height] [nShots]
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [url, prefix, w = '1600', h = '1000', n = '10'] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});
const page = await browser.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
page.on('requestfailed', r => errors.push('[fail] ' + r.url()));

await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 3500));

const shots = [];
for (let i = 0; i < +n; i++) {
  const p = `/tmp/${prefix}-${String(i).padStart(2, '0')}.png`;
  await page.screenshot({ path: p });
  shots.push(p);
  const before = await page.evaluate(() => window.scrollY);
  // wheel real: Lenis interpola, então vai em passos
  for (let k = 0; k < 8; k++) { await page.mouse.wheel({ deltaY: +h / 8 }); await new Promise(r => setTimeout(r, 60)); }
  await new Promise(r => setTimeout(r, 1400));
  const after = await page.evaluate(() => window.scrollY);
  if (after - before < 8) break; // chegou no fim
}

console.log(JSON.stringify({ shots, errors: [...new Set(errors)].slice(0, 10) }, null, 2));
await browser.close();
