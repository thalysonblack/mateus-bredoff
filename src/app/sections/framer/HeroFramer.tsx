import { useEffect, useState } from "react";
import retrato1600 from "../../../assets/optimized/hero-portrait-1600.webp";
import retrato3200 from "../../../assets/optimized/hero-portrait-3200.webp";

/**
 * Hero: o retrato É o ambiente, e o nome sangra pela base.
 *
 * Medido no original (@1600): nome em 124px / entrelinha 110,36 / tracking
 * −3,72, caixa alta, ancorado nos dois cantos inferiores — "MATEUS BREDOFF" à
 * esquerda em x=26 e "BRAND DESIGNER" à direita terminando na margem. A base
 * da última linha encosta no fim da tela; a entrelinha MENOR que o corpo é o
 * que cola as duas linhas num bloco.
 *
 * ⚠ O texto vive sob `mix-blend-difference`: ele lê branco contra a parte
 * escura da foto e escuro contra a parte clara, sozinho. Isso morre se
 * QUALQUER ancestral criar stacking context — `transform`, `opacity`,
 * `filter`, ou `z-index` com `position`. Não envolva esta seção num wrapper
 * animado, e não "resolva" um problema de empilhamento aqui com z-index: o
 * blend apaga e o nome vira branco chapado sobre a foto clara.
 */

function Relogio() {
  /* O relógio do original é ao vivo, em BRT. Sem `suppressHydrationWarning`
     porque não há SSR aqui; o primeiro paint já é o horário certo. */
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hora = agora.toLocaleTimeString("pt-BR", {
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
  const data = agora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return (
    <span className="tabular-nums">
      {hora} BRT
      <br />
      {data}
    </span>
  );
}

export default function HeroFramer() {
  return (
    <section className="relative h-svh w-full overflow-hidden">
      <img
        src={retrato1600}
        srcSet={`${retrato1600} 1600w, ${retrato3200} 3200w`}
        sizes="100vw"
        alt="Mateus Bredoff"
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Barra de metadados — sobreposta, em creme sobre a foto. */}
      <div
        className="fr-meta absolute inset-x-0 top-0 flex items-start justify-between text-[var(--fr-creme)]"
        style={{ padding: "7px var(--fr-margem) 0" }}
      >
        <span>BREDOFF©</span>
        <Relogio />
        <span className="max-md:hidden">
          Currently
          <br />
          Available for work
        </span>
        <a href="#contato" className="hover:opacity-70">
          Menu
        </a>
      </div>

      {/* O nome. `absolute` sem z-index — ver o aviso do blend acima.
          ⚠ O modo é `exclusion`, NÃO `difference`. Os dois invertem contra o
          fundo, mas o `difference` inverte com contraste total e o `exclusion`
          amacia o meio-tom — sobre uma foto de pele e tecido a diferença é
          visível a olho nu, e foi assim que o erro apareceu. Medido no
          original: `mix-blend-mode: exclusion`.
          E o blend vai em CADA bloco, não num invólucro que abrace os dois: no
          original cada nome é sua própria camada. */}
      <div
        className="fr-nome absolute inset-x-0 bottom-0 flex items-end justify-between uppercase"
        style={{ paddingInline: "26px" }}
      >
        <span
          style={{ mixBlendMode: "exclusion", color: "#fff" }}
          aria-label="Mateus Bredoff"
        >
          Mateus
          <br />
          Bredoff
        </span>
        <span
          className="text-right max-md:hidden"
          style={{ mixBlendMode: "exclusion", color: "#fff" }}
          aria-label="Brand Designer"
        >
          Brand
          <br />
          Designer
        </span>
      </div>
    </section>
  );
}
