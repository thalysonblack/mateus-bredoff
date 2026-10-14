import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4317';
const out = process.argv[3] || '/tmp';
const b = await chromium.launch();
for (const [w, h] of [[1512, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = []; p.on('pageerror', e => erros.push(e.message)); p.on('console', m => m.type() === 'error' && erros.push(m.text()));
  await p.goto(base + '/v2/rolin-b', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.mouse.move(w / 2, h / 2);
  for (let i = 0; i < 9; i++) {
    await p.screenshot({ path: `${out}/rb-${w}-${i}.png` });
    await p.mouse.wheel(0, h * 1.1); await p.waitForTimeout(900);
  }
  if (w > 900) {
    await p.goto(base + '/v2/rolin-b', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, h); await p.waitForTimeout(700); }
    const r = await p.evaluate(() => { const q = [...document.querySelectorAll('.rb-quadro')].map(e => e.getBoundingClientRect()).find(b => b.top > 80 && b.bottom < innerHeight); return { x: q.x, y: q.y, width: q.width, height: q.height }; });
    await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 5 }); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${out}/rb-${w}-hover.png` });
    console.log('ativo', await p.evaluate(() => document.querySelector('.rb-indice li.is-on .rb-nome')?.textContent), 'lente', await p.evaluate(() => JSON.stringify(document.querySelector('.rb-lente').getBoundingClientRect())));
  }
  const hx = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(w, 'erros', erros, 'scrollX', hx);
  await p.close();
}
await b.close();
