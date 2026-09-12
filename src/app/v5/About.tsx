import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../../styles/v5.css";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { LEAD, PROCESSO, PROCESSO_MANCHETE } from "../../content/about";
import { MODALIDADES } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";

const EMAIL = "hello@mateusbredoff.com";

/**
 * V5 — A ABOUT: "A SESSÃO".
 *
 * "a about eu preciso de uma versão mais criativa" → "awwwards". O dicionário
 * da casa traduz: TROCAR O REGISTRO — palco escuro, trabalho em full-bleed, um
 * motor de assinatura, coreografia. Nove abouts vieram antes e nenhuma esteve
 * nesse registro: todas nasceram em papel, com a tipografia como arquitetura e
 * o texto explicativo como protagonista. Esta recusa exatamente isso.
 *
 * A postura: a about não é um documento sobre ele — é uma SESSÃO, seis cenas
 * num palco, cada uma contando um capítulo com o material DELE:
 *
 *   1  o retrato em full-bleed e o nome em escala extrema ATRAVESSANDO a foto
 *      (a régua do uau: a palavra invadindo a imagem, sem caixa, sem cortina)
 *   2  o credo, uma frase só, sobre campo CHAPADO na cor de um projeto dele
 *   3  o método coreografado: o quadro fica preso, o numeral gigante troca de
 *      01 a 05 e, por trás, a PEÇA muda a cada etapa — as dez peças do Alex
 *      Archer, o único case com material. O método mostrado no trabalho, não
 *      descrito em 13px: "o craft é o material, não o gesto"
 *   4  a prova: os veículos em corpo de cartaz sobre as capas passando
 *   5  as três modalidades, em linha de recibo sobre a tinta
 *   6  o fecho
 *
 * ⚠ Sem `pin`: cada cena presa é `position: sticky` com gatilhos por baixo —
 * a página segue livre. Mesma mecânica do palco da home.
 */
