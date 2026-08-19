import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { LEAD, NUMEROS, PROCESSO, PROCESSO_MANCHETE, FERRAMENTAS } from "../../content/about";
import { useLayoutEffect, useRef } from "react";
import { WORK } from "../../content/work";
import { MODALIDADES } from "../../content/servicos";
import { gsap } from "../../lib/gsap";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useRevelar } from "./useRevelar";
import { Prancha } from "./sistema";
import Palavra from "./Palavra";

/**
 * ABOUT — PROPOSTA D: "O RETRATO".
 *
 * Colhida do Savee dele (busca `about page`, 18/08): as peças que param o
 * scroll naquele grid não são densas — são UMA imagem grande com UMA frase por
 * cima. A "About bloody time." da Tesco e o "About / Lucas" do Bringhenti fazem
 * a mesma coisa: o retrato é o argumento, o texto é a legenda dele.
 *
 * As três abouts anteriores erraram no mesmo ponto — abriam explicando. Esta
 * abre com a CARA dele em tela cheia e o nome atravessando, e só depois deixa a
 * leitura acontecer. É o "elemento UAU e depois os textos" pedido em 17/08,
 * levado a sério: nada compete com a abertura.
 *
 * ⚠ A mecânica é a das folhas sobrepostas que ele já aprovou (Laxer/Obys): o
 * palco fica `sticky` e o conteúdo passa POR CIMA. Sem isso o retrato vira uma
 * capa que a pessoa rola para fora e esquece.
 */
