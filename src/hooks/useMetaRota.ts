import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { metaDaRota, tituloCompleto } from "../content/meta";


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
