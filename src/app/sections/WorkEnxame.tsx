import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { LinhaSecao, Cantos, idx } from "../v3-system";

/**
 * Selected Work como ENXAME — a alternativa à tira com snap.
 *
 * ## Por que existe
 *
 * A crítica que o Thalyson salvou (seb astian, sobre um slider feito para a
 * Blink): *"I always get tired of slider sections. Most of the time we see the
 * typical 3 card grid w a 4th card being cut off a bit and some pagination. It
 * works. But it's not interesting. It kinda rips you out of the experience."* —
 * e a home usava exatamente isso: tira horizontal, cartão cortado na borda,
 * Prev/Next embaixo. O bleibtgleich.dev responde à mesma pergunta espalhando as
 * peças no espaço em vez de enfileirá-las, e este é o gesto emprestado.
 *
 * Nenhuma matéria da referência entra: paleta, tipografia e o vocabulário de
 * visor continuam sendo os do Mateus.
 *
 * ## As decisões que separam enxame de bagunça
 *
 * **Posições escritas à mão, nunca sorteadas.** `Math.random()` daria uma
 * composição diferente a cada render (e o resultado seria uma nuvem sem
 * hierarquia). O mapa abaixo é uma composição: as duas peças mais fortes
 * ficam grandes e centrais, o resto orbita.
 *
 * **A profundidade é fake e é o ponto.** `z` de 0 a 1 comanda escala, opacidade
 * e velocidade de parallax ao mesmo tempo — quem está "longe" é menor, mais
 * claro e anda menos. Mexer nos três juntos é o que faz o olho ler espaço em
 * vez de tamanhos aleatórios.
 *
 * **Hover traz a peça para a frente.** Sem isso, as peças de trás viram
 * decoração inalcançável: o `z-index` sobe, a escala vai a 1 e a opacidade
 * também. É o que mantém as SETE clicáveis, não só as três da frente.
 *
 * **No mobile o enxame não existe.** Abaixo de 768px vira uma pilha de duas
 * colunas: dispersão precisa de largura, e num 390px ela colapsa em sobreposição
 * ilegível. O gesto é do desktop; o conteúdo é de todo mundo.
 */

/* x/y em % da caixa · z de 0 (fundo) a 1 (frente) · rot em graus.
   A ordem segue WORK: Alex Archer, Bureau, Neox, Trivo, Stag, Ferraci, Votare. */
const POSES = [
  { x: 30, y: 46, z: 1.0, rot: -2.5, w: 30 },
  { x: 68, y: 26, z: 0.82, rot: 3, w: 24 },
  { x: 84, y: 62, z: 0.6, rot: -4, w: 17 },
  { x: 12, y: 20, z: 0.5, rot: 5, w: 15 },
  { x: 54, y: 76, z: 0.72, rot: -1.5, w: 20 },
  { x: 88, y: 14, z: 0.36, rot: 7, w: 12 },
  { x: 16, y: 74, z: 0.44, rot: -6, w: 13 },
];

/** `24–26`: os anos reais da coleção, não um rótulo escrito à mão. */
const anos = WORK.map((w) => w.year);
const intervalo = `${String(Math.min(...anos)).slice(2)}–${String(Math.max(...anos)).slice(2)}`;

export default function WorkEnxame() {
  const caixa = useRef<HTMLDivElement | null>(null);
  const [frente, setFrente] = useState<string | null>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const pecas = Array.from(el.querySelectorAll<HTMLElement>("[data-peca]"));
    const triggers: ScrollTrigger[] = [];

    pecas.forEach((p) => {
      const z = Number(p.dataset.z) || 0.5;
      /* quem está na frente anda mais: é a mesma regra do parallax de camada,
         só que o "longe" aqui é inventado pelo z e não pela posição na página */
      const curso = 40 + z * 90;
      const st = gsap.fromTo(
        p,
        { y: curso },
        {
          y: -curso,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.7 },
        },
      ).scrollTrigger;
      if (st) triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section
      data-secao="Selected Work"
      className="relative py-28 max-md:py-14"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}
    >
      <Cantos />
      <LinhaSecao
        rotulo="Selected work"
        extra={`[${String(WORK.length).padStart(2, "0")}]`}
        acao={{ texto: "Explore all", to: "/work" }}
      />

      {/* o campo: alto o bastante para a dispersão ter para onde ir */}
      <div
        ref={caixa}
        className="relative h-[92vh] min-h-[620px] max-md:grid max-md:h-auto max-md:min-h-0 max-md:grid-cols-2 max-md:gap-3"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        {/* A âncora do campo. Sem ela a dispersão flutua sem chão: peça solta
            precisa de algo fixo para ser lida como solta CONTRA alguma coisa.
            É o intervalo de anos COMPUTADO da coleção — fato, não enfeite, e o
            mesmo dado que o índice de `/work` já exibe. Fica atrás de tudo
            (z-index 0) e em opacidade baixa: é chão, não conteúdo. */}
        <span
          aria-hidden="true"
          className="v3-display pointer-events-none absolute bottom-[6%] left-0 max-md:hidden"
          style={{
            paddingInline: "var(--v3-margem)",
            zIndex: 0,
            opacity: 0.09,
            fontSize: "clamp(60px, 13vw, 210px)",
            lineHeight: 0.8,
          }}
        >
          {intervalo}
        </span>
        {WORK.map((w, i) => {
          const p = POSES[i % POSES.length];
          const naFrente = frente === w.slug;
          return (
            <Link viewTransition
              key={w.slug}
              to={`/work/${w.slug}`}
              data-peca
              data-z={p.z}
              onMouseEnter={() => setFrente(w.slug)}
              onMouseLeave={() => setFrente(null)}
              onFocus={() => setFrente(w.slug)}
              onBlur={() => setFrente(null)}
              className="v3-peca group absolute max-md:static max-md:w-auto max-md:translate-x-0 max-md:translate-y-0"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}vw`,
                transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
                zIndex: naFrente ? 30 : Math.round(p.z * 10),
                opacity: naFrente ? 1 : 0.35 + p.z * 0.6,
              }}
            >
              <span className="relative block overflow-hidden bg-black/5">
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="(max-width: 768px) 46vw, 30vw"
                  alt={w.cover.alt}
                  width={w.cover.w}
                  height={w.cover.h}
                  loading={i > 2 ? "lazy" : undefined}
                  decoding="async"
                  draggable={false}
                  className="aspect-[4/3] w-full object-cover"
                />
                <i className="v3-foco" aria-hidden="true"><b /><b /><b /><b /></i>
              </span>
              {/* a legenda só aparece na peça percorrida — sete legendas de uma
                  vez transformariam o campo em ruído de texto */}
              <span
                className="flex items-baseline gap-2 pt-2 transition-opacity duration-200 max-md:opacity-100"
                style={{ opacity: naFrente ? 1 : 0 }}
              >
                <span className="v3-micro" style={{ color: "var(--v3-acento)" }}>
                  {idx(i)}
                </span>
                <span className="v3-rotulo">{w.title}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
