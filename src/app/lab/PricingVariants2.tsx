import { useState } from "react";
import { Mono, Rule, SectionHead, Bracket, idx } from "../system";
import { TIERS, fmt, type Tier } from "../sections/Pricing";
import artBureau from "../../assets/optimized/art-bureau-1400.webp";
import artVotare from "../../assets/optimized/art-votare-1400.webp";
import artNeox from "../../assets/optimized/art-neox-1400.webp";

/**
 * LABORATÓRIO — segunda leva de variantes do Pricing (E, F, G, H).
 *
 * A primeira leva testou a CAIXA (card, grade, tabela, sem moldura). Esta testa
 * partidos diferentes: inverter a hierarquia, esconder o escopo até ser pedido,
 * mostrar a acumulação entre níveis, e trazer imagem para dentro da seção.
 *
 * Mesmos dados de `sections/Pricing`. Mesmas leis: raio zero, fio de 1px, um
 * acento só, mono para metadado.
 */

const price = (t: Tier) => (t.priceFrom === null ? "On request" : fmt(t.priceFrom));

/* ══════════════════════════════════════════════════════════════════
   E — O PREÇO É A MANCHETE
   Hierarquia invertida: o número é o maior elemento da linha e o nome
   do pacote vira metadado. Honestidade radical — a página de preço
   fala de preço em vez de rodear.
   ══════════════════════════════════════════════════════════════════ */
