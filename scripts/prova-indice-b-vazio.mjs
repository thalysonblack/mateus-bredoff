// prova B: maior vão vertical sem conteúdo por frame de scroll (critério: <40% depois da abertura); prints pb4-*
// uso: node scripts/prova-indice-b-vazio.mjs <url> <pasta>
// mede o maior vão vertical sem conteúdo visível (texto/imagem com opacidade) em cada frame do scroll
import { chromium } from 'playwright';
const [url, out] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h, tag] of [[1512, 860, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(2800); await p.mouse.move(w - 4, h - 4);
  const vazio = () => p.evaluate(() => {
    const H = innerHeight, topo = document.querySelector('.p-menu').getBoundingClientRect().bottom + 14;
    const ok = (el) => { let e = el; while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < 0.05 || cs.display === 'none') return false; e = e.parentElement; } return true; };
    const iv = [];
    for (const el of document.querySelectorAll('main *')) {
      const folha = ['IMG','VIDEO'].includes(el.tagName) || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!folha) continue;
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom < topo || r.top > H) continue;
      const cp = getComputedStyle(el.closest('.it-janela') || el).clipPath; const ins = /inset\(([\d.]+)%/.exec(cp || ''); if (ins && +ins[1] > 30) continue;
      if (!ok(el)) continue;
      iv.push([Math.max(topo, r.top), Math.min(H, r.bottom)]);
    }
    iv.sort((a, b) => a[0] - b[0]);
    let cur = topo, gap = 0;
    for (const [a, z] of iv) { if (a > cur) gap = Math.max(gap, a - cur); cur = Math.max(cur, z); }
    gap = Math.max(gap, H - cur);
    return { sy: Math.round(scrollY), gap: +(gap / H).toFixed(2) };
  });
  let k = 0, pior = { gap: 0 };
  for (let i = 0; i < 70; i++) {
    for (let j = 0; j < 4; j++) { await p.mouse.wheel(0, 60); await p.waitForTimeout(40); }
    await p.waitForTimeout(700);
    const r = await vazio(); if (r.gap > 0.3) { console.log(tag, JSON.stringify(r)); await p.screenshot({ path: `${out}/pb4-gap-${tag}-${r.sy}.png` }); }
    if (r.gap > pior.gap) pior = r;
    if (i % 5 === 0) await p.screenshot({ path: `${out}/pb4-${tag}-${String(k++).padStart(2, '0')}.png` });
  }
  console.log(tag, 'pior vão', JSON.stringify(pior), 'erros', errs, 'scroll-x', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await p.close();
}
await b.close();
