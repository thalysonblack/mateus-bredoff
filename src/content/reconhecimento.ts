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
 * **`href: null` quando a página não abre para o público.** O World Brand
 * Design passou a exigir senha (401) — as duas matérias foram levantadas em
 * 25/07, quando o site estava aberto, e por isso continuam na lista como FATO;
 * mas viram rótulo, não link. É a mesma regra que o rodapé já aplica ao X.com:
 * neste site, link que não leva a lugar nenhum vira texto.
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
import artRemanescentes from "../assets/optimized/art-remanescentes-1200.webp";
import artVotare from "../assets/optimized/art-votare-1400.webp";
import artTrivo from "../assets/optimized/art-trivo-1400.webp";
import logoWbd from "../assets/optimized/logo-worldbranddesign.webp";

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
  /** logo do veículo, quando existe arquivo utilizável; senão vira wordmark */
  logo?: { src: string; w: number; h: number };
};

export const RECONHECIMENTO: Reconhecimento[] = [
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
    veiculo: "todays.design",
    titulo: "Remanescentes — Visual Identity",
    projeto: "Remanescentes",
    ano: 2026,
    href: "https://todays.design/mateusbredoff/clxfcn9wh009ga8pcpalhwlqa",
    verificado: "HTTP 200 em 16/08/2026 — título confere",
    foto: { src: artRemanescentes, w: 1200, h: 720, alt: "Remanescentes — identidade visual, peças impressas" },
  },
  {
    veiculo: "World Brand Design",
    titulo: "Mateus Bredoff Designs a Data-Driven Civic Platform Identity for Votare",
    projeto: "Votare",
    ano: 2026,
    href: null,
    verificado: "401 em 16/08/2026 (o site passou a exigir senha) — título indexado, entra como rótulo",
    foto: { src: artVotare, w: 2800, h: 2100, alt: "Votare — identidade cívica" },
    logo: { src: logoWbd, w: 350, h: 102 },
  },
  {
    veiculo: "World Brand Design",
    titulo: "Trivo Visual Identity by Mateus Bredoff",
    projeto: "Trivo",
    ano: 2025,
    href: null,
    verificado: "levantado em 25/07/2026 com o site aberto; 401 em 16/08 — entra como rótulo",
    foto: { src: artTrivo, w: 1400, h: 930, alt: "Trivo — identidade visual" },
    logo: { src: logoWbd, w: 350, h: 102 },
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
export const FALTAM_NO_SITE = ["Ginga", "Bentofolio®", "Bentofolio 2", "Remanescentes"] as const;
