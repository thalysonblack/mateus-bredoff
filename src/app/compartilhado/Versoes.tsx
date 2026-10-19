import { Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import v1 from "../../assets/versoes/v1.webp";
import v2 from "../../assets/versoes/v2.webp";
import v3 from "../../assets/versoes/v3.webp";

/** /versoes — a página para o cliente aprovar: as versões lado a lado, cada uma com o link para abrir. */
const VERSOES = [
  { n: "V1", nome: "Current site", nota: "The site that is live today.", rota: "/v1", img: v1 },
  { n: "V2", nome: "Full site", nota: "Home, work, case pages and about.", rota: "/v2", img: v2 },
  { n: "V3", nome: "Showreel home", nota: "Home opened by the showreel.", rota: "/v3", img: v3 },
  { n: "V4", nome: "Unified", nota: "Showreel home, project index, about and case pages.", rota: "/v4", img: v3 },
];

const tipo = { font: "600 11px/1.18 'Alte Haas Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.01em" } as const;

export default function Versoes() {
  useMetaRota();
  return (
    <main style={{ ...tipo, minHeight: "100svh", background: "#fff", color: "#000", padding: "15px 17px 120px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 17 }}>
        <span>Mateus Bredoff</span>
        <span style={{ color: "#767676" }}>Site versions — for review</span>
      </header>
      <ol style={{ listStyle: "none", margin: "120px 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 17 }}>
        {VERSOES.map((v) => (
          <li key={v.n}>
            <Link to={v.rota} style={{ color: "inherit", textDecoration: "none", display: "block" }}>
              <img src={v.img} alt={`${v.n} — ${v.nome}`} width={1440} height={900} loading="lazy" decoding="async"
                style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top", borderRadius: 4, background: "#f2f2f2" }} />
              <span style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 12, paddingTop: 12 }}>
                <span>{v.n}</span>
                <span>{v.nome}<br /><span style={{ color: "#767676" }}>{v.nota}</span></span>
                <span style={{ color: "#767676" }}>Open →</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
