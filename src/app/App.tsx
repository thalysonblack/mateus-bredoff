import { useEffect } from "react";
import { initLenis, destroyLenis } from "../lib/lenis";
import { ScrollTrigger } from "../lib/gsap";
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
  /*
   * Ordem de boot: scroll primeiro, motion depois. O Lenis precisa existir antes
   * de qualquer ScrollTrigger, senão os triggers se registram medindo o scroll
   * nativo e ficam dessincronizados do scroll interpolado.
   *
   * Não há sistema de navegação (Barba e afins): o site é uma página só. Instalar
   * roteador para uma rota é arquitetura sem função.
   */
  useEffect(() => {
    initLenis();

    /* As imagens entram com `loading="lazy"`; quando cada uma decodifica, a
       altura do documento muda e todo trigger abaixo dela passa a apontar para
       a posição errada. `refresh()` no load recalcula depois que tudo assentou. */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      destroyLenis();
    };
  }, []);

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
