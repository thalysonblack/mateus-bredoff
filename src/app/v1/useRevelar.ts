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
 * ⚠ O limiar é ZERO e a margem faz o trabalho (12/09/2026). Antes era
 * `threshold: 0.18` — uma FRAÇÃO DO BLOCO — e a folha do trilho do método
 * (100svh + 62vw × 4 ≈ 5,5 telas) nunca chegou a ter 18% de si na tela: a
 * manchete ficou em `opacity: 0` para sempre ("faltou título da section").
 * `threshold: 0` + `rootMargin` de -15% na base diz "acende quando o topo do
 * bloco passa 15% acima da base da viewport" — independe da altura do bloco,
 * e continua cedo o bastante para o reveal não acontecer atrás do olho.
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
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
