/**
 * Coleção de trabalho — a fonte ÚNICA dos cases.
 *
 * No Framer, `/work` é uma coleção de CMS e cada case é um item; aqui é este
 * arquivo. Home, índice `/work` e página `/work/:slug` leem todos daqui, então
 * não existe a possibilidade de o índice e a página discordarem.
 *
 * **Adicionar um case custa uma entrada neste array** — nenhum arquivo novo,
 * nenhuma rota nova. Foi por isso que não se fez um componente de página por
 * case: seis páginas quase iguais divergem no primeiro ajuste.
 *
 * O schema abaixo não foi inventado: são os rótulos que o CMS dele expõe em
 * toda página de item — About, Type, Year, Credits. Se um dia virar Sanity ou
 * Payload, estes campos viram o schema da coleção e a migração é mecânica.
 *
 * ⚠ CADA IMAGEM CARREGA SUA DIMENSÃO MEDIDA (`w`/`h`, lidas do arquivo com
 * `sips`, não estimadas). É o que permite reservar a caixa na proporção nativa
 * antes de a imagem carregar — sem layout shift e sem nada esticado. Se entrar
 * arte nova, MEÇA; não chute o par.
 */

export type WorkImage = {
  /** srcset por largura: 1400/2200 quando a origem permite, nativa quando é menor. */
  src: string;
  src2x?: string;
  w: number;
  h: number;
  alt: string;
  /**
   * Peça em MEIA largura na pilha do case, em vez de sangrar.
   *
   * Não é enfeite: o layout varia por item no CMS dele, e a medição provou.
   * Em `/work/stag` a peça de índice 1 sai sozinha em 788,6px na coluna da
   * direita; em `/work/alex-archer` as de índice 3 e 4 saem lado a lado, uma em
   * cada coluna. Nenhuma regra de posição (`i % 4`) reproduz os dois — é escolha
   * editorial por peça. Enquanto o campo não vier preenchido, `CaseStudy` cai na
   * cadência do template mais comum e o resultado é aproximado, não medido.
   */
  meia?: boolean;
};

export type WorkItem = {
  slug: string;
  title: string;
  year: number;
  /** "Type" no CMS dele. */
  disciplines: string[];
  credits: { name: string; role: string }[];
  /** "About": parágrafos do corpo. Vazio = texto ainda não escrito (ver `contentPending`). */
  about: string[];
  cover: WorkImage;
  images: WorkImage[];
  behanceUrl?: string;
  /**
   * O texto deste case não existe ainda no material do cliente.
   *
   * No Framer publicado, quatro dos seis cases estão com LOREM IPSUM visível e
   * um está totalmente vazio — só o Alex Archer tem texto escrito. Portar aquilo
   * seria trocar de tecnologia mantendo o defeito, e escrever por conta própria
   * seria inventar a narrativa dos projetos dele. Enquanto isto for `true`, a
   * página mostra o trabalho (imagem + metadados) e omite o corpo de texto, em
   * vez de exibir enchimento.
   */
  contentPending?: boolean;
};

const img = (
  src: string,
  w: number,
  h: number,
  alt: string,
  src2x?: string,
): WorkImage => ({ src, src2x, w, h, alt });

/* Alex Archer — o único case com texto real no material do cliente. */
import aa01 from "../assets/optimized/case-alexarcher-01-1400.webp";
import aa01x from "../assets/optimized/case-alexarcher-01-2200.webp";
import aa03 from "../assets/optimized/case-alexarcher-03-1400.webp";
import aa03x from "../assets/optimized/case-alexarcher-03-2200.webp";
import aa04 from "../assets/optimized/case-alexarcher-04-1400.webp";
import aa04x from "../assets/optimized/case-alexarcher-04-2200.webp";
import aa05 from "../assets/optimized/case-alexarcher-05-1400.webp";
import aa05x from "../assets/optimized/case-alexarcher-05-2200.webp";
import aa06 from "../assets/optimized/case-alexarcher-06-1400.webp";
import aa06x from "../assets/optimized/case-alexarcher-06-2200.webp";
import aa07 from "../assets/optimized/case-alexarcher-07-1400.webp";
import aa07x from "../assets/optimized/case-alexarcher-07-2200.webp";
import aa08 from "../assets/optimized/case-alexarcher-08-1400.webp";
import aa08x from "../assets/optimized/case-alexarcher-08-2200.webp";
import aa09 from "../assets/optimized/case-alexarcher-09-1400.webp";
import aa09x from "../assets/optimized/case-alexarcher-09-2200.webp";
import aa11 from "../assets/optimized/case-alexarcher-11-1400.webp";
import aa11x from "../assets/optimized/case-alexarcher-11-2200.webp";
import aa12 from "../assets/optimized/case-alexarcher-12-1400.webp";
import aa12x from "../assets/optimized/case-alexarcher-12-2200.webp";
import aa13 from "../assets/optimized/case-alexarcher-13-1400.webp";
import aa13x from "../assets/optimized/case-alexarcher-13-2200.webp";

