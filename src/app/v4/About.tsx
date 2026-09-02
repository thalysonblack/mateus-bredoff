import { Quadro } from "./sistema";
import { LEAD, PROCESSO, PROCESSO_MANCHETE, FERRAMENTAS } from "../../content/about";
import { MODALIDADES } from "../../content/servicos";
import { useMetaRota } from "../../hooks/useMetaRota";

/**
 * V4 — A ABOUT.
 *
 * Uma coluna de leitura de 13px correndo à esquerda, o resto vazio: é a
 * densidade que a direção pede. O texto é o do /about publicado dele, sem uma
 * palavra inventada — as cinco etapas do processo são as dele, na ordem dele.
 *
 * ⚠ Só o Full Brand Identity tem preço; os outros dois seguem "On request",
 * porque é o que ele publica. Preço que o cliente não divulgou não se estima.
 */
export default function AboutV4() {
  useMetaRota();
  return (
    <Quadro>
      <header style={{ padding: "clamp(120px,14vw,200px) var(--q-m) clamp(56px,7vw,96px)" }}>
        <h1 className="q-display-md" style={{ maxWidth: "22ch" }}>
          {LEAD[0].split(".")[0]}.
        </h1>
      </header>

      <section className="q-bloco" style={{ paddingTop: 0 }}>
        <p className="q-corpo" style={{ maxWidth: "62ch", color: "var(--q-quieto)" }}>
          {LEAD[1]}
        </p>
        <p className="q-meta" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
          {FERRAMENTAS.join("  ·  ")}
        </p>
      </section>

      <section className="q-bloco" aria-labelledby="v4-proc" style={{ paddingTop: 0 }}>
        <h2 id="v4-proc" className="q-display-md" style={{ maxWidth: "26ch", paddingBottom: "clamp(48px,6vw,88px)" }}>
          {PROCESSO_MANCHETE}
        </h2>
        {PROCESSO.map((p, i) => (
          <div className="q-servico" key={p.titulo}>
            <span className="q-meta">{String(i + 1).padStart(2, "0")}</span>
            <span className="q-servico-nome">{p.titulo}</span>
            <span className="q-corpo" style={{ color: "var(--q-quieto)" }}>
              {p.corpo}
            </span>
          </div>
        ))}
      </section>

      <section className="q-bloco" aria-labelledby="v4-mod" style={{ paddingTop: 0 }}>
        <h2 id="v4-mod" className="q-corpo" style={{ color: "var(--q-quieto)", paddingBottom: "clamp(24px,3vw,40px)" }}>
          Ways to work together
        </h2>
        {MODALIDADES.map((m) => (
          <div className="q-servico" key={m.nome}>
            {/* ⚠ só o valor que ELE publica sai como valor. Número que eu propus
                e ele ainda não confirmou (`aConfirmar`) mostra "On request" — na
                página do cliente, preço estimado vira preço combinado. */}
            <span className="q-meta">
              {m.precoDe && !m.aConfirmar
                ? `From US$ ${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}`
                : "On request"}
            </span>
            <span className="q-servico-nome">{m.nome}</span>
            <span className="q-corpo" style={{ color: "var(--q-quieto)" }}>
              {m.para}
            </span>
          </div>
        ))}
      </section>
    </Quadro>
  );
}
