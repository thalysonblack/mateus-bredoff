import { Mono } from "../../system";
import Intro from "../../sections/Intro";
import Capabilities from "../../sections/Capabilities";
import Pricing from "../../sections/Pricing";
import Footer from "../../sections/Footer";
import Gabarito from "../v3/Gabarito";
import HeroV4 from "./HeroV4";
import CasesV4 from "./CasesV4";
import ApproachV3 from "../v3/ApproachV3";

/**
 * HOME V4 — "a página como arquivo de design aberto".
 *
 * Não é a home atual com enxertos: é um partido novo aplicado do começo ao fim.
 * Onde a V1 diz "documento técnico" com fio e rótulo, esta diz "artboard em
 * edição": as peças aparecem como OBJETOS SELECIONADOS, com moldura, alças nos
 * cantos, tag de identificação e guias de snap saindo delas; a grade de colunas
 * e a régua de escala ficam visíveis por cima de tudo.
 *
 * O princípio veio de uma referência que ele mandou. A execução é nossa em três
 * pontos que importam: a cor de seleção é o acento do próprio sistema (copiar o
 * magenta seria vestir a identidade de outro estúdio), a moldura só acende no
 * hover (seleção permanente em sete peças viraria poluição) e o conteúdo é
 * inteiramente do Mateus.
 *
 * A ordem responde às perguntas na sequência em que elas aparecem:
 *   Hero          o que ele faz, e quem é (retrato como objeto do arquivo)
 *   Cases         o que já fez — cada projeto com espaço para argumentar
 *   Capabilities  o que sabe fazer, com a peça como evidência
 *   Approach      COMO trabalha — informação que estava enterrada na About
 *   Pricing       quanto custa
 *   Contact       fale com ele
 *
 * A About some como seção: o manifesto virou a manchete do hero e o método virou
 * o Approach. Texto de apresentação solto no meio da página era o sintoma de não
 * ter lugar para essas duas coisas.
 */
export default function HomeV4() {
  return (
    <>
      <Intro />

      <div className="on-paper w-full">
        <div className="bleed flex items-baseline justify-between gap-4 py-2">
          <Mono className="acc">Home · V4</Mono>
          <Mono dim>Arquivo aberto · peças selecionadas · sem About</Mono>
        </div>
      </div>

      <HeroV4 />
      <CasesV4 />
      <Capabilities />
      <ApproachV3 />
      <Pricing />
      <Footer />

      <Gabarito />
    </>
  );
}
