import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import HomeFundo from "../v2/HomeFundo";
import "../../styles/orchard.css";

/**
 * VERSÃO ORCHARD (14/10/2026, branch `versao-orchard`).
 * A hero é a HomeFundo intacta. Abaixo dela, seções na gramática da ref
 * orchard.framer.website (conceito, não cópia): margem 20, eixo em 50%,
 * dois corpos só (14 e 64), linhas de trabalho largura total sem gutter.
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

export default function HomeOrchard() {
  const raiz = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !raiz.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-o-palavra]",
        { opacity: 0.14 },
        { opacity: 1, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: "[data-o-frase]", start: "top 80%", end: "bottom 45%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-o-parallax]").forEach((img) => {
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, raiz);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <>
      <HomeFundo />
      <div ref={raiz} className="o-raiz">
        <section className="o-manifesto" aria-label="About">
          <p className="o-14 o-cinza">(About)</p>
          <p className="o-64 o-frase" data-o-frase aria-label={FRASE}>
            {FRASE.split(" ").map((p, i) => (
              <span key={i} data-o-palavra aria-hidden="true">{p} </span>
            ))}
          </p>
        </section>

        <section className="o-trabalhos" aria-label="Selected work">
          {WORK.map((w, i) => (
            <Link key={w.slug} to={`/work/${w.slug}`} className="o-linha">
              <div className="o-midia">
                <img data-o-parallax src={w.cover.src} srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="(min-width: 48rem) 50vw, 100vw" alt={w.cover.alt} loading="lazy" decoding="async" />
              </div>
              <div className="o-ficha o-14">
                <span className="o-nome">{w.title}</span>
                <span className="o-cinza">{w.disciplines.join(", ")} · {w.year}</span>
                <span className="o-mono o-cinza">{pad(i + 1)} / {pad(WORK.length)}</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="o-recon" aria-label="Recognition">
          <p className="o-14 o-cinza">(Recognition)</p>
          <ul>
            {RECON.map((r) => (
              <li key={r.nome}>
                <span className="o-14 o-cinza">{r.rotulo}</span>
                <span className="o-64">{r.nome}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="o-contato" aria-label="Contact">
          <p className="o-14 o-cinza">(Contact)</p>
          <div>
            <p className="o-64">Have a brand to build? Let’s talk.</p>
            <form className="o-campo o-14" onSubmit={(e) => {
              e.preventDefault();
              const de = new FormData(e.currentTarget).get("email");
              window.location.href = `mailto:${EMAIL}?subject=New project&body=Reply to: ${de}`;
            }}>
              <label className="sr-only" htmlFor="o-email">Your email</label>
              <input id="o-email" name="email" type="email" required placeholder="Your email" />
              <button type="submit">Send →</button>
            </form>
          </div>
        </section>

        <footer className="o-rodape">
          <div className="o-colunas o-14">
            <div><p className="o-dim">Contact</p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
            <div><p className="o-dim">Pages</p><Link to="/work">Work</Link><Link to="/about">About</Link></div>
            <div><p className="o-dim">Based in</p><p>Brazil, working worldwide</p></div>
            <div><p className="o-dim">©</p><p>{new Date().getFullYear()}</p></div>
          </div>
          <p className="o-marca" aria-hidden="true">Mateus Bredoff</p>
        </footer>
      </div>
    </>
  );
}
