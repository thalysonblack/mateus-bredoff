// uso: node scripts/prints-rotas.mjs <origem, ex. http://localhost:4173> <pasta de saída>
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2);
const ROTAS = ['/', '/v1', '/work', '/work/ginga', '/about', '/v2', '/v2/about', '/v2/work', '/v2/work/ginga', '/v3', '/versoes'];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox','--force-device-scale-factor=1','--font-render-hinting=none','--autoplay-policy=no-user-gesture-required'] });
const errs = [];
for (const [w,h] of [[1440,900],[390,844]]) for (const r of ROTAS) {
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.setViewport({ width: w, height: h });
  p.on('console', m => { if (m.type()==='error') errs.push(`${r}@${w}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`${r}@${w}: ${e.message}`));
  await p.goto(base + r, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: 'video{visibility:hidden!important}*{caret-color:transparent!important}' });
  await new Promise(s => setTimeout(s, 1500));
  const nome = r.replace(/\//g, '_') || '_';
  for (let i = 0; i < 3; i++) {
    if (i) { await p.mouse.move(w/2, h/2); for (let k=0;k<6;k++){ await p.mouse.wheel({ deltaY: h/6 }); await new Promise(s=>setTimeout(s,120)); } await new Promise(s => setTimeout(s, 2000)); }
    await p.screenshot({ path: `${out}/${w}${nome}-${i}.png` });
  }
  await p.close();
}
console.log(JSON.stringify(errs, null, 1));
await b.close();
