// prova da página A inteira: rola a página toda com a roda (o Lenis não anda com scrollTo)
import { chromium } from 'playwright';
const URL = process.argv[2] ?? 'http://localhost:5321/v2/indice-a';
const OUT = process.argv[3] ?? '.';
const b = await chromium.launch();
for (const [w, h, tag, quadros] of [[1440, 900, 'd', 14], [390, 844, 'm', 9]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: tag === 'm' });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL);
  // outro fork pode estar no meio de um arquivo: o overlay de erro do Vite não é desta página
  await p.addStyleTag({ content: 'vite-error-overlay{display:none!important}' }).catch(() => {});
  await p.waitForTimeout(3800);
  await p.mouse.move(w * 0.9, h * 0.5);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const passo = total / (quadros - 1);
  for (let k = 0; k < quadros; k++) {
    if (k) { let feito = 0; while (feito < passo) { await p.mouse.wheel(0, 150); feito += 150; await p.waitForTimeout(40); } }
    await p.waitForTimeout(1100);
    const y = await p.evaluate(() => Math.round(scrollY));
    await p.screenshot({ path: `${OUT}/pa-${tag}-${String(k).padStart(2, '0')}.png` });
    console.log(tag, k, 'y', y);
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(tag, 'total', total, 'overflow-x', ov, 'erros', errs);
  await p.close();
}
await b.close();
