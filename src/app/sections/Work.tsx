import { motion } from "motion/react";
import { Mono, Rule, Bracket, reveal, revealDelay, idx, ease } from "../system";
/*
 * Artes do portfólio oficial dele (`behance.net/mateusbredoff`), prefixo `art-`.
 *
 * O lote antigo usava `case-*` e vinha com o nome CRUZADO da origem: o arquivo
 * chamado `case-stag` era o livro do Ferraci e o `case-ferraci` era o editorial
 * Stag. Isso já trocou as duas peças no ar uma vez. Os `case-*` foram apagados e
 * o livro renomeado para `art-ferraci-*` — a armadilha não existe mais, e não a
 * recrie: nome de arquivo descreve o que a imagem MOSTRA.
 *
 * ⚠ Cada arte entra na SUA proporção nativa (medida no arquivo, não estimada).
 * Mudar o `ratio` sem trocar a arte corta ou deforma a peça.
 */
import imgStag from "../../assets/optimized/art-stag-1400.webp";
import imgStag2x from "../../assets/optimized/art-stag-2200.webp";
import imgBureau from "../../assets/optimized/art-bureau-1400.webp";
import imgBureau2x from "../../assets/optimized/art-bureau-2200.webp";
import imgAlexArcher from "../../assets/optimized/art-alexarcher-1400.webp";
import imgAlexArcher2x from "../../assets/optimized/art-alexarcher-2200.webp";
import imgNeox from "../../assets/optimized/art-neox-1400.webp";
import imgTrivo from "../../assets/optimized/art-trivo-1400.webp";
import imgVotare from "../../assets/optimized/art-votare-1400.webp";
import imgVotare2x from "../../assets/optimized/art-votare-2200.webp";
import imgFerraci from "../../assets/optimized/art-ferraci-1400.webp";
import imgFerraci2x from "../../assets/optimized/art-ferraci-2200.webp";

/**
 * Selected Work — índice escalonado, no lugar do carrossel.
 *
 * As referências nunca apresentam trabalho como carrossel com pílulas de
 * filtro; apresentam como um índice de arquivo: numerado (001, 002…), com as
 * peças em larguras e alturas diferentes, desencontradas na vertical, e uma
 * legenda técnica embaixo de cada uma — índice à esquerda, nome à direita, na
 * largura exata da imagem.
 *
 * O escalonamento vem de três colunas com recuos de topo diferentes, não de
 * posicionamento absoluto: colapsa sozinho para uma coluna no mobile e nunca
 * gera o card mais largo que a tela (a armadilha do carrossel antigo).
 */

type Project = {
  name: string;
  category: string;
  /** Marca a procedência quando não é trabalho autoral dele. Ausente = autoral. */
  tag?: string;
  /** Case no Behance — as peças não abriam nada, e um índice que não abre irrita. */
  href: string;
  image: string;
  srcSet: string;
  ratio: string;
  bg: string;
  fit: "cover" | "contain";
};

const srcSetOf = (small: string, large: string) => `${small} 1400w, ${large} 2200w`;

/*
 * O lab de IA não é uma seção separada.
 *
 * Ele já foi: uma seção "AI Lab" anunciando "fictional brands, built to test
 * ideas". Duas coisas estavam erradas. Primeiro, dizer que o trabalho é fictício
 * enfraquece o portfólio — o visitante não precisa dessa ressalva, e ela vira a
 * primeira coisa que ele lê sobre aquelas peças. Segundo, a lista estava errada:
 * Bureau, Alex Archer e Neox são **projetos publicados no Behance dele**, e eu
 * os havia classificado como ficção.
 *
 * Agora tudo vive no mesmo índice, e a procedência entra como `tag` discreta na
 * legenda — informação, não desculpa.
 */
const PROJECTS: Project[] = [
  {
    name: "Stag Grid",
    category: "Fashion Editorial",
    href: "https://www.behance.net/gallery/243272967/Stag-Grid-Fashion-Editorial",
    image: imgStag,
    srcSet: srcSetOf(imgStag, imgStag2x),
    ratio: "2800 / 2253",
    bg: "#e9e6df",
    fit: "cover",
  },
  {
    name: "Bureau",
    category: "Electronic Music",
    href: "https://www.behance.net/gallery/250723539/Bureau",
    image: imgBureau,
    srcSet: srcSetOf(imgBureau, imgBureau2x),
    ratio: "16 / 9",
    bg: "#0d0d0d",
    fit: "cover",
  },
  {
    name: "Neox",
    category: "Technical Apparel",
    href: "https://www.behance.net/gallery/247842007/Neox",
    image: imgNeox,
    srcSet: `${imgNeox} 1400w`,
    ratio: "1920 / 2280",
    bg: "#f4f5f7",
    fit: "cover",
  },
  {
    name: "Trivo",
    category: "Visual Identity / 3D",
    href: "https://www.behance.net/gallery/230919699/Trivo-Visual-Identity",
    image: imgTrivo,
    srcSet: `${imgTrivo} 1400w`,
    ratio: "1920 / 1275",
    bg: "#000000",
    fit: "cover",
  },
  {
    name: "Alex Archer",
    category: "Brand Identity",
    href: "https://www.behance.net/gallery/245777185/Alex-Archer",
    image: imgAlexArcher,
    srcSet: srcSetOf(imgAlexArcher, imgAlexArcher2x),
    ratio: "2800 / 2255",
    bg: "#0d0d0d",
    fit: "cover",
  },
  {
    name: "Votare",
    category: "Civic Identity",
    href: "https://www.behance.net/gallery/237665389/Votare-Visual-Identity",
    image: imgVotare,
    srcSet: srcSetOf(imgVotare, imgVotare2x),
    ratio: "4 / 3",
    bg: "#f1f0ec",
    fit: "cover",
  },
  {
    name: "Ferraci",
    category: "Editorial / Identity",
    href: "https://www.behance.net/mateusbredoff",
    image: imgFerraci,
    srcSet: srcSetOf(imgFerraci, imgFerraci2x),
    ratio: "1400 / 933",
    bg: "#0d0d0d",
    fit: "cover",
  },
];

