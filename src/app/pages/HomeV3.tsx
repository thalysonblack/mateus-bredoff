import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK, findWork } from "../../content/work";
import { LAB } from "../../content/lab";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
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
/* ── hero: as ARTES em tela cheia, trocando — o "vídeo" da referência ─────
   Fusão fechada em 10/08: partido A aprovado ("a arte é o ambiente") vestindo
   a anatomia exata do hero do noart — obra ao fundo, marca no CENTRO em
   blend, statement mono no canto esquerdo da base, card do próximo no canto
   direito. O retrato saiu da home (mora no /about); quem abre o site é o
   trabalho. */
function HeroV3() {
  const [capa, setCapa] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCapa((c) => (c + 1) % WORK.length), 3600);
    return () => clearInterval(id);
  }, []);
  const ultimo = WORK[0];
  return (
    <section className="relative flex h-[100dvh] min-h-[36rem] w-full flex-col justify-end overflow-clip" style={{ background: "#0d1518" }}>
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
          className="absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700"
          style={{ opacity: i === capa ? 1 : 0 }}
        />
      ))}

      {/* véu de leitura na base — as capas variam de tom, o texto não */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{ background: "linear-gradient(0deg, rgba(13,21,24,0.78), transparent)" }}
        aria-hidden="true"
      />

      {/* nome — CENTRO da tela, o lugar do logo na referência; exclusion
          mescla contra qualquer arte que estiver passando */}
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

      {/* telemetria da base — sempre creme: o véu garante o fundo */}
      <div
        className="relative flex items-end justify-between gap-6 pb-12 max-md:flex-col max-md:items-start max-md:gap-8 max-md:pb-10"
        style={{ paddingInline: "var(--v3-margem)", color: "var(--fr-creme)" }}
      >
        <div>
          <p className="v3-rotulo v3-q pb-4">Brand Designer &amp; Art Director</p>
          <p className="v3-mono v3-justif max-w-[38ch]">{MANIFESTO}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3 max-md:items-start">
          <span className="v3-rotulo tabular-nums" style={{ opacity: 0.7 }}>
            <span style={{ color: "var(--v3-acento-tinta)" }}>{`[${String(capa + 1).padStart(2, "0")}]`}</span>
            {" / "}
            {String(WORK.length).padStart(2, "0")}
          </span>
          <Link
            to={`/work/${ultimo.slug}`}
            className="group flex items-center gap-4 border border-white/20 p-3"
            style={{ backdropFilter: "blur(20px)", background: "rgba(13,21,24,0.35)" }}
          >
            <span className="relative block">
              <img
                src={ultimo.cover.src}
                alt=""
                width={ultimo.cover.w}
                height={ultimo.cover.h}
                className="h-14 w-20 object-cover"
              />
              <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
            </span>
            <span className="v3-rotulo">
              <span className="block opacity-60">Latest case</span>
              <span className="block pt-1">{ultimo.title}</span>
              <span className="block opacity-60">{ultimo.year}</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── about: manifesto justificado + lead mono + números ─────────────────── */
