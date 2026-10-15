import { Link, useLocation } from "react-router";

/** Seletor V1 · V2 · V3 para o cliente aprovar. Aparece nas rotas das versões e em /versoes (também em produção); em dev, em toda rota. */
const ROTAS = [
  ["All", "/versoes"],
  ["V1", "/v1"],
  ["V2", "/v2"],
  ["V3", "/v3"],
] as const;

export default function SeletorVersao() {
  const { pathname } = useLocation();
  const naVersao = /^\/(v1|v3|versoes)$/.test(pathname) || pathname === "/v2" || /^\/v2\/(about|work)(\/|$)/.test(pathname);
  if (!naVersao && !import.meta.env.DEV) return null;
  const ativa = (r: string) => (r === "/v2" ? pathname === "/v2" || /^\/v2\/(about|work)(\/|$)/.test(pathname) : pathname === r);
  return (
    <nav aria-label="Versões" style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 9999, display: "flex",
      gap: 2, padding: 4, margin: "0 auto", width: "fit-content", maxWidth: "calc(100vw - 24px)", overflowX: "auto",
      background: "rgba(20,32,31,.86)", backdropFilter: "blur(8px)", borderRadius: 999,
      font: "12px/1 'Geist', system-ui, sans-serif" }}>
      {ROTAS.map(([n, r]) => (
        <Link key={r} to={r} style={{ padding: "6px 10px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap",
          color: ativa(r) ? "#14201F" : "#EEECE6", background: ativa(r) ? "#EEECE6" : "transparent" }}>{n}</Link>
      ))}
    </nav>
  );
}
