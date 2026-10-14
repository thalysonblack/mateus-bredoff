import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4318';
const out = '/private/tmp/claude-501/rolin';
const b = await chromium.launch();
for (const [w, h] of [[1512, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  await p.goto(base + '/v2/rolin', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.mouse.move(w * 0.75, h / 2);
  for (let i = 0; i < 14; i++) {
    await p.screenshot({ path: `${out}/b-${w}-${String(i).padStart(2, '0')}.png` });
    await p.mouse.wheel(0, h * 0.85);
    await p.waitForTimeout(1100);
  }
  const ox = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(w, 'erros', erros.length, erros.slice(0, 3), 'overflowX', ox);
  await p.close();
}
await b.close();
