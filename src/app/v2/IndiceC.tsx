import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { PECAS } from "../../content/pecas";
import { corDe } from "../../content/cores";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { InicioDispositivo } from "./InicioDispositivo";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css"; /* a lista usa as linhas do Índice (só leitura) */
import "../../styles/indice-c.css";

/**
 * PÁGINA C — O APARELHO, inteira (10/10, rodada 3).
 *
 * "mas aí você nem mudou a estrutura e nem nada": a página toda é o mesmo
 * aparelho do início em outros modos. O SCROLL opera tudo; clique só abre case
 * ou toca o reel. Uma ideia por seção:
 *   1 SINTONIA   o início C (canais 01→08) e a lista, cujos fios nascem da régua
 *   2 LEITOR     o sobre sintoniza palavra a palavra; a régua mostra o avanço
 *   3 BANDAS     4 réguas, uma por serviço; a agulha percorre cada banda e o
 *                leitor mostra serviço + entrega + a peça que o prova
 *   4 CANAL 09   o visor sintoniza o reel e vai à tela inteira
 *   5 LOG        as publicações como registro de transmissão; a linha acende
 *                ao passar pela linha de leitura
 *   6 DESLIGA    a régua recolhe num ponto e o papel volta ao neutro
 * Um WebGL só (o visor do início): o resto é DOM, para não abrir 2 contextos.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const limpa = (t: string) => t.replace("®", "").trim();
const capaDe = (slug: string) => PECAS[slug]?.[1] ?? PECAS[slug]?.[0] ?? WORK.find((w) => w.slug === slug)?.cover.src;

/* a tinta é da PÁGINA (mesma variável do início) */
function tingir(cor: string | null) {
  const tela = document.querySelector<HTMLElement>(".p-tela");
  if (!tela || prefersReducedMotion()) return;
  if (cor) tela.style.setProperty("--ic-tinta", cor);
  else tela.style.removeProperty("--ic-tinta");
}

/* uma régua de 1px com traços — o elemento gráfico do aparelho, reusado em toda seção */
function Regua({ className = "" }: { className?: string }) {
  return <div className={`cc-regua ${className}`} aria-hidden="true" />;
}

