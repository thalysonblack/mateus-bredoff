import { motion } from "motion/react";
import { Mono, SectionHead, Bracket, reveal, revealDelay, idx } from "../system";

/**
 * Pricing — cada engajamento ocupa a LARGURA INTEIRA.
 *
 * Terceira forma desta seção, e as duas anteriores erraram por falta de massa:
 *  1. linha de recibo (nome + preço nos cantos) → três linhas finas perdidas
 *     num campo escuro; a seção mais comercial da página lia como rodapé;
 *  2. três blocos emoldurados lado a lado → melhor, mas colunas estreitas
 *     espremiam nome, preço e escopo num espaço de card.
 *
 * A direção veio de referência (REBOOT / Setters): o serviço é uma FAIXA que
 * atravessa a página — nome em display à esquerda, escopo como campo de tags,
 * uma linha de descrição, e preço + ação ancorados à direita. Densidade
 * editorial em vez de card de conversão.
 *
 * O que NÃO se copia da referência: as pílulas arredondadas. Aqui a tag é
 * retângulo com fio de 1px, porque raio zero é lei do sistema — o mesmo desenho
 * da tag de procedência do índice de trabalho.
 *
 * ⚠ VALORES. O US$ 2.500 do Essential é o preço que ele já publica na aba de
 * serviços do Behance. Os outros dois seguem `null` → "On request", em vez de um
 * número inventado. Quando o Mateus passar os valores, troque o `null`:
 *
 *     { ..., priceFrom: 4800 }   →   renderiza "from $4,800"
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
  /** Campo de tags — o escopo se lê de relance, sem virar parágrafo. */
  scope: string[];
  /** Uma frase: o que este nível resolve. Não repete a lista de tags. */
  description: string;
  timeline: string;
  priceFrom: number | null;
  /** Inverte para papel — o destaque do meio, sem selo de conversão. */
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Essential",
    scope: ["Logotype", "Colour palette", "Typography", "Mini-guide"],
    description:
      "The core of an identity, built to stand on its own — for who is starting and needs the brand to look right from day one.",
    timeline: "3 weeks",
    priceFrom: 2500,
  },
  {
    name: "Complete",
    scope: ["Everything in Essential", "Applications", "Stationery", "Social kit"],
    description:
      "The identity applied to the places it actually lives, so the brand holds together across every surface.",
    timeline: "5 weeks",
    priceFrom: null,
    featured: true,
  },
  {
    name: "Brand System",
    scope: ["Everything in Complete", "Naming", "Verbal identity", "Full guidelines"],
    description:
      "Strategy, name and language included — for brands that need to be reproduced by other people without losing themselves.",
    timeline: "8 weeks",
    priceFrom: null,
  },
];

/** Retângulo de fio, não pílula: raio zero em todo o sistema. */
function Tag({ children }: { children: string }) {
  return (
    <span
      className="inline-flex items-center px-[0.7em] py-[0.45em] leading-none"
      style={{ border: "1px solid var(--rule)" }}
    >
      <Mono dim>{children}</Mono>
    </span>
  );
}

function TierRow({ tier, index }: { tier: Tier; index: number }) {
  return (
    <motion.div
      {...revealDelay(index, 0.06)}
      /* CARD DE LARGURA TOTAL — a síntese das duas formas que funcionaram.
         Do card vem a moldura, a matéria e o alvo de hover inteiro; da faixa
         vem a densidade e o uso da largura, que colunas estreitas não davam.
         O do meio inverte para papel: hierarquia pelo próprio gesto do sistema
         (papel/tinta), sem selo de "mais popular". */
      className={`${tier.featured ? "on-paper" : ""} group`}
      style={{
        border: "1px solid var(--rule)",
        background: tier.featured ? "var(--bg)" : "transparent",
      }}
    >
      <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-[clamp(1.25rem,2.5vw,2rem)] p-[clamp(1.5rem,3vw,2.75rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_auto]">
        {/* Coluna 1 — o nome, com o índice como metadado */}
        <div className="flex items-baseline gap-[clamp(1rem,2vw,2rem)]">
          <Mono dim className="idx-acc shrink-0">
            {idx(index)}
          </Mono>
          <h3 className="t-display" style={{ fontSize: "clamp(1.75rem, 3.6vw, 62px)" }}>
            {tier.name}
          </h3>
        </div>

        {/* Coluna 2 — tags e a frase que explica o nível */}
        <div>
          <div className="flex flex-wrap gap-[0.4rem]">
            {tier.scope.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <p className="t-body max-w-[46ch] pt-[clamp(1rem,2vw,1.5rem)]">{tier.description}</p>
        </div>

        {/* Coluna 3 — preço, prazo e ação, ancorados à direita */}
        <div className="flex flex-col items-start gap-[clamp(0.75rem,1.5vw,1.25rem)] md:items-end md:text-right">
          <div>
            <Mono dim>{tier.timeline}</Mono>
            <p className="t-display pt-1" style={{ fontSize: "clamp(1.15rem, 2vw, 30px)" }}>
              {tier.priceFrom === null ? (
                "On request"
              ) : (
                <>
                  <span className="dim">from </span>
                  {fmt(tier.priceFrom)}
                </>
              )}
            </p>
          </div>

          <a
            href="#contact"
            className="link-quiet shrink-0"
            aria-label={`Solicitar orçamento — ${tier.name}`}
          >
            <Bracket>START THE PROJECT</Bracket>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="on-ink w-full">
      {/* `pt` menor que o `pb`: o Capabilities vem logo acima e também é tinta,
          então os dois paddings somavam e abriam um vão morto no meio do bloco
          escuro — o fecho tem que ler como peça contínua. */}
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(1.5rem,3vw,3rem)]">
        <SectionHead left="Pricing" right={`[${TIERS.length}] Engagements`} />

        {/* Cards empilhados com gap: a moldura já separa, e um fio somado à
            borda vira linha dupla. */}
        <div className="flex flex-col gap-[clamp(0.5rem,1vw,0.875rem)]">
          {TIERS.map((t, i) => (
            <TierRow key={t.name} tier={t} index={i} />
          ))}
        </div>

        <motion.div
          {...reveal}
          className="flex flex-col gap-4 pt-[clamp(1.5rem,3vw,2.5rem)] md:flex-row md:items-baseline md:justify-between"
        >
          <Mono dim>Custom scope and retainer on request.</Mono>
          <Mono dim>Remote — worldwide</Mono>
        </motion.div>
      </div>
    </section>
  );
}
