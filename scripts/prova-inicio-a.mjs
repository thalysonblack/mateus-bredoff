// prova do Início A, rodada 2: o scroll dá as cartas e elas pousam nas linhas da lista
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
  await p.waitForTimeout(3600);
  await p.screenshot({ path: `${OUT}/ia2-${tag}-0.png` });
  await p.mouse.move(w / 2, h * 0.2);
  // passos de 120px; print a cada 2 passos até 1200px
  for (let k = 1; k <= 10; k++) {
    await p.mouse.wheel(0, 120);
    await p.waitForTimeout(160);
    if (k % 2 === 0) { await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/ia2-${tag}-${k * 120}.png` }); }
  }
  if (tag === 'd') {
    const li = p.locator('.ix-lista > li').nth(1);
    await li.scrollIntoViewIfNeeded();
    await p.waitForTimeout(800);
    const r = await li.boundingBox();
    await p.mouse.move(r.x + r.width * 0.5, r.y + r.height / 2, { steps: 6 });
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/ia2-${tag}-hover.png` });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'overflow-x', ov, 'erros', errs);
  await p.close();
}
await b.close();
