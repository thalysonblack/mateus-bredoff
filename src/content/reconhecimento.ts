/**
 * Onde o trabalho dele foi PUBLICADO por terceiros.
 *
 * Pedido de 16/08 ("a home ainda é curta… section com reconhecimentos dele, um
 * projeto dele estava na Abduzeedo"). A seção existe para dizer o que o próprio
 * portfólio não pode dizer sobre si: que outra gente escolheu mostrar aquilo.
 *
 * ## A régua desta lista
 *
 * **Só entra o que eu ABRI.** Cada item foi visitado com navegador real em
 * 16/08/2026 e traz o código HTTP que devolveu — busca que devolve um título
 * não é prova de que a página existe hoje. O campo `verificado` é auditoria, não
 * enfeite: quando alguém for reconferir daqui a seis meses, é por ele que se
 * começa.
 *
 * **`href: null` quando a página não abre para o público.** É a mesma regra que
 * o rodapé aplica ao X.com: neste site, link que não leva a lugar nenhum vira
 * texto.
 *
 * ✅ **O World Brand Design VOLTOU a abrir — e tem TRÊS matérias, não duas.**
 * Em 16/08 os dois links deram 401 e viraram rótulo. Ele perguntou "o world
 * brand design não tem link?" em 17/08 e a pergunta se respondeu medindo, não
 * relendo o registro: o site foi refeito como **World Brand Design Society**
 * (SPA), as matérias mudaram de endereço e abrem sem senha.
 *
 * Como se acha lá dentro, para a próxima vez: a busca da SPA chama
 * `GET /api/entries/search?q=bredoff&page=1&limit=30`, que devolve id, título e
 * a imagem — **mas não o slug**. O endereço é o título em kebab-case na RAIZ do
 * domínio (não em `/entry/`, apesar de a rota existir no bundle). ⚠️ Como toda
 * SPA, ela responde 200 em qualquer caminho: só vale como prova abrir no
 * navegador e conferir se o `<h1>` traz o título da matéria.
 *
 * A terceira matéria (**Alex Archer**, 04/05/2026) nunca esteve neste arquivo —
 * apareceu na mesma medição. O portfólio tinha um reconhecimento a menos do que
 * a realidade.
 *
 * ⚠️ **LOGO: o campo existe e só um veículo tem arquivo.** Ele pediu os logos
 * duas vezes, e eu fui atrás por todos os caminhos — HTML, CSS, SVG inline,
 * favicon, `og:image`, caminhos convencionais (`/logo.svg`), e por último
 * capturando o header em 4× para recortar o wordmark:
 *
 *   World Brand Design  →  logo real, 350×102 ✓ (está em uso abaixo)
 *   Abduzeedo           →  só favicon 32×32; o header não tem SVG nem <img>
 *   todays.design       →  nada; o `og:image` é social card, não marca
 *
 * O componente já lê `logo` quando existe e cai no wordmark quando não — então
 * assim que os arquivos chegarem (do Thalyson, do Mateus ou do press kit dos
 * veículos) é UMA LINHA por item. O que não dá é subir marca de terceiro
 * pixelada num portfólio de designer.
 *
 * ⚠️ **Números de vaidade ficam de fora.** O Behance mostra contagem de views,
 * mas a página mistura os números do projeto com os das recomendações ao lado, e
 * não consegui isolar com confiança. Número que não sei ler não vai para a tela
 * de cliente.
 */
import artGinga from "../assets/optimized/art-ginga-1400.webp";
import artGinga2x from "../assets/optimized/art-ginga-2200.webp";
import artVotare from "../assets/optimized/art-votare-1400.webp";
import artTrivo from "../assets/optimized/art-trivo-1400.webp";
import artTrivoTipo from "../assets/optimized/art-trivo-tipografia-1200.webp";
import artAlexArcher from "../assets/optimized/case-alexarcher-01-1400.webp";
import artAlexArcher2x from "../assets/optimized/case-alexarcher-01-2200.webp";
import logoWbd from "../assets/optimized/logo-worldbranddesign.webp";
import logoBehance from "../assets/logos/logo-behance.svg";

