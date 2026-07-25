import { motion } from "motion/react";
import { Mono, Rule, SectionHead, Bracket, reveal, revealDelay, idx } from "../system";

/**
 * Pricing — três níveis de engajamento com valor de entrada.
 *
 * ESTRUTURA: nome e preço na mesma linha de base, em display, ancorados nos
 * cantos opostos; escopo e prazo em mono embaixo. Lê como a linha de um recibo,
 * que é o gesto certo num documento técnico — e não repete nem a pilha do
 * Capabilities nem a tabela com cabeçalho do AI Lab.
 *
 * ⚠ VALORES. O US$ 2.500 do Essential NÃO foi inventado: é o preço que ele já
 * publica na aba de serviços do Behance ("Visual Identity, de US$ 2.500"). Os
 * outros dois seguem `null`, o que renderiza "On request" — uma frase legítima,
 * em vez de um "R$ X.XXX" quebrado no ar. Quando o Mateus passar os dois valores
 * que faltam, troque o `null` pelo número:
 *
 *     { ..., priceFrom: 4800 }   →   renderiza "from $4,800"
 *
 * A moeda é USD porque o preço público dele é em dólar e o posicionamento é
 * "working worldwide"; `CURRENCY` troca os dois de uma vez.
 */

const CURRENCY: "BRL" | "USD" = "USD";

const fmt = (v: number) =>
  new Intl.NumberFormat(CURRENCY === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(v);

type Tier = {
  name: string;
  scope: string;
  timeline: string;
  priceFrom: number | null;
};

const TIERS: Tier[] = [
  {
    name: "Essential",
    scope: "Logotype, palette, typography, mini-guide",
    timeline: "3 weeks",
    priceFrom: 2500,
  },
  {
    name: "Complete",
    scope: "Essential + applications, stationery, social kit",
    timeline: "5 weeks",
    priceFrom: null,
  },
  {
    name: "Brand System",
    scope: "Complete + naming, verbal identity, full guidelines",
    timeline: "8 weeks",
    priceFrom: null,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="on-ink w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Pricing" right={`[${TIERS.length}] Engagements`} />

        <div>
          {TIERS.map((t, i) => (
            <motion.div key={t.name} {...revealDelay(i, 0.05)}>
              <Rule />
              <a
                href="#contact"
                className="group block py-[clamp(1.25rem,2.6vw,2.25rem)]"
              >
                {/* Nome e preço nos cantos opostos, mesma linha de base */}
                <div className="flex items-baseline justify-between gap-[clamp(1rem,4vw,4rem)]">
                  <span className="flex items-baseline gap-[clamp(1rem,3vw,3rem)]">
                    <Mono dim className="idx-acc shrink-0">
                      {idx(i)}
                    </Mono>
                    <span
                      className="t-display transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.12em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      style={{ fontSize: "clamp(1.35rem, 3vw, 52px)" }}
                    >
                      {t.name}
                    </span>
                  </span>
                  {/* O preço é a segunda voz display da linha — menor que o nome,
                      para não virar a manchete do bloco. */}
                  <span
                    className="t-display shrink-0 text-right"
                    style={{ fontSize: "clamp(0.95rem, 1.6vw, 26px)" }}
                  >
                    {t.priceFrom === null ? "On request" : `from ${fmt(t.priceFrom)}`}
                  </span>
                </div>

                {/* Escopo e prazo: a letra miúda do registro */}
                <div className="flex flex-col gap-1 pl-0 pt-[clamp(0.625rem,1.2vw,1rem)] md:flex-row md:items-baseline md:justify-between md:gap-6 md:pl-[calc(clamp(1rem,3vw,3rem)+2.5rem)]">
                  <Mono dim>{t.scope}</Mono>
                  <Mono dim className="shrink-0">
                    {t.timeline}
                  </Mono>
                </div>
              </a>
            </motion.div>
          ))}
          <Rule />
        </div>

        <motion.div {...reveal} className="flex flex-col gap-4 pt-[clamp(1.5rem,3vw,2.5rem)] md:flex-row md:items-baseline md:justify-between">
          <Mono dim>Custom scope and retainer on request.</Mono>
          <a href="#contact" className="link-quiet shrink-0">
            <Bracket>START A PROJECT</Bracket>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
