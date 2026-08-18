import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false});
const p=await b.newPage(); await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173/v2/about-f',{waitUntil:'networkidle0'});
await new Promise(x=>setTimeout(x,1200));
for(let i=1;i<=4;i++){await p.evaluate(()=>scrollBy(0,700));await new Promise(x=>setTimeout(x,500));}
console.log(await p.evaluate(()=>[...document.querySelectorAll('.ab-f-cap')].map(s=>{const r=s.getBoundingClientRect();const c=getComputedStyle(s);return {classe:s.className.replace('ab-f-cap ',''), top:Math.round(r.top), h:Math.round(r.height), op:c.opacity, tr:c.transform.slice(0,24)}})));
await b.close();
