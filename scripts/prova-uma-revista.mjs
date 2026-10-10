// prova da one page "A Revista" (/v2/uma-revista): rola com a roda real (o Lenis
// não anda com scrollTo) e fotografa desktop e mobile. Uso: node scripts/prova-uma-revista.mjs [base] [pasta]
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:5303';
const out = process.argv[3] ?? '.';
const b = await chromium.launch();
for (const [nome, w, h, passos] of [['d', 1440, 900, 9], ['m', 390, 844, 12]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(base + '/v2/uma-revista', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  const larg = await p.evaluate(() => document.documentElement.scrollWidth);
  for (let i = 0; i < passos; i++) {
    await p.screenshot({ path: `${out}/revista-${nome}-${String(i).padStart(2, '0')}.png` });
    await p.mouse.move(w / 2, h / 2);
    await p.mouse.wheel(0, Math.round(total / passos));
    await p.waitForTimeout(1300);
  }
  console.log(nome, { altura: total, larguraDoc: larg, viewport: w, erros });
  await p.close();
}
await b.close();
