import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * Os três gestos de scroll da direção V3 — "mais banho de GSAP sem pesar".
 *
 * O reveal por máscara de linha (`animations/reveal.ts`) já dava a ENTRADA do
 * texto. O que faltava era o que acontece ENTRE as seções: a página rolava e
 * nada respondia, então cada bloco parecia uma prancha separada em vez de um
 * documento em movimento. Aqui estão os três gestos que atravessam o site,
 * declarados por atributo — nenhum componente precisa saber que o GSAP existe:
 *
 *   data-foca              o BLOCO ENTRA FORA DE FOCO e a lente resolve
 *   data-parallax="0.12"   a peça anda mais devagar que a página → profundidade
 *   data-fio               o fio de seção se DESENHA da esquerda para a direita
 *
 * ## As três regras que este arquivo obedece (todas custaram caro no repo)
 *
 * **Nada de `pin`.** Pin sequestra a rolagem, e o único jeito de sair é
 * continuar rolando — em página de portfólio isso lê como travamento. Todo
 * gesto aqui é `scrub` puro: a página segue livre e as peças reagem a ela.
 *
 * **`scrub` com número, não `true`.** `scrub: true` cola o valor no scroll e
 * qualquer tranco do trackpad vira tranco na peça; `scrub: 0.6` interpola e é o
 * que faz o movimento parecer material com massa, não uma variável ligada ao
 * dedo. Emil Kowalski chama isso de "o atraso que dá peso".
 *
 * **`prefers-reduced-motion` desliga o gesto, nunca o conteúdo.** Cada função
 * devolve cedo, e o elemento fica no estado final — visível, no lugar.
 *
 * ⚠ Com Lenis no comando, `window.scrollTo` não move nada e os triggers não
 * atualizam. Qualquer verificação disto rola com `page.mouse.wheel`.
 */

const quieto = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type CraftHandle = { kill: () => void };

/**
 * Liga os três gestos dentro de `raiz`. Chame uma vez por página, depois que o
 * DOM montou; o retorno mata todos os triggers criados.
 */
