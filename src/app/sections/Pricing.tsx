import { motion } from "motion/react";
import { Mono, Rule, SectionHead, Bracket, reveal, revealDelay, idx } from "../system";

/**
 * Pricing — três engajamentos como blocos emoldurados.
 *
 * Já foi "linha de recibo": nome e preço nos cantos opostos, escopo em mono
 * embaixo, um fio entre cada. Era correto e não tinha massa nenhuma — três
 * linhas finas perdidas num campo escuro, e a seção mais importante da página
 * comercial lia como rodapé de tabela.
 *
 * Agora cada nível é um BLOCO com moldura de 1px: o numeral grande no topo, o
 * preço como segunda voz display, e o escopo virou lista de itens separados por
 * fio — dá para bater o olho e comparar, que é o que alguém faz numa página de
 * preço.
 *
 * HIERARQUIA SEM SELO. O do meio não leva "mais popular" nem borda colorida:
 * ele **inverte** para papel dentro do bloco de tinta. É o próprio gesto do
 * sistema (papel/tinta alternando de sangria a sangria) usado em escala miúda —
 * destaca por contraste de matéria, não por enfeite de conversão.
 *
 * Raio zero, sem sombra, sem pílula: card arredondado com sombra é exatamente o
 * "AI look" que o sistema recusa.
 *
 * ⚠ VALORES. O US$ 2.500 do Essential NÃO foi inventado: é o preço que ele já
 * publica na aba de serviços do Behance ("Visual Identity, de US$ 2.500"). Os
 * outros dois seguem `null` → "On request", uma frase legítima, em vez de um
 * número quebrado no ar. Quando o Mateus passar os valores, troque o `null`:
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
  /** Itens, não frase: em lista dá para comparar os três de relance. */
  scope: string[];
  timeline: string;
  priceFrom: number | null;
  /** Inverte para papel — o destaque do meio. */
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Essential",
    scope: ["Logotype", "Colour palette", "Typography", "Mini-guide"],
    timeline: "3 weeks",
    priceFrom: 2500,
  },
  {
    name: "Complete",
    scope: ["Everything in Essential", "Applications", "Stationery", "Social kit"],
    timeline: "5 weeks",
    priceFrom: null,
    featured: true,
  },
  {
    name: "Brand System",
    scope: ["Everything in Complete", "Naming", "Verbal identity", "Full guidelines"],
    timeline: "8 weeks",
    priceFrom: null,
  },
];

function Tier({ tier, index }: { tier: Tier; index: number }) {
  return (
    <motion.div
      {...revealDelay(index, 0.06)}
      /* `on-paper` no destacado troca --bg/--fg/--dim/--acc de uma vez: os
         filhos só leem as variáveis e não sabem em que fundo estão. */
      className={`${tier.featured ? "on-paper" : ""} group flex h-full flex-col`}
      style={{
        border: "1px solid var(--rule)",
        /* o bloco de papel precisa do próprio fundo; o de tinta herda o da seção */
        background: tier.featured ? "var(--bg)" : "transparent",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 p-[clamp(1.25rem,2vw,1.75rem)]">
        <Mono dim className="idx-acc">
          {idx(index)}
        </Mono>
        <Mono dim>{tier.timeline}</Mono>
      </div>

      <div className="px-[clamp(1.25rem,2vw,1.75rem)]">
        <h3 className="t-display" style={{ fontSize: "clamp(1.5rem, 2.6vw, 40px)" }}>
          {tier.name}
        </h3>

        {/* O preço é a segunda voz display do bloco — menor que o nome, para o
            pacote continuar sendo a manchete e o valor, a consequência. */}
        <p
          className="t-display pt-[clamp(0.5rem,1vw,0.875rem)]"
          style={{ fontSize: "clamp(1.05rem, 1.7vw, 26px)" }}
        >
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

      {/* Escopo: cada item é um registro com fio, como o resto do sistema */}
      <ul className="mt-[clamp(1.25rem,2.5vw,2rem)] flex-1">
        {tier.scope.map((s) => (
          <li key={s}>
            <Rule />
            <div className="px-[clamp(1.25rem,2vw,1.75rem)] py-[clamp(0.625rem,1.1vw,0.875rem)]">
              <Mono dim>{s}</Mono>
            </div>
          </li>
        ))}
        <Rule />
      </ul>

      <a
        href="#contact"
        className="link-quiet block p-[clamp(1.25rem,2vw,1.75rem)]"
        aria-label={`Solicitar orçamento — ${tier.name}`}
      >
        <Bracket>ENQUIRE</Bracket>
      </a>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="on-ink w-full">
      {/* `pt` menor que o `pb`: o Capabilities vem logo acima e também é tinta,
          então os dois paddings somavam e abriam um vão morto no meio do bloco
          escuro — o fecho tem que ler como uma peça contínua, não como duas
          seções com um buraco entre elas. */}
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(1.5rem,3vw,3rem)]">
        <SectionHead left="Pricing" right={`[${TIERS.length}] Engagements`} />

        {/* `items-stretch` para os três blocos terminarem na mesma linha mesmo
            com escopos de tamanhos diferentes — bloco mais curto que o vizinho
            denuncia grade improvisada. */}
        <div className="grid grid-cols-1 items-stretch gap-[clamp(0.75rem,1.5vw,1.25rem)] md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Tier key={t.name} tier={t} index={i} />
          ))}
        </div>

        <motion.div
          {...reveal}
          className="flex flex-col gap-4 pt-[clamp(1.5rem,3vw,2.5rem)] md:flex-row md:items-baseline md:justify-between"
        >
          <Mono dim>Custom scope and retainer on request.</Mono>
          <a href="#contact" className="link-quiet shrink-0">
            <Bracket>START A PROJECT</Bracket>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
