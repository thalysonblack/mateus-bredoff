import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { Quadro, BlocoServicos, BlocoNomes, BlocoPlayground, BlocoPremios } from "./sistema";
import { LEAD, PROCESSO, PROCESSO_MANCHETE, FERRAMENTAS } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — A ABOUT, na arquitetura medida da interna da referência.
 *
 * ⭐ A descoberta que reorganizou esta página: a `/about` de lá NÃO é uma página
 * própria de ponta a ponta. Ela tem três blocos exclusivos — ficha com retrato,
 * galeria e prêmios — e depois REPETE os três últimos da home (serviços, nomes,
 * marquee) antes do rodapé. A home apresenta, a about aprofunda, e as duas
 * fecham com a mesma oferta e a mesma prova. Enquanto cada página montava os
 * seus blocos, nenhuma tinha o ritmo daquele site.
 *
 * Anatomia medida (1440px): header 335 · ficha 644 · galeria 644 · prêmios 592 ·
 * serviços 759 · nomes 819 · marquee 653 · rodapé 986. Total 6.425px.
 *
 * ⚠ O bloco de CURRÍCULO de lá é cargo + período, quatro linhas. Não existe
 * histórico de emprego do Mateus no material, e inventar data de trabalho é
 * inventar biografia. O slot recebe o que ele TEM: as quatro disciplinas com o
 * que cada uma entrega — mesma anatomia de linha (título forte, secundária
 * atenuada), informação verdadeira.
 */
export default function AboutV4() {
  useMetaRota();
  return (
    <Quadro>
      {/* ── 1. header ───────────────────────────────────────────────────── */}
      <header className="q-cabeca">
        <h1 className="q-display-md" style={{ maxWidth: "20ch" }}>
          {LEAD[0].split(".")[0]}.
        </h1>
      </header>

      {/* ── 2. a ficha, com o retrato sangrando à direita ───────────────── */}
      <section className="q-ficha-cv" aria-label="Practice">
        <div className="q-cv">
          <p className="q-meta q-cv-rot">
            <span className="q-ponto" aria-hidden="true" />
            Practice
          </p>
          <dl className="q-cv-lista">
            {SERVICOS.map((s) => (
              <div key={s.nome}>
                <dt className="q-meta q-meta-ink">{s.nome}</dt>
                <dd className="q-meta">{s.entrega}</dd>
              </div>
            ))}
          </dl>
          <p className="q-meta q-cv-fer">{FERRAMENTAS.join("  ·  ")}</p>
        </div>

        <figure className="q-retrato">
          <img
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="(max-width: 900px) 100vw, 42vw"
            alt="Mateus Bredoff"
            decoding="async"
            draggable={false}
          />
        </figure>
      </section>

      {/* ── 3. o credo ──────────────────────────────────────────────────── */}
      <section className="q-bloco" style={{ paddingBottom: 0 }}>
        <p className="q-display" style={{ maxWidth: "24ch" }}>
          {PROCESSO_MANCHETE}
        </p>
      </section>

      {/* ── 4. galeria ──────────────────────────────────────────────────── */}
      {/* ⚠ faixa de altura fixa que ROLA na horizontal, não grade: a galeria da
          referência ocupa 644px de altura numa faixa só, e a mesma altura para
          peças de proporções diferentes só fecha deixando a largura livre. */}
      <section className="q-galeria" aria-label="Selected pieces">
        {WORK.map((w) => (
          <figure key={w.slug} className="q-galeria-item">
            <img
              src={w.cover.src}
              srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
              sizes="42vw"
              alt={w.cover.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </figure>
        ))}
      </section>

      {/* ── 5. prêmios ──────────────────────────────────────────────────── */}
      <BlocoPremios />

      {/* ── 6. o processo — o que esta página tem e a home não ──────────── */}
      <section className="q-bloco" aria-labelledby="v4-proc" style={{ paddingTop: 0 }}>
        <h2 id="v4-proc" className="q-meta q-meta-ink" style={{ paddingBottom: "clamp(28px,3.5vw,48px)" }}>
          How a project runs
        </h2>
        {PROCESSO.map((p, k) => (
          <div className="q-servico" key={p.titulo}>
            <span className="q-num">{String(k + 1).padStart(2, "0")}</span>
            <span className="q-servico-nome">{p.titulo}</span>
            <span className="q-corpo" style={{ color: "var(--q-quieto)" }}>
              {p.corpo}
            </span>
          </div>
        ))}
      </section>

      {/* ── 7–9. os três blocos que a home também fecha ─────────────────── */}
      <BlocoServicos />
      <BlocoNomes />
      <BlocoPlayground />
    </Quadro>
  );
}
