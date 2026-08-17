import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { TIERS } from "../sections/Pricing";
import { CONTATO } from "../v3-system";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";
import { useRevelar } from "./useRevelar";

/**
 * A HOME — completa, com scroll.
 *
 * ⚠ QUINTA versão, e cada correção dele está registrada porque juntas elas SÃO
 * o partido:
 *
 *   1. "era pra ser uma home mais elaborada" — a de fichas era o /about da
 *      referência, não uma home.
 *   2. "vc ta copiando, nao, apenas conceito" — fora a régua de artboard, o
 *      cubo 3D e a sigla sangrando: assinatura do corentin.
 *   3. "gostei mas nao da home" → seis partidos em rota, para escolher.
 *   4. "horrivel os dois" (sala de projeção e alfabeto) — os dois eram
 *      desenhos em UM PLANO. Chapados.
 *   5. "quero profundidade" → "sem perspectiva Z, digo profundidade no sentido
 *      craft, imersao, respiro".
 *   6. "uma home mais completa, com scroll".
 *
 * Então profundidade aqui não é eixo — é ACABAMENTO, ATMOSFERA e AR:
 *
 *   RESPIRO   a página anda em passos de uma tela (`.p-capitulo`), e o vazio
 *             ENTRE assuntos é maior que o vazio dentro deles. É o que faz uma
 *             home longa ler como capítulos em vez de rolo.
 *   IMERSÃO   a superfície troca por capítulo, sangrada de borda a borda —
 *             quem rola muda de ambiente, não de seção.
 *   CRAFT     nada aparece de repente: cada bloco sobe sob máscara com degrau
 *             de 90ms entre irmãos, e a peça entra FORA DE FOCO e resolve.
 *
 * A trama viva abre a página (é a única coisa que ele aprovou de cara), e o
 * resto do site desce dela: trabalho, prova, oferta, contato.
 */

const MANIFESTO =
  "Brand designer and art director working with companies that want a clear, relevant and memorable presence.";

const LEAD =
  "Every identity starts from strategy — objectives, audience, competitors, market context — and lands as a visual system built with intention, made to connect emotionally and to last.";

