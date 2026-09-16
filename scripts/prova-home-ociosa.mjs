// prova do ciclo ocioso da home: sem mouse, um nome acende por vez (na cor dele) e o slot do reel troca a capa
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage(); await pg.setViewport({width:1440,height:900});
await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
await pg.goto(process.argv[2]||'http://localhost:4181/',{waitUntil:'networkidle0'});
const ler=()=>pg.evaluate(()=>{const a=document.querySelector('.p-trama-nome--aceso');const img=document.querySelector('.p-reel--mudo img');return {aceso:a?.textContent??null,cor:a?getComputedStyle(a).getPropertyValue('--p-trama-cor').trim():null,reel:img?.getAttribute('src')?.split('/').pop()}});
const serie=[]; for(let i=0;i<5;i++){serie.push(await ler()); await new Promise(r=>setTimeout(r,1800));}
console.table(serie);
await pg.screenshot({path:process.env.SHOT||'/tmp/home-ociosa.png'});
await b.close();
