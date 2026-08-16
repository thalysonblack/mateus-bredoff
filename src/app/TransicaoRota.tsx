import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { gsap } from "../lib/gsap";
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
  if (p.startsWith("/work/")) return "Case";
  const limpo = p.replace(/^\//, "").split("/")[0];
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
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

    const tl = gsap.timeline({
      onComplete: () => {
        ocupado.current = false;
        el.style.pointerEvents = "none";
      },
    });
    tl.to([rotulo, traco], { autoAlpha: 0, duration: 0.18, ease: "power2.in" })
      .to(marca, { autoAlpha: 0, duration: 0.2 }, "<")
      /* as lâminas recuam com `expo.out`: quase todo o percurso no começo, e o
         fim quase parado — é o que faz o quadro "abrir" em vez de "deslizar" */
      .to(lamina, { scaleY: 0, duration: 0.62, ease: "expo.out" }, "-=0.06")
      /* o conteúdo da página nova entra focando, junto com a abertura */
      .fromTo(
        "main > div",
        { filter: "blur(16px)", opacity: 0.35 },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "filter,opacity",
        },
        "-=0.5",
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
      if (rotulo) rotulo.textContent = nomeDaRota(url.pathname);

      gsap.set(lamina, { scaleY: 0 });
      gsap.set([rotulo, traco, ...Array.from(marca)], { autoAlpha: 0 });
      gsap.set(traco, { scaleX: 0 });

      const tl = gsap.timeline();
      /* 1. FECHA — `power3.in` acelera até o encontro: lâmina tem massa */
      tl.to(lamina, { scaleY: 1, duration: 0.42, ease: "power3.in" })
        /* 2. TRAVA — cantos convergem, traço corre, o destino é escrito */
        .to(marca, { autoAlpha: 1, duration: 0.16 }, "-=0.08")
        .to(traco, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: "expo.out" }, "<")
        .to(rotulo, { autoAlpha: 1, duration: 0.22 }, "<+0.04")
        /* 3. TROCA — com o quadro fechado, o salto de scroll não aparece */
        .call(() => {
          scrollToTop(true);
          navigate(url.pathname);
        })
        /* respiro mínimo com o quadro cheio: sem isto a página nova pisca antes
           de o olho registrar que houve um corte */
        .to({}, { duration: 0.22 });
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
      <span data-rotulo className="rotulo v3-micro" />
      <i data-marca className="m tl" />
      <i data-marca className="m tr" />
      <i data-marca className="m bl" />
      <i data-marca className="m br" />
    </div>
  );
}
