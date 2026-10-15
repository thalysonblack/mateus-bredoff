import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { gsap } from "../../lib/gsap";
import { RC, nome, capa } from "./Moldura";

/**
 * LETREIRO (15/10, "esse sistema na V2 também"): o índice COMPLETO do trabalho em duas
 * faixas de nomes grandes, sentidos opostos (cinza / tinta). Hover: o nome acende na cor
 * do projeto e a capa flutua junto ao cursor (só desktop). Toque: o nome abre o case.
 * Movimento: CSS puro (translateX −50% numa fita duplicada); reduced-motion = parada,
 * rolável à mão.
 */
export function LetreiroV2({ atual }: { atual?: string } = {}) {
  const previa = useRef<HTMLImageElement | null>(null);
  const [sob, setSob] = useState<string | null>(null);

  useEffect(() => {
    const el = previa.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (min-width: 64rem)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const mover = (e: PointerEvent) => { x(e.clientX); y(e.clientY); };
    addEventListener("pointermove", mover, { passive: true });
    return () => removeEventListener("pointermove", mover);
  }, []);

  const alvo = sob ? WORK.find((w) => w.slug === sob) : null;
  /* no case: os OUTROS projetos, começando pelo próximo */
  const i = WORK.findIndex((w) => w.slug === atual);
  const outros = i < 0 ? WORK : [...WORK.slice(i + 1), ...WORK.slice(0, i)];
  const faixas = [outros, [...outros].reverse()];

  return (
    <section className="rc-letreiro" aria-label="Other projects" onPointerLeave={() => setSob(null)}>
      {faixas.map((lista, f) => (
        <div key={f} className={`rc-letreiro-faixa${f ? " rc-letreiro-faixa--volta" : ""}`}>
          <div className="rc-letreiro-fita">
            {[0, 1].map((copia) => (
              <span key={copia} className="rc-letreiro-copia" aria-hidden={copia ? true : undefined}>
                {lista.map((w) => (
                  <span key={w.slug} className="rc-letreiro-item">
                    <Link to={`${RC}/work/${w.slug}`} tabIndex={copia || f ? -1 : undefined}
                      className={sob === w.slug ? "is-sob" : undefined}
                      style={CORES[w.slug] ? ({ "--rc-cor": CORES[w.slug].papel } as React.CSSProperties) : undefined}
                      onPointerEnter={() => setSob(w.slug)} onFocus={() => setSob(w.slug)} onBlur={() => setSob(null)}>
                      {nome(w.title)}
                    </Link>
                    <span className="rc-letreiro-ponto" aria-hidden="true">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
      <img ref={previa} className={`rc-letreiro-previa${alvo ? " is-on" : ""}`} aria-hidden="true" alt=""
        src={alvo ? capa(alvo).src : undefined} decoding="async" draggable={false} />
    </section>
  );
}
