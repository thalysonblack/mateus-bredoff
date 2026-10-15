import { useEffect, useLayoutEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { INSTAGRAM } from "../../content/lab";
import { RECONHECIMENTO, type Reconhecimento } from "../../content/reconhecimento";
import { ScrollTrigger } from "../../lib/gsap";
import { scrollToTop } from "../../lib/lenis";
import retrato from "../../assets/optimized/framer/retrato-mateus-paisagem-1600.webp";
import retrato2x from "../../assets/optimized/framer/retrato-mateus-paisagem-3200.webp";
import neoxRosto from "../../assets/optimized/hover/neox-3.webp";
import type { WorkItem } from "../../content/work";
import retratoV from "../../assets/optimized/framer/retrato-mateus-vertical-900.webp";
import "../../styles/rolin.css";
import "../../styles/rolin-c.css";

/**
 * O SITE ROLIN C (15/10) — moldura comum às quatro rotas: grade de 12 à vista, menu fixo e rodapé.
 * Uma rota nova não recria nada disto; monta <RcMoldura> e, se quiser, <RcRodape>.
 */
export const RC = "/v2/rolin-c";
export const nome = (t: string) => t.replace("®", "").trim();
export const BEHANCE = "https://www.behance.net/mateusbredoff";
export const EMAIL = "hello@mateusbredoff.com";
/* capa trocada só nesta versão (15/10): Neox entra pelas peças gráficas (adesivos) */
export const capa = (w: WorkItem) => w.slug === "neox"
  ? { src: neoxRosto, srcSet: undefined, alt: "Neox — adesivos e peças gráficas da identidade" }
  : { src: w.cover.src, srcSet: w.cover.src2x ? `${w.cover.src} 1x, ${w.cover.src2x} 2x` : undefined, alt: w.cover.alt };
export const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);

/** o retrato do rodapé e da hero da About: o MESMO <picture>, para a troca não aparecer */
export function Retrato({ className, eager }: { className: string; eager?: boolean }) {
  return (
    <picture className={className}>
      <source media="(max-width: 899px)" srcSet={retratoV} />
      <img src={retrato} srcSet={`${retrato} 1x, ${retrato2x} 2x`} alt="Mateus Bredoff"
        loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

export function Publicacao({ r }: { r: Reconhecimento }) {
  const miolo = r.logo
    ? <span role="img" aria-label={`${r.veiculo} — ${nome(r.projeto)}`} className={`rl-logo${r.logo.alturaPx ? " is-alto" : ""}`} style={{ "--logo": `url("${r.logo.src}")`, aspectRatio: `${r.logo.w} / ${r.logo.h}` } as CSSProperties} />
    : <span>{r.veiculo}</span>;
  return (
    <p className="rl-pub">
      {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer">{miolo}</a> : miolo}
      <span className="rl-apagado">{nome(r.projeto)} ’{String(r.ano).slice(2)}</span>
    </p>
  );
}

/* grade de 12: estado comum às quatro rotas (localStorage) e escrito no <html>, onde o CSS lê */
const GRADE = "rc-grade";
const lerGrade = () => { try { return localStorage.getItem(GRADE) !== "off"; } catch { return true; } };
const sobEscuro = () => Array.from(document.querySelectorAll("[data-rc-escuro]")).some((b) => {
  const r = b.getBoundingClientRect();
  return r.top <= 40 && r.bottom > 40;
});
const guias = (className: string) => (
  <div className={className} aria-hidden>{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
);

/**
 * Grade + menu fixo. O menu fica branco sobre todo bloco marcado `data-rc-escuro`
 * (rodapé, hero da About). Triggers nascem depois das fontes + 2 frames:
 * o App mata os ScrollTriggers no effect da rota. O estado inicial do menu é medido na hora,
 * para a faixa de papel não piscar sobre a hero escura.
 */
export function RcMoldura({ atual, onAbout }: { atual?: "work" | "about"; onAbout?: (e: MouseEvent) => void }) {
  const [escuro, setEscuro] = useState(false);
  const [grade, setGrade] = useState(lerGrade);
  useEffect(() => {
    document.documentElement.toggleAttribute("data-rc-sem-grade", !grade);
    try { localStorage.setItem(GRADE, grade ? "on" : "off"); } catch { /* sem storage: vale só nesta visita */ }
  }, [grade]);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input, textarea")) return;
      setGrade((v) => !v);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);
  useLayoutEffect(() => {
    let vivo = true;
    let ts: ScrollTrigger[] = [];
    setEscuro(sobEscuro());
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      const ativos = new Set<Element>();
      ts = Array.from(document.querySelectorAll("[data-rc-escuro]")).map((bloco) =>
        ScrollTrigger.create({ trigger: bloco, start: "top 40px", end: "bottom 40px",
          onToggle: (t) => { t.isActive ? ativos.add(bloco) : ativos.delete(bloco); setEscuro(ativos.size > 0); } }));
      ScrollTrigger.refresh();
      setEscuro(sobEscuro());
    })));
    return () => { vivo = false; ts.forEach((t) => t.kill()); };
  }, []);
  const marca = (k: string) => (atual === k ? { "aria-current": "page" as const, className: "is-atual" } : {});
  return (
    <>
      {guias(`rc-grade-guia${escuro ? " is-info" : ""}`)}
      {/* grade liga/desliga: canto inferior esquerdo, fora do menu (não passa sobre capa); tecla G faz o mesmo */}
      <button type="button" className="rc-grade-bt" aria-pressed={grade} aria-label={grade ? "Ocultar grade" : "Mostrar grade"}
        title="Grid (G)" onClick={() => setGrade((v) => !v)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <rect x="0.5" y="0.5" width="3" height="13" /><rect x="5.5" y="0.5" width="3" height="13" /><rect x="10.5" y="0.5" width="3" height="13" />
        </svg>
      </button>
      <header className={`rc-fixo${escuro ? " is-info" : ""}`}>
        <Link to={RC}>Mateus Bredoff</Link>
        <span className="rc-disc">Brand design /<br />art direction</span>
        <nav className="rc-nav" aria-label="Site">
          <Link to={`${RC}/work`} {...marca("work")}>Work</Link>
          {/* na home o ABOUT é "#about": o obturador global só captura href "/…", e o gesto do retrato é o da home */}
          {onAbout ? <a href="#about" onClick={onAbout}>About</a> : <Link to={`${RC}/about`} {...marca("about")}>About</Link>}
        </nav>
      </header>
    </>
  );
}

