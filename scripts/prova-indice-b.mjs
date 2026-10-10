// prova da PÁGINA B inteira (/v2/indice-b): frames ao longo do scroll real (mouse.wheel; o Lenis ignora scrollTo)
// uso: node scripts/prova-indice-b.mjs [url] [pasta]
import { chromium } from 'playwright';
const [url = 'http://localhost:5322/v2/indice-b', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, tag, n] of [[1440, 900, 'd', 14], [390, 844, 'm', 10]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(2800);
  await p.mouse.move(w - 4, 4);
  const alvo = async (y) => {
    for (let i = 0; i < 160; i++) {
      const sy = await p.evaluate(() => scrollY);
      if (Math.abs(sy - y) < 30) break;
      await p.mouse.wheel(0, Math.max(-300, Math.min(300, y - sy))); await p.waitForTimeout(30);
    }
    await p.waitForTimeout(1100);
  };
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let k = 0; k < n; k++) { await alvo(total * k / (n - 1)); await p.screenshot({ path: `${out}/pb-${tag}-${String(k).padStart(2, '0')}.png` }); }
  /* o reel no meio do pin (desktop) */
  if (tag === 'd') {
    /* varre a região do reel e guarda o maior retângulo (o ápice da expansão) */
    const y0 = await p.evaluate(() => { const v = document.querySelector('.ib-mov'); return scrollY + v.getBoundingClientRect().top - innerHeight; });
    let melhor = null;
    for (let y = y0; y < y0 + h * 4; y += h * 0.15) {
      await alvo(y);
      const r = await p.evaluate(() => { const b = document.querySelector('.ib-reel').getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map(Math.round); });
      if (!melhor || r[2] * r[3] > melhor.r[2] * melhor.r[3]) { melhor = { r, y }; await p.screenshot({ path: `${out}/pb-d-reel.png` }); }
    }
    console.log('reel no ápice', melhor);
    /* hover na lista: a lente WebGL */
    await alvo(3.4 * h + h * 0.4);
    const li = await p.locator('.ib-lista > li').nth(2).boundingBox();
    await p.mouse.move(li.x + li.width * 0.3, li.y + li.height / 2, { steps: 6 }); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${out}/pb-d-hover.png` });
  }
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'erros', errs, 'scroll-x', sx, 'total', total);
  await p.close();
}
await b.close();
