import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Quadro, Marquee } from "./sistema";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { MODALIDADES } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { LAB } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — A HOME.
 *
 * Seis blocos: abertura → índice → serviços → bloco de nomes → playground →
 * rodapé (este mora no `Quadro`).
 *
 * ## A segunda passada (01/09), depois de "todos" os blocos serem apontados
 *
 * A primeira montagem acertou a ORDEM e errou a ANATOMIA de quase todos:
 *
 *   abertura   era split 54/46 — texto à esquerda, peça à direita. Na
 *              referência a mídia cobre a viewport INTEIRA e o texto vive por
 *              cima dela. São leituras opostas: uma apresenta duas coisas lado
 *              a lado, a outra apresenta uma só.
 *   índice     era empacotamento por coluna, que resolve buraco e desalinha as
 *              legendas. Volta a ser grade de LINHAS — é o alinhamento
 *              horizontal que faz um índice ler como índice.
 *   serviços   era pilha de linhas horizontais; lá são CARDS lado a lado com
 *              fio separando, numeral no alto e lista de entregas por baixo.
 *   nomes      uma linha só não sustenta o bloco: é a MASSA que produz o efeito.
 *   playground marquee de texto passa a correr as PEÇAS.
 *
 * ⚠ A altura segue sendo o teste de "estrutura demais" — a referência fecha em
 * 5.677px a 1440.
 */
export default function HomeV4() {
  useMetaRota();

  /**
   * A abertura percorre o acervo — o equivalente ao showreel em autoplay.
   *
   * ⚠ 4,2s por peça: abaixo de ~3s vira slideshow de banner e a leitura do nome
   * não fecha antes da troca. `prefers-reduced-motion` para na primeira peça,
   * em vez de esconder a seção.
   */
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % WORK.length), 4200);
    return () => clearInterval(t);
  }, []);
  const abertura = WORK[i];

  /* o bloco de nomes precisa de MASSA. Ele tem oito projetos e três veículos, e
     é isso que o bloco afirma: os nomes do trabalho e os lugares onde ele saiu.
     Nome inventado não entra para encher linha. */
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];
  const nomes = [...WORK.map((w) => w.title), ...veiculos];

  const anos = WORK.map((w) => w.year);

  return (
    <Quadro>
      {/* ── 1. abertura ─────────────────────────────────────────────────── */}
      <header className="q-hero">
        <Link to={`/v4/work/${abertura.slug}`} className="q-hero-peca" aria-label={abertura.title}>
          {/* as oito ficam montadas e trocam por opacidade: recriar o <img> a
              cada 4,2s dá flash branco enquanto o arquivo decodifica */}
          {WORK.map((w, k) => (
            <img
              key={w.slug}
              className={k === i ? "q-hero-img q-hero-img-viva" : "q-hero-img"}
              src={w.cover.src}
              srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              alt={k === 0 ? w.cover.alt : ""}
              aria-hidden={k === 0 ? undefined : true}
              width={w.cover.w}
              height={w.cover.h}
              fetchpriority={k === 0 ? "high" : undefined}
              loading={k === 0 ? undefined : "lazy"}
              decoding="async"
              draggable={false}
            />
          ))}
        </Link>

        {/* ⚠ o texto vive SOBRE a mídia, e por isso a peça carrega um véu: a capa
            troca a cada 4,2s e vai de vermelho cheio a preto — nenhuma cor fixa
            de texto sobrevive às oito sem ele. */}
        <div className="q-hero-dizer">
          <h1 className="q-display-md" style={{ maxWidth: "17ch" }}>
            Multidisciplinary designer building visual identities from strategy.
          </h1>
          <p className="q-meta q-hero-regua">
            <span>Brazil — working globally</span>
            <span>
              {WORK.length} projects · {Math.min(...anos)}–{Math.max(...anos)}
            </span>
            <span className="q-hero-agora">{abertura.title}</span>
            <span>Available for projects</span>
          </p>
        </div>
      </header>

      {/* ── 2. índice ───────────────────────────────────────────────────── */}
      <section aria-labelledby="v4-work">
        <h2 id="v4-work" className="sr-only">
          Selected work
        </h2>
        {/* ⚠ GRADE DE LINHAS, não colunas empacotadas. O empacotamento resolvia
            buraco e desalinhava as legendas; é o alinhamento horizontal que faz
            um índice parecer índice. Com a razão 11:8 — a mediana do acervo
            dele — o `cover` corta pouco e nenhuma peça é decepada. */}
        <div className="q-indice" data-foca>
          {WORK.map((w) => (
            <Link
              key={w.slug}
              to={`/v4/work/${w.slug}`}
              className="q-cel"
              style={{ ["--q-cor" as string]: CORES[w.slug]?.papel }}
            >
              <span className="q-cel-arte">
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="(max-width: 560px) 96vw, (max-width: 900px) 48vw, 33vw"
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {w.images[0] && (
                  <img
                    className="q-cel-arte-2"
                    src={w.images[0].src}
                    sizes="(max-width: 560px) 96vw, (max-width: 900px) 48vw, 33vw"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                )}
              </span>
              <span className="q-cel-legenda">
                <span className="q-cel-nome">{w.title}</span>
                <span className="q-meta">{w.disciplines.join(", ")}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. serviços ─────────────────────────────────────────────────── */}
      <section className="q-bloco" aria-labelledby="v4-serv">
        <h2 id="v4-serv" className="q-display-md q-manchete">
          Three ways the work arrives — from building the whole brand to a month
          reserved on the calendar.
        </h2>

        {/* ⚠ São as MODALIDADES, não as quatro disciplinas: o card pede nome +
            lista de entregas, e `inclui` é a única lista real no material dele.
            A disciplina tem só uma frase corrida, que dentro de um card vira
            parágrafo e desmancha a anatomia. */}
        <div className="q-cards">
          {MODALIDADES.map((m, k) => (
            <article className="q-card" key={m.nome}>
              <p className="q-num">
                <span className="q-ponto" aria-hidden="true" />
                {String(k + 1).padStart(2, "0")}
              </p>
              <h3 className="q-servico-nome">{m.nome}</h3>
              <ul className="q-card-lista q-meta">
                {m.inclui.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <p className="q-card-pe q-meta">
                {m.prazo}
                {" · "}
                {m.precoDe && !m.aConfirmar
                  ? `from US$ ${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}`
                  : "on request"}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. o bloco de nomes ─────────────────────────────────────────── */}
      <section className="q-bloco" aria-labelledby="v4-pub" style={{ paddingTop: 0 }}>
        <h2
          id="v4-pub"
          className="q-meta q-meta-ink"
          style={{ paddingBottom: "clamp(28px,3.5vw,48px)" }}
        >
          The work, and where it has been published
        </h2>
        <p className="q-nomes">
          {nomes.map((n, k) => (
            <span key={n}>
              {n}
              {k < nomes.length - 1 && <span className="q-nomes-sep">·</span>}
            </span>
          ))}
        </p>
      </section>

      {/* ── 5. playground ───────────────────────────────────────────────── */}
      <section aria-labelledby="v4-lab">
        <h2 id="v4-lab" className="sr-only">
          Lab
        </h2>
        {/* ⚠ o marquee da referência corre PEÇAS, não palavras. Ensaio sem arte
            no repo continua entrando como placa — o `Marquee` trata os dois. */}
        <Marquee
          itens={LAB.map((e) => ({
            texto: e.brand,
            nota: e.discipline,
            arte: WORK.find((w) => w.slug === e.slug)?.cover,
          }))}
        />
      </section>
    </Quadro>
  );
}
