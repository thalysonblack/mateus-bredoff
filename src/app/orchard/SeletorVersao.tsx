import { Link, useLocation } from "react-router";

/** Seletor A · B · C das versões Orchard. Só em dev (App monta atrás de import.meta.env.DEV). */
const ROTAS = [["A", "/"], ["B", "/b"], ["C", "/c"]] as const;

export default function SeletorVersao() {
  const { pathname } = useLocation();
  if (!ROTAS.some(([, r]) => r === pathname)) return null;
  return (
    <nav aria-label="Versões" style={{ position: "fixed", right: 12, bottom: 12, zIndex: 9999, display: "flex", gap: 2,
      padding: 4, background: "rgba(20,32,31,.82)", borderRadius: 999, font: "12px/1 'Geist', system-ui, sans-serif" }}>
      {ROTAS.map(([n, r]) => (
        <Link key={r} to={r} style={{ padding: "6px 10px", borderRadius: 999, textDecoration: "none",
          color: pathname === r ? "#14201F" : "#EEECE6", background: pathname === r ? "#EEECE6" : "transparent" }}>{n}</Link>
      ))}
    </nav>
  );
}
