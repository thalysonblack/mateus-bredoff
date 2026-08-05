import { useMetaRota } from "../../hooks/useMetaRota";
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
  /* `/work` no original também é só `Mateus Bredoff` — o sufixo de página só
     aparece nos cases. */
  useMetaRota();

  /* `.fr` é a família Geist + o papel do original. Sem ela a página herda
     `ui-sans-serif` do sistema e TODA medida de largura de linha mente — foi
     assim que o manifesto da /about mediu 4% mais estreito que o original. */
  return (
    <div className="fr">
      <MarqueeTrabalho />
      <RodapeFramer />
    </div>
  );
}
