// prova da home /v2/estudo: a escultura montada e cada etapa da desmontagem (roda real), depois as seções
import puppeteer from 'puppeteer-core';
const OUT=process.env.OUT||'/tmp';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message)); pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,200))});
await pg.setViewport({width:1512,height:860});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(process.argv[2]||'http://localhost:5210/v2/estudo',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,2000));
const H=await pg.evaluate(()=>document.querySelector('.p-est-palco').offsetHeight-innerHeight);
await pg.mouse.move(756,430);
const alvos=[0,0.2,0.36,0.52,0.68,0.84,0.98];
let k=0;
for(const a of alvos){
  for(let g=0;g<300;g++){const y=await pg.evaluate(()=>scrollY); if(y>=a*H-5)break; await pg.mouse.wheel({deltaY:Math.min(300,a*H-y)}); await new Promise(r=>setTimeout(r,30));}
  await new Promise(r=>setTimeout(r,1600));
  console.log(`p≈${a}`, await pg.evaluate(()=>document.querySelector('.p-est-titulo')?.textContent||'(abertura)'));
  await pg.screenshot({path:`${OUT}/est-${k++}.png`});
}
for (const sel of ['.p-est-trabalho','.p-est-sobre','.p-est-pub']) {
  const y=await pg.evaluate(s=>document.querySelector(s).offsetTop-40,sel);
  for(let g=0;g<300;g++){const s=await pg.evaluate(()=>scrollY); if(s>=y-8)break; await pg.mouse.wheel({deltaY:Math.min(400,y-s)}); await new Promise(r=>setTimeout(r,30));}
  await new Promise(r=>setTimeout(r,900)); await pg.screenshot({path:`${OUT}/est-${k++}.png`});
}
console.log('sw', await pg.evaluate(()=>document.documentElement.scrollWidth));
await b.close();
