import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import HomeFundo from "../v2/HomeFundo";
import "../../styles/orchard-b.css";

/**
 * VERSÃO B — editorial/índice (15/10/2026, branch `versao-orchard`).
 * HomeFundo intacta. Abaixo: papel, trabalhos como índice tipográfico de
 * linhas finas (nome 64); no desktop a capa flutua junto ao cursor.
 */
const FRASE =
  "Collaborating with companies that understand the value of building a clear, relevant, and memorable presence.";
const RECON = [
  { rotulo: "Featured", nome: "Behance" },
  { rotulo: "Published", nome: "Abduzeedo" },
  { rotulo: "Published ×3", nome: "World Brand Design" },
];
const EMAIL = "hello@mateusbredoff.com";
const pad = (n: number) => String(n).padStart(2, "0");
const HOVER = "(hover: hover) and (pointer: fine) and (min-width: 64rem)";

export default function HomeOrchardB() {
  const capa = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia(HOVER).matches) return;
    const el = capa.current!;
    const reduz = prefersReducedMotion();
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const mover = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    // ponytail: rAF próprio só para o cursor (não lê scroll, não briga com o Lenis)
    const tick = () => {
      cx += (x - cx) * (reduz ? 1 : 0.18); cy += (y - cy) * (reduz ? 1 : 0.18);
      el.style.transform = `translate3d(${cx + 24}px, ${cy - 120}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", mover);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", mover); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <HomeFundo />
      <div className="b-raiz">
        <section className="b-manifesto" aria-label="About">
          <p className="b-14 b-cinza">(About)</p>
          <p className="b-14 b-colunas">
            {FRASE} Brand designer based in Brazil, working worldwide — identity systems,
            visual languages and the details that make a brand recognisable at a glance.
          </p>
        </section>

        <section className="b-indice" aria-label="Selected work" onPointerLeave={() => setAtivo(null)}>
          <div className="b-cab b-14 b-cinza"><span>(Index)</span><span>Discipline</span><span>Year</span></div>
          {WORK.map((w, i) => (
            <Link key={w.slug} to={`/work/${w.slug}`} className="b-linha" data-ativa={ativo === i || undefined}
              onPointerEnter={() => setAtivo(i)} onFocus={() => setAtivo(i)} onBlur={() => setAtivo(null)}>
              <span className="b-14 b-mono b-cinza">{pad(i + 1)}</span>
              <span className="b-64 b-nome">{w.title}</span>
              <span className="b-14 b-cinza">{w.disciplines.join(", ")}</span>
              <span className="b-14 b-cinza">{w.year}</span>
              <img className="b-miniatura" src={w.cover.src} alt="" loading="lazy" decoding="async" />
            </Link>
          ))}
        </section>

        <div ref={capa} className="b-capa" aria-hidden="true" data-visivel={ativo !== null || undefined}>
          {WORK.map((w, i) => (
            <img key={w.slug} src={w.cover.src} alt="" loading="lazy" decoding="async" data-on={ativo === i || undefined} />
          ))}
        </div>

        <section className="b-recon" aria-label="Recognition">
          <p className="b-14 b-cinza">(Recognition)</p>
          <ul>
            {RECON.map((r) => (
              <li key={r.nome} className="b-14"><span>{r.nome}</span><span className="b-cinza">{r.rotulo}</span></li>
            ))}
          </ul>
        </section>

        <footer className="b-rodape">
          <p className="b-14 b-cinza">(Contact)</p>
          <a className="b-64 b-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <div className="b-pe b-14 b-cinza">
            <Link to="/work">Work</Link><Link to="/about">About</Link>
            <span>Brazil, working worldwide</span><span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
