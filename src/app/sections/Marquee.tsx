import { useEffect, useRef } from "react";
import { Mono } from "../system";
import imgStag from "../../assets/optimized/art-stag-1400.webp";
import imgBureau from "../../assets/optimized/art-bureau-1400.webp";
import imgNeox from "../../assets/optimized/art-neox-1400.webp";
import imgTrivo from "../../assets/optimized/art-trivo-1400.webp";
import imgAlexArcher from "../../assets/optimized/art-alexarcher-1400.webp";
import imgVotare from "../../assets/optimized/art-votare-1400.webp";
import imgFerraci from "../../assets/optimized/art-ferraci-1400.webp";

/**
 * Faixa de artes em sangria total, entre a About e o Work.
 *
 * A About era manifesto + dois parágrafos: correta e sem impacto nenhum — muito
 * texto seguido de mais texto. Esta faixa é o respiro, e resolve o problema pelo
 * gesto certo em vez de enfiar uma imagem solta ao lado do parágrafo: o trabalho
 * aparece de relance, em movimento, antes de ser apresentado formalmente no
 * índice. Ela também emenda as duas seções — a página deixa de ser uma pilha de
 * blocos e passa a ter uma passagem.
 *
 * MECÂNICA: duas cópias da mesma tira correndo lado a lado, deslocadas por
 * `translateX` num rAF. Não é `animation: marquee` em CSS porque a velocidade
 * responde ao scroll: parado ele deriva devagar (a página não fica morta), e ao
 * rolar ele ganha direção e ganho de velocidade. É o parallax de strip da
 * assinatura, com fator baixo — 0.25 — para não virar carrossel de banner.
 *
 * A tira não recebe `hover` de propósito: conteúdo que se move sob o cursor
 * parado e reage ao mouse gera hit-test errado e passa a sensação de travamento.
 */

const STRIP = [
  { src: imgStag, label: "Stag Grid", ratio: "2800 / 2253" },
  { src: imgBureau, label: "Bureau", ratio: "16 / 9" },
  { src: imgNeox, label: "Neox", ratio: "1920 / 2280" },
  { src: imgAlexArcher, label: "Alex Archer", ratio: "2800 / 2255" },
  { src: imgTrivo, label: "Trivo", ratio: "1920 / 1275" },
  { src: imgVotare, label: "Votare", ratio: "4 / 3" },
  { src: imgFerraci, label: "Ferraci", ratio: "1400 / 933" },
];

const DRIFT = 14; // px/s com a página parada
const SCROLL_FACTOR = 0.25;

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let offset = 0;
    let lastT = performance.now();
    let lastScroll = window.scrollY;
    let half = track.scrollWidth / 2;

    const remeasure = () => {
      half = track.scrollWidth / 2;
    };
    window.addEventListener("resize", remeasure);

    const tick = (t: number) => {
      const dt = Math.min(64, t - lastT) / 1000; // clamp: aba oculta devolve dt gigante
      lastT = t;

      const scroll = window.scrollY;
      const dScroll = scroll - lastScroll;
      lastScroll = scroll;

      offset += DRIFT * dt + dScroll * SCROLL_FACTOR;
      // A tira é duplicada: ao passar de metade, volta ao começo sem salto visível.
      if (half > 0) offset = ((offset % half) + half) % half;

      track.style.transform = `translate3d(${-offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    /* Só respiro em cima: o Work que vem depois já abre com um `pt` grande, e
       somar os dois abria um vão morto de ~10rem entre a legenda e o título. */
    <section
      aria-label="Trabalho em destaque"
      className="on-paper w-full overflow-hidden pt-[clamp(1.5rem,3vw,3rem)]"
    >
      <div className="flex w-max gap-[clamp(0.5rem,1.2vw,1.25rem)] will-change-transform" ref={trackRef}>
        {[...STRIP, ...STRIP].map((item, i) => (
          <figure
            key={`${item.label}-${i}`}
            className="h-[clamp(9rem,17vw,15rem)] shrink-0"
            /* a altura manda; a largura sai da proporção nativa, então nada estica */
            style={{ aspectRatio: item.ratio }}
            aria-hidden={i >= STRIP.length}
          >
            <img
              src={item.src}
              alt={i < STRIP.length ? item.label : ""}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>

      {/* Um rótulo só, ancorado: a faixa é imagem em movimento, e sem uma
          legenda fixa ela lê como banner de site de estoque. */}
      <div className="bleed flex items-baseline justify-between gap-4 pt-[clamp(0.75rem,1.5vw,1.25rem)]">
        <Mono dim>Selected pieces</Mono>
        <Mono dim>{`[${STRIP.length}] Plates`}</Mono>
      </div>
    </section>
  );
}
