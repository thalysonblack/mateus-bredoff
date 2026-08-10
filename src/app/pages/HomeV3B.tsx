import { useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, RodapeV3, idx } from "../v3-system";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";

/**
 * HOME B — "cartaz" (/v3/b).
 *
 * Racional: a home é um PÔSTER — o nome como masthead em didone gigante
 * (Bodoni Moda, o material que muda o que a página é), papel creme quente,
 * artes coladas em sobreposição como lambe. A energia vem do choque de
 * escala tipográfica com a matéria das artes; o visor entra só no vernáculo
 * ([0X], rótulos mono) e no foco de AF.
 *
 * Regras da didone que este repo já pagou para aprender: só ≥40px,
 * entrelinha 0,86, `font-optical-sizing: auto` abre os finos.
 */

const BODONI = {
  fontFamily: "'Bodoni Moda', serif",
  fontOpticalSizing: "auto" as const,
};

export default function HomeV3B() {
  useMetaRota();
  const [vivo, setVivo] = useState(0);
  const preco = (n: number | null) => (n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`);

  return (
    <div style={{ background: "#ede6e1", color: "#260f0a" }}>
      <Hud />
      <NavV3 />

      {/* ── masthead: o nome É o cartaz ─────────────────────────────────── */}
      <section className="flex min-h-[100dvh] flex-col justify-between overflow-clip pt-24">
        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-rotulo v3-q col-span-4 max-md:col-span-12">Brand Designer &amp; Art Director</p>
          <p className="v3-rotulo col-span-4 col-start-9 text-right max-md:col-span-12 max-md:col-start-1 max-md:text-left">
            Brazil — working worldwide
          </p>
        </div>

        {/* colagem: retrato + duas artes lambe-sobre-lambe, sob o nome */}
        <div className="relative mx-auto mt-6 flex w-full max-w-[1100px] items-end justify-center">
          <img
            src={portrait1600}
            alt="Mateus Bredoff"
            width={1600}
            height={850}
            draggable={false}
            className="w-[46%] object-cover"
            style={{ aspectRatio: "3 / 4", objectPosition: "50% 12%" }}
          />
          <img
            src={WORK[0].cover.src}
            alt={WORK[0].cover.alt}
            width={WORK[0].cover.w}
            height={WORK[0].cover.h}
            draggable={false}
            className="absolute -left-2 bottom-[8%] w-[30%] object-cover max-md:w-[36%]"
            style={{ aspectRatio: "4 / 5" }}
          />
          <img
            src={WORK[4].cover.src}
            alt={WORK[4].cover.alt}
            width={WORK[4].cover.w}
            height={WORK[4].cover.h}
            draggable={false}
            className="absolute -right-2 top-[4%] w-[26%] object-cover max-md:w-[32%]"
            style={{ aspectRatio: "1 / 1" }}
          />
        </div>

        {/* o nome sangra por cima da colagem, na base */}
        <h1
          className="relative w-full text-center"
          style={{
            ...BODONI,
            fontWeight: 600,
            fontSize: "clamp(52px, 11.5vw, 188px)",
            lineHeight: 0.86,
            letterSpacing: "-0.015em",
            marginTop: "-0.34em",
          }}
        >
          Mateus Bredoff
        </h1>
      </section>

      {/* ── índice de cartaz: títulos didone, a capa responde ao percorrer ── */}
      <section className="border-t border-black/15 py-20 max-md:py-12">
        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-rotulo v3-q col-span-12 pb-8">
            Selected work <span className="pl-2 opacity-60">[{String(WORK.length).padStart(2, "0")}]</span>
          </p>

          <ol className="col-span-7 max-lg:col-span-12">
            {WORK.map((w, i) => (
              <li key={w.slug}>
                <Link
                  to={`/v3/work/${w.slug}`}
                  onMouseEnter={() => setVivo(i)}
                  onFocus={() => setVivo(i)}
                  className="group flex items-baseline gap-5 border-t border-black/15 py-4"
                >
                  <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                    {idx(i)}
                  </span>
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-2"
                    style={{
                      ...BODONI,
                      fontWeight: 500,
                      fontStyle: i === vivo ? "italic" : "normal",
                      fontSize: "clamp(40px, 4.6vw, 72px)",
                      lineHeight: 0.92,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {w.title}
                  </span>
                  <span className="v3-rotulo ml-auto shrink-0" style={{ color: "rgba(38,15,10,0.6)" }}>
                    {w.year}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* a peça do item percorrido, parada na coluna — nada segue o mouse */}
          <div className="col-span-4 col-start-9 max-lg:hidden">
            <div className="sticky top-[12vh]">
              <img
                key={WORK[vivo].slug}
                src={WORK[vivo].cover.src}
                alt={WORK[vivo].cover.alt}
                width={WORK[vivo].cover.w}
                height={WORK[vivo].cover.h}
                decoding="async"
                draggable={false}
                className="w-full object-cover"
                style={{ aspectRatio: "4 / 5" }}
              />
              <p className="v3-rotulo pt-3" style={{ color: "rgba(38,15,10,0.6)" }}>
                {WORK[vivo].disciplines.join(" · ")}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-10 text-center">
          <Link to="/v3/work" className="v3-rotulo hover:underline">
            All work <span className="v3-seta">↳</span>
          </Link>
        </div>
      </section>

      {/* ── serviços como anúncio de contracapa ─────────────────────────── */}
      <section id="services" className="border-t border-black/15 py-20 max-md:py-12">
        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-rotulo v3-q col-span-12 pb-6">Services [03]</p>
          {TIERS.map((t, i) => (
            <a
              key={t.name}
              href="mailto:hello@mateusbredoff.com"
              className="group col-span-4 border-t border-black/15 pt-5 max-md:col-span-12"
            >
              <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span
                className="block pt-3 transition-transform duration-300 group-hover:translate-x-1"
                style={{ ...BODONI, fontWeight: 500, fontSize: "clamp(40px, 3vw, 48px)", lineHeight: 0.9 }}
              >
                {t.name}
              </span>
              <span className="v3-rotulo block pt-4" style={{ color: "rgba(38,15,10,0.6)" }}>
                {t.timeline} — {preco(t.priceFrom)}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* fecho de contracapa */}
      <section className="border-t border-black/15 py-24 text-center max-md:py-14">
        <a
          href="mailto:hello@mateusbredoff.com"
          className="inline-block transition-opacity hover:opacity-70"
          style={{
            ...BODONI,
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: "clamp(44px, 7vw, 110px)",
            lineHeight: 0.9,
          }}
        >
          Let&rsquo;s talk
        </a>
        <p className="v3-rotulo pt-6" style={{ color: "rgba(38,15,10,0.6)" }}>
          hello@mateusbredoff.com
        </p>
      </section>

      <RodapeV3 />
    </div>
  );
}
