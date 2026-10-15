# Mateus Bredoff — site portfólio

Site de **Mateus Bredoff, brand designer**. Vite + React. Hoje o ramo tem só as
três versões em aprovação e a página que as compara.

## Estado atual (15/10/2026)

O histórico inteiro (direções antigas, `/arquivo/*`, `/v4`, `/v5`, abouts B–H,
lab, réplica do Framer, `_refs/`) saiu deste ramo. Está guardado no ramo
**`arquivo/versoes-antigas`** e na tag **`arquivo-2026-10-15`**. Para consultar:
`git show arquivo-2026-10-15:<caminho>`.

## Rotas

```
/  e  /v1          V1 — o site no ar (home com visor fluido)
/about             V1 — about
/work              V1 — índice de trabalhos
/work/:slug        V1 — case (um componente para todos os slugs)
/v2                V2 — home
/v2/about          V2 — about
/v2/work           V2 — índice
/v2/work/:slug     V2 — case
/v3                V3 — home aberta pelo reel
/versoes           as três versões lado a lado, para aprovação
*                  cai no case da V1, que trata o 404
```

O pré-render (`scripts/prerender.mjs`) gera o `<head>` de `/`, `/about`,
`/work` e de cada `/work/:slug`, a partir de `src/content/meta.ts`.

## Pastas

```
src/app/App.tsx              rotas + RouteLifecycle (leia o comentário antes de mexer)
src/app/v1/                  Home, About, Work, Case, HoverColuna, WorkCartoes, useRevelar
src/app/v2/                  Home, About, Work (índice + case), Moldura, FechamentoAbout, Letreiro, gl.ts
src/app/v3/                  Home (reel), Indice, Heroes, NomeObra
src/app/compartilhado/       sistema (Prancha, usado por V1 e V3), HoverFluido, useRevelacaoPalavra,
                             TransicaoRota, SeletorVersao, Versoes (/versoes)
src/content/                 work, pecas, about, servicos, reconhecimento, reel, lab, cores, meta, contato, precos
src/lib/                     lenis, gsap, visorFluido (+ .glsl), arquivoWebGL, cartoesWebGL
src/hooks/useMetaRota.ts     título/description por rota
src/styles/                  index.css (fonts, system, framer, tailwind, theme) · base.css + v1.css (V1/V3)
                             · v2-base.css + v2.css (V2) · v3.css, v3-indice.css, v3-heroes.css (V3)
src/assets/                  fonts, logos, optimized (WebP), reel-*.mp4, versoes (capas do /versoes)
scripts/                     prerender, verify-meta, verify-prod, shoot-page, prints-rotas
```

As classes CSS da V2 ainda usam os prefixos `rc-`, `rl-` e `rcf-`. São só nomes.

## Motion e scroll

- **Lenis é o dono único do scroll** e anda no ticker do GSAP. Quem precisa da
  posição ouve o evento do Lenis, nunca `window.scrollY`.
- **Nunca `window.scrollTo`.** Use `scrollToTop()` de `lib/lenis.ts`. Em teste,
  role com `page.mouse.wheel`: `scrollTo` não move o Lenis e o ScrollTrigger fica parado.
- `gsap.ticker.remove()` só funciona com a mesma função do `add`.
- `document.fonts.ready` antes de qualquer SplitText.
- Texto splitado: `aria-label` no pai, `aria-hidden` nas linhas, `revert()` no cleanup.

## Stack e comandos

- Vite 6 + React 18 + Tailwind v4 + GSAP 3.15 + Lenis + ogl (WebGL). pnpm.
- `pnpm dev` (:5173) · `pnpm build` (vite build + pré-render) · `pnpm install --frozen-lockfile`.

## Verificação

```bash
pnpm build && npx vite preview --port 4173 &
node scripts/prints-rotas.mjs http://localhost:4173 /caminho/prints   # 11 rotas × 1440/390 × 3 + erros de console
node scripts/verify-meta.mjs --servido http://localhost:4173            # head por rota
```

Para provar que uma mudança não alterou nada visível: gere os prints antes e
depois e compare pixel a pixel (diferença média ≤ 1/255 por print).

