# Mateus Bredoff — site portfólio

Site de **Mateus Bredoff, brand designer**. Origem: export do **Figma Make**, recriando
o site publicado em Framer (`mateusbredoff.framer.website`). O artboard escalado original
do Figma (`src/imports/Home.tsx`) foi **aposentado e removido** — cada seção hoje é um
componente React responsivo de verdade.

## Arquitetura de motion e scroll

Dois sistemas, responsabilidade única, boot em ordem fixa — **scroll antes de
motion**. Não existe sistema de navegação (Barba e afins): o site é uma página
só, e roteador para uma rota é arquitetura sem função.

```
src/lib/lenis.ts          dono ÚNICO do scroll
src/lib/gsap.ts           registro de plugins + defaults do projeto
src/animations/reveal.ts  o gesto, sem saber que React existe
src/hooks/useReveal.ts    ciclo de vida React → animação
```

Regras que este projeto já pagou para aprender:

- **Um relógio só.** O Lenis anda no ticker do GSAP, nunca num `rAF` próprio, e
  quem precisa da posição de scroll ouve o evento do Lenis — não
  `window.scrollY`. O marquee nasceu com rAF próprio + `window.scrollY` e virou
  defeito no instante em que o Lenis entrou.
- **Guarde a referência do ticker.** `gsap.ticker.remove()` só funciona com a
  mesma função que entrou no `add`; callback inline entra e nunca sai.
- **Nunca `window.scrollTo`.** Use `scrollToTop()` de `lib/lenis.ts`.
- **`document.fonts.ready` antes de qualquer SplitText.** As fontes são
  self-hosted; se a webfont chega depois, as linhas foram medidas com a métrica
  do fallback e a máscara corta no meio da altura-x.
- **Texto splitado precisa de `aria-label` no pai + `aria-hidden` nas linhas**, e
  de `revert()` no cleanup — sem isso o leitor de tela recita fragmentos e cada
  remount empilha divs, matando a seleção de texto.
- **O que é revelado começa oculto por `.js [data-reveal]`**, nunca por CSS puro:
  se o bundle falhar, o texto tem que continuar legível.
- `data-*` para hook de animação; classe é só estilo.

### ⚠ `window.scrollTo` não dispara ScrollTrigger com Lenis no comando

Vale para QUALQUER verificação deste repo. Com o scroll interpolado,
`window.scrollTo` não move o Lenis, o ScrollTrigger não recebe update e o reveal
fica congelado no estado inicial — o teste acusa "animação parada" num site que
funciona. Role com `page.mouse.wheel`. Foi assim que o primeiro passe de
verificação se enganou; `scripts/verify-motion.mjs` já tem o jeito certo.

**Motion se prova medindo.** Leia a propriedade animada em vários instantes e
mostre a série. Prova aceita para o reveal do título (scroll real, desktop):
`136.2 → 91 → 59.2 → 35.3 → 16.3 → 8.2 → 3.3 → 0.8 → 0.1 → 0` — dez valores
distintos, a desaceleração do `power3.out`. Dois valores só provariam um salto.

## Stack e comandos

- Vite 6 + TypeScript + React 18 + Tailwind v4 (`@tailwindcss/vite`)
- **GSAP 3.15** (ScrollTrigger + SplitText, ambos no pacote público desde a
  3.13) + **Lenis** para scroll. `motion` (Framer Motion) ainda opera reveals
  antigos em algumas seções — a migração para o reveal por máscara é gradual, e
  seção nova já nasce no `useReveal`.
- **pnpm** (`pnpm dev` → :5173, `pnpm build` → `dist/`)
- Mora em `~/dev/mateus-bredoff` — **fora de `~/Documents`** de propósito: o iCloud
  despeja os arquivos e o dev server passa a dar ETIMEDOUT.

## Estrutura

```
src/app/App.tsx            → Hero · About · Work · Capabilities · AI Lab · Pricing · Footer
src/app/system.tsx         → primitivas do sistema (Rule, Mono, Bracket, SectionHead…)
src/styles/system.css      → tokens, blocos .on-ink / .on-paper, escalas de tipo
src/app/sections/          → uma seção por arquivo (+ Menu = barra de metadados)
src/assets/optimized/      → imagens WebP servidas em produção
src/assets/fonts/          → Geist + Inter Tight + Martian Mono self-hosted (woff2)
scripts/                   → harness de verificação (puppeteer)
```

## Direção de design (branch `estilo-editorial`)

A página se apresenta como **documento técnico**, não como layout — direção
tirada das referências TITARVL / WIDE ANGLE® / All In®. As regras do sistema:

- **Dueto de fontes.** Inter Tight (display) em CAIXA ALTA, tracking -0.04em,
  para título e frase-manifesto. **Martian Mono** 11–12px para *todo* o resto:
  nav, rótulo, legenda, índice, metadado. Parágrafo de corpo é `.t-body`
  (grotesca 16px, caixa mista) — caixa alta em 40 palavras não se lê.
- **Monocromático.** Só preto, branco e um cinza. Sem acento, sem matiz. Os
  blocos alternam `.on-ink` e `.on-paper` de sangria a sangria; o contraste é o
  ritmo da página.