export type Reconhecimento = {
  /** quem publicou */
  veiculo: string;
  /** título da matéria, como saiu lá */
  titulo: string;
  /** projeto dele a que se refere */
  projeto: string;
  ano: number;
  /** `null` = página existe mas não abre para o público (vira rótulo) */
  href: string | null;
  /** o que eu vi ao abrir, e quando */
  verificado: string;
  /** a PEÇA que foi publicada */
  foto: { src: string; src2x?: string; w: number; h: number; alt: string };
  /** logo do veículo, quando existe arquivo utilizável; senão vira wordmark.
   *  `alturaPx` sobrescreve a altura padrão da classe: logo com muita coisa
   *  dentro (símbolo + brasão + duas linhas de texto, caso do WBDS) precisa de
   *  mais altura para o texto existir — alinhar tudo pela mesma medida faz o
   *  mais detalhado virar borrão. Altura ÓTICA, não geométrica. */
  logo?: { src: string; w: number; h: number; alturaPx?: number };
  /** selo de curadoria da própria plataforma, desenhado em CSS (ver `.v3-selo`) */
  selo?: "behance-gr";
};

export const RECONHECIMENTO: Reconhecimento[] = [
  /**
   * ⭐ O selo "Gr" do Behance — o pedido dele em 17/08 ("coloca o Gr do
   * Behance, mostra o selo").
   *
   * O que ele viu é a fita dourada no canto do perfil: o Behance a concede a
   * quem foi **curado numa galeria de Graphic Design**, e no perfil dele o
   * bloco "Featured In" aponta para a galeria **Branding**
   * (behance.net/galleries/graphic-design/branding).
   *
   * ⚠️ A curadoria é do PROJETO, não do perfil, e nenhum dos sete projetos diz
   * isso na página — só o `Trivo` traz o link da galeria Branding no corpo.
   * Medido projeto a projeto em 17/08/2026: Ginga, Votare, Alex Archer, Bureau,
   * Neox e Stag Grid não têm. Por isso o item credita o Trivo, e não "o
   * portfólio".
   *
   * O selo NÃO é um arquivo de imagem: é `.v3-selo`, desenhado com `clip-path`
   * na tipografia do próprio site. Baixar o ribbon do Behance daria um raster de
   * 30px — a régua deste repo proíbe marca de terceiro pixelada
   * (ver a auditoria de logos abaixo).
   */
  {
    veiculo: "Behance",
    titulo: "Featured in the Branding gallery",
    projeto: "Trivo",
    ano: 2026,
    href: "https://www.behance.net/gallery/230919699/Trivo-Visual-Identity",
    verificado: "17/08/2026 — 'Featured In → Branding' no perfil, e o link da galeria confere na página do Trivo",
    foto: { src: artTrivo, w: 1400, h: 930, alt: "Trivo — identidade visual" },
    /* wordmark VETORIAL, extraído do `<svg>` inline do próprio Behance
       (152,5×28,2) e limpo: sem classe, sem aria da plataforma, `fill` fixo na
       tinta do site. É o único jeito de exibir marca de terceiro num portfólio
       de designer sem raster de 30px. */
    logo: { src: logoBehance, w: 153, h: 28 },
    selo: "behance-gr",
  },
  {
    veiculo: "Abduzeedo",
    titulo: "Branding System for Ginga Capoeira Cultural Project",
    projeto: "Ginga",
    ano: 2026,
    href: "https://abduzeedo.com/branding-system-ginga-capoeira-cultural-project",
    verificado: "HTTP 200 em 16/08/2026 — título e crédito a Bredoff conferidos na página",
    foto: { src: artGinga, src2x: artGinga2x, w: 1400, h: 1097, alt: "Ginga — sistema de marca para projeto cultural de capoeira" },
  },
  {
    veiculo: "World Brand Design",
    titulo: "Mateus Bredoff Develops Alex Archer Into a Structured Identity System",
    projeto: "Alex Archer",
    ano: 2026,
    href: "https://worldbranddesign.com/mateus-bredoff-develops-alex-archer-into-a-structured-identity-system-rooted-in",
    verificado: "HTTP 200 em 17/08/2026, aberto no navegador — o <h1> traz o título; publicado em 04/05/2026",
    foto: { src: artAlexArcher, src2x: artAlexArcher2x, w: 1400, h: 1050, alt: "Alex Archer — sistema de identidade" },
    logo: { src: logoWbd, w: 350, h: 102, alturaPx: 34 },
  },
  {
    veiculo: "World Brand Design",
    titulo: "Mateus Bredoff Designs a Data-Driven Civic Platform Identity for Votare",
    projeto: "Votare",
    ano: 2026,
    href: "https://worldbranddesign.com/mateus-bredoff-designs-a-data-driven-civic-platform-identity-for-votare",
    verificado: "HTTP 200 em 17/08/2026, aberto no navegador — o <h1> confere; publicado em 04/05/2026",
    foto: { src: artVotare, w: 2800, h: 2100, alt: "Votare — identidade cívica" },
    logo: { src: logoWbd, w: 350, h: 102, alturaPx: 34 },
  },
  {
    veiculo: "World Brand Design",
    titulo: "Trivo Visual Identity by Mateus Bredoff",
    projeto: "Trivo",
    /* ⚠ 2025 é a data da matéria ORIGINAL, levantada em 25/07/2026 com o site
       antigo aberto. A plataforma nova carimba `createdAt: 2026-05-01` nas três
       entradas — isso é a data da MIGRAÇÃO, não da publicação, e trocar por ela
       apagaria um ano de trajetória dele. */
    ano: 2025,
    href: "https://worldbranddesign.com/trivo-visual-identity-by-mateus-bredoff",
    verificado: "HTTP 200 em 17/08/2026, aberto no navegador — o <h1> confere",
    /* ⚠ PEÇA DIFERENTE, de propósito. O Trivo aparece duas vezes nesta lista
       (curadoria do Behance em 2026, matéria do WBD em 2025) e nas duas o painel
       mostrava o mesmo carrinho dourado — "quando for repetir projeto, use telas
       diferentes" (17/08). Esta é a peça tipográfica que a PRÓPRIA matéria do
       WBD publicou: cada item mostra o que aquele veículo mostrou. */
    foto: { src: artTrivoTipo, w: 1200, h: 777, alt: "Trivo — peça tipográfica: drinks, music, presence" },
    logo: { src: logoWbd, w: 350, h: 102, alturaPx: 34 },
  },
];

