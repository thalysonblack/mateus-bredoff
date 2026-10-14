import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import "../../styles/heroes.css";

/* Base das heroes de cena (hoje só o reel em tela cheia, Reels.tsx). */
/* a hero sangra até as bordas da tela: anula o recuo da Prancha, medido */
export function sangrar(el: HTMLElement) {
  el.style.marginTop = el.style.marginLeft = "0px";
  const r = el.getBoundingClientRect();
  el.style.marginTop = `${-(r.top + window.scrollY)}px`;
  el.style.marginLeft = `${-r.left}px`;
  el.style.width = `${document.documentElement.clientWidth}px`;
}

/* o App mata os ScrollTriggers ao montar a rota: tudo nasce depois das fontes */
export function useCena(montar: (el: HTMLElement) => void) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    sangrar(el);
    let vivo = true;
    const ctx = gsap.context(() => {});
    void document.fonts.ready.then(() => vivo && ctx.add(() => montar(el)));
    return () => { vivo = false; ctx.revert(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

