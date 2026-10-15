/**
 * Pré-render de METADADOS — um HTML por rota, com o `<head>` já certo.
 *
 * Roda depois do `vite build` (está no script `build` do `package.json`).
 *
 * ## Por que só o `<head>`, e não o DOM inteiro
 *
 * O buraco que isto fecha é nomeável: **sem SSR, `<title>`, `description`,
 * `canonical` e `og:*` só existem depois do JS.** Quem lê Open Graph — unfurl
 * de link no WhatsApp, Slack, X — não executa JS nenhum: lê o HTML servido e
 * vai embora. Hoje as nove rotas serviriam o mesmo `index.html`, e todo link
 * compartilhado apareceria como a home.
 *
 * Snapshot do DOM inteiro (puppeteer no build) resolveria isso E daria texto
 * indexável, mas traz problemas que não estavam no pedido: HTML de centenas de
 * KB por rota, estado do Lenis e do GSAP congelado em `style` inline, e
 * snapshot que envelhece calado quando alguém muda um componente sem rebuildar
 * na ordem certa. O `<head>` correto é o que resolve o problema declarado, e
 * o `<body>` continua sendo o `<div id="root">` que o React preenche — a página
 * renderiza exatamente como antes.
 *
 * ## Fonte única
 *
 * As rotas e os textos vêm de `src/content/meta.ts`, o MESMO módulo que o
 * `useMetaRota` lê em runtime. Carregado aqui pelo `ssrLoadModule` do Vite, que
 * resolve o import de `work.ts` e das imagens sem eu precisar reimplementar
 * nada — por isso não há dependência nova e não há segunda lista de rotas.
 *
 * ## ⚠ Toda substituição é verificada
 *
 * Cada tag trocada é conferida: se um padrão não casar (alguém renomeou a tag
 * no `index.html`), o script **falha em voz alta** em vez de gerar HTML com
 * metadado velho. Substituição silenciosa que não substitui nada é o defeito
 * clássico deste tipo de script — o build passa verde e o `<head>` é o antigo.
 */
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
/* Diretório do build por argumento (padrão `dist`): é o que permite verificar
   num diretório próprio quando outra sessão está com `vite preview` servindo o
   `dist/` — rebuildar ali por baixo dela troca o que ela está medindo. */
const DIST = resolve(RAIZ, process.argv[2] || 'dist');
const MODELO = join(DIST, 'index.html');

if (!existsSync(MODELO)) {
  console.error(`✗ ${MODELO} não existe — rode o \`vite build\` antes.`);
  process.exit(1);
}

/* Carrega o módulo de metadados através do Vite: ele já sabe resolver o
   TypeScript e os imports de `.webp` que `work.ts` faz. */
const servidor = await createServer({
  root: RAIZ,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { ROTAS_PRERENDER, metaDaRota, tituloCompleto } =
  await servidor.ssrLoadModule('/src/content/meta.ts');
await servidor.close();

const html = readFileSync(MODELO, 'utf8');

/* O domínio sai do canonical do próprio `index.html` — um lugar só. */
const ORIGEM = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]?.replace(/\/$/, '');
if (!ORIGEM) {
  console.error('✗ `<link rel="canonical">` não encontrado no index.html — sem ele não sei o domínio.');
  process.exit(1);
}

const escapa = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function troca(fonte, rotulo, padrao, valor) {
  let casou = false;
  const novo = fonte.replace(padrao, (_m, antes, depois) => {
    casou = true;
    return `${antes}${escapa(valor)}${depois}`;
  });
  if (!casou) {
    throw new Error(
      `padrão não casou para "${rotulo}" — o index.html mudou de forma e este script ficaria trocando nada. Ajuste o padrão.`,
    );
  }
  return novo;
}

let escritas = 0;
for (const rota of ROTAS_PRERENDER) {
  const meta = metaDaRota(rota);
  const titulo = tituloCompleto(meta);
  const url = `${ORIGEM}${rota === '/' ? '/' : rota}`;

  let saida = html;
  saida = troca(saida, 'title', /(<title>)[^<]*(<\/title>)/, titulo);
  saida = troca(saida, 'description', /(<meta\s+name="description"\s+content=")[^"]*(")/, meta.descricao);
  saida = troca(saida, 'canonical', /(<link rel="canonical" href=")[^"]*(")/, url);
  saida = troca(saida, 'og:title', /(<meta property="og:title" content=")[^"]*(")/, titulo);
  saida = troca(saida, 'og:description', /(<meta\s+property="og:description"\s+content=")[^"]*(")/, meta.descricao);
  saida = troca(saida, 'og:url', /(<meta property="og:url" content=")[^"]*(")/, url);
  saida = troca(saida, 'twitter:title', /(<meta name="twitter:title" content=")[^"]*(")/, titulo);
  saida = troca(saida, 'twitter:description', /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, meta.descricao);

  /* `/about` → `dist/about/index.html`. É o formato que o Vercel serve pelo
     filesystem, e o `python3 -m http.server` do harness também.

     A `/` sobrescreve o PRÓPRIO `dist/index.html`, e isso é de propósito por
     dois motivos: ele é a home, e é também o fallback do SPA para toda rota sem
     HTML próprio (slug inexistente, `/v2`). Nos dois papéis o certo é o título
     da home — `Mateus Bredoff`, sem sufixo, como o original serve. Deixá-lo
     intocado manteria no ar o `Mateus Bredoff — Brand Designer` do arquivo de
     origem, que é título de conveniência do dev e não bate com o publicado. */
  const destino =
    rota === '/' ? MODELO : join(DIST, rota.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, saida);
  escritas++;

  /* ⚠ AS DUAS FORMAS DA URL, e é isto que faltava.
     Só `<rota>/index.html` significa que o HTML pré-renderizado chega em
     `/work/stag/` e NÃO em `/work/stag` — e a forma sem barra é a que circula:
     é o que o `<Link>` gera, o que aparece na barra de endereço e o que as
     pessoas copiam. O `<head>` correto estava chegando na minoria dos acessos,
     sem sintoma nenhum, porque a página renderiza igual dos dois jeitos.

     Escrever `<rota>.html` ao lado cobre servidor que resolve por extensão
     (`cleanUrls` do Vercel) e servidor que resolve por diretório. Custa um
     arquivo pequeno por rota e não depende de acertar a configuração de
     `trailingSlash` de um ambiente que só o deploy revela.

     O canonical continua APONTANDO PARA UMA FORMA SÓ — duas URLs servindo o
     mesmo conteúdo sem canonical concordante é conteúdo duplicado. */
  if (rota !== '/') {
    const semBarra = join(DIST, `${rota.replace(/^\//, '')}.html`);
    mkdirSync(dirname(semBarra), { recursive: true });
    writeFileSync(semBarra, saida);
  }

  console.log(`  ${rota.padEnd(22)} → ${titulo}`);
}

console.log(
  `\n✓ ${escritas} rotas pré-renderizadas em ${DIST.replace(RAIZ + '/', '')}/ (+ index.html, que é a home E o fallback do SPA)`,
);
