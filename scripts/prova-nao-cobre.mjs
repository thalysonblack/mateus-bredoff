/**
 * Prova que NENHUM overlay está cobrindo a página — em todas as rotas.
 *
 * ⚠ Este projeto cobriu a própria página QUATRO vezes, sempre por um motivo
 * diferente (folha sem repouso, classe de tema com background, hero sticky sem
 * fundo no conteúdo, faixas da cortina sem repouso) — e NENHUMA medição de DOM,
 * contraste ou console acusou: nada estava quebrado, estava coberto.
 *
 * O teste é o único que pega: pergunta ao navegador QUEM está no centro da tela
 * e em quatro pontos ao redor. Se a resposta for um elemento da transição (ou
 * qualquer coisa `fixed` de z-index alto), a página está tapada.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false,args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1680,height:963});
let falhas=0;
for (const rota of ['/','/work','/about','/lab','/work/ginga','/v2/about-b','/v2/about-c']) {
  await p.goto('http://localhost:5173'+rota,{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,1200));
  const r = await p.evaluate(()=>{
    const pts=[[0.5,0.5],[0.25,0.35],[0.75,0.35],[0.25,0.75],[0.75,0.75]];
    const nos=pts.map(([x,y])=>{
      const el=document.elementFromPoint(Math.round(innerWidth*x), Math.round(innerHeight*y));
      if(!el) return 'VAZIO';
      /* ⚠ só OVERLAY DE TRANSIÇÃO conta como cobertura. `.p-folha-sec` é
         CONTEÚDO (as seções sobrepostas da about vivem assim) e dava falso
         positivo — um teste que grita onde está certo é pior que teste nenhum,
         porque ensina a ignorá-lo. */
      const cobre=el.closest('.v3-obturador, .p-cortina');
      return cobre ? 'COBERTO:'+(cobre.className||'').toString().split(' ')[0] : (el.tagName+'.'+((el.className||'').toString().split(' ')[0]||''));
    });
    return {nos, texto:document.body.innerText.trim().length};
  });
  const tapado = r.nos.some(n=>n.startsWith('COBERTO')||n==='VAZIO');
  if (tapado) falhas++;
  console.log(`${rota.padEnd(14)} ${tapado?'✗ TAPADO':'✓ livre  '} · texto ${String(r.texto).padStart(5)} · ${r.nos.slice(0,3).join(' | ')}`);
}
console.log(falhas? `\n✗ ${falhas} rota(s) com a página coberta` : '\n✓ nenhuma rota coberta');
await b.close();
