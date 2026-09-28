import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { REEL, REELS } from "../../content/reel";
import { PECAS } from "../../content/pecas";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — O REEL DE FUNDO (28/09).
 *
 * Direção do Thalyson, apontando o frame "BNB - Home" do arquivo GOODTASTE
 * BRAND WEB (node 141:86): "reel de fundo". Responde ao áudio do Mateus
 * ("o site abriria melhor com o showreel") sem virar documento: a home segue
 * UMA TELA, o reel é o chão dela, e o trabalho entra como uma FAIXA de peças
 * nomeadas no canto inferior direito — cada projeto com rótulo e borda
 * própria, que era o que faltava na trama ("onde termina um, começa outro?").
 *
 * Anatomia medida no frame (1920): frase em duas linhas no canto inferior
 * esquerdo; faixa de cartões 200×155 com vão 12 e o nome 12px acima; o último
 * cartão é um "+" que leva ao índice inteiro. O menu dele fica por cima em
 * branco `difference` — o mesmo modo que já vale sobre a capa da about.
 *
 * ⭐ 28/09 (tarde) — "algo mais dentro da IDV": a faixa de miniaturas era a
 * gramática do Goodtaste, não a deste site. Ficou o CONCEITO (reel atrás,
 * hover mostra o projeto) e a matéria voltou a ser a da casa: a TABELA da
 * /work (nº · projeto · disciplina · ano, fio de 1px, mono nos metadados) na
 * grade do menu — rótulo na coluna do nome, tabela nascendo na coluna da hora.
 * Imagem enorme, tipo pequeno: o registro editorial que o site já tem.
 *
 * DOIS ESTADOS DO FUNDO, e a diferença entre eles é o gesto:
 *   REEL     — o filme (ou, sem arquivo, as capas rodando em P&B e apagadas)
 *   PROJETO  — o hover numa linha acende a capa DAQUELE projeto, em cor cheia
 * Sem essa diferença de valor, "mostrar o projeto" num fundo que já mostra
 * capas não se veria.
 */
export default function HomeFundo() {
  useMetaRota();
  const [k, setK] = useState(0);
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);
  const n = WORK.length;
  /* três montagens temporárias do reel, para comparar: ?reel=a|b|c */
  const [params] = useSearchParams();
  const reel = REELS[(params.get("reel") ?? "a") as keyof typeof REELS] ?? REEL.video;
  /* como o projeto se apresenta no hover (28/09, "outro modelo, diagramação"):
     prancha (padrão) · sequencia · capa (a tela cheia de antes) */
  const hover = (params.get("hover") ?? "prancha") as "prancha" | "sequencia" | "capa";

  useEffect(() => {
    WORK.forEach((w) => {
      const im = new Image();
      im.src = w.cover.src2x ?? w.cover.src;
    });
  }, []);

  /* o "reel" provisório: as capas passando enquanto o filme não existe */
  useEffect(() => {
    if (REEL.video || prefersReducedMotion()) return;
    const iv = setInterval(() => setK((i) => (i + 1) % n), 2600);
    return () => clearInterval(iv);
  }, [n]);

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" tela>
      <h1 className="sr-only">
        Mateus Bredoff — brand designer and art director. Selected work:{" "}
        {WORK.map((w) => w.title).join(", ")}.
      </h1>

      <div className={`p-capa-full p-fundo${sob ? (hover === "capa" ? " p-fundo--projeto" : " p-fundo--diagrama") : ""}`} aria-hidden="true">
        {/* camada 1 — o reel */}
        <div className="p-fundo-reel">
          {REEL.video ? (
            <video
              key={reel}
              src={reel}
              autoPlay
              muted
              loop
              playsInline
              poster={REEL.capa.src}
              /* ⚠ o `muted` do React vira PROPRIEDADE, não atributo — no HTML
                 pré-renderizado o vídeo nasce sem ele e o navegador pode barrar
                 o autoplay. Garante mudo e manda tocar ao montar. */
              ref={(el) => {
                if (!el) return;
                el.muted = true;
                void el.play().catch(() => {});
              }}
            />
          ) : (
            <img key={WORK[k].slug} className="p-fundo-entra" src={WORK[k].cover.src2x ?? WORK[k].cover.src} alt="" draggable={false} />
          )}
        </div>
        {/* camada 2 — o projeto sob o cursor, por cima do reel */}
        {sob && hover === "capa" ? (
          <img key={`p-${sob.slug}`} className="p-fundo-projeto p-fundo-entra" src={sob.cover.src2x ?? sob.cover.src} alt="" draggable={false} />
        ) : null}
      </div>

      {/* A DIAGRAMAÇÃO — o projeto se monta sobre o reel apagado. Cada peça
          sobe pela máscara em cascata (--i), o mesmo gesto de entrada do site. */}
      {sob && hover !== "capa" ? (
        <div key={`${hover}-${sob.slug}`} className={`p-diag p-diag--${hover}`} aria-hidden="true">
          <div className="p-diag-ficha">
            <span className="p-marca">
              {String(WORK.indexOf(sob) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span className="p-diag-nome">{sob.title}</span>
            <span className="p-marca">
              {sob.disciplines.join(", ")} · {sob.year}
            </span>
          </div>
          <div className="p-diag-pecas">
            {(hover === "prancha" ? PECAS[sob.slug].slice(0, 3) : PECAS[sob.slug].slice(0, 4)).map((src, i) => (
              <span key={src + i} className="p-diag-peca" style={{ ["--i" as string]: i }}>
                <img src={src} alt="" draggable={false} />
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <section className="p-fundo-base">
        <div className="p-fundo-rotulo">
          <p className="p-rotulo">Selected work — {String(n).padStart(2, "0")}</p>
          <p className="p-corpo pt-3" style={{ maxWidth: "30ch" }}>
            Brand designer and art director, based in Brazil, working worldwide.
          </p>
        </div>

        <ul className="p-fundo-tabela" onMouseLeave={() => setSob(null)}>
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <Link
                to={`/work/${w.slug}`}
                className={`p-fundo-linha${sob?.slug === w.slug ? " aceso" : ""}`}
                onMouseEnter={() => setSob(w)}
                onFocus={() => setSob(w)}
                onBlur={() => setSob(null)}
              >
                <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
                <span className="p-item">{w.title}</span>
                <span className="p-corpo p-fundo-meta">{w.disciplines.join(", ")}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link to="/work" className="p-fundo-linha p-fundo-todos">
              <span className="p-marca">→</span>
              <span className="p-item">All work</span>
            </Link>
          </li>
        </ul>
      </section>
    </Prancha>
  );
}