export default function HomeV2() {
  useMetaRota();
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;

  const capAbertura = useRevelar<HTMLElement>();
  const capSobre = useRevelar<HTMLElement>();
  const capProva = useRevelar<HTMLElement>();
  const capOferta = useRevelar<HTMLElement>();
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      {/* ═ 01 · ABERTURA — a trama viva ═══════════════════════════════════ */}
      <section ref={capAbertura} className="p-capitulo p-visivel">
        <div className="grid gap-2" aria-hidden="true">
          {[fita, [...fita].reverse(), [...WORK.slice(3), ...WORK.slice(0, 3), ...WORK.slice(3), ...WORK.slice(0, 3)]].map(
            (linha, li) => (
              <div key={li} className="p-trama -mx-[var(--p-margem)]">
                <div
                  className={`p-trama-fita ${li === 1 ? "p-trama-fita--volta" : ""} ${li === 2 ? "p-trama-fita--terca" : ""}`}
                >
                  {linha.map((w, k) => (
                    <span key={`${w.slug}-${k}`} className="flex items-baseline gap-[0.32em]">
                      <span
                        className="p-trama-nome"
                        style={{ backgroundImage: `url(${w.cover.src2x ?? w.cover.src})` }}
                      >
                        {w.title}
                      </span>
                      <span className="p-trama-ponto">·</span>
                    </span>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
        <h1 className="sr-only">
          Mateus Bredoff — brand designer and art director. Selected work:{" "}
          {WORK.map((w) => w.title).join(", ")}.
        </h1>

        <div
          className="grid grid-cols-12 pt-14"
          style={{ columnGap: "var(--p-gap-x)" }}
        >
          <p className="p-sobe p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">{MANIFESTO}</p>
          <p className="p-sobe p-marca col-span-2 col-start-11 text-right max-lg:hidden">
            {String(WORK.length).padStart(2, "0")} works · 2026
          </p>
        </div>
      </section>

      {/* ═ 02 · SOBRE — uma frase, e o vazio em volta dela ════════════════ */}
      <section
        ref={capSobre}
        className="p-capitulo -mx-[var(--p-margem)] p-branco"
        style={{ paddingInline: "var(--p-margem)" }}
      >
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">Approach</p>
          <div className="col-span-6 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            <p className="p-sobe p-corpo max-w-[56ch]">{LEAD}</p>
            <p className="p-sobe pt-8">
              <Link to="/v2/about" className="p-corpo p-link" style={{ color: "var(--p-quieto)" }}>
                About the studio →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═ 03 · O TRABALHO — um capítulo por peça, alternando o lado ══════
          Cada projeto ocupa uma tela e entra fora de foco. É o oposto da grade:
          a pessoa não escolhe entre nove miniaturas, ela ATRAVESSA nove peças —
          e é isso que "imersão" quer dizer numa página que rola. */}
      {WORK.map((w, k) => (
        <CapituloPeca key={w.slug} w={w} k={k} />
      ))}

      {/* ═ 04 · A PROVA — reconhecimento, em tinta ════════════════════════ */}
      <section
        ref={capProva}
        className="p-capitulo p-tinta -mx-[var(--p-margem)]"
        style={{ paddingInline: "var(--p-margem)" }}
      >
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">
            Recognition — {String(RECONHECIMENTO.length).padStart(2, "0")}
          </p>
          <ul className="col-span-8 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            {RECONHECIMENTO.map((r) => (
              <li key={`${r.veiculo}-${r.projeto}`} className="p-sobe p-fio py-5">
                <div className="grid grid-cols-12 items-baseline" style={{ columnGap: "var(--p-gap-x)" }}>
                  <span className="p-corpo col-span-3 max-md:col-span-12">
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                        {r.veiculo}
                      </a>
                    ) : (
                      r.veiculo
                    )}
                  </span>
                  <span className="p-corpo col-span-6 max-md:col-span-12" style={{ color: "var(--p-quieto)" }}>
                    {r.titulo}
                  </span>
                  <span className="p-marca col-span-3 text-right max-md:col-span-12 max-md:text-left">
                    {r.projeto} · {r.ano}
                  </span>
                </div>
              </li>
            ))}
            <li className="p-fio" />
          </ul>
        </div>
      </section>

      {/* ═ 05 · A OFERTA + CONTATO ═══════════════════════════════════════ */}
      <section ref={capOferta} className="p-capitulo">
        <div className="grid grid-cols-12" style={{ columnGap: "var(--p-gap-x)" }}>
          <p className="p-rotulo p-sobe col-span-2 max-lg:col-span-12">
            Services — {String(TIERS.length).padStart(2, "0")}
          </p>

          <ul className="col-span-6 col-start-4 max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-6">
            {TIERS.map((t) => (
              <li key={t.name} className="p-sobe p-fio py-6">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="p-item">{t.name}</span>
                  <span className="p-corpo" style={{ color: "var(--p-quieto)" }}>
                    {preco(t.priceFrom)}
                  </span>
                </div>
                <p className="p-corpo max-w-[54ch] pt-2" style={{ color: "var(--p-quieto)" }}>
                  {t.description}
                </p>
              </li>
            ))}
            <li className="p-fio" />
          </ul>

          <div className="col-span-3 col-start-11 grid gap-8 self-start max-lg:col-span-12 max-lg:col-start-1 max-lg:pt-12">
            <Bloco rotulo="Contact &amp; inquiries" className="p-sobe">
              <ul className="grid gap-[6px]">
                {CONTATO.map((c) => (
                  <li key={c.label} className="p-corpo">
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="p-link"
                      >
                        {c.label === "Email" ? c.valor : c.label}
                      </a>
                    ) : (
                      <span style={{ color: "var(--p-quieto)" }}>{c.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Bloco>
          </div>
        </div>
      </section>
    </Prancha>
  );
}

/**
 * Um capítulo de peça: a arte grande entrando fora de foco, com a ficha ao lado.
 * O lado alterna a cada projeto — não por variedade decorativa, mas porque numa
 * sequência longa o olho aprende a posição e para de olhar; alternar mantém a
 * leitura acordada sem mudar a anatomia.
 */
function CapituloPeca({ w, k }: { w: (typeof WORK)[number]; k: number }) {
  const ref = useRevelar<HTMLElement>();
  const direita = k % 2 === 1;
  return (
    <section ref={ref} className="p-capitulo">
      <div
        className="grid grid-cols-12 items-center"
        style={{ columnGap: "var(--p-gap-x)" }}
      >
        <Link
          to={`/v2/work/${w.slug}`}
          className={`col-span-7 ${direita ? "col-start-6" : "col-start-1"} max-lg:col-span-12 max-lg:col-start-1`}
        >
          <img
            src={w.cover.src}
            srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
            sizes="(max-width: 1024px) 92vw, 56vw"
            alt={w.cover.alt}
            width={w.cover.w}
            height={w.cover.h}
            loading={k > 0 ? "lazy" : undefined}
            decoding="async"
            draggable={false}
            className="p-foca w-full object-cover"
            style={{ aspectRatio: `${w.cover.w} / ${w.cover.h}` }}
          />
        </Link>

        <div
          className={`col-span-4 ${direita ? "col-start-1 row-start-1" : "col-start-9"} max-lg:col-span-12 max-lg:col-start-1 max-lg:row-start-2 max-lg:pt-6`}
        >
          <p className="p-sobe p-marca">{String(k + 1).padStart(2, "0")}</p>
          <p className="p-sobe p-especime pt-2" style={{ ["--n" as string]: w.title.length + 4 }}>
            {w.title}
          </p>
          <p className="p-sobe p-corpo pt-4" style={{ color: "var(--p-quieto)" }}>
            {w.disciplines.join(", ")} — {w.year}
          </p>
          <p className="p-sobe pt-6">
            <Link to={`/v2/work/${w.slug}`} className="p-corpo p-link">
              Open project →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
