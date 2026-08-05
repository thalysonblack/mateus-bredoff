import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { metaDaRota, tituloCompleto } from "../content/meta";

/**
 * Escreve os metadados da rota atual no documento.
 *
 * **Não recebe argumento**: o que cada rota declara mora em `content/meta.ts`,
 * que o script de pré-render também lê. Antes cada página passava o seu texto
 * aqui — o que funcionava enquanto só o React escrevia o `<head>`, e viraria
 * duas verdades assim que o build passou a escrever também.
 *
 * ## O que este hook NÃO faz, e por quê
 *
 * Não toca em `og:*`. Quem lê Open Graph é unfurl de link (WhatsApp, Slack, X)
 * e crawler — ninguém que execute JS. Reescrever OG em runtime é teatro: quem
 * ia ler já leu o HTML servido e foi embora. Por isso `og:*` é responsabilidade
 * do **pré-render** (`scripts/prerender.mjs`), que escreve no HTML estático.
 *
 * O que sobra aqui é o que só existe depois do JS e só serve a quem está com o
 * navegador aberto: título da aba, entrada de histórico, bookmark — e o
 * canonical, que apontava para a home em todas as rotas.
 *
 * ## Restaura no unmount
 *
 * O valor original do documento é capturado UMA vez (ref), não a cada mudança
 * de `slug`: `CaseStudy` não desmonta ao navegar de `/work/stag` para
 * `/work/trivo`, e recapturar guardaria o título do case anterior como se fosse
 * o do documento.
 */

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

export function useMetaRota() {
  const { pathname } = useLocation();
  /* `useRef(null)` + preenchimento no primeiro efeito: ler `document.title` no
     corpo do componente rodaria a cada render e no StrictMode duplicado. */
  const originais = useRef<{ titulo: string; descricao: string } | null>(null);

  useEffect(() => {
    const metaDescricao = garanteMeta("description");
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!originais.current) {
      originais.current = { titulo: document.title, descricao: metaDescricao.content };
    }

    const meta = metaDaRota(pathname);
    document.title = tituloCompleto(meta);
    metaDescricao.content = meta.descricao;
    if (canonical) canonical.href = `${origemCanonica()}${pathname}`;

    return () => {
      const antes = originais.current;
      if (!antes) return;
      document.title = antes.titulo;
      metaDescricao.content = antes.descricao;
    };
  }, [pathname]);
}
