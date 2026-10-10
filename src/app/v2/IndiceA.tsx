import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { InicioArquivo } from "./InicioArquivo";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css";
import "../../styles/indice-a.css";

/**
 * PÁGINA A — "O ARQUIVO" inteira (10/10, rodada 3: "você nem mudou a estrutura").
 *
 * A física do Início A (as peças são CARTAS/impressos: dar, empilhar, abrir em
 * leque, pousar) governa a página toda. O scroll opera tudo; um gesto por seção:
 *   1 ÍNDICE        o maço DÁ as cartas: cada projeto pousa na sua linha (InicioArquivo)
 *   2 SOBRE         o retrato CAI do maço e assenta; a ficha com a declaração é COLADA ao lado
 *   3 OFÍCIO        uma MÃO de 4 cartas que ABRE EM LEQUE (serviço + a peça que o prova)
 *   4 SHOWREEL      uma carta do maço VIRA TELA — cresce à tela inteira e volta a ser carta
 *   5 PUBLICADO     uma PILHA de recortes com o veículo carimbado; o scroll FOLHEIA
 *   6 FIM           as cartas espalhadas se RECOLHEM num monte só
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const limpa = (t: string) => t.replace("®", "").trim();
const capaDe = (slug: string) => PECAS[slug]?.[1] ?? PECAS[slug]?.[0] ?? WORK.find((w) => w.slug === slug)?.cover.src;
/* o monte final: uma peça de cada projeto, mais as segundas — o arquivo inteiro de novo */
const FIM = WORK.flatMap((w) => (PECAS[w.slug] ?? []).slice(0, 2)).slice(0, 14);
const ruido = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

