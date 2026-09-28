import { useEffect, useState } from "react";
import { Link } from "react-router";
import { prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
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
 * ⚠ SEM O ARQUIVO DO REEL, o fundo é a capa do projeto em foco: roda sozinha
 * e o hover num cartão a troca. Quando `REEL.video` existir, o fundo vira o
 * filme mudo em loop e o hover deixa de trocar o fundo.
 */
export default function HomeFundo() {
  useMetaRota();
  const [k, setK] = useState(0);
  const [pausa, setPausa] = useState(false);
  const n = WORK.length;
  const atual = WORK[k];

  useEffect(() => {
    WORK.forEach((w) => {
      const im = new Image();
      im.src = w.cover.src2x ?? w.cover.src;
    });
  }, []);

  useEffect(() => {
    if (REEL.video || pausa || prefersReducedMotion()) return;
    const iv = setInterval(() => setK((i) => (i + 1) % n), 3200);
    return () => clearInterval(iv);
  }, [pausa, n]);

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" tela>
      <h1 className="sr-only">
        Mateus Bredoff — brand designer and art director. Selected work:{" "}
        {WORK.map((w) => w.title).join(", ")}.
      </h1>

      {/* o chão: o reel (ou a capa em foco), sangrando a tela inteira */}
      <div className="p-capa-full p-fundo" aria-hidden="true">
        {REEL.video ? (
          <video src={REEL.video} autoPlay muted loop playsInline poster={REEL.capa.src} />
        ) : (
          <img key={atual.slug} className="p-fundo-entra" src={atual.cover.src2x ?? atual.cover.src} alt="" draggable={false} />
        )}
      </div>

      <section className="p-fundo-base">
        <p className="p-fundo-frase">
          Brand designer and art director,
          <br />
          based in Brazil, working worldwide.
        </p>

        <ul
          className="p-fundo-faixa"
          data-lenis-prevent
          onMouseLeave={() => setPausa(false)}
          /* a página não rola (é uma tela): a roda vertical anda a faixa */
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          {WORK.map((w, i) => (
            <li key={w.slug}>
              <Link
                to={`/work/${w.slug}`}
                className={`p-fundo-cartao${!REEL.video && i === k ? " on" : ""}`}
                onMouseEnter={() => {
                  setPausa(true);
                  setK(i);
                }}
                onFocus={() => {
                  setPausa(true);
                  setK(i);
                }}
              >
                <span className="p-fundo-nome">{w.title}</span>
                <span className="p-fundo-arte">
                  <img src={w.cover.src} alt={w.cover.alt} decoding="async" draggable={false} />
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link to="/work" className="p-fundo-cartao p-fundo-mais" aria-label="All work">
              <span className="p-fundo-nome">All work</span>
              <span className="p-fundo-arte">
                <span aria-hidden="true">+</span>
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </Prancha>
  );
}
