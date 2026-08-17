import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { corDe } from "../../content/cores";
import { useMetaRota } from "../../hooks/useMetaRota";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { Prancha } from "./sistema";

/**
 * FOLHA 02 — WORK. O índice UTILITÁRIO.
 *
 * ⭐ A decisão vem de um achado do artemshcherban: ele mantém **dois índices
 * para o mesmo acervo** — `/selected`, que é espetáculo (carrossel 3D, uma tela,
 * não rola), e `/portfolio`, que é lista tipográfica chapada, sem uma imagem
 * sequer. Um para encantar, outro para achar.
 *
 * Aqui a divisão é a mesma: a home é a folha de espécimes (o nome de cada marca
 * em corpo de cartaz) e esta rota é a TABELA — todos os nove projetos, com
 * índice, disciplina e ano, na altura de linha em que se varre uma lista com o
 * olho. Quem chegou para admirar fica na home; quem chegou para procurar vem
 * para cá.
 *
 * A grade da linha (índice · título · disciplina · ano) é a mesma proporção
 * medida no archive do corentin — `.5fr 1.5fr 1fr .5fr` —, que é a distribuição
 * que faz o título mandar sem espremer o metadado.
 *
 * ## O CARROSSEL VERTICAL (17/08)
 *
 * A prévia deixou de ser uma imagem que troca no hover e virou uma COLUNA que
 * rola: o scroll move a pilha de peças na janela à esquerda, e a tabela
 * acompanha — a linha da peça enquadrada acende, as outras apagam. Referência
 * dele: `framer-assets-five.vercel.app/archive`, do próprio acervo dele.
 *
 * ⚠ E aqui vai ALÉM da referência de propósito: lá a coluna é `clamped`
 * (`Math.min(scroll, totalScroll)` no código, e medido no site: trava em 08/08
 * e não volta). Aqui ela é INFINITA, como a trama da home — o mesmo empurrão
 * dobrado pelo comprimento de um ciclo. Duas mecânicas diferentes de rolagem no
 * mesmo site seriam dois sistemas; uma só, repetida em escalas diferentes, é um.
 *
 * A página não rola: o gesto é todo da coluna, como na home.
 */
