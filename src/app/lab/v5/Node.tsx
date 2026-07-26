import type { ReactNode } from "react";
import { Mono } from "../../system";

/**
 * Node — cada bloco da página é um NÓ de canvas.
 *
 * O partido desta versão não é "Figma": é **canvas de nós de IA**, do tipo
 * Flora / ComfyUI — cabeçalho com tipo e nome do nó, portas de entrada e saída
 * nas laterais, e fios ligando um nó ao outro (ver `Wires.tsx`).
 *
 * A razão é de identidade, não de moda: o Mateus se assina "Brand Designer, Art
 * Director & AI Creative", é Creative Partner da Flora e trabalha de forma
 * experimental. Um portfólio dele que se apresenta como grafo de nós **diz o que
 * ele faz pela própria forma** — a página passa a ser um artefato do método dele
 * em vez de uma vitrine com estética emprestada.
 *
 * ⚠ `data-node` é o gancho que `Wires` usa para medir posição e desenhar os fios.
 * Se renomear, os fios desaparecem sem erro nenhum.
 *
 * ⚠ Cabeçalho e portas são `aria-hidden`: são cenografia da ferramenta. O
 * conteúdo real do nó continua sendo lido normalmente pelo leitor de tela.
 */

type Props = {
  id: string;
  /** Tipo do nó, no vernáculo da ferramenta: INPUT, IMAGE, TEXT, OUTPUT… */
  kind: string;
  name: string;
  children: ReactNode;
  /** Mostra a porta de entrada (à esquerda) — o primeiro nó não tem. */
  inPort?: boolean;
  /** Mostra a porta de saída (à direita) — o último não tem. */
  outPort?: boolean;
  className?: string;
};

function Port({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-[1.15rem] block h-[9px] w-[9px] -translate-y-1/2"
      style={{
        [side]: "-5px",
        background: "var(--bg)",
        border: "1px solid var(--acc)",
        borderRadius: "50%",
      }}
    />
  );
}

export default function Node({
  id,
  kind,
  name,
  children,
  inPort = true,
  outPort = true,
  className = "",
}: Props) {
  return (
    <div
      data-node={id}
      className={`relative ${className}`}
      style={{ border: "1px solid var(--rule)", background: "var(--bg)" }}
    >
      {/* Cabeçalho do nó: tipo à esquerda, nome à direita */}
      <div
        aria-hidden="true"
        className="flex items-baseline justify-between gap-4 px-[clamp(0.75rem,1.2vw,1rem)] py-[0.5rem]"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <span className="flex items-center gap-2">
          <span className="block h-[6px] w-[6px]" style={{ background: "var(--acc)" }} />
          <Mono>{kind}</Mono>
        </span>
        <Mono dim>{name}</Mono>
      </div>

      {inPort ? <Port side="left" /> : null}
      {outPort ? <Port side="right" /> : null}

      {children}
    </div>
  );
}