export default function AboutV5() {
  useMetaRota();

  /* o case com material para ilustrar as cinco etapas: o único com peças
     escritas e dez artes. Se um dia outro case tiver mais, a escolha é por
     quantidade de peças, não por nome */
  const caseMetodo = [...WORK].sort((a, b) => b.images.length - a.images.length)[0];
  const pecas = [caseMetodo.cover, ...caseMetodo.images];
  const corMetodo = CORES[caseMetodo.slug]?.tinta;

  /* qual etapa está em cena: o gatilho que cruza o meio da tela manda */
  const [etapa, setEtapa] = useState(0);
  const gatilhos = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const i = gatilhos.current.indexOf(e.target as HTMLDivElement);
            if (i >= 0) setEtapa(i);
          }
        }),
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    gatilhos.current.forEach((g) => g && obs.observe(g));
    return () => obs.disconnect();
  }, []);

  /* o campo chapado do credo: a cor do projeto mais recente, em valor de
     superfície (o `papel` de cores.ts é o tom escurecido para texto; como
     fundo ele carrega bem o creme) */
  const corCredo = CORES[WORK[0].slug]?.papel ?? "#14201f";
  const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];
  const publicados = WORK.filter((w) => RECONHECIMENTO.some((r) => r.projeto.toLowerCase().startsWith(w.title.toLowerCase().replace(" ®", ""))));

  return (
    <div className="p5">
      <nav className="p5-nav p5-nav-solida">
        <Link to="/v5" className="p5-marca">
          Mateus Bredoff
        </Link>
        <Link to="/v5#palco">Work</Link>
        <Link to="/v5/about" aria-current="page">
          About
        </Link>
        <a className="p5-nav-fim" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </nav>

      {/* ── 1. o retrato, e o nome atravessando ─────────────────────────── */}
      <header className="p5-sessao-abre">
        <img
          className="p5-sessao-retrato"
          src={retrato}
          srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
          sizes="100vw"
          alt="Mateus Bredoff"
          fetchpriority="high"
          decoding="async"
          draggable={false}
        />
        {/* ⚠ o nome fica ENTRE duas camadas do retrato: a foto por baixo, e a
            mesma foto por cima recortada em máscara pela metade inferior, para
            o rosto passar NA FRENTE das letras. É o que separa "texto sobre
            foto" de "a pessoa na frente da palavra" — FOGO, VSZN. Sem a segunda
            camada é layout; com ela é material. */}
        <h1 className="p5-sessao-nome" aria-label="Mateus Bredoff">
          <span>Mateus</span>
          <span>Bredoff</span>
        </h1>
        <img
          className="p5-sessao-retrato p5-sessao-retrato-frente"
          src={retrato}
          srcSet={`${retrato} 1600w, ${retrato2x} 3200w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
        />
        <p className="p5-meta p5-sessao-abre-pe">
          <span className="p5-meta-vivo">Brand designer &amp; art director</span>
          <span>Brazil — working globally</span>
        </p>
      </header>

      {/* ── 2. o credo, sobre campo chapado ─────────────────────────────── */}
      <section className="p5-credo" style={{ background: corCredo }}>
        <p className="p5-credo-frase">{LEAD[0].split(". ")[0]}.</p>
        <p className="p5-meta p5-credo-pe">{LEAD[0].split(". ").slice(1).join(". ")}</p>
      </section>

      {/* ── 3. o método, coreografado sobre as peças ────────────────────── */}
      <section className="p5-metodo" aria-label="Method">
        <div className="p5-metodo-quadro">
          {pecas.map((im, i) => (
            <div className={i === etapa ? "p5-cena p5-cena-viva" : "p5-cena"} key={i}>
              <img
                src={im.src}
                srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
                sizes="100vw"
                alt={i === 0 ? im.alt : ""}
                aria-hidden={i === 0 ? undefined : true}
                loading={i === 0 ? undefined : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
          <p className="p5-meta p5-conta">
            {String(etapa + 1).padStart(2, "0")} / {String(PROCESSO.length).padStart(2, "0")}
          </p>
          <div className="p5-metodo-texto">
            <p className="p5-metodo-num" style={{ color: corMetodo }} aria-hidden="true">
              {String(etapa + 1).padStart(2, "0")}
            </p>
            <div>
              <h2 className="p5-metodo-titulo">{PROCESSO[etapa].titulo}</h2>
              <p className="p5-metodo-corpo">{PROCESSO[etapa].corpo}</p>
            </div>
          </div>
          <p className="p5-meta p5-metodo-rodape">
            <span className="p5-meta-vivo">Method</span>
            <span>shown on {caseMetodo.title}</span>
          </p>
        </div>
        {PROCESSO.map((e, i) => (
          <div
            key={e.titulo}
            className="p5-passo"
            ref={(el) => {
              gatilhos.current[i] = el;
            }}
            aria-hidden="true"
          />
        ))}
      </section>

      {/* ── 4. a prova ──────────────────────────────────────────────────── */}
      <section className="p5-prova" aria-labelledby="p5-prova-t">
        <div className="p5-prova-capas" aria-hidden="true">
          {(publicados.length ? publicados : WORK.slice(0, 4)).map((w) => (
            <img key={w.slug} src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
          ))}
        </div>
        <div className="p5-prova-texto">
          <p className="p5-meta">Published in</p>
          <h2 id="p5-prova-t" className="p5-prova-nomes">
            {veiculos.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </h2>
          <ul className="p5-prova-lista">
            {RECONHECIMENTO.map((r, i) => (
              <li key={i} className="p5-linha p5-prova-linha">
                <span className="p5-meta">{r.ano}</span>
                <span className="p5-linha-nome">{r.projeto}</span>
                <span className="p5-linha-corpo">
                  {r.veiculo} — {r.titulo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. as modalidades ───────────────────────────────────────────── */}
      <section className="p5-bloco" aria-labelledby="p5-mod">
        <h2 id="p5-mod" className="p5-manchete" style={{ paddingBottom: "clamp(44px,6vw,88px)" }}>
          Three ways to work together.
        </h2>
        {MODALIDADES.map((m, k) => (
          <div className="p5-linha" key={m.nome}>
            <span className="p5-meta">{String(k + 1).padStart(2, "0")}</span>
            <span className="p5-linha-nome">{m.nome}</span>
            <span className="p5-linha-corpo">
              {m.para}
              <span className="p5-meta" style={{ display: "block", paddingTop: 10 }}>
                {m.inclui.join(" · ")} · {m.prazo} ·{" "}
                {m.precoDe && !m.aConfirmar
                  ? `from US$ ${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}`
                  : "on request"}
              </span>
            </span>
          </div>
        ))}
      </section>

      {/* ── 6. o fecho ──────────────────────────────────────────────────── */}
      <footer className="p5-fecho">
        <p className="p5-convite">Got a brand worth building?</p>
        <p>
          <a href={`mailto:${EMAIL}`} className="p5-manchete">
            {EMAIL}
          </a>
        </p>
        <div className="p5-fecho-regua p5-meta">
          <span>Mateus Bredoff — Brand designer &amp; art director</span>
          <span>Available for projects</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
