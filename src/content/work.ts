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


/* Artes que a home já usa — os cases sem texto reaproveitam a sua como capa,
   para o índice nunca ter buraco enquanto o corpo não chega. */
/* Alex Archer — capa. */
import aa01 from "../assets/optimized/case-alexarcher-01-1400.webp";
import aa01x from "../assets/optimized/case-alexarcher-01-2200.webp";

/* Galerias dos cases — extraídas do Figma do Mateus (15/10/2026), na ordem do canvas. */
import gg01 from "../assets/optimized/case-ginga-01-1400.webp";
import gg01x from "../assets/optimized/case-ginga-01-1620.webp";
import gg02 from "../assets/optimized/case-ginga-02-1400.webp";
import gg02x from "../assets/optimized/case-ginga-02-1620.webp";
import gg03 from "../assets/optimized/case-ginga-03-1400.webp";
import gg03x from "../assets/optimized/case-ginga-03-1620.webp";
import gg04 from "../assets/optimized/case-ginga-04-1400.webp";
import gg04x from "../assets/optimized/case-ginga-04-1620.webp";
import gg05 from "../assets/optimized/case-ginga-05-1400.webp";
import gg05x from "../assets/optimized/case-ginga-05-1620.webp";
import gg06 from "../assets/optimized/case-ginga-06-1400.webp";
import gg06x from "../assets/optimized/case-ginga-06-1620.webp";
import gg07 from "../assets/optimized/case-ginga-07-1400.webp";
import gg07x from "../assets/optimized/case-ginga-07-1613.webp";
import gg08 from "../assets/optimized/case-ginga-08-1400.webp";
import gg08x from "../assets/optimized/case-ginga-08-1620.webp";
import gg09 from "../assets/optimized/case-ginga-09-1400.webp";
import gg09x from "../assets/optimized/case-ginga-09-1620.webp";
import gg10 from "../assets/optimized/case-ginga-10-1400.webp";
import gg10x from "../assets/optimized/case-ginga-10-1620.webp";
import gg11 from "../assets/optimized/case-ginga-11-1400.webp";
import gg11x from "../assets/optimized/case-ginga-11-1620.webp";
import gg12 from "../assets/optimized/case-ginga-12-1400.webp";
import gg12x from "../assets/optimized/case-ginga-12-1620.webp";
import gg13 from "../assets/optimized/case-ginga-13-1400.webp";
import gg13x from "../assets/optimized/case-ginga-13-1620.webp";
import gg14 from "../assets/optimized/case-ginga-14-1400.webp";
import gg14x from "../assets/optimized/case-ginga-14-1620.webp";
import ax02 from "../assets/optimized/case-alex-archer-02-1400.webp";
import ax02x from "../assets/optimized/case-alex-archer-02-1921.webp";
import ax03 from "../assets/optimized/case-alex-archer-03-1400.webp";
import ax03x from "../assets/optimized/case-alex-archer-03-1921.webp";
import ax04 from "../assets/optimized/case-alex-archer-04-1400.webp";
import ax04x from "../assets/optimized/case-alex-archer-04-1921.webp";
import ax05 from "../assets/optimized/case-alex-archer-05-1400.webp";
import ax05x from "../assets/optimized/case-alex-archer-05-1920.webp";
import ax06 from "../assets/optimized/case-alex-archer-06-1400.webp";
import ax06x from "../assets/optimized/case-alex-archer-06-1921.webp";
import ax07 from "../assets/optimized/case-alex-archer-07-1400.webp";
import ax07x from "../assets/optimized/case-alex-archer-07-1920.webp";
import ax08 from "../assets/optimized/case-alex-archer-08-1400.webp";
import ax08x from "../assets/optimized/case-alex-archer-08-2028.webp";
import ax09 from "../assets/optimized/case-alex-archer-09-1400.webp";
import ax09x from "../assets/optimized/case-alex-archer-09-1920.webp";
import ax10 from "../assets/optimized/case-alex-archer-10-1400.webp";
import ax10x from "../assets/optimized/case-alex-archer-10-1920.webp";
import ax11 from "../assets/optimized/case-alex-archer-11-1400.webp";
import ax11x from "../assets/optimized/case-alex-archer-11-1921.webp";
import ax12 from "../assets/optimized/case-alex-archer-12-1400.webp";
import ax12x from "../assets/optimized/case-alex-archer-12-1920.webp";
import nx01 from "../assets/optimized/case-neox-01-1400.webp";
import nx01x from "../assets/optimized/case-neox-01-1856.webp";
import nx02 from "../assets/optimized/case-neox-02-1400.webp";
import nx02x from "../assets/optimized/case-neox-02-1856.webp";
import nx03 from "../assets/optimized/case-neox-03-1400.webp";
import nx03x from "../assets/optimized/case-neox-03-1856.webp";
import nx04 from "../assets/optimized/case-neox-04-1400.webp";
import nx04x from "../assets/optimized/case-neox-04-1856.webp";
import nx05 from "../assets/optimized/case-neox-05-1400.webp";
import nx05x from "../assets/optimized/case-neox-05-1856.webp";
import nx06 from "../assets/optimized/case-neox-06-1400.webp";
import nx06x from "../assets/optimized/case-neox-06-1856.webp";
import nx07 from "../assets/optimized/case-neox-07-1400.webp";
import nx07x from "../assets/optimized/case-neox-07-1856.webp";
import nx08 from "../assets/optimized/case-neox-08-1400.webp";
import nx08x from "../assets/optimized/case-neox-08-1856.webp";
import nx09 from "../assets/optimized/case-neox-09-1400.webp";
import nx09x from "../assets/optimized/case-neox-09-2800.webp";
import nx10 from "../assets/optimized/case-neox-10-1400.webp";
import nx10x from "../assets/optimized/case-neox-10-2572.webp";
import nx11 from "../assets/optimized/case-neox-11-1400.webp";
import nx11x from "../assets/optimized/case-neox-11-1857.webp";
import nx12 from "../assets/optimized/case-neox-12-1400.webp";
import nx12x from "../assets/optimized/case-neox-12-1857.webp";
import nx13 from "../assets/optimized/case-neox-13-1400.webp";
import nx13x from "../assets/optimized/case-neox-13-1857.webp";
import nx14 from "../assets/optimized/case-neox-14-1400.webp";
import nx14x from "../assets/optimized/case-neox-14-1857.webp";
import nx15 from "../assets/optimized/case-neox-15-1400.webp";
import nx15x from "../assets/optimized/case-neox-15-2800.webp";
import tv02 from "../assets/optimized/case-trivo-02-1400.webp";
import tv02x from "../assets/optimized/case-trivo-02-1890.webp";
import tv03 from "../assets/optimized/case-trivo-03-1400.webp";
import tv03x from "../assets/optimized/case-trivo-03-2147.webp";
import tv04 from "../assets/optimized/case-trivo-04-1400.webp";
import tv04x from "../assets/optimized/case-trivo-04-2800.webp";
import tv05 from "../assets/optimized/case-trivo-05-1400.webp";
import tv05x from "../assets/optimized/case-trivo-05-1890.webp";
import tv07 from "../assets/optimized/case-trivo-07-1400.webp";
import tv07x from "../assets/optimized/case-trivo-07-1890.webp";
import tv08 from "../assets/optimized/case-trivo-08-1400.webp";
import tv08x from "../assets/optimized/case-trivo-08-2147.webp";
import tv09 from "../assets/optimized/case-trivo-09-1400.webp";
import tv09x from "../assets/optimized/case-trivo-09-2148.webp";
import tv10 from "../assets/optimized/case-trivo-10-1400.webp";
import tv10x from "../assets/optimized/case-trivo-10-1890.webp";
import sg01 from "../assets/optimized/case-stag-01-1400.webp";
import sg01x from "../assets/optimized/case-stag-01-2800.webp";
import sg02 from "../assets/optimized/case-stag-02-1400.webp";
import sg02x from "../assets/optimized/case-stag-02-2534.webp";
import sg03 from "../assets/optimized/case-stag-03-1400.webp";
import sg03x from "../assets/optimized/case-stag-03-2534.webp";
import sg04 from "../assets/optimized/case-stag-04-1400.webp";
import sg04x from "../assets/optimized/case-stag-04-2534.webp";
import sg05 from "../assets/optimized/case-stag-05-1400.webp";
import sg05x from "../assets/optimized/case-stag-05-2800.webp";
import sg06 from "../assets/optimized/case-stag-06-1400.webp";
import sg06x from "../assets/optimized/case-stag-06-2533.webp";
import sg07 from "../assets/optimized/case-stag-07-1400.webp";
import sg07x from "../assets/optimized/case-stag-07-2800.webp";
import sg09 from "../assets/optimized/case-stag-09-1400.webp";
import sg09x from "../assets/optimized/case-stag-09-2534.webp";
import sg10 from "../assets/optimized/case-stag-10-1400.webp";
import sg10x from "../assets/optimized/case-stag-10-2534.webp";
import vt01 from "../assets/optimized/case-votare-01-1400.webp";
import vt01x from "../assets/optimized/case-votare-01-1652.webp";
import vt02 from "../assets/optimized/case-votare-02-1400.webp";
import vt02x from "../assets/optimized/case-votare-02-2800.webp";
import vt03 from "../assets/optimized/case-votare-03-1400.webp";
import vt03x from "../assets/optimized/case-votare-03-1652.webp";
import vt04 from "../assets/optimized/case-votare-04-1400.webp";
import vt04x from "../assets/optimized/case-votare-04-2160.webp";

