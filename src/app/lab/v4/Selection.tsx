import type { ReactNode } from "react";
import { Mono } from "../../system";

/**
 * Selection — a peça aparece SELECIONADA, como objeto num editor aberto.
 *
 * É o partido central desta versão. Em vez de "a página como documento técnico"
 * (fio, rótulo, índice), aqui é **a página como arquivo de design aberto**: cada
 * peça vem com moldura de seleção, alças nos cantos e uma tag identificando o
 * objeto. O visitante não olha um site sobre design — olha por cima do ombro de
 * quem está desenhando.
 *
 * O princípio vem de uma referência que ele mandou; a execução é nossa. Lá a cor
 * de seleção é magenta, aqui é o acento do próprio sistema — copiar a cor seria
 * vestir a identidade de outro estúdio.
 *
 * ⚠ Tudo decorativo aqui é `aria-hidden` + `pointer-events: none`. A moldura não
 * pode entrar na árvore de acessibilidade (é ruído para leitor de tela) nem
 * roubar o clique da peça que ela emoldura.
 *
 * ⚠ As alças ficam DENTRO da caixa (`inset: -1px` seria o correto num editor de
 * verdade, mas aqui vazaria para fora do contêiner e criaria overflow
 * horizontal na sangria). Meio pixel de imprecisão física em troca de layout
 * que não estoura.
 */

type Props = {
  children: ReactNode;
  /** Rótulo do objeto — o que apareceria na camada selecionada. */
  label: string;
  /** Rótulo secundário, à direita da tag. */
  meta?: string;
  /** Guia vertical saindo do objeto, como no snap de um editor. */
  guide?: boolean;
  className?: string;
};

const HANDLE = 6;

export default function Selection({ children, label, meta, guide = false, className = "" }: Props) {
  return (
    <div className={`group relative ${className}`}>
      {children}

      {/* Moldura + alças. A moldura só acende no hover: seleção permanente em
          sete peças ao mesmo tempo viraria poluição, e o que se quer é a
          sensação de que a peça PODE ser selecionada. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{ outline: "1px solid var(--acc)", outlineOffset: "-1px" }}
      >
        {[
          { top: 0, left: 0 },
          { top: 0, right: 0 },
          { bottom: 0, left: 0 },
          { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              ...pos,
              width: HANDLE,
              height: HANDLE,
              background: "var(--bg)",
              outline: "1px solid var(--acc)",
            }}
          />
        ))}
      </div>

      {/* Tag do objeto — sempre visível, é o que identifica a peça */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-0 flex translate-y-[-100%] items-center gap-2 px-[0.5em] py-[0.25em]"
        style={{ background: "var(--acc)", color: "var(--bg)" }}
      >
        <Mono>{label}</Mono>
        {meta ? <Mono>{meta}</Mono> : null}
      </div>

      {/* Guia de snap: desce do objeto e atravessa o bloco */}
      {guide ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-full hidden w-px md:block"
          style={{ height: "clamp(2rem,6vw,6rem)", background: "var(--acc)", opacity: 0.5 }}
        />
      ) : null}
    </div>
  );
}
