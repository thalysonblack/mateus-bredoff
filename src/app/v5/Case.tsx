import { Link, useParams } from "react-router";
import "../../styles/v5.css";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V5 — A FICHA, na superfície do palco.
 *
 * A home apresenta uma peça por tela; a ficha abre a pilha inteira do projeto na
 * mesma tinta. Trocar para o branco aqui quebraria o registro que a direção
 * inteira sustenta — contraste de superfície é entre DIREÇÕES, não dentro de uma.
 *
 * ⚠ Case com `contentPending` mostra o trabalho e omite o corpo: sete dos oito
 * ainda não têm texto escrito pelo Mateus, e enchimento visível é o defeito que
 * o Framer publicado já tem.
 */
export default function CaseV5() {
  useMetaRota();
  const { slug } = useParams();
  const i = WORK.findIndex((w) => w.slug === slug);
  const w = WORK[i];

  if (!w) {
    return (
      <div className="p5">
        <div className="p5-bloco">
          <p className="p5-manchete">Not found.</p>
          <p className="p5-meta" style={{ paddingTop: 20 }}>
            <Link to="/v5" className="p5-meta-vivo">
              Back to the stage
            </Link>
          </p>
        </div>
      </div>
    );
  }
  const proximo = WORK[(i + 1) % WORK.length];

  return (
    <div className="p5">
      <nav className="p5-nav">
        <Link to="/v5" className="p5-marca">
          Mateus Bredoff
        </Link>
        <Link to="/v5#palco">Work</Link>
      </nav>

      <header className="p5-bloco" style={{ paddingBottom: "clamp(36px,4vw,56px)" }}>
        <h1 className="p5-manchete" style={{ color: CORES[w.slug]?.tinta }}>
          {w.title}
        </h1>
        <p className="p5-meta" style={{ paddingTop: 16, display: "flex", gap: 28, flexWrap: "wrap" }}>
          <span className="p5-meta-vivo">{w.disciplines.join(", ")}</span>
          <span>{w.year}</span>
          {w.behanceUrl && (
            <a href={w.behanceUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
              Full case on Behance
            </a>
          )}
        </p>
      </header>

      <img
        src={w.cover.src}
        srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
        sizes="100vw"
        alt={w.cover.alt}
        width={w.cover.w}
        height={w.cover.h}
        style={{ width: "100%", height: "auto", display: "block" }}
        decoding="async"
        draggable={false}
      />

      {!w.contentPending && w.about.length > 0 && (
        <section className="p5-bloco">
          <div style={{ maxWidth: "60ch", display: "grid", gap: "1.1em" }}>
            {w.about.map((p, k) => (
              <p key={k} className="p5-linha-corpo">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {w.images.map((im, k) => (
        <img
          key={k}
          src={im.src}
          srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
          sizes="100vw"
          alt={im.alt}
          width={im.w}
          height={im.h}
          style={{ width: "100%", height: "auto", display: "block", marginTop: "var(--p5-m)" }}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}

      <Link to={`/v5/work/${proximo.slug}`} className="p5-fecho" style={{ display: "block", marginTop: "var(--p5-m)" }}>
        <p className="p5-meta" style={{ paddingBottom: 10 }}>
          Next
        </p>
        <p className="p5-convite" style={{ color: CORES[proximo.slug]?.tinta }}>
          {proximo.title}
        </p>
      </Link>
    </div>
  );
}
