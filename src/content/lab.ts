/**
 * Os ensaios do AI Lab — fonte ÚNICA, pelo mesmo motivo de `meta.ts`.
 *
 * A lista já morou dentro da home enquanto o Lab era só uma seção. No dia em
 * que virou também uma PÁGINA e um contador na nav, passou a existir em três
 * lugares — e o contador da nav (`[06]`, escrito à mão) já divergia do da
 * página (`[13]`, que contava quadros de foto em vez de ensaios). Número que
 * se escreve à mão em dois lugares não fica igual; ele só parece igual no dia
 * em que foi escrito.
 *
 * ## O que este arquivo afirma, e o que NÃO afirma
 *
 * São **marcas fictícias que ele cria para testar ideia** — a terceira parte
 * da assinatura dele (“Brand Designer, Art Director & AI Creative”). Não são
 * clientes, e por decisão dele o site **não confessa a ficção item a item**:
 * elas convivem com o trabalho de cliente sem carimbo de "fictício". O que as
 * separa é o CONTEXTO (a seção se chama Lab e diz o que é), não uma etiqueta
 * em cada peça.
 *
 * ⚠ Nomes, disciplina e meio foram lidos das artes publicadas no
 * `@sir.bredoff`, não de uma lista que o Mateus mandou. Grafia (`Hōki` com
 * mácron), disciplina e ano seguem pendentes do aval dele. `FLORA` está fora
 * porque `@florafaunaai` é parceria real, não ficção.
 *
 * `slug` liga o ensaio ao case quando ele TEM arte no repo; `null` é ensaio
 * que só vive no Instagram dele. Não é lacuna a preencher com imagem
 * emprestada — é o que a galeria mostra como placa até a arte chegar.
 */
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
