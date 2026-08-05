import { useEffect } from "react";
import { useParams, Link } from "react-router";
import RodapeFramer from "../sections/framer/RodapeFramer";
import { findWork, WORK, type WorkItem } from "../../content/work";

/**
 * `/work/:slug` — UM componente para os seis cases.
 *
 * A medição confirmou que isso não é economia, é fidelidade: as páginas de
 * `stag`, `trivo`, `ferraci` e `proxima` têm **15568px e 11 imagens cada,
 * idênticas**. Alex Archer usa o mesmo template com mais blocos (17729px) e
 * Votare com menos (8503px). São itens de uma coleção de CMS, não seis páginas.
 *
 * A página tem TRÊS grades diferentes, e isso é medido, não descuido:
 *   cabeçalho        margem 32, duas colunas de 764 com calha de 8
 *   pilha de imagens margem 8,  duas colunas com calha de 8, célula de 100vh
 *   outros projetos  margem 24, duas colunas de 764 com calha de 24
 * Unificar as três num `bleed` só reproduziria a aparência e erraria as três.
 *
 * ⚠ CINCO DOS SEIS CASES ESTÃO COM LOREM IPSUM NO ORIGINAL. Só Alex Archer tem
 * texto escrito. Portar o enchimento seria trocar de tecnologia mantendo o
 * defeito; escrever por conta própria seria inventar a narrativa dos projetos
 * dele. A página mostra o trabalho e diz que o texto está por vir — ver
 * `contentPending` em `content/work.ts`.
 */

/** Rótulo de campo + valor, no vernáculo da ficha técnica do CMS dele. */
function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="fr-secao-rotulo text-[var(--fr-cinza)]">{rotulo}</p>
      <div className="fr-ficha text-[var(--fr-marrom)] pt-[10px]">{children}</div>
    </div>
  );
}

