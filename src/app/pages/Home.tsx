import { useMetaRota } from "../../hooks/useMetaRota";
import HeroFramer from "../sections/framer/HeroFramer";
import BlocoRotulado from "../sections/framer/BlocoRotulado";
import MarqueeTrabalho from "../sections/framer/MarqueeTrabalho";
import Capacidades from "../sections/framer/Capacidades";
import RodapeFramer from "../sections/framer/RodapeFramer";

/**
 * Home — réplica do publicado.
 *
 * A home autoral (Intro · Hero · About · Work · Capabilities · Pricing ·
 * Footer) saiu inteira daqui: o alvo do projeto deixou de ser uma direção
 * própria e passou a ser sair do Framer com o site que já está no ar. As
 * seções antigas continuam em `sections/` e no histórico.
 *
 * Marcos medidos no original (@1600px), de onde vem toda a ordem abaixo:
 *   653  nome do hero, sangrando pela base
 *  1018  manifesto em 64px, marrom, na margem
 *  1674  parágrafos de corpo, começando em x=424
 *  2567  esteira de projetos (bloco escuro)
 *  2937  disciplinas em 64px, x=424
 *  3668  rodapé "Let's Talk"
 *
 * A espinha é o `BlocoRotulado`: rótulo de 12px numa coluna fixa de 400px,
 * conteúdo em x=424. O manifesto é a ÚNICA exceção — começa na margem, sem
 * rótulo, e é por quebrar a coluna que ele lê como abertura e não como mais
 * uma seção.
 *
 * ⚠ Nada de `transform`, `opacity` ou `filter` em ancestral do Hero: o nome
 * dele vive sob `mix-blend-difference` e um stacking context o apaga.
 */

/* Quebra MANUAL, como no original: a caixa comportaria mais palavra na
   primeira linha. Deixar a quebra automática resolver dá três linhas de
   comprimentos diferentes e desmancha a composição. */
const MANIFESTO = [
  "I’m a multidisciplinary designer",
  "focused on visual identities, based",
  "in Brazil and working worldwide.",
];

/* Texto do cliente, transcrito do publicado — não reescrever. */
const SOBRE = [
  "My approach begins with a deep understanding of the universe in which your company operates. I analyze your business goals, your audience, your competitors, and conduct careful conceptual research to transform strategy into visual expression.",
  "The result is exclusive work that combines strategic thinking with refined graphic aesthetics, designed to position brands in a clear, relevant, and memorable way.",
];

export default function Home() {
  /* A home DECLARA o seu título mesmo sendo igual ao do `index.html`. Antes ela
     não declarava nada e o título certo aparecia por sorte — pela restauração
     que a rota anterior fazia ao desmontar. Rota que depende do cleanup da
     vizinha quebra no dia em que a vizinha mudar. */
  useMetaRota({});

  return (
    <div className="fr">
      <HeroFramer />

      {/* Manifesto — sem rótulo e fora da coluna, de propósito. */}
      <section
        className="fr-display"
        style={{
          color: "var(--fr-marrom)",
          paddingInline: "var(--fr-margem)",
          paddingTop: "150px",
          paddingBottom: "180px",
        }}
      >
        <h1 aria-label={MANIFESTO.join(" ")}>
          {MANIFESTO.map((linha, i) => (
            <span key={linha} aria-hidden="true">
              {i > 0 ? <br /> : null}
              {linha}
            </span>
          ))}
        </h1>
      </section>

      {/* Os dois parágrafos ficam LADO A LADO, não empilhados: medido, o
          segundo começa em x=922 contra x=424 do primeiro. Empilhados eles
          liam como um texto só e longo; em duas colunas leem como as duas
          metades de uma ideia — que é o que são. */}
      <BlocoRotulado rotulo="About me" className="pb-[180px]">
        <div
          /* Colunas DESIGUAIS: a segunda começa 498px depois da primeira
             (x=922 contra x=424, medido). Com `grid-cols-2` as duas ficam
             iguais e o segundo parágrafo cai 115px à direita do lugar. */
          className="fr-corpo grid gap-x-[74px] gap-y-6 md:grid-cols-[424px_minmax(0,1fr)]"
          style={{ color: "var(--fr-quieto)" }}
        >
          {SOBRE.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </BlocoRotulado>

      {/* Esteira — o mesmo componente da /work. Bloco escuro de sangria a
          sangria, por isso fora do BlocoRotulado. */}
      <section className="fr-tinta py-[90px]">
        <div style={{ paddingInline: "var(--fr-margem)" }}>
          <p className="fr-secao-rotulo pb-[33px]">Featured projects</p>
        </div>
        <MarqueeTrabalho />
      </section>

      <BlocoRotulado rotulo="Capabilities" className="pt-[90px] pb-[240px]">
        <Capacidades />
      </BlocoRotulado>

      <div id="contato">
        <RodapeFramer />
      </div>
    </div>
  );
}
