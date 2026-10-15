import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import figma from "../../assets/logos/ferramentas/figma.svg";
import openai from "../../assets/logos/ferramentas/openai.svg";
import gemini from "../../assets/logos/ferramentas/googlegemini.svg";
import bytedance from "../../assets/logos/ferramentas/bytedance.svg";
import photoshop from "../../assets/logos/ferramentas/adobephotoshop.svg";
import illustrator from "../../assets/logos/ferramentas/adobeillustrator.svg";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { RcMoldura, RcFechamento, Retrato, Publicacao, publicados } from "./RolinCMoldura";

/**
 * ABOUT DA ROLIN C (15/10). Abre no retrato em tela cheia, no MESMO enquadramento em que a
 * transição da home termina (50% 22%), para a troca não aparecer. Depois, a ficha na grade de 12:
 * rótulo à esquerda, conteúdo a partir do CENTRO da tela (o eixo das tags da home). Fecha no preto.
 * Todo texto vem de content/ — nada escrito aqui.
 */
/* marca de cada ferramenta (SVG oficial do Simple Icons, CC0), pintada em tinta por máscara.
   Nano Banana Pro é modelo do Gemini e Seedream da ByteDance: entra a marca da casa que o publica.
   Jitter não tem vetor oficial confiável: fica só o nome. */
const LOGO_FERRAMENTA: Record<string, string> = {
  Figma: figma, "Nano Banana Pro": gemini, Seedream: bytedance, GPT: openai, Photoshop: photoshop, Illustrator: illustrator,
};
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

      {/* A HERO DO /about ANTIGO (.p-hero), portada para o escopo rc: retrato em tela cheia, nome e
          ofício nos cantos de baixo em exclusion, recuo pelo scroll. Mesmo <picture> do rodapé da
          home e mesmo enquadramento (50% 22%) em que o clone da transição termina. */}
      <section className="rca-hero" data-rc-escuro>
        <Retrato className="rca-retrato" eager />
        <p className="rca-marca rca-marca--esq">Mateus<br />Bredoff</p>
        <p className="rca-marca rca-marca--dir">Brand<br />Designer</p>
      </section>

      <div className="rca-ficha">
        {/* 01 — bio: a primeira frase grande, a segunda em duas colunas de texto */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">01</span> About</p>
          <p className="rca-lead">{LEAD[0]}</p>
          <p className="rca-corpo rca-duas">{LEAD[1]}</p>
        </section>

        {/* 02 — números em grade 2×2, fio por cima de cada um */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">02</span> In numbers</p>
          <ol className="rca-nums">
            {NUMEROS.map((n) => <li key={n.rotulo}><span className="rca-num">{n.valor}</span><span className="rc-quieto">{n.rotulo}</span></li>)}
          </ol>
        </section>

        {/* 03 — processo: tabela de largura inteira (nº na coluna dos rótulos, corpo no eixo do centro) */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">03</span> Process</p>
          <p className="rca-manchete">{PROCESSO_MANCHETE}</p>
          <ol className="rca-etapas">
            {PROCESSO.map((e, i) => (
              <li key={e.titulo}>
                <span className="rc-quieto">{num(i)}</span>
                <span className="rca-etapa">{e.titulo}</span>
                <p className="rca-corpo">{e.corpo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 04 — serviços: nome | entrega à direita */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">04</span> Services</p>
          <ol className="rca-servicos">
            {SERVICOS.map((s) => <li key={s.nome}><span>{s.nome}</span><span className="rca-corpo">{s.entrega}</span></li>)}
          </ol>
        </section>

        {/* 05 — ferramentas: grade de três */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">05</span> Tools</p>
          <ul className="rca-ferramentas">
            {FERRAMENTAS.map((f) => (
              <li key={f}>
                {LOGO_FERRAMENTA[f]
                  ? <span className="rca-ferr-logo" aria-hidden style={{ "--logo": `url("${LOGO_FERRAMENTA[f]}")` } as CSSProperties} />
                  : <span className="rca-ferr-logo is-vazio" aria-hidden />}
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 06 — reconhecimento: logo | projeto ’ano, logos na mesma coluna */}
        <section className="rca-sec" data-rc-entra>
          <p className="rca-rot"><span className="rc-quieto">06</span> Recognition</p>
          <ol className="rca-pubs">
            {publicados.map((r) => (
              <li key={`${r.veiculo}-${r.projeto}-${r.ano}`}><Publicacao r={r} /></li>
            ))}
          </ol>
        </section>
      </div>

      <RcFechamento rotulo="07" />
    </div>
  );
}
