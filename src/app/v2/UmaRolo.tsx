import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import "../../styles/uma-rolo.css";

/**
 * ONE PAGE — "O ROLO" (10/10, rota /v2/uma-rolo). "a revista não curti, outra ideia".
 *
 * Cinema. O trabalho é o protagonista e a página é uma sequência de PLANOS.
 * Recusa: densidade, grade de cards, texto corrido.
 *   1 ABERTURA   tinta, o nome numa linha, quieto; embaixo a CARTELA do rolo —
 *                os 8 títulos em mono; clicar num título rola até o plano dele.
 *   2 PLANOS     palco preso, um projeto por tela inteira. O próximo ENTRA por
 *                baixo como uma cortina (clip-path, scrub) enquanto o anterior
 *                recua e escurece. Legenda mono mínima; um fio de 1px é a
 *                barra do rolo. Clique = o case.
 *   3 INTERTÍTULO o "sobre" em três cartelas que se sucedem no centro.
 *   4 CRÉDITOS   as especialidades no formato de crédito de filme.
 *   5 CLÍMAX     o showreel nasce pequeno no centro e vai à TELA INTEIRA (caixa
 *                estica em x/y, vídeo contra-escala = cover) — e FICA; a página
 *                sobe por cima dele. Clique = som.
 *   6 FIM        "featured in" como créditos finais; o contato é o rodapé.
 */
const PASSO_GLOBAL = 1.45;
/* timeline dos planos: o plano i (≥1) termina de entrar em (i-1)·PASSO + 1; o total é (n-1)·PASSO */
const tempoDo = (i: number) => (i ? (i - 1) * PASSO_GLOBAL + 1 : 0);
/* o plano "atual" é o que já cobriu metade da tela */
const planoNo = (t: number, n: number) => Math.max(0, Math.min(n - 1, Math.floor((t - 0.5) / PASSO_GLOBAL) + 1));
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const titulo = (t: string) => t.replace("®", "").trim();
/* o intertítulo: a frase do sobre partida em três cartelas */
const CARTELAS = LEAD[0].split(/(?<=\.)\s+|,\s+(?=collaborating)/).map((s) => s.trim());

