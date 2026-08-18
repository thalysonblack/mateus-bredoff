import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { LEAD, NUMEROS, PROCESSO, FERRAMENTAS } from "../../content/about";
import { MODALIDADES, SERVICOS } from "../../content/servicos";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import Palavra from "./Palavra";

/**
 * ABOUT — PROPOSTA F: "A PALAVRA".
 *
 * Do Savee dele (18/08): o card em que ABOUT ocupa um retângulo azul chapado de
 * ponta a ponta, sem mais nada. É o mesmo argumento do seb astian que ele já
 * tinha apontado no LinkedIn — *make it big, make it bold*.
 *
 * Aqui a palavra não é título da seção: é a ARQUITETURA dela. Cada capítulo
 * abre com um vocábulo que encosta nas duas margens, em cor cheia tirada do
 * acervo dele, e o conteúdo se aninha logo abaixo, miúdo, para o contraste de
 * escala fazer o trabalho.
 *
 * ⚠ A palavra é SVG com `textLength="100%"` e `lengthAdjust="spacingAndGlyphs"`:
 * é o único jeito de ela encostar EXATAMENTE nas duas margens em qualquer
 * largura. `font-size` em `vw` erra por alguns pixels a cada breakpoint, e num
 * layout cuja régua é a margem, errar a margem é errar tudo.
 */
export default function AboutF() {
  useMetaRota("/about");
  const c2 = useRevelar<HTMLElement>();
  const c3 = useRevelar<HTMLElement>();
  const c4 = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="branco" status="Available for projects" rodape="completo">
      <div className="ab-f">
        <section className="ab-f-cap" style={{ "--cor": "#2f7b5c" } as React.CSSProperties}>
          <Palavra className="ab-f-palavra p-sobe" texto="ABOUT" />
          <div className="ab-f-conteudo">
            <img className="ab-f-retrato" src={retrato} alt="Mateus Bredoff" />
            <div className="ab-f-texto">
              {LEAD.map((p, i) => (
                <p key={i} className={i === 0 ? "p-manifesto" : "p-corpo"}>
                  {p}
                </p>
              ))}
              <dl className="ab-f-ficha">
                {NUMEROS.map((n) => (
                  <div key={n.rotulo}>
                    <dt className="p-numero">{n.valor}</dt>
                    <dd className="p-rotulo">{n.rotulo}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="ab-f-cap" ref={c2} style={{ "--cor": "#8e6552" } as React.CSSProperties}>
          <Palavra className="ab-f-palavra p-sobe" texto="CRAFT" />
          <div className="ab-f-grade p-sobe grid">
            {SERVICOS.map((s, i) => (
              <article key={s.nome}>
                <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="p-item">{s.nome}</h3>
                <p className="p-corpo">{s.entrega}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab-f-cap" ref={c3} style={{ "--cor": "#477587" } as React.CSSProperties}>
          <Palavra className="ab-f-palavra p-sobe" texto="RATES" />
          <div className="ab-f-rates p-sobe grid">
            {MODALIDADES.map((m) => (
              <article key={m.nome}>
                <h3 className="p-item">{m.nome}</h3>
                <p className="ab-f-preco">
                  {m.precoDe ? `$${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "On request"}
                </p>
                <p className="p-corpo">{m.para}</p>
                <ul className="p-marca">
                  {m.inclui.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="p-marca ab-f-prazo">{m.prazo}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab-f-cap" ref={c4} style={{ "--cor": "#da162e" } as React.CSSProperties}>
          <Palavra className="ab-f-palavra p-sobe" texto="METHOD" />
          <ol className="ab-f-metodo p-sobe grid">
            {PROCESSO.map((e, i) => (
              <li key={e.titulo}>
                <span className="p-numero">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="p-item">{e.titulo}</h3>
                <p className="p-corpo">{e.corpo}</p>
              </li>
            ))}
          </ol>
          <p className="p-marca ab-f-tools">Tools — {FERRAMENTAS.join(" · ")}</p>
        </section>
      </div>
    </Prancha>
  );
}
