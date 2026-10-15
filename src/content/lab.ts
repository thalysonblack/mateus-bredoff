export type Ensaio = {
  brand: string;
  discipline: string;
  medium: string;
  /** case correspondente em `work.ts`, quando a arte já está no repo */
  slug: string | null;
};

export const LAB: Ensaio[] = [
  { brand: "Fortis", discipline: "Typographic System", medium: "Print / Motion", slug: null },
  { brand: "Bureau", discipline: "Electronic Music", medium: "Packaging / Merch", slug: null },
  { brand: "Hōki", discipline: "Digital Product", medium: "Interface", slug: "hoki" },
  { brand: "Neox", discipline: "Technical Apparel", medium: "Campaign", slug: "neox" },
  { brand: "Alex Archer", discipline: "Personal Brand", medium: "Editorial", slug: "alex-archer" },
  { brand: "Bovine Beats", discipline: "Music Label", medium: "Cover Art", slug: null },
];

/** `[06]` — o mesmo número na nav, na seção da home e na página. */
export const LAB_CONTADOR = String(LAB.length).padStart(2, "0");

export const INSTAGRAM = "https://www.instagram.com/sir.bredoff";
