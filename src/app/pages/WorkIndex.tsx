import { useEffect } from "react";
import { Link } from "react-router";
import { Mono, Rule, SectionHead } from "../system";
import { useReveal } from "../../hooks/useReveal";
import { WORK } from "../../content/work";
import Footer from "../sections/Footer";

/**
 * `/work` — o índice completo, lendo a MESMA coleção que a home e as páginas de
 * case. Uma fonte só: índice e página não têm como discordar.
 *
 * A home apresenta o trabalho como grade escalonada (contact sheet); aqui ele é
 * uma TABELA de registros — ano, título, disciplinas — com a peça aparecendo ao
 * lado. É a mesma regra que vale para o resto do site: seção nova não repete a
 * estrutura de outra, senão a página lê como a mesma coisa duas vezes.
 */
export default function WorkIndex() {
  const titleRef = useReveal<HTMLHeadingElement>({ immediate: true });

  useEffect(() => {
    const previous = document.title;
    document.title = "Work — Mateus Bredoff";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <section className="on-paper w-full">
        <div className="bleed pt-[clamp(2rem,5vw,4rem)]">
          <SectionHead left="Index" right={`[${WORK.length}] Projects`} />

          <h1
            ref={titleRef}
            data-reveal
            className="t-display t-display-xl pb-[clamp(2.5rem,6vw,5rem)]"
            style={{ fontSize: "clamp(2.5rem, 9vw, 176px)" }}
          >
            Selected Work
          </h1>

          <div>
            {WORK.map((w) => (
              <div key={w.slug}>
                <Rule />
                <Link
                  to={`/work/${w.slug}`}
                  className="group grid grid-cols-[3.5rem_1fr] items-center gap-x-[clamp(1rem,3vw,3rem)] gap-y-3 py-[clamp(1rem,2vw,1.75rem)] md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)_8rem]"
                >
                  <Mono dim className="idx-acc self-start pt-2">
                    {w.year}
                  </Mono>

                  <span
                    className="t-display transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.12em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    style={{ fontSize: "clamp(1.35rem, 3.2vw, 56px)" }}
                  >
                    {w.title}
                  </span>

                  {/* A peça acompanha a linha em formato de faixa: dá imagem ao
                      índice sem transformá-lo numa segunda grade igual à da home. */}
                  <span className="hidden overflow-hidden md:block" style={{ aspectRatio: "16 / 7" }}>
                    <img
                      src={w.cover.src}
                      alt={w.cover.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover opacity-90 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>

                  <Mono dim className="col-start-2 text-left md:col-start-4 md:text-right">
                    {w.disciplines.join(" / ")}
                  </Mono>
                </Link>
              </div>
            ))}
            <Rule />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
