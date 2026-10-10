// prova do Início B (/v2/indice-b): entrada, cursor varrendo os 4 lockups, hover na lista, scroll
import { chromium } from 'playwright';
const [url = 'http://localhost:5312/v2/indice-b', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: tag === 'm' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/vite|500/.test(m.text()) && errs.push(m.text()));
  /* o overlay de erro do Vite (arquivo em obra de outro agente) cobriria a página */
  await p.goto(url); await p.addStyleTag({ content: 'vite-error-overlay{display:none!important}' }); let last = 0;
  for (const t of [300, 900, 1800, 3000]) { await p.waitForTimeout(t - last); last = t; await p.screenshot({ path: `${out}/ib-${tag}-in-${t}.png` }); }
  const box = await p.locator('.it-caixa').boundingBox();
  if (tag === 'd') {
    for (const k of [0, 1, 2, 3]) { await p.mouse.move(box.x + box.width * (k + 0.5) / 4, box.y + box.height / 2, { steps: 6 }); await p.waitForTimeout(1300); await p.screenshot({ path: `${out}/ib-d-lock${k + 1}.png` }); }
    await p.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 4 }); await p.waitForTimeout(450); await p.screenshot({ path: `${out}/ib-d-meio.png` });
    const li = await p.locator('.ix-lista > li').nth(2).boundingBox();
    await p.mouse.move(li.x + 500, li.y + li.height / 2, { steps: 6 }); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/ib-d-lista.png` });
  } else {
    for (const k of [1, 2, 3]) { await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(1300); await p.screenshot({ path: `${out}/ib-m-lock${k + 1}.png` }); }
  }
  for (let s = 0; s < 3; s++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(500); }
  await p.screenshot({ path: `${out}/ib-${tag}-rola.png` });
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'erros', errs, 'scroll-x', sx);
  await p.close();
}
await b.close();
