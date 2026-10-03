import { useEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { PECAS } from "../../content/pecas";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";

/**
 * O RESTO DA HOME "O ESTUDO" — contenção, no duotom da série.
 *
 * A lição do "não curti" no Espaço: oito capas de estilos diferentes, lado a
 * lado e em cor, fazem ruído; e scroll coreografado em toda seção vira
 * catálogo de truque. Aqui: as peças em DUOTOM petróleo (o tom da escultura)
 * que ganham a cor própria só no hover — a coleção lê como um conjunto, e a
 * peça se revela quando é escolhida. Uma grade, um tamanho de corpo, rótulos
 * em mono. O movimento fica todo na hero.
 */
export function EstudoSecoes() {
  const [comSom, setComSom] = useState(false);
  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 5);

  return (
    <>
      {/* ─ TRABALHO ─────────────────────────────────────────────────────── */}
      <section className="p-est-sec p-est-escuro p-est-trabalho">
        <header className="p-est-cab">
          <p className="p-est-rot">Selected work — {String(WORK.length).padStart(2, "0")}</p>
          <Link to="/work" className="p-est-rot p-est-link">
            All work →
          </Link>
        </header>
        <ul className="p-est-obras">
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <Link to={`/work/${w.slug}`} className="p-est-obra">
                <span className="p-est-duo">
                  <img src={PECAS[w.slug][0]} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                </span>
                <span className="p-est-obra-ficha">
                  <span className="p-est-rot">{String(i + 1).padStart(2, "0")}</span>
                  <span className="p-est-obra-nome">{w.title}</span>
                  <span className="p-est-rot">{w.disciplines[0]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─ SOBRE ────────────────────────────────────────────────────────── */}
      <section className="p-est-sec p-est-claro p-est-sobre">
        <figure className="p-est-duo p-est-retrato">
          <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
        </figure>
        <div className="p-est-sobre-texto">
          <p className="p-est-rot">About</p>
          <p className="p-est-declara">{LEAD[0]}</p>
          <ul className="p-est-servicos">
            {SERVICOS.map((s, i) => (
              <li key={s.nome}>
                <span className="p-est-rot">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.nome}</span>
                <span className="p-est-quieto">{s.entrega}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─ SHOWREEL ─────────────────────────────────────────────────────── */}
      {REEL.video ? (
        <section className="p-est-sec p-est-escuro p-est-reel">
          <header className="p-est-cab">
            <p className="p-est-rot">Showreel — {REEL.ano}</p>
            <button type="button" className="p-est-rot p-est-link" onClick={() => setComSom(true)}>
              Play with sound →
            </button>
          </header>
          <button type="button" className="p-est-reel-quadro" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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

      {/* ─ PUBLICADO ────────────────────────────────────────────────────── */}
      <section className="p-est-sec p-est-claro p-est-pub">
        <p className="p-est-rot">Published in</p>
        <ul>
          {publicados.map((r) => (
            <li key={`${r.veiculo}-${r.projeto}`}>
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-est-link">
                  {r.veiculo}
                </a>
              ) : (
                <span>{r.veiculo}</span>
              )}
              <span className="p-est-quieto">
                {r.projeto}, {r.ano}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─ FIM ──────────────────────────────────────────────────────────── */}
      <section className="p-est-sec p-est-escuro p-est-fim">
        <div className="p-est-cab">
          <a href="mailto:hello@mateusbredoff.com" className="p-est-rot p-est-link">
            hello@mateusbredoff.com
          </a>
          <span className="p-est-rot">Brazil — working worldwide</span>
        </div>
        <p className="p-est-fim-nome">Mateus Bredoff</p>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </>
  );
}
