import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { TIERS } from "../sections/Pricing";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import { LEAD, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS } from "../../content/about";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";

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
  const folhaMetodo = useRevelar<HTMLElement>();
  /* ⭐ O ÍNDICE QUE ATRAVESSA. "não ficar muito blocado" (12/09): cinco folhas
     com a mesma anatomia — fio no topo, "0X RÓTULO" no mesmo canto — liam como
     cinco caixas. O numeral sai de dentro de cada folha e vira UM elemento fixo
     no canto, que troca quando a folha seguinte chega: o mesmo índice cruzando
     todas as fronteiras é o que faz a página ler como um documento contínuo, e
     não como blocos. Régua do uau: um elemento cruzando a fronteira. */
  const [folhaAtual, setFolhaAtual] = useState(0);
  const trilho = useRef<HTMLDivElement | null>(null);
  const percurso = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const folhas = [...document.querySelectorAll<HTMLElement>("[data-folha]")];
    if (!folhas.length) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          /* `data-folha` é 1-based (é o número que a página mostra); o estado é
             o índice do array de rótulos — medido: sem o −1 a capa dizia "02" */
          if (e.isIntersecting) setFolhaAtual(Number((e.target as HTMLElement).dataset.folha) - 1);
        }),
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    folhas.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);
  /* ⭐ O MÉTODO CORRE NA HORIZONTAL COM A SEÇÃO PRESA — o gesto que consertou o
     miolo em 18/08 e que a lista vertical de 11/09 tinha desfeito. A folha ganha
     percurso (altura de tela + o comprimento do trilho) e fica grudada; o scroll
     que atravessa esse percurso move as cinco etapas lateralmente. `scrub` com
     número, nunca `true` — é o atraso que dá peso. Sem pin: pin sequestra a
     rolagem. O Lenis já alimenta o ScrollTrigger (`lib/lenis.ts`). */
  useEffect(() => {
    const t = trilho.current;
    const sec = percurso.current;
    if (!t || !sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dist = () => Math.max(0, t.scrollWidth - t.clientWidth);
    const tween = gsap.fromTo(
      t,
      { x: 0 },
      {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  const folhaServicos = useRevelar<HTMLElement>();
  const folhaProva = useRevelar<HTMLElement>();
  const folhaPecas = useRevelar<HTMLElement>();

  /* os veículos onde o trabalho saiu, sem repetir: três das cinco matérias são
     do mesmo lugar, e o nome em corpo de cartaz três vezes seguidas mata a
     escala que ele deveria dar */
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

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
      {/* ⭐ "a hero que gosto dela, full" (12/09). A mesma capa — retrato +
          manifesto — mas cobrindo a viewport inteira, com o header da Prancha
          e o manifesto flutuando POR CIMA da foto, como no visor. O retrato
          deixa de ser uma coluna de 5 e vira a superfície; o manifesto desce
          para a base, sobre véu, onde a foto é escura e ele lê. */}
      <section className="p-folha-sec p-papel p-capa p-capa-full" data-folha="1">
        <figure className="p-retrato">
          <img
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="100vw"
            alt="Mateus Bredoff"
            width={1600}
            height={850}
            fetchpriority="high"
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

      {/* o índice que atravessa: um só, fixo no canto, trocando por folha */}
      <p className="p-secao-indice p-indice-vivo" aria-hidden="true">
        <span>{String(folhaAtual + 1).padStart(2, "0")}</span>
        <span className="p-rotulo">
          {["About", "Method", "Services", "Published", "Selected"][folhaAtual] ?? ""}
        </span>
      </p>
      {/* ══ O MIOLO, REFEITO EM 11/09/2026 — "princípios de design mesmo" ════
          Diagnóstico medido antes de mexer: a capa era o ÚNICO momento da
          página. Da segunda tela ao rodapé tudo caía para 13/9,5/8,5px em
          cinza — ficha de três colunas com meia tela vazia, quatro números em
          mono (que ele mandou tirar em 19/08 e continuavam no ar), e o método
          em tabela de planilha. Escala achatada, um só registro, nenhuma
          imagem além do retrato: a about de um brand designer sem uma peça.

          Os princípios que o conserto aplica, na ordem:
          · HIERARQUIA — três escalas de verdade (display 50px, item 28–32px,
            corpo 13px), em vez de display na capa e 13px no resto;
          · RITMO — a página troca de temperatura a cada bloco: papel (capa) →
            papel em escala (método) → TINTA (serviços) → BRANCO (prova) →
            papel com peça sangrando → rodapé. Diferenciar é VALOR, não matiz;
          · UMA GRADE — borda esquerda fixa na margem da prancha, de cima a
            baixo; nada de coluna que começa em outro lugar;
          · O GESTO — os veículos onde ele foi publicado em escala extrema,
            atravessando a tela, e uma faixa de peças em sangria. É o que ele
            pediu em 19/08: "focar nas conquistas de prêmios".
          O que saiu: os big numbers (ordem dele), a ficha de três colunas
          (Tools vira metadado da capa; Contact já mora no rodapé). */}

      {/* ─ 2. O MÉTODO, EM ESCALA ────────────────────────────────────────
          É o argumento comercial dele — cinco etapas que dizem como o
          trabalho acontece — e estava em 13px cinza, lendo como planilha.
          Agora cada etapa tem o numeral no corpo de índice do sistema, o nome
          em corpo de item e o texto em coluna de leitura. A manchete de
          abertura sobe para o display: é a mesma anatomia dos serviços, então
          método e serviços leem como duas partes de um só documento. */}
      <section
        ref={(el) => {
          (folhaMetodo as React.MutableRefObject<HTMLElement | null>).current = el;
          percurso.current = el;
        }}
        className="p-folha-sec p-papel p-metodo p-metodo-trilho"
        data-folha="2"
      >
        <div className="p-metodo-fixo">
          <div style={{ paddingInline: "var(--p-margem)" }}>
            <p className="p-servico-nome p-sobe p-metodo-manchete">{PROCESSO_MANCHETE}</p>
          </div>
          {/* o trilho: as cinco etapas lado a lado, cada uma uma tela de 62vw;
              o scroll as move. Sem fio entre elas — o vão é o separador */}
          <div className="p-trilho" ref={trilho}>
            {PROCESSO.map((e, i) => (
              <article key={e.titulo} className="p-trilho-etapa">
                <span className="p-metodo-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="p-metodo-nome">{e.titulo}</span>
                <p className="p-corpo p-metodo-corpo">{e.corpo}</p>
              </article>
            ))}
            <article className="p-trilho-etapa p-trilho-fim">
              <span className="p-metodo-n" style={{ color: "var(--p-quieto)" }}>—</span>
              <span className="p-metodo-nome">Tools</span>
              <p className="p-corpo p-metodo-corpo">{FERRAMENTAS.join(" · ")}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ─ 3. OS SERVIÇOS, EM TINTA ─────────────────────────────────────
          ⭐ "essa section tem que brilhar os olhos" — e o que brilha nesta
          direção é SUPERFÍCIE, não efeito: o bloco de serviços sangra de borda
          a borda em tinta. Depois do método em papel, ele acende.
          A anatomia é a linha de recibo: nome e preço nos cantos opostos, o
          escopo miúdo embaixo. Preço é a informação que a pessoa veio buscar e
          não pode estar em corpo de rodapé.
          ⚠ Só o Essential tem preço — é o que ele publica no Behance (US$
          2.500). Os outros dois seguem "On request" porque preço é fato do
          cliente e não se inventa. */}
      <section ref={folhaServicos} className="p-folha-sec p-tinta p-servicos" data-folha="3">
        <div style={{ paddingInline: "var(--p-margem)" }}>
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

      {/* ─ 4. A PROVA, EM BRANCO ─────────────────────────────────────────
          "vamos eliminar os big number e focar nas conquistas de prêmios"
          (19/08). É a ordem que nunca tinha chegado à página no ar. O centro
          agora é ONDE O TRABALHO FOI PUBLICADO: os veículos em escala extrema
          atravessando a tela — o gesto que a régua do uau pede — e por baixo as
          cinco matérias em tabela, na anatomia de registro do sistema.
          ⚠ Superfície BRANCA, a terceira da página: depois da tinta, o branco
          absoluto é o que faz a prova ler como outro capítulo e não como
          continuação dos serviços. */}
      <section ref={folhaProva} className="p-folha-sec p-papel p-prova" data-folha="4">
        <div style={{ paddingInline: "var(--p-margem)" }}>
          <p className="p-prova-nomes p-sobe">
            {veiculos.map((v, i) => (
              <span key={v}>
                <span className="p-faixa-nome">{v}</span>
                {i < veiculos.length - 1 && <span className="p-faixa-ponto"> · </span>}
              </span>
            ))}
          </p>
          <ul className="p-prova-tabela">
            {RECONHECIMENTO.map((r, i) => (
              <li key={i} className="p-fio p-sobe p-prova-linha">
                <span className="p-item">{r.projeto}</span>
                <span className="p-corpo">{r.veiculo}</span>
                <span className="p-corpo p-prova-titulo" style={{ color: "var(--p-quieto)" }}>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                      {r.titulo}
                    </a>
                  ) : (
                    r.titulo
                  )}
                </span>
                <span className="p-marca p-prova-ano" style={{ color: "var(--p-quieto)" }}>
                  {r.ano}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─ 5. AS PEÇAS, EM SANGRIA ───────────────────────────────────────
          A about de um brand designer sem uma peça é um currículo. A faixa
          começa na margem da prancha e SANGRA pela direita, com altura fixa e
          largura livre por capa: é a única forma de manter a altura sem
          recortar nenhuma. Rola na horizontal; a página não cresce. */}
      <section ref={folhaPecas} className="p-folha-sec p-papel p-pecas" data-folha="5">
        <div className="p-pecas-faixa p-sobe">
          {WORK.map((w) => (
            <a key={w.slug} href={`/work/${w.slug}`} className="p-pecas-item">
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="46vw"
                alt={w.cover.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <span className="p-marca p-pecas-legenda">
                <span>{w.title}</span>
                <span style={{ color: "var(--p-quieto)" }}>{w.year}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </Prancha>
  );
}
