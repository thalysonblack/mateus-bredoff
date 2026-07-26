import { Mono, Rule, SectionHead, Bracket } from "../../system";

/**
 * Capabilities V2 — faixas largas com campo de tags (direção REBOOT/Setters).
 *
 * A home atual apresenta as disciplinas como pilha de linhas: índice à esquerda,
 * nome em display, nada mais. Funciona e não diz nada — o visitante lê "Branding"
 * e segue sem saber o que isso inclui.
 *
 * A referência resolve com a faixa que atravessa a página: título grande à
 * esquerda, um campo de TAGS listando o que entra, uma frase de contexto, e a
 * ação ancorada à direita. É a mesma estrutura do Pricing da versão anterior, o
 * que aqui é vantagem: as duas seções comerciais passam a falar a mesma língua.
 *
 * Da referência não se copia a pílula arredondada — tag é retângulo de fio,
 * porque raio zero é lei do sistema.
 *
 * ⚠ O texto de cada disciplina descreve o SERVIÇO, não o cliente, e foi escrito
 * a partir do que as próprias peças do portfólio mostram. Se o Mateus quiser
 * outra palavra, é conteúdo dele — trocar aqui é uma linha.
 */

type Capability = {
  name: string;
  tags: string[];
  note: string;
};

const CAPABILITIES: Capability[] = [
  {
    name: "Branding",
    tags: ["Logotype", "Visual system", "Guidelines", "Brand architecture"],
    note: "The identity itself — mark, palette, type and the rules that keep it standing when other people take over.",
  },
  {
    name: "Art Direction",
    tags: ["Photography", "Styling", "Campaign", "Set design"],
    note: "Deciding what the image says before deciding how it looks, and holding that decision across every frame.",
  },
  {
    name: "Creative Direction",
    tags: ["Concept", "Narrative", "Team", "Rollout"],
    note: "The direction above the artefacts: what the brand is claiming, and in which order it should be shown.",
  },
  {
    name: "Digital Design",
    tags: ["Interface", "Website", "Motion", "Design system"],
    note: "The identity where it moves and responds — screens that behave like the brand, not just look like it.",
  },
  {
    name: "Brand Strategy",
    tags: ["Positioning", "Naming", "Verbal identity", "Research"],
    note: "The argument underneath the design, so the visual choices have something to answer to.",
  },
];

export default function CapabilitiesV2() {
  return (
    <section className="on-ink w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Capabilities" right={`[${CAPABILITIES.length}] Disciplines`} />

        <div>
          {CAPABILITIES.map((c, i) => (
            <div key={c.name} className="group">
              <Rule />
              <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-[clamp(1rem,2vw,1.5rem)] py-[clamp(1.75rem,3.5vw,3rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto]">
                <div className="flex items-baseline gap-[clamp(1rem,2vw,2rem)]">
                  <Mono dim className="idx-acc shrink-0">
                    {String(i + 1).padStart(3, "0")}
                  </Mono>
                  <h3
                    className="t-display transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.1em] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    style={{ fontSize: "clamp(1.6rem,3.4vw,58px)" }}
                  >
                    {c.name}
                  </h3>
                </div>

                <div>
                  <div className="flex flex-wrap gap-[0.4rem]">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-[0.7em] py-[0.45em] leading-none"
                        style={{ border: "1px solid var(--rule)" }}
                      >
                        <Mono dim>{t}</Mono>
                      </span>
                    ))}
                  </div>
                  <p className="t-body max-w-[48ch] pt-[clamp(0.875rem,1.6vw,1.25rem)]">{c.note}</p>
                </div>

                <div className="md:text-right">
                  <a href="#contact" className="link-quiet" aria-label={`Solicitar — ${c.name}`}>
                    <Bracket>ENQUIRE</Bracket>
                  </a>
                </div>
              </div>
            </div>
          ))}
          <Rule />
        </div>
      </div>
    </section>
  );
}
