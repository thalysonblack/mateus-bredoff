/**
 * Reveal por máscara de linha — o gesto-base de toda cópia do projeto.
 *
 * O texto não aparece: ele SOBE por trás de uma máscara, linha por linha. É a
 * diferença entre "elemento com fade" (que qualquer site tem) e tipografia
 * editorial entrando em cena. Substitui o `opacity + translateY 20px` que estava
 * em `app/system.tsx` — aquele é o reveal genérico de template.
 *
 * Parâmetros de assinatura: `yPercent 110 → 0`, `duration 0.75`, `power3.out`,
 * `stagger 0.1` entre linhas, disparo em `top 80%`, uma vez só.
 *
 * ⚠ FONTES ANTES DO SPLIT. O SplitText mede a caixa de cada linha para cortar o
 * texto; se a webfont chegar depois, as linhas foram calculadas com a métrica do
 * fallback e a máscara corta no lugar errado — sobra meia letra aparecendo ou um
 * corte no meio da altura-x. Este projeto tem Inter Tight e Martian Mono
 * self-hosted, então a espera é obrigatória. `document.fonts.ready` sozinho já
 * resolveu na prática, mas o frame extra protege do layout ainda não ter
 * assentado quando a promise resolve.
 *
 * ⚠ ACESSIBILIDADE E SELEÇÃO. `SplitText` reescreve o innerHTML em <div>s. Com
 * `aria-label` no elemento original + `aria-hidden` nas linhas, o leitor de tela
 * continua lendo a frase inteira em vez de fragmentos. O `revert()` no cleanup
 * devolve o DOM original — sem ele, cada remount empilha uma nova camada de
 * divs e a seleção de texto do usuário fica impossível.
 */
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/gsap";

export type RevealHandle = { kill: () => void };

type Options = {
  /** Atraso inicial — use para escalonar blocos irmãos, não para "dar ritmo" a cada linha. */
  delay?: number;
  /** Dispara no load em vez de no scroll. Só para o que já está na primeira tela. */
  immediate?: boolean;
  stagger?: number;
};

export async function revealLines(
  el: HTMLElement | null,
  { delay = 0, immediate = false, stagger = 0.1 }: Options = {},
): Promise<RevealHandle | null> {
  if (!el) return null;

  /* Movimento reduzido: o texto simplesmente está lá. Não há versão "mais
     discreta" de um reveal — há o reveal ou o conteúdo visível. */
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  await document.fonts.ready;
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  const label = el.textContent?.trim() ?? "";

  const split = SplitText.create(el, {
    type: "lines",
    mask: "lines", // o wrapper de overflow:hidden é criado pelo próprio plugin
    linesClass: "reveal-line",
  });

  if (label) el.setAttribute("aria-label", label);
  split.lines.forEach((line) => line.setAttribute("aria-hidden", "true"));

  gsap.set(el, { autoAlpha: 1 });

  const tween = gsap.from(split.lines, {
    yPercent: 110,
    duration: 0.75,
    ease: "power3.out",
    stagger,
    delay,
    ...(immediate
      ? {}
      : {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }),
  });

  return {
    kill: () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
      el.removeAttribute("aria-label");
    },
  };
}
