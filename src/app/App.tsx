import { useEffect, useState } from "react";
import Home from "../imports/Home";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Cases from "./sections/Cases";

// Rebuilt sections (Hero, About, Cases) are real responsive components. What's
// left of the original artboard (Home.tsx, 1920×4427) is rendered as a clipped
// "band": Capabilities + Footer [3030 → 4427]. Home.tsx is left untouched.
const DESIGN_HEIGHT = 4427;
const PROJECTS_END = 3030;

/** Renders a vertical slice [from, to] (design px) of the scaled artboard. */
function ArtboardBand({ from, to, scale }: { from: number; to: number; scale: number }) {
  return (
    <div style={{ height: (to - from) * scale, overflow: "hidden" }}>
      <div
        style={{
          width: 1920,
          height: DESIGN_HEIGHT,
          transform: `translateY(${-from * scale}px) scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className="relative w-[1920px]" style={{ height: DESIGN_HEIGHT }}>
          <Home />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scale, setScale] = useState(typeof window !== "undefined" ? window.innerWidth / 1920 : 1);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / 1920);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <>
      {/* Responsive hero (Framer rebuild) */}
      <Hero />

      {/* Intro + About me (responsive rebuild) */}
      <About />

      {/* Featured projects — rebuilt Cases showcase (Framer order: About → projects → Capabilities) */}
      <Cases />

      {/* Capabilities + Footer — remaining original artboard band */}
      <ArtboardBand from={PROJECTS_END} to={DESIGN_HEIGHT} scale={scale} />
    </>
  );
}
