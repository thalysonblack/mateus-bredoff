import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { LEAD, PROCESSO, FERRAMENTAS } from "../../content/about";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";

/**
 * ABOUT J — "A MESA".
 *
 * Postura: a about não é uma página, é a MESA DE TRABALHO dele. As capas, as
 * peças, os recortes das matérias, o retrato e as notas do método espalhados
 * num plano com profundidade. A bio vira um post-it. O nome fica atrás de
 * tudo, em fantasma — a âncora fixa contra a qual o resto se lê como solto.
 *
 * DNA (conceito, não assinatura): Luisa Ruzzenenti — miniaturas de tamanhos
 * diferentes espalhadas com respiro, sem grade; Cosmos — profundidade com
 * blur por distância. Colisão medida: nada de anel de cards em volta de um
 * logotipo (Cosmos), nada de ícone de pasta (Nrthview). Só o princípio de
 * "conteúdo que flutua e se navega".
 *
 * O que RECUSA: linearidade, seções, texto como protagonista, scroll de página.
 *
 * ⚠ A receita de dispersão da casa, medida no enxame da V3 e registrada:
 *   · posições ESCRITAS À MÃO — nunca `Math.random()`, que muda a cada render
 *     e não tem hierarquia;
 *   · UM `z` (0,35–1) comandando escala + opacidade + velocidade de parallax
 *     ao mesmo tempo — mexer nos três juntos é o que o olho lê como espaço;
 *   · hover traz a peça para a FRENTE (senão as de trás são decoração
 *     inalcançável);
 *   · uma âncora fixa de FATO atrás de tudo (o nome em fantasma).
 * O parallax é pelo MOUSE, não pelo scroll: a mesa não rola.
 */

type Item =
  | { tipo: "capa"; slug: string; x: number; y: number; w: number; z: number }
  | { tipo: "retrato"; x: number; y: number; w: number; z: number }
  | { tipo: "recorte"; i: number; x: number; y: number; w: number; z: number }
  | { tipo: "nota"; titulo: string; corpo: string; x: number; y: number; w: number; z: number };

/* x, y, w em % da mesa. z: 1 = na frente, 0,35 = no fundo. Escrito à mão.
   ⚠ Só entra RECORTE de matéria quando o projeto tem segunda peça no repo —
   medido: Ginga, Trivo e Votare têm `images: []`, e o recorte deles repetiria a
   capa que já está na mesa. Sobrou o do Alex Archer. Quando as peças chegarem,
   os outros voltam. */
const MESA: Item[] = [
  { tipo: "retrato", x: 6, y: 9, w: 13, z: 0.92 },
  { tipo: "nota", titulo: "Approach", corpo: LEAD[0], x: 21, y: 12, w: 17, z: 1 },
  { tipo: "capa", slug: "ginga", x: 43, y: 4, w: 21, z: 0.88 },
  { tipo: "capa", slug: "alex-archer", x: 70, y: 8, w: 24, z: 0.72 },
  { tipo: "recorte", i: 2, x: 62, y: 38, w: 11, z: 0.55 },
  { tipo: "capa", slug: "bureau", x: 4, y: 46, w: 18, z: 0.6 },
  { tipo: "nota", titulo: `Method — 0${PROCESSO.length}`, corpo: PROCESSO.map((p, i) => `0${i + 1}  ${p.titulo}`).join("\n"), x: 27, y: 44, w: 14, z: 0.95 },
  { tipo: "capa", slug: "neox", x: 44, y: 50, w: 15, z: 0.42 },
  { tipo: "capa", slug: "trivo", x: 78, y: 44, w: 17, z: 0.8 },
  { tipo: "capa", slug: "stag", x: 26, y: 70, w: 14, z: 0.68 },
  { tipo: "capa", slug: "votare", x: 46, y: 72, w: 19, z: 0.9 },
  { tipo: "nota", titulo: "Tools", corpo: FERRAMENTAS.join("  ·  "), x: 84, y: 78, w: 12, z: 0.85 },
  { tipo: "capa", slug: "ferraci", x: 90, y: 30, w: 8, z: 0.35 },
];

