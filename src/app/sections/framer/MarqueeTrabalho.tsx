import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap } from "../../../lib/gsap";
import { WORK } from "../../../content/work";
import "../../../styles/framer-rotas.css";

/**
 * A faixa de trabalho — o corpo inteiro de `/work` no original.
 *
 * Medido: bloco de **100vh** com `linear-gradient(#142126 0%, #fff 100%)`,
 * cards de **954×650** com **24px** de calha, centrados verticalmente
 * ((100vh − 650) / 2 = 175 no viewport de 1000), rolando em laço.
 *
 * O card NÃO encolhe no mobile: medi 954×650 igual em 390px, onde ele estoura
 * a tela de propósito — a faixa é uma esteira, não uma grade responsiva. Fazer
 * o card virar `100vw` no celular seria melhorar o original, não replicá-lo.
 *
 * A lista é duplicada e a esteira anda até `-50%`: no ponto de virada a segunda
 * cópia está exatamente onde a primeira começou, então o corte é invisível sem
 * precisar de rAF próprio medindo posição — que é justamente o defeito que este
 * repo já pagou uma vez (marquee com relógio próprio brigando com o Lenis).
 */

/** Velocidade em px/s. NÃO foi medida no original — ver relatório. */
const VELOCIDADE = 40;

const CARD_W = 954;
const CARD_H = 650;
const CALHA = 24;

function Card({ item }: { item: (typeof WORK)[number] }) {
  return (
    <Link
      to={`/work/${item.slug}`}
      className="relative block shrink-0 overflow-hidden"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <img
        src={item.cover.src}
        srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
        sizes="954px"
        width={item.cover.w}
        height={item.cover.h}
        alt={item.cover.alt}
        /* `eager`: a esteira está acima da dobra e, com o Lenis no comando, o
           `scrollY` nativo fica em 0 — imagem `lazy` aqui nunca dispara. */
        loading="eager"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2">
        {/* Branco + `difference` é o que o original usa: o nome do projeto se
            inverte contra a arte, clara ou escura. Aqui o blend é seguro porque
            nada acima dele cria stacking context — o card só tem `overflow`. */}
        <span className="fr-card-titulo px-1 text-white mix-blend-difference">
          {item.title}
        </span>
        <span className="flex gap-2">
          {item.disciplines.map((d) => (
            <span
              key={d}
              className="fr-rotulo rounded-[3px] bg-black/15 px-2 py-1 text-white backdrop-blur-[5px]"
            >
              {d}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}

export default function MarqueeTrabalho() {
  const trilhoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const largura = WORK.length * (CARD_W + CALHA);
    const tween = gsap.fromTo(
      trilho,
      { x: 0 },
      { x: -largura, duration: largura / VELOCIDADE, ease: "none", repeat: -1 },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section
      aria-label="Trabalho selecionado"
      className="relative flex h-svh w-full items-center overflow-hidden"
      style={{ background: "linear-gradient(#142126 0%, #ffffff 100%)" }}
    >
      <div ref={trilhoRef} className="flex will-change-transform" style={{ gap: CALHA }}>
        {/* Duas passadas: a segunda é decorativa e some do leitor de tela, senão
            o índice do portfólio é recitado duas vezes. */}
        {WORK.map((w) => (
          <Card key={w.slug} item={w} />
        ))}
        <div className="flex shrink-0" style={{ gap: CALHA }} aria-hidden="true">
          {WORK.map((w) => (
            <Card key={`eco-${w.slug}`} item={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
