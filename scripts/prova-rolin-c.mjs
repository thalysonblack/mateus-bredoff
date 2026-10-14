import { chromium } from 'playwright';
const [W,H]=process.argv[2]==='cel'?[390,844]:[1512,900];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});
const erros=[];p.on('pageerror',e=>erros.push(e.message));p.on('console',m=>m.type()==='error'&&erros.push(m.text()));
await p.goto(`http://localhost:4318/v2/rolin-c`,{waitUntil:'networkidle'});await p.waitForTimeout(1800);
const dir='/private/tmp/claude-501/rc';
for(let i=0;i<14;i++){await p.screenshot({path:`${dir}/${W}-${String(i).padStart(2,'0')}.png`});await p.mouse.move(W/2,H/2);for(let k=0;k<6;k++){await p.mouse.wheel(0,H*0.11);await p.waitForTimeout(60);}await p.waitForTimeout(700);}
console.log(W,'erros',erros.slice(0,3),'hscroll',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
await b.close();
