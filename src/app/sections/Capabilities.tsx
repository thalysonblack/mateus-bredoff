import { motion } from "motion/react";
import imgEditorial from "../../assets/optimized/capabilities-editorial-800.webp";

/**
 * Capabilities — Figma node 84:56/63/135. A "Capabilities" label (left), the
 * big services list (Branding highlighted #26100a, the rest muted
 * rgba(20,33,39,0.5)), and a 306×306 image card on the right.
 * Geist Regular, fluid up to 64px, tracking -0.03em. Reveals on scroll.
 */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const ITEMS = [
  { label: "Branding", active: true },
  { label: "Art Direction" },
  { label: "Creative Direction" },
  { label: "Digital Design" },
  { label: "Brand Strategy" },
] as const;

export default function Capabilities() {
  return (
    <section className="w-full bg-[#f6f6f6] text-[#141414]">
      <div className="mx-auto w-full max-w-[1872px] px-6 py-[clamp(4rem,9vw,8rem)]">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-[25%_1fr_306px] md:items-start md:gap-x-10">
          {/* Label */}
          <motion.p {...reveal} className="font-['Geist:Regular',sans-serif] text-[14px] tracking-[-0.03em] text-black/40">
            Capabilities
          </motion.p>

          {/* Services list */}
          <div
            className="flex flex-col font-['Geist:Regular',sans-serif] tracking-[-0.03em] leading-[1.09]"
            style={{ fontSize: "clamp(2rem, 3.34vw, 64px)", gap: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
          >
            {ITEMS.map((it, i) => (
              <motion.span
                key={it.label}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                style={{ color: it.active ? "#26100a" : "rgba(20,33,39,0.5)" }}
              >
                {it.label}
              </motion.span>
            ))}
          </div>

          {/* Image card */}
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.1 }}
            className="hidden overflow-hidden rounded-[4px] bg-[rgba(20,33,39,0.09)] md:block"
            style={{ width: 306, height: 306, justifySelf: "end" }}
          >
            <img src={imgEditorial} alt="" width={800} height={534} loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