function Vizinho({ item }: { item: WorkItem }) {
  return (
    <Link to={`/work/${item.slug}`} className="relative block overflow-hidden">
      <div className="w-full" style={{ aspectRatio: "764 / 520" }}>
        <img
          src={item.cover.src}
          srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={item.cover.w}
          height={item.cover.h}
          alt={item.cover.alt}
          /* Sem `loading=lazy`: com o Lenis no comando o `scrollY` nativo fica em
             0, e imagem `lazy` abaixo da dobra nunca dispara. */
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2">
        <span className="fr-card-titulo px-1 text-white mix-blend-difference">{item.title}</span>
        <span className="flex gap-2">
          {item.disciplines.map((d) => (
            <span
              key={d}
              className="fr-rotulo rounded-[3px] bg-black/15 px-2 py-1 text-white backdrop-blur-[5px]"
            >
              {d}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const item = findWork(slug);

  useEffect(() => {
    const anterior = document.title;
    document.title = "Mateus Bredoff";
    return () => {
      document.title = anterior;
    };
  }, []);

  if (!item) {
    return (
      <div className="fr">
        <section
          className="flex min-h-svh w-full items-center"
          style={{ paddingInline: "var(--fr-margem-cabecalho)" }}
        >
          <div>
            <p className="fr-secao-rotulo text-[var(--fr-cinza)]">404</p>
            <h1 className="fr-case-titulo pt-3">Case não encontrado</h1>
            <Link to="/work" className="fr-link-quieto text-[var(--fr-cinza)] mt-8 inline-block">
              View All
            </Link>
          </div>
        </section>
        <RodapeFramer />
      </div>
    );
  }

  const outros = WORK.filter((w) => w.slug !== item.slug).slice(0, 2);

  return (
    <div className="fr">
      {/* --- hero: a capa em sangria -------------------------------------
          No original este slot é um `<video>` — e nos seis cases ele está SEM
          FONTE ("Add a video source" aparece no publicado). A capa do projeto
          entra no lugar: replicar um slot vazio seria replicar o defeito.
          100vh no desktop, 464px no mobile — medido, não é o mesmo valor. */}
      <section className="relative w-full overflow-hidden max-lg:h-[464px] lg:h-svh">
        <img
          src={item.cover.src}
          srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
          sizes="100vw"
          alt={item.cover.alt}
          fetchpriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </section>

      {/* --- cabeçalho: margem 32, duas colunas de 764 com calha de 8 ----- */}
      <header
        className="grid grid-cols-1 gap-y-8 pt-[32px] lg:grid-cols-2 lg:gap-x-[8px]"
        style={{ paddingInline: "var(--fr-margem-cabecalho)" }}
      >
        {/* Branco + `exclusion`: o nome do projeto se inverte contra o papel.
            Nenhum ancestral aqui tem transform/opacity/filter/z-index — é o que
            mantém o blend vivo em vez de pintar branco chapado sobre branco. */}
        <h1 className="fr-case-titulo text-white mix-blend-exclusion self-start">{item.title}</h1>

        <div className="flex flex-col">
          <div>
            <p className="fr-secao-rotulo text-[var(--fr-cinza)]">About</p>
            {item.about.length > 0 ? (
              <div className="flex flex-col gap-[25.6px] pt-[10px]">
                {item.about.map((p, i) => (
                  <p key={i} className="fr-case-corpo text-[#666]">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              /* O original mostra lorem ipsum aqui. Uma linha honesta é melhor
                 que enchimento portado — e some sozinha quando o texto chegar. */
              <p className="fr-case-corpo text-[#666] pt-[10px]">
                Case study in preparation.
              </p>
            )}
          </div>

          {/* 31px e 43px, não um gap único: medido, o intervalo do corpo para
              o Type é menor que o de Type para Year. */}
          <div className="pt-[31px]" />
          <Campo rotulo="Type">
            <div className="flex flex-wrap gap-x-[15px] gap-y-1">
              {item.disciplines.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </Campo>

          <div className="pt-[43px]" />
          <Campo rotulo="Year">{item.year}</Campo>
        </div>
      </header>

      {/* --- pilha de imagens: margem 8, calha 8, célula de 100vh ---------
          O ritmo do template alterna: a cada quatro peças, a segunda ocupa meia
          largura na coluna da direita e as outras sangram. É o que quebra a
          monotonia de uma pilha de telas cheias — e é o que o original faz
          (medido: as peças de índice 1 e 5 saem em 788,6px, as outras em 1585). */}
      {item.images.length > 0 ? (
        <div
          className="grid grid-cols-2 pt-[47px]"
          style={{
            paddingInline: "var(--fr-margem-pilha)",
            gap: "var(--fr-margem-pilha)",
          }}
        >
          {item.images.map((im, i) => {
            /* `meia` declarado na peça manda; sem ele, a cadência do template
               mais comum (a segunda de cada quatro). Ver o comentário em
               `WorkImage.meia`: o layout é escolha editorial por peça e nenhuma
               regra de índice acerta os dois cases que foram medidos. */
            const meia = im.meia ?? i % 4 === 1;
            return (
              <figure
                key={im.src}
                className={`overflow-hidden max-lg:h-[300px] lg:h-svh ${
                  meia ? "col-start-2" : "col-span-2"
                }`}
              >
                <img
                  src={im.src}
                  srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
                  sizes={meia ? "50vw" : "100vw"}
                  width={im.w}
                  height={im.h}
                  alt={im.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </figure>
            );
          })}
        </div>
      ) : null}

      {/* Créditos e link ficam na coluna da DIREITA, alinhados com a ficha
          técnica do cabeçalho (x=804 medido), não na margem esquerda. */}
      {item.credits.length > 0 ? (
        <div className="pt-[120px]" style={{ paddingInline: "var(--fr-margem-cabecalho)" }}>
          <div className="lg:pl-[772px]">
            <Campo rotulo="Credits">
              {item.credits.map((c) => (
                <p key={c.name}>
                  {c.name} <span className="fr-secao-rotulo text-[var(--fr-cinza)]">{c.role}</span>
                </p>
              ))}
            </Campo>
          </div>
        </div>
      ) : null}

      {item.behanceUrl ? (
        <div className="pt-[24px]" style={{ paddingInline: "var(--fr-margem-cabecalho)" }}>
          <a
            href={item.behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fr-link-quieto text-[var(--fr-cinza)] inline-block lg:ml-[772px]"
          >
            View on Behance
          </a>
        </div>
      ) : null}

      {/* --- outros projetos: margem 24, duas colunas de 764 com calha 24 -- */}
      <section className="pt-[160px] pb-[120px]" style={{ paddingInline: "var(--fr-margem)" }}>
        <div className="flex items-start justify-between gap-6">
          <h2 className="fr-manchete-case text-white mix-blend-exclusion">Other Projects</h2>
          <Link to="/work" className="fr-link-quieto text-[var(--fr-cinza)] shrink-0">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-[24px] pt-[56px] lg:grid-cols-2">
          {outros.map((o) => (
            <Vizinho key={o.slug} item={o} />
          ))}
        </div>
      </section>

      <RodapeFramer />
    </div>
  );
}
