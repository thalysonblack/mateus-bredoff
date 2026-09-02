import { Link } from "react-router";
import { Quadro } from "./sistema";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — O ÍNDICE COMPLETO.
 *
 * A home mostra o acervo como grade; aqui ele vira LISTA, porque a pergunta da
 * página é outra. Na home a pessoa está decidindo se fica; aqui ela já ficou e
 * quer varrer — e varrer se faz em linha, com o nome grande e o ano na ponta.
 *
 * A capa não some: ela aparece na própria linha, em faixa recortada, e só entra
 * em foco quando a linha é alcançada. Uma peça por vez, no lugar onde o olho já
 * está.
 */
export default function WorkV4() {
  useMetaRota();
  return (
    <Quadro>
      <header className="q-cabeca q-cabeca-baixa">
        <h1 className="q-display-md" style={{ maxWidth: "20ch" }}>
          Selected work
        </h1>
      </header>

      <section>
        {WORK.map((w) => (
          <Link
            key={w.slug}
            to={`/v4/work/${w.slug}`}
            className="q-linha"
            style={{ ["--q-cor" as string]: CORES[w.slug]?.papel }}
          >
            <span className="q-linha-nome">{w.title}</span>
            <span className="q-linha-arte">
              <img
                src={w.cover.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </span>
            <span className="q-meta q-linha-disc">{w.disciplines.join(", ")}</span>
            <span className="q-meta">{w.year}</span>
          </Link>
        ))}
      </section>
    </Quadro>
  );
}
