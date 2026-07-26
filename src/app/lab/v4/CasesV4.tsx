import { Link } from "react-router";
import { Mono, Rule, SectionHead } from "../../system";
import { WORK } from "../../../content/work";
import Selection from "./Selection";

/**
 * Cases V4 — cada projeto é um registro de arquivo, com a peça selecionada.
 *
 * A estrutura por item: data e metadados como marginália à esquerda, a frase do
 * projeto em display, uma seta de saída, a descrição em cinza — e a peça grande à
 * direita, emoldurada como objeto selecionado com a tag identificando o case.
 *
 * O ganho sobre o índice escalonado atual: aqui cada projeto tem espaço para
 * DIZER algo. O escalonado mostra sete imagens e sete nomes; este mostra o
 * argumento de cada trabalho. Para um portfólio que quer contratar, argumento
 * vende mais que miniatura.
 *
 * ⚠ Os cases sem texto escrito (`contentPending`) caem numa frase neutra montada
 * a partir dos metadados REAIS — disciplina e ano. Nada de lorem ipsum e nada de
 * inventar a narrativa do projeto: quando o Mateus escrever, a frase real entra
 * no lugar e nada mais muda.
 */
export default function CasesV4() {
  return (
    <section id="work" className="on-paper w-full">
      <div className="bleed pt-[clamp(2.5rem,5vw,5rem)]">
        <SectionHead left="Cases" right={`[${WORK.length}] Projects`} />

        <div className="flex flex-col">
          {WORK.map((w, i) => {
            const frase =
              w.about[0] ??
              `${w.disciplines.join(" and ")} for ${w.title}, ${w.year}. Case study in preparation.`;

            return (
              <article key={w.slug}>
                <Rule />
                <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-[clamp(1.5rem,3vw,2rem)] py-[clamp(2rem,5vw,4.5rem)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="flex flex-col">
                    {/* Marginália: o dado técnico antes da manchete */}
                    <div className="flex items-baseline gap-4 pb-[clamp(1rem,2vw,1.5rem)]">
                      <Mono dim className="idx-acc">
                        {String(i + 1).padStart(2, "0")}
                      </Mono>
                      <Mono dim>{w.year}</Mono>
                      <Mono dim>{w.disciplines[0]}</Mono>
                    </div>

                    <h3 className="t-display" style={{ fontSize: "clamp(1.75rem,3.8vw,66px)" }}>
                      {w.title}
                    </h3>

                    <Link
                      to={`/work/${w.slug}`}
                      className="link-quiet mt-[clamp(1rem,2vw,1.5rem)] inline-flex w-fit items-center gap-3"
                      aria-label={`${w.title} — abrir case`}
                    >
                      {/* A seta é o gesto de "sair para o case". Em vez de um
                          botão, o próprio glifo — o sistema não tem botão. */}
                      <span className="t-display" style={{ fontSize: "clamp(1.5rem,2.6vw,42px)" }}>
                        ↗
                      </span>
                      <Mono>Open case</Mono>
                    </Link>

                    <p className="t-body dim max-w-[42ch] pt-[clamp(1.25rem,2.5vw,2rem)]">{frase}</p>
                  </div>

                  <Selection label="Case study" meta={w.title} guide={i % 2 === 0}>
                    <Link to={`/work/${w.slug}`} className="block">
                      <div
                        className="w-full overflow-hidden"
                        style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}
                      >
                        <img
                          src={w.cover.src}
                          srcSet={
                            w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined
                          }
                          sizes="(min-width: 768px) 55vw, 100vw"
                          alt={w.cover.alt}
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                  </Selection>
                </div>
              </article>
            );
          })}
          <Rule />
        </div>
      </div>
    </section>
  );
}
