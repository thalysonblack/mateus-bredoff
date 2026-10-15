import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { INSTAGRAM } from "../../content/lab";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import retrato from "../../assets/optimized/framer/retrato-mateus-paisagem-1600.webp";
import retrato2x from "../../assets/optimized/framer/retrato-mateus-paisagem-3200.webp";
import retratoV from "../../assets/optimized/framer/retrato-mateus-vertical-900.webp";
import "../../styles/rolin.css";
import "../../styles/rolin-c.css";

/**
 * ONE PAGE — "ROLIN C" (15/10). Topo idêntico ao da Rolin (nome | disciplina, 11px caixa alta).
 * O resto muda: topo NÃO é fixo (nada passa por cima de imagem), sem fio e sem pílula;
 * os trabalhos são um catálogo escalonado na grade de 4 — cada peça ocupa 2 colunas,
 * alternando o lado, com a legenda FORA da imagem, embaixo. Celular: pilha de uma coluna.
 */
const nome = (t: string) => t.replace("®", "").trim();
const ANOS = `’${String(Math.min(...WORK.map((w) => w.year))).slice(2)} — ’${String(Math.max(...WORK.map((w) => w.year))).slice(2)}`;

export default function RolinC() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);
  const [noPe, setNoPe] = useState(false);
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let ctx: gsap.Context | null = null;
    let vivo = true;
    const reduz = prefersReducedMotion();
    /* o App mata os ScrollTriggers no effect da rota: nascer dois frames depois das fontes */
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        ScrollTrigger.create({ trigger: "#rc-info", start: "top 40px", onToggle: (t) => setNoPe(t.isActive) });
        if (reduz) return;
        gsap.utils.toArray<HTMLElement>(".rc-quadro").forEach((q) => {
          gsap.fromTo(q, { clipPath: "inset(14% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
          gsap.fromTo(q.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: q, start: "top 88%", once: true } });
        });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  return (
    <div ref={raiz} className="rc">
      {/* MENU FIXO: nome | disciplina | WORK INFO, sempre na tela */}
      <header className={`rc-fixo${noPe ? " is-info" : ""}`}>
        <Link to="/v2/rolin-c">Mateus Bredoff</Link>
        <span>Brand design /<br />art direction</span>
        <nav className="rc-nav" aria-label="Seções">
          <a href="#rc-work">Work</a>
          <a href="#rc-info">Info</a>
        </nav>
      </header>

      <div className="rc-palco">
        <aside className="rc-lado">
          <div id="rc-work" className="rc-lado-topo rc-lado-abre">
            <p>Selected work</p>
            <p className="rc-quieto">{ANOS}</p>
          </div>
        </aside>

        <ol className="rc-lista">
          {WORK.map((w, i) => (
            <li key={w.slug} className="rc-peca">
              <Link to={`/work/${w.slug}`}>
                <span className="rc-quadro" style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}>
                  <img src={w.cover.src} srcSet={w.cover.src2x ? `${w.cover.src} 1x, ${w.cover.src2x} 2x` : undefined}
                    width={w.cover.w} height={w.cover.h}
                    alt={w.cover.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" draggable={false} />
                </span>
                <span className="rc-legenda">
                  <span className="rc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{nome(w.title)}</span>
                  <span className="rc-quieto">{w.disciplines.join(", ")}</span>
                  <span className="rc-quieto rc-ano">{w.year}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <aside className="rc-dir">
          <p className="rc-quieto rc-conta">{String(WORK.length).padStart(2, "0")} projects</p>
        </aside>
      </div>

      {/* RODAPÉ: retrato dele + ficha no preto, sem vermelho */}
      <div id="rc-info" className="rl rc-pe">
        <section className="rl-info">
          <picture className="rc-retrato">
            <source media="(max-width: 899px)" srcSet={retratoV} />
            <img src={retrato} srcSet={`${retrato} 1x, ${retrato2x} 2x`} alt="Mateus Bredoff" loading="lazy" decoding="async" />
          </picture>
          <div className="rl-info-ficha">
            <div className="rl-info-cab">
              <a href="mailto:hello@mateusbredoff.com" >hello@mateusbredoff.com</a>
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
    </div>
  );
}
