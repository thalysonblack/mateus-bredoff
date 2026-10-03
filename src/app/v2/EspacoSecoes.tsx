import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { PECAS } from "../../content/pecas";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";

/**
 * O RESTO DA HOME NA LINGUAGEM DO FLORÉN (03/10, "era a página toda da home").
 *
 * Cada seção é ALTA, com o quadro em `sticky`, e o progresso do scroll dentro
 * dela vira a variável `--p` (0→1) no próprio nó — o CSS faz o movimento, sem
 * re-render do React. Mesma mecânica do palco das pranchas: o fluxo segura a
 * cena, o ScrollTrigger só lê.
 *
 *   JANELA     o showreel nasce numa janela pequena e abre até sangrar
 *   GESTO      o retrato + "Strategy first, then form." palavra a palavra
 *   SISTEMA    os serviços num trilho horizontal, uma peça por tela
 *   MANIFESTO  o método dele acende palavra a palavra
 *   FIM        o nome sobe letra a letra; o contato
 */
function useProgresso<T extends HTMLElement>(inicio = "top top", fim = "bottom bottom") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--p", "1");
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: inicio,
      end: fim,
      onUpdate: (s) => el.style.setProperty("--p", s.progress.toFixed(4)),
    });
    el.style.setProperty("--p", "0");
    return () => st.kill();
  }, [inicio, fim]);
  return ref;
}

const palavras = (t: string) => t.split(/\s+/).filter(Boolean);

export function EspacoSecoes() {
  const janela = useProgresso<HTMLElement>();
  const gesto = useProgresso<HTMLElement>();
  const sistema = useProgresso<HTMLElement>();
  const manifesto = useProgresso<HTMLElement>();
  const fim = useProgresso<HTMLElement>("top bottom", "bottom bottom");
  const [comSom, setComSom] = useState(false);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  const frase = ["Strategy", "first,", "then", "form."];
  const metodo = palavras(LEAD[1]);

  return (
    <>
      {/* ─ JANELA — o showreel abre até sangrar ───────────────────────────── */}
      <section ref={janela} className="p-flo p-flo-janela" aria-label="Showreel">
        <div className="p-flo-quadro">
          <p className="p-marca p-flo-cap p-flo-cap--e">04 / Showreel</p>
          <p className="p-marca p-flo-cap p-flo-cap--d">Fig. — {REEL.ano}, in motion</p>
          {REEL.video ? (
            <button type="button" className="p-flo-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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
          ) : null}
          <p className="p-flo-janela-linha">
            Play with sound <span aria-hidden="true">→</span>
          </p>
        </div>
      </section>

      {/* ─ GESTO — o retrato e a frase, palavra a palavra ─────────────────── */}
      <section ref={gesto} className="p-flo p-flo-gesto">
        <div className="p-flo-quadro">
          <figure className="p-flo-retrato">
            <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
          </figure>
          <div className="p-flo-gesto-texto">
            <p className="p-marca">05 / About</p>
            <h2 className="p-flo-frase" aria-label={frase.join(" ")}>
              {frase.map((w, i) => (
                <span key={w} className="p-flo-w" style={{ ["--i" as string]: i }} aria-hidden="true">
                  <span>{i === 3 ? <em>{w}</em> : w}</span>
                </span>
              ))}
            </h2>
            <p className="p-corpo p-flo-lede">{LEAD[0]}</p>
          </div>
        </div>
      </section>

      {/* ─ SISTEMA — os serviços num trilho horizontal ────────────────────── */}
      <section ref={sistema} className="p-flo p-flo-sistema" aria-label="What I do">
        <div className="p-flo-quadro">
          <p className="p-marca p-flo-cap p-flo-cap--e">06 / What I do</p>
          <div className="p-flo-trilho">
            {SERVICOS.map((sv, i) => {
              const w = WORK.find((x) => x.slug === sv.peca) ?? WORK[i];
              return (
                <Link key={sv.nome} to={`/work/${w.slug}`} className="p-flo-painel">
                  <span className="p-flo-painel-peca">
                    <img src={PECAS[w.slug][1] ?? PECAS[w.slug][0]} alt="" loading="lazy" decoding="async" draggable={false} />
                  </span>
                  <span className="p-flo-painel-texto">
                    <span className="p-marca">
                      {String(i + 1).padStart(2, "0")} / {String(SERVICOS.length).padStart(2, "0")} — {w.title.replace("®", "").trim()}
                    </span>
                    <span className="p-flo-painel-nome">{sv.nome}</span>
                    <span className="p-corpo">{sv.entrega}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─ MANIFESTO — o método acende palavra a palavra ──────────────────── */}
      <section ref={manifesto} className="p-flo p-flo-manifesto" style={{ ["--n" as string]: metodo.length }}>
        <div className="p-flo-quadro">
          <p className="p-marca p-flo-cap p-flo-cap--e">07 / Method</p>
          <p className="p-flo-manifesto-texto" aria-label={LEAD[1]}>
            {metodo.map((w, i) => (
              <span key={i} style={{ ["--i" as string]: i }} aria-hidden="true">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ─ FIM — o nome sobe letra a letra ────────────────────────────────── */}
      <section ref={fim} className="p-flo-fim">
        <div className="p-flo-fim-linha">
          <a href="mailto:hello@mateusbredoff.com" className="p-marca">hello@mateusbredoff.com</a>
          <Link to="/work" className="p-marca">All work →</Link>
          <span className="p-marca">Brazil — working worldwide</span>
        </div>
        <p className="p-flo-fim-nome" aria-label="Mateus Bredoff">
          {"Mateus Bredoff".split("").map((c, i) => (
            <span key={i} style={{ ["--i" as string]: i }} aria-hidden="true">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </>
  );
}
