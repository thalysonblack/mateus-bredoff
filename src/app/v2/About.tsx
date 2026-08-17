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

  return (
    <Prancha n="03" nome="About" superficie="papel" status="Available for projects">
      <div className="relative grid grid-cols-12 gap-x-6 gap-y-16 pt-16 max-md:pt-10">
        {/* ─ os números como espécimes ──────────────────────────────────
            Quatro linhas na mesma anatomia da folha de trabalhos: o dado no
            corpo grande, o rótulo miúdo ao lado. É a régua da casa aplicada a
            outro conteúdo — e é isso que faz um sistema, em vez de uma coleção
            de efeitos. */}
        <ul className="col-span-6 self-end max-lg:col-span-12">
          {NUMEROS.map((n, i) => (
            <li
              key={n.rotulo}
              className="p-especime-linha"
              style={{ ["--n" as string]: n.valor.length + 2 }}
            >
              <div className="flex items-baseline justify-between gap-6 py-4">
                <span className="p-especime">{n.valor}</span>
                <span className="p-marca pb-2 text-right">{n.rotulo}</span>
              </div>
            </li>
          ))}
          <li className="p-fio" />
        </ul>

        {/* ─ as fichas ──────────────────────────────────────────────────── */}
        <div className="col-span-5 col-start-8 grid gap-12 max-lg:col-span-12 max-lg:col-start-1">
          <Bloco rotulo="Biography">
            <div className="grid gap-4">
              {LEAD.map((p) => (
                <p key={p.slice(0, 24)} className="p-corpo max-w-[54ch]">
                  {p}
                </p>
              ))}
            </div>
          </Bloco>

          <Bloco rotulo="Tools">
            {/* lista corrida separada por vírgula, e não chips: chip é
                componente de interface, e aqui isto é uma FICHA — a mesma razão
                pela qual a nav também anda em vírgulas */}
            <p className="p-corpo max-w-[46ch]" style={{ color: "var(--p-quieto)" }}>
              {FERRAMENTAS.join(", ")}
            </p>
          </Bloco>

          <Bloco rotulo="Contact &amp; inquiries">
            <ul className="grid gap-[6px]">
              {CONTATO.map((c) => (
                <li key={c.label} className="p-corpo">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="p-link"
                    >
                      {c.label === "Email" ? c.valor : c.label}
                    </a>
                  ) : (
                    <span style={{ color: "var(--p-quieto)" }}>{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </Bloco>
        </div>
      </div>

      {/* ─ o método: a segunda tela da mesma prancha ─────────────────────
          Cinco etapas em fio, com índice — o formato de ficha técnica. Não é
          seção nova com fundo próprio: é a MESMA prancha continuando, que é o
          que diferencia rolar dentro de um documento de trocar de página. */}
      <section className="pt-32 max-md:pt-20">
        <div className="grid grid-cols-12 gap-x-6">
          <p className="p-rotulo col-span-2 max-lg:col-span-12">Method — 05</p>
          {/* mesma régua da home: sem manchete grande. O texto do método é
              leitura, e leitura aqui é 13px — o glifo é quem tem escala. */}
          <p className="p-corpo col-span-6 col-start-4 max-w-[54ch] max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-4">
            {PROCESSO_MANCHETE}
          </p>
        </div>

        <ol className="pt-20 max-md:pt-12">
          {PROCESSO.map((e, i) => (
            <li
              key={e.titulo}
              className="p-fio grid grid-cols-12 gap-x-6 gap-y-3 py-8 max-md:py-6"
            >
              <span className="p-marca col-span-1 pt-1 max-md:col-span-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="p-corpo col-span-3 max-md:col-span-10">{e.titulo}</h3>
              <p
                className="p-corpo col-span-7 col-start-6 max-w-[68ch] max-md:col-span-12 max-md:col-start-1"
                style={{ color: "var(--p-quieto)" }}
              >
                {e.corpo}
              </p>
            </li>
          ))}
          <li className="p-fio" />
        </ol>
      </section>
    </Prancha>
  );
}
