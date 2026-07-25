import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mono, ease } from "../system";

/**
 * Intro — a abertura com o wordmark, antes da página revelar.
 *
 * Está em todas as referências da família e é o que dá o tempo cinematográfico:
 * a página não "carrega", ela abre. Sai com uma cortina que sobe (clip-path),
 * o mesmo gesto de painel varrendo que aparece nas transições delas.
 *
 * Em papel, não em tinta: a hero é clara, e uma cortina preta na frente dela
 * criava um susto de 1,3s que não pertence ao resto da página.
 *
 * Três freios, porque intro que atrapalha é pior que intro nenhuma:
 *   - roda uma vez por sessão (voltar da aba não paga o pedágio de novo);
 *   - `prefers-reduced-motion` pula por completo;
 *   - 1,3s de ponta a ponta — o hero já está animando por baixo, então a
 *     cortina levanta com a máscara do retrato ainda em curso.
 */

const SEEN_KEY = "mb:intro-seen";

export default function Intro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(SEEN_KEY)) return;

    setVisible(true);
    sessionStorage.setItem(SEEN_KEY, "1");
    const id = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro"
          className="on-paper fixed inset-0 z-50 flex items-center justify-center"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Mono>Mateus Bredoff©</Mono>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
