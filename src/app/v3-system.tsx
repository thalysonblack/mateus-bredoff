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

/* ── rodapé em caixa, rótulos em [colchetes], só link real ──────────────── */
export function RodapeV3() {
  return (
    <footer
      id="contact"
      className="py-10 max-md:py-6"
      style={{ background: "var(--fr-papel)", color: "var(--fr-petroleo)", paddingInline: "var(--v3-margem)" }}
    >
      <div className="grid grid-cols-12 gap-6 border border-black/20 p-8 max-md:p-5">
        <div className="col-span-4 flex flex-col justify-between border-r border-black/20 pr-8 max-lg:col-span-12 max-lg:border-r-0 max-lg:pr-0">
          <p
            className="uppercase"
            style={{
              fontFamily: "'Geist', ui-sans-serif, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(24px, 2.2vw, 36px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Mateus Bredoff
          </p>
          <p className="v3-rotulo pt-10" style={{ color: "var(--v3-quieto)" }}>
            Brand Designer © 2026
          </p>
        </div>

        {/* quatro colunas de rótulo em colchete — a anatomia do rodapé da
            referência ([experience]/[company]/[support]/[contact]/[follow]) */}
        <nav className="col-span-2 col-start-5 max-lg:col-span-6 max-lg:col-start-1 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Pages]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/work" className="hover:underline">Work</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/lab" className="hover:underline">Lab</Link></li>
            <li><Link to="/v3#services" className="hover:underline">Services</Link></li>
          </ul>
        </nav>

        <nav className="col-span-2 col-start-7 max-lg:col-span-6 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Work]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            {WORK.slice(0, 4).map((w) => (
              <li key={w.slug}>
                <Link to={`/work/${w.slug}`} className="hover:underline">
                  {w.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/work" className="hover:underline" style={{ color: "var(--v3-quieto)" }}>
                All work ↳
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-span-2 col-start-9 max-lg:col-span-6 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Contact]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            <li>
              <a href="mailto:hello@mateusbredoff.com" className="hover:underline">
                <span className="v3-seta">↳</span> hello@mateusbredoff.com
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-2 col-start-11 max-lg:col-span-6 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Follow]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            {CONTATO.filter((c) => c.label !== "Email").map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <span className="v3-seta">↳</span> {c.label}
                  </a>
                ) : (
                  <span style={{ color: "var(--v3-quieto)" }}>{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── a BARRA VIVA da base ────────────────────────────────────────────
          Gesto tirado do nightjar.co, que ele apontou: o rodapé de lá não é um
          mapa do site, é uma barra com o relógio da cidade (`SYD 05:54:25`) e a
          última conquista rolando (`ALNF WINS GOLD AT GOOD DESIGN AWARDS
          2025`). O rodapé vira o lugar onde o estúdio está VIVO, não onde o
          site se repete.

          A caixa de quatro colunas acima continua — ela é navegação real e o
          sistema é de visor, não de página em branco. O que entra é a linha
          embaixo, com os dois fatos que este site já apura: a hora dele e o
          reconhecimento mais recente, lido de `content/reconhecimento.ts`. Fato
          que já existe na página, num lugar onde ninguém precisa procurar. */}
      <BarraViva />
    </footer>
  );
}

function BarraViva() {
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

  /* o mais recente da lista — se um reconhecimento novo entrar, aparece aqui
     sem ninguém editar duas coisas */
  const ultimo = [...RECONHECIMENTO].sort((a, b) => b.ano - a.ano)[0];

  return (
    <div
      className="mt-8 flex items-center justify-between gap-6 border-t border-black/12 pt-5 max-md:flex-col max-md:items-start max-md:gap-2"
    >
      <span className="v3-micro tabular-nums" style={{ color: "var(--v3-quieto)" }}>
        BRA {hora}
      </span>
      {ultimo ? (
        <span className="v3-micro text-right max-md:text-left" style={{ color: "var(--v3-quieto)" }}>
          <span style={{ color: "var(--v3-acento)" }}>■</span>{" "}
          {ultimo.projeto} featured on {ultimo.veiculo} — {ultimo.ano}
        </span>
      ) : null}
    </div>
  );
}
