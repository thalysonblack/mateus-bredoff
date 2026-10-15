import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import metodo01 from "../../assets/optimized/metodo-01-1440.webp";
import metodo02 from "../../assets/optimized/metodo-02-1440.webp";
import metodo03 from "../../assets/optimized/metodo-03-1440.webp";
import metodo04 from "../../assets/optimized/metodo-04-1440.webp";
import metodo05 from "../../assets/optimized/metodo-05-1440.webp";

const CENAS_METODO = [
  { src: metodo01, alt: "A plaster sphere sinking into a still surface, one frozen ripple around it" },
  { src: metodo02, alt: "A grid of identical plaster cubes, and one cube set apart on its own" },
  { src: metodo03, alt: "Thin plaster slabs fanned open from one pivot, one of them standing upright" },
  { src: metodo04, alt: "A plaster block with a circle cut clean through it, the disc standing beside it" },
  { src: metodo05, alt: "A squared stack of plaster sheets, the top corner just lifted" },
];
import { TIERS } from "../../content/precos";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import { Hexagon, Layers, LayoutGrid } from "lucide-react";
import logoBehance from "../../assets/logos/logo-behance.svg";
import logoWbd from "../../assets/optimized/logo-worldbranddesign.webp";
import logoWbdSimbolo from "../../assets/logos/wbds-simbolo.png";



/* os logos dos veículos (máscara na cor da tinta); quem não tem, entra tipográfico */
const LOGOS_VEICULO: Record<string, { src: string; ratio: string; simbolo?: string; altura?: number }> = {
  /* `altura`: peso óptico na linha do Recognition — o wordmark do Behance é
     largo e lê a 20; o logo composto da WBDS (brasão + duas linhas) só lê a 34 */
  Behance: { src: logoBehance, ratio: "152.5 / 28.2", altura: 20 },
  /* na LINHA da tabela o logo composto (brasão + wordmark em duas linhas) não
     lê a 15px: entra o SÍMBOLO + o nome em versalete */
  "World Brand Design": { src: logoWbd, ratio: "350 / 102", simbolo: logoWbdSimbolo, altura: 34 },
};

/* Published in, por PROJETO (o Trivo tem dois veículos): ordem = ano mais
   recente primeiro, e dentro do projeto a ordem do arquivo. */
const POR_PROJETO = (() => {
  const m = new Map<string, typeof RECONHECIMENTO[number][]>();
  for (const r of RECONHECIMENTO) m.set(r.projeto, [...(m.get(r.projeto) ?? []), r]);
  return [...m.entries()]
    .map(([projeto, itens]) => ({ projeto, itens, ano: Math.max(...itens.map((i) => i.ano)) }))
    .sort((a, b) => b.ano - a.ano);
})();

/* os ícones dos tiers: um símbolo (a marca), as camadas (as aplicações), a grade (o sistema) */
const ICONES_TIER = [Hexagon, Layers, LayoutGrid];
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { FitasBehance } from "../compartilhado/FitasBehance";
import { useRevelacaoPalavra } from "../compartilhado/useRevelacaoPalavra";
import { Prancha } from "../compartilhado/sistema";
import { LEAD, PROCESSO_MANCHETE, PROCESSO, FERRAMENTAS, NUMEROS } from "../../content/about";
import { RECONHECIMENTO } from "../../content/reconhecimento";


