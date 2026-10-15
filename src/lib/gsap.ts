/**
 * Sistema de motion — ponto único de registro do GSAP.
 *
 * Nenhum outro arquivo importa "gsap" direto: todos importam daqui. É o que
 * garante que os plugins sejam registrados uma vez só e que os defaults valham
 * para o projeto inteiro em vez de serem repetidos em cada `gsap.to`.
 *
 * SplitText passou a vir no pacote público a partir do GSAP 3.13 — antes era
 * Club GreenSock. Confirmado aqui na 3.15 (`node_modules/gsap/SplitText.js`),
 * então o reveal por máscara de linha não precisa de gambiarra de split manual.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.defaults({ ease: "power3.out", duration: 0.85 });

/* Evita o refresh em cadeia quando a barra de endereço do mobile aparece/some —
   sem isso, o ScrollTrigger recalcula tudo a cada scroll no iOS. */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Verdade única sobre movimento reduzido: quem anima consulta isto, não a media query solta. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText };
