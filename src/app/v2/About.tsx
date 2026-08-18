import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { TIERS } from "../sections/Pricing";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha, Bloco } from "./sistema";
import { CONTATO } from "../v3-system";
import { LEAD, NUMEROS, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS } from "../../content/about";

/**
 * PRANCHA 03 — ABOUT.
 *
 * ⚠ A primeira montagem tinha o numeral "62+" gigante em laranja sangrando pela
 * esquerda e uma cruz de registro no centro — os dois copiados do
 * `corentinbernadou.com/about` (lá o numeral é "95", o ano de nascimento dele).
 * Ele cortou: **"vc ta copiando, nao, apenas conceito"**.
 *
 * O CONCEITO que sobrevive é outro, e é o que valia desde o começo: **os números
 * da trajetória dele estavam escritos em 12px, como rodapé**, quando são o
 * argumento mais forte que um portfólio tem. Aqui eles sobem para a escala de
 * ESPÉCIME — a mesma da folha de trabalhos, o sistema da casa — em vez de virar
 * um monograma emprestado. Mesma promoção do dado, forma própria.
 *
 * Todo texto aqui vem do /about publicado dele (medido do Framer), sem uma
 * palavra inventada. As cinco etapas do processo são as dele, na ordem dele.
 */

export default function AboutV2() {
  useMetaRota();
  /* ⚠ UM OBSERVER POR FOLHA, não um para a página: com as seções sobrepostas,
     a folha que chega precisa revelar o SEU conteúdo no momento em que cobre a
     anterior. Um gatilho único revelaria tudo na primeira rolagem, e as folhas
     de baixo chegariam já prontas — o gesto some. */
  const folhaFicha = useRevelar<HTMLElement>();
  const folhaNumeros = useRevelar<HTMLElement>();
  const folhaServicos = useRevelar<HTMLElement>();
  const folhaMetodo = useRevelar<HTMLElement>();

  return (
    <Prancha n="03" nome="About" superficie="papel" status="Available for projects" rodape="completo">
      {/* ⭐⭐ AS SEÇÕES SÃO FOLHAS QUE SE SOBREPÕEM.
          Veio dos salvos dele: o post do Obys sobre o Laxer descreve a mecânica
          inteira — *"sheets of paper. The entire website is a collection of
          interconnected sheets. Every new section becomes another layer,
          overlapping, moving, and flipping over the previous one. This logic
          shaped not only the layouts, but the motion and the way the whole
          experience flows."*

          Não é coincidência ele ter salvo isso: a direção daqui se chama A
          PRANCHA e já era folha — só que as folhas estavam EMPILHADAS em fila,
          sem gesto. Agora cada seção fica `sticky` e a seguinte SOBE POR CIMA
          dela, com o fio do sistema na aresta de ataque. A página deixa de ser
          uma lista de blocos e passa a ser um maço sendo virado.

          ⚠ Da referência vem o PRINCÍPIO (camada que cobre camada), não a
          assinatura: lá as folhas giram em 3D e têm textura de papel; aqui elas
          deslizam retas, porque este sistema é de fio de 1px e raio zero.
          E o outro salvo dele — seb astian, sobre um slider feito para a Blink,
          o estúdio do Mateus — dá a régua da escala: *"Make it big. Make it
          bold."* */}
      {/* ─ 1. A CAPA ────────────────────────────────────────────────────
          ⚠ A montagem anterior punha o retrato num bloco de 4 colunas e a
          ficha empilhada ao lado: sobravam ~450px de vazio MORTO embaixo da
          foto e a leitura virava um poço à esquerda. Agora o retrato SANGRA na
          altura da primeira tela — ele é a capa, não uma ilustração do texto —
          e a ficha desce para uma faixa de três colunas, onde ela se lê em
          paralelo em vez de empilhada.

          O manifesto fica no alto, ancorado no topo da foto: as duas coisas que
          apresentam a pessoa começam na mesma linha. */}
      <section className="p-folha-sec p-papel p-capa">
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

      {/* ─ 2. A FICHA, EM TRÊS COLUNAS ───────────────────────────────────
          Approach, Tools e Contact lado a lado: empilhados numa coluna só eles
          viravam uma tira estreita de 400px de altura, com o resto da página
          vazio ao lado. */}
      <section ref={folhaFicha} className="p-folha-sec p-papel grid grid-cols-12 pt-10" style={{ columnGap: "var(--p-gap-x)" }}>
        <div className="p-sobe col-span-5 pt-8 max-lg:col-span-12">
          <Bloco rotulo="Approach">
            <p className="p-corpo max-w-[52ch]">{LEAD[1]}</p>
          </Bloco>
        </div>
        <div className="p-sobe col-span-3 col-start-7 pt-8 max-lg:col-span-6 max-lg:col-start-1">
          <Bloco rotulo="Tools">
            <p className="p-corpo" style={{ color: "var(--p-quieto)" }}>
              {FERRAMENTAS.join(", ")}
            </p>
          </Bloco>
        </div>
        <div className="p-sobe col-span-3 col-start-10 pt-8 max-lg:col-span-6 max-lg:col-start-7">
          <Bloco rotulo="Contact & inquiries">
            <ul className="grid gap-[6px]">
              {CONTATO.map((c) => (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="p-corpo p-link"
                    >
                      {c.valor}
                    </a>
                  ) : (
                    <span className="p-corpo">{c.valor}</span>
                  )}
                </li>
              ))}
            </ul>
          </Bloco>
        </div>
      </section>

      {/* ─ 3. A RÉGUA DA TRAJETÓRIA ──────────────────────────────────────
          Os quatro números numa linha só, com fio: é a tabela de registros do
          sistema, não quatro manchetes. Dado se lê comparando — em coluna, cada
          um vira um cartaz isolado e a comparação se perde. */}
      <section ref={folhaNumeros} className="p-folha-sec p-branco grid grid-cols-4 max-md:grid-cols-2" style={{ columnGap: "var(--p-gap-x)" }}>
        {NUMEROS.map((n) => (
          <div key={n.rotulo} className="p-sobe pt-4">
            <p className="p-numero">{n.valor}</p>
            <p className="p-marca pt-1" style={{ color: "var(--p-quieto)" }}>
              {n.rotulo}
            </p>
          </div>
        ))}
      </section>

      {/* ─ 4. OS SERVIÇOS, EM TINTA ─────────────────────────────────────
          ⭐ "essa section tem que brilhar os olhos" — e o que brilha nesta
          direção é SUPERFÍCIE, não efeito: o bloco de serviços sangra de borda
          a borda em tinta, e é a única troca de superfície DENTRO de uma
          página no site inteiro. Depois de duas telas de papel, ele acende.

          A anatomia é a linha de recibo: nome e preço nos cantos opostos, o
          escopo miúdo embaixo. Preço é a informação que a pessoa veio buscar e
          não pode estar em corpo de rodapé.

          ⚠ Só o Essential tem preço — é o que ele publica no Behance (US$
          2.500). Os outros dois seguem "On request" porque preço é fato do
          cliente e não se inventa. */}
      <section ref={folhaServicos} className="p-folha-sec p-tinta p-servicos">
        <div style={{ paddingInline: "var(--p-margem)" }}>
          <p className="p-secao-indice p-sobe">
            <span>03</span>
            <span className="p-rotulo">Services — {String(TIERS.length).padStart(2, "0")}</span>
          </p>
          <ul>
            {TIERS.map((t, i) => (
              <li key={t.name} className="p-fio p-servico p-sobe">
                <div className="p-servico-linha">
                  <span className="p-marca p-servico-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="p-servico-nome">{t.name}</span>
                  <span className="p-servico-preco">
                    {t.priceFrom === null ? (
                      "On request"
                    ) : (
                      <>
                        <span className="p-servico-de">from </span>
                        {`$${t.priceFrom.toLocaleString("en-US")}`}
                      </>
                    )}
                  </span>
                </div>
                <div className="p-servico-ficha">
                  <p className="p-corpo max-w-[52ch]">{t.description}</p>
                  <p className="p-marca p-servico-escopo">
                    {t.scope.join(" · ")} <span className="p-servico-prazo">{t.timeline}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─ 5. O MÉTODO ───────────────────────────────────────────────────
          As cinco etapas na anatomia da tabela da /work: índice, título, corpo.
          É a mesma régua aplicada a outro conteúdo, que é o que faz um sistema
          em vez de uma coleção de páginas. */}
      <section ref={folhaMetodo} className="p-folha-sec p-papel grid grid-cols-12 pb-8" style={{ columnGap: "var(--p-gap-x)" }}>
        <p className="p-secao-indice p-sobe col-span-12">
          <span>04</span>
          <span className="p-rotulo">Method — {String(PROCESSO.length).padStart(2, "0")}</span>
        </p>
        <p className="p-corpo col-span-5 max-w-[46ch] pb-10 max-lg:col-span-12">{PROCESSO_MANCHETE}</p>

        <ul className="col-span-12">
          {PROCESSO.map((e, i) => (
            <li
              key={e.titulo}
              className="p-fio p-sobe grid items-baseline py-5 max-md:grid-cols-1"
              style={{ gridTemplateColumns: ".4fr 1.2fr 2.4fr", columnGap: "var(--p-gap-x)" }}
            >
              <span className="p-marca" style={{ color: "var(--p-quieto)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="p-item">{e.titulo}</span>
              <p className="p-corpo max-w-[64ch]" style={{ color: "var(--p-quieto)" }}>
                {e.corpo}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </Prancha>
  );
}
