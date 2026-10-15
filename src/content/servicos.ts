/**
 * O QUE ELE FAZ, e por quanto — duas coisas, dois lugares.
 *
 * "preciso dizer os serviços que ela faz e os valores em outra section" (17/08).
 * Separado de propósito: SERVIÇO é repertório (o que ele sabe entregar) e
 * MODALIDADE é contrato (como se contrata e quanto custa). Misturados, a
 * página obriga a pessoa a procurar preço no meio da descrição de ofício.
 *
 * ⚠ OS SERVIÇOS SAEM DO ACERVO, não de uma lista genérica de agência: cada um
 * aparece nas `disciplines` dos projetos publicados dele, e a peça que o
 * ilustra é um projeto REAL em que aquele serviço foi entregue. Serviço que ele
 * não tem no portfólio não entra — inventar competência é o tipo de coisa que
 * o cliente descobre na primeira reunião.
 */

export type Servico = {
  nome: string;
  /** o que está incluso, no vocabulário do ofício */
  entrega: string;
  /** slug do projeto que PROVA o serviço */
  peca: string;
};

export const SERVICOS: Servico[] = [
  {
    nome: "Visual Identity",
    entrega: "Logotype, colour, typography and the system that keeps them together.",
    peca: "ginga",
  },
  {
    nome: "Brand Systems",
    entrega: "Naming, verbal identity and guidelines — the brand reproduced by other people without losing itself.",
    peca: "alex-archer",
  },
  {
    nome: "Art Direction",
    entrega: "Campaign imagery, editorial and the direction of how the brand is photographed.",
    peca: "stag",
  },
  {
    nome: "Print & Editorial",
    entrega: "Reports, books and stationery — the identity where it is held in the hand.",
    peca: "votare",
  },
];

export type Modalidade = {
  nome: string;
  para: string;
  inclui: string[];
  prazo: string;
  /** ⚠ preço é fato do cliente — ver a nota sobre os dois PROPOSTOS abaixo */
  precoDe: number | null;
  /** unidade que acompanha o valor ("", "/month") */
  unidade?: string;
  /** ⚠ true = número PROPOSTO por mim, ainda não confirmado por ele */
  aConfirmar?: boolean;
};

export const MODALIDADES: Modalidade[] = [
  {
    nome: "Full Brand Identity",
    para: "For companies building — or rebuilding — the whole brand.",
    inclui: ["Strategy & positioning", "Visual identity", "Applications", "Guidelines"],
    prazo: "6–8 weeks",
    precoDe: 2500,
  },
  {
    nome: "Art Direction",
    para: "For brands that already have an identity and need direction in what they produce.",
    inclui: ["Campaign direction", "Editorial & print", "Image direction"],
    prazo: "Per project",
    precoDe: 1500,
    aConfirmar: true,
  },
  {
    nome: "Monthly Retainer",
    para: "Reserved capacity, month by month, for teams that produce all the time.",
    inclui: ["Reserved design days", "Priority turnaround", "Ongoing brand care"],
    prazo: "Monthly",
    precoDe: 2000,
    unidade: "/month",
    aConfirmar: true,
  },
];
