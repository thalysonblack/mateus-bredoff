// prova do Início B rodada 2 (/v2/indice-b): o SCROLL passa pelos lockups e assenta no índice
// uso: node scripts/prova-inicio-b.mjs [url] [pasta]
import { chromium } from 'playwright';
const [url = 'http://localhost:5312/v2/indice-b', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, tag, fator] of [[1440, 900, 'd', 3.4], [390, 844, 'm', 2.2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(2600);
  await p.mouse.move(w - 4, 4); /* longe da lista: o hover desloca o título */
  const pin = fator * h;
  const alvo = async (y) => {
    for (let i = 0; i < 80; i++) {
      const sy = await p.evaluate(() => scrollY);
      if (Math.abs(sy - y) < 30) break;
      await p.mouse.wheel(0, Math.max(-200, Math.min(200, y - sy))); await p.waitForTimeout(40);
    }
    await p.waitForTimeout(1200);
  };
  for (const f of [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]) { await alvo(pin * f); await p.screenshot({ path: `${out}/ib2-${tag}-${Math.round(f * 100)}.png` }); }
  await alvo(pin + h * 0.6); await p.screenshot({ path: `${out}/ib2-${tag}-depois.png` });
  /* a linha zero cai na coluna e no corpo do nome de projeto? */
  await alvo(pin - 40); /* dentro do pin, já no lockup Index */
  const m = await p.evaluate(() => {
    const n = document.querySelector('.it-mascara').getBoundingClientRect();
    const t = document.querySelector('.ix-lista .ix-titulo').getBoundingClientRect();
    return { nomeX: Math.round(n.left), tituloX: Math.round(t.left), nomeH: Math.round(n.height) };
  });
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'erros', errs, 'scroll-x', sx, m);
  await p.close();
}
await b.close();
