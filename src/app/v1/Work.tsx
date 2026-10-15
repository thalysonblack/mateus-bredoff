import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { WorkCartoes } from "./WorkCartoes";
import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarArquivoWebGL, type ArquivoWebGL } from "../../lib/arquivoWebGL";
import { Prancha } from "../compartilhado/sistema";

/* os filtros são as disciplinas que existem no acervo, por frequência — sem
   categoria inventada */
const FILTROS = [
  "All",
  ...[...WORK.flatMap((w) => w.disciplines).reduce((m, d) => m.set(d, (m.get(d) ?? 0) + 1), new Map<string, number>())]
    .sort((a, b) => b[1] - a[1])
    .map(([d]) => d),
];

export default function WorkV2() {
  useMetaRota();
  const [ativo, setAtivo] = useState(0);
  const [params, setParams] = useSearchParams();
  const modo: "list" | "cards" = params.get("view") === "list" ? "list" : "cards";
  const setModo = (m: "list" | "cards") => setParams(m === "list" ? { view: "list" } : {}, { replace: true });
  const [filtro, setFiltro] = useState("All");
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
    window.addEventListener("wheel", roda, { passive: true });
    gsap.ticker.add(passo);
    return () => {
      window.removeEventListener("wheel", roda);
      gsap.ticker.remove(passo);
      v.destruir();
      gl.current = null;
    };
  }, [modo]);

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
    <Prancha n="02" nome="Work" superficie="branco" tela status={`${WORK.length} projects`}>
      {/* a linha de controle NA GRADE DO MENU (17/09, "me incomoda o alinhamento
          no menu"): o modo na coluna do nome (12), os filtros nascendo na coluna
          da hora — a mesma régua do cabeçalho. Em cards ela vive dentro do palco,
          pendurada logo acima do card do centro ("mais próximo ao projeto"). */}
      {(() => {
        const controles = (
          <div className={`p-work-modo${modo === "cards" ? " p-work-modo--cards" : ""}`}>
            <div className="p-work-modo-grupo" role="tablist" aria-label="View">
              {(["cards", "list"] as const).map((m) => (
                <button key={m} type="button" role="tab" aria-selected={modo === m} className={`p-corpo p-work-chip${modo === m ? " on" : ""}`} onClick={() => setModo(m)}>
                  {modo === m ? <span className="p-work-quad" aria-hidden="true" /> : null}
                  {m === "list" ? "List" : "Cards"}
                </button>
              ))}
            </div>
            {modo === "cards" ? (
              <div className="p-work-modo-grupo p-work-filtros" role="tablist" aria-label="Filter">
                {FILTROS.map((f) => (
                  <button key={f} type="button" role="tab" aria-selected={filtro === f} className={`p-work-pilula${filtro === f ? " on" : ""}`} onClick={() => setFiltro(f)}>
                    {f}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
        return modo === "cards" ? (
          <WorkCartoes itens={WORK.filter((w) => filtro === "All" || w.disciplines.includes(filtro))} controles={controles} />
        ) : (
          <>
            {controles}
      <section className="p-arquivo">
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
          </>
        );
      })()}
    </Prancha>
  );
}
