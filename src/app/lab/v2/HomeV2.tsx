import { Mono } from "../../system";
import Intro from "../../sections/Intro";
import About from "../../sections/About";
import Pricing from "../../sections/Pricing";
import Footer from "../../sections/Footer";
import HeroV2 from "./HeroV2";
import WorkGridV2 from "./WorkGridV2";
import CapabilitiesV2 from "./CapabilitiesV2";

/**
 * HOME V2 — rota `/lab/home-v2`, para comparar com a home aprovada.
 *
 * Não é um redesenho do zero: é a home atual atravessada pelas duas referências
 * que ele mandou e pelo site publicado dele. O que MUDA em relação à V1:
 *
 *   Hero          retrato dentro de um campo de gradiente petróleo, nome
 *                 ancorado nos dois cantos de baixo e marcas de registro
 *                 (do site publicado + REBOOT) — em vez de retrato como chapa
 *                 ao lado do nome
 *   Work          grade modular numerada com fio de 1px e numeral em marca
 *                 d'água (Norgram) — em vez do índice escalonado
 *   Capabilities  faixas largas com campo de tags e frase por disciplina
 *                 (REBOOT) — em vez de pilha de nomes sem conteúdo
 *
 * O que FICA, porque já foi aprovado e não há motivo para mexer: a About em
 * petróleo com marginália, o Pricing em escada de acumulação, o rodapé, a intro
 * e a paleta inteira.
 *
 * As três seções novas leem os mesmos dados da V1 (`content/work.ts`), então
 * aprovar o partido não custa remontar conteúdo.
 */
export default function HomeV2() {
  return (
    <>
      <Intro />

      {/* Faixa de identificação da versão — só existe no laboratório */}
      <div className="on-ink w-full">
        <div className="bleed flex items-baseline justify-between gap-4 py-2">
          <Mono className="acc">Home · V2</Mono>
          <Mono dim>Hero gradiente · Work modular · Capabilities em faixas</Mono>
        </div>
      </div>

      <HeroV2 />
      <About />
      <WorkGridV2 />
      <CapabilitiesV2 />
      <Pricing />
      <Footer />
    </>
  );
}
