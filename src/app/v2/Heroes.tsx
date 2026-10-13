import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarVisorFluido } from "../../lib/visorFluido";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import UmaIndice from "./UmaIndice";
import "../../styles/heroes.css";

/**
 * TRÊS HEROES DE POSTURA DIFERENTE (13/10, "hero ainda ruim, não gostei de nada" + "me entregue opções").
 * O 3º início reprovado era um truque com a tipografia do nome. Aqui o nome sai de cena:
 *   1 TRABALHO PRIMEIRO  peça em tela cheia; o scroll troca as peças pelo fluido WebGL (receita Arco)
 *   2 FRASE              o que ele faz numa frase serifada; as peças abrem ENTRE as palavras
 *   3 GRADE VIVA         todas as peças numa grade; o scroll leva a câmera até uma ocupar a tela
 * Cada uma entra no lugar da hero do Índice (prop `inicio`): ofício, lista e resto seguem iguais.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const nome = (i: number) => WORK[i].title.replace("®", "").trim();
const CAPAS = WORK.map((w) => PECAS[w.slug][0]);

/* a hero sangra até as bordas da tela: anula o recuo da Prancha, medido */
function sangrar(el: HTMLElement) {
  el.style.marginTop = el.style.marginLeft = "0px";
  const r = el.getBoundingClientRect();
  el.style.marginTop = `${-(r.top + window.scrollY)}px`;
  el.style.marginLeft = `${-r.left}px`;
  el.style.width = `${document.documentElement.clientWidth}px`;
}

/* o App mata os ScrollTriggers ao montar a rota: tudo nasce depois das fontes */
function useCena(montar: (el: HTMLElement) => void) {
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

/* ── 1 · TRABALHO PRIMEIRO ─────────────────────────────────────────────── */
function HeroTrabalho() {
  const [i, setI] = useState(0);
  const tela = useRef<HTMLDivElement | null>(null);
  const ref = useCena((el) => {
    const n = CAPAS.length;
    const v = tela.current ? criarVisorFluido(tela.current, 4) : null;
    let base = -1;
    const ir = (P: number) => {
      const f = Math.min(P, 0.9999) * (n - 1);
      const k = Math.floor(f);
      setI(Math.round(f));
      if (!v) return;
      if (k !== base) { v.resolver(); v.iniciar(CAPAS[k], 1); v.progresso(1); v.concluir(); v.iniciar(CAPAS[k + 1], 1); base = k; }
      v.progresso(f - k);
    };
    let ultimo = performance.now();
    const desenha = () => { const a = performance.now(); v?.passo(Math.min((a - ultimo) / 1000, 0.05)); ultimo = a; };
    if (v) { v.acento("#e9e3e1"); gsap.ticker.add(desenha); }
    void (v ? v.aquecer(CAPAS) : Promise.resolve()).then(() => {
      ir(0);
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: `+=${n * 70}%`, pin: true, scrub: 0.6 } })
        .to({ p: 0 }, { p: 1, duration: 1, ease: "none", onUpdate() { ir(this.targets()[0].p); } })
        /* a última peça encolhe até a altura de uma linha e cede o lugar à lista */
        .to(".h1-palco", { clipPath: "inset(46% 3% 46% 3%)", duration: 0.35, ease: "power2.inOut" })
        .to(".h1-legenda, .h1-dica", { autoAlpha: 0, duration: 0.1 }, "<")
        .to(".h1-palco", { autoAlpha: 0, duration: 0.1 });
    });
    return () => { gsap.ticker.remove(desenha); v?.destruir(); };
  });
  return (
    <section ref={ref} className="hx-cena h1 p-capa-full">
      <div className="h1-palco">
        {/* sem WebGL, a capa fica parada */}
        <img className="h1-plano" src={CAPAS[i]} alt="" draggable={false} />
        <div ref={tela} className="h1-tela" />
      </div>
      <p className="h1-legenda p-marca">
        <span>{NUM(i)} / {String(CAPAS.length).padStart(2, "0")}</span>
        <span>{nome(i)}</span>
        <span>{WORK[i].disciplines[0]} — {WORK[i].year}</span>
      </p>
      <p className="h1-dica p-marca">Scroll</p>
    </section>
  );
}

