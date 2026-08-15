import { useMetaRota } from "../../hooks/useMetaRota";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3 } from "../v3-system";

/**
 * `/about` — o sobre na direção "portfólio como visor".
 *
 * Estrutura própria, não clone da home: manifesto como capa tipográfica,
 * leads em colunas defasadas, números em régua de quatro, e o PROCESSO como
 * bloco de tinta — a ficha em cinco etapas é o coração da página, porque é o
 * que ele vende (método, não só olho). Ferramentas fecham como linha de HUD.
 *
 * Todo texto vem do /about da réplica (medido do Framer publicado) — nada
 * inventado. Se o conteúdo mudar lá, mudar aqui: são duas apresentações do
 * MESMO material do cliente.
 */

const MANIFESTO =
  "I'm a multidisciplinary designer focused on visual identities, based in Brazil and working worldwide.";

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
    titulo: "Immersion",
    corpo:
      "I begin with a comprehensive deep dive into your business, understanding your value proposition, audience, competitors, long-term goals, and differentiators. This process establishes the strategic foundation that will guide all visual decisions.",
  },
  {
    titulo: "Positioning Analysis",
    corpo:
      "Based on the immersion, I identify the elements with the greatest potential for differentiation and relevance, ensuring that the visual identity is built on solid foundations and aligned with your business objectives.",
  },
  {
    titulo: "Visual Direction (Moodboard)",
    corpo:
      "I develop a reference board that explores possible aesthetic directions, translating concepts into visual language. This stage allows us to align expectations and clearly define the tone, personality, and level of expression of the brand.",
  },
  {
    titulo: "Visual Identity Creation",
    corpo:
      "With the strategic and visual context defined, I develop an exclusive, consistent, and professional visual identity. Every element is designed to strengthen brand perception, resonate with your audience, and ensure a solid, long-lasting presence in the market.",
  },
  {
    titulo: "File Delivery",
    corpo:
      "After final approval, I will organize and deliver all visual identity files in appropriate formats for both digital and print use, ensuring you have full autonomy and consistency in applying your brand across different contexts.",
  },
];

const FERRAMENTAS = ["Figma", "Nano Banana Pro", "Seedream", "GPT", "Photoshop", "Illustrator", "Jitter"];

const idx = (i: number) => `[${String(i + 1).padStart(2, "0")}]`;

export default function AboutV3() {
  useMetaRota();
  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      {/* capa tipográfica: o manifesto EM display, justificado, quase-tela */}
      <section className="flex min-h-[62svh] flex-col justify-end pb-14 pt-28 max-md:pb-10">
        <LinhaSecao rotulo="About" extra="Mateus Bredoff" />
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          <Display as="h1" immediate className="max-w-[24ch]">
            {MANIFESTO}
          </Display>
        </div>
      </section>

      {/* leads defasados: as duas metades da mesma ideia, uma por coluna */}
      <section className="py-20 max-md:py-12">
        <div className="grid grid-cols-12 gap-6" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-mono v3-justif col-span-4 max-lg:col-span-12">{LEAD[0]}</p>
          <p className="v3-mono v3-justif col-span-5 col-start-7 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            {LEAD[1]}
          </p>
        </div>

        <div
          className="mt-20 grid grid-cols-4 gap-6 border-t border-black/12 pt-6 max-md:mt-12 max-md:grid-cols-1 max-md:gap-4"
          style={{ marginInline: "var(--v3-margem)" }}
        >
          {NUMEROS.map((n, i) => (
            <div key={n.rotulo} className="flex items-baseline gap-3">
              <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span
                style={{
                  fontFamily: "'Geist', ui-sans-serif, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 2.4vw, 40px)",
                  letterSpacing: "-0.02em",
                }}
              >
                {n.valor}
              </span>
              <span className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
                {n.rotulo}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* o processo — bloco de TINTA, ficha em cinco etapas */}
      <section className="py-20 max-md:py-12" style={{ background: "var(--fr-petroleo)", color: "var(--fr-creme)" }}>
        <LinhaSecao rotulo="Process" extra="[05]" />
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          <Display className="max-w-[28ch]">{PROCESSO_MANCHETE}</Display>

          <ol className="mt-16 max-md:mt-10">
            {PROCESSO.map((e, i) => (
              <li
                key={e.titulo}
                className="grid grid-cols-12 gap-6 border-t border-white/15 py-8 max-md:gap-3 max-md:py-6"
              >
                <span className="v3-micro col-span-1 pt-2 max-md:col-span-2" style={{ color: "var(--v3-acento-tinta)" }}>
                  {idx(i)}
                </span>
                <h3
                  className="col-span-4 uppercase max-md:col-span-10"
                  style={{
                    fontFamily: "'Geist', ui-sans-serif, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 1.8vw, 28px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {e.titulo}
                </h3>
                <p
                  className="v3-mono v3-justif col-span-6 col-start-7 max-md:col-span-10 max-md:col-start-3"
                  style={{ color: "var(--fr-creme)", opacity: 0.92 }}
                >
                  {e.corpo}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ferramentas como linha de HUD — rótulos ■, sem pílula (raio zero) */}
      <section className="py-20 max-md:py-12">
        <LinhaSecao rotulo="Tools" extra={`[${String(FERRAMENTAS.length).padStart(2, "0")}]`} />
        <ul
          className="flex flex-wrap gap-x-10 gap-y-4 max-md:gap-x-6"
          style={{ paddingInline: "var(--v3-margem)" }}
        >
          {FERRAMENTAS.map((f) => (
            <li key={f} className="v3-rotulo v3-q">
              {f}
            </li>
          ))}
        </ul>
      </section>

      <RodapeV3 />
    </div>
  );
}
