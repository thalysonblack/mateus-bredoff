/**
 * Varre TODAS as rotas do site e prova que cada uma montou de verdade.
 *
 * Existe porque este projeto não roda `tsc` no build: `vite build` transpila e
 * descarta os tipos, então um import quebrado ou uma rota que virou tela branca
 * passa pelo build com `✓ built` e só aparece renderizando. "Compilou" aqui não
 * é evidência de nada.
 *
 * O que conta como MONTOU (as três juntas, senão não vale):
 *   1. altura de documento acima de uma viewport — tela branca mede ~viewport;
 *   2. um `<h1>`/nav do sistema presente — DOM vazio com fundo pintado engana o (1);
 *   3. zero erro de console e zero requisição falhada.
 *
 * Mede também **overflow horizontal**, que é o defeito que mais escapa: a página
 * parece perfeita no desktop e rola de lado no celular. Um elemento que passa
 * da viewport basta, e ele quase nunca é o que se está editando.
 *
 * uso: node scripts/probe-rotas.mjs [origem] [largura]
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGEM = process.argv[2] || 'http://localhost:5174';
const LARGURA = Number(process.argv[3]) || 1440;
const MOBILE = LARGURA < 700;

const ROTAS = [
  '/', '/about', '/work', '/lab',
  '/work/alex-archer', '/work/bureau', '/work/neox', '/work/trivo',
  '/work/stag', '/work/ferraci', '/work/votare',
  '/arquivo/framer', '/arquivo/v2', '/arquivo/a', '/arquivo/b', '/arquivo/c',
  '/arquivo/framer/about', '/arquivo/framer/work', '/arquivo/framer/work/stag',
  '/rota-que-nao-existe',
];

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

let reprovadas = 0;
for (const rota of ROTAS) {
  const page = await browser.newPage();
  const erros = [];
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text().slice(0, 120)); });
  page.on('pageerror', (e) => erros.push('JS: ' + e.message.slice(0, 120)));
  page.on('requestfailed', (r) => erros.push('REQ: ' + r.url().slice(-60)));
  await page.setViewport({
    width: LARGURA, height: MOBILE ? 844 : 900,
    isMobile: MOBILE, hasTouch: MOBILE, deviceScaleFactor: MOBILE ? 2 : 1,
  });

  try {
    await page.goto(ORIGEM + rota, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 2500));

    const m = await page.evaluate(() => ({
      altura: document.body.scrollHeight,
      /* nav do sistema OU título: prova que o componente da rota montou, e não
         só o <main> vazio do Layout com o fundo pintado por CSS */
      nos: document.querySelectorAll('a, h1, h2').length,
      titulo: document.title,
      /* Tolerância de 2px: subpixel de borda não é vazamento. Quem passa disso
         empurra a página de lado — e o culpado costuma ser um elemento com
         margem negativa deliberada (as sangrias do contact sheet), por isso o
         nome do infrator vai junto em vez de só o número. */
      vazaW: document.documentElement.scrollWidth,
      vazam: [...document.querySelectorAll('body *')]
        .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 2)
        .slice(0, 3)
        .map((e) => `${e.tagName}.${String(e.className).slice(0, 40)} → ${Math.round(e.getBoundingClientRect().right)}px`),
    }));

    /* O 404 é curto por desenho — mede pouco mais que uma viewport e ainda
       assim está correto. Piso próprio, senão a única rota que DEVE ser magra
       reprova para sempre e o relatório passa a ser lido como ruído. */
    const piso = rota === '/rota-que-nao-existe' ? 700 : 1200;
    const magro = m.altura < piso || m.nos < 5;
    const vaza = m.vazaW > LARGURA + 2;
    const mal = magro || vaza || erros.length > 0;
    if (mal) reprovadas++;
    console.log(
      `${mal ? '✗' : '✓'} ${rota.padEnd(28)} ${String(m.altura).padStart(6)}px  ${String(m.nos).padStart(3)} nós  "${m.titulo}"`,
    );
    if (magro) console.log(`    ↳ MAGRA: altura ou nós abaixo do piso — rota provavelmente em branco`);
    if (vaza) {
      console.log(`    ↳ VAZA: documento ${m.vazaW}px numa viewport de ${LARGURA}px`);
      m.vazam.forEach((v) => console.log('       · ' + v));
    }
    erros.slice(0, 3).forEach((e) => console.log('    ↳ ' + e));
  } catch (e) {
    reprovadas++;
    console.log(`✗ ${rota.padEnd(28)} ${e.message.slice(0, 80)}`);
  }
  await page.close();
}

await browser.close();
console.log(`\n${ROTAS.length - reprovadas}/${ROTAS.length} rotas de pé`);
process.exit(reprovadas ? 1 : 0);
