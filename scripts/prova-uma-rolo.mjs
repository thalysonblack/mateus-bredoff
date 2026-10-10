// Prova do "O Rolo": rola com mouse.wheel (o Lenis não move com scrollTo) e fotografa.
// uso: node scripts/prova-uma-rolo.mjs [url] [pasta]
import { chromium } from 'playwright';
const url = process.argv[2] ?? 'http://localhost:5301/v2/uma-rolo';
const out = process.argv[3] ?? '.';
const b = await chromium.launch();
for (const [tag, w, h, passos, dy] of [['d', 1440, 900, 26, 700], ['m', 390, 844, 22, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${out}/rolo-${tag}-00.png` });
  for (let i = 1; i <= passos; i++) {
    await p.mouse.move(w * 0.6, h * 0.5);
    for (let k = 0; k < dy / 100; k++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(25); }
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/rolo-${tag}-${String(i).padStart(2, '0')}.png` });
  }
  const larg = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'overflow-x', larg, 'erros', erros.length ? erros : 'nenhum');
  await p.close();
}
await b.close();
