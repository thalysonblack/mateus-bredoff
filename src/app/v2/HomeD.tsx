import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { criarVisorFluido, type VisorFluido } from "../../lib/visorFluido";
import { WORK } from "../../content/work";
import { RECONHECIMENTO } from "../../content/reconhecimento";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha, Bloco } from "./sistema";

/**
 * HOME — PARTIDO D: "A TRAMA".
 *
 * O pedido foi "mais viva, tipo revelatio ou aquela primeira". As duas
 * referências têm o mesmo princípio por baixo de técnicas diferentes: a matéria
 * do estúdio **processada em tempo real** — o vídeo da equipe virando ASCII num
 * shader, as capas virando textura num sólido que gira. Nenhuma das duas exibe
 * uma imagem parada na primeira tela.
 *
 * A matéria dele é a MARCA. Então o gesto é tipográfico: os nomes dos nove
 * projetos atravessam a tela em corpo de cartaz, a fita anda sozinha e para
 * quando o cursor pousa. A peça se vê no visor que segue o cursor.
 *
 * ⚠ 17/08 — TRÊS CORREÇÕES DELE, e a ordem em que vieram importa:
 *   1. *"tire os projetos de dentro da máscara"* — o nome era recortado NA ARTE
 *      (`background-clip: text` com a capa por dentro). O recorte fica; o que
 *      sai é a foto: *"ao invés de ser preenchido com o projeto, ser com a
 *      cor"*. Letra grande com fotografia por dentro vira ruído — a mesma
 *      palavra em cor chapada lê como marca.
 *   2. *"o overlay ao passar o mouse ficou ruim"* → *"o mouse no hover vira o
 *      projeto"*: o ponteiro SOME e a peça toma o lugar dele. Mais: *"16:9
 *      mesmo, borda com 2px de arredondamento, sem sombra, efeito legal
 *      GSAP"*. Com a proporção nativa de cada capa o visor trocava de formato
 *      a cada nome — daí a proporção única.
 *   3. *"tudo no viewport, não vai ter esse scroll pra baixo, o scroll move os
 *      projetos"* — a home é UMA TELA e o gesto de rolar dirige a trama. Ver o
 *      efeito do ticker, abaixo.
 *
 * ⚠ DUAS MONTAGENS QUE ELE CORTOU, para não voltarem: (a) a peça inteira dentro
 * da fita, em cards ao lado de cada nome — *"não era assim, era pra manter como
 * estava"*; (b) a ficha numa segunda tela, para dar percurso de scroll ao
 * documento — *"tudo no viewport"*. A fita é de NOMES, a peça é o visor, e a
 * página não rola.
 */
