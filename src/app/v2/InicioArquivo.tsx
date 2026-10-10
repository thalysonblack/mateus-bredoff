import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import "../../styles/inicio-arquivo.css";

/**
 * INÍCIO A — "O ARQUIVO À MOSTRA" (10/10, família A da pesquisa de hero).
 *
 * O volume do trabalho é o tchan: todas as peças dos 8 projetos viram um MAÇO.
 *   · ENTRADA  as peças são dadas uma a uma num leque (o contador conta 00 → N)
 *              e o leque fecha num monte organizado; o nome assenta junto.
 *   · LER      o x do cursor (ou do dedo) escolhe a peça do topo — folhear um
 *              baralho: as vizinhas abrem um pouco para os lados. Clique = case.
 *   · SCROLL   o monte se desfaz para os lados e abre caminho para a lista.
 * O nome existe, mas é legenda do arquivo, não o protagonista.
 */
type Carta = { src: string; slug: string; titulo: string; ano: number };

/* round-robin entre projetos: vizinhas no maço são de projetos diferentes */
const CARTAS: Carta[] = (() => {
  const filas = WORK.map((w) => (PECAS[w.slug] ?? []).map((src) => ({ src, slug: w.slug, titulo: w.title.replace("®", "").trim(), ano: w.year })));
  const out: Carta[] = [];
  for (let i = 0; filas.some((f) => f[i]); i++) filas.forEach((f) => f[i] && out.push(f[i]));
  return out.reverse(); // a carta do TOPO do monte é a primeira da rodada (a capa do Ginga)
})();
const N = CARTAS.length;

/* desordem fixa (determinística): o monte é sempre o mesmo, não sorteia a cada visita */
const ruido = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5; // −0,5 … 0,5
};
const MONTE = CARTAS.map((_, i) => ({ x: ruido(i, 1) * 14, y: ruido(i, 2) * 10, r: ruido(i, 3) * 7 }));

export function InicioArquivo() {
  const raiz = useRef<HTMLDivElement | null>(null);
  const cartas = useRef<HTMLDivElement[]>([]);
  const ativa = useRef(N - 1);
  const pronto = useRef(false);
  const [topo, setTopo] = useState(N - 1);
  const navegar = useNavigate();

  /* abre o leque em volta da carta escolhida: ela sobe, as vizinhas se afastam */
  const ler = (idx: number, instante = false) => {
    if (idx === ativa.current && !instante) return;
    ativa.current = idx;
    setTopo(idx);
    cartas.current.forEach((el, i) => {
      const d = i - idx;
      const passo = Math.sign(d) * Math.min(Math.abs(d), 6) * (window.innerWidth < 761 ? 12 : 26); /* o leque abre em volta do dedo */
      gsap.to(el, {
        x: MONTE[i].x + passo,
        y: i === idx ? -26 : MONTE[i].y + Math.min(Math.abs(d), 6) * 3,
        rotation: i === idx ? 0 : MONTE[i].r * 0.5 + Math.sign(d) * Math.min(Math.abs(d), 6) * 2.2,
        zIndex: i === idx ? N + 1 : N - Math.abs(d),
        duration: instante ? 0 : 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const reduz = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cs = cartas.current;
      if (reduz) {
        cs.forEach((c, i) => gsap.set(c, { ...MONTE[i], rotation: MONTE[i].r, zIndex: i }));
        gsap.set(".ia-conta-n", { textContent: String(N).padStart(2, "0") });
        pronto.current = true;
        return;
      }
      const conta = { n: 0 };
      const abre = window.innerWidth < 761 ? 50 : 84; // no celular o leque fecha para caber na tela
      const leque = (i: number) => ((i / (N - 1)) - 0.5) * abre; // −42° … 42°
      gsap.set(cs, { transformOrigin: "50% 135%", y: "120vh", rotation: (i) => ruido(i, 4) * 30, zIndex: (i) => i });
      gsap.set(".ia-nome > span", { yPercent: 110 });
      const tl = gsap.timeline({ onComplete: () => { pronto.current = true; } });
      tl.to(cs, { y: 0, x: 0, rotation: leque, duration: 0.9, ease: "expo.out", stagger: 0.028 })
        .to(conta, {
          n: N, duration: 0.028 * N + 0.4, ease: "none",
          onUpdate: () => { const t = el.querySelector(".ia-conta-n"); if (t) t.textContent = String(Math.round(conta.n)).padStart(2, "0"); },
        }, 0)
        .to(cs, { x: (i) => MONTE[i].x, y: (i) => MONTE[i].y, rotation: (i) => MONTE[i].r, duration: 1, ease: "expo.inOut", stagger: { each: 0.012, from: "end" } }, "+=0.25")
        .to(".ia-nome > span", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, "-=0.7")
        .fromTo(".ia-leitura", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.3");

      /* SCROLL — o monte se desfaz para os lados conforme a lista sobe */
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom 15%", scrub: 0.6 } })
        .to(cs, {
          x: (i) => ruido(i, 5) * window.innerWidth * 0.9,
          y: (i) => -80 - Math.abs(ruido(i, 6)) * 260,
          rotation: (i) => ruido(i, 7) * 50,
          autoAlpha: 0,
          ease: "power2.in",
          stagger: { each: 0.004, from: "random" },
        });
    }, el);
    return () => ctx.revert();
  }, []);

  /* x do cursor/dedo sobre a mesa → carta do topo */
  const mover = (clientX: number) => {
    if (!pronto.current) return;
    const mesa = raiz.current?.querySelector<HTMLElement>(".ia-mesa");
    if (!mesa) return;
    const r = mesa.getBoundingClientRect();
    const t = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width));
    ler(Math.floor(t * N));
  };
  /* saiu da mesa: o leque fecha de volta no monte, com a escolhida no topo */
  const fechar = () => {
    if (!pronto.current) return;
    cartas.current.forEach((el, i) => gsap.to(el, { x: MONTE[i].x, y: MONTE[i].y, rotation: MONTE[i].r, duration: 0.7, ease: "power3.inOut", overwrite: "auto" }));
    gsap.set(cartas.current[ativa.current], { zIndex: N + 1 });
  };

  const c = CARTAS[topo];
  return (
    <div ref={raiz} className="ia">
      <div className="ia-legenda">
        <h1 className="ia-nome"><span>Mateus</span> <span>Bredoff</span></h1>
        <p className="p-marca ia-conta">Archive — <span className="ia-conta-n">00</span> / {String(N).padStart(2, "0")} pieces</p>
      </div>
      <div
        className="ia-mesa"
        onPointerMove={(e) => mover(e.clientX)}
        onPointerLeave={fechar}
        onPointerDown={(e) => e.pointerType !== "mouse" && mover(e.clientX)}
        onClick={() => navegar(`/work/${CARTAS[ativa.current].slug}`)}
        role="link"
        aria-label={`Open ${c.titulo}`}
      >
        {CARTAS.map((k, i) => (
          <div key={k.src} className="ia-carta" ref={(n) => { if (n) cartas.current[i] = n; }}>
            <img src={k.src} alt="" decoding="async" draggable={false} />
          </div>
        ))}
      </div>
      <p className="p-marca ia-leitura" aria-live="polite">
        <span>{String(topo + 1).padStart(2, "0")}</span> {c.titulo} · {c.ano} <span className="ia-ver">→ View case</span>
      </p>
    </div>
  );
}
