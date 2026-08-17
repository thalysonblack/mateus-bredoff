import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { TIERS } from "../sections/Pricing";
import { CONTATO } from "../v3-system";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco, useHora } from "./sistema";
import { useRevelar } from "./useRevelar";

/**
 * HOME — PARTIDO H: "O MURAL".
 *
 * Resposta a três coisas ditas em 17/08: *"longa e repetitiva, principalmente a
 * parte de projetos"*, *"falta densidade"*, e o alvo declarado — **revelatio**.
 *
 * ## O ritmo é o do revelatio, medido
 * Lá a home tem 4 trocas de superfície: PRETO(3.492) → BRANCO(1.629) →
 * PRETO(4.009) → BRANCO(2.717) → PRETO(3.042). Abre e fecha escuro, e o branco
 * é sempre o miolo de informação densa entre dois blocos de espetáculo. É uma
 * estrutura de revista: caderno de imagem, caderno de texto, caderno de imagem.
 * ⚠ E é dispositivo EXCLUSIVO da home — as internas dele são quase todas de uma
 * superfície só. Por isso `/v2/work`, `/about` e `/lab` continuam como estão.
 *
 * ## Os projetos deixam de ser lista
 * Nove capítulos com a mesma anatomia é uma lista disfarçada de página. Aqui as
 * nove peças formam UMA composição — escalas e posições diferentes, como a
 * parede de um estúdio — e o scroll atravessa a parede em vez de percorrer
 * fichas. Não há linha para se repetir.
 *
 * ## Densidade
 * Os blocos brancos passam a carregar tudo o que o site sabe: os quatro números
 * da trajetória, a lista inteira de reconhecimento com matéria e ano, os três
 * serviços com escopo e prazo, as ferramentas, a disponibilidade e a hora. Denso
 * não é bagunçado: é muita informação em rótulo pequeno e grade rigorosa.
 */

const MANIFESTO =
  "Brand designer and art director working with companies that want a clear, relevant and memorable presence.";
const LEAD =
  "Every identity starts from strategy — objectives, audience, competitors, market context — and lands as a visual system built with intention, made to connect emotionally and to last.";

const NUMEROS = [
  { valor: "62+", rotulo: "Clients" },
  { valor: "100+", rotulo: "Awards & recognitions" },
  { valor: "56+", rotulo: "Products brought to market" },
  { valor: "46", rotulo: "Founding members" },
];

const FERRAMENTAS = ["Figma", "Nano Banana Pro", "Seedream", "GPT", "Photoshop", "Illustrator", "Jitter"];

/**
 * A parede. `x`/`w` em % da largura, `y` em px de topo — posições escritas à
 * mão para que o equilíbrio seja decidido, não sorteado. Peça grande = projeto
 * que aguenta escala (lettering, cartaz); peça pequena = peça de detalhe.
 */
const MURAL = [
  { x: 3, y: 0, w: 40 },
  { x: 54, y: 210, w: 43 },
  { x: 14, y: 660, w: 29 },
  { x: 58, y: 940, w: 36 },
  { x: 4, y: 1180, w: 42 },
  { x: 62, y: 1560, w: 31 },
  { x: 20, y: 1800, w: 34 },
  { x: 57, y: 2120, w: 37 },
  { x: 6, y: 2340, w: 33 },
];
const MURAL_ALTURA = 2980;

