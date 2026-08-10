import { Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import { findWork, type WorkImage } from "../../content/work";
import { Hud, NavV3, LinhaSecao, RodapeV3 } from "../v3-system";

/**
 * `/v3/lab` — a GALERIA, refeita como a /gallery da referência de verdade
 * (10/08: "a página de lab vc não fez como pedi" — a primeira versão saiu
 * como placas de texto; a referência é FOTO espalhada, sem legenda).
 *
 * Contact sheet: linhas de quadros de tamanhos variados, sangrando nas
 * bordas, com muito respiro vertical — e nenhum texto por foto. O material
 * é o acervo real do repo: as peças do Alex Archer e as capas de Bureau e
 * Neox (os ensaios do lab que têm arte publicada). Fortis, Hōki e Bovine
 * Beats entram quando as artes do Instagram chegarem — a grade só cresce.
 *
 * Cada foto leva ao case de origem; a galeria é vitrine, não beco.
 */

type Quadro = {
  img: WorkImage;
  slug: string;
  /** posição, largura e deslocamento vertical — a dispersão é o layout */
  classe: string;
};

function montarQuadros(): Quadro[] {
  const aa = findWork("alex-archer");
  const bureau = findWork("bureau");
  const neox = findWork("neox");
  if (!aa || !bureau || !neox) return [];

  const fotos: { img: WorkImage; slug: string }[] = [
    { img: aa.cover, slug: aa.slug },
    ...aa.images.map((img) => ({ img, slug: aa.slug })),
    { img: bureau.cover, slug: bureau.slug },
    { img: neox.cover, slug: neox.slug },
  ];

  /* a dispersão da referência: 5-4-5 por linha, larguras 2/3 colunas,
     deslocamentos verticais quebrando a régua, pontas sangrando */
  const mapa = [
    "col-span-2 col-start-1 -ml-[24px] mt-0",
    "col-span-3 col-start-4 mt-16",
    "col-span-3 col-start-7 mt-4",
    "col-span-2 col-start-10 mt-24",
    "col-span-2 col-start-12 -mr-[24px] mt-8",
    "col-span-2 col-start-2 mt-40",
    "col-span-3 col-start-5 mt-24",
    "col-span-2 col-start-8 mt-48",
    "col-span-3 col-start-10 mt-16",
    "col-span-2 col-start-1 -ml-[24px] mt-32",
    "col-span-3 col-start-4 mt-12",
    "col-span-2 col-start-7 mt-44",
    "col-span-3 col-start-9 mt-20",
    "col-span-2 col-start-12 -mr-[24px] mt-36",
  ];

  return fotos.slice(0, mapa.length).map((f, i) => ({ ...f, classe: mapa[i] }));
}

const QUADROS = montarQuadros();

export default function LabV3() {
  useMetaRota();
  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      <section className="pb-24 pt-28 max-md:pb-14">
        <LinhaSecao rotulo="AI Lab" extra={`[${String(QUADROS.length).padStart(2, "0")}]`} />

        {/* o contact sheet — foto pura, sem legenda, como a referência */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-40 max-lg:gap-y-10 max-md:grid-cols-2 max-md:gap-x-3" style={{ paddingInline: "var(--v3-margem)" }}>
          {QUADROS.map((q, i) => (
            <Link
              key={`${q.img.src}-${i}`}
              to={`/v3/work/${q.slug}`}
              className={`group relative block max-md:col-span-1 max-md:col-start-auto max-md:m-0 ${q.classe}`}
              aria-label={q.img.alt}
            >
              <img
                src={q.img.src}
                srcSet={q.img.src2x ? `${q.img.src} 1400w, ${q.img.src2x} 2200w` : undefined}
                sizes="(min-width: 1024px) 25vw, 46vw"
                alt={q.img.alt}
                width={q.img.w}
                height={q.img.h}
                loading={i > 3 ? "lazy" : undefined}
                decoding="async"
                draggable={false}
                className="w-full object-cover"
                style={{ aspectRatio: `${q.img.w} / ${q.img.h}` }}
              />
              <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
            </Link>
          ))}
        </div>

        <div className="mt-28 border-t border-black/12 pt-6 max-md:mt-14" style={{ marginInline: "var(--v3-margem)" }}>
          <a
            href="https://www.instagram.com/sir.bredoff"
            target="_blank"
            rel="noopener noreferrer"
            className="v3-rotulo hover:underline"
          >
            Follow the lab <span className="v3-seta">↳</span>
          </a>
        </div>
      </section>

      <RodapeV3 />
    </div>
  );
}
