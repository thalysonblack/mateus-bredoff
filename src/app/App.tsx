import Intro from "./sections/Intro";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Capabilities from "./sections/Capabilities";
import Footer from "./sections/Footer";

/**
 * Mateus Bredoff — direção editorial.
 *
 * O ritmo da página é o das referências (TITARVL / WIDE ANGLE® / All In®):
 * blocos de sangria a sangria, sem meio-tom. Aqui o papel domina e a tinta
 * entra só no fecho — a hero escura foi descartada.
 *   Hero          papel
 *   About         papel
 *   Work          papel
 *   Capabilities  tinta   — vira para o fecho
 *   Contact       tinta
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
      <Work />
      <Capabilities />
      <Footer />
    </main>
  );
}