export default function IndiceA() {
  useMetaRota();
  const [sob, setSob] = useState<number | null>(null);
  const [comSom, setComSom] = useState(false);
  const raiz = useRef<HTMLDivElement | null>(null);
  const lente = useRef<HTMLDivElement | null>(null);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  /* a lente WebGL do índice: só o Y segue o cursor (a coluna é do CSS) */
  useEffect(() => {
    const el = lente.current;
    if (!el) return;
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const mover = (e: PointerEvent) => y(Math.min(Math.max(16, e.clientY - el.offsetHeight / 2), window.innerHeight - el.offsetHeight - 16));
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  /* a coreografia das seções 2–6. Nasce depois das fontes: o App mata os triggers criados
     antes da rota montar, e as medidas dependem da Geist carregada. */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {}, raiz);
    let vivo = true;
    void document.fonts.ready.then(() => {
      if (!vivo) return;
      ctx.add(() => {
        const mm = gsap.matchMedia();

        /* 2 · SOBRE — o retrato cai do alto (de onde o maço estava), gira e assenta;
           a ficha chega por baixo, levemente torta, e é "colada" (endireita e a sombra encolhe) */
        gsap.timeline({ scrollTrigger: { trigger: ".pa-sobre", start: "top 85%", end: "top 25%", scrub: 0.7 } })
          .fromTo(".pa-retrato", { y: "-38vh", x: "12vw", rotation: 22, scale: 0.75 }, { y: 0, x: 0, rotation: -3, scale: 1, ease: "power3.out", duration: 1 })
          .fromTo(".pa-ficha", { y: 90, rotation: 4, autoAlpha: 0, "--sombra": 1 }, { y: 0, rotation: 0.8, autoAlpha: 1, "--sombra": 0, ease: "power2.out", duration: 0.8 }, 0.35);

        /* 3 · OFÍCIO — a mão de cartas: presa na tela, o scroll abre o leque */
        mm.add("(min-width: 761px)", () => {
          const cs = gsap.utils.toArray<HTMLElement>(".pa-mao-carta");
          const n = cs.length;
          gsap.timeline({ scrollTrigger: { trigger: ".pa-mao", start: "top top", end: "+=140%", pin: true, pinSpacing: true, scrub: 0.8 } })
            .fromTo(cs, { x: 0, y: 40, rotation: (i) => (i - (n - 1) / 2) * 2 }, {
              x: (i) => `${(i - (n - 1) / 2) * 112}%`,
              y: (i) => Math.abs(i - (n - 1) / 2) * 34,
              rotation: (i) => (i - (n - 1) / 2) * 7,
              ease: "power2.inOut", duration: 1,
            })
            .fromTo(".pa-mao-carta .pa-mao-texto", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.6);
        });

        /* 4 · SHOWREEL — a carta do topo endireita e vira TELA INTEIRA (caixa estica em x/y e o
           vídeo contra-escala = cover sem distorcer); segura; volta a ser carta. As de trás saem. */
        mm.add("(min-width: 761px)", () => {
          const reel = document.querySelector<HTMLElement>(".pa-reel");
          const vid = reel?.querySelector("video");
          if (!reel || !vid) return;
          const sx = () => window.innerWidth / reel.offsetWidth;
          const sy = () => window.innerHeight / reel.offsetHeight;
          const s = () => Math.max(sx(), sy());
          const dx = () => { const r = reel.getBoundingClientRect(); return window.innerWidth / 2 - (r.left + r.width / 2) + (gsap.getProperty(reel, "x") as number); };
          const dy = () => { const r = reel.getBoundingClientRect(); return window.innerHeight / 2 - (r.top + r.height / 2) + (gsap.getProperty(reel, "y") as number); };
          gsap.timeline({ scrollTrigger: { trigger: ".pa-reel-palco", start: "top top", end: "+=200%", pin: true, pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true } })
            .to(".pa-reel-tras", { y: 60, rotation: (i) => (i ? 14 : -12), autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
            .to(".pa-reel-cab", { autoAlpha: 0, duration: 0.3 }, 0)
            .to(reel, { rotation: 0, x: dx, y: dy, scaleX: sx, scaleY: sy, ease: "power2.inOut", duration: 1 }, 0.1)
            .to(vid, { scaleX: () => s() / sx(), scaleY: () => s() / sy(), ease: "power2.inOut", duration: 1 }, 0.1)
            .to({}, { duration: 0.7 })
            .to(reel, { rotation: -2.5, x: 0, y: 0, scaleX: 1, scaleY: 1, ease: "power2.inOut", duration: 1 })
            .to(vid, { scaleX: 1, scaleY: 1, ease: "power2.inOut", duration: 1 }, "<")
            .to(".pa-reel-cab", { autoAlpha: 1, duration: 0.3 }, "<0.7");
        });

        /* 5 · PUBLICADO — a pilha de recortes presa; o scroll tira o de cima, um por vez */
        mm.add("(min-width: 761px)", () => {
          const rs = gsap.utils.toArray<HTMLElement>(".pa-recorte");
          const tl = gsap.timeline({ scrollTrigger: { trigger: ".pa-pubs", start: "top top", end: () => `+=${rs.length * 55}%`, pin: true, pinSpacing: true, scrub: 0.7 } });
          rs.slice(0, -1).forEach((r, i) => {
            tl.to(r, { yPercent: -240, xPercent: i % 2 ? 26 : -26, rotation: i % 2 ? 12 : -12, ease: "power2.in", duration: 1 }, i)
              .to(r, { autoAlpha: 0, duration: 0.25 }, i + 0.75)
              .to(`.pa-pub-linha:nth-child(${i + 1})`, { opacity: 0.62, duration: 0.3 }, i)
              .to(`.pa-pub-linha:nth-child(${i + 2})`, { opacity: 1, duration: 0.3 }, i + 0.7);
          });
          tl.to({}, { duration: 0.4 });
        });

        /* 6 · FIM — as cartas espalhadas pela largura se recolhem num monte */
        gsap.fromTo(".pa-fim-carta", {
          x: (i) => `${ruido(i, 1) * 260}%`, y: (i) => `${ruido(i, 2) * 120 - 40}%`, rotation: (i) => ruido(i, 3) * 70,
        }, {
          x: (i) => ruido(i, 4) * 10, y: (i) => ruido(i, 5) * 8, rotation: (i) => ruido(i, 6) * 8,
          ease: "power2.inOut", stagger: 0.02,
          scrollTrigger: { trigger: ".pa-fim", start: "top 90%", end: "center 55%", scrub: 0.8 },
        });
      });
    });
    return () => { vivo = false; ctx.revert(); };
  }, []);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      <div ref={raiz} className="pa">
        {/* ─ 1 · O ÍNDICE: o maço dá as cartas e cada projeto pousa na sua linha ─ */}
        <section className="ix-hero">
          <InicioArquivo />
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
        <div ref={lente} className={`ix-lente${sob != null ? " is-on" : ""}`} aria-hidden="true">
          <HoverFluido sob={sob != null ? WORK[sob] : null} modo="cartaz" receita={4} />
        </div>

        {/* ─ 2 · SOBRE: o retrato cai do maço; a ficha é colada ao lado ─ */}
        <section className="pa-secao ix-grade pa-sobre">
          <p className="p-rotulo">About</p>
          <div className="pa-sobre-mesa">
            <figure className="pa-carta pa-retrato">
              <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
            </figure>
            <div className="pa-ficha">
              <p className="p-marca pa-ficha-cab">
                <span>File — 00</span>
                <span>Mateus Bredoff</span>
              </p>
              <p className="pa-ficha-lead">{LEAD[0]}</p>
              <p className="p-corpo pa-ficha-corpo">{LEAD[1]}</p>
              <dl className="p-marca pa-ficha-meta">
                <div><dt>Based</dt><dd>Brazil</dd></div>
                <div><dt>Working</dt><dd>Worldwide</dd></div>
                <div><dt>Archive</dt><dd>{WORK.length} projects</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* ─ 3 · OFÍCIO: a mão de cartas que abre em leque ─ */}
        <section className="pa-mao">
          <div className="ix-grade pa-mao-cab">
            <p className="p-rotulo">What I do</p>
            <p className="p-corpo pa-quieto">Four disciplines, each proven by a project in the archive.</p>
          </div>
          <ol className="pa-mao-cartas">
            {SERVICOS.map((sv, i) => {
              const w = WORK.find((x) => x.slug === sv.peca) ?? WORK[i];
              return (
                <li key={sv.nome} className="pa-mao-carta" style={{ zIndex: 10 - Math.abs(i - 1.5) * 2 }}>
                  <Link to={`/work/${w.slug}`} className="pa-carta pa-mao-face">
                    <img src={capaDe(w.slug)} alt="" loading="lazy" decoding="async" draggable={false} />
                    <span className="p-marca pa-mao-n">{NUM(i)} — {limpa(w.title)}</span>
                  </Link>
                  <div className="pa-mao-texto">
                    <p className="pa-mao-nome">{sv.nome}</p>
                    <p className="p-corpo pa-quieto">{sv.entrega}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ─ 4 · SHOWREEL: a carta do topo vira tela ─ */}
        {REEL.video ? (
          <section className="pa-reel-palco">
            <div className="ix-grade pa-reel-cab">
              <p className="p-rotulo">Showreel — {REEL.ano}</p>
              <button type="button" className="p-corpo p-link" onClick={() => setComSom(true)}>Play with sound</button>
            </div>
            <div className="pa-reel-mesa">
              <img className="pa-carta pa-reel-tras" src={capaDe("bureau")} alt="" loading="lazy" decoding="async" draggable={false} />
              <img className="pa-carta pa-reel-tras" src={capaDe("ginga")} alt="" loading="lazy" decoding="async" draggable={false} />
              <button type="button" className="pa-carta pa-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
                <video
                  src={REEL.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={REEL.capa.src}
                  ref={(el) => { if (!el) return; el.muted = true; void el.play().catch(() => {}); }}
                />
              </button>
            </div>
          </section>
        ) : null}

        {/* ─ 5 · PUBLICADO: a pilha de recortes, o scroll folheia ─ */}
        <section className="pa-pubs ix-grade">
          <div className="pa-pubs-lista">
            <p className="p-rotulo">Published in</p>
            <ol>
              {publicados.map((r, i) => (
                <li key={`${r.veiculo}-${r.projeto}`} className="pa-pub-linha" style={{ opacity: i ? 0.62 : 1 }}>
                  <span className="p-marca">{NUM(i)}</span>
                  <span className="pa-pub-veiculo">{r.veiculo}</span>
                  <span className="p-marca pa-quieto">{limpa(r.projeto)} · {r.ano}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="pa-pilha">
            {publicados.map((r, i) => {
              const corpo = (
                <>
                  <img src={r.foto.src} alt={r.foto.alt} loading="lazy" decoding="async" draggable={false} />
                  <span className="pa-carimbo">{r.veiculo}<em>{r.ano}</em></span>
                  <span className="p-marca pa-recorte-leg">{limpa(r.projeto)}</span>
                </>
              );
              const estilo = { zIndex: publicados.length - i, rotate: `${ruido(i, 7) * 6}deg` };
              return r.href ? (
                <a key={`${r.veiculo}-${r.projeto}`} href={r.href} target="_blank" rel="noopener noreferrer" className="pa-carta pa-recorte" style={estilo}>{corpo}</a>
              ) : (
                <div key={`${r.veiculo}-${r.projeto}`} className="pa-carta pa-recorte" style={estilo}>{corpo}</div>
              );
            })}
          </div>
        </section>

        {/* ─ 6 · FIM: o arquivo se recolhe num monte ─ */}
        <section className="pa-fim ix-grade">
          <p className="p-marca pa-quieto">End of archive — {String(FIM.length).padStart(2, "0")} of {String(Object.values(PECAS).flat().length).padStart(2, "0")} pieces</p>
          <div className="pa-fim-mesa" aria-hidden="true">
            {FIM.map((src, i) => (
              <img key={src} className="pa-carta pa-fim-carta" src={src} alt="" loading="lazy" decoding="async" draggable={false} style={{ zIndex: i }} />
            ))}
          </div>
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
