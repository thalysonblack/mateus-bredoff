import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { criarEstudo } from "../../lib/estudoWebGL";
import { PROCESSO } from "../../content/about";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { EstudoSecoes } from "./EstudoSecoes";

/**
 * HOME — O ESTUDO (03/10). Direção escolhida entre três: a escultura de gesso.
 *
 * A hero é UM objeto — as cinco formas da série "o estudo" montadas — e o
 * scroll o desmonta etapa por etapa do método dele (imersão, posicionamento,
 * direção visual, criação, entrega). A página conta o PROCESSO antes de
 * mostrar o trabalho; o trabalho vem depois, no mesmo duotom petróleo.
 *
 * Recusa, por escrito, o que levou "não curti" no Espaço: oito capas de
 * estilos diferentes como objeto (ruído), e truques de scroll de catálogo.
 * Aqui há um objeto só, uma matéria só, e tipografia pequena e precisa.
 */
export default function HomeEstudo() {
  useMetaRota();
  const palco = useRef<HTMLElement | null>(null);
  const tela = useRef<HTMLCanvasElement | null>(null);
  const [etapa, setEtapa] = useState(-1);

  useEffect(() => {
    const c = tela.current;
    const el = palco.current;
    if (!c || !el) return;
    const v = criarEstudo(c);
    if (!v) return;
    const reduzido = prefersReducedMotion();
    let alvo = 0;
    let atual = 0;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        alvo = s.progress;
      },
    });
    let ultima = -2;
    let antes = performance.now();
    const tick = () => {
      const agora = performance.now();
      const dt = Math.min((agora - antes) / 1000, 0.05);
      antes = agora;
      atual += (alvo - atual) * (reduzido ? 1 : 0.1);
      v.progresso(atual);
      v.passo(dt);
      /* a etapa em cena: cada uma ocupa 0,16 do percurso a partir de 0,10 */
      const e = atual < 0.1 ? -1 : Math.min(4, Math.floor((atual - 0.1) / 0.16));
      if (e !== ultima) setEtapa((ultima = e));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      v.destruir();
    };
  }, []);

  const atual = etapa >= 0 ? PROCESSO[etapa] : null;

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="regua">
      <section ref={palco} className="p-est-palco" aria-label="Mateus Bredoff — method">
        <div className="p-est-cena">
          <canvas ref={tela} className="p-est-canvas" />
          <div className="p-est-guias" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className={`p-est-abre${etapa < 0 ? " on" : ""}`}>
            <h1 className="p-est-nome">Mateus Bredoff</h1>
            <p className="p-est-oficio">
              Brand designer &amp; art director.
              <br />
              Brazil, working worldwide.
            </p>
          </div>

          <p className="p-est-rodape p-est-rodape--e">Identity is built in five moves</p>
          <p className="p-est-rodape p-est-rodape--d">Scroll ↓</p>

          <div className="p-est-etapa" aria-live="polite">
            {atual ? (
              <div key={etapa}>
                <span className="p-est-n">
                  {String(etapa + 1).padStart(2, "0")} <i>/ 05</i>
                </span>
                <span className="p-est-titulo">{atual.titulo}</span>
                <span className="p-est-corpo">{atual.corpo}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <EstudoSecoes />
    </Prancha>
  );
}
