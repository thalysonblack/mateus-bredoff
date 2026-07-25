/**
 * Ponte React → animação. O componente NÃO conhece GSAP.
 *
 * Toda a lógica de motion vive em `animations/`; aqui só existe o ciclo de vida:
 * monta → anima, desmonta → mata. É a mesma separação de
 * `hero.js` / `hero.animations.js` do padrão de arquitetura, traduzida para
 * hooks — o componente pede um reveal e recebe uma ref.
 *
 * O `revealLines` é assíncrono (espera as fontes), então o cleanup precisa lidar
 * com o caso de o componente desmontar ANTES da promise resolver. Sem a flag
 * `cancelled` o split roda depois do unmount e escreve num DOM órfão.
 */
import { useEffect, useRef } from "react";
import { revealLines, type RevealHandle } from "../animations/reveal";

type Options = { delay?: number; immediate?: boolean; stagger?: number };

export function useReveal<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const ref = useRef<T>(null);
  /* As opções entram numa ref para não reexecutar o efeito quando o objeto
     literal é recriado a cada render — a alternativa seria pedir ao chamador
     para memoizar, o que é armadilha silenciosa. */
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    let cancelled = false;
    let handle: RevealHandle | null = null;

    revealLines(ref.current, optsRef.current).then((h) => {
      if (cancelled) {
        h?.kill();
        return;
      }
      handle = h;
    });

    return () => {
      cancelled = true;
      handle?.kill();
    };
  }, []);

  return ref;
}
