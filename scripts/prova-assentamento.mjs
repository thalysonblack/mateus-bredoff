/**
 * Prova que a transição do visor não SALTA — nem no meio, nem ao concluir.
 *
 *   node scripts/prova-assentamento.mjs 4    # 1 maré · 2 onda · 3 turbilhão · 4 arco
 *
 * "ele se reajeita no final": ao concluir, a arte nova vira a atual e o
 * progresso volta a zero. Se sobrar deslocamento residual em p=1 — ou se a
 * conclusão rodar duas vezes — a imagem pula num frame só.
 *
 * O método: amostrar o FRAMEBUFFER (grade 16×9, via `window.__visor.amostra()`,
 * exposto só em DEV) a cada frame e olhar a diferença entre consecutivos. Uma
 * transição saudável desenha uma curva contínua; um reajuste aparece como pico
 * isolado, várias vezes maior que a mediana do percurso.
 *
 * ⚠ Não tente provar isto por screenshot: cada captura do puppeteer custa
 * 200–400ms e o pulo dura um frame. `screenshot({clip})` ainda por cima devolve
 * o canvas preto, porque sem `preserveDrawingBuffer` o buffer do WebGL não
 * sobrevive à recomposição do recorte.
 */
import puppeteer from 'puppeteer-core';

const modo = process.argv[2] || '4';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage();
const erros = [];
p.on('console', e => e.type() === 'error' && erros.push(e.text()));
await p.setViewport({ width: 1680, height: 963 });
/* a home canônica é a raiz desde 17/08; /v2/d1..d4 seguem para comparar receitas */
await p.goto(modo === '0' ? 'http://localhost:5173/' : `http://localhost:5173/v2/d${modo}`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1800));

/* o anel só se posiciona no pointermove; daí em diante quem troca a peça é o
   foco, que é determinístico — posição de mouse não é, porque a fita anda e os
   vãos entre palavras mantêm a peça anterior de propósito */
await p.mouse.move(840, 300);
await new Promise(r => setTimeout(r, 700));
await p.evaluate(() => document.querySelector('[data-peca="ginga"]').focus());
await new Promise(r => setTimeout(r, 1800));

const serie = await p.evaluate(async () => {
  const v = window.__visor;
  const quadros = [];
  let rodando = true;
  const grava = () => { if (!rodando) return; quadros.push(v.amostra()); requestAnimationFrame(grava); };
  requestAnimationFrame(grava);
  document.querySelector('[data-peca="trivo"]').focus();
  await new Promise(r => setTimeout(r, 2200));   /* transição (0,92s) + folga larga */
  rodando = false;
  return quadros;
});
await b.close();

const dif = [];
for (let k = 1; k < serie.length; k++) {
  let soma = 0;
  for (let i = 0; i < serie[k].length; i++) soma += Math.abs(serie[k][i] - serie[k - 1][i]);
  dif.push(soma / serie[k].length);
}
const ativos = dif.filter(d => d > 0.4);            /* frames em que algo mudou */
const mediana = [...ativos].sort((a, b) => a - b)[Math.floor(ativos.length / 2)] || 0;
const pico = Math.max(...dif);
const iPico = dif.indexOf(pico);
const primeiro = dif.findIndex(d => d > 0.4);
const ultimo = dif.length - 1 - [...dif].reverse().findIndex(d => d > 0.4);
/* ⚠ ONDE o pico cai importa mais que o tamanho dele: no MEIO do percurso é a
   frente de onda passando (natural, e é o que dá o efeito); no ÚLTIMO frame com
   movimento é o reajuste ao concluir — esse é o defeito. */
const posicao = (iPico - primeiro) / Math.max(1, ultimo - primeiro);
const noFim = posicao > 0.88;
const razao = mediana ? pico / mediana : 0;
console.log(`modo ${modo} — ${serie.length} frames · ${ativos.length} com movimento`);
console.log(`  variação por frame: mediana ${mediana.toFixed(2)} · pico ${pico.toFixed(2)} (${razao.toFixed(1)}×)`);
console.log(`  o pico cai a ${(posicao * 100).toFixed(0)}% do percurso`);
console.log(`  erros de console: ${erros.length}`);
console.log(!noFim ? '✓ o pico está no meio do percurso (é a frente de onda) — sem reajuste no fim'
                   : `✗ o pico está no FIM: reajuste ao concluir, ${razao.toFixed(1)}× acima do percurso`);
