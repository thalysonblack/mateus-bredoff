/**
 * Prova que o carrossel da /work rola, sincroniza e NÃO ACABA.
 *
 *   node scripts/prova-carrossel-work.mjs
 *
 * Mede três coisas a cada parada:
 *   · quantas peças estão de fato DENTRO da janela (se zerar, a coluna acabou);
 *   · qual linha da tabela está acesa (tem de acompanhar o que está enquadrado);
 *   · se a PÁGINA rolou (não pode: o gesto é da coluna).
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const p=await b.newPage(); const erros=[];
p.on('pageerror',e=>erros.push(e.message.split('\n')[0]));
await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/work',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));

const ler = () => p.evaluate(()=>{
  const j = document.querySelector('.p-carrossel').getBoundingClientRect();
  const dentro = [...document.querySelectorAll('.p-carrossel-peca')].filter(e=>{
    const r = e.getBoundingClientRect();
    return r.bottom > j.top + 4 && r.top < j.bottom - 4;
  }).length;
  const acesa = document.querySelector('.p-tabela-linha.aceso')?.textContent?.replace(/\s+/g,' ').trim().slice(0,26);
  const fig = document.querySelector('.p-carrossel > .p-marca')?.textContent?.replace(/\s+/g,' ').trim();
  return { dentro, acesa, fig, scrollY: Math.round(scrollY) };
});

console.log('inicial:', JSON.stringify(await ler()));
let pior = 99;
for (let v = 0; v < 6; v++) {
  for (let i = 0; i < 12; i++) { await p.mouse.wheel({deltaY: 360}); await new Promise(r=>setTimeout(r,26)); }
  await new Promise(r=>setTimeout(r,650));
  const e = await ler();
  if (e.dentro < pior) pior = e.dentro;
  console.log(`  após ${(v+1)*12} gestos:`, JSON.stringify(e));
}
console.log(`\nmenor nº de peças na janela: ${pior}`);
console.log(pior > 0 ? '✓ a coluna não acaba' : '✗ a coluna acabou — janela vazia');
console.log('erros:', erros.length ? erros.slice(0,3) : 'nenhum');
await p.screenshot({path:'/tmp/work.png'});
await b.close();
