/**
 * Verifica os metadados POR ROTA — título, description e canonical.
 *
 * Sem SSR, o `<head>` da réplica só existe depois do JS. Ler o HTML servido
 * (curl) devolveria o `index.html` estático em todas as rotas e o teste passaria
 * verde sem provar nada. Por isso a leitura é no DOM, com o app montado.
 *
 * ⚠ Duas navegações são medidas, e as duas importam:
 *   1. **entrada direta** (`page.goto`) — cada rota carregada do zero;
 *   2. **navegação por dentro** (clique no link do rodapé) + `goBack()` — é aqui
 *      que o efeito de rota falha quando o cleanup restaura o título errado, e
 *      é o caso que `goto` NÃO cobre.
 *
 * ⚠ Confere o status HTTP antes de medir. Já se mediu página 404 nesta árvore e
 * o relatório saiu "0 reprovados".
 *
 * uso: node scripts/verify-meta.mjs [porta]
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORTA = process.argv[2] || '5199';
const BASE = `http://localhost:${PORTA}`;

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