## Armadilhas deste repo (todas custaram caro)

### 🚨 As "peças de case" baixadas do Framer são STOCK DO TEMPLATE, não obra dele

`midia-framer.json` mapeia 29 assets do grupo `peca-case` — 7 em `/work/stag/`,
5 em `/work/trivo/`, 4 em `/work/ferraci/` — e eles estão otimizados e
commitados em `src/assets/optimized/framer/`. É tentador ligá-los em
`content/work.ts` e ver seis cases magros virarem cases inteiros de uma vez: o
inventário bate, o manifesto diz a rota e a posição de cada um, e a alteração é
mecânica.

**Não ligue.** Abra as imagens antes. São renders genéricos do template que ele
usou — anel de joia, um Porsche, controle de Xbox, mala Rimowa, uma bolsa
**Gucci**, retrato de moda, musgo. Ligar isso publicaria produto de terceiro
como portfólio do Mateus, com nome de projeto por baixo.

É exatamente por isso que aqueles cases estão publicados com **lorem ipsum** no
Framer: a página inteira é template não preenchido, imagem inclusive. Os cases
magros não são uma migração incompleta — são a medida honesta do material que
existe. Eles enchem quando o Mateus mandar as peças, e não antes.

**A regra geral:** neste repo, inventário nunca autoriza publicação. Um asset
mapeado prova que ele estava no HTML do original, não que seja obra do cliente.
Antes de ligar arte que você não viu, monte uma folha de contato e OLHE —
`ffmpeg` monta uma com `tile` (⚠ o `ffmpeg` daqui não tem `drawtext`, então o
rótulo não entra na imagem: fixe a ordem dos arquivos e leia por posição).

**`mix-blend` morre dentro de stacking context.** O spec do Figma pinta vários textos
de branco com `mix-blend-difference/exclusion`, contando com a inversão contra o fundo.
Se qualquer ancestral tiver `transform`, `opacity`, `filter` ou `z-index` + `position`,
o blend fica isolado e o texto renderiza **branco chapado**. Já aconteceu duas vezes:
a nav do Cases (medida em 1.01:1, invisível) e o nome do projeto nos cards claros (1.42:1).
Ao mexer em qualquer coisa com blend, **meça o contraste no pixel renderizado**, não no olho.

**Contraste é medido, não estimado.** Alvo WCAG AA: 4.5:1 texto normal, 3:1 texto grande
e ícone. As cores dim do Figma (branco@30%, `#5e686c`) ficam abaixo disso no fundo escuro.
Vale igual para referência: o cinza da família TITARVL é `#a7a7a7`, que mede **2,3:1**
sobre branco. Copiar referência não copia contraste — o token `--dim` mantém o papel do
cinza (estado quieto) com valor que passa: 5,0:1 no papel, 5,9:1 na tinta. Não afrouxe.

**Tipo que sangra de borda a borda não se dimensiona com `calc` afinado no glifo.**
O nome do hero usa `.hero-name` (11.4vw no mobile, 12.35vw no desktop). Um `calc` com a
razão largura/corpo da fonte embutida preenche perfeito — e estoura a linha no dia em que
a webfont não carregar e a métrica do fallback for outra. A calha pesa proporcionalmente
muito mais no mobile; por isso são dois passos e não um valor só.

**Carrossel do Cases dimensiona pelo eixo transversal.** O card é calculado a partir da
_altura_ da seção; em portrait isso gera um card 2,4× mais largo que a tela e o label
sai de vista. `MAX_CARD_VIEWPORT_FRACTION` limita pelo eixo de scroll — não remova.

**Imagens.** Os PNGs originais do Figma Make eram 4096px / 17MB no total. As versões
servidas são WebP em `src/assets/optimized/` (~820KB no total), geradas com `cwebp`.
Se entrar arte nova, gere as variantes e ligue no `srcSet` — nunca importe o PNG cru.

**Fontes são self-hosted.** Antes eram `@import` do Google Fonts + `src: local('Geist')`,
o que só renderizava certo em máquina com a Geist instalada. Os aliases que o export do
Figma usa (`font-['Geist:Regular']`, `Inter_Display:Medium`) estão declarados em
`src/styles/fonts.css` apontando para os woff2 locais. Se aparecer nome de família novo
no código, declare o alias lá também.

