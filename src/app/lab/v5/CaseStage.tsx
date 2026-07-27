import { Link } from "react-router";
import { Mono, Bracket } from "../../system";
import { WORK } from "../../../content/work";

/**
 * CaseStage — cada projeto ocupa uma tela, a peça em sangria total.
 *
 * O contrário do índice escalonado: em vez de sete miniaturas competindo, uma
 * peça por vez em tamanho de exposição. O texto é mínimo e fica ancorado no pé,
 * porque a arte já é o argumento — quem rola está vendo o trabalho, não lendo
 * sobre ele.
 *
 * A escolha tem custo e vale nomeá-lo: perde-se a comparação de relance (não se
 * vê o conjunto do portfólio numa olhada) e a página fica longa. Ganha-se a
 * escala que faz uma identidade visual ser avaliada de verdade. Para um designer
 * cujo trabalho é imagem, esse é o câmbio certo.
 *
 * ⚠ A arte usa `object-cover` numa caixa de altura fixa, então recorta — é
 * inevitável em tela cheia com proporções que vão de 16:9 a retrato 5:6. O
 * `focus` por projeto controla onde o recorte cai, e a página do case continua
 * mostrando a peça inteira na proporção nativa.
 */

/* Onde o recorte deve cair em cada arte, para o assunto não ser cortado. */
const FOCO: Record<string, string> = {
  "alex-archer": "center 42%",
  stag: "center 26%",
  ferraci: "center 50%",
  proxima: "center 45%",
  votare: "center 44%",
};

export default function CaseStage() {
  return (
    <section id="work" className="w-full">
      {WORK.map((w, i) => (
        <article
          key={w.slug}
          className="on-ink relative flex h-[100dvh] min-h-[30rem] w-full flex-col justify-end overflow-clip"
        >
          <img
            src={w.cover.src}
            srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
            sizes="100vw"
            alt={w.cover.alt}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: FOCO[w.slug] ?? "center" }}
          />

          {/* Véu só no pé, onde o texto mora: a arte fica limpa no miolo e o
              texto tem fundo garantido. Um véu de tela inteira apagaria a peça —
              que é justamente o que esta versão quer mostrar. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[46%]"
            style={{ background: "linear-gradient(to top, rgba(19,39,45,0.88), rgba(19,39,45,0))" }}
          />

          <div className="bleed relative z-10 pb-[clamp(1.5rem,5vh,3.5rem)]">
            <div className="flex items-baseline gap-[clamp(0.75rem,2vw,1.5rem)]">
              <Mono style={{ color: "#ede6e1", opacity: 0.75 }}>
                {String(i + 1).padStart(2, "0")}
              </Mono>
              <Mono style={{ color: "#ede6e1", opacity: 0.75 }}>
                {`${w.disciplines.join(" / ")} · ${w.year}`}
              </Mono>
            </div>

            <h2
              className="t-display t-display-xl pt-[clamp(0.5rem,1.5vh,1rem)]"
              style={{ fontSize: "clamp(2rem,7vw,120px)", color: "#ede6e1" }}
            >
              {w.title}
            </h2>

            <div className="flex flex-col gap-4 pt-[clamp(0.75rem,2vh,1.5rem)] md:flex-row md:items-end md:justify-between">
              <p className="t-body max-w-[46ch]" style={{ color: "#ede6e1", opacity: 0.86 }}>
                {w.about[0] ??
                  `${w.disciplines.join(" and ")} for ${w.title}. Case study in preparation.`}
              </p>
              <Link to={`/work/${w.slug}`} className="shrink-0" style={{ color: "#ede6e1" }}>
                <Bracket>OPEN CASE</Bracket>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
