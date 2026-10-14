import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4318';
const b = await chromium.launch();
for (const [w, h, tag] of [[1512, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = []; p.on('pageerror', e => erros.push(e.message)); p.on('console', m => m.type() === 'error' && erros.push(m.text()));
  await p.goto(base + '/v2/nova', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.mouse.move(w / 2, h / 2);
  let i = 0; await p.screenshot({ path: `/private/tmp/claude-501/nv-${tag}-${i++}.png` });
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += h * 1.1) {
    await p.mouse.wheel(0, h * 1.1); await p.waitForTimeout(900);
    await p.screenshot({ path: `/private/tmp/claude-501/nv-${tag}-${i++}.png` });
    if (i > 22) break;
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(tag, 'shots', i, 'overflowX', ov, 'erros', erros.slice(0, 3));
  await p.close();
}
await b.close();
