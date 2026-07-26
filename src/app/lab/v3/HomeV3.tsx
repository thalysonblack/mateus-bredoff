import { Mono } from "../../system";
import Intro from "../../sections/Intro";
import Work from "../../sections/Work";
import Capabilities from "../../sections/Capabilities";
import Pricing from "../../sections/Pricing";
import Footer from "../../sections/Footer";
import Gabarito from "./Gabarito";
import HeroV3 from "./HeroV3";
import ApproachV3 from "./ApproachV3";

/**
 * HOME V3 — rota `/lab/home-v3`.
 *
 * Soma ao que já existe os PRINCÍPIOS do rubrikastudio.com. Nada de conteúdo ou
 * arquivo de lá: o que se aproveita é partido de estrutura.
 *
 *   Gabarito   a grade de colunas e a régua VISÍVEIS sobre a página inteira —
 *              "documento técnico" deixa de ser metáfora e passa a ser desenho
 *   Hero       manchete com hierarquia por COR (afirmação em tinta,
 *              qualificação em cinza) e o retrato descendo para uma faixa de
 *              assinatura no pé, em vez de ser o cenário
 *   Approach   seção nova, e é INFORMAÇÃO que já existia: o método dele estava
 *              enterrado como parágrafo de apoio dentro da About
 *
 * Fica intacto o que foi aprovado: Work, Capabilities em lista com painel,
 * Pricing em escada, rodapé e a paleta.
 *
 * A ordem responde às perguntas na sequência em que aparecem: o que ele faz →
 * o que já fez → o que sabe fazer → COMO trabalha → quanto custa → fale com ele.
 */
export default function HomeV3() {
  return (
    <>
      <Intro />

      <div className="on-paper w-full">
        <div className="bleed flex items-baseline justify-between gap-4 py-2">
          <Mono className="acc">Home · V3</Mono>
          <Mono dim>Gabarito visível · manchete em dois tons · Approach</Mono>
        </div>
      </div>

      <HeroV3 />
      <Work />
      <Capabilities />
      <ApproachV3 />
      <Pricing />
      <Footer />

      {/* Por cima de tudo, abaixo do grão: a estrutura à mostra */}
      <Gabarito />
    </>
  );
}
