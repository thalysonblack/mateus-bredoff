import { useEffect, useState } from "react";
import { Link } from "react-router";
import { prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";
import { WorkLista } from "./WorkLista";

/**
 * HOME — O REEL ABRE A CASA (28/09, áudios do Mateus de 16–17/09).
 *
 * *"o site abriria melhor com o showreel na primeira tela"* + *"aí tem a
 * sessão de work, já tudo bem definidinho"*. E o porquê, no vídeo dele: na
 * trama, *"de Boreal pra Alex Archer é só um tracinho — onde termina um,
 * começa outro?"*. Como índice, a fita de nomes pedia leitura; como abertura,
 * ela escondia a matéria. Então a ordem virou a de quem chega sem saber nada:
 * o filme (quem é), a prova, e o trabalho na LISTA da /work — um projeto por
 * linha (28/09: "reel + lista da /work", escolhido por ele entre 4 montagens).
 *
 * A trama não morreu — ele pediu para guardar: virou a chamada de "próximo
 * projeto" no fim de cada case (`Case.tsx`), onde ela é convite e não índice.
 * A home D inteira segue viva em `/v2/d`.
 *
 * ⚠ ENQUANTO O REEL NÃO EXISTE (o motion dele está editando), o palco corta
 * entre as capas dos projetos — o mesmo "gif" aprovado em 16/09, agora em tela
 * cheia — e a legenda diz "em edição". Quando `REEL.video` for preenchido o
 * palco vira o filme, mudo em loop, e o clique abre com som. Nada mais muda.
 */
export default function HomeReel() {
  useMetaRota();
  const [k, setK] = useState(0);
  const [aberto, setAberto] = useState(false);
  const n = WORK.length;
  const atual = WORK[k];
  const anterior = WORK[(k - 1 + n) % n];

  useEffect(() => {
    if (REEL.video || prefersReducedMotion()) return;
    /* as capas sobem antes do primeiro corte: sem isso cada troca da primeira
       volta chega com a imagem ainda baixando */
    WORK.forEach((w) => {
      const im = new Image();
      im.src = w.cover.src2x ?? w.cover.src;
    });
    const iv = setInterval(() => setK((i) => (i + 1) % n), 2800);
    return () => clearInterval(iv);
  }, [n]);

  useEffect(() => {
    if (!aberto) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [aberto]);

  const recentes = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 3);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      <h1 className="sr-only">
        Mateus Bredoff — brand designer and art director. Selected work:{" "}
        {WORK.map((w) => w.title).join(", ")}.
      </h1>

      {/* ─ o palco: o reel sangrando a tela, logo abaixo do menu ─────────── */}
      <section className="p-abre">
        {REEL.video ? (
          <button type="button" className="p-abre-palco" onClick={() => setAberto(true)}>
            <video src={REEL.video} autoPlay muted loop playsInline poster={REEL.capa.src} />
            <span className="p-reel-play" aria-hidden="true" />
            <span className="sr-only">Play showreel with sound</span>
          </button>
        ) : (
          <div className="p-abre-palco" aria-hidden="true">
            <img key={`a-${anterior.slug}`} src={anterior.cover.src2x ?? anterior.cover.src} alt="" draggable={false} />
            <img key={`b-${atual.slug}-${k}`} className="p-abre-entra" src={atual.cover.src2x ?? atual.cover.src} alt="" draggable={false} />
          </div>
        )}
        <div className="p-abre-legenda p-marca">
          <span>
            {REEL.titulo} — {REEL.ano}
            {REEL.duracao ? ` · ${REEL.duracao}` : ""}
            {REEL.video ? "" : " · em edição"}
          </span>
          {REEL.video ? null : (
            <Link to={`/work/${atual.slug}`} className="p-link">
              {atual.title} — {atual.year}
            </Link>
          )}
        </div>
      </section>

      {/* ─ quem é, e a prova — uma linha de ficha entre o filme e o trabalho ─ */}
      <section className="grid grid-cols-12 pt-20 max-md:pt-12" style={{ columnGap: "var(--p-gap-x)", rowGap: "var(--p-gap-y)" }}>
        <p className="p-item col-span-6 max-lg:col-span-12" style={{ maxWidth: "24ch" }}>
          Brand designer and art director, based in Brazil, working worldwide.
        </p>
        <p className="p-corpo col-span-3 col-start-7 max-lg:col-span-6 max-lg:col-start-1 max-md:col-span-12" style={{ maxWidth: "38ch" }}>
          Every identity starts from strategy and lands as a visual system built to last.
        </p>
        <div className="col-span-3 col-start-10 max-lg:col-span-6 max-lg:col-start-7 max-md:col-span-12 max-md:col-start-1">
          <Bloco rotulo="Recognition">
            <ul className="grid gap-[6px]">
              {recentes.map((r) => (
                <li key={`${r.veiculo}-${r.projeto}`} className="p-corpo">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                      {r.veiculo}
                    </a>
                  ) : (
                    r.veiculo
                  )}
                  <span style={{ color: "var(--p-quieto)" }}> — {r.projeto}, {r.ano}</span>
                </li>
              ))}
            </ul>
          </Bloco>
        </div>
      </section>

      {/* ─ o trabalho: a LISTA da /work (tabela + coluna), uma tela de altura.
          A tabela dá a fronteira que a trama não dava — um projeto por linha. ─ */}
      <section className="p-home-lista pt-24 max-md:pt-14">
        <div className="flex items-baseline justify-between pb-4">
          <p className="p-rotulo">Selected work — {String(n).padStart(2, "0")}</p>
          <Link to="/work" className="p-corpo p-link">
            All work →
          </Link>
        </div>
        <WorkLista dirigePelaRoda={false} />
      </section>

      {aberto && REEL.video ? (
        <div className="p-player" onClick={() => setAberto(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
