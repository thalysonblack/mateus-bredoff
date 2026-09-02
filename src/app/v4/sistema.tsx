import { Link, NavLink } from "react-router";
import type { ReactNode } from "react";
import "../../styles/v4.css";
import { INSTAGRAM } from "../../content/lab";
import { WORK } from "../../content/work";
import { useCraft } from "../../hooks/useCraft";

/**
 * O SISTEMA DA V4 — "O ÍNDICE".
 *
 * Duas primitivas e nada mais: o QUADRO (nav fixa + rodapé) e o marquee. O
 * partido é de subtração — a página é uma folha branca com uma voz alta e uma
 * voz miúda, e cada componente novo que entra aqui tira força do trabalho.
 * O partido e o que foi medido na referência estão em `styles/v4.css`.
 */

export const EMAIL = "hello@mateusbredoff.com";
export const BEHANCE = "https://www.behance.net/mateusbredoff";

/**
 * A nav em `mix-blend-mode: exclusion` — a mecânica da referência.
 *
 * ⚠ Blend não atravessa stacking context: qualquer ancestral com `transform`,
 * `filter` ou `opacity` mata a inversão em silêncio. Por isso ela é filha
 * direta do quadro, e o quadro não anima.
 */
function Nav() {
  return (
    <nav className="q-nav q-meta">
      <Link to="/v4" className="q-meta-ink">
        Mateus Bredoff
      </Link>
      <span className="q-nav-links">
        <NavLink to="/v4/work">Work</NavLink>
        <NavLink to="/v4/about">About</NavLink>
        <NavLink to="/v4/lab">Lab</NavLink>
      </span>
      <a className="q-nav-fim" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
    </nav>
  );
}

/**
 * O rodapé é a única troca de superfície do site.
 *
 * A referência fecha em 1.056px com o convite em corpo de cartaz e quatro
 * colunas de link. A anatomia é essa; o que ela afirma é daqui — o índice do
 * acervo real, os canais dele, e o convite escrito para este site.
 */
function Rodape() {
  return (
    <footer className="q-rodape">
      <p className="q-display" style={{ maxWidth: "16ch" }}>
        Building something
        <br />
        that deserves to be seen?
      </p>
      <p style={{ paddingTop: "clamp(28px,3vw,44px)" }}>
        <a href={`mailto:${EMAIL}`} className="q-display-md">
          {EMAIL}
        </a>
      </p>

      <div className="q-rodape-cols q-meta">
        <div className="q-rodape-col">
          <p className="q-meta" style={{ paddingBottom: 12, opacity: 0.5 }}>
            Index
          </p>
          <Link to="/v4/work">Work</Link>
          <Link to="/v4/about">About</Link>
          <Link to="/v4/lab">Lab</Link>
        </div>
        <div className="q-rodape-col">
          <p className="q-meta" style={{ paddingBottom: 12, opacity: 0.5 }}>
            Selected work
          </p>
          {WORK.slice(0, 4).map((w) => (
            <Link key={w.slug} to={`/v4/work/${w.slug}`}>
              {w.title}
            </Link>
          ))}
        </div>
        <div className="q-rodape-col">
          <p className="q-meta" style={{ paddingBottom: 12, opacity: 0.5 }}>
            Elsewhere
          </p>
          <a href={BEHANCE} target="_blank" rel="noreferrer">
            Behance
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </div>
        <div className="q-rodape-col">
          <p className="q-meta" style={{ paddingBottom: 12, opacity: 0.5 }}>
            Studio
          </p>
          <span style={{ display: "block", padding: "3px 0", opacity: 0.72 }}>
            Brazil, working globally
          </span>
          <span style={{ display: "block", padding: "3px 0", opacity: 0.72 }}>
            Available for projects
          </span>
          <span style={{ display: "block", padding: "3px 0", opacity: 0.72 }}>
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Quadro({ children }: { children: ReactNode }) {
  /* ⚠ Por PÁGINA, nunca no Layout — o `RouteLifecycle` mata todos os
     ScrollTriggers a cada navegação, e o Layout não remonta para religá-los.
     O Quadro é filho de cada rota, então monta de novo a cada troca: aqui é o
     lugar certo, e é um lugar só para as cinco páginas. */
  const raiz = useCraft<HTMLDivElement>();
  return (
    <div className="q-tela" ref={raiz}>
      <Nav />
      <main>{children}</main>
      <Rodape />
    </div>
  );
}

/**
 * O MARQUEE — a fita do playground.
 *
 * ⚠ A fita é duplicada e a animação corre até `-50%`: é o que faz o laço
 * fechar sem salto. Meia volta em qualquer outra medida deixa um buraco no
 * ponto de emenda, e o buraco só aparece 40 segundos depois — tarde demais
 * para quem está olhando o layout.
 */
export function Marquee({ itens }: { itens: { texto: string; nota: string }[] }) {
  const fita = [...itens, ...itens];
  return (
    <div className="q-marquee">
      <div className="q-marquee-fita" aria-hidden="true">
        {fita.map((it, i) => (
          <span className="q-marquee-item" key={i}>
            <span>{it.texto}</span>
            <span className="q-meta">{it.nota}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">
        {itens.map((i) => `${i.texto} — ${i.nota}`).join(". ")}
      </span>
    </div>
  );
}
