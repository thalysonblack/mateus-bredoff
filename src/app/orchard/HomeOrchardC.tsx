import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import HomeFundo from "../v2/HomeFundo";
import "../../styles/orchard-c.css";

/**
 * VERSÃO C — imersiva/escura (15/10/2026, branch `versao-orchard`).
 * HomeFundo intacta. Abaixo: teal e tinta; cases numa galeria horizontal
 * fixada (desktop, sem reduced-motion); contato em tela cheia.
 */
const FRASE =
  "Collaborating with companies that understand the value of building a clear, relevant, and memorable presence.";
const RECON = [
  { rotulo: "Featured", nome: "Behance" },
  { rotulo: "Published", nome: "Abduzeedo" },
  { rotulo: "Published ×3", nome: "World Brand Design" },
];
const EMAIL = "hello@mateusbredoff.com";
const pad = (n: number) => String(n).padStart(2, "0");

export default function HomeOrchardC() {
  const raiz = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(min-width: 64rem)").matches) return;
    let ctx: gsap.Context | undefined;
    let vivo = true;
    /* O RouteLifecycle (App) mata todo trigger no useEffect DEPOIS deste
       layout effect: criar após fontes + dois frames, como a Nova. */
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo || !raiz.current) return;
      ctx = gsap.context(() => {
        const trilho = raiz.current!.querySelector<HTMLElement>("[data-c-trilho]")!;
        const dist = () => trilho.scrollWidth - window.innerWidth;
        gsap.to(trilho, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: "[data-c-galeria]", start: "top top", end: () => `+=${dist()}`,
            pin: true, scrub: true, invalidateOnRefresh: true },
        });
      }, raiz);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  return (
    <>
      <HomeFundo />
      <div ref={raiz} className="c-raiz">
        <section className="c-manifesto" aria-label="About">
          <p className="c-14 c-dim">(About)</p>
          <p className="c-64">{FRASE}</p>
        </section>

        <section className="c-galeria" data-c-galeria aria-label="Selected work">
          <div className="c-trilho" data-c-trilho>
            {WORK.map((w, i) => (
              <Link key={w.slug} to={`/work/${w.slug}`} className="c-card">
                <div className="c-midia">
                  <img src={w.cover.src} srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                    sizes="(min-width: 64rem) 60vw, 100vw" alt={w.cover.alt} loading="lazy" decoding="async" />
                </div>
                <p className="c-ficha c-14">
                  <span className="c-mono c-dim">{pad(i + 1)}</span>
                  <span>{w.title}</span>
                  <span className="c-dim">{w.year}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="c-recon" aria-label="Recognition">
          <p className="c-14 c-dim">(Recognition)</p>
          <ul className="c-14">
            {RECON.map((r) => <li key={r.nome}><span>{r.nome}</span><span className="c-dim">{r.rotulo}</span></li>)}
          </ul>
        </section>

        <footer className="c-contato" aria-label="Contact">
          <p className="c-14 c-dim">(Contact)</p>
          <a className="c-64 c-email" href={`mailto:${EMAIL}`}>Let’s build a brand.<br /><span className="c-dim">{EMAIL}</span></a>
          <div className="c-pe c-14 c-dim">
            <Link to="/work">Work</Link><Link to="/about">About</Link>
            <span>Brazil, working worldwide</span><span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
