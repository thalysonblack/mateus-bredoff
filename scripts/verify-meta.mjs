/**
 * Verifica os metadados POR ROTA — título, description e canonical.
 *
 * ## ⚠ São DOIS testes opostos, e cada um só prova o seu lado
 *
 * **Runtime** (padrão) — lê no DOM, com o app montado. É o único jeito de
 * provar o que o `useMetaRota` escreve. Ler o HTML servido aqui devolveria o
 * `index.html` em todas as rotas e o teste passaria **verde sem provar nada**.
 *
 * **Servido** (`--servido <url>`) — lê o HTML cru, SEM navegador. É o único
 * jeito de provar o pré-render: no DOM não dá para distinguir o que veio no
 * HTML do que o JS escreveu depois, então medir ali aprovaria um build sem
 * pré-render nenhum.
 *
 * Rodar o lado errado é um harness mentindo com cara de aprovação. Os dois usam
 * a MESMA tabela de esperados — os títulos medidos no publicado — porque um
 * teste que deriva a expectativa do código sob teste não testa nada.
 *
 * ⚠ Confere o status HTTP antes de medir. Já se mediu página 404 nesta árvore e
 * o relatório saiu "0 reprovados".
 *
 * uso:
 *   node scripts/verify-meta.mjs [porta]            → runtime, contra `pnpm dev`
 *   node scripts/verify-meta.mjs --servido <url>    → pré-render, contra o build
 *
 * Para o modo servido, sirva o build por HTTP:
 *   cd .prerender-check && python3 -m http.server 4699
 *   node scripts/verify-meta.mjs --servido http://localhost:4699
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const iServido = process.argv.indexOf('--servido');
const SERVIDO = iServido >= 0 ? process.argv[iServido + 1] : null;
const PORTA = process.argv[2] || '5199';
const BASE = SERVIDO || `http://localhost:${PORTA}`;

/* Valores medidos no publicado em 04/08/2026 (HTML servido pelo Framer). */
const ESPERADO = {
  '/': 'Mateus Bredoff',
  '/about': 'Mateus Bredoff',
  '/work': 'Mateus Bredoff',
  '/work/stag': 'Stag - Mateus Bredoff',
  '/work/votare': 'Votare - Mateus Bredoff',
  '/work/alex-archer': 'Alex Archer ® - Mateus Bredoff',
  '/work/trivo': 'Trivo - Mateus Bredoff',
  '/work/ferraci': 'Ferraci - Mateus Bredoff',
  '/work/bureau': 'Bureau - Mateus Bredoff',
  '/work/neox': 'Neox - Mateus Bredoff',
};

/* ---------------------------------------------------------------- servido --
   Sem browser de propósito: `fetch` é exatamente o que um unfurl de link faz.
   As tags do `index.html` são multilinha (`<meta\n name=…`), por isso `\s+` e
   nunca um grep de uma linha só — foi assim que uma checagem minha reportou
   "description ausente" num HTML em que ela estava correta. */
if (SERVIDO) {
  const pega = (html, re) => {
    const m = html.match(re);
    return m ? m[1].replace(/\s+/g, ' ').trim() : null;
  };

  let falhas = 0;
  console.log(`HTML SERVIDO (sem JS) — ${BASE}\n${'-'.repeat(78)}`);
  for (const [rota, titulo] of Object.entries(ESPERADO)) {
    /* Barra final: servidor estático de diretório redireciona `/about` para
       `/about/`; o Vercel serve os dois. `redirect: follow` é o padrão. */
    const resp = await fetch(`${BASE}${rota === '/' ? '/' : `${rota}/`}`);
    const html = await resp.text();
    const t = pega(html, /<title>([^<]*)<\/title>/);
    const d = pega(html, /<meta\s+name="description"\s+content="([^"]*)"/);
    const c = pega(html, /<link rel="canonical" href="([^"]*)"/);
    const og = pega(html, /<meta\s+property="og:title"\s+content="([^"]*)"/);

    const ok =
      resp.status === 200 &&
      t === titulo &&
      og === titulo &&
      !!d &&
      /* A description NÃO pode ser o nome do site: esse é o fallback do Framer
         para campo nunca preenchido, e é justamente o que decidimos não
         replicar. Se algum dia voltar a ser isso, foi regressão. */
      d !== 'Mateus Bredoff' &&
      !!c &&
      c.endsWith(rota === '/' ? '/' : rota);
    if (!ok) falhas++;
    console.log(`${ok ? '✅' : '❌'} ${rota.padEnd(20)} ${resp.status} ${JSON.stringify(t)}`);
    if (!ok) console.log(`     og:title=${JSON.stringify(og)} canonical=${c} desc=${JSON.stringify(d)}`);
  }
  console.log(`\nfalhas: ${falhas}`);
  process.exit(falhas ? 1 : 0);
}

