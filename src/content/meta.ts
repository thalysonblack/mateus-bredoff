import { WORK } from "./work";


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
