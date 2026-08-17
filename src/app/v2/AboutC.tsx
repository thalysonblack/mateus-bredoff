import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { TIERS } from "../sections/Pricing";
import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO } from "../../content/about";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";

/**
 * ABOUT — PROPOSTA C: "O CATÁLOGO".
 *
 * "outra opção, com os serviços que faz e fotos deles, tipo a original do
 * Framer" (17/08).
 *
 * ## O que veio da original do Framer (medida em `/arquivo/framer/about`)
 *
 * · a página vive em SUPERFÍCIE ESCURA quase inteira — o petróleo é o fundo,
 *   não um bloco dentro do papel;
 * · o rótulo da seção fica na LATERAL ESQUERDA, miúdo, enquanto o conteúdo
 *   corre numa coluna larga à direita;
 * · os números da trajetória em corpo gigante, lado a lado;
 * · o método numerado, com o corpo em cinza sobre o escuro.
 *
 * ## O que ela NÃO tinha e ele pediu: os serviços COM FOTO
 *
 * Cada pacote deixa de ser uma linha de preço e vira uma FICHA DE CATÁLOGO: a
 * peça grande à esquerda, o escopo e o preço à direita.
 *
 * ⚠ As peças não são ilustração genérica — são obra dele, escolhida pelo que o
 * pacote entrega:
 *   Essential      → Ginga, que é wordmark puro (logotipo, cor, tipografia)
 *   Complete       → Votare, que é a identidade APLICADA em peças impressas
 *   Brand System   → Alex Archer, o único com sistema documentado e matéria
 *                    publicada no World Brand Design
 * Trocar essas escolhas por "a foto mais bonita" desfaz o argumento: aqui a
 * imagem PROVA o que a linha de texto promete.
 */

/* a peça que exemplifica cada pacote — escolha editorial, não decorativa */
const PECA_DO_PACOTE: Record<string, string> = {
  Essential: "ginga",
  Complete: "votare",
  "Brand System": "alex-archer",
};

export default function AboutC() {
  useMetaRota();
  const revIntro = useRevelar<HTMLElement>();
  const revNumeros = useRevelar<HTMLElement>();
  const revServicos = useRevelar<HTMLElement>();
  const revMetodo = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects">
      {/* ─ A CAPA, sobre a superfície escura ─────────────────────────────
          O retrato tem fundo petróleo: na prancha de TINTA ele deixa de ter
          moldura e passa a se fundir com a página — a mesma foto que na
          proposta A precisava de recorte, aqui só encaixa. */}
      <section className="p-catalogo-capa">
        <figure className="p-catalogo-retrato">
          <img
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="(max-width: 1024px) 100vw, 42vw"
            alt="Mateus Bredoff"
            width={1600}
            height={850}
            decoding="async"
            draggable={false}
          />
        </figure>
        <div className="p-catalogo-lead">
          <p className="p-rotulo p-catalogo-rotulo">About me</p>
          <p className="p-manifesto">{LEAD[0]}</p>
          <p className="p-catalogo-corpo">{LEAD[1]}</p>
        </div>
      </section>

      {/* ─ OS NÚMEROS, como na original: gigantes e lado a lado ─────────── */}
      <section ref={revNumeros} className="p-catalogo-numeros">
        {NUMEROS.map((n) => (
          <div key={n.rotulo} className="p-sobe">
            <p className="p-numero-big">{n.valor}</p>
            <p className="p-marca" style={{ color: "var(--p-quieto)" }}>
              {n.rotulo}
            </p>
          </div>
        ))}
      </section>

      {/* ─ OS SERVIÇOS, COM FOTO ─────────────────────────────────────────
          ⭐ É o que a original não tinha. Cada pacote é uma ficha de catálogo:
          a peça que o prova, o escopo, o prazo e o preço. */}
      <section ref={revServicos} className="p-catalogo">
        <p className="p-rotulo p-catalogo-rotulo">Services — {String(TIERS.length).padStart(2, "0")}</p>

        <ul className="p-catalogo-lista">
          {TIERS.map((t, i) => {
            const slug = PECA_DO_PACOTE[t.name];
            const peca = WORK.find((w) => w.slug === slug);
            return (
              <li key={t.name} className="p-catalogo-item p-sobe">
                <figure className="p-catalogo-peca">
                  {peca ? (
                    <img
                      src={peca.cover.src}
                      srcSet={peca.cover.src2x ? `${peca.cover.src} 1400w, ${peca.cover.src2x} 2200w` : undefined}
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      alt={peca.cover.alt}
                      decoding="async"
                      draggable={false}
                    />
                  ) : null}
                  {peca ? (
                    <figcaption className="p-marca p-catalogo-cap">
                      <span style={{ color: corDe(peca.slug, "tinta") }}>{peca.title}</span>
                      <span>{peca.year}</span>
                    </figcaption>
                  ) : null}
                </figure>

                <div className="p-catalogo-ficha">
                  <p className="p-catalogo-n">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="p-catalogo-nome">{t.name}</h2>
                  <p className="p-catalogo-corpo">{t.description}</p>

                  <ul className="p-catalogo-escopo">
                    {t.scope.map((e) => (
                      <li key={e} className="p-fio p-corpo">
                        {e}
                      </li>
                    ))}
                  </ul>

                  <p className="p-catalogo-preco">
                    <span className="p-marca">{t.timeline}</span>
                    <span className={t.priceFrom === null ? "p-catalogo-sob" : "p-catalogo-valor"}>
                      {t.priceFrom === null ? "On request" : `from $${t.priceFrom.toLocaleString("en-US")}`}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─ O MÉTODO, na anatomia da original ─────────────────────────────
          Rótulo na lateral, manchete grande, etapas numeradas com o corpo em
          cinza sobre o escuro. */}
      <section ref={revMetodo} className="p-catalogo-metodo">
        <p className="p-rotulo p-catalogo-rotulo">Method — {String(PROCESSO.length).padStart(2, "0")}</p>
        <div>
          <p className="p-manifesto p-sobe">{PROCESSO_MANCHETE}</p>
          <ol className="p-catalogo-etapas">
            {PROCESSO.map((e, i) => (
              <li key={e.titulo} className="p-fio p-catalogo-etapa p-sobe">
                <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="p-item">{e.titulo}</p>
                  <p className="p-catalogo-corpo">{e.corpo}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <span ref={revIntro} aria-hidden="true" />
    </Prancha>
  );
}
