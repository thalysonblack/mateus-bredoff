import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../content/work";
import { LAB_CONTADOR } from "../content/lab";
import { RECONHECIMENTO } from "../content/reconhecimento";
import { revealLines } from "../animations/reveal";
import "../styles/v3.css";

/**
 * Sistema da direção V3 — "o portfólio como visor".
 *
 * As primitivas que TODA página da V3 compartilha: o HUD de crop marks, a nav
 * em grupos com ■, a linha que abre seção, o display com reveal e o rodapé em
 * caixa. Nasceram dentro de `pages/HomeV3.tsx` e saíram de lá quando a direção
 * virou o site inteiro — página nova usa estas primitivas, não recria a
 * aparência delas na mão (mesma regra do `system.tsx` da direção editorial).
 *
 * Mecânica do noartmusic.com; matéria toda do Mateus. Ver o cabeçalho de
 * `styles/v3.css` para as regras de contraste que já foram medidas.
 */

/* contatos REAIS — os mesmos do rodapé da réplica. X.com segue sem destino no
   material do cliente → rótulo honesto, sem href que mente. */
export const CONTATO: { label: string; valor: string; href: string | null }[] = [
  { label: "Email", valor: "hello@mateusbredoff.com", href: "mailto:hello@mateusbredoff.com" },
  { label: "Behance", valor: "behance.net/mateusbredoff", href: "https://www.behance.net/mateusbredoff" },
  { label: "Instagram", valor: "@sir.bredoff", href: "https://www.instagram.com/sir.bredoff" },
  { label: "X.com", valor: "@mateusbredoff", href: null },
];

export const idx = (i: number) => `[${String(i + 1).padStart(2, "0")}]`;

/* display com o reveal-assinatura do projeto (máscara de linha) */
export function Display({
  children,
  className = "",
  immediate = false,
  as: Tag = "h2",
}: {
  children: string;
  className?: string;
  immediate?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    let h: { kill: () => void } | null = null;
    revealLines(ref.current, { immediate }).then((x) => (h = x));
    return () => h?.kill();
  }, [immediate]);
  return (
    <Tag ref={ref as never} className={`v3-display v3-justif ${className}`}>
      {children}
    </Tag>
  );
}

/* ── HUD: a página inteira dentro do visor ──────────────────────────────── */
/**
 * O HUD do visor. Além das marcas de canto, ele agora LÊ a página: o rótulo
 * central diz qual seção está enquadrada e a régua da base mede o quanto já
 * passou. Os dois são preenchidos por `animations/craft.ts` via `data-visor` e
 * `data-regua` — este componente só oferece os lugares, e uma página sem o
 * craft ligado simplesmente mostra o HUD mudo, como antes.
 */
export function Hud() {
  return (
    <div className="v3-hud" aria-hidden="true">
      <i className="c tl" /> <i className="c tr" /> <i className="c bl" /> <i className="c br" />
      <i className="t l" /> <i className="t r" /> <i className="t m" />
      <span className="v3-visor v3-micro" data-visor />
      <i className="v3-regua" data-regua />
    </div>
  );
}

/* ── nav fixa em grupos, blend-difference sobre o que passar por baixo ────
   Os destinos são as páginas da PRÓPRIA V3 — a direção é um site completo,
   não uma home apontando pra páginas de outra direção. */
