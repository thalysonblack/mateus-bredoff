import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarVisorFluido, type VisorFluido } from "../../lib/visorFluido";
import { WORK, type WorkItem } from "../../content/work";
import { PECAS } from "../../content/pecas";
import { corDe } from "../../content/cores";

/**
 * O HOVER EM WEBGL (28/09, "algo webgl").
 *
 * Reusa o motor da home da trama (`lib/visorFluido.ts`, receita 4 "Arco"): a
 * arte nova invade a anterior por uma frente em arco que arrasta a imagem como
 * pano elástico. Dois modelos:
 *   LÍQUIDO  o canvas é a tela inteira, por cima do reel apagado
 *   LENTE    um visor 16:9 que segue o cursor, à esquerda dele (a tabela
 *            está à direita, e a peça não pode cobrir o nome que se lê)
 * Parado numa linha, o visor PERCORRE as peças do projeto — cada troca é o
 * mesmo fluido, então o projeto se apresenta em movimento, não numa foto.
 *
 * O ciclo de vida é o mesmo da home D, com as mesmas travas (ver os ⚠ de lá):
 * renderer montado uma vez; `garantir` separado de `iniciar`; o tween anterior
 * é MORTO e `resolver()` fecha o que ficou no meio antes de instalar a nova.
 */
export type ModoGL = "liquido" | "lente" | "metade" | "cartaz";
/* receita do visorFluido: 1 Maré · 2 Onda · 3 Turbilhão · 4 Arco */
export function HoverFluido({ sob, modo, receita = 4 }: { sob: WorkItem | null; modo: ModoGL; receita?: 1 | 2 | 3 | 4 }) {
  const caixa = useRef<HTMLDivElement | null>(null);
  const anel = useRef<HTMLDivElement | null>(null);
  const quadro = useRef<HTMLDivElement | null>(null);
  const fluido = useRef<VisorFluido | null>(null);
  const [semGL, setSemGL] = useState(false);
  const [k, setK] = useState(0);
  const aberto = useRef(false);
  const geracao = useRef(0);
  const passo = useRef({ p: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const ultimoIdx = useRef(0);

  /* o renderer vive enquanto o modelo vive */
  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const v = criarVisorFluido(el, receita);
    fluido.current = v;
    setSemGL(!v);
    if (!v) return;
    v.acento(getComputedStyle(el).getPropertyValue("--p-acento") || "#277796");
    void v.aquecer(Object.values(PECAS).flat());
    let ultimo = performance.now();
    const desenha = () => {
      const agora = performance.now();
      v.passo(Math.min((agora - ultimo) / 1000, 0.05));
      ultimo = agora;
    };
    gsap.ticker.add(desenha);
    return () => {
      gsap.ticker.remove(desenha);
      v.destruir();
      fluido.current = null;
    };
  }, [receita]);

  /* a lente segue o cursor com atraso (quickTo), sempre à esquerda dele */
  useEffect(() => {
    if (modo !== "lente") return;
    const el = anel.current;
    if (!el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      x(Math.max(16, e.clientX - w - 48));
      y(Math.min(Math.max(16, e.clientY - h / 2), window.innerHeight - h - 16));
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, [modo]);

  /* parado numa linha, percorre as peças do projeto */
  useEffect(() => {
    setK(0);
    if (!sob || prefersReducedMotion()) return;
    const n = PECAS[sob.slug].length;
    if (n < 2) return;
    const iv = setInterval(() => setK((i) => (i + 1) % n), 1900);
    return () => clearInterval(iv);
  }, [sob]);

  useLayoutEffect(() => {
    const el = caixa.current;
    const v = fluido.current;
    if (!el) return;
    const reduzido = prefersReducedMotion();
    if (!sob) {
      if (!aberto.current) return;
      aberto.current = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.35, ease: "power2.in", overwrite: "auto" });
      return;
    }
    const src = PECAS[sob.slug][k % PECAS[sob.slug].length];
    if (!v) {
      gsap.set(el, { autoAlpha: 1 });
      aberto.current = true;
      return;
    }
    const idx = WORK.indexOf(sob);
    const dir = (idx >= ultimoIdx.current ? 1 : -1) as 1 | -1;
    ultimoIdx.current = idx;
    const meu = ++geracao.current;
    void v.garantir(src).then(() => {
      if (geracao.current !== meu || !caixa.current) return;
      tween.current?.kill();
      tween.current = null;
      v.resolver();
      v.acento(corDe(sob.slug));
      v.iniciar(src, dir);
      passo.current.p = 0;
      tween.current = gsap.to(passo.current, {
        p: 1,
        duration: reduzido ? 0 : 1.05,
        ease: "power3.inOut",
        onUpdate: () => v.progresso(passo.current.p),
        onComplete: () => {
          v.concluir();
          tween.current = null;
        },
      });
      if (!aberto.current) {
        aberto.current = true;
        gsap.fromTo(
          el,
          { autoAlpha: 0, clipPath: modo === "lente" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)" },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: reduzido ? 0 : 0.6, ease: "expo.out", overwrite: "auto" },
        );
      }
    });
  }, [sob, k, modo]);

  const src = sob ? PECAS[sob.slug][k % PECAS[sob.slug].length] : null;
  return (
    <div ref={anel} className={`p-gl p-gl--${modo}`} aria-hidden="true">
      <div ref={caixa} className="p-gl-caixa" style={{ opacity: 0, visibility: "hidden" }}>
        {semGL && src ? <img className="p-gl-plano" src={src} alt="" draggable={false} /> : null}
        <div ref={quadro} className="p-gl-quadro" />
      </div>
    </div>
  );
}
