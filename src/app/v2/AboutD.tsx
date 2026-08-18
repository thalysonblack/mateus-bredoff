import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { LEAD, NUMEROS, PROCESSO, PROCESSO_MANCHETE, FERRAMENTAS } from "../../content/about";
import { MODALIDADES } from "../../content/servicos";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import Palavra from "./Palavra";

/**
 * ABOUT — PROPOSTA D: "O RETRATO".
 *
 * Colhida do Savee dele (busca `about page`, 18/08): as peças que param o
 * scroll naquele grid não são densas — são UMA imagem grande com UMA frase por
 * cima. A "About bloody time." da Tesco e o "About / Lucas" do Bringhenti fazem
 * a mesma coisa: o retrato é o argumento, o texto é a legenda dele.
 *
 * As três abouts anteriores erraram no mesmo ponto — abriam explicando. Esta
 * abre com a CARA dele em tela cheia e o nome atravessando, e só depois deixa a
 * leitura acontecer. É o "elemento UAU e depois os textos" pedido em 17/08,
 * levado a sério: nada compete com a abertura.
 *
 * ⚠ A mecânica é a das folhas sobrepostas que ele já aprovou (Laxer/Obys): o
 * palco fica `sticky` e o conteúdo passa POR CIMA. Sem isso o retrato vira uma
 * capa que a pessoa rola para fora e esquece.
 */
export default function AboutD() {
  useMetaRota("/about");
  const metodo = useRevelar<HTMLDivElement>();
  const valores = useRevelar<HTMLDivElement>();

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects" rodape="completo">
      <div className="ab-d">
        {/* ── O PALCO ────────────────────────────────────────────────────
            Full bleed: sai das margens da prancha e sobe por baixo do
            cabeçalho, como na home dele. O nome em `difference` porque a foto
            é escura de um lado e clara do outro — cor fixa mancharia metade. */}
        <div className="ab-d-palco">
          <img
            className="ab-d-foto"
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="100vw"
            alt="Mateus Bredoff"
          />
          {/* ⚠ O nome ANCORA NA BASE, não no centro: a cabeça ocupa a faixa
              do meio e tipografia sobre o rosto de alguém é sempre erro de
              enquadramento, nunca de gosto. Aqui o retrato fica inteiro e a
              palavra fecha a tela por baixo, encostando nas duas margens. */}
          <h1 className="ab-d-nome">
            <Palavra texto="MATEUS BREDOFF" />
          </h1>
          <p className="ab-d-pe">
            <span>Brand designer</span>
            <span>Brazil · working globally</span>
            <span>Since 2019</span>
          </p>
        </div>

        {/* ── A FOLHA ─ passa por cima do palco e leva o papel de volta ── */}
        <div className="ab-d-folha">
          <section className="ab-d-lead">
            <div className="ab-d-lead-esq">
              <p className="ab-d-frase">
                I build identities that hold up <em>after</em> the launch.
              </p>
              {/* ⚠ a ficha existe para o vazio desta coluna ser RESPIRO e não
                  buraco: sem ela, a frase para em duas linhas e sobram 600px de
                  papel morto ao lado de uma coluna cheia. */}
              <dl className="ab-d-ficha">
                <div><dt className="p-rotulo">Based</dt><dd className="p-corpo">Brazil · UTC−3</dd></div>
                <div><dt className="p-rotulo">Practice</dt><dd className="p-corpo">Visual identity &amp; brand systems</dd></div>
                <div><dt className="p-rotulo">Working</dt><dd className="p-corpo">Globally, remote</dd></div>
                <div><dt className="p-rotulo">Since</dt><dd className="p-corpo">2019</dd></div>
              </dl>
            </div>
            <div className="ab-d-lead-corpo">
              {LEAD.map((p, i) => (
                <p key={i} className={i === 0 ? "ab-d-lead-1" : "p-corpo"}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section className="ab-d-numeros">
            {NUMEROS.map((n) => (
              <div key={n.rotulo}>
                <p className="p-numero-big">{n.valor}</p>
                <p className="p-rotulo">{n.rotulo}</p>
              </div>
            ))}
          </section>

          <section className="ab-d-metodo" ref={metodo}>
            <p className="p-rotulo">Method</p>
            <p className="ab-d-metodo-lead p-manifesto p-sobe">{PROCESSO_MANCHETE}</p>
            <ol className="ab-d-etapas p-sobe grid">
              {PROCESSO.map((e, i) => (
                <li key={e.titulo}>
                  <span className="p-numero">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="p-item">{e.titulo}</h3>
                  <p className="p-corpo">{e.corpo}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="ab-d-valores" ref={valores}>
            <p className="p-rotulo">Engagements</p>
            <div className="ab-d-valores-lista p-sobe grid">
              {MODALIDADES.map((m) => (
                <article key={m.nome}>
                  <h3 className="p-item">{m.nome}</h3>
                  <p className="ab-d-preco p-numero">
                    {m.precoDe ? `from $${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "On request"}
                  </p>
                  <p className="p-corpo">{m.para}</p>
                  <ul className="p-corpo ab-d-inclui">
                    {m.inclui.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <p className="p-marca">{m.prazo}</p>
                </article>
              ))}
            </div>
            <p className="p-marca ab-d-tools">Tools — {FERRAMENTAS.join(" · ")}</p>
          </section>
        </div>
      </div>
    </Prancha>
  );
}
