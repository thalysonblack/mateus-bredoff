import { useEffect } from "react";
import RodapeFramer from "../sections/framer/RodapeFramer";
import { useRevelacaoPalavra } from "../sections/framer/useRevelacaoPalavra";
import retrato1600 from "../../assets/optimized/hero-portrait-1600.webp";
import retrato3200 from "../../assets/optimized/hero-portrait-3200.webp";

/**
 * `/about` — 5435px medidos, cinco blocos, e uma ideia de composição só:
 * **rótulo de 12px numa coluna fixa de 400px à esquerda, conteúdo à direita.**
 *
 * A coluna do rótulo é FIXA, não fracionária: o conteúdo começa em x=424 tanto
 * em 1600px quanto em 1200px. Se fosse `25%`, andaria — e o que denuncia uma
 * réplica é exatamente esse tipo de deriva.
 *
 * O hero é a única faixa clara da página: 100vh de retrato em sangria com a
 * frase-manifesto por cima. Do fim do hero até o rodapé é tudo petróleo.
 *
 * ⚠ Textos, números e ferramentas são do cliente, transcritos do publicado.
 * `62+ clients`, `100+ awards`, `46 founding members` são alegações dele; a
 * réplica não as audita, mas estão no relatório porque a `/about` afirma
 * "based in Brazil" enquanto o perfil do Behance o lista na Alemanha.
 */

/* As três linhas são QUEBRA MANUAL, não resultado da largura: medidas no
   original, a linha 1 ocupa 717px numa caixa de 1529 — sobra espaço para mais
   uma palavra que o original não usa. Deixar a quebra automática resolver dá
   três linhas diferentes e desmancha a composição centrada. */
const MANIFESTO_LINHAS = [
  "I’m a multidisciplinary",
  "designer focused on visual identities, based in",
  "Brazil and working worldwide.",
];
const MANIFESTO = MANIFESTO_LINHAS.join(" ");

const LEAD = [
  "I am Mateus Bredoff, a multidisciplinary designer focused on visual identities. I am based in Brazil and work globally, collaborating with companies that understand the value of building a clear, relevant, and memorable presence.",
  "My approach begins with a deep understanding of the environment in which your company operates. I analyze business objectives, target audience, competitors, and market context, conducting a careful conceptual investigation that transforms strategy into visual expression. The result is a unique identity, built with intention, that emotionally connects your brand with its audience and positions it with clarity and differentiation within its sector.",
];

const NUMEROS = [
  { valor: "62+", rotulo: "Clients" },
  { valor: "100+", rotulo: "Awards & Recognitions" },
  { valor: "56+", rotulo: "Products brought to market" },
  { valor: "46", rotulo: "Founding Members" },
];

const PROCESSO_MANCHETE =
  "The project development follows a structured process across several stages, ensuring both strategic and aesthetic consistency.";

const PROCESSO = [
  {
    i: "01",
    titulo: "Immersion",
    corpo:
      "I begin with a comprehensive deep dive into your business, understanding your value proposition, audience, competitors, long-term goals, and differentiators. This process establishes the strategic foundation that will guide all visual decisions.",
  },
  {
    i: "02",
    titulo: "Positioning Analysis",
    corpo:
      "Based on the immersion, I identify the elements with the greatest potential for differentiation and relevance, ensuring that the visual identity is built on solid foundations and aligned with your business objectives.",
  },
  {
    i: "03",
    titulo: "Visual Direction (Moodboard)",
    corpo:
      "I develop a reference board that explores possible aesthetic directions, translating concepts into visual language. This stage allows us to align expectations and clearly define the tone, personality, and level of expression of the brand.",
  },
  {
    i: "04",
    titulo: "Visual Identity Creation",
    corpo:
      "With the strategic and visual context defined, I develop an exclusive, consistent, and professional visual identity. Every element is designed to strengthen brand perception, resonate with your audience, and ensure a solid, long-lasting presence in the market.",
  },
  {
    i: "05",
    titulo: "File Delivery",
    corpo:
      "After final approval, I will organize and deliver all visual identity files in appropriate formats for both digital and print use, ensuring you have full autonomy and consistency in applying your brand across different contexts.",
  },
];

const FERRAMENTAS = [
  "Figma",
  "Nano Banana Pro",
  "Seedream",
  "GPT",
  "Photoshop",
  "Illustrator",
  "Jitter",
];

/** Bloco de conteúdo: rótulo na coluna fixa de 400px, conteúdo no resto. */
function Bloco({
  rotulo,
  fio = true,
  children,
}: {
  rotulo: string;
  fio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid grid-cols-1 gap-y-6 lg:grid-cols-[var(--fr-rotulo-col)_minmax(0,1fr)]"
      style={{ paddingInline: "var(--fr-margem)" }}
    >
      <p className={`fr-secao-rotulo text-[var(--fr-cinza)] ${fio ? "border-t border-white/12 pt-[33px]" : ""}`}>
        {rotulo}
      </p>
      <div className={fio ? "border-t border-white/12 pt-[33px] max-lg:border-t-0 max-lg:pt-0" : ""}>
        {children}
      </div>
    </section>
  );
}

