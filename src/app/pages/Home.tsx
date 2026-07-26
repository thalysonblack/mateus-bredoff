import Intro from "../sections/Intro";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Work from "../sections/Work";
import Capabilities from "../sections/Capabilities";
import Pricing from "../sections/Pricing";
import Footer from "../sections/Footer";

/**
 * Home — exatamente o que já estava aprovado, agora como rota.
 *
 * O ritmo é o das referências (TITARVL / WIDE ANGLE® / All In®): blocos de
 * sangria a sangria, sem meio-tom. O papel domina e a tinta marca as viradas.
 *   Hero              papel
 *   About             TINTA   — o momento cromático da página
 *   Work              papel   — índice do trabalho
 *   Capabilities      tinta   ┐
 *   Pricing · Contact tinta   ┘ o fecho é um bloco escuro contínuo
 *
 * **Havia um carrossel de artes entre a About e o Work, e ele saiu.** A faixa
 * mostrava as peças em movimento e logo abaixo o Selected Work mostrava as
 * MESMAS peças — o visitante via o portfólio duas vezes em dois formatos, e a
 * segunda vez tirava o impacto da primeira. Impacto na About passou a vir da
 * virada de cor, não de imagem repetida.
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
      <Work />
      <Capabilities />
      <Pricing />
      <Footer />
    </>
  );
}
