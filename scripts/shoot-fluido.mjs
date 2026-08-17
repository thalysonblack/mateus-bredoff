/**
 * Congela a transição do visor fluido em 25/50/75% e fotografa cada ponto.
 *
 *   node scripts/shoot-fluido.mjs 4      # modo: 1 maré · 2 onda · 3 turbilhão · 4 arco
 *
 * ⚠ O TRINCO É OBRIGATÓRIO. Cada screenshot do puppeteer custa 200–400ms, então
 * "capture em 120ms" vira 500ms na prática e o meio de uma transição de 1s
 * nunca aparece — as primeiras tentativas fotografaram só o estado final e
 * pareceu que o efeito não estava rodando. `window.__visor.travar(p)` (exposto
 * só em DEV) segura o progresso no ponto que se quer medir.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const modo = process.argv[2] || '4';
const p=await b.newPage(); const erros=[];
p.on('console',e=>e.type()==='error'&&erros.push(e.text()));
await p.setViewport({width:1680,height:963});
await p.goto(`http://localhost:5173/v2/d${modo}`,{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1800));
const y=await p.evaluate(()=>{const r=document.querySelectorAll('.p-trama--peca')[1].getBoundingClientRect();return Math.round(r.top+r.height/2);});
const xs=await p.evaluate(()=>[...document.querySelectorAll('.p-trama--peca')[1].querySelectorAll('.p-trama-nome')]
  .map(n=>n.getBoundingClientRect()).filter(r=>r.left>60&&r.right<1620&&r.width>60).slice(0,2).map(r=>Math.round(r.left+r.width/2)));
await p.mouse.move(xs[0],y); await new Promise(r=>setTimeout(r,1400));
await p.evaluate(()=>window.__visor.travar(0));   /* segura antes de disparar */
await p.mouse.move(xs[1],y); await new Promise(r=>setTimeout(r,600));
for (const q of [0.25,0.5,0.75]) {
  await p.evaluate((v)=>window.__visor.travar(v), q);
  await new Promise(r=>setTimeout(r,120));
  const caixa=await p.evaluate(()=>{const r=document.querySelector('.p-visor').getBoundingClientRect();
    return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)};});
  await p.screenshot({path:`/tmp/m${modo}-${String(q).replace('0.','')}.png`, clip:caixa});
}
console.log(`modo ${modo} — ${await p.evaluate(()=>document.querySelector('footer span.col-start-10')?.textContent?.trim())} | erros: ${erros.length}`);
await b.close();
