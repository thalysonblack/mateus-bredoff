import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { REEL } from "../../content/reel";
import { NomeObra } from "./NomeObra";
import { LEAD } from "../../content/about";
import { SERVICOS } from "../../content/servicos";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { HoverFluido } from "./HoverFluido";
import { useRevelacaoPalavra } from "../sections/framer/useRevelacaoPalavra";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsap";
import "../../styles/uma-indice.css";

/**
 * ONE PAGE — "O ÍNDICE" (10/10, rota /v2/uma-indice).
 *
 * A tipografia é a arquitetura; a imagem só aparece quando pedida. Papel claro,
 * uma grade só (a da casa: rótulo em `--p-grade-col1`, conteúdo no resto).
 *   1 HERO       o nome e, logo abaixo, os projetos como LINHAS — é aqui que se
 *                escolhe o trabalho. No hover, a capa abre numa janela pequena
 *                que segue o cursor. Sem hover (toque), a linha leva a miniatura.
 *   2 SOBRE      a declaração em display; retrato pequeno + corpo.
 *   3 OFÍCIO     as especialidades como índice numerado.
 *   4 SHOWREEL   numa janela da grade, não em tela cheia; clique = com som.
 *   5 PUBLICADO  tabela tipográfica.
 * O contato é o rodapé completo da Prancha ("Let's talk" em display).
 * Recusa: espetáculo de imagem, tela cheia, escuro.
 *
 * O "TCHAN" (10/10, "só faltou o tchan — webgl, gsap, interaction"):
 *   · a janela do hover virou a LENTE WebGL (`HoverFluido`, receita Arco): fica
 *     numa COLUNA fixa entre o nome e a ficha, só o Y segue o cursor (com
 *     atraso) — assim ela nunca cobre o nome que se está lendo. Parada numa
 *     linha, percorre as peças do projeto com o mesmo fluido.
 *   · entrada: o nome sobe letra a letra por máscara; as linhas sobem e o fio
 *     de cada uma DESENHA da esquerda.
 *   · scroll (um gesto por seção, nenhum repetido): a declaração acende palavra
 *     a palavra; o retrato abre por clip; os números do ofício contam; o reel
 *     CRESCE da janela da grade até quase a tela e volta — o único full-bleed.
 *   · Published in: a mesma lente, na coluna do rótulo, mostra o projeto.
 */
const NUM = (i: number) => String(i + 1).padStart(2, "0");
/* o projeto de uma publicação, pelo título (o "®" não entra na comparação) */
const limpa = (t: string) => t.replace("®", "").trim().toLowerCase();
const projetoDe = (nome: string) => WORK.find((w) => limpa(w.title) === limpa(nome)) ?? null;
/**
 * `inicio`: a hero é trocável para experimentar as três famílias da pesquisa (10/10,
 * `~/dev/_inbox/ref-bredoff-hero/`). Sem prop, fica o nome do NomeObra. Com prop, o
 * componente entra NO LUGAR do nome; a linha de ofício e a lista seguem iguais.
 */
