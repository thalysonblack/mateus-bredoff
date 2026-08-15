import { useEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, LinhaSecao, RodapeV3, idx } from "../v3-system";

/**
 * HOME A — "a arte é o ambiente" (/v3/a).
 *
 * Diagnóstico que gerou esta rodada (10/08, "a home não agrada", as quatro
 * hipóteses marcadas): na V3 o HUD virou o prato — a moldura falava mais
 * alto que o trabalho. O noart funciona porque o CONTEÚDO é o protagonista.
 *
 * Racional desta versão: a home é feita das ARTES dele em escala máxima.
 * O hero abre com uma capa de case em tela cheia trocando sozinha (o slot
 * do vídeo da referência, preenchido com o material real que existe); as
 * seções são as artes sangrando, e o texto é legenda. A mecânica do visor
 * continua — mas como tempero: nav, índices e foco de AF sobre o trabalho.
 */

export default function HomeV3A() {
  useMetaRota();
  const [capa, setCapa] = useState(0);

  /* o hero troca de arte sozinho, como o vídeo da referência troca de cena */
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCapa((c) => (c + 1) % WORK.length), 3600);
    return () => clearInterval(id);
  }, []);

  const ativo = WORK[capa];
  const preco = (n: number | null) => (n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`);

  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      {/* ── hero: a ARTE em tela cheia, trocando — o nome é legenda ────── */}
      <section className="relative h-[100dvh] min-h-[36rem] w-full overflow-clip" style={{ background: "#0d1518" }}>
        {WORK.map((w, i) => (
          <img
            key={w.slug}
            src={w.cover.src}
            srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
            sizes="100vw"
            alt={w.cover.alt}
            width={w.cover.w}
            height={w.cover.h}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === capa ? 1 : 0 }}
          />
        ))}

        {/* véu de leitura na base — as capas variam de tom */}
        <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{ background: "linear-gradient(0deg, rgba(13,21,24,0.82), transparent)" }}
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-10" style={{ paddingInline: "var(--v3-margem)", color: "var(--fr-creme)" }}>
          <div>
            <p className="v3-rotulo v3-q pb-3">Mateus Bredoff — Brand Designer</p>
            <Link
              to={`/work/${ativo.slug}`}
              className="block uppercase hover:underline"
              style={{
                fontFamily: "'Geist', ui-sans-serif, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(34px, 5vw, 84px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            >
              {ativo.title}
            </Link>
          </div>
          <div className="v3-rotulo flex shrink-0 items-baseline gap-4 pb-2 tabular-nums">
            <span style={{ color: "var(--v3-acento-tinta)" }}>{idx(capa)}</span>
            <span style={{ opacity: 0.7 }}>/ {String(WORK.length).padStart(2, "0")}</span>
            <span>{ativo.year}</span>
          </div>
        </div>
      </section>

      {/* ── o trabalho, sangrando — duas colunas alternando escala ─────── */}
      <section className="relative pb-20 pt-6">
        <div className="grid grid-cols-12 gap-x-[14px] gap-y-6" style={{ paddingInline: "14px" }}>
          {WORK.slice(0, 6).map((w, i) => {
            /* ritmo 2-1-2-1: pares dividem a linha, ímpar sangra inteira */
            const cheia = i % 3 === 2;
            return (
              <Link
                key={w.slug}
                to={`/work/${w.slug}`}
                className={`group relative block ${cheia ? "col-span-12" : "col-span-6 max-md:col-span-12"}`}
              >
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes={cheia ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading={i > 1 ? "lazy" : undefined}
                  decoding="async"
                  draggable={false}
                  className={`w-full object-cover ${cheia ? "aspect-[21/9]" : "aspect-[4/3]"}`}
                />
                <i className="v3-foco" aria-hidden="true" style={{ color: "#fff" }}><b /><b /><b /><b /></i>
                <span className="flex items-baseline gap-3 pt-2 pb-4">
                  <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                    {idx(i)}
                  </span>
                  <span className="v3-rotulo">{w.title}</span>
                  <span className="v3-rotulo ml-auto" style={{ color: "var(--v3-quieto)" }}>
                    {w.disciplines[0]} — {w.year}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="pt-6 text-center">
          <Link to="/work" className="v3-rotulo hover:underline">
            All work <span className="v3-seta">↳</span>
          </Link>
        </div>
      </section>

      {/* ── quem faz — uma faixa só, texto como legenda ─────────────────── */}
      <section className="relative border-t border-black/12 py-16 max-md:py-10">
        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-rotulo v3-q col-span-3 max-md:col-span-12">About</p>
          <p
            className="col-span-7 col-start-4 uppercase max-md:col-span-12 max-md:col-start-1"
            style={{
              fontFamily: "'Geist', ui-sans-serif, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 2.4vw, 40px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            Multidisciplinary designer focused on visual identities — based in Brazil, working worldwide.
          </p>
          <Link to="/about" className="v3-rotulo col-span-2 col-start-11 self-end text-right hover:underline max-md:col-span-12 max-md:col-start-1 max-md:text-left">
            More <span className="v3-seta">↳</span>
          </Link>
        </div>
      </section>

      {/* ── serviços em uma linha de recibo cada — mínimo, sem painel ──── */}
      <section id="services" className="border-t border-black/12 py-16 max-md:py-10">
        <LinhaSecao rotulo="Services" extra="[03]" />
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          {TIERS.map((t, i) => (
            <a
              key={t.name}
              href="mailto:hello@mateusbredoff.com"
              className="v3-linha grid grid-cols-12 items-baseline gap-6 border-t border-black/12 py-5 max-md:grid-cols-2 max-md:gap-2"
            >
              <span className="v3-micro col-span-1 max-md:col-span-2" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span className="col-span-4 max-md:col-span-2">
                <span
                  className="v3-desliza uppercase"
                  style={{
                    fontFamily: "'Geist', ui-sans-serif, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 1.9vw, 30px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t.name}
                </span>
              </span>
              <span className="v3-rotulo col-span-4 max-md:col-span-1" style={{ color: "var(--v3-quieto)" }}>
                {t.scope.join(" · ")}
              </span>
              <span className="v3-rotulo col-span-3 text-right max-md:col-span-1">{preco(t.priceFrom)}</span>
            </a>
          ))}
        </div>
      </section>

      <RodapeV3 />
    </div>
  );
}
