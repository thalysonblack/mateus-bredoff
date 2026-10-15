import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { INSTAGRAM } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/rolin-c.css";

/**
 * ONE PAGE — "ROLIN C" (15/10). Topo idêntico ao da Rolin (nome | disciplina, 11px caixa alta).
 * O resto muda: topo NÃO é fixo (nada passa por cima de imagem), sem fio e sem pílula;
 * os trabalhos são um catálogo escalonado na grade de 4 — cada peça ocupa 2 colunas,
 * alternando o lado, com a legenda FORA da imagem, embaixo. Celular: pilha de uma coluna.
 */
const nome = (t: string) => t.replace("®", "").trim();
const ANOS = `’${String(Math.min(...WORK.map((w) => w.year))).slice(2)} — ’${String(Math.max(...WORK.map((w) => w.year))).slice(2)}`;

export default function RolinC() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    let vivo = true;
    /* o App mata os ScrollTriggers no effect da rota: nascer dois frames depois das fontes */
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".rc-quadro").forEach((q) => {
          gsap.fromTo(q, { clipPath: "inset(14% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
          gsap.fromTo(q.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
        });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  return (
    <div ref={raiz} className="rc">
      <div className="rc-palco">
        <aside className="rc-lado">
          <div className="rc-lado-topo">
            <Link to="/v2/rolin-c">Mateus Bredoff</Link>
            <span>Brand design /<br />art direction</span>
          </div>
          <div id="rc-work" className="rc-lado-topo rc-lado-abre">
            <p>Selected work</p>
            <p className="rc-quieto">{ANOS}</p>
          </div>
        </aside>

        <ol className="rc-lista">
          {WORK.map((w, i) => (
            <li key={w.slug} className="rc-peca">
              <Link to={`/work/${w.slug}`}>
                <span className="rc-quadro" style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}>
                  <img src={w.cover.src} srcSet={w.cover.src2x ? `${w.cover.src} 1x, ${w.cover.src2x} 2x` : undefined}
                    width={w.cover.w} height={w.cover.h}
                    alt={w.cover.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" draggable={false} />
                </span>
                <span className="rc-legenda">
                  <span className="rc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{nome(w.title)}</span>
                  <span className="rc-quieto">{w.disciplines.join(", ")}</span>
                  <span className="rc-quieto rc-ano">{w.year}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <aside className="rc-dir">
          <nav className="rc-nav" aria-label="Seções">
            <a href="#rc-work">Work</a>
            <a href="#rc-info">Info</a>
          </nav>
          <p className="rc-quieto rc-conta">{String(WORK.length).padStart(2, "0")} projects</p>
        </aside>
      </div>

      <section id="rc-info" className="rc-grade rc-info">
        <p>Info</p>
        <p className="rc-bio">{LEAD[0]}</p>
        <div className="rc-col">
          <p className="rc-quieto">Services</p>
          {SERVICOS.map((s) => <p key={s.nome}>{s.nome}</p>)}
        </div>
        <div className="rc-col">
          <p className="rc-quieto">Contact</p>
          <a href="mailto:hello@mateusbredoff.com">hello@mateusbredoff.com</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.behance.net/mateusbredoff" target="_blank" rel="noopener noreferrer">Behance</a>
        </div>
      </section>
    </div>
  );
}
