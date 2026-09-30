import { useEffect, useState } from "react";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { WorkCartoes } from "./WorkCartoes";

/**
 * HOME — ONE PAGE (30/09, áudios do Mateus).
 *
 * *"ficou muita informação na primeira tela — o showreel passando e o hover
 * mudando de projeto, os dois juntos ficam pesados"*. Ele deu três saídas
 * (só o reel · centro neutro com o nome e os cards · one page) e fechou com
 * "confio na sua direção". A one page ABSORVE a segunda: cada coisa que ele
 * gostou ganha a sua tela, em vez de disputar a mesma.
 *
 *   1 HERO      neutro: o nome e a linha de ofício; os cards na base. O hover
 *               num card acende o projeto na tela toda (WebGL) e o nome recua.
 *               SEM reel aqui — era ele que pesava por baixo do hover.
 *   2 SOBRE     papel claro (ritmo tinta → papel): a declaração dele em corpo
 *               grande e as quatro especialidades, cada uma com a peça que a prova.
 *   3 SHOWREEL  a seção só dele, tela cheia; o clique abre com som.
 *   4 PROVA     onde o trabalho foi publicado.
 *
 * A página ROLA agora: a roda vertical é da página, e a fita anda por arrasto
 * e pela rolagem horizontal do trackpad (`rolaPagina`).
 */
export default function HomeUma() {
  useMetaRota();
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);
  const [comSom, setComSom] = useState(false);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 6);

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="completo">
      {/* ─ 1 · HERO ───────────────────────────────────────────────────────── */}
      <section className={`p-uma-hero${sob ? " p-uma-hero--projeto" : ""}`}>
        <HoverFluido sob={sob} modo="liquido" receita={4} />
        <div className="p-uma-nome">
          <h1 className="p-uma-titulo">Mateus Bredoff</h1>
          <p className="p-marca p-uma-oficio">Brand designer &amp; art director — Brazil, working worldwide</p>
        </div>
        <div className="p-uma-fita">
          <WorkCartoes itens={WORK} plano rolaPagina aoSob={(i) => setSob(i == null ? null : WORK[i])} />
        </div>
      </section>

      {/* ─ 2 · SOBRE ──────────────────────────────────────────────────────── */}
      <section className="p-uma-papel p-uma-sobre">
        <p className="p-rotulo">About</p>
        <p className="p-uma-declaracao">{LEAD[0]}</p>
        <p className="p-corpo p-uma-corpo">{LEAD[1]}</p>
        <ul className="p-uma-servicos">
          {SERVICOS.map((s, i) => (
            <li key={s.nome}>
              <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
              <span className="p-item">{s.nome}</span>
              <span className="p-corpo">{s.entrega}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─ 3 · SHOWREEL ───────────────────────────────────────────────────── */}
      <section className="p-uma-reel">
        <div className="p-uma-reel-cab">
          <p className="p-rotulo">Showreel — {REEL.ano}</p>
          {REEL.video ? (
            <button type="button" className="p-corpo p-link p-uma-som" onClick={() => setComSom(true)}>
              Play with sound
            </button>
          ) : null}
        </div>
        {REEL.video ? (
          <button type="button" className="p-uma-reel-palco" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
            <video
              src={REEL.video}
              autoPlay
              muted
              loop
              playsInline
              poster={REEL.capa.src}
              ref={(el) => {
                if (!el) return;
                el.muted = true;
                void el.play().catch(() => {});
              }}
            />
          </button>
        ) : null}
      </section>

      {/* ─ 4 · PROVA ──────────────────────────────────────────────────────── */}
      <section className="p-uma-prova">
        <p className="p-rotulo">Published in</p>
        <ul>
          {publicados.map((r) => (
            <li key={`${r.veiculo}-${r.projeto}`}>
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-item p-link">
                  {r.veiculo}
                </a>
              ) : (
                <span className="p-item">{r.veiculo}</span>
              )}
              <span className="p-corpo">
                {r.projeto}, {r.ano}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
