import { motion } from "motion/react";
import { Mono, Rule, SectionHead, Bracket, reveal, revealDelay, idx } from "../system";

/**
 * Pricing — escada de acumulação.
 *
 * Quinta forma da seção, e a escolhida. As quatro anteriores, e o que cada uma
 * ensinou: linha de recibo (sem massa) → três blocos em coluna (estreitos) →
 * faixa larga estilo REBOOT (densa, mas perdeu a matéria do bloco) → card de
 * largura total (bom, e ainda assim o mais convencional dos caminhos).
 *
 * O partido aqui é outro: em vez de descrever a oferta, a estrutura MOSTRA como
 * ela se acumula. Cada nível desce um degrau e traz empilhadas as camadas que
 * herda — o Brand System aparece com três faixas, o Essential com uma. Dá para
 * ver que um nível contém o anterior sem que ninguém precise ler "everything
 * in…". A frase continua lá, mas como confirmação, não como explicação.
 *
 * ⚠ O DEGRAU SÓ EXISTE NO DESKTOP. Em coluna única o `margin-top` progressivo
 * não desenha escada nenhuma — vira espaço morto crescente entre blocos
 * empilhados. Por isso ele mora em `.tier-step` sob `@media`, e não em style
 * inline.
 *
 * ⚠ CONTRASTE DA FAIXA ACESA. O preenchimento é o acento e o texto é
 * `var(--bg)`, que inverte junto com o bloco: 5,45:1 na tinta (#131313 sobre
 * #e4642f) e 4,62:1 no papel (#efebe3 sobre #b8420f) — os dois passam em AA.
 * Trocar o texto para `var(--fg)` derruba para 3,02:1 e reprova. Não troque.
 *
 * ⚠ VALORES. O US$ 2.500 do Essential é o preço que ele já publica na aba de
 * serviços do Behance. Os outros dois seguem `null` → "On request". Quando o
 * Mateus passar os números, troque o `null`:
 *
 *     { ..., priceFrom: 4800 }   →   renderiza "from $4,800"
 */

export const CURRENCY: "BRL" | "USD" = "USD";

export const fmt = (v: number) =>
  new Intl.NumberFormat(CURRENCY === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(v);

export type Tier = {
  name: string;
  scope: string[];
  /** Uma frase: o que este nível resolve. Não repete a lista de escopo. */
  description: string;
  timeline: string;
  priceFrom: number | null;
};

export const TIERS: Tier[] = [
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

const price = (t: Tier) => (t.priceFrom === null ? "On request" : fmt(t.priceFrom));

function TierColumn({ tier, index }: { tier: Tier; index: number }) {
  return (
    <motion.div
      {...revealDelay(index, 0.08)}
      className="tier-step flex flex-col"
      style={{ "--step": index } as React.CSSProperties}
    >
      <div style={{ borderTop: "1px solid var(--rule)" }} className="pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <Mono dim className="idx-acc">
            {idx(index)}
          </Mono>
          <Mono dim>{tier.timeline}</Mono>
        </div>

        <h3 className="t-display pt-3" style={{ fontSize: "clamp(1.4rem,2.6vw,44px)" }}>
          {tier.name}
        </h3>

        <p className="t-display pt-2" style={{ fontSize: "clamp(1rem,1.6vw,24px)" }}>
          {tier.priceFrom !== null && <span className="dim">from </span>}
          {price(tier)}
        </p>

        <p className="t-body max-w-[34ch] pt-4">{tier.description}</p>

        {/* A acumulação desenhada: uma faixa por nível herdado, a última acesa
            no acento. É isto que faz a estrutura explicar a oferta. */}
        <div className="flex flex-col gap-1 pt-[clamp(1.25rem,2.5vw,2rem)]">
          {TIERS.slice(0, index + 1).map((prev, pi) => {
            const isCurrent = pi === index;
            return (
              <div
                key={prev.name}
                className="flex items-center justify-between gap-3 px-3 py-2"
                /* A cor vai no CONTAINER e o Mono herda por currentColor: a
                   primitiva não aceita `style` e descartaria a prop em silêncio. */
                style={{
                  border: "1px solid var(--rule)",
                  background: isCurrent ? "var(--acc)" : "transparent",
                  color: isCurrent ? "var(--bg)" : undefined,
                }}
              >
                <Mono dim={!isCurrent}>{prev.name}</Mono>
                <Mono dim={!isCurrent}>{String(prev.scope.length).padStart(2, "0")}</Mono>
              </div>
            );
          })}
        </div>

        {/* Escopo do próprio nível, miúdo: quem quiser o detalhe encontra */}
        <ul className="flex flex-col gap-1 pt-[clamp(1rem,2vw,1.5rem)]">
          {tier.scope.map((s) => (
            <li key={s}>
              <Mono dim>{s}</Mono>
            </li>
          ))}
        </ul>

        <div className="pt-[clamp(1.25rem,2.5vw,2rem)]">
          <Rule />
          <a
            href="#contact"
            className="link-quiet mt-3 inline-block"
            aria-label={`Solicitar orçamento — ${tier.name}`}
          >
            <Bracket>ENQUIRE</Bracket>
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

        <div className="grid grid-cols-1 gap-[clamp(2rem,4vw,2.5rem)] md:grid-cols-3 md:items-start md:gap-[clamp(0.75rem,1.5vw,1.5rem)]">
          {TIERS.map((t, i) => (
            <TierColumn key={t.name} tier={t} index={i} />
          ))}
        </div>

        <motion.div
          {...reveal}
          className="flex flex-col gap-4 pt-[clamp(2rem,4vw,3.5rem)] md:flex-row md:items-baseline md:justify-between"
        >
          <Mono dim>Custom scope and retainer on request.</Mono>
          <Mono dim>Remote — worldwide</Mono>
        </motion.div>
      </div>
    </section>
  );
}