export default function UmaRolo() {
  useMetaRota();
  const [comSom, setComSom] = useState(false);
  const [atual, setAtual] = useState(0);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    let split: SplitText | null = null;
    let vivo = true;
    const ctx = gsap.context(() => {});
    void document.fonts.ready.then(() => {
      if (!vivo) return;
      ctx.add(() => {
        /* ABERTURA — o nome abre como obturador (do centro para as bordas) e a cartela sobe */
        split = SplitText.create(".rl-nome", { type: "words" });
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .fromTo(".rl-nome", { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.4, ease: "expo.inOut" })
          .fromTo(split.words, { letterSpacing: "0.04em" }, { letterSpacing: "-0.05em", duration: 1.6 }, 0)
          .fromTo(".rl-cartela li", { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.04 }, 0.8)
          .fromTo(".rl-abertura .rl-oficio", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1);

        gsap.matchMedia().add("(min-width: 761px)", () => {
          /* PLANOS — cada um entra por baixo como cortina; o de trás recua */
          const planos = gsap.utils.toArray<HTMLElement>(".rl-plano");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".rl-palco", start: "top top", end: () => `+=${(planos.length - 1) * PASSO_GLOBAL * window.innerHeight}`,
              pin: true, pinSpacing: true, scrub: 0.7, invalidateOnRefresh: true,
              onUpdate: (st) => setAtual(planoNo(st.progress * tl.duration(), planos.length)),
            },
          });
          /* cada plano: 1 de cortina + 0,45 parado inteiro (o plano precisa de tempo para ser visto) */
          const PASSO = PASSO_GLOBAL;
          planos.forEach((p, i) => {
            if (i === 0) return;
            const t = (i - 1) * PASSO;
            tl.fromTo(p, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, t)
              .fromTo(p.querySelector("img"), { scale: 1.25, yPercent: 8 }, { scale: 1.04, yPercent: 0, ease: "power2.out", duration: 1 }, t)
              /* o de trás só recua e apaga quando a cortina já cobriu metade — sem tela preta no meio */
              .to(planos[i - 1], { scale: 0.92, ease: "power2.in", duration: 0.7 }, t + 0.3)
              /* apaga pela opacidade da foto sobre o fundo escuro do palco — filter num plano de tela inteira falhava e pintava preto */
              .to(planos[i - 1].querySelector("img"), { opacity: 0.45, ease: "power2.in", duration: 0.7 }, t + 0.3);
          });
          tl.to({}, { duration: PASSO - 1 }); /* o último plano também fica parado; total = (n-1)·PASSO */
          tl.fromTo(".rl-barra", { scaleX: 1 / planos.length }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);

          /* INTERTÍTULO — três cartelas que se sucedem no centro */
          const cs = gsap.utils.toArray<HTMLElement>(".rl-cartela-txt");
          const it = gsap.timeline({
            scrollTrigger: { trigger: ".rl-inter", start: "top top", end: () => `+=${cs.length * window.innerHeight * 0.8}`, pin: true, pinSpacing: true, scrub: 0.6 },
          });
          cs.forEach((c, i) => {
            it.fromTo(c, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, i * 1.2);
            if (i < cs.length - 1) it.to(c, { autoAlpha: 0, y: -24, duration: 0.5 }, i * 1.2 + 0.85);
          });

          /* CLÍMAX — o reel vai do quadro pequeno à tela inteira e fica */
          const reel = document.querySelector<HTMLElement>(".rl-reel");
          const vaga = reel?.parentElement;
          const vid = reel?.querySelector("video");
          if (reel && vaga && vid) {
            const sx = () => window.innerWidth / vaga.offsetWidth;
            const sy = () => window.innerHeight / vaga.offsetHeight;
            const s = () => Math.max(sx(), sy());
            const dx = () => { const r = vaga.getBoundingClientRect(); return window.innerWidth / 2 - (r.left + r.width / 2); };
            gsap.timeline({
              scrollTrigger: { trigger: ".rl-climax", start: "top top", end: "+=120%", pin: true, pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true },
            })
              .to(reel, { scaleX: sx, scaleY: sy, x: dx, ease: "power2.inOut", duration: 1 })
              .to(vid, { scaleX: () => s() / sx(), scaleY: () => s() / sy(), ease: "power2.inOut", duration: 1 }, 0)
              .to(".rl-climax-cab", { autoAlpha: 0, duration: 0.3 }, 0)
              .to({}, { duration: 0.4 });
          }
        });

        /* CRÉDITOS — cada linha acende quando cruza o meio da tela, como num rolo de créditos */
        gsap.utils.toArray<HTMLElement>(".rl-credito").forEach((li) => {
          gsap.fromTo(li, { autoAlpha: 0.18 }, {
            autoAlpha: 1, ease: "none",
            scrollTrigger: { trigger: li, start: "top 85%", end: "top 55%", scrub: 0.5 },
          });
        });
      });
    });
    return () => {
      vivo = false;
      ctx.revert();
      split?.revert();
    };
  }, []);

  /* parallax mínimo no plano parado: a imagem respira com o cursor (±1,2%) */
  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia("(hover: hover)").matches) return;
    const mover = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -2.4;
      const y = (e.clientY / window.innerHeight - 0.5) * -2.4;
      gsap.to(".rl-plano-foto", { xPercent: x, yPercent: y, duration: 1.2, ease: "power3.out", overwrite: "auto" });
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  /* a cartela leva ao plano: rola até o ponto do pin onde aquele projeto está inteiro */
  const irPara = (i: number) => {
    const palco = document.querySelector<HTMLElement>(".rl-palco");
    if (!palco) return;
    const desk = window.matchMedia("(min-width: 761px)").matches && !prefersReducedMotion();
    const topo = palco.getBoundingClientRect().top + window.scrollY;
    const alvo = desk
      ? topo + tempoDo(i) * window.innerHeight /* 1 unidade da timeline = 1 tela de rolagem */
      : document.querySelectorAll<HTMLElement>(".rl-plano")[i].getBoundingClientRect().top + window.scrollY;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(alvo, { duration: 1.6 });
    else window.scrollTo({ top: alvo, behavior: "smooth" });
  };

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="completo">
      {/* ─ 1 · ABERTURA ─────────────────────────────────────────────────────── */}
      <section className="rl-abertura">
        <h1 className="rl-nome">Mateus Bredoff</h1>
        <p className="p-marca rl-oficio">Brand designer &amp; art director — Brazil, working worldwide</p>
        <ol className="rl-cartela" aria-label="Selected work">
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <button type="button" onClick={() => irPara(i)}>
                <span className="rl-cartela-n">{NUM(i)}</span>
                <span>{titulo(w.title)}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* ─ 2 · PLANOS ───────────────────────────────────────────────────────── */}
      <section className="rl-palco" aria-label="Work">
        {WORK.map((w, i) => (
          <Link key={w.slug} to={`/work/${w.slug}`} className="rl-plano" style={{ zIndex: i + 1 }}>
            <img
              className="rl-plano-foto"
              src={w.cover.src}
              srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              alt={w.cover.alt}
              loading="eager" /* lazy dentro do clip-path não carrega a tempo: o plano entrava preto */
              decoding="async"
              draggable={false}
            />
            <span className="rl-legenda p-marca">
              <span>{NUM(i)} / {NUM(WORK.length - 1)}</span>
              <span>{titulo(w.title)}</span>
              <span className="rl-legenda-quieta">{w.disciplines.join(" · ")} — {w.year}</span>
            </span>
          </Link>
        ))}
        <span className="rl-rodape p-marca" aria-hidden="true">
          <span>{NUM(atual)} — {titulo(WORK[atual].title)}</span>
          <span>View case →</span>
        </span>
        <span className="rl-barra" aria-hidden="true" />
      </section>

      {/* ─ 3 · INTERTÍTULO ──────────────────────────────────────────────────── */}
      <section className="rl-inter" aria-label="About">
        <p className="sr-only">{LEAD[0]}</p>
        {CARTELAS.map((c, i) => (
          <p key={i} className="rl-cartela-txt" aria-hidden="true">{c}</p>
        ))}
      </section>

      {/* ─ 4 · CRÉDITOS ─────────────────────────────────────────────────────── */}
      <section className="rl-creditos">
        <p className="p-marca rl-creditos-cab">What I do</p>
        <ol>
          {SERVICOS.map((s) => (
            <li key={s.nome} className="rl-credito">
              <span className="rl-credito-papel">{s.nome}</span>
              <span className="rl-credito-nome">{s.entrega}</span>
            </li>
          ))}
        </ol>
        <p className="p-corpo rl-creditos-corpo">{LEAD[1]}</p>
      </section>

      {/* ─ 5 · CLÍMAX ───────────────────────────────────────────────────────── */}
      {REEL.video ? (
        <section className="rl-climax">
          <div className="rl-climax-cab p-marca">
            <span>Showreel — {REEL.ano}</span>
            <button type="button" className="p-link" onClick={() => setComSom(true)}>Play with sound</button>
          </div>
          <div className="rl-reel-vaga">
            <button type="button" className="rl-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
              <video
                src={REEL.video}
                autoPlay
                muted
                loop
                playsInline
                poster={REEL.capa.src}
                ref={(el) => {
                  if (!el) return;
                  el.muted = true;
                  void el.play().catch(() => {});
                }}
              />
            </button>
          </div>
        </section>
      ) : null}

      {/* ─ 6 · FIM — créditos finais ────────────────────────────────────────── */}
      <section className="rl-fim">
        <p className="p-marca rl-creditos-cab">Featured in</p>
        <ol>
          {publicados.map((r) => (
            <li key={`${r.veiculo}-${r.projeto}-${r.ano}`} className="rl-credito">
              <span className="rl-credito-papel">
                {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer">{r.veiculo}</a> : r.veiculo}
              </span>
              <span className="rl-credito-nome">{titulo(r.projeto)}, {r.ano}</span>
            </li>
          ))}
        </ol>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
