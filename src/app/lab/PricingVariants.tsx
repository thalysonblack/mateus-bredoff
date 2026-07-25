import { Mono, Rule, SectionHead, Bracket, idx } from "../system";
import { TIERS, fmt, type Tier } from "../sections/Pricing";

/**
 * LABORATÓRIO — variantes do Pricing para aprovação.
 *
 * Rota `/lab/pricing`, fora do site. Serve para ver as opções lado a lado e
 * escolher; a vencedora vira `sections/Pricing.tsx` e este arquivo pode ser
 * apagado. Não linkar no menu, não indexar.
 *
 * Todas leem os MESMOS dados (`TIERS`), então o que se compara é forma, não
 * conteúdo. Todas respeitam as leis do sistema: raio zero, sem sombra, fio de
 * 1px, um acento só, mono para metadado.
 */

const price = (t: Tier) =>
  t.priceFrom === null ? "On request" : `${fmt(t.priceFrom)}`;

/* ══════════════════════════════════════════════════════════════════
   A — CARD DE LARGURA TOTAL  (a versão no ar hoje)
   Densidade da faixa + matéria do card. O do meio inverte para papel.
   ══════════════════════════════════════════════════════════════════ */
export function VariantA() {
  return (
    <div className="flex flex-col gap-[clamp(0.5rem,1vw,0.875rem)]">
      {TIERS.map((t, i) => (
        <div
          key={t.name}
          className={`${t.featured ? "on-paper" : ""} group`}
          style={{ border: "1px solid var(--rule)", background: t.featured ? "var(--bg)" : "transparent" }}
        >
          <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-6 p-[clamp(1.5rem,3vw,2.75rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_auto]">
            <div className="flex items-baseline gap-[clamp(1rem,2vw,2rem)]">
              <Mono dim className="idx-acc shrink-0">{idx(i)}</Mono>
              <h3 className="t-display" style={{ fontSize: "clamp(1.75rem,3.6vw,62px)" }}>{t.name}</h3>
            </div>
            <div>
              <div className="flex flex-wrap gap-[0.4rem]">
                {t.scope.map((s) => (
                  <span key={s} className="inline-flex items-center px-[0.7em] py-[0.45em] leading-none" style={{ border: "1px solid var(--rule)" }}>
                    <Mono dim>{s}</Mono>
                  </span>
                ))}
              </div>
              <p className="t-body max-w-[46ch] pt-5">{t.description}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end md:text-right">
              <div>
                <Mono dim>{t.timeline}</Mono>
                <p className="t-display pt-1" style={{ fontSize: "clamp(1.15rem,2vw,30px)" }}>
                  {t.priceFrom !== null && <span className="dim">from </span>}
                  {price(t)}
                </p>
              </div>
              <a href="#contact" className="link-quiet"><Bracket>START THE PROJECT</Bracket></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   B — GRADE MODULAR NUMERADA  (direção Norgram)
   O numeral é o elemento gráfico: enorme, quieto, atrás do conteúdo.
   Células divididas por fio, como página de jornal.
   ══════════════════════════════════════════════════════════════════ */
export function VariantB() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }}>
      {TIERS.map((t, i) => (
        <div
          key={t.name}
          className="relative flex min-h-[clamp(20rem,32vw,26rem)] flex-col justify-between overflow-hidden p-[clamp(1.5rem,2.5vw,2.25rem)]"
          style={{ borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
        >
          {/* numeral como marca d'água — participa da composição, não da leitura */}
          <span
            aria-hidden="true"
            className="t-display pointer-events-none absolute select-none"
            style={{ fontSize: "clamp(7rem,13vw,15rem)", lineHeight: 0.8, right: "-0.06em", top: "-0.12em", opacity: 0.07 }}
          >
            {i + 1}
          </span>

          <div className="relative">
            <Mono dim>{t.timeline}</Mono>
            <h3 className="t-display pt-3" style={{ fontSize: "clamp(1.5rem,2.6vw,42px)" }}>{t.name}</h3>
            <p className="t-body max-w-[34ch] pt-4">{t.description}</p>
          </div>

          <div className="relative pt-8">
            <ul className="flex flex-col gap-1 pb-5">
              {t.scope.map((s) => (
                <li key={s}><Mono dim>{s}</Mono></li>
              ))}
            </ul>
            <Rule />
            <p className="t-display pt-3" style={{ fontSize: "clamp(1.1rem,1.8vw,26px)" }}>
              {t.priceFrom !== null && <span className="dim">from </span>}
              {price(t)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   C — TABELA COMPARATIVA
   Matriz escopo × nível. É o formato que MELHOR compara e o mais fiel
   ao partido "a página é um documento técnico".
   ══════════════════════════════════════════════════════════════════ */
const ALL_SCOPE = [
  "Logotype",
  "Colour palette",
  "Typography",
  "Mini-guide",
  "Applications",
  "Stationery",
  "Social kit",
  "Naming",
  "Verbal identity",
  "Full guidelines",
];

/* Cada nível acumula o anterior; a matriz reflete isso sem repetir texto. */
const INCLUDED: Record<string, number> = {
  Logotype: 0, "Colour palette": 0, Typography: 0, "Mini-guide": 0,
  Applications: 1, Stationery: 1, "Social kit": 1,
  Naming: 2, "Verbal identity": 2, "Full guidelines": 2,
};

export function VariantC() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,7rem))] items-end gap-x-4 pb-4 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem))]">
        <Mono dim>Scope</Mono>
        {TIERS.map((t, i) => (
          <div key={t.name} className="text-right">
            <Mono dim className="idx-acc">{idx(i)}</Mono>
            <p className="t-display pt-1" style={{ fontSize: "clamp(0.95rem,1.5vw,22px)" }}>{t.name}</p>
          </div>
        ))}
      </div>

      {ALL_SCOPE.map((s) => (
        <div key={s}>
          <Rule />
          <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,7rem))] items-center gap-x-4 py-[clamp(0.6rem,1.1vw,0.9rem)] md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem))]">
            <Mono>{s}</Mono>
            {TIERS.map((t, ti) => (
              <div key={t.name} className="text-right">
                {ti >= INCLUDED[s] ? (
                  <Mono className="acc">●</Mono>
                ) : (
                  <Mono dim>—</Mono>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Rule />
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,7rem))] items-end gap-x-4 pt-[clamp(1rem,2vw,1.5rem)] md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem))]">
        <Mono dim>From</Mono>
        {TIERS.map((t) => (
          <div key={t.name} className="text-right">
            <Mono dim>{t.timeline}</Mono>
            <p className="t-display pt-1" style={{ fontSize: "clamp(1rem,1.7vw,26px)" }}>{price(t)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   D — TIPOGRÁFICA / SEM MOLDURA
   Nenhuma caixa: só tipo, fio e ar. O preço vira a manchete da linha.
   A mais contida — Tom Ford em vez de tabela de plano.
   ══════════════════════════════════════════════════════════════════ */
export function VariantD() {
  return (
    <div>
      {TIERS.map((t, i) => (
        <div key={t.name} className="group">
          <Rule />
          <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-4 py-[clamp(2rem,4.5vw,4rem)] md:grid-cols-[auto_minmax(0,1fr)_auto]">
            <Mono dim className="idx-acc">{idx(i)}</Mono>

            <div>
              <h3 className="t-display" style={{ fontSize: "clamp(2rem,5.5vw,96px)" }}>{t.name}</h3>
              <p className="t-body max-w-[52ch] pt-3">{t.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-4">
                {t.scope.map((s) => (
                  <Mono key={s} dim>{s}</Mono>
                ))}
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="t-display" style={{ fontSize: "clamp(1.5rem,3vw,48px)" }}>{price(t)}</p>
              <Mono dim>{t.timeline}</Mono>
            </div>
          </div>
        </div>
      ))}
      <Rule />
    </div>
  );
}

const VARIANTS = [
  { key: "A", label: "Card de largura total", note: "no ar hoje · densidade + matéria, meio invertido em papel", el: <VariantA /> },
  { key: "B", label: "Grade modular numerada", note: "direção Norgram · numeral como marca d'água, células com fio", el: <VariantB /> },
  { key: "C", label: "Tabela comparativa", note: "matriz escopo × nível · o mais fiel a documento técnico", el: <VariantC /> },
  { key: "D", label: "Tipográfica sem moldura", note: "só tipo, fio e ar · a mais contida", el: <VariantD /> },
];

export default function PricingVariants() {
  return (
    <>
      {VARIANTS.map((v) => (
        <section key={v.key} className="on-ink w-full">
          <div className="bleed pb-[clamp(3rem,6vw,6rem)] pt-[clamp(2rem,4vw,4rem)]">
            <div className="pb-[clamp(1.5rem,3vw,2.5rem)]">
              <Mono className="acc">{`Versão ${v.key}`}</Mono>
              <h2 className="t-display pt-2" style={{ fontSize: "clamp(1.25rem,2.2vw,34px)" }}>
                {v.label}
              </h2>
              <div className="pt-1">
                <Mono dim>{v.note}</Mono>
              </div>
            </div>
            <SectionHead left="Pricing" right={`[${TIERS.length}] Engagements`} />
            {v.el}
          </div>
        </section>
      ))}
    </>
  );
}
