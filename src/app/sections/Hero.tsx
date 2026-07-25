import { motion } from "motion/react";
import Menu from "./Menu";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";

/**
 * Hero — faithful rebuild of the Framer hero (mateusbredoff.framer.website).
 *
 * The Framer "Design to AI" export infinite-loops standalone (its appear/parallax
 * HOCs need Framer's page runtime), so this reproduces the SAME design + the SAME
 * animation values with clean motion/react, in a responsive 100dvh layout that
 * matches the published site:
 *   - portrait: clip-path mask reveal inset(50%)→inset(0) + zoom 1.3→1
 *   - "Mateus Bredoff": slides in from the left  (x -150 → 0) + fade
 *   - "BRAND DESIGNER": slides in from the right (x +150 → 0) + fade
 *   - centered logo "MATEUS BREDOFF©": fade in (mix-blend-difference)
 */

// Transitions copied verbatim from the Framer export.
const maskTransition = { type: "spring", bounce: 0, duration: 2, delay: 0.6 } as const;
const logoTransition = { type: "spring", bounce: 0.2, duration: 0.4 } as const;
const titleTransition = { type: "spring", damping: 30, mass: 0.1, stiffness: 98, delay: 2 } as const;

// Portrait — self-hosted. The original was hotlinked from framerusercontent.com,
// which would break the site the day the Framer project goes away.
const PORTRAIT_SRC = portrait1600;
const PORTRAIT_SRCSET = `${portrait1600} 1600w, ${portrait3200} 3200w`;

const titleStyle = {
  fontSize: "clamp(2.25rem, 8.2vw, 124px)",
  lineHeight: 0.89,
  letterSpacing: "-0.03em",
  color: "#fff",
} as const;

// Below sm the two corner blocks would nearly touch in the middle. They stack
// instead — still opposed left/right, so the diagonal tension of the layout
// survives and the type keeps its scale.
const CORNERS =
  "pointer-events-none absolute inset-0 flex flex-col items-stretch justify-end gap-2 p-[26px] sm:flex-row sm:items-end sm:justify-between sm:gap-0";

export default function Hero() {
  return (
    <section className="relative h-[100dvh] w-full overflow-clip bg-[#0e2e38]">
      <Menu />
      {/* Portrait — full-bleed cover, revealed by an expanding center mask + zoom */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ willChange: "clip-path" }}
        initial={{ clipPath: "inset(50% 50% 50% 50% round 6px)", WebkitClipPath: "inset(50% 50% 50% 50% round 6px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 6px)", WebkitClipPath: "inset(0% 0% 0% 0% round 6px)" }}
        transition={maskTransition}
      >
        <motion.img
          src={PORTRAIT_SRC}
          srcSet={PORTRAIT_SRCSET}
          sizes="100vw"
          alt="Mateus Bredoff"
          width={3840}
          height={2040}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 25%" }}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={maskTransition}
          draggable={false}
        />
      </motion.div>

      {/* Centered logo */}
      <motion.p
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-pre font-['Geist:Medium',sans-serif] font-medium mix-blend-difference"
        style={{ fontSize: 14, letterSpacing: "-0.03em", lineHeight: "109%", color: "rgb(20, 33, 38)" }}
        initial={{ opacity: 0.001 }}
        animate={{ opacity: 1 }}
        transition={logoTransition}
      >
        MATEUS BREDOFF©
      </motion.p>

      {/* Names — pinned to the bottom corners */}
      <div className={CORNERS}>
        <motion.p
          className="font-['Geist:Regular',sans-serif] uppercase mix-blend-exclusion"
          style={titleStyle}
          initial={{ opacity: 0.001, x: -150 }}
          animate={{ opacity: 1, x: 0 }}
          transition={titleTransition}
        >
          <span className="block">Mateus</span>
          <span className="block">Bredoff</span>
        </motion.p>

        <motion.p
          className="self-end text-right font-['Geist:Regular',sans-serif] uppercase mix-blend-exclusion"
          style={titleStyle}
          initial={{ opacity: 0.001, x: 150 }}
          animate={{ opacity: 1, x: 0 }}
          transition={titleTransition}
        >
          <span className="block">Brand</span>
          <span className="block">Designer</span>
        </motion.p>
      </div>
    </section>
  );
}
