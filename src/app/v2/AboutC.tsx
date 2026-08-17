import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { SERVICOS, MODALIDADES } from "../../content/servicos";
import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO } from "../../content/about";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha, useHora } from "./sistema";

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

export default function AboutC() {
  useMetaRota();
  const hora = useHora();
  const revIntro = useRevelar<HTMLElement>();
  const revNumeros = useRevelar<HTMLElement>();
  const revServicos = useRevelar<HTMLElement>();
  const revValores = useRevelar<HTMLElement>();
  const revMetodo = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects">
      {/* ─ A HERO: UM ELEMENTO SÓ ───────────────────────────────────────
          ⚠ "a hero tá muito cheia, precisa de elemento UAU e depois os textos".
          Ela tinha retrato + manifesto + approach + legenda dividindo a mesma
          tela: quatro coisas competindo, nenhuma ganhando. Agora é UMA — o
          rosto em sangria total, com o nome na faixa livre à direita, onde o
          fundo da foto já é liso.

          ⚠ O nome se põe MEDINDO a faixa livre, não escolhendo um canto: o
          retrato tem o rosto à esquerda e gradiente à direita, e é por isso que
          o texto cabe ali sem véu, sem sombra e sem cobrir a pessoa. */}
      <section className="p-hero">
        <figure className="p-hero-foto">
          <img
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="100vw"
            alt="Mateus Bredoff"
            width={1600}
            height={850}
            decoding="async"
            draggable={false}
          />
        </figure>
        {/* ⭐ A LINHA DE METADADO SOBRE A FOTO — como na original dele:
            nome de um lado, ofício do outro, em mono miúdo. "que tal a hero ser
            como a original? com Mateus Bredoff e do outro lado brand designer".
            É o oposto de um título: a foto é que fala, e o texto só identifica.
            ⚠ Ela vive no TOPO porque é ali que a foto é escura (o gradiente do
            fundo dela vai de petróleo a claro) — texto claro sobre a metade
            clara precisaria de véu, e véu sobre a arte ele já reprovou. */}
        {/* ⓘ A BARRA DE METADADO SAIU: "tira esses escrito e full viewport a
            imagem". Ela dizia o que o cabeçalho da prancha já diz, e sobre uma
            foto que agora ocupa a tela inteira qualquer texto a mais disputa
            com o rosto. Ficam só o nome e o ofício, que são o gesto. */}
        {/* ⭐⭐ O NOME E O OFÍCIO NOS CANTOS DE BAIXO, em caixa alta gigante,
            CORTADOS PELA FOTO — é a hero da home dele, e "faz igual uai" é
            isto: `MATEUS BREDOFF` na base à esquerda, `BRAND DESIGNER` na base
            à direita, os dois sangrando para fora e o corpo dele passando no
            meio.
            ⚠ `mix-blend-mode: difference` em vez de duas cores fixas: a foto
            vai de petróleo escuro no alto a quase branco embaixo, e passa pelo
            marrom da camisa no meio — qualquer cor fixa perde contraste em
            algum trecho. O blend resolve pixel a pixel, que é o que a original
            faz. */}
        <p className="p-hero-marca p-hero-marca--esq">
          Mateus
          <br />
          Bredoff
        </p>
        <p className="p-hero-marca p-hero-marca--dir">
          Brand
          <br />
          Designer
        </p>
      </section>

      {/* ⚠⚠ TUDO O QUE VEM DEPOIS DA HERO É UMA FOLHA SÓ, COM FUNDO OPACO.
          A hero é `sticky` e fica na tela o tempo todo — se cada seção seguinte
          não cobrir, ela aparece POR TRÁS delas. E foi o que aconteceu: eu tinha
          dado fundo só ao primeiro bloco, e da segunda tela em diante o rosto e
          os nomes gigantes apareciam atrás dos serviços e dos preços, com o
          texto ilegível por cima da imagem.
          Uma folha só, um fundo só — e o `z-index: 1` que a põe acima da capa. */}
      <div className="p-catalogo-corpo-folha">
        {/* ─ E SÓ ENTÃO O TEXTO ────────────────────────────────────────────
            O manifesto sozinho numa faixa, depois do impacto. */}
        <section ref={revIntro} className="p-catalogo-intro">
          <p className="p-rotulo p-catalogo-rotulo">About me</p>
          <div>
            <p className="p-manifesto p-sobe">{LEAD[0]}</p>
            <p className="p-catalogo-corpo p-sobe">{LEAD[1]}</p>
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

        {/* ─ O QUE ELE FAZ ────────────────────────────────────────────────
            Serviço é REPERTÓRIO. Cada um com a peça que o prova — obra dele, não
            ilustração genérica. */}
        <section ref={revServicos} className="p-catalogo">
          <p className="p-rotulo p-catalogo-rotulo">Services — {String(SERVICOS.length).padStart(2, "0")}</p>
          <ul className="p-servicos-grade">
            {SERVICOS.map((sv) => {
              const peca = WORK.find((w) => w.slug === sv.peca);
              return (
                <li key={sv.nome} className="p-servico-card p-sobe">
                  {peca ? (
                    <figure className="p-servico-foto">
                      <img
                        src={peca.cover.src}
                        sizes="(max-width: 1024px) 50vw, 24vw"
                        alt={peca.cover.alt}
                        decoding="async"
                        draggable={false}
                      />
                      <figcaption className="p-marca p-servico-cap" style={{ color: corDe(peca.slug, "tinta") }}>
                        {peca.title}
                      </figcaption>
                    </figure>
                  ) : null}
                  <h2 className="p-servico-titulo">{sv.nome}</h2>
                  <p className="p-catalogo-corpo">{sv.entrega}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ─ QUANTO CUSTA ──────────────────────────────────────────────────
            ⚠ SEÇÃO PRÓPRIA, a pedido dele. Serviço é repertório; modalidade é
            CONTRATO — como se contrata e quanto custa. Misturados, a pessoa
            procura preço no meio da descrição de ofício.
            As três são as que ele ditou: marca completa, direção de arte e o slot
            mensal, que no mercado internacional se chama RETAINER. */}
        <section ref={revValores} className="p-valores">
          <p className="p-rotulo p-catalogo-rotulo">Working together — {String(MODALIDADES.length).padStart(2, "0")}</p>
          <ul className="p-valores-lista">
            {MODALIDADES.map((m, i) => (
              <li key={m.nome} className="p-valor-item p-sobe">
                <p className="p-marca p-valor-n">{String(i + 1).padStart(2, "0")}</p>
                <div className="p-valor-corpo">
                  <h2 className="p-valor-nome">{m.nome}</h2>
                  <p className="p-catalogo-corpo">{m.para}</p>
                  <p className="p-marca p-valor-inclui">{m.inclui.join(" · ")}</p>
                </div>
                <p className="p-valor-preco">
                  <span className="p-marca">{m.prazo}</span>
                  <span className={m.precoDe === null ? "p-catalogo-sob" : "p-catalogo-valor"}>
                    {m.precoDe === null ? "On request" : `from $${m.precoDe.toLocaleString("en-US")}`}
                  </span>
                </p>
              </li>
            ))}
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
      </div>
    </Prancha>
  );
}