/* ── 2 · FRASE DE POSICIONAMENTO ───────────────────────────────────────── */
/* a frase sai do texto dele ("built with intention", "memorable") */
const FRASE: (string | number)[] = ["Visual", "identities", 0, "built", "with", "intention,", 1, "for", "brands", "that", "want", "to", "be", 2, "remembered."];
function HeroFrase() {
  const ref = useCena((el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=260%", pin: true, scrub: 0.6 } });
    tl.fromTo(".h2-p", { color: "rgba(20,32,31,0.14)" }, { color: "#14201f", stagger: 0.08, duration: 0.3 }, 0);
    el.querySelectorAll<HTMLElement>(".h2-vaga").forEach((vaga, k) => {
      const t = 0.25 + k * 0.35;
      tl.fromTo(vaga, { width: 0 }, { width: "1.9em", duration: 0.45, ease: "power3.inOut" }, t);
      /* dentro da vaga as peças correm de baixo para cima até o fim */
      tl.fromTo(vaga.querySelector(".h2-fita"), { yPercent: 0 }, { yPercent: -75, duration: 1.6 - t, ease: "none" }, t);
    });
    tl.to(".h2-frase", { yPercent: -30, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, ">-0.05");
  });
  let vaga = 0;
  return (
    <section ref={ref} className="hx-cena h2">
      <p className="h2-rotulo p-marca">Mateus Bredoff — Brand designer &amp; art director</p>
      <h1 className="h2-frase">
        {FRASE.map((w, k) =>
          typeof w === "string" ? (
            <span key={k} className="h2-p">{w} </span>
          ) : (
            <span key={k} className="h2-vaga" aria-hidden="true">
              <span className="h2-fita">
                {[0, 1, 2, 3].map((j) => {
                  const src = CAPAS[(vaga * 3 + j) % CAPAS.length];
                  return <img key={j} src={src} alt="" draggable={false} />;
                })}
              </span>
              {(vaga++, null)}
            </span>
          ),
        )}
      </h1>
      <p className="h2-dica p-marca">Scroll</p>
    </section>
  );
}

/* ── 3 · GRADE VIVA ────────────────────────────────────────────────────── */
const COLS = 7, LINHAS = 5, ALVO = 17; /* o alvo é o centro da grade */
const TODAS = Object.values(PECAS).flat();
function HeroGrade() {
  const ref = useCena((el) => {
    const grade = el.querySelector<HTMLElement>(".h3-grade")!;
    const alvo = grade.children[ALVO] as HTMLElement;
    /* a câmera: escala e desvio que levam o alvo a cobrir a tela, medidos sem transform */
    const cam = () => {
      const g = grade.offsetWidth, a = alvo.offsetWidth, h = alvo.offsetHeight;
      const s = Math.max(window.innerWidth / a, window.innerHeight / h);
      /* o alvo mede-se na grade (will-change a faz offsetParent); a grade, no quadro.
         A escala gira em torno do centro da grade. */
      const q = grade.parentElement!;
      const dx = alvo.offsetLeft + a / 2 - g / 2, dy = alvo.offsetTop + h / 2 - grade.offsetHeight / 2;
      const gx = grade.offsetLeft + g / 2, gy = grade.offsetTop + grade.offsetHeight / 2;
      return { s, x: q.clientWidth / 2 - gx - dx * s, y: q.clientHeight / 2 - gy - dy * s };
    };
    const cols = gsap.utils.toArray<HTMLElement>(".h3-peca");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=280%", pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    /* as colunas descem em velocidades diferentes e se alinham quando a câmera chega */
    tl.fromTo(cols, { y: (k: number) => ((k % COLS) - 3) * 18 * ((k % 2) ? 1 : -1) }, { y: 0, duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(".h3-titulo", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25 }, 0)
      .to(grade, { scale: () => cam().s, x: () => cam().x, y: () => cam().y, duration: 1, ease: "power3.inOut" }, 0.1)
      .to(".h3-peca:not(.is-alvo)", { autoAlpha: 0, duration: 0.3 }, 0.75)
      .fromTo(".h3-ficha", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 1.05)
      .to({}, { duration: 0.3 })
      .to(".h3-quadro", { clipPath: "inset(46% 3% 46% 3%)", duration: 0.35, ease: "power2.inOut" })
      .to(".h3-ficha", { autoAlpha: 0, duration: 0.1 }, "<")
      .to(".h3-quadro", { autoAlpha: 0, duration: 0.1 });
  });
  return (
    <section ref={ref} className="hx-cena h3 p-capa-full">
      <div className="h3-quadro">
        <div className="h3-grade" style={{ ["--cols" as string]: COLS }}>
          {Array.from({ length: COLS * LINHAS }, (_, k) => (
            <img key={k} className={`h3-peca${k === ALVO ? " is-alvo" : ""}`} src={k === ALVO ? CAPAS[0] : TODAS[(k * 5) % TODAS.length]} alt="" draggable={false} />
          ))}
        </div>
      </div>
      <p className="h3-titulo p-marca">{String(TODAS.length)} pieces · {WORK.length} projects — Scroll</p>
      <p className="h3-ficha p-marca"><span>01</span><span>{nome(0)}</span><span>{WORK[0].year}</span></p>
    </section>
  );
}

export const Hero1 = () => <UmaIndice inicio={<HeroTrabalho />} />;
export const Hero2 = () => <UmaIndice inicio={<HeroFrase />} />;
export const Hero3 = () => <UmaIndice inicio={<HeroGrade />} />;
