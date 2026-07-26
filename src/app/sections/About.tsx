import { motion } from "motion/react";
import { useReveal } from "../../hooks/useReveal";
import { Mono, Rule, SectionHead, reveal, idx } from "../system";

/**
 * About — a frase-manifesto em caixa alta gigante, seguida do texto de
 * apresentação como UM bloco pareado.
 *
 * Os parágrafos já foram registros de tabela (índice + título + corpo + fio
 * entre eles) e não funcionou: com o corpo travado em 54ch, sobrava um `1fr`
 * vazio ocupando ~40% da largura, e o fio no meio lia os dois parágrafos como
 * dois itens sem relação — quando eles são as duas metades de uma mesma ideia
 * (como eu trabalho / no que dá).
 *
 * Agora é um bloco só: as duas colunas dividem a largura útil e são lidas em
 * paralelo, com os rótulos como marginália mono acima de cada uma. O fio
 * sobrevive apenas abrindo e fechando o bloco — ele emoldura o conjunto em vez
 * de fatiar o miolo.
 */

const RECORDS = [
  {
    title: "Approach",
    body: "My approach begins with a deep understanding of the universe in which your company operates. I analyze your business goals, your audience, your competitors, and conduct careful conceptual research to transform strategy into visual expression.",
  },
  {
    title: "Result",
    body: "The result is exclusive work that combines strategic thinking with refined graphic aesthetics, designed to position brands in a clear, relevant, and memorable way.",
  },
];

export default function About() {
  const manifestoRef = useReveal<HTMLParagraphElement>();

  return (
    <section id="about" className="on-paper w-full">
      <div className="bleed pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="About" right="Statement" />

        {/* Manifesto — o tipo enche a largura, alinhado à esquerda, bandeira à
            direita. Reveal por máscara de linha (não fade): as linhas sobem por
            trás do corte, que é o gesto-base de cópia do sistema.
            `lineHeight` sai do inline e passa a herdar o 0.86 de .t-display —
            o 0.98 que estava aqui furava a escala do sistema. */}
        <p
          ref={manifestoRef}
          data-reveal
          className="t-display t-display-xl pb-[clamp(3rem,7vw,7rem)]"
          style={{ fontSize: "clamp(1.75rem, 5.15vw, 92px)" }}
        >
          I&rsquo;m a multidisciplinary designer focused on visual identities, based in Brazil and
          working worldwide.
        </p>

        {/*
          Texto CORRIDO, não duas colunas de grade.

          Terceira tentativa nesta seção, e as duas primeiras erraram pelo mesmo
          motivo: tratar os dois parágrafos como itens. Registros de tabela
          separados por fio leram como coisas sem relação; grade de duas colunas
          resolveu o fio mas manteve dois blocos com um vão no meio.

          Aqui é `columns` do CSS: um único bloco de texto que TRANSBORDA de uma
          coluna para a outra, como corpo de jornal. O olho lê uma coisa só — e o
          rótulo vira lead-in na primeira linha do parágrafo, em vez de
          cabeçalho de coluna. É por isso que não há `<div>` por registro.
        */}
        <Rule />
        <motion.div {...reveal} className="about-grid py-[clamp(2rem,4vw,3.5rem)]">
          {/* Coluna 1 — só o rótulo, como marginália */}
          <Mono dim>About me</Mono>

          {/* Colunas 2 e 3 — o texto, em medida curta. O corpo é `dim`: neste
              bloco ele é leitura de apoio, não a voz principal da seção (a
              manchete acima é que carrega o peso). */}
          {RECORDS.map((r) => (
            <p key={r.title} className="t-body dim">
              {r.body}
            </p>
          ))}

          {/* Coluna 4 fica vazia de propósito: o ar à direita é o que faz o
              bloco ler como marginália em vez de coluna de jornal. */}
        </motion.div>
        <Rule />
      </div>
    </section>
  );
}