## Portfólio oficial dele (fonte da verdade: `behance.net/mateusbredoff`)

Levantado em 25/07/2026. **São oito projetos publicados**, e o site só mostra
quatro — três deles com arte emprestada de outro projeto:

| Projeto | id Behance |
|---|---|
| Bureau | 250723539 |
| Alex Archer | 245777185 |
| Stag Grid — Fashion Editorial | 243272967 |
| Neox | 247842007 |
| Trivo — Visual Identity | 230919699 |
| Votare — Visual Identity | 237665389 |
| Bentofolio® | 186007543 |
| Bentofolio 2 | 198045839 |

Fatos do perfil que **contradizem o site** e precisam de decisão:
- O Behance o lista em **Germany** ("Senior Designer in Germany"), e o cabeçalho
  dele diz "from Brazil working worldwide". O site afirma "based in Brazil" e
  estampa `BRAZIL — GMT−3` no relógio da barra de metadados. Um dos dois está
  errado — perguntar antes de mexer.
- Ele **já publica preço**: serviço "Visual Identity, de US$ 2.500". O site
  ainda diz "On request" nos três pacotes.
- **Não existe projeto "Ferraci" no Behance.** O card `Ferraci` do site mostra a
  arte do *Stag Grid* (máscara de cervo dourada) e o card `Stag` mostra um livro
  com "FERRACI" impresso. Os arquivos em `src/assets/optimized/` estão com nome
  cruzado na origem: `case-stag-*.webp` é o livro, `case-ferraci-*.webp` é o
  cervo. Corrigir mapeando no código, não renomeando às cegas.
- `Trivo` tem matéria publicada no **World Brand Design** — prova social que o
  site não usa.

## Pendências de conteúdo (dependem do Mateus)

- Links de contato são **placeholder**: `hello@mateusbredoff.com`, Behance/Instagram/x
  genéricos, WhatsApp `+55 45 9999-9999` (em `Footer.tsx` e `ConnectButton.tsx`).
- Cards **Stag** e **Votare** reusam a arte do Ferraci como placeholder (`Work.tsx`).
- **Os três preços do `Pricing.tsx` estão como `priceFrom: null`**, o que rende
  "On request" na tela. Preço é fato do cliente: pedir os três números ao Mateus
  e trocar o `null` pelo valor em reais (o formatador cuida do resto). Se o
  posicionamento virar internacional, `CURRENCY` vira `"USD"`.
- **A lista do `AILab.tsx` foi lida das artes do `@sir.bredoff`, não de uma lista
  que o Mateus mandou.** Confirmar com ele: grafia (`Hōki` com mácron), a
  disciplina e o meio de cada experimento, e se falta algum. `FLORA` ficou fora
  porque `@florafaunaai` é parceria real, não ficção. A bio dele hoje diz
  "Brand Designer, Art Director & AI Creative" e "Designer at @designwithblink".
- **`Proxima` está fora de `content/work.ts`.** Existe no CMS do Framer, mas não
  tem case no Behance nem arte própria — a capa dela aqui era a arte da Trivo,
  emprestada. Com a Trivo de volta no índice, a mesma imagem apareceria com dois
  nomes. Pedir a peça ao Mateus para reativar. (A Trivo, ao contrário, VOLTOU:
  página vazia no Framer não é ausência de trabalho, o case existe no Behance.)
- **A coleção tem 7 itens, como o índice da home.** Se você trocar a fonte de
  dados de alguma lista, COMPARE a contagem antes e depois: a migração para
  `content/work.ts` derrubou Bureau, Neox e Trivo em silêncio e passou em build,
  render e revisão visual com três projetos a menos.
- **Capabilities está sem descrição por serviço.** A tabela das referências tem um texto
  curto por linha; aqui ficou só índice + nome, porque o texto teria que ser inventado e
  conteúdo de cliente não se inventa. Pedir os cinco textos ao Mateus.
- O ano `2026` e `Portfolio — Vol. 01` no hero são de composição, não fato apurado.