export default function WorkV2() {
  useMetaRota();
  const [ativo, setAtivo] = useState(0);
  const peca = WORK[ativo];
  const janela = useRef<HTMLDivElement | null>(null);
  const pilha = useRef<HTMLDivElement | null>(null);
  /* posição em UNIDADES DE ITEM: 2,4 = entre o terceiro e o quarto */
  const pos = useRef(0);
  const alvo = useRef(0);

  /**
   * O SCROLL MOVE A COLUNA, e ela não acaba.
   *
   * Mesma mecânica da trama da home: `wheel` alimenta um alvo, o ticker do GSAP
   * persegue com lerp, e o deslocamento é dobrado pelo comprimento de um ciclo.
   * ⚠ `((x % L) + L) % L` porque o `%` do JS devolve negativo para entrada
   * negativa, e o salto de −L para 0 apareceria.
   * ⚠ TRÊS CÓPIAS no markup: a janela mostra mais de um item por vez, então uma
   * só cópia deixaria buraco na virada do ciclo.
   */
  useEffect(() => {
    const caixa = janela.current;
    const trilha = pilha.current;
    if (!caixa || !trilha) return;
    if (prefersReducedMotion()) return;

    /* ⚠ `offsetHeight`, não `getBoundingClientRect()`: o ticker escreve `scale`
       nas peças, e o rect devolveria a altura JÁ ESCALADA — a medida do passo
       ficaria oscilando com a própria animação. */
    const medidas = () => {
      const primeiro = trilha.firstElementChild as HTMLElement | null;
      if (!primeiro) return { h: 1, H: 1 };
      const h = primeiro.offsetHeight;
      const gap = parseFloat(getComputedStyle(trilha).rowGap || "0") || 0;
      return { h, H: h + gap };
    };

    const roda = (e: WheelEvent) => {
      alvo.current += e.deltaY / 420;
    };

    const passo = () => {
      pos.current += (alvo.current - pos.current) * 0.1;
      if (Math.abs(alvo.current - pos.current) < 0.0005) pos.current = alvo.current;

      const { h, H } = medidas();
      const n = WORK.length;
      /* índice fracionário DENTRO do ciclo, sempre na cópia do meio: é o que
         faz a coluna não ter começo nem fim */
      const dentroDoCiclo = ((pos.current % n) + n) % n;
      const idx = dentroDoCiclo + n;

      /* ⚠ A TRILHA É ANCORADA EM `top: 50%` e o transform traz o item ativo
         para o centro da janela. Uma versão anterior usava `align-items:
         center` no visor E somava o deslocamento por cima — a trilha já vinha
         centrada, os dois se somavam e a coluna saía inteira da janela. Um
         dono de posição só. */
      trilha.style.transform = `translate3d(0, ${-(idx * H + h / 2)}px, 0)`;

      /* ⭐ ESCALA E OPACIDADE POR PROXIMIDADE — medido no código da referência:
         `proximity = 1 - min(|dist| / 0.6, 1)`, escala 1,00 → 0,95 e opacidade
         1,00 → 0,35. A queda de OPACIDADE é o que faz uma peça mandar e as
         outras assistirem; sem ela a coluna é só uma pilha rolando, que foi o
         "não tá igual". */
      const pecas = trilha.children;
      for (let k = 0; k < pecas.length; k++) {
        const e = pecas[k] as HTMLElement;
        const dist = Math.abs(k - idx);
        if (dist > 3.2) {
          e.style.visibility = "hidden";
          continue;
        }
        const prox = 1 - Math.min(dist / 0.6, 1);
        e.style.visibility = "visible";
        e.style.transform = `scale(${(0.95 + 0.05 * prox).toFixed(4)})`;
        e.style.opacity = (0.35 + 0.65 * prox).toFixed(3);
      }

      const i = Math.round(dentroDoCiclo) % n;
      setAtivo((antes) => (antes === i ? antes : i));
    };
    caixa.addEventListener("wheel", roda, { passive: true });
    window.addEventListener("wheel", roda, { passive: true });
    gsap.ticker.add(passo);
    return () => {
      caixa.removeEventListener("wheel", roda);
      window.removeEventListener("wheel", roda);
      gsap.ticker.remove(passo);
    };
  }, []);

  /* percorrer a tabela leva a coluna até a peça — pelo caminho MAIS CURTO, que
     numa lista circular nem sempre é a diferença bruta de índices */
  const irPara = (i: number) => {
    const n = WORK.length;
    const atual = alvo.current;
    const resto = ((atual % n) + n) % n;
    let delta = i - resto;
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    alvo.current = atual + delta;
  };

  /* três cópias: a janela mostra mais de um item por vez */
  const trilha = [0, 1, 2].flatMap(() => WORK);

  return (
    <Prancha n="02" nome="Work" superficie="branco" tela status={`${WORK.length} projects`}>
      {/* ⚠ A ROTA CABE NA TELA e não rola — igual à referência
          (`.archive-page` é `fixed inset:0; overflow:hidden`) e igual à home
          deste site. O gesto é todo da coluna. */}
      <section className="p-arquivo">
        {/* ─ a tabela, À ESQUERDA ────────────────────────────────────────
            Medido na referência: 48% da largura, com fio vertical separando.
            (Aqui ela já esteve à direita, com a peça à esquerda — ele apontou
            a referência e disse "não tá igual".) */}
        <div className="p-arquivo-lista">
          <div
            className="p-rotulo grid pb-3"
            style={{ gridTemplateColumns: ".5fr 1.5fr 1fr .5fr", columnGap: "var(--p-gap-x)" }}
          >
            <span>Nº</span>
            <span>Project</span>
            <span className="max-md:hidden">Discipline</span>
            <span className="text-right">Year</span>
          </div>

          <ul className="p-tabela">
            {WORK.map((w, i) => (
              <li key={w.slug} className="p-fio">
                <Link
                  to={`/work/${w.slug}`}
                  onMouseEnter={() => irPara(i)}
                  onFocus={() => irPara(i)}
                  aria-current={ativo === i ? "true" : undefined}
                  className={`p-corpo p-tabela-linha grid items-baseline py-4 ${ativo === i ? "aceso" : ""}`}
                  style={{
                    gridTemplateColumns: ".5fr 1.5fr 1fr .5fr",
                    columnGap: "var(--p-gap-x)",
                    ["--cor" as string]: corDe(w.slug),
                  }}
                >
                  <span className="p-tabela-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="p-item">{w.title}</span>
                  <span className="p-tabela-meta max-md:hidden">{w.disciplines.join(", ")}</span>
                  <span className="p-tabela-meta text-right">{w.year}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="p-marca pt-6">
            Complete index — {String(WORK.length).padStart(2, "0")} projects, 2025–2026
          </p>
        </div>

        {/* ─ a coluna, À DIREITA, com a peça ativa CENTRADA ───────────────
            Medido na referência: escala 1,00 no centro caindo para 0,95, e
            opacidade 1,00 caindo para 0,35 — a queda de opacidade é o que faz
            uma peça mandar e as outras assistirem. Espaçamento quase zero
            (card 1,80, passo 1,81), então as peças quase se encostam. */}
        <div ref={janela} className="p-arquivo-visor">
          <div ref={pilha} className="p-arquivo-trilha">
            {trilha.map((w, k) => (
              <span key={k} className="p-arquivo-peca" data-k={k}>
                <img
                  src={w.cover.src}
                  srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
                  sizes="42vw"
                  alt={w.cover.alt}
                  decoding="async"
                  draggable={false}
                />
              </span>
            ))}
          </div>
          <p className="p-marca p-arquivo-ficha">
            <span>FIG. {String(ativo + 1).padStart(2, "0")}</span>
            <span>
              {peca.title} — {peca.year}
            </span>
          </p>
        </div>
      </section>
    </Prancha>
  );
}
