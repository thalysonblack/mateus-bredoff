import { useEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — PARTIDO E: "A SALA DE PROJEÇÃO".
 *
 * Do artefakt.mov, que ele apontou dizendo "gosto": a peça ocupa a tela inteira
 * e a informação vive nos QUATRO cantos em mono de caixa alta — rótulo da
 * seção, contador (`04 / 07`), tipo de peça, cliente, disciplina, ano. O site é
 * uma sala de projeção com a ficha técnica na moldura.
 *
 * O que separa isto do partido B (a projeção): lá a peça tem margem e a legenda
 * é uma linha; aqui ela **sangra a tela** e a ficha se distribui pela moldura.
 * B é uma sessão; E é uma ilha de edição — a diferença é densidade de metadado,
 * e é ela que faz o trabalho parecer produção em vez de galeria.
 *
 * ⚠ O que NÃO copiei: o wordmark em ASCII art da abertura deles. É a assinatura
 * do artefakt (uma produtora de FILME assinando com caractere de terminal), e
 * num designer de identidade seria fantasia emprestada.
 */
export default function HomeE() {
  useMetaRota();
  const [i, setI] = useState(0);
  const [preso, setPreso] = useState(false);

  useEffect(() => {
    if (preso) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % WORK.length), 5000);
    return () => window.clearInterval(id);
  }, [preso]);

  const w = WORK[i];

  return (
    <Prancha n="01" nome="Index" superficie="tinta">
      <section
        className="relative -mx-[var(--p-margem)] flex min-h-[calc(100svh-9rem)] flex-col"
        onMouseEnter={() => setPreso(true)}
        onMouseLeave={() => setPreso(false)}
      >
        {/* a peça, sangrando */}
        <Link to={`/v2/work/${w.slug}`} className="relative block flex-1 overflow-hidden">
          {WORK.map((x, k) => (
            <img
              key={x.slug}
              src={x.cover.src}
              srcSet={x.cover.src2x ? `${x.cover.src} 1400w, ${x.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              alt={x.cover.alt}
              width={x.cover.w}
              height={x.cover.h}
              loading={k > 1 ? "lazy" : undefined}
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: i === k ? 1 : 0 }}
            />
          ))}

          {/* a moldura de metadado: quatro cantos, mono de caixa alta */}
          <span
            className="p-rotulo absolute left-0 top-1/2 flex items-center gap-2"
            style={{ paddingLeft: "var(--p-margem)", color: "#fff" }}
          >
            <i className="inline-block h-[7px] w-[7px]" style={{ background: "var(--p-acento)" }} />
            Selected work
          </span>
          <span
            className="p-rotulo absolute right-0 top-1/2 tabular-nums"
            style={{ paddingRight: "var(--p-margem)", color: "#fff" }}
          >
            {String(i + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
          </span>
        </Link>

        {/* a ficha da peça, na base — cliente · tipo · data, como numa lauda */}
        <div
          className="grid grid-cols-12 items-end pt-5"
          style={{ paddingInline: "var(--p-margem)", columnGap: "var(--p-gap-x)" }}
        >
          <p className="p-especime col-span-5 max-md:col-span-12" style={{ ["--n" as string]: w.title.length }}>
            {w.title}
          </p>

          <div className="col-span-3 col-start-7 max-md:col-span-6 max-md:col-start-1">
            <p className="p-rotulo">Discipline</p>
            <p className="p-corpo pt-1">{w.disciplines.join(", ")}</p>
          </div>
          <div className="col-span-2 max-md:col-span-3">
            <p className="p-rotulo">Year</p>
            <p className="p-corpo pt-1">{w.year}</p>
          </div>
          <div className="col-span-2 text-right max-md:col-span-3 max-md:text-left">
            <p className="p-rotulo">Index</p>
            <Link to="/v2/work" className="p-corpo p-link pt-1">
              All work →
            </Link>
          </div>
        </div>
      </section>
    </Prancha>
  );
}
