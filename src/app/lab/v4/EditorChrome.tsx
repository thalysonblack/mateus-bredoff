import { useEffect, useState } from "react";
import { Mono } from "../../system";

/**
 * EditorChrome — a moldura da ferramenta em volta da página.
 *
 * Completa o partido "a página é um arquivo de design aberto": régua numerada no
 * topo, indicador de zoom e um cursor nomeado, como o de sessão compartilhada.
 * Sozinhas, as peças selecionadas pareciam um efeito; com a moldura da
 * ferramenta em volta, a página inteira passa a se apresentar como canvas.
 *
 * ⚠ Tudo aqui é `aria-hidden` + `pointer-events: none`. É cenografia: não pode
 * entrar na árvore de acessibilidade nem interceptar clique.
 *
 * ⚠ CUSTO. Este arquivo desenha por cima de tudo e acompanha o scroll — é o
 * lugar mais fácil de matar a performance da página. Por isso: a régua é
 * `background-image` repetida (um nó, não 60 spans), o zoom lê o scroll por
 * intervalo de 200ms em vez de por frame, e o cursor se move por `transform`
 * (composto na GPU) em vez de `top/left`.
 */

const RULER_STEP = 100;

export default function EditorChrome() {
  const [zoom, setZoom] = useState(100);
  const [cursor, setCursor] = useState({ x: -200, y: -200 });

  useEffect(() => {
    /* "Zoom" derivado da posição de leitura: é um dado real da página vestido
       com a linguagem da ferramenta, não um número inventado. */
    const id = window.setInterval(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setZoom(Math.round(100 - p * 36));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    /* O cursor nomeado segue o mouse com atraso, como o de outra pessoa numa
       sessão compartilhada. Segue por rAF com lerp — atualizar estado a cada
       mousemove derrubaria o frame rate. */
    let raf = 0;
    const alvo = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };

    const onMove = (e: MouseEvent) => {
      alvo.x = e.clientX;
      alvo.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      pos.x += (alvo.x - pos.x) * 0.06;
      pos.y += (alvo.y - pos.y) * 0.06;
      setCursor({ x: Math.round(pos.x), y: Math.round(pos.y) });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" style={{ contain: "strict" }}>
      {/* Régua numerada no topo. Um só nó com gradiente repetido: 16 spans por
          tela seriam 16 nós recalculados a cada resize. */}
      <div
        className="absolute inset-x-0 top-0 h-[14px]"
        style={{
          backgroundImage: `repeating-linear-gradient(to right,
            var(--rule) 0 1px, transparent 1px ${RULER_STEP / 4}px)`,
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[14px]"
        style={{
          backgroundImage: `repeating-linear-gradient(to right,
            var(--rule) 0 1px, transparent 1px ${RULER_STEP}px)`,
        }}
      />

      {/* Zoom + estado do arquivo, no rodapé */}
      <div className="absolute bottom-[2vh] left-[var(--gutter)] flex items-center gap-[0.75rem]">
        <span
          className="inline-flex items-center px-[0.55em] py-[0.3em]"
          style={{ border: "1px solid var(--rule)", background: "var(--bg)" }}
        >
          <Mono dim>{`${zoom}%`}</Mono>
        </span>
        <span
          className="inline-flex items-center gap-2 px-[0.55em] py-[0.3em]"
          style={{ border: "1px solid var(--rule)", background: "var(--bg)" }}
        >
          <span className="block h-[6px] w-[6px]" style={{ background: "var(--acc)" }} />
          <Mono dim>Saved</Mono>
        </span>
      </div>

      {/* Cursor nomeado — a marca de que alguém está editando */}
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
      >
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
          <path d="M1 1L12 9.5L6.5 10.5L4 17L1 1Z" fill="var(--acc)" stroke="var(--bg)" strokeWidth="1" />
        </svg>
        <span
          className="ml-3 mt-1 inline-flex px-[0.45em] py-[0.2em]"
          style={{ background: "var(--acc)", color: "var(--bg)" }}
        >
          <Mono>MB</Mono>
        </span>
      </div>
    </div>
  );
}
