import { useEffect, useRef } from "react";
import { ligarCraft, type CraftHandle } from "../animations/craft";

/**
 * Liga os gestos de scroll da direção V3 numa página.
 *
 * ⚠ **Por página, nunca no Layout.** É tentador ligar uma vez no `Layout` do
 * `App.tsx` e nunca mais pensar nisso — e quebraria em silêncio: o
 * `RouteLifecycle` mata TODOS os ScrollTriggers a cada navegação (é o que
 * impede trigger órfão de medir um DOM que já saiu). Ligado no Layout, que não
 * remonta, os triggers morreriam na primeira navegação e nada os religaria: a
 * home funcionaria, e qualquer página alcançada por link ficaria sem gesto
 * nenhum. Ligado na página, cada montagem traz os seus.
 *
 * Devolve a ref que deve ir no elemento raiz da página.
 */
export function useCraft<T extends HTMLElement = HTMLDivElement>() {
  const raiz = useRef<T | null>(null);

  useEffect(() => {
    let handle: CraftHandle | null = null;
    /* um frame para o layout assentar: ligar na mesma batida da montagem mede
       alturas que ainda vão mudar quando as imagens decodificarem */
    const id = requestAnimationFrame(() => {
      if (raiz.current) handle = ligarCraft(raiz.current);
    });
    return () => {
      cancelAnimationFrame(id);
      handle?.kill();
    };
  }, []);

  return raiz;
}