const leMeta = (page) =>
  page.evaluate(() => ({
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.content ?? '(ausente)',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '(ausente)',
    instagram: [...document.querySelectorAll('a')]
      .filter((a) => /instagram/i.test(a.textContent || ''))
      .map((a) => a.getAttribute('href')),
  }));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000 });

let falhas = 0;
console.log('rota                     | status | título');
console.log('-'.repeat(78));

for (const [rota, titulo] of Object.entries(ESPERADO)) {
  const resp = await page.goto(BASE + rota, { waitUntil: 'networkidle0' });
  const status = resp?.status() ?? 0;
  /* O título é escrito num efeito: esperar o app montar, não o primeiro paint. */
  await page.waitForFunction(() => document.title.length > 0);
  await new Promise((r) => setTimeout(r, 250));
  const m = await leMeta(page);
  const okStatus = status === 200;
  const okTitulo = m.title === titulo;
  if (!okStatus || !okTitulo) falhas++;
  console.log(
    `${rota.padEnd(24)} | ${String(status).padEnd(6)} | ${okTitulo ? '✅' : '❌'} ${JSON.stringify(m.title)}${okTitulo ? '' : `  ESPERADO ${JSON.stringify(titulo)}`}`,
  );
  console.log(`${' '.repeat(24)} |        | canonical: ${m.canonical}`);
  console.log(`${' '.repeat(24)} |        | desc: ${m.description.slice(0, 96)}`);
  if (m.instagram.length) console.log(`${' '.repeat(24)} |        | instagram: ${m.instagram.join(' , ')}`);
}

/* --- navegação por dentro + histórico -------------------------------------
   O caso que `goto` não cobre: o título ao VOLTAR. */
console.log('\n--- navegação client-side e histórico ---');
await page.goto(`${BASE}/work/alex-archer`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 400));
const passos = [];
passos.push(['entrada /work/alex-archer', (await leMeta(page)).title]);

/* Clica em "About" na nav do rodapé — link do react-router, sem recarregar. */
await page.evaluate(() => {
  const a = [...document.querySelectorAll('footer a')].find(
    (x) => x.textContent?.trim().endsWith('About'),
  );
  a?.click();
});
await new Promise((r) => setTimeout(r, 600));
passos.push(['clique → /about', (await leMeta(page)).title + ` @ ${new URL(page.url()).pathname}`]);

await page.goBack();
await new Promise((r) => setTimeout(r, 600));
passos.push(['voltar → /work/alex-archer', (await leMeta(page)).title + ` @ ${new URL(page.url()).pathname}`]);

await page.goForward();
await new Promise((r) => setTimeout(r, 600));
passos.push(['avançar → /about', (await leMeta(page)).title + ` @ ${new URL(page.url()).pathname}`]);

for (const [p, v] of passos) console.log(`  ${p.padEnd(28)} → ${v}`);

const tituloAoVoltar = passos[2][1];
if (!tituloAoVoltar.startsWith('Alex Archer ® - Mateus Bredoff')) {
  falhas++;
  console.log('  ❌ o título não voltou junto com o histórico');
}

const erros = await page.evaluate(() => window.__erros ?? []);
console.log(`\nfalhas: ${falhas}${erros.length ? ` | erros de console: ${erros.length}` : ''}`);
await browser.close();
process.exit(falhas ? 1 : 0);
