import { useLayoutEffect, useRef } from "react";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { INSTAGRAM } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { RcMoldura, Retrato, Publicacao, publicados, BEHANCE, EMAIL } from "./RolinCMoldura";

/**
 * ABOUT DA ROLIN C (15/10). Abre no retrato em tela cheia, no MESMO enquadramento em que a
 * transição da home termina (50% 22%), para a troca não aparecer. Depois, a ficha na grade de 12:
 * rótulo à esquerda, conteúdo a partir do CENTRO da tela (o eixo das tags da home). Fecha no preto.
 * Todo texto vem de content/ — nada escrito aqui.
 */
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function RolinCAbout() {
  useMetaRota();
  const raiz = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    let vivo = true;
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivo) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-rc-entra]").forEach((b) => {
          gsap.from(b, { y: 16, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%", once: true } });
        });
      }, el);
      ScrollTrigger.refresh();
    })));
    return () => { vivo = false; ctx?.revert(); };
  }, []);

  return (
    <div ref={raiz} className="rc rca">
      <RcMoldura atual="about" />

      <div className="rca-hero" data-rc-escuro>
        <Retrato className="rca-retrato" eager />
      </div>

      <div className="rca-ficha">
        <section className="rca-linha" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">01</span> About</p>
          <div className="rca-miolo rca-texto">{LEAD.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        </section>

        <section className="rca-linha" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">02</span> In numbers</p>
          <ol className="rca-miolo rca-tabela">
            {NUMEROS.map((n) => <li key={n.rotulo}><span>{n.valor}</span><span className="rc-quieto">{n.rotulo}</span></li>)}
          </ol>
        </section>

        <section className="rca-linha" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">03</span> Process</p>
          <div className="rca-miolo">
            <p className="rca-texto">{PROCESSO_MANCHETE}</p>
            <ol className="rca-etapas">
              {PROCESSO.map((e, i) => (
                <li key={e.titulo}>
                  <span className="rc-quieto">{num(i)}</span>
                  <span>{e.titulo}</span>
                  <p className="rca-corpo">{e.corpo}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rca-linha" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">04</span> Services</p>
          <ol className="rca-miolo rca-tabela">
            {SERVICOS.map((s) => <li key={s.nome}><span>{s.nome}</span><span className="rca-corpo">{s.entrega}</span></li>)}
          </ol>
        </section>

        <section className="rca-linha" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">05</span> Tools</p>
          <p className="rca-miolo">{FERRAMENTAS.join(", ")}</p>
        </section>

        <section className="rca-linha rl" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">06</span> Recognition</p>
          <div className="rca-miolo rca-pubs">{publicados.map((r) => <Publicacao key={`${r.veiculo}-${r.projeto}-${r.ano}`} r={r} />)}</div>
        </section>
      </div>

      <section className="rca-contato" data-rc-escuro>
        <p className="rca-rot"><span className="rca-apagado">07</span> Contact</p>
        <div className="rca-miolo">
          <a className="rca-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a><br />
            <a href={BEHANCE} target="_blank" rel="noopener noreferrer">Behance</a>
          </p>
        </div>
      </section>
    </div>
  );
}
