import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — PARTIDO G: "A PILHA".
 *
 * As peças empilhadas no espaço, e o scroll atravessa a pilha — o gesto de quem
 * recebe uma pasta de trabalhos e folheia.
 *
 * ⚠ Profundidade AQUI NÃO É PARALLAX. Medido no corentin: a taxa Δtop/Δscroll
 * de todos os nós dele dá 0,000 ou −1,000, nunca um valor intermediário — zero
 * parallax no DOM, a profundidade inteira vive num shader. O recurso óbvio é o
 * que os sites bons não usam.
 *
 * Aqui o espaço é real: `perspective: 1600px` no palco e cada peça num
 * `translateZ` diferente. A da frente vem nítida e grande; as de trás encolhem,
 * escurecem e desfocam — e a sombra é o que prova a distância. Sem sombra, nove
 * imagens em escala decrescente lêem como uma escadinha; com ela, lêem como
 * objetos a distâncias diferentes.
 *
 * O scroll da roda avança a pilha uma peça por vez (`wheel` com trava de 520ms,
 * senão um gesto de trackpad atravessa três). A página não rola: a pilha anda.
 * ⚠ Isso é `preventDefault` no scroll, que é justamente o tipo de sequestro que
 * costuma ser vetado — por isso o teclado (↑/↓) e o clique nos índices fazem a
 * mesma coisa, e a lista completa continua a um clique em `/v2/work`.
 */
export default function HomeG() {
  useMetaRota();
  const [i, setI] = useState(0);
  const palco = useRef<HTMLDivElement | null>(null);
  const trava = useRef(0);

  useEffect(() => {
    const el = palco.current;
    if (!el) return;

    const anda = (d: number) => {
      const agora = performance.now();
      if (agora - trava.current < 520) return;
      trava.current = agora;
      setI((x) => Math.min(Math.max(x + d, 0), WORK.length - 1));
    };

    const naRoda = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      anda(e.deltaY > 0 ? 1 : -1);
    };
    const naTecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") anda(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") anda(-1);
    };

    el.addEventListener("wheel", naRoda, { passive: false });
    window.addEventListener("keydown", naTecla);
    return () => {
      el.removeEventListener("wheel", naRoda);
      window.removeEventListener("keydown", naTecla);
    };
  }, []);

  const atual = WORK[i];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section className="flex min-h-[calc(100svh-11rem)] flex-col justify-between pt-6">
        <div ref={palco} className="p-mesa">
          <div className="p-pilha">
            {WORK.map((w, k) => {
              const d = k - i; /* distância da peça em relação à de cima */
              const oculta = d < 0 || d > 4;
              return (
                <Link
                  key={w.slug}
                  to={`/work/${w.slug}`}
                  className="p-prancheta"
                  aria-hidden={oculta}
                  tabIndex={oculta ? -1 : 0}
                  style={{
                    /* cada plano recua 132px em Z e desce 26px — o deslocamento
                       vertical existe para a pilha ter LOMBADA: só com Z as
                       peças de trás sumiriam atrás da primeira */
                    transform: `translate3d(0, ${-50 + d * 5}%, ${-d * 132}px)`,
                    filter: `blur(${d * 1.6}px) brightness(${1 - d * 0.09})`,
                    opacity: oculta ? 0 : 1,
                    zIndex: WORK.length - k,
                    pointerEvents: d === 0 ? "auto" : "none",
                  }}
                >
                  <img
                    src={w.cover.src}
                    srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                    sizes="46vw"
                    alt={w.cover.alt}
                    width={w.cover.w}
                    height={w.cover.h}
                    loading={k > 2 ? "lazy" : undefined}
                    decoding="async"
                    draggable={false}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* a ficha da peça de cima + o percurso pela pilha */}
        <div className="flex items-end justify-between gap-6 pt-8 max-md:flex-col max-md:items-start">
          <div>
            <p className="p-especime" style={{ ["--n" as string]: atual.title.length + 6 }}>
              {atual.title}
            </p>
            <p className="p-marca pt-2">
              {atual.disciplines.join(", ")} — {atual.year}
            </p>
          </div>

          <nav className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {WORK.map((w, k) => (
              <button
                key={w.slug}
                type="button"
                onClick={() => setI(k)}
                className="p-marca cursor-pointer tabular-nums"
                style={{ color: i === k ? "var(--p-acento)" : "var(--p-quieto)" }}
                aria-label={`Show ${w.title}`}
                aria-current={i === k}
              >
                {String(k + 1).padStart(2, "0")}
              </button>
            ))}
            <Link to="/work" className="p-marca p-link pl-3">
              All work →
            </Link>
          </nav>
        </div>
      </section>
    </Prancha>
  );
}
