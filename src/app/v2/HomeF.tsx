import { useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — PARTIDO F: "O ALFABETO".
 *
 * Cada projeto reduzido à sua INICIAL, em corpo de cartaz, numa grade — e a
 * peça aparece dentro da letra quando o cursor pousa. Nove letras, nove marcas.
 *
 * A tese: um designer de identidade trabalha antes de tudo com a LETRA, e a
 * inicial é a forma mais reduzida de uma marca. A home vira um espécime de
 * caracteres do próprio acervo — mais próxima de uma folha de fundição do que
 * de um portfólio, e legível em meio segundo mesmo sem ler nada.
 *
 * Contra: quem não conhece os projetos não identifica "G" como Ginga sem passar
 * o cursor. É a aposta do partido — reconhecimento vs. descoberta —, e é por
 * isso que o nome inteiro aparece embaixo assim que a letra é tocada.
 */
export default function HomeF() {
  useMetaRota();
  const [ativo, setAtivo] = useState<number | null>(null);
  const w = ativo === null ? null : WORK[ativo];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section className="flex min-h-[calc(100svh-11rem)] flex-col justify-between pt-10">
        <div
          className="grid grid-cols-3 max-md:grid-cols-2"
          style={{ columnGap: "var(--p-gap-x)" }}
          data-atenua
        >
          {WORK.map((x, k) => (
            <Link
              key={x.slug}
              data-alvo
              to={`/work/${x.slug}`}
              onMouseEnter={() => setAtivo(k)}
              onMouseLeave={() => setAtivo(null)}
              onFocus={() => setAtivo(k)}
              className="p-especime-linha flex items-center justify-center py-4"
              style={{ ["--n" as string]: 1 }}
            >
              {/* a inicial, com a peça dentro dela no hover */}
              <span
                className="p-especime p-trama-nome"
                style={{
                  backgroundImage: `url(${x.cover.src2x ?? x.cover.src})`,
                  color: ativo === k ? "transparent" : "currentColor",
                  fontSize: "clamp(90px, 15vw, 210px)",
                }}
              >
                {x.title.trim().charAt(0).toUpperCase()}
              </span>
            </Link>
          ))}
        </div>

        {/* a legenda: só o projeto tocado, ou o convite */}
        <div className="flex items-baseline justify-between gap-6 pt-10 max-md:flex-col max-md:items-start">
          <p className="p-item">
            {w ? (
              <>
                {w.title}
                <span className="p-marca pl-3" style={{ color: "var(--p-quieto)" }}>
                  {w.disciplines.join(", ")} — {w.year}
                </span>
              </>
            ) : (
              <span style={{ color: "var(--p-quieto)" }}>
                Nine identities. Hover a letter.
              </span>
            )}
          </p>
          <Link to="/work" className="p-corpo p-link" style={{ color: "var(--p-quieto)" }}>
            All work →
          </Link>
        </div>
      </section>
    </Prancha>
  );
}
