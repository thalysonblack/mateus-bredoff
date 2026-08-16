import { useParams, Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useCraft } from "../../hooks/useCraft";
import { findWork, WORK } from "../../content/work";
import { Hud, NavV3, LinhaSecao, RodapeV3, idx } from "../v3-system";

/**
 * `/work/:slug` — UM componente para todos os cases (o schema é a coleção
 * de `content/work.ts`, como na réplica: seis páginas quase iguais divergem no
 * primeiro ajuste).
 *
 * Na direção do visor, o case é uma FICHA DE REGISTRO: capa em sangria com o
 * título em exclusion, linha de telemetria (índice, tipo, ano, créditos),
 * corpo mono justificado, e a pilha de imagens com legenda técnica [FIG. 0X].
 * A cadência da pilha (peça de meia largura a cada quatro) vem MEDIDA da
 * réplica — o campo `meia` da peça manda quando declarado.
 *
 * Cases sem texto mostram "Case study in preparation." — lorem não se porta e
 * narrativa de cliente não se inventa (`contentPending` na coleção).
 */

export default function CaseV3() {
  const { slug } = useParams();
  const item = findWork(slug);
  useMetaRota();
  const raiz = useCraft();

  if (!item) {
    return (
      <div ref={raiz} style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
        <Hud />
        <NavV3 />
        <section className="flex min-h-svh flex-col justify-center" style={{ paddingInline: "var(--v3-margem)" }}>
          <p className="v3-rotulo v3-q" style={{ color: "var(--v3-acento)" }}>
            404
          </p>
          <h1 className="v3-display pt-6">Case not found</h1>
          <Link viewTransition to="/work" className="v3-rotulo mt-10 inline-block hover:underline">
            Back to index ↳
          </Link>
        </section>
        <RodapeV3 />
      </div>
    );
  }

  const posicao = WORK.findIndex((w) => w.slug === item.slug);
  const proximo = WORK[(posicao + 1) % WORK.length];

  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      {/* capa em sangria com o título mesclando contra ela. Exclusion, cada
          camada sua — as regras de blend deste repo valem aqui: nenhum
          ancestral com transform/opacity/filter/z-index. */}
      <section className="relative flex w-full flex-col justify-end overflow-clip max-lg:h-[464px] lg:h-svh">
        <img
          src={item.cover.src}
          srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
          sizes="100vw"
          alt={item.cover.alt}
          fetchpriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <h1
          className="pointer-events-none relative w-full text-white"
          style={{
            mixBlendMode: "exclusion",
            fontFamily: "'Geist', ui-sans-serif, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 7vw, 112px)",
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            paddingInline: "var(--v3-margem)",
            marginBottom: "-0.05em",
          }}
        >
          {item.title}
        </h1>
      </section>

      {/* linha de telemetria do case: índice, tipo, ano, créditos */}
      <section
        className="grid grid-cols-12 gap-6 border-b border-black/12 py-8 max-md:gap-y-5"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <span className="v3-micro col-span-1 max-md:col-span-3" style={{ color: "var(--v3-acento)" }}>
          {idx(posicao)}
        </span>
        <div className="col-span-3 max-md:col-span-9">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            Type
          </p>
          <p className="v3-rotulo flex flex-wrap gap-x-5 gap-y-1 pt-2">
            {item.disciplines.map((d) => (
              <span key={d} className="v3-q">
                {d}
              </span>
            ))}
          </p>
        </div>
        <div className="col-span-2 max-md:col-span-3 max-md:col-start-4">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            Year
          </p>
          <p className="v3-rotulo pt-2">{item.year}</p>
        </div>
        {item.credits.length > 0 ? (
          <div className="col-span-4 col-start-9 max-md:col-span-9 max-md:col-start-4">
            <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
              Credits
            </p>
            {item.credits.map((c) => (
              <p key={c.name} className="v3-rotulo pt-2">
                {c.name} <span style={{ color: "var(--v3-quieto)" }}>— {c.role}</span>
              </p>
            ))}
          </div>
        ) : null}
      </section>

      {/* corpo: os parágrafos DELE em mono justificado; sem texto, a linha
          honesta no lugar do enchimento */}
      <section className="grid grid-cols-12 gap-6 py-16 max-md:py-10" style={{ paddingInline: "var(--v3-margem)" }}>
        <span className="v3-rotulo v3-q col-span-3 max-md:col-span-12">About</span>
        <div className="col-span-6 col-start-5 flex flex-col gap-6 max-md:col-span-12 max-md:col-start-1">
          {item.about.length > 0 ? (
            item.about.map((p, i) => (
              <p key={i} className="v3-mono v3-justif">
                {p}
              </p>
            ))
          ) : (
            <p className="v3-mono" style={{ color: "var(--v3-quieto)" }}>
              Case study in preparation.
            </p>
          )}
          {item.behanceUrl ? (
            <a
              href={item.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-rotulo pt-2 hover:underline"
            >
              View on Behance ↳
            </a>
          ) : null}
        </div>
      </section>

      {/* pilha de imagens com legenda técnica — cadência medida da réplica:
          `meia` da peça manda; sem ele, a segunda de cada quatro recua */}
      {item.images.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-[14px] gap-y-12 pb-4 max-md:gap-y-8" style={{ paddingInline: "var(--v3-margem)" }}>
          {item.images.map((im, i) => {
            const meia = im.meia ?? i % 4 === 1;
            return (
              <figure key={im.src} className={meia ? "col-start-2 max-md:col-span-2 max-md:col-start-1" : "col-span-2"}>
                <span className="block overflow-hidden bg-black/5">
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
                    className="w-full object-cover"
                  />
                </span>
                <figcaption className="flex items-baseline justify-between gap-4 pt-3">
                  <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                    [FIG. {String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="v3-micro" style={{ color: "var(--v3-quieto)" }}>
                    {im.alt}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : null}

      {/* próximo case — o índice continua, nunca termina em beco */}
      <section className="py-20 max-md:py-12">
        <LinhaSecao rotulo="Next case" acao={{ texto: "View all", to: "/work" }} />
        <Link viewTransition
          to={`/work/${proximo.slug}`}
          className="group block border-t border-black/12 pt-8"
          style={{ paddingInline: "var(--v3-margem)" }}
        >
          <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
            {idx((posicao + 1) % WORK.length)}
          </span>
          <span
            className="block uppercase transition-opacity group-hover:opacity-60"
            style={{
              fontFamily: "'Geist', ui-sans-serif, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(34px, 5vw, 84px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              paddingTop: "12px",
            }}
          >
            {proximo.title} ↳
          </span>
        </Link>
      </section>

      <RodapeV3 />
    </div>
  );
}
