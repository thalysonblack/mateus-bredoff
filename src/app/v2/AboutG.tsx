import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { LEAD, PROCESSO, FERRAMENTAS } from "../../content/about";
import { MODALIDADES, SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";

/**
 * ABOUT — "O PÔSTER".
 *
 * A versão anterior desta rota era a CARTELA, e ele matou em duas palavras:
 * "gostei não". O erro foi de tradução, não de referência — os salvos dele são
 * PEÇA GRÁFICA IMPRESSA (massa, textura, sobreposição, rotação) e eu devolvi
 * grade de interface com cards de cor. Vocabulário certo, gramática errada.
 *
 * Esta é a leitura oposta dos mesmos 63 saves: uma peça só, que se rola como
 * quem lê um cartaz. Massa tipográfica que se sobrepõe à foto, palavra girada,
 * texto miúdo espremido na borda em vertical, fundo de tinta. Zero card, zero
 * grade.
 *
 * ⚠ E o conteúdo mudou por ordem dele: "vamos eliminar os big number e focar
 * nas conquistas de prêmios". Os 62+/100+/56+ saíram inteiros. O que ocupa o
 * centro agora é ONDE O TRABALHO FOI PUBLICADO — cinco matérias, cada uma com
 * a peça que saiu e o link que eu abri. É a diferença entre dizer que se é bom
 * e mostrar quem disse.
 */
export default function AboutG() {
  useMetaRota("/about");
  const premios = useRevelar<HTMLElement>();
  const oficio = useRevelar<HTMLElement>();
  const tarifa = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects" rodape="completo">
      <div className="pz">
        {/* ── O CARTAZ ─────────────────────────────────────────────────────
            A foto entra ENTRE as duas palavras do nome, não atrás delas: é
            colagem de cartaz, e é o que separa esta peça de um hero com texto
            por cima. O tratamento em alto contraste não é filtro bonito — é o
            que faz a foto virar MATÉRIA GRÁFICA e conviver com a massa. */}
        <header className="pz-cartaz">
          <h1 className="pz-nome">
            <span className="pz-nome-1">Mateus</span>
            <span className="pz-foto">
              <img
                src={retrato}
                srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
                sizes="60vw"
                alt="Mateus Bredoff"
              />
            </span>
            <span className="pz-nome-2">Bredoff</span>
          </h1>

          <p className="pz-lateral pz-lateral--esq">Brand designer · Brazil · working globally</p>
          <p className="pz-lateral pz-lateral--dir">Est. 2019 · Available for projects</p>

          <p className="pz-girada" aria-hidden="true">
            Identity
          </p>
        </header>

        {/* ── A FRASE ─ uma só, em corpo de cartaz ───────────────────────── */}
        <section className="pz-frase">
          <p>
            I build identities that hold up <em>after</em> the launch.
          </p>
          <div className="pz-frase-pe">
            {LEAD.map((t, i) => (
              <p key={i} className="p-corpo">
                {t}
              </p>
            ))}
          </div>
        </section>

        {/* ── OS PRÊMIOS ─ o centro da peça ──────────────────────────────
            "eliminar os big number e focar nas conquistas de prêmios". Cada
            publicação é uma FAIXA de cartaz: o veículo em massa, a peça que
            saiu sangrando por baixo, e a matéria em corpo miúdo. */}
        <section className="pz-premios" ref={premios}>
          <p className="pz-secao">
            <span>Published in</span>
            <span>{RECONHECIMENTO.length} features</span>
          </p>
          <ol>
            {RECONHECIMENTO.map((r, i) => {
              /* ⚠ Três das cinco matérias são do MESMO veículo. Repetir
                 "WORLD BRAND DESIGN" em massa três vezes seguidas mata a
                 força que a massa deveria dar — na segunda ocorrência em
                 diante quem sobe para o corpo grande é o PROJETO, e o veículo
                 desce para o metadado. A informação é a mesma; o ritmo, não. */
              const repetido = RECONHECIMENTO.findIndex((x) => x.veiculo === r.veiculo) !== i;
              return (
              <li key={r.titulo} className="p-sobe grid">
                <span className="pz-premio-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="pz-premio-corpo">
                  <h2 className="pz-veiculo">{repetido ? r.projeto : r.veiculo}</h2>
                  {r.href ? (
                    <a className="pz-materia" href={r.href} target="_blank" rel="noopener noreferrer">
                      {r.titulo}
                      <span className="pz-seta" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="pz-materia">{r.titulo}</span>
                  )}
                  <p className="pz-meta p-marca">
                    {repetido ? r.veiculo : r.projeto} · {r.ano}
                  </p>
                </div>
                <figure className="pz-premio-peca">
                  <img
                    src={r.foto.src}
                    srcSet={r.foto.src2x ? `${r.foto.src} 1400w, ${r.foto.src2x} 2200w` : undefined}
                    sizes="40vw"
                    width={r.foto.w}
                    height={r.foto.h}
                    alt={r.foto.alt}
                    loading="lazy"
                  />
                </figure>
              </li>
              );
            })}
          </ol>
        </section>

        {/* ── O OFÍCIO ─ massa tipográfica, sem card ─────────────────────── */}
        <section className="pz-oficio" ref={oficio}>
          <p className="pz-secao">
            <span>Practice</span>
            <span>{SERVICOS.length} disciplines</span>
          </p>
          <ul className="p-sobe grid">
            {SERVICOS.map((s) => (
              <li key={s.nome}>
                <h3>{s.nome}</h3>
                <p className="p-corpo">{s.entrega}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── A TARIFA ────────────────────────────────────────────────────── */}
        <section className="pz-tarifa" ref={tarifa}>
          <p className="pz-secao">
            <span>Engagements</span>
            <span>USD</span>
          </p>
          <ol className="p-sobe grid">
            {MODALIDADES.map((m) => (
              <li key={m.nome}>
                <h3>{m.nome}</h3>
                <p className="pz-preco">
                  {m.precoDe ? m.precoDe.toLocaleString("en-US") : "On request"}
                  {m.unidade ? <span className="pz-unidade">{m.unidade}</span> : null}
                </p>
                <p className="p-corpo">{m.para}</p>
                <p className="p-marca pz-prazo">{m.prazo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── O MÉTODO ─ rodapé de cartaz: seco, em uma linha por etapa ──── */}
        <section className="pz-metodo">
          <p className="pz-secao">
            <span>Sequence</span>
            <span>{PROCESSO.length} stages</span>
          </p>
          <ol>
            {PROCESSO.map((e, i) => (
              <li key={e.titulo}>
                <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                <h3>{e.titulo}</h3>
                <p className="p-corpo">{e.corpo}</p>
              </li>
            ))}
          </ol>
          <p className="pz-tools p-marca">Toolkit — {FERRAMENTAS.join(" / ")}</p>
        </section>
      </div>
    </Prancha>
  );
}
