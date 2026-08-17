import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { SERVICOS } from "../../content/servicos";

/**
 * A SEÇÃO DE SERVIÇOS — três propostas de mecânica, um conteúdo só.
 *
 * "ficou grande demais, quero propostas" (17/08). A pilha de folhas resolveu o
 * "card lado a lado é muito clássico", mas custou QUATRO TELAS só de serviços
 * numa página que já tinha capa, números, valores e método — 6.611px de
 * documento. As duas propostas novas cabem em UMA tela cada e mantêm o
 * percurso.
 *
 *   pilha    cada serviço gruda e o próximo sobe por cima, com a peça grande.
 *            Impacto máximo, custo máximo: 4 telas.
 *   fita     os quatro andam na HORIZONTAL enquanto a página rola na vertical.
 *            Uma tela, e o percurso continua existindo — o scroll vira eixo X.
 *   cortina  os quatro empilhados como faixas finas; a que entra ABRE e as
 *            outras recolhem. Uma tela, e a comparação entre eles fica de pé
 *            porque todos permanecem visíveis.
 *
 * ⚠ Conteúdo em `content/servicos.ts`, um lugar só: três montagens do mesmo
 * texto com três cópias dele viram conteúdo divergente no primeiro ajuste.
 */

export type ModoServicos = "pilha" | "fita" | "cortina";

function Peca({ slug, alto = false }: { slug: string; alto?: boolean }) {
  const peca = WORK.find((w) => w.slug === slug);
  if (!peca) return null;
  return (
    <figure className="p-sv-foto">
      <img
        src={peca.cover.src}
        srcSet={peca.cover.src2x ? `${peca.cover.src} 1400w, ${peca.cover.src2x} 2200w` : undefined}
        sizes={alto ? "(max-width: 1024px) 100vw, 48vw" : "(max-width: 1024px) 60vw, 30vw"}
        alt={peca.cover.alt}
        decoding="async"
        draggable={false}
      />
      <figcaption className="p-marca p-sv-cap" style={{ color: corDe(peca.slug, "tinta") }}>
        {peca.title} — {peca.year}
      </figcaption>
    </figure>
  );
}

export default function Servicos({ modo }: { modo: ModoServicos }) {
  /* ── PILHA: cada folha gruda e a próxima cobre ─────────────────────── */
  if (modo === "pilha") {
    return (
      <ul className="p-servicos-pilha">
        {SERVICOS.map((sv, i) => (
          <li key={sv.nome} className="p-servico-folha">
            <div className="p-servico-folha-corpo">
              <Peca slug={sv.peca} alto />
              <div className="p-servico-texto">
                <p className="p-marca p-sv-n">
                  {String(i + 1).padStart(2, "0")} / {String(SERVICOS.length).padStart(2, "0")}
                </p>
                <h2 className="p-servico-titulo">{sv.nome}</h2>
                <p className="p-catalogo-corpo">{sv.entrega}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  /* ── FITA: o scroll vertical vira percurso HORIZONTAL ───────────────
     ⚠ A seção alta é só TRILHO: quem gruda é o quadro de dentro, e a faixa
     anda em X pela timeline do scroll. É o que permite ter percurso sem
     gastar quatro telas — uma tela de altura, quatro de conteúdo. */
  if (modo === "fita") {
    return (
      <div className="p-sv-trilho">
        <div className="p-sv-quadro">
          <div className="p-sv-fita">
            {SERVICOS.map((sv, i) => (
              <article key={sv.nome} className="p-sv-carta">
                <Peca slug={sv.peca} />
                <p className="p-marca p-sv-n">
                  {String(i + 1).padStart(2, "0")} / {String(SERVICOS.length).padStart(2, "0")}
                </p>
                <h2 className="p-sv-titulo">{sv.nome}</h2>
                <p className="p-catalogo-corpo">{sv.entrega}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── CORTINA: faixas finas; a que entra ABRE, as outras recolhem ─────
     ⚠ Todas permanecem visíveis, e é essa a vantagem sobre a pilha: dá para
     COMPARAR os quatro serviços sem voltar. */
  return (
    <ul className="p-sv-cortina">
      {SERVICOS.map((sv, i) => (
        <li key={sv.nome} className="p-sv-faixa">
          <div className="p-sv-faixa-cabeca">
            <span className="p-marca p-sv-n">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="p-sv-titulo">{sv.nome}</h2>
            <span className="p-catalogo-corpo p-sv-faixa-resumo">{sv.entrega}</span>
          </div>
          <div className="p-sv-faixa-corpo">
            <Peca slug={sv.peca} />
          </div>
        </li>
      ))}
    </ul>
  );
}
