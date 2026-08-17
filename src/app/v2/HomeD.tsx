import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";

/**
 * HOME — PARTIDO D: "A TRAMA".
 *
 * O pedido foi "mais viva, tipo revelatio ou aquela primeira". As duas
 * referências têm o mesmo princípio por baixo de técnicas diferentes: a matéria
 * do estúdio **processada em tempo real** — o vídeo da equipe virando ASCII num
 * shader, as capas virando textura num sólido que gira. Nenhuma das duas exibe
 * uma imagem parada na primeira tela.
 *
 * A matéria dele é a MARCA. Então o processo aqui é tipográfico: os nomes dos
 * nove projetos atravessam a tela em corpo de cartaz, e **cada nome é recortado
 * na própria arte** — a capa do projeto vive dentro das letras que o nomeiam.
 * A fita anda sozinha e para quando o cursor pousa.
 *
 * Por que isto e não o cubo ou o dither: os dois são assinatura de quem os fez
 * ([[feedback-referencia-e-conceito-nunca-assinatura]]), e nenhum dos dois diz
 * nada sobre um designer de identidade. "A marca é feita do trabalho que ela
 * nomeia" diz — e custa zero JS.
 */
export default function HomeD() {
  useMetaRota();
  /* a peça sob o cursor. `null` = nada aceso. */
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);
  const thumb = useRef<HTMLDivElement | null>(null);

  /* ⚠ o transform vai DIRETO no nó, fora do React: são dois updates por
     movimento de mouse, e passar isso por estado re-renderiza a trama inteira
     (nove nomes × três fitas) a 60fps. Só o "quem está sob o cursor" é estado,
     porque muda raramente. */
  useEffect(() => {
    let ultimo: string | null = null;
    const mover = (e: PointerEvent) => {
      const el = thumb.current;
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY + 26}px, 0)`;

      /* ⚠ QUEM ESTÁ SOB O CURSOR SE DESCOBRE POR `elementFromPoint`, não por
         onMouseEnter. Medido: com `mouseenter` no nome, a thumb NUNCA acendia —
         os nomes estão dentro de uma fita em movimento contínuo, então o
         elemento sai debaixo do cursor antes de o evento assentar, e enter/leave
         se cancelam. Lendo o ponto a cada movimento, o alvo é sempre o que está
         ali AGORA. O estado só muda quando muda a peça, então não há
         re-render por pixel. */
      const alvo = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-peca]");
      const slug = alvo?.dataset.peca ?? null;
      if (slug === ultimo) return;
      ultimo = slug;
      setSob(slug ? WORK.find((w) => w.slug === slug) ?? null : null);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);
  const recentes = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 2);
  /* a fita é duplicada no markup e o −50% do keyframe fecha o loop sem emenda */
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section className="flex min-h-[calc(100svh-11rem)] flex-col justify-between pt-6">
        {/* a trama — o nome de cada marca recortado na sua própria peça.
            Duas fitas em sentidos opostos: a segunda começa pelo fim da coleção
            para que as duas linhas nunca mostrem o mesmo projeto lado a lado. */}
        <div className="grid gap-2">
          {[fita, [...fita].reverse(), [...WORK.slice(3), ...WORK.slice(0, 3), ...WORK.slice(3), ...WORK.slice(0, 3)]].map((linha, li) => (
            <div key={li} className="p-trama -mx-[var(--p-margem)]">
              {/* o wrapper anda com o SCROLL; a fita de dentro segue no loop
                  próprio. Ímpares vão para o outro lado. Duas camadas porque com
                  uma só seria preciso escolher entre "vive parada" e "reage ao
                  scroll" — e ele quer as duas. */}
              <div className={`p-trama-scroll ${li % 2 === 1 ? "p-trama-scroll--volta" : ""}`}>
                <div
                  className={`p-trama-fita ${li === 1 ? "p-trama-fita--volta" : ""} ${li === 2 ? "p-trama-fita--terca" : ""}`}
                >
                  {linha.map((w, k) => (
                    <span key={`${w.slug}-${k}`} className="flex items-baseline gap-[0.32em]">
                      <Link
                        to={`/v2/work/${w.slug}`}
                        data-peca={w.slug}
                        onFocus={() => setSob(w)}
                        onBlur={() => setSob(null)}
                        className="p-trama-nome"
                        style={{ backgroundImage: `url(${w.cover.src2x ?? w.cover.src})` }}
                        aria-label={`Open ${w.title}`}
                      >
                        {w.title}
                      </Link>
                      <span className="p-trama-ponto">·</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* o mesmo conteúdo, legível para leitor de tela e busca */}
        <h1 className="sr-only">
          Mateus Bredoff — brand designer and art director. Selected work:{" "}
          {WORK.map((w) => w.title).join(", ")}.
        </h1>

        {/* a base: quem é, o índice, e a prova — em corpo de ficha */}
        <div
          className="grid grid-cols-12 pt-14 max-md:pt-10"
          style={{ columnGap: "var(--p-gap-x)", rowGap: "var(--p-gap-y)" }}
        >
          <p className="p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">
            Brand designer and art director, based in Brazil, working worldwide.
            Every identity starts from strategy and lands as a visual system
            built to last.
          </p>

          <div className="col-span-4 col-start-6 max-lg:col-span-6 max-lg:col-start-1" data-atenua>
            <p className="p-rotulo pb-3">
              Selected work — {String(WORK.length).padStart(2, "0")}
            </p>
            <ul className="grid gap-[6px]">
              {WORK.slice(0, 5).map((w, i) => (
                <li key={w.slug}>
                  <Link
                    data-alvo
                    to={`/v2/work/${w.slug}`}
                    className="p-corpo grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-3"
                  >
                    <span style={{ color: "var(--p-quieto)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{w.title}</span>
                    <span style={{ color: "var(--p-quieto)" }}>{w.year}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/v2/work" className="p-corpo p-link" style={{ color: "var(--p-quieto)" }}>
                  All work →
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-3 col-start-10 grid gap-8 max-lg:col-span-6 max-lg:col-start-7">
            <Bloco rotulo="Recognition">
              <ul className="grid gap-[6px]">
                {recentes.map((r) => (
                  <li key={`${r.veiculo}-${r.projeto}`} className="p-corpo">
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                        {r.veiculo}
                      </a>
                    ) : (
                      r.veiculo
                    )}
                    <span style={{ color: "var(--p-quieto)" }}>
                      {" "}
                      — {r.projeto}, {r.ano}
                    </span>
                  </li>
                ))}
              </ul>
            </Bloco>

            <Bloco rotulo="Contact">
              <a href="mailto:hello@mateusbredoff.com" className="p-corpo p-link">
                hello@mateusbredoff.com
              </a>
            </Bloco>
          </div>
        </div>
      </section>
      {/* a thumb que segue o cursor — a prova de que o nome é uma peça */}
      <div ref={thumb} className={`p-thumb ${sob ? "aceso" : ""}`} aria-hidden="true">
        {sob ? (
          <>
            <img
              src={sob.cover.src}
              srcSet={sob.cover.src2x ? `${sob.cover.src} 1400w, ${sob.cover.src2x} 2200w` : undefined}
              sizes="260px"
              alt=""
              width={sob.cover.w}
              height={sob.cover.h}
              decoding="async"
              draggable={false}
            />
            <span className="p-marca cap">
              <span>{sob.title}</span>
              <span style={{ opacity: 0.7 }}>{sob.year}</span>
            </span>
          </>
        ) : null}
      </div>
    </Prancha>
  );
}
