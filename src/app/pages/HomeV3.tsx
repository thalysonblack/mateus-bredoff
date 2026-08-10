import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3, Cantos, idx } from "../v3-system";

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
/* reescrito com licença dele (10/08: "pode reescrever a estrutura e conteúdo")
   — compressão do material real do /about, sem fato novo */
const LEAD_ABORDAGEM =
  "Mateus Bredoff is an independent brand designer working with companies that want a clear, relevant and memorable presence. Every identity starts from strategy — objectives, audience, competitors, market context — and lands as a visual system built with intention, made to connect emotionally and to last.";
const LEAD_BRASIL =
  "Every project runs remotely, across time zones — immersion, visual direction, creation and delivery follow the same structured process wherever the brand lives. The distance never reaches the work.";
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
        className="v3-heroimg absolute inset-0 h-full w-full select-none object-cover"
        /* SEM z-index: o nome mescla por exclusion e blend só enxerga o mesmo
           stacking context — o empilhamento vem da ordem do DOM */
      />

      {/* nome — CENTRO da tela, o lugar do logo na referência. Camada própria,
          exclusion (o modo do original dele: amacia o meio-tom sobre pele). */}
      <h1
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white"
        style={{
          mixBlendMode: "exclusion",
          fontFamily: "'Geist', ui-sans-serif, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(40px, 7.4vw, 118px)",
          lineHeight: 0.86,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
        }}
      >
        Mateus Bredoff
      </h1>

      {/* linha de telemetria sobre a base clara do retrato */}
      <div
        className="v3-telem relative flex items-end justify-between gap-6 pb-16 pt-5 max-md:flex-col max-md:items-start max-md:gap-8 max-md:pb-10"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <div>
          <p className="v3-rotulo v3-q pb-4">Brand Designer &amp; Art Director</p>
          <p className="v3-mono v3-justif max-w-[38ch]">{MANIFESTO}</p>
        </div>

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
    <section className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="About" acao={{ texto: "More about me", to: "/v3/about" }} />
      <div
        className="grid grid-cols-12 gap-6"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <div className="col-span-6 max-lg:col-span-12">
          <Display>Where strategy, art direction and business unite</Display>
        </div>
        <div className="col-span-4 col-start-9 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
          <p className="v3-mono v3-justif">{LEAD_ABORDAGEM}</p>
        </div>
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
    <section className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
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
    <section
      className="relative overflow-clip py-20 max-md:py-12"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}
    >
      <Cantos />
      <LinhaSecao rotulo="Around the world" />

      {/* o globo é o CENTRO da seção, grande, atravessando as colunas — o
          conteúdo flutua sobre ele, como na referência */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(58vw,880px)] -translate-x-1/2 -translate-y-[44%] max-lg:w-[130vw] max-lg:opacity-70">
        <svg viewBox="0 0 600 600" className="w-full" role="img" aria-label="Globo — pino no Brasil">
          <g fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1">
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
            fill="currentColor"
            style={{ fontFamily: "'Martian Mono', monospace", fontSize: 11, textTransform: "uppercase" }}
          >
            BRA — GMT−3
          </text>
        </svg>
      </div>

      <div
        className="relative grid min-h-[640px] grid-cols-12 gap-6 max-lg:min-h-0"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        {/* headline sobre o globo, à esquerda */}
        <div className="col-span-6 max-lg:col-span-12">
          <Display>Based in Brazil, working worldwide</Display>

          {/* coordenadas — centro geográfico do BRASIL (fato público; cidade
              dele não se inventa) */}
          <dl className="v3-rotulo mt-24 grid gap-1 max-lg:mt-10">
            <div className="flex gap-3">
              <dt style={{ color: "var(--v3-quieto)" }}>LAT:</dt>
              <dd className="tabular-nums">14.2350° S</dd>
            </div>
            <div className="flex gap-3">
              <dt style={{ color: "var(--v3-quieto)" }}>LON:</dt>
              <dd className="tabular-nums">51.9253° W</dd>
            </div>
          </dl>
        </div>

        {/* telemetria no alto direito */}
        <dl className="v3-rotulo col-span-3 col-start-10 grid content-start gap-4 max-lg:col-span-6 max-lg:col-start-1 max-lg:pt-8">
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

        {/* corpo à direita, embaixo — fecha o quadrante */}
        <p className="v3-mono v3-justif col-span-4 col-start-9 self-end max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-8">
          {LEAD_BRASIL}
        </p>
      </div>
    </section>
  );
}

