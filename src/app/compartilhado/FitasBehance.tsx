import { RECONHECIMENTO } from "../../content/reconhecimento";
import "../../styles/fitas-behance.css";

/* As fitas do Behance, derivadas de reconhecimento.ts (selo por galeria). Dourado do
   Behance escurecido (#8c7137) para o "Gr" branco passar em contraste. Só existe fita
   para curadoria com `selo`. A tipografia do rótulo e da contagem vem da versão. */
const FITAS = (() => {
  const gal: Record<string, { sigla: string; nome: string; cor: string; n: number }> = {};
  for (const r of RECONHECIMENTO) {
    if (r.selo === "behance-gr") {
      gal.gr ??= { sigla: "Gr", nome: "Graphic Design", cor: "#8c7137", n: 0 };
      gal.gr.n += 1;
    }
  }
  return Object.values(gal);
})();

export function FitasBehance({ className, classeRotulo, classeN }: { className?: string; classeRotulo?: string; classeN?: string }) {
  if (!FITAS.length) return null;
  return (
    <div className={className}>
      <span className={classeRotulo}>Behance features</span>
      <ul className="fitas-behance">
        {FITAS.map((f) => (
          <li key={f.sigla} className="fitas-behance-item" title={f.nome}>
            <i className="fitas-behance-fita" style={{ background: f.cor }} aria-hidden="true">{f.sigla}</i>
            <span className={classeN}>{f.n}</span>
            <span className="sr-only">{f.nome}: {f.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
