import { Link, useParams } from "react-router";
import { WORK, findWork, type WorkImage } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { RcMoldura, RcRodape, RC, nome, capa } from "./RolinCMoldura";
import { RcLetreiro } from "./RcLetreiro";

/**
 * WORK e CASE da Rolin C (15/10). O índice é uma folha de contato de 3 por linha (a home já é a
 * coluna única); o case é ficha à esquerda + peças da coluna do centro em diante.
 * Case magro fica magro: sem `about`, a ficha mostra só metadados; sem `images`, só a capa.
 * Quando o Figma do portfólio chegar, basta preencher `about`/`images` em content/work.ts.
 */
const n2 = (i: number) => String(i + 1).padStart(2, "0");
const ANOS = `’${String(Math.min(...WORK.flatMap((w) => w.year ?? []))).slice(2)} — ’${String(Math.max(...WORK.flatMap((w) => w.year ?? []))).slice(2)}`;

export function RolinCWork() {
  useMetaRota();
  return (
    <div className="rc rcw">
      <RcMoldura atual="work" />
      <div className="rcw-cab">
        <p>All projects</p>
        <p className="rc-quieto">{ANOS}</p>
        <p className="rc-quieto rcw-conta">{String(WORK.length).padStart(2, "0")} projects</p>
      </div>
      <ol className="rcw-grade">
        {WORK.map((w, i) => {
          const c = capa(w);
          return (
            <li key={w.slug}>
              <Link to={`${RC}/work/${w.slug}`}>
                <span className="rc-quadro"><img src={c.src} srcSet={c.srcSet} width={w.cover.w} height={w.cover.h} alt={c.alt}
                  loading={i < 3 ? "eager" : "lazy"} decoding="async" draggable={false} /></span>
                <span className="rcw-leg">
                  <span className="rc-quieto">{n2(i)}</span>
                  <span>{nome(w.title)}</span>
                  <span className="rc-quieto">{w.year}</span>
                  <span className="rc-quieto rcw-tag">{w.disciplines.join(", ")}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <RcRodape />
    </div>
  );
}

/* 15/10 "as telas verticais, dá aquela variada": duas peças meia seguidas continuam em par; uma peça
   vertical SOZINHA ocupa meia largura e alterna a posição — esquerda, centro, direita */
const LUGAR = ["is-esq", "is-centro", "is-dir"] as const;
function posicoes(imgs: WorkImage[]) {
  const out: { m: WorkImage; cls?: string }[] = [];
  let n = 0;
  for (let i = 0; i < imgs.length; i++) {
    const m = imgs[i];
    if (m.meia && imgs[i + 1]?.meia) { out.push({ m, cls: "is-meia" }, { m: imgs[i + 1], cls: "is-meia" }); i++; continue; }
    if (m.meia || m.h > m.w * 1.05) { out.push({ m, cls: `is-solta ${LUGAR[n++ % 3]}` }); continue; }
    out.push({ m });
  }
  return out;
}

export function RolinCCase() {
  useMetaRota();
  const { slug } = useParams();
  const w = findWork(slug);
  if (!w) return <RolinCWork />;
  const i = WORK.indexOf(w);
  const prox = WORK[(i + 1) % WORK.length];
  const c = capa(w);
  return (
    <div className="rc rcc">
      <RcMoldura atual="work" />
      <header className="rcc-ficha">
        <div className="rcc-titulo">
          <p className="rc-quieto">{n2(i)}</p>
          <h1>{nome(w.title)}</h1>
        </div>
        <dl className="rcc-meta">
          {w.year && <div><dt className="rc-quieto">Year</dt><dd>{w.year}</dd></div>}
          <div><dt className="rc-quieto">Type</dt><dd>{w.disciplines.join(", ")}</dd></div>
          {w.credits.length > 0 && (
            <div><dt className="rc-quieto">Credits</dt><dd>{w.credits.map((k) => <span key={k.name}>{k.name} — {k.role}<br /></span>)}</dd></div>
          )}
          {w.behanceUrl && (
            <div><dt className="rc-quieto">Case</dt><dd><a href={w.behanceUrl} target="_blank" rel="noopener noreferrer">Behance ↗</a></dd></div>
          )}
        </dl>
        {w.about.length > 0 && <div className="rcc-texto">{w.about.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>}
      </header>
      <ol className="rcc-pecas">
        {/* 15/10: a capa abre o case na proporção dela (não no corte 4:3 da home); se ela é recorte de uma peça
            da galeria, não entra — senão a mesma imagem aparece duas vezes */}
        {!w.capaNaGaleria && <li><img src={c.src} srcSet={c.srcSet} width={w.cover.w} height={w.cover.h} alt={c.alt} decoding="async" /></li>}
        {posicoes(w.images).map(({ m, cls }) => (
          <li key={m.src} className={cls}>
            <img src={m.src} srcSet={m.src2x ? `${m.src} 1x, ${m.src2x} 2x` : undefined} width={m.w} height={m.h} alt={m.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ol>
      <nav className="rcc-prox" aria-label="Próximo projeto">
        <Link to={`${RC}/work`} className="rc-quieto">All projects</Link>
        <Link to={`${RC}/work/${prox.slug}`}><span className="rc-quieto">Next</span> {nome(prox.title)}</Link>
      </nav>
      {/* "era só no final do projeto" (15/10): o índice dos outros projetos fecha o case */}
      <RcLetreiro atual={w.slug} />
      <RcRodape />
    </div>
  );
}
