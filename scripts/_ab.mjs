import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false,args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1680,height:963});
const rota=process.argv[2]||'/v2/about-c';
await p.goto('http://localhost:5173'+rota,{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));
const doc=await p.evaluate(()=>document.documentElement.scrollHeight);
console.log(rota,'· altura',doc,'·',Math.ceil(doc/963),'telas');
for (let i=0,y=0; y<doc-200; i++,y+=900){
  await p.evaluate(v=>scrollTo(0,v),y); await new Promise(r=>setTimeout(r,650));
  await p.screenshot({path:`/tmp/ab${i}.png`});
}
await b.close();
