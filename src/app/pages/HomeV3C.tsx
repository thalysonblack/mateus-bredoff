import { useEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, RodapeV3, idx } from "../v3-system";

/**
 * HOME C — "noturno, uma luz" (/v3/c).
 *
 * Racional: a linha das referências que ELE escolheu no Awwwards (trionn:
 * preto com o laranja como única luz; jordigarreta: mono sobre quase-preto).
 * A página é noite — quase-preto de petróleo — e as artes são JANELAS
 * luminosas nela; o laranja #ec7a47 é a única cor viva, usada como luz, não
 * como tinta. Mono dominante, Geist só onde o nome precisa de corpo.
 * O mundo da referência é música eletrônica: esta é a home que toca à noite.
 */

const NOITE = "#0b1215";
const LUZ = "#ec7a47";

export default function HomeV3C() {
  useMetaRota();
  const [hora, setHora] = useState("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setHora(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const preco = (n: number | null) => (n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`);

  return (
    <div style={{ background: NOITE, color: "var(--fr-creme)" }}>
      <Hud />
      <NavV3 />

      {/* ── abertura: noite, o nome aceso e UMA janela de trabalho ──────── */}
      <section className="relative flex h-[100dvh] min-h-[38rem] flex-col justify-between overflow-clip pt-24">
        {/* linha de luz que atravessa — o único traço de cor */}
        <div
          className="pointer-events-none absolute left-0 top-[38%] h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${LUZ}, transparent)`, opacity: 0.8 }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <h1
            className="col-span-8 uppercase max-md:col-span-12"
            style={{
              fontFamily: "'Geist', ui-sans-serif, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 6.2vw, 104px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
            }}
          >
            Mateus
            <br />
            Bredoff
          </h1>
          <div className="v3-rotulo col-span-3 col-start-10 grid content-start gap-4 text-right max-md:col-span-12 max-md:col-start-1 max-md:text-left">
            <p>
              Brand Designer
              <br />
              &amp; Art Director
            </p>
            <p style={{ color: LUZ }} className="tabular-nums">
              BRT {hora}
            </p>
            <p style={{ opacity: 0.6 }}>
              Based in Brazil
              <br />
              working worldwide
            </p>
          </div>
        </div>

        {/* a janela: o último case brilhando na noite */}
        <Link
          to={`/v3/work/${WORK[0].slug}`}
          className="group relative mx-auto mb-14 block w-[min(880px,86vw)]"
        >
          <img
            src={WORK[0].cover.src}
            srcSet={WORK[0].cover.src2x ? `${WORK[0].cover.src} 1400w, ${WORK[0].cover.src2x} 2200w` : undefined}
            sizes="(min-width: 1024px) 880px, 86vw"
            alt={WORK[0].cover.alt}
            width={WORK[0].cover.w}
            height={WORK[0].cover.h}
            fetchPriority="high"
            draggable={false}
            className="aspect-[16/9] w-full object-cover"
            style={{ boxShadow: `0 0 120px rgba(236,122,71,0.14)` }}
          />
          <i className="v3-foco" aria-hidden="true" style={{ color: LUZ }}><b /><b /><b /><b /></i>
          <span className="flex items-baseline gap-4 pt-3">
            <span className="v3-micro" style={{ color: LUZ }}>
              {idx(0)}
            </span>
            <span className="v3-rotulo">{WORK[0].title}</span>
            <span className="v3-rotulo ml-auto" style={{ opacity: 0.6 }}>
              Latest — {WORK[0].year}
            </span>
          </span>
        </Link>
      </section>

      {/* ── a fita noturna: janelas em coluna, uma por case ─────────────── */}
      <section className="border-t border-white/10 py-20 max-md:py-12">
        <div className="flex items-baseline justify-between pb-12" style={{ paddingInline: "var(--v3-margem)" }}>
          <span className="v3-rotulo v3-q">
            Selected work <span className="pl-2 opacity-60">[{String(WORK.length).padStart(2, "0")}]</span>
          </span>
          <Link to="/v3/work" className="v3-rotulo hover:underline">
            All work <span className="v3-seta">↳</span>
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-y-20" style={{ paddingInline: "var(--v3-margem)" }}>
          {WORK.slice(1, 6).map((w, i) => {
            /* as janelas alternam de lado — a rua noturna, não uma grade */
            const esquerda = i % 2 === 0;
            return (
              <Link
                key={w.slug}
                to={`/v3/work/${w.slug}`}
                className={`group relative col-span-7 max-md:col-span-12 ${esquerda ? "col-start-1" : "col-start-6"}`}
              >
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="(min-width: 768px) 56vw, 92vw"
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  style={{ boxShadow: "0 0 90px rgba(236,122,71,0.08)" }}
                />
                <i className="v3-foco" aria-hidden="true" style={{ color: LUZ }}><b /><b /><b /><b /></i>
                <span className={`flex items-baseline gap-4 pt-3 ${esquerda ? "" : "flex-row-reverse"}`}>
                  <span className="v3-micro" style={{ color: LUZ }}>
                    {idx(i + 1)}
                  </span>
                  <span className="v3-rotulo">{w.title}</span>
                  <span className="v3-rotulo" style={{ opacity: 0.6 }}>
                    {w.disciplines[0]} — {w.year}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── serviços: painel de mesa de som — linhas mono, luz no preço ── */}
      <section id="services" className="border-t border-white/10 py-20 max-md:py-12">
        <div className="flex items-baseline justify-between pb-10" style={{ paddingInline: "var(--v3-margem)" }}>
          <span className="v3-rotulo v3-q">Services [03]</span>
          <a href="mailto:hello@mateusbredoff.com" className="v3-rotulo hover:underline">
            Request a quote <span className="v3-seta">↳</span>
          </a>
        </div>
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          {TIERS.map((t, i) => (
            <a
              key={t.name}
              href="mailto:hello@mateusbredoff.com"
              className="group grid grid-cols-12 items-baseline gap-6 border-t border-white/10 py-6 max-md:grid-cols-2 max-md:gap-2"
            >
              <span className="v3-micro col-span-1 max-md:col-span-2" style={{ color: LUZ }}>
                {idx(i)}
              </span>
              <span
                className="col-span-4 uppercase transition-transform duration-300 group-hover:translate-x-2 max-md:col-span-2"
                style={{
                  fontFamily: "'Geist', ui-sans-serif, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2vw, 32px)",
                  letterSpacing: "-0.02em",
                }}
              >
                {t.name}
              </span>
              <span className="v3-rotulo col-span-4 max-md:col-span-1" style={{ opacity: 0.6 }}>
                {t.scope.join(" · ")}
              </span>
              <span className="v3-rotulo col-span-3 text-right transition-colors max-md:col-span-1" style={{ color: LUZ }}>
                {preco(t.priceFrom)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <RodapeV3 />
    </div>
  );
}
