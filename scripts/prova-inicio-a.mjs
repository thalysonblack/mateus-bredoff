// prova do Início A (o maço): frames da entrada, folhear com o cursor, scroll com mouse.wheel
import { chromium } from 'playwright';
const URL = process.argv[2] ?? 'http://localhost:5311/v2/indice-a';
const OUT = process.argv[3] ?? '.';
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: tag === 'm' });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL);
  let last = 0;
  for (const t of [300, 900, 1800, 3000]) {
    await p.waitForTimeout(t - last); last = t;
    await p.screenshot({ path: `${OUT}/ia-${tag}-in-${t}.png` });
  }
  await p.waitForTimeout(800);
  const mesa = await p.locator('.ia-mesa').boundingBox();
  if (tag === 'd') {
    for (const f of [0.15, 0.5, 0.85]) {
      await p.mouse.move(mesa.x + mesa.width * f, mesa.y + mesa.height * 0.5, { steps: 6 });
      await p.waitForTimeout(700);
      await p.screenshot({ path: `${OUT}/ia-${tag}-ler-${Math.round(f * 100)}.png` });
    }
    await p.mouse.move(10, 10);
  }
  for (let i = 1; i <= 3; i++) {
    await p.mouse.move(w / 2, h / 2);
    for (let k = 0; k < 2; k++) { await p.mouse.wheel(0, 160); await p.waitForTimeout(80); }
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/ia-${tag}-rola-${i}.png` });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'overflow-x', ov, 'erros', errs);
  await p.close();
}
await b.close();
