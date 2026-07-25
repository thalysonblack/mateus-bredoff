# Mateus Bredoff — site portfólio

Site de **Mateus Bredoff, brand designer**. Origem: export do **Figma Make**, recriando
o site publicado em Framer (`mateusbredoff.framer.website`). O artboard escalado original
do Figma (`src/imports/Home.tsx`) foi **aposentado e removido** — cada seção hoje é um
componente React responsivo de verdade.

## Stack e comandos

- Vite 6 + TypeScript + React 18 + Tailwind v4 (`@tailwindcss/vite`) + `motion` (Framer Motion)
- **pnpm** (`pnpm dev` → :5173, `pnpm build` → `dist/`)
- Mora em `~/dev/mateus-bredoff` — **fora de `~/Documents`** de propósito: o iCloud
  despeja os arquivos e o dev server passa a dar ETIMEDOUT.

## Estrutura

```
src/app/App.tsx            → Hero · About · Work · Capabilities · Footer
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
```

Os scripts precisam de `puppeteer-core` (devDep) e do Chrome em `/Applications`.

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

## Pendências de conteúdo (dependem do Mateus)

- Links de contato são **placeholder**: `hello@mateusbredoff.com`, Behance/Instagram/x
  genéricos, WhatsApp `+55 45 9999-9999` (em `Footer.tsx` e `ConnectButton.tsx`).
- Cards **Stag** e **Votare** reusam a arte do Ferraci como placeholder (`Work.tsx`).
- As peças do índice não abrem nada ainda — não existem páginas de case.
- **Capabilities está sem descrição por serviço.** A tabela das referências tem um texto
  curto por linha; aqui ficou só índice + nome, porque o texto teria que ser inventado e
  conteúdo de cliente não se inventa. Pedir os cinco textos ao Mateus.
- O ano `2026` e `Portfolio — Vol. 01` no hero são de composição, não fato apurado.
