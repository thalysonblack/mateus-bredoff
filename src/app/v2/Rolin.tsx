import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { INSTAGRAM } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";
import { scrollToElement } from "../../lib/lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/rolin.css";

/**
 * ONE PAGE — "ROLIN" (13/10, "faz uma versão https://thierryrolin.com/").
 * Conceito trazido (medido em 1512 e 390), nunca texto/imagem/marca dele:
 *   · papel branco, UMA corpo de texto (11px, caixa alta, grotesca) em grade de 4 colunas;
 *   · tela partida: à esquerda o índice parado (ponto vermelho no ativo), à direita a
 *     coluna de peças que o scroll percorre; um fio no topo mostra onde se está;
 *   · pílula WORK / INFO no canto; hover na peça = cursor "+" e selo VIEW;
 *   · o INFO é o único grito: metade vermelha com a hora gigante, metade preta em vermelho.
 * Celular: cartões cheios com o nome no centro, pílula embaixo.
 */
const ANOS = `’${String(Math.min(...WORK.map((w) => w.year))).slice(2)} — ’${String(Math.max(...WORK.map((w) => w.year))).slice(2)}`;
const nome = (t: string) => t.replace("®", "").trim();
const horaBR = () => new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).split(":");

export default function Rolin() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);
  const [ativo, setAtivo] = useState(0);
  const [secao, setSecao] = useState<"work" | "info">("work");
  const [hora, setHora] = useState(horaBR);
  const [som, setSom] = useState(false);
  const reel = useRef<HTMLVideoElement | null>(null);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  useEffect(() => {
    const t = setInterval(() => setHora(horaBR()), 10_000);
    return () => clearInterval(t);
  }, []);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let ctx: gsap.Context | null = null;
    let vivo = true;
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        /* o App mata os ScrollTriggers no effect da rota: nascer dois frames depois das fontes */
        /* a peça que cruza o meio da tela é a ativa do índice */
        gsap.utils.toArray<HTMLElement>(".rl-peca").forEach((p, i) => {
          ScrollTrigger.create({ trigger: p, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setAtivo(i) });
        });
        /* o fio do topo: segmento preto anda pela trilha conforme a coluna passa */
        gsap.to(".rl-fio i", { xPercent: (WORK.length - 1) * 100, ease: "none",
          scrollTrigger: { trigger: ".rl-coluna", start: "top top", end: "bottom bottom", scrub: true } });
        ScrollTrigger.create({ trigger: ".rl-info", start: "top top+=52", onToggle: (s) => setSecao(s.isActive ? "info" : "work") });
        if (prefersReducedMotion()) return;
        /* peças sobem com leve atraso de imagem dentro do quadro */
        gsap.utils.toArray<HTMLElement>(".rl-peca img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
        /* INFO: as duas metades abrem por cortina e a hora sobe por máscara */
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".rl-info", start: "top 85%", end: "top 15%", scrub: 0.6 } });
        tl.fromTo(".rl-info-hora", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none" }, 0)
          .fromTo(".rl-info-ficha", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", ease: "none" }, 0)
          .fromTo(".rl-hora span", { yPercent: 100 }, { yPercent: 0, stagger: 0.08, ease: "power2.out" }, 0.2);
        gsap.fromTo(".rl-reel", { clipPath: "inset(12% 12% 12% 12% round 4px)" }, { clipPath: "inset(0% 0% 0% 0% round 4px)", ease: "none",
          scrollTrigger: { trigger: ".rl-reel", start: "top bottom", end: "center center", scrub: true } });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  const ir = (sel: string) => {
    const alvo = raiz.current?.querySelector<HTMLElement>(sel);
    if (alvo) scrollToElement(alvo);
  };

  const alternarSom = () => {
    const v = reel.current;
    if (!v) return;
    v.muted = som;
    if (!som) { v.currentTime = 0; v.play(); }
    setSom(!som);
  };

  return (
    <div ref={raiz} className="rl">
      <header className={`rl-topo${secao === "info" ? " is-info" : ""}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); ir(".rl-work"); }}>Mateus Bredoff</a>
        <span>Brand design /<br />art direction</span>
        <span className="rl-fio" aria-hidden><i style={{ width: `${100 / WORK.length}%` } as CSSProperties} /></span>
        <nav className="rl-pilula">
          <button type="button" className={secao === "work" ? "is-on" : undefined} onClick={() => ir(".rl-work")}>Work</button>
          <button type="button" className={secao === "info" ? "is-on" : undefined} onClick={() => ir(".rl-info")}>Info</button>
        </nav>
      </header>

      {/* WORK — índice parado à esquerda, coluna de peças à direita */}
      <section className="rl-work">
        <div className="rl-indice">
          <p className="rl-quieto">Selected work<br />{ANOS}</p>
          <ol>
            {WORK.map((w, i) => (
              <li key={w.slug} className={i === ativo ? "is-on" : undefined}>
                <Link to={`/work/${w.slug}`}>{nome(w.title)}</Link>
              </li>
            ))}
          </ol>
        </div>
        <ol className="rl-coluna">
          {WORK.map((w) => (
            <li key={w.slug} className="rl-peca">
              <Link to={`/work/${w.slug}`} aria-label={nome(w.title)}>
                <img src={w.cover.src} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                {w.images[0] && <img className="rl-peca-2" src={w.images[0].src} alt="" loading="lazy" decoding="async" draggable={false} />}
                <span className="rl-peca-nome">{nome(w.title)}</span>
                <span className="rl-view">View</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* REEL — mesma grade: rótulo à esquerda, o vídeo na coluna das peças */}
      {REEL.video && (
        <section className="rl-linha rl-sec-reel">
          <p>Showreel</p>
          <p className="rl-quieto">’{String(REEL.ano).slice(2)}<br />{som ? "Sound on" : "Muted"}</p>
          <button type="button" className="rl-reel" onClick={alternarSom} aria-label={som ? "Silenciar o showreel" : "Tocar o showreel com som"}>
            <video ref={reel} src={REEL.video} poster={REEL.capa.src} muted loop autoPlay playsInline preload="metadata" />
            <span className="rl-view">{som ? "Mute" : "Play sound"}</span>
          </button>
        </section>
      )}

      {/* SERVIÇOS — lista seca na grade de 4 */}
      <section className="rl-linha">
        <p>Services</p>
        <p className="rl-quieto">{String(SERVICOS.length).padStart(2, "0")}</p>
        <ol className="rl-servicos">
          {SERVICOS.map((s) => (
            <li key={s.nome}><span>{s.nome}</span><span className="rl-quieto">{s.entrega}</span></li>
          ))}
        </ol>
      </section>

      {/* INFO — o único grito: hora gigante no vermelho, ficha em vermelho no preto */}
      <section className="rl-info">
        <div className="rl-info-hora" aria-label={`${hora.join(":")} BRT`}>
          <p className="rl-hora"><span>{hora[0]}</span> <span>{hora[1]}</span><br /><span>BRT</span></p>
        </div>
        <div className="rl-info-ficha">
          <div className="rl-info-cab">
            <a href="mailto:hello@mateusbredoff.com" className="rl-ponto">hello@mateusbredoff.com</a>
            <span>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><br />
              <a href="https://www.behance.net/mateusbredoff" target="_blank" rel="noopener noreferrer">Behance</a>
            </span>
          </div>
          <p className="rl-bio">{LEAD[0]}</p>
          <div className="rl-info-pe">
            <div>
              <p className="rl-apagado">Services</p>
              {SERVICOS.map((s) => <p key={s.nome}>{s.nome}</p>)}
            </div>
            <div>
              <p className="rl-apagado">Publication</p>
              {publicados.map((r) => {
                const miolo = r.logo
                  ? <span role="img" aria-label={`${r.veiculo} — ${nome(r.projeto)}`} className={`rl-logo${r.logo.alturaPx ? " is-alto" : ""}`} style={{ "--logo": `url("${r.logo.src}")`, aspectRatio: `${r.logo.w} / ${r.logo.h}` } as CSSProperties} />
                  : <span>{r.veiculo}</span>;
                return (
                  <p key={`${r.veiculo}-${r.projeto}-${r.ano}`} className="rl-pub">
                    {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer">{miolo}</a> : miolo}
                    <span className="rl-apagado">{nome(r.projeto)} ’{String(r.ano).slice(2)}</span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