/* Cada coluna desce um tanto diferente — é daí que vem o desencontro. Os
   valores são em vw para o escalonamento acompanhar a escala da página. */
const COLUMN_OFFSETS = ["0vw", "9vw", "3vw"];

/*
 * Distribuição por coluna mais curta, não por índice.
 *
 * Duas tentativas anteriores falharam. Índices escritos à mão (`[0]`, `[1,3]`,
 * `[2]`) apontaram para item inexistente no dia em que a lista mudou de tamanho.
 * Round-robin não quebra, mas ignora que as peças têm proporções diferentes: com
 * 7 itens ele empilhou 3 na primeira coluna e 2 nas outras, e como as artes
 * variam de 16:9 a 5:6 sobrou um vão morto de quase uma tela à direita.
 *
 * Aqui cada peça vai para a coluna mais curta no momento, e a altura é estimada
 * pela proporção (altura ∝ largura / ratio) + a folga da legenda. É o mesmo
 * raciocínio de um masonry, resolvido no build em vez de no cliente.
 */
const ratioOf = (r: string) => {
  const [w, h] = r.split("/").map((v) => parseFloat(v.trim()));
  return w / h;
};

const COLUMNS = (() => {
  const cols = COLUMN_OFFSETS.map((offset) => ({ offset, items: [] as number[], height: 0 }));
  PROJECTS.forEach((p, i) => {
    const target = cols.reduce((a, b) => (b.height < a.height ? b : a));
    target.items.push(i);
    target.height += 1 / ratioOf(p.ratio) + 0.12; // 0.12 ≈ legenda + respiro
  });
  return cols;
})();

function Piece({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article {...revealDelay(index, 0.08)} className="group mb-[clamp(2.5rem,5vw,5rem)]">
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`${project.name} — ${project.category} (abre no Behance)`}
      >
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: project.ratio, background: project.bg }}
        >
          <img
            src={project.image}
            srcSet={project.srcSet}
            sizes="(min-width: 768px) 33vw, 100vw"
            alt={`${project.name} — ${project.category}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ objectFit: project.fit, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
        </div>

        {/* Legenda técnica, na largura da peça. A tag de procedência entra à
            esquerda, colada no índice: é metadado do registro, não manchete. */}
        <div className="flex items-baseline justify-between gap-4 pt-2">
          <span className="flex items-baseline gap-2">
            <Mono dim className="idx-acc">{idx(index)}</Mono>
            {project.tag ? (
              <Mono dim className="border border-current px-[0.4em] py-[0.1em] leading-none">
                {project.tag}
              </Mono>
            ) : null}
          </span>
          <Mono className="text-right">
            {project.name}
            <span className="dim">{` / ${project.category}`}</span>
          </Mono>
        </div>
      </a>
    </motion.article>
  );
}

export default function Work() {
  return (
    <section id="work" className="on-paper w-full">
      <div className="bleed pt-[clamp(3rem,7vw,7rem)]">
        <Rule />

        {/* Cabeça: título gigante com a contagem sobrescrita + ação à direita */}
        <div className="flex items-start justify-between gap-6 pb-[clamp(2.5rem,6vw,5rem)] pt-3">
          <motion.h2
            {...reveal}
            className="t-display"
            style={{ fontSize: "clamp(2.5rem, 8.4vw, 148px)", lineHeight: 0.9 }}
          >
            Selected Work
            <Mono className="ml-[0.35em] align-top dim">[{PROJECTS.length}]</Mono>
          </motion.h2>

          <motion.a
            {...reveal}
            href="#contact"
            className="link-quiet shrink-0 pt-1"
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <Bracket>Enquire</Bracket>
          </motion.a>
        </div>

        {/* Índice escalonado */}
        <div className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2.5rem)] md:grid-cols-3">
          {COLUMNS.map((col, c) => (
            <div key={c} className="stagger-col" style={{ "--col-offset": col.offset } as React.CSSProperties}>
              {col.items.map((i) => (
                <Piece key={PROJECTS[i].name} project={PROJECTS[i]} index={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
