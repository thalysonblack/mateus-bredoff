// Prova da one page "O ÍNDICE": prints em desktop e mobile, hover numa linha,
// rolagem real (mouse.wheel — o Lenis não anda com scrollTo). Uso:
//   node scripts/prova-uma-indice.mjs [baseURL] [pasta-dos-prints]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:5302";
const out = process.argv[3] ?? ".";
const b = await chromium.launch();
const erros = [];
for (const [nome, vp] of [["d", { width: 1440, height: 900 }], ["m", { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, hasTouch: nome === "m" });
  p.on("pageerror", (e) => erros.push(`${nome}: ${e.message}`));
  await p.goto(`${base}/v2/uma-indice`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/indice-${nome}-1.png` });
  const passo = vp.height * 0.85;
  if (nome === "d") {
    await p.mouse.wheel(0, 520);
    await p.waitForTimeout(900);
    const linha = p.locator(".ix-linha").nth(2);
    const bb = await linha.boundingBox();
    await p.mouse.move(bb.x + bb.width * 0.4, bb.y + bb.height / 2);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/indice-d-hover.png` });
    await p.mouse.move(5, 5);
  }
  for (let i = 2; i <= 7; i++) {
    await p.mouse.wheel(0, passo);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/indice-${nome}-${i}.png` });
  }
  const larg = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${nome}: overflow horizontal = ${larg}px`);
  await p.close();
}
console.log("erros:", erros.length ? erros : "nenhum");
await b.close();
