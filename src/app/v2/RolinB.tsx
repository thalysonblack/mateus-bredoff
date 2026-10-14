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
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css";
import "../../styles/rolin-b.css";

/**
 * ONE PAGE "ROLIN B" (13/10, "agora vamos diferenciar").
 * Fica a ESTRUTURA do thierryrolin.com (tela partida, índice parado, coluna de
 * peças, fio de progresso, info em duas metades). Sai tudo que era assinatura
 * dele e entra a do Bredoff: papel + tinta da Prancha, Geist grande e leve no
 * índice, mono nos números, o menu padrão, o reel em tela cheia na abertura e a
 * lente WebGL (receita Arco) em cima da peça no hover.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
const nome = (t: string) => t.replace("®", "").trim();
/* a frase da ponte é a 1ª frase da bio real; o resto da bio fica no Info */
const [FRASE, ...RESTO_BIO] = LEAD[0].split(/(?<=\.)\s+/);

export default function RolinB() {
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
        gsap.utils.toArray<HTMLElement>(".rb-peca").forEach((p, i) => {
          ScrollTrigger.create({ trigger: p, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setAtivo(i) });
        });
        gsap.fromTo(".rb-fio i", { scaleX: 0 }, { scaleX: 1, ease: "none",
          scrollTrigger: { trigger: ".rb-coluna", start: "top 55%", end: "bottom 55%", scrub: true } });
        if (prefersReducedMotion()) return;
        /* ponte: a frase acende palavra a palavra, de quieto para tinta, no scroll */
        const sp = SplitText.create(".rb-frase", { type: "words" });
        gsap.fromTo(sp.words, { color: "var(--p-quieto)", opacity: 0.35 }, { color: "var(--p-ink)", opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: ".rb-frase", start: "top 80%", end: "bottom 40%", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".rb-peca img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -5, scale: 1.1 }, { yPercent: 5, scale: 1.1, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
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
      <div ref={raiz} className="rb">
        <section className="ix-hero"><HeroReelFull /></section>

        {/* PONTE — quem ele é, antes do trabalho; o cabeçalho "Selected work" atraca e vira o topo do índice */}
        <section className="rb-ponte">
          <p className="p-rotulo">About</p>
          <p className="rb-frase">{FRASE}</p>
          <ul className="rb-fatos p-marca">
            <li><span className="rb-quieto">Based</span> Brazil — working globally</li>
            <li><span className="rb-quieto">Disciplines</span> {SERVICOS.map((s) => s.nome).join(" · ")}</li>
            <li><span className="rb-quieto">Currently</span> Available for projects</li>
          </ul>
        </section>

        <div className="rb-palco">
        <header className="rb-cab">
          <p className="p-rotulo">Selected work</p>
          <p className="rb-conta p-marca" aria-hidden>
            <span>{NUM(ativo)}</span><span className="rb-quieto"> / {NUM(WORK.length - 1)}</span>
            <span className="rb-fio"><i /></span>
          </p>
          <p className="p-marca rb-quieto rb-total">{NUM(WORK.length - 1)} projects</p>
        </header>
        {/* WORK — índice parado à esquerda (Geist grande e leve), peças rolando à direita */}
        <section className="rb-work">
          <div className="rb-indice">
            <ol>
              {WORK.map((w, i) => (
                <li key={w.slug} className={i === ativo ? "is-on" : undefined}>
                  <Link to={`/work/${w.slug}`}>
                    <span className="rb-n p-marca">{NUM(i)}</span>
                    <span className="rb-nome">{nome(w.title)}</span>
                    <img className="rb-mini" src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <ol className="rb-coluna">
            {WORK.map((w, i) => (
              <li key={w.slug} className="rb-peca">
                <Link to={`/work/${w.slug}`} aria-label={nome(w.title)} onPointerEnter={entrar(w)} onPointerLeave={() => setSob(null)}>
                  <span className="rb-quadro"><img src={w.cover.src} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} /></span>
                  <span className="rb-legenda p-marca">
                    <span>{NUM(i)} — {nome(w.title)}</span>
                    <span className="rb-quieto">{w.disciplines.slice(0, 2).join(" · ")} · {w.year}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        </div>

        {/* INFO — duas metades nas colunas do menu: a declaração | serviços e publicações */}
        <section className="rb-info">
          <div className="rb-info-a">
            <p className="p-rotulo">About</p>
            <p className="rb-bio">{RESTO_BIO.join(" ")}</p>
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
