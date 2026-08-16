import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { gsap } from "../lib/gsap";
import { WORK } from "../content/work";
import { scrollToTop } from "../lib/lenis";

/**
 * A transição entre páginas — o OBTURADOR do visor.
 *
 * ## Por que a primeira versão foi refeita
 *
 * Ele apontou o demo `async-page-transitions` do Codrops e eu entreguei um
 * `blur + translateY` em 20 linhas de CSS com a View Transitions API, com um
 * argumento técnico para justificar o corte. O veredito foi **"pobre demais"**,
 * e estava certo: a referência tem COREOGRAFIA — uma barra atravessa o topo, o
 * numeral gigante sobe de baixo, os dados entram linha a linha — e eu devolvi um
 * fade sofisticado. Referência apontada é barra a superar, não teto a
 * justificar por que não alcancei.
 *
 * ## O que este obturador faz, e por que é DELE
 *
 * O site inteiro se apresenta como um visor: crop marks fixas, marcas de foco
 * de quatro cantos, o rótulo que nomeia o que está enquadrado. Um visor tem uma
 * transição própria e é literalmente o obturador — o enquadramento FECHA,
 * reenquadra, e ABRE no assunto novo. Nenhum outro site pode usar esta
 * transição sem parecer emprestada, que é a diferença entre citar a mecânica de
 * uma referência e vestir a fantasia dela.
 *
 * A coreografia, em quatro tempos:
 *
 *   1. FECHA   duas lâminas de petróleo vindo de cima e de baixo, 0,42s,
 *              `power3.in` — acelerando, como lâmina mecânica
 *   2. TRAVA   as marcas de canto convergem e o rótulo do DESTINO é escrito no
 *              centro, junto de um traço que corre a largura
 *   3. TROCA   a rota muda com o quadro fechado (é o único instante em que o
 *              salto de scroll e a morte dos ScrollTriggers não aparecem)
 *   4. ABRE    as lâminas recuam em 0,62s `expo.out` e a página nova chega
 *              FOCANDO — o mesmo gesto que o resto do site usa para entrar
 *
 * ## Decisões que não são óbvias
 *
 * **Intercepta o clique globalmente, não Link por Link.** Um listener em fase de
 * captura pega qualquer `<a>` interno, inclusive os que nascerem em componentes
 * futuros. A alternativa seria marcar 25 Links à mão e esquecer o vigésimo
 * sexto.
 *
 * **A rota só troca com o quadro fechado.** É o que esconde as duas coisas feias
 * que toda navegação deste repo faz: o `scrollToTop` do Lenis e a matança de
 * ScrollTriggers do `RouteLifecycle`. Fazer a troca com o quadro aberto seria
 * ver o salto.
 *
 * ⚠ **A trava de reentrada é obrigatória.** Sem ela, dois cliques rápidos
 * empilham duas timelines, e a segunda abre o obturador que a primeira ainda
 * está fechando — a tela trava em petróleo e não volta.
 *
 * ⚠ **Modificador do teclado passa direto.** Cmd/Ctrl/Shift-clique e botão do
 * meio abrem em nova aba, e sequestrar isso quebra uma expectativa que o
 * navegador criou. Alvo externo, download e âncora na mesma página também
 * seguem o caminho normal.
 */

/* nome legível da rota, para o rótulo do obturador. Sai do próprio pathname —
   não há uma segunda lista de rotas para divergir da primeira. */
