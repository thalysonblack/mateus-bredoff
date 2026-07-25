/**
 * Prova de motion: lê a propriedade animada em DOIS instantes e mostra que mudou.
 * "Adicionei a animação" não é prova — este arquivo é.
 */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL=process.argv[2]??'http://127.0.0.1:4599/';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--font-render-hinting=none']});
const errs=[];
const p=await b.newPage();
p.on('console',m=>{if(m.type()==='error')errs.push('[console] '+m.text())});
p.on('pageerror',e=>errs.push('[pageerror] '+e.message));
p.on('requestfailed',r=>errs.push('[404] '+r.url().split('/').pop()));
await p.setViewport({width:1600,height:1000,deviceScaleFactor:1});
await p.goto(URL,{waitUntil:'networkidle0',timeout:60000});
await new Promise(r=>setTimeout(r,4200));

// 1) LENIS é o dono do scroll?
const lenis=await p.evaluate(()=>({
  temAtributo: document.documentElement.className.includes('lenis'),
  html: document.documentElement.className,
}));
console.log('1) Lenis montado:', JSON.stringify(lenis));

// 2) SplitText realmente cortou em linhas com máscara?
const split=await p.evaluate(()=>{
  const el=document.querySelector('#about [data-reveal]');
  if(!el) return {erro:'nó [data-reveal] não existe'};
  const lines=el.querySelectorAll('.reveal-line');
  const parent=lines[0]?.parentElement;
  return {
    linhas: lines.length,
    mascaraOverflow: parent?getComputedStyle(parent).overflow:null,
    visibilidade: getComputedStyle(el).visibility,
    ariaLabel: (el.getAttribute('aria-label')||'').slice(0,40),
    linhaAriaHidden: lines[0]?.getAttribute('aria-hidden'),
  };
});
console.log('2) SplitText/máscara:', JSON.stringify(split));

/* 3) o reveal MOVE de fato?
   ⚠ NÃO use window.scrollTo aqui. Com o Lenis no comando, `scrollTo` do window
   não move o scroll interpolado, o ScrollTrigger não recebe update e o reveal
   fica congelado no estado inicial — o teste acusa "PARADO" num site que
   funciona. Roda-se a roda do mouse de verdade, que é o caminho do usuário. */
await p.mouse.move(800, 500);
for (let i = 0; i < 14; i++) { await p.mouse.wheel({ deltaY: 260 }); await new Promise(r=>setTimeout(r,55)); }
await new Promise(r=>setTimeout(r,180));
const t0=await p.evaluate(()=>{const l=document.querySelector('#work .reveal-line');return l?getComputedStyle(l).transform:null});
await new Promise(r=>setTimeout(r,260));
const t1=await p.evaluate(()=>{const l=document.querySelector('#work .reveal-line');return l?getComputedStyle(l).transform:null});
await new Promise(r=>setTimeout(r,1400));
const t2=await p.evaluate(()=>{const l=document.querySelector('#work .reveal-line');return l?getComputedStyle(l).transform:null});
console.log('3) reveal do título — durante:',t0,'→',t1, (t0!==t1?'✓ MOVENDO':'✗ PARADO'));
console.log('   assentou em:',t2);

// 4) o marquee anda no ticker (sem rAF próprio)?
const m1=await p.evaluate(()=>document.querySelector('[aria-label="Trabalho em destaque"] > div').style.transform);
await new Promise(r=>setTimeout(r,900));
const m2=await p.evaluate(()=>document.querySelector('[aria-label="Trabalho em destaque"] > div').style.transform);
console.log('4) marquee:',m1,'→',m2,(m1!==m2?'✓ MOVENDO':'✗ PARADO'));

// 5) um relógio só?
const tickers=await p.evaluate(()=>window.__rafCount??'n/d');
console.log('5) overflow horizontal:',await p.evaluate(()=>({doc:document.documentElement.scrollWidth,win:window.innerWidth})));
console.log(errs.length?'ERROS: '+errs.join(' | '):'✓ sem erro de console / sem 404');
await b.close();
