import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK, findWork } from "../../content/work";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";
import { LAB } from "../../content/lab";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3, Cantos, idx } from "../v3-system";
import GloboTerra from "../sections/GloboTerra";
import WorkEnxame from "../sections/WorkEnxame";
import { useCraft } from "../../hooks/useCraft";

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
  const ultimo = WORK[0];
  return (
    <section
      data-secao="Index"
      className="relative flex h-[100dvh] min-h-[36rem] w-full flex-col justify-end overflow-clip"
      style={{
        /* ⚠ Cores AMOSTRADAS do arquivo do retrato, não escolhidas a olho: a
           foto já é um gradiente petróleo→claro, e qualquer área que sobre no
           `cover` casa sem emenda. Recriar um gradiente por baixo de foto com
           fundo opaco é o erro que esta linha existe para não repetir. */
        background:
          "linear-gradient(180deg, #18373f 0%, #486067 25%, #8d9ca1 50%, #d4d8da 85%, #eceded 100%)",
      }}
    >
      {/* O retrato como AMBIENTE — de volta em 16/08 a pedido dele ("a foto da
          hero deixa a dele mesmo como já tínhamos"). Ele havia saído na fusão de
          10/08, quando o hero passou a ser as capas trocando.

          As duas aprovações convivem: volta a MATÉRIA que ele aprovou (o
          retrato-ambiente do site publicado dele) dentro da ANATOMIA que ele
          aprovou depois (nome no centro em blend, manifesto na base à esquerda,
          card do último case à direita). O que saiu foi só o contador de capas,
          que não tem mais o que contar.

          O zoom lento faz o papel que o vídeo faz na referência: a primeira tela
          respira sem pedir nada de quem chega. */}
      <img
        src={portrait1600}
        srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
        sizes="100vw"
        alt="Mateus Bredoff"
        width={1600}
        height={850}
        draggable={false}
        className="v3-hero-foto absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* véu de leitura na base — o retrato varia de tom, o texto não */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{ background: "linear-gradient(0deg, rgba(13,21,24,0.78), transparent)" }}
        aria-hidden="true"
      />

      <div
        className="relative flex items-end justify-between gap-6 pb-8 max-md:flex-col max-md:items-start max-md:gap-8 max-md:pb-6"
        style={{ paddingInline: "var(--v3-margem)", color: "var(--fr-creme)" }}
      >
        <div>
          <p className="v3-rotulo v3-q pb-4">Brand Designer &amp; Art Director</p>
          <p className="v3-mono v3-justif max-w-[38ch]">{MANIFESTO}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3 max-md:items-start">
          <Link viewTransition
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

      {/* ⚠ O NOME SANGRA PELA BASE, e isto não é escolha de composição: é a
          única faixa livre desta foto.

          Quando o hero eram as capas trocando, o nome ficava no CENTRO — a
          anatomia da referência, e ali o fundo era arte, então o centro era
          neutro. Com o retrato de volta, o centro da tela é o ROSTO DELE: na
          primeira montagem o "MATEUS BREDOFF" cruzou o nariz e a boca do
          cliente. Já cometi este erro antes e ele está anotado — texto sobre
          foto se resolve medindo a faixa livre contra a cabeça, nunca herdando
          a posição que funcionava com outro fundo.

          A base é livre (ombro e fundo claro), é onde o site publicado dele já
          punha o nome, e é o que ele quis dizer com "como já tínhamos".
          `exclusion` e não `difference`: sobre pele o exclusion amacia o
          meio-tom. */}
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
          marginBottom: "-0.06em",
        }}
      >
        Mateus Bredoff
      </h1>
    </section>
  );
}

