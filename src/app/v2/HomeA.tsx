import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — PARTIDO A: "O MOSTRUÁRIO".
 *
 * A peça manda. A home é a obra ocupando a tela em mosaico de alturas
 * diferentes, com metadado mínimo por baixo; o texto sobre ele cabe numa linha
 * e o resto é trabalho.
 *
 * A tese: portfólio de brand designer se julga em três segundos, e nesses três
 * segundos ninguém lê — vê. A folha de espécimes (partido D, hoje em `/v2`)
 * aposta no oposto: o nome antes da imagem. As duas não podem estar certas.
 *
 * ⚠ Alturas em RAZÃO, não em px: cada peça mantém a proporção do próprio
 * arquivo (`aspect-ratio` vindo de `cover.w/h`), então o mosaico nunca corta
 * arte. Grade de mosaico que força altura igual recorta a peça do cliente para
 * caber no layout, que é o avesso do trabalho dele.
 */
export default function HomeA() {
  useMetaRota();
  /* três colunas de alturas naturais: a coluna mais curta recebe a próxima peça
     (empacotamento por altura, feito na montagem — sem JS de medição) */
  const colunas: (typeof WORK)[] = [[], [], []];
  const altura = [0, 0, 0];
  WORK.forEach((w) => {
    const menor = altura.indexOf(Math.min(...altura));
    colunas[menor].push(w);
    altura[menor] += w.cover.h / w.cover.w;
  });

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section className="pt-10 max-md:pt-6">
        <p className="p-corpo max-w-[46ch]">
          Brand designer and art director. Visual identities built from strategy,
          made to last.
        </p>

        <div
          className="grid grid-cols-3 pt-12 max-md:grid-cols-1"
          style={{ columnGap: "var(--p-gap-x)" }}
          data-atenua
        >
          {colunas.map((col, ci) => (
            <div key={ci} className="grid content-start" style={{ rowGap: "var(--p-gap-x)" }}>
              {col.map((w, k) => (
                <Link key={w.slug} data-alvo to={`/work/${w.slug}`} className="block">
                  <img
                    src={w.cover.src}
                    srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                    sizes="(max-width: 768px) 92vw, 31vw"
                    alt={w.cover.alt}
                    width={w.cover.w}
                    height={w.cover.h}
                    loading={ci + k > 2 ? "lazy" : undefined}
                    decoding="async"
                    draggable={false}
                    className="w-full object-cover"
                    style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}
                  />
                  <span className="p-marca flex items-baseline justify-between pt-2">
                    <span>{w.title}</span>
                    <span style={{ opacity: 0.7 }}>{w.year}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Prancha>
  );
}
