import { useEffect, useState } from "react";

/**
 * Wires — os fios que ligam um nó ao outro.
 *
 * Desenha curvas de Bézier entre as portas dos nós marcados com `data-node`, no
 * SVG que cobre a página. É o que transforma uma pilha de blocos num GRAFO: sem
 * os fios, os nós são só caixas com cabeçalho.
 *
 * ⚠ COORDENADAS DE DOCUMENTO, não de viewport. O SVG é `absolute` dentro do
 * fluxo da página e as posições somam `window.scrollY` — assim os fios não
 * precisam ser redesenhados a cada scroll, só quando o layout muda de fato
 * (resize, fontes, imagens decodificando). Fazer isso no scroll seria a receita
 * pronta para engasgar a página.
 *
 * ⚠ Mede DEPOIS de `document.fonts.ready` e do `load`: as imagens são `lazy` e
 * cada uma que decodifica muda a altura do documento — medir antes gera fios
 * apontando para onde os nós estavam, não onde estão. Mesma armadilha do
 * `ScrollTrigger.refresh()`.
 */

type Seg = { d: string };

export default function Wires({ order }: { order: string[] }) {
  const [segs, setSegs] = useState<Seg[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let raf = 0;

    const medir = () => {
      const docW = document.documentElement.scrollWidth;
      const docH = document.documentElement.scrollHeight;
      setSize({ w: docW, h: docH });

      const pontos = order
        .map((id) => document.querySelector(`[data-node="${id}"]`))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            /* a porta de saída fica na direita, na altura do cabeçalho */
            outX: r.right + window.scrollX,
            outY: r.top + window.scrollY + 18,
            inX: r.left + window.scrollX,
            inY: r.top + window.scrollY + 18,
          };
        });

      const novos: Seg[] = [];
      for (let i = 0; i < pontos.length - 1; i++) {
        const a = pontos[i];
        const b = pontos[i + 1];
        /* Sai pela direita do nó de cima, entra pela esquerda do de baixo. A
           alça horizontal é proporcional à distância vertical, então fio curto
           não vira laço e fio longo não fica reto. */
        const alca = Math.min(240, Math.max(60, (b.inY - a.outY) * 0.4));
        novos.push({
          d: `M ${a.outX} ${a.outY} C ${a.outX + alca} ${a.outY}, ${b.inX - alca} ${b.inY}, ${b.inX} ${b.inY}`,
        });
      }
      setSegs(novos);
    };

    const agendar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(medir);
    };

    /* Ordem importa: fontes → primeiro passe → load (imagens) → segundo passe. */
    document.fonts.ready.then(() => {
      agendar();
      window.addEventListener("load", agendar);
    });

    const ro = new ResizeObserver(agendar);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", agendar);
      ro.disconnect();
    };
  }, [order]);

  if (!segs.length) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-10"
      width={size.w}
      height={size.h}
      style={{ overflow: "visible" }}
    >
      {segs.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}
