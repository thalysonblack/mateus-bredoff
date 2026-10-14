import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK, type WorkItem } from "../../content/work";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { HeroReelFull } from "./Reels";
import { REEL } from "../../content/reel";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css";
import "../../styles/rolin-b.css";
import "../../styles/rolin-c.css";

/**
 * ONE PAGE "ROLIN C" (13/10, "tá ficando muito igual"): sai a tela partida do Rolin.
 * Work = grade editorial assimétrica de 12 colunas (escala e posição próprias por
 * projeto, nome grande cruzando a borda da peça) + régua de índice fixa no rodapé.
 * Base: ROLIN B (13/10, "agora vamos diferenciar").
 * Fica a ESTRUTURA do thierryrolin.com (tela partida, índice parado, coluna de
 * peças, fio de progresso, info em duas metades). Sai tudo que era assinatura
 * dele e entra a do Bredoff: papel + tinta da Prancha, Geist grande e leve no
 * índice, mono nos números, o menu padrão, o reel em tela cheia na abertura e a
 * lente WebGL (receita Arco) em cima da peça no hover.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const nome = (t: string) => t.replace("®", "").trim();

export default function RolinC() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);
  const lente = useRef<HTMLDivElement | null>(null);
  const alvoEl = useRef<HTMLElement | null>(null);
  const [ativo, setAtivo] = useState(0);
  const [sob, setSob] = useState<WorkItem | null>(null);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let ctx: gsap.Context | null = null;
    let vivo = true;
    /* o App mata os ScrollTriggers no effect da rota: nascer dois frames depois das fontes */
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        /* o reel em tela cheia encolhe até virar a peça 00 da coluna (sem corte entre a hero e o Work) */
        const hero = el.querySelector<HTMLElement>(".hx-cena");
        const vaga = el.querySelector<HTMLElement>(".rc-reel");
        const quadro = hero?.querySelector<HTMLElement>(".rx-quadro");
        const video = quadro?.querySelector<HTMLElement>(".rx-video");
        const alvo = vaga?.querySelector<HTMLElement>(".rc-quadro");
        if (hero && vaga && quadro && video && alvo) {
          /* a hero do reel-full traz o próprio scroll (cresce/escurece, menu branco): aqui quem manda é a costura */
          ScrollTrigger.getAll().filter((t) => t.trigger === hero).forEach((t) => { t.animation?.progress(0); t.kill(); });
          const wrap = hero.parentElement as HTMLElement;
          const fim = () => wrap.offsetHeight - hero.offsetHeight - 10;
          const g = { W: 1, H: 1, x: 0, y: 0, w: 1, h: 1 };
          const medir = () => {
            g.W = hero.clientWidth; g.H = hero.clientHeight;
            const r = alvo.getBoundingClientRect();
            g.x = r.left; g.y = r.top + window.scrollY - fim(); g.w = r.width; g.h = r.height;
          };
          const p = { v: 0 };
          const pintar = () => {
            const k = gsap.parseEase("power2.inOut")(p.v);
            const sx = gsap.utils.interpolate(1, g.w / g.W, k), sy = gsap.utils.interpolate(1, g.h / g.H, k);
            const s = Math.max(sx, sy);
            gsap.set(quadro, { transformOrigin: "0 0", x: g.x * k, y: g.y * k, scaleX: sx, scaleY: sy });
            gsap.set(video, { scaleX: s / sx, scaleY: s / sy });
          };
          medir();
          ScrollTrigger.addEventListener("refresh", () => { medir(); pintar(); });
          gsap.timeline({ scrollTrigger: { start: 0, end: fim, scrub: true, invalidateOnRefresh: true } })
            .to(p, { v: 1, ease: "none", duration: 1, onUpdate: pintar }, 0)
            .to(quadro.querySelector(".rx-sombra"), { opacity: 0, ease: "none", duration: 0.8 }, 0)
            .to(quadro, { "--rb-grad": 0, ease: "none", duration: 0.5 }, 0)
            .to(hero.querySelector(".rx-legenda"), { autoAlpha: 0, duration: 0.15 }, 0)
            .set(quadro, { autoAlpha: 0 }, 0.999)
            .set(vaga, { autoAlpha: 1 }, 0.999);
          /* menu branco só enquanto o reel ainda cobre o topo */
          ScrollTrigger.create({ start: -1, end: () => fim() * 0.4, toggleClass: { targets: document.documentElement, className: "rx-sobre" } });
        }
        /* régua do rodapé: aparece com o Work; o projeto que cruza o meio da tela ganha tinta */
        ScrollTrigger.create({ trigger: ".rc-lista", start: "top 60%", end: "bottom 40%", toggleClass: { targets: ".rc-regua", className: "is-on" } });
        gsap.utils.toArray<HTMLElement>(".rc-proj").forEach((p, i) => {
          ScrollTrigger.create({ trigger: p, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setAtivo(i) });
        });
        gsap.fromTo(".rc-regua-fio i", { scaleX: 0 }, { scaleX: 1, ease: "none",
          scrollTrigger: { trigger: ".rc-lista", start: "top 55%", end: "bottom 55%", scrub: true } });
        if (prefersReducedMotion()) return;
        gsap.utils.toArray<HTMLElement>(".rc-proj .rc-quadro img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -5, scale: 1.1 }, { yPercent: 5, scale: 1.1, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
        /* peça pequena corre em outra velocidade que a grande: a grade respira */
        gsap.utils.toArray<HTMLElement>(".rc-peca--p").forEach((p) => {
          gsap.fromTo(p, { y: 120 }, { y: -120, ease: "none",
            scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
        /* o nome entra por máscara quando a peça chega */
        gsap.utils.toArray<HTMLElement>(".rc-titulo-m > *").forEach((t) => {
          gsap.fromTo(t, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: t.closest(".rc-proj"), start: "top 70%", toggleActions: "play none none reverse" } });
        });
        gsap.utils.toArray<HTMLElement>(".rb-info > *").forEach((m, i) => {
          gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", ease: "none",
            scrollTrigger: { trigger: ".rb-info", start: `top ${85 - i * 8}%`, end: "top 35%", scrub: 0.6 } });
        });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  /* a lente WebGL cola no quadro da peça sob o cursor (a peça rola, a lente vai junto) */
  useEffect(() => {
    if (!sob) return;
    const cola = () => {
      const l = lente.current, a = alvoEl.current;
      if (!l || !a) return;
      const r = a.getBoundingClientRect();
      gsap.set(l, { x: r.left, y: r.top, width: r.width, height: r.height });
    };
    cola();
    gsap.ticker.add(cola);
    return () => gsap.ticker.remove(cola);
  }, [sob]);

  const entrar = (w: WorkItem) => (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    alvoEl.current = e.currentTarget;
    setSob(w);
  };

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      <div ref={raiz} className="rb rc">
        <section className="ix-hero"><HeroReelFull /></section>

        {/* WORK — grade editorial de 12 colunas: cada projeto com escala e posição próprias */}
        <section className="rb-work rc-work">
          <div className="rc-reel">
            <button type="button" aria-label="Play reel" onClick={() => raiz.current?.querySelector<HTMLElement>(".rx-quadro")?.click()}>
              <span className="rc-quadro">
                <video src={REEL.video ?? undefined} poster={REEL.capa.src} autoPlay muted loop playsInline
                  ref={(v) => { if (v) { v.muted = true; v.playbackRate = 0.6; } }} />
              </span>
              <span className="rc-legenda p-marca"><span>00 — Showreel {REEL.ano}</span><span className="rb-quieto">Play reel</span></span>
            </button>
          </div>
          <ol className="rc-lista">
            {WORK.map((w, i) => {
              const [grande, ...resto] = [w.cover, ...w.images.slice(0, 2)];
              return (
                <li key={w.slug} className={`rc-proj rc-proj--${i % 4}`}>
                  <Link to={`/work/${w.slug}`} className="rc-peca rc-peca--g" aria-label={nome(w.title)} onPointerEnter={entrar(w)} onPointerLeave={() => setSob(null)}>
                    <span className="rc-quadro"><img src={grande.src} alt={grande.alt} loading="lazy" decoding="async" draggable={false} /></span>
                  </Link>
                  <p className="rc-titulo">
                    <span className="rc-titulo-m"><span className="p-marca rb-n">{NUM(i)}</span></span>
                    <span className="rc-titulo-m"><span className="rc-nome">{nome(w.title)}</span></span>
                    <span className="rc-titulo-m"><span className="p-marca rb-quieto">{w.disciplines.slice(0, 2).join(" · ")} — {w.year}</span></span>
                  </p>
                  {resto.map((im, k) => (
                    <Link key={k} to={`/work/${w.slug}`} className={`rc-peca rc-peca--p rc-peca--p${k}`} aria-hidden tabIndex={-1}>
                      <span className="rc-quadro"><img src={im.src} alt="" loading="lazy" decoding="async" draggable={false} /></span>
                    </Link>
                  ))}
                </li>
              );
            })}
          </ol>
        </section>

        {/* régua de índice fixa no rodapé: os 8 nomes; o atual ganha tinta; o fio marca o progresso */}
        <nav className="rc-regua p-marca" aria-label="Projects">
          <span className="rc-regua-cel">{NUM(ativo)} / {NUM(WORK.length - 1)} · {nome(WORK[ativo].title)}</span>
          <ol>
            {WORK.map((w, i) => <li key={w.slug} className={i === ativo ? "is-on" : undefined}><Link to={`/work/${w.slug}`}>{NUM(i)} {nome(w.title)}</Link></li>)}
          </ol>
          <span className="rc-regua-fio"><i /></span>
        </nav>

        {/* INFO — duas metades nas colunas do menu: a declaração | serviços e publicações */}
        <section className="rb-info">
          <div className="rb-info-a">
            <p className="p-rotulo">About</p>
            <p className="rb-bio">{LEAD[0]}</p>
          </div>
          <div className="rb-info-b">
            <div>
              <p className="p-rotulo">Services</p>
              <ol>{SERVICOS.map((s, i) => <li key={s.nome}><span className="rb-n p-marca">{NUM(i)}</span>{s.nome}</li>)}</ol>
            </div>
            <div>
              <p className="p-rotulo">Published in</p>
              <ol>
                {publicados.map((r) => {
                  const marca = r.logo
                    ? <span role="img" aria-label={r.veiculo} className={`ix-logo${r.logo.alturaPx ? " ix-logo--alto" : ""}`} style={{ "--logo": `url("${r.logo.src}")`, aspectRatio: `${r.logo.w} / ${r.logo.h}` } as CSSProperties} />
                    : <span className="ix-veiculo--abz">{r.veiculo}</span>;
                  const miolo = (
                    <>
                      <span className="rb-veiculo">{marca}</span>
                      <span className="rb-quieto">{nome(r.projeto)}{r.veiculo.includes("Behance") && <span className="ix-selo" title="Featured on Behance" aria-label="Featured on Behance">Bē</span>}</span>
                      <span className="p-marca rb-quieto">{r.ano}</span>
                    </>
                  );
                  return (
                    <li key={`${r.veiculo}-${r.projeto}-${r.ano}`}>
                      {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer" className="rb-pub">{miolo}</a> : <span className="rb-pub">{miolo}</span>}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        <div ref={lente} className={`rb-lente${sob ? " is-on" : ""}`} aria-hidden>
          <HoverFluido sob={sob} modo="cartaz" receita={4} />
        </div>
      </div>
    </Prancha>
  );
}
