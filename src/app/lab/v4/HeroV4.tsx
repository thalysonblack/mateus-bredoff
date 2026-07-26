import { Mono, Bracket } from "../../system";
import Menu from "../../sections/Menu";
import portrait1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../../assets/optimized/hero-portrait-3200.webp";
import Selection from "./Selection";

/**
 * Hero V4 — a tela de abertura como artboard em edição.
 *
 * A manchete tem hierarquia por cor (afirmação em tinta, qualificação em cinza),
 * o retrato entra como objeto selecionado com tag, e há guias de snap saindo dos
 * elementos. O que sustenta a composição não é imagem grande nem tipo gigante: é
 * a impressão de que a página está sendo construída na frente de quem olha.
 *
 * ⚠ CONTRASTE. A qualificação em `--dim` sobre o papel mede 4,63:1 — texto de
 * verdade, não decoração apagada. A tag de seleção usa `--bg` sobre `--acc`:
 * 5,30:1 no papel. Se trocar o acento, remeça as duas.
 */
export default function HeroV4() {
  return (
    <section className="on-paper relative w-full">
      <Menu />

      <div className="bleed pb-[clamp(2rem,5vw,4rem)] pt-[clamp(3rem,8vh,6rem)]">
        {/* Coordenada de abertura: o arquivo se identifica antes de falar */}
        <div className="flex items-baseline justify-between gap-4 pb-[clamp(1.5rem,4vh,3rem)]">
          <Mono dim>Portfolio · Vol. 01</Mono>
          <Mono dim>Brazil · Worldwide</Mono>
        </div>

        <h1 className="t-display t-display-xl" style={{ fontSize: "clamp(2rem,6.4vw,108px)" }}>
          Visual identities for brands
          <br />
          <span className="dim">that need to be taken seriously.</span>
        </h1>

        <div className="grid grid-cols-1 gap-[clamp(1.5rem,4vw,4rem)] pt-[clamp(2rem,5vh,4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-end">
          <div>
            <p className="t-body max-w-[40ch]">
              Brand designer and art director working from Brazil, worldwide — from the mark itself
              to the system that keeps it standing when other people take over.
            </p>

            <div className="flex flex-wrap items-center gap-[clamp(1rem,2vw,2rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">
              {/* Disponibilidade concreta, em retângulo de fio — pílula
                  arredondada violaria o raio zero do sistema. */}
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

          {/* O retrato é um objeto do arquivo, com tag e alças */}
          <Selection label="Portrait" meta="Mateus Bredoff">
            <div className="w-full overflow-hidden" style={{ aspectRatio: "1600 / 850" }}>
              <img
                src={portrait1600}
                srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
                sizes="(min-width: 768px) 55vw, 100vw"
                alt="Mateus Bredoff"
                width={1600}
                height={850}
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 18%" }}
              />
            </div>
          </Selection>
        </div>
      </div>
    </section>
  );
}
