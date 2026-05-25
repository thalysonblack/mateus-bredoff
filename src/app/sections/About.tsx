import { motion } from "motion/react";

/**
 * About — intro statement + "About me" copy. Faithful rebuild of the Figma
 * (node 84:28) section that sat between the hero and the projects:
 *   - big intro line: Geist Regular, #26100a, tracking -0.03em, first-line indent
 *   - "About me" label + two Geist-Medium 18px paragraphs (black/50)
 *   - hairline dividers (black/8%)
 * Responsive: 1920 design uses 24px gutters and a 4-col band; collapses to a
 * single column on small screens. Text reveals on scroll (motion whileInView).
 */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const Divider = () => <div className="h-px w-full bg-black/[0.08]" />;

export default function About() {
  return (
    <section className="w-full bg-[#f6f6f6] text-[#141414]">
      <div className="mx-auto w-full max-w-[1872px] px-6">
        <Divider />

        {/* Intro statement */}
        <motion.p
          {...reveal}
          className="font-['Geist:Regular',sans-serif] font-normal text-[#26100a] tracking-[-0.03em] leading-[1.09]"
          style={{
            fontSize: "clamp(2rem, 3.34vw, 64px)",
            maxWidth: "min(100%, 1014px)",
            textIndent: "1.5em",
            paddingTop: "clamp(3.5rem, 7vw, 6.25rem)",
            paddingBottom: "clamp(3.5rem, 7vw, 6.25rem)",
          }}
        >
          I&rsquo;m a multidisciplinary designer focused on visual identities, based in Brazil and working worldwide.
        </motion.p>

        <Divider />

        {/* About me */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-[clamp(3rem,6vw,5.5rem)] md:grid-cols-4">
          <motion.p
            {...reveal}
            className="font-['Geist:Regular',sans-serif] text-[14px] tracking-[-0.03em] text-black/40 md:col-start-1"
          >
            About me
          </motion.p>

          <motion.p
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.08 }}
            className="max-w-[355px] font-['Geist:Medium',sans-serif] font-medium text-[18px] leading-[1.45] tracking-[-0.03em] text-black/50 md:col-start-2"
          >
            My approach begins with a deep understanding of the universe in which your company operates. I analyze your business goals, your audience, your competitors, and conduct careful conceptual research to transform strategy into visual expression.
          </motion.p>

          <motion.p
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.16 }}
            className="max-w-[320px] font-['Geist:Medium',sans-serif] font-medium text-[18px] leading-[1.45] tracking-[-0.03em] text-black/50 md:col-start-3 md:col-span-2"
          >
            The result is exclusive work that combines strategic thinking with refined graphic aesthetics, designed to position brands in a clear, relevant, and memorable way.
          </motion.p>
        </div>

        <Divider />
      </div>
    </section>
  );
}
