import { useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * FOLHA 02 — WORK. O índice UTILITÁRIO.
 *
 * ⭐ A decisão vem de um achado do artemshcherban: ele mantém **dois índices
 * para o mesmo acervo** — `/selected`, que é espetáculo (carrossel 3D, uma tela,
 * não rola), e `/portfolio`, que é lista tipográfica chapada, sem uma imagem
 * sequer. Um para encantar, outro para achar.
 *
 * Aqui a divisão é a mesma: a home é a folha de espécimes (o nome de cada marca
 * em corpo de cartaz) e esta rota é a TABELA — todos os nove projetos, com
 * índice, disciplina e ano, na altura de linha em que se varre uma lista com o
 * olho. Quem chegou para admirar fica na home; quem chegou para procurar vem
 * para cá.
 *
 * A grade da linha (índice · título · disciplina · ano) é a mesma proporção
 * medida no archive do corentin — `.5fr 1.5fr 1fr .5fr` —, que é a distribuição
 * que faz o título mandar sem espremer o metadado.
 *
 * A prévia é UMA imagem que troca conforme a linha percorrida, em vez de nove
 * miniaturas na tabela: o índice fica legível como texto e a peça aparece
 * grande, que é o inverso do card pequeno que não serve para nenhum dos dois.
 */
export default function WorkV2() {
  useMetaRota();
  const [ativo, setAtivo] = useState(0);
  const peca = WORK[ativo];

  return (
    <Prancha n="02" nome="Work" superficie="branco" status={`${WORK.length} projects`}>
      <div
        className="grid grid-cols-12 pt-14 max-md:pt-8"
        style={{ columnGap: "var(--p-gap-x)" }}
      >
        {/* ─ a prévia: uma só, grande, sticky ────────────────────────────
            Fica à ESQUERDA de propósito. O olho varre a lista pela esquerda,
            e com a prévia do mesmo lado o percurso do cursor cruza a imagem a
            cada linha; à direita, ela vira ilustração de canto. */}
        <div className="col-span-4 max-lg:hidden">
          <div className="sticky top-16">
            <span className="relative block overflow-hidden">
              {WORK.map((w, i) => (
                <img
                  key={w.slug}
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="33vw"
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading={i > 0 ? "lazy" : undefined}
                  decoding="async"
                  draggable={false}
                  className="w-full object-cover transition-opacity duration-300"
                  style={{
                    aspectRatio: "16 / 9",
                    opacity: ativo === i ? 1 : 0,
                    position: i === 0 ? "relative" : "absolute",
                    inset: i === 0 ? undefined : 0,
                  }}
                />
              ))}
            </span>
            <p className="p-marca flex items-baseline justify-between pt-2">
              <span>FIG. {String(ativo + 1).padStart(2, "0")}</span>
              <span>
                {peca.title} — {peca.year}
              </span>
            </p>
          </div>
        </div>

        {/* ─ a tabela ────────────────────────────────────────────────────── */}
        <div className="col-span-7 col-start-6 max-lg:col-span-12 max-lg:col-start-1" data-atenua>
          <div
            className="p-rotulo grid pb-3"
            style={{ gridTemplateColumns: ".5fr 1.5fr 1fr .5fr", columnGap: "var(--p-gap-x)" }}
          >
            <span>Nº</span>
            <span>Project</span>
            <span className="max-md:hidden">Discipline</span>
            <span className="text-right">Year</span>
          </div>

          <ul>
            {WORK.map((w, i) => (
              <li key={w.slug} className="p-fio">
                <Link
                  data-alvo
                  to={`/v2/work/${w.slug}`}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  className="p-corpo grid items-baseline py-4"
                  style={{ gridTemplateColumns: ".5fr 1.5fr 1fr .5fr", columnGap: "var(--p-gap-x)" }}
                >
                  <span style={{ color: "var(--p-quieto)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="p-item">{w.title}</span>
                  <span className="max-md:hidden" style={{ color: "var(--p-quieto)" }}>
                    {w.disciplines.join(", ")}
                  </span>
                  <span className="text-right" style={{ color: "var(--p-quieto)" }}>
                    {w.year}
                  </span>
                </Link>
              </li>
            ))}
            <li className="p-fio" />
          </ul>

          <p className="p-marca pt-6">
            Complete index — {String(WORK.length).padStart(2, "0")} projects, 2025–2026
          </p>
        </div>
      </div>
    </Prancha>
  );
}