export function VariantE() {
  return (
    <div>
      {TIERS.map((t, i) => (
        <div key={t.name}>
          <Rule />
          <div className="grid grid-cols-1 items-center gap-x-10 gap-y-4 py-[clamp(1.75rem,4vw,3.5rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="flex items-baseline gap-4">
              <Mono dim className="idx-acc shrink-0">{idx(i)}</Mono>
              {/* O "from" sai da linha do número: como rótulo em cima, em mono.
                 Inline num corpo de 132px com entrelinha 0.82 ele montava por
                 cima do algarismo. */}
              <div>
                {t.priceFrom !== null && (
                  <div className="pb-1">
                    <Mono dim>From</Mono>
                  </div>
                )}
                <p
                  className="t-display t-display-xl"
                  style={{ fontSize: "clamp(2.75rem,8vw,132px)", lineHeight: 0.82 }}
                >
                  {t.priceFrom === null ? <span className="dim">On request</span> : price(t)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <Mono>{t.name}</Mono>
                <Mono dim>{t.timeline}</Mono>
              </div>
              <p className="t-body max-w-[44ch] pt-3">{t.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3">
                {t.scope.map((s) => (
                  <Mono key={s} dim>{s}</Mono>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <Rule />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   F — LISTA QUE ABRE
   Só nome, prazo e preço à mostra; o escopo aparece quando o item é
   aberto. A seção fica curta e limpa, e quem quer detalhe pede.
   Um aberto por vez — comparar exige fechar o outro, que é o custo.
   ══════════════════════════════════════════════════════════════════ */
export function VariantF() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {TIERS.map((t, i) => {
        const isOpen = open === i;
        return (
          <div key={t.name}>
            <Rule />
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-baseline justify-between gap-6 py-[clamp(1.25rem,2.5vw,2rem)] text-left"
            >
              <span className="flex items-baseline gap-[clamp(1rem,2vw,2rem)]">
                <Mono dim className="idx-acc shrink-0">{idx(i)}</Mono>
                <span className="t-display" style={{ fontSize: "clamp(1.6rem,4vw,68px)" }}>
                  {t.name}
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-[clamp(1rem,2.5vw,2.5rem)]">
                <Mono dim className="hidden sm:inline">{t.timeline}</Mono>
                <span className="t-display" style={{ fontSize: "clamp(1rem,1.7vw,26px)" }}>
                  {price(t)}
                </span>
                {/* cruz que vira traço: o único indicador de estado */}
                <span
                  aria-hidden="true"
                  className="relative inline-block h-[1em] w-[1em] shrink-0"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .5s cubic-bezier(.16,1,.3,1)" }}
                >
                  <span className="absolute left-0 top-1/2 h-px w-full" style={{ background: "currentColor" }} />
                  <span className="absolute left-1/2 top-0 h-full w-px" style={{ background: "currentColor" }} />
                </span>
              </span>
            </button>

            <div
              className="overflow-hidden"
              style={{
                maxHeight: isOpen ? 340 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height .6s cubic-bezier(.16,1,.3,1), opacity .4s ease",
              }}
            >
              <div className="grid grid-cols-1 gap-6 pb-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <p className="t-body max-w-[46ch]">{t.description}</p>
                <ul className="flex flex-col gap-2">
                  {t.scope.map((s) => (
                    <li key={s} className="flex items-baseline gap-3">
                      <Mono className="acc">—</Mono>
                      <Mono dim>{s}</Mono>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
      <Rule />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   G — ESCADA DE ACUMULAÇÃO
   Cada nível desce um degrau e herda visualmente o anterior: dá para
   VER que Complete contém Essential. A estrutura explica a oferta
   sem precisar da frase "everything in…".
   ══════════════════════════════════════════════════════════════════ */
export function VariantG() {
  return (
    <div className="grid grid-cols-1 gap-[clamp(0.5rem,1vw,1rem)] md:grid-cols-3 md:items-start">
      {TIERS.map((t, i) => (
        <div
          key={t.name}
          className="flex flex-col"
          /* o degrau: cada coluna começa mais abaixo que a anterior */
          style={{ marginTop: `calc(${i} * clamp(1.5rem, 4vw, 4.5rem))` }}
        >
          <div style={{ borderTop: "1px solid var(--rule)" }} className="pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <Mono dim className="idx-acc">{idx(i)}</Mono>
              <Mono dim>{t.timeline}</Mono>
            </div>

            <h3 className="t-display pt-3" style={{ fontSize: "clamp(1.4rem,2.6vw,44px)" }}>
              {t.name}
            </h3>

            <p className="t-display pt-2" style={{ fontSize: "clamp(1rem,1.6vw,24px)" }}>
              {t.priceFrom !== null && <span className="dim">from </span>}
              {price(t)}
            </p>

            <p className="t-body max-w-[32ch] pt-4">{t.description}</p>

            {/* As camadas herdadas aparecem como blocos empilhados: o nível 3
                mostra três faixas, o nível 1 mostra uma. É a acumulação
                desenhada em vez de escrita. */}
            <div className="flex flex-col gap-1 pt-6">
              {TIERS.slice(0, i + 1).map((prev, pi) => (
                /* A cor vai no CONTAINER, não no <Mono>: a primitiva não aceita
                   `style` e a prop era descartada em silêncio — o texto da faixa
                   ativa saía off-white sobre fundo claro, ilegível. Aqui o Mono
                   herda via currentColor, que é o caminho certo de qualquer forma. */
                <div
                  key={prev.name}
                  className="flex items-center justify-between px-3 py-2"
                  style={{
                    border: "1px solid var(--rule)",
                    background: pi === i ? "var(--acc)" : "transparent",
                    color: pi === i ? "var(--bg)" : undefined,
                  }}
                >
                  <Mono dim={pi !== i}>{prev.name}</Mono>
                  <Mono dim={pi !== i}>{prev.scope.length}</Mono>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   H — COM IMAGEM
   Cada nível ganha uma faixa de arte do próprio portfólio dele. A
   seção deixa de ser puramente tipográfica e passa a mostrar o que se
   compra. Risco: associar um projeto a um preço — por isso a legenda
   diz a disciplina, nunca o nome do cliente.
   ══════════════════════════════════════════════════════════════════ */
const TIER_ART = [
  { src: artBureau, label: "Identity", ratio: "16 / 9" },
  { src: artVotare, label: "Applications", ratio: "4 / 3" },
  { src: artNeox, label: "Full system", ratio: "1920 / 2280" },
];

export function VariantH() {
  return (
    <div className="grid grid-cols-1 gap-[clamp(0.75rem,1.5vw,1.25rem)] md:grid-cols-3">
      {TIERS.map((t, i) => {
        const art = TIER_ART[i];
        return (
          <div key={t.name} className="group flex flex-col" style={{ border: "1px solid var(--rule)" }}>
            <div className="w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
              <img
                src={art.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            <div className="flex flex-1 flex-col p-[clamp(1.25rem,2vw,1.75rem)]">
              <div className="flex items-baseline justify-between gap-4">
                <Mono dim className="idx-acc">{idx(i)}</Mono>
                <Mono dim>{t.timeline}</Mono>
              </div>

              <h3 className="t-display pt-3" style={{ fontSize: "clamp(1.4rem,2.4vw,40px)" }}>
                {t.name}
              </h3>
              <p className="t-body flex-1 pt-3">{t.description}</p>

              <div className="pt-5">
                <Rule />
                <div className="flex items-baseline justify-between gap-4 pt-3">
                  <p className="t-display" style={{ fontSize: "clamp(1rem,1.6vw,24px)" }}>
                    {t.priceFrom !== null && <span className="dim">from </span>}
                    {price(t)}
                  </p>
                  <a href="#contact" className="link-quiet"><Bracket>ENQUIRE</Bracket></a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const VARIANTS = [
  { key: "E", label: "O preço é a manchete", note: "hierarquia invertida · o número é o maior elemento", el: <VariantE /> },
  { key: "F", label: "Lista que abre", note: "seção curta · o escopo aparece quando pedido", el: <VariantF /> },
  { key: "G", label: "Escada de acumulação", note: "dá para VER que um nível contém o anterior", el: <VariantG /> },
  { key: "H", label: "Com imagem", note: "arte do portfólio por nível · mostra o que se compra", el: <VariantH /> },
];

export default function PricingVariants2() {
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
