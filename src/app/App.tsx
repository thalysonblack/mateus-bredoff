import Intro from "./sections/Intro";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Marquee from "./sections/Marquee";
import Work from "./sections/Work";
import Capabilities from "./sections/Capabilities";
import Pricing from "./sections/Pricing";
import Footer from "./sections/Footer";

/**
 * Mateus Bredoff — direção editorial.
 *
 * O ritmo da página é o das referências (TITARVL / WIDE ANGLE® / All In®):
 * blocos de sangria a sangria, sem meio-tom. O papel domina e a tinta marca as
 * viradas — a hero escura foi descartada.
 *   Hero          papel
 *   About         papel
 *   Work          papel   — todo o trabalho, num índice só
 *   Capabilities  tinta   — a virada
 *   Pricing       tinta   ┐ o fecho é um bloco escuro contínuo:
 *   Contact       tinta   ┘ quanto custa → fala comigo
 *
 * **Não existe seção separada para o lab de IA.** Ela existiu e foi removida:
 * anunciar "fictional brands" enfraquecia o trabalho, e a lista classificava
 * como ficção três projetos que estão publicados no Behance dele. A procedência
 * agora é uma `tag` na legenda de cada peça dentro do `Work`.
 *
 * As primitivas do sistema vivem em ./system.tsx e os tokens em
 * ../styles/system.css. Seção nova usa as peças de lá; não recria a aparência.
 */
export default function App() {
  return (
    <main className="antialiased">
      <Intro />
      <Hero />
      <About />
      {/* passagem entre a apresentação e o índice — ver Marquee.tsx */}
      <Marquee />
      <Work />
      <Capabilities />
      <Pricing />
      <Footer />
      {/* grão por cima de tudo — ver .grain em styles/system.css */}
      <div className="grain" aria-hidden="true" />
    </main>
  );
}
