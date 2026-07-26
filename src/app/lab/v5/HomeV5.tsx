import { Link } from "react-router";
import { Mono, Rule, Bracket } from "../../system";
import { WORK } from "../../../content/work";
import Intro from "../../sections/Intro";
import Menu from "../../sections/Menu";
import Pricing from "../../sections/Pricing";
import Footer from "../../sections/Footer";
import portrait1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../../assets/optimized/hero-portrait-3200.webp";
import Node from "./Node";
import Wires from "./Wires";
import EditorChrome from "../v4/EditorChrome";

/**
 * HOME V5 — a página como CANVAS DE NÓS.
 *
 * O partido: o portfólio se apresenta como o grafo em que ele trabalha. Cada
 * bloco é um nó com tipo, nome e portas; fios de Bézier ligam a saída de um à
 * entrada do próximo; a moldura da ferramenta (régua, zoom, cursor nomeado)
 * fecha o ambiente.
 *
 * A JUSTIFICATIVA é de identidade, e é o que separa isto de estética emprestada:
 * o Mateus se assina "Brand Designer, Art Director & AI Creative", é Creative
 * Partner da Flora — cujo produto é justamente um canvas de nós — e trabalha de
 * forma experimental. Um portfólio dele em forma de grafo DIZ O QUE ELE FAZ pela
 * própria forma. Nenhuma das versões anteriores fazia isso: elas eram bem
 * desenhadas e poderiam ser de qualquer designer competente.
 *
 * A leitura do grafo também é o argumento comercial, na ordem em que o trabalho
 * acontece de verdade:
 *
 *   INPUT   quem ele é           → o retrato e a proposta
 *   IMAGE   o que já fez         → os cases, cada um um nó
 *   PROMPT  como pensa           → o método, em etapas
 *   MODEL   o que sabe fazer     → as disciplinas
 *   OUTPUT  quanto custa         → os engajamentos
 *
 * ⚠ Os fios são desenhados por `Wires` a partir de `data-node`. A ordem abaixo
 * define o caminho do grafo — mudar a sequência das seções sem mudar o array
 * deixa fio cruzando a página.
 */

const GRAFO = ["input", "cases", "prompt", "model", "output"];

const STEPS = [
  { name: "Understanding", detail: "Goals, audience and competitors on the table before any visual decision." },
  { name: "Concept", detail: "Conceptual research that turns strategy into visual expression." },
  { name: "System", detail: "The identity built as a system, with rules that hold without me." },
  { name: "Handoff", detail: "Applications, files and the documentation the team needs." },
];

const DISCIPLINAS = [
  "Branding",
  "Art Direction",
  "Creative Direction",
  "Digital Design",
  "Brand Strategy",
  "AI Direction",
];

