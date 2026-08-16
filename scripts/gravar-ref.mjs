/**
 * GRAVA a tela de uma referência (ou do nosso site) e devolve o movimento em
 * duas formas legíveis: uma tira de quadros e uma série de valores medidos.
 *
 * Existe porque screenshot não mostra transição. O scout (`scout-ref.mjs`) colhe
 * o ESTADO — tipografia, cor, mecânica, posição — e é cego para o que só existe
 * no tempo: quanto dura, com que curva, o que entra antes do quê. Foi assim que
 * eu li o bleibtgleich como "tipografia grande e filtro líquido" e refiz efeitos
 * que o Thalyson recusou: eu tinha copiado a fotografia de um filme.
 *
 * ## Como grava
 *
 * `Page.startScreencast` do CDP, não `page.screenshot()` em laço. O screenshot
 * custa 100–200 ms por chamada, ou seja ~6 fps: rápido demais para as coisas
 * lentas e lento demais para as rápidas — e o próprio ato de fotografar altera
 * o tempo do que se quer medir. O screencast entrega os quadros que o compositor
 * já produziu, a ~30 fps, sem interferir.
 *
 * Duas cenas, porque são os dois lugares onde a transição vive:
 *   scroll  — rola com wheel real (Lenis/ScrollTrigger só respondem a isso)
 *   hover   — passa o mouse num alvo e fica parado, gravando a resposta
 *
 * ## Como se lê depois
 *
 * - `tira-*.png`: 12 quadros lado a lado, em ordem. É o "filme" que o olho lê.
 * - `serie-*.json`: as propriedades animadas amostradas a cada ~33 ms. Duas
 *   medidas provam o que o olho não decide: **duração** (quantos quadros até
 *   parar) e **curva** (a distribuição do delta entre quadros — carga na frente
 *   é ease-out, no fim é ease-in, e igual é linear).
 *
 * uso:
 *   node scripts/gravar-ref.mjs <url> [--seletor "<css>"] [--cena scroll|hover]
 *        [--dur 4000] [--width 1600]
 */
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const url = argv[0];
if (!url) {
  console.error('uso: node scripts/gravar-ref.mjs <url> [--seletor css] [--cena scroll|hover] [--dur ms] [--width px]');
  process.exit(1);
}
const opt = (nome, padrao) => {
  const i = argv.indexOf(`--${nome}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : padrao;
};
const cena = opt('cena', 'scroll');
const dur = +opt('dur', 4000);
const W = +opt('width', 1600);
const seletor = opt('seletor', null);

const host = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/[^a-z0-9]/gi, '-');
const OUT = `/tmp/grav-${host}-${cena}`;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/frames`, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: 900 });
await page.goto(url.startsWith('http') ? url : `https://${url}`, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));

/* ── a série medida ──────────────────────────────────────────────────────
   Amostra as propriedades que carregam animação nos nós que interessam. Sem
   seletor, pega os maiores nós com transform/opacity/filter — que é onde o
   movimento quase sempre está. */
await page.evaluate((sel) => {
  window.__serie = [];
  const alvos = sel
    ? [...document.querySelectorAll(sel)]
    : [...document.querySelectorAll('body *')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          if (r.width * r.height < 20000) return false;
          const s = getComputedStyle(e);
          return s.transform !== 'none' || s.filter !== 'none' || +s.opacity < 1;
        })
        .slice(0, 8);
  window.__alvos = alvos;
  window.__amostrar = () => {
    const t = performance.now();
    window.__serie.push({
      t: Math.round(t),
      y: Math.round(window.scrollY),
      nos: alvos.map((e) => {
        const s = getComputedStyle(e);
        return {
          cls: String(e.className).slice(0, 28),
          transform: s.transform === 'none' ? null : s.transform,
          opacity: s.opacity,
          filter: s.filter === 'none' ? null : s.filter.slice(0, 40),
        };
      }),
    });
  };
}, seletor);

const amostrador = setInterval(() => page.evaluate(() => window.__amostrar?.()).catch(() => {}), 33);

