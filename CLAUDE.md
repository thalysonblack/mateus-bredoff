# Mateus Bredoff — site portfólio

Site de **Mateus Bredoff, brand designer**. Vite + React. Hoje o ramo tem só as
três versões em aprovação e a página que as compara.

## Estado atual (15/10/2026)

O histórico inteiro (direções antigas, `/arquivo/*`, `/v4`, `/v5`, abouts B–H,
lab, material de estudo) saiu deste ramo. Está guardado no ramo
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
src/styles/                  index.css (fonts, system, tokens, tailwind, theme) · base.css + v1.css (V1/V3)
                             · v2-base.css + v2.css (V2) · v3.css, v3-indice.css, v3-heroes.css (V3)
src/assets/                  fonts, logos, optimized (WebP; retrato/ = fotos dele), reel-*.mp4, versoes (capas do /versoes)
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

## Regras deste repo

- **Conteúdo do cliente não se inventa.** Texto, preço, ano e lista de projetos
  vêm do material do Mateus (Behance: `behance.net/mateusbredoff`). Sem o dado, o
  campo fica vazio. Asset mapeado não prova que é obra dele: abra antes de ligar.
- **Contraste se mede no pixel renderizado.** Alvo WCAG AA: 4,5:1 texto, 3:1 texto
  grande e ícone. O token `--dim` passa: 5,0:1 no papel, 5,9:1 na tinta.
- **`mix-blend` morre dentro de stacking context.** Ancestral com `transform`,
  `opacity`, `filter` ou `z-index` + `position` isola o blend e o texto fica chapado.
- **Imagens:** WebP em `src/assets/optimized/`, com variantes no `srcSet`. Nunca o original cru.
- **Fontes são self-hosted** (`src/styles/fonts.css`). Família nova = alias declarado lá.
- **Compare a contagem** ao trocar a fonte de dados de uma lista: uma migração
  antiga derrubou três projetos em silêncio e passou em build e revisão visual.

## Pendências de conteúdo (dependem do Mateus)

- Preços em `content/precos.ts`: só o Essential tem valor publicado por ele.
- O Behance o lista em Germany; o site diz "based in Brazil". Confirmar.
