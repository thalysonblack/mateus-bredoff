import { motion } from "motion/react";
import { Mono, Rule, SectionHead, reveal, revealDelay, idx } from "../system";

/**
 * About — a frase-manifesto em caixa alta gigante, seguida do texto de
 * apresentação como UM bloco pareado.
 *
 * Os parágrafos já foram registros de tabela (índice + título + corpo + fio
 * entre eles) e não funcionou: com o corpo travado em 54ch, sobrava um `1fr`
 * vazio ocupando ~40% da largura, e o fio no meio lia os dois parágrafos como
 * dois itens sem relação — quando eles são as duas metades de uma mesma ideia
 * (como eu trabalho / no que dá).
 *
 * Agora é um bloco só: as duas colunas dividem a largura útil e são lidas em
 * paralelo, com os rótulos como marginália mono acima de cada uma. O fio
 * sobrevive apenas abrindo e fechando o bloco — ele emoldura o conjunto em vez
 * de fatiar o miolo.
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

        {/* Bloco único: as duas metades da ideia lado a lado, o fio só emoldura */}
        <Rule />
        <div className="grid grid-cols-1 gap-x-[clamp(2rem,5vw,6rem)] gap-y-[clamp(2.5rem,5vw,3.5rem)] py-[clamp(2rem,4vw,3.5rem)] md:grid-cols-2">
          {RECORDS.map((r, i) => (
            <motion.div key={r.title} {...revealDelay(i)}>
              <div className="flex items-baseline gap-[clamp(1rem,2vw,2rem)] pb-[clamp(0.875rem,1.5vw,1.25rem)]">
                <Mono dim>{idx(i)}</Mono>
                <Mono>{r.title}</Mono>
              </div>
              {/* sem max-width em ch: a coluna da grade já é a medida */}
              <p className="t-body">{r.body}</p>
            </motion.div>
          ))}
        </div>
        <Rule />
      </div>
    </section>
  );
}
