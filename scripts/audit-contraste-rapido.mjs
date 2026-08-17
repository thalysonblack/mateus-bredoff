/**
 * Contraste de TODO texto visível, considerando a OPACIDADE HERDADA.
 *
 *   node scripts/audit-contraste-rapido.mjs /work
 *
 * ⚠ Por que não basta ler `color`: metade do texto deste site vive dentro de
 * blocos com `opacity` (linhas atenuadas, campo da trama). A cor computada
 * continua sendo a tinta cheia, e só a opacidade acumulada dos ancestrais
 * revela o que o olho recebe. Este script compõe cor sobre fundo com a
 * opacidade efetiva antes de medir.
 */
import puppeteer from 'puppeteer-core';
const rota = process.argv[2] || '/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1680,height:963});
await p.goto('http://localhost:5173'+rota,{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1400));
const achados = await p.evaluate(() => {
  const rgb = s => (s.match(/[\d.]+/g)||[0,0,0,1]).map(Number);
  const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
  const lum = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
  const raz = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
  const fundoDe = el => { let e=el; while(e){ const c=rgb(getComputedStyle(e).backgroundColor);
      if((c[3]??1) > 0.9) return c.slice(0,3); e=e.parentElement; } return [255,255,255]; };
  const out=[];
  document.querySelectorAll('body *').forEach(el=>{
    const txt=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
    if(!txt) return;
    const r=el.getBoundingClientRect();
    if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight) return;
    const cs=getComputedStyle(el);
    if(cs.visibility==='hidden') return;
    /* opacidade acumulada dos ancestrais */
    let alfa=1, e=el;
    while(e && e!==document.body){ alfa*= +getComputedStyle(e).opacity; e=e.parentElement; }
    if(alfa<0.02) return;
    const fundo=fundoDe(el);
    /* ⚠ TEXTO RECORTADO NA IMAGEM (`background-clip: text`) tem `color:
       transparent`: medir a cor daria 1:1 para um texto perfeitamente legível.
       A cor real é a do gradiente que passa por dentro. */
    let c=rgb(cs.color);
    if ((c[3]??1) < 0.05 && cs.webkitBackgroundClip === 'text') {
      const g = cs.backgroundImage.match(/rgba?\([^)]+\)/);
      if (g) c = rgb(g[0]); else return;
    }
    const ca=(c[3]??1)*alfa;
    const composto=[0,1,2].map(i=>Math.round(c[i]*ca + fundo[i]*(1-ca)));
    const tam=parseFloat(cs.fontSize), bold=+cs.fontWeight>=700;
    const grande = tam>=24 || (tam>=18.66 && bold);
    const alvo = grande?3:4.5;
    const razao = raz(composto, fundo);
    if (razao < alvo) out.push({txt:txt.slice(0,34), tam:+tam.toFixed(1), alfa:+alfa.toFixed(2),
      razao:+razao.toFixed(2), alvo, cls:(el.className||'').toString().split(' ').slice(0,2).join(' ')});
  });
  return out.sort((a,b)=>a.razao-b.razao);
});
console.log(`${rota} — ${achados.length} nós abaixo do alvo AA:`);
achados.slice(0,14).forEach(a=>console.log(`  ${String(a.razao).padStart(5)}:1 (alvo ${a.alvo})  ${String(a.tam).padStart(5)}px α${a.alfa}  "${a.txt}"  .${a.cls}`));
await b.close();
