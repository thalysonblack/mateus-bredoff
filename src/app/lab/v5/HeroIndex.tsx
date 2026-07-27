import { useState } from "react";
import { Link } from "react-router";
import { Mono, Bracket } from "../../system";
import { WORK } from "../../../content/work";
import Menu from "../../sections/Menu";

/**
 * Hero-índice — a home abre pelo TRABALHO, não pela apresentação.
 *
 * A tela inicial é a lista dos projetos em tipografia grande. Ao percorrer um
 * nome, a arte daquele projeto toma a tela inteira por trás do texto. Em vez de
 * "quem eu sou" seguido de "o que eu fiz", a primeira coisa que aparece é a
 * obra — e o nome do autor fica onde deve ficar, na barra de metadados.
 *
 * É a inversão que um portfólio de designer visual pede: quem chega quer ver
 * trabalho. E resolve num só gesto o que a página tentava resolver em dois
 * lugares (a faixa de artes que duplicava o índice, e o índice em si).
 *
 * ⚠ CONTRASTE SOBRE IMAGEM — medido no PIOR caso, não estimado. As artes vão de
 * fundo creme a preto, então nenhuma cor fixa serve; a saída é véu escuro
 * constante mais texto no off-white do sistema.
 *
 * O véu começou em 0.62 e REPROVAVA: contra a arte mais clara do acervo (o creme
 * #e9e6df do Stag) o texto media 4,10:1 e o nome inativo 1,97:1. Com véu 0.78 e
 * inativo a 70% de opacidade: 6,61:1 no ativo, 4,17:1 no inativo e 4,55:1 no
 * mono. Afinar o véu para "ver melhor a arte" derruba isso na hora — a conta é
 * `mix(petróleo, arte_mais_clara, opacidade_do_véu)` e depois o contraste do
 * texto contra o resultado.
 *
 * ⚠ O nome inativo NÃO usa `--dim` sobre a imagem: ali o `--dim` foi medido
 * contra o papel/tinta, não contra foto. Usa off-white com opacidade, que
 * degrada de forma previsível sobre qualquer fundo.
 */
export default function HeroIndex() {
  const [ativo, setAtivo] = useState(0);
  const item = WORK[ativo];

  return (
    <section className="on-ink relative flex h-[100dvh] min-h-[34rem] w-full flex-col overflow-clip">
      {/* Camada 1 — a arte do projeto percorrido, preenchendo a tela */}
      <img
        key={item.slug}
        src={item.cover.src}
        srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Camada 2 — véu constante. É o que garante a legibilidade em todas as
          artes, e não um efeito: sem ele o texto some sobre o Stag e o Votare. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "rgba(19,39,45,0.78)" }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <Menu />

        <div className="bleed flex flex-1 flex-col justify-center py-[clamp(1.5rem,4vh,3rem)]">
          {/* O índice. Cada linha é um projeto; o hover troca a arte de fundo. */}
          <ul>
            {WORK.map((w, i) => {
              const on = i === ativo;
              return (
                <li key={w.slug}>
                  <Link
                    to={`/work/${w.slug}`}
                    onMouseEnter={() => setAtivo(i)}
                    onFocus={() => setAtivo(i)}
                    className="flex items-baseline justify-between gap-6 py-[clamp(0.2rem,0.8vh,0.6rem)]"
                  >
                    <span className="flex items-baseline gap-[clamp(0.75rem,2vw,2rem)]">
                      <Mono style={{ color: "#ede6e1", opacity: on ? 1 : 0.75 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Mono>
                      <span
                        className="t-display t-display-xl transition-[opacity,transform] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                        style={{
                          fontSize: "clamp(1.9rem,6.4vw,104px)",
                          color: "#ede6e1",
                          opacity: on ? 1 : 0.7,
                          transform: on ? "translateX(0.12em)" : "none",
                        }}
                      >
                        {w.title}
                      </span>
                    </span>

                    <span className="hidden shrink-0 sm:block" style={{ color: "#ede6e1", opacity: on ? 0.95 : 0.72 }}>
                      <Mono>{`${w.disciplines[0]} · ${w.year}`}</Mono>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pé: quem faz, e a ação. O autor entra depois da obra. */}
        <div className="bleed flex flex-col gap-3 pb-[clamp(1rem,3vh,2rem)] md:flex-row md:items-end md:justify-between">
          <p className="t-body max-w-[38ch]" style={{ color: "#ede6e1", opacity: 0.86 }}>
            Mateus Bredoff — brand designer and art director, from Brazil, worldwide.
          </p>
          <a href="#contact" className="shrink-0" style={{ color: "#ede6e1" }}>
            <Bracket>START A PROJECT</Bracket>
          </a>
        </div>
      </div>
    </section>
  );
}
