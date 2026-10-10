// Prova da one page "O ÍNDICE" com o tchan (lente WebGL, entrada, coreografia
// de scroll). Rolagem real por mouse.wheel (o Lenis não anda com scrollTo).
//   node scripts/prova-uma-indice.mjs [baseURL] [pasta] [prefixo]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:5302";
const out = process.argv[3] ?? ".";
const pre = process.argv[4] ?? "tchan";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const erros = [];
const foto = (p, n) => p.screenshot({ path: `${out}/${pre}-${n}.png` });
const rola = async (p, dy, passos = 4) => { for (let i = 0; i < passos; i++) { await p.mouse.wheel(0, dy / passos); await p.waitForTimeout(120); } await p.waitForTimeout(900); };

for (const [nome, vp] of [["d", { width: 1440, height: 900 }], ["m", { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, hasTouch: nome === "m" });
  p.on("pageerror", (e) => erros.push(`${nome} pageerror: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && erros.push(`${nome} console: ${m.text()}`));
  await p.goto(`${base}/v2/uma-indice`, { waitUntil: "networkidle" });
  await p.waitForTimeout(250);
  await foto(p, `${nome}-entrada`);
  await p.waitForTimeout(1800);
  await foto(p, `${nome}-hero`);
  if (nome === "d") {
    await rola(p, 520);
    const bb = await p.locator(".ix-linha").nth(2).boundingBox();
    await p.mouse.move(bb.x + 500, bb.y + bb.height / 2);
    await foto(p, "d-hover-0");
    await p.waitForTimeout(600);
    await foto(p, "d-hover-600");
    await p.waitForTimeout(1900);
    await foto(p, "d-hover-2500");
    const bb2 = await p.locator(".ix-linha").nth(6).boundingBox();
    for (let i = 1; i <= 8; i++) { await p.mouse.move(bb.x + 500, bb.y + ((bb2.y - bb.y) * i) / 8); await p.waitForTimeout(60); }
    await p.waitForTimeout(1300);
    await foto(p, "d-hover-desce");
    await p.mouse.move(5, 5);
  }
  for (let i = 1; i <= 14; i++) {
    await rola(p, vp.height * 0.5);
    await foto(p, `${nome}-rola-${String(i).padStart(2, "0")}`);
  }
  if (nome === "d") {
    const li = p.locator(".ix-pubs > li").nth(1);
    if (await li.count()) { const bb = await li.boundingBox(); if (bb && bb.y > 0 && bb.y < vp.height) { await p.mouse.move(bb.x + 600, bb.y + bb.height / 2); await p.waitForTimeout(1400); await foto(p, "d-pub-hover"); } }
  }
  const larg = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${nome}: overflow horizontal = ${larg}px`);
  await p.close();
}
console.log("erros:", erros.length ? erros : "nenhum");
await b.close();
