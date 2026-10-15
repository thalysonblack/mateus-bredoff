import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import type { WorkItem } from "../../content/work";
import { criarCartoesWebGL, type CartoesWebGL, type Ponteiro } from "../../lib/cartoesWebGL";
import { prefersReducedMotion } from "../../lib/gsap";

export function WorkCartoes({
  itens,
  controles,
  aoAtivo,
  aoSob,
  plano = false,
  rolaPagina = false,
}: {
  itens: WorkItem[];
  controles?: ReactNode;
  aoAtivo?: (i: number) => void;
  /** o projeto sob o cursor (qualquer card), ou null fora da fita */
  aoSob?: (i: number | null) => void;
  /** fita "plana" da home: sem card de destaque, sem tags, sem o cursor View Case */
  plano?: boolean;
  /** a página rola: a roda vertical passa para ela */
  rolaPagina?: boolean;
}) {
  const palco = useRef<HTMLDivElement | null>(null);
  const motor = useRef<CartoesWebGL | null>(null);
  const pilula = useRef<HTMLDivElement | null>(null);
  const [semGL, setSemGL] = useState(false);
  const navigate = useNavigate();
  const chave = itens.map((w) => w.slug).join("|");

  useEffect(() => {
    const el = palco.current;
    if (!el || !itens.length) return;
    /* no celular a fita é HTML: rola com o dedo, com nome e disciplina legíveis */
    if (prefersReducedMotion() || matchMedia("(max-width: 860px)").matches) {
      setSemGL(true);
      return;
    }
    const v = criarCartoesWebGL(el, itens.map((w) => ({ src: w.cover.src, nome: w.title, tags: w.disciplines })), {
      /* a home (layout carrossel) usa o card do centro para acender o fundo */
      aoMudarAtivo: (i) => aoAtivo?.(i),
      aoAbrir: (i) => navigate(`/work/${itens[i].slug}`),
      aoPonteiro: (p: Ponteiro) => {
        aoSob?.(p ? p.proj : null);
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
    }, plano ? { destaque: false, tags: false, fracao: 0.16, rodaGlobal: !rolaPagina, soHorizontal: rolaPagina, curva: 0.15 } : {});
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
        {controles}
        {semGL ? (
          <ul className="p-cartoes-plano">
            {itens.map((w) => (
              <li key={w.slug}>
                <a href={`/work/${w.slug}`}>
                  <img src={w.cover.src} alt={w.cover.alt} loading="lazy" decoding="async" draggable={false} />
                  <span className="p-cartoes-nome">{w.title}</span>
                  <span className="p-marca p-cartoes-meta">{w.disciplines.join(" · ")}</span>
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
