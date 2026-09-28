/**
 * PEÇAS POR PROJETO — o material que a home diagrama no hover (28/09).
 *
 * Vêm das páginas publicadas no Behance dele (4 por projeto, 1400px, WebP),
 * em `assets/optimized/hover/<slug>-N.webp`. São obra dele e publicada — não
 * o stock do template do Framer (ver CLAUDE.md). A Ferraci não tem página no
 * Behance: fica só com a capa.
 */
import { WORK } from "./work";

const arquivos = import.meta.glob("../assets/optimized/hover/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const PECAS: Record<string, string[]> = Object.fromEntries(
  WORK.map((w) => {
    const achadas = Object.keys(arquivos)
      .filter((k) => k.split("/").pop()!.startsWith(`${w.slug}-`))
      .sort()
      .map((k) => arquivos[k]);
    return [w.slug, achadas.length ? achadas : [w.cover.src2x ?? w.cover.src]];
  }),
);
