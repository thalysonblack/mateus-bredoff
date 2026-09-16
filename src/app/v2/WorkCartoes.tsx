import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { WorkItem } from "../../content/work";
import { criarCartoesWebGL, type CartoesWebGL, type Ponteiro } from "../../lib/cartoesWebGL";
import { prefersReducedMotion } from "../../lib/gsap";

/**
 * O modo CARDS da /work: a fita WebGL do `/naughtyduk` dele (ver
 * `lib/cartoesWebGL.ts`), com o RÓTULO DENTRO do card como no Framer original
 * (16/09, "título e tag dentro"): nome embaixo à esquerda, disciplinas em
 * chips embaixo à direita, e o cursor "View Case" sobre o card do centro.
 *
 * Os rótulos são DOM por cima do canvas: um por projeto, posicionado a cada
 * quadro pelo motor (`aoQuadro`) — sem re-render do React, só style. O card
 * é WebGL e o texto é texto: nítido em qualquer dpr, selecionável por leitor
 * de tela, e não passa pelo shader de grão.
 *
 * ⚠ sem WebGL (ou com movimento reduzido) a fita vira uma fileira simples de
 * capas com scroll nativo — a peça continua acessível.
 */
export function WorkCartoes({ itens }: { itens: WorkItem[] }) {
  const palco = useRef<HTMLDivElement | null>(null);
  const motor = useRef<CartoesWebGL | null>(null);
  const rotulos = useRef<(HTMLDivElement | null)[]>([]);
  const pilula = useRef<HTMLDivElement | null>(null);
  const [semGL, setSemGL] = useState(false);
  const navigate = useNavigate();
  const chave = itens.map((w) => w.slug).join("|");

  useEffect(() => {
    const el = palco.current;
    if (!el || !itens.length) return;
    if (prefersReducedMotion()) {
      setSemGL(true);
      return;
    }
    const v = criarCartoesWebGL(el, itens.map((w) => w.cover.src), {
      aoMudarAtivo: () => {},
      aoAbrir: (i) => navigate(`/work/${itens[i].slug}`),
      aoQuadro: (cards, card) => {
        const r = el.getBoundingClientRect();
        const cx = r.width / 2;
        const cy = r.height / 2;
        /* cada projeto ganha o slot dele mais perto do centro; os outros somem */
        const melhor = new Map<number, (typeof cards)[number]>();
        for (const c of cards) {
          const m = melhor.get(c.proj);
          if (!m || Math.abs(c.x) < Math.abs(m.x)) melhor.set(c.proj, c);
        }
        rotulos.current.forEach((box, i) => {
          if (!box) return;
          const c = melhor.get(i);
          if (!c || c.op <= 0) {
            box.style.opacity = "0";
            return;
          }
          const w = card.w * c.sc;
          const h = card.h * c.sc;
          box.style.opacity = String(c.op);
          box.style.width = `${w}px`;
          box.style.height = `${h}px`;
          box.style.transform = `translate3d(${cx + c.x - w / 2}px, ${cy - h / 2}px, 0)`;
        });
      },
      aoPonteiro: (p: Ponteiro) => {
        const pil = pilula.current;
        if (!pil) return;
        if (!p || !p.centro) {
          pil.style.opacity = "0";
          return;
        }
        const r = el.getBoundingClientRect();
        pil.style.opacity = "1";
        pil.style.transform = `translate3d(${p.x - r.left}px, ${p.y - r.top}px, 0) translate(-50%, -50%)`;
      },
    });
    motor.current = v;
    setSemGL(!v);
    return () => {
      v?.destruir();
      motor.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  return (
    <div className="p-cartoes">
      <div ref={palco} className="p-cartoes-palco">
        {semGL ? (
          <ul className="p-cartoes-plano">
            {itens.map((w) => (
              <li key={w.slug}>
                <a href={`/work/${w.slug}`}>
                  <img src={w.cover.src} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {itens.map((w, i) => (
              <div
                key={w.slug}
                ref={(n) => {
                  rotulos.current[i] = n;
                }}
                className="p-cartao-rotulo"
                aria-hidden="true"
              >
                <span className="p-cartao-nome">{w.title}</span>
                <span className="p-cartao-tags">
                  {w.disciplines.map((d) => (
                    <span key={d} className="p-cartao-tag">
                      {d}
                    </span>
                  ))}
                </span>
              </div>
            ))}
            <div ref={pilula} className="p-cartao-view" aria-hidden="true">
              View Case
            </div>
          </>
        )}
      </div>
    </div>
  );
}
