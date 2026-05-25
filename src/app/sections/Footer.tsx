import { motion } from "motion/react";

/**
 * Footer — Figma node 84:29 ("Lets Talk"). Dark #19272d section: a "Contact"
 * label, the big "Lets Talk" heading + contact links, a top-right page nav, and
 * a bottom © 2026 / Back to top row between hairlines. Geist, fluid up to 64px.
 * Links are placeholders until the real handles are provided.
 */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const LINKS = [
  { label: "E-mail", href: "mailto:hello@mateusbredoff.com", color: "#5e686c" },
  { label: "Behance", href: "https://www.behance.net/", color: "rgba(255,255,255,0.3)" },
  { label: "Instagram", href: "https://instagram.com/", color: "rgba(255,255,255,0.3)" },
  { label: "x.com", href: "https://x.com/", color: "rgba(255,255,255,0.3)" },
];

const NAV = [
  { label: "Home", active: true },
  { label: "Works" },
  { label: "About" },
  { label: "Archive" },
];

const bigText = {
  fontFamily: "'Geist:Regular', Geist, sans-serif",
  fontSize: "clamp(2.25rem, 3.34vw, 64px)",
  lineHeight: 1.09,
  letterSpacing: "-0.03em",
} as const;

export default function Footer() {
  return (
    <footer className="w-full bg-[#19272d] text-white">
      <div className="mx-auto w-full max-w-[1872px] px-6 pb-7 pt-[clamp(3rem,6vw,5rem)]">
        <div className="h-px w-full bg-white/[0.13]" />

        {/* Main */}
        <div className="grid grid-cols-1 gap-y-12 py-[clamp(3rem,7vw,7rem)] md:grid-cols-[auto_1fr_auto] md:gap-x-12">
          {/* Contact label */}
          <motion.p {...reveal} className="font-['Geist:Regular',sans-serif] text-[14px] tracking-[-0.03em] text-white/50">
            Contact
          </motion.p>

          {/* Lets Talk + links */}
          <div className="flex flex-col">
            <motion.p {...reveal} style={bigText} className="mb-[clamp(1.5rem,3vw,3rem)] text-[#f6f6f6]">
              Lets Talk
            </motion.p>
            <div className="flex flex-col gap-[clamp(0.25rem,0.6vw,0.5rem)]">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.05 }}
                  style={{ ...bigText, color: l.color, transition: "color 0.3s ease" }}
                  className="w-fit hover:!text-white"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Page nav */}
          <motion.nav {...reveal} className="flex flex-col gap-[12px] text-right font-['Geist:Regular',sans-serif] text-[20px] tracking-[-0.03em] leading-[1.09] md:justify-self-end">
            {NAV.map((n) => (
              <a key={n.label} href="#" style={{ color: n.active ? "#ffffff" : "rgba(255,255,255,0.5)", transition: "color 0.3s ease" }} className="hover:!text-white">
                {n.label}
              </a>
            ))}
          </motion.nav>
        </div>

        {/* Bottom row */}
        <div className="h-px w-full bg-white/[0.13]" />
        <div className="flex items-center justify-between pt-4 font-['Geist:Medium',sans-serif] text-[16px] tracking-[-0.04em] text-white/45">
          <span>© 2026</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="transition-colors hover:text-white/80">
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