/** rodapé: retrato + ficha no preto */
export function RcRodape() {
  return (
    <div id="rc-info" className="rl rc-pe" data-rc-escuro>
      <section className="rl-info">
        <Retrato className="rc-retrato" />
        <div className="rl-info-ficha">
          <div className="rl-info-cab">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><br />
              <a href={BEHANCE} target="_blank" rel="noopener noreferrer">Behance</a>
            </span>
          </div>
          <p className="rl-bio">{LEAD[0]}</p>
          <div className="rl-info-pe">
            <div>
              <p className="rl-apagado">Services</p>
              {SERVICOS.map((s) => <p key={s.nome}>{s.nome}</p>)}
            </div>
            <div>
              <p className="rl-apagado">Recognition</p>
              {publicados.map((r) => <Publicacao key={`${r.veiculo}-${r.projeto}-${r.ano}`} r={r} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * FECHAMENTO DA ABOUT (15/10): o contato no preto, na grade de 12 à vista. Rótulo na coluna 1,
 * ficha da coluna 7 (o eixo do centro). Só a About usa; home/work/case seguem com o RcRodape.
 */
export function RcFechamento({ rotulo }: { rotulo: string }) {
  return (
    <footer id="rc-info" className="rcf is-sem-foto" data-rc-escuro>
      {guias("rc-grade-guia rcf-guia")}
      <p className="rcf-rot"><span className="rcf-q">{rotulo}</span> Contact</p>
      <div className="rcf-ficha">
        <div className="rcf-contato">
          <a className="rcf-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <p className="rcf-redes">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={BEHANCE} target="_blank" rel="noopener noreferrer">Behance</a>
          </p>
        </div>
        <div className="rcf-servicos">
          <p className="rcf-q">Services</p>
          {SERVICOS.map((s) => <p key={s.nome}>{s.nome}</p>)}
        </div>
        <div className="rcf-pubs">
          <p className="rcf-q">Recognition</p>
          {publicados.map((r) => <Publicacao key={`${r.veiculo}-${r.projeto}-${r.ano}`} r={r} />)}
        </div>
        <div className="rcf-pe">
          <p className="rcf-q">© {new Date().getFullYear()} Mateus Bredoff</p>
          <button type="button" className="rcf-topo" onClick={() => scrollToTop(false)}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  );
}
