import { useEffect } from "react";
import MarqueeTrabalho from "../sections/framer/MarqueeTrabalho";
import RodapeFramer from "../sections/framer/RodapeFramer";

/**
 * `/work` — no original, a rota mais curta do site: **2000px de altura**, e
 * nada além de uma faixa de 100vh com a esteira de projetos e o rodapé de 100vh.
 *
 * Não há título, não há índice em lista, não há contagem. A versão anterior
 * desta página era uma tabela de registros com manchete "Selected Work" — boa
 * página, mas de outro site. O contrato aqui é réplica.
 */
export default function WorkIndex() {
  useEffect(() => {
    const anterior = document.title;
    document.title = "Mateus Bredoff";
    return () => {
      document.title = anterior;
    };
  }, []);

  return (
    <>
      <MarqueeTrabalho />
      <RodapeFramer />
    </>
  );
}
