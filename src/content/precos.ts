/* Escada de preços da About da V1 (TIERS). Valores a confirmar com o Mateus. */

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
    priceFrom: 4500 /* ⚠ 12/09: escada proporcional ao prazo, escolhida pelo Thalyson — a confirmar com o Mateus */,
  },
  {
    name: "Brand System",
    scope: ["Everything in Complete", "Naming", "Verbal identity", "Full guidelines"],
    description:
      "Strategy, name and language included — for brands that need to be reproduced by other people without losing themselves.",
    timeline: "8 weeks",
    priceFrom: 7500 /* ⚠ 12/09: escada proporcional ao prazo, escolhida pelo Thalyson — a confirmar com o Mateus */,
  },
];
