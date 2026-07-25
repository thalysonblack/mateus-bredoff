import Intro from "../sections/Intro";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Marquee from "../sections/Marquee";
import Work from "../sections/Work";
import Capabilities from "../sections/Capabilities";
import Pricing from "../sections/Pricing";
import Footer from "../sections/Footer";

/**
 * Home — exatamente o que já estava aprovado, agora como rota.
 *
 * O ritmo é o das referências (TITARVL / WIDE ANGLE® / All In®): blocos de
 * sangria a sangria, sem meio-tom. O papel domina e a tinta marca as viradas.
 *   Hero · About · Marquee   papel
 *   Work                     papel   — índice do trabalho
 *   Capabilities             tinta   — a virada
 *   Pricing · Contact        tinta   — o fecho é um bloco escuro contínuo
 *
 * A barra de metadados (`sections/Menu`) vive DENTRO do Hero nesta página, e é
 * por isso que o Layout não a repete aqui: ela participa do flex do hero e
 * movê-la para fora mudaria uma composição já aprovada. Nas rotas internas o
 * Layout monta a barra por conta própria.
 */
export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      {/* passagem entre a apresentação e o índice — ver Marquee.tsx */}
      <Marquee />
      <Work />
      <Capabilities />
      <Pricing />
      <Footer />
    </>
  );
}
