import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { gsap } from "../../lib/gsap";
import { WORK } from "../../content/work";
import { scrollToTop } from "../../lib/lenis";


/* nome legível da rota, para o rótulo do obturador. Sai do próprio pathname —
   não há uma segunda lista de rotas para divergir da primeira. */
const ehV2 = (p: string) => p === "/v2" || /^\/v2\/(about|work)(\/|$)/.test(p);

function nomeDaRota(p: string) {
  if (p === "/") return "Index";
  /* site V2 (V2): /v2[/work[/slug]|/about] */
  if (ehV2(p)) return nomeDaRota(p.slice(3) || "/");
  if (p.startsWith("/work/")) {
    const slug = p.split("/")[2] || "";
    const item = WORK.find((w) => w.slug === slug);
    return item ? item.title : "Case";
  }
  const limpo = p.replace(/^\//, "").split("/")[0];
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

/* ⭐ A SUPERFÍCIE DE CADA ROTA — a mesma tabela que a `Prancha` usa para se
   pintar. A lâmina chega nesta cor, então o destino se anuncia antes de
   existir. Se uma rota nova entrar aqui e lá com valores diferentes, a
   transição entrega a mentira: manter as duas juntas. */
/* a cor de cada superfície, para a lâmina — o mesmo valor que `v2.css` pinta
   nas pranchas. ⚠ Não usar as CLASSES aqui: elas trazem `background`. */
const COR_SUPERFICIE = { papel: "#f4f4f2", branco: "#ffffff", tinta: "#14201f" } as const;

const SUPERFICIE: Record<string, "papel" | "branco" | "tinta"> = {
  "/": "papel",
  "/work": "branco",
  "/about": "papel",
};
function superficieDaRota(p: string) {
  /* ⚠ A V4 é BRANCO ABSOLUTO em todas as rotas. Sem esta linha ela caía no
     `papel` do fallback e a lâmina chegava num creme que não existe em lugar
     nenhum daquela direção — a transição entregava uma superfície mentirosa,
     que é exatamente o que o comentário acima manda evitar. */
  if (p === "/v4" || p.startsWith("/v4/")) return "branco";
  /* o site V2 é papel branco puro em todas as rotas */
  if (ehV2(p)) return "branco";
  if (SUPERFICIE[p]) return SUPERFICIE[p];
  if (p.startsWith("/work/")) return "branco";
  return "papel";
}

/* o índice da rota dentro do site, no vernáculo de [01] que o resto usa */
const ORDEM = ["/", "/work", "/about"];
function indiceDaRota(p: string): string {
  if (ehV2(p)) return indiceDaRota(p.slice(3) || "/");
  const i = ORDEM.indexOf(p);
  if (i >= 0) return `[${String(i + 1).padStart(2, "0")}]`;
  if (p.startsWith("/work/")) {
    const j = WORK.findIndex((w) => w.slug === p.split("/")[2]);
    return j >= 0 ? `[${String(j + 1).padStart(2, "0")}]` : "[--]";
  }
  return "[--]";
}

export default function TransicaoRota() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const raiz = useRef<HTMLDivElement | null>(null);
  const ocupado = useRef(false);
  /* a rota que estamos indo buscar — o efeito de "abrir" espera por ela */
  const indoPara = useRef<string | null>(null);

  /* ── ABRE: dispara quando o pathname finalmente mudou ─────────────────── */
  useEffect(() => {
    if (!indoPara.current) return;
    indoPara.current = null;
    const el = raiz.current;
    if (!el) return;

    const faixa = el.querySelectorAll<HTMLElement>("[data-faixa]");
    const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
    const indice = el.querySelector<HTMLElement>("[data-indice]");
    const titulo = el.querySelector<HTMLElement>("[data-titulo]");

    gsap
      .timeline({
        onComplete: () => {
          ocupado.current = false;
          el.style.pointerEvents = "none";
        },
      })
      /* o título SAI por cima — completa o percurso que começou embaixo, em vez
         de desaparecer no lugar. É o mesmo elemento atravessando o quadro. */
      .to(titulo, { yPercent: -108, duration: 0.42, ease: "power3.in" })
      .to([rotulo, indice], { autoAlpha: 0, duration: 0.16 }, "<+0.06")
      /* ⭐ cada faixa CONTINUA para o lado OPOSTO ao que entrou — atravessar
         completa o gesto; recuar o desfaria. O stagger vem do fim para o
         começo, então a cortina se desfaz na ordem inversa da que fechou. */
      .to(
        faixa,
        {
          xPercent: (i) => (i % 2 === 0 ? 100 : -100),
          duration: 0.72,
          ease: "expo.inOut",
          stagger: { each: 0.055, from: "end" },
        },
        "-=0.2",
      )
      /* ⚠ O conteúdo entra por BLOCO, com stagger, e FOCANDO — que é o gesto do
         site. O `:not(.v3-obturador)` não é preciosismo: a própria transição é
         um `<div>` filho de `<main>` em algumas rotas, e sem o filtro a
         animação de entrada mexia nas peças dela. */
      .fromTo(
        "main > section > *, main > div:not(.v3-obturador) > *",
        { filter: "blur(12px)", opacity: 0.35, y: 14 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.66,
          ease: "power3.out",
          stagger: 0.05,
          clearProps: "filter,opacity,transform",
        },
        "-=0.45",
      );
  }, [pathname]);

  /* ── FECHA: intercepta o clique em qualquer link interno ──────────────── */
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const aoClicar = (ev: MouseEvent) => {
      if (quieto || ocupado.current) return;
      if (ev.defaultPrevented || ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      const a = (ev.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;             // externo ou mailto
      if (a.hasAttribute("download") || a.getAttribute("target") === "_blank") return;
      const url = new URL(href, location.origin);
      if (url.pathname === location.pathname) return;          // âncora na mesma página

      ev.preventDefault();
      ocupado.current = true;
      indoPara.current = url.pathname;
      el.style.pointerEvents = "auto";

      const faixa = el.querySelectorAll<HTMLElement>("[data-faixa]");
      const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
      const indice = el.querySelector<HTMLElement>("[data-indice]");
      const titulo = el.querySelector<HTMLElement>("[data-titulo]");

      /* ⚠ a cor vai no `style`, NUNCA como classe de superfície: as classes do
         sistema trazem `background` junto, e num `fixed inset:0` isso já virou
         parede opaca cobrindo a página uma vez hoje. */
      const cor = COR_SUPERFICIE[superficieDaRota(url.pathname)];
      faixa.forEach((f) => (f.style.background = cor));
      if (rotulo) rotulo.textContent = "Now entering";
      if (titulo) titulo.textContent = nomeDaRota(url.pathname);
      if (indice) indice.textContent = indiceDaRota(url.pathname);

      /* ⚠⚠ `x: 0` JUNTO com o xPercent — e eu já sabia disso. O CSS declara o
         repouso como `translateX(±101%)` (senão as faixas nascem cobrindo a
         página), o GSAP LÊ esse transform e guarda os ±1697px como `x`, e o
         `xPercent` passa a SOMAR por cima: medido, o quadro "fechado" ficava em
         ±1697 (nunca cobria) e o repouso final em ±17 (quase cobrindo). É o
         mesmo par de consertos brigando que já derrubou a transição-folha hoje
         — cada um certo sozinho. Zerando o `x`, o percentual volta a ser a
         única coordenada. */
      gsap.set(faixa, { x: 0, xPercent: (i) => (i % 2 === 0 ? -100 : 100) });
      gsap.set([rotulo, indice], { autoAlpha: 0 });
      gsap.set(titulo, { yPercent: 108, autoAlpha: 1 });

      gsap
        .timeline()
        .to(faixa, {
          xPercent: 0,
          duration: 0.66,
          ease: "expo.out",
          stagger: { each: 0.055, from: "start" },
        })
        /* o nome do destino sobe no quadro fechado — o único instante em que o
           site tem a tela inteira */
        .to(titulo, { yPercent: 0, duration: 0.62, ease: "expo.out" }, "-=0.34")
        .to([rotulo, indice], { autoAlpha: 1, duration: 0.22 }, "<+0.08")
        /* TROCA com a tela coberta: é o que esconde o salto de scroll */
        .call(() => {
          scrollToTop(true);
          navigate(url.pathname);
        })
        .to({}, { duration: 0.26 });
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [navigate]);

  return (
    <div ref={raiz} aria-hidden="true" className="v3-obturador p-cortina" style={{ pointerEvents: "none" }}>
      {/* seis faixas: ímpares entram pela esquerda, pares pela direita */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <i key={i} data-faixa className="p-cortina-faixa" style={{ top: `${(i * 100) / 6}%` }} />
      ))}
      {/* o quadro fechado é o único instante em que o site tem a tela inteira */}
      {/* ⚠ CLASSES PRÓPRIAS, sem as da direção anterior. Reusar `.rotulo`,
          `.indice`, `.mascara` e `.titulo` da V3 trouxe junto o `line-height: 0`
          da máscara (que zerava a altura e escondia o nome) e o LARANJA do
          acento antigo no índice. Herança de CSS de direção morta é o mesmo
          erro da transição herdada, uma camada abaixo. */}
      <span data-rotulo className="p-cortina-rotulo" />
      <span data-indice className="p-cortina-indice" />
      <span className="p-cortina-mascara">
        <span data-titulo className="p-cortina-titulo" />
      </span>
    </div>
  );
}

