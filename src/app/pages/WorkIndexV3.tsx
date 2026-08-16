import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useCraft } from "../../hooks/useCraft";
import { WORK } from "../../content/work";
import { Hud, NavV3, RodapeV3, idx } from "../v3-system";

/**
 * `/work` — o índice na mecânica da página /events da referência
 * (pedido de 10/08: "faz a página de works igual à de events").
 *
 * TEATRO DE TRÊS COLUNAS: a lista de títulos à esquerda e os anos à direita
 * ficam STICKY, de pé a página inteira; as capas rolam no centro, uma por
 * "estação". O scroll é o seletor — a capa que cruza o centro do viewport
 * acende (as vizinhas ficam fantasma) e acende junto o seu título e o seu
 * ano nas colunas. Clique em qualquer um dos três leva ao case.
 *
 * Sticky, não pin: pin do ScrollTrigger briga com o ciclo do React neste
 * repo (cicatriz documentada) — position:sticky faz o mesmo papel de graça.
 * A seleção usa IntersectionObserver com faixa central (-45% em cima e
 * embaixo): funciona com o Lenis porque é geometria de viewport, não evento
 * de scroll.
 *
 * Mobile: o teatro não cabe — vira pilha simples (capa + título + ano),
 * mesma coleção, sem estado.
 */

export default function WorkIndexV3() {
  useMetaRota();
  const raiz = useCraft();
  const [ativo, setAtivo] = useState(0);
  const capas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (!Number.isNaN(i)) setAtivo(i);
        }
      },
      /* faixa central do viewport: só uma capa cabe nela por vez */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    capas.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const quieto = (on: boolean) =>
    ({
      opacity: on ? 1 : 0.22,
      transition: "opacity 0.35s ease-out",
    }) as const;

  return (
    <div ref={raiz} style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      {/* ── desktop: o teatro ─────────────────────────────────────────── */}
      <section className="grid grid-cols-12 gap-6 max-lg:hidden" style={{ paddingInline: "var(--v3-margem)" }}>
        {/* coluna dos títulos — sticky, a página inteira */}
        <div className="col-span-3">
          <div className="sticky top-0 flex h-svh flex-col justify-center">
            <p className="v3-rotulo v3-q pb-8">Selected work</p>
            <ol className="grid gap-3">
              {WORK.map((w, i) => (
                <li key={w.slug} style={quieto(i === ativo)}>
                  <Link viewTransition to={`/work/${w.slug}`} className="v3-rotulo flex items-baseline gap-3 hover:underline">
                    <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                      {idx(i)}
                    </span>
                    {w.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* coluna central — as capas, uma estação por case */}
        <div className="col-span-6 py-[16svh]">
          {WORK.map((w, i) => (
            <div
              key={w.slug}
              data-i={i}
              ref={(el) => {
                capas.current[i] = el;
              }}
              className="flex min-h-[74svh] items-center justify-center py-10"
              style={quieto(i === ativo)}
            >
              <Link viewTransition to={`/work/${w.slug}`} className="group relative block w-full">
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading={i > 0 ? "lazy" : undefined}
                  decoding="async"
                  draggable={false}
                  className="max-h-[70svh] w-full object-contain"
                />
                <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
              </Link>
            </div>
          ))}
        </div>

        {/* coluna dos anos — sticky, espelha a lista */}
        <div className="col-span-3">
          <div className="sticky top-0 flex h-svh flex-col items-end justify-center text-right">
            <p className="v3-rotulo v3-q pb-8">Year</p>
            <ol className="grid gap-3">
              {WORK.map((w, i) => (
                <li key={w.slug} className="v3-rotulo tabular-nums" style={quieto(i === ativo)}>
                  {w.year}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── mobile: pilha simples ─────────────────────────────────────── */}
      <section className="pb-8 pt-24 lg:hidden" style={{ paddingInline: "var(--v3-margem)" }}>
        <p className="v3-rotulo v3-q pb-8">
          Selected work <span className="pl-2 opacity-60">[{String(WORK.length).padStart(2, "0")}]</span>
        </p>
        <div className="grid gap-12">
          {WORK.map((w, i) => (
            <Link viewTransition key={w.slug} to={`/work/${w.slug}`} className="block">
              <img
                src={w.cover.src}
                sizes="92vw"
                alt={w.cover.alt}
                width={w.cover.w}
                height={w.cover.h}
                loading={i > 1 ? "lazy" : undefined}
                decoding="async"
                className="w-full object-contain"
              />
              <span className="flex items-baseline gap-3 pt-3">
                <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                  {idx(i)}
                </span>
                <span className="v3-rotulo">{w.title}</span>
                <span className="v3-rotulo ml-auto" style={{ color: "var(--v3-quieto)" }}>
                  {w.year}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <RodapeV3 />
    </div>
  );
}