export default function HomeH() {
  useMetaRota();
  const hora = useHora();
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;

  const capAbertura = useRevelar<HTMLElement>();
  const capDenso = useRevelar<HTMLElement>();
  const capProva = useRevelar<HTMLElement>();
  const capFecho = useRevelar<HTMLElement>();
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects">
      {/* ═ PRETO · ESPETÁCULO — a trama viva ═════════════════════════════ */}
      <section ref={capAbertura} className="p-capitulo p-visivel">
        <div className="grid gap-2" aria-hidden="true">
          {[fita, [...fita].reverse(), [...WORK.slice(3), ...WORK.slice(0, 3), ...WORK.slice(3), ...WORK.slice(0, 3)]].map(
            (linha, li) => (
              <div key={li} className="p-trama -mx-[var(--p-margem)]">
                <div
                  className={`p-trama-fita ${li === 1 ? "p-trama-fita--volta" : ""} ${li === 2 ? "p-trama-fita--terca" : ""}`}
                >
                  {linha.map((w, k) => (
                    <span key={`${w.slug}-${k}`} className="flex items-baseline gap-[0.32em]">
                      <span
                        className="p-trama-nome"
                        style={{ backgroundImage: `url(${w.cover.src2x ?? w.cover.src})` }}
                      >
                        {w.title}
                      </span>
                      <span className="p-trama-ponto">·</span>
                    </span>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
        <h1 className="sr-only">
          Mateus Bredoff — brand designer and art director. Selected work:{" "}
          {WORK.map((w) => w.title).join(", ")}.
        </h1>

        {/* a linha de estado: o que o estúdio está fazendo agora */}
        <div
          className="grid grid-cols-12 items-baseline pt-12"
          style={{ columnGap: "var(--p-gap-x)" }}
        >
          <p className="p-sobe p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">{MANIFESTO}</p>
          <p className="p-sobe p-marca col-span-2 col-start-7 max-lg:hidden">
            {String(WORK.length).padStart(2, "0")} works
          </p>
          <p className="p-sobe p-marca col-span-2 max-lg:hidden">Brazil · {hora}</p>
          <p className="p-sobe p-marca col-span-2 text-right max-lg:hidden">Coll. 2025—2026</p>
        </div>
      </section>

      {/* ═ BRANCO · INFORMAÇÃO DENSA ═════════════════════════════════════ */}
      <section
        ref={capDenso}
        className="p-capitulo p-branco -mx-[var(--p-margem)]"
        style={{ paddingInline: "var(--p-margem)" }}
      >
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">Approach</p>
          <p className="p-sobe p-corpo col-span-5 col-start-4 max-w-[54ch] max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-4">
            {LEAD}
          </p>

          {/* os quatro números, no corpo de espécime — o dado é o argumento */}
          <ul className="col-span-3 col-start-10 grid gap-5 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
            {NUMEROS.map((n) => (
              /* ⚠ o número em `--n: 9` saía em 176px e atropelava o próprio
                 rótulo. `--n: 20` o traz para ~64px: continua sendo o maior
                 texto da coluna sem virar cartaz — o dado tem de mandar na
                 ficha, não na página. E o rótulo desce para baixo dele, que é
                 onde legenda de número se lê. */
              <li key={n.rotulo} className="p-sobe">
                <span className="p-especime block" style={{ ["--n" as string]: 20 }}>
                  {n.valor}
                </span>
                <span className="p-marca block pt-1">{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═ PRETO · ESPETÁCULO — o mural ══════════════════════════════════ */}
      <section className="-mx-[var(--p-margem)] p-tinta" style={{ paddingInline: "var(--p-margem)" }}>
        <div className="flex items-baseline justify-between gap-6 pt-[14svh]">
          <p className="p-rotulo">Selected work — {String(WORK.length).padStart(2, "0")}</p>
          <Link to="/v2/work" className="p-marca p-link">
            Index →
          </Link>
        </div>

        <div className="p-mural mt-[8svh] max-md:mt-[6svh]" style={{ height: MURAL_ALTURA }}>
          {WORK.map((w, k) => (
            <PecaDoMural key={w.slug} w={w} k={k} />
          ))}
        </div>
        <div className="h-[14svh]" />
      </section>

      {/* ═ BRANCO · A PROVA ══════════════════════════════════════════════ */}
      <section
        ref={capProva}
        className="p-capitulo p-branco -mx-[var(--p-margem)]"
        style={{ paddingInline: "var(--p-margem)" }}
      >
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">
            Recognition — {String(RECONHECIMENTO.length).padStart(2, "0")}
          </p>
          <ul className="col-span-7 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            {RECONHECIMENTO.map((r) => (
              <li key={`${r.veiculo}-${r.projeto}`} className="p-sobe p-fio py-4">
                <div className="grid grid-cols-12 items-baseline" style={{ columnGap: "var(--p-gap-x)" }}>
                  <span className="p-corpo col-span-3 max-md:col-span-12">
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                        {r.veiculo}
                      </a>
                    ) : (
                      r.veiculo
                    )}
                  </span>
                  <span className="p-corpo col-span-6 max-md:col-span-12" style={{ color: "var(--p-quieto)" }}>
                    {r.titulo}
                  </span>
                  <span className="p-marca col-span-3 text-right max-md:col-span-12 max-md:text-left">
                    {r.projeto} · {r.ano}
                  </span>
                </div>
              </li>
            ))}
            <li className="p-fio" />
          </ul>

          <div className="col-span-2 col-start-11 grid gap-8 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
            <Bloco rotulo="Tools" className="p-sobe">
              <p className="p-corpo" style={{ color: "var(--p-quieto)" }}>
                {FERRAMENTAS.join(", ")}
              </p>
            </Bloco>
          </div>
        </div>

        {/* os serviços, no mesmo caderno branco: a oferta é informação */}
        <div className="grid grid-cols-12 pt-[10svh]" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">
            Services — {String(TIERS.length).padStart(2, "0")}
          </p>
          <ul className="col-span-9 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            {TIERS.map((t) => (
              <li key={t.name} className="p-sobe p-fio py-5">
                <div className="grid grid-cols-12 items-baseline" style={{ columnGap: "var(--p-gap-x)" }}>
                  <span className="p-item col-span-3 max-md:col-span-12">{t.name}</span>
                  <span className="p-corpo col-span-5 max-md:col-span-12" style={{ color: "var(--p-quieto)" }}>
                    {t.scope.join(", ")}
                  </span>
                  <span className="p-marca col-span-2 max-md:col-span-6">{t.timeline}</span>
                  <span className="p-corpo col-span-2 text-right max-md:col-span-6 max-md:text-left">
                    {preco(t.priceFrom)}
                  </span>
                </div>
              </li>
            ))}
            <li className="p-fio" />
          </ul>
        </div>
      </section>

      {/* ═ PRETO · O FECHO ═══════════════════════════════════════════════ */}
      <section ref={capFecho} className="p-capitulo">
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">Contact</p>
          <div className="col-span-6 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            <p className="p-sobe p-especime" style={{ ["--n" as string]: 22 }}>
              hello@mateusbredoff.com
            </p>
            <ul className="p-sobe flex flex-wrap gap-x-6 gap-y-1 pt-8">
              {CONTATO.filter((c) => c.label !== "Email").map((c) => (
                <li key={c.label} className="p-corpo">
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="p-link">
                      {c.label}
                    </a>
                  ) : (
                    <span style={{ color: "var(--p-quieto)" }}>{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Prancha>
  );
}

/** Uma peça pregada na parede: posição fixa, entrada fora de foco, legenda ao pé. */
function PecaDoMural({ w, k }: { w: (typeof WORK)[number]; k: number }) {
  const ref = useRevelar<HTMLAnchorElement>();
  const p = MURAL[k % MURAL.length];
  return (
    <Link
      ref={ref}
      to={`/v2/work/${w.slug}`}
      className="p-mural-peca group"
      style={{ left: `${p.x}%`, top: p.y, width: `${p.w}%` }}
    >
      <img
        src={w.cover.src}
        srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
        sizes="(max-width: 900px) 92vw, 40vw"
        alt={w.cover.alt}
        width={w.cover.w}
        height={w.cover.h}
        loading={k > 1 ? "lazy" : undefined}
        decoding="async"
        draggable={false}
        className="p-foca"
      />
      <span className="p-marca flex items-baseline justify-between pt-2">
        <span>
          {String(k + 1).padStart(2, "0")} · {w.title}
        </span>
        <span style={{ opacity: 0.7 }}>{w.year}</span>
      </span>
    </Link>
  );
}
