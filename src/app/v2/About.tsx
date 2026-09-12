import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import metodo01 from "../../assets/optimized/metodo-01-1440.webp";
import metodo02 from "../../assets/optimized/metodo-02-1440.webp";
import metodo03 from "../../assets/optimized/metodo-03-1440.webp";
import metodo04 from "../../assets/optimized/metodo-04-1440.webp";
import metodo05 from "../../assets/optimized/metodo-05-1440.webp";

/* ⭐ AS CENAS DO MÉTODO — refeitas em 12/09 por três ordens dele, na sequência:
   "refazer a foto de acordo com o que ele faz que é marcas, uso de ia.. e
   fotografia de acordo com a hero" · "veja que ele é negro" · "botar efeitos
   de dither". O que cada uma mudou:
   · ASSUNTO: o trabalho dele, não "um designer num laptop" — grid de marcas,
     mapa de posicionamento, moodboard com a interface de geração atrás,
     wordmark em construção com o mockup gerado ao lado, brand book aberto.
   · LUZ E PALETA: as da HERO (estúdio, fonte grande fora do quadro, fundo em
     gradiente petróleo #1e3a42 → cinza #c2c8c6, papel creme), não o âmbar
     noturno da referência de filme que valia antes.
   · ELENCO: a mão é dele — pele escura, escrita na PRIMEIRA linha do prompt.
     A leva sem isso veio inteira com mão clara e foi descartada.
   · DITHER em pós, não em runtime: bayer (scale 1) para cinco tons amostrados
     da hero (tinta · petróleo · cinza · claro · papel), via ffmpeg
     `paletteuse`. Cinco tons comprimem quase de graça — WebP LOSSLESS de
     48–72 KB por cena (o lossy borra o padrão, e a 100 pesava 500 KB).
   · UM arquivo por cena, 1440×810: em retina cai 1:1 sobre os 720px do slot
     e o dither fica nítido; em tela 1x vira textura fina. Sem srcSet.
   Originais e folhas de contato em `_refs/metodo-cenas/` (PNGs fora do git). */
