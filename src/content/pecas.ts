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
