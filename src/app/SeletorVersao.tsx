import { Link, useLocation } from "react-router";

/** Seletor de TODAS as versões de home do site. Só em dev (App monta atrás de import.meta.env.DEV). */
const ROTAS = [
  ["No ar", "/"],
  ["Rolin B", "/v2/rolin-b"],
  ["Rolin C", "/v2/rolin-c"],
  ["Reel", "/v2/reel-full"],
  ["V4", "/v4"],
  ["Visor", "/arquivo/visor"],
  ["Autoral", "/arquivo/autoral"],
] as const;

export default function SeletorVersao() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Versões" style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 9999, display: "flex",
      gap: 2, padding: 4, margin: "0 auto", width: "fit-content", maxWidth: "calc(100vw - 24px)", overflowX: "auto",
      background: "rgba(20,32,31,.86)", backdropFilter: "blur(8px)", borderRadius: 999,
      font: "12px/1 'Geist', system-ui, sans-serif" }}>
      {ROTAS.map(([n, r]) => (
        <Link key={r} to={r} style={{ padding: "6px 10px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap",
          color: pathname === r ? "#14201F" : "#EEECE6", background: pathname === r ? "#EEECE6" : "transparent" }}>{n}</Link>
      ))}
    </nav>
  );
}