export function ligarCraft(raiz: HTMLElement | Document = document): CraftHandle {
  if (quieto()) return { kill: () => {} };

  const triggers: ScrollTrigger[] = [];

  /* ── 1. parallax ────────────────────────────────────────────────────────
     A imagem é maior que a moldura (o CSS dá `scale`), então ela pode andar
     dentro do próprio recorte sem descobrir a borda. O fator vem do atributo:
     0.08 é um sussurro, 0.2 já é perceptível como camada. */
  raiz.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const fator = Number(el.dataset.parallax) || 0.12;
    const alvo = (el.querySelector("img, canvas") as HTMLElement | null) ?? el;
    const st = gsap.fromTo(
      alvo,
      { yPercent: -fator * 100 },
      {
        yPercent: fator * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    ).scrollTrigger;
    if (st) triggers.push(st);
  });

  /* ── 2. o fio que se desenha ────────────────────────────────────────────
     `scaleX` a partir da esquerda, não `width`: largura é layout e faria a
     linha recalcular a caixa a cada frame; transform anda na GPU. */
  raiz.querySelectorAll<HTMLElement>("[data-fio]").forEach((el) => {
    gsap.set(el, { transformOrigin: "left center" });
    const st = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "power2.out",
        duration: 1.1,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    ).scrollTrigger;
    if (st) triggers.push(st);
  });

  /* ── 3. O FOCO — o gesto de entrada do site ─────────────────────────────
     Isto substituiu um `fade + translateY` escalonado, que o Thalyson recusou
     em 16/08 ("não gostei, digo os efeitos, transições"). E a recusa era certa:
     subir 26px e aparecer é o pacote que vem com qualquer biblioteca de scroll.
     Não dizia nada sobre ESTE site.

     Gravando a referência quadro a quadro (`scripts/gravar-ref.mjs`) ficou claro
     o que o screenshot escondia: no bleibtgleich cada palavra **nasce borrada e
     se resolve**. O filtro é `feGaussianBlur stdDeviation=19.45` +
     `feColorMatrix` com alpha 20/−8, e o valor fracionário denuncia que o
     stdDeviation está sendo ANIMADO a cada frame. A aparência líquida é o
     threshold de alpha; o mecanismo por baixo é desfoque que resolve.

     Aqui o threshold não entra — gota orgânica é a matéria da identidade dele.
     Fica o mecanismo, dito no vocabulário deste site: o sistema inteiro se
     apresenta como um VISOR (crop marks no HUD, marcas de foco de quatro cantos
     em cada peça, "o portfólio como visor"), e um visor tem exatamente um
     gesto — **focar**. A peça entra fora de foco e a lente resolve. É a
     promessa que a moldura já fazia e que o movimento nunca cumpria.

     ⚠ `blur` é filtro de composição e custa caro em área grande. Três defesas:
     `once: true` (nunca re-anima), `will-change` ligado só durante a animação
     (mantê-lo aceso reserva memória de vídeo para sempre), e o filtro REMOVIDO
     no fim em vez de deixado em `blur(0)` — zero ainda paga o custo da camada. */
  raiz.querySelectorAll<HTMLElement>("[data-foca]").forEach((grupo) => {
    const filhos = Array.from(grupo.children) as HTMLElement[];
    if (!filhos.length) return;
    const st = gsap.fromTo(
      filhos,
      { filter: "blur(13px)", autoAlpha: 0, scale: 1.035 },
      {
        filter: "blur(0px)",
        autoAlpha: 1,
        scale: 1,
        duration: 0.95,
        /* a lente para de girar antes de chegar: quase todo o percurso acontece
           no primeiro terço, e o resto é o assentamento */
        ease: "power3.out",
        stagger: 0.07,
        onStart: () => filhos.forEach((f) => (f.style.willChange = "filter, transform, opacity")),
        onComplete: () =>
          filhos.forEach((f) => {
            f.style.willChange = "";
            f.style.filter = "";
          }),
        scrollTrigger: { trigger: grupo, start: "top 86%", once: true },
      },
    ).scrollTrigger;
    if (st) triggers.push(st);
  });

  /* ── 4. o visor nomeia o que está enquadrado ────────────────────────────
     Este é o gesto ENTRE seções, que era o que faltava: o HUD de crop marks
     desenhava a moldura de um visor e não dizia nada sobre o que estava dentro
     dela. Agora cada `<section data-secao="...">` que cruza o meio da tela
     escreve o próprio nome no topo, e uma régua fina mede o quanto da página
     já passou. É o vocabulário do sistema levado até o fim — visor de câmera
     nomeia o enquadramento — e é o único elemento da página que conhece TODAS
     as seções, o que faz a rolagem ler como um documento contínuo em vez de
     pranchas soltas.

     A troca é por opacidade em 0,18s, não por deslocamento: o texto vive na
     barra fixa em blend-difference, e mover algo ali chamaria mais atenção que
     o conteúdo. */
  const visor = (raiz instanceof Document ? document : raiz).querySelector<HTMLElement>("[data-visor]");
  const regua = (raiz instanceof Document ? document : raiz).querySelector<HTMLElement>("[data-regua]");
  const secoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-secao]"));

  if (visor && secoes.length) {
    const escrever = (txt: string) => {
      if (visor.textContent === txt) return;
      gsap.to(visor, {
        autoAlpha: 0,
        duration: 0.18,
        onComplete: () => {
          visor.textContent = txt;
          gsap.to(visor, { autoAlpha: 1, duration: 0.18 });
        },
      });
    };
    secoes.forEach((sec) => {
      /* ⚠ A capa não se nomeia. Na primeira tela o visor escrevia "INDEX"
         bem no meio do nome que sangra pela base — duas tipografias disputando
         o mesmo eixo. E o argumento não é só de colisão: o visor existe para
         dizer o que está enquadrado, e na capa o enquadramento JÁ É o nome.

         O RODAPÉ entrou na mesma exceção em 17/08, pelo mesmo motivo literal:
         desde que ele ganhou a anatomia do nightjar, o fecho da página também é
         o nome sangrando pela base, e "CONTACT" caía em cima do "S" de MATEUS.
         Onde o nome ocupa a base, o visor cala. */
      const capa = sec.dataset.secao === "Index" || sec.dataset.secao === "Contact";
      const nome = capa ? "" : sec.dataset.secao || "";
      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && escrever(nome),
      });
      triggers.push(st);
    });
  }

  if (regua) {
    gsap.set(regua, { transformOrigin: "left center", scaleX: 0 });
    const st = gsap.to(regua, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    }).scrollTrigger;
    if (st) triggers.push(st);
  }

  return {
    kill: () => triggers.forEach((t) => t.kill()),
  };
}
