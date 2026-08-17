import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { gsap } from "../lib/gsap";
import { WORK } from "../content/work";
import { scrollToTop } from "../lib/lenis";

/**
 * A transição entre páginas — O OBTURADOR.
 *
 * ⚠ ELE VOLTOU, e a volta é decisão dele. Quando a Prancha virou o site, refiz
 * a transição como "a folha" (uma superfície atravessando com o fio na aresta),
 * porque o obturador tinha nascido para a direção anterior. Ele testou e cortou:
 * *"essa transição ficou ruim"* → **"a transição pode ser aquela de antes,
 * melhorada visualmente"**. Coreografia que funciona não se troca por
 * coerência de vocabulário — se a antiga era melhor, a nova precisa ser MELHOR,
 * não só mais coerente.
 *
 * O que fica da versão original (é ela que funcionava):
 *   1. FECHA   duas lâminas se encontram no meio, com massa (`power3.in`)
 *   2. TRAVA   o quadro fechado se afirma
 *   3. SOBE    o NOME do destino entra por baixo de uma máscara
 *   4. TROCA   a rota muda com a tela coberta (é o que esconde o salto)
 *   5. ABRE    as lâminas recuam e o conteúdo entra focando, seção a seção
 *
 * O que muda no acabamento, para ela falar a língua da Prancha:
 *   · a lâmina chega na SUPERFÍCIE DA ROTA DE DESTINO, não no petróleo fixo —
 *     a transição anuncia para onde se vai antes de chegar;
 *   · saem as quatro marcas de canto (crop marks são assinatura da direção do
 *     visor) e entra o FIO DE 1PX no acento, que é a régua deste sistema;
 *   · o nome do destino vem em Geist regular, não no display da direção antiga,
 *     e o índice o acompanha em mono minúsculo.
 *
 * ⚠ Mecânica preservada da versão original, porque é mecânica e não estilo: a
 * interceptação de clique em fase de captura, com modificador de teclado
 * passando direto (Cmd/Ctrl/Shift-clique e botão do meio abrem em nova aba, e
 * sequestrar isso quebra expectativa do navegador), alvo externo e download
 * seguindo o caminho normal, e a troca de rota com a tela coberta.
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

  /* ── ABRE: dispara quando o pathname finalmente mudou ─────────────────── */
  useEffect(() => {
    if (!indoPara.current) return;
    indoPara.current = null;
    const el = raiz.current;
    if (!el) return;

    const lamina = el.querySelectorAll<HTMLElement>("[data-lamina]");
    const fio = el.querySelector<HTMLElement>("[data-fio]");
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
      .to([rotulo, indice], { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "<+0.1")
      .to(fio, { autoAlpha: 0, scaleX: 0, duration: 0.3, ease: "power2.in" }, "<")
      /* as lâminas recuam com `expo.out`: quase todo o percurso no começo, e o
         fim quase parado — é o que faz o quadro "abrir" em vez de "deslizar" */
      .to(lamina, { scaleY: 0, duration: 0.66, ease: "expo.out" }, "-=0.24")
      /* ⚠ O conteúdo entra por BLOCO, com stagger — não a página inteira num
         bloco só. Era o segundo buraco: as lâminas abriam sobre uma página já
         pronta e parada, e a chegada não tinha peso nenhum. Na referência os
         dados entram linha a linha; aqui entram seção a seção, focando. */
      /* ⚠ `:not(.v3-obturador)` NÃO é preciosismo. O obturador também é um
         `<div>` filho de `<main>`, então `main > div > *` pegava as lâminas, o
         traço e o fio JUNTO com o conteúdo — a animação de entrada
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
      const fio = el.querySelector<HTMLElement>("[data-fio]");
      const rotulo = el.querySelector<HTMLElement>("[data-rotulo]");
      const titulo = el.querySelector<HTMLElement>("[data-titulo]");
      const indice = el.querySelector<HTMLElement>("[data-indice]");
      if (rotulo) rotulo.textContent = "Now entering";
      if (titulo) titulo.textContent = nomeDaRota(url.pathname);
      if (indice) indice.textContent = indiceDaRota(url.pathname);

      /* ⚠⚠ A COR DA LÂMINA VAI NO `style`, NUNCA COMO CLASSE DE SUPERFÍCIE.
         Eu tinha posto `p-branco`/`p-papel`/`p-tinta` na raiz do obturador para
         herdar a cor — e essas classes trazem `background` junto. A raiz é
         `fixed inset:0`, então ela virou uma PAREDE opaca cobrindo a página
         depois da transição: a rota trocava, o DOM montava (medido: 479
         caracteres, canvas de pé, lâminas em scaleY 0) e a tela ficava branca.
         "a transição ocorre mas a página não carrega" era isto.
         Só a cor, e só nas lâminas. */
      el.style.color = COR_SUPERFICIE[superficieDaRota(url.pathname)];
      gsap.set(lamina, { scaleY: 0 });
      gsap.set([rotulo, indice, fio], { autoAlpha: 0 });
      gsap.set(fio, { scaleX: 0 });
      /* o título começa ABAIXO da própria máscara — sobe para dentro dela */
      gsap.set(titulo, { yPercent: 108, autoAlpha: 1 });

      const tl = gsap.timeline();
      /* 1. FECHA — `power3.in` acelera até o encontro: lâmina tem massa */
      tl.to(lamina, { scaleY: 1, duration: 0.42, ease: "power3.in" })
        /* 2. TRAVA — os cantos CONVERGEM para o enquadramento */
        /* o FIO corre a largura no instante em que as lâminas se encontram —
           é a régua do sistema aparecendo na costura */
        .to(fio, { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "expo.out" }, "-=0.10")
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
      className="v3-obturador p-obt"
      style={{ pointerEvents: "none" }}
    >
      <i data-lamina className="lam topo" />
      <i data-lamina className="lam base" />
      {/* o fio de 1px do sistema, na costura onde as lâminas se encontram */}
      <i data-fio className="p-obt-fio" />
      {/* o quadro fechado, agora com conteúdo: rótulo + índice na régua, e o
          nome do destino subindo por dentro de uma máscara */}
      <span data-rotulo className="rotulo v3-micro" />
      <span data-indice className="indice v3-micro" />
      <span className="mascara">
        <span data-titulo className="titulo" />
      </span>
    </div>
  );
}
