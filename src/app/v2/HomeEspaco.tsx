import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { criarEspaco, type Espaco } from "../../lib/espacoWebGL";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { SecoesUma } from "./HomeUma";

/**
 * HOME — O ESPAÇO (03/10, "faz algo como fez no Florén").
 *
 * A mesma gramática do conceito Florén — um objeto 3D que o scroll desmonta,
 * a câmera que mergulha nele, e o site que continua em seções — com a matéria
 * do Bredoff: as oito peças como pranchas impressas (`lib/espacoWebGL.ts`).
 *
 *   PALCO     pilha girando devagar; o nome em escala de cartaz na base
 *   ABERTURA  a pilha abre em leque
 *   MERGULHO  corredor de pranchas; a câmera atravessa e o nome do projeto
 *             em foco aparece grande (clique na prancha abre o case)
 *   GRADE     as oito pousam em 4×2 — e o site segue: sobre, serviços,
 *             showreel, publicado (`SecoesUma`)
 *
 * O palco é uma seção alta (600vh) com o canvas em `sticky`: nada de pin, o
 * próprio fluxo segura a cena, e o ScrollTrigger só lê o progresso.
 */
export default function HomeEspaco() {
  useMetaRota();
  const navigate = useNavigate();
  const palco = useRef<HTMLElement | null>(null);
  const tela = useRef<HTMLCanvasElement | null>(null);
  const motor = useRef<Espaco | null>(null);
  const [foco, setFoco] = useState(-1);
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const c = tela.current;
    const el = palco.current;
    if (!c || !el) return;
    const v = criarEspaco(
      c,
      WORK.map((w) => PECAS[w.slug][0]),
      (i) => navigate(`/work/${WORK[i].slug}`),
    );
    motor.current = v;
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
    let ultimoFoco = -2;
    let ultimaFase = -1;
    let antes = performance.now();
    const tick = () => {
      const agora = performance.now();
      const dt = Math.min((agora - antes) / 1000, 0.05);
      antes = agora;
      atual += (alvo - atual) * (reduzido ? 1 : 0.12);
      v.progresso(atual);
      v.passo(dt);
      const f = v.emFoco();
      if (f !== ultimoFoco) setFoco((ultimoFoco = f));
      const ph = atual < 0.1 ? 0 : atual < 0.26 ? 1 : atual < 0.8 ? 2 : 3;
      if (ph !== ultimaFase) setFase((ultimaFase = ph));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      v.destruir();
      motor.current = null;
    };
  }, [navigate]);

  const emFoco = foco >= 0 ? WORK[foco] : null;
  const legendas = ["", "01 / Selected work", "02 / The work, up close", "03 / Eight brands"];

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="completo">
      <section ref={palco} className="p-esp-palco" aria-label="Selected work">
        <div className="p-esp-cena">
          <canvas ref={tela} className="p-esp-canvas" />

          <div className={`p-esp-hero${fase === 0 ? " on" : ""}`}>
            <p className="p-marca p-esp-kicker">Brand designer &amp; art director — Brazil, working worldwide</p>
            <p className="p-marca p-esp-role">
              Scroll
              <br />
              to open ↓
            </p>
            <h1 className="p-esp-nome">Mateus Bredoff</h1>
          </div>

          <p className="p-marca p-esp-legenda" key={fase}>
            {legendas[fase]}
          </p>

          <div className={`p-esp-foco${emFoco ? " on" : ""}`} aria-live="polite">
            {emFoco ? (
              <div key={emFoco.slug}>
                <span className="p-marca">
                  {String(foco + 1).padStart(2, "0")} — {emFoco.disciplines.join(", ")} · {emFoco.year}
                </span>
                <span className="p-esp-foco-nome">{emFoco.title}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <SecoesUma />
    </Prancha>
  );
}
