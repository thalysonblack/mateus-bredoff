import { motion } from "motion/react";
import { Mono, Rule, Bracket, SectionHead, reveal, revealDelay, idx } from "../system";

/**
 * Contact — fecho escuro.
 *
 * A chamada em caixa alta gigante e os canais remontados como registros: índice,
 * canal, endereço. O rodapé fecha com a linha de metadados que abriu a página,
 * agora resumida — abre e fecha com o mesmo gesto.
 *
 * As cores quietas saem do token --dim (5,9:1 sobre preto). A versão anterior
 * precisava de um comentário explicando por que #5e686c tinha sido levantado
 * para branco@45%; agora o piso é do sistema e não se decide por seção.
 *
 * Endereços ainda são placeholder — ver pendências no CLAUDE.md.
 */

const CHANNELS = [
  { label: "E-mail", value: "hello@mateusbredoff.com", href: "mailto:hello@mateusbredoff.com" },
  { label: "Behance", value: "behance.net/mateusbredoff", href: "https://www.behance.net/" },
  { label: "Instagram", value: "@mateusbredoff", href: "https://instagram.com/" },
  { label: "X", value: "@mateusbredoff", href: "https://x.com/" },
];

export default function Footer() {
  return (
    <footer id="contact" className="on-ink w-full">
      <div className="bleed pb-4 pt-[clamp(3rem,7vw,7rem)]">
        <SectionHead left="Contact" right="Available for work" />

        <motion.h2
          {...reveal}
          className="t-display pb-[clamp(2.5rem,6vw,5rem)]"
          style={{ fontSize: "clamp(2.75rem, 11.6vw, 208px)", lineHeight: 0.88 }}
        >
          Let&rsquo;s Talk
        </motion.h2>

        {/* Canais como registros */}
        <div>
          {CHANNELS.map((c, i) => (
            <motion.div key={c.label} {...revealDelay(i, 0.05)}>
              <Rule />
              <a
                href={c.href}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-baseline gap-[clamp(1rem,4vw,5rem)] py-[clamp(0.875rem,1.8vw,1.5rem)]"
              >
                <Mono dim className="shrink-0">
                  {idx(i)}
                </Mono>
                <Mono size={12} className="flex-1">
                  {c.label}
                </Mono>
                <Mono size={12} dim className="text-right transition-colors duration-300 group-hover:text-[var(--fg)]">
                  {c.value}
                </Mono>
              </a>
            </motion.div>
          ))}
          <Rule />
        </div>

        {/* Linha final — o mesmo gesto de metadados que abriu a página */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
          <Mono dim>© 2026 Mateus Bredoff</Mono>
          <Mono dim className="hidden sm:block">
            Brazil / Worldwide
          </Mono>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="link-quiet"
          >
            <Bracket>Back to top</Bracket>
          </button>
        </div>
      </div>
    </footer>
  );
}
