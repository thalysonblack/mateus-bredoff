/**
 * O SHOWREEL — o vídeo que abre ao clicar na home.
 *
 * ⚠ O ARQUIVO DO VÍDEO AINDA NÃO EXISTE. `video` é `null` de propósito, e
 * enquanto for, a home mostra o frame com a capa mas NÃO finge que abre: sem
 * arquivo, um play que não toca nada é pior que play nenhum. É a mesma regra
 * que mantém os cases magros em vez de preenchidos com arte de template —
 * neste repo, inventário nunca autoriza publicação.
 *
 * Para ligar: ponha o arquivo em `src/assets/` (ou uma URL), importe aqui e
 * troque o `null`. Nada mais precisa mudar — o componente já trata os dois
 * estados.
 *
 * ⚠ A CAPA É PROVISÓRIA e está marcada como tal. Frame de reel é uma decisão
 * de edição do autor: qual instante representa o filme. Enquanto ele não
 * escolher, fica a arte do Alex Archer — o case com matéria publicada no World
 * Brand Design — e o rótulo diz "Cover" em vez de fingir que é um frame.
 */
import { WORK } from "./work";

const alexArcher = WORK.find((w) => w.slug === "alex-archer")!;

export const REEL = {
  titulo: "Showreel",
  ano: 2026,
  /** ⚠ pendente do Mateus: o arquivo do reel */
  video: null as string | null,
  /** ⚠ pendente do Mateus: o frame de capa que ELE escolher */
  capa: alexArcher.cover,
  capaProvisoria: true,
  /** duração, para a ficha. Sai junto com o vídeo. */
  duracao: null as string | null,
} as const;
