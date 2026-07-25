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
src/app/App.tsx            → Hero · About · Cases · Capabilities · Footer
src/app/sections/          → uma seção por arquivo (+ Menu, ConnectButton)
src/assets/optimized/      → imagens WebP servidas em produção
src/assets/fonts/          → Geist + Inter Tight self-hosted (woff2)
scripts/                   → harness de verificação (puppeteer)
```

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
- Cards **Stag** e **Votare** reusam a arte do Ferraci como placeholder (`Cases.tsx`).
- "View Case" não abre nada ainda — não existem páginas de case.
- Nav do footer (Home/Works/About/Archive) aponta para `#`.
