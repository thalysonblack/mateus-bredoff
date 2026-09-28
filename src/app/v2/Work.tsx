import { useState } from "react";
import { useSearchParams } from "react-router";
import { WorkCartoes } from "./WorkCartoes";
import { WorkLista } from "./WorkLista";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * FOLHA 02 — WORK. O índice UTILITÁRIO.
 *
 * ⭐ A decisão vem de um achado do artemshcherban: ele mantém **dois índices
 * para o mesmo acervo** — `/selected`, que é espetáculo (carrossel 3D, uma tela,
 * não rola), e `/portfolio`, que é lista tipográfica chapada, sem uma imagem
 * sequer. Um para encantar, outro para achar.
 *
 * Aqui a divisão é a mesma: a home é a folha de espécimes (o nome de cada marca
 * em corpo de cartaz) e esta rota é a TABELA — todos os nove projetos, com
 * índice, disciplina e ano, na altura de linha em que se varre uma lista com o
 * olho. Quem chegou para admirar fica na home; quem chegou para procurar vem
 * para cá.
 *
 * A grade da linha (índice · título · disciplina · ano) é a mesma proporção
 * medida no archive do corentin — `.5fr 1.5fr 1fr .5fr` —, que é a distribuição
 * que faz o título mandar sem espremer o metadado.
 *
 * ## O CARROSSEL VERTICAL (17/08)
 *
 * A prévia deixou de ser uma imagem que troca no hover e virou uma COLUNA que
 * rola: o scroll move a pilha de peças na janela à esquerda, e a tabela
 * acompanha — a linha da peça enquadrada acende, as outras apagam. Referência
 * dele: `framer-assets-five.vercel.app/archive`, do próprio acervo dele.
 *
 * ⚠ E aqui vai ALÉM da referência de propósito: lá a coluna é `clamped`
 * (`Math.min(scroll, totalScroll)` no código, e medido no site: trava em 08/08
 * e não volta). Aqui ela é INFINITA, como a trama da home — o mesmo empurrão
 * dobrado pelo comprimento de um ciclo. Duas mecânicas diferentes de rolagem no
 * mesmo site seriam dois sistemas; uma só, repetida em escalas diferentes, é um.
 *
 * A página não rola: o gesto é todo da coluna, como na home.
 */
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
  /* ⭐ DOIS MODOS (16/09): "vamos poder ver em lista ou como esse [/cases do
     Framer dele], só que scroll lateral" → e depois "nesse efeito
     [/naughtyduk] no works, e deixar como padrão". CARDS é o padrão; a lista
     viaja em `?view=list`. */
  const [params, setParams] = useSearchParams();
  const modo: "list" | "cards" = params.get("view") === "list" ? "list" : "cards";
  const setModo = (m: "list" | "cards") => setParams(m === "list" ? { view: "list" } : {}, { replace: true });
  const [filtro, setFiltro] = useState("All");
  return (
    <Prancha n="02" nome="Work" superficie="branco" tela status={`${WORK.length} projects`}>
      {/* ⚠ A ROTA CABE NA TELA e não rola — igual à referência
          (`.archive-page` é `fixed inset:0; overflow:hidden`) e igual à home
          deste site. O gesto é todo da coluna. */}
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
      <WorkLista />
          </>
        );
      })()}
    </Prancha>
  );
}
