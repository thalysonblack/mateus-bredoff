/**
 * Prova que a trama NÃO ACABA por mais que se role.
 *
 *   node scripts/prova-trama-infinita.mjs
 *
 * O empurrão do scroll é somado por cima do loop próprio da fita. Sem dobrá-lo
 * pelo comprimento de um ciclo, rolar o bastante tira o wrapper do range do
 * conteúdo e aparece tela vazia depois do último nome — foi o que ele viu.
 *
 * O teste rola muito (120 gestos, nos dois sentidos) e, a cada parada, conta
 * quantos nomes estão de fato DENTRO da viewport em cada linha. Se alguma linha
 * zerar, a fita acabou.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage(); const erros=[];
p.on('pageerror',e=>erros.push(e.message.split('\n')[0]));
await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));

const conta = () => p.evaluate(()=>[...document.querySelectorAll('.p-trama--peca')].map(linha=>{
  const r0 = linha.getBoundingClientRect();
  return [...linha.querySelectorAll('.p-trama-nome')].filter(n=>{
    const r = n.getBoundingClientRect();
    return r.right > 0 && r.left < innerWidth && r.bottom > r0.top - 1 && r.top < r0.bottom + 1;
  }).length;
}));

let pior = 99, zeros = 0;
for (let volta = 0; volta < 6; volta++) {
  const sentido = volta % 2 === 0 ? 1 : -1;
  for (let i = 0; i < 20; i++) { await p.mouse.wheel({deltaY: 420 * sentido}); await new Promise(r=>setTimeout(r,26)); }
  await new Promise(r=>setTimeout(r,420));
  const c = await conta();
  const min = Math.min(...c);
  if (min === 0) zeros++;
  if (min < pior) pior = min;
  console.log(`  após ${(volta+1)*20} gestos (${sentido>0?'↓':'↑'}): nomes visíveis por linha ${c.join(' / ')}`);
}
console.log(`\nmenor contagem em qualquer linha: ${pior} · linhas vazias em ${zeros} paradas`);
console.log(pior > 0 ? '✓ a trama não acaba: toda linha sempre tem nome na tela' : '✗ a fita acabou — apareceu linha vazia');
console.log('erros:', erros.length ? erros.slice(0,3) : 'nenhum');
await p.screenshot({path:'/tmp/infinita.png'});
await b.close();