/**
 * ⚠️ PENDÊNCIA DE CONTEÚDO, e é grande: o Behance dele publica **9 projetos**
 * (Ginga, Votare, Alex Archer, Bureau, Neox, Trivo, Stag Grid, Bentofolio® e
 * Bentofolio 2) e `content/work.ts` tem 7 — **`Ginga` e os dois `Bentofolio`
 * não estão no site**, e `Remanescentes` (publicado no todays.design) não está
 * nem no Behance. Ginga é de 2026 e já rendeu matéria na Abduzeedo: é o
 * trabalho mais recente e mais reconhecido dele, e o portfólio não o mostra.
 * Faltam as artes — pedir ao Mateus.
 *
 * ✅ E uma pendência VELHA que se resolveu sozinha: o perfil dele no Behance
 * agora diz **"Senior Designer · Brazil"**. A contradição com o "based in
 * Brazil" do site (o Behance o listava na Alemanha em 25/07) deixou de existir.
 */
/* ⚠ Remanescentes voltou para esta lista em 17/08/2026: ele mandou remover o
   projeto da coleção, então a matéria do todays.design passou a apontar para um
   case que não existe. */
export const FALTAM_NO_SITE = ["Ginga", "Bentofolio®", "Bentofolio 2", "Remanescentes"] as const;

/**
 * ⚠ Guarda de DESENVOLVIMENTO: dois itens do MESMO projeto não podem mostrar a
 * mesma peça. A régua é dele ("quando for repetir projeto, use telas
 * diferentes") e a lista só cresce — sem este aviso, o próximo reconhecimento
 * de um projeto já listado volta a duplicar a imagem em silêncio.
 */
if (import.meta.env?.DEV) {
  const vistas = new Map<string, string>();
  for (const r of RECONHECIMENTO) {
    const anterior = vistas.get(r.projeto);
    if (anterior && anterior === r.foto.src) {
      console.warn(
        `[reconhecimento] "${r.projeto}" aparece mais de uma vez com a MESMA peça. Use outra tela do projeto.`,
      );
    }
    vistas.set(r.projeto, r.foto.src);
  }
}
