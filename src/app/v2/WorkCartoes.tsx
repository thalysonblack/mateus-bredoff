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
 * ⚠ O rótulo é ASSADO NA TEXTURA, não DOM (17/09, "a tag e o nome saem"): o
 * card entorta no shader e um rótulo plano por cima escapava dele. O único
 * DOM que sobra é o cursor "View Case", que segue o ponteiro e não o card.
 *
 * ⚠ sem WebGL (ou com movimento reduzido) a fita vira uma fileira simples de
 * capas com scroll nativo — a peça continua acessível.
 */
export function WorkCartoes({ itens }: { itens: WorkItem[] }) {
  const palco = useRef<HTMLDivElement | null>(null);
  const motor = useRef<CartoesWebGL | null>(null);
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
    const v = criarCartoesWebGL(el, itens.map((w) => ({ src: w.cover.src, nome: w.title, tags: w.disciplines })), {
      aoMudarAtivo: () => {},
      aoAbrir: (i) => navigate(`/work/${itens[i].slug}`),
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
            <div ref={pilula} className="p-cartao-view" aria-hidden="true">
              View Case
            </div>
          </>
        )}
      </div>
    </div>
  );
}