/* ── about: manifesto justificado + lead mono + números ─────────────────── */
function AboutV3() {
  return (
    <section data-secao="About" className="relative py-28 max-md:py-14" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao rotulo="About" acao={{ texto: "More about me", to: "/about" }} />
      <div
        className="grid grid-cols-12 gap-6"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <div className="col-span-7 max-lg:col-span-12">
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
    <section data-secao="Selected Work" className="relative py-28 max-md:py-14" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Cantos />
      <LinhaSecao
        rotulo="Selected work"
        extra={`[${String(WORK.length).padStart(2, "0")}]`}
        acao={{ texto: "Explore all", to: "/work" }}
      />
      <div ref={trilho} data-foca className="v3-trilho" style={{ paddingInline: "var(--v3-margem)" }}>
        {WORK.map((w, i) => (
          <Link viewTransition key={w.slug} to={`/work/${w.slug}`} className="group">
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

/* ── globo: a Terra girando + os DOIS relógios ───────────────────────────
   O desenho vive em sections/GloboTerra (canvas, dado real, gira com o
   scroll) — leia o cabeçalho de lá antes de mexer.

   A telemetria mudou de assunto. Antes eram dois campos sobre ELE (hora local,
   fuso), o que não diz nada a quem está lendo: "GMT−3" é trivia. Agora são
   DOIS relógios lado a lado, o dele e o de QUEM ESTÁ OLHANDO, com a distância
   em horas entre os dois — o navegador já sabe o fuso do visitante, então isso
   é fato puro, nada inventado, e é a própria frase da seção acontecendo na
   tela: a distância existe, e não alcança o trabalho. Em São Paulo o bloco se
   resolve sozinho e diz "same hours as you". */
const FUSO_DELE = "America/Sao_Paulo";

function relogio(tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Diferença em horas entre dois fusos, medida no MESMO instante. */
function distanciaEmHoras(a: string, b: string) {
  const agora = new Date();
  const emTz = (tz: string) =>
    new Date(agora.toLocaleString("en-US", { timeZone: tz })).getTime();
  return Math.round((emTz(b) - emTz(a)) / 3.6e6);
}

function GloboV3() {
  const [hora, setHora] = useState("--:--:--");
  const [suaHora, setSuaHora] = useState("--:--:--");
  const [visitante, setVisitante] = useState({ tz: "", delta: 0 });

  useEffect(() => {
    const tzVisitante =
      Intl.DateTimeFormat().resolvedOptions().timeZone || FUSO_DELE;
    setVisitante({
      tz: tzVisitante,
      delta: distanciaEmHoras(FUSO_DELE, tzVisitante),
    });

    const dele = relogio(FUSO_DELE);
    const seu = relogio(tzVisitante);
    const tick = () => {
      const agora = new Date();
      setHora(dele.format(agora));
      setSuaHora(seu.format(agora));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const mesmoFuso = visitante.delta === 0;
  /* "5 hours behind you" lê melhor que "−5h": a frase é sobre a pessoa */
  const distancia = mesmoFuso
    ? "Same hours as you"
    : `${Math.abs(visitante.delta)} ${Math.abs(visitante.delta) === 1 ? "hour" : "hours"} ${
        visitante.delta > 0 ? "behind you" : "ahead of you"
      }`;

  return (
    <section data-secao="Around the World"
      className="relative overflow-clip py-28 max-md:py-14"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}
    >
      <Cantos />
      <LinhaSecao rotulo="Around the world" />

      {/* o globo é o CENTRO da seção, grande, atravessando as colunas — o
          conteúdo flutua sobre ele, como na referência */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(58vw,880px)] -translate-x-1/2 -translate-y-[44%] max-lg:w-[128vw] max-lg:opacity-60">
        <GloboTerra className="block aspect-square w-full" />
      </div>

      <div
        className="relative grid min-h-[640px] grid-cols-12 gap-6 max-lg:min-h-0"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        {/* headline sobre o globo, à esquerda */}
        <div className="col-span-7 max-lg:col-span-12">
          <Display>Based in Brazil, working worldwide</Display>
        </div>

        {/* os dois relógios: o dele e o de quem está lendo */}
        <div className="col-span-4 col-start-9 self-start pt-6 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
          <div className="grid grid-cols-2 gap-x-6 border-t border-black/12 pt-4" data-foca>
            <div>
              <p className="v3-micro" style={{ color: "var(--v3-quieto)" }}>
                His time
              </p>
              <p className="v3-hora tabular-nums">{hora}</p>
              <p className="v3-micro pt-1" style={{ color: "var(--v3-quieto)" }}>
                Brazil — GMT−3
              </p>
            </div>
            <div>
              <p className="v3-micro" style={{ color: "var(--v3-quieto)" }}>
                Your time
              </p>
              <p className="v3-hora tabular-nums">{suaHora}</p>
              <p className="v3-micro truncate pt-1" style={{ color: "var(--v3-quieto)" }}>
                {visitante.tz.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <p
            className="v3-rotulo pt-4"
            style={{ color: mesmoFuso ? "var(--v3-quieto)" : "var(--v3-acento)" }}
          >
            ■ {distancia}
          </p>
        </div>

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

/**
 * Um ensaio na esteira. **Sempre um link** — foi o pedido dele em 15/08 ("AI
 * lab, não dá pra clicar?"), e a pergunta era justa: metade dos tiles eram
 * `<div>`, então o cursor não mudava, o teclado não alcançava e clicar não
 * fazia nada. Quem tem arte no repo vai para o próprio case; quem só existe no
 * Instagram dele vai para `/lab`, onde a galeria mostra o resto.
 *
 * A placa dos que não têm arte também mudou. Era um retângulo de petróleo
 * vazio com o nome no rodapé — três dos seis ensaios eram um buraco escuro na
 * esteira. Agora é uma PEÇA: nome em corpo de cartaz sangrando pela borda,
 * disciplina e meio (dados reais de `content/lab.ts`) na base, índice no alto.
 * Sem arte para mostrar, a tipografia é a matéria — não um espaço reservado
 * esperando imagem.
 */
function TileLab({ e, i }: { e: (typeof ENSAIOS)[number]; i: number }) {
  const foto = e.slug ? findWork(e.slug)?.cover : undefined;
  return (
    <Link viewTransition
      to={e.slug ? `/work/${e.slug}` : "/lab"}
      aria-label={`${e.brand} — ${e.discipline}`}
      className="v3-tile group relative block w-[340px] flex-none max-md:w-[240px]"
    >
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
        /* a placa como CARTAZ: o nome ocupa a peça e sangra, em vez de esperar
           uma imagem que ainda não existe */
        <span
          className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-clip p-4"
          style={{ background: "var(--fr-petroleo)", color: "var(--fr-creme)" }}
        >
          <span className="v3-micro relative z-10" style={{ color: "var(--v3-acento-tinta)" }}>
            {idx(i)}
          </span>
          {/* ⚠ o fantasma é o NUMERAL, não o nome. Com o nome ele ecoava a si
              mesmo — "BOVINE BEATS" gigante e translúcido atrás de "BOVINE
              BEATS" sólido, a mesma palavra duas vezes na mesma peça. O
              numeral dá o mesmo peso de cartaz sem repetir palavra alguma. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-6 tabular-nums"
            style={{
              fontFamily: "'Geist', ui-sans-serif, sans-serif",
              fontWeight: 700,
              fontSize: "150px",
              letterSpacing: "-0.06em",
              lineHeight: 0.8,
              opacity: 0.11,
            }}
          >
            {idx(i)}
          </span>
          <span className="relative z-10 flex items-end justify-between gap-3">
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
            <span className="v3-micro pb-1 text-right" style={{ color: "var(--v3-quieto-tinta)" }}>
              {e.medium}
            </span>
          </span>
        </span>
      )}
      <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
      <span className="flex items-baseline gap-3 pt-2">
        <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
          {idx(i)}
        </span>
        <span className="v3-rotulo">{e.brand}</span>
        <span className="v3-micro ml-auto" style={{ color: "var(--v3-quieto)" }}>
          {e.discipline}
        </span>
      </span>
    </Link>
  );
}

function LabV3() {
  return (
    <section data-secao="AI Lab" className="relative py-28 max-md:py-14" style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
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

/* ── serviços: faixa de largura total + painel da peça ───────────────────
   Refeito em 15/08 — "os services achei tímido", e o diagnóstico é preciso:
   eram três cards com uma foto, o NOME em rótulo de 12px e o preço ao lado.
   Ou seja, ele vende pacote de identidade e a home mostrava dois dados sobre
   ele. Os TIERS já carregam `scope` (o que entra), `description` (para quem é)
   e `timeline` (quanto leva), e nada disso chegava à tela.

   A estrutura nova é FAIXA, não card: cada serviço atravessa a página com o
   nome em corpo de display, o escopo em coluna, prazo e preço em escala de
   leitura. É o gesto que ele mesmo apontou na REBOOT/Setters (serviço como
   faixa que corta a página) — ⚠ sem a pílula arredondada de lá: raio zero é
   lei neste sistema.

   A peça vive num painel STICKY à direita e troca conforme a faixa é
   percorrida. Três fotos pequenas viraram uma grande, e o painel é estrutura
   que ainda não estava em uso nesta página (hero em tela cheia, about em duas
   colunas, work em tira, globo no centro, lab em esteira) — a régua de nunca
   repetir a estrutura da seção vizinha. */
/* O que a peça do painel mostra, na língua do site. Uma linha por tier, na
   mesma ordem de `fotos` — descreve a PEÇA, não o serviço, porque o nome do
   serviço já está do lado. */
const LEGENDA_PECA = [
  "typographic system, Alex Archer",
  "printed application, Alex Archer",
  "editorial system, Stag",
];

function ServicosV3() {
  const [ativo, setAtivo] = useState(0);
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;

  /* a peça de cada serviço vem do trabalho real dele: o sistema tipográfico e
     a aplicação impressa do Alex Archer, e o livro do Stag */
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
    <section data-secao="Services"
      id="services"
      className="relative py-28 max-md:py-14"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}
    >
      <Cantos />
      <LinhaSecao rotulo="Services" extra={`[0${TIERS.length}]`} />

      <div
        className="grid grid-cols-12 gap-6 max-lg:gap-4"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        {/* as faixas */}
        <div className="col-span-8 max-lg:col-span-12" data-foca>
          {TIERS.map((t, i) => (
            <a
              key={t.name}
              href={`mailto:hello@mateusbredoff.com?subject=${encodeURIComponent(
                `${t.name} — project enquiry`,
              )}`}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              className="v3-faixa group grid grid-cols-8 gap-6 border-t border-black/12 py-7 max-md:grid-cols-4 max-md:gap-3 max-md:py-6"
              style={{ borderTopColor: ativo === i ? "var(--v3-acento)" : undefined }}
            >
              <span className="v3-micro col-span-1 pt-3" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>

              <span className="col-span-4 max-md:col-span-3">
                <span className="v3-servico block">{t.name}</span>
                <span className="v3-mono mt-3 block max-w-[46ch]" style={{ color: "var(--v3-quieto)" }}>
                  {t.description}
                </span>
              </span>

              {/* o que entra — o dado que o card antigo escondia */}
              <ul className="col-span-2 grid content-start gap-1 pt-2 max-md:col-span-4 max-md:grid-cols-2 max-md:pt-4">
                {t.scope.map((s) => (
                  <li key={s} className="v3-micro" style={{ color: "var(--v3-quieto)" }}>
                    <span style={{ color: "var(--v3-acento)" }}>+</span> {s}
                  </li>
                ))}
              </ul>

              <span className="col-span-1 grid content-start justify-items-end gap-2 pt-2 max-md:col-span-4 max-md:justify-items-start max-md:pt-3">
                <span className="v3-rotulo whitespace-nowrap text-right max-md:text-left">
                  {preco(t.priceFrom)}
                </span>
                <span className="v3-micro whitespace-nowrap" style={{ color: "var(--v3-quieto)" }}>
                  {t.timeline}
                </span>
                <span className="v3-seta-cta v3-rotulo" aria-hidden="true">
                  ↳
                </span>
              </span>
            </a>
          ))}
          <div className="border-t border-black/12" />
        </div>

        {/* o painel: a peça do serviço percorrido, grande e sticky */}
        <div className="col-span-4 max-lg:hidden">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] w-full overflow-clip">
              {fotos.map((f, i) => (
                <img
                  key={f.src}
                  src={f.src}
                  srcSet={f.src2x ? `${f.src} 1400w, ${f.src2x} 2200w` : undefined}
                  sizes="33vw"
                  alt={f.alt}
                  width={f.w}
                  height={f.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: ativo === i ? 1 : 0 }}
                />
              ))}
              <i className="v3-foco" aria-hidden="true" style={{ color: "#fff", opacity: 1, transform: "none" }}>
                <b /><b /><b /><b />
              </i>
            </div>
            {/* ⚠ A legenda NÃO usa o `alt` da imagem. O alt do acervo é escrito
                em português (é texto de acessibilidade da nossa base) e vinha
                parar na tela de um site inteiro em inglês — "COMPLETE — ALEX
                ARCHER — APLICAÇÃO IMPRESSA". Rótulo visível é conteúdo e tem
                idioma; alt é metadado. São coisas diferentes. */}
            <p className="v3-micro pt-3" style={{ color: "var(--v3-quieto)" }}>
              <span style={{ color: "var(--v3-acento)" }}>■</span> {TIERS[ativo].name} —{" "}
              {LEGENDA_PECA[ativo]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ── reconhecimento: a única TABELA da página ─────────────────────────────
   Pedido de 16/08 — "a home ainda é curta, mais respiro, mais coisas pela
   grandiosidade dele; um projeto dele estava na Abduzeedo". É a seção que diz o
   que o portfólio não pode dizer sobre si mesmo: que outra gente escolheu
   mostrar aquele trabalho.

   Estrutura de REGISTRO, com cabeçalho de coluna — e é a única da página. Hero
   em tela cheia, about em duas colunas, work em tira, globo no centro, lab em
   esteira, services em faixa: a régua de nunca repetir a estrutura da vizinha
   ainda vale, e uma lista de publicações é literalmente uma tabela de
   ocorrências. Ano à esquerda porque é por ele que se lê uma trajetória.

   ⚠ Item sem `href` vira RÓTULO, não link morto — ver a régua em
   `content/reconhecimento.ts`. O World Brand Design fechou atrás de senha e a
   matéria continua sendo fato; o que não pode é o site prometer um clique que
   entrega uma tela de login. */
function ReconhecimentoV3() {
  return (
    <section
      data-secao="Recognition"
      className="relative py-28 max-md:py-14"
      style={{ background: "var(--fr-petroleo)", color: "var(--fr-creme)" }}
    >
      <LinhaSecao
        rotulo="Recognition"
        extra={`[${String(RECONHECIMENTO.length).padStart(2, "0")}]`}
      />

      <div style={{ paddingInline: "var(--v3-margem)" }}>
        <div className="max-w-[52ch] pb-16 max-md:pb-10">
          <Display>Published by people who had no reason to</Display>
        </div>

        {/* cabeçalho de coluna: o vernáculo de tabela de registro */}
        <div
          className="v3-micro grid grid-cols-12 gap-6 border-b pb-3 max-md:hidden"
          style={{ color: "var(--v3-quieto-tinta)", borderColor: "rgba(237,230,225,0.22)" }}
        >
          <span className="col-span-1">Year</span>
          <span className="col-span-3">Published in</span>
          <span className="col-span-6">Feature</span>
          <span className="col-span-2 text-right">Project</span>
        </div>

        <ul data-foca>
          {RECONHECIMENTO.map((r) => {
            const linha = (
              <>
                <span className="v3-rotulo col-span-1 tabular-nums max-md:col-span-2" style={{ color: "var(--v3-acento-tinta)" }}>
                  {r.ano}
                </span>
                <span className="v3-reconhece col-span-3 max-md:col-span-10">{r.veiculo}</span>
                <span className="v3-mono col-span-6 self-center max-md:col-span-12 max-md:pt-1" style={{ color: "var(--v3-quieto-tinta)" }}>
                  {r.titulo}
                </span>
                <span className="v3-rotulo col-span-2 self-center text-right max-md:col-span-12 max-md:pt-1 max-md:text-left" style={{ color: "var(--v3-quieto-tinta)" }}>
                  {r.projeto}
                  {r.href ? <span className="v3-seta pl-2">↳</span> : null}
                </span>
              </>
            );
            const classe =
              "v3-registro grid grid-cols-12 items-baseline gap-6 border-b py-6 max-md:grid-cols-12 max-md:gap-y-1 max-md:py-5";
            const estilo = { borderColor: "rgba(237,230,225,0.22)" };
            return (
              <li key={`${r.veiculo}-${r.projeto}`}>
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className={`group ${classe}`} style={estilo}>
                    {linha}
                  </a>
                ) : (
                  <span className={classe} style={estilo}>
                    {linha}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * A home. `work="enxame"` troca APENAS a seção Selected Work pela dispersão de
 * `sections/WorkEnxame` — é o que permite comparar os dois partidos em duas
 * abas sem duplicar a página inteira (e sem que as duas cópias comecem a
 * divergir no dia seguinte). Todo o resto é literalmente o mesmo componente.
 */
export default function HomeV3({ work = "tira" }: { work?: "tira" | "enxame" } = {}) {
  useMetaRota();
  /* os gestos de scroll da página — ver `animations/craft.ts` e `useCraft` */
  const raiz = useCraft();

  return (
    <div ref={raiz} style={{ background: "var(--fr-papel)" }}>
      <Hud />
      <NavV3 />
      <HeroV3 />
      <AboutV3 />
      {work === "enxame" ? <WorkEnxame /> : <WorkV3 />}
      <GloboV3 />
      <ReconhecimentoV3 />
      <LabV3 />
      <ServicosV3 />
      <RodapeV3 />
    </div>
  );
}
