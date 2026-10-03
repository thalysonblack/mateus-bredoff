// prova do conceito 3D /v2/espaco: as fases do palco por scroll real (roda), foco no corredor, clique abre o case
import puppeteer from 'puppeteer-core';
const OUT=process.env.OUT||'/tmp';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message)); pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,200))});
await pg.setViewport({width:1512,height:860});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(process.argv[2]||'http://localhost:5210/v2/espaco',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,2500));
const H=await pg.evaluate(()=>document.querySelector('.p-esp-palco').offsetHeight-innerHeight);
await pg.mouse.move(756,430);
const alvos=[0,0.18,0.3,0.5,0.66,0.9];
let k=0;
for(const a of alvos){
  for(;;){const y=await pg.evaluate(()=>scrollY); if(y>=a*H-5)break; await pg.mouse.wheel({deltaY:240}); await new Promise(r=>setTimeout(r,40));}
  await new Promise(r=>setTimeout(r,1300));
  const st=await pg.evaluate(()=>({y:Math.round(scrollY),foco:document.querySelector('.p-esp-foco-nome')?.textContent||'',leg:document.querySelector('.p-esp-legenda')?.textContent||''}));
  console.log(`p≈${a}`,JSON.stringify(st));
  await pg.screenshot({path:`${OUT}/esp-${k++}.png`});
}
await b.close();
