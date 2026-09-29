import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarArquivoWebGL, type ArquivoWebGL } from "../../lib/arquivoWebGL";
import { WORK, type WorkItem } from "../../content/work";
import { PECAS } from "../../content/pecas";

/**
 * O HOVER "COLUNA" (28/09) — a coluna curva da /work (lente, grão, curvatura:
 * `lib/arquivoWebGL.ts`) trazida para a home, à esquerda da tabela. Pousar
 * numa linha rola a coluna até aquele projeto pelo caminho mais curto; sem
 * hover ela deriva devagar. Mesma sincronia tabela ↔ coluna da /work em lista,
 * só que aqui quem dirige é o cursor e não a roda.
 */
export function HoverColuna({ sob }: { sob: WorkItem | null }) {
  const caixa = useRef<HTMLDivElement | null>(null);
  const gl = useRef<ArquivoWebGL | null>(null);
  const alvo = useRef(0);
  const pos = useRef(0);
  const n = WORK.length;

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const v = criarArquivoWebGL(el, WORK.map((w) => PECAS[w.slug][0]));
    gl.current = v;
    if (!v) return;
    const reduzido = prefersReducedMotion();
    const passo = () => {
      pos.current += (alvo.current - pos.current) * (reduzido ? 1 : 0.08);
      v.scroll(pos.current);
      v.passo(0.016);
    };
    gsap.ticker.add(passo);
    return () => {
      gsap.ticker.remove(passo);
      v.destruir();
      gl.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sob) {
      /* sem hover, a coluna deriva: meio item a cada 2,4 s */
      if (prefersReducedMotion()) return;
      const iv = setInterval(() => (alvo.current += 0.5), 2400);
      return () => clearInterval(iv);
    }
    const i = WORK.indexOf(sob);
    const resto = ((alvo.current % n) + n) % n;
    let d = i - resto;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    alvo.current += d;
  }, [sob, n]);

  return <div ref={caixa} className="p-gl p-gl--coluna" aria-hidden="true" />;
}
