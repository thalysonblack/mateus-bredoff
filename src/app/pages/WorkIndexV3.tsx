import { Link } from "react-router";
import { useMetaRota } from "../../hooks/useMetaRota";
import { WORK } from "../../content/work";
import { Hud, NavV3, LinhaSecao, Display, RodapeV3, idx } from "../v3-system";

/**
 * `/v3/work` — o índice de trabalho na direção "portfólio como visor".
 *
 * Estrutura DIFERENTE do carrossel da home, de propósito (a mesma peça duas
 * vezes leria como eco): aqui o índice é uma TABELA DE REGISTROS — cada case é
 * uma linha sob fio, com [0X], thumb de contact sheet, título em display,
 * disciplinas em mono e ano na ponta. A linha inteira é o link.
 *
 * O intervalo de anos do cabeçalho é COMPUTADO da coleção — um case novo em
 * `content/work.ts` atualiza o rótulo sozinho, sem lista paralela.
 */

const anos = WORK.map((w) => w.year);
const INTERVALO = `${Math.min(...anos)}—${Math.max(...anos)}`;

export default function WorkIndexV3() {
  useMetaRota();
  return (
    <div style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}>
      <Hud />
      <NavV3 />

      <section className="pb-20 pt-28 max-md:pb-12">
        <LinhaSecao rotulo="Index" extra={`[${String(WORK.length).padStart(2, "0")}]`} />
        <div style={{ paddingInline: "var(--v3-margem)" }}>
          <Display as="h1" immediate>
            {`Selected work ${INTERVALO}`}
          </Display>
        </div>

        <ol className="mt-16 max-md:mt-10">
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <Link
                to={`/v3/work/${w.slug}`}
                className="group grid grid-cols-12 items-center gap-6 border-t border-black/12 py-6 transition-colors hover:bg-black/[0.03] max-md:gap-3 max-md:py-5"
                style={{ paddingInline: "var(--v3-margem)" }}
              >
                <span className="v3-micro col-span-1 max-md:col-span-2" style={{ color: "var(--v3-acento)" }}>
                  {idx(i)}
                </span>

                {/* thumb de contact sheet — some no mobile, onde a linha fica
                    tipográfica e a capa é da página do case */}
                <span className="col-span-2 block overflow-hidden max-md:hidden">
                  <img
                    src={w.cover.src}
                    alt={w.cover.alt}
                    width={w.cover.w}
                    height={w.cover.h}
                    decoding="async"
                    draggable={false}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>

                <h2
                  className="col-span-5 uppercase max-md:col-span-10"
                  style={{
                    fontFamily: "'Geist', ui-sans-serif, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(22px, 2.6vw, 44px)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {w.title}
                </h2>

                <span className="v3-rotulo col-span-3 flex flex-wrap gap-x-5 gap-y-1 max-md:col-span-8 max-md:col-start-3">
                  {w.disciplines.map((d) => (
                    <span key={d} className="v3-q">
                      {d}
                    </span>
                  ))}
                </span>

                <span className="v3-rotulo col-span-1 text-right max-md:col-span-2" style={{ color: "var(--v3-quieto)" }}>
                  {w.year}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <RodapeV3 />
    </div>
  );
}