/* ── o screencast ────────────────────────────────────────────────────────── */
const cdp = await page.target().createCDPSession();
let n = 0;
cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
  writeFileSync(`${OUT}/frames/${String(n++).padStart(4, '0')}.jpg`, Buffer.from(data, 'base64'));
  try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch {}
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 });

/* ── a cena ──────────────────────────────────────────────────────────────── */
if (cena === 'click') {
  /* A cena de TRANSIÇÃO DE PÁGINA. É a que mais precisa de gravação: dura menos
     de um segundo, acontece uma vez, e nenhum screenshot a alcança — quando a
     foto sai, ou a página velha ainda está inteira ou a nova já chegou.
     ⚠ `page.click()` do puppeteer espera o elemento e pode perder o início da
     animação; o clique vai por mouse real nas coordenadas medidas, e a gravação
     já está rodando antes dele. */
  /* ⚠ Achar o link por TEXTO é o que funciona na prática. Demo do Codrops usa
     classes iguais em todos os links (`a.links`), então `:nth-of-type` erra
     quando eles não são irmãos diretos — e o script silenciosamente não clica,
     o screencast não recebe quadro nenhum (só manda frame quando a tela muda) e
     a gravação sai vazia parecendo que o site não anima. */
  const texto = opt('texto', null);
  let alvo = null;
  if (texto) {
    const handles = await page.$$('a');
    for (const h of handles) {
      const t = (await h.evaluate((e) => e.innerText || '')).trim().toUpperCase();
      if (t.includes(texto.toUpperCase())) { alvo = h; break; }
    }
  }
  if (!alvo) alvo = seletor ? await page.$(seletor) : await page.$('a[href]:not([href^="#"])');
  if (!alvo) {
    console.error('não achei link para clicar — passe --seletor ou --texto');
  } else {
    const box = await alvo.boundingBox();
    await new Promise((r) => setTimeout(r, 500));
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
      await new Promise((r) => setTimeout(r, 250));
      await page.mouse.down();
      await page.mouse.up();
    }
  }
  await new Promise((r) => setTimeout(r, dur));
} else if (cena === 'hover') {
  const alvo = seletor ? await page.$(seletor) : null;
  if (alvo) {
    const box = await alvo.boundingBox();
    if (box) {
      await page.mouse.move(box.x - 40, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 400));
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
    }
  }
  await new Promise((r) => setTimeout(r, dur));
} else {
  /* wheel real, em passos pequenos: é a única coisa que Lenis e ScrollTrigger
     enxergam, e o passo pequeno é o que deixa a curva visível entre quadros */
  const passos = Math.round(dur / 60);
  for (let i = 0; i < passos; i++) {
    await page.mouse.wheel({ deltaY: 90 });
    await new Promise((r) => setTimeout(r, 55));
  }
  await new Promise((r) => setTimeout(r, 700));
}

await cdp.send('Page.stopScreencast');
clearInterval(amostrador);

const serie = await page.evaluate(() => window.__serie);
writeFileSync(`${OUT}/serie.json`, JSON.stringify(serie, null, 1));
await browser.close();

/* ── a tira de leitura: 12 quadros igualmente espaçados ──────────────────── */
const passo = Math.max(1, Math.floor(n / 12));
const escolhidos = Array.from({ length: Math.min(12, n) }, (_, i) => i * passo);
escolhidos.forEach((f, i) => {
  execFileSync('/opt/homebrew/bin/ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', `${OUT}/frames/${String(f).padStart(4, '0')}.jpg`,
    '-vf', 'scale=520:-1',
    `${OUT}/sel-${String(i).padStart(2, '0')}.png`,
  ]);
});
execFileSync('/opt/homebrew/bin/ffmpeg', [
  '-y', '-loglevel', 'error',
  '-i', `${OUT}/sel-%02d.png`,
  '-vf', 'tile=3x4:padding=6:color=0xff0000',
  `${OUT}/tira.png`,
]);

console.log(`✓ ${n} quadros · ${serie.length} amostras`);
console.log(`  tira:  ${OUT}/tira.png`);
console.log(`  série: ${OUT}/serie.json`);
