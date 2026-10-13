import { gsap } from "../../lib/gsap";
import { REEL } from "../../content/reel";
import { useCena } from "./Heroes";
import UmaIndice from "./UmaIndice";
import "../../styles/reels.css";

/**
 * HERO = SÓ O SHOWREEL (13/10, "apenas showreel em full na hero… ou showreel centralizado").
 *   FULL    o vídeo cobre a tela; o scroll recolhe as bordas e a lista entra embaixo
 *   CENTRO  o vídeo abre centrado no papel; o scroll cresce até a tela cheia
 * O reel sai da seção 4 do Índice (semReel): ele já está na hero.
 */
function Video() {
  return (
    <video
      className="rx-video"
      src={REEL.video ?? undefined}
      poster={REEL.capa.src}
      autoPlay
      muted
      loop
      playsInline
      ref={(el) => {
        if (!el) return;
        el.muted = true;
        void el.play().catch(() => {});
      }}
    />
  );
}

function HeroReelFull() {
  const ref = useCena((el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=90%", pin: true, scrub: 0.6 } })
      .to(".rx-quadro", { clipPath: "inset(14% 4% 14% 4% round 6px)", ease: "power2.inOut", duration: 1 })
      .to(".rx-legenda", { autoAlpha: 0, duration: 0.3 }, 0);
  });
  return (
    <section ref={ref} className="hx-cena rx rx-full p-capa-full">
      <div className="rx-quadro"><Video /></div>
      <p className="rx-legenda p-marca">
        <span>Showreel {REEL.ano}</span>
        <span>Scroll</span>
      </p>
    </section>
  );
}

function HeroReelCentro() {
  const ref = useCena((el) => {
    const caixa = el.querySelector<HTMLElement>(".rx-caixa")!;
    const sx = () => window.innerWidth / caixa.offsetWidth;
    const sy = () => window.innerHeight / caixa.offsetHeight;
    const s = () => Math.max(sx(), sy());
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=140%", pin: true, scrub: 0.6, invalidateOnRefresh: true } })
      .to(caixa, { scaleX: sx, scaleY: sy, borderRadius: 0, ease: "power2.inOut", duration: 1 })
      /* contra-escala: o vídeo fica com escala uniforme (cover), sem distorcer */
      .to(".rx-caixa .rx-video", { scaleX: () => s() / sx(), scaleY: () => s() / sy(), ease: "power2.inOut", duration: 1 }, 0)
      .to(".rx-legenda", { autoAlpha: 0, duration: 0.3 }, 0)
      .to({}, { duration: 0.4 });
  });
  return (
    <section ref={ref} className="hx-cena rx rx-centro">
      <div className="rx-caixa"><Video /></div>
      <p className="rx-legenda p-marca">
        <span>Showreel {REEL.ano}</span>
        <span>Scroll</span>
      </p>
    </section>
  );
}

export const ReelFull = () => <UmaIndice inicio={<HeroReelFull />} semReel />;
export const ReelCentro = () => <UmaIndice inicio={<HeroReelCentro />} semReel />;
