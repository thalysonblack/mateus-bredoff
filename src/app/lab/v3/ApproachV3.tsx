import { Mono, Rule, SectionHead } from "../../system";

/**
 * Approach — o método como seção própria.
 *
 * Isto não é estilo emprestado, é INFORMAÇÃO que já existia e estava enterrada:
 * o texto "my approach begins with a deep understanding…" vivia como parágrafo
 * de apoio dentro da About, onde ninguém para para ler. Estúdios que vendem
 * projeto tratam o método como seção — é o que responde "como isso vai
 * funcionar?", a pergunta que aparece logo depois de "quanto custa?".
 *
 * A estrutura é a de etapas numeradas, e o texto de cada passo foi derivado do
 * que ele mesmo escreveu na About. É desdobramento de conteúdo existente, não
 * invenção — mas é conteúdo do cliente, então precisa do aval dele antes de ir
 * ao ar.
 */

type Step = {
  name: string;
  detail: string;
  output: string;
};

const STEPS: Step[] = [
  {
    name: "Understanding",
    detail:
      "Business goals, audience and competitors on the table before any visual decision — the universe the company operates in comes first.",
    output: "Brief · Research",
  },
  {
    name: "Concept",
    detail:
      "Careful conceptual research that turns strategy into visual expression, so the idea exists before the artwork does.",
    output: "Direction · Territory",
  },
  {
    name: "System",
    detail:
      "The identity built as a system: mark, palette, type and the rules that hold when other people take over.",
    output: "Identity · Guidelines",
  },
  {
    name: "Handoff",
    detail:
      "Applications, files and the documentation the team needs to keep the brand consistent without asking.",
    output: "Files · Support",
  },
];

export default function ApproachV3() {
  return (
    <section id="approach" className="on-paper w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Approach" right={`[${STEPS.length}] Steps`} />

        <div className="grid grid-cols-1 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.name}
              className="flex flex-col"
              /* Fio à esquerda em vez de embaixo: no desktop as etapas correm na
                 horizontal, e o fio horizontal cortaria a leitura da sequência.
                 No mobile ele volta a ser horizontal, porque ali a sequência
                 desce. */
              style={{ borderTop: "1px solid var(--rule)" }}
            >
              <div className="flex items-baseline justify-between gap-3 py-3 md:pr-[clamp(0.75rem,1.5vw,1.5rem)]">
                <Mono dim className="idx-acc">
                  {String(i + 1).padStart(2, "0")}
                </Mono>
                <Mono dim>{s.output}</Mono>
              </div>

              <h3
                className="t-display md:pr-[clamp(0.75rem,1.5vw,1.5rem)]"
                style={{ fontSize: "clamp(1.35rem,2.1vw,34px)" }}
              >
                {s.name}
              </h3>

              <p className="t-body pb-[clamp(1.5rem,3vw,2.5rem)] pt-3 md:pr-[clamp(1rem,2vw,2rem)]">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
        <Rule />
      </div>
    </section>
  );
}
