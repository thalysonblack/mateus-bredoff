import { Link } from "react-router";
import { Quadro } from "./sistema";
import { LAB, INSTAGRAM } from "../../content/lab";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — O LAB, na anatomia da `/playground` medida.
 *
 * Três blocos e nada mais: header de 222px, a grade grande (2.773px numa página
 * de 3.982) e o rodapé. É a página mais simples do site de lá, e a simplicidade
 * é o partido — a grade ocupa 70% da altura e nenhuma linha de texto disputa
 * com ela.
 *
 * ⚠ O header é BAIXO — 222px, contra os 335px da about. Página de galeria
 * começa quase no conteúdo, porque a matéria dela é a imagem, não o argumento.
 * O meu tinha 200px só de padding superior.
 *
 * Marcas fictícias que ele cria para testar ideia. A seção diz o que é; nenhum
 * item carrega carimbo de "fictício" — o contexto separa, a etiqueta não.
 *
 * ⚠ Ensaio sem arte no repo entra como PLACA tipográfica, não com imagem
 * emprestada. Lacuna declarada é honesta; lacuna preenchida com o trabalho de
 * outra pessoa não é.
 */
export default function LabV4() {
  useMetaRota();
  const capa = (slug: string | null) => WORK.find((w) => w.slug === slug)?.cover;

  return (
    <Quadro>
      <header className="q-cabeca q-cabeca-baixa">
        <h1 className="q-display-md" style={{ maxWidth: "22ch" }}>
          Fictional brands, built to test an idea.
        </h1>
        <p className="q-meta" style={{ paddingTop: 14 }}>
          {LAB.length} studies ·{" "}
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="q-meta-ink">
            @sir.bredoff
          </a>
        </p>
      </header>

      <div className="q-indice" data-foca>
        {LAB.map((e) => {
          const arte = capa(e.slug);
          const miolo = (
            <>
              <span
                className="q-cel-arte"
                style={arte ? ({ ["--q-ar" as string]: `${arte.w} / ${arte.h}` } as object) : undefined}
              >
                {arte ? (
                  <img
                    src={arte.src}
                    alt={arte.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <span className="q-placa">
                    <span className="q-placa-nome">{e.brand}</span>
                  </span>
                )}
              </span>
              <span className="q-cel-legenda">
                <span className="q-cel-nome">{e.brand}</span>
                <span className="q-meta">{e.medium}</span>
              </span>
            </>
          );
          return e.slug ? (
            <Link key={e.brand} to={`/v4/work/${e.slug}`} className="q-cel">
              {miolo}
            </Link>
          ) : (
            <div key={e.brand} className="q-cel">
              {miolo}
            </div>
          );
        })}
      </div>
    </Quadro>
  );
}
