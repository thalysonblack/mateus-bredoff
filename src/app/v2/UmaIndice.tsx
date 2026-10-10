import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import "../../styles/uma-indice.css";

/**
 * ONE PAGE — "O ÍNDICE" (10/10, rota /v2/uma-indice).
 *
 * A tipografia é a arquitetura; a imagem só aparece quando pedida. Papel claro,
 * uma grade só (a da casa: rótulo em `--p-grade-col1`, conteúdo no resto).
 *   1 HERO       o nome e, logo abaixo, os projetos como LINHAS — é aqui que se
 *                escolhe o trabalho. No hover, a capa abre numa janela pequena
 *                que segue o cursor. Sem hover (toque), a linha leva a miniatura.
 *   2 SOBRE      a declaração em display; retrato pequeno + corpo.
 *   3 OFÍCIO     as especialidades como índice numerado.
 *   4 SHOWREEL   numa janela da grade, não em tela cheia; clique = com som.
 *   5 PUBLICADO  tabela tipográfica.
 * O contato é o rodapé completo da Prancha ("Let's talk" em display).
 * Recusa: espetáculo de imagem, tela cheia, escuro.
 */
export default function UmaIndice() {
  useMetaRota();
  const [sob, setSob] = useState<number | null>(null);
  const [comSom, setComSom] = useState(false);
  const janela = useRef<HTMLDivElement | null>(null);

  /* a janela segue o cursor por transform direto — sem re-render a cada pixel */
  useEffect(() => {
    const mover = (e: PointerEvent) => {
      const el = janela.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      /* perto da borda direita a janela troca de lado, para não sair da tela */
      el.classList.toggle("is-esq", e.clientX > window.innerWidth * 0.7);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      {/* ─ 1 · HERO: o nome e o índice do trabalho ─────────────────────────── */}
      <section className="ix-hero">
        <h1 className="ix-nome">Mateus Bredoff</h1>
        <div className="ix-grade ix-oficio">
          <p className="p-rotulo">Selected work — {String(WORK.length).padStart(2, "0")}</p>
          <p className="p-corpo">Brand designer &amp; art director. Based in Brazil, working worldwide.</p>
        </div>

        <ol className={`ix-lista${sob != null ? " ix-lista--sob" : ""}`} onPointerLeave={() => setSob(null)}>
          {WORK.map((w, i) => (
            <li key={w.slug} className={sob === i ? "is-sob" : undefined}>
              <Link to={`/work/${w.slug}`} className="ix-linha" onPointerEnter={() => setSob(i)} onFocus={() => setSob(i)} onBlur={() => setSob(null)}>
                <span className="p-marca ix-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ix-titulo">{w.title.replace("®", "").trim()}</span>
                <span className="p-marca ix-disc">{w.disciplines.slice(0, 2).join(" · ")}</span>
                <span className="p-marca ix-ano">{w.year}</span>
                <img className="ix-mini" src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* janela do hover: todas as capas empilhadas, só a da linha acesa aparece */}
      <div ref={janela} className={`ix-janela${sob != null ? " is-on" : ""}`} aria-hidden="true">
        <div className="ix-janela-moldura">
          {WORK.map((w, i) => (
            <img key={w.slug} src={w.cover.src} alt="" className={sob === i ? "is-on" : undefined} decoding="async" draggable={false} />
          ))}
        </div>
      </div>

      {/* ─ 2 · SOBRE ───────────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">About</p>
        <div>
          <p className="ix-declaracao">{LEAD[0]}</p>
          <div className="ix-sobre-par">
            <figure className="ix-retrato">
              <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
            </figure>
            <p className="p-corpo ix-corpo">{LEAD[1]}</p>
          </div>
        </div>
      </section>

      {/* ─ 3 · OFÍCIO ──────────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">What I do</p>
        <ol className="ix-tabela">
          {SERVICOS.map((sv, i) => (
            <li key={sv.nome} className="ix-servico">
              <span className="p-marca ix-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ix-servico-nome">{sv.nome}</span>
              <span className="p-corpo ix-servico-entrega">{sv.entrega}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─ 4 · SHOWREEL ────────────────────────────────────────────────────── */}
      {REEL.video ? (
        <section className="ix-secao ix-grade">
          <div className="ix-reel-cab">
            <p className="p-rotulo">Showreel — {REEL.ano}</p>
            <button type="button" className="p-corpo p-link" onClick={() => setComSom(true)}>
              Play with sound
            </button>
          </div>
          <button type="button" className="ix-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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

      {/* ─ 5 · PUBLICADO ───────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">Published in</p>
        <ol className="ix-tabela">
          {publicados.map((r, i) => {
            const miolo = (
              <>
                <span className="p-marca ix-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ix-veiculo">{r.veiculo}</span>
                <span className="p-corpo ix-pub-proj">{r.projeto.replace("®", "").trim()}</span>
                <span className="p-marca ix-ano">{r.ano}</span>
              </>
            );
            return (
              <li key={`${r.veiculo}-${r.projeto}`}>
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="ix-pub">
                    {miolo}
                  </a>
                ) : (
                  <span className="ix-pub">{miolo}</span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
