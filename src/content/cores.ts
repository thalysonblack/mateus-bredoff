/**
 * A COR DE CADA PROJETO — amostrada da própria capa, não escolhida.
 *
 * "cada texto a cor do projeto" (17/08). Os valores saem de
 * `scripts/cores-do-acervo.mjs`, que:
 *   1. reduz a capa a 20×20 e descarta o que não é cor (luminância fora de
 *      0,14–0,78, saturação abaixo de 0,20);
 *   2. agrupa o resto em faixas de 20° de matiz e soma a ÁREA de cada faixa —
 *      vence a que ocupa mais tela, não o pixel mais saturado, que numa foto
 *      costuma ser um reflexo isolado;
 *   3. mantém matiz e saturação e mexe só no VALOR, até 4,5:1 sobre o fundo.
 *      ⚠ Inflar saturação transforma marrom em vermelho — a saturação é parte
 *      da identidade da cor tanto quanto o matiz.
 *
 * ⚠ DOIS VALORES POR PROJETO, porque a mesma cor não serve aos dois fundos
 * ([[craft-token-de-cor-nao-serve-aos-dois-fundos]]): `papel` para as pranchas
 * claras, `tinta` para a escura.
 *
 * ⚠ Bureau e Alex Archer NÃO TÊM cor dominante — as capas são preto e branco e
 * cromado. Elas caem no petróleo do sistema de propósito: inventar uma cor para
 * uma peça que não tem seria mentir sobre o trabalho. Se ele quiser cor nelas,
 * a cor vem DELE, não do algoritmo.
 *
 * Para regerar depois de trocar uma capa: `node scripts/cores-do-acervo.mjs`.
 */
export const CORES: Record<string, { papel: string; tinta: string }> = {
  ginga: { papel: "#da162e", tinta: "#ed4a5f" },
  "alex-archer": { papel: "#477587", tinta: "#5891a7" },
  bureau: { papel: "#477587", tinta: "#5891a7" },
  neox: { papel: "#557386", tinta: "#698aa0" },
  trivo: { papel: "#846b31", tinta: "#b99746" },
  stag: { papel: "#8d664c", tinta: "#a97d60" },
  ferraci: { papel: "#8e6552", tinta: "#a87d68" },
  votare: { papel: "#2f7b5c", tinta: "#47b88a" },
};

/** a cor do projeto na superfície da vez; cai no acento do sistema se faltar */
export const corDe = (slug: string, superficie: "papel" | "tinta" = "papel") =>
  CORES[slug]?.[superficie] ?? "var(--p-acento)";
