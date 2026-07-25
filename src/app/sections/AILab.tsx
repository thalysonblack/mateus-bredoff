import { motion } from "motion/react";
import { Mono, Rule, SectionHead, reveal, revealDelay, idx } from "../system";

/**
 * AI Lab — as marcas fictícias que o Mateus cria para testar ideia.
 *
 * A bio do @sir.bredoff se assina "Brand Designer, Art Director & AI Creative";
 * o lab é onde a terceira parte disso aparece. Não é trabalho de cliente, então
 * não entra no índice de Selected Work: é um caderno separado do documento.
 *
 * ESTRUTURA — de propósito diferente das outras seções. Capabilities já é uma
 * pilha de linhas com índice à esquerda; repetir aquilo aqui faria as duas
 * seções lerem como a mesma coisa duas vezes. Um lab é um registro de ensaios,
 * então esta é a única tabela da página com CABEÇALHO DE COLUNA — nº, marca,
 * disciplina, meio. É o vernáculo de documento técnico levado até o fim, e é
 * novo dentro do sistema sem sair dele.
 *
 * ⚠ CONTEÚDO A CONFIRMAR: os nomes e as disciplinas abaixo foram lidos das
 * artes publicadas no @sir.bredoff, não de uma lista que o Mateus mandou. A
 * grafia (HŌKI com mácron), a disciplina de cada um e o ano precisam do aval
 * dele. FLORA ficou fora porque @florafaunaai é parceria real, não ficção.
 */

type Experiment = {
  brand: string;
  discipline: string;
  medium: string;
};

const EXPERIMENTS: Experiment[] = [
  { brand: "Fortis", discipline: "Typographic System", medium: "Print / Motion" },
  { brand: "Bureau", discipline: "Electronic Music", medium: "Packaging / Merch" },
  { brand: "Hōki", discipline: "Digital Product", medium: "Interface" },
  { brand: "Neox", discipline: "Technical Apparel", medium: "Campaign" },
  { brand: "Alex Archer", discipline: "Personal Brand", medium: "Editorial" },
  { brand: "Bovine Beats", discipline: "Music Label", medium: "Cover Art" },
];

const IG = "https://www.instagram.com/sir.bredoff/";

export default function AILab() {
  return (
    <section id="lab" className="on-paper w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="AI Lab" right={`[${EXPERIMENTS.length}] Experiments`} />

        {/* Uma linha de premissa, não um parágrafo: o lab se explica em um fôlego */}
        <motion.p
          {...reveal}
          className="t-display max-w-[26ch] pb-[clamp(2.5rem,6vw,5rem)]"
          style={{ fontSize: "clamp(1.5rem, 3.9vw, 68px)", lineHeight: 1 }}
        >
          Fictional brands, built to test ideas.
        </motion.p>

        {/* Registro de ensaios — a única tabela da página com cabeçalho de coluna */}
        <div>
          <Rule />
          <motion.div
            {...reveal}
            className="grid grid-cols-[3.5rem_1fr] gap-x-[clamp(1rem,3vw,3rem)] py-3 md:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)]"
          >
            <Mono dim>Nº</Mono>
            <Mono dim>Brand</Mono>
            <Mono dim className="hidden md:block">
              Discipline
            </Mono>
            <Mono dim className="hidden md:block">
              Medium
            </Mono>
          </motion.div>

          {EXPERIMENTS.map((e, i) => (
            <motion.div key={e.brand} {...revealDelay(i, 0.05)}>
              <Rule />
              <div className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-[clamp(1rem,3vw,3rem)] gap-y-1 py-[clamp(0.875rem,1.8vw,1.5rem)] md:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
                <Mono dim>{idx(i)}</Mono>
                <span
                  className="t-display transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.12em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  style={{ fontSize: "clamp(1.25rem, 2.6vw, 44px)" }}
                >
                  {e.brand}
                </span>
                {/* No mobile a disciplina desce para baixo do nome, na coluna 2;
                    o meio sai de cena — quatro colunas em 390px viram sopa. */}
                <Mono dim className="col-start-2 md:col-start-3">
                  {e.discipline}
                </Mono>
                <Mono dim className="hidden md:block">
                  {e.medium}
                </Mono>
              </div>
            </motion.div>
          ))}
          <Rule />
        </div>

        <motion.a
          {...reveal}
          href={IG}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet mt-[clamp(1.5rem,3vw,2.5rem)] inline-block"
        >
          <Mono>[ See the lab on Instagram ]</Mono>
        </motion.a>
      </div>
    </section>
  );
}
