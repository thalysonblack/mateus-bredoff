import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";

/**
 * O NOME FEITO DO TRABALHO (10/10, "o início merece algum tchan, easter egg").
 *
 * Uma cópia do nome por cima do h1, com o trabalho dele como fundo recortado
 * pelas letras (`background-clip: text`) e revelado por uma máscara circular.
 *   · ENTRADA   depois que as letras sobem, o nome folheia as 8 capas (flipbook)
 *               e volta à tinta — o tchan do início.
 *   · EASTER    passar o cursor no nome abre um furo que mostra o trabalho DENTRO
 *     EGG       das letras; cada entrada traz o projeto seguinte. Clicar no nome
 *               folheia tudo de novo.
 * A cópia é aria-hidden; o h1 continua sendo o texto lido.
 */
const capas = WORK.map((w) => PECAS[w.slug]?.[0]).filter(Boolean) as string[];

export function NomeObra({ texto, entrada }: { texto: string; entrada: number }) {
  const obra = useRef<HTMLDivElement | null>(null);
  const idx = useRef(0);
  const folheando = useRef(false);

  const pinta = (i: number) => {
    idx.current = (i + capas.length) % capas.length;
    obra.current?.style.setProperty("--obra", `url("${capas[idx.current]}")`);
  };

  const folhear = () => {
    const el = obra.current;
    if (!el || folheando.current || prefersReducedMotion()) return;
    folheando.current = true;
    const tl = gsap.timeline({ onComplete: () => { folheando.current = false; } });
    tl.set(el, { "--r": "4000px" });
    capas.forEach((_, i) => tl.call(() => pinta(i), [], i * 0.085));
    tl.to(el, { "--r": "0px", duration: 0.7, ease: "expo.inOut" }, capas.length * 0.085 + 0.15);
  };

  /* pré-carrega as capas e dispara o flipbook quando a entrada termina */
  useEffect(() => {
    capas.forEach((src) => { const im = new Image(); im.src = src; });
    pinta(0);
    if (prefersReducedMotion()) return;
    const t = window.setTimeout(folhear, entrada * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = obra.current;
    if (!el || prefersReducedMotion() || !matchMedia("(hover: hover)").matches) return;
    const host = el.parentElement!;
    const mx = gsap.quickTo(el, "--mx", { duration: 0.5, ease: "power3.out" });
    const my = gsap.quickTo(el, "--my", { duration: 0.5, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mx(e.clientX - r.left);
      my(e.clientY - r.top);
    };
    const entra = (e: PointerEvent) => {
      if (folheando.current) return;
      const r = host.getBoundingClientRect();
      gsap.set(el, { "--mx": e.clientX - r.left, "--my": e.clientY - r.top });
      pinta(idx.current + 1);
      gsap.to(el, { "--r": `${Math.min(240, Math.max(90, window.innerWidth * 0.13))}px`, duration: 0.6, ease: "expo.out", overwrite: "auto" });
    };
    const sai = () => {
      if (folheando.current) return;
      gsap.to(el, { "--r": "0px", duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
    };
    host.addEventListener("pointermove", mover);
    host.addEventListener("pointerenter", entra);
    host.addEventListener("pointerleave", sai);
    return () => {
      host.removeEventListener("pointermove", mover);
      host.removeEventListener("pointerenter", entra);
      host.removeEventListener("pointerleave", sai);
    };
  }, []);

  return (
    <div className="ix-nome-caixa" onClick={folhear}>
      <h1 className="ix-nome">{texto}</h1>
      <div ref={obra} className="ix-nome ix-nome-obra" aria-hidden="true">{texto}</div>
    </div>
  );
}
