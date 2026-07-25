/**
 * Auditoria de contraste MEDIDA NO PIXEL RENDERIZADO.
 *
 * Não estima a partir de `color` vs `background-color` — isso mente quando há
 * blend mode, opacity, imagem de fundo ou gradiente atrás do texto (este repo
 * já escondeu três bugs assim). Em vez disso: recorta a bbox de cada nó de
 * texto, converte o PNG em RGB cru com ffmpeg e calcula a razão de contraste
 * entre o pixel mais claro e o mais escuro daquele recorte.
 *
 * Uso: node scripts/audit-contrast.mjs [url]
 */
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.argv[2] ?? 'http://127.0.0.1:4599/';
const TMP_PNG = '/tmp/mb-contrast-clip.png';
const TMP_RAW = '/tmp/mb-contrast-clip.raw';

const lum = (r, g, b) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * Contraste do recorte: fundo = luminância MODAL (o que ocupa mais área),
 * texto = o extremo oposto ao fundo.
 *
 * Não use percentil simétrico aqui: num recorte de 12px de altura, os pixels
 * de glifo cheio de um mono fino são bem menos de 1% da área, então qualquer
 * trim generoso descarta o texto e devolve o antialiasing — foi assim que a
 * primeira versão deste script "mediu" branco-sobre-preto em 2:1.
 */
function measureClip(buf, w, h) {
  writeFileSync(TMP_PNG, buf);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', TMP_PNG,
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', TMP_RAW]);
  const raw = execFileSync('cat', [TMP_RAW], { maxBuffer: 1 << 28, encoding: 'buffer' });
  const n = Math.floor(raw.length / 3);
  if (!n) return null;

  // histograma por luminância quantizada em 256 níveis
  const hist = new Float64Array(256);
  const count = new Int32Array(256);
  for (let i = 0; i + 2 < raw.length; i += 3) {
    const L = lum(raw[i], raw[i + 1], raw[i + 2]);
    const bin = Math.min(255, Math.round(L * 255));
    count[bin]++;
    hist[bin] += L;
  }
  let bgBin = 0;
  for (let b = 1; b < 256; b++) if (count[b] > count[bgBin]) bgBin = b;
  const bgL = hist[bgBin] / count[bgBin];

  // extremo oposto ao fundo, com trim de 0.2% só pra matar pixel solto/artefato
  const trim = Math.max(0, Math.floor(n * 0.002));
  let acc = 0, fgL = bgL;
  if (bgBin > 127) {
    for (let b = 0; b < 256; b++) { acc += count[b]; if (acc > trim) { fgL = hist[b] / count[b]; break; } }
  } else {
    for (let b = 255; b >= 0; b--) { acc += count[b]; if (acc > trim) { fgL = hist[b] / count[b]; break; } }
  }

  const inkPixels = bgBin > 127
    ? count.slice(0, Math.max(1, bgBin - 12)).reduce((a, c) => a + c, 0)
    : count.slice(Math.min(255, bgBin + 12)).reduce((a, c) => a + c, 0);

  return {
    ratio: +ratio(bgL, fgL).toFixed(2),
    bg: +bgL.toFixed(4),
    fg: +fgL.toFixed(4),
    inkPixels, // 0 = nada de texto no recorte → medida inválida, não aprovação
    samples: n, w, h,
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 1000, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const report = {};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  // desliga entrada animada: mede o estado final, não o meio do fade
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}`;
    document.head.appendChild(s);
  });
  await new Promise((r) => setTimeout(r, 4000));

  const nodes = await page.evaluate(() => {
    const out = [];
    let idx = 0;
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const t = (n.textContent || '').trim();
      if (t.length < 2) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      // Caixa da PRIMEIRA LINHA do texto, não a bbox do elemento: a bbox inclui
      // padding e pode encostar na borda, e aí o recorte mede o fundo de fora
      // (foi o que fez a calibração devolver 21:1 pra tudo).
      const range = document.createRange();
      range.selectNodeContents(n);
      const rects = [...range.getClientRects()].filter((r) => r.width > 3 && r.height > 3);
      range.detach();
      if (!rects.length) continue;
      const r = rects.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
      if (r.width < 4 || r.height < 4) continue;
      const px = parseFloat(cs.fontSize);
      const bold = +cs.fontWeight >= 700;
      const id = String(idx++);
      el.setAttribute('data-audit-idx', id);
      out.push({
        id,
        label: t.slice(0, 42).replace(/\s+/g, ' '),
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 44),
        fontPx: px,
        // WCAG "texto grande": >=24px, ou >=18.66px em bold
        large: px >= 24 || (bold && px >= 18.66),
        color: cs.color,
        top: Math.round(r.top + window.scrollY),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
      });
    }
    return out;
  });

  const results = [];
  for (const n of nodes) {
    // Rola pro nó e ESPERA o reveal do Framer Motion terminar. `animation:none`
    // não segura o Motion (ele anima por WAAPI/rAF), e medir 120ms depois do
    // scroll pega o texto ainda em opacity 0 — foi o que produziu 46 nós
    // "sem medida" na primeira rodada.
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 260)), n.top);
    await new Promise((r) => setTimeout(r, 900));
    // recorte EXATO da caixa de linha, RE-LIDA após o reveal (que desloca em Y)
    const box = await page.evaluate((id) => {
      const el = document.querySelector(`[data-audit-idx="${id}"]`);
      if (!el) return null;
      const node = [...el.childNodes].find((c) => c.nodeType === 3 && (c.textContent || '').trim().length > 1);
      if (!node) return null;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter((r) => r.width > 3 && r.height > 3);
      range.detach();
      if (!rects.length) return null;
      const r = rects.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
      return {
        x: Math.max(0, Math.round(r.left)),
        y: Math.round(r.top),
        width: Math.max(1, Math.round(r.width)),
        height: Math.max(1, Math.round(r.height)),
      };
    }, n.id);
    if (!box) continue;
    if (box.y < 0 || box.y + box.height > vp.height) continue;
    let buf;
    try {
      buf = await page.screenshot({ clip: box, encoding: 'binary' });
    } catch { continue; }
    const m = measureClip(buf, box.width, box.height);
    if (!m) continue;
    const min = n.large ? 3 : 4.5;
    results.push({
      ...n, measured: m.ratio, required: min,
      inkPixels: m.inkPixels,
      pass: m.ratio >= min,
      // recorte sem pixel de tinta: o nó não pintou onde dissemos que pintaria
      invalid: m.inkPixels === 0,
    });
  }

  const fmt = (r) => ({
    text: r.label, tag: r.tag, cls: r.cls, fontPx: r.fontPx,
    color: r.color, measured: r.measured, required: r.required,
    inkPixels: r.inkPixels, at: `y=${r.top}`,
  });

  report[vp.name] = {
    checked: results.length,
    failures: results.filter((r) => !r.pass && !r.invalid).sort((a, b) => a.measured - b.measured).map(fmt),
    unmeasured: results.filter((r) => r.invalid).map(fmt),
    worstPasses: results.filter((r) => r.pass)
      .sort((a, b) => a.measured - b.measured).slice(0, 6)
      .map((r) => `${r.measured}:1 (min ${r.required}) — "${r.label}" ${r.fontPx}px ${r.cls}`),
  };
  await page.close();
}

try { unlinkSync(TMP_PNG); unlinkSync(TMP_RAW); } catch {}
console.log(JSON.stringify(report, null, 2));
await browser.close();
