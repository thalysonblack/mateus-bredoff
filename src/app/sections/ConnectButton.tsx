import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/**
 * ConnectButton — faithful rebuild of the Framer "Connect Button 2" export
 * (ConnectButton2, variants WPMDeqwDK → gy04gudYz).
 *
 * The export ships the standalone-looping _framer-runtime.js, so per our
 * workflow it's treated as a spec and reproduced with clean motion/react,
 * using the EXACT values pulled from ConnectButton2.js:
 *
 *   collapsed (WPMDeqwDK): transparent pill, radius 3, padding 8px 12px, row,
 *     "Menu" (Geist 500 / 14px / -0.04em / rgb(232,220,211)) + "+" icon.
 *     hover bg → rgba(0,0,0,0.06).
 *   open (gy04gudYz): 320px column panel, bg rgb(26,40,46) + backdrop blur(10px),
 *     radius 3, gap 32, padding 12; "+" rotates to "×"; contact links revealed.
 *   morph transition: spring { bounce: 0.2, duration: 0.4 }.
 *
 * Opens on hover (the Framer gesture) and stays open while hovered so the links
 * stay clickable; collapses on leave or when a link is chosen.
 */

const MORPH = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

const TEXT = "#e8dcd4"; // rgb(232,220,211) — collapsed label / icon
const VALUE = "#ede6e1"; // rgb(237,230,225) — link values
const LABEL = "rgba(255,255,255,0.4)"; // dim row labels
const PANEL_BG = "rgb(26, 40, 46)";

const geist = { fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 14, letterSpacing: "-0.04em", lineHeight: "100%" } as const;

type Row = { label: string; value?: string; href: string; external?: boolean };

// Page links (top group) + contact links (bottom group), verbatim from the export.
const PAGES: Row[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
];
const CONTACT: Row[] = [
  { label: "Whatsapp", value: "+55 45 9999-9999", href: "https://wa.me/554599999999", external: true },
  { label: "Email", value: "hello@mateusbredoff.com", href: "mailto:hello@mateusbredoff.com" },
  { label: "Social", value: "Instagram", href: "https://instagram.com/", external: true },
];

function PlusIcon({ open }: { open: boolean }) {
  // 11px cross built from two 1px bars; rotates 45° → "×" when open.
  return (
    <motion.span
      aria-hidden
      className="relative inline-block"
      style={{ width: 11, height: 11, flexShrink: 0 }}
      animate={{ rotate: open ? 45 : 0 }}
      transition={MORPH}
    >
      <span className="absolute left-0 top-1/2" style={{ width: 11, height: 1, background: open ? VALUE : TEXT, transform: "translateY(-50%)" }} />
      <span className="absolute left-1/2 top-0" style={{ width: 1, height: 11, background: open ? VALUE : TEXT, transform: "translateX(-50%)" }} />
    </motion.span>
  );
}

function LinkRow({ row, onChoose }: { row: Row; onChoose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={row.href}
      target={row.external ? "_blank" : undefined}
      rel={row.external ? "noopener noreferrer" : undefined}
      onClick={onChoose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center justify-between no-underline"
      style={{ ...geist, gap: 24 }}
    >
      <span style={{ color: row.value ? LABEL : VALUE, opacity: hovered ? 1 : row.value ? 1 : 0.85, transition: "color 0.25s ease, opacity 0.25s ease" }}>
        {row.label}
      </span>
      {row.value && (
        <span style={{ color: VALUE, opacity: hovered ? 1 : 0.7, transition: "opacity 0.25s ease", whiteSpace: "nowrap" }}>
          {row.value}
        </span>
      )}
    </a>
  );
}

export default function ConnectButton() {
  const [open, setOpen] = useState(false);
  const [hoverBg, setHoverBg] = useState(false);
  const close = () => setOpen(false);

  return (
    <motion.div
      className="pointer-events-auto absolute right-[12px] top-[12px] z-20 overflow-hidden"
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onMouseEnter={() => setHoverBg(true)}
      onMouseLeave={() => setHoverBg(false)}
      animate={{
        width: open ? 320 : "auto",
        backgroundColor: open ? PANEL_BG : hoverBg ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0)",
        backdropFilter: open ? "blur(10px)" : "blur(0px)",
        WebkitBackdropFilter: open ? "blur(10px)" : "blur(0px)",
      }}
      transition={MORPH}
      style={{ borderRadius: 3 }}
    >
      {/* Header row — the "Menu" trigger; collapses on click while open */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-end"
        style={{ ...geist, color: open ? VALUE : TEXT, gap: 8, padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span>Menu</span>
        <PlusIcon open={open} />
      </button>

      {/* Expanded panel content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.44, 0, 0.56, 1] }}
            className="flex flex-col"
            style={{ gap: 28, padding: "4px 12px 16px" }}
          >
            <div className="flex flex-col" style={{ gap: 12 }}>
              {PAGES.map((row) => (
                <LinkRow key={row.label} row={row} onChoose={close} />
              ))}
            </div>

            <div style={{ height: 1, width: "100%", background: "rgba(255,255,255,0.12)" }} />

            <div className="flex flex-col" style={{ gap: 12 }}>
              {CONTACT.map((row) => (
                <LinkRow key={row.label} row={row} onChoose={close} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
