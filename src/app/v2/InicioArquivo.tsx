import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../../lib/gsap";
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
 *   · SCROLL   (rodada 2, "o restante não conversou; clicar pra mexer não agrada")
 *              o scroll DÁ as cartas: as peças de cada projeto saem do monte e
 *              pousam empilhadas na linha do projeto, à esquerda do título — o
 *              início vira o índice. Cada projeto voa quando a linha dele chega.
 *              No celular a pilha pousa sobre a miniatura da linha e dissolve nela.
 *   · HOVER    (extra) na linha, a pilha do projeto abre em leque.
 * O nome existe, mas é legenda do arquivo, não o protagonista.
 */
type Carta = { src: string; slug: string; titulo: string; ano: number; p: number; k: number };

/* round-robin entre projetos: vizinhas no maço são de projetos diferentes */
const CARTAS: Carta[] = (() => {
  const filas = WORK.map((w, p) => (PECAS[w.slug] ?? []).map((src, k) => ({ src, slug: w.slug, titulo: w.title.replace("®", "").trim(), ano: w.year, p, k })));
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

const celular = () => window.innerWidth < 761;
/* pin do monte, em alturas de tela (0 = sem pin). Testado com 0,6 na rodada 2: dava ~540px de
   scroll em que nada acontece (as linhas ainda não chegaram) — pior. Fica sem pin. */
const PIN = 0;

/**
 * Onde a carta i POUSA, como transform relativo à base dela (centro da mesa).
 * Desktop: pilha à esquerda do título da linha, altura = 78% da linha.
 * Celular: sobre a miniatura (.ix-mini) da linha, na largura dela.
 * ⚠ o transformOrigin das cartas é 50% 135% (o leque da entrada): escalar em
 * volta dele desce o centro em oy·(1−s); o y compensa isso.
 */
function pouso(i: number, mesa: HTMLElement, carta: HTMLElement) {
  const c = CARTAS[i];
  const li = document.querySelectorAll<HTMLElement>(".ix-lista > li")[c.p];
  if (!li) return { x: 0, y: 0, scale: 1, rotation: 0 };
  const W = carta.offsetWidth;
  const H = carta.offsetHeight;
  const m = mesa.getBoundingClientRect();
  const cx = m.left + m.width / 2;
  const cy = m.top + m.height / 2;
  let tx: number, ty: number, s: number;
  if (celular()) {
    const mini = li.querySelector<HTMLElement>(".ix-mini")!.getBoundingClientRect();
    s = mini.width / W;
    tx = mini.left + mini.width / 2;
    ty = mini.top + mini.height / 2;
  } else {
    const r = li.getBoundingClientRect();
    const t = li.querySelector<HTMLElement>(".ix-titulo")!.getBoundingClientRect();
    s = (r.height * 0.78) / H;
    tx = t.left - 28 - (W * s) / 2;
    ty = r.top + r.height / 2;
  }
  const oy = H * 0.85;
  return { x: tx - cx - c.k * 3, y: ty - cy - oy * (1 - s) - c.k * 2, scale: s, rotation: (c.k % 2 ? 1 : -1) * c.k * 1.6 };
}

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
    const mesa = el.querySelector<HTMLElement>(".ia-mesa")!;
    const ondeCai = (c: Element) => pouso(Number((c as HTMLElement).dataset.i), mesa, c as HTMLElement);

    /* DAR AS CARTAS — um scrub por projeto, que começa quando a linha dele entra na tela */
    const dar = (estatico: boolean) => {
      const cs = cartas.current;
      if (estatico) {
        const assenta = () => cs.forEach((c) => gsap.set(c, { ...ondeCai(c), zIndex: 200 - CARTAS[Number(c.dataset.i)].k, autoAlpha: celular() ? 0 : 1 }));
        assenta();
        window.addEventListener("resize", assenta); // ponytail: sem debounce; só roda com movimento reduzido
        return;
      }
      gsap.to(".ia-leitura", {
        autoAlpha: 0, ease: "none",
        scrollTrigger: {
          start: 0, end: 160, scrub: true,
          /* o scroll começou com o monte aberto pelo cursor: fecha antes de dar as cartas */
          onEnter: () => cs.forEach((c, i) => gsap.to(c, { x: MONTE[i].x, y: MONTE[i].y, rotation: MONTE[i].r, duration: 0.3, overwrite: true })),
        },
      });
      /* o MONTE fica parado (pin do .ia — só o maço e o nome) enquanto as primeiras linhas sobem */
      if (PIN && !celular()) ScrollTrigger.create({ trigger: el, start: 0, end: () => `+=${window.innerHeight * PIN}`, pin: true, pinSpacing: true });
      const lis = document.querySelectorAll<HTMLElement>(".ix-lista > li");
      WORK.forEach((_, p) => {
        const li = lis[p];
        const doProjeto = cs.filter((c) => CARTAS[Number(c.dataset.i)].p === p);
        if (!li || !doProjeto.length) return;
        const topo = () => li.getBoundingClientRect().top + window.scrollY;
        const inicio = () => Math.max(0, topo() - window.innerHeight * 0.98);
        const n = doProjeto.length;
        /* TRAJETO EM L, medido AO VIVO a cada quadro (o monte pode estar preso e a linha subindo):
           1º a carta desliza na altura do monte até a coluna 1 e já encolhe; 2º desce na
           vertical por essa coluna até a linha. Nunca atravessa a coluna dos títulos. */
        const quadro = (prog: number) => {
          doProjeto.forEach((c, j) => {
            const i = Number(c.dataset.i);
            const t = gsap.utils.clamp(0, 1, (prog - j * 0.07) / (1 - 0.07 * (n - 1)));
            const m = MONTE[i];
            if (t === 0) { gsap.set(c, { x: m.x, y: m.y, rotation: m.r, scale: 1, zIndex: i, autoAlpha: 1 }); return; }
            const T = ondeCai(c);
            const a = gsap.parseEase("power3.inOut")(gsap.utils.clamp(0, 1, t / 0.42));
            const d = gsap.parseEase("power2.inOut")(gsap.utils.clamp(0, 1, (t - 0.42) / 0.58));
            gsap.set(c, {
              x: m.x + (T.x - m.x) * a,
              y: m.y + (T.y - m.y) * d,
              scale: 1 + (T.scale - 1) * gsap.parseEase("expo.out")(gsap.utils.clamp(0, 1, t / 0.42)),
              rotation: m.r + (T.rotation - m.r) * a,
              zIndex: 200 - CARTAS[i].k,
              /* no celular a pilha dissolve na miniatura que já está na linha */
              autoAlpha: celular() ? 1 - gsap.utils.clamp(0, 1, (t - 0.85) / 0.15) : 1,
            });
          });
        };
        ScrollTrigger.create({
          start: inicio,
          end: () => Math.max(inicio() + 160, topo() - window.innerHeight * 0.5),
          invalidateOnRefresh: true,
          onUpdate: (st) => quadro(st.progress),
          onRefresh: (st) => st.progress > 0 && quadro(st.progress),
        });
      });
    };

    const ctx = gsap.context(() => {
      const cs = cartas.current;
      if (reduz) {
        gsap.set(cs, { transformOrigin: "50% 135%" });
        gsap.set(".ia-conta-n", { textContent: String(N).padStart(2, "0") });
        void document.fonts.ready.then(() => dar(true));
        return;
      }
      const conta = { n: 0 };
      const abre = window.innerWidth < 761 ? 50 : 84; // no celular o leque fecha para caber na tela
      const leque = (i: number) => ((i / (N - 1)) - 0.5) * abre; // −42° … 42°
      gsap.set(cs, { transformOrigin: "50% 135%", y: "120vh", rotation: (i) => ruido(i, 4) * 30, zIndex: (i) => i });
      gsap.set(".ia-nome > span", { yPercent: 110 });
      const tl = gsap.timeline();
      tl.to(cs, { y: 0, x: 0, rotation: leque, duration: 0.9, ease: "expo.out", stagger: 0.028 })
        .to(conta, {
          n: N, duration: 0.028 * N + 0.4, ease: "none",
          onUpdate: () => { const t = el.querySelector(".ia-conta-n"); if (t) t.textContent = String(Math.round(conta.n)).padStart(2, "0"); },
        }, 0)
        .to(cs, { x: (i) => MONTE[i].x, y: (i) => MONTE[i].y, rotation: (i) => MONTE[i].r, duration: 1, ease: "expo.inOut", stagger: { each: 0.012, from: "end" } }, "+=0.25")
        .to(".ia-nome > span", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, "-=0.7")
        .fromTo(".ia-leitura", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.3");

      /* o scroll só assume depois da entrada — senão as duas brigam pelo mesmo transform */
      tl.eventCallback("onComplete", () => {
        pronto.current = true;
        ctx.add(() => dar(false));
      });
    }, el);
    return () => ctx.revert();
  }, []);

  /* EXTRA — hover numa linha da lista abre em leque a pilha que pousou nela.
     O leque mexe na FACE (filha), não na carta: a carta é do scrub do scroll. */
  useEffect(() => {
    const lista = document.querySelector<HTMLElement>(".ix-lista");
    if (!lista || prefersReducedMotion() || !matchMedia("(hover: hover)").matches) return;
    let aberto = -1;
    const faces = (p: number) => Array.from(raiz.current?.querySelectorAll<HTMLElement>(`.ia-carta[data-p="${p}"] .ia-face`) ?? []);
    const leque = (p: number, abre: boolean) =>
      faces(p).forEach((f, j) => gsap.to(f, { xPercent: abre ? -j * 62 : 0, rotation: abre ? -j * 3 : 0, duration: abre ? 0.55 : 0.4, ease: abre ? "expo.out" : "power3.inOut", overwrite: "auto" }));
    const sobre = (e: PointerEvent) => {
      const li = (e.target as HTMLElement).closest(".ix-lista > li");
      const p = li ? Array.prototype.indexOf.call(lista.children, li) : -1;
      if (p === aberto) return;
      if (aberto >= 0) leque(aberto, false);
      aberto = p;
      if (p >= 0) leque(p, true);
    };
    const sai = () => { if (aberto >= 0) leque(aberto, false); aberto = -1; };
    lista.addEventListener("pointerover", sobre);
    lista.addEventListener("pointerleave", sai);
    return () => { lista.removeEventListener("pointerover", sobre); lista.removeEventListener("pointerleave", sai); };
  }, []);

  /* x do cursor/dedo sobre a mesa → carta do topo */
  /* o monte só se lê inteiro: depois que o scroll começa a dar as cartas, a mesa descansa */
  const intacto = () => pronto.current && window.scrollY < 4;
  const mover = (clientX: number) => {
    if (!intacto()) return;
    const mesa = raiz.current?.querySelector<HTMLElement>(".ia-mesa");
    if (!mesa) return;
    const r = mesa.getBoundingClientRect();
    const t = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width));
    ler(Math.floor(t * N));
  };
  /* saiu da mesa: o leque fecha de volta no monte, com a escolhida no topo */
  const fechar = () => {
    if (!intacto()) return;
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
        onClick={() => intacto() && navegar(`/work/${CARTAS[ativa.current].slug}`)}
        role="link"
        aria-label={`Open ${c.titulo}`}
      >
        {CARTAS.map((k, i) => (
          <div key={k.src} className="ia-carta" data-i={i} data-p={k.p} ref={(n) => { if (n) cartas.current[i] = n; }}>
            <div className="ia-face">
              <img src={k.src} alt="" decoding="async" draggable={false} />
            </div>
          </div>
        ))}
      </div>
      <p className="p-marca ia-leitura" aria-live="polite">
        <span>{String(topo + 1).padStart(2, "0")}</span> {c.titulo} · {c.ano} <span className="ia-ver">→ View case</span>
      </p>
    </div>
  );
}
