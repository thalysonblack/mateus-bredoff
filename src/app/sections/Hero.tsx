import { motion } from "motion/react";
import Menu from "./Menu";
import { Mono, Rule, Bracket, ease } from "../system";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";

/**
 * Hero — papel.
 *
 * A versão preta com o retrato em faixa full-bleed foi descartada: espremia a
 * foto entre a barra e o nome, e brigava com o modo claro que carrega o resto
 * da página. Aqui o bloco é branco como os demais, e a composição muda de
 * lógica em vez de só trocar de cor.
 *
 * O partido é assimétrico: o nome empilhado ocupa a esquerda em caixa alta
 * gigante, o retrato vira uma CHAPA de proporção própria (3:4, sem corte
 * apertado) ancorada à direita, e o ar entre os dois é o que faz a página
 * parecer galeria e não template. Nome e chapa alinham pela base — é a linha
 * que amarra a composição.
 *
 * A revelação por máscara (clip-path inset 50%→0 + zoom 1.3→1) segue do Framer
 * original: é a assinatura de motion da casa.
 */

const maskTransition = { type: "spring", bounce: 0, duration: 1.6, delay: 0.5 } as const;

const PORTRAIT_SRCSET = `${portrait1600} 1600w, ${portrait3200} 3200w`;

export default function Hero() {
  return (
    <section className="on-paper relative flex h-[100dvh] min-h-[36rem] w-full flex-col overflow-clip">
      <Menu />

      {/* Miolo: nome à esquerda, chapa à direita, alinhados pela base */}
      <div className="bleed flex min-h-0 flex-1 flex-col justify-end gap-6 pb-[clamp(1rem,2vw,2rem)] pt-[clamp(1.5rem,3vw,3rem)] md:flex-row md:items-end md:gap-[clamp(1.5rem,4vw,5rem)]">
        <motion.h1
          className="t-display shrink-0"
          style={{ fontSize: "clamp(2.75rem, 11vw, 200px)", lineHeight: 0.86 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
        >
          <span className="block">Mateus</span>
          <span className="block">Bredoff</span>
        </motion.h1>

        {/* Chapa do retrato — proporção própria, sem corte apertado */}
        {/* No mobile a largura manda e a altura sai da proporção; no desktop é o
            contrário. Deixar os dois em `auto` colapsa a chapa para zero — foi
            o que aconteceu na primeira tentativa. */}
        <motion.figure
          className="relative ml-auto w-[min(62vw,17rem)] shrink-0 overflow-hidden md:h-[min(56vh,30rem)] md:w-auto"
          style={{ aspectRatio: "3 / 4", willChange: "clip-path" }}
          initial={{ clipPath: "inset(50% 50% 50% 50%)", WebkitClipPath: "inset(50% 50% 50% 50%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", WebkitClipPath: "inset(0% 0% 0% 0%)" }}
          transition={maskTransition}
        >
          <motion.img
            src={portrait1600}
            srcSet={PORTRAIT_SRCSET}
            sizes="(min-width: 768px) 30vw, 90vw"
            alt="Mateus Bredoff"
            width={3840}
            height={2040}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 30%" }}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={maskTransition}
            draggable={false}
          />
        </motion.figure>
      </div>

      {/* Legenda técnica — os campos que a página inteira usa para se anunciar */}
      <motion.div
        className="bleed pb-[clamp(0.75rem,1.5vw,1.25rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 1.15 }}
      >
        <Rule />
        <div className="flex items-baseline justify-between gap-4 pt-2">
          <Mono dim>Portfolio — Vol. 01</Mono>
          <Mono dim className="hidden sm:block">
            Brand Designer
          </Mono>
          <Mono dim className="hidden md:block">
            Brazil / Worldwide
          </Mono>
          <a href="#about" className="link-quiet">
            <Bracket>Scroll</Bracket>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
