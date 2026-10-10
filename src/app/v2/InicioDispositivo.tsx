import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarVisorFluido, type VisorFluido } from "../../lib/visorFluido";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import { corDe } from "../../content/cores";
import "../../styles/inicio-dispositivo.css";

/**
 * INÍCIO C — O DISPOSITIVO (10/10, família C da pesquisa `~/dev/_inbox/ref-bredoff-hero/`).
 *
 * A abertura é um SINTONIZADOR: uma régua de fio com os 8 projetos como canais e
 * uma agulha. Arrastar a régua, rolar a roda sobre ela ou usar ← → sintoniza; o
 * visor troca a peça com o fluido do `visorFluido` (receita 4, a do hover da
 * lista), o leitor à esquerda atualiza e a cor do projeto tinge o papel devagar.
 * "Mateus Bredoff" é a etiqueta do aparelho. Clique no visor ou Enter abre o case.
 *
 * ⚠ A roda só sintoniza com o cursor SOBRE a régua, e solta a página nas pontas
 *   (canal 01 subindo, 08 descendo) — senão a hero vira uma armadilha de scroll.
 */
const N = WORK.length;
const capa = (i: number) => PECAS[WORK[i].slug]?.[0] ?? WORK[i].cover?.src;
const nome = (i: number) => WORK[i].title.replace("®", "").trim();

