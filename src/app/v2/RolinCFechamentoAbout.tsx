import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { INSTAGRAM } from "../../content/lab";
import { scrollToTop } from "../../lib/lenis";
import { BEHANCE, Credito, EMAIL } from "./RolinCMoldura";

/**
 * FECHAMENTO DA ABOUT (15/10, v3): "ainda não gostei do footer". Altura pelo conteúdo; o gesto é o
 * e-mail de borda a borda (cols 1–12), medido no TSX para caber exato. Fatos só do repo: "Available
 * for projects" (header) e "based in Brazil and work globally" (LEAD). Services/Recognition saíram:
 * as seções 04 e 06 já os mostram logo acima.
 */
export function RcFechamentoAbout({ rotulo }: { rotulo: string }) {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const [copiado, setCopiado] = useState(false);
  const gestoRef = useRef<HTMLDivElement>(null);
  const lenteRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const g = gestoRef.current, l = lenteRef.current;
    if (!g || !l || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.set(l, { xPercent: -50, yPercent: -50, scale: 0 });
    const x = gsap.quickTo(l, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(l, "y", { duration: 0.5, ease: "power3.out" });
    const mover = (e: PointerEvent) => { const r = g.getBoundingClientRect(); x(e.clientX - r.left); y(e.clientY - r.top); };
    const entra = (e: PointerEvent) => { mover(e); gsap.to(l, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" }); };
    const sai = () => gsap.to(l, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
    const a = emailRef.current!;
    a.addEventListener("pointerenter", entra); a.addEventListener("pointermove", mover); a.addEventListener("pointerleave", sai);
    return () => { a.removeEventListener("pointerenter", entra); a.removeEventListener("pointermove", mover); a.removeEventListener("pointerleave", sai); };
  }, []);

  // o e-mail ocupa a largura útil: mede a 100px e escala (fonte carregada antes de medir)
  useLayoutEffect(() => {
    const a = emailRef.current;
    if (!a) return;
    const caber = () => {
      a.style.fontSize = "100px";
      const w = a.parentElement!.clientWidth;
      a.style.fontSize = `${(100 * w) / a.scrollWidth}px`;
    };
    caber();
    document.fonts?.ready.then(caber);
    const ro = new ResizeObserver(caber);
    ro.observe(a.parentElement!);
    return () => ro.disconnect();
  }, []);

  const copiar = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    }, () => {});
  };

  return (
    <footer id="rc-info" className="rcx" data-rc-escuro>
      <div className="rc-grade-guia rcx-guia" aria-hidden>{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
      <div className="rcx-topo">
        <p className="rcx-rot"><span className="rcx-q">{rotulo}</span> Contact</p>
        <p className="rcx-disp">Available for projects</p>
        <p className="rcx-lugar"><span className="rcx-q">Based in</span> Brazil<br /><span className="rcx-q">Working</span> globally</p>
      </div>
      <div className="rcx-gesto" ref={gestoRef}>
        {/* a gracinha (15/10): uma lente branca segue o cursor e inverte o e-mail por baixo (difference),
            com o rótulo de cópia dentro — o texto fica inteiro, a ligadura "ff" não quebra */}
        <span ref={lenteRef} className="rcx-lente" aria-hidden><b>{copiado ? "Copied" : "Copy"}</b></span>
        <a ref={emailRef} className="rcx-email" href={`mailto:${EMAIL}`} onClick={copiar}>{EMAIL}</a>
      </div>
      <div className="rcx-meio">
        <p className="rcx-dica" aria-live="polite">{copiado ? "Copied" : <span className="rcx-q">Click to copy</span>}</p>
        <a className="rcx-ig" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        <a className="rcx-be" href={BEHANCE} target="_blank" rel="noopener noreferrer">Behance ↗</a>
      </div>
      <div className="rcx-pe">
        <p className="rcx-q">© {new Date().getFullYear()} Mateus Bredoff</p>
        <Credito className="rc-credito rcx-credito" />
        <button type="button" className="rcx-topo-bt" onClick={() => scrollToTop(false)}>Back to top ↑</button>
      </div>
    </footer>
  );
}
