// prova do layout CARROSSEL da home: roda FORA da faixa anda a fita; hover num card acende o fundo; curvatura baixa
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL=process.argv[2]||'http://localhost:5210/?layout=carrossel';
const OUT=process.env.OUT||'/tmp';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message));
await pg.setViewport({width:1512,height:860});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.evaluateOnNewDocument(()=>{window.__sonda=true});
await pg.goto(URL,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
const centro=async()=>{const s=await pg.evaluate(()=>window.__cartoes);if(!s)return '(sem sonda)';const k=s.slots.filter(k=>k.vis).sort((a,b)=>Math.abs(a.x)-Math.abs(b.x))[0];return `proj ${k.proj} x ${Math.round(k.x)}`};
console.log('antes', await centro());
await pg.mouse.move(756,200);
for(let i=0;i<10;i++){await pg.mouse.wheel({deltaY:120}); await new Promise(r=>setTimeout(r,30));}
await new Promise(r=>setTimeout(r,120)); await pg.screenshot({path:OUT+'/carr-meio.png'});
await new Promise(r=>setTimeout(r,1800));
console.log('após roda FORA da faixa', await centro());
const box=await pg.$eval('.p-fundo-carrossel',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
await pg.mouse.move(box.x+box.w*0.2, box.y+box.h/2); await new Promise(r=>setTimeout(r,1500));
console.log('fundo aceso:', await pg.evaluate(()=>!!document.querySelector('.p-fundo--diagrama')), '| ficha:', await pg.evaluate(()=>document.querySelector('.p-diag-nome')?.textContent));
await pg.screenshot({path:OUT+'/carr-hover.png'});
await b.close();
