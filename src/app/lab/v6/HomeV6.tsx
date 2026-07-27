import { useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../../content/work";
import portrait1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../../assets/optimized/hero-portrait-3200.webp";
import "../../../styles/v6.css";

/**
 * HOME V6 — sistema NOVO, todas as seções.
 *
 * As cinco tentativas anteriores erraram pelo mesmo motivo de processo: eu
 * trocava uma ou duas seções e mantinha o resto "porque estava aprovado". O
 * resultado era colagem — hero novo em cima de seções de outro partido — e
 * colagem não convence ninguém. Aqui NADA é reaproveitado: capa, manifesto,
 * índice, cases, serviços, preço e contato são todos escritos neste sistema.
 *
 * O PARTIDO é editorial de moda, que é o território real do trabalho dele (Stag
 * é editorial de moda, Alex Archer é arquitetura fotográfica, Ferraci é
 * editorial impresso). O sistema anterior era "documento técnico" e soava a
 * ferramenta: fio de 1px em tudo, mono em toda parte, densidade de tabela.
 *
 * O que muda, em uma linha cada:
 *   · caixa MISTA no display, não uppercase — devolve ascendentes e descendentes
 *   · escala até 22vw — título de moda ocupa a página
 *   · SEM fio: a separação é espaço, e o espaço é generoso ao ponto de incomodar
 *   · mono só em legenda de foto e numeral
 *   · assimetria: blocos deslocados como spread, nada em grade de 12 iguais
 *
 * As cores continuam as do cliente (papel #ede6e1 / tinta petróleo #19272d),
 * porque foram escolhidas por ele a partir do próprio site publicado.
 *
 * Detalhes de sistema em `styles/v6.css`, com o porquê de cada decisão.
 */

const SERVICOS = [
  {
    nome: "Brand identity",
    texto:
      "Mark, palette, typography and the system that keeps it standing when other people take over.",
  },
  {
    nome: "Art direction",
    texto:
      "Deciding what the image says before deciding how it looks — and holding that across every frame.",
  },
  {
    nome: "Editorial",
    texto: "Print and digital publications where the grid does the argument, not the decoration.",
  },
  {
    nome: "AI direction",
    texto:
      "Generative work with authorship: the tool changes, the eye that judges the result does not.",
  },
];

export default function HomeV6() {
  const [ativo, setAtivo] = useState(0);
  const destaque = WORK[ativo];

  return (
    <div className="v6">
      {/* ── CAPA ─────────────────────────────────────────────────────────
          Sem barra de navegação horizontal com sete itens: a capa de revista
          tem título, uma linha de crédito e nada mais. A navegação vive no pé
          da capa, discreta. */}
      <section className="v6-margin flex min-h-[100dvh] flex-col justify-between pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(1.25rem,3vh,2.5rem)]">
        <header className="flex items-baseline justify-between gap-6">
          <span className="v6-caption">Mateus Bredoff — Portfolio 2026</span>
          <span className="v6-caption v6-quiet">Brazil · Worldwide</span>
        </header>

        <div>
          {/* O nome como capa. Duas linhas, entrelinha colada, caixa mista. */}
          <h1 className="v6-display v6-cover">
            Mateus
            <br />
            Bredoff
          </h1>

          <div className="flex flex-col gap-[clamp(1rem,3vw,3rem)] pt-[clamp(1.5rem,4vh,3rem)] md:flex-row md:items-end md:justify-between">
            <p className="v6-lead max-w-[34ch]">
              Brand designer and art director. Identities for brands that need to be taken
              seriously.
            </p>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { t: "Work", h: "#work" },
                { t: "Services", h: "#services" },
                { t: "Pricing", h: "#pricing" },
                { t: "Contact", h: "#contact" },
              ].map((l) => (
                <a key={l.t} href={l.h} className="v6-body">
                  {l.t}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ── ABERTURA: retrato em sangria + manifesto deslocado ───────────
          A foto vem antes do texto e sangra pela direita. O manifesto entra
          deslocado, ocupando pouco mais de meia largura — assimetria de spread,
          não bloco centralizado. */}
      <section className="v6-margin pb-[clamp(4rem,12vh,10rem)]">
        <figure className="v6-bleed-right">
          <div className="w-full overflow-hidden" style={{ aspectRatio: "1600 / 850" }}>
            <img
              src={portrait1600}
              srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
              sizes="100vw"
              alt="Mateus Bredoff"
              width={1600}
              height={850}
              draggable={false}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 18%" }}
            />
          </div>
          <figcaption className="v6-caption v6-quiet pt-3">
            Portrait — São Paulo, 2026
          </figcaption>
        </figure>

        <div className="v6-offset-c pt-[clamp(3rem,10vh,8rem)]">
          <p className="v6-display v6-h2">
            I build identities that
            <br />
            hold together without me
            <br />
            in the room.
          </p>
          <p className="v6-body v6-quiet max-w-[46ch] pt-[clamp(1.5rem,4vh,2.5rem)]">
            Every project starts with the business, the audience and the competition on the table —
            then the concept, then the system, then the files the team needs to keep it consistent.
          </p>
        </div>
      </section>

      {/* ── TRABALHO ────────────────────────────────────────────────────
          Índice em caixa mista, escala grande, com a peça do projeto ativo
          sangrando à direita. Sem numeração de tabela e sem fio: o que separa
          um item do outro é o ar entre eles. */}
      <section id="work" className="v6-margin pb-[clamp(4rem,12vh,10rem)]">
        <h2 className="v6-display v6-h3 pb-[clamp(2rem,6vh,4rem)]">Selected work</h2>

        <div className="grid grid-cols-1 gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <ul>
            {WORK.map((w, i) => (
              <li key={w.slug}>
                <Link
                  to={`/work/${w.slug}`}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  className="block py-[clamp(0.5rem,1.4vh,1rem)]"
                >
                  <span
                    className="v6-display v6-h3 block transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{
                      opacity: i === ativo ? 1 : 0.42,
                      transform: i === ativo ? "translateX(0.06em)" : "none",
                    }}
                  >
                    {w.title}
                  </span>
                  <span className="v6-caption v6-quiet">
                    {`${w.disciplines.join(" · ")} — ${w.year}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* A peça do item ativo. Proporção FIXA para o bloco não pular ao
              trocar de projeto — as artes vão de 16:9 a retrato. */}
          <figure className="v6-bleed-right hidden md:block">
            <div className="w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
              <img
                key={destaque.slug}
                src={destaque.cover.src}
                srcSet={
                  destaque.cover.src2x
                    ? `${destaque.cover.src} 1400w, ${destaque.cover.src2x} 2200w`
                    : undefined
                }
                sizes="50vw"
                alt={destaque.cover.alt}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="v6-caption v6-quiet pt-3">{destaque.title}</figcaption>
          </figure>
        </div>
      </section>

      {/* ── SERVIÇOS ────────────────────────────────────────────────────
          Quatro serviços em duas colunas largas, cada um com uma frase que diz
          o que ele resolve. Sem tag, sem lista de entregáveis: em editorial,
          uma frase bem escrita vale mais que oito rótulos. */}
      <section id="services" className="v6-ink">
        <div className="v6-margin py-[clamp(4rem,12vh,10rem)]">
          <h2 className="v6-display v6-h3 pb-[clamp(2rem,6vh,4rem)]">What I do</h2>

          <div className="grid grid-cols-1 gap-x-[clamp(2rem,6vw,6rem)] gap-y-[clamp(2rem,5vh,3.5rem)] md:grid-cols-2">
            {SERVICOS.map((s) => (
              <div key={s.nome}>
                <h3 className="v6-display v6-h3">{s.nome}</h3>
                <p className="v6-body v6-quiet max-w-[38ch] pt-3">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇO ───────────────────────────────────────────────────────
          Sem card, sem tabela, sem escada: três linhas de texto. O valor entra
          na mesma frase, como em página de galeria — e o "on request" deixa de
          parecer lacuna porque a frase continua. */}
      <section id="pricing" className="v6-margin py-[clamp(4rem,12vh,10rem)]">
        <h2 className="v6-display v6-h3 pb-[clamp(2rem,6vh,4rem)]">Engagements</h2>

        <div className="v6-offset-d flex flex-col gap-[clamp(1.5rem,4vh,3rem)]">
          <p className="v6-lead">
            <span className="v6-accent">Essential</span> — the core of an identity, built to stand on
            its own. Three weeks, from US$ 2,500.
          </p>
          <p className="v6-lead">
            <span className="v6-accent">Complete</span> — the identity applied to the places it
            actually lives: stationery, social, applications. Five weeks.
          </p>
          <p className="v6-lead">
            <span className="v6-accent">Brand system</span> — strategy, naming and verbal identity
            included, for brands that need to be reproduced by other people. Eight weeks.
          </p>
          <p className="v6-body v6-quiet max-w-[42ch]">
            Custom scope and retainer on request. Remote, worldwide.
          </p>
        </div>
      </section>

      {/* ── CONTATO ─────────────────────────────────────────────────────
          O fecho é uma capa de verso: o convite em corpo de capa e os canais
          como linha de crédito. Sem tabela de links numerados. */}
      <section id="contact" className="v6-ink">
        <div className="v6-margin flex min-h-[70vh] flex-col justify-between py-[clamp(3rem,8vh,6rem)]">
          <div>
            <p className="v6-caption v6-quiet pb-[clamp(1rem,3vh,2rem)]">Available for work</p>
            <a href="mailto:hello@mateusbredoff.com" className="v6-display v6-h2 block">
              Let&rsquo;s talk
            </a>
          </div>

          <div className="flex flex-col gap-4 pt-[clamp(2rem,6vh,4rem)] md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { t: "hello@mateusbredoff.com", h: "mailto:hello@mateusbredoff.com" },
                { t: "Behance", h: "https://www.behance.net/mateusbredoff" },
                { t: "Instagram", h: "https://www.instagram.com/sir.bredoff/" },
              ].map((l) => (
                <a key={l.t} href={l.h} className="v6-body" target="_blank" rel="noopener noreferrer">
                  {l.t}
                </a>
              ))}
            </div>
            <span className="v6-caption v6-quiet">© 2026 Mateus Bredoff</span>
          </div>
        </div>
      </section>
    </div>
  );
}
