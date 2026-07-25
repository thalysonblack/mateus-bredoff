import { motion } from "motion/react";
import { Mono, Rule, SectionHead, reveal, revealDelay, idx } from "../system";
import imgEditorial from "../../assets/optimized/capabilities-editorial-800.webp";

/**
 * Capabilities — a lista de serviços virou tabela de registros.
 *
 * É o movimento mais característico das referências: cada item é uma linha
 * separada por fio, com o índice mono ancorado à esquerda, o nome em caixa alta
 * e a imagem agrupada à direita do bloco. O hover empurra a linha alguns pixels
 * e acende o colchete — o único estado da lista.
 *
 * O bloco é preto porque o ritmo da página é papel/tinta alternando de sangria
 * a sangria; esta é a virada para o fecho escuro.
 *
 * Sem descrição por serviço de propósito: o texto teria que ser inventado, e
 * conteúdo de cliente não se inventa. Está anotado como pendência no CLAUDE.md.
 */

const ITEMS = ["Branding", "Art Direction", "Creative Direction", "Digital Design", "Brand Strategy"];

export default function Capabilities() {
  return (
    <section className="on-ink w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Capabilities" right={`[${ITEMS.length}] Disciplines`} />

        {/* Tabela de registros */}
        <div>
          {ITEMS.map((label, i) => (
            <motion.div key={label} {...revealDelay(i, 0.05)}>
              <Rule />
              <a
                href="#contact"
                className="group flex items-start gap-[clamp(1rem,4vw,5rem)] py-[clamp(1rem,2.2vw,2rem)]"
              >
                {/* Índice ancorado no topo da linha, não na base do nome — é
                    onde as referências fixam a numeração do registro. */}
                <Mono dim className="shrink-0">
                  {idx(i)}
                </Mono>
                <span
                  className="t-display flex-1 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.15em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  style={{ fontSize: "clamp(1.5rem, 3.4vw, 60px)" }}
                >
                  {label}
                </span>
                <Mono
                  dim
                  className="shrink-0 opacity-0 transition-opacity duration-500 group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
                >
                  [ Enquire ]
                </Mono>
              </a>
            </motion.div>
          ))}
          <Rule />
        </div>

        {/* Chapa de imagem agrupada à direita, com legenda técnica */}
        <motion.figure
          {...reveal}
          className="ml-auto mt-[clamp(2.5rem,5vw,4.5rem)] w-full md:w-[38%]"
        >
          <div className="w-full overflow-hidden bg-white/[0.06]" style={{ aspectRatio: "3 / 2" }}>
            <img
              src={imgEditorial}
              alt="Editorial de identidade visual"
              width={800}
              height={534}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 pt-2">
            <Mono dim>Plate 001</Mono>
            <Mono dim>Editorial / Identity</Mono>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
