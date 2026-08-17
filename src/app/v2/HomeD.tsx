import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
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
 * A matéria dele é a MARCA. Então o gesto é tipográfico: os nomes dos nove
 * projetos atravessam a tela em corpo de cartaz, a fita anda sozinha e para
 * quando o cursor pousa. A peça se vê no visor que segue o cursor.
 *
 * ⚠ 17/08 — TRÊS CORREÇÕES DELE, e a ordem em que vieram importa:
 *   1. *"tire os projetos de dentro da máscara"* — o nome era recortado NA ARTE
 *      (`background-clip: text` com a capa por dentro). O recorte fica; o que
 *      sai é a foto: *"ao invés de ser preenchido com o projeto, ser com a
 *      cor"*. Letra grande com fotografia por dentro vira ruído — a mesma
 *      palavra em cor chapada lê como marca.
 *   2. *"o overlay ao passar o mouse ficou ruim"* + *"deixa todas com proporção
 *      5:4"* — o visor mantinha a proporção nativa de cada capa, então ele
 *      mudava de formato a cada nome. Uma proporção só para as nove.
 *   3. *"no scroll a página não move, apenas os projetos"* — ver o comentário
 *      da segunda tela, mais abaixo.
 *
 * ⚠ A montagem intermediária pôs a peça inteira DENTRO da fita, em cards 5:4 ao
 * lado de cada nome, e ele cortou: *"não era assim, era pra manter como
 * estava"*. A fita é de NOMES. A peça é o visor.
 */
export default function HomeD() {
  useMetaRota();
  /* a peça sob o cursor. `null` = nada aceso. */
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);
  const visor = useRef<HTMLDivElement | null>(null);

  /* ⚠ QUEM ESTÁ SOB O CURSOR SE DESCOBRE POR `elementFromPoint`, não por
     onMouseEnter. Medido: com `mouseenter` no nome, o visor NUNCA acendia — os
     nomes estão dentro de uma fita em movimento contínuo, então o elemento sai
     debaixo do cursor antes de o evento assentar, e enter/leave se cancelam.
     Lendo o ponto a cada movimento, o alvo é sempre o que está ali AGORA.

     Só o slug vira estado, e só quando MUDA de peça — então o pointermove não
     re-renderiza a trama (nove nomes × três fitas) a 60fps. */
  useEffect(() => {
    let ultimo: string | null = null;
    const mover = (e: PointerEvent) => {
      const alvo = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-peca]");
      const slug = alvo?.dataset.peca ?? null;
      if (slug === ultimo) return;
      ultimo = slug;
      setSob(slug ? WORK.find((w) => w.slug === slug) ?? null : null);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  /**
   * A ENTRADA DO VISOR — o gesto do site é FOCAR.
   *
   * ⚠ O visor NÃO segue mais o cursor ("sem deslocamento do mouse"). Ele fica
   * ancorado no centro da tela, e como não se move, é a ENTRADA que precisa
   * carregar o movimento — daí o GSAP em vez de uma transição de opacidade.
   *
   * O gesto é o mesmo que a V3 usa em toda revelação (`data-foca`): a peça
   * chega desfocada e resolve. Aqui somam-se dois: a máscara abre de baixo para
   * cima (`clipPath`) e a arte assenta de 1,08 para 1 — a imagem "entra em
   * foco" em vez de aparecer. Trocar de nome com o visor aceso reanima do
   * início, então percorrer a fita lê como girar um anel de foco.
   *
   * `useLayoutEffect` + `gsap.context` porque o alvo só existe quando `sob`
   * deixa de ser nulo, e o context limpa os tweens no unmount da rota.
   */
  useLayoutEffect(() => {
    const el = visor.current;
    if (!el || !sob) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          el,
          { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "expo.out" },
        )
        .fromTo(
          el.querySelector("img"),
          { scale: 1.08, filter: "blur(13px)" },
          { scale: 1, filter: "blur(0px)", duration: 0.8, ease: "expo.out" },
          0,
        )
        .fromTo(
          el.querySelector("[data-cap]"),
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5 },
          0.1,
        );
    }, el);
    return () => ctx.revert();
  }, [sob]);
  const recentes = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 3);
  /* a fita é duplicada no markup e o −50% do keyframe fecha o loop sem emenda */
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      <section className="flex min-h-[calc(100svh-11rem)] flex-col justify-between pt-6">
        {/* a trama — a peça e o nome dela, em par, atravessando a tela.
            Três fitas em sentidos alternados: a segunda começa pelo fim da
            coleção para que duas linhas nunca mostrem o mesmo projeto lado a
            lado. O campo inteiro é o alvo do hover (`p-trama-campo`): pousar
            numa linha para as três e atenua tudo que não está sob o cursor. */}
        {/* `my-auto`: a trama flutua no centro do que sobra entre o cabeçalho e
            o rótulo da dobra. Ancorada no topo (justify-between), o vazio se
            acumulava todo embaixo — 600px de nada no mobile. */}
        <div className="p-trama-campo my-auto grid gap-[var(--p-trama-gap)]">
          {[fita, [...fita].reverse(), [...WORK.slice(3), ...WORK.slice(0, 3), ...WORK.slice(3), ...WORK.slice(0, 3)]].map((linha, li) => (
            <div key={li} className="p-trama p-trama--peca -mx-[var(--p-margem)]">
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

        {/* a linha da dobra: o que a trama não diz, dito uma vez */}
        <p className="p-rotulo pt-10" style={{ color: "var(--p-quieto)" }}>
          Índice — {String(WORK.length).padStart(2, "0")} projects, 2021—2026 ↓
        </p>
      </section>

      {/* ⚠ A BASE É UMA SEGUNDA TELA, e isso é o conserto de um defeito medido:
          a página tinha 989px contra 963px de viewport — 26px de curso. Rolar
          não movia a página, mas os 26px alimentavam o `scroll()` das fitas em
          16% de deslocamento. O sintoma que ele relatou ("no scroll a página
          não move, apenas os projetos") era isto: o percurso existia só para a
          animação. Com duas telas o scroll tem para onde ir, e o arrasto das
          fitas passa a acompanhar a página em vez de substituí-la. */}
      <section className="flex min-h-svh flex-col justify-center">
        <div
          className="grid grid-cols-12"
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
              {WORK.map((w, i) => (
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

      {/* O VISOR — a peça, já que ela saiu de dentro da letra.
          ⚠ ANCORADO NO CENTRO, não colado no cursor ("sem deslocamento do
          mouse"). E 16:9 para todas: com a proporção nativa de cada capa
          (1400×1097, 3840×2804, 1400×1663…) ele mudava de formato a cada nome,
          e era isso que fazia o overlay parecer solto. Uma proporção só, `cover`
          recortando — vira instrumento, não imagem colada. */}
      {sob ? (
        <div ref={visor} className="p-visor" aria-hidden="true">
          <img
            src={sob.cover.src2x ?? sob.cover.src}
            alt=""
            width={sob.cover.w}
            height={sob.cover.h}
            decoding="async"
            draggable={false}
          />
          <span className="p-marca p-visor-cap" data-cap>
            <span>{sob.title}</span>
            <span style={{ opacity: 0.7 }}>{sob.year}</span>
          </span>
        </div>
      ) : null}
    </Prancha>
  );
}