export default function HomeD() {
  useMetaRota();
  /* a peça sob o cursor. `null` = nada aceso. */
  const [sob, setSob] = useState<(typeof WORK)[number] | null>(null);
  const visor = useRef<HTMLDivElement | null>(null);
  /* ⚠ DUAS CAMADAS, uma dona cada: o anel externo recebe o translate do mouse
     (escrito fora do React), o visor interno é do GSAP (scale/clip da entrada).
     Numa camada só, o tween e o pointermove disputam a mesma matriz e a peça
     salta a cada frame. */
  const anel = useRef<HTMLDivElement | null>(null);
  const campo = useRef<HTMLDivElement | null>(null);

  /* ⚠ QUEM ESTÁ SOB O CURSOR SE DESCOBRE POR `elementFromPoint`, não por
     onMouseEnter. Medido: com `mouseenter` no nome, o visor NUNCA acendia — os
     nomes estão dentro de uma fita em movimento contínuo, então o elemento sai
     debaixo do cursor antes de o evento assentar, e enter/leave se cancelam.
     Lendo o ponto a cada movimento, o alvo é sempre o que está ali AGORA.

     Só o slug vira estado, e só quando MUDA de peça — então o pointermove não
     re-renderiza a trama (nove nomes × três fitas) a 60fps. */
  useEffect(() => {
    let ultimo: string | null = null;
    const mover = (e: PointerEvent) => {
      /* ⚠ A PEÇA É O CURSOR — "o mouse no hover vira o projeto". Por isso o
         translate vai no ponto EXATO, sem offset: o anel tem margem negativa de
         meia caixa no CSS, então o centro da peça cai onde o ponteiro está. Uma
         versão anterior descolava 26px para baixo e ficava com cara de tooltip;
         outra ancorou no centro da tela e perdeu o vínculo com o gesto. */
      const el = anel.current;
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      /* ⚠ QUEM FECHA O VISOR É SAIR DA TRAMA — não sair de um nome.
         *"o 16:9 não pode fechar, a thumb muda interno tipo máscara"*: entre uma
         palavra e a seguinte existe um VÃO (o espaço da fita, o ponto
         separador), e ali `[data-peca]` não acha nada. Zerando a peça nesse vão,
         o quadro fechava e reabria a cada nome — que é exatamente o piscar que
         ele mandou tirar, e não some ajustando a animação, porque a causa é
         o alvo do teste.
         Dentro do campo e fora de uma palavra, a peça anterior FICA. */
      const noPonto = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const alvo = noPonto?.closest<HTMLElement>("[data-peca]");
      /* ⭐ de que lado a arte deve entrar: o MESMO de onde vem a fita desta
         linha. Linhas pares desfilam para a esquerda (o conteúdo chega pela
         direita), ímpares ao contrário. Ler isso do DOM evita duplicar em JS a
         regra que já está no CSS. */
      const linha = noPonto?.closest<HTMLElement>("[data-linha]");
      if (linha) lado.current = Number(linha.dataset.linha) % 2 === 1 ? -1 : 1;
      const naTrama = !!noPonto && !!campo.current?.contains(noPonto);
      const slug = alvo?.dataset.peca ?? (naTrama ? ultimo : null);
      if (slug === ultimo) return;
      ultimo = slug;
      setSob(slug ? WORK.find((w) => w.slug === slug) ?? null : null);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  /**
   * O SCROLL EMPURRA AS FITAS — e a página não sai do lugar.
   *
   * ⚠ "tudo no viewport, não vai ter esse scroll pra baixo, deixa como antes, o
   * scroll move os projetos". A home é UMA TELA: o documento cabe em 100svh, e
   * o gesto de rolar é reaproveitado para dirigir a trama.
   *
   * Isso não dá para fazer com `animation-timeline: scroll()`, que era como
   * estava: sem curso de scroll a timeline não avança. (E o que existia antes
   * eram 26px de sobra acidental — a trama voava com um gesto mínimo, porque
   * 16% de deslocamento cabia em 26px de curso.) Aqui o `wheel` vira alvo, o
   * ticker persegue o alvo com lerp, e cada linha recebe o empurrão em sentido
   * alternado, por cima do loop próprio dela.
   *
   * ⚠ Um relógio só: o lerp roda no ticker do GSAP, como manda o CLAUDE.md
   * deste repo — nunca num `rAF` próprio. E a referência da função é guardada,
   * senão `gsap.ticker.remove` não a encontra.
   */
  useEffect(() => {
    const el = campo.current;
    if (!el || prefersReducedMotion()) return;
    const linhas = [...el.querySelectorAll<HTMLElement>(".p-trama-scroll")];
    let alvo = 0;
    let atual = 0;
    const roda = (e: WheelEvent) => {
      alvo += e.deltaY * 0.55;
    };
    const passo = () => {
      atual += (alvo - atual) * 0.09;
      if (Math.abs(alvo - atual) < 0.05) atual = alvo;
      linhas.forEach((l, i) => {
        l.style.transform = `translate3d(${i % 2 === 1 ? atual : -atual}px, 0, 0)`;
      });
    };
    window.addEventListener("wheel", roda, { passive: true });
    gsap.ticker.add(passo);
    return () => {
      window.removeEventListener("wheel", roda);
      gsap.ticker.remove(passo);
    };
  }, []);

  /**
   * O renderer do visor vive enquanto a rota vive, e desenha no ticker do GSAP.
   *
   * ⚠ Ele NÃO é montado/desmontado junto com o hover: criar contexto WebGL custa
   * caro e a trama dispara troca a cada palavra. Fica de pé, e quem aparece e
   * some é a máscara (o `.p-visor`, por GSAP).
   */
  useEffect(() => {
    const tela = quadro.current;
    if (!tela) return;
    const v = criarVisorFluido(tela);
    fluido.current = v;
    if (!v) return;
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
      v.destruir();
      fluido.current = null;
    };
  }, []);

  /**
   * O VISOR: ABRE UMA VEZ, DEPOIS TROCA POR DENTRO.
   *
   * ⚠ *"invés do frame de projeto fechar e abrir, deixar aberto e trocar por
   * dentro"*. O quadro é um INSTRUMENTO, não um popup: enquanto o cursor
   * estiver sobre a trama ele fica aberto e imóvel, e o que muda é a arte lá
   * dentro. Reanimar o `clipPath` a cada nome fazia a moldura piscar — e
   * percorrer a fita, que é o gesto natural aqui, virava uma sequência de
   * aberturas e fechamentos.
   *
   * São três momentos distintos, e é por isso que o efeito não pode ter uma
   * dependência só:
   *   ABRIR   (nada aceso → uma peça)  máscara sobe + arte entra em foco
   *   TROCAR  (peça → outra peça)      só a arte: refoca, a moldura não se mexe
   *   FECHAR  (peça → nada)            a máscara desce
   *
   * O gesto em todos é o mesmo do site (`data-foca`): a arte chega desfocada e
   * resolve. Trocar de nome com o visor aberto lê como girar o anel de foco de
   * uma lente — a moldura parada é justamente o que dá essa leitura.
   *
   * ⚠ A peça continua RENDERIZADA depois que o cursor sai (`peca`, não `sob`):
   * desmontar no mesmo frame não deixaria o fechamento acontecer.
   *
   * ⚠ O visor NÃO leva legenda. Teve uma, em `mix-blend-difference`, e sobre a
   * capa vermelha da Ginga o branco virava verde-limão. Véu por baixo do texto
   * ele já reprovou noutra peça ([[am_craft_texto_sobre_arte_se_decide_medindo]]),
   * e o nome do projeto já está aceso em acento na própria trama — a legenda
   * era o mesmo dado dito duas vezes, com um defeito de contraste de brinde.
   */
  const aberto = useRef(false);
  /* o renderer do visor (WebGL). `null` = sem WebGL: o visor abre e fecha, e a
     troca acontece sem o fluido — a peça continua legível. */
  const fluido = useRef<VisorFluido | null>(null);
  /* de que lado a próxima arte entra: +1 pela direita, −1 pela esquerda */
  const lado = useRef(1);
  /* a caixa onde o canvas do WebGL é pendurado */
  const quadro = useRef<HTMLDivElement | null>(null);
  /* qual arte já está na textura da frente — evita redissolver a mesma peça */
  const ultimoSrc = useRef<string | null>(null);
  useLayoutEffect(() => {
    const el = visor.current;
    const v = fluido.current;
    if (!el) return;
    const reduzido = prefersReducedMotion();

    /* FECHAR — a máscara desce; a arte fica onde está, para a próxima abertura
       já entrar sobre ela. */
    if (!sob) {
      if (!aberto.current) return;
      aberto.current = false;
      if (reduzido) return void gsap.set(el, { autoAlpha: 0 });
      gsap.to(el, {
        autoAlpha: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.34,
        ease: "power2.in",
        overwrite: "auto",
      });
      return;
    }

    const src = sob.cover.src2x ?? sob.cover.src;
    const meu = src;

    /* sem WebGL: a máscara ainda abre e fecha, só não há fluido */
    if (!v) {
      gsap.set(el, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
      aberto.current = true;
      return;
    }

    /* ⚠ A ARTE VAI PARA A GPU ANTES DE QUALQUER TWEEN. Sem esperar, o primeiro
       frame da transição mistura com uma textura vazia e o quadro pisca preto —
       e trocar de nome rápido resolve fora de ordem, daí a trava do `meu`. */
    void v.preparar(src, lado.current as 1 | -1).then(() => {
      if (ultimoSrc.current === meu && aberto.current) return;
      ultimoSrc.current = meu;

      const passar = { p: 0 };
      const dissolve = () =>
        gsap.to(passar, {
          p: 1,
          duration: reduzido ? 0 : 1.05,
          ease: "power2.inOut",
          overwrite: "auto",
          onUpdate: () => v.progresso(passar.p),
          onComplete: () => v.concluir(),
        });

      /* TROCA — a moldura não se mexe: o fluido acontece INTEIRO por dentro. */
      if (aberto.current) {
        dissolve();
        return;
      }

      /* ABERTURA — a máscara sobe, e o fluido corre junto: a primeira arte
         entra pela mesma frente de onda que as seguintes, para não haver dois
         vocabulários de entrada. */
      aberto.current = true;
      if (reduzido) {
        gsap.set(el, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        v.progresso(1);
        v.concluir();
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "expo.out", overwrite: "auto" },
      );
      dissolve();
    });
  }, [sob]);
  const recentes = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano).slice(0, 2);
  /* a fita é duplicada no markup e o −50% do keyframe fecha o loop sem emenda */
  const fita = [...WORK, ...WORK];

  return (
    <Prancha n="01" nome="Index" superficie="papel" status="Available for projects">
      {/* ⚠ UMA TELA SÓ, e é isso que a `h-full` + `min-h-0` garantem: a trama
          ocupa o que sobra depois do cabeçalho, da ficha e do rodapé, e as três
          fitas dividem esse resto em `1fr` cada. Sem isso a página cresce e
          reaparece o scroll de documento que ele cortou. */}
      <section className="flex h-full min-h-0 flex-col justify-between pt-6">
        {/* a trama — o nome de cada marca, em corpo de cartaz, atravessando a
            tela. Três fitas em sentidos alternados: a segunda começa pelo fim da
            coleção para que duas linhas nunca mostrem o mesmo projeto lado a
            lado. O campo inteiro é o alvo do hover (`p-trama-campo`): pousar
            numa linha para as três e atenua tudo que não está sob o cursor. */}
        <div ref={campo} className="p-trama-campo grid min-h-0 flex-1 gap-[var(--p-trama-gap)] pb-[7vh]">
          {[fita, [...fita].reverse(), [...WORK.slice(3), ...WORK.slice(0, 3), ...WORK.slice(3), ...WORK.slice(0, 3)]].map((linha, li) => (
            <div key={li} data-linha={li} className="p-trama p-trama--peca -mx-[var(--p-margem)]">
              {/* o wrapper recebe o empurrão do SCROLL (transform escrito pelo
                  ticker); a fita de dentro segue no loop próprio. Ímpares vão
                  para o outro lado. Duas camadas porque com uma só seria preciso
                  escolher entre "vive parada" e "reage ao scroll" — e ele quer
                  as duas. */}
              <div className={`p-trama-scroll ${li % 2 === 1 ? "p-trama-scroll--volta" : ""}`}>
                <div
                  className={`p-trama-fita ${li === 1 ? "p-trama-fita--volta" : ""} ${li === 2 ? "p-trama-fita--terca" : ""}`}
                >
                  {linha.map((w, k) => (
                    <span key={`${w.slug}-${k}`} className="flex items-baseline gap-[0.32em]">
                      <Link
                        to={`/v2/work/${w.slug}`}
                        data-peca={w.slug}
                        onFocus={() => setSob(w)}
                        onBlur={() => setSob(null)}
                        className="p-trama-nome"
                        aria-label={`Open ${w.title}`}
                      >
                        {w.title}
                      </Link>
                      <span className="p-trama-ponto">·</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* o mesmo conteúdo, legível para leitor de tela e busca */}
        <h1 className="sr-only">
          Mateus Bredoff — brand designer and art director. Selected work:{" "}
          {WORK.map((w) => w.title).join(", ")}.
        </h1>

        {/* a base: quem é, o índice, e a prova — em corpo de ficha, na MESMA
            tela. Uma tentativa de pôr isto numa segunda tela deu percurso de
            scroll, e ele cortou: "tudo no viewport". */}
        <div
          className="grid grid-cols-12 pt-12 max-md:pt-8"
          style={{ columnGap: "var(--p-gap-x)", rowGap: "var(--p-gap-y)" }}
        >
          <p className="p-corpo col-span-4 max-w-[42ch] max-lg:col-span-12">
            Brand designer and art director, based in Brazil, working worldwide.
            Every identity starts from strategy and lands as a visual system
            built to last.
          </p>

          {/* ⚠ TRÊS COLUNAS, NÃO QUATRO. Com `col-span-4` o ano desta lista terminava
              encostado no Recognition e lia como se fosse a data DELE — a coluna 9
              fica vazia de propósito, é a calha que separa duas listas que têm ano. */}
          <div className="col-span-3 col-start-6 max-lg:col-span-6 max-lg:col-start-1 max-md:col-span-12" data-atenua>
            <p className="p-rotulo pb-3">
              Selected work — {String(WORK.length).padStart(2, "0")}
            </p>
            <ul className="grid gap-[6px]">
              {WORK.slice(0, 5).map((w, i) => (
                <li key={w.slug}>
                  <Link
                    data-alvo
                    to={`/v2/work/${w.slug}`}
                    className="p-corpo grid grid-cols-[2.2rem_1fr_auto] items-baseline gap-3"
                  >
                    <span style={{ color: "var(--p-quieto)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{w.title}</span>
                    <span style={{ color: "var(--p-quieto)" }}>{w.year}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/v2/work" className="p-corpo p-link" style={{ color: "var(--p-quieto)" }}>
                  All work →
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-3 col-start-10 grid gap-8 max-lg:col-span-6 max-lg:col-start-7 max-md:col-span-12 max-md:col-start-1">
            <Bloco rotulo="Recognition">
              <ul className="grid gap-[6px]">
                {recentes.map((r) => (
                  <li key={`${r.veiculo}-${r.projeto}`} className="p-corpo">
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="p-link">
                        {r.veiculo}
                      </a>
                    ) : (
                      r.veiculo
                    )}
                    <span style={{ color: "var(--p-quieto)" }}>
                      {" "}
                      — {r.projeto}, {r.ano}
                    </span>
                  </li>
                ))}
              </ul>
            </Bloco>

            <Bloco rotulo="Contact">
              <a href="mailto:hello@mateusbredoff.com" className="p-corpo p-link">
                hello@mateusbredoff.com
              </a>
            </Bloco>
          </div>
        </div>
      </section>

      {/* O VISOR — a peça, já que ela saiu de dentro da letra.
          ⚠ ELE É O CURSOR: *"o que eu quis dizer era pra que o mouse no hover
          virasse o projeto"*. O ponteiro some (`cursor: none` no nome) e a peça
          ocupa o lugar dele, centrada no ponto exato — sem offset, que é o que
          fazia parecer tooltip.
          16:9 para todas: com a proporção nativa de cada capa (1400×1097,
          3840×2804, 1400×1663…) o visor mudava de formato a cada nome. */}
      <div ref={anel} className="p-visor-anel" aria-hidden="true">
        <div ref={visor} className="p-visor">
          {/* ⚠ O QUADRO É UM CANVAS, não duas <img>: a troca fluida precisa das
              duas artes na MESMA superfície para o shader misturar uma na outra.
              O renderer é montado uma vez (ver o efeito acima) e sobrevive a
              todas as trocas — criar contexto WebGL a cada hover custaria caro. */}
          <div ref={quadro} className="p-visor-quadro" />
        </div>
      </div>
    </Prancha>
  );
}
