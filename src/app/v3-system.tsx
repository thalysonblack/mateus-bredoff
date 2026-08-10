import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router";
import { WORK } from "../content/work";
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
export function Hud() {
  return (
    <div className="v3-hud" aria-hidden="true">
      <i className="c tl" /> <i className="c tr" /> <i className="c bl" /> <i className="c br" />
      <i className="t l" /> <i className="t r" /> <i className="t m" />
    </div>
  );
}

/* ── nav fixa em grupos, blend-difference sobre o que passar por baixo ────
   Os destinos são as páginas da PRÓPRIA V3 — a direção é um site completo,
   não uma home apontando pra páginas de outra direção. */
export function NavV3() {
  const grupos: { rotulo: string; extra?: string; to: string }[] = [
    { rotulo: "Work", extra: `[${String(WORK.length).padStart(2, "0")}]`, to: "/v3/work" },
    { rotulo: "About", to: "/v3/about" },
    { rotulo: "Services", to: "/v3#services" },
    { rotulo: "Contact", to: "/v3#contact" },
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
        <Link to="/v3" className="v3-rotulo">
          Mateus Bredoff
        </Link>
        {/* grupos de DOIS itens empilhados, distribuídos pela largura — a
            anatomia da referência (colunas espalhadas, não fila à direita) */}
        <div className="flex w-[54%] justify-between max-md:w-auto max-md:flex-col max-md:gap-1">
          {[grupos.slice(0, 2), grupos.slice(2)].map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map((g) => (
                <Link key={g.rotulo} to={g.to} className="v3-rotulo v3-q">
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
    <div
      className="flex items-baseline justify-between pb-10"
      style={{ paddingInline: "var(--v3-margem)" }}
    >
      <span className="v3-rotulo v3-q">
        {rotulo}
        {extra ? <span className="pl-2 opacity-60">{extra}</span> : null}
      </span>
      {acao ? (
        <Link to={acao.to} className="v3-rotulo underline-offset-4 hover:underline">
          {acao.texto} ↳
        </Link>
      ) : null}
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

        <nav className="col-span-3 col-start-6 max-lg:col-span-6 max-lg:col-start-1 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Pages]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            <li><Link to="/v3" className="hover:underline">Home</Link></li>
            <li><Link to="/v3/work" className="hover:underline">Work</Link></li>
            <li><Link to="/v3/about" className="hover:underline">About</Link></li>
          </ul>
        </nav>

        <div className="col-span-3 col-start-10 max-lg:col-span-6 max-lg:pt-8">
          <p className="v3-rotulo" style={{ color: "var(--v3-quieto)" }}>
            [Contact]
          </p>
          <ul className="v3-rotulo grid gap-2 pt-5">
            {CONTATO.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    className="hover:underline"
                    {...(c.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    ↳ {c.valor}
                  </a>
                ) : (
                  <span style={{ color: "var(--v3-quieto)" }}>{c.valor}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
