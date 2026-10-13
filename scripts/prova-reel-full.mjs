import { chromium } from 'playwright';
const out=process.argv[2]; const b=await chromium.launch();
for (const [w,h,m] of [[1512,900,false],[390,844,true]]) {
  const p=await b.newPage({viewport:{width:w,height:h},isMobile:m,hasTouch:m});
  const erros=[]; p.on('pageerror',e=>erros.push(e.message));
  await p.goto('http://localhost:4799/v2/reel-full'); await p.waitForTimeout(2500);
  if(!m){await p.mouse.move(w/2,h/2);await p.waitForTimeout(600);}
  await p.screenshot({path:`${out}/${w}-0.png`});
  for (const f of [.5,1.2]) { await p.mouse.move(w/2,h/2); let i=0; while(await p.evaluate(()=>scrollY)<h*f && i++<80){await p.mouse.wheel(0,80);await p.waitForTimeout(40);} await p.waitForTimeout(900); await p.screenshot({path:`${out}/${w}-${f}.png`}); }
  await p.mouse.wheel(0,-5000); await p.waitForTimeout(1500);
  if(m) await p.click('.rx-play'); else { await p.mouse.move(w/2,h/2); await p.mouse.click(w/2,h/2); }
  await p.waitForTimeout(1200); await p.screenshot({path:`${out}/${w}-aberto.png`});
  const sy=await p.evaluate(()=>scrollY); await p.mouse.wheel(0,600); await p.waitForTimeout(500);
  console.log(w,'travado', sy===await p.evaluate(()=>scrollY), 'som', await p.evaluate(()=>!document.querySelector('.rx-player video')?.muted));
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  console.log(w,'fechou', await p.evaluate(()=>!document.querySelector('.rx-player')), erros);
  await p.screenshot({path:`${out}/${w}-fechado.png`});
}
await b.close();
