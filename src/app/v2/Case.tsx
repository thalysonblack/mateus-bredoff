import { useParams, Link } from "react-router";
import { findWork, WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";

/**
 * O CASE — `/work/:slug`. Um componente para os nove.
 *
 * A anatomia veio medida do revelatio (`/tmp/ref-revelatio.md`), e o número que
 * decide tudo é a divisão da coluna: **galeria 1119px à esquerda (~73%) e ficha
 * técnica de 400px PINADA à direita (~27%)**, com `position: sticky` puro —
 * `top: 7rem` exatos, sem uma linha de JS. A galeria rola, a ficha fica.
 *
 * Por que isso vale mais do que a pilha de imagens da direção anterior: num
 * case de identidade, a pergunta que a pessoa faz enquanto olha a décima peça é
 * *"de quem é isso mesmo, e o que ele fez aqui?"*. Com a ficha pinada, a
 * resposta nunca sai da tela. Com a ficha no topo, ela sai na primeira rolagem.
 *
 * ⚠ Imagem **1 por linha, largura cheia da coluna** — lá são 8 tiles idênticos
 * de 16:9 com 22px de respiro entre eles, e 667px quando entra texto. Aqui o
 * acervo tem proporções variadas, então a caixa usa `object-fit: cover` e não
 * `fill`: `fill` só não distorce quando TODO asset tem a proporção da caixa, o
 * que é verdade lá e não é verdade aqui.
 *
 * ⭐ E o CASE SEM TEXTO não vira "em preparação". O revelatio resolve o mesmo
 * problema com um dispositivo melhor: seis dos vinte e dois projetos dele são
 * **Confidential** — a marca aparece, o clique é negado, e o "não" ganha a
 * única cor cromática do sistema. Aqui a variante honesta é a mesma ideia
 * aplicada ao nosso caso real: o trabalho existe e está publicado, o TEXTO é
 * que não foi escrito ainda. Então a ficha diz isso no lugar de fingir corpo.
 */
export default function CaseV2() {
  const { slug } = useParams();
  const item = findWork(slug);
  useMetaRota();

  if (!item) {
    return (
      <Prancha n="—" nome="Not found" superficie="papel" rodape="completo">
        <div className="flex min-h-[60svh] flex-col justify-center">
          <p className="p-rotulo" style={{ color: "var(--p-acento)" }}>
            404
          </p>
          <p className="p-item pt-4">This project is not in the index.</p>
          <Link to="/work" className="p-corpo p-link pt-8">
            Back to the index →
          </Link>
        </div>
      </Prancha>
    );
  }

  /* navegação circular: o índice não tem fim, ele dá a volta */
  const i = WORK.findIndex((w) => w.slug === item.slug);
  const proximo = WORK[(i + 1) % WORK.length];

  return (
    <Prancha n={String(i + 1).padStart(2, "0")} nome={item.title} superficie="papel" rodape="completo">
      {/* ─ abertura: o nome no corpo do espécime, a ficha ao lado ───────── */}
      <header
        className="grid grid-cols-12 pt-14 max-md:pt-8"
        style={{ columnGap: "var(--p-gap-x)" }}
      >
        <h1
          className="p-especime col-span-8 max-lg:col-span-12"
          style={{ ["--n" as string]: item.title.length }}
        >
          {item.title}
        </h1>
      </header>

      <div
        className="grid grid-cols-12 pt-12"
        style={{ columnGap: "var(--p-gap-x)" }}
      >
        {/* ─ a galeria: 1 por linha, largura cheia da coluna ───────────── */}
        <div className="col-span-8 max-lg:col-span-12">
          {item.images.length ? (
            <ul className="grid gap-6">
              {item.images.map((img, k) => (
                <li key={img.src}>
                  <figure>
                    <img
                      src={img.src}
                      srcSet={img.src2x ? `${img.src} 1400w, ${img.src2x} 2200w` : undefined}
                      sizes="(max-width: 1024px) 92vw, 62vw"
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      loading={k > 0 ? "lazy" : undefined}
                      decoding="async"
                      draggable={false}
                      className="w-full object-cover"
                      style={{ aspectRatio: "16 / 9" }}
                    />
                    <figcaption className="p-marca flex items-baseline justify-between pt-2">
                      <span>FIG. {String(k + 1).padStart(2, "0")}</span>
                      <span>{item.title}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <figure>
              <img
                src={item.cover.src}
                srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
                sizes="(max-width: 1024px) 92vw, 62vw"
                alt={item.cover.alt}
                width={item.cover.w}
                height={item.cover.h}
                draggable={false}
                className="w-full object-cover"
                style={{ aspectRatio: "16 / 9" }}
              />
              <figcaption className="p-marca flex items-baseline justify-between pt-2">
                <span>FIG. 01</span>
                <span>{item.title}</span>
              </figcaption>
            </figure>
          )}
        </div>

        {/* ─ a ficha PINADA ────────────────────────────────────────────── */}
        <aside className="col-span-3 col-start-10 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-12">
          <div
            className="sticky grid"
            style={{ top: "5rem", rowGap: "calc(var(--p-gap-y) / 2)" }}
          >
            <Bloco rotulo="Year">
              <p className="p-corpo">{item.year}</p>
            </Bloco>

            <Bloco rotulo="Discipline">
              <p className="p-corpo">{item.disciplines.join(", ")}</p>
            </Bloco>

            {item.credits.length ? (
              <Bloco rotulo="Credits">
                <ul className="grid gap-[6px]">
                  {item.credits.map((c) => (
                    <li key={`${c.name}-${c.role}`} className="p-corpo">
                      {c.name}
                      <span style={{ color: "var(--p-quieto)" }}> — {c.role}</span>
                    </li>
                  ))}
                </ul>
              </Bloco>
            ) : null}

            <Bloco rotulo="About">
              {item.about?.length ? (
                <div className="grid gap-3">
                  {item.about.map((p) => (
                    <p key={p.slice(0, 24)} className="p-corpo">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                /* ⚠ Não é placeholder e não é desculpa: é o estado honesto do
                   material. O trabalho está publicado e a arte está aqui; o que
                   falta é o texto, e dizer isso vale mais que lorem. */
                <p className="p-corpo" style={{ color: "var(--p-quieto)" }}>
                  Written case in preparation. The work is published — the
                  account of it isn’t written yet.
                </p>
              )}
            </Bloco>

            <Bloco rotulo="Next">
              <Link to={`/work/${proximo.slug}`} className="p-corpo p-link">
                {proximo.title} →
              </Link>
            </Bloco>
          </div>
        </aside>
      </div>
    </Prancha>
  );
}
