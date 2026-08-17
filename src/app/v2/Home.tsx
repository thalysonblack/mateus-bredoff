import { Link } from "react-router";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { TIERS } from "../sections/Pricing";
import { CONTATO } from "../v3-system";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";

/**
 * FOLHA 01 — INDEX.
 *
 * ⚠ TERCEIRA versão desta página, e as duas correções que a formaram estão aqui
 * porque é nelas que a direção mora:
 *
 *   1. **"era pra ser uma home mais elaborada"** — a primeira era uma tela de
 *      fichas, porque eu tinha minerado o `/about` da referência e construído a
 *      HOME com ele. Anatomia certa da página errada.
 *   2. **"vc ta copiando, nao, apenas conceito"** — a segunda trouxe a régua de
 *      artboard, um cubo 3D de miniaturas girando e a sigla sangrando pela
 *      base. Elaborada, e copiada: aquilo é a assinatura do corentin.
 *
 * O partido próprio é a FOLHA DE ESPÉCIMES. Ele desenha marcas, e as capas do
 * acervo são, na maioria, wordmark e lettering — ginga, BUREAU, FORTIS, ALEX
 * ARCHER. Então o índice não é grade de cards com o nome em 12px embaixo: é uma
 * folha de espécimes, onde **o nome vem no corpo em que uma marca merece ser
 * vista**, a ficha técnica fica miúda ao lado, e a arte entra quando o cursor
 * pousa na linha.
 *
 * O que veio das referências é só o princípio: densidade pequena no texto de
 * leitura, muito vazio, uma ideia gráfica por página, e o trabalho como objeto
 * em vez de grade. Nenhum objeto emprestado compete com o trabalho do dono do
 * site — e é por isso que a peça central aqui é a marca dele, não um sólido.
 */

const MANIFESTO =
  "Brand designer and art director working with companies that want a clear, relevant and memorable presence. Every identity starts from strategy and lands as a visual system built to last.";

export default function HomeV2() {
  useMetaRota();
  const preco = (n: number | null) =>
    n === null ? "On request" : `from US$ ${n.toLocaleString("en-US")}`;
  const recentes = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 3);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      {/* ─ abertura: corpo de leitura, sem manchete ────────────────────── */}
      <section className="grid grid-cols-12 gap-x-6 pt-14 max-md:pt-8">
        <p className="p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">{MANIFESTO}</p>
        <p className="p-marca col-span-2 col-start-11 text-right max-lg:hidden">
          {String(WORK.length).padStart(2, "0")} works · 2026
        </p>
      </section>

      {/* ─ a folha de espécimes ────────────────────────────────────────── */}
      <section className="pt-20 max-md:pt-12" data-atenua>
        <p className="p-rotulo pb-4">Selected work</p>

        <ul>
          {WORK.map((w, i) => (
            <li
              key={w.slug}
              className="p-especime-linha"
              /* o corpo sai do COMPRIMENTO do nome: a palavra preenche a
                 medida, como numa folha de espécime de fundição */
              style={{ ["--n" as string]: w.title.length }}
            >
              <Link
                data-alvo
                to={`/v2/work/${w.slug}`}
                className="grid grid-cols-12 items-center gap-x-6 py-5 max-md:py-4"
              >
                <span className="p-marca col-span-1 self-start pt-3 max-md:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* o nome É a peça: escala de espécime, não rótulo de card */}
                <span className="p-especime col-span-6 max-md:col-span-10">{w.title}</span>

                {/* a arte só quando o cursor pousa — a folha revela o espécime.
                    Altura fixa e largura automática: as capas têm proporções
                    diferentes, e alinhar pela ALTURA é o que faz nove marcas
                    lerem como uma coluna. */}
                <span className="p-especime-arte col-span-2 flex justify-end max-md:hidden">
                  <img
                    src={w.cover.src}
                    srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                    sizes="220px"
                    alt=""
                    width={w.cover.w}
                    height={w.cover.h}
                    loading={i > 2 ? "lazy" : undefined}
                    decoding="async"
                    draggable={false}
                    className="h-[104px] w-auto object-cover"
                  />
                </span>

                <span className="p-marca col-span-3 self-start pt-3 text-right max-md:col-span-12 max-md:pt-2 max-md:text-left">
                  {w.disciplines.join(", ")}
                  <span className="block pt-1" style={{ opacity: 0.7 }}>
                    {w.year}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li className="p-fio" />
        </ul>
      </section>

      {/* ─ as fichas ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-12 gap-x-6 gap-y-12 pt-28 max-md:pt-16">
        <Bloco
          rotulo={`Recognition — ${String(RECONHECIMENTO.length).padStart(2, "0")}`}
          className="col-span-4 max-lg:col-span-12"
        >
          <ul className="grid gap-[6px]">
            {recentes.map((r) => (
              <li
                key={`${r.veiculo}-${r.projeto}`}
                className="p-corpo grid grid-cols-[1fr_auto] items-baseline gap-3"
              >
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                    {r.veiculo} <span style={{ color: "var(--p-quieto)" }}>— {r.projeto}</span>
                  </a>
                ) : (
                  <span>
                    {r.veiculo} <span style={{ color: "var(--p-quieto)" }}>— {r.projeto}</span>
                  </span>
                )}
                <span style={{ color: "var(--p-quieto)" }}>{r.ano}</span>
              </li>
            ))}
          </ul>
        </Bloco>

        <Bloco
          rotulo={`Services — ${String(TIERS.length).padStart(2, "0")}`}
          className="col-span-4 max-lg:col-span-12"
        >
          <ul className="grid gap-[6px]">
            {TIERS.map((t) => (
              <li key={t.name} className="p-corpo grid grid-cols-[1fr_auto] items-baseline gap-3">
                <span>{t.name}</span>
                <span style={{ color: "var(--p-quieto)" }}>{preco(t.priceFrom)}</span>
              </li>
            ))}
          </ul>
        </Bloco>

        <Bloco rotulo="Contact &amp; inquiries" className="col-span-3 max-lg:col-span-12">
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
                  /* sem destino no material do cliente → texto, não link que
                     mente (a régua vale em toda direção deste site) */
                  <span style={{ color: "var(--p-quieto)" }}>{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Bloco>
      </section>
    </Prancha>
  );
}