export default function UmaIndice({ inicio, semReel }: { inicio?: ReactNode; semReel?: boolean } = {}) {
  useMetaRota();
  const [sob, setSob] = useState<number | null>(null);
  /* a lente é UMA só (um contexto WebGL): serve à lista e às publicações */
  const [pub, setPub] = useState<number | null>(null);
  const [comSom, setComSom] = useState(false);
  const lente = useRef<HTMLDivElement | null>(null);
  const declaracao = useRevelacaoPalavra<HTMLParagraphElement>("rgba(20, 32, 31, 0.16)", "#14201f");
  const publicados = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano);
  const alvo = sob != null ? WORK[sob] : pub != null ? projetoDe(publicados[pub].projeto) : null;

  /* só o Y da lente segue o cursor, com atraso; o X é a coluna (CSS) */
  useEffect(() => {
    const el = lente.current;
    if (!el) return;
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      const h = el.offsetHeight;
      y(Math.min(Math.max(16, e.clientY - h / 2), window.innerHeight - h - 16));
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  /* coreografia: entrada da hero + um gesto de scroll por seção */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    let split: SplitText | null = null;
    let splitObra: SplitText | null = null;
    const ctx = gsap.context(() => {});
    let vivo = true;
    void document.fonts.ready.then(() => {
      if (!vivo) return;
      ctx.add(() => {
        /* ENTRADA — o nome sobe por máscara, letra a letra */
        const temNome = !!document.querySelector("h1.ix-nome");
        split = temNome ? SplitText.create("h1.ix-nome", { type: "lines,chars", mask: "lines" }) : null;
        /* a cópia do NomeObra é dividida IGUAL — senão o espaçamento das letras diverge e o
           trabalho aparece deslocado do nome (só o h1 anima) */
        splitObra = temNome ? SplitText.create(".ix-nome-obra", { type: "lines,chars", mask: "lines" }) : null;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        /* fromTo com o fim EXPLÍCITO: um `from` lê o fim do estado atual, e se a
           entrada roda duas vezes (remontagem) a segunda grava o meio da
           primeira como destino — as linhas ficavam 38px abaixo do fio. */
        if (split) tl.fromTo(split.chars, { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.022 }, 0);
        tl
          .fromTo(".ix-oficio > *", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 0.35)
          .fromTo(".ix-lista > li", { "--fio": 0 }, { "--fio": 1, duration: 1.2, ease: "expo.inOut", stagger: 0.06 }, 0.4)
          .fromTo(".ix-lista .ix-linha > :not(.ix-mini)", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.012, clearProps: "transform" }, 0.55);

        /* SOBRE — o retrato abre de baixo para cima, a foto assenta */
        gsap.fromTo(".ix-retrato", { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: ".ix-retrato", start: "top 92%", end: "top 50%", scrub: 0.6 },
        });
        gsap.fromTo(".ix-retrato img", { scale: 1.18 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: ".ix-retrato", start: "top 92%", end: "bottom 40%", scrub: 0.6 },
        });

        /* OFÍCIO — os fios desenham com o scroll; o número CONTA ao entrar */
        gsap.utils.toArray<HTMLElement>(".ix-servico").forEach((li, i) => {
          gsap.fromTo(li, { "--fio": 0 }, {
            "--fio": 1, ease: "none",
            scrollTrigger: { trigger: li, start: "top 95%", end: "top 70%", scrub: 0.5 },
          });
          const n = li.querySelector<HTMLElement>(".ix-servico-n");
          if (!n) return;
          const c = { v: 0 };
          gsap.to(c, {
            v: i + 1, duration: 0.9, ease: "power2.out",
            onUpdate: () => (n.textContent = NUM(Math.round(c.v) - 1)),
            scrollTrigger: { trigger: li, start: "top 82%", toggleActions: "play none none reverse" },
          });
        });

        /* SHOWREEL — a janela cresce até a tela INTEIRA e volta à grade (desktop) */
        gsap.matchMedia().add("(min-width: 761px)", () => {
          const reel = document.querySelector<HTMLElement>(".ix-reel");
          const vaga = reel?.parentElement; /* a vaga na grade não se transforma: é a medida */
          if (!reel || !vaga) return;
          /* TELA CHEIA de verdade: a caixa estica em x e y separados até a viewport inteira, e o
             vídeo contra-escala para ficar com escala UNIFORME (= cover) — sem distorcer, sem margem */
          const vid = reel.querySelector("video");
          const sx = () => window.innerWidth / vaga.offsetWidth;
          const sy = () => window.innerHeight / vaga.offsetHeight;
          const s = () => Math.max(sx(), sy());
          const desvio = () => {
            const r = vaga.getBoundingClientRect();
            return window.innerWidth / 2 - (r.left + r.width / 2);
          };
          gsap.timeline({
            scrollTrigger: { trigger: vaga, start: "center center", end: "+=160%", pin: ".ix-reel-secao", pinSpacing: true /* pai flex: o padrão viraria false */, scrub: 0.8, invalidateOnRefresh: true },
          })
            .to(reel, { scaleX: sx, scaleY: sy, x: desvio, ease: "power2.inOut", duration: 1 })
            .to(vid, { scaleX: () => s() / sx(), scaleY: () => s() / sy(), ease: "power2.inOut", duration: 1 }, 0)
            .to(".ix-reel-cab", { autoAlpha: 0, duration: 0.4 }, 0)
            .to({}, { duration: 0.7 })
            .to(reel, { scaleX: 1, scaleY: 1, x: 0, ease: "power2.inOut", duration: 1 })
            .to(vid, { scaleX: 1, scaleY: 1, ease: "power2.inOut", duration: 1 }, "<")
            .to(".ix-reel-cab", { autoAlpha: 1, duration: 0.4 }, "<0.6");
        });
      });
    });
    return () => {
      vivo = false;
      ctx.revert();
      split?.revert();
      splitObra?.revert();
    };
  }, []);

  useEffect(() => {
    if (!comSom) return;
    const fecha = (e: KeyboardEvent) => e.key === "Escape" && setComSom(false);
    window.addEventListener("keydown", fecha);
    return () => window.removeEventListener("keydown", fecha);
  }, [comSom]);

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects" rodape="completo">
      {/* ─ 1 · HERO: o nome e o índice do trabalho ─────────────────────────── */}
      <section className="ix-hero">
        {inicio ?? <NomeObra texto="Mateus Bredoff" entrada={1.35} />}
        <div className="ix-grade ix-oficio">
          <p className="p-rotulo">Selected work — {String(WORK.length).padStart(2, "0")}</p>
          <p className="p-corpo">Brand designer &amp; art director. Based in Brazil, working worldwide.</p>
        </div>

        <ol className={`ix-lista${sob != null ? " ix-lista--sob" : ""}`} onPointerLeave={() => setSob(null)}>
          {WORK.map((w, i) => (
            <li key={w.slug} className={sob === i ? "is-sob" : undefined}>
              <Link to={`/work/${w.slug}`} className="ix-linha" onPointerEnter={() => setSob(i)} onFocus={() => setSob(i)} onBlur={() => setSob(null)}>
                <span className="p-marca ix-n">
                  <span>{NUM(i)}</span>
                  <span aria-hidden="true">→ View</span>
                </span>
                <span className="ix-titulo">{w.title.replace("®", "").trim()}</span>
                <span className="p-marca ix-disc">{w.disciplines.slice(0, 2).join(" · ")}</span>
                <span className="p-marca ix-ano">{w.year}</span>
                <img className="ix-mini" src={w.cover.src} alt="" loading="lazy" decoding="async" draggable={false} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* a LENTE: WebGL numa coluna fixa; só o Y acompanha o cursor */}
      <div ref={lente} className={`ix-lente${pub != null ? " ix-lente--pub" : ""}${alvo ? " is-on" : ""}`} aria-hidden="true">
        <HoverFluido sob={alvo} modo="cartaz" receita={4} />
      </div>

      {/* ─ 2 · SOBRE ───────────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">About</p>
        <div>
          <p ref={declaracao} className="ix-declaracao">{LEAD[0]}</p>
          <div className="ix-sobre-par">
            <figure className="ix-retrato">
              <img src={retrato} alt="Mateus Bredoff" loading="lazy" decoding="async" draggable={false} />
            </figure>
            <p className="p-corpo ix-corpo">{LEAD[1]}</p>
          </div>
        </div>
      </section>

      {/* ─ 3 · OFÍCIO ──────────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">What I do</p>
        <ol className="ix-tabela">
          {SERVICOS.map((sv, i) => (
            <li key={sv.nome} className="ix-servico">
              <span className="ix-servico-n">{NUM(i)}</span>
              <span className="ix-servico-nome">{sv.nome}</span>
              <span className="p-corpo ix-servico-entrega">{sv.entrega}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─ 4 · SHOWREEL ────────────────────────────────────────────────────── */}
      {REEL.video && !semReel ? (
        <section className="ix-secao ix-grade ix-reel-secao">
          <div className="ix-reel-cab">
            <p className="p-rotulo">Showreel — {REEL.ano}</p>
            <button type="button" className="p-corpo p-link" onClick={() => setComSom(true)}>
              Play with sound
            </button>
          </div>
          <div className="ix-reel-vaga">
          <button type="button" className="ix-reel" onClick={() => setComSom(true)} aria-label="Play showreel with sound">
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
          </div>
        </section>
      ) : null}

      {/* ─ 5 · PUBLICADO ───────────────────────────────────────────────────── */}
      <section className="ix-secao ix-grade">
        <p className="p-rotulo">Published in</p>
        <ol className={`ix-tabela ix-pubs${pub != null ? " ix-pubs--sob" : ""}`} onPointerLeave={() => setPub(null)}>
          {publicados.map((r, i) => {
            const miolo = (
              <>
                <span className="p-marca ix-n">{NUM(i)}</span>
                {r.logo ? (
                  <span className="ix-veiculo">
                    <span
                      role="img"
                      aria-label={r.veiculo}
                      className={`ix-logo${r.logo.alturaPx ? " ix-logo--alto" : ""}`}
                      style={{ "--logo": `url("${r.logo.src}")`, aspectRatio: `${r.logo.w} / ${r.logo.h}` } as CSSProperties}
                    />
                  </span>
                ) : (
                  <span className="ix-veiculo ix-veiculo--abz">{r.veiculo}</span>
                )}
                <span className="p-corpo ix-pub-proj">{r.projeto.replace("®", "").trim()}{r.selo === "behance-gr" && <span className="ix-selo ix-selo--gr" title="Featured in Behance’s Graphic Design gallery" aria-label="Featured in Behance’s Graphic Design gallery">Gr</span>}</span>
                <span className="p-marca ix-ano">{r.ano}</span>
              </>
            );
            return (
              <li key={`${r.veiculo}-${r.projeto}`} className={pub === i ? "is-sob" : undefined} onPointerEnter={() => setPub(i)}>
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="ix-pub">
                    {miolo}
                  </a>
                ) : (
                  <span className="ix-pub">{miolo}</span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {comSom && REEL.video ? (
        <div className="p-player" onClick={() => setComSom(false)} role="presentation">
          <video src={REEL.video} autoPlay controls playsInline className="p-player-video" />
        </div>
      ) : null}
    </Prancha>
  );
}
