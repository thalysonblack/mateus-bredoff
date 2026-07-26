import { useEffect, useState } from "react";
import { Mono } from "../../system";

/**
 * Gabarito — a grade de colunas e a régua, visíveis.
 *
 * Princípio tirado do rubrikastudio.com: a estrutura da página não fica
 * implícita, ela aparece. Fios verticais de 1px marcando as colunas e uma régua
 * de escala na margem esquerda. É o gesto que mais combina com o partido deste
 * site — "a página se apresenta como documento técnico" deixa de ser metáfora e
 * passa a ser desenho.
 *
 * Fica em `position: fixed` acima do conteúdo e abaixo do grão, sem capturar
 * clique. Não é decoração: é o que revela o alinhamento das seções. Se algum
 * bloco não estiver na grade, o gabarito denuncia — e é para isso que ele serve.
 *
 * ⚠ `pointer-events: none` obrigatório, e `contain: strict` para o overlay não
 * participar do layout nem forçar recálculo a cada scroll.
 */

const COLUNAS = 12;

export default function Gabarito() {
  /* As coordenadas do canto acompanham o scroll: dado técnico de verdade em vez
     de número decorativo. Lidas de `window`, não de estado do React, para não
     provocar re-render a cada pixel. */
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setY(Math.round(window.scrollY));
      raf = requestAnimationFrame(tick);
    };
    /* Amostra a cada ~200ms em vez de a cada frame: o número não precisa de
       60fps e re-render de texto a cada frame é desperdício puro. */
    const id = window.setInterval(() => setY(Math.round(window.scrollY)), 200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
      style={{ contain: "strict" }}
    >
      {/* Colunas: o fio nasce da margem do sistema, então a grade coincide com o
          `.bleed` — se não coincidisse, ela acusaria o desalinhamento. */}
      <div
        className="absolute inset-y-0"
        style={{ left: "var(--gutter)", right: "var(--gutter)" }}
      >
        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${COLUNAS}, minmax(0,1fr))` }}>
          {Array.from({ length: COLUNAS }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: i < COLUNAS - 1 ? "1px solid var(--rule)" : "none",
                opacity: 0.45,
              }}
            />
          ))}
        </div>
      </div>

      {/* Régua de escala na margem esquerda — marcas curtas, a cada 5 uma longa */}
      <div className="absolute bottom-0 left-0 top-0 flex w-[var(--gutter)] flex-col justify-between py-[8vh]">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="block h-px"
            style={{
              width: i % 5 === 0 ? "100%" : "45%",
              background: "var(--rule)",
              opacity: i % 5 === 0 ? 0.9 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Coordenada viva: metadado, não enfeite */}
      <div className="absolute bottom-[3vh] right-[var(--gutter)] text-right">
        <Mono dim>{`y: ${String(y).padStart(5, "0")}`}</Mono>
      </div>
    </div>
  );
}
