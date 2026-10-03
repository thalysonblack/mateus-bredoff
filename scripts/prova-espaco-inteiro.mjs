// prova da home /v2/espaco INTEIRA: carregamento + cada seção sticky a meio do seu progresso (roda real)
import puppeteer from 'puppeteer-core';
const OUT=process.env.OUT||'/tmp';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message));
await pg.setViewport({width:1512,height:860});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(process.argv[2]||'http://localhost:5210/v2/espaco',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,500)); await pg.screenshot({path:`${OUT}/ei-0.png`});
await new Promise(r=>setTimeout(r,2500));
await pg.mouse.move(756,430);
const alvos=await pg.evaluate(()=>{const r=s=>{const e=document.querySelector(s);return {t:e.offsetTop,h:e.offsetHeight}};const ih=innerHeight;
  const m=(s,f)=>{const x=r(s);return Math.round(x.t+(x.h-ih)*f)};
  return [['janela-ini',m('.p-flo-janela',0.1)],['janela-fim',m('.p-flo-janela',0.85)],['gesto',m('.p-flo-gesto',0.5)],['sistema-1',m('.p-flo-sistema',0.02)],['sistema-3',m('.p-flo-sistema',0.68)],['manifesto',m('.p-flo-manifesto',0.45)],['fim',document.documentElement.scrollHeight-ih]]});
let k=1;
for(const [nome,y] of alvos){
  for(let g=0;g<400;g++){const s=await pg.evaluate(()=>scrollY); if(s>=y-8)break; await pg.mouse.wheel({deltaY:Math.min(400,y-s)}); await new Promise(r=>setTimeout(r,30));}
  await new Promise(r=>setTimeout(r,1200));
  const p=await pg.evaluate(n=>{const sel={'janela-ini':'.p-flo-janela','janela-fim':'.p-flo-janela',gesto:'.p-flo-gesto','sistema-1':'.p-flo-sistema','sistema-3':'.p-flo-sistema',manifesto:'.p-flo-manifesto',fim:'.p-flo-fim'}[n];return document.querySelector(sel).style.getPropertyValue('--p')},nome);
  console.log(nome,'y',await pg.evaluate(()=>Math.round(scrollY)),'--p',p);
  await pg.screenshot({path:`${OUT}/ei-${k++}.png`});
}
await b.close();
