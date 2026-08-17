import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:false, args:['--no-sandbox','--window-size=1680,1000']});   // GPU REAL, janela de verdade
const p=await b.newPage(); const log=[];
p.on('pageerror',e=>log.push('PAGE: '+e.message.split('\n')[0]));
p.on('console',e=>['error','warning'].includes(e.type())&&log.push(e.type()+': '+e.text().split('\n')[0].slice(0,200)));
await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/work',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,2500));
const e = await p.evaluate(()=> window.__arquivo ? window.__arquivo.estado() : 'sem __arquivo');
console.log('estado:', JSON.stringify(e));
await new Promise(r=>setTimeout(r,1200));
const e2 = await p.evaluate(()=> window.__arquivo ? window.__arquivo.estado().passos : -1);
console.log('passos depois de +1,2s:', e2);
console.log('log:', log.length?[...new Set(log)].slice(0,6):'nenhum');
await b.close();
