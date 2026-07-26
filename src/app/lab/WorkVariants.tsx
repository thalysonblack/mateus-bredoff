import { useRef, useState } from "react";
import { Link } from "react-router";
import { Mono, Rule, SectionHead, Bracket, idx } from "../system";
import { WORK } from "../../content/work";

/**
 * LABORATÓRIO — opções para o índice de trabalho da home.
 *
 * A grade modular da V2 foi reprovada ("os cases da V2 estão ruins"), e o
 * escalonado da V1 fica valendo até aparecer coisa melhor. Estas são as
 * alternativas, todas lendo a MESMA coleção de `content/work.ts`.
 *
 * Rota `/lab/work`. Sai depois da escolha.
 */

/* ══════════════════════════════════════════════════════════════════
   W1 — PEÇA CHEIA, ALTERNADA
   Um case por faixa, imagem grande, lado alternando. Poucos itens por
   tela e muito impacto: o oposto de índice — é apresentação.
   ══════════════════════════════════════════════════════════════════ */
export function WorkFullBleed() {
  return (
    <div className="flex flex-col gap-[clamp(2.5rem,6vw,6rem)]">
      {WORK.map((w, i) => {
        const rightSide = i % 2 === 1;
        return (
          <Link
            key={w.slug}
            to={`/work/${w.slug}`}
            className="group grid grid-cols-1 items-center gap-[clamp(1rem,3vw,3rem)] md:grid-cols-2"
          >
            {/* A ordem visual troca por item; no mobile a imagem vem sempre
                primeiro, porque alternar em coluna única não lê como ritmo —
                lê como bagunça. */}
            <div
              className="w-full overflow-hidden"
              style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}`, order: rightSide ? 2 : 1 }}
            >
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={w.cover.alt}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            <div className={rightSide ? "md:order-1 md:pr-[8%]" : "md:order-2 md:pl-[8%]"}>
              <Mono dim className="idx-acc">{idx(i)}</Mono>
              <h3 className="t-display pt-3" style={{ fontSize: "clamp(2rem,4.6vw,80px)" }}>
                {w.title}
              </h3>
              <div className="pt-3">
                <Mono dim>{w.disciplines.join(" / ")}</Mono>
              </div>
              <div className="pt-6">
                <Bracket>VIEW CASE</Bracket>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   W2 — LISTA COM PREVIEW
   Só tipografia: uma lista de nomes em corpo grande. A peça aparece
   num painel à direita conforme o item é apercorrido. É o gesto de
   estúdio — o portfólio se revela por vontade, não de enxurrada.
   ══════════════════════════════════════════════════════════════════ */
export function WorkListPreview() {
  const [active, setActive] = useState(0);
  const item = WORK[active];

  return (
    <div className="grid grid-cols-1 gap-[clamp(1.5rem,4vw,4rem)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        {WORK.map((w, i) => (
          <div key={w.slug}>
            <Rule />
            <Link
              to={`/work/${w.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-baseline justify-between gap-6 py-[clamp(0.875rem,2vw,1.5rem)]"
            >
              <span className="flex items-baseline gap-[clamp(0.75rem,2vw,2rem)]">
                <Mono dim className={i === active ? "acc" : ""}>{idx(i)}</Mono>
                <span
                  className="t-display transition-[opacity,transform] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{
                    fontSize: "clamp(1.5rem,3.6vw,62px)",
                    opacity: i === active ? 1 : 0.45,
                    transform: i === active ? "translateX(0.1em)" : "none",
                  }}
                >
                  {w.title}
                </span>
              </span>
              <Mono dim className="hidden shrink-0 sm:block">{w.year}</Mono>
            </Link>
          </div>
        ))}
        <Rule />
      </div>

      {/* Painel de preview. `sticky` para acompanhar a lista sem JS de scroll.
          No mobile ele fica escondido: preview que depende de hover não existe
          no toque, e mostrar a peça do primeiro item ali seria mentira. */}
      <div className="hidden md:block">
        <div className="sticky top-[18vh]">
          <div className="w-full overflow-hidden" style={{ aspectRatio: `${item.cover.w} / ${item.cover.h}` }}>
            <img
              key={item.slug}
              src={item.cover.src}
              srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
              sizes="45vw"
              alt={item.cover.alt}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <Mono dim>{item.disciplines.join(" / ")}</Mono>
            <Mono dim>{item.year}</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   W3 — TIRA HORIZONTAL COM ARRASTE
   As peças ficam numa tira que se percorre na horizontal. NÃO é o
   carrossel que foi cortado: ali a faixa duplicava o índice que vinha
   logo abaixo; aqui ela É o índice.
   ══════════════════════════════════════════════════════════════════ */
export function WorkHorizontal() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      {/* Rolagem nativa horizontal com scroll-snap: nada de JS de arraste
          reinventado, que sempre briga com o scroll vertical no trackpad. */}
      <div
        ref={ref}
        className="flex gap-[clamp(0.75rem,1.5vw,1.5rem)] overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}
      >
        {WORK.map((w, i) => (
          <Link
            key={w.slug}
            to={`/work/${w.slug}`}
            className="group shrink-0"
            style={{ scrollSnapAlign: "start", width: "clamp(17rem,34vw,30rem)" }}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}>
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="34vw"
                alt={w.cover.alt}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-2">
              <Mono dim className="idx-acc">{idx(i)}</Mono>
              <Mono className="text-right">
                {w.title}
                <span className="dim">{` / ${w.disciplines[0]}`}</span>
              </Mono>
            </div>
          </Link>
        ))}
      </div>
      <div className="pt-2">
        <Mono dim>Arraste ou role na horizontal</Mono>
      </div>
    </div>
  );
}

const VARIANTS = [
  { key: "W1", label: "Peça cheia, alternada", note: "um case por faixa · apresentação em vez de índice", el: <WorkFullBleed /> },
  { key: "W2", label: "Lista com preview", note: "só tipografia; a peça aparece no painel ao percorrer", el: <WorkListPreview /> },
  { key: "W3", label: "Tira horizontal", note: "a tira É o índice — não duplica nada", el: <WorkHorizontal /> },
];

export default function WorkVariants() {
  return (
    <>
      {VARIANTS.map((v, i) => (
        <section key={v.key} className={i % 2 === 0 ? "on-paper w-full" : "on-ink w-full"}>
          <div className="bleed pb-[clamp(3rem,6vw,6rem)] pt-[clamp(2rem,4vw,4rem)]">
            <div className="pb-[clamp(1.5rem,3vw,2.5rem)]">
              <Mono className="acc">{v.key}</Mono>
              <h2 className="t-display pt-2" style={{ fontSize: "clamp(1.25rem,2.2vw,34px)" }}>
                {v.label}
              </h2>
              <div className="pt-1">
                <Mono dim>{v.note}</Mono>
              </div>
            </div>
            <SectionHead left="Selected Work" right={`[${WORK.length}] Projects`} />
            {v.el}
          </div>
        </section>
      ))}
    </>
  );
}
