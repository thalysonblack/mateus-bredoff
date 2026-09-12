import { useEffect, useRef, useState } from "react";
import retrato from "../../assets/optimized/hero-portrait-1600.webp";
import retrato2x from "../../assets/optimized/hero-portrait-3200.webp";
import { gsap } from "../../lib/gsap";
import { criarVisorFluido, type VisorFluido } from "../../lib/visorFluido";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";
import { CONTATO } from "../v3-system";
import { LEAD, PROCESSO } from "../../content/about";
import { MODALIDADES } from "../../content/servicos";
import { WORK } from "../../content/work";
import { CORES } from "../../content/cores";
import { RECONHECIMENTO } from "../../content/reconhecimento";

/**
 * ABOUT L — "O VISOR".
 *
 * "não gostei" nas três posturas, e a resposta desenhada foi MOVIMENTO COMO
 * PROTAGONISTA. As treze abouts anteriores tinham uma coisa em comum que
 * nenhuma postura resolvia: uma imagem PARADA, ou texto parado. O princípio que
 * ele aprovou na home (a Trama, 17/08) era o oposto — "a matéria do estúdio
 * processada em tempo real; nenhuma das referências exibe uma imagem parada na
 * primeira tela".
 *
 * Então a about herda o motor da home: o visor fluido no modo ARCO (o que ele
 * escolheu entre quatro receitas), só que em TELA CHEIA. Na home ele é um
 * quadro pequeno que segue o cursor; aqui é a página inteira. Um gesto em duas
 * escalas lê como sistema — dois gestos competindo leem como portfólio
 * ([[craft-motion-herda-o-vocabulario-do-sistema]]). Nada de motor novo.
 *
 * A matéria que o shader processa é a dele, capítulo a capítulo: o retrato →
 * as cinco etapas do método sobre cinco peças do Alex Archer → a prova → as
 * modalidades → o contato. O scroll do wheel troca o capítulo, e cada troca é
 * a frente de onda em arco com o fio de 1px na cor do que ENTRA — o mesmo
 * vocabulário da home, no mesmo token (`--p-acento`), lido do DOM.
 *
 * O texto vive em mono nas bordas, como a ficha (K): o centro é do movimento.
 *
 * ⚠ Disciplina herdada do HomeD, letra por letra, porque cada linha custou um
 * salto visível: `garantir` separado de `iniciar`; geração para descartar
 * carregamentos fora de ordem; matar o tween e `resolver` ANTES de instalar a
 * lâmina nova; 0,92s power3.inOut (1,05s power2 lia mole); um relógio só — o
 * `passo(dt)` vive no ticker do GSAP.
 */

type Cena = { rotulo: string; cap: string; txt: string; src: string; cor?: string };

const aa = WORK.find((w) => w.slug === "alex-archer");
const pecasMetodo = aa ? aa.images.slice(0, PROCESSO.length) : [];
const capa = (slug: string) => WORK.find((w) => w.slug === slug)?.cover;
const veiculos = [...new Set(RECONHECIMENTO.map((r) => r.veiculo))];

const CENAS: Cena[] = [
  {
    rotulo: "About",
    cap: LEAD[0].split(". ")[0] + ".",
    txt: LEAD[0].split(". ").slice(1).join(". "),
    src: retrato2x || retrato,
  },
  ...PROCESSO.map((e, i) => ({
    rotulo: `Method ${String(i + 1).padStart(2, "0")} / ${String(PROCESSO.length).padStart(2, "0")}`,
    cap: e.titulo,
    txt: e.corpo,
    src: (pecasMetodo[i] ?? aa?.cover)?.src2x ?? (pecasMetodo[i] ?? aa?.cover)?.src ?? retrato,
    cor: CORES["alex-archer"]?.tinta,
  })),
  {
    rotulo: "Published in",
    cap: veiculos.join(" · "),
    txt: RECONHECIMENTO.map((r) => `${r.ano}  ${r.projeto} — ${r.veiculo}`).join("\n"),
    src: capa("trivo")?.src2x ?? capa("trivo")?.src ?? retrato,
    cor: CORES.trivo?.tinta,
  },
  {
    rotulo: "Ways to work",
    cap: "Three ways to work together.",
    txt: MODALIDADES.map(
      (m) =>
        `${m.nome} — ${m.precoDe && !m.aConfirmar ? `from US$ ${m.precoDe.toLocaleString("en-US")}${m.unidade ?? ""}` : "on request"}`,
    ).join("\n"),
    src: capa("ginga")?.src2x ?? capa("ginga")?.src ?? retrato,
    cor: CORES.ginga?.tinta,
  },
  {
    rotulo: "Contact",
    cap: "hello@mateusbredoff.com",
    txt: CONTATO.filter((c) => c.label !== "Email")
      .map((c) => c.valor)
      .join("\n"),
    src: capa("votare")?.src2x ?? capa("votare")?.src ?? retrato,
    cor: CORES.votare?.tinta,
  },
];

