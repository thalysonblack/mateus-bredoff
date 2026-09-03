import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../../styles/v5.css";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";

const EMAIL = "hello@mateusbredoff.com";

/**
 * V5 — "O PALCO". Direção autoral, sem referência de terceiro.
 *
 * Nasceu depois de quatro rodadas tentando fechar a distância para um site que
 * não é nosso. A conclusão que a sequência entregou: se a matéria que sempre
 * faltava era a do outro, o caminho é uma peça cuja matéria seja a DELE por
 * construção. O partido está no cabeçalho de `styles/v5.css`.
 *
 * A mecânica: um quadro `sticky` de uma tela, e um bloco de altura de tela por
 * projeto passando por baixo. O scroll não rola uma lista — troca a peça em
 * cena. O acento de cada tela é a cor amostrada da própria capa, então a paleta
 * do site é a paleta do trabalho dele.
 *
 * ⚠ Sem `pin` de ScrollTrigger: pin sequestra a rolagem e em portfólio lê como
 * travamento. `position: sticky` puro entrega a mesma cena com a página livre.
 */
export default function HomeV5() {
  useMetaRota();
  const [cena, setCena] = useState(0);
  const passos = useRef<(HTMLDivElement | null)[]>([]);

  /* qual peça está em cena: o passo que cruzar o meio da tela manda. A faixa
     central é estreita de propósito — com faixa larga duas peças disputam a
     cena no meio da transição e o nome pisca. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            const i = passos.current.indexOf(e.target as HTMLDivElement);
            if (i >= 0) setCena(i);
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    passos.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, []);

  const emCena = WORK[cena];
  const anos = WORK.map((w) => w.year);
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

  return (
    <div className="p5">
      <nav className="p5-nav">
        <Link to="/v5" className="p5-marca">
          Mateus Bredoff
        </Link>
        <a href="#palco">Work</a>
        <a href="#oficio">Practice</a>
        <a className="p5-nav-fim" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </nav>

      {/* ── abertura ────────────────────────────────────────────────────── */}
      <header className="p5-abre">
        <h1 className="p5-nome">
          Brand
          <br />
          designer
          <br />
          <em>&amp; art director</em>
        </h1>
        <div className="p5-abre-pe">
          <p className="p5-abre-frase">
            Visual identities built from strategy — made to hold up long after
            the launch.
          </p>
          <p className="p5-meta">
            {WORK.length} projects · {Math.min(...anos)}–{Math.max(...anos)} ·
            Brazil, working globally
          </p>
        </div>
      </header>

      {/* ── o palco ─────────────────────────────────────────────────────── */}
      <section className="p5-palco" id="palco" aria-label="Selected work">
        <div className="p5-quadro">
          {WORK.map((w, i) => (
            <div className={i === cena ? "p5-cena p5-cena-viva" : "p5-cena"} key={w.slug}>
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="100vw"
                alt={i === 0 ? w.cover.alt : ""}
                aria-hidden={i === 0 ? undefined : true}
                width={w.cover.w}
                height={w.cover.h}
                fetchpriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? undefined : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}

          <p className="p5-meta p5-conta">
            {String(cena + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
          </p>

          <div className="p5-cena-nome">
            <h2
              className="p5-cena-titulo"
              style={{ ["--p5-cor" as string]: CORES[emCena.slug]?.tinta }}
            >
              {emCena.title}
            </h2>
            <p className="p5-meta p5-cena-ficha">
              <span className="p5-meta-vivo">{emCena.disciplines.join(", ")}</span>
              <span>{emCena.year}</span>
            </p>
          </div>
        </div>

        {/* os gatilhos — um por peça, cada um com altura de tela. Ficam ATRÁS
            do quadro sticky e recebem o link: a cena inteira é clicável. */}
        {WORK.map((w, i) => (
          <div
            key={w.slug}
            className="p5-passo"
            ref={(el) => {
              passos.current[i] = el;
            }}
          >
            <Link
              to={`/v5/work/${w.slug}`}
              style={{ display: "block", height: "100%" }}
              aria-label={`${w.title} — ${w.disciplines.join(", ")}`}
            />
          </div>
        ))}
      </section>

      {/* ── o ofício ────────────────────────────────────────────────────── */}
      <section className="p5-bloco" id="oficio" aria-labelledby="p5-of">
        <h2 id="p5-of" className="p5-manchete" style={{ paddingBottom: "clamp(44px,6vw,88px)" }}>
          Four ways a brand gets built.
        </h2>
        {SERVICOS.map((s, k) => (
          <div className="p5-linha" key={s.nome}>
            <span className="p5-meta">{String(k + 1).padStart(2, "0")}</span>
            <span className="p5-linha-nome">{s.nome}</span>
            <span className="p5-linha-corpo">{s.entrega}</span>
          </div>
        ))}
      </section>

      {/* ── a prova ─────────────────────────────────────────────────────── */}
      <section className="p5-bloco" aria-labelledby="p5-pub" style={{ paddingTop: 0 }}>
        <h2 id="p5-pub" className="p5-meta" style={{ paddingBottom: "clamp(24px,3vw,40px)" }}>
          Published in
        </h2>
        <p className="p5-manchete" style={{ maxWidth: "30ch" }}>
          {veiculos.join(" · ")}
        </p>
      </section>

      {/* ── o fecho ─────────────────────────────────────────────────────── */}
      <footer className="p5-fecho">
        <p className="p5-convite">Got a brand worth building?</p>
        <p>
          <a href={`mailto:${EMAIL}`} className="p5-manchete">
            {EMAIL}
          </a>
        </p>
        <div className="p5-fecho-regua p5-meta">
          <span>Mateus Bredoff — Brand designer &amp; art director</span>
          <span>Available for projects</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
