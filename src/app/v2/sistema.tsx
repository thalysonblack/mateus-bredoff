import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import "../../styles/v2.css";

/**
 * V2 — "O ESPÉCIME". As primitivas que toda rota desta direção compartilha.
 *
 * Leia o cabeçalho de `styles/v2.css` para o partido — e principalmente para a
 * correção que o definiu: **"vc ta copiando, nao, apenas conceito"**. A régua de
 * artboard, a cruz de registro e o numeral gigante saíram daqui por isso; eram
 * a assinatura da referência, não o princípio dela.
 *
 *   <Folha n="01" nome="Index" superficie="papel">…</Folha>
 *
 * Sobrou o que é conceito: superfície por ROTA, cabeçalho e rodapé de metadado
 * vivo, e o bloco de ficha. Página nova usa estas primitivas.
 */

/* as folhas do acervo, na ordem — a nav é isto, e o número de cada rota
   também sai daqui: uma lista, não dois lugares para editar */
export const PRANCHAS = [
  { n: "01", nome: "Index", to: "/v2" },
  { n: "02", nome: "Work", to: "/v2/work" },
  { n: "03", nome: "About", to: "/v2/about" },
  { n: "04", nome: "Lab", to: "/v2/lab" },
] as const;

/** hora dele, viva — o mesmo fato que o corentin põe na base ("05:16 (UTC+1)") */
export function useHora(tz = "America/Sao_Paulo") {
  const [hora, setHora] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const tick = () => setHora(f.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, [tz]);
  return hora;
}

/** navegação: as pranchas separadas por vírgula, a atual em tinta cheia */
function Navegacao() {
  const { pathname } = useLocation();
  return (
    <nav className="p-corpo flex flex-wrap items-baseline gap-x-1">
      {PRANCHAS.map((p, i) => {
        const atual = pathname === p.to || (p.to !== "/v2" && pathname.startsWith(p.to));
        return (
          <span key={p.to}>
            <Link
              to={p.to}
              className="p-link"
              style={{ color: atual ? "inherit" : "var(--p-quieto)" }}
            >
              {p.nome}
            </Link>
            {i < PRANCHAS.length - 1 ? (
              <span style={{ color: "var(--p-quieto)" }}>,</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * A PRANCHA — o shell de uma rota.
 *
 * `superficie` é o que dá o ritmo entre ROTAS (em vez de alternar fundo dentro
 * de uma página): index em papel, work em branco, about em papel, lab em tinta.
 * O contraste do revelatio, distribuído no lugar onde ele não vira zebra.
 */
export function Prancha({
  n,
  nome,
  superficie = "papel",
  status,
  children,
}: {
  n: string;
  nome: string;
  superficie?: "papel" | "branco" | "tinta";
  status?: string;
  children: ReactNode;
}) {
  const hora = useHora();
  return (
    <div
      className={`p-${superficie} p-tela relative min-h-svh`}
      style={{
        ["--p-acento" as string]: superficie === "tinta" ? "#ec7a47" : "#a53a0b",
      }}
    >
      <div
        className="flex min-h-svh flex-col"
        style={{ paddingInline: "var(--p-margem)", paddingBlock: "var(--p-margem)" }}
      >
        {/* cabeçalho da prancha: nome do arquivo à esquerda, navegação no
            centro, status à direita — a linha de topo do corentin */}
        <header className="flex items-baseline justify-between gap-6 max-md:flex-col max-md:gap-2">
          <Link to="/v2" className="p-corpo p-link">
            Mateus Bredoff
          </Link>
          <Navegacao />
          <p className="p-corpo flex items-center gap-2" style={{ color: "var(--p-quieto)" }}>
            {status ? (
              <>
                <i
                  aria-hidden="true"
                  className="inline-block h-[7px] w-[7px]"
                  style={{ background: "var(--p-acento)" }}
                />
                {status}
              </>
            ) : null}
          </p>
        </header>

        <main className="flex-1">{children}</main>

        {/* rodapé da prancha: os três metadados que o corentin ancora na base —
            onde ele está, que horas são lá, e o ano do arquivo */}
        <footer className="p-marca flex items-baseline justify-between gap-6 pt-10">
          <span>Brazil</span>
          <span>
            {hora} <span style={{ opacity: 0.6 }}>(UTC−3)</span>
          </span>
          <span>
            {n} / {nome.toUpperCase()}
          </span>
        </footer>
      </div>
    </div>
  );
}

/**
 * Bloco de ficha: rótulo mono minúsculo em cima, conteúdo embaixo.
 * É a unidade de composição da direção — BIOGRAPHY, DISTINCTIONS, CONTACT no
 * corentin são todos o mesmo bloco, e é a repetição dele que faz a coluna ler
 * como documento em vez de lista solta.
 */
export function Bloco({
  rotulo,
  children,
  className = "",
}: {
  rotulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <p className="p-rotulo pb-3">{rotulo}</p>
      {children}
    </section>
  );
}