function AboutV3() {
  return (
    <section className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="About" acao={{ texto: "More about me", to: "/about" }} />
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
        acao={{ texto: "Explore all", to: "/work" }}
      />
      <div ref={trilho} className="v3-trilho" style={{ paddingInline: "var(--v3-margem)" }}>
        {WORK.map((w, i) => (
          <Link key={w.slug} to={`/work/${w.slug}`} className="group">
            <span className="relative block overflow-hidden bg-black/5">
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
              <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
            </span>
            <span className="flex items-baseline gap-3 pt-3">
              <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span className="v3-rotulo">{w.title}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 pt-12">
        <button type="button" onClick={() => anda(-1)} className="v3-rotulo cursor-pointer">
          <span className="v3-ante">‹</span> Prev
        </button>
        <span aria-hidden="true" className="flex items-end gap-[3px]">
          {[10, 6, 6, 6].map((h, i) => (
            <i key={i} className="block w-px bg-current" style={{ height: h }} />
          ))}
        </span>
        <button type="button" onClick={() => anda(1)} className="v3-rotulo cursor-pointer">
          Next <span className="v3-prox">›</span>
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
        </dl>

        {/* corpo à direita, embaixo — fecha o quadrante */}
        <p className="v3-mono v3-justif col-span-4 col-start-9 self-end max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-8">
          {LEAD_BRASIL}
        </p>
      </div>
    </section>
  );
}

/* ── lab: esteira contínua — foto onde a arte existe, placa onde não ─────
   Bureau, Neox e Alex Archer têm arte no repo; Fortis, Hōki e Bovine Beats
   vivem só no IG dele. A esteira anda sozinha (marquee CSS), ao contrário do
   carrossel manual do work. Legenda mínima: a régua anti-ruído de 10/08. */
const ENSAIOS = LAB;

function TileLab({ e, i }: { e: (typeof ENSAIOS)[number]; i: number }) {
  const foto = e.slug ? findWork(e.slug)?.cover : undefined;
  return (
    <div className="relative w-[340px] flex-none max-md:w-[240px]">
      {foto ? (
        <img
          src={foto.src}
          alt={foto.alt}
          width={foto.w}
          height={foto.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <span
          className="flex aspect-[4/3] w-full flex-col justify-between p-4"
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
              fontSize: "26px",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            {e.brand}
          </span>
        </span>
      )}
      <span className="flex items-baseline gap-3 pt-2">
        <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
          {idx(i)}
        </span>
        <span className="v3-rotulo">{e.brand}</span>
      </span>
    </div>
  );
}

function LabV3() {
  return (
    <section className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao
        rotulo="AI Lab"
        extra={`[${String(ENSAIOS.length).padStart(2, "0")}]`}
        acao={{ texto: "Explore the lab", to: "/lab" }}
      />
      <div className="v3-esteira-caixa">
        <div className="v3-esteira">
          {[...ENSAIOS, ...ENSAIOS].map((e, k) => (
            <TileLab key={`${e.brand}-${k}`} e={e} i={k % ENSAIOS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── serviços: a mecânica de shop da referência com os tiers REAIS ──────── */
function ServicosV3() {
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;

  /* a FOTO de cada serviço vem do trabalho real dele — a peça que melhor
     representa o que o pacote entrega (pedido de 10/08: services com fotos).
     Alex Archer: sistema tipográfico e aplicação impressa; Stag: o livro. */
  const alex = findWork("alex-archer");
  const stag = findWork("stag");
  const fotos = [alex?.images[2], alex?.images[1], stag?.cover].filter(Boolean) as {
    src: string;
    src2x?: string;
    w: number;
    h: number;
    alt: string;
  }[];

  return (
    <section id="services" className="relative py-20 max-md:py-12" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="Services" extra="[03]" />
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1" style={{ paddingInline: "var(--v3-margem)" }}>
        {TIERS.map((t, i) => {
          const foto = fotos[i];
          return (
            <article key={t.name} className="group flex flex-col">
              {/* o product shot do serviço: peça real do portfólio */}
              <a
                href="mailto:hello@mateusbredoff.com"
                aria-label={`Request a quote — ${t.name}`}
                className="relative block overflow-hidden"
              >
                {foto ? (
                  <img
                    src={foto.src}
                    srcSet={foto.src2x ? `${foto.src} 1400w, ${foto.src2x} 2200w` : undefined}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    alt={foto.alt}
                    width={foto.w}
                    height={foto.h}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : null}
                <span
                  className="v3-micro absolute left-4 top-4"
                  style={{ color: "var(--fr-creme)", mixBlendMode: "difference" }}
                >
                  {idx(i)}
                </span>
                <span
                  className="v3-mais v3-rotulo absolute right-4 top-4"
                  style={{ color: "var(--fr-creme)", mixBlendMode: "difference" }}
                  aria-hidden="true"
                >
                  +
                </span>
                <i className="v3-foco" aria-hidden="true" style={{ color: "#fff" }}><b /><b /><b /><b /></i>
              </a>

              {/* nome + prazo + preço sob a foto, como o produto da referência */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <span className="v3-rotulo">{t.name}</span>
                <span className="v3-rotulo ml-auto">{preco(t.priceFrom)}</span>
              </div>
            </article>
          );
        })}
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