export default function AboutJ() {
  useMetaRota();
  const mesa = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [frente, setFrente] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = mesa.current;
    if (!el) return;
    const mover = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
    };
    el.addEventListener("mousemove", mover);
    return () => el.removeEventListener("mousemove", mover);
  }, []);

  const capa = (slug: string) => WORK.find((w) => w.slug === slug);

  return (
    <Prancha n="03" nome="About" superficie="branco" status="Available for projects" tela rodape="regua">
      <div className="p-mesa" ref={mesa}>
        {/* a âncora: o nome em fantasma, atrás de tudo, parado */}
        <p className="p-mesa-fantasma" aria-hidden="true">
          Mateus
          <br />
          Bredoff
        </p>

        {MESA.map((it, k) => {
          const naFrente = frente === k;
          const z = naFrente ? 1 : it.z;
          /* um z comanda os três: escala, opacidade e quanto o item anda com o
             mouse. O fundo anda pouco e quase some; a frente anda mais e é opaca */
          const estilo: React.CSSProperties = {
            left: `${it.x}%`,
            top: `${it.y}%`,
            width: `${it.w}%`,
            zIndex: Math.round(z * 100) + (naFrente ? 100 : 0),
            /* ⚠ a atenuação é da IMAGEM, nunca da legenda: com `opacity` no item
               inteiro, as legendas das peças do fundo mediram 2,46:1 (alvo 4,5).
               A variável vai para o `img` e para a nota no CSS; o texto fica em
               tinta cheia — piso 0,62 é para texto, e texto informa. */
            ["--p-mesa-op" as string]: 0.45 + z * 0.55,
            transform: `translate3d(${mouse.x * -36 * z}px, ${mouse.y * -24 * z}px, 0) scale(${0.86 + z * 0.14})`,
            filter: naFrente ? "none" : `blur(${(1 - z) * 1.6}px)`,
          };
          const eventos = {
            onMouseEnter: () => setFrente(k),
            onMouseLeave: () => setFrente(null),
            onFocus: () => setFrente(k),
            onBlur: () => setFrente(null),
          };

          if (it.tipo === "capa") {
            const w = capa(it.slug);
            if (!w) return null;
            return (
              <Link key={k} to={`/work/${w.slug}`} className="p-mesa-item p-mesa-capa" style={estilo} {...eventos}>
                <img src={w.cover.src} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                <span className="p-marca p-mesa-legenda">
                  {w.title} <span style={{ color: "var(--p-quieto)" }}>{w.year}</span>
                </span>
              </Link>
            );
          }
          if (it.tipo === "retrato") {
            return (
              <figure key={k} className="p-mesa-item p-mesa-capa" style={estilo} {...eventos} tabIndex={0}>
                <img src={retrato} alt="Mateus Bredoff" decoding="async" draggable={false} />
                <span className="p-marca p-mesa-legenda">
                  Mateus Bredoff <span style={{ color: "var(--p-quieto)" }}>Brazil</span>
                </span>
              </figure>
            );
          }
          if (it.tipo === "recorte") {
            const r = RECONHECIMENTO[it.i];
            if (!r) return null;
            /* ⚠ o recorte NÃO repete a capa que já está na mesa. A foto da matéria
               em `reconhecimento.ts` é a própria capa do projeto, e a primeira
               montagem pôs Ginga e Alex Archer duas vezes — "quando for repetir
               projeto, use telas diferentes" (ele cobrou isso no Trivo, 17/08).
               O recorte mostra a SEGUNDA peça do case; sem segunda peça, cai
               na foto da matéria. */
            const proj = WORK.find((w) => r.projeto.toLowerCase().startsWith(w.title.toLowerCase().replace(" ®", "")));
            const foto = proj?.images[0] ?? r.foto;
            const miolo = (
              <>
                <img src={foto.src} alt={foto.alt} loading="lazy" decoding="async" draggable={false} />
                <span className="p-marca p-mesa-legenda">
                  {r.veiculo} <span style={{ color: "var(--p-quieto)" }}>{r.ano}</span>
                </span>
              </>
            );
            return r.href ? (
              <a key={k} href={r.href} target="_blank" rel="noopener noreferrer" className="p-mesa-item p-mesa-capa" style={estilo} {...eventos}>
                {miolo}
              </a>
            ) : (
              <figure key={k} className="p-mesa-item p-mesa-capa" style={estilo} {...eventos} tabIndex={0}>
                {miolo}
              </figure>
            );
          }
          return (
            <div key={k} className="p-mesa-item p-mesa-nota" style={estilo} {...eventos} tabIndex={0}>
              <p className="p-rotulo">{it.titulo}</p>
              <p className="p-mesa-nota-txt">{it.corpo}</p>
            </div>
          );
        })}
      </div>
    </Prancha>
  );
}
