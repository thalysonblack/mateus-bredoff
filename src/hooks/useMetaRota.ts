import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * Metadados por rota — título, description e canonical.
 *
 * O site é SPA sem SSR, então não existe `<head>` por rota vindo do servidor:
 * cada página declara o seu aqui e o efeito escreve no documento. Isto NÃO
 * resolve crawler que não executa JS (ver a nota no fim); resolve aba do
 * navegador, histórico, bookmark e compartilhamento por dentro do app — que
 * hoje repetem o mesmo texto em todas as nove rotas.
 *
 * ## O padrão do título é do original, não invenção
 *
 * Medido nas nove rotas do publicado (`curl` no HTML servido pelo Framer,
 * ago/2026 — o Framer entrega SSR, então o `<title>` vem no HTML):
 *
 * | rota                  | `<title>`                      |
 * |-----------------------|--------------------------------|
 * | `/`, `/about`, `/work`| `Mateus Bredoff`               |
 * | `/work/stag/`         | `Stag - Mateus Bredoff`        |
 * | `/work/alex-archer/`  | `Alex Archer ® - Mateus Bredoff` |
 * | `/work/<slug>/`       | `<título do CMS> - Mateus Bredoff` |
 *
 * O separador é hífen simples com espaços (` - `), não travessão. O `®` do Alex
 * Archer faz parte do título do item e não recebe tratamento nenhum — por isso
 * o nome vem da coleção em `content/work.ts` e o sufixo mora aqui: uma lista
 * paralela de títulos divergiria da coleção no primeiro case novo.
 *
 * ## ⚠ A description DIVERGE do original, de propósito
 *
 * As nove rotas do publicado servem `<meta name="description" content="Mateus
 * Bredoff">` — o nome do site repetido. Isso é o *fallback* do Framer para
 * "description nunca preenchida", não uma description escrita. Replicar
 * trocaria a description real que este repo já tem (em `index.html`) por um
 * placeholder de builder, e a regra do projeto é não replicar defeito.
 *
 * O valor do original está registrado aqui: se algum dia a decisão for
 * fidelidade literal, é `DESCRICAO_PADRAO = "Mateus Bredoff"` e nada mais muda.
 *
 * ## Restaura no unmount
 *
 * O valor original do documento é capturado UMA vez (ref), não a cada mudança
 * de `slug` — `CaseStudy` não desmonta ao navegar de `/work/stag` para
 * `/work/trivo`, e recapturar guardaria o título do case anterior como se fosse
 * o do documento.
 *
 * ## ⚠ Limite conhecido: sem SSR, isto só existe depois do JS
 *
 * Crawler que não executa JS (e todo unfurl de link — WhatsApp, Slack, X) lê o
 * `index.html` estático e vê o mesmo título e a mesma description em todas as
 * rotas. As tags Open Graph nem são tocadas aqui justamente por isso: reescrever
 * `og:*` em runtime é teatro, quem as lê já foi embora. A correção de verdade é
 * pre-render das nove rotas no build. Fica registrado, não resolvido.
 */

const NOME_DO_SITE = "Mateus Bredoff";

/** ` - `, medido no original. Não é travessão. */
const SEPARADOR = " - ";

/**
 * Valor do `index.html`, mantido em vez do "Mateus Bredoff" que o original
 * serve. Ver a nota acima sobre a divergência deliberada.
 */
const DESCRICAO_PADRAO =
  "Mateus Bredoff is a brand designer building visual identities, packaging and digital products with intent — from strategy to the last detail.";

export type MetaRota = {
  /**
   * Nome da página, SEM o sufixo — o hook compõe `<nome> - Mateus Bredoff`.
   * Omitido nas rotas de casca (`/`, `/about`, `/work`), que no original são só
   * `Mateus Bredoff`.
   */
  titulo?: string;
  /** Omitida cai na description do site. */
  descricao?: string;
};

/** Lê o host do `<link rel="canonical">` do `index.html` — domínio em um lugar só. */
function origemCanonica(): string {
  const tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  try {
    return new URL(tag?.href ?? window.location.href).origin;
  } catch {
    return window.location.origin;
  }
}

function garanteMeta(nome: string): HTMLMetaElement {
  const existente = document.querySelector<HTMLMetaElement>(`meta[name="${nome}"]`);
  if (existente) return existente;
  const nova = document.createElement("meta");
  nova.setAttribute("name", nome);
  document.head.appendChild(nova);
  return nova;
}

export function useMetaRota({ titulo, descricao }: MetaRota) {
  const { pathname } = useLocation();
  /* `useRef(null)` + preenchimento no primeiro efeito: ler `document.title` no
     corpo do componente rodaria a cada render e no StrictMode duplicado. */
  const originais = useRef<{ titulo: string; descricao: string } | null>(null);

  useEffect(() => {
    const metaDescricao = garanteMeta("description");
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!originais.current) {
      originais.current = {
        titulo: document.title,
        descricao: metaDescricao.content,
      };
    }

    document.title = titulo ? `${titulo}${SEPARADOR}${NOME_DO_SITE}` : NOME_DO_SITE;
    metaDescricao.content = descricao ?? DESCRICAO_PADRAO;
    if (canonical) canonical.href = `${origemCanonica()}${pathname}`;

    return () => {
      const antes = originais.current;
      if (!antes) return;
      document.title = antes.titulo;
      metaDescricao.content = antes.descricao;
    };
  }, [titulo, descricao, pathname]);
}
