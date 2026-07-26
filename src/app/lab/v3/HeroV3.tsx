import { Mono, Bracket } from "../../system";
import Menu from "../../sections/Menu";
import portrait1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../../assets/optimized/hero-portrait-3200.webp";

/**
 * Hero V3 — manchete tipográfica com hierarquia por COR, retrato em faixa.
 *
 * Princípio tirado do rubrikastudio.com: a manchete não é uma frase de tamanho
 * único. A primeira linha vem em tinta cheia e a continuação em cinza, então a
 * frase tem ritmo semântico — o olho lê a afirmação e depois a qualificação, sem
 * que nada mude de corpo. É o oposto do hero atual, em que o retrato é o
 * ambiente e o nome ocupa os cantos.
 *
 * O retrato não desaparece: desce para uma faixa em sangria no pé da seção, onde
 * funciona como assinatura em vez de cenário. Quem chega lê a proposta primeiro
 * e vê a pessoa depois.
 *
 * ⚠ A hierarquia por cor precisa de contraste nos DOIS níveis. Sobre o papel
 * #ede6e1: a tinta #131313 mede 15,05:1 e o `--dim` #6a665e mede 4,63:1 — o
 * cinza continua sendo texto legível, não decoração apagada. Se clarear o dim
 * para "suavizar", reprova em AA.
 */
export default function HeroV3() {
  return (
    <section className="on-paper relative flex min-h-[100dvh] w-full flex-col">
      <Menu />

      <div className="bleed flex flex-1 flex-col justify-center py-[clamp(2rem,6vh,5rem)]">
        {/* Manchete: afirmação em tinta, qualificação em cinza */}
        <h1 className="t-display t-display-xl" style={{ fontSize: "clamp(2rem,6.2vw,104px)" }}>
          Visual identities for brands
          <br />
          <span className="dim">that need to be taken</span>
          <br />
          <span className="dim">seriously.</span>
        </h1>

        <div className="flex flex-col gap-6 pt-[clamp(2rem,5vh,4rem)] md:flex-row md:items-end md:justify-between">
          <p className="t-body max-w-[38ch]">
            Brand designer and art director working from Brazil, worldwide — from the mark itself to
            the system that keeps it standing.
          </p>

          <div className="flex items-center gap-[clamp(1rem,2vw,2rem)]">
            {/* CTA de disponibilidade. Do referencial vem a ideia de mostrar
                capacidade real; o desenho é nosso — retângulo de fio, porque
                pílula arredondada viola o raio zero do sistema. */}
            <span
              className="inline-flex flex-col px-[0.9em] py-[0.6em]"
              style={{ border: "1px solid var(--rule)" }}
            >
              <Mono>Available for work</Mono>
              <Mono dim>Two slots · Q3</Mono>
            </span>
            <a href="#contact" className="link-quiet shrink-0">
              <Bracket>START A PROJECT</Bracket>
            </a>
          </div>
        </div>
      </div>

      {/* Retrato como faixa de assinatura, em sangria. `object-position` no topo
          porque a foto é 1600×850 e o rosto vive na metade de cima — recortar
          pelo centro cortaria a cabeça. */}
      <figure className="w-full overflow-hidden" style={{ height: "clamp(9rem,26vh,18rem)" }}>
        <img
          src={portrait1600}
          srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
          sizes="100vw"
          alt="Mateus Bredoff"
          width={1600}
          height={850}
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 18%" }}
        />
      </figure>
    </section>
  );
}