/* Artes que a home já usa (capas). */
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
    about: [
      "Ginga is a visual identity created for a capoeira group that offers workshops and learning experiences centered around this art form. The art direction draws on historical and cultural perspectives, presenting capoeira as a living, collective practice in constant motion. For this project, I combined editorial typography, bold colors, and high-contrast documentary photography, also using the images as illustrative elements. The visual system unfolds across posters, digital assets, and a range of applications that expand the brand’s universe.",
      "Ginga’s identity creates a visual language that expresses the unpredictability of the game, its historical dimension, and the continuous relationship between body, rhythm, and memory.",
    ],
    cover: img(artGinga, 1400, 1097, "Ginga — sistema de marca para projeto cultural de capoeira", artGinga2x),
    images: [
      { ...img(gg01, 1400, 1750, "Ginga — cartaz com a marca ginga em branco sobre vermelho", gg01x), meia: true },
      { ...img(gg02, 1400, 1750, "Ginga — retrato de capoeirista em rua de comunidade", gg02x), meia: true },
      { ...img(gg03, 1400, 1750, "Ginga — cartaz tipográfico com nomes de capoeira sobre verde-limão", gg03x), meia: true },
      { ...img(gg04, 1400, 1750, "Ginga — foto de jogo de capoeira em parada de mão", gg04x), meia: true },
      { ...img(gg05, 1400, 1750, "Ginga — folheto dobrado com a frase sobre memória do movimento", gg05x), meia: true },
      { ...img(gg06, 1400, 1750, "Ginga — cartaz 'Malícia is movement with a second meaning'", gg06x), meia: true },
      { ...img(gg07, 1400, 1758, "Ginga — foto de capoeiristas diante de parede vermelha", gg07x), meia: true },
      { ...img(gg08, 1400, 1750, "Ginga — cartaz da roda colado em vitrine com persiana", gg08x), meia: true },
      { ...img(gg09, 1400, 1750, "Ginga — catálogo Ginga Archive com instrumentos e roupas", gg09x), meia: true },
      { ...img(gg10, 1400, 1750, "Ginga — cartaz 'Every rooftop can turn into a living roda' preso em persiana", gg10x), meia: true },
      { ...img(gg11, 1400, 1750, "Ginga — cartaz 'The movement became resistance' sobre laranja", gg11x), meia: true },
      { ...img(gg12, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre oliva", gg12x), meia: true },
      { ...img(gg13, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre verde-limão", gg13x), meia: true },
      { ...img(gg14, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre vermelho", gg14x), meia: true },
    ],
  },
  {
    slug: "alex-archer",
    title: "Alex Archer ®",
    year: 2026,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Mateus Bredoff", role: "Visual Identity & Art direction" }],
    behanceUrl: "https://www.behance.net/gallery/245777185/Alex-Archer",
    about: [
      "Alex Archer is conceived as a study of constructed presence, structured around architectural principles of repetition, precision and spatial control. The symbol emerges from the layering of horizontal modules, forming a stratified composition that references construction sections and structural support systems, establishing the logical foundation that guides the grid, typographic rhythm and visual organization across applications.",
      "The typography was developed through subtle adjustments in proportion and spacing, ensuring technical clarity and editorial coherence throughout the system. Direct contrasts, generous areas of negative space and rigorous alignments define a restrained visual language in which every element responds to a clear and predictable structure.",
      "Photography operates as an extension of this constructive logic, exploring architectural framing, dramatic light incidence and the repetition of human scale as a narrative device. Printed materials, posters and digital applications follow the same modular principles, consolidating an integrated, technical visual identity built on precise relationships between image, space and art direction.",
    ],
    cover: img(aa01, 3840, 2804, "Alex Archer — identidade visual", aa01x),
    images: [
      img(ax02, 1400, 1128, "Alex Archer — revista com retrato e a marca em grande escala", ax02x),
      img(ax03, 1400, 1126, "Alex Archer — livro 'Shapers of the Void'", ax03x),
      img(ax04, 1400, 1128, "Alex Archer — símbolo de módulos horizontais em luz", ax04x),
      img(ax05, 1400, 1130, "Alex Archer — site do estúdio com fotografia de arquitetura", ax05x),
      img(ax06, 1400, 1128, "Alex Archer — grupo nos degraus sob luz dura", ax06x),
      img(ax07, 1400, 1075, "Alex Archer — escada em espiral vista de baixo", ax07x),
      img(ax08, 1400, 1068, "Alex Archer — assinatura horizontal com símbolo e nome", ax08x),
      { ...img(ax09, 1400, 1075, "Alex Archer — caixa de cartões preta com a marca em relevo", ax09x), meia: true },
      { ...img(ax10, 1400, 1075, "Alex Archer — cartazes 'Structure (Presence)' com silhuetas", ax10x), meia: true },
      img(ax11, 1400, 1075, "Alex Archer — cartazes pendurados em série", ax11x),
      img(ax12, 1400, 1075, "Alex Archer — mãos segurando a publicação 'House N.01'", ax12x),
    ],
  },

  /*
   * Abaixo: os demais cases. Neox, Trivo e Votare têm o texto do "Project
   * Overview" do Figma dele (15/10/2026). Bureau, Stag e Ferraci seguem SEM
   * texto no material do cliente (o Figma não tem Overview para eles).
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
    about: [
      "Neox is a brand launched in Japan that operates at the intersection of garments and objects, developing pieces based on the relationship between form, material, and presence on the body. Its visual language is rooted in the retrofuturistic aesthetic of the early 2000s (Y2K), featuring metallic surfaces, organic shapes, and a technological tone that still feels contemporary. Rather than following trends, the brand builds a continuous visual system where each release reinforces a consistent and recognizable logic.",
      "At the same time, Neox is not limited to a specific territory or culture. Despite its origins in Japan, its approach is universal, aiming to connect across different contexts through a clear and direct visual language. The brand establishes a balance between past and present, using early 2000s references as a foundation to build something contemporary, where retro and current elements coexist with precision.",
      "In this project, I developed the entire photographic direction, 3D work (including AI-generated imagery), and part of the mockup creation. Essentially, all visual aspects of the project were created by me.",
    ],
    cover: img(artNeox, 1400, 1663, "Neox — vestuário técnico"),
    images: [
      { ...img(nx01, 1400, 1738, "Neox — regata de tela suspensa por cabos", nx01x), meia: true },
      { ...img(nx02, 1400, 1738, "Neox — modelo com óculos e anel diante de halo de luz", nx02x), meia: true },
      { ...img(nx03, 1400, 1738, "Neox — modelo em plongée com a mão aberta para a câmera", nx03x), meia: true },
      { ...img(nx04, 1400, 1738, "Neox — modelo agachado sobre fundo claro", nx04x), meia: true },
      { ...img(nx05, 1400, 1738, "Neox — modelo de macacão jeans em pose baixa", nx05x), meia: true },
      { ...img(nx06, 1400, 1738, "Neox — nuca raspada com a marca Neox", nx06x), meia: true },
      { ...img(nx07, 1400, 1738, "Neox — modelo com fones prateados e regata Neox", nx07x), meia: true },
      { ...img(nx08, 1400, 1738, "Neox — look branco de corpo inteiro", nx08x), meia: true },
      img(nx09, 1400, 1128, "Neox — modelo deitada sobre disco metálico", nx09x),
      { ...img(nx10, 1400, 2509, "Neox — chaveiro metálico com o símbolo Neox", nx10x), meia: true },
      { ...img(nx11, 1400, 1737, "Neox — modelo em traje cromado com tênis", nx11x), meia: true },
      { ...img(nx12, 1400, 1737, "Neox — modelo vista de cima em movimento", nx12x), meia: true },
      { ...img(nx13, 1400, 1737, "Neox — modelo ajustando os óculos", nx13x), meia: true },
      { ...img(nx14, 1400, 1737, "Neox — modelo em traje de tela e calça cargo", nx14x), meia: true },
      img(nx15, 1400, 1128, "Neox — capa de celular metálica de forma orgânica", nx15x),
    ],
  },
  {
    slug: "trivo",
    title: "Trivo",
    year: 2025,
    disciplines: ["Visual Identity", "3D"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/230919699/Trivo-Visual-Identity",
    about: [
      "Trivo is a bar inspired by the essence of jazz, not only as a musical genre, but as a way of living and connecting. It was born from the idea of bringing together three core elements: music, cocktails, and human presence.",
      "At Trivo, every night is an invitation to slow down, appreciate the moment, and enjoy the art of being together. Whether through a signature cocktail or a spontaneous conversation sparked by the sound of a saxophone, the experience is always intense, immersive, and full of personality.",
      "The space is intimate yet vibrant, designed to create encounters, stories, and a true sense of belonging. Trivo is not just a place to drink, it is a place to feel. To listen. To exist.",
      "Recently, we were featured in Behance’s Graphic Design category, placing my project among some of the best in the world on the platform.",
    ],
    cover: img(artTrivo, 1400, 930, "Trivo — identidade visual"),
    images: [
      { ...img(tv02, 1400, 2000, "Trivo — cardápio 'Meet the hall of sips' na mesa", tv02x), meia: true },
      img(tv03, 1400, 881, "Trivo — logotipo em metal sobre preto", tv03x),
      img(tv04, 1400, 612, "Trivo — peças impressas em ouro e vinho", tv04x),
      img(tv05, 1400, 1000, "Trivo — selo 'Book your table' dourado", tv05x),
      { ...img(tv07, 1400, 2000, "Trivo — guitarrista no palco do bar", tv07x), meia: true },
      img(tv08, 1400, 881, "Trivo — cartão de mesa com a marca", tv08x),
      img(tv09, 1400, 880, "Trivo — cartazes 'To the nights that overflow'", tv09x),
      { ...img(tv10, 1400, 2000, "Trivo — guardanapo com a marca ao lado de um copo de uísque", tv10x), meia: true },
    ],
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
    images: [
      img(sg01, 1400, 1129, "Stag — modelo com máscara de cervo dourada e luvas pretas", sg01x),
      { ...img(sg02, 1400, 1740, "Stag — modelo com brinco em forma de galhada", sg02x), meia: true },
      { ...img(sg03, 1400, 1739, "Stag — costas com colar de galhada dourada", sg03x), meia: true },
      { ...img(sg04, 1400, 1739, "Stag — modelo com colar de galhada sobre tecido marrom", sg04x), meia: true },
      img(sg05, 1400, 983, "Stag — perfil com brinco de galhada sobre fundo marrom", sg05x),
      { ...img(sg06, 1400, 1738, "Stag — modelo de vestido longo com braceletes de galhada", sg06x), meia: true },
      img(sg07, 1400, 1248, "Stag — modelo com anéis de galhada sobre fundo preto", sg07x),
      { ...img(sg09, 1400, 1740, "Stag — modelo com top de galhada em passarela", sg09x), meia: true },
      { ...img(sg10, 1400, 1739, "Stag — detalhe de broche de cervo dourado no ombro", sg10x), meia: true },
    ],
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
    about: [
      "Votare is a platform created to transform the way Brazilians choose their representatives, combining technology, political education, and intelligent data. The project helps each voter understand their own ideals and values, connecting them with candidates who align with their vision, turning the act of voting into a true expression of identity.",
      "In a scenario where a large part of the population feels their voice has little impact, Votare presents clear and unbiased data, guiding citizens without manipulation and promoting conscious decision-making. Its visual identity reflects this purpose, conveying clarity, trust, and impact, while connecting democratic tradition with technological innovation to inspire a new generation of engaged voters.",
    ],
    cover: img(artVotare, 2800, 2100, "Votare — identidade cívica", artVotareX),
    images: [
      img(vt01, 1400, 1145, "Votare — cartaz 'Só faremos um Brasil melhor com intenção' sobre parede", vt01x),
      img(vt02, 1400, 350, "Votare — sistema da marca: símbolo, paleta e tipografia", vt02x),
      img(vt03, 1400, 1145, "Votare — painel 'Toda voz importa!' em evento", vt03x),
      img(vt04, 1400, 875, "Votare — cartaz 'Um voto consciente pode mudar milhões de vidas'", vt04x),
    ],
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
