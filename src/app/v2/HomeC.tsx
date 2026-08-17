import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";

/**
 * HOME — PARTIDO C: "A CAPA".
 *
 * Uma tela, sem rolagem. O nome, uma peça, e o mínimo que prova que ele
 * trabalha: o último projeto, o último reconhecimento, e como falar com ele.
 *
 * A tese: o portfólio dele já tem quatro páginas para explicar; a home pode ser
 * a capa do documento em vez de um resumo dele. É o que o `/about` do corentin
 * e a home do artem fazem — **uma tela, e ela não rola** —, e o que nenhuma das
 * outras três tentativas fez: parar de mostrar tudo.
 *
 * Contra: quem chega por link direto e não rola vê nove projetos a menos. É o
 * risco real deste partido, e é a razão de ele estar em rota separada para
 * comparar em vez de ir direto para a raiz.
 */
export default function HomeC() {
  useMetaRota();
  const ultimo = WORK[0];
  const premio = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano)[0];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section
        className="grid min-h-[calc(100svh-11rem)] grid-cols-12 content-center"
        style={{ columnGap: "var(--p-gap-x)", rowGap: "var(--p-gap-y)" }}
      >
        <div className="col-span-5 max-lg:col-span-12">
          <h1 className="p-especime" style={{ ["--n" as string]: 14 }}>
            Mateus Bredoff
          </h1>
          <p className="p-corpo max-w-[38ch] pt-6">
            Brand designer and art director, based in Brazil, working worldwide.
            Visual identities built from strategy, made to last.
          </p>
        </div>

        {/* a peça: uma só, a mais recente */}
        <Link
          to={`/work/${ultimo.slug}`}
          className="col-span-4 col-start-7 max-lg:col-span-12 max-lg:col-start-1"
        >
          <img
            src={ultimo.cover.src}
            srcSet={ultimo.cover.src2x ? `${ultimo.cover.src} 1400w, ${ultimo.cover.src2x} 2200w` : undefined}
            sizes="(max-width: 1024px) 92vw, 34vw"
            alt={ultimo.cover.alt}
            width={ultimo.cover.w}
            height={ultimo.cover.h}
            draggable={false}
            /* ⚠ proporção NATIVA da peça, não 4:5 forçado: a capa do Ginga é
               4:3 e o recorte cortava a arte do cliente para caber no layout —
               o avesso do trabalho dele */
            className="w-full"
            style={{ aspectRatio: `${ultimo.cover.w} / ${ultimo.cover.h}` }}
          />
          <span className="p-marca flex items-baseline justify-between pt-2">
            <span>Latest — {ultimo.title}</span>
            <span style={{ opacity: 0.7 }}>{ultimo.year}</span>
          </span>
        </Link>

        <div className="col-span-2 col-start-11 grid gap-8 self-end max-lg:col-span-12 max-lg:col-start-1">
          <Bloco rotulo="Index">
            <Link to="/work" className="p-corpo p-link">
              {String(WORK.length).padStart(2, "0")} projects →
            </Link>
          </Bloco>
          <Bloco rotulo="Recognition">
            <p className="p-corpo">
              {premio.veiculo}
              <span className="block" style={{ color: "var(--p-quieto)" }}>
                {premio.projeto} — {premio.ano}
              </span>
            </p>
          </Bloco>
          <Bloco rotulo="Contact">
            <a href="mailto:hello@mateusbredoff.com" className="p-corpo p-link">
              hello@mateusbredoff.com
            </a>
          </Bloco>
        </div>
      </section>
    </Prancha>
  );
}
