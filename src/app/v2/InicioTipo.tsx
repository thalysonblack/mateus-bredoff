import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/inicio-tipo.css";

/**
 * INÍCIO B — "A tipografia que se mexe" (10/10, família B da pesquisa
 * `~/dev/_inbox/ref-bredoff-hero/`: Dumbar, Givelet, Kyoosang Choi).
 *
 * RODADA 2 ("ter que clicar pra mexer não me agrada" + "o restante da página
 * não conversou"): o SCROLL opera. A hero fica presa e o nome passa pelos
 * quatro lockups de manual de marca — Horizontal → Stacked → Split → Tracked —
 * e no quinto passo assenta como a LINHA ZERO do índice: mesmo corpo e mesma
 * coluna dos nomes de projeto (medidos do `.ix-titulo` real), na base da hero.
 * Ao soltar o pin, a lista sobe logo abaixo e lê como continuação do nome.
 *
 * Mecânica: o DOM fica no lockup Horizontal (base). Para cada lockup a classe
 * é aplicada por um instante e o retângulo de cada letra é medido; a timeline
 * só tween-a x/y/scale de cada letra até esses alvos. Mede de novo a cada
 * refresh (resize, fontes), com as transforms neutralizadas na medição.
 */
const LOCKUPS = [
  { id: "horizontal", nome: "Horizontal" },
  { id: "empilhado", nome: "Stacked" },
  { id: "diagonal", nome: "Split" },
  { id: "aberto", nome: "Tracked" },
  { id: "indice", nome: "Index" },
] as const;

const PALAVRAS = ["Mateus", "Bredoff"];

type Alvo = { x: number; y: number; s: number };

export function InicioTipo() {
  const caixa = useRef<HTMLDivElement | null>(null);
  const [i, setI] = useState(0);

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return;
    el.dataset.lockup = "horizontal";
    if (prefersReducedMotion()) return;

    const mascaras = Array.from(el.querySelectorAll<HTMLElement>(".it-mascara"));
    let tabela: Alvo[][] | null = null; /* tabela[lockup][letra] */

    /* o lockup "indice" copia corpo e coluna do nome de projeto da lista real */
    const alinharIndice = () => {
      const t = document.querySelector<HTMLElement>(".ib-lista .ib-titulo");
      if (!t) return;
      el.style.setProperty("--it-indice-fs", getComputedStyle(t).fontSize);
      /* o hover desloca o título 0.18em por transform: desconta o translate da medida */
      const tx = new DOMMatrix(getComputedStyle(t).transform).m41;
      el.style.setProperty("--it-indice-x", `${t.getBoundingClientRect().left - tx - el.getBoundingClientRect().left}px`);
    };

    const medir = () => {
      if (tabela) return tabela;
      alinharIndice();
      const guardadas = mascaras.map((m) => m.style.transform);
      mascaras.forEach((m) => (m.style.transform = "none"));
      const rects = LOCKUPS.map((l) => {
        el.dataset.lockup = l.id;
        return mascaras.map((m) => m.getBoundingClientRect());
      });
      el.dataset.lockup = "horizontal";
      mascaras.forEach((m, k) => (m.style.transform = guardadas[k]));
      const base = rects[0];
      tabela = rects.map((r) => r.map((b, k) => ({ x: b.left - base[k].left, y: b.top - base[k].top, s: b.height / base[k].height })));
      return tabela;
    };
    const zerar = () => { tabela = null; };
    ScrollTrigger.addEventListener("refreshInit", zerar);

    const ctx = gsap.context(() => {
      /* entrada: as letras sobem por máscara, os fios desenham, a legenda acende */
      gsap.fromTo(".it-letra", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.03 });
      gsap.fromTo(".it-guia", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", stagger: 0.08 });
      gsap.fromTo(".it-legenda", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.9 });

      void document.fonts.ready.then(() => {
        ctx.add(() => {
          const mobile = matchMedia("(max-width: 760px)").matches;
          gsap.set(mascaras, { transformOrigin: "0 0" });
          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 1 },
            scrollTrigger: {
              trigger: el,
              /* começa no scroll 0: a hero prende onde ela nasce */
              start: () => `top ${el.getBoundingClientRect().top + window.scrollY}px`,
              end: mobile ? "+=220%" : "+=340%",
              pin: true,
              pinSpacing: true, /* pai flex: o padrão viraria false */
              scrub: 0.6,
              refreshPriority: 1, /* a primeira da página: as de baixo medem depois do espaçador */
              invalidateOnRefresh: true,
            },
            onUpdate: () => {
              /* a legenda muda no meio de cada viagem */
              const n = meios.filter((m) => tl.time() >= m).length;
              setI((v) => (v === n ? v : n));
            },
          });
          const meios: number[] = [];
          tl.to({}, { duration: 0.35 }); /* respiro no Horizontal antes da primeira viagem */
          for (let L = 1; L < LOCKUPS.length; L++) {
            const t0 = tl.duration();
            /* sem stagger por letra: com todas no mesmo progresso, a interpolação entre dois
               lockups mantém a ordem e o espaçamento — a palavra viaja legível. Só a 2ª palavra
               sai um tico depois. */
            mascaras.forEach((m, k) => {
              const segunda = k >= PALAVRAS[0].length;
              tl.to(m, { x: () => medir()[L][k].x, y: () => medir()[L][k].y, scale: () => medir()[L][k].s, duration: 1 }, t0 + (segunda ? 0.08 : 0));
            });
            meios.push(t0 + 0.5);
            tl.to({}, { duration: L === LOCKUPS.length - 1 ? 0.6 : 0.55 }); /* segura cada lockup para ser lido */
          }
          ScrollTrigger.refresh();
          /* no celular a miniatura da linha empurra o título quando a imagem carrega: mede de novo */
          const mini = document.querySelector(".ib-lista .ib-mini");
          if (mini) {
            const ro = new ResizeObserver(() => ScrollTrigger.refresh());
            ro.observe(mini);
            ctx.add(() => () => ro.disconnect());
          }
        });
      });
    }, el);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", zerar);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={caixa} className="it-caixa">
      <span className="it-guia it-guia--a" aria-hidden="true" />
      <span className="it-guia it-guia--b" aria-hidden="true" />
      <h1 className="it-nome" aria-label="Mateus Bredoff">
        {PALAVRAS.map((p) => (
          <span key={p} className="it-palavra" aria-hidden="true">
            {[...p].map((c, k) => (
              <span key={k} className="it-mascara">
                <span className="it-letra">{c}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="p-marca it-legenda" aria-hidden="true">
        <span>{i < 4 ? `Lockup ${String(i + 1).padStart(2, "0")} / 04` : "Chapter 01 / 05"}</span>
        <span>{i < 4 ? LOCKUPS[i].nome : "Index — selected work 08"}</span>
        <span className="it-dica">Scroll ↓</span>
      </p>
    </div>
  );
}
