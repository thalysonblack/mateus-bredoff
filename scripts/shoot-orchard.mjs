import puppeteer from 'puppeteer-core';
const OUT = process.env.HOME + '/dev/_sem-git/mateus-bredoff-versao-orchard' + (process.env.SUB ? '/' + process.env.SUB : '');
const ROTA = process.env.ROTA || '/';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message));
for (const [nome, w, h, dpr] of [['desktop', 1440, 900, 1], ['mobile', 390, 844, 2]]) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
  await p.goto('http://localhost:5281' + ROTA, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.mouse.move(w / 2, h / 2);
  let i = 0, y = 0;
  while (y < total + h && i < 30) {
    await p.screenshot({ path: `${OUT}/${nome}-${String(i).padStart(2, '0')}.png` });
    for (let k = 0; k < 8; k++) { await p.mouse.wheel({ deltaY: h * 0.85 / 8 }); await new Promise(r => setTimeout(r, 60)); }
    await new Promise(r => setTimeout(r, 1200));
    const ny = await p.evaluate(() => scrollY); if (ny === y) break; y = ny; i++;
  }
  console.log(nome, 'altura', total, 'prints', i + 1, 'scrollX', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
}
console.log('erros', errs); await b.close();
