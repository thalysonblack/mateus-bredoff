import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { PECAS } from "../../content/pecas";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import "../../styles/uma-revista.css";

/**
 * HOME — ONE PAGE "A REVISTA" (10/10).
 *
 * A página se lê como um spread de revista de design, em branco/papel:
 *   1 CAPA      o nome sangrando em escala extrema; uma peça atravessa o nome
 *   2 SELEÇÃO   mosaico assimétrico dentro da grade de 12 (tamanhos e proporções
 *               diferentes, legenda mono embaixo) — não uma fita de cards iguais
 *   3 SOBRE     retrato grande + pull-quote; sumário das especialidades
 *   4 MATÉRIA   o showreel como matéria, em tinta (valor, não matiz)
 *   5 COLOFÃO   onde foi publicado, como notas
 * Recusa: o escuro tech, a simetria, cards iguais.
 */

/* posição de cada peça na grade de 12: [coluna inicial, span, proporção, alinhamento].
   Os pares de cada linha têm alturas parecidas ou se alinham pela BASE — deslocar
   por vh abria buracos de meia tela entre as linhas. */
const MOSAICO: Record<string, [number, number, string, "start" | "end"]> = {
  ginga: [1, 7, "4 / 3", "start"],
  "alex-archer": [9, 4, "4 / 5", "end"],
  bureau: [2, 7, "16 / 9", "start"],
  neox: [10, 3, "3 / 4", "start"],
  trivo: [1, 4, "4 / 5", "end"],
  stag: [6, 6, "1 / 1", "start"],
  ferraci: [2, 4, "1 / 1", "end"],
  votare: [7, 6, "3 / 2", "end"],
};

const semMarca = (t: string) => t.replace("®", "").trim();

export default function UmaRevista() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement>(null);
  const [comSom, setComSom] = useState(false);

  /* reveal: o fio de 1px desenha e a peça assenta — uma vez só */
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("rv-in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -12% 0px" },
    );
    /* o oculto só vale com JS vivo: sem bundle, o texto continua legível */
    el.dataset.pronto = "";
    el.querySelectorAll(".rv-sobe").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  const capa = WORK.find((w) => w.slug === "ginga") ?? WORK[0];
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  return (
    <Prancha n="01" nome="Index" superficie="branco" status="Available for projects" rodape="completo">
      <div ref={raiz} className="rv">
        {/* ─ 1 · CAPA ─────────────────────────────────────────────────────── */}
        <section className="rv-capa">
          <p className="p-marca rv-capa-oficio">Brand designer &amp; art director</p>
          <p className="p-marca rv-capa-local">Brazil — working worldwide</p>
          <h1 className="rv-nome">
            <span>Mateus</span>
            <span>Bredoff</span>
          </h1>
          <Link to={`/work/${capa.slug}`} className="rv-capa-peca" aria-label={capa.title}>
            <img src={capa.cover.src2x ?? capa.cover.src} alt={capa.cover.alt} decoding="async" draggable={false} />
          </Link>
        </section>

        {/* ─ 2 · SELEÇÃO ──────────────────────────────────────────────────── */}
        <section className="rv-secao rv-selecao">
          <header className="rv-cab rv-sobe">
            <p className="p-rotulo">Selected work</p>
            <p className="p-marca">{String(WORK.length).padStart(2, "0")} projects</p>
          </header>
          <ul className="rv-mosaico">
            {WORK.map((w, i) => {
              const [col, span, ar, alinha] = MOSAICO[w.slug] ?? [1, 6, "3 / 2", "start"];
              /* a capa já usou a capa deste projeto: aqui entra outra peça dele */
              const foto = w.slug === capa.slug ? PECAS[w.slug][0] : span > 5 && w.cover.src2x ? w.cover.src2x : w.cover.src;
              return (
                <li
                  key={w.slug}
                  className="rv-sobe"
                  style={{ gridColumn: `${col} / span ${span}`, alignSelf: alinha }}
                >
                  <Link to={`/work/${w.slug}`} className="rv-peca">
                    <span className="rv-peca-img" style={{ aspectRatio: ar }}>
                      <img src={foto} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                    </span>
                    <span className="rv-legenda">
                      <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                      <span className="rv-legenda-nome">{semMarca(w.title)}</span>
                      <span className="p-marca">{w.disciplines.join(", ")} — {w.year}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ─ 3 · SOBRE — retrato + pull-quote, em papel ───────────────────── */}
        <section className="rv-secao rv-papel rv-sobre">
          <figure className="rv-retrato rv-sobe">
            <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
            <figcaption className="p-marca">Mateus Bredoff, Brazil</figcaption>
          </figure>
          <div className="rv-sobre-texto">
            <p className="p-rotulo rv-sobe">About</p>
            <blockquote className="rv-citacao rv-sobe">{LEAD[0]}</blockquote>
            <p className="p-corpo rv-sobre-corpo rv-sobe">{LEAD[1]}</p>
          </div>
        </section>

        {/* ─ 3b · SUMÁRIO das especialidades ──────────────────────────────── */}
        <section className="rv-secao rv-papel rv-sumario">
          <header className="rv-cab rv-sobe">
            <p className="p-rotulo">Contents — What I do</p>
          </header>
          <ol>
            {SERVICOS.map((s, i) => (
              <li key={s.nome} className="rv-sobe">
                <span className="rv-sumario-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="rv-sumario-nome">{s.nome}</span>
                <span className="p-corpo rv-sumario-entrega">{s.entrega}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ─ 4 · MATÉRIA — o showreel ─────────────────────────────────────── */}
        {REEL.video ? (
          <section className="rv-secao rv-tinta rv-materia">
            <header className="rv-materia-cab rv-sobe">
              <p className="p-rotulo">Feature</p>
              <h2 className="rv-materia-titulo">Showreel {REEL.ano}</h2>
              <button type="button" className="p-corpo p-link rv-som" onClick={() => setComSom(true)}>
                Play with sound
              </button>
            </header>
            <button type="button" className="rv-materia-palco rv-sobe" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
              <video
                src={REEL.video}
                autoPlay
                muted
                loop
                playsInline
                poster={REEL.capa.src}
                ref={(el) => {
                  if (!el) return;
                  el.muted = true;
                  void el.play().catch(() => {});
                }}
              />
            </button>
          </section>
        ) : null}

        {/* ─ 5 · COLOFÃO — publicado em ───────────────────────────────────── */}
        <section className="rv-secao rv-colofao">
          <p className="p-rotulo rv-sobe">Published in</p>
          <ol className="rv-notas">
            {publicados.map((r, i) => (
              <li key={`${r.veiculo}-${r.projeto}`} className="rv-sobe">
                <sup className="p-marca">{i + 1}</sup>
                <span className="p-corpo">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link rv-veiculo">
                      {r.veiculo}
                    </a>
                  ) : (
                    <span className="rv-veiculo">{r.veiculo}</span>
                  )}
                  <span className="rv-nota-ficha"> — {semMarca(r.projeto)}, {r.ano}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