export function NavV3() {
  const grupos: { rotulo: string; extra?: string; to: string }[] = [
    { rotulo: "Work", extra: `[${String(WORK.length).padStart(2, "0")}]`, to: "/work" },
    { rotulo: "About", to: "/about" },
    { rotulo: "Lab", extra: `[${LAB_CONTADOR}]`, to: "/lab" },
    { rotulo: "Services", to: "/#services" },
    { rotulo: "Contact", to: "/#contact" },
  ];
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 text-white"
      style={{ mixBlendMode: "difference" }}
    >
      <nav
        className="flex items-start justify-between gap-4 py-4"
        style={{ paddingInline: "var(--v3-margem)" }}
      >
        <Link to="/" className="v3-rotulo">
          Mateus Bredoff
        </Link>
        {/* grupos de DOIS itens empilhados, distribuídos pela largura — a
            anatomia da referência (colunas espalhadas, não fila à direita) */}
        <div className="flex w-[62%] justify-between max-md:w-auto max-md:flex-col max-md:gap-1">
          {[grupos.slice(0, 2), grupos.slice(2, 4), grupos.slice(4)].map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map((g) => (
                <Link key={g.rotulo} to={g.to} className="v3-rotulo v3-qh">
                  {g.rotulo}
                  {g.extra ? <span className="pl-2 opacity-60">{g.extra}</span> : null}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}

/* marcas de canto POR SEÇÃO — a referência pontua cada módulo com os seus
   próprios cantos, além do HUD do viewport. `claro` para blocos de tinta. */
export function Cantos({ claro = false }: { claro?: boolean }) {
  const cor = claro ? "rgba(237,230,225,0.4)" : "rgba(20,33,38,0.35)";
  const b = "1.5px solid " + cor;
  const base: CSSProperties = { position: "absolute", width: 12, height: 12 };
  return (
    <span aria-hidden="true">
      <i style={{ ...base, top: 10, left: 10, borderTop: b, borderLeft: b }} />
      <i style={{ ...base, top: 10, right: 10, borderTop: b, borderRight: b }} />
      <i style={{ ...base, bottom: 10, left: 10, borderBottom: b, borderLeft: b }} />
      <i style={{ ...base, bottom: 10, right: 10, borderBottom: b, borderRight: b }} />
    </span>
  );
}

/* linha-HUD que abre toda seção: ■ rótulo à esquerda, ação à direita */
export function LinhaSecao({
  rotulo,
  extra,
  acao,
}: {
  rotulo: string;
  extra?: string;
  acao?: { texto: string; to: string };
}) {
  return (
    <div style={{ paddingInline: "var(--v3-margem)" }} className="pb-10">
      <div className="flex items-baseline justify-between">
        <span className="v3-rotulo v3-q">
          {rotulo}
          {extra ? <span className="pl-2 opacity-60">{extra}</span> : null}
        </span>
        {acao ? (
          <Link to={acao.to} className="v3-rotulo underline-offset-4 hover:underline">
            {acao.texto} <span className="v3-seta">↳</span>
          </Link>
        ) : null}
      </div>
      {/* O fio se DESENHA quando a seção chega (ver `animations/craft.ts`). É o
          gesto que abre cada bloco: a régua do visor traçando o enquadramento
          antes do conteúdo. Sem o craft ligado ele fica desenhado e parado, que
          é o estado correto — a linha existe, a animação é o extra. */}
      <i className="v3-fio-secao" data-fio aria-hidden="true" />
    </div>
  );
}

/* ── rodapé: a ANATOMIA do nightjar.co ───────────────────────────────────
   Pedido de 17/08 — "vamos copiar o footer e o recognitions daqui". O rodapé
   anterior era uma CAIXA de 12 colunas com moldura de 1px, quatro títulos em
   [colchetes] e um mapa do site inteiro repetido embaixo dele (Home, Work,
   About, Lab, Services + quatro cases + all work). Ou seja: o lugar onde a
   página termina era o lugar mais cheio dela.

   Medido lá (1600×1000, fatia 14 de `scripts/fatias-wheel.mjs`):

     fio hairline no topo, e nada mais de moldura
     quatro colunas iguais, x = 16 · 412 · 808 · 1204, texto de 12px
     col 1  o que o estúdio é, em três linhas + "Get In Touch"
     col 2  o relógio da cidade, em mono de 10px
     col 3  os canais, um por linha (entrelinha de 20,5px)
     col 4  uma nota institucional
     ~590px de VAZIO
     o wordmark sangrando de borda a borda, cortado pela base da tela

   Duas decisões de tradução, e as duas são de conteúdo, não de forma:
   - **A lista de páginas sai.** A nav deste site é fixa e vive em blend no
     topo de todas as rotas — repetir as mesmas cinco rotas no rodapé é eco.
   - **A barra viva de ontem não morre, ela vira coluna.** O relógio ocupa a
     col 2 (o mesmo lugar do `SYD 07:01:24` de lá) e o reconhecimento mais
     recente fica logo abaixo dele, no mesmo corpo de mono. */
export function RodapeV3() {
  return (
    <footer
      id="contact"
      data-secao="Contact"
      className="relative overflow-clip pt-8"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)" }}
    >
      <div
        className="grid grid-cols-12 gap-6 border-t pt-7 max-md:gap-y-8"
        style={{ paddingInline: "var(--v3-margem)", borderColor: "rgba(20,33,38,0.14)" }}
      >
        <div className="col-span-3 max-lg:col-span-6 max-md:col-span-12">
          <p className="v3-nota max-w-[30ch]">
            Brand designer and art director. Visual identities for companies that
            want a clear, relevant and memorable presence.
          </p>
          <a href="mailto:hello@mateusbredoff.com" className="v3-nota mt-6 inline-block hover:underline">
            Get in touch <span className="v3-seta">↳</span>
          </a>
        </div>

        <div className="col-span-3 max-lg:col-span-6 max-md:col-span-12">
          <Relogio />
        </div>

        <nav className="col-span-3 max-lg:col-span-6 max-md:col-span-12">
          <ul className="v3-nota grid gap-[6px]">
            {/* o e-mail já é o "Get in touch" da coluna 1 — repetir aqui era o
                mesmo endereço duas vezes no mesmo bloco */}
            {CONTATO.filter((c) => c.label !== "Email").map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {c.label}
                  </a>
                ) : (
                  /* link que não leva a lugar nenhum vira texto — a régua do
                     projeto para o X.com, que não tem destino no material */
                  <span style={{ color: "var(--v3-quieto)" }}>{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="v3-nota col-span-3 max-w-[34ch] max-lg:col-span-6 max-md:col-span-12">
          Every project runs remotely, across time zones. The distance never
          reaches the work.
        </p>
      </div>

      {/* ⚠ O NOME SANGRA E É CORTADO PELA BASE — é assim que ele fecha lá, e o
          corte é metade do gesto: o wordmark não "cabe" no rodapé, ele
          atravessa a borda inferior da página.

          `12.6vw` para quatorze caracteres é a conta que enche a largura sem
          `calc` afinado no glifo — a régua deste repo diz que largura/corpo
          embutida estoura no dia em que a webfont não carrega. O
          `margin-bottom` negativo é o corte; o `overflow-clip` do `<footer>` é
          quem executa. */}
      <p className="v3-marca" aria-hidden="true">Mateus Bredoff</p>
      {/* o mesmo texto, legível para leitor de tela e para busca, fora da tela */}
      <span className="sr-only">Mateus Bredoff — Brand Designer, © 2026</span>
    </footer>
  );
}

/** O relógio dele + o reconhecimento mais recente. Os dois fatos que este site
 *  apura sozinho, no corpo de metadado. */
function Relogio() {
  const [hora, setHora] = useState("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const tick = () => setHora(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* o mais recente da lista — reconhecimento novo aparece aqui sem ninguém
     editar duas coisas */
  const ultimo = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano)[0];

  return (
    <>
      <p className="v3-micro tabular-nums" style={{ color: "var(--v3-quieto)" }}>
        BRA {hora}
      </p>
      {ultimo ? (
        <p className="v3-micro mt-4 max-w-[26ch]" style={{ color: "var(--v3-quieto)" }}>
          {ultimo.projeto} featured on {ultimo.veiculo} — {ultimo.ano}
        </p>
      ) : null}
    </>
  );
}
