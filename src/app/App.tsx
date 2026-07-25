import Intro from "./sections/Intro";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Capabilities from "./sections/Capabilities";
import AILab from "./sections/AILab";
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
 *   Work          papel   — trabalho de cliente
 *   Capabilities  tinta   — primeira virada
 *   AI Lab        papel   — trabalho autoral, caderno separado
 *   Pricing       tinta   ┐ o fecho é um bloco escuro contínuo:
 *   Contact       tinta   ┘ quanto custa → fala comigo
 *
 * A NARRATIVA é prova → autoral → serviço → preço → contato. O AI Lab entra
 * depois do Capabilities de propósito: ele é o argumento de que o "AI Creative"
 * da bio tem lastro, e vem melhor logo antes de pedir dinheiro.
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
      <AILab />
      <Pricing />
      <Footer />
    </main>
  );
}
