import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { RcMoldura, RcRodape, RC, nome, capa } from "./RolinCMoldura";
import { montarCapasGl } from "./rolinCGl";
import { scrollToElement } from "../../lib/lenis";

/**
 * ONE PAGE — "ROLIN C" (15/10). Topo idêntico ao da Rolin (nome | disciplina, 11px caixa alta).
 * O resto muda: topo NÃO é fixo (nada passa por cima de imagem), sem fio e sem pílula;
 * os trabalhos são um catálogo escalonado na grade de 4 — cada peça ocupa 2 colunas,
 * alternando o lado, com a legenda FORA da imagem, embaixo. Celular: pilha de uma coluna.
 */
const ANOS = `’${String(Math.min(...WORK.map((w) => w.year))).slice(2)} — ’${String(Math.max(...WORK.map((w) => w.year))).slice(2)}`;

export default function RolinC() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);
  const navegar = useNavigate();
  /* ABOUT (href "#about" de propósito: o obturador global de TransicaoRota só pega href "/…"): desce até o fim, o retrato do rodapé abre até a tela cheia e a About entra por ele (15/10) */
  const irAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const pe = raiz.current?.querySelector<HTMLElement>("#rc-info");
    const foto = pe?.querySelector<HTMLElement>(".rc-retrato");
    if (!pe || !foto || prefersReducedMotion()) { navegar(`${RC}/about`); return; }
    scrollToElement(pe);
    const abrir = () => {
      const r = foto.getBoundingClientRect();
      const veu = foto.cloneNode(true) as HTMLElement;
      Object.assign(veu.style, { position: "fixed", zIndex: "60", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: "0" });
      /* fora do .rc-pe o CSS da foto não vale: o clone leva o enquadramento inline,
         e anda do corte do rodapé (50% 30%) para o da hero da About (50% 22%) */
      const im = veu.querySelector("img")!;
      Object.assign(im.style, { display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" });
      document.body.appendChild(veu);
      gsap.to(im, { objectPosition: "50% 22%", duration: 0.9, ease: "power3.inOut" });
      gsap.to(veu, { left: 0, top: 0, width: "100vw", height: "100vh", duration: 0.9, ease: "power3.inOut",
        onComplete: () => { navegar(`${RC}/about`); gsap.to(veu, { opacity: 0, duration: 0.35, delay: 0.25, ease: "power2.out", onComplete: () => veu.remove() }); } });
    };
    /* espera o scroll chegar (o rodapé encosta no topo) antes de abrir */
    const ini = performance.now();
    const checar = () => {
      if (Math.abs(pe.getBoundingClientRect().top) < 2 || performance.now() - ini > 1800) abrir();
      else requestAnimationFrame(checar);
    };
    requestAnimationFrame(checar);
  };
  const [ativo, setAtivo] = useState(0);
  const selo = useRef<HTMLSpanElement | null>(null);

  /* tags da legenda e corte foto | ficha do rodapé no centro da tela */
  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const medir = () => {
      /* tags da legenda começam no CENTRO da tela: distância da borda da legenda até o meio */
      const leg = el.querySelector<HTMLElement>(".rc-legenda");
      if (leg) el.style.setProperty("--rc-centro", `${document.documentElement.clientWidth / 2 - leg.getBoundingClientRect().left}px`);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let ctx: gsap.Context | null = null;
    let desmontarGl: (() => void) | null = null;
    let limparSelo: (() => void) | null = null;
    let vivo = true;
    const reduz = prefersReducedMotion();
    /* o App mata os ScrollTriggers no effect da rota: nascer dois frames depois das fontes */
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        /* a peça no meio da tela acende na lista lateral */
        gsap.utils.toArray<HTMLElement>(".rc-peca").forEach((peca, i) => {
          ScrollTrigger.create({ trigger: peca, start: "top center", end: "bottom+=96 center", onToggle: (t) => t.isActive && setAtivo(i) });
        });
        /* selo VIEW PROJECT que segue o cursor sobre a capa (desktop) */
        const v = selo.current;
        if (v && matchMedia("(hover: hover) and (pointer: fine) and (min-width: 64rem)").matches) {
          const dur = reduz ? 0 : 0.35;
          const xTo = gsap.quickTo(v, "x", { duration: dur, ease: "power3.out" });
          const yTo = gsap.quickTo(v, "y", { duration: dur, ease: "power3.out" });
          let visivel = false;
          const mover = (e: PointerEvent) => { if (!visivel) entra(e); xTo(e.clientX); yTo(e.clientY); };
          const entra = (e: PointerEvent) => {
            visivel = true;
            gsap.set(v, { x: e.clientX, y: e.clientY });
            gsap.to(v, { autoAlpha: 1, scale: 1, duration: reduz ? 0 : 0.2, ease: "power2.out", overwrite: "auto" });
          };
          const sai = () => (visivel = false, gsap.to(v, { autoAlpha: 0, scale: 0.85, duration: reduz ? 0 : 0.12, ease: "power2.out", overwrite: "auto" }));
          gsap.set(v, { autoAlpha: 0, scale: 0.85 });
          gsap.utils.toArray<HTMLElement>(".rc-quadro").forEach((q) => {
            q.addEventListener("pointerenter", entra); q.addEventListener("pointermove", mover); q.addEventListener("pointerleave", sai);
          });
          addEventListener("scroll", sai, { passive: true });
          limparSelo = () => {
            gsap.utils.toArray<HTMLElement>(".rc-quadro").forEach((q) => {
              q.removeEventListener("pointerenter", entra); q.removeEventListener("pointermove", mover); q.removeEventListener("pointerleave", sai);
            });
            removeEventListener("scroll", sai);
          };
        }
        if (reduz) return;
        gsap.utils.toArray<HTMLElement>(".rc-quadro").forEach((q) => {
          gsap.fromTo(q, { clipPath: "inset(14% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
          gsap.fromTo(q.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
        });
      }, el);
      ScrollTrigger.refresh();
      if (!reduz) desmontarGl = montarCapasGl(el);
    })));
    return () => { vivo = false; ctx?.revert(); desmontarGl?.(); limparSelo?.(); };
  }, []);

  return (
    <div ref={raiz} className="rc">
      <RcMoldura onAbout={irAbout} />

      <span ref={selo} className="rc-view" aria-hidden="true">View project</span>

      <div className="rc-palco">
        <aside className="rc-lado">
          <div className="rc-lado-bloco">
            <div id="rc-work" className="rc-lado-topo">
              <p>Selected work</p>
              <p className="rc-quieto">{ANOS}</p>
            </div>
            <ol className="rc-indice">
              {WORK.map((w, i) => (
                <li key={w.slug}>
                  <a href={`#rc-peca-${i}`} className={i === ativo ? "is-ativo" : undefined}
                    onClick={(e) => { e.preventDefault(); const alvo = document.getElementById(`rc-peca-${i}`); if (alvo) scrollToElement(alvo, -15); }}>
                    {nome(w.title)}
                  </a>
                </li>
              ))}
            </ol>
            <Link to={`${RC}/work`} className="rc-todos">All projects</Link>
          </div>
        </aside>

        <ol className="rc-lista">
          {WORK.map((w, i) => (
            <li key={w.slug} id={`rc-peca-${i}`} className="rc-peca">
              <Link to={`${RC}/work/${w.slug}`}>
                <span className="rc-quadro">
                  <img src={capa(w).src} srcSet={capa(w).srcSet}
                    width={w.cover.w} height={w.cover.h}
                    alt={capa(w).alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" draggable={false} />
                </span>
                <span className="rc-legenda">
                  <span className="rc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{nome(w.title)}</span>
                  <span className="rc-quieto rc-tag">{w.disciplines.join(", ")}</span>
                  <span className="rc-quieto rc-ano">{w.year}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <aside className="rc-dir">
          <p className="rc-quieto rc-conta">{String(WORK.length).padStart(2, "0")} projects</p>
        </aside>
      </div>

      <RcRodape />
    </div>
  );
}
