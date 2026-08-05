/**
 * Sistema de scroll — o Lenis é o dono único do scroll da página.
 *
 * Regra que não se quebra: **não existem dois loops de rAF**. O Lenis anda no
 * ticker do GSAP, não num `requestAnimationFrame` próprio, e o ScrollTrigger se
 * atualiza pelo evento do Lenis. Dois relógios independentes produzem exatamente
 * o defeito que parece "travamento aleatório" — dois frames disputando o mesmo
 * transform em instantes diferentes.
 *
 * A referência do ticker fica guardada em `lenisTicker` porque
 * `gsap.ticker.remove()` exige **a mesma função** que foi passada no `add`;
 * callback inline entra e nunca sai, e vaza a cada remount.
 */
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

let lenis: Lenis | null = null;
let lenisTicker: ((time: number) => void) | null = null;

export function initLenis(): Lenis | null {
  if (lenis) return lenis;

  /* Movimento reduzido não é "menos suave": é scroll nativo. Interpolar o scroll
     de quem pediu para não ter movimento é justamente o que causa mal-estar. */
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    /* Valores de assinatura: 1.2 / lerp 0.1 no desktop, mais curto no toque.
       O easing é o expo-out — chega rápido e assenta, em vez de deslizar. */
    duration: window.innerWidth >= 1000 ? 1.2 : 0.8,
    lerp: window.innerWidth >= 1000 ? 0.1 : 0.075,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    /* smoothTouch fica FALSE de propósito: interpolar o toque briga com o
       scroll nativo do iOS e dá a sensação de aderência/atraso no dedo. */
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  lenisTicker = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisTicker);
  /* Sem lagSmoothing o GSAP "pula" o tempo perdido ao voltar de uma aba oculta,
     e o scroll dá um salto de vários segundos de uma vez. */
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = () => lenis;

/** Único caminho para ir ao topo — nada de `window.scrollTo` espalhado. */
export function scrollToTop(immediate = true) {
  if (!lenis) {
    window.scrollTo(0, 0);
    return;
  }
  lenis.scrollTo(0, { immediate, force: true });
}

/**
 * Ir até um elemento — o caminho para âncora (`/#contato`).
 *
 * Com o Lenis no comando, o pulo nativo por hash simplesmente não acontece: o
 * navegador mexe no scroll nativo e o scroll interpolado ignora. Por isso todo
 * link de âncora deste projeto passa por aqui.
 *
 * Não é `immediate`: âncora é gesto de navegação dentro da mesma página, e ver
 * o percurso é o que diz ao visitante que ele continua onde estava.
 */
export function scrollToElement(alvo: HTMLElement, offset = 0) {
  if (!lenis) {
    alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  lenis.scrollTo(alvo, { offset, force: true });
}

export function destroyLenis() {
  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
  }
  lenis?.destroy();
  lenis = null;
}
