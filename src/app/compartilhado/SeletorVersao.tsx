import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getLenis } from "../../lib/lenis";
import "../../styles/seletor.css";

/** Seletor V1 · V2 · V3 para o cliente aprovar. Aparece nas rotas das versões e em /versoes (também em produção); em dev, em toda rota. */
const ROTAS = [
  ["All", "/versoes"],
  ["V1", "/v1"],
  ["V2", "/v2"],
  ["V3", "/v3"],
] as const;

export default function SeletorVersao() {
  const { pathname } = useLocation();
  const oculto = useOcultoAoDescer(pathname);
  const naVersao = /^\/(v1|v3|versoes)$/.test(pathname) || pathname === "/v2" || /^\/v2\/(about|work)(\/|$)/.test(pathname);
  if (!naVersao && !import.meta.env.DEV) return null;
  const ativa = (r: string) => (r === "/v2" ? pathname === "/v2" || /^\/v2\/(about|work)(\/|$)/.test(pathname) : pathname === r);
  return (
    <nav aria-label="Versões" className={`seletor-versao${oculto ? " is-oculto" : ""}`} style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 9999, display: "flex",
      gap: 2, padding: 4, margin: "0 auto", width: "fit-content", maxWidth: "calc(100vw - 24px)",
      background: "rgba(20,32,31,.86)", backdropFilter: "blur(8px)", borderRadius: 999,
      font: "12px/1 'Geist', system-ui, sans-serif" }}>
      {ROTAS.map(([n, r]) => (
        <Link key={r} to={r} style={{ padding: "6px 10px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap",
          color: ativa(r) ? "#14201F" : "#EEECE6", background: ativa(r) ? "#EEECE6" : "transparent" }}>{n}</Link>
      ))}
    </nav>
  );
}

/* Some ao descer e volta ao subir; sempre visível no topo e no fim da página.
   Ouve o Lenis; sem Lenis (movimento reduzido), o scroll nativo. */
function useOcultoAoDescer(pathname: string) {
  const [oculto, setOculto] = useState(false);
  useEffect(() => {
    setOculto(false);
    let ultimo = 0;
    const ler = () => {
      const lenis = getLenis();
      const y = lenis ? lenis.scroll : window.scrollY;
      const fim = lenis ? lenis.limit : document.documentElement.scrollHeight - window.innerHeight;
      if (y < 80 || y > fim - 80) setOculto(false);
      else if (Math.abs(y - ultimo) > 4) setOculto(y > ultimo);
      ultimo = y;
    };
    const lenis = getLenis();
    if (lenis) return lenis.on("scroll", ler);
    window.addEventListener("scroll", ler, { passive: true });
    return () => window.removeEventListener("scroll", ler);
  }, [pathname]);
  return oculto;
}