export default function AboutD() {
  useMetaRota("/about");
  const valores = useRevelar<HTMLDivElement>();
  const trilho = useRef<HTMLElement>(null);
  const fita = useRef<HTMLOListElement>(null);

  /* A peça em sangria e as três dos pacotes vêm do acervo, escolhidas pelo que
     cada uma prova — não pela beleza da foto. */
  const prova = WORK.find((w) => w.slug === "alex-archer") ?? WORK[0];
  const provaImg = prova.cover;
  /* ⚠ Mapeado à mão, e não por índice de SERVICOS: por índice o Alex Archer
     caía no Art Direction e repetia a peça que já sangra acima. Cada pacote
     leva a obra que PROVA o que ele promete, e nenhuma aparece duas vezes. */
  const PROVA_DO_PACOTE: Record<string, string> = {
    "Full Brand Identity": "ginga",
    "Art Direction": "stag",
    "Monthly Retainer": "votare",
  };
  const pecaDe = (nome: string) =>
    (WORK.find((w) => w.slug === (PROVA_DO_PACOTE[nome] ?? "ginga")) ?? WORK[0]).cover;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!fita.current || !trilho.current) return;
      const percurso = () => fita.current!.scrollWidth - window.innerWidth + 80;
      gsap.to(fita.current, {
        x: () => -percurso(),
        ease: "none",
        scrollTrigger: {
          trigger: trilho.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            trilho.current?.style.setProperty("--percurso", String(self.progress)),
        },
      });
    }, trilho);
    return () => ctx.revert();
  }, []);

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects" rodape="completo">
      <div className="ab-d">
        {/* ── O PALCO ────────────────────────────────────────────────────
            Full bleed: sai das margens da prancha e sobe por baixo do
            cabeçalho, como na home dele. O nome em `difference` porque a foto
            é escura de um lado e clara do outro — cor fixa mancharia metade. */}
        <div className="ab-d-palco">
          <img
            className="ab-d-foto"
            src={retrato}
            srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
            sizes="100vw"
            alt="Mateus Bredoff"
          />
          {/* ⚠ O nome ANCORA NA BASE, não no centro: a cabeça ocupa a faixa
              do meio e tipografia sobre o rosto de alguém é sempre erro de
              enquadramento, nunca de gosto. Aqui o retrato fica inteiro e a
              palavra fecha a tela por baixo, encostando nas duas margens. */}
          <h1 className="ab-d-nome">
            <Palavra texto="MATEUS BREDOFF" />
          </h1>
          <p className="ab-d-pe">
            <span>Brand designer</span>
            <span>Brazil · working globally</span>
            <span>Since 2019</span>
          </p>
        </div>

        {/* ── A FOLHA ─ passa por cima do palco e leva o papel de volta ── */}
        <div className="ab-d-folha">
          <section className="ab-d-lead">
            <div className="ab-d-lead-esq">
              <p className="ab-d-frase">
                I build identities that hold up <em>after</em> the launch.
              </p>
              {/* ⚠ a ficha existe para o vazio desta coluna ser RESPIRO e não
                  buraco: sem ela, a frase para em duas linhas e sobram 600px de
                  papel morto ao lado de uma coluna cheia. */}
              <dl className="ab-d-ficha">
                <div><dt className="p-rotulo">Based</dt><dd className="p-corpo">Brazil · UTC−3</dd></div>
                <div><dt className="p-rotulo">Practice</dt><dd className="p-corpo">Visual identity &amp; brand systems</dd></div>
                <div><dt className="p-rotulo">Working</dt><dd className="p-corpo">Globally, remote</dd></div>
                <div><dt className="p-rotulo">Since</dt><dd className="p-corpo">2019</dd></div>
              </dl>
            </div>
            <div className="ab-d-lead-corpo">
              {LEAD.map((p, i) => (
                <p key={i} className={i === 0 ? "ab-d-lead-1" : "p-corpo"}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* ── A FAIXA ─ os números atravessam a tela com o scroll ──────
              Fileira estática de quatro números é ficha; a mesma informação
              ATRAVESSANDO é gesto. A peça abriu prometendo escala e movimento,
              e o miolo tem de continuar pagando essa promessa. */}
          <section className="ab-d-faixa">
            <div className="ab-d-faixa-fita">
              {[0, 1].map((volta) => (
                <div className="ab-d-faixa-grupo" key={volta} aria-hidden={volta === 1}>
                  {NUMEROS.map((n) => (
                    <div key={n.rotulo} className="ab-d-faixa-item">
                      <p className="p-numero-big">{n.valor}</p>
                      <p className="p-rotulo">{n.rotulo}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ── A PROVA ─ o trabalho aparece antes de o método ser explicado ──
              ⚠ A about de um designer que não mostra nenhuma peça pede fé. Esta
              sangra de margem a margem porque é a única imagem do miolo: ou ela
              tem escala, ou é ilustração. */}
          <section className="ab-d-prova">
            <img
              src={provaImg.src}
              srcSet={provaImg.src2x ? `${provaImg.src} 1400w, ${provaImg.src2x} 2200w` : undefined}
              sizes="100vw"
              width={provaImg.w}
              height={provaImg.h}
              alt={provaImg.alt}
            />
            <p className="p-marca ab-d-prova-pe">
              <span>{prova?.title}</span>
              <span>{prova?.year}</span>
            </p>
          </section>

          {/* ── O MÉTODO ─ trilho horizontal ────────────────────────────
              Antes: duas telas de tabela, com a coluna do meio vazia. Cinco
              etapas empilhadas verticalmente são um documento; correndo na
              horizontal enquanto a seção fica presa, viram percurso — e o
              gesto de rolar passa a AVANÇAR no processo em vez de descer nele.

              ⚠ Sem `pin` do ScrollTrigger: quem segura é o `sticky` do CSS, e
              o trigger só lê o progresso. Pin cria wrapper próprio e briga com
              a folha sobreposta desta página. */}
          <section className="ab-d-trilho" ref={trilho}>
            <div className="ab-d-trilho-palco">
              <div className="ab-d-trilho-cabeca">
                <p className="p-rotulo">Method</p>
                <p className="ab-d-metodo-lead p-manifesto">{PROCESSO_MANCHETE}</p>
              </div>
              <ol className="ab-d-fita" ref={fita}>
                {PROCESSO.map((e, i) => (
                  <li key={e.titulo}>
                    <span className="p-numero ab-d-fita-n">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="ab-d-fita-titulo">{e.titulo}</h3>
                    <p className="p-corpo">{e.corpo}</p>
                  </li>
                ))}
              </ol>
              {/* a régua diz quanto do percurso falta — sem ela, o trilho é um
                  corte de tela e a pessoa não sabe que está avançando */}
              <div className="ab-d-regua" aria-hidden="true">
                <span />
              </div>
            </div>
          </section>

          <section className="ab-d-valores" ref={valores}>
            <p className="p-rotulo">Engagements</p>
            <div className="ab-d-valores-lista p-sobe grid">
              {MODALIDADES.map((m) => (
                <article key={m.nome}>
                  {/* a imagem não ilustra: é a obra que PROVA o que a linha promete */}
                  <img className="ab-d-peca" src={pecaDe(m.nome).src} alt={pecaDe(m.nome).alt} loading="lazy" />
                  <h3 className="p-item">{m.nome}</h3>
                  <p className="ab-d-preco p-numero">
                    {m.precoDe ? `from $${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "On request"}
                  </p>
                  <p className="p-corpo">{m.para}</p>
                  <ul className="p-corpo ab-d-inclui">
                    {m.inclui.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <p className="p-marca">{m.prazo}</p>
                </article>
              ))}
            </div>
            <p className="p-marca ab-d-tools">Tools — {FERRAMENTAS.join(" · ")}</p>
          </section>
        </div>
      </div>
    </Prancha>
  );
}
