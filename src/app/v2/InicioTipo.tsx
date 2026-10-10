import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/inicio-tipo.css";

gsap.registerPlugin(Flip);

/**
 * INÍCIO B — "A tipografia que se mexe" (10/10, família B da pesquisa
 * `~/dev/_inbox/ref-bredoff-hero/`: Dumbar, Givelet, Kyoosang Choi).
 *
 * O nome dele se comporta como um BRAND SYSTEM: as mesmas 13 letras assentam
 * em quatro lockups, como as páginas de assinatura de um manual de marca.
 * O cursor percorre a hero da esquerda para a direita e escolhe o lockup
 * (quatro faixas); no toque, cada toque passa ao seguinte. A troca é FLIP:
 * cada letra viaja da posição antiga para a nova — nunca some, nunca fica
 * ilegível. Guias de 1px e a legenda mono dão o registro de manual.
 */
const LOCKUPS = [
  { id: "horizontal", nome: "Horizontal" },
  { id: "empilhado", nome: "Stacked" },
  { id: "diagonal", nome: "Split" },
  { id: "aberto", nome: "Tracked" },
] as const;

const PALAVRAS = ["Mateus", "Bredoff"];

export function InicioTipo() {
  const caixa = useRef<HTMLDivElement | null>(null);
  const [i, setI] = useState(0);
  const atual = useRef(0);

  /* troca de lockup: captura o estado, aplica a classe nova, anima as letras */
  const vaiPara = (n: number) => {
    const el = caixa.current;
    if (!el || n === atual.current) return;
    const letras = el.querySelectorAll(".it-mascara"); /* a máscara viaja (a letra dentro dela seria cortada) */
    const estado = Flip.getState(letras);
    atual.current = n;
    el.dataset.lockup = LOCKUPS[n].id;
    setI(n);
    if (prefersReducedMotion()) return;
    Flip.from(estado, { duration: 0.95, ease: "expo.inOut", stagger: 0.012, scale: true, overwrite: true });
  };

  /* entrada: as letras sobem por máscara no lockup "aberto" e assentam no horizontal */
  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return;
    el.dataset.lockup = LOCKUPS[3].id;
    atual.current = 3;
    if (prefersReducedMotion()) { vaiPara(0); return; }
    const ctx = gsap.context(() => {
      gsap.fromTo(".it-letra", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.03 });
      gsap.fromTo(".it-guia", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", stagger: 0.08 });
      gsap.fromTo(".it-legenda", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.9 });
      gsap.delayedCall(1.5, () => vaiPara(0));
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* cursor: quatro faixas horizontais da hero escolhem o lockup */
  useEffect(() => {
    const el = caixa.current;
    if (!el || !matchMedia("(hover: hover)").matches) return;
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const n = Math.min(3, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * 4)));
      vaiPara(n);
    };
    el.addEventListener("pointermove", mover);
    return () => el.removeEventListener("pointermove", mover);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={caixa}
      className="it-caixa"
      onClick={() => !matchMedia("(hover: hover)").matches && vaiPara((atual.current + 1) % 4)}
    >
      <span className="it-guia it-guia--a" aria-hidden="true" />
      <span className="it-guia it-guia--b" aria-hidden="true" />
      <h1 className="it-nome" aria-label="Mateus Bredoff">
        {PALAVRAS.map((p) => (
          <span key={p} className="it-palavra" aria-hidden="true">
            {[...p].map((c, k) => (
              <span key={k} className="it-mascara">
                <span className="it-letra">{c}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="p-marca it-legenda" aria-hidden="true">
        <span>Lockup {String(i + 1).padStart(2, "0")} / 04</span>
        <span>{LOCKUPS[i].nome}</span>
        <span className="it-dica">← move →</span>
      </p>
    </div>
  );
}
