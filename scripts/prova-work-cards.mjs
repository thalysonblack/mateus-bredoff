// prova do modo CARDS da /work: a roda anda a fita, o filtro reduz os cards, o clique no centro abre o case
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL=process.argv[2]||'http://localhost:4181/work?view=cards';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-device-scale-factor=1']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message)); pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,300))}); await pg.setViewport({width:1440,height:900});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(URL,{waitUntil:'networkidle0'});
const pos=()=>pg.$$eval('[role=listitem]',els=>els.map(t=>({n:t.getAttribute('aria-label'),x:Math.round(t.getBoundingClientRect().x)})).sort((a,b)=>a.x-b.x).filter(t=>t.x>-700&&t.x<1440));
const ativo=()=>pg.evaluate(()=>{const t=[...document.querySelectorAll('[role=listitem]')];return t.sort((a,b)=>Math.abs(a.getBoundingClientRect().x+a.getBoundingClientRect().width/2-720)-Math.abs(b.getBoundingClientRect().x+b.getBoundingClientRect().width/2-720))[0]?.getAttribute('aria-label')});
const a=await pos(); const a0=await ativo();
await pg.mouse.move(720,450); for(let i=0;i<10;i++){await pg.mouse.wheel({deltaY:120}); await new Promise(r=>setTimeout(r,40));}
await new Promise(r=>setTimeout(r,1200));
const c=await pos(); const c0=await ativo();
console.log('antes ', a0, JSON.stringify(a)); console.log('depois', c0, JSON.stringify(c));
// filtro
await pg.$$eval('.p-work-chip',els=>els.find(e=>e.textContent.trim()==='3D').click());
await new Promise(r=>setTimeout(r,600));
console.log('filtro 3D → tiles', await pg.$$eval('[role=listitem]',e=>e.length), 'ativo', await ativo());
const chips=await pg.$$eval('.p-work-chip',els=>els.map(e=>e.textContent.trim())); console.log('chips agora',chips); if(chips.includes('All')) await pg.$$eval('.p-work-chip',els=>els.find(e=>e.textContent.trim()==='All').click());
await new Promise(r=>setTimeout(r,600));
// clique no centro do card ativo abre o case
await pg.mouse.click(720,450); await new Promise(r=>setTimeout(r,800));
console.log('após clique:', pg.url());
await b.close();
