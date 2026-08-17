/**
 * Prova que a hero da /v2/about-c é dirigida pelo SCROLL.
 *
 * Mede, em cada parada: o topo da hero (deve FICAR em 0 enquanto o conteúdo
 * sobe), a escala da foto e o deslocamento dos dois blocos de nome — que têm de
 * ir para lados OPOSTOS.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false,args:['--no-sandbox']});
const p=await b.newPage(); const err=[];
p.on('pageerror',e=>err.push(e.message.split('\n')[0]));
await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/v2/about-c',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));
const ler=()=>p.evaluate(()=>{
  const m=s=>{const e=document.querySelector(s); if(!e) return null;
    const t=new WebKitCSSMatrix(getComputedStyle(e).transform);
    return {x:Math.round(t.m41), esc:+t.a.toFixed(3)};};
  return {y:Math.round(scrollY),
    heroTop:Math.round(document.querySelector('.p-hero').getBoundingClientRect().top),
    foto:m('.p-hero-foto img'), esq:m('.p-hero-marca--esq'), dir:m('.p-hero-marca--dir')};
});
console.log('suporte a scroll-driven:', await p.evaluate(()=>CSS.supports('animation-timeline: view()')));
for (const y of [0, 260, 520, 780, 1040]) {
  await p.evaluate(v=>scrollTo(0,v), y);
  await new Promise(r=>setTimeout(r,420));
  const e=await ler();
  console.log(`  scrollY ${String(e.y).padStart(4)} · hero top ${String(e.heroTop).padStart(4)} · foto ${e.foto.esc} · esq ${String(e.esq.x).padStart(5)} · dir ${String(e.dir.x).padStart(4)}`);
}
await p.evaluate(()=>scrollTo(0,600)); await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:'/tmp/hs.png'});
console.log('erros:', err.length?err.slice(0,2):'nenhum');
await b.close();
