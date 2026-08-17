import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { gsap } from "../lib/gsap";
import { WORK } from "../content/work";
import { scrollToTop } from "../lib/lenis";

/**
 * A transição entre páginas — A FOLHA QUE VIRA.
 *
 * ⚠ 17/08 — REFEITA. A anterior era o OBTURADOR: lâminas fechando, quatro
 * marcas de canto convergindo, o nome do destino subindo em corpo de display.
 * Era boa, e era de OUTRA DIREÇÃO — nasceu para "o portfólio como visor", cujo
 * vocabulário é crop mark e marca de foco. Quando a Prancha virou o site, ela
 * ficou: *"a transição vc não atualizou"*. Transição herdada de direção morta
 * é fantasia da direção anterior.
 *
 * ## A língua desta direção
 *
 * A Prancha é feita de SUPERFÍCIE e FIO DE 1PX — cada rota tem a sua superfície
 * (index em papel, work em branco, lab em tinta), e a régua de 1px separa tudo.
 * A home já usa esse par no micro: no visor, a arte nova invade a anterior por
 * uma frente lateral com o fio do acento na crista.
 *
 * Aqui é o MESMO gesto em escala de página: uma folha na superfície do DESTINO
 * atravessa a tela pela lateral, com o fio de 1px na aresta de ataque, cobre,
 * a rota troca por baixo, e a folha continua o percurso saindo pelo outro lado.
 * Não é um wipe: é a prancha seguinte sendo posta sobre a mesa. E como a folha
 * já vem na cor da rota que chega, a transição ANUNCIA o destino antes de ele
 * existir.
 *
 * O único texto é o metadado — índice e nome em mono minúsculo, colados ao fio,
 * que é como esta direção nomeia as coisas. Nome em corpo de display era da
 * direção do visor, onde havia uma escala de display para carregar isso.
 *
 * ## O que ficou da versão anterior, porque é mecânica e não estilo
 *
 * A interceptação de clique em fase de captura, e as regras dela:
 * ⚠ **Modificador do teclado passa direto.** Cmd/Ctrl/Shift-clique e botão do
 * meio abrem em nova aba, e sequestrar isso quebra uma expectativa que o
 * navegador criou. Alvo externo, download e âncora na mesma página também
 * seguem o caminho normal.
 * ⚠ E a troca de rota acontece com a tela COBERTA, que é o que esconde o salto
 * de scroll.
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

/* ⭐ A SUPERFÍCIE DE CADA ROTA — a mesma tabela que a `Prancha` usa para se
   pintar. A folha da transição chega já nesta cor, então o destino se anuncia
   antes de existir. Se uma rota nova entrar aqui e lá com valores diferentes, a
   transição entrega a mentira: manter as duas juntas. */
const SUPERFICIE: Record<string, "papel" | "branco" | "tinta"> = {
  "/": "papel",
  "/work": "branco",
  "/about": "papel",
  "/lab": "tinta",
};
function superficieDaRota(p: string) {
  if (SUPERFICIE[p]) return SUPERFICIE[p];
  if (p.startsWith("/work/")) return "branco";
  return "papel";
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

  /* ── SAI: dispara quando o pathname finalmente mudou ─────────────────── */
  useEffect(() => {
    if (!indoPara.current) return;
    const destino = indoPara.current;
    indoPara.current = null;
    const el = raiz.current;
    if (!el) return;

    const folha = el.querySelector<HTMLElement>("[data-folha]");
    const ficha = el.querySelector<HTMLElement>("[data-ficha]");
    const lado = el.dataset.lado === "-1" ? -1 : 1;

    const tl = gsap.timeline({
      onComplete: () => {
        ocupado.current = false;
        el.style.pointerEvents = "none";
      },
    });
    /* a folha NÃO recua: ela completa o percurso e sai pelo outro lado. Recuar
       seria desfazer o gesto; sair é pôr a prancha na mesa e tirar a mão. */
    tl.to(ficha, { autoAlpha: 0, duration: 0.18, ease: "power2.in" })
      .to(folha, { xPercent: 100 * lado, duration: 0.72, ease: "expo.inOut" }, "<")
      /* ⚠ o conteúdo entra por BLOCO, com stagger — não a página inteira num
         bloco só. E entra FOCANDO, que é o gesto do site: chega desfocado e
         resolve. O `:not` protege as peças da própria transição, que também são
         filhas de `main` em algumas rotas. */
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
        "-=0.5",
      );
    void destino;
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

      const folha = el.querySelector<HTMLElement>("[data-folha]");
      const ficha = el.querySelector<HTMLElement>("[data-ficha]");
      const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
      const indice = el.querySelector<HTMLElement>("[data-indice]");

      /* a folha chega na superfície do DESTINO — a rota se anuncia antes de
         existir */
      if (folha) folha.className = `p-folha p-${superficieDaRota(url.pathname)}`;
      if (rotulo) rotulo.textContent = nomeDaRota(url.pathname);
      if (indice) indice.textContent = indiceDaRota(url.pathname);

      /* ⭐ o lado de entrada alterna a cada navegação: duas trocas seguidas
         para o mesmo lado leem como slideshow; alternando, lê como folha sendo
         posta e retirada. */
      const lado = el.dataset.lado === "1" ? -1 : 1;
      el.dataset.lado = String(lado);

      gsap.set(folha, { xPercent: -100 * lado });
      gsap.set(ficha, { autoAlpha: 0, x: 12 * lado });

      const tl = gsap.timeline();
      /* 1. A FOLHA ENTRA — `expo.out`: quase todo o percurso no começo, e o
         fim quase parado. É o que dá peso de matéria em vez de deslize. */
      tl.to(folha, { xPercent: 0, duration: 0.62, ease: "expo.out" })
        /* 2. O METADADO assenta no fio — o único texto desta transição */
        .to(ficha, { autoAlpha: 1, x: 0, duration: 0.4, ease: "expo.out" }, "-=0.34")
        /* 3. TROCA — com a tela coberta, o salto de scroll não aparece */
        .call(() => {
          scrollToTop(true);
          navigate(url.pathname);
        })
        /* a folha SEGURA um instante: sem isso o nome mal assenta e já sai */
        .to({}, { duration: 0.26 });
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [navigate]);

  return (
    <div ref={raiz} aria-hidden="true" className="v3-obturador" style={{ pointerEvents: "none" }}>
      {/* a folha: superfície inteira + o fio de 1px na aresta de ataque */}
      <div data-folha className="p-folha p-papel">
        <i className="p-folha-fio" />
        {/* o metadado, colado ao fio — é assim que esta direção nomeia */}
        <span data-ficha className="p-folha-ficha">
          <span data-indice className="p-marca" />
          <span data-rotulo className="p-rotulo" />
        </span>
      </div>
    </div>
  );
}
