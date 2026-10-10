import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { PECAS } from "../../content/pecas";
import { CONTATO } from "../v3-system";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { InicioTipo } from "./InicioTipo";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/indice-b.css";

/**
 * PÁGINA B — O MANUAL DE MARCA (10/10, rodada 3: "mas aí você nem mudou a estrutura e nem nada").
 *
 * A página INTEIRA nasce do Início B: o nome dele como brand system. Cada seção é
 * um capítulo de manual, aberto pela mesma legenda mono entre fios da abertura,
 * e cada capítulo tem UM gesto tipográfico, sem repetir:
 *   abertura  o nome passa por 4 lockups e assenta como linha zero do índice (InicioTipo)
 *   01 Index         os projetos chegam alinhados à direita e se RECOMPÕEM à esquerda
 *   02 Tone of voice a declaração assenta palavra a palavra no grid; o retrato como diretriz
 *   03 Applications  cada serviço passa de Tracked a Horizontal (o tracking fecha)
 *   04 Motion        o reel numa área de proteção medida, que se expande à tela inteira
 *   05 Recognition   tabela de especificação que preenche coluna a coluna
 *   fim              o nome volta do Split ao Horizontal gigante e fecha o manual
 * O scroll opera tudo; clique só abre case, reel com som e links.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const limpa = (t: string) => t.replace("®", "").trim();
const CAPS = ["Index", "Tone of voice", "Applications", "Motion", "Recognition"];

function Capitulo({ n, titulo, nota }: { n: number; titulo: string; nota?: string }) {
  return (
    <header className="ib-cap">
      <span className="ib-fio" aria-hidden="true" />
      <p className="p-marca ib-cap-linha">
        <span>Chapter {NUM(n - 1)} / 05</span>
        <span>{titulo}</span>
        <span>{nota ?? "Brand manual — Mateus Bredoff"}</span>
      </p>
      <span className="ib-fio" aria-hidden="true" />
    </header>
  );
}

export default function IndiceB() {
  useMetaRota();
  const [sob, setSob] = useState<number | null>(null);
  const [comSom, setComSom] = useState(false);
  const [lockupServ, setLockupServ] = useState<string[]>(SERVICOS.map(() => "Tracked"));
  const lente = useRef<HTMLDivElement | null>(null);
  const raiz = useRef<HTMLDivElement | null>(null);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  /* a lente WebGL do índice: só o Y segue o cursor (extra; o scroll é quem opera a página) */
  useEffect(() => {
    const el = lente.current;
    if (!el) return;
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      const h = el.offsetHeight;
      y(Math.min(Math.max(16, e.clientY - h / 2), window.innerHeight - h - 16));
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {}, raiz);
    let splitVoz: SplitText | null = null;
    let vivo = true;
    /* o App mata os ScrollTriggers depois que a rota monta: tudo nasce depois das fontes */
    void document.fonts.ready.then(() => {
      if (!vivo) return;
      ctx.add(() => {
        const s = (trigger: Element, start: string, end: string, scrub: number | boolean = 0.6) => ({ trigger, start, end, scrub, invalidateOnRefresh: true });

        /* legendas de capítulo: os dois fios desenham quando o capítulo chega */
        gsap.utils.toArray<HTMLElement>(".ib-cap").forEach((cap) => {
          gsap.fromTo(cap.querySelectorAll(".ib-fio"), { scaleX: 0 }, { scaleX: 1, ease: "none", stagger: 0.15, scrollTrigger: s(cap, "top 98%", "top 70%") });
          gsap.fromTo(cap.querySelectorAll(".ib-cap-linha > span"), { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", stagger: 0.1, scrollTrigger: s(cap, "top 92%", "top 75%") });
        });

        /* 01 INDEX — cada nome chega alinhado à DIREITA da coluna e se recompõe à esquerda */
        gsap.utils.toArray<HTMLElement>(".ib-lista > li").forEach((li) => {
          const t = li.querySelector<HTMLElement>(".ib-titulo");
          const cel = t?.parentElement;
          if (!t || !cel) return;
          gsap.fromTo(t, { x: () => Math.max(0, cel.clientWidth - t.offsetWidth) }, { x: 0, ease: "power2.out", scrollTrigger: s(li, "top 100%", "top 58%") });
          gsap.fromTo(li, { "--fio": 0 }, { "--fio": 1, ease: "none", scrollTrigger: s(li, "top 100%", "top 80%") });
        });

        /* 02 TOM DE VOZ — as palavras assentam no grid, uma a uma */
        const voz = document.querySelector<HTMLElement>(".ib-voz");
        if (voz) {
          voz.setAttribute("aria-label", voz.textContent ?? "");
          /* palavras dentro da máscara da LINHA: cada uma sobe e assenta no seu lugar, sem invadir a vizinha */
          splitVoz = new SplitText(voz, { type: "lines,words", mask: "lines" });
          splitVoz.lines.forEach((l) => (l as HTMLElement).setAttribute("aria-hidden", "true"));
          gsap.fromTo(splitVoz.words, { yPercent: 105 }, { yPercent: 0, ease: "power2.out", stagger: 0.08, scrollTrigger: s(voz, "top 88%", "bottom 55%") });
        }
        /* a fotografia como diretriz: o recorte abre até as marcas de corte */
        const foto = document.querySelector(".ib-foto");
        if (foto) {
          const tl = gsap.timeline({ scrollTrigger: s(foto, "top 90%", "top 35%") });
          tl.fromTo(".ib-foto-img", { clipPath: "inset(14% 14% 14% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" })
            .fromTo(".ib-foto-img img", { scale: 1.2 }, { scale: 1, ease: "power2.inOut" }, 0)
            .fromTo(".ib-marca--tl", { x: "14%", y: "14%" }, { x: 0, y: 0, ease: "power2.inOut" }, 0)
            .fromTo(".ib-marca--tr", { x: "-14%", y: "14%" }, { x: 0, y: 0, ease: "power2.inOut" }, 0)
            .fromTo(".ib-marca--bl", { x: "14%", y: "-14%" }, { x: 0, y: 0, ease: "power2.inOut" }, 0)
            .fromTo(".ib-marca--br", { x: "-14%", y: "-14%" }, { x: 0, y: 0, ease: "power2.inOut" }, 0)
            .fromTo(".ib-diretriz li", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, stagger: 0.12 }, 0.3);
        }

        /* 03 APLICAÇÕES — o nome do serviço passa de Tracked a Horizontal: o tracking fecha */
        gsap.utils.toArray<HTMLElement>(".ib-app").forEach((app, k) => {
          const nome = app.querySelector(".ib-app-nome");
          const peca = app.querySelector(".ib-app-peca");
          /* no celular a coluna é estreita: o Tracked abre menos para caber na linha */
          const aberto = matchMedia("(max-width: 760px)").matches ? "0.12em" : "0.32em";
          gsap.fromTo(nome, { letterSpacing: aberto }, {
            letterSpacing: "-0.035em", ease: "power2.inOut",
            scrollTrigger: {
              ...s(app, "top 85%", "top 35%"),
              onUpdate: (st) => {
                const v = st.progress > 0.5 ? "Horizontal" : "Tracked";
                setLockupServ((a) => (a[k] === v ? a : a.map((x, j) => (j === k ? v : x))));
              },
            },
          });
          if (peca) gsap.fromTo(peca, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: s(app, "top 80%", "top 45%") });
          gsap.fromTo(app, { "--fio": 0 }, { "--fio": 1, ease: "none", scrollTrigger: s(app, "top 98%", "top 75%") });
        });

        /* 04 MOVIMENTO — a área de proteção some e o reel vai à TELA INTEIRA (técnica do Índice) */
        gsap.matchMedia().add("(min-width: 761px)", () => {
          const reel = document.querySelector<HTMLElement>(".ib-reel");
          const vaga = reel?.parentElement;
          const vid = reel?.querySelector("video");
          if (!reel || !vaga || !vid) return;
          const sx = () => window.innerWidth / vaga.offsetWidth;
          const sy = () => window.innerHeight / vaga.offsetHeight;
          const k = () => Math.max(sx(), sy());
          const dx = () => { const r = vaga.getBoundingClientRect(); return window.innerWidth / 2 - (r.left + r.width / 2); };
          gsap.timeline({ scrollTrigger: { trigger: vaga, start: "center center", end: "+=170%", pin: ".ib-mov", pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true } })
            .to(".ib-protecao", { autoAlpha: 0, duration: 0.35 })
            .to(reel, { scaleX: sx, scaleY: sy, x: dx, ease: "power2.inOut", duration: 1 }, 0.1)
            .to(vid, { scaleX: () => k() / sx(), scaleY: () => k() / sy(), ease: "power2.inOut", duration: 1 }, 0.1)
            .to({}, { duration: 0.7 })
            .to(reel, { scaleX: 1, scaleY: 1, x: 0, ease: "power2.inOut", duration: 1 })
            .to(vid, { scaleX: 1, scaleY: 1, ease: "power2.inOut", duration: 1 }, "<")
            .to(".ib-protecao", { autoAlpha: 1, duration: 0.35 }, ">-0.2");
        });

        /* 05 RECONHECIMENTO — a especificação preenche coluna a coluna */
        gsap.utils.toArray<HTMLElement>(".ib-spec > li").forEach((li) => {
          gsap.fromTo(li.querySelectorAll(".ib-cel"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", stagger: 0.25, scrollTrigger: s(li, "top 96%", "top 70%") });
          gsap.fromTo(li, { "--fio": 0 }, { "--fio": 1, ease: "none", scrollTrigger: s(li, "top 98%", "top 82%") });
        });

        /* FIM — o nome volta do Split ao Horizontal gigante */
        const fim = document.querySelector<HTMLElement>(".ib-fim-nome");
        if (fim) {
          const [a, b] = Array.from(fim.querySelectorAll<HTMLElement>(".ib-fim-palavra"));
          const tl = gsap.timeline({ scrollTrigger: s(fim, "top 95%", "top 40%") });
          tl.fromTo(a, { yPercent: -60 }, { yPercent: 0, ease: "power2.inOut" })
            .fromTo(b, { yPercent: 60, x: () => Math.max(0, fim.clientWidth - (b.offsetLeft + b.offsetWidth)) }, { yPercent: 0, x: 0, ease: "power2.inOut" }, 0);
        }

        ScrollTrigger.refresh();
      });
    });
    return () => {
      vivo = false;
      ctx.revert();
      splitVoz?.revert();
    };
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="regua">
      <div ref={raiz} className="ib">
        {/* ─ ABERTURA + 01 INDEX: o nome assenta como linha zero e a lista continua ─ */}
        <section className="ib-hero">
          <InicioTipo />
          <ol className={`ib-lista${sob != null ? " ib-lista--sob" : ""}`} onPointerLeave={() => setSob(null)}>
            {WORK.map((w, i) => (
              <li key={w.slug} className={sob === i ? "is-sob" : undefined}>
                <Link to={`/work/${w.slug}`} className="ib-linha" onPointerEnter={() => setSob(i)} onFocus={() => setSob(i)} onBlur={() => setSob(null)}>
                  <span className="p-marca ib-n">{NUM(i)}</span>
                  <span className="ib-cel-titulo"><span className="ib-titulo">{limpa(w.title)}</span></span>
                  <span className="p-marca ib-disc">{w.disciplines.slice(0, 2).join(" · ")}</span>
                  <span className="p-marca ib-ano">{w.year}</span>
                  <img className="ib-mini" src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div ref={lente} className={`ib-lente${sob != null ? " is-on" : ""}`} aria-hidden="true">
          <HoverFluido sob={sob != null ? WORK[sob] : null} modo="cartaz" receita={4} />
        </div>

        {/* ─ 02 TOM DE VOZ ────────────────────────────────────────────────────── */}
        <section className="ib-secao">
          <Capitulo n={2} titulo={CAPS[1]} />
          <p className="ib-voz">{LEAD[0]}</p>
          <div className="ib-grade ib-foto">
            <ul className="p-marca ib-diretriz">
              <li>Photography — guideline</li>
              <li>Ratio 4:5</li>
              <li>Crop: shoulders up</li>
              <li>Light: soft, from the side</li>
              <li>Ground: deep, single tone</li>
            </ul>
            <div className="ib-foto-par">
              <figure className="ib-foto-quadro">
                <div className="ib-foto-img">
                  <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
                </div>
                {(["tl", "tr", "bl", "br"] as const).map((c) => (
                  <span key={c} className={`ib-marca ib-marca--${c}`} aria-hidden="true" />
                ))}
              </figure>
              <p className="p-corpo ib-corpo">{LEAD[1]}</p>
            </div>
          </div>
        </section>

        {/* ─ 03 APLICAÇÕES ────────────────────────────────────────────────────── */}
        <section className="ib-secao">
          <Capitulo n={3} titulo={CAPS[2]} nota="What I do — 04" />
          <ol className="ib-apps">
            {SERVICOS.map((sv, i) => {
              const w = WORK.find((x) => x.slug === sv.peca) ?? WORK[i];
              const img = PECAS[w.slug]?.[1] ?? PECAS[w.slug]?.[0] ?? w.cover.src;
              return (
                <li key={sv.nome} className="ib-grade ib-app">
                  <div className="ib-app-lado">
                    <p className="p-marca ib-app-rot">
                      <span>Application {NUM(i)} / 04</span>
                      <span>Lockup — {lockupServ[i]}</span>
                    </p>
                    <Link to={`/work/${w.slug}`} className="ib-app-peca" aria-label={`${limpa(w.title)} — case`}>
                      <img src={img} alt="" loading="lazy" decoding="async" draggable={false} />
                      <span className="p-marca">{limpa(w.title)} →</span>
                    </Link>
                  </div>
                  <div className="ib-app-miolo">
                    <h3 className="ib-app-nome">{sv.nome}</h3>
                    <p className="p-corpo ib-app-entrega">{sv.entrega}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ─ 04 MOVIMENTO ─────────────────────────────────────────────────────── */}
        {REEL.video ? (
          <section className="ib-secao ib-mov">
            <Capitulo n={4} titulo={CAPS[3]} nota={`Showreel — ${REEL.ano}`} />
            <div className="ib-area">
              <div className="ib-protecao" aria-hidden="true">
                <span className="ib-guia ib-guia--t" /><span className="ib-guia ib-guia--b" />
                <span className="ib-guia ib-guia--l" /><span className="ib-guia ib-guia--r" />
                <span className="p-marca ib-medida ib-medida--t">x</span>
                <span className="p-marca ib-medida ib-medida--l">x</span>
                <span className="p-marca ib-medida ib-medida--nota">Clear space x = 1/16 W · 16:9</span>
              </div>
              <div className="ib-reel-vaga">
                <button type="button" className="ib-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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
            </div>
            <button type="button" className="p-corpo p-link ib-som" onClick={() => setComSom(true)}>
              Play with sound
            </button>
          </section>
        ) : null}

        {/* ─ 05 RECONHECIMENTO ────────────────────────────────────────────────── */}
        <section className="ib-secao">
          <Capitulo n={5} titulo={CAPS[4]} nota="Published in" />
          <p className="p-marca ib-spec-cab" aria-hidden="true">
            <span>Ref.</span><span>Publication</span><span>Project</span><span>Year</span>
          </p>
          <ol className="ib-spec">
            {publicados.map((r, i) => {
              const miolo = (
                <>
                  <span className="p-marca ib-cel">R-{NUM(i)}</span>
                  <span className="ib-cel ib-veiculo">{r.veiculo}</span>
                  <span className="p-corpo ib-cel ib-spec-proj">{limpa(r.projeto)}</span>
                  <span className="p-marca ib-cel ib-ano">{r.ano}</span>
                </>
              );
              return (
                <li key={`${r.veiculo}-${r.projeto}`}>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="ib-spec-linha">{miolo}</a>
                  ) : (
                    <span className="ib-spec-linha">{miolo}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ─ FIM: o nome volta ao Horizontal e fecha o manual ──────────────────── */}
        <section className="ib-secao ib-fim">
          <Capitulo n={6} titulo="Contact" nota="End of manual" />
          <p className="ib-fim-nome" aria-label="Mateus Bredoff">
            <span className="ib-fim-palavra" aria-hidden="true">Mateus</span>
            <span className="ib-fim-palavra" aria-hidden="true">Bredoff</span>
          </p>
          <div className="ib-grade ib-contato">
            <p className="p-marca">Let's talk</p>
            <ul>
              {CONTATO.map((c) => (
                <li key={c.label}>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="ib-canal">
                      <span className="p-marca">{c.label}</span>
                      <span>{c.valor}</span>
                    </a>
                  ) : (
                    <span className="ib-canal">
                      <span className="p-marca">{c.label}</span>
                      <span>{c.valor}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
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
