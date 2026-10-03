import { useEffect, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { PECAS } from "../../content/pecas";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
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
/**
 * `tela`: a VERSÃO B que ele pediu no mesmo áudio — "no centro algo mais
 * neutro, só o nome, e embaixo o hover" — numa tela só, sem rolagem: só a
 * hero, e a roda anda a fita (a página não tem para onde rolar).
 */
export default function HomeUma({ tela = false }: { tela?: boolean } = {}) {
  useMetaRota();
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape={tela ? "regua" : "completo"} tela={tela}>
      {/* ─ 1 · HERO ───────────────────────────────────────────────────────── */}
      <section className={`p-uma-hero${sob ? " p-uma-hero--projeto" : ""}`}>
        <HoverFluido sob={sob} modo="liquido" receita={4} />
        <div className="p-uma-nome">
          <h1 className="p-uma-titulo">Mateus Bredoff</h1>
          <p className="p-marca p-uma-oficio">Brand designer &amp; art director — Brazil, working worldwide</p>
        </div>
        <div className="p-uma-fita">
          <WorkCartoes itens={WORK} plano rolaPagina={!tela} aoSob={(i) => setSob(i == null ? null : WORK[i])} />
        </div>
      </section>

      {tela ? null : <SecoesUma />}

    </Prancha>
  );
}

/**
 * As seções da one page abaixo da hero — sobre, serviços, showreel, publicado.
 * Componente próprio porque duas homes as usam: a one page e o conceito 3D
 * (`/v2/espaco`), que troca só a hero.
 */
export function SecoesUma() {
  const [comSom, setComSom] = useState(false);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 5);

  return (
    <>
      {/* ─ 2 · SOBRE — duas colunas: ele à esquerda, a declaração à direita ─ */}
      <section className="p-uma-papel p-uma-sobre2">
        <figure className="p-uma-retrato">
          <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
        </figure>
        <div className="p-uma-sobre2-texto">
          <p className="p-rotulo">About</p>
          <p className="p-uma-declaracao">{LEAD[0]}</p>
          <p className="p-corpo p-uma-corpo">{LEAD[1]}</p>
        </div>
      </section>

      {/* ─ 2b · SERVIÇOS — quatro colunas, cada serviço com a peça que o prova ─ */}
      <section className="p-uma-servicos2">
        <p className="p-rotulo">What I do</p>
        <ul>
          {SERVICOS.map((sv, i) => {
            const w = WORK.find((x) => x.slug === sv.peca) ?? WORK[i];
            return (
              <li key={sv.nome}>
                <Link to={`/work/${w.slug}`} className="p-uma-servico">
                  <span className="p-uma-servico-peca">
                    <img src={PECAS[w.slug][1] ?? PECAS[w.slug][0]} alt="" loading="lazy" decoding="async" draggable={false} />
                  </span>
                  {/* ⚠ o "®" não existe na Departure Mono — vira quadrado vazio no rótulo */}
                  <span className="p-marca">{String(i + 1).padStart(2, "0")} — {w.title.replace("®", "").trim()}</span>
                  <span className="p-uma-servico-nome">{sv.nome}</span>
                  <span className="p-corpo">{sv.entrega}</span>
                </Link>
              </li>
            );
          })}
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

      {/* ─ 4 · PUBLICADO — índice editorial: o veículo em display, a peça ao lado ─ */}
      <section className="p-uma-papel p-uma-publicado">
        <p className="p-rotulo">Published in</p>
        <ol>
          {publicados.map((r, i) => (
            <li key={`${r.veiculo}-${r.projeto}`}>
              <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
              <span className="p-uma-veiculo">
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer">
                    {r.veiculo}
                  </a>
                ) : (
                  r.veiculo
                )}
              </span>
              <span className="p-corpo p-uma-pub-ficha">
                {r.projeto} · {r.ano}
              </span>
              <span className="p-uma-pub-peca">
                <img src={r.foto.src} alt={r.foto.alt} loading="lazy" decoding="async" draggable={false} />
              </span>
            </li>
          ))}
        </ol>
      </section>
      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </>
  );
}
