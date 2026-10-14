import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4318';
const b = await chromium.launch();
for (const [w, h] of [[1512, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = []; p.on('pageerror', (e) => erros.push(e.message)); p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  await p.goto(base + '/v2/rolin-b', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  await p.mouse.move(w / 2, h / 2);
  const fim = await p.evaluate(() => { const hx = document.querySelector('.rb .hx-cena'); return hx.parentElement.offsetHeight - hx.offsetHeight - 10; });
  for (const f of [0, 0.33, 0.66, 1, 1.4]) {
    const alvo = fim * f;
    for (let i = 0; i < 200 && (await p.evaluate(() => scrollY)) < alvo - 4; i++) { await p.mouse.wheel(0, Math.min(60, alvo - await p.evaluate(() => scrollY))); await p.waitForTimeout(30); }
    await p.waitForTimeout(900);
    const info = await p.evaluate(() => { const q = document.querySelector('.rb .rx-quadro').getBoundingClientRect(); const v = document.querySelector('.rb-reel .rb-quadro').getBoundingClientRect(); return { y: scrollY, quadro: [q.x, q.y, q.width, q.height].map(Math.round), vaga: [v.x, v.y, v.width, v.height].map(Math.round), vagaVis: getComputedStyle(document.querySelector('.rb-reel')).visibility, sobre: document.documentElement.classList.contains('rx-sobre') }; });
    console.log(w, f, JSON.stringify(info));
    await p.screenshot({ path: `/private/tmp/claude-501/rb-${w}-${f}.png` });
  }
  console.log(w, 'erros', erros);
  await p.close();
}
await b.close();
