import { Link, useParams } from "react-router";
import { Quadro } from "./sistema";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — A FICHA DE UM PROJETO.
 *
 * Capa sangrando, ficha em três campos, pilha de peças, e o próximo no pé.
 *
 * ⚠ Case com `contentPending` mostra o TRABALHO e omite o corpo de texto. No
 * Framer publicado, quatro dos seis cases estão com enchimento visível —
 * portar aquilo seria trocar de tecnologia mantendo o defeito, e escrever por
 * conta própria seria inventar a narrativa dos projetos dele.
 */
export default function CaseV4() {
  useMetaRota();
  const { slug } = useParams();
  const i = WORK.findIndex((w) => w.slug === slug);
  const w = WORK[i];
  if (!w) {
    return (
      <Quadro>
        <div style={{ padding: "clamp(140px,16vw,220px) var(--q-m)" }}>
          <p className="q-display-md">Not found.</p>
          <p className="q-meta" style={{ paddingTop: 24 }}>
            <Link to="/v4/work" className="q-meta-ink">
              Back to work
            </Link>
          </p>
        </div>
      </Quadro>
    );
  }
  const proximo = WORK[(i + 1) % WORK.length];

  return (
    <Quadro>
      <header style={{ padding: "clamp(120px,14vw,200px) var(--q-m) clamp(32px,4vw,56px)" }}>
        <h1 className="q-display" style={{ color: CORES[w.slug]?.papel }}>
          {w.title}
        </h1>
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

      <section className="q-bloco q-ficha">
        <div>
          <p className="q-meta" style={{ paddingBottom: 10 }}>
            Year
          </p>
          <p className="q-corpo">{w.year}</p>
        </div>
        <div>
          <p className="q-meta" style={{ paddingBottom: 10 }}>
            Type
          </p>
          <p className="q-corpo">{w.disciplines.join(", ")}</p>
        </div>
        <div>
          <p className="q-meta" style={{ paddingBottom: 10 }}>
            Credits
          </p>
          <p className="q-corpo">
            {w.credits.length
              ? w.credits.map((c) => `${c.name} — ${c.role}`).join(" · ")
              : "Mateus Bredoff"}
          </p>
        </div>
        {w.behanceUrl && (
          <div>
            <p className="q-meta" style={{ paddingBottom: 10 }}>
              Full case
            </p>
            <p className="q-corpo">
              <a href={w.behanceUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                Behance
              </a>
            </p>
          </div>
        )}
      </section>

      {!w.contentPending && w.about.length > 0 && (
        <section className="q-bloco" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: "62ch", display: "grid", gap: "1.1em" }}>
            {w.about.map((p, k) => (
              <p key={k} className="q-corpo" style={{ color: "var(--q-quieto)" }}>
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {w.images.length > 0 && (
        /**
         * ⚠ A pilha é de DUAS colunas, e não de peças sangrando uma sob a
         * outra. Medido: o Alex Archer tem doze peças, várias em 3840×4040 —
         * em largura cheia a página fechava em 16.338px, quase três vezes a
         * referência. Página desse tamanho não é case completo, é rolagem, e
         * ninguém chega no fim. Em duas colunas ela cai para perto de 6.000 e
         * o par lado a lado ainda ganha uma leitura que a pilha não dava.
         *
         * Quem atravessa as duas colunas é a peça PANORÂMICA (mais larga que
         * 1,6:1) — regra tirada do próprio arquivo, não escolhida a dedo: peça
         * horizontal espremida em meia coluna vira tarja, e peça vertical
         * atravessando duas colunas vira parede. O campo `meia` do CMS dele,
         * quando vier preenchido, manda acima disso.
         */
        <section className="q-pilha">
          {w.images.map((im, k) => (
            <img
              key={k}
              src={im.src}
              srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
              sizes="(max-width: 700px) 100vw, 50vw"
              alt={im.alt}
              width={im.w}
              height={im.h}
              className={
                im.meia === true ? undefined : im.w / im.h > 1.6 ? "q-pilha-larga" : undefined
              }
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ))}
        </section>
      )}

      <Link to={`/v4/work/${proximo.slug}`} className="q-proximo">
        <span className="q-meta">Next</span>
        <span className="q-display-md">{proximo.title}</span>
      </Link>
    </Quadro>
  );
}