export function InicioDispositivo() {
  const navegar = useNavigate();
  const raiz = useRef<HTMLDivElement | null>(null);
  const regua = useRef<HTMLDivElement | null>(null);
  const agulha = useRef<HTMLDivElement | null>(null);
  const quadro = useRef<HTMLDivElement | null>(null);
  const visor = useRef<VisorFluido | null>(null);
  const pos = useRef({ v: 0 });
  const canalRef = useRef(0);
  const [canal, setCanal] = useState(0);
  const [semGL, setSemGL] = useState(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const geracao = useRef(0);
  const passo = useRef({ p: 0 });

  /* a agulha desenha a posição contínua; o canal é o inteiro mais próximo */
  const aplicar = () => {
    const el = agulha.current;
    if (el) el.style.left = `${(pos.current.v / (N - 1)) * 100}%`;
    const c = Math.round(pos.current.v);
    if (c !== canalRef.current) {
      canalRef.current = c;
      setCanal(c);
    }
  };
  const ir = (alvo: number, dur = 0.7) => {
    const v = Math.max(0, Math.min(N - 1, alvo));
    gsap.to(pos.current, { v, duration: prefersReducedMotion() ? 0 : dur, ease: "expo.out", overwrite: true, onUpdate: aplicar });
  };

  /* o visor WebGL vive enquanto o aparelho vive */
  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const v = criarVisorFluido(el, 4);
    visor.current = v;
    setSemGL(!v);
    if (!v) return;
    void v.aquecer(WORK.map((_, i) => capa(i)).filter(Boolean) as string[]);
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
      visor.current = null;
    };
  }, []);

  /* troca de canal: o fluido leva a peça nova (mesmo ciclo do HoverFluido, com as mesmas travas) */
  const anterior = useRef(-1);
  useLayoutEffect(() => {
    const v = visor.current;
    const src = capa(canal);
    raiz.current?.style.setProperty("--ic-cor", corDe(WORK[canal].slug));
    if (!v || !src) return;
    const dir = (canal >= anterior.current ? 1 : -1) as 1 | -1;
    anterior.current = canal;
    const meu = ++geracao.current;
    void v.garantir(src).then(() => {
      if (geracao.current !== meu) return;
      tween.current?.kill();
      v.resolver();
      v.acento(corDe(WORK[canal].slug));
      v.iniciar(src, dir);
      passo.current.p = 0;
      tween.current = gsap.to(passo.current, {
        p: 1,
        duration: prefersReducedMotion() ? 0 : 1.05,
        ease: "power3.inOut",
        onUpdate: () => v.progresso(passo.current.p),
        onComplete: () => {
          v.concluir();
          tween.current = null;
        },
      });
    });
  }, [canal, semGL]);

  /* operar: arrasto na régua (e no visor, no toque), roda sobre a régua, ← → */
  useEffect(() => {
    const r = regua.current;
    const raizEl = raiz.current;
    if (!r || !raizEl) return;
    const posDe = (x: number) => {
      const b = r.getBoundingClientRect();
      return ((x - b.left) / b.width) * (N - 1);
    };
    let arrastando = false;
    let alvo = 0; /* onde o dedo está — o snap usa isto, não o valor ainda em tween (que fica para trás) */
    const desce = (e: PointerEvent) => {
      /* nos rótulos o clique resolve (e a captura roubaria o click do botão) */
      if ((e.target as HTMLElement).closest(".ic-marca")) return;
      arrastando = true;
      r.setPointerCapture(e.pointerId);
      gsap.killTweensOf(pos.current);
      alvo = Math.max(0, Math.min(N - 1, posDe(e.clientX)));
      gsap.to(pos.current, { v: alvo, duration: 0.35, ease: "power3.out", onUpdate: aplicar });
    };
    const move = (e: PointerEvent) => {
      if (!arrastando) return;
      alvo = Math.max(0, Math.min(N - 1, posDe(e.clientX)));
      gsap.to(pos.current, { v: alvo, duration: 0.25, ease: "power3.out", overwrite: true, onUpdate: aplicar });
    };
    const sobe = () => {
      if (!arrastando) return;
      arrastando = false;
      ir(Math.round(alvo), 0.5);
    };
    let acumulado = 0;
    let solta: number | undefined;
    /* a página estava rolando e a régua passou sob o cursor: a roda segue sendo da página */
    let rodaFora = 0;
    const marcaFora = () => (rodaFora = performance.now());
    const roda = (e: WheelEvent) => {
      if (performance.now() - rodaFora < 350) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const c = canalRef.current;
      if ((d < 0 && c === 0) || (d > 0 && c === N - 1)) return; /* nas pontas a página segue */
      e.preventDefault();
      e.stopPropagation();
      acumulado += d;
      if (Math.abs(acumulado) > 60) {
        ir(c + Math.sign(acumulado));
        acumulado = 0;
      }
      window.clearTimeout(solta);
      solta = window.setTimeout(() => (acumulado = 0), 180);
    };
    const tecla = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      const b = raizEl.getBoundingClientRect();
      if (b.bottom < 0 || b.top > window.innerHeight) return; /* só com o aparelho na tela */
      if (e.key === "ArrowRight") ir(canalRef.current + 1);
      else if (e.key === "ArrowLeft") ir(canalRef.current - 1);
      else if (e.key === "Enter" && !(e.target as HTMLElement)?.closest("a, button")) navegar(`/work/${WORK[canalRef.current].slug}`);
      else return;
      e.preventDefault();
    };
    r.addEventListener("pointerdown", desce);
    r.addEventListener("pointermove", move);
    r.addEventListener("pointerup", sobe);
    r.addEventListener("pointercancel", sobe);
    r.addEventListener("wheel", roda, { passive: false });
    window.addEventListener("keydown", tecla);
    window.addEventListener("wheel", marcaFora, { passive: true });
    return () => {
      window.removeEventListener("wheel", marcaFora);
      r.removeEventListener("pointerdown", desce);
      r.removeEventListener("pointermove", move);
      r.removeEventListener("pointerup", sobe);
      r.removeEventListener("pointercancel", sobe);
      r.removeEventListener("wheel", roda);
      window.removeEventListener("keydown", tecla);
      window.clearTimeout(solta);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* no toque, o visor também sintoniza: varrer de lado troca de canal */
  const toque = useRef<{ x: number; y: number } | null>(null);

  /* entrada: a régua desenha, a agulha varre até o 03 e volta — mostra que é para mexer */
  useLayoutEffect(() => {
    aplicar();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(".ic-etiqueta > *", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 })
        .fromTo(".ic-fio", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "expo.inOut" }, 0.1)
        .fromTo(".ic-marca", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.5)
        .fromTo(".ic-visor", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.3)
        .fromTo(".ic-leitor > *", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0.9)
        .to(pos.current, { v: 2, duration: 0.9, ease: "power2.inOut", onUpdate: aplicar }, 1.5)
        .to(pos.current, { v: 0, duration: 1.1, ease: "expo.out", onUpdate: aplicar }, 2.6);
    }, raiz);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const w = WORK[canal];
  return (
    <div ref={raiz} className="ic">
      <div className="ic-palco">
        <div className="ic-esq">
          <h1 className="ic-etiqueta">
            <span>Mateus</span> <span>Bredoff</span>
          </h1>
          <div className="ic-leitor" aria-live="polite">
            <p className="ic-num">{String(canal + 1).padStart(2, "0")}</p>
            <p className="ic-titulo">{nome(canal)}</p>
            <p className="p-marca ic-ficha">
              {w.disciplines.join(" · ")} — {w.year}
            </p>
            <p className="p-marca ic-dica">Tune ← → · Enter opens the case</p>
          </div>
        </div>
        <button
          type="button"
          className="ic-visor"
          aria-label={`Open ${nome(canal)}`}
          onClick={() => navegar(`/work/${w.slug}`)}
          onTouchStart={(e) => (toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const t = toque.current;
            toque.current = null;
            if (!t) return;
            const dx = e.changedTouches[0].clientX - t.x;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.changedTouches[0].clientY - t.y)) {
              ir(canalRef.current + (dx < 0 ? 1 : -1));
            }
          }}
        >
          {semGL ? <img src={capa(canal)} alt="" draggable={false} /> : null}
          <div ref={quadro} className="ic-quadro" />
        </button>
      </div>

      <div ref={regua} className="ic-regua" role="slider" aria-label="Project tuner" aria-valuemin={1} aria-valuemax={N} aria-valuenow={canal + 1} aria-valuetext={nome(canal)} tabIndex={0}>
        <div className="ic-fio" />
        {WORK.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            className={`ic-marca${i === canal ? " is-on" : ""}`}
            style={{ left: `${(i / (N - 1)) * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              ir(i);
            }}
          >
            <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
            <span className="ic-marca-nome">{nome(i)}</span>
          </button>
        ))}
        <div ref={agulha} className="ic-agulha" />
      </div>
    </div>
  );
}