/* Artes que a home já usa — os cases sem texto reaproveitam a sua como capa,
   para o índice nunca ter buraco enquanto o corpo não chega. */
import artStag from "../assets/optimized/art-stag-1400.webp";
import artStagX from "../assets/optimized/art-stag-2200.webp";
import artVotare from "../assets/optimized/art-votare-1400.webp";
import artVotareX from "../assets/optimized/art-votare-2200.webp";
import artFerraci from "../assets/optimized/art-ferraci-1400.webp";
import artFerraciX from "../assets/optimized/art-ferraci-2200.webp";
import artTrivo from "../assets/optimized/art-trivo-1400.webp";
import artBureau from "../assets/optimized/art-bureau-1400.webp";
import artBureauX from "../assets/optimized/art-bureau-2200.webp";
import artNeox from "../assets/optimized/art-neox-1400.webp";
import artGinga from "../assets/optimized/art-ginga-1400.webp";
import artGinga2x from "../assets/optimized/art-ginga-2200.webp";

export const WORK: WorkItem[] = [
  /* ⚠ REMANESCENTES SAIU DA COLEÇÃO em 17/08/2026, a pedido dele ("projeto
     remanescentes remover"). A arte e a matéria do todays.design continuam no
     disco e em `reconhecimento.ts` — se ele quiser de volta, é reinserir esta
     entrada, não refazer nada.

     ⚠ Ginga entrou em 16/08/2026, e a lacuna que ele fecha
     é a mais séria que este site tinha: o Behance dele publica NOVE projetos e a
     coleção tinha SETE. Faltava justamente o trabalho mais recente — e o mais
     reconhecido, com matéria na Abduzeedo. Um portfólio que não mostra o
     projeto que rendeu imprensa está trabalhando contra o próprio dono.

     As capas vieram das fontes públicas dele (Behance para Ginga em 2432×1904,
     todays.design para Remanescentes), reencodadas aqui — é arte DELE, no site
     DELE. Os dois entram `contentPending`, como os demais sem texto: peça e
     metadados na tela, corpo vazio, nada inventado.

     ⚠ Continuam de fora `Bentofolio®` e `Bentofolio 2`: são produto próprio
     (template de portfólio), não identidade de cliente, e misturá-los na mesma
     coleção mudaria o que a lista afirma ser. Decisão do Mateus. */
  {
    slug: "ginga",
    title: "Ginga",
    year: 2026,
    disciplines: ["Branding", "Cultural Project"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/253319999/Ginga",
    about: [],
    contentPending: true,
    cover: img(artGinga, 1400, 1097, "Ginga — sistema de marca para projeto cultural de capoeira", artGinga2x),
    images: [],
  },
  {
    slug: "alex-archer",
    title: "Alex Archer ®",
    year: 2026,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Mateus Bredoff", role: "Visual Identity & Art direction" }],
    behanceUrl: "https://www.behance.net/gallery/245777185/Alex-Archer",
    about: [
      "Alex Archer is conceived as a study of constructed presence, structured around architectural principles of repetition, precision and spatial control. The symbol emerges from the layering of horizontal modules, forming a stratified composition that references construction sections and structural support systems, establishing the logical foundation that guides the grid, typographic rhythm and visual system.",
      "The typography was developed through subtle adjustments in proportion and spacing, ensuring technical clarity and editorial coherence throughout the system. Direct contrasts, generous areas of negative space and rigorous alignments define a restrained visual language in which every element responds to a clear and predictable structure.",
      "Photography operates as an extension of this constructive logic, exploring architectural framing, dramatic light incidence and the repetition of human scale as a narrative device. Printed materials, posters and digital applications follow the same modular principles, consolidating an integrated, technical visual identity built on precise relationships between image, space and art direction.",
    ],
    cover: img(aa01, 3840, 2804, "Alex Archer — identidade visual", aa01x),
    images: [
      img(aa03, 3840, 4040, "Alex Archer — composição estratificada", aa03x),
      img(aa04, 4608, 3712, "Alex Archer — aplicação impressa", aa04x),
      img(aa05, 2880, 2160, "Alex Archer — sistema tipográfico", aa05x),
      img(aa06, 4608, 3712, "Alex Archer — cartaz", aa06x),
      img(aa07, 3840, 3240, "Alex Archer — enquadramento arquitetônico", aa07x),
      img(aa08, 4608, 3712, "Alex Archer — material impresso", aa08x),
      img(aa09, 3712, 4608, "Alex Archer — escala humana", aa09x),
      img(aa11, 3841, 3972, "Alex Archer — aplicação digital", aa11x),
      img(aa12, 3841, 3290, "Alex Archer — detalhe do símbolo", aa12x),
      img(aa13, 3841, 3094, "Alex Archer — grade e ritmo", aa13x),
    ],
  },

  /*
   * Abaixo: cases cujo TEXTO ainda não existe no material do cliente.
   * Metadados e créditos são reais (extraídos do CMS dele); o corpo fica vazio
   * de propósito. Preencher `about` e tirar `contentPending` quando o texto
   * chegar — nada mais precisa mudar.
   */
  {
    slug: "bureau",
    title: "Bureau",
    year: 2025,
    disciplines: ["Electronic Music", "Visual Identity"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/250723539/Bureau",
    about: [],
    contentPending: true,
    cover: img(artBureau, 1400, 788, "Bureau — identidade para música eletrônica", artBureauX),
    images: [],
  },
  {
    slug: "neox",
    title: "Neox",
    year: 2025,
    disciplines: ["Technical Apparel", "Visual Identity"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/247842007/Neox",
    about: [],
    contentPending: true,
    cover: img(artNeox, 1400, 1663, "Neox — vestuário técnico"),
    images: [],
  },
  {
    slug: "trivo",
    title: "Trivo",
    year: 2025,
    disciplines: ["Visual Identity", "3D"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/230919699/Trivo-Visual-Identity",
    about: [],
    contentPending: true,
    cover: img(artTrivo, 1400, 930, "Trivo — identidade visual"),
    images: [],
  },
  {
    slug: "stag",
    title: "Stag",
    year: 2025,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Yara Hoffman", role: "Creative Direction, Strategy" }],
    behanceUrl: "https://www.behance.net/gallery/243272967/Stag-Grid-Fashion-Editorial",
    about: [],
    contentPending: true,
    cover: img(artStag, 2800, 2253, "Stag — editorial de moda", artStagX),
    images: [],
  },
  {
    slug: "ferraci",
    title: "Ferraci",
    year: 2025,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Alex Renner", role: "Project Coordination" }],
    about: [],
    contentPending: true,
    cover: img(artFerraci, 1400, 933, "Ferraci — editorial impresso", artFerraciX),
    images: [],
  },
  {
    slug: "votare",
    title: "Votare",
    year: 2025,
    disciplines: ["Branding", "Visual Identity"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/237665389/Votare-Visual-Identity",
    about: [],
    contentPending: true,
    cover: img(artVotare, 2800, 2100, "Votare — identidade cívica", artVotareX),
    images: [],
  },
];

export const findWork = (slug?: string) => WORK.find((w) => w.slug === slug);

/**
 * `proxima` NÃO entra na coleção — e o motivo é de CONTEÚDO, não de técnica.
 *
 * O projeto existe no CMS do Framer dele, mas não está publicado no Behance e
 * **não tem arte própria**: a capa que ele exibia aqui era a arte da Trivo,
 * emprestada como placeholder. Com a Trivo de volta no índice (ela tem case
 * publicado), a mesma imagem apareceria duas vezes com dois nomes diferentes —
 * o visitante leria uma peça de um projeto como se fosse de outro. Índice de
 * portfólio não empresta arte. Volta a entrar quando o Mateus mandar a peça.
 *
 * Histórico: `trivo` já esteve nesta lista porque a página dela no Framer está
 * publicada vazia. Só que página vazia lá não é ausência de trabalho aqui — o
 * case existe no Behance e a arte está no repo. Entrou como `contentPending`,
 * igual aos outros: mostra peça e metadados, omite o corpo de texto.
 */
export const MISSING_FROM_CMS = ["proxima"] as const;
