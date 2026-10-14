import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import { REEL } from "../../content/reel";
import { useCena } from "./Heroes";
import UmaIndice from "./UmaIndice";
import "../../styles/reels.css";

/**
 * HERO = SÓ O SHOWREEL (13/10, "apenas showreel em full na hero… ou showreel centralizado").
 *   FULL    o vídeo cobre a tela, com overlay preto; no scroll sobe com a página e cresce por dentro (mecânica TWKS); clique abre o reel com som
 *   CENTRO  o vídeo abre centrado no papel; o scroll cresce até a tela cheia
 * O reel sai da seção 4 do Índice (semReel): ele já está na hero.
 */
function Video({ ritmo = 1 }: { ritmo?: number }) {
  return (
    <video
      className="rx-video"
      src={REEL.video ?? undefined}
      poster={REEL.capa.src}
      autoPlay
      muted
      loop
      playsInline
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = ritmo; }}
      onPlay={(e) => { e.currentTarget.playbackRate = ritmo; }}
      ref={(el) => {
        if (!el) return;
        el.muted = true;
        el.playbackRate = ritmo;
        void el.play().catch(() => {});
      }}
    />
  );
}

export function HeroReelFull() {
  const [aberto, setAberto] = useState(false);
  const selo = useRef<HTMLDivElement | null>(null);
  const tela = useRef<HTMLVideoElement | null>(null);

  /* TWKS: sem pin — a seção sobe com a página e o vídeo, por dentro, cresce e escurece ao sair */
  const ref = useCena((el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
      .to(".rx-quadro .rx-video", { scale: 1.35, yPercent: 18, ease: "none", duration: 1 }, 0)
      .to(".rx-sombra", { opacity: 0.8, ease: "none", duration: 1 }, 0)
      .to(".rx-legenda", { autoAlpha: 0, duration: 0.25 }, 0);
    /* menu branco chapado só enquanto ele está sobre o reel; no papel volta ao difference */
    ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top+=90", toggleClass: { targets: document.documentElement, className: "rx-sobre" } });
    /* TWKS: o menu nasce no meio da tela e sobe 1:1 com a página até atracar no topo */
    const menu = document.querySelector<HTMLElement>(".p-menu");
    if (menu) {
      const desce = () => window.innerHeight / 2 - menu.getBoundingClientRect().height / 2 - menu.offsetTop;
      gsap.fromTo(menu, { y: desce }, { y: 0, ease: "none", immediateRender: true,
        scrollTrigger: { start: 0, end: desce, scrub: true, invalidateOnRefresh: true } });
    }
  });

  /* o selo segue o mouse (só desktop) */
  useEffect(() => {
    const s = selo.current;
    if (!s) return;
    const x = gsap.quickTo(s, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(s, "y", { duration: 0.45, ease: "power3" });
    const mover = (e: PointerEvent) => { x(e.clientX); y(e.clientY); };
    window.addEventListener("pointermove", mover);
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  /* abrir: som, do início, scroll travado · fechar: clique ou Esc */
  useEffect(() => {
    const lenis = getLenis();
    if (!aberto) { lenis?.start(); return; }
    lenis?.stop();
    const v = tela.current;
    if (v) { v.currentTime = 0; v.muted = false; void v.play().catch(() => {}); }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const selar = (on: boolean) => gsap.to(selo.current, { scale: on ? 1 : 0, autoAlpha: on ? 1 : 0, duration: 0.35, ease: "power3.out" });

  return (
    <section ref={ref} className="hx-cena rx rx-full p-capa-full">
      <div className="rx-quadro" onPointerEnter={() => selar(true)} onPointerLeave={() => selar(false)} onClick={() => setAberto(true)}>
        <Video ritmo={0.6} />
        <div className="rx-sombra" />
      </div>
      <p className="rx-legenda p-marca">
        <button type="button" className="rx-play" onClick={() => setAberto(true)}>▶ Play reel</button>
        <span className="rx-scroll" aria-hidden><i /></span>
      </p>
      {createPortal(
        <>
          <div ref={selo} className="rx-selo p-marca" aria-hidden>{aberto ? "Fechar" : "Play reel"}</div>
          {aberto && (
            <div className="rx-player" onClick={() => setAberto(false)} onPointerEnter={() => selar(true)}>
              <video ref={tela} src={REEL.video ?? undefined} playsInline onEnded={() => setAberto(false)} />
              <button type="button" className="rx-fechar p-marca" onClick={() => setAberto(false)}>Fechar</button>
            </div>
          )}
        </>,
        document.body,
      )}
    </section>
  );
}

export const ReelFull = () => <UmaIndice inicio={<HeroReelFull />} semReel />;
