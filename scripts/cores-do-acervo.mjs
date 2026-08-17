/**
 * A COR DE CADA PROJETO, amostrada da própria capa.
 *
 *   node scripts/cores-do-acervo.mjs
 *
 * "cada texto a cor do projeto" (17/08). A cor não se escolhe nem se deriva de
 * uma paleta: sai da arte ([[craft-paleta-se-amostra-da-peca-nao-se-deriva]]).
 * O método:
 *   1. reduz a capa a 20×20 e percorre os pixels;
 *   2. descarta o que não é cor (l fora de 0,14–0,78, s abaixo de 0,20) e
 *      agrupa o resto por FAIXA DE MATIZ, somando a área de cada faixa;
 *   3. a faixa vencedora é a que ocupa mais área — não o pixel mais saturado,
 *      que numa foto costuma ser um reflexo isolado;
 *   4. mantém matiz e saturação, e mexe só no VALOR até bater 4,5:1 sobre o
 *      papel. Inflar saturação transforma marrom em vermelho.
 *
 * Capas em preto e branco (Bureau, cromado) não têm faixa vencedora: caem no
 * cinza-azulado do sistema, que é honesto — a peça não tem cor.
 */
import { execFileSync } from 'node:child_process';

const CAPAS = {
  ginga: 'art-ginga-1400.webp',
  'alex-archer': 'case-alexarcher-01-1400.webp',
  bureau: 'art-bureau-1400.webp',
  neox: 'art-neox-1400.webp',
  trivo: 'art-trivo-1400.webp',
  stag: 'art-stag-1400.webp',
  ferraci: 'art-ferraci-1400.webp',
  votare: 'art-votare-1400.webp',
};

const toHsl = (r, g, b) => { r/=255; g/=255; b/=255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, d=mx-mn;
  if (!d) return [0,0,l];
  const s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn);
  let h = mx===r ? (g-b)/d+(g<b?6:0) : mx===g ? (b-r)/d+2 : (r-g)/d+4;
  return [h*60, s, l]; };
const toRgb = (h, s, l) => { h=((h%360)+360)%360/360;
  if (!s) return [l,l,l].map(v=>Math.round(v*255));
  const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
  const f = t => { t=(t+1)%1; return t<1/6 ? p+(q-p)*6*t : t<0.5 ? q : t<2/3 ? p+(q-p)*(2/3-t)*6 : p; };
  return [f(h+1/3), f(h), f(h-1/3)].map(v=>Math.round(v*255)); };
const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const lum = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const raz = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const hex = a => '#'+a.map(v=>v.toString(16).padStart(2,'0')).join('');

const PAPEL = [244,244,242], TINTA = [20,32,31];
const FAIXA = 20;                       /* graus por balde de matiz */
const saida = {};

for (const [slug, arq] of Object.entries(CAPAS)) {
  const buf = execFileSync('ffmpeg', ['-v','quiet','-i',`src/assets/optimized/${arq}`,
    '-vf','scale=20:20','-f','rawvideo','-pix_fmt','rgb24','-'], { maxBuffer: 1e7 });
  const baldes = new Map();
  for (let i = 0; i < buf.length; i += 3) {
    const [h,s,l] = toHsl(buf[i], buf[i+1], buf[i+2]);
    if (l < 0.14 || l > 0.78 || s < 0.20) continue;
    const k = Math.floor(h / FAIXA);
    const b = baldes.get(k) || { n: 0, h: 0, s: 0 };
    b.n++; b.h += h; b.s += s;
    baldes.set(k, b);
  }
  const vencedor = [...baldes.values()].sort((a,b)=>b.n-a.n)[0];
  let h, s, origem;
  if (vencedor && vencedor.n >= 8) {
    h = vencedor.h / vencedor.n; s = Math.min(vencedor.s / vencedor.n, 0.82);
    origem = `${vencedor.n} px na faixa h${Math.round(h)}`;
  } else {
    h = 197; s = 0.31; origem = 'sem cor dominante — cai no petróleo do sistema';
  }
  const busca = (fundo, sobe) => {
    let l = 0.50, c = toRgb(h, s, l);
    while (raz(c, fundo) < 4.55 && l > 0.06 && l < 0.94) { l += sobe ? 0.005 : -0.005; c = toRgb(h, s, l); }
    return c;
  };
  const noPapel = busca(PAPEL, false), naTinta = busca(TINTA, true);
  saida[slug] = { papel: hex(noPapel), tinta: hex(naTinta) };
  console.log(`${slug.padEnd(13)} ${hex(noPapel)} ${raz(noPapel,PAPEL).toFixed(2)}:1   ${hex(naTinta)} ${raz(naTinta,TINTA).toFixed(2)}:1   ${origem}`);
}
console.log('\n' + JSON.stringify(saida, null, 2));