export default function AboutL() {
  useMetaRota();
  const [i, setI] = useState(0);
  const [semGL, setSemGL] = useState(false);
  const quadro = useRef<HTMLDivElement | null>(null);
  const visor = useRef<VisorFluido | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const passo = useRef({ p: 0 });
  const geracao = useRef(0);
  const trava = useRef(false);
  const reduzido =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── o renderer vive enquanto a rota vive, e desenha no ticker do GSAP ── */
  useEffect(() => {
    const tela = quadro.current;
    if (!tela) return;
    const v = criarVisorFluido(tela, 4);
    visor.current = v;
    setSemGL(!v);
    if (!v) return;
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__visor = v;
    v.acento(getComputedStyle(tela).getPropertyValue("--p-acento"));
    /* a primeira cena entra pronta: sem frente de onda de A para nada */
    void v.garantir(CENAS[0].src).then(() => {
      if (!visor.current) return;
      v.iniciar(CENAS[0].src, 1);
      v.progresso(1);
      v.concluir();
    });
    const ocioso = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as unknown as { requestIdleCallback: (c: () => void) => number }).requestIdleCallback(cb)
        : window.setTimeout(cb, 400);
    ocioso(() => void v.aquecer(CENAS.map((c) => c.src)));
    let ultimo = performance.now();
    const desenha = () => {
      const agora = performance.now();
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;
      v.passo(dt);
    };
    gsap.ticker.add(desenha);
    return () => {
      gsap.ticker.remove(desenha);
      tween.current?.kill();
      v.destruir();
      visor.current = null;
    };
  }, []);

  /* ── a troca de capítulo: a frente de onda em arco, com o fio na cor do que entra ── */
  const ir = (alvo: number) => {
    const n = (alvo + CENAS.length) % CENAS.length;
    if (n === i || trava.current) return;
    const dir: 1 | -1 = alvo > i ? 1 : -1;
    trava.current = true;
    window.setTimeout(() => (trava.current = false), reduzido ? 120 : 1100);
    setI(n);
    const v = visor.current;
    if (!v) return;
    const cena = CENAS[n];
    const meuTurno = ++geracao.current;
    void v.garantir(cena.src).then(() => {
      if (geracao.current !== meuTurno || !visor.current) return;
      tween.current?.kill();
      tween.current = null;
      v.resolver();
      v.acento(cena.cor ?? getComputedStyle(quadro.current!).getPropertyValue("--p-acento"));
      v.iniciar(cena.src, dir);
      passo.current.p = 0;
      tween.current = gsap.to(passo.current, {
        p: 1,
        duration: reduzido ? 0 : 0.92,
        ease: "power3.inOut",
        onUpdate: () => v.progresso(passo.current.p),
        onComplete: () => {
          v.concluir();
          tween.current = null;
        },
      });
    });
  };

  /* ── o wheel e as setas dirigem; a página não rola ─────────────────────── */
  useEffect(() => {
    const el = quadro.current?.parentElement;
    if (!el) return;
    const roda = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 24) return;
      ir(i + (e.deltaY > 0 ? 1 : -1));
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") ir(i + 1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") ir(i - 1);
    };
    el.addEventListener("wheel", roda, { passive: false });
    window.addEventListener("keydown", tecla);
    return () => {
      el.removeEventListener("wheel", roda);
      window.removeEventListener("keydown", tecla);
    };
  });

  const cena = CENAS[i];

  return (
    <Prancha n="03" nome="About" superficie="tinta" status="Available for projects" tela rodape="regua">
      <div className="p-visorpg">
        <div className="p-visorpg-quadro" ref={quadro} aria-hidden="true" />
        {semGL && <img className="p-visorpg-semgl" src={cena.src} alt="" aria-hidden="true" />}

        <div className="p-visorpg-hud" aria-live="polite">
          <p className="p-rotulo" style={{ color: "rgba(236,234,229,.55)" }}>
            {cena.rotulo}
          </p>
          <p className="p-visorpg-cap">{cena.cap}</p>
          <p className="p-visorpg-txt">{cena.txt}</p>
        </div>

        <p className="p-marca p-visorpg-conta">
          {String(i + 1).padStart(2, "0")} / {String(CENAS.length).padStart(2, "0")}
        </p>

        <nav className="p-visorpg-regua" aria-label="Chapters">
          {CENAS.map((c, k) => (
            <button key={k} type="button" onClick={() => ir(k)} aria-current={k === i ? "true" : undefined}>
              {c.rotulo.split(" /")[0]}
            </button>
          ))}
        </nav>
      </div>
    </Prancha>
  );
}