/* ── lab: os ensaios de IA — tabela de registro, a única da página ────────
   Lista herdada do AILab da direção editorial (lida das artes do
   @sir.bredoff; a bio dele é "Brand Designer, Art Director & AI Creative").
   Marcas de ensaio ficam tagueadas pelo CONTEXTO do lab — sem confissão
   por item. */
const ENSAIOS = [
  { brand: "Fortis", discipline: "Typographic System", medium: "Print / Motion" },
  { brand: "Bureau", discipline: "Electronic Music", medium: "Packaging / Merch" },
  { brand: "Hōki", discipline: "Digital Product", medium: "Interface" },
  { brand: "Neox", discipline: "Technical Apparel", medium: "Campaign" },
  { brand: "Alex Archer", discipline: "Personal Brand", medium: "Editorial" },
  { brand: "Bovine Beats", discipline: "Music Label", medium: "Cover Art" },
];

function LabV3() {
  return (
    <section className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="AI Lab" extra={`[${String(ENSAIOS.length).padStart(2, "0")}]`} />
      <div style={{ paddingInline: "var(--v3-margem)" }}>
        <Display className="max-w-[22ch]">Experiments in AI-driven brand design</Display>

        <div className="mt-14 max-md:mt-8">
          <div className="v3-rotulo grid grid-cols-12 gap-6 border-t border-black/12 py-3 max-md:hidden" style={{ color: "var(--v3-quieto)" }}>
            <span className="col-span-1">Nº</span>
            <span className="col-span-4">Brand</span>
            <span className="col-span-4">Discipline</span>
            <span className="col-span-3">Medium</span>
          </div>
          {ENSAIOS.map((e, i) => (
            <div key={e.brand} className="grid grid-cols-12 items-baseline gap-6 border-t border-black/12 py-4 max-md:grid-cols-2 max-md:gap-2">
              <span className="v3-micro col-span-1 max-md:col-span-2" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span
                className="col-span-4 uppercase max-md:col-span-2"
                style={{
                  fontFamily: "'Geist', ui-sans-serif, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(18px, 1.6vw, 26px)",
                  letterSpacing: "-0.02em",
                }}
              >
                {e.brand}
              </span>
              <span className="v3-rotulo col-span-4 max-md:col-span-1">{e.discipline}</span>
              <span className="v3-rotulo col-span-3 max-md:col-span-1" style={{ color: "var(--v3-quieto)" }}>
                {e.medium}
              </span>
            </div>
          ))}
          <div className="border-t border-black/12 pt-5">
            <a
              href="https://www.instagram.com/sir.bredoff"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-rotulo hover:underline"
            >
              Follow the lab ↳
            </a>
          </div>
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
    <section id="services" className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="Services" extra="[03]" />
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1" style={{ paddingInline: "var(--v3-margem)" }}>
        {TIERS.map((t, i) => (
          <article key={t.name} className="group flex flex-col">
            {/* o "packshot" do serviço: painel de tinta com o nome grande —
                a anatomia do card de produto da referência, sem inventar foto */}
            <a
              href="mailto:hello@mateusbredoff.com"
              aria-label={`Request a quote — ${t.name}`}
              className="relative flex aspect-[4/3] flex-col justify-between p-6 transition-opacity group-hover:opacity-90"
              style={{ background: "var(--fr-petroleo)", color: "var(--fr-creme)" }}
            >
              <span className="v3-micro" style={{ color: "var(--v3-acento-tinta)" }}>
                {idx(i)}
              </span>
              <span
                className="uppercase"
                style={{
                  fontFamily: "'Geist', ui-sans-serif, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 2.6vw, 44px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 0.95,
                }}
              >
                {t.name}
              </span>
              <span className="v3-rotulo flex flex-wrap gap-x-4 gap-y-1" style={{ color: "var(--v3-quieto-tinta)" }}>
                {t.scope.map((sc) => (
                  <span key={sc} className="v3-q">
                    {sc}
                  </span>
                ))}
              </span>
              <span className="absolute right-4 top-4 v3-rotulo" aria-hidden="true">
                +
              </span>
            </a>

            {/* nome + prazo + preço sob o card, como o produto da referência */}
            <div className="flex items-baseline justify-between gap-4 pt-3">
              <span className="v3-rotulo">{t.name}</span>
              <span className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
                {t.timeline}
              </span>
              <span className="v3-rotulo ml-auto">{preco(t.priceFrom)}</span>
            </div>
            <p className="v3-mono v3-justif pt-3" style={{ color: "var(--v3-quieto)" }}>
              {t.description}
            </p>
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
      <LabV3 />
      <ServicosV3 />
      <RodapeV3 />
    </div>
  );
}
