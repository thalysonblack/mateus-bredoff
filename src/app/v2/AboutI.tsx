import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { CONTATO } from "../v3-system";
import { LEAD, PROCESSO, FERRAMENTAS } from "../../content/about";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";

/**
 * ABOUT I — "DOIS TAMANHOS".
 *
 * Postura: o nome dele em escala de largura, e TUDO o mais — bio, método,
 * serviços, prova, contato — em mono de 11px, em colunas com rótulo, acima e
 * abaixo do nome. Nenhum tamanho intermediário. É a leitura do acervo que
 * atravessa os 87 sites premiados: "o salto de escala é brutal, 200px e 12px,
 * sem nada no meio — escada de cinco tamanhos é o que parece template".
 *
 * DNA (conceito, não assinatura): T for Troels — o nome numa linha e quatro
 * colunas minúsculas acima e abaixo, "salto de escala como hierarquia inteira";
 * ATIO — o conteúdo real desce para o pé em mono. Colisão medida: nada de nome
 * cortado no topo do preto (ATIO) nem de switch de luz (Troels). Só o princípio.
 *
 * O que RECUSA: imagem grande, escada de escala, seções separadas, scroll longo.
 * A única imagem é a faixa de miniaturas em sangria no pé, em escala de selo.
 *
 * Por que é a mais "brand designer" das três: o nome dele é tratado como
 * WORDMARK — a peça que ele desenha para os outros, aplicada a si.
 */
export default function AboutI() {
  useMetaRota();
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

  return (
    <Prancha n="03" nome="About" superficie="branco" status="Available for projects" rodape="regua">
      {/* ── as colunas de cima: intro · contato · ferramentas ───────────── */}
      <section className="p-dois-colunas p-dois-topo">
        <div>
          <p className="p-rotulo">Intro</p>
          <p className="p-dois-txt">{LEAD[0]}</p>
        </div>
        <div>
          <p className="p-rotulo">Contact</p>
          <ul className="p-dois-lista">
            {CONTATO.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="p-link">
                    {c.valor}
                  </a>
                ) : (
                  c.valor
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="p-rotulo">Tools</p>
          <p className="p-dois-txt">{FERRAMENTAS.join(", ")}</p>
        </div>
        <div>
          <p className="p-rotulo">Published in</p>
          <p className="p-dois-txt">{veiculos.join(", ")}</p>
        </div>
      </section>

      {/* ── o nome, em escala de largura ─────────────────────────────────
          ⚠ o corpo é calculado para a LARGURA, não para a altura: o nome tem
          de encostar nas duas margens em qualquer viewport, como um wordmark
          aplicado numa capa. 14 caracteres em Geist 400 ≈ 0,58em cada → a
          largura útil dividida por ~8,1 dá o corpo. Sem `calc` no glifo: é
          `vw` com trava, e se a webfont falhar a linha estoura, não quebra. */}
      <h1 className="p-dois-nome" aria-label="Mateus Bredoff">
        Mateus Bredoff
      </h1>

      {/* ── as colunas de baixo: bio · método · serviços ─────────────────── */}
      <section className="p-dois-colunas p-dois-base">
        <div>
          <p className="p-rotulo">Approach</p>
          <p className="p-dois-txt">{LEAD[1]}</p>
        </div>
        <div>
          <p className="p-rotulo">Method — {String(PROCESSO.length).padStart(2, "0")}</p>
          <ol className="p-dois-lista">
            {PROCESSO.map((e, i) => (
              <li key={e.titulo}>
                <span style={{ color: "var(--p-quieto)" }}>{String(i + 1).padStart(2, "0")}</span> {e.titulo}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="p-rotulo">Services</p>
          <ul className="p-dois-lista">
            {TIERS.map((t) => (
              <li key={t.name}>
                {t.name}{" "}
                <span style={{ color: "var(--p-quieto)" }}>
                  — {t.priceFrom === null ? "on request" : `from $${t.priceFrom.toLocaleString("en-US")}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="p-rotulo">Selected — {String(WORK.length).padStart(2, "0")}</p>
          <ul className="p-dois-lista">
            {WORK.map((w) => (
              <li key={w.slug}>
                <a href={`/work/${w.slug}`} className="p-link">
                  {w.title}
                </a>{" "}
                <span style={{ color: "var(--p-quieto)" }}>{w.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── a única imagem: miniaturas em sangria, escala de selo ─────────── */}
      <div className="p-dois-selos" aria-hidden="true">
        {WORK.map((w) => (
          <img key={w.slug} src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
        ))}
      </div>
    </Prancha>
  );
}
