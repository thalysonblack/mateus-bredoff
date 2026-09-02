import { Link } from "react-router";
import { Quadro } from "./sistema";
import { LAB, INSTAGRAM } from "../../content/lab";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — O LAB.
 *
 * Marcas fictícias que ele cria para testar ideia. A seção diz o que é; nenhum
 * item carrega carimbo de "fictício" — o contexto separa, a etiqueta não.
 *
 * ⚠ Ensaio sem arte no repo entra como PLACA tipográfica, não com imagem
 * emprestada. Lacuna declarada é honesta; lacuna preenchida com o trabalho de
 * outra pessoa não é.
 */
export default function LabV4() {
  useMetaRota();
  const capa = (slug: string | null) => WORK.find((w) => w.slug === slug)?.cover;

  return (
    <Quadro>
      <header style={{ padding: "clamp(120px,14vw,200px) var(--q-m) clamp(48px,6vw,80px)" }}>
        <h1 className="q-display-md" style={{ maxWidth: "24ch" }}>
          Fictional brands, built to test an idea.
        </h1>
        <p className="q-meta" style={{ paddingTop: "clamp(24px,3vw,40px)" }}>
          {LAB.length} studies ·{" "}
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="q-meta-ink">
            @sir.bredoff
          </a>
        </p>
      </header>

      <div className="q-indice" data-foca>
        {LAB.map((e) => {
          const arte = capa(e.slug);
          const miolo = (
            <>
              <span
                className="q-cel-arte"
                style={arte ? ({ ["--q-ar" as string]: `${arte.w} / ${arte.h}` } as object) : undefined}
              >
                {arte ? (
                  <img
                    src={arte.src}
                    alt={arte.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <span className="q-placa">
                    <span className="q-placa-nome">{e.brand}</span>
                  </span>
                )}
              </span>
              <span className="q-cel-legenda">
                <span className="q-cel-nome">{e.brand}</span>
                <span className="q-meta">{e.medium}</span>
              </span>
            </>
          );
          return e.slug ? (
            <Link key={e.brand} to={`/v4/work/${e.slug}`} className="q-cel">
              {miolo}
            </Link>
          ) : (
            <div key={e.brand} className="q-cel">
              {miolo}
            </div>
          );
        })}
      </div>
    </Quadro>
  );
}
