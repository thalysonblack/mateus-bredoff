/**
 * Prova a CORTINA DE GRADE: seis faixas entrando de lados ALTERNADOS.
 *
 * Mede o deslocamento de cada faixa em vários instantes. O que tem de aparecer:
 *   · no repouso, faixas fora da tela em lados opostos (par −, ímpar +);
 *   · no quadro fechado, todas em 0;
 *   · na saída, cada uma no lado OPOSTO ao que entrou.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false,args:['--no-sandbox']});
const p=await b.newPage(); const err=[];
p.on('pageerror',e=>err.push(e.message.split('\n')[0]));
await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));
const ler=()=>p.evaluate(()=>[...document.querySelectorAll('[data-faixa]')]
  .map(f=>Math.round(new WebKitCSSMatrix(getComputedStyle(f).transform).m41)));
console.log('faixas:', await p.evaluate(()=>document.querySelectorAll('[data-faixa]').length));
await p.evaluate(()=>[...document.querySelectorAll('a')].find(a=>a.getAttribute('href')==='/work').click());
for (const [rot,ms] of [['entrando',260],['fechado',420],['saindo',520],['depois',900]]) {
  if(rot==='fechado'){ await new Promise(r=>setTimeout(r,ms)); await p.screenshot({path:'/tmp/cort-fechado.png'}); console.log(rot.padEnd(9), JSON.stringify(await ler())); continue; }
  await new Promise(r=>setTimeout(r,ms));
  console.log(rot.padEnd(9), JSON.stringify(await ler()));
}
console.log('url:', p.url(), '| erros:', err.length?err.slice(0,2):'nenhum');
await p.screenshot({path:'/tmp/cort.png'});
await b.close();