export default function AboutV2() {
  useMetaRota();
  /* ⚠ UM OBSERVER POR FOLHA, não um para a página: com as seções sobrepostas,
     a folha que chega precisa revelar o SEU conteúdo no momento em que cobre a
     anterior. Um gatilho único revelaria tudo na primeira rolagem, e as folhas
     de baixo chegariam já prontas — o gesto some. */
  const folhaMetodo = useRevelar<HTMLElement>();
  const folhaSobre = useRevelar<HTMLElement>();
  /* apagada = a tinta da folha a 25%; acesa = o --p-ink da .p-tinta */
  const leadRef = useRevelacaoPalavra<HTMLDivElement>("rgba(236, 234, 229, 0.25)", "#eceae5");
  const folhaStack = useRevelar<HTMLElement>();
  const tamborSec = useRef<HTMLElement | null>(null);
  const tamborLista = useRef<HTMLOListElement | null>(null);
  const marquee = useRef<HTMLDivElement | null>(null);
  const folhaServicos = useRevelar<HTMLElement>();
  const folhaProva = useRevelar<HTMLElement>();

  /* os veículos onde o trabalho saiu, sem repetir: três das cinco matérias são
     do mesmo lugar, e o nome em corpo de cartaz três vezes seguidas mata a
     escala que ele deveria dar */
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

  /* ⭐ O TAMBOR: a lista anda −(N−1)·passo enquanto a seção fica pinada; o
     item i chega ao centro em progress = i/(N−1) e acende. Distância curta
     (0,7 tela por etapa) para o gesto não virar corredor. */
  useEffect(() => {
    const sec = tamborSec.current;
    const lista = tamborLista.current;
    if (!sec || !lista) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;
    const itens = Array.from(lista.querySelectorAll<HTMLElement>(".p-tambor-etapa"));
    const n = itens.length;
    const passo = () => itens[0]?.getBoundingClientRect().height ?? 0;
    const grupo = (i: number) => Array.from(sec.querySelectorAll<HTMLElement>(`.p-tambor [data-etapa="${i}"]`));
    let atual = 0;
    const acende = (i: number) => {
      if (i === atual) return;
      grupo(atual).forEach((el) => el.classList.remove("p-tambor-acesa"));
      grupo(i).forEach((el) => el.classList.add("p-tambor-acesa"));
      atual = i;
    };
    const tween = gsap.fromTo(
      lista,
      { y: 0 },
      {
        y: () => -(n - 1) * passo(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${(n - 1) * 0.7 * window.innerHeight}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => acende(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  /* ⭐ A STACK ACENDE ao cruzar o centro: um trigger por palavra, sem scrub. */
  useEffect(() => {
    const itens = Array.from(document.querySelectorAll<HTMLElement>("[data-stack]"));
    if (!itens.length) return;
    const trs = itens.map((el) =>
      ScrollTrigger.create({ trigger: el, start: "top 62%", end: "bottom 38%", toggleClass: { targets: el, className: "p-stack-item--aceso" } }),
    );
    return () => trs.forEach((s) => s.kill());
  }, []);

  useEffect(() => {
    const el = marquee.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    const anda = () => {
      const meia = el.scrollWidth / 2;
      if (!meia) return;
      const v = Math.min(Math.abs(getLenis()?.velocity ?? 0), 60);
      x -= (0.9 + v * 0.12) * (gsap.ticker.deltaRatio(60) || 1);
      if (-x >= meia) x += meia;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(anda);
    return () => gsap.ticker.remove(anda);
  }, []);

  /* ⭐ O ÍNDICE DO DOSSIÊ acende com o bloco que está na tela. */
  useEffect(() => {
    const blocos = Array.from(document.querySelectorAll<HTMLElement>("[data-bloco]"));
    if (!blocos.length) return;
    const trs = blocos.map((b) => {
      const alvo = document.querySelector<HTMLElement>(`[data-indice="${b.dataset.bloco}"]`);
      return ScrollTrigger.create({ trigger: b, start: "top 45%", end: "bottom 45%", toggleClass: alvo ? { targets: alvo, className: "pn-on" } : undefined });
    });
    return () => trs.forEach((s) => s.kill());
  }, []);

  /* ⭐ PROFUNDIDADE — a coreografia entre folhas (12/09). Para cada folha que
     tem uma seguinte: enquanto a seguinte sobe da base ao topo da viewport, a
     que sai anda +0,4·vh para baixo (= 0,6× do scroll) e o véu vai a 0,4. A
     que entra tem z-index maior e fundo opaco, então passa por cima. Scrub
     numérico no Lenis, nunca pin; `invalidateOnRefresh` porque a distância é
     a altura da viewport. */
  useEffect(() => {
    /* no celular a capa é mais baixa que a tela e a folha seguinte já nasce à vista: o
       gesto empurraria a foto para baixo do topo. Lá as folhas só empilham. */
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 860px)").matches) return;
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

  /* superfície TINTA (12/09): de Método para baixo a página é um palco escuro
     e o rodapé geral herda a superfície da tela — em papel ele quebrava o
     palco no fim. As folhas de papel (método) pintam a própria cor. */
  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects" rodape="completo">
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
        {/* sem a margem de folha: a grade é a do menu (ver --p-grade-col1) */}
        <div>
          <div className="p-sobre-grade">
            <p className="p-rotulo p-sobe">About me</p>
            {/* o texto ACENDE palavra a palavra com o scroll ("scroll reveal no
                texto", 16/09) — o gesto da about original, mesmo hook. Sem
                `p-sobe` nos parágrafos: a entrada é a própria leitura. */}
            <div ref={leadRef}>
              <p className="p-sobre-txt p-sobre-txt--abre">{LEAD[0]}</p>
              <p className="p-sobre-txt">{LEAD[1]}</p>
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

      {/* ═══ O DOSSIÊ (about-n, 12/09) — "preciso de uma mudança completa no
          method até o final". Postura oposta ao filme: de Method ao fim, UM
          documento só, em papel, sem nenhuma superfície trocando. Índice
          lateral fixo que acende conforme se rola; método, stack, serviços e
          matérias como registros numerados numa grade única. A tipografia é a
          arquitetura; as cenas entram pequenas, como figuras de um relatório. */}
      <section ref={folhaMetodo} className="p-folha-sec p-papel pn-dossie" data-folha="3">
        <aside className="pn-indice" aria-label="Contents">
          <p className="p-rotulo">Contents</p>
          <ol className="pn-indice-lista">
            {[["method", "Method"], ["services", "Services"], ["published", "Recognition"]].map(([id, nome], k) => (
              <li key={id} className="pn-indice-item" data-indice={id}>
                <a href={`#${id}`} className="p-item"><span className="p-marca pn-indice-n">{String(k + 1).padStart(2, "0")}</span> {nome}</a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="pn-corpo">
          <article id="method" className="pn-bloco" data-bloco="method">
            <header className="pn-bloco-cab">
              <h2 className="p-servico-nome pn-bloco-titulo">Method</h2>
              <p className="p-corpo pn-bloco-lead">{PROCESSO_MANCHETE}</p>
            </header>
            <ol className="pn-registros">
              {PROCESSO.map((e, i) => (
                <li key={e.titulo} className="pn-registro p-sobe">
                  <span className="p-marca pn-registro-n">{String(i + 1).padStart(2, "0")}</span>
                  <div className="pn-registro-txt">
                    <h3 className="p-item pn-registro-titulo">{e.titulo}</h3>
                    <p className="p-corpo pn-registro-corpo">{e.corpo}</p>
                  </div>
                  <img className="pn-figura" src={CENAS_METODO[i].src} alt={CENAS_METODO[i].alt} width={1440} height={810} loading="lazy" decoding="async" draggable={false} />
                </li>
              ))}
            </ol>
            {/* as ferramentas como METADADO do método, não como seção: "My stack"
                em bloco próprio era a seção mais fraca da página (12/09) */}
            <p className="p-marca pn-tools">
              <span style={{ color: "var(--p-quieto)" }}>Tools</span> {FERRAMENTAS.join(" · ")}
            </p>
          </article>


          <article id="services" className="pn-bloco" data-bloco="services">
            <header className="pn-bloco-cab">
              <h2 className="p-servico-nome pn-bloco-titulo">Services</h2>
            </header>
            <ul className="pn-recibo">
              {TIERS.map((tier) => (
                <li key={tier.name} className="pn-recibo-linha p-sobe">
                  <span className="p-item pn-recibo-nome">{tier.name}</span>
                  {/* "ruim" (16/09): o escopo era os 4 itens emendados por "·" em mono
                      CAIXA ALTA, quebrando em duas linhas com entrelinha 1 — lia como dump
                      de código. Escopo é LISTA: um item por linha, no corpo, em quieto; só o
                      prazo fica em mono, que é rótulo curto. */}
                  <span className="pn-recibo-meta">
                    <ul className="p-corpo pn-recibo-escopo">
                      {tier.scope.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <span className="p-marca pn-recibo-prazo">{tier.timeline}</span>
                  </span>
                  <span className="p-corpo pn-recibo-desc">{tier.description}</span>
                  {tier.priceFrom === null ? <span className="pn-recibo-preco pn-recibo-preco--aberto">On request</span> : <span className="pn-recibo-preco"><span className="pn-recibo-de">from</span>{`$${tier.priceFrom.toLocaleString("en-US")}`}</span>}
                </li>
              ))}
            </ul>
          </article>

          <article id="published" className="pn-bloco" data-bloco="published">
            <header className="pn-bloco-cab">
              <h2 className="p-servico-nome pn-bloco-titulo">Recognition</h2>
            </header>

            <FitasBehance className="pn-sub" classeRotulo="p-marca pn-sub-rotulo" classeN="p-marca pn-fita-n" />

            {/* 2) PUBLISHED IN — uma linha por projeto, o nome em escala de página à
                esquerda e, à direita, o logo de cada veículo que o publicou (o logo É
                o link da matéria; o título vai no title/aria). Sem ano, sem título:
                a linha diz "quem escolheu mostrar isto". */}
            <div className="pn-sub">
              <span className="p-marca pn-sub-rotulo">Published in</span>
              <ul className="pn-publicado">
                {POR_PROJETO.map(({ projeto, itens }) => (
                  <li key={projeto} className="p-fio p-sobe pn-publicado-linha">
                    <span className="pn-publicado-nome">{projeto}</span>
                    <span className="pn-publicado-logos">
                      {itens.map((r, i) => {
                        const L = LOGOS_VEICULO[r.veiculo];
                        const rotulo = `${r.veiculo} — ${r.titulo}`;
                        const miolo = L ? (
                          <span className="pn-logo pn-logo--publicado" style={{ ["--logo" as string]: `url("${L.src}")`, aspectRatio: L.ratio, height: L.altura ?? 22 }} role="img" aria-label={r.veiculo} />
                        ) : (
                          <span className="pn-logo-abz pn-logo-abz--publicado">{r.veiculo}</span>
                        );
                        return r.href ? (
                          <a key={i} href={r.href} target="_blank" rel="noopener noreferrer" className="pn-publicado-logo" title={rotulo} aria-label={rotulo}>{miolo}</a>
                        ) : (
                          <span key={i} className="pn-publicado-logo" title={rotulo}>{miolo}</span>
                        );
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </Prancha>
  );
}
