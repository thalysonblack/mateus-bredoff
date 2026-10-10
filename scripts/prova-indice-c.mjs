// prova da Página C inteira (o aparelho). node scripts/prova-indice-c.mjs <url> <pasta>
import { chromium } from 'playwright';
const [url = 'http://localhost:5323/v2/indice-c', out = '.'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
for (const [w, h, tag, quadros] of [[1440, 900, 'd', 18], [390, 844, 'm', 9]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: tag === 'm' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/IndiceB|IndiceA|500/.test(m.text()) && errs.push(m.text()));
  await p.addInitScript(() => { const st = document.createElement('style'); st.textContent = 'vite-error-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  await p.goto(url); await p.waitForTimeout(3200);
  await p.mouse.move(w - 4, h / 2);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const passo = 200;
  let y = 0, k = 0;
  await p.screenshot({ path: `${out}/pc-${tag}-00.png` });
  for (let q = 1; q <= quadros; q++) {
    const alvo = (total * q) / quadros;
    while (y < alvo) { await p.mouse.wheel(0, passo); y += passo; await p.waitForTimeout(90); }
    await p.waitForTimeout(1200);
    const info = await p.evaluate(() => ({ y: Math.round(scrollY), banda: document.querySelector('.cc-leitor .cc-num')?.textContent, bg: (document.querySelector('.p-tela') ? getComputedStyle(document.querySelector('.p-tela')).backgroundColor : null) }));
    await p.screenshot({ path: `${out}/pc-${tag}-${String(q).padStart(2, '0')}.png` });
    console.log(tag, q, JSON.stringify(info));
  }
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(tag, JSON.stringify(info), 'erros:', errs.length ? errs : 'nenhum');
  await p.close();
}
await b.close();
