import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarArquivoWebGL, type ArquivoWebGL } from "../../lib/arquivoWebGL";

/**
 * O modo LISTA da /work — tabela à esquerda, coluna WebGL à direita.
 * Extraído de `Work.tsx` em 28/09 para abrir também a home, abaixo do reel.
 * `dirigePelaRoda`: na /work (tela que não rola) o wheel anda a coluna; na
 * home a página rola, então só a tabela a dirige.
 */
export function WorkLista({ dirigePelaRoda = true }: { dirigePelaRoda?: boolean }) {
  const [ativo, setAtivo] = useState(0);
  const peca = WORK[ativo];
  const janela = useRef<HTMLDivElement | null>(null);
  const pilha = useRef<HTMLDivElement | null>(null);
  /* posição em UNIDADES DE ITEM: 2,4 = entre o terceiro e o quarto */
  const pos = useRef(0);
  const alvo = useRef(0);

  /**
   * O SCROLL MOVE A COLUNA, e ela não acaba.
   *
   * Mesma mecânica da trama da home: `wheel` alimenta um alvo, o ticker do GSAP
   * persegue com lerp, e o deslocamento é dobrado pelo comprimento de um ciclo.
   * ⚠ `((x % L) + L) % L` porque o `%` do JS devolve negativo para entrada
   * negativa, e o salto de −L para 0 apareceria.
   * ⚠ TRÊS CÓPIAS no markup: a janela mostra mais de um item por vez, então uma
   * só cópia deixaria buraco na virada do ciclo.
   */
  const gl = useRef<ArquivoWebGL | null>(null);
  const [semGL, setSemGL] = useState(false);

  /**
   * A COLUNA É WEBGL — porte do `/archive` dele (ver `lib/arquivoWebGL.ts`).
   *
   * Aqui fica só o que é da PÁGINA: o gesto (wheel → alvo → lerp), a sincronia
   * com a tabela e o relógio. A curva, a lente e o grão vivem no renderer, que
   * recebe apenas o índice flutuante.
   */
  useEffect(() => {
    const caixa = janela.current;
    if (!caixa) return;
    const v = criarArquivoWebGL(caixa, WORK.map((w) => w.cover.src));
    gl.current = v;
    setSemGL(!v);
    if (!v || prefersReducedMotion()) return;

    /* na home a página ROLA: o wheel é do documento, e a coluna anda só pela
       tabela (hover/foco levam a peça ao centro) */
    const roda = (e: WheelEvent) => {
      alvo.current += e.deltaY / 420;
    };
    const passo = () => {
      pos.current += (alvo.current - pos.current) * 0.1;
      if (Math.abs(alvo.current - pos.current) < 0.0005) pos.current = alvo.current;
      v.scroll(pos.current);
      v.passo(0.016);
      const n = WORK.length;
      const i = ((Math.round(pos.current) % n) + n) % n;
      setAtivo((antes) => (antes === i ? antes : i));
    };
    if (dirigePelaRoda) window.addEventListener("wheel", roda, { passive: true });
    gsap.ticker.add(passo);
    return () => {
      window.removeEventListener("wheel", roda);
      gsap.ticker.remove(passo);
      v.destruir();
      gl.current = null;
    };
  }, [dirigePelaRoda]);

  /* percorrer a tabela leva a coluna até a peça — pelo caminho MAIS CURTO, que
     numa lista circular nem sempre é a diferença bruta de índices */
  const irPara = (i: number) => {
    const n = WORK.length;
    const atual = alvo.current;
    const resto = ((atual % n) + n) % n;
    let delta = i - resto;
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    alvo.current = atual + delta;
  };

  return (
      <section className="p-arquivo">
        {/* ─ a tabela, À ESQUERDA ────────────────────────────────────────
            Medido na referência: 48% da largura, com fio vertical separando.
            (Aqui ela já esteve à direita, com a peça à esquerda — ele apontou
            a referência e disse "não tá igual".) */}
        <div className="p-arquivo-lista">
          <div
            className="p-rotulo grid pb-3"
            style={{ gridTemplateColumns: ".5fr 1.5fr 1fr .5fr", columnGap: "var(--p-gap-x)" }}
          >
            <span>Nº</span>
            <span>Project</span>
            <span className="max-md:hidden">Discipline</span>
            <span className="text-right">Year</span>
          </div>

          <ul className="p-tabela">
            {WORK.map((w, i) => (
              <li key={w.slug} className="p-fio">
                <Link
                  to={`/work/${w.slug}`}
                  onMouseEnter={() => irPara(i)}
                  onFocus={() => irPara(i)}
                  aria-current={ativo === i ? "true" : undefined}
                  className={`p-corpo p-tabela-linha grid items-baseline py-4 ${ativo === i ? "aceso" : ""}`}
                  style={{
                    gridTemplateColumns: ".5fr 1.5fr 1fr .5fr",
                    columnGap: "var(--p-gap-x)",
                    ["--cor" as string]: corDe(w.slug),
                  }}
                >
                  <span className="p-tabela-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="p-item">{w.title}</span>
                  <span className="p-tabela-meta max-md:hidden">{w.disciplines.join(", ")}</span>
                  <span className="p-tabela-meta text-right">{w.year}</span>
                </Link>
              </li>
            ))}
          </ul>

        </div>

        {/* ─ a coluna, À DIREITA, com a peça ativa CENTRADA ───────────────
            Medido na referência: escala 1,00 no centro caindo para 0,95, e
            opacidade 1,00 caindo para 0,35 — a queda de opacidade é o que faz
            uma peça mandar e as outras assistirem. Espaçamento quase zero
            (card 1,80, passo 1,81), então as peças quase se encostam. */}
        <div ref={janela} className="p-arquivo-visor">
          {/* ⚠ sem WebGL a coluna não some: a peça enquadrada entra como imagem
              simples. Sem curva, com a peça. */}
          {semGL ? (
            <span className="p-arquivo-plano">
              <img src={peca.cover.src} alt={peca.cover.alt} decoding="async" draggable={false} />
            </span>
          ) : null}
          {/* ⓘ a ficha "FIG. 08 · Votare — 2025" saiu a pedido dele: a tabela ao
              lado já nomeia a peça enquadrada, e repetir o nome embaixo da
              imagem era o mesmo dado dito duas vezes. */}
        </div>
      </section>
  );
}
