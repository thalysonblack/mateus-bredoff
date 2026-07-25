import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Primitivas do sistema editorial.
 *
 * O vernáculo das referências (TITARVL / WIDE ANGLE® / All In®) é muito
 * específico e se repete em toda página: rótulo mono em caixa alta, índice de
 * três dígitos, ação entre colchetes com as letras abertas, fio de 1px entre
 * registros, par de rótulos ancorado nos cantos abrindo cada seção.
 *
 * Vive aqui para não virar dialeto: quem escreve seção nova usa estas peças,
 * não recria a aparência delas na mão.
 */

export const ease = [0.16, 1, 0.3, 1] as const;

/** Revelação padrão: sobe pouco, sem bounce. Motion é assinatura, não enfeite. */
export const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.9, ease },
};

export const revealDelay = (i: number, step = 0.06) => ({
  ...reveal,
  transition: { ...reveal.transition, delay: i * step },
});

/** Fio de 1px. É ele que transforma lista em tabela e seção em registro. */
export function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

/** Rótulo mono caixa-alta — a unidade de texto mais comum do sistema. */
export function Mono({
  children,
  dim = false,
  size = 11,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  dim?: boolean;
  size?: 11 | 12;
  as?: "span" | "p" | "div" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={`t-mono ${size === 12 ? "t-mono-12" : ""} ${dim ? "dim" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * Ação entre colchetes: [ V E R  T U D O ].
 * As letras abrem dentro do colchete — é assim que a referência marca o que é
 * clicável sem usar botão. O espaço extra final compensa o tracking, senão o
 * colchete de fechamento cola na última letra.
 */
export function Bracket({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`t-mono inline-flex items-center gap-[0.5em] ${className}`}>
      <span aria-hidden="true">[</span>
      <span style={{ letterSpacing: "0.24em", paddingRight: "0.24em" }}>{children}</span>
      <span aria-hidden="true">]</span>
    </span>
  );
}

/** Índice de três dígitos: 001, 002… numera o trabalho e dá lastro de arquivo. */
export const idx = (n: number) => String(n + 1).padStart(3, "0");

/**
 * Cabeça de seção: dois rótulos ancorados nos cantos opostos, fio embaixo.
 * O que a seção é (esquerda) e como ela se chama por dentro (direita).
 */
export function SectionHead({
  left,
  right,
  className = "",
}: {
  left: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Rule />
      <motion.div
        {...reveal}
        className="flex items-baseline justify-between gap-6 pb-[clamp(2.5rem,6vw,5rem)] pt-3"
      >
        <Mono>{left}</Mono>
        {right ? <Mono dim>{right}</Mono> : null}
      </motion.div>
    </div>
  );
}

/**
 * Legenda técnica de mídia: índice à esquerda, nome à direita, na largura
 * exata do que ela legenda. É o que faz a grade parecer contact sheet.
 */
export function Caption({
  index,
  label,
  meta,
}: {
  index: number;
  label: string;
  meta?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 pt-2">
      <Mono dim>{idx(index)}</Mono>
      <Mono className="text-right">
        {label}
        {meta ? <span className="dim">{` / ${meta}`}</span> : null}
      </Mono>
    </div>
  );
}
