import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { LEAD, NUMEROS, PROCESSO, FERRAMENTAS } from "../../content/about";
import { MODALIDADES, SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * ABOUT — PROPOSTA E: "A FICHA".
 *
 * Do Savee dele (18/08): o card `LDN-19 / CNS-19-CL / NYC-19-AW`, em que a
 * página inteira é uma pilha de linhas de dado que ABREM. E o único save do
 * board `bredoff` — um layout escuro de colunas e traços, sem nenhuma imagem
 * grande. Ele salvou isso; é a leitura dele do que é sofisticado.
 *
 * A aposta é o oposto da D: aqui não existe hero nenhum. A about é um
 * INSTRUMENTO — cada assunto é uma linha fechada, com o dado à direita, e quem
 * quer saber abre. Quem só quer o preço lê a coluna da direita e vai embora.
 *
 * ⚠ `<details>/<summary>` nativo, não acordeão de biblioteca: o navegador já
 * faz o estado, o teclado e o Ctrl+F que abre a linha certa. O que o CSS
 * acrescenta é só a coreografia.
 */
export default function AboutE() {
  useMetaRota("/about");
  const publicados = RECONHECIMENTO.filter((r) => r.href).length;

  return (
    <Prancha n="03" nome="About" superficie="papel" status="Available for projects" rodape="completo">
      <div className="ab-e">
        <header className="ab-e-cabeca">
          <h1 className="ab-e-titulo">
            Mateus Bredoff — brand designer, Brazil. Nine records below.
          </h1>
          <p className="p-marca">Open a line to read it</p>
        </header>

        <div className="ab-e-lista">
          <Linha n="01" nome="Profile" dado="Multidisciplinary designer">
            <div className="ab-e-perfil">
              <img src={retrato} alt="Mateus Bredoff" />
              <div>
                {LEAD.map((p, i) => (
                  <p key={i} className={i === 0 ? "p-manifesto" : "p-corpo"}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Linha>

          <Linha n="02" nome="Track record" dado={`${NUMEROS[0].valor} clients`}>
            <div className="ab-e-numeros">
              {NUMEROS.map((x) => (
                <div key={x.rotulo}>
                  <p className="p-numero-big">{x.valor}</p>
                  <p className="p-rotulo">{x.rotulo}</p>
                </div>
              ))}
            </div>
          </Linha>

          <Linha n="03" nome="Disciplines" dado={`${SERVICOS.length} practices`}>
            <ul className="ab-e-disc">
              {SERVICOS.map((s) => (
                <li key={s.nome}>
                  <h3 className="p-item">{s.nome}</h3>
                  <p className="p-corpo">{s.entrega}</p>
                </li>
              ))}
            </ul>
          </Linha>

          {MODALIDADES.map((m, i) => (
            <Linha
              key={m.nome}
              n={String(4 + i).padStart(2, "0")}
              nome={m.nome}
              dado={m.precoDe ? `from $${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "On request"}
            >
              <div className="ab-e-pacote">
                <p className="p-manifesto">{m.para}</p>
                <ul className="p-corpo">
                  {m.inclui.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="p-marca">Lead time — {m.prazo}</p>
              </div>
            </Linha>
          ))}

          <Linha n="07" nome="Method" dado={`${PROCESSO.length} stages`}>
            <ol className="ab-e-metodo">
              {PROCESSO.map((e, i) => (
                <li key={e.titulo}>
                  <span className="p-numero">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="p-item">{e.titulo}</h3>
                  <p className="p-corpo">{e.corpo}</p>
                </li>
              ))}
            </ol>
          </Linha>

          <Linha n="08" nome="Published in" dado={`${publicados} outlets`}>
            <ul className="ab-e-press">
              {RECONHECIMENTO.map((r) => (
                <li key={r.titulo}>
                  {r.href ? (
                    <a className="p-corpo p-link" href={r.href} target="_blank" rel="noopener noreferrer">
                      {r.veiculo} — {r.titulo}
                    </a>
                  ) : (
                    <span className="p-corpo">
                      {r.veiculo} — {r.titulo}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Linha>

          <Linha n="09" nome="Toolkit" dado={`${FERRAMENTAS.length} tools`}>
            <p className="p-corpo ab-e-tools">{FERRAMENTAS.join(" · ")}</p>
          </Linha>
        </div>
      </div>
    </Prancha>
  );
}

function Linha({
  n,
  nome,
  dado,
  children,
}: {
  n: string;
  nome: string;
  dado: string;
  children: React.ReactNode;
}) {
  return (
    <details className="ab-e-linha">
      <summary>
        <span className="p-marca ab-e-n">{n}</span>
        <span className="p-item ab-e-nome">{nome}</span>
        <span className="p-corpo ab-e-dado">{dado}</span>
        <span className="ab-e-sinal" aria-hidden="true" />
      </summary>
      <div className="ab-e-corpo">{children}</div>
    </details>
  );
}
