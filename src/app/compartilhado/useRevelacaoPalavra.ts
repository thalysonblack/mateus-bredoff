import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsap";

/**
 * Revelação palavra a palavra por COR — o gesto central da `/about` original.
 *
 * Não é o reveal por máscara de `animations/reveal.ts`, que é o gesto da direção
 * autoral. Aqui o texto já está inteiro na tela, apagado, e vai acendendo
 * palavra por palavra conforme o bloco atravessa a janela. É um efeito de
 * leitura, não de entrada: o parágrafo funciona como uma barra de progresso da
 * própria frase.
 *
 * Por isso é `scrub`, e não uma tween disparada: ligado ao scroll, ele anda para
 * trás quando o usuário sobe. Uma tween de 0,8s "revelaria" o texto e acabou —
 * e a segunda passagem pelo mesmo parágrafo não teria gesto nenhum.
 *
 * ⚠ `document.fonts.ready` antes do split: as fontes são self-hosted, e um split
 * medido com a métrica do fallback quebra as palavras em posição errada.
 *
 * ⚠ Acessibilidade: `aria-label` no elemento + `aria-hidden` nas palavras, senão
 * o leitor de tela recita o texto picado. O `revert()` no cleanup devolve o DOM
 * original — sem ele cada remount empilha spans e mata a seleção de texto.
 */
export function useRevelacaoPalavra<T extends HTMLElement = HTMLElement>(
  corApagada: string,
  corAcesa: string,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Movimento reduzido: o texto simplesmente está aceso. Não existe versão
       "mais suave" de um texto que só acende — existe aceso ou apagado. */
    if (prefersReducedMotion()) {
      el.style.color = corAcesa;
      return;
    }

    let split: SplitText | null = null;
    let trigger: ScrollTrigger | null = null;
    let cancelado = false;

    document.fonts.ready.then(() => {
      if (cancelado || !ref.current) return;
      const alvo = ref.current;
      /* Só rotula se quem chamou não rotulou: um texto com <br> tem
         `textContent` sem espaço na emenda ("multidisciplinarydesigner"), e o
         leitor de tela recitaria a palavra grudada. */
      if (!alvo.getAttribute("aria-label")) {
        alvo.setAttribute("aria-label", alvo.textContent ?? "");
      }

      split = new SplitText(alvo, { type: "words" });
      split.words.forEach((w) => (w as HTMLElement).setAttribute("aria-hidden", "true"));

      /* O SplitText grava `display:inline-block` no ATRIBUTO style, e
         inline-block reserva o descender no fim de cada caixa de linha. Numa
         entrelinha menor que o corpo (56,96 num corpo de 64) isso empurra o
         bloco uma linha inteira para baixo e a última some por trás do
         `overflow-hidden` — foi o que aconteceu com o manifesto do hero.
         O `gsap.set` escreve no MESMO style inline, então vence sem precisar de
         `!important` nem de uma classe num CSS à parte. Só a cor é animada
         aqui: nenhuma transform precisa do inline-block. */
      gsap.set(split.words, { display: "inline" });

      const tween = gsap.fromTo(
        split.words,
        { color: corApagada },
        {
          color: corAcesa,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: alvo,
            /* O bloco acende do momento em que sua base entra na tela até ele
               ter subido três quartos dela: a última palavra acende com o
               parágrafo ainda inteiro à vista, não já saindo por cima. */
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        },
      );
      trigger = tween.scrollTrigger ?? null;
    });

    return () => {
      cancelado = true;
      trigger?.kill();
      split?.revert();
    };
  }, [corApagada, corAcesa]);

  return ref;
}
