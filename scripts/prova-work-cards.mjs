// prova do modo CARDS (WebGL, padrão) da /work: a fita nasce, a roda troca o card do centro, o filtro reduz, o clique no centro abre o case
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL=process.argv[2]||'http://localhost:4181/work';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message)); pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,300))});
await pg.setViewport({width:1440,height:900});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(URL,{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,800));
const legenda=()=>pg.$eval('.p-cartoes-legenda',e=>e.innerText.replace(/\n/g,' · ')).catch(()=>null);
const canvas=await pg.$eval('.p-cartoes-palco canvas',c=>({w:c.width,h:c.height})).catch(()=>null);
console.log('canvas', canvas, '| legenda', await legenda());
// pixel do centro do canvas não pode ser transparente (a fita desenhou)
await pg.mouse.move(720,450); for(let i=0;i<8;i++){await pg.mouse.wheel({deltaY:120}); await new Promise(r=>setTimeout(r,40));}
await new Promise(r=>setTimeout(r,1600));
console.log('após roda', await legenda());
await pg.$$eval('.p-work-chip',els=>els.find(e=>e.textContent.trim()==='3D').click());
await new Promise(r=>setTimeout(r,900));
console.log('filtro 3D →', await legenda());
await pg.$$eval('.p-work-chip',els=>els.find(e=>e.textContent.trim()==='All').click());
await new Promise(r=>setTimeout(r,900));
await pg.mouse.move(720,450); await new Promise(r=>setTimeout(r,200)); await pg.mouse.down(); await pg.mouse.up(); await new Promise(r=>setTimeout(r,900));
console.log('após clique:', pg.url());
await b.close();
