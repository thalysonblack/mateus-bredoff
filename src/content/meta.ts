import { WORK } from "./work";

/**
 * Metadados por rota — a fonte ÚNICA, lida por dois consumidores.
 *
 *   runtime  → `hooks/useMetaRota.ts`, que escreve no documento a cada rota
 *   build    → `scripts/prerender.mjs`, que gera um HTML por rota no `dist/`
 *
 * Os dois PRECISAM concordar, e por isso nenhum dos dois tem a lista. Antes as
 * descrições viviam soltas nas páginas: funcionava enquanto só o React lia, e
 * teria virado duas verdades no instante em que o build passou a escrever
 * `<head>` também — a aba mostrando uma coisa e o compartilhamento outra.
 *
 * Este módulo é PURO: sem React, sem DOM, sem `window`. É o que permite o
 * script de build carregá-lo direto (via `ssrLoadModule` do Vite, que resolve
 * o import de `work.ts` e das imagens sem eu precisar duplicar nada).
 *
 * ## O padrão do título é do original, medido rota a rota
 *
 * `curl` nas nove rotas do publicado (Framer é SSR, o `<title>` vem no HTML):
 * `/`, `/about` e `/work` são só `Mateus Bredoff`; case é
 * `<título do CMS> - Mateus Bredoff`, com hífen simples e o `®` do Alex Archer
 * intacto. O nome do case sai de `work.ts` — lista paralela de títulos
 * divergiria da coleção no primeiro case novo.
 *
 * ## ⚠ A description DIVERGE do original, de propósito
 *
 * As nove rotas do publicado servem `content="Mateus Bredoff"` — o nome do site
 * repetido. É o *fallback* do Framer para "nunca preenchida", não uma
 * description escrita, e replicar trocaria texto real por placeholder de
 * builder. Mesma família do lorem e do slot de vídeo sem fonte: defeito não se
 * replica. Se a decisão virar fidelidade literal, é trocar `DESCRICAO_PADRAO`
 * por `"Mateus Bredoff"` e apagar os casos especiais — nada mais muda.
 */

/**
 * ⚠ FORMA CANÔNICA DA URL: **sem barra final** (`/work/stag`).
 *
 * Não é preferência, é a forma que o site já produz em todo lugar: é o que o
 * `<Link to={`/work/${slug}`}>` gera, o que aparece na barra de endereço e o
 * que as pessoas copiam. O `canonical` é emitido nessa forma em TODAS as
 * variantes, inclusive no HTML servido em `/work/stag/` — duas URLs com o mesmo
 * conteúdo e canonical divergente é conteúdo duplicado.
 *
 * O pré-render grava as duas formas de arquivo (`<rota>.html` e
 * `<rota>/index.html`) para que o `<head>` certo chegue nas duas URLs em
 * qualquer servidor. Isso é COBERTURA, não indecisão: a forma preferida
 * continua sendo uma só, declarada no canonical.
 *
 * O original serve os cases COM barra (`/work/stag/`). Link antigo indexado
 * continua chegando: a URL responde e aponta o canonical para a forma nova.
 *
 * ⚠ NÃO foi adotado `"trailingSlash": false` no `vercel.json`, que faria o
 * servidor redirecionar a forma com barra para a sem. Seria a versão mais forte
 * da mesma decisão, e é impossível verificar fora do deploy — configuração de
 * roteamento que não se testa e pode derrubar o site inteiro não entra às
 * cegas. Fica como opção, junto da conferência do `rewrites`.
 */
export const NOME_DO_SITE = "Mateus Bredoff";

/** ` - `, medido no original. Não é travessão. */
export const SEPARADOR = " - ";

/** Valor do `index.html`, mantido no lugar do "Mateus Bredoff" do original. */
export const DESCRICAO_PADRAO =
  "Mateus Bredoff is a brand designer building visual identities, packaging and digital products with intent — from strategy to the last detail.";

export type MetaRota = {
  /** Nome da página SEM o sufixo; ausente nas rotas que no original são só o nome do site. */
  titulo?: string;
  descricao: string;
};

/** `Stag` → `Stag - Mateus Bredoff`; sem título → `Mateus Bredoff`. */
export const tituloCompleto = (m: MetaRota) =>
  m.titulo ? `${m.titulo}${SEPARADOR}${NOME_DO_SITE}` : NOME_DO_SITE;

const FIXAS: Record<string, MetaRota> = {
  "/": { descricao: DESCRICAO_PADRAO },
  "/about": {
    descricao:
      "Mateus Bredoff is a multidisciplinary designer focused on visual identities, based in Brazil and working worldwide.",
  },
  "/work": {
    descricao:
      "Selected work by Mateus Bredoff — visual identities, branding and art direction for companies building a clear and memorable presence.",
  },
};

/**
 * A description do case é MONTADA dos campos que o item já tem.
 *
 * Não é resumo do projeto: cinco dos seis cases estão com `contentPending`
 * porque o texto não existe no material do cliente, e inventar narrativa de
 * projeto alheio é o que este repo não faz. Disciplina e ano são fato.
 */
const descricaoDoCase = (item: (typeof WORK)[number]) =>
  `${item.title} — ${item.disciplines.join(", ")}${item.year ? `, ${item.year}` : ""}. Case study by brand designer Mateus Bredoff.`;

/**
 * Resolve QUALQUER pathname. Rota desconhecida e slug inexistente caem no
 * padrão — o 404 não inventa nome de projeto.
 */
export function metaDaRota(pathname: string): MetaRota {
  /* Normaliza a barra final: `/work/stag/` e `/work/stag` são a mesma rota, e o
     original serve os cases COM barra. Sem isto o pré-render e o runtime
     discordariam justamente nas URLs que vêm de fora. */
  const rota = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  const fixa = FIXAS[rota];
  if (fixa) return fixa;

  const slug = rota.startsWith("/work/") ? rota.slice("/work/".length) : null;
  const item = slug ? WORK.find((w) => w.slug === slug) : undefined;
  if (item) return { titulo: item.title, descricao: descricaoDoCase(item) };

  return { descricao: DESCRICAO_PADRAO };
}

/**
 * As rotas que ganham HTML próprio no build.
 *
 * Sai da COLEÇÃO, não de uma lista escrita à mão: case novo em `work.ts` já
 * nasce pré-renderizado. As rotas de `/arquivo/*` ficam fora de propósito —
 * são as direções descartadas, mantidas montáveis para comparação em aba, não
 * páginas do site publicado. Sem HTML próprio elas não aparecem em busca nem
 * em unfurl, que é exatamente o que se quer de material de estúdio.
 */
export const ROTAS_PRERENDER = [
  ...Object.keys(FIXAS),
  ...WORK.map((w) => `/work/${w.slug}`),
];
