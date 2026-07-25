import { motion } from "motion/react";
import { Mono, Rule, Bracket, reveal, revealDelay, idx, ease } from "../system";
import imgFerraciGem from "../../assets/optimized/case-ferraci-1400.webp";
import imgFerraciGem2x from "../../assets/optimized/case-ferraci-2200.webp";
import imgTrivoCart from "../../assets/optimized/case-trivo-1400.webp";
import imgTrivoCart2x from "../../assets/optimized/case-trivo-2200.webp";
import imgFerraciBook from "../../assets/optimized/case-stag-1400.webp";
import imgFerraciBook2x from "../../assets/optimized/case-stag-2200.webp";

/**
 * Selected Work — índice escalonado, no lugar do carrossel.
 *
 * As referências nunca apresentam trabalho como carrossel com pílulas de
 * filtro; apresentam como um índice de arquivo: numerado (001, 002…), com as
 * peças em larguras e alturas diferentes, desencontradas na vertical, e uma
 * legenda técnica embaixo de cada uma — índice à esquerda, nome à direita, na
 * largura exata da imagem.
 *
 * O escalonamento vem de três colunas com recuos de topo diferentes, não de
 * posicionamento absoluto: colapsa sozinho para uma coluna no mobile e nunca
 * gera o card mais largo que a tela (a armadilha do carrossel antigo).
 *
 * Stag e Votare ainda reusam arte do Ferraci como placeholder.
 */

type Project = {
  name: string;
  category: string;
  image: string;
  srcSet: string;
  ratio: string;
  bg: string;
  fit: "cover" | "contain";
};

const srcSetOf = (small: string, large: string) => `${small} 1400w, ${large} 2200w`;

const PROJECTS: Project[] = [
  {
    name: "Stag",
    category: "Visual Identity",
    image: imgFerraciBook,
    srcSet: srcSetOf(imgFerraciBook, imgFerraciBook2x),
    ratio: "3 / 4",
    bg: "#0d0d0d",
    fit: "cover",
  },
  {
    name: "Trivo",
    category: "Visual Identity / 3D",
    image: imgTrivoCart,
    srcSet: srcSetOf(imgTrivoCart, imgTrivoCart2x),
    ratio: "4 / 3",
    bg: "#000000",
    fit: "cover",
  },
  {
    name: "Ferraci",
    category: "Visual Identity / 3D",
    image: imgFerraciGem,
    srcSet: srcSetOf(imgFerraciGem, imgFerraciGem2x),
    ratio: "1 / 1",
    bg: "linear-gradient(150deg,#c79a6a 0%,#e8d4b8 55%,#f5ead8 100%)",
    fit: "contain",
  },
  {
    name: "Votare",
    category: "Packaging",
    image: imgFerraciBook,
    srcSet: srcSetOf(imgFerraciBook, imgFerraciBook2x),
    ratio: "16 / 11",
    bg: "#0d0d0d",
    fit: "cover",
  },
];

/* Cada coluna desce um tanto diferente — é daí que vem o desencontro. Os
   valores são em vw para o escalonamento acompanhar a escala da página.
   A segunda peça vai na coluna do meio, que carrega o item mais baixo (4:3):
   pendurada na primeira, que tem o retrato 3:4, ela abria um vão no miolo. */
const COLUMNS: { items: number[]; offset: string }[] = [
  { items: [0], offset: "0vw" },
  { items: [1, 3], offset: "9vw" },
  { items: [2], offset: "3vw" },
];

function Piece({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article {...revealDelay(index, 0.08)} className="group mb-[clamp(2.5rem,5vw,5rem)]">
      <a href="#work" className="block" aria-label={`${project.name} — ${project.category}`}>
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: project.ratio, background: project.bg }}
        >
          <img
            src={project.image}
            srcSet={project.srcSet}
            sizes="(min-width: 768px) 33vw, 100vw"
            alt={`${project.name} — ${project.category}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ objectFit: project.fit, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
        </div>

        {/* Legenda técnica, na largura da peça */}
        <div className="flex items-baseline justify-between gap-4 pt-2">
          <Mono dim>{idx(index)}</Mono>
          <Mono className="text-right">
            {project.name}
            <span className="dim">{` / ${project.category}`}</span>
          </Mono>
        </div>
      </a>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="on-paper w-full">
      <div className="bleed pt-[clamp(3rem,7vw,7rem)]">
        <Rule />

        {/* Cabeça: título gigante com a contagem sobrescrita + ação à direita */}
        <div className="flex items-start justify-between gap-6 pb-[clamp(2.5rem,6vw,5rem)] pt-3">
          <motion.h2
            {...reveal}
            className="t-display"
            style={{ fontSize: "clamp(2.5rem, 8.4vw, 148px)", lineHeight: 0.9 }}
          >
            Selected Work
            <Mono className="ml-[0.35em] align-top dim">[{PROJECTS.length}]</Mono>
          </motion.h2>

          <motion.a
            {...reveal}
            href="#contact"
            className="link-quiet shrink-0 pt-1"
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <Bracket>Enquire</Bracket>
          </motion.a>
        </div>

        {/* Índice escalonado */}
        <div className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2.5rem)] md:grid-cols-3">
          {COLUMNS.map((col, c) => (
            <div key={c} className="stagger-col" style={{ "--col-offset": col.offset } as React.CSSProperties}>
              {col.items.map((i) => (
                <Piece key={PROJECTS[i].name} project={PROJECTS[i]} index={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