export default function IndiceC() {
  useMetaRota();
  const [sob, setSob] = useState<number | null>(null);
  const [banda, setBanda] = useState(0);
  const [comSom, setComSom] = useState(false);
  const palavras = LEAD[0].split(" ");
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);
  const raiz = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {});
    let vivo = true;
    /* ⚠ o App mata todo ScrollTrigger depois que a rota monta: criar após fonts.ready */
    void document.fonts.ready.then(() => {
      if (!vivo) return;
      ctx.add(() => {
        const mm = gsap.matchMedia();

        /* 2 · LEITOR — cada palavra fixa como um canal; a agulha da régua acompanha */
        const pals = gsap.utils.toArray<HTMLElement>(".cc-pal");
        const tlSobre = gsap.timeline({
          scrollTrigger: { trigger: ".cc-sobre", start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        });
        tlSobre
          .fromTo(pals, { opacity: 0.14, y: "0.12em" }, { opacity: 1, y: 0, ease: "none", stagger: 1, duration: 1 }, 0)
          .fromTo(".cc-sobre .cc-agulha", { left: "0%" }, { left: "100%", ease: "none", duration: pals.length }, 0)
          .to(".cc-sobre .cc-cont", { innerText: pals.length, snap: { innerText: 1 }, ease: "none", duration: pals.length }, 0);
        gsap.fromTo(".cc-retrato", { clipPath: "inset(0% 0% 100% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: ".cc-retrato", start: "top 85%", end: "top 45%", scrub: 0.5 },
        });

        /* 3 · BANDAS — desktop: presa, a agulha percorre banda após banda */
        mm.add("(min-width: 761px)", () => {
          const n = SERVICOS.length;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".cc-bandas", start: "top top", end: () => `+=${n * 0.7 * window.innerHeight}`,
              pin: true, pinSpacing: true, scrub: 0.6, invalidateOnRefresh: true,
              onUpdate: (st) => {
                const b = Math.min(n - 1, Math.floor(st.progress * n));
                setBanda((v) => (v === b ? v : b));
              },
              onToggle: (st) => {
                bandasNaTela.current = st.isActive;
                tingir(st.isActive ? corDe(SERVICOS[Math.min(n - 1, Math.floor(st.progress * n))].peca) : null);
              },
            },
          });
          /* cada banda: --p de 0 a 1 leva a agulha e o fio colorido da esquerda para a direita */
          gsap.utils.toArray<HTMLElement>(".cc-banda").forEach((el) => {
            tl.fromTo(el, { "--p": 0 }, { "--p": 1, ease: "none", duration: 1, immediateRender: false });
          });
        });
        /* mobile: sem pin; cada banda acende ao cruzar o meio da tela */
        mm.add("(max-width: 760px)", () => {
          gsap.utils.toArray<HTMLElement>(".cc-banda").forEach((el, i) => {
            ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && setBanda(i) });
          });
        });

        /* 4 · CANAL 09 — o visor vai à tela INTEIRA (caixa estica, vídeo contra-escala) */
        mm.add("(min-width: 761px)", () => {
          const reel = document.querySelector<HTMLElement>(".cc-reel");
          const vaga = reel?.parentElement;
          const vid = reel?.querySelector("video");
          if (!reel || !vaga || !vid) return;
          const sx = () => window.innerWidth / vaga.offsetWidth;
          const sy = () => window.innerHeight / vaga.offsetHeight;
          const s = () => Math.max(sx(), sy());
          const dx = () => { const r = vaga.getBoundingClientRect(); return window.innerWidth / 2 - (r.left + r.width / 2); };
          gsap.timeline({
            scrollTrigger: { trigger: vaga, start: "center center", end: "+=150%", pin: ".cc-canal", pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true },
          })
            .to(".cc-canal-leitor", { autoAlpha: 0, duration: 0.3 }, 0)
            .to(reel, { scaleX: sx, scaleY: sy, x: dx, ease: "power2.inOut", duration: 1 }, 0)
            .to(vid, { scaleX: () => s() / sx(), scaleY: () => s() / sy(), ease: "power2.inOut", duration: 1 }, 0)
            .to({}, { duration: 0.8 });
        });

        /* 5 · LOG — cada linha acende ao passar pela linha de leitura (meio da tela) */
        gsap.utils.toArray<HTMLElement>(".cc-log > li").forEach((li) => {
          ScrollTrigger.create({ trigger: li, start: "top 55%", end: "bottom 55%", toggleClass: "is-on" });
        });

        /* 6 · DESLIGA — a régua recolhe num ponto; o papel volta ao neutro */
        gsap.timeline({
          scrollTrigger: {
            trigger: ".cc-desliga", start: "top 75%", end: "center 45%", scrub: 0.6,
            onEnter: () => tingir(null),
          },
        })
          .fromTo(".cc-desliga .cc-regua", { scaleX: 1 }, { scaleX: 0.004, transformOrigin: "50% 50%", ease: "power3.in", duration: 1 })
          .fromTo(".cc-ponto", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2 }, 0.85)
          .fromTo(".cc-fim", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.9);
      });
      ScrollTrigger.refresh();
    });
    return () => {
      vivo = false;
      ctx.revert();
      tingir(null);
    };
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  /* a banda ativa tinge o papel com a cor da peça que a prova (só enquanto as bandas estão na tela) */
  const bandasNaTela = useRef(false);
  useEffect(() => {
    if (bandasNaTela.current) tingir(corDe(SERVICOS[banda].peca));
  }, [banda]);

  const sv = SERVICOS[banda];
  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      <div ref={raiz} className="cc">
        {/* ─ 1 · SINTONIA: o aparelho e a lista ─────────────────────────────── */}
        <section className="ix-hero">
          <InicioDispositivo />
          <div className="ix-grade ix-oficio">
            <p className="p-rotulo">Selected work — {String(WORK.length).padStart(2, "0")}</p>
            <p className="p-corpo">Brand designer &amp; art director. Based in Brazil, working worldwide.</p>
          </div>
          <ol className={`ix-lista${sob != null ? " ix-lista--sob" : ""}`} onPointerLeave={() => setSob(null)}>
            {WORK.map((w, i) => (
              <li key={w.slug} className={sob === i ? "is-sob" : undefined}>
                <Link to={`/work/${w.slug}`} className="ix-linha" onPointerEnter={() => setSob(i)} onFocus={() => setSob(i)} onBlur={() => setSob(null)}>
                  <span className="p-marca ix-n">
                    <span>{NUM(i)}</span>
                    <span aria-hidden="true">→ View</span>
                  </span>
                  <span className="ix-titulo">{limpa(w.title)}</span>
                  <span className="p-marca ix-disc">{w.disciplines.slice(0, 2).join(" · ")}</span>
                  <span className="p-marca ix-ano">{w.year}</span>
                  <img className="ix-mini" src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ─ 2 · LEITOR: o sobre sintoniza palavra a palavra ─────────────────── */}
        <section className="cc-secao cc-sobre ix-grade">
          <div className="cc-col">
            <p className="p-rotulo">About — readout</p>
            <figure className="cc-retrato">
              <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
            </figure>
          </div>
          <div>
            <div className="cc-medidor">
              <Regua />
              <div className="cc-agulha" />
              <p className="p-marca cc-medidor-txt">
                <span className="cc-cont">0</span> / {palavras.length} words
              </p>
            </div>
            <p className="cc-declaracao">
              {palavras.map((p, i) => (
                <span key={i} className="cc-pal">{p} </span>
              ))}
            </p>
            <p className="p-corpo cc-corpo">{LEAD[1]}</p>
          </div>
        </section>

        {/* ─ 3 · BANDAS: uma régua por serviço ───────────────────────────────── */}
        <section className="cc-bandas ix-grade">
          <div className="cc-leitor" aria-live="polite">
            <p className="p-rotulo">What I do — band {NUM(banda)} / {String(SERVICOS.length).padStart(2, "0")}</p>
            <p className="cc-num" style={{ color: corDe(sv.peca) }}>{NUM(banda)}</p>
            <p className="cc-nome">{sv.nome}</p>
            <p className="p-corpo cc-entrega">{sv.entrega}</p>
            <Link to={`/work/${sv.peca}`} className="cc-prova">
              <img key={sv.peca} src={capaDe(sv.peca)} alt="" loading="lazy" decoding="async" draggable={false} />
              <span className="p-marca">Proof — {limpa(WORK.find((w) => w.slug === sv.peca)?.title ?? sv.peca)} →</span>
            </Link>
          </div>
          <ol className="cc-lista-bandas">
            {SERVICOS.map((s, i) => (
              <li key={s.nome} className={`cc-banda${i === banda ? " is-on" : ""}`} style={{ ["--cc-cor" as string]: corDe(s.peca) }}>
                <p className="cc-banda-cab">
                  <span className="p-marca">{NUM(i)}</span>
                  <span className="cc-banda-nome">{s.nome}</span>
                </p>
                <div className="cc-banda-regua">
                  <Regua />
                  <div className="cc-agulha" />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ─ 4 · CANAL 09: o reel ────────────────────────────────────────────── */}
        {REEL.video ? (
          <section className="cc-secao cc-canal ix-grade">
            <div className="cc-canal-leitor">
              <p className="p-rotulo">Showreel — {REEL.ano}</p>
              <p className="cc-num">09</p>
              <p className="cc-nome">Showreel</p>
              <button type="button" className="p-marca cc-som" onClick={() => setComSom(true)}>
                Play with sound →
              </button>
            </div>
            <div className="cc-reel-vaga">
              <button type="button" className="cc-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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

        {/* ─ 5 · LOG: as publicações como registro de transmissão ─────────────── */}
        <section className="cc-secao ix-grade">
          <p className="p-rotulo">Published in — log</p>
          <ol className="cc-log">
            {publicados.map((r, i) => {
              const miolo = (
                <>
                  <span>TX {NUM(i)}</span>
                  <span>{r.ano}</span>
                  <span className="cc-log-veiculo">{r.veiculo}</span>
                  <span>{limpa(r.projeto)}</span>
                  <span className="cc-log-status">{r.href ? "Received →" : "Received"}</span>
                </>
              );
              return (
                <li key={`${r.veiculo}-${r.projeto}`}>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="cc-log-linha p-marca">{miolo}</a>
                  ) : (
                    <span className="cc-log-linha p-marca">{miolo}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ─ 6 · DESLIGA: a régua recolhe num ponto ──────────────────────────── */}
        <section className="cc-desliga" aria-hidden="true">
          <Regua />
          <span className="cc-ponto" />
          <p className="p-marca cc-fim">End of transmission</p>
        </section>
      </div>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
