import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { TIERS } from "../sections/Pricing";
import { CONTATO } from "../v3-system";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, useHora } from "./sistema";
import { useRevelar } from "./useRevelar";

/**
 * HOME — PARTIDO I: "A SESSÃO".
 *
 * Os nove projetos em UM bloco, não em nove capítulos: cada peça ocupa a tela
 * inteira e **a seguinte sobe por cima**, cobrindo. A página não percorre uma
 * lista — ela atravessa uma sessão de projeção.
 *
 * ⭐ A mecânica é `position: sticky` puro, e isso veio de medição: o bloco de
 * peças do artefakt.mov PARECE carrossel e não é (24s com a página parada = zero
 * trocas). São cards sticky que se sobrepõem por scroll. Sem estado, sem timer,
 * sem ScrollTrigger — e por isso não briga com o Lenis nem quebra o teclado.
 *
 * ⭐ O contador é PARTIDO — o número corrente no centro da tela e o "/ 09" na
 * borda direita, separados. Medido lá, e é o detalhe que dá ar de telemetria em
 * vez de paginação de carrossel. Cada card carrega o SEU índice, em vez de um
 * contador global sincronizado por estado: nove verdades locais, zero JS.
 *
 * O ritmo da página é o do revelatio: PRETO (a sessão) → BRANCO (a prova densa)
 * → PRETO (o fecho).
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

export default function HomeI() {
  useMetaRota();
  const hora = useHora();
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;
  const capProva = useRevelar<HTMLElement>();
  const capFecho = useRevelar<HTMLElement>();
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects">
      {/* ═ ABERTURA — a trama, curta: ela apresenta e sai de cena ════════ */}
      <section className="pt-6">
        <div className="grid gap-2" aria-hidden="true">
          {[fita, [...fita].reverse()].map((linha, li) => (
            <div key={li} className="p-trama -mx-[var(--p-margem)]">
              <div className={`p-trama-fita ${li === 1 ? "p-trama-fita--volta" : ""}`}>
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
          ))}
        </div>
        <h1 className="sr-only">
          Mateus Bredoff — brand designer and art director. Selected work:{" "}
          {WORK.map((w) => w.title).join(", ")}.
        </h1>

        <div className="grid grid-cols-12 items-baseline pt-10" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">{MANIFESTO}</p>
          <p className="p-marca col-span-2 col-start-9 max-lg:hidden">Brazil · {hora}</p>
          <p className="p-marca col-span-2 text-right max-lg:hidden">
            {String(WORK.length).padStart(2, "0")} works · 2026
          </p>
        </div>
      </section>

      {/* ═ A SESSÃO — nove telas que se cobrem ═══════════════════════════ */}
      <div className="flex items-baseline justify-between gap-6 pt-[16svh]">
        <p className="p-rotulo">Selected work — {String(WORK.length).padStart(2, "0")}</p>
        <Link to="/v2/work" className="p-marca p-link">
          Index →
        </Link>
      </div>

      <div className="relative -mx-[var(--p-margem)] mt-6">
        {/* a régua da sessão: mede o percurso pelas nove peças. Fio de 1px em
            vez de bolinhas — o site inteiro é telemetria, não interface. */}
        <div className="p-regua-sessao" aria-hidden="true">
          <i />
        </div>

        {WORK.map((w, k) => (
          <article key={w.slug} className="p-sessao-card">
            {/* a peça INTEIRA é o alvo do clique, não só o rótulo do canto: numa
                tela em que a arte ocupa tudo, obrigar a mirar num link de 13px é
                pedir precisão sem motivo. O rótulo continua, porque affordance
                de clique não se adivinha. */}
            <Link
              to={`/v2/work/${w.slug}`}
              className="absolute inset-0 z-10"
              aria-label={`Open ${w.title}`}
            />
            <div className="p-sessao-camada">
            <img
              src={w.cover.src}
              srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              alt={w.cover.alt}
              width={w.cover.w}
              height={w.cover.h}
              loading={k > 1 ? "lazy" : undefined}
              decoding="async"
              draggable={false}
              className="p-sessao-art absolute inset-0 h-full w-full object-cover"
            />
            </div>

            {/* o contador PARTIDO: o número no centro, o total na borda */}
            {/* ⚠ SEM `mix-blend-difference` aqui. A primeira montagem usava,
                e sobre a arte vermelha do Ginga o número saiu verde-água — o
                blend inverte contra a cor de baixo, e as capas dele vão de
                vermelho pleno a preto. Branco sólido com um halo curto é o
                único que sobrevive às nove peças. Este repo já perdeu texto
                para blend duas vezes; não é para insistir. */}
            <span
              className="p-especime absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                ["--n" as string]: 5,
                color: "#fff",
                textShadow: "0 2px 40px rgba(10,16,15,0.45)",
              }}
              aria-hidden="true"
            >
              {String(k + 1).padStart(2, "0")}
            </span>
            <span
              className="p-rotulo absolute top-1/2 -translate-y-1/2"
              style={{ right: "var(--p-margem)", color: "#fff" }}
              aria-hidden="true"
            >
              / {String(WORK.length).padStart(2, "0")}
            </span>

            {/* a ficha, na base, sobre um véu curto — a arte varia de tom e o
                texto não pode variar junto */}
            <div
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-8 pt-24"
              style={{
                paddingInline: "var(--p-margem)",
                background: "linear-gradient(0deg, rgba(10,16,15,0.82), transparent)",
                color: "#fff",
              }}
            >
              <div className="p-sessao-ficha">
                <p className="p-especime" style={{ ["--n" as string]: w.title.length + 8 }}>
                  {w.title}
                </p>
                <p className="p-marca pt-2" style={{ opacity: 0.75 }}>
                  {w.disciplines.join(", ")} — {w.year}
                </p>
              </div>
              <span className="p-corpo p-link relative z-20 shrink-0">Open project →</span>
            </div>
          </article>
        ))}
      </div>

      {/* ═ BRANCO — a prova densa ════════════════════════════════════════ */}
      <section
        ref={capProva}
        className="p-capitulo p-branco -mx-[var(--p-margem)]"
        style={{ paddingInline: "var(--p-margem)" }}
      >
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">Approach</p>
          <p className="p-sobe p-corpo col-span-5 col-start-4 max-w-[54ch] max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-4">
            {LEAD}
          </p>
          <ul className="col-span-3 col-start-10 grid gap-5 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
            {NUMEROS.map((n) => (
              <li key={n.rotulo} className="p-sobe">
                <span className="p-especime block" style={{ ["--n" as string]: 20 }}>
                  {n.valor}
                </span>
                <span className="p-marca block pt-1">{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-12 pt-[10svh]" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">
            Recognition — {String(RECONHECIMENTO.length).padStart(2, "0")}
          </p>
          <ul className="col-span-9 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
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
        </div>

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

      {/* ═ PRETO — o fecho ═══════════════════════════════════════════════ */}
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
