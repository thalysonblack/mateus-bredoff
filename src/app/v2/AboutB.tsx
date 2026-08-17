import { useState } from "react";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { TIERS } from "../sections/Pricing";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS } from "../../content/about";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import { CONTATO } from "../v3-system";

/**
 * ABOUT — PROPOSTA B: "O DOSSIÊ".
 *
 * "outra proposta da segunda section pra baixo" (17/08). A capa é a mesma — ela
 * está resolvida —, e daí para baixo a estrutura é OUTRA, não um ajuste da
 * primeira. Duas montagens que diferem em espaçamento não são duas propostas.
 *
 * ## A diferença, em uma frase
 *
 *   A (`/about`)   CAMADAS: cada seção é uma folha que cobre a anterior, e o
 *                  contraste vem da troca de SUPERFÍCIE (papel → branco →
 *                  tinta). A página se lê como um maço sendo virado.
 *
 *   B (esta)       DOСUMENTO: uma superfície só, do começo ao fim, com um
 *                  SUMÁRIO fixo na lateral marcando onde se está. O contraste
 *                  vem da tipografia e do fio — nunca do fundo. A página se lê
 *                  como um dossiê técnico que não se interrompe.
 *
 * Uma tem espetáculo e ritmo; a outra tem continuidade e densidade. É por isso
 * que só se escolhe vendo as duas.
 *
 * ## O que a B faz que a A não faz
 *
 * · O SUMÁRIO acompanha a leitura (`position: sticky`) e é navegável — numa
 *   página longa, saber onde se está é informação, não enfeite.
 * · Os números da trajetória entram DENTRO do sumário, como ficha técnica do
 *   documento, em vez de virarem uma faixa própria.
 * · Os serviços perdem o bloco escuro e viram TABELA DE PREÇO — três linhas
 *   numa régua só, comparáveis de relance. Comparar preço é o que a pessoa faz
 *   nessa parte da página, e em blocos separados a comparação se perde.
 * · O método ganha a numeração grande de cada etapa, que na A vive só no rótulo
 *   da seção.
 */

const PARTES = [
  { id: "approach", nome: "Approach" },
  { id: "services", nome: "Services" },
  { id: "method", nome: "Method" },
  { id: "contact", nome: "Contact" },
];

export default function AboutB() {
  useMetaRota();
  const [parte, setParte] = useState("approach");
  const revDoc = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="papel" status="Available for projects">
      {/* ─ A CAPA — a mesma da proposta A, que já está resolvida ────────── */}
      <section className="p-capa">
        <figure className="p-retrato">
          <img
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="(max-width: 1024px) 100vw, 40vw"
            alt="Mateus Bredoff"
            width={1600}
            height={850}
            decoding="async"
            draggable={false}
          />
        </figure>
        <div className="p-capa-texto">
          <p className="p-manifesto">{LEAD[0]}</p>
          <p className="p-marca p-capa-pe">
            <span>Mateus Bredoff</span>
            <span>Brand designer &amp; art director · Brazil</span>
          </p>
        </div>
      </section>

      {/* ─ O DOSSIÊ ──────────────────────────────────────────────────────
          Sumário à esquerda (sticky), documento à direita. Uma superfície só:
          o contraste é todo tipográfico. */}
      <section ref={revDoc} className="p-dossie">
        <aside className="p-sumario">
          <nav className="p-sumario-lista">
            {PARTES.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                onClick={() => setParte(p.id)}
                className={`p-sumario-item ${parte === p.id ? "aceso" : ""}`}
              >
                <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                <span className="p-corpo">{p.nome}</span>
              </a>
            ))}
          </nav>

          {/* ⭐ os números como FICHA TÉCNICA do documento: aqui eles são
              credencial, não manchete — e por isso vivem ao lado do sumário,
              não numa faixa própria */}
          <dl className="p-sumario-ficha">
            {NUMEROS.map((n) => (
              <div key={n.rotulo}>
                <dt className="p-marca">{n.rotulo}</dt>
                <dd className="p-sumario-valor">{n.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="p-documento">
          <article id="approach" className="p-parte p-sobe">
            <p className="p-parte-cabeca">
              <span>01</span>
              <span className="p-rotulo">Approach</span>
            </p>
            <p className="p-parte-lead">{LEAD[1]}</p>
            <p className="p-marca p-parte-pe">Tools — {FERRAMENTAS.join(", ")}</p>
          </article>

          <article id="services" className="p-parte p-sobe">
            <p className="p-parte-cabeca">
              <span>02</span>
              <span className="p-rotulo">Services — {String(TIERS.length).padStart(2, "0")}</span>
            </p>

            {/* ⭐ TABELA DE PREÇO: três linhas numa régua só. Comparar é o que
                se faz aqui, e em blocos separados a comparação se perde. */}
            <table className="p-precos">
              <thead>
                <tr className="p-rotulo">
                  <th>Package</th>
                  <th>Scope</th>
                  <th>Timeline</th>
                  <th className="text-right">From</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.name}>
                    <th scope="row" className="p-item">
                      {t.name}
                    </th>
                    <td className="p-corpo p-precos-escopo">{t.scope.join(" · ")}</td>
                    <td className="p-corpo">{t.timeline}</td>
                    <td className="p-precos-valor">
                      {t.priceFrom === null ? (
                        <span className="p-precos-sob">On request</span>
                      ) : (
                        `$${t.priceFrom.toLocaleString("en-US")}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article id="method" className="p-parte p-sobe">
            <p className="p-parte-cabeca">
              <span>03</span>
              <span className="p-rotulo">Method — {String(PROCESSO.length).padStart(2, "0")}</span>
            </p>
            <p className="p-parte-lead">{PROCESSO_MANCHETE}</p>
            <ol className="p-etapas">
              {PROCESSO.map((e, i) => (
                <li key={e.titulo} className="p-etapa">
                  <span className="p-etapa-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="p-item">{e.titulo}</p>
                    <p className="p-corpo max-w-[62ch]" style={{ color: "var(--p-quieto)" }}>
                      {e.corpo}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article id="contact" className="p-parte p-sobe">
            <p className="p-parte-cabeca">
              <span>04</span>
              <span className="p-rotulo">Contact &amp; inquiries</span>
            </p>
            <ul className="p-contatos">
              {CONTATO.map((c) => (
                <li key={c.label} className="p-fio">
                  <span className="p-marca">{c.label}</span>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="p-contato-valor p-link"
                    >
                      {c.valor}
                    </a>
                  ) : (
                    <span className="p-contato-valor">{c.valor}</span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </Prancha>
  );
}
