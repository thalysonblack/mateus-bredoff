import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";
import { CONTATO } from "../v3-system";

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

const LEAD = [
  "I am Mateus Bredoff, a multidisciplinary designer focused on visual identities. I am based in Brazil and work globally, collaborating with companies that understand the value of building a clear, relevant, and memorable presence.",
  "My approach begins with a deep understanding of the environment in which your company operates. I analyze business objectives, target audience, competitors, and market context, conducting a careful conceptual investigation that transforms strategy into visual expression. The result is a unique identity, built with intention, that emotionally connects your brand with its audience and positions it with clarity and differentiation within its sector.",
];

/* o primeiro é o numeral da prancha; os três seguintes viram ficha */
const NUMEROS = [
  { valor: "62+", rotulo: "Clients" },
  { valor: "100+", rotulo: "Awards & recognitions" },
  { valor: "56+", rotulo: "Products brought to market" },
  { valor: "46", rotulo: "Founding members" },
];

const PROCESSO_MANCHETE =
  "The project development follows a structured process across several stages, ensuring both strategic and aesthetic consistency.";

const PROCESSO = [
  {
    titulo: "Immersion",
    corpo:
      "I begin with a comprehensive deep dive into your business, understanding your value proposition, audience, competitors, long-term goals, and differentiators. This process establishes the strategic foundation that will guide all visual decisions.",
  },
  {
    titulo: "Positioning analysis",
    corpo:
      "Based on the immersion, I identify the elements with the greatest potential for differentiation and relevance, ensuring that the visual identity is built on solid foundations and aligned with your business objectives.",
  },
  {
    titulo: "Visual direction",
    corpo:
      "I develop a reference board that explores possible aesthetic directions, translating concepts into visual language. This stage allows us to align expectations and clearly define the tone, personality, and level of expression of the brand.",
  },
  {
    titulo: "Visual identity creation",
    corpo:
      "With the strategic and visual context defined, I develop an exclusive, consistent, and professional visual identity. Every element is designed to strengthen brand perception, resonate with your audience, and ensure a solid, long-lasting presence in the market.",
  },
  {
    titulo: "File delivery",
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

export default function AboutV2() {
  useMetaRota();
  /* a faixa das marcas: duas cópias fecham o loop do keyframe base (−50%) */
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="03" nome="About" superficie="papel" status="Available for projects">
      {/* ─ 1. QUEM É ────────────────────────────────────────────────────
          O manifesto manda, a ficha acompanha. A primeira montagem punha os
          quatro números em corpo de espécime e eles comiam quatro telas —
          "62+ clients" em 190px é um dado genérico ocupando o lugar do
          argumento. Aqui o argumento é a FRASE, e os números viram régua. */}
      <section className="grid grid-cols-12 pt-12 max-md:pt-8" style={{ columnGap: "var(--p-gap-x)" }}>
        <p className="p-manifesto col-span-7 max-lg:col-span-12">{LEAD[0]}</p>

        <div className="col-span-4 col-start-9 grid gap-9 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-10">
          <Bloco rotulo="Approach">
            <p className="p-corpo max-w-[46ch]">{LEAD[1]}</p>
          </Bloco>
          <Bloco rotulo="Tools">
            <p className="p-corpo" style={{ color: "var(--p-quieto)" }}>
              {FERRAMENTAS.join(", ")}
            </p>
          </Bloco>
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

      {/* ─ 2. A RÉGUA DA TRAJETÓRIA ──────────────────────────────────────
          Os quatro números numa linha só, com fio: é a tabela de registros do
          sistema, não quatro manchetes. Dado se lê comparando — em coluna, cada
          um vira um cartaz isolado e a comparação se perde. */}
      <section className="p-fio mt-14 grid grid-cols-4 max-md:grid-cols-2" style={{ columnGap: "var(--p-gap-x)" }}>
        {NUMEROS.map((n) => (
          <div key={n.rotulo} className="pt-4">
            <p className="p-numero">{n.valor}</p>
            <p className="p-marca pt-1" style={{ color: "var(--p-quieto)" }}>
              {n.rotulo}
            </p>
          </div>
        ))}
      </section>

      {/* ─ 3. AS MARCAS, EM SANGRIA ──────────────────────────────────────
          ⭐ Faltava O TRABALHO. Uma about de brand designer sem uma marca dele
          na tela é um currículo — e a peça mais forte deste projeto são os
          nomes que ele desenhou. A faixa é a trama da home em escala de
          passagem, cada nome na SUA cor: amarra as duas páginas pelo mesmo
          gesto e transforma o vão entre "quem é" e "como trabalha" em matéria.
          Sem hover aqui: conteúdo que se move sob cursor parado erra o
          hit-test, e esta faixa é passagem, não índice. */}
      <section aria-hidden="true" className="p-trama p-faixa -mx-[var(--p-margem)] my-16">
        <div className="p-trama-fita p-faixa-fita">
          {fita.map((w, k) => (
            <span key={`${w.slug}-${k}`} className="flex items-baseline gap-[0.3em]">
              <span className="p-faixa-nome" style={{ color: corDe(w.slug) }}>
                {w.title}
              </span>
              <span className="p-faixa-ponto">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ─ 4. O MÉTODO ───────────────────────────────────────────────────
          As cinco etapas na anatomia da tabela da /work: índice, título, corpo.
          É a mesma régua aplicada a outro conteúdo, que é o que faz um sistema
          em vez de uma coleção de páginas. */}
      <section className="grid grid-cols-12 pb-4" style={{ columnGap: "var(--p-gap-x)" }}>
        <p className="p-rotulo col-span-12 pb-4">Method — {String(PROCESSO.length).padStart(2, "0")}</p>
        <p className="p-corpo col-span-5 max-w-[46ch] pb-10 max-lg:col-span-12">{PROCESSO_MANCHETE}</p>

        <ul className="col-span-12">
          {PROCESSO.map((e, i) => (
            <li
              key={e.titulo}
              className="p-fio grid items-baseline py-5 max-md:grid-cols-1"
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
