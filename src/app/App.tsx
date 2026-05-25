import Hero from "./sections/Hero";
import About from "./sections/About";
import Cases from "./sections/Cases";
import Capabilities from "./sections/Capabilities";
import Footer from "./sections/Footer";

/**
 * Mateus Bredoff — responsive rebuild of mateusbredoff.framer.website.
 * Every section is now a real responsive React component; the original
 * scaled Figma artboard (src/imports/Home.tsx) has been fully retired.
 */
export default function App() {
  return (
    <main className="bg-[#f6f6f6] text-[#141414] antialiased">
      <Hero />
      <About />
      <Cases />
      <Capabilities />
      <Footer />
    </main>
  );
}
