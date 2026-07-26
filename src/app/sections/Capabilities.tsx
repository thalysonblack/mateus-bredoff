import { useState } from "react";
import { motion } from "motion/react";
import { Mono, Rule, SectionHead, Bracket, reveal } from "../system";
import imgEditorial from "../../assets/optimized/capabilities-editorial-800.webp";
import artBureau from "../../assets/optimized/art-bureau-1400.webp";
import artStag from "../../assets/optimized/art-stag-1400.webp";
import artAlexArcher from "../../assets/optimized/art-alexarcher-1400.webp";
import artNeox from "../../assets/optimized/art-neox-1400.webp";
import artVotare from "../../assets/optimized/art-votare-1400.webp";

/**
 * Capabilities — lista com painel.
 *
 * Terceira forma da seção, e cada uma corrigiu um defeito da anterior:
 *  1. pilha de nomes em display e nada mais → o visitante lia "Branding" e
 *     seguia sem saber o que aquilo inclui;
 *  2. faixa larga com tags e frase por linha → informava, mas repetia a
 *     estrutura do Pricing logo abaixo, e duas seções seguidas com o mesmo
 *     desenho leem como uma só;
 *  3. **lista + painel** → a lista respira como índice e o detalhe da
 *     disciplina percorrida aparece ao lado, sem empilhar cinco parágrafos.
 *
 * O gesto vem da variante W2 do laboratório do Work, que ele aprovou para cá.
 *
 * O painel mostra a PEÇA que exemplifica a disciplina, mais tags e a frase. A
 * primeira versão trouxe só texto — eu tinha receio de repetir as artes do
 * Selected Work na mesma página, e faltou a foto. A diferença em relação ao
 * carrossel que foi cortado: lá a faixa REPETIA o índice inteiro logo acima
 * dele; aqui é uma peça por disciplina, legendada com o projeto de origem, no
 * papel de evidência — não de vitrine.
 *
 * ⚠ No mobile não existe hover: a lista se abre empilhada, com o detalhe embaixo
 * do próprio nome. Painel dependente de cursor viraria conteúdo inalcançável no
 * toque.
 *
 * ⚠ O texto de cada disciplina descreve o SERVIÇO, não o cliente, e foi escrito a
 * partir do que as próprias peças do portfólio mostram. Se o Mateus quiser outra
 * palavra, é conteúdo dele — trocar aqui é uma linha.
 */

type Capability = {
  name: string;
  tags: string[];
  note: string;
  /** Peça do portfólio que EXEMPLIFICA a disciplina, com proporção medida. */
  art: { src: string; w: number; h: number; from: string };
};

const CAPABILITIES: Capability[] = [
  {
    name: "Branding",
    tags: ["Logotype", "Visual system", "Guidelines", "Brand architecture"],
    note: "The identity itself — mark, palette, type and the rules that keep it standing when other people take over.",
    art: { src: artBureau, w: 2800, h: 1575, from: "Bureau" },
  },
  {
    name: "Art Direction",
    tags: ["Photography", "Styling", "Campaign", "Set design"],
    note: "Deciding what the image says before deciding how it looks, and holding that decision across every frame.",
    art: { src: artStag, w: 2800, h: 2253, from: "Stag Grid" },
  },
  {
    name: "Creative Direction",
    tags: ["Concept", "Narrative", "Team", "Rollout"],
    note: "The direction above the artefacts: what the brand is claiming, and in which order it should be shown.",
    art: { src: artAlexArcher, w: 2800, h: 2255, from: "Alex Archer" },
  },
  {
    name: "Digital Design",
    tags: ["Interface", "Website", "Motion", "Design system"],
    note: "The identity where it moves and responds — screens that behave like the brand, not just look like it.",
    art: { src: artNeox, w: 1920, h: 2280, from: "Neox" },
  },
  {
    name: "Brand Strategy",
    tags: ["Positioning", "Naming", "Verbal identity", "Research"],
    note: "The argument underneath the design, so the visual choices have something to answer to.",
    art: { src: artVotare, w: 2800, h: 2100, from: "Votare" },
  },
];

/**
 * Tag é retângulo de fio, nunca pílula: raio zero é lei do sistema.
 *
 * A ARTE vem primeiro. O painel já foi só texto e faltava a peça — a disciplina
 * se prova mostrando o trabalho, não descrevendo o serviço. A legenda nomeia o
 * projeto de onde a peça saiu, para a imagem não virar ilustração genérica.
 */
