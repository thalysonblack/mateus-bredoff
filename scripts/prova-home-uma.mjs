// prova da home ONE PAGE: hero neutro, hover num card acende o projeto, a roda ROLA a página (não a fita)
import puppeteer from 'puppeteer-core';
const OUT=process.env.OUT||'/tmp';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); pg.on('pageerror',e=>console.log('PAGEERROR',e.message));
await pg.setViewport({width:1512,height:860});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.evaluateOnNewDocument(()=>{window.__sonda=true});
await pg.goto(process.argv[2]||'http://localhost:5210/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
await pg.screenshot({path:OUT+'/uma-1.png'});
const centro=async()=>{const s=await pg.evaluate(()=>window.__cartoes);if(!s)return '-';const k=s.slots.filter(k=>k.vis).sort((a,b)=>Math.abs(a.x)-Math.abs(b.x))[0];return `proj ${k.proj}`};
const box=await pg.$eval('.p-uma-fita',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
await pg.mouse.move(box.x+box.w*0.35, box.y+box.h/2,{steps:4}); await new Promise(r=>setTimeout(r,1600));
console.log('hover: projeto aceso', await pg.evaluate(()=>!!document.querySelector('.p-uma-hero--projeto')), '| nome opac', await pg.$eval('.p-uma-nome',e=>getComputedStyle(e).opacity));
await pg.screenshot({path:OUT+'/uma-2.png'});
const c0=await centro(); const y0=await pg.evaluate(()=>scrollY);
for(let i=0;i<6;i++){await pg.mouse.wheel({deltaY:200}); await new Promise(r=>setTimeout(r,60))}
await new Promise(r=>setTimeout(r,1500));
console.log('roda sobre a fita → página rolou', Math.round(await pg.evaluate(()=>scrollY)-y0),'px | fita', c0, '→', await centro());
await pg.evaluate(()=>window.scrollTo(0,document.querySelector('.p-uma-sobre').offsetTop-40)); await new Promise(r=>setTimeout(r,700)); await pg.screenshot({path:OUT+'/uma-3.png'});
await pg.evaluate(()=>window.scrollTo(0,document.querySelector('.p-uma-reel').offsetTop)); await new Promise(r=>setTimeout(r,900)); await pg.screenshot({path:OUT+'/uma-4.png'});
await pg.evaluate(()=>window.scrollTo(0,document.querySelector('.p-uma-prova').offsetTop-80)); await new Promise(r=>setTimeout(r,700)); await pg.screenshot({path:OUT+'/uma-5.png'});
console.log('altura', await pg.evaluate(()=>document.documentElement.scrollHeight), '| scrollW', await pg.evaluate(()=>document.documentElement.scrollWidth));
await b.close();
