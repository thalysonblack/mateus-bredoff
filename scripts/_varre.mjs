import puppeteer from 'puppeteer-core';
const rota = process.argv[2], tag = process.argv[3];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:false});
const p=await b.newPage(); await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173'+rota,{waitUntil:'networkidle0'});
await new Promise(x=>setTimeout(x,1500));
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
console.log(tag,'altura',H,'telas',Math.ceil(H/963));
for(let i=0;i<Math.ceil(H/963)&&i<9;i++){
  await p.evaluate(y=>scrollTo(0,y),i*963);
  await new Promise(x=>setTimeout(x,900));
  await p.screenshot({path:`/tmp/${tag}-${i}.png`});
}
await b.close();
