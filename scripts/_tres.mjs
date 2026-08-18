import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false});
for (const [r,t] of [['/v2/about-d','D'],['/v2/about-e','E'],['/v2/about-f','F']]) {
  const p=await b.newPage(); const err=[];
  p.on('pageerror',e=>err.push(e.message.split('\n')[0]));
  p.on('console',m=>{if(m.type()==='error')err.push('console: '+m.text().slice(0,120))});
  await p.setViewport({width:1680,height:963});
  await p.goto('http://localhost:5173'+r,{waitUntil:'networkidle0'});
  await new Promise(x=>setTimeout(x,1600));
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  const n=Math.min(Math.ceil(H/963),7);
  for(let i=0;i<n;i++){await p.evaluate(y=>scrollTo(0,y),i*963);await new Promise(x=>setTimeout(x,850));await p.screenshot({path:`/tmp/${t}${i}.png`});}
  console.log(t, 'altura', H, 'telas', n, 'erros:', err.length?err.slice(0,2):'0');
  await p.close();
}
await b.close();
