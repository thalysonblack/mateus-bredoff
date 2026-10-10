// prova do Início C rodada 2 (o scroll opera o aparelho e a régua continua na lista). node scripts/prova-inicio-c.mjs <url> <pasta>
import { chromium } from 'playwright';
const [url = 'http://localhost:5313/v2/indice-c', out = '.'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: tag === 'm' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(3200);
  await p.screenshot({ path: `${out}/ic2-${tag}-00-entrada.png` });
  const passo = tag === 'd' ? 270 : 180; /* ~0,3 tela por passo */
  const ler = () => p.evaluate(() => ({ y: Math.round(scrollY), canal: document.querySelector('.ic-num')?.textContent, bg: getComputedStyle(document.querySelector('.p-tela')).backgroundColor }));
  for (let k = 1; k <= 22; k++) {
    await p.mouse.move(w / 2, h / 2);
    await p.mouse.wheel(0, passo); await p.waitForTimeout(tag === 'd' ? 420 : 380);
    if (k % 2 === 0) { await p.waitForTimeout(700); await p.screenshot({ path: `${out}/ic2-${tag}-${String(k).padStart(2, '0')}.png` }); console.log(tag, k, JSON.stringify(await ler())); }
  }
  if (tag === 'd') {
    const li = p.locator('.ix-lista > li').nth(2);
    await li.scrollIntoViewIfNeeded().catch(() => {});
    const bx = await li.boundingBox();
    if (bx) {
      await p.mouse.move(bx.x + bx.width * 0.5, bx.y + bx.height / 2, { steps: 6 }); await p.waitForTimeout(1500);
      await p.screenshot({ path: `${out}/ic2-d-hover-03.png` });
      const b5 = await p.locator('.ix-lista > li').nth(5).boundingBox();
      await p.mouse.move(b5.x + b5.width * 0.5, b5.y + b5.height / 2, { steps: 6 }); await p.waitForTimeout(1500);
      await p.screenshot({ path: `${out}/ic2-d-hover-06.png` });
      console.log('agulha', JSON.stringify(await p.evaluate(() => { const a = document.querySelector('.ic-agulha--lista'); const r = a.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), h: Math.round(r.height), op: getComputedStyle(a).opacity }; })));
    }
  }
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(tag, JSON.stringify(info), 'erros:', errs.length ? errs : 'nenhum');
  await p.close();
}
await b.close();
