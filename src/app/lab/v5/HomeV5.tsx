import { Mono } from "../../system";
import Intro from "../../sections/Intro";
import About from "../../sections/About";
import Capabilities from "../../sections/Capabilities";
import Pricing from "../../sections/Pricing";
import Footer from "../../sections/Footer";
import HeroIndex from "./HeroIndex";
import CaseStage from "./CaseStage";

/**
 * HOME V5 — "a obra em primeiro plano".
 *
 * A V4 e a tentativa de canvas de nós erraram pelo mesmo motivo: a forma falava
 * da FERRAMENTA (artboard, seleção, grafo) e o trabalho ficava em segundo plano.
 * Quem contrata identidade visual quer ver identidade visual.
 *
 * Esta versão inverte tudo para a obra:
 *
 *   Hero    é o ÍNDICE. A tela abre com a lista dos projetos em tipografia
 *           grande, e a arte de cada um toma a tela por trás do texto ao ser
 *           percorrida. O nome do autor entra depois, no pé — quem chega vê
 *           trabalho antes de ver apresentação.
 *   Cases   uma peça por TELA, em sangria total, com o texto mínimo ancorado no
 *           pé. Escala de exposição em vez de sete miniaturas competindo.
 *   About   fica, curta, como respiro de texto entre dois blocos de imagem.
 *   Capabilities e Pricing ficam exatamente como aprovados.
 *
 * O que se ganha: o portfólio é avaliado pela peça, no tamanho em que ela pode
 * ser julgada. O que se perde, e é honesto dizer: a comparação de relance (não
 * se vê o conjunto numa olhada) e uma página mais longa. Para trabalho que é
 * imagem, esse câmbio compensa.
 *
 * ⚠ Nenhum elemento de "chrome de ferramenta": sem gabarito, sem moldura de
 * seleção, sem nós. A única cenografia é o véu que garante contraste do texto
 * sobre as artes.
 */
export default function HomeV5() {
  return (
    <>
      <Intro />

      <div className="on-paper w-full">
        <div className="bleed flex items-baseline justify-between gap-4 py-2">
          <Mono className="acc">Home · V5</Mono>
          <Mono dim>A obra em primeiro plano · hero-índice · case por tela</Mono>
        </div>
      </div>

      <HeroIndex />
      <CaseStage />
      <About />
      <Capabilities />
      <Pricing />
      <Footer />
    </>
  );
}