function nomeDaRota(p: string) {
  if (p === "/") return "Index";
  if (p.startsWith("/work/")) {
    const slug = p.split("/")[2] || "";
    const item = WORK.find((w) => w.slug === slug);
    return item ? item.title : "Case";
  }
  const limpo = p.replace(/^\//, "").split("/")[0];
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

/* o índice da rota dentro do site, no vernáculo de [01] que o resto usa */
const ORDEM = ["/", "/work", "/about", "/lab"];
function indiceDaRota(p: string) {
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

    const lamina = el.querySelectorAll<HTMLElement>("[data-lamina]");
    const marca = el.querySelectorAll<HTMLElement>("[data-marca]");
    const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
    const traco = el.querySelector<HTMLElement>("[data-traco]");

    const titulo = el.querySelector<HTMLElement>("[data-titulo]");
    const indice = el.querySelector<HTMLElement>("[data-indice]");

    const tl = gsap.timeline({
      onComplete: () => {
        ocupado.current = false;
        el.style.pointerEvents = "none";
      },
    });
    /* o título SAI por cima — completa o percurso que começou embaixo, em vez
       de desaparecer no lugar. É o mesmo elemento atravessando o quadro. */
    tl.to(titulo, { yPercent: -108, duration: 0.5, ease: "power3.in" })
      .to([rotulo, traco, indice], { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "<+0.1")
      .to(marca, { autoAlpha: 0, x: (i) => (i % 2 === 0 ? -20 : 20), y: (i) => (i < 2 ? -20 : 20), duration: 0.32 }, "<")
      /* as lâminas recuam com `expo.out`: quase todo o percurso no começo, e o
         fim quase parado — é o que faz o quadro "abrir" em vez de "deslizar" */
      .to(lamina, { scaleY: 0, duration: 0.66, ease: "expo.out" }, "-=0.24")
      /* ⚠ O conteúdo entra por BLOCO, com stagger — não a página inteira num
         bloco só. Era o segundo buraco: as lâminas abriam sobre uma página já
         pronta e parada, e a chegada não tinha peso nenhum. Na referência os
         dados entram linha a linha; aqui entram seção a seção, focando. */
      /* ⚠ `:not(.v3-obturador)` NÃO é preciosismo. O obturador também é um
         `<div>` filho de `<main>`, então `main > div > *` pegava as lâminas, o
         traço e as quatro marcas JUNTO com o conteúdo — a animação de entrada
         estava mexendo nas peças da própria transição, e o que devia entrar
         focando dividia o stagger com elementos que precisam ficar invisíveis.
         Só apareceu porque a verificação listou nó a nó em vez de contar. */
      .fromTo(
        "main > div:not(.v3-obturador) > *",
        { filter: "blur(14px)", opacity: 0.3, y: 18 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.055,
          clearProps: "filter,opacity,transform",
        },
        "-=0.52",
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

      const lamina = el.querySelectorAll<HTMLElement>("[data-lamina]");
      const marca = el.querySelectorAll<HTMLElement>("[data-marca]");
      const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
      const traco = el.querySelector<HTMLElement>("[data-traco]");
      const titulo = el.querySelector<HTMLElement>("[data-titulo]");
      const indice = el.querySelector<HTMLElement>("[data-indice]");
      if (rotulo) rotulo.textContent = "Now entering";
      if (titulo) titulo.textContent = nomeDaRota(url.pathname);
      if (indice) indice.textContent = indiceDaRota(url.pathname);

      gsap.set(lamina, { scaleY: 0 });
      gsap.set([rotulo, traco, indice, ...Array.from(marca)], { autoAlpha: 0 });
      gsap.set(traco, { scaleX: 0 });
      /* o título começa ABAIXO da própria máscara — sobe para dentro dela */
      gsap.set(titulo, { yPercent: 108, autoAlpha: 1 });
      /* as marcas nascem AFASTADAS e convergem: o quadro se fechando é o que
         elas contam. Aparecer no lugar não conta nada. */
      gsap.set(marca, { x: (i) => (i % 2 === 0 ? -26 : 26), y: (i) => (i < 2 ? -26 : 26) });

      const tl = gsap.timeline();
      /* 1. FECHA — `power3.in` acelera até o encontro: lâmina tem massa */
      tl.to(lamina, { scaleY: 1, duration: 0.42, ease: "power3.in" })
        /* 2. TRAVA — os cantos CONVERGEM para o enquadramento */
        .to(marca, { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: "expo.out" }, "-=0.10")
        .to(traco, { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "expo.out" }, "<")
        .to([rotulo, indice], { autoAlpha: 1, duration: 0.22 }, "<+0.06")
        /* 3. O DESTINO SOBE — era isto que faltava. O quadro fechado é o único
           momento em que o site tem a tela inteira, e ele estava vazio: um
           rótulo de 10px e um traço. Agora o nome da página que vem entra em
           corpo de display, subindo por baixo de uma máscara — a direção do
           movimento é a da referência (o elemento grande vem de baixo) e o
           corpo é o da lição de escala: uma escala de display, não duas. */
        .to(titulo, { yPercent: 0, duration: 0.72, ease: "expo.out" }, "<-0.04")
        /* 4. TROCA — com o quadro fechado, o salto de scroll não aparece */
        .call(() => {
          scrollToTop(true);
          navigate(url.pathname);
        })
        /* o quadro cheio SEGURA — sem este respiro o nome mal termina de subir
           quando as lâminas já recuam, e o momento não se registra */
        .to({}, { duration: 0.3 });
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [navigate]);

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      className="v3-obturador"
      style={{ pointerEvents: "none" }}
    >
      <i data-lamina className="lam topo" />
      <i data-lamina className="lam base" />
      <span data-traco className="traco" />
      {/* o quadro fechado, agora com conteúdo: rótulo + índice na régua, e o
          nome do destino subindo por dentro de uma máscara */}
      <span data-rotulo className="rotulo v3-micro" />
      <span data-indice className="indice v3-micro" />
      <span className="mascara">
        <span data-titulo className="titulo" />
      </span>
      <i data-marca className="m tl" />
      <i data-marca className="m tr" />
      <i data-marca className="m bl" />
      <i data-marca className="m br" />
    </div>
  );
}
