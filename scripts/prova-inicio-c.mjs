// prova do Início C (O dispositivo): entrada, sintonia por clique/arrasto/roda/teclas, scroll. node scripts/prova-inicio-c.mjs <url> <pasta>
import { chromium } from 'playwright';
const [url = 'http://localhost:5313/v2/indice-c', out = '.'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: tag === 'm' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); let t0 = 0;
  for (const t of [500, 1400, 2400, 4200]) { await p.waitForTimeout(t - t0); t0 = t; await p.screenshot({ path: `${out}/ic-${tag}-entrada-${t}.png` }); }
  const r = await p.locator('.ic-regua').boundingBox();
  const sx = (i) => r.x + (r.width * i) / 7;
  if (tag === 'd') {
    // arrasto do 01 ao 04
    await p.mouse.move(sx(0), r.y + 60); await p.mouse.down(); await p.mouse.move(sx(3), r.y + 60, { steps: 12 }); await p.mouse.up();
    await p.waitForTimeout(500); await p.screenshot({ path: `${out}/ic-d-arrasto-meio.png` });
    await p.waitForTimeout(1200); await p.screenshot({ path: `${out}/ic-d-canal-04.png` });
    // roda sobre a régua → 05, 06
    await p.mouse.move(sx(3), r.y + 60);
    for (let k = 0; k < 2; k++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(250); }
    await p.waitForTimeout(1400); await p.screenshot({ path: `${out}/ic-d-roda-06.png` });
    // teclas → 07, 08
    await p.mouse.move(700, 300);
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400); await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(1400); await p.screenshot({ path: `${out}/ic-d-tecla-08.png` });
    // clique no canal 01 (Ginga, vermelho)
    await p.locator('.ic-marca').first().click(); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/ic-d-click-01.png` });
  } else {
    const v = await p.locator('.ic-visor').boundingBox();
    await p.touchscreen?.tap; // swipe via CDP touch
    const cdp = await p.context().newCDPSession(p);
    const swipe = async () => {
      const y = v.y + v.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: v.x + v.width * 0.8, y }] });
      for (let k = 1; k <= 6; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: v.x + v.width * (0.8 - k * 0.1), y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await swipe(); await p.waitForTimeout(1400); await p.screenshot({ path: `${out}/ic-m-swipe-02.png` });
    await swipe(); await p.waitForTimeout(1400); await p.screenshot({ path: `${out}/ic-m-swipe-03.png` });
  }
  // scroll com a roda fora da régua: a página tem de descer
  await p.mouse.move(w / 2, 200);
  for (let k = 0; k < 8; k++) { await p.mouse.wheel(0, 250); await p.waitForTimeout(80); }
  await p.waitForTimeout(900); await p.screenshot({ path: `${out}/ic-${tag}-scroll.png` });
  const info = await p.evaluate(() => ({ y: Math.round(scrollY), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, canal: document.querySelector('.ic-num')?.textContent }));
  console.log(tag, JSON.stringify(info), 'erros:', errs.length ? errs : 'nenhum');
  await p.close();
}
await b.close();
