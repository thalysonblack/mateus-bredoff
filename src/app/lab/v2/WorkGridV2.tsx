import { Link } from "react-router";
import { Mono, SectionHead } from "../../system";
import { WORK } from "../../../content/work";

/**
 * Work V2 — grade modular numerada (direção Norgram).
 *
 * A home atual apresenta o trabalho como índice escalonado, tipo contact sheet.
 * Aqui é o oposto: uma malha rígida de células separadas por fio de 1px, cada
 * uma com o numeral gigante em marca d'água, ano, título, disciplina e a peça.
 * A referência trata o portfólio como página de jornal — a estrutura é a mesma
 * para todos os itens, e o que varia é só a imagem.
 *
 * A troca de partido não é gratuita: o escalonado é mais elegante e o modular é
 * mais LEGÍVEL como catálogo. Com sete itens e mais chegando, a malha escala sem
 * precisar recalcular offset de coluna.
 *
 * Lê a mesma coleção de `content/work.ts` que a home e as páginas de case — se o
 * partido for aprovado, nada de conteúdo muda.
 */
export default function WorkGridV2() {
  return (
    <section id="work" className="on-paper w-full">
      <div className="bleed pt-[clamp(2.5rem,5vw,5rem)]">
        <SectionHead left="Selected Work" right={`[${WORK.length}] Projects`} />
      </div>

      {/* A malha sangra de borda a borda: o fio da grade tem que encostar na
          margem da tela, senão a estrutura lê como tabela flutuando. */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        {WORK.map((w, i) => (
          <Link
            key={w.slug}
            to={`/work/${w.slug}`}
            className="group relative flex flex-col justify-between overflow-hidden"
            style={{
              borderRight: "1px solid var(--rule)",
              borderBottom: "1px solid var(--rule)",
              minHeight: "clamp(22rem,34vw,30rem)",
            }}
          >
            {/* Numeral em marca d'água — participa da composição, não da leitura */}
            <span
              aria-hidden="true"
              className="t-display pointer-events-none absolute select-none"
              style={{
                fontSize: "clamp(6rem,11vw,13rem)",
                lineHeight: 0.78,
                right: "-0.04em",
                top: "-0.1em",
                opacity: 0.08,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative p-[clamp(1rem,1.8vw,1.5rem)]">
              <Mono dim>{w.year}</Mono>
              <h3 className="t-display pt-2" style={{ fontSize: "clamp(1.2rem,2vw,32px)" }}>
                {w.title}
              </h3>
              <div className="pt-1">
                <Mono dim>{w.disciplines.join(" / ")}</Mono>
              </div>
            </div>

            {/* A peça ocupa o pé da célula em faixa: a altura é igual em todas as
                células, então a proporção nativa não caberia — `cover` recorta,
                que é aceitável para miniatura de índice (a página do case mostra
                a arte inteira). */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
              <img
                src={w.cover.src}
                srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={w.cover.alt}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </Link>
        ))}

        {/* Célula final: fecha a malha e leva ao índice completo. Sem ela, a
            última linha fica com buraco quando a contagem não é múltipla de 3. */}
        <Link
          to="/work"
          className="group flex flex-col justify-between p-[clamp(1rem,1.8vw,1.5rem)]"
          style={{
            borderRight: "1px solid var(--rule)",
            borderBottom: "1px solid var(--rule)",
            minHeight: "clamp(22rem,34vw,30rem)",
          }}
        >
          <Mono dim>Index</Mono>
          <span
            className="t-display transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.1em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            style={{ fontSize: "clamp(1.4rem,2.6vw,44px)" }}
          >
            View all
            <br />
            projects
          </span>
          <Mono className="acc">→</Mono>
        </Link>
      </div>
    </section>
  );
}
