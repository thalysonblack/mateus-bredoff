import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3, idx } from "../v3-system";

/**
 * V3 — "o portfólio como visor". Terceira direção sobre a mesa, ao lado de
 * `/` (réplica do Framer) e `/v2` (autoral). Versão INTEIRA, não colagem:
 * estrutura, nav, hero, work, globo, serviços e rodapé nascem juntos aqui.
 *
 * Mecânica emprestada do noartmusic.com (referência apontada pelo Thalyson,
 * 09/08/2026): HUD de visor em blend-difference, nav em grupos de colunas com
 * ■, rótulo de seção como linha de HUD, índices [01], telemetria viva,
 * carrossel sangrando, footer em caixa. A MATÉRIA é toda do Mateus: paleta
 * medida da réplica, Geist + Martian Mono, retrato-ambiente aprovado, copy
 * real do About, coleção real de cases, tiers reais do Pricing.
 *
 * O que NÃO entrou, de propósito:
 * - preloader com % — preloader que prende a primeira dobra já foi vetado;
 * - texto inventado — todo texto aqui existe no material do cliente;
 * - links que mentem — X.com segue rótulo sem href, como na réplica.
 */

/* copy REAL — a mesma fonte do /about (manifesto e leads medidos do Framer) */
const MANIFESTO =
  "I'm a multidisciplinary designer focused on visual identities, based in Brazil and working worldwide.";
const LEAD_ABORDAGEM =
  "My approach begins with a deep understanding of the environment in which your company operates. I analyze business objectives, target audience, competitors, and market context, conducting a careful conceptual investigation that transforms strategy into visual expression.";
const LEAD_BRASIL =
  "I am based in Brazil and work globally, collaborating with companies that understand the value of building a clear, relevant, and memorable presence.";
