import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3, idx } from "../v3-system";

/**
 * `/v3/lab` — a página do AI Lab na mecânica da /gallery da referência
 * (pedido de 10/08: "faz a página de LAB como essa").
 *
 * CONTACT SHEET ESPARSO: quadros de tamanhos e proporções variados,
 * espalhados numa grade de 12 colunas com muito respiro — o vazio é parte
 * da composição, como na referência (fotos soltas, linhas irregulares).
 *
 * Os quadros são PLACAS TIPOGRÁFICAS (petróleo, nome do ensaio em display,
 * disciplina e meio na base): as artes reais dos ensaios vivem no Instagram
 * do Mateus e ainda não estão no repo — placa tipográfica é design final
 * legítimo no vocabulário do visor, e vira moldura de foto no dia em que as
 * artes chegarem (trocar o miolo, manter a grade).
 */

type Ensaio = {
  brand: string;
  discipline: string;
  medium: string;
  /** posição e proporção do quadro na grade — a irregularidade é o layout */
  col: string;
  aspecto: string;
  invertida?: boolean;
};

const ENSAIOS: Ensaio[] = [
  { brand: "Fortis", discipline: "Typographic System", medium: "Print / Motion", col: "col-start-1 col-span-4", aspecto: "4 / 5" },
  { brand: "Bureau", discipline: "Electronic Music", medium: "Packaging / Merch", col: "col-start-7 col-span-5", aspecto: "3 / 2" },
  { brand: "Hōki", discipline: "Digital Product", medium: "Interface", col: "col-start-10 col-span-3", aspecto: "1 / 1", invertida: true },
  { brand: "Neox", discipline: "Technical Apparel", medium: "Campaign", col: "col-start-3 col-span-4", aspecto: "1 / 1" },
  { brand: "Alex Archer", discipline: "Personal Brand", medium: "Editorial", col: "col-start-8 col-span-4", aspecto: "4 / 5" },
  { brand: "Bovine Beats", discipline: "Music Label", medium: "Cover Art", col: "col-start-5 col-span-5", aspecto: "16 / 10", invertida: true },
];

const IG = "https://www.instagram.com/sir.bredoff";

function Placa({ e, i }: { e: Ensaio; i: number }) {
  const tinta = !e.invertida;
  return (
    <a
      href={IG}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col justify-between p-5 max-lg:col-span-1 max-lg:col-start-1 ${e.col}`}
      style={{
        aspectRatio: e.aspecto,
        background: tinta ? "var(--fr-petroleo)" : "transparent",
        color: tinta ? "var(--fr-creme)" : "var(--fr-petroleo)",
        border: tinta ? "none" : "1.5px solid rgba(20,33,38,0.35)",
      }}
      aria-label={`${e.brand} — ${e.discipline}`}
    >
      <span className="flex items-baseline justify-between">
        <span className="v3-micro" style={{ color: tinta ? "var(--v3-acento-tinta)" : "var(--v3-acento)" }}>
          {idx(i)}
        </span>
        <span className="v3-mais v3-rotulo" aria-hidden="true">
          +
        </span>
      </span>
      <span
        className="uppercase"
        style={{
          fontFamily: "'Geist', ui-sans-serif, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(24px, 2.4vw, 40px)",
          letterSpacing: "-0.025em",
          lineHeight: 0.95,
        }}
      >
        {e.brand}
      </span>
      <span className="v3-rotulo flex flex-wrap gap-x-4 gap-y-1" style={{ opacity: 0.75 }}>
        <span className="v3-q">{e.discipline}</span>
        <span>{e.medium}</span>
      </span>
      <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
    </a>
  );
}

export default function LabV3() {
  useMetaRota();
  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      <section className="pb-24 pt-28 max-md:pb-14">
        <LinhaSecao
          rotulo="AI Lab"
          extra={`[${String(ENSAIOS.length).padStart(2, "0")}]`}
        />
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          <Display as="h1" immediate className="max-w-[22ch]">
            Experiments in AI-driven brand design
          </Display>
        </div>

        {/* o contact sheet: linhas irregulares, respiro grande */}
        <div
          className="mt-24 grid grid-cols-12 gap-x-6 gap-y-32 max-lg:grid-cols-1 max-lg:gap-y-10 max-md:mt-12"
          style={{ paddingInline: "var(--v3-margem)" }}
        >
          {ENSAIOS.map((e, i) => (
            <Placa key={e.brand} e={e} i={i} />
          ))}
        </div>

        <div className="mt-24 border-t border-black/12 pt-6 max-md:mt-12" style={{ marginInline: "var(--v3-margem)" }}>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="v3-rotulo hover:underline">
            Follow the lab <span className="v3-seta">↳</span>
          </a>
        </div>
      </section>

      <RodapeV3 />
    </div>
  );
}
