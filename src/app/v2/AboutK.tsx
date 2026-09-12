import { Link } from "react-router";
import "../../styles/v5.css";
import { useMetaRota } from "../../hooks/useMetaRota";
import { useHora } from "./sistema";
import { CONTATO } from "../v3-system";
import { LEAD, PROCESSO, FERRAMENTAS } from "../../content/about";
import { MODALIDADES } from "../../content/servicos";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";

/**
 * ABOUT K — "A FICHA".
 *
 * Postura: UMA peça dele em tela cheia — uma só, parada — e a about inteira
 * como HUD em mono de 11px nas quatro bordas, como a ficha de uma câmera
 * gravada sobre a imagem. Bio, método, modalidades, publicado, contato, hora
 * local. Tudo cabe numa tela. Nada em corpo grande. Nada rola.
 *
 * DNA (conceito, não assinatura): Omosa — foto de campanha com HUD em mono nas
 * quatro bordas; Baytaş — currículo como sumário em mono minúsculo. Colisão
 * medida: nada de cavalos, nada de manchete no pé (Omosa); o HUD é o princípio,
 * a composição é daqui.
 *
 * O que RECUSA: tipografia grande de qualquer tipo, scroll, sequência, "contar
 * história". É o teste Gio Pandone — quanto dá pra tirar — aplicado à about:
 * a peça dele diz tudo; o resto é rótulo.
 *
 * ⚠ A peça é a MAIS RECENTE do acervo, e não troca: a Sessão trocava a cada
 * 4,2s e o HUD virava ruído sobre imagem em movimento. Ficha se lê sobre
 * quadro parado.
 */
export default function AboutK() {
  useMetaRota();
  const hora = useHora();
  const peca = WORK[0];
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

  return (
    <div className="p5 p-ficha">
      <img
        className="p-ficha-peca"
        src={peca.cover.src}
        srcSet={peca.cover.src2x ? `${peca.cover.src} 1400w, ${peca.cover.src2x} 2200w` : undefined}
        sizes="100vw"
        alt={peca.cover.alt}
        fetchpriority="high"
        decoding="async"
        draggable={false}
      />

      {/* canto superior esquerdo: quem */}
      <div className="p-ficha-hud p-ficha-se">
        <p className="p5-meta p5-meta-vivo">Mateus Bredoff</p>
        <p className="p5-meta">Brand designer &amp; art director</p>
        <p className="p5-meta">Brazil — working globally</p>
      </div>

      {/* canto superior direito: quando, onde, nav */}
      <div className="p-ficha-hud p-ficha-sd">
        <p className="p5-meta p5-meta-vivo">{hora} BRT</p>
        <p className="p5-meta">Available for projects</p>
        <p className="p5-meta" style={{ paddingTop: 10 }}>
          <Link to="/" className="p5-meta-vivo">
            Index
          </Link>{" "}
          · <Link to="/work">Work</Link> · <Link to="/lab">Lab</Link>
        </p>
      </div>

      {/* borda esquerda, meio: o método */}
      <div className="p-ficha-hud p-ficha-me">
        <p className="p5-meta p5-meta-vivo">Method</p>
        {PROCESSO.map((e, i) => (
          <p className="p5-meta" key={e.titulo}>
            <span className="p5-meta-vivo">{String(i + 1).padStart(2, "0")}</span> {e.titulo}
          </p>
        ))}
      </div>

      {/* borda direita, meio: as modalidades */}
      <div className="p-ficha-hud p-ficha-md">
        <p className="p5-meta p5-meta-vivo">Ways to work</p>
        {MODALIDADES.map((m) => (
          <p className="p5-meta" key={m.nome}>
            {m.nome}{" "}
            <span className="p5-meta-vivo">
              {m.precoDe && !m.aConfirmar ? `US$ ${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "on request"}
            </span>
          </p>
        ))}
      </div>

      {/* canto inferior esquerdo: a bio inteira, em 11px — é a única vez em
          dez abouts que ela cabe num canto sem parecer rodapé, porque aqui TUDO
          é canto */}
      <div className="p-ficha-hud p-ficha-ie">
        <p className="p5-meta p5-meta-vivo">About</p>
        <p className="p5-meta p-ficha-bio">{LEAD[0]}</p>
        <p className="p5-meta" style={{ paddingTop: 10 }}>
          {FERRAMENTAS.join(" · ")}
        </p>
      </div>

      {/* canto inferior direito: a prova e o contato */}
      <div className="p-ficha-hud p-ficha-id">
        <p className="p5-meta p5-meta-vivo">Published in</p>
        <p className="p5-meta">{veiculos.join(" · ")}</p>
        <p className="p5-meta" style={{ paddingTop: 10 }}>
          {CONTATO.map((c, i) => (
            <span key={c.label}>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="p5-meta-vivo">
                  {c.label}
                </a>
              ) : (
                c.label
              )}
              {i < CONTATO.length - 1 && " · "}
            </span>
          ))}
        </p>
      </div>

      {/* a legenda da peça, na base, centrada — a única coisa que fala da imagem */}
      <p className="p5-meta p-ficha-legenda">
        <span className="p5-meta-vivo">{peca.title}</span> · {peca.disciplines.join(", ")} · {peca.year}
      </p>
    </div>
  );
}
