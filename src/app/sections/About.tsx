import { motion } from "motion/react";
import { Mono, Rule, SectionHead, reveal, revealDelay, idx } from "../system";

/**
 * About — a frase-manifesto em caixa alta gigante, seguida dos parágrafos
 * remontados como registros de tabela.
 *
 * É a virada de linguagem da seção: antes eram três colunas soltas com um
 * rótulo cinza; agora cada parágrafo é uma linha com índice, título e fio,
 * que é como as referências apresentam qualquer conjunto de itens.
 */

const RECORDS = [
  {
    title: "Approach",
    body: "My approach begins with a deep understanding of the universe in which your company operates. I analyze your business goals, your audience, your competitors, and conduct careful conceptual research to transform strategy into visual expression.",
  },
  {
    title: "Result",
    body: "The result is exclusive work that combines strategic thinking with refined graphic aesthetics, designed to position brands in a clear, relevant, and memorable way.",
  },
];

export default function About() {
  return (
    <section id="about" className="on-paper w-full">
      <div className="bleed pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="About" right="Statement" />

        {/* Manifesto — o tipo enche a largura, alinhado à esquerda, bandeira à direita */}
        <motion.p
          {...reveal}
          className="t-display pb-[clamp(3rem,7vw,7rem)]"
          style={{ fontSize: "clamp(1.75rem, 5.15vw, 92px)", lineHeight: 0.98 }}
        >
          I&rsquo;m a multidisciplinary designer focused on visual identities, based in Brazil and
          working worldwide.
        </motion.p>

        {/* Registros — índice, título e corpo, separados por fio */}
        <div>
          {RECORDS.map((r, i) => (
            <motion.div key={r.title} {...revealDelay(i)}>
              <Rule />
              {/* Índice, título, corpo — e o ar sobrando à direita, que é onde as
                  referências deixam a respiração da tabela. O corpo colado na
                  borda direita ficava desligado do título. */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[5rem_11rem_minmax(0,54ch)_1fr]">
                <Mono dim>{idx(i)}</Mono>
                <Mono>{r.title}</Mono>
                <p className="t-body">{r.body}</p>
              </div>
            </motion.div>
          ))}
          <Rule />
        </div>
      </div>
    </section>
  );
}
