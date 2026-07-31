import { useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../../content/work";
import portrait1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../../assets/optimized/hero-portrait-3200.webp";
import "../../../styles/v7.css";

/**
 * HOME V7 — o nome como obra.
 *
 * Sétima versão, e a primeira em que a decisão certa foi TROCAR A FAMÍLIA
 * tipográfica. As seis anteriores reorganizavam layout mantendo a mesma
 * grotesca, e por isso pareciam a mesma coisa mexida de lugar. Tipografia não é
 * acabamento — é o material.
 *
 * Bodoni Moda no display: didone de contraste dramático, a família da moda. O
 * trabalho principal dele é editorial de moda, e um brand designer se apresenta
 * pela tipografia. A grotesca neutra dizia "competente"; a didone diz autoria.
 *
 * A estrutura serve à tipografia, não o contrário:
 *   · o NOME abre a página em corpo de capa, sangrando pela base
 *   · uma citação em itálico solta na margem — o gesto mais caro da família,
 *     usado uma vez só
 *   · o índice de trabalho em corpo grande, com a peça aparecendo ao lado
 *   · serviços e preço como texto corrido, não como tabela
 *
 * Tudo é novo: nenhuma seção reaproveitada de versão anterior. As cores
 * continuam as do cliente.
 */

/* Só o Essential tem valor publicado (US$ 2.500, o que ele anuncia no Behance).
   Os outros dois seguem "On request" até o Mateus mandar o número — preço é
   fato do cliente, não se estima. */
const PACOTES = [
  {
    idx: "01",
    nome: "Essential",
    texto: "The core of an identity, built to stand on its own.",
    prazo: "Three weeks",
    preco: "From US$ 2,500",
    destaque: true,
  },
  {
    idx: "02",
    nome: "Complete",
    texto: "The identity applied where it lives — stationery, social, applications.",
    prazo: "Five weeks",
    preco: "On request",
  },
  {
    idx: "03",
    nome: "Brand system",
    texto:
      "Strategy, naming and verbal identity included, for brands reproduced by other people.",
    prazo: "Eight weeks",
    preco: "On request",
  },
];

const SERVICOS = [
  ["Brand identity", "Mark, palette, typography and the system that keeps it standing without me."],
  ["Art direction", "What the image says, decided before how it looks — and held across every frame."],
  ["Editorial", "Print and digital publications where the grid carries the argument."],
  ["AI direction", "Generative work with authorship: tools change, the eye that judges does not."],
];

export default function HomeV7() {
  const [ativo, setAtivo] = useState(0);
  const peca = WORK[ativo];

  return (
    <div className="v7">
      {/* ── CAPA ───────────────────────────────────────────────────────
          O nome ocupa a base da tela e é cortado pelo corte da página. Acima
          dele, só três linhas de informação — a citação, a apresentação e o
          status. É a estrutura de capa: título embaixo, crédito em cima. */}
      <section className="v7-margin flex min-h-[100dvh] flex-col justify-between overflow-clip pb-0 pt-[clamp(1.25rem,3vh,2rem)]">
        <header className="flex items-start justify-between gap-8">
          <span className="v7-meta">Available for work — Q3</span>
          <nav className="flex flex-col items-end gap-1">
            {[
              ["Work", "#work"],
              ["Services", "#services"],
              ["Pricing", "#pricing"],
              ["Contact", "#contact"],
            ].map(([t, h]) => (
              <a key={t} href={h} className="v7-meta">
                {t}
              </a>
            ))}
          </nav>
        </header>

        {/* Três registros de capa — crédito, texto, título — distribuídos pela
            altura da tela. Antes o texto e o nome vinham colados num grupo só,
            e o vão inteiro da tela caía entre a nav e a citação: no mobile isso
            virava 370px de papel liso antes de qualquer conteúdo. Repartido em
            três, o mesmo ar vira intervalo entre registros. */}
        <div className="v7-indent-a max-w-[40ch]">
          {/* A citação em itálico, solta na margem — uma vez por página */}
          <p className="v7-quote">
            An identity is not a logo. It is the set of decisions that survives the person who made
            them.
          </p>
          <p className="v7-body v7-quiet pt-[clamp(1rem,2vh,1.5rem)]">
            Brand designer and art director, from Brazil, working worldwide. Identities, editorial
            and art direction for brands that need to be taken seriously.
          </p>
        </div>

        {/* O nome, sangrando pela base */}
        <h1 className="v7-display v7-name v7-cut">Mateus Bredoff</h1>
      </section>

      {/* ── RETRATO ────────────────────────────────────────────────────
          Página cheia de imagem, sem texto por cima. Depois da capa
          tipográfica, o rosto entra sozinho — é o contraponto de matéria. */}
      <section className="v7-ink">
        <figure>
          <div className="w-full overflow-hidden" style={{ height: "clamp(20rem,72vh,46rem)" }}>
            <img
              src={portrait1600}
              srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
              sizes="100vw"
              alt="Mateus Bredoff"
              width={1600}
              height={850}
              draggable={false}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <figcaption className="v7-margin v7-meta v7-quiet py-3">
            Mateus Bredoff — brand designer, art director, AI creative
          </figcaption>
        </figure>
      </section>

      {/* ── TRABALHO ───────────────────────────────────────────────────
          O índice em corpo grande na didone. A peça do item percorrido aparece
          à direita, em proporção fixa para o bloco não pular. */}
      <section id="work" className="v7-margin py-[clamp(4rem,12vh,9rem)]">
        <p className="v7-meta v7-quiet pb-[clamp(2rem,5vh,3.5rem)]">Selected work</p>

        <div className="grid grid-cols-1 gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* A lista distribui os nomes pela ALTURA da peça ao lado. Empilhados
              com espaçamento fixo, os sete itens terminavam ~330px antes do pé
              da imagem e sobrava um bloco de papel que lê como layout
              inacabado. Com `justify-between` a coluna de tipo e a coluna de
              imagem fecham juntas, e o ar vira entrelinha de índice. */}
          <ul className="flex flex-col md:h-full md:justify-between">
            {WORK.map((w, i) => (
              <li key={w.slug}>
                <Link
                  to={`/work/${w.slug}`}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  className="flex items-baseline justify-between gap-6 py-[clamp(0.4rem,1.2vh,0.9rem)]"
                >
                  <span
                    className="v7-display v7-h3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{
                      opacity: i === ativo ? 1 : 0.38,
                      transform: i === ativo ? "translateX(0.05em)" : "none",
                    }}
                  >
                    {w.title}
                  </span>
                  <span className="v7-meta v7-quiet shrink-0">{w.year}</span>
                </Link>
              </li>
            ))}
          </ul>

          <figure className="hidden md:block">
            <div className="w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
              <img
                key={peca.slug}
                src={peca.cover.src}
                srcSet={peca.cover.src2x ? `${peca.cover.src} 1400w, ${peca.cover.src2x} 2200w` : undefined}
                sizes="45vw"
                alt={peca.cover.alt}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="v7-meta v7-quiet pt-3">
              {`${peca.title} — ${peca.disciplines.join(", ")}`}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── SERVIÇOS ───────────────────────────────────────────────────
          Quatro parágrafos, o nome do serviço na didone dentro da frase. Sem
          tabela, sem tag, sem card. */}
      <section id="services" className="v7-ink">
        <div className="v7-margin py-[clamp(4rem,12vh,9rem)]">
          <p className="v7-meta v7-quiet pb-[clamp(2rem,5vh,3.5rem)]">What I do</p>

          <div className="flex flex-col gap-[clamp(2rem,5vh,3.5rem)]">
            {SERVICOS.map(([nome, texto]) => (
              <div key={nome} className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-[clamp(2rem,5vw,4rem)]">
                <h3 className="v7-display v7-h3">{nome}</h3>
                <p className="v7-body v7-quiet max-w-[46ch] md:pt-[0.6em]">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇO ──────────────────────────────────────────────────────
          Ficha técnica em três colunas, cada uma sob seu fio. A versão anterior
          era texto corrido numa coluna de 46ch recuada 12% — o que deixava mais
          de metade da largura vazia à direita, e vão morto não lê como respiro,
          lê como layout inacabado. Aqui a informação ocupa a página inteira e o
          preço fecha cada coluna, alinhado na base pelo `mt-auto`.
          Estrutura inédita na página: o Work é índice com peça, os Serviços são
          pares de linhas, este é uma ficha em colunas. */}
      <section id="pricing" className="v7-margin py-[clamp(4rem,12vh,9rem)]">
        <p className="v7-meta v7-quiet pb-[clamp(2rem,5vh,3.5rem)]">Engagements</p>

        <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-[clamp(2.5rem,6vh,4rem)] md:grid-cols-3">
          {PACOTES.map(({ idx, nome, texto, prazo, preco, destaque }) => (
            <div key={nome} className="v7-rule flex flex-col pt-[clamp(0.9rem,2vh,1.4rem)]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="v7-meta v7-quiet">{idx}</span>
                <span className="v7-meta v7-quiet">{prazo}</span>
              </div>
              <h3 className={`v7-display v7-h3 pt-[clamp(1rem,3vh,2rem)]${destaque ? " v7-accent" : ""}`}>
                {nome}
              </h3>
              <p className="v7-body v7-quiet max-w-[34ch] pt-[clamp(0.75rem,2vh,1.25rem)]">{texto}</p>
              <p className="v7-lead mt-auto pt-[clamp(1.5rem,4vh,2.5rem)]">{preco}</p>
            </div>
          ))}
        </div>

        <p className="v7-body v7-quiet pt-[clamp(2rem,5vh,3.5rem)]">
          Custom scope and retainer on request. Remote, worldwide.
        </p>
      </section>

      {/* ── CONTATO ────────────────────────────────────────────────────
          Fecho como contracapa: o convite em corpo de capa, os canais como
          linha de crédito. */}
      <section id="contact" className="v7-ink">
        <div className="v7-margin flex min-h-[62vh] flex-col justify-between overflow-clip py-[clamp(2rem,6vh,4rem)]">
          <p className="v7-meta v7-quiet">Available for work — Q3</p>

          <div>
            {/* Escala de contracapa: o convite responde ao nome da abertura. Em
                v7-h2 sobrava meia tela vazia acima dele — a altura da seção
                existia sem nada para sustentá-la. */}
            <a href="mailto:hello@mateusbredoff.com" className="v7-display v7-close block">
              Let&rsquo;s talk
            </a>

            <div className="flex flex-col gap-3 pt-[clamp(1.5rem,4vh,2.5rem)] md:flex-row md:items-baseline md:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {[
                  ["hello@mateusbredoff.com", "mailto:hello@mateusbredoff.com"],
                  ["Behance", "https://www.behance.net/mateusbredoff"],
                  ["Instagram", "https://www.instagram.com/sir.bredoff/"],
                ].map(([t, h]) => (
                  <a key={t} href={h} className="v7-body" target="_blank" rel="noopener noreferrer">
                    {t}
                  </a>
                ))}
              </div>
              <span className="v7-meta v7-quiet">© 2026 Mateus Bredoff</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
