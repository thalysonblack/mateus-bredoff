import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { LEAD, NUMEROS, PROCESSO, FERRAMENTAS } from "../../content/about";
import { MODALIDADES, SERVICOS } from "../../content/servicos";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";

/**
 * ABOUT — PROPOSTA G: "A CARTELA".
 *
 * Lida dos 63 SALVOS dele no Savee (19/08). O que ele guarda, em ordem de
 * frequência:
 *
 *   · tipografia condensada dentro de RETÂNGULO DE COR CHAPADA — "Full Circle"
 *     roxo, "EVERY DETAIL", "Time Will Tell", "youth culture";
 *   · notação de FICHA TÉCNICA — `SP–307 9.12B`, `P06 AW07 S62 NK30`, o ©, as
 *     setas, os cantos numerados 1·2·3·4;
 *   · cartelas de cor pura isoladas, e o grid de bandeirinhas náuticas: cor
 *     como CONTEÚDO, não como enfeite;
 *   · macro de objeto metálico sobre fundo chapado.
 *
 * Nenhuma das propostas anteriores usou nada disso: todas eram papel, fio de
 * 1px e coluna de texto. Esta troca o papel pelo BLOCO. A about deixa de ser
 * um documento sobre ele e vira a FICHA TÉCNICA dele — cada dado num campo de
 * cor, numerado, com a notação de quem cataloga o próprio trabalho.
 *
 * ⚠ A cartela de cor não é decorativa: são as oito cores amostradas das capas
 * dos projetos dele (`content/cores.ts`). É o único lugar do site em que o
 * acervo inteiro aparece de uma vez — e diz o que nenhuma frase diria sobre a
 * amplitude do que ele já fez.
 */
export default function AboutG() {
  useMetaRota("/about");
  const bloco2 = useRevelar<HTMLDivElement>();
  const bloco3 = useRevelar<HTMLDivElement>();
  const bloco4 = useRevelar<HTMLDivElement>();

  /* A cartela mostra o acervo inteiro, sem repetir hex (Bureau e Alex Archer
     dividem a mesma cor). */
  const paleta = Object.entries(CORES).filter(
    ([slug], i, a) => a.findIndex(([, c]) => c.papel === CORES[slug].papel) === i,
  );
  /* ⚠ Os blocos de dado NÃO puxam da paleta por índice: os dois primeiros
     azuis do acervo são quase o mesmo tom e os campos ficavam indistinguíveis.
     Estes três foram escolhidos por DISTÂNCIA de matiz — vermelho, verde,
     ocre —, que é o que faz três campos lidos como três campos. */
  const CAMPO = ["ginga", "votare", "trivo"].map((k) => CORES[k].papel);
  const DISCIPLINA = ["ginga", "alex-archer", "stag", "votare"].map((k) => CORES[k].papel);

  return (
    <Prancha n="03" nome="About" superficie="branco" status="Available for projects" rodape="completo">
      <div className="ab-g">
        {/* ── A CAPA DA FICHA ─ notação antes de qualquer frase ─────────── */}
        <header className="ab-g-capa">
          <div className="ab-g-serie">
            <span>MB—2019</span>
            <span>REV. 03</span>
            <span>BR / UTC−3</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
          <h1 className="ab-g-titulo">
            Brand
            <br />
            Designer
          </h1>
          <div className="ab-g-capa-pe">
            <p className="p-corpo">{LEAD[0]}</p>
          </div>
        </header>

        {/* ── O CAMPO ─ cada dado num bloco, numerado ───────────────────── */}
        <div className="ab-g-campo">
          <figure className="ab-g-bloco ab-g-bloco--retrato">
            <img
              src={retrato}
              srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
              sizes="50vw"
              alt="Mateus Bredoff"
            />
            <figcaption className="ab-g-n">01</figcaption>
          </figure>

          {NUMEROS.slice(0, 3).map((n, i) => (
            <div
              className="ab-g-bloco ab-g-bloco--dado"
              key={n.rotulo}
              style={{ "--cor": CAMPO[i] } as React.CSSProperties}
            >
              <p className="ab-g-valor">{n.valor}</p>
              <p className="ab-g-rotulo">{n.rotulo}</p>
              <span className="ab-g-n">{String(i + 2).padStart(2, "0")}</span>
            </div>
          ))}
        </div>

        {/* ── A CARTELA ─ o acervo inteiro numa tira ────────────────────── */}
        <section className="ab-g-cartela" ref={bloco2}>
          <p className="ab-g-secao">
            <span>Colour index</span>
            <span>{paleta.length} entries · sampled from the work</span>
          </p>
          <ul className="p-sobe grid">
            {paleta.map(([slug, cor]) => {
              const peca = WORK.find((w) => w.slug === slug);
              return (
                <li key={slug} style={{ "--cor": cor.papel } as React.CSSProperties}>
                  <span className="ab-g-swatch" />
                  <span className="ab-g-swatch-nome">{peca?.title ?? slug}</span>
                  <span className="ab-g-swatch-hex">{cor.papel.toUpperCase()}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── AS DISCIPLINAS ─ blocos de cor com o que ele faz ──────────── */}
        <section className="ab-g-disciplinas" ref={bloco3}>
          <p className="ab-g-secao">
            <span>Practice</span>
            <span>{SERVICOS.length} disciplines</span>
          </p>
          <div className="p-sobe grid">
            {SERVICOS.map((s, i) => (
              <article key={s.nome} style={{ "--cor": DISCIPLINA[i] } as React.CSSProperties}>
                <span className="ab-g-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.nome}</h3>
                <p className="p-corpo">{s.entrega}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── OS PACOTES ─ ficha de produto, com número de série ────────── */}
        <section className="ab-g-pacotes" ref={bloco4}>
          <p className="ab-g-secao">
            <span>Engagements</span>
            <span>Rates in USD</span>
          </p>
          <div className="p-sobe grid">
            {MODALIDADES.map((m, i) => (
              <article key={m.nome}>
                <div className="ab-g-pacote-cabeca">
                  <span className="ab-g-n">SP—{30 + i}</span>
                  <h3>{m.nome}</h3>
                </div>
                <p className="ab-g-preco">
                  {m.precoDe ? `$${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "On request"}
                </p>
                <p className="p-corpo">{m.para}</p>
                <ul>
                  {m.inclui.map((x) => (
                    <li key={x} className="p-marca">
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="p-marca ab-g-prazo">↳ {m.prazo}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── O PROCESSO ─ sequência numerada, sem prosa ────────────────── */}
        <section className="ab-g-processo">
          <p className="ab-g-secao">
            <span>Sequence</span>
            <span>{PROCESSO.length} stages</span>
          </p>
          <ol>
            {PROCESSO.map((e, i) => (
              <li key={e.titulo}>
                <span className="ab-g-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{e.titulo}</h3>
                <p className="p-corpo">{e.corpo}</p>
              </li>
            ))}
          </ol>
          <p className="ab-g-tools p-marca">
            Toolkit — {FERRAMENTAS.join(" / ")}
          </p>
        </section>
      </div>
    </Prancha>
  );
}