export default function About() {
  useEffect(() => {
    const anterior = document.title;
    document.title = "Mateus Bredoff";
    return () => {
      document.title = anterior;
    };
  }, []);

  /* Dois blocos revelam palavra a palavra. O manifesto do hero apaga em cinza e
     acende em branco (ele vive sob `exclusion`, então "branco" é o valor ANTES
     da inversão); o lead apaga em cinza e acende em creme. */
  const manifestoRef = useRevelacaoPalavra<HTMLParagraphElement>("#808080", "#ffffff");
  const lead1Ref = useRevelacaoPalavra<HTMLParagraphElement>("#808080", "#ede6e1");
  const lead2Ref = useRevelacaoPalavra<HTMLParagraphElement>("#808080", "#ede6e1");

  return (
    <div className="fr">
      {/* --- hero: a única faixa clara da página ----------------------------
          A imagem é `absolute inset-0` e o texto vem depois no fluxo, sem
          transform/opacity/filter em nenhum ancestral — é o que mantém o
          `exclusion` vivo. Envolver isto num wrapper animado apaga a frase. */}
      <section className="relative h-svh w-full overflow-hidden">
        <img
          src={retrato1600}
          srcSet={`${retrato1600} 1600w, ${retrato3200} 3200w`}
          sizes="100vw"
          alt="Retrato de Mateus Bredoff"
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <p
          ref={manifestoRef}
          /* Entrelinha MENOR que o corpo (56,96 num corpo de 64): as três linhas
             se tocam de propósito e formam um bloco. Não é erro de medição. */
          /* Ancorado por `bottom`, não por `items-end` de flex: no flex a caixa
             desta frase — entrelinha menor que o corpo — vazava 57px (uma linha
             inteira) para fora da seção e o `overflow-hidden` comia a última
             linha. `absolute` sem z-index não cria stacking context, então o
             `exclusion` continua vivo. */
          className="text-white mix-blend-exclusion absolute inset-x-0 bottom-0 text-center uppercase"
          style={{
            fontSize: "var(--fr-case-titulo)",
            lineHeight: "0.89em",
            letterSpacing: "-0.03em",
            paddingInline: "var(--fr-margem)",
            paddingBottom: "26px",
          }}
          aria-label={MANIFESTO}
        >
          {MANIFESTO_LINHAS.map((linha, i) => (
            <span key={linha}>
              {i > 0 ? <br /> : null}
              {linha}
            </span>
          ))}
        </p>
      </section>

      {/* --- daqui ao rodapé, tudo petróleo -------------------------------- */}
      {/* 280px: o rótulo do lead fica em y=1280 e o hero acaba em 1000. O valor
          NÃO compensa a barra de metadados do Layout, que hoje ocupa 57px no
          fluxo e empurra a página inteira — no original ela é sobreposta. Somar
          a compensação aqui deixaria a página certa por engano e errada no dia
          em que a barra virar overlay. */}
      <div className="fr-tinta w-full pt-[280px]">
        <Bloco rotulo="About me" fio={false}>
          <div className="flex flex-col gap-[var(--fr-lead-lh)] lg:max-w-[1024px]">
            <p ref={lead1Ref} className="fr-lead">
              {LEAD[0]}
            </p>
            <p ref={lead2Ref} className="fr-lead">
              {LEAD[1]}
            </p>
          </div>
        </Bloco>

        {/* Estatísticas: 4 colunas iguais com calha de 14px — medido exato nas
            duas larguras ((1552 − 3×14) / 4 = 377,5 em 1600). O fio é POR
            COLUNA, não uma régua contínua: ele quebra na calha.

            No MOBILE viram uma coluna só, não duas: medido, os quatro números
            saem todos em x=12 com passo de 181px. Duas colunas encurtavam o
            bloco e comprimiam a página inteira abaixo dele. */}
        <section
          className="grid grid-cols-1 gap-x-[14px] gap-y-[26px] pt-[101px] lg:grid-cols-4 lg:pt-[47px] lg:gap-y-10"
          style={{ paddingInline: "var(--fr-margem)" }}
        >
          {NUMEROS.map((n, i) => (
            <div key={n.rotulo}>
              <p className="fr-secao-rotulo text-[var(--fr-cinza)]">{i === 0 ? "About me" : "​"}</p>
              <div className="mt-[23px] border-t border-white/12 pt-[16px]">
                <p className="fr-numero">{n.valor}</p>
                <p className="fr-numero-rotulo text-[var(--fr-cinza)] pt-[15px]">{n.rotulo}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="pt-[31px] lg:pt-[147px]">
          <Bloco rotulo="About me">
            <h2 className="fr-manchete">{PROCESSO_MANCHETE}</h2>

            <ol className="pt-[65px]">
              {PROCESSO.map((p) => (
                <li
                  key={p.i}
                  /* O recuo do texto EXISTE no mobile, só é menor: 74px contra 210 no
                     desktop. Colapsar para uma coluna só alinhava o texto com o
                     índice, o que o original não faz. */
                  className="grid grid-cols-[74px_minmax(0,1fr)] gap-y-3 border-t border-white/12 pt-[30px] pb-[66px] lg:grid-cols-[210px_minmax(0,542px)]"
                >
                  <span className="fr-indice">{p.i}</span>
                  <div>
                    <h3 className="fr-etapa-titulo">{p.titulo}</h3>
                    <p className="fr-etapa text-[var(--fr-cinza)] pt-[10px]">{p.corpo}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Bloco>
        </div>

        <div className="pt-[79px] pb-[120px]">
          <Bloco rotulo="Capabilities">
            {/* Mesma escala da lista de disciplinas da home (64/76.8/−1.28), que
                já é o `.fr-display-solto` de framer.css. Largura travada em
                600px: medida igual em 1600 e em 1200. */}
            <ul className="flex flex-col gap-[4px] lg:max-w-[600px]">
              {FERRAMENTAS.map((f) => (
                <li key={f} className="fr-display-solto">
                  {f}
                </li>
              ))}
            </ul>
          </Bloco>
        </div>
      </div>

      <RodapeFramer />
    </div>
  );
}