const CENAS_METODO = [
  { src: metodo01, alt: "The brief under his hand, a board of brand marks on the laptop" },
  { src: metodo02, alt: "The positioning map — printed in his hand, and on the screen" },
  { src: metodo03, alt: "The direction board: printed cards on the desk, generated variations on the screen" },
  { src: metodo04, alt: "The wordmark under construction on the screen, the pencil sketch under his hand" },
  { src: metodo05, alt: "The delivery — the brand book open on the symbol, the cards and the drive" },
];
import { TIERS } from "../sections/Pricing";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import { LEAD, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS, NUMEROS } from "../../content/about";
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
  const trilho = useRef<HTMLDivElement | null>(null);
  const percurso = useRef<HTMLElement | null>(null);
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
  const folhaSobre = useRevelar<HTMLElement>();
  const folhaStack = useRevelar<HTMLElement>();
  const folhaServicos = useRevelar<HTMLElement>();
  const folhaProva = useRevelar<HTMLElement>();
  const folhaPecas = useRevelar<HTMLElement>();

  /* os veículos onde o trabalho saiu, sem repetir: três das cinco matérias são
     do mesmo lugar, e o nome em corpo de cartaz três vezes seguidas mata a
     escala que ele deveria dar */
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

  /* ⭐ PROFUNDIDADE — a coreografia entre folhas (12/09). Para cada folha que
     tem uma seguinte: enquanto a seguinte sobe da base ao topo da viewport, a
     que sai anda +0,4·vh para baixo (= 0,6× do scroll) e o véu vai a 0,4. A
     que entra tem z-index maior e fundo opaco, então passa por cima. Scrub
     numérico no Lenis, nunca pin; `invalidateOnRefresh` porque a distância é
     a altura da viewport. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const folhas = Array.from(document.querySelectorAll<HTMLElement>(".p-tela .p-folha-sec"));
    const ctx = gsap.context(() => {
      folhas.forEach((sec, i) => {
        sec.style.zIndex = String(i + 1);
        const prox = folhas[i + 1];
        if (!prox) return;
        gsap.to(sec, {
          y: () => 0.4 * window.innerHeight,
          "--p-veu": 0.4,
          ease: "none",
          scrollTrigger: { trigger: prox, start: "top bottom", end: "top top", scrub: 0.4, invalidateOnRefresh: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);

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
      {/* ⭐ A HERO — "gostei, mantém a hero assim" + o node 433:103 do Figma
          (12/09). É a hero da home original dele: o retrato em tela cheia,
          MATEUS BREDOFF gigante na base à esquerda, BRAND DESIGNER na base à
          direita, os dois em `exclusion` atravessados pela camisa, e os
          metadados de 15px no alto. As classes `.p-hero` já eram esta anatomia
          (AboutC/D, agosto) — reusadas, com os valores acertados pelo node:
          128px em 1920 (6,67vw), tracking −0,03em, entrelinha 0,89.

          ⚠ "faz igual" + "mas aí tu adapta ao lugar": a barra do Figma tem
          Brazil based · hora · Currently available · CONTACT. O header da
          Prancha já ocupa o topo com nome, nav e "Available for projects" —
          então a barra desce para baixo dele e traz só o que é desta página:
          onde ele está, a hora viva, e o contato. Repetir "available" a 30px
          de distância seria dizer a mesma coisa duas vezes.

          ⚠ Sem véu: o blend precisa da foto crua. O gradiente da própria foto
          (petróleo no alto, quase branco na base) é o que faz o nome sair
          escuro no fundo claro e claro sobre a camisa — pixel a pixel. */}
      <section className="p-folha-sec p-papel p-hero p-capa-full" data-folha="1">
        <figure className="p-hero-foto">
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
        {/* as fichas que ficavam aqui saíram: o menu geral passou a ser a barra
            do node (mesmo estilo, mesma informação) — repetir 30px abaixo era
            dizer a mesma coisa duas vezes. */}
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

      {/* o índice vivo saiu — "remover" (12/09, print do "02 METHOD" sobre a hero) */}
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

      {/* ─ 2. SOBRE ELE — "antes dessa section deveria falar dele", node 433:217
          (12/09). A anatomia do frame About do Figma: rótulo na coluna da
          esquerda, o texto a partir de um terço da largura, em corpo de
          leitura grande; depois "By the numbers", quatro colunas com fio em
          cima, o número em Light e o rótulo quieto. Em tinta, como lá — a
          hero escura desce para esta folha sem troca de superfície.
          ⚠ Os números são os do CONTEÚDO (content/about.ts, apurado do site
          publicado); o Figma mostra 46 · 100+ · 14 · 46 — divergência
          reportada, não decidida aqui. */}
      <section ref={folhaSobre} className="p-folha-sec p-tinta p-sobre" data-folha="2">
        <div style={{ paddingInline: "var(--p-margem)" }}>
          <div className="p-sobre-grade">
            <p className="p-rotulo p-sobe">About me</p>
            <div>
              <p className="p-sobre-txt p-sobre-txt--abre p-sobe">{LEAD[0]}</p>
              <p className="p-sobre-txt p-sobe">{LEAD[1]}</p>
            </div>
          </div>
          <p className="p-rotulo p-sobe p-numeros-rotulo">By the numbers</p>
          <ul className="p-numeros">
            {NUMEROS.map((n) => (
              <li key={n.rotulo} className="p-fio p-sobe">
                <span className="p-numero-valor">{n.valor}</span>
                <span className="p-numero-rotulo">{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─ 3. O MÉTODO, EM ESCALA ────────────────────────────────────────
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
        data-folha="3"
      >
        <div className="p-metodo-fixo">
          {/* "faltou título da section e o texto" (12/09): o rótulo da seção na
              coluna da esquerda e a manchete a um terço — a mesma grade da
              folha Sobre, para as duas lerem como partes de um documento */}
          <div className="p-metodo-cab" style={{ paddingInline: "calc(var(--p-margem) * 2)" }}>
            <p className="p-rotulo p-sobe">Method</p>
            <p className="p-servico-nome p-sobe p-metodo-manchete">{PROCESSO_MANCHETE}</p>
          </div>
          {/* o trilho: as cinco etapas lado a lado, cada uma uma tela de 62vw;
              o scroll as move. Sem fio entre elas — o vão é o separador */}
          <div className="p-trilho" ref={trilho}>
            {PROCESSO.map((e, i) => (
              <article key={e.titulo} className="p-trilho-etapa">
                {/* a cena em 16:9 ocupa o vazio que havia acima do título —
                    o slot que ele apontou no print */}
                <img
                  className="p-trilho-foto"
                  src={CENAS_METODO[i].src}
                  alt={CENAS_METODO[i].alt}
                  width={1440}
                  height={810}
                  loading={i === 0 ? undefined : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <span className="p-metodo-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="p-metodo-nome">{e.titulo}</span>
                <p className="p-corpo p-metodo-corpo">{e.corpo}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─ MY STACK — "faz a my stack tbm" (12/09), do frame About do Figma:
          rótulo à esquerda, as ferramentas em display na coluna, a primeira
          acesa e as outras quietas (lá: Figma em branco, o resto a 50%).
          Em papel, colada ao método: o "como" e o "com o quê" são o mesmo
          capítulo — e as ferramentas deixam de ser a última coluna do trilho,
          para não aparecerem duas vezes. Cabe numa tela: fica sticky. */}
      <section ref={folhaStack} className="p-folha-sec p-papel p-stack" data-folha="4">
        <div className="p-grade-secao" style={{ paddingInline: "var(--p-margem)" }}>
          <p className="p-rotulo p-sobe">My stack</p>
          <ul className="p-stack-lista">
            {FERRAMENTAS.map((f, i) => (
              <li key={f} className={i === 0 ? "p-servico-nome p-stack-item p-stack-item--aceso p-sobe" : "p-servico-nome p-stack-item p-sobe"}>
                {f}
              </li>
            ))}
          </ul>
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
      {/* "vamos melhorar o pricing e o restante" (12/09): a MESMA grade de Sobre e
          Método — rótulo da seção à esquerda, o conteúdo a partir de um terço —
          para as folhas lerem como capítulos de um só documento. E a folha
          ROLA: com 724px ela era sticky e o terceiro tier (Brand System) nunca
          aparecia em tela de 704 ([[gotcha_folha_sticky_maior_que_a_tela_esconde_a_base]]). */}
      <section ref={folhaServicos} className="p-folha-sec p-tinta p-servicos" data-folha="5">
        <div className="p-grade-secao" style={{ paddingInline: "var(--p-margem)" }}>
          <p className="p-rotulo p-sobe">Services</p>
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
      <section ref={folhaProva} className="p-folha-sec p-papel p-prova" data-folha="6">
        <div style={{ paddingInline: "var(--p-margem)" }}>
          <div className="p-grade-secao">
          <p className="p-rotulo p-sobe">Published in</p>
          <p className="p-prova-nomes p-sobe">
            {veiculos.map((v, i) => (
              <span key={v}>
                <span className="p-faixa-nome">{v}</span>
                {i < veiculos.length - 1 && <span className="p-faixa-ponto"> · </span>}
              </span>
            ))}
          </p>
          </div>
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
      <section ref={folhaPecas} className="p-folha-sec p-papel p-pecas" data-folha="7">
        <div className="p-grade-secao p-pecas-cab" style={{ paddingInline: "var(--p-margem)" }}>
          <p className="p-rotulo p-sobe">Selected work</p>
          <p className="p-marca p-sobe" style={{ color: "var(--p-quieto)" }}>{String(WORK.length).padStart(2, "0")} identities</p>
        </div>
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