function Detail({ item }: { item: Capability }) {
  return (
    <>
      <figure className="pb-[clamp(1rem,2vw,1.5rem)]">
        <div className="w-full overflow-hidden" style={{ aspectRatio: `${item.art.w} / ${item.art.h}` }}>
          <img
            key={item.art.src}
            src={item.art.src}
            sizes="(min-width: 768px) 40vw, 100vw"
            alt={`${item.name} — ${item.art.from}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="flex items-baseline justify-between gap-4 pt-2">
          <Mono dim>{item.art.from}</Mono>
          <Mono dim>{item.name}</Mono>
        </figcaption>
      </figure>

      <div className="flex flex-wrap gap-[0.4rem]">
        {item.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center px-[0.7em] py-[0.45em] leading-none"
            style={{ border: "1px solid var(--rule)" }}
          >
            <Mono dim>{t}</Mono>
          </span>
        ))}
      </div>
      <p className="t-body max-w-[42ch] pt-[clamp(1rem,2vw,1.5rem)]">{item.note}</p>
    </>
  );
}

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const item = CAPABILITIES[active];

  return (
    <section className="on-ink w-full">
      <div className="bleed pb-[clamp(3rem,7vw,7rem)] pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Capabilities" right={`[${CAPABILITIES.length}] Disciplines`} />

        <div className="grid grid-cols-1 gap-[clamp(1.5rem,4vw,4rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            {CAPABILITIES.map((c, i) => {
              const isActive = i === active;
              return (
                <div key={c.name}>
                  <Rule />
                  <a
                    href="#contact"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-baseline justify-between gap-6 py-[clamp(0.875rem,2vw,1.5rem)]"
                    aria-label={`${c.name} — solicitar orçamento`}
                  >
                    <span className="flex items-baseline gap-[clamp(0.75rem,2vw,2rem)]">
                      <Mono dim className={isActive ? "acc" : ""}>
                        {String(i + 1).padStart(3, "0")}
                      </Mono>
                      <span
                        className="t-display transition-[opacity,transform] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                        style={{
                          fontSize: "clamp(1.5rem,3.6vw,62px)",
                          /* o inativo recua em OPACIDADE, não em cor: manter a
                             mesma tinta preserva a mancha tipográfica da lista */
                          opacity: isActive ? 1 : 0.45,
                          transform: isActive ? "translateX(0.1em)" : "none",
                        }}
                      >
                        {c.name}
                      </span>
                    </span>
                    <Mono
                      dim
                      className="hidden shrink-0 opacity-0 transition-opacity duration-500 group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none sm:block"
                    >
                      [ Enquire ]
                    </Mono>
                  </a>

                  {/* Detalhe empilhado — só no mobile, onde não há painel */}
                  <div className="pb-[clamp(1rem,2vw,1.5rem)] md:hidden">
                    <Detail item={c} />
                  </div>
                </div>
              );
            })}
            <Rule />
          </div>

          {/* Painel com o detalhe da disciplina percorrida */}
          <div className="hidden md:block">
            <div className="sticky top-[22vh]">
              <div className="pb-[clamp(0.75rem,1.5vw,1.25rem)]">
                <Mono dim>{`What ${item.name.toLowerCase()} includes`}</Mono>
              </div>
              <Detail item={item} />
              <div className="pt-[clamp(1.5rem,3vw,2.5rem)]">
                <a href="#contact" className="link-quiet">
                  <Bracket>START THE PROJECT</Bracket>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Chapa em faixa larga: fecha a seção em imagem em vez de em vazio. É a
            única arte daqui e não pertence a nenhum case do índice. */}
        <motion.figure {...reveal} className="mt-[clamp(2.5rem,5vw,4.5rem)] w-full">
          <div
            className="w-full overflow-hidden"
            style={{ aspectRatio: "21 / 8", background: "rgba(237,230,225,0.06)" }}
          >
            <img
              src={imgEditorial}
              alt="Editorial de identidade visual"
              width={800}
              height={534}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 42%" }}
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 pt-2">
            <Mono dim>Plate 001</Mono>
            <Mono dim>Editorial / Identity</Mono>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