const NUMEROS = [
  { valor: "62+", rotulo: "Clients" },
  { valor: "100+", rotulo: "Awards & Recognitions" },
  { valor: "56+", rotulo: "Products to market" },
];
/* ── hero: retrato COMO ambiente + nome em exclusion + telemetria ───────── */
function HeroV3() {
  const ultimo = WORK[0]; // a coleção já vem do mais recente
  return (
    <section
      className="relative flex h-[100dvh] min-h-[36rem] w-full flex-col justify-end overflow-clip"
      style={{
        /* cores amostradas no arquivo do retrato (mesma medição do hero da
           réplica) — qualquer área que sobre casa sem emenda */
        background:
          "linear-gradient(180deg, #18373f 0%, #486067 25%, #8d9ca1 50%, #d4d8da 85%, #eceded 100%)",
      }}
    >
      <img
        src={portrait1600}
        srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
        sizes="100vw"
        alt="Mateus Bredoff"
        width={1600}
        height={850}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        /* SEM z-index: o nome mescla por exclusion e blend só enxerga o mesmo
           stacking context — o empilhamento vem da ordem do DOM */
      />

      {/* nome — camada própria, exclusion (o modo do original dele, não o
          difference da referência: exclusion amacia o meio-tom sobre pele) */}
      <h1
        className="pointer-events-none relative w-full text-center text-white"
        style={{
          mixBlendMode: "exclusion",
          fontFamily: "'Geist', ui-sans-serif, sans-serif",
          fontWeight: 700,
          fontSize: "var(--v3-nome)",
          lineHeight: 0.82,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          marginBottom: "-0.06em", // sangra pela base — gesto aprovado do site dele
        }}
      >
        Mateus Bredoff
      </h1>

      {/* linha de telemetria sobre a base clara do retrato */}
      <div
        className="v3-telem relative flex items-end justify-between gap-6 pb-16 pt-5 max-md:flex-col max-md:items-start max-md:gap-8 max-md:pb-10"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <p className="v3-mono v3-justif max-w-[38ch]">{MANIFESTO}</p>

        <Link
          to={`/v3/work/${ultimo.slug}`}
          className="v3-card flex items-center gap-4 p-3"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <img
            src={ultimo.cover.src}
            alt=""
            width={ultimo.cover.w}
            height={ultimo.cover.h}
            className="h-14 w-20 object-cover"
          />
          <span className="v3-rotulo">
            <span className="block opacity-60">Latest case</span>
            <span className="block pt-1">{ultimo.title}</span>
            <span className="block opacity-60">{ultimo.year}</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ── about: manifesto justificado + lead mono + números ─────────────────── */
function AboutV3() {
  return (
    <section className="py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <LinhaSecao rotulo="About" acao={{ texto: "More about me", to: "/v3/about" }} />
      <div
        className="grid grid-cols-12 gap-6"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <div className="col-span-6 max-lg:col-span-12">
          {/* palavras DELE — recorte do lead real, não frase inventada */}
          <Display>A unique identity, built with intention</Display>
        </div>
        <div className="col-span-4 col-start-9 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
          <p className="v3-mono v3-justif">{LEAD_ABORDAGEM}</p>
        </div>
      </div>

      <div
        className="mt-24 grid grid-cols-3 gap-6 border-t border-black/12 pt-6 max-md:mt-14 max-md:grid-cols-1 max-md:gap-4"
        style={{ marginInline: "var(--v3-margem)" }}
      >
        {NUMEROS.map((n, i) => (
          <div key={n.rotulo} className="flex items-baseline gap-3">
            <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
              {idx(i)}
            </span>
            <span
              style={{
                fontFamily: "'Geist', ui-sans-serif, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 2.6vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              {n.valor}
            </span>
            <span className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
              {n.rotulo}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── work: a tira é o índice — snap nativo, cartão sangrando ────────────── */
function WorkV3() {
  const trilho = useRef<HTMLDivElement | null>(null);
  const anda = (dir: 1 | -1) => {
    const el = trilho.current;
    if (!el) return;
    const card = el.querySelector("a");
    const passo = card ? card.getBoundingClientRect().width + 14 : 560;
    el.scrollBy({ left: dir * passo, behavior: "smooth" });
  };
  return (
    <section className="py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <LinhaSecao
        rotulo="Selected work"
        extra={`[${String(WORK.length).padStart(2, "0")}]`}
        acao={{ texto: "Explore all", to: "/v3/work" }}
      />
      <div ref={trilho} className="v3-trilho" style={{ paddingInline: "var(--v3-margem)" }}>
        {WORK.map((w, i) => (
          <Link key={w.slug} to={`/v3/work/${w.slug}`} className="group">
            <span className="block overflow-hidden bg-black/5">
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="(max-width: 768px) 78vw, 560px"
                alt={w.cover.alt}
                width={w.cover.w}
                height={w.cover.h}
                loading={i > 1 ? "lazy" : undefined}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </span>
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

      <div className="flex items-center justify-center gap-6 pt-12">
        <button type="button" onClick={() => anda(-1)} className="v3-rotulo cursor-pointer">
          ‹ Prev
        </button>
        <span aria-hidden="true" className="flex items-end gap-[3px]">
          {[10, 6, 6, 6].map((h, i) => (
            <i key={i} className="block w-px bg-current" style={{ height: h }} />
          ))}
        </span>
        <button type="button" onClick={() => anda(1)} className="v3-rotulo cursor-pointer">
          Next ›
        </button>
      </div>
    </section>
  );
}

/* ── globo: wireframe ortográfico + pino no Brasil + hora viva ──────────── */
function GloboV3() {
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

  /* projeção ortográfica de frente: meridianos viram elipses (rx = R·sinλ),
     paralelos viram cordas horizontais (y = R·sinφ, meia-largura R·cosφ) */
  const R = 270;
  const C = 300;
  const meridianos = [15, 35, 55, 75].map((g) => R * Math.sin((g * Math.PI) / 180));
  const paralelos = [-60, -40, -20, 0, 20, 40, 60].map((g) => {
    const rad = (g * Math.PI) / 180;
    return { y: C - R * Math.sin(rad), meia: R * Math.cos(rad) };
  });
  /* Brasil, com o disco centrado no Atlântico (~lon −30): lat −15, lon −50 */
  const pino = { x: C - R * 0.33, y: C + R * 0.26 };

  return (
    <section className="py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <LinhaSecao rotulo="Around the world" />
      <div
        className="grid grid-cols-12 items-center gap-6"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <div className="col-span-5 max-lg:col-span-12">
          <Display>Based in Brazil, working worldwide</Display>
          <p className="v3-mono v3-justif mt-10 max-w-[44ch]">{LEAD_BRASIL}</p>
        </div>

        <div className="col-span-4 col-start-7 max-lg:col-span-8 max-lg:col-start-1 max-lg:pt-10">
          <svg viewBox="0 0 600 600" className="w-full" role="img" aria-label="Globo — pino no Brasil">
            <g fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
              <circle cx={C} cy={C} r={R} />
              <line x1={C} y1={C - R} x2={C} y2={C + R} />
              {meridianos.map((rx) => (
                <ellipse key={rx} cx={C} cy={C} rx={rx} ry={R} />
              ))}
              {paralelos.map((p) => (
                <line key={p.y} x1={C - p.meia} y1={p.y} x2={C + p.meia} y2={p.y} />
              ))}
            </g>
            <g className="v3-pino">
              <rect x={pino.x - 5} y={pino.y - 5} width="10" height="10" fill="var(--v3-acento)" />
              <rect
                x={pino.x - 11}
                y={pino.y - 11}
                width="22"
                height="22"
                fill="none"
                stroke="var(--v3-acento)"
                strokeWidth="1"
              />
            </g>
            <text
              x={pino.x + 20}
              y={pino.y + 4}
              className="v3-micro"
              fill="currentColor"
              style={{ fontFamily: "'Martian Mono', monospace", fontSize: 11, textTransform: "uppercase" }}
            >
              BRA — GMT−3
            </text>
          </svg>
        </div>

        <div className="col-span-2 col-start-11 self-start max-lg:col-span-12 max-lg:col-start-1">
          <dl className="v3-rotulo grid gap-4">
            <div>
              <dt style={{ color: "var(--v3-quieto)" }}>Local time</dt>
              <dd className="pt-1 tabular-nums">{hora}</dd>
            </div>
            <div>
              <dt style={{ color: "var(--v3-quieto)" }}>Time zone</dt>
              <dd className="pt-1">GMT−3 (BRT)</dd>
            </div>
            <div>
              <dt style={{ color: "var(--v3-quieto)" }}>Reach</dt>
              <dd className="pt-1">Worldwide</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── serviços: a mecânica de shop da referência com os tiers REAIS ──────── */
function ServicosV3() {
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;
  return (
    <section
      id="services"
      className="py-20 max-md:py-12"
      style={{ background: "var(--fr-petroleo)", color: "var(--fr-creme)" }}
    >
      <LinhaSecao rotulo="Services" extra="[03]" />
      <div
        className="grid grid-cols-3 gap-4 max-lg:grid-cols-1"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        {TIERS.map((t, i) => (
          <article key={t.name} className="relative flex flex-col border border-white/15 p-6">
            <span className="v3-micro" style={{ color: "var(--v3-acento-tinta)" }}>
              {idx(i)}
            </span>
            <h3
              className="pt-6 uppercase"
              style={{
                fontFamily: "'Geist', ui-sans-serif, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 2vw, 32px)",
                letterSpacing: "-0.02em",
              }}
            >
              {t.name}
            </h3>
            <p className="v3-mono v3-justif pt-5" style={{ color: "var(--fr-creme)", opacity: 0.92 }}>
              {t.description}
            </p>
            <ul className="v3-rotulo mt-8 grid gap-2 border-t border-white/15 pt-5">
              {t.scope.map((s) => (
                <li key={s} className="v3-q">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-baseline justify-between gap-4 pt-10">
              <span className="v3-rotulo" style={{ color: "var(--v3-quieto-tinta)" }}>
                {t.timeline}
              </span>
              <span className="v3-rotulo">{preco(t.priceFrom)}</span>
            </div>
            <a
              href="mailto:hello@mateusbredoff.com"
              className="v3-rotulo mt-5 block border-t border-white/15 pt-4 hover:underline"
              aria-label={`Request a quote — ${t.name}`}
            >
              + Request a quote ↳
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomeV3() {
  useMetaRota();
  return (
    <div style={{ background: "var(--fr-papel)" }}>
      <Hud />
      <NavV3 />
      <HeroV3 />
      <AboutV3 />
      <WorkV3 />
      <GloboV3 />
      <ServicosV3 />
      <RodapeV3 />
    </div>
  );
}
