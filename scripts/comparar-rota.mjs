/**
 * Compara UMA rota da réplica com a mesma rota do original, medindo.
 *
 * Fotografa os dois lados na mesma largura E extrai a geometria dos dois com o
 * mesmo código — porque comparar print com print só pega erro grosseiro, e o
 * que denuncia a cópia é a escala e o ritmo, que se leem em número.
 *
 * ⚠ Rola com `page.mouse.wheel`, nunca com `window.scrollTo`: do lado da
 * réplica o scroll é do Lenis, e `scrollTo` não move o Lenis — o teste
 * fotografaria a página parada no topo e acusaria "seção faltando".
 *
 * uso: node scripts/comparar-rota.mjs /work 1600 [rotaOriginal]
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [rota = '/work', wArg = '1600', rotaOrig] = process.argv.slice(2);
const W = +wArg;
const H = 1000;
const OUT = '/tmp/comparar';
mkdirSync(OUT, { recursive: true });

const LADOS = [
  { nome: 'replica', url: `http://localhost:4599${rota}` },
  { nome: 'original', url: `https://mateusbredoff.framer.website${rotaOrig || rota}` },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

const resumo = {};
for (const lado of LADOS) {
  const page = await browser.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => m.type() === 'error' && erros.push('console: ' + m.text()));
  await page.setViewport({ width: W, height: H });
  await page.goto(lado.url, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);

  /* Uma varredura de rolagem real antes de medir: o original só monta o que
     entra em viewport, e a réplica só dispara os reveals rolando. */
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += H * 0.8) {
    await page.mouse.wheel({ deltaY: H * 0.8 });
    await new Promise((r) => setTimeout(r, 260));
  }
  await page.mouse.wheel({ deltaY: -altura - 2000 });
  await new Promise((r) => setTimeout(r, 900));

  const alvo = `${OUT}/${rota.replace(/\//g, '_')}-${W}-${lado.nome}`;
  const telas = Math.min(Math.ceil(altura / H), 8);
  for (let i = 0; i < telas; i++) {
    await page.screenshot({ path: `${alvo}-${String(i).padStart(2, '0')}.png` });
    await page.mouse.wheel({ deltaY: H });
    await new Promise((r) => setTimeout(r, 420));
  }

  resumo[lado.nome] = {
    altura: await page.evaluate(() => document.body.scrollHeight),
    erros,
    /* Assinatura tipográfica: mesma extração dos dois lados. Se os pares
       tamanho/entrelinha batem, a escala foi replicada; se não, batem os
       prints e mente o olho. */
    tipo: await page.evaluate(() => {
      const m = new Map();
      document.querySelectorAll('*').forEach((el) => {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        const s = getComputedStyle(el);
        const k = `${s.fontWeight}|${s.fontSize}|${s.lineHeight}|${s.letterSpacing}|${s.textTransform}`;
        m.set(k, (m.get(k) || 0) + 1);
      });
      return [...m].sort((a, b) => b[1] - a[1]);
    }),
  };
  await page.close();
}

writeFileSync(`${OUT}/resumo${rota.replace(/\//g, '_')}-${W}.json`, JSON.stringify(resumo, null, 1));

console.log(`altura  réplica ${resumo.replica.altura}  ×  original ${resumo.original.altura}`);
if (resumo.replica.erros.length) console.log('ERROS na réplica:', resumo.replica.erros.slice(0, 6));

const chave = (l) => new Map(resumo[l].tipo);
const r = chave('replica');
const o = chave('original');
const todas = new Set([...r.keys(), ...o.keys()]);
console.log('\nestilo (peso|corpo|entrelinha|tracking|caixa)          réplica  original');
for (const k of [...todas].sort()) {
  const a = r.get(k) || 0;
  const b = o.get(k) || 0;
  const marca = a && b ? '  ' : a ? '←só réplica' : '→só original';
  console.log(`${k.padEnd(52)} ${String(a).padStart(4)} ${String(b).padStart(9)}  ${marca}`);
}
await browser.close();
