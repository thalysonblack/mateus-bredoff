import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { WorkItem } from "../../content/work";
import { criarCartoesWebGL, type CartoesWebGL } from "../../lib/cartoesWebGL";
import { prefersReducedMotion } from "../../lib/gsap";

/**
 * O modo CARDS da /work: a fita WebGL do `/naughtyduk` dele (ver
 * `lib/cartoesWebGL.ts`) + uma legenda em DOM para o card do centro — nome ·
 * disciplinas · ano, na linha do corpo. A referência não tem legenda nenhuma;
 * aqui o nome precisa existir porque o card abre o case.
 *
 * ⚠ sem WebGL (ou com movimento reduzido) a fita vira uma fileira simples de
 * capas com scroll nativo — a peça continua acessível.
 */
export function WorkCartoes({ itens }: { itens: WorkItem[] }) {
  const palco = useRef<HTMLDivElement | null>(null);
  const motor = useRef<CartoesWebGL | null>(null);
  const [ativo, setAtivo] = useState(0);
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
    const v = criarCartoesWebGL(
      el,
      itens.map((w) => w.cover.src),
      (i) => setAtivo(i),
      (i) => navigate(`/work/${itens[i].slug}`),
    );
    motor.current = v;
    setSemGL(!v);
    setAtivo(0);
    return () => {
      v?.destruir();
      motor.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const peca = itens[ativo] ?? itens[0];

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
        ) : null}
      </div>
      {peca && !semGL ? (
        <p className="p-corpo p-cartoes-legenda" aria-live="polite">
          <span>{peca.title}</span>
          <span className="p-cartoes-meta">{peca.disciplines.join(", ")}</span>
          <span className="p-cartoes-meta">{peca.year}</span>
        </p>
      ) : null}
    </div>
  );
}
