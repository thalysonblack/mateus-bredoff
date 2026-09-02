import { Link } from "react-router";
import { Quadro, Marquee } from "./sistema";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { LAB } from "../../content/lab";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — A HOME.
 *
 * Sete blocos, na ordem medida na referência: declaração → índice do acervo →
 * serviços → onde o trabalho saiu → playground → convite. Nenhum deles é
 * dispositivo: cada um afirma um fato que este site tem para afirmar.
 *
 * ⚠ A altura é o teste mais barato de "estrutura demais": a referência fecha em
 * 5.677px a 1440. Uma página três vezes mais longa não é mais completa, é
 * empilhada — e vai ser reprovada inteira.
 * [[am_feedback_clonar_de_fato_quando_a_referencia_e_dele]]
 */
/**
 * O campo por trás da arte, na cor da própria capa.
 *
 * `CORES` guarda o tom já escurecido para passar contraste como TEXTO; aqui ele
 * é FUNDO atrás de uma peça, e o mesmo valor deixaria a célula pesada demais.
 * A saída é a cor dela com opacidade baixa sobre o papel — matiz preservado,
 * presença de cartela, sem competir com a arte que está por cima.
 */
function campo(slug: string) {
  const c = CORES[slug]?.papel;
  if (!c) return "#f4f4f2";
  const n = parseInt(c.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.10)`;
}

export default function HomeV4() {
  useMetaRota();

  /* onde o trabalho foi publicado, sem repetir veículo: três das cinco matérias
     saíram no mesmo lugar, e repetir o nome em corpo de cartaz mata a força que
     a escala deveria dar */
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];
  const anos = WORK.map((w) => w.year);
  /* a abertura é a peça mais recente do acervo — a lista já vem na ordem
     editorial dele, então é o primeiro item, não um "destaque" escolhido aqui */
  const abertura = WORK[0];

  /* empacotamento por altura, feito na montagem — sem JS de medição: cada peça
     entra na coluna que está mais curta, medida em razão (altura/largura) */
  const colunas: (typeof WORK)[] = [[], [], []];
  const alturaCol = [0, 0, 0];
  WORK.forEach((w) => {
    const menor = alturaCol.indexOf(Math.min(...alturaCol));
    colunas[menor].push(w);
    alturaCol[menor] += w.cover.h / w.cover.w;
  });

  return (
    <Quadro>
      {/* ── 1. a declaração ─────────────────────────────────────────────── */}
      {/**
       * ⚠ A primeira montagem era declaração na base de uma tela branca vazia —
       * limpa e fria, e o trabalho só começava depois de uma rolagem inteira.
       * A referência preenche essa altura com o reel do autor; aqui não existe
       * filme (`content/reel.ts` está `null`, é pendência dele), e o que existe
       * de mais forte é a obra. Então a peça mais recente ocupa a coluna da
       * direita em altura cheia, sangrando pelo topo e pela borda: o site abre
       * mostrando trabalho, que é o que um portfólio tem para dizer no primeiro
       * segundo.
       */}
      <header className="q-hero">
        <div className="q-hero-dizer">
          <h1 className="q-display" style={{ maxWidth: "15ch" }}>
            Multidisciplinary designer building visual identities from strategy.
          </h1>
          {/* ⚠ TRÊS campos, não quatro. Com "Brand designer & art director" a
              régua quebrava em duas linhas e a segunda encostava na borda de
              baixo — e o campo era o mais dispensável dos quatro: a manchete
              logo acima já diz o ofício com todas as letras. */}
          <p className="q-meta q-hero-regua">
            <span>Brazil — working globally</span>
            <span>
              {WORK.length} projects · {Math.min(...anos)}–{Math.max(...anos)}
            </span>
            <span className="q-meta-ink">Available for projects</span>
          </p>
        </div>

        <Link to={`/v4/work/${abertura.slug}`} className="q-hero-peca">
          <img
            src={abertura.cover.src}
            srcSet={abertura.cover.src2x ? `${abertura.cover.src} 1400w, ${abertura.cover.src2x} 2200w` : undefined}
            sizes="(max-width: 900px) 100vw, 46vw"
            alt={abertura.cover.alt}
            width={abertura.cover.w}
            height={abertura.cover.h}
            fetchpriority="high"
            decoding="async"
            draggable={false}
          />
          <span className="q-meta q-hero-peca-legenda">
            <span className="q-meta-ink">{abertura.title}</span>
            <span>
              {abertura.disciplines.join(", ")} · {abertura.year}
            </span>
          </span>
        </Link>
      </header>

      {/* ── 2. o índice ─────────────────────────────────────────────────── */}
      {/**
       * ⚠ TRÊS COLUNAS COM EMPACOTAMENTO, não uma grade de linhas.
       *
       * A grade de linhas da referência funciona lá porque as capas dela são
       * todas do mesmo recorte. Aqui não são: o acervo vai de 1400×1097 a
       * 3840×4040, e a régua desta casa proíbe forçar altura igual — grade que
       * uniformiza recorta a peça do cliente para caber no layout, que é o
       * avesso do trabalho dele. Deixar a proporção livre numa grade de linhas
       * abre buracos de 200px (medido); então a peça vai para a coluna mais
       * CURTA, como já se faz no partido do mostruário. Sem buraco, sem corte.
       */}
      <section aria-labelledby="v4-work">
        <h2 id="v4-work" className="sr-only">
          Selected work
        </h2>
        <div className="q-indice" data-foca>
          {colunas.map((col, ci) => (
            <div className="q-coluna" key={ci}>
              {col.map((w) => (
                <Link
                  key={w.slug}
                  to={`/v4/work/${w.slug}`}
                  className="q-cel"
                  style={{
                    ["--q-cor" as string]: CORES[w.slug]?.papel,
                    /* o campo por trás da arte é a cor da PRÓPRIA capa, com o
                       valor puxado para o claro: a peça inteira aparece e a
                       faixa que sobra vira cartela, não vazio */
                    ["--q-cor-campo" as string]: campo(w.slug),
                  }}
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
          ))}
        </div>
      </section>

      {/* ── 3. serviços ─────────────────────────────────────────────────── */}
      <section className="q-bloco" aria-labelledby="v4-serv">
        <h2 id="v4-serv" className="q-display-md" style={{ maxWidth: "24ch", paddingBottom: "clamp(48px,6vw,88px)" }}>
          Four ways the work usually arrives.
        </h2>
        <div>
          {SERVICOS.map((s, i) => (
            <div className="q-servico" key={s.nome}>
              <span className="q-meta">{String(i + 1).padStart(2, "0")}</span>
              <span className="q-servico-nome">{s.nome}</span>
              <span className="q-corpo" style={{ color: "var(--q-quieto)" }}>
                {s.entrega}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. onde o trabalho saiu ─────────────────────────────────────── */}
      <section className="q-bloco" aria-labelledby="v4-pub" style={{ paddingTop: 0 }}>
        <h2 id="v4-pub" className="q-corpo" style={{ color: "var(--q-quieto)", paddingBottom: "clamp(24px,3vw,40px)" }}>
          Where the work has been published
        </h2>
        <p className="q-nomes">
          {veiculos.map((v, i) => (
            <span key={v}>
              {v}
              {i < veiculos.length - 1 && <span className="q-nomes-sep">·</span>}
            </span>
          ))}
        </p>
      </section>

      {/* ── 5. playground ───────────────────────────────────────────────── */}
      <section aria-labelledby="v4-lab">
        <h2 id="v4-lab" className="sr-only">
          Lab
        </h2>
        <Marquee itens={LAB.map((e) => ({ texto: e.brand, nota: e.discipline }))} />
      </section>
    </Quadro>
  );
}
