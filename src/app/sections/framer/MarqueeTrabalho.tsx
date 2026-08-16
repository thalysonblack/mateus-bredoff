import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap, ScrollTrigger } from "../../../lib/gsap";
import { WORK } from "../../../content/work";

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
 * ⚠ A ESTEIRA NÃO ANDA SOZINHA: ela é movida pelo SCROLL.
 *
 * Ela nasceu aqui como tween em laço a 40px/s, um valor plausível que eu nunca
 * tinha apurado. Medido no original, o card fica PARADO com a página parada e
 * anda exatamente **0,400px na horizontal por px de scroll vertical** — razão
 * constante ao longo de todo o percurso, e reversível: sobe a página, a esteira
 * volta. Isso é `scrub`, não animação de tempo.
 *
 * É também o que explica a altura da rota: 2000px num conteúdo que cabe numa
 * tela. O scroll vertical não existe para revelar conteúdo abaixo — ele é o
 * controle da faixa horizontal. Uma tween automática reproduzia a aparência do
 * print e errava a mecânica inteira: no original, quem não rola não vê a
 * esteira andar.
 *
 * A lista é duplicada e o trilho começa deslocado uma cópia inteira para a
 * esquerda: assim há material dos dois lados e o corte nunca aparece, sem rAF
 * próprio medindo posição — que é o defeito que este repo já pagou uma vez
 * (marquee com relógio próprio brigando com o Lenis).
 */

/** Quanto a esteira anda na horizontal por px de scroll vertical. MEDIDO no
    original: 0,400 constante, do topo ao fim do percurso. */
const RAZAO_SCROLL = 0.4;

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
    /* Movimento reduzido: a esteira simplesmente não responde ao scroll. Como
       ela já nasce parada, não há nada a desligar além do vínculo. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const umaCopia = WORK.length * (CARD_W + CALHA);

    /* `invalidateOnRefresh` + `end` como função: o percurso depende do scroll
       máximo do documento, que muda quando a altura muda (imagem que decodifica,
       rodapé de 100vh em outra tela). Fixar o valor no boot deixaria a razão
       certa só na primeira medição. */
    const tween = gsap.fromTo(
      trilho,
      { x: -umaCopia },
      {
        x: () => -umaCopia + RAZAO_SCROLL * ScrollTrigger.maxScroll(window),
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
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
