import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { corDe } from "../../content/cores";
import { INSTAGRAM } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { HeroReelFull } from "./Reels";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css";
import "../../styles/nova.css";

/**
 * ONE PAGE "NOVA" (13/10, "saia do que já está me entregando").
 * Postura: palco escuro em que cada projeto inunda a tela com a SUA cor (amostrada da capa,
 * `content/cores`). Sai o papel com grade, a lista com fios, a tela partida e a mono.
 * Entra a Bodoni Moda em escala de cartaz e a Inter Tight no miúdo.
 * O scroll troca o projeto: a cor vira, o nome sobe, e a peça muda pelo fluido WebGL
 * (receita Arco) — a transição entre projetos É o WebGL, não um hover.
 * Ref.: Basic/Dept (o palco é o trabalho em escala total, o reel abre a casa).
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const nome = (t: string) => t.replace("®", "").trim();
const COR = (slug: string) => corDe(slug, "tinta");
const EMAIL = "hello@mateusbredoff.com";

export default function Nova() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);
  const [ativo, setAtivo] = useState(0);
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
        const reduz = prefersReducedMotion();
        const n = WORK.length;

        /* WORK: um palco preso; cada projeto ocupa um trecho do scroll */
        const nomes = gsap.utils.toArray<HTMLElement>(".nv-titulo");
        gsap.set(nomes, { yPercent: 40, autoAlpha: 0 });
        gsap.set(nomes[0], { yPercent: 0, autoAlpha: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".nv-work", start: "top top", end: () => `+=${window.innerHeight * n * 0.9}`,
            pin: true, scrub: 0.6, invalidateOnRefresh: true,
            onUpdate: (s) => setAtivo(Math.min(n - 1, Math.floor(s.progress * (n - 0.5) + 0.25))),
          },
        });
        WORK.forEach((w, i) => {
          if (i === 0) return;
          const t = i - 0.5;
          tl.to(".nv-work", { backgroundColor: COR(w.slug), duration: 0.5, ease: "none" }, t)
            .to(nomes[i - 1], { yPercent: -40, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, t)
            .to(nomes[i], { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, t + 0.3);
        });
        tl.to({}, { duration: 0.5 }, n - 1);
        if (!reduz) tl.fromTo(".nv-palco", { scale: 0.86 }, { scale: 1, duration: 1, ease: "power1.out" }, 0);

        /* ABOUT: as linhas sobem de uma máscara, uma a uma, com o scroll */
        const bio = el.querySelector<HTMLElement>(".nv-bio");
        if (bio) {
          const s = SplitText.create(bio, { type: "lines", mask: "lines" });
          gsap.from(s.lines, { yPercent: 110, stagger: 0.12, ease: "power2.out",
            scrollTrigger: { trigger: bio, start: "top 85%", end: "bottom 55%", scrub: 0.6 } });
        }

        /* SERVICES: cada linha corre num sentido; a cor de um projeto em cada uma */
        if (!reduz) gsap.utils.toArray<HTMLElement>(".nv-servico-nome").forEach((s, i) => {
          gsap.fromTo(s, { xPercent: i % 2 ? -18 : 18 }, { xPercent: i % 2 ? 6 : -6, ease: "none",
            scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
        });

        /* PUBLISHED: entra de baixo, linha a linha */
        gsap.from(".nv-pub", { y: 40, autoAlpha: 0, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".nv-pubs", start: "top 80%", end: "bottom 70%", scrub: 0.6 } });

        /* CONTATO: a tela inunda da base com a cor do Trivo e o "Let's talk" cresce */
        gsap.fromTo(".nv-fim", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none",
          scrollTrigger: { trigger: ".nv-fim", start: "top bottom", end: "top 20%", scrub: true } });
        if (!reduz) gsap.fromTo(".nv-fim-titulo", { scale: 0.7 }, { scale: 1, ease: "none",
          scrollTrigger: { trigger: ".nv-fim", start: "top bottom", end: "top top", scrub: true } });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  const w = WORK[ativo];
  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="regua">
      <div ref={raiz} className="nv">
        <section className="ix-hero"><HeroReelFull /></section>

        {/* WORK — o palco: cor do projeto chapada, nome em Bodoni de cartaz, peça pelo fluido WebGL */}
        <section className="nv-work" style={{ backgroundColor: COR(WORK[0].slug) }}>
          <div className="nv-nomes" aria-hidden>
            {WORK.map((x) => <p key={x.slug} className="nv-titulo">{nome(x.title)}</p>)}
          </div>
          <Link to={`/work/${w.slug}`} className="nv-palco" aria-label={nome(w.title)}>
            <img className="nv-capa" src={w.cover.src} alt={w.cover.alt} draggable={false} />
            <HoverFluido sob={w} modo="cartaz" receita={4} />
          </Link>
          <div className="nv-ficha">
            <p className="nv-conta"><span>{NUM(ativo)}</span><span className="nv-de">/{NUM(WORK.length - 1)}</span></p>
            <p className="nv-meta">{w.disciplines.slice(0, 2).join(", ")} — {w.year}</p>
          </div>
        </section>

        {/* ABOUT — palco preto, a declaração em Bodoni */}
        <section className="nv-sobre">
          <p className="nv-rotulo">About</p>
          <p className="nv-bio">{LEAD[0]}</p>
        </section>

        {/* SERVICES — quatro palavras em escala de cartaz, cada uma na cor de um projeto */}
        <section className="nv-servicos">
          <p className="nv-rotulo">Services</p>
          <ol>
            {SERVICOS.map((s, i) => (
              <li key={s.nome}>
                <span className="nv-servico-nome" style={{ color: COR(WORK[(i * 2 + 1) % WORK.length].slug) }}>{s.nome}</span>
                <span className="nv-servico-entrega">{s.entrega}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* PUBLISHED — logos em branco sobre o palco */}
        <section className="nv-pubs">
          <p className="nv-rotulo">Published in</p>
          <ol>
            {publicados.map((r) => {
              const marca = r.logo
                ? <span role="img" aria-label={r.veiculo} className={`ix-logo${r.logo.alturaPx ? " ix-logo--alto" : ""}`} style={{ "--logo": `url("${r.logo.src}")`, aspectRatio: `${r.logo.w} / ${r.logo.h}` } as CSSProperties} />
                : <span className="ix-veiculo--abz">{r.veiculo}</span>;
              const miolo = (
                <>
                  <span className="nv-veiculo">{marca}</span>
                  <span className="nv-proj">{nome(r.projeto)}{r.veiculo.includes("Behance") && <span className="nv-selo" title="Featured on Behance" aria-label="Featured on Behance">Bē</span>}</span>
                  <span className="nv-ano">{r.ano}</span>
                </>
              );
              return (
                <li key={`${r.veiculo}-${r.projeto}-${r.ano}`}>
                  {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer" className="nv-pub">{miolo}</a> : <span className="nv-pub">{miolo}</span>}
                </li>
              );
            })}
          </ol>
        </section>

        {/* CONTACT — a tela inteira na cor do Trivo */}
        <section className="nv-fim" style={{ backgroundColor: COR("trivo") }}>
          <p className="nv-fim-titulo">Let’s talk</p>
          <p className="nv-fim-links">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.behance.net/mateusbredoff" target="_blank" rel="noopener noreferrer">Behance</a>
          </p>
        </section>
      </div>
    </Prancha>
  );
}