export default function HomeV5() {
  return (
    <>
      <Intro />

      <div className="on-paper w-full">
        <div className="bleed flex items-baseline justify-between gap-4 py-2">
          <Mono className="acc">Home · V5</Mono>
          <Mono dim>Canvas de nós · o método como forma</Mono>
        </div>
      </div>

      {/* `relative` para o SVG dos fios se posicionar em coordenadas de documento */}
      <div className="on-paper relative w-full">
        <Menu />
        <Wires order={GRAFO} />

        <div className="bleed relative z-20 flex flex-col gap-[clamp(3rem,8vw,8rem)] pb-[clamp(3rem,7vw,7rem)] pt-[clamp(2rem,4vw,3rem)]">
          {/* ── INPUT ─────────────────────────────────────────── */}
          <Node id="input" kind="INPUT" name="mateus-bredoff" inPort={false} className="md:w-[86%]">
            <div className="grid grid-cols-1 gap-[clamp(1rem,2.5vw,2.5rem)] p-[clamp(1rem,2vw,1.75rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="flex flex-col justify-between gap-[clamp(1.5rem,3vw,2.5rem)]">
                <h1 className="t-display t-display-xl" style={{ fontSize: "clamp(1.75rem,4.6vw,78px)" }}>
                  Visual identities for brands
                  <br />
                  <span className="dim">that need to be taken seriously.</span>
                </h1>

                <div>
                  <p className="t-body max-w-[40ch]">
                    Brand designer, art director and AI creative — from the mark itself to the system
                    that keeps it standing when other people take over.
                  </p>
                  <div className="flex flex-wrap items-center gap-[clamp(1rem,2vw,1.5rem)] pt-[clamp(1.25rem,2.5vw,2rem)]">
                    <span
                      className="inline-flex flex-col px-[0.9em] py-[0.6em]"
                      style={{ border: "1px solid var(--rule)" }}
                    >
                      <Mono>Available for work</Mono>
                      <Mono dim>Two slots · Q3</Mono>
                    </span>
                    <a href="#contact" className="link-quiet">
                      <Bracket>START A PROJECT</Bracket>
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-hidden" style={{ aspectRatio: "1600 / 850" }}>
                <img
                  src={portrait1600}
                  srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
                  sizes="(min-width: 768px) 42vw, 100vw"
                  alt="Mateus Bredoff"
                  width={1600}
                  height={850}
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 18%" }}
                />
              </div>
            </div>
          </Node>

          {/* ── IMAGE (cases) ─────────────────────────────────── */}
          <Node id="cases" kind="IMAGE" name={`selected-work · ${WORK.length}`} className="md:ml-[8%] md:w-[92%]">
            <div className="p-[clamp(1rem,2vw,1.75rem)]">
              <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-3">
                {WORK.map((w, i) => (
                  <Link key={w.slug} to={`/work/${w.slug}`} className="group block">
                    <div
                      className="w-full overflow-hidden"
                      style={{ aspectRatio: "4 / 3", border: "1px solid var(--rule)" }}
                    >
                      <img
                        src={w.cover.src}
                        srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        alt={w.cover.alt}
                        loading={i < 3 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                    <div className="flex items-baseline justify-between gap-3 pt-2">
                      <Mono dim className="idx-acc">{String(i + 1).padStart(2, "0")}</Mono>
                      <Mono className="text-right">
                        {w.title}
                        <span className="dim">{` / ${w.year}`}</span>
                      </Mono>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Node>

          {/* ── PROMPT (método) ───────────────────────────────── */}
          <Node id="prompt" kind="PROMPT" name="approach" className="md:w-[78%]">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {STEPS.map((s, i) => (
                <div
                  key={s.name}
                  className="p-[clamp(1rem,1.6vw,1.35rem)]"
                  style={{ borderRight: i < STEPS.length - 1 ? "1px solid var(--rule)" : "none" }}
                >
                  <Mono dim className="idx-acc">{String(i + 1).padStart(2, "0")}</Mono>
                  <h3 className="t-display pt-2" style={{ fontSize: "clamp(1.1rem,1.7vw,26px)" }}>
                    {s.name}
                  </h3>
                  <p className="t-body dim pt-2">{s.detail}</p>
                </div>
              ))}
            </div>
          </Node>

          {/* ── MODEL (disciplinas) ───────────────────────────── */}
          <Node id="model" kind="MODEL" name={`capabilities · ${DISCIPLINAS.length}`} className="md:ml-[14%] md:w-[86%]">
            <div className="flex flex-wrap gap-[0.4rem] p-[clamp(1rem,2vw,1.75rem)]">
              {DISCIPLINAS.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center px-[0.8em] py-[0.5em]"
                  style={{ border: "1px solid var(--rule)" }}
                >
                  <Mono>{d}</Mono>
                </span>
              ))}
            </div>
          </Node>

          {/* ── OUTPUT (preço) ───────────────────────────────── */}
          <Node id="output" kind="OUTPUT" name="engagements" outPort={false}>
            <div className="[&_section]:!bg-transparent">
              <Pricing />
            </div>
          </Node>

          <Rule />
        </div>
      </div>

      <Footer />
      <EditorChrome />
    </>
  );
}
