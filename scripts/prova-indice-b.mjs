// prova da PÁGINA B (/v2/indice-b), rodada 4: o nome se abre, os projetos passam no vão,
// o nome atraca no menu. Frames ao longo do pin (mouse.wheel; o Lenis ignora scrollTo).
// uso: node scripts/prova-indice-b.mjs [url] [pasta]
import { chromium } from 'playwright';
const [url = 'http://localhost:5322/v2/indice-b', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, tag] of [[1512, 860, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(2800);
  await p.mouse.move(w - 4, h - 4);
  const alvo = async (y) => {
    for (let i = 0; i < 200; i++) {
      const sy = await p.evaluate(() => scrollY);
      if (Math.abs(sy - y) < 20) break;
      await p.mouse.wheel(0, Math.max(-250, Math.min(250, y - sy))); await p.waitForTimeout(30);
    }
    await p.waitForTimeout(1000);
  };
  const shot = (n) => p.screenshot({ path: `${out}/pb3-${tag}-${n}.png` });
  const pin = (tag === 'd' ? 5.2 : 4.2) * h;
  const passos = [0, 0.08, 0.2, 0.32, 0.45, 0.6, 0.75, 0.86, 0.93, 1];
  for (const [k, f] of passos.entries()) {
    await alvo(pin * f); await shot(String(k).padStart(2, '0'));
    if (f === 0.93 || f === 1) {
      const r = await p.evaluate(() => {
        const m = document.querySelector('.it-palavra').getBoundingClientRect();
        const t = document.querySelector('.p-menu a.p-menu-campo > span:first-child');
        const tr = t.getBoundingClientRect();
        return { heroMateus: [m.left, m.top, m.width].map(Math.round), menu: [tr.left, tr.top, tr.width].map(Math.round), menuOp: getComputedStyle(t).opacity };
      });
      console.log(tag, 'doca', f, JSON.stringify(r));
    }
  }
  await alvo(pin + h * 0.6); await shot('lista');
  const cap = await p.evaluate(() => scrollY + document.querySelectorAll('.ib-cap')[0].getBoundingClientRect().top);
  await alvo(cap - 40); await shot('capitulo');
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'erros', errs, 'scroll-x', sx);
  await p.close();
}
await b.close();
