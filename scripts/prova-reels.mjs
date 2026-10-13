// prova das três heroes (/v2/hero-1|2|3): rola por wheel e fotografa as fases
// uso: node scripts/prova-heroes.mjs [base] [pasta]
import { chromium } from 'playwright';
const [base = 'http://localhost:5390', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const n of ['full','centro']) for (const [w, h, tag] of [[1512, 900, 'd'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`${base}/v2/reel-${n}`); await p.waitForTimeout(3000);
  await p.mouse.move(w / 2, h / 2);
  const alvo = async (y) => {
    for (let i = 0; i < 120; i++) {
      const sy = await p.evaluate(() => scrollY);
      if (Math.abs(sy - y) < 30) break;
      await p.mouse.wheel(0, Math.max(-250, Math.min(250, y - sy))); await p.waitForTimeout(30);
    }
    await p.waitForTimeout(1300);
  };
  const fim = 2.4 * h;
  for (const f of [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1.1]) { await alvo(fim * f); await p.screenshot({ path: `${out}/r${n}-${tag}-${Math.round(f * 100)}.png` }); }
  const sx = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(n, tag, 'erros', errs.slice(0, 3), 'scroll-x', sx);
  await p.close();
}
await b.close();
