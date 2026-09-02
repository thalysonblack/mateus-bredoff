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
/**
 * A CADÊNCIA das seções de peça: larga → par → larga → par.
 *
 * ⚠ A peça panorâmica (mais larga que 1,6:1) nunca entra num par — ela ocupa a
 * largura cheia, porque horizontal espremida em meia coluna vira tarja. O resto
 * se emparelha de dois em dois, e uma peça sobrando fecha sozinha em largura
 * cheia em vez de ficar meia-página com um buraco ao lado.
 */
function agrupar(imgs: { src: string; src2x?: string; w: number; h: number; alt: string }[]) {
  const grupos: (typeof imgs)[] = [];
  let fila: typeof imgs = [];
  imgs.forEach((im) => {
    /* ⚠ SÓ a panorâmica vai larga. A primeira cadência mandava uma a cada três
       para a largura cheia e o Alex Archer foi de 6.712 para 11.655px — as peças
       dele são quase quadradas (3840×4040), e em largura cheia cada uma come
       1.400px de altura. A referência fecha em 9.529 com OITO seções; a régua é
       a altura da página, não a contagem de seções largas. */
    const querLarga = im.w / im.h > 1.6;
    if (querLarga && !fila.length) {
      grupos.push([im]);
      return;
    }
    fila.push(im);
    if (fila.length === 2) {
      grupos.push(fila);
      fila = [];
    }
  });
  if (fila.length) grupos.push(fila);
  return grupos;
}

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
      {/* ⚠ o header da ficha de projeto tem 720px medidos — quase o dobro da
          about (335). É a única interna com abertura alta: aqui o nome do
          projeto é o assunto, e ele precisa de ar antes da primeira peça. */}
      <header className="q-cabeca-projeto">
        <h1 className="q-display" style={{ color: CORES[w.slug]?.papel }}>
          {w.title}
        </h1>
        <p className="q-meta q-cabeca-projeto-ficha">
          <span className="q-meta-ink">{w.disciplines.join(", ")}</span>
          <span>{w.year}</span>
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

      {/**
        * ⚠ CADA PEÇA É UMA SEÇÃO, não uma pilha de imagens.
        *
        * Medido na ficha de projeto da referência (9.529px de altura): depois do
        * header de 720px vêm OITO seções de 714 a 956px, cada uma com a sua
        * composição — uma peça em largura cheia (1416×944), um par quadrado
        * (702×702) ou um par retrato (464×580). Não é uma lista de arquivos com
        * espaçamento: é um ritmo montado, e é ele que faz a página de case não
        * cansar mesmo com nove telas de altura.
        *
        * A cadência aqui alterna larga → par → larga, e a peça PANORÂMICA
        * (acima de 1,6:1) sempre puxa a largura cheia: horizontal espremida em
        * meia coluna vira tarja.
        */}
      {w.images.length > 0 &&
        agrupar(w.images).map((grupo, k) => (
          <section className={grupo.length === 1 ? "q-peca q-peca-larga" : "q-peca q-peca-par"} key={k}>
            {grupo.map((im, j) => (
              <img
                key={j}
                src={im.src}
                srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
                sizes={grupo.length === 1 ? "100vw" : "(max-width: 700px) 100vw, 50vw"}
                alt={im.alt}
                width={im.w}
                height={im.h}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
          </section>
        ))}

      <Link to={`/v4/work/${proximo.slug}`} className="q-proximo">
        <span className="q-meta">Next</span>
        <span className="q-display-md">{proximo.title}</span>
      </Link>
    </Quadro>
  );
}