- **Raio zero, fio de 1px, sangria.** Sem canto arredondado, sem sombra, sem
  pílula. Lista é tabela de registros: índice no topo-esquerdo, fio separando.
- **Vernáculo:** índice de 3 dígitos (`001`), ação entre colchetes com letras
  abertas (`[ S C R O L L ]`), legenda técnica sob cada mídia (índice à
  esquerda, nome à direita, na largura da imagem), relógio ao vivo com GMT.

**Seção nova usa as primitivas de `src/app/system.tsx`** — não recria a
aparência delas na mão, senão o sistema vira dialeto.

O trabalho é um **índice escalonado** (`Work.tsx`), não um carrossel.

**Cada seção usa uma estrutura diferente, de propósito.** Quatro seções são
listas, e se todas fossem a mesma pilha de linhas a página leria como o mesmo
bloco repetido quatro vezes. A regra: ao criar seção nova, escolha uma estrutura
que ainda não está em uso.
- `About` → bloco pareado em duas colunas (as duas metades de uma ideia)
- `Work` → índice escalonado com legenda de contact sheet
- `Capabilities` → pilha de linhas, nome em display, índice à esquerda
- `AILab` → tabela com **cabeçalho de coluna** (nº / brand / discipline / medium)
- `Pricing` → linha de recibo: nome e preço nos cantos opostos, letra miúda embaixo

**A About já foi tabela de registros e foi reprovada.** Cada parágrafo era uma
linha (índice + título + corpo em 54ch + `1fr` vazio) separada por fio. Dois
problemas: sobrava ~40% de largura morta à direita, e o fio no meio lia os dois
parágrafos como itens sem relação, quando são as duas metades da mesma ideia.
Não volte para aquele formato.

**Órfãos nesta branch:** `Cases.tsx` (motor de carrossel) e `ConnectButton.tsx`
(pílula "Menu" que abria o painel de contato) continuam no disco mas ninguém os
importa — não entram no bundle. Ficaram para consulta; o contato agora vive na
barra de metadados e no rodapé. A versão fiel ao Framer está inteira na `main`.

## Verificação (use antes de dizer que está pronto)

Não confie em olhar o código — este projeto já escondeu três bugs que só aparecem
renderizando. Suba o build e rode o harness:

```bash
pnpm build
cd dist && python3 -m http.server 4599 &
node scripts/shoot-desktop.mjs   # 5 seções + fontes carregadas + erros de console
node scripts/shoot-mobile.mjs    # 390×844 + varredura de overflow horizontal
node scripts/probe-cases.mjs     # navega até o card claro (pior caso de contraste)
node scripts/audit-contrast.mjs  # contraste de TODO texto, medido no pixel
```

Os scripts precisam de `puppeteer-core` (devDep) e do Chrome em `/Applications`.
Rodam da raiz do repo — `puppeteer-core` não resolve de `/tmp`.

### `audit-contrast.mjs` — leia antes de confiar no número

Mede o contraste de cada nó de texto recortando a caixa da linha renderizada e
lendo os pixels (PNG → RGB cru via `ffmpeg`). Passa `--` uma URL como argumento
para auditar outra origem. Três erros de método que ele já cometeu e agora
evita — se você mexer nele, não os reintroduza:

1. **Não infle o recorte.** Um padding de 1px vaza o fundo de fora do elemento
   e o medidor devolve 21:1 para tudo.
2. **Recorte a caixa do texto (`Range.getClientRects`), não a bbox do
   elemento.** A bbox inclui padding e encosta na borda do bloco.
3. **Não faça trim simétrico de percentil.** Glifo de mono fino ocupa bem menos
   de 1% da área do recorte; um trim de 1,5% descarta o texto e mede o
   antialiasing — foi assim que branco-sobre-preto "mediu" 2:1. O método atual é
   moda = fundo, extremo oposto = texto, trim de 0,2%.
4. **Espere o reveal do Motion.** `animation:none` não segura Framer Motion (ele
   anima por WAAPI/rAF). Medir logo após o scroll pega o texto em opacity 0 —
   na primeira rodada 46 de 67 nós saíram como falso "invisível". Hoje espera
   900ms e **re-lê a caixa** depois (o reveal desloca em Y).

O campo `inkPixels` é a válvula de segurança: `0` significa que nada de texto
pintou no recorte, então a medida vai para `unmeasured` — nunca conta como
aprovação. **Calibre depois de qualquer mudança:** há uma página de aferição com
pares de contraste conhecidos (21,00 / 6,44 / 4,54 / 2,30) descrita no histórico
do repo; o medidor tem de reproduzir esses valores antes de você acreditar nele.

## Armadilhas deste repo (todas custaram caro)

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
- As peças do índice não abrem nada ainda — não existem páginas de case.
- **Capabilities está sem descrição por serviço.** A tabela das referências tem um texto
  curto por linha; aqui ficou só índice + nome, porque o texto teria que ser inventado e
  conteúdo de cliente não se inventa. Pedir os cinco textos ao Mateus.
- O ano `2026` e `Portfolio — Vol. 01` no hero são de composição, não fato apurado.
