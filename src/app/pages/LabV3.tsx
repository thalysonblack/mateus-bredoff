import { Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import { findWork, type WorkImage } from "../../content/work";
import { LAB, LAB_CONTADOR, INSTAGRAM } from "../../content/lab";
import { Hud, NavV3, LinhaSecao, RodapeV3, idx } from "../v3-system";

/**
 * `/lab` — a GALERIA, na mecânica da /gallery da referência de verdade
 * (10/08: "a página de lab vc não fez como pedi" — a primeira versão saiu
 * como placas de texto; a referência é FOTO espalhada, sem legenda).
 *
 * Contact sheet: quadros de tamanhos variados, sangrando nas bordas, sem
 * texto por foto. O material é o acervo real do repo — as peças do Alex
 * Archer e as capas de Bureau e Neox, os ensaios que já têm arte publicada.
 *
 * ## Duas correções de 15/08, e o porquê de cada uma
 *
 * **O índice de ensaios voltou ao topo.** Sem ele a página inteira era foto de
 * um projeto só: onze dos treze quadros são do Alex Archer, e Fortis, Hōki e
 * Bovine Beats — metade do lab — simplesmente não existiam nesta rota. O
 * índice não é a "placa de texto" reprovada, que era o CORPO da página; é a
 * linha que diz de quantos ensaios a galeria abaixo é feita. A galeria segue
 * sendo foto pura.
 *
 * **O contador conta ENSAIOS, não quadros.** A nav dizia `[06]` e a página
 * dizia `[13]` — o mesmo rótulo com dois números. Os dois agora saem de
 * `content/lab.ts`; ver o cabeçalho de lá.
 *
 * ⚠ A dispersão vertical foi comprimida. O mapa anterior somava `gap-y-40`
 * (160px) com deslocamentos de até `mt-48` (192px), e as linhas abriam buracos
 * de mais de 350px de papel liso — que na tela não lê como respiro, lê como
 * página quebrada. Esparso é o desalinhamento, não o vão.
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
     deslocamentos verticais quebrando a régua, pontas sangrando.

     ⚠ Os deslocamentos ficam dentro de ~96px (`mt-24`) porque eles SOMAM com o
     `gap-y` da grade: com `gap-y-40` + `mt-48` a mesma linha abria 352px de
     papel liso, e a página lia como quebrada em vez de esparsa. O que faz o
     contact sheet é a quebra da régua horizontal, não o tamanho do vão. */
  const mapa = [
    "col-span-2 col-start-1 -ml-[24px] mt-0",
    "col-span-3 col-start-4 mt-10",
    "col-span-3 col-start-7 mt-2",
    "col-span-2 col-start-10 mt-16",
    "col-span-2 col-start-12 -mr-[24px] mt-6",
    "col-span-2 col-start-2 mt-20",
    "col-span-3 col-start-5 mt-8",
    "col-span-2 col-start-8 mt-24",
    "col-span-3 col-start-10 mt-4",
    "col-span-2 col-start-1 -ml-[24px] mt-14",
    "col-span-3 col-start-4 mt-2",
    "col-span-2 col-start-7 mt-20",
    "col-span-3 col-start-9 mt-6",
    "col-span-2 col-start-12 -mr-[24px] mt-16",
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
        <LinhaSecao rotulo="AI Lab" extra={`[${LAB_CONTADOR}]`} />

        {/* Índice dos ensaios: uma linha, não uma tabela. É o que impede a
            página de ler como galeria de um projeto só — Fortis, Hōki e Bovine
            Beats não têm arte no repo e sem isto sumiriam da própria rota que
            os representa. Nome em corpo de leitura, disciplina em quieto. */}
        <ul
          className="flex flex-wrap items-baseline gap-x-10 gap-y-3 pb-16 max-md:gap-x-6 max-md:pb-10"
          style={{ paddingInline: "var(--v3-margem)" }}
        >
          {LAB.map((e, i) => (
            <li key={e.brand} className="flex items-baseline gap-2">
              <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                {idx(i)}
              </span>
              <span className="v3-rotulo">{e.brand}</span>
              <span className="v3-micro" style={{ color: "var(--v3-quieto)" }}>
                {e.discipline}
              </span>
            </li>
          ))}
        </ul>

        {/* o contact sheet — foto pura, sem legenda, como a referência */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-24 max-lg:gap-y-10 max-md:grid-cols-2 max-md:gap-x-3" style={{ paddingInline: "var(--v3-margem)" }}>
          {QUADROS.map((q, i) => (
            <Link
              key={`${q.img.src}-${i}`}
              to={`/work/${q.slug}`}
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
            href={INSTAGRAM}
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
