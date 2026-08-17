import { useEffect, useRef } from "react";

/**
 * Marca o bloco como visível quando ele entra na tela — e só uma vez.
 *
 * `IntersectionObserver` puro em vez de ScrollTrigger: aqui não há scrub nem
 * pin, só um gatilho por bloco, e trazer o GSAP para isso seria ligar um motor
 * de coreografia para acender uma luz. O CSS faz o resto (`.p-sobe`, `.p-foca`).
 *
 * ⚠ `once: true` por decisão, não por economia: bloco que re-anima ao voltar
 * transforma rolagem para cima em espetáculo, e quem rola de volta está
 * procurando algo — não quer assistir de novo.
 *
 * O limiar é 0,18: com 0,5 o bloco de uma tela inteira só acende quando já
 * está na metade da viewport, e o reveal acontece atrás do olho.
 */
export function useRevelar<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("p-visivel");
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("p-visivel");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
