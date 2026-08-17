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
/* ⚠ AS ROTAS SÃO AS CANÔNICAS desde a promoção de 17/08 — `/`, `/work`,
   `/about`, `/lab`, as mesmas do CMS dele. Não voltar para `/v2/*`: o `/v2`
   segue existindo só como material de estúdio. */
export const PRANCHAS = [
  { n: "01", nome: "Index", to: "/" },
  { n: "02", nome: "Work", to: "/work" },
  { n: "03", nome: "About", to: "/about" },
  { n: "04", nome: "Lab", to: "/lab" },
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
        const atual = pathname === p.to || (p.to !== "/" && pathname.startsWith(p.to));
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
  tela = false,
  children,
}: {
  n: string;
  nome: string;
  superficie?: "papel" | "branco" | "tinta";
  status?: string;
  /**
   * ⚠ A rota CABE NA TELA e não rola (index e work). Sem isto o wrapper usa
   * `min-h-svh`, que é altura MÍNIMA e não define altura — então nenhum
   * `min-h-0` ou `overflow: hidden` abaixo consegue cortar, e um conteúdo alto
   * (a coluna de 24 peças da /work) estica o documento para 8560px numa tela de
   * 963. Rota de tela usa `h-svh` + `overflow-hidden`.
   */
  tela?: boolean;
  children: ReactNode;
}) {
  const hora = useHora();
  return (
    <div
      /* ⚠ o acento não vem mais daqui: cada superfície declara o SEU par (azul
         e marrom dele) em `v2.css`, porque a mesma cor não serve aos dois
         fundos ([[craft-token-de-cor-nao-serve-aos-dois-fundos]]) */
      className={`p-${superficie} p-tela relative ${tela ? "h-svh overflow-hidden" : "min-h-svh"}`}
    >
      <div
        className={`flex flex-col ${tela ? "h-full" : "min-h-svh"}`}
        style={{ paddingInline: "var(--p-margem)", paddingBlock: "var(--p-margem-y)" }}
      >
        {/* Cabeçalho da prancha: nome do arquivo, navegação, status.
            ⚠ NA MESMA GRADE DE 12 DO CONTEÚDO, e não em `justify-between`: a nav
            caía a ~30px da coluna onde começa a ficha, e ele marcou o
            desalinhamento com uma linha vertical na tela. Numa prancha, uma
            coluna que não fecha do topo à base entrega a página inteira. */}
        <header
          className="grid grid-cols-12 items-baseline max-md:flex max-md:flex-col max-md:gap-2"
          style={{ columnGap: "var(--p-gap-x)" }}
        >
          <Link to="/v2" className="p-corpo p-link col-span-4">
            Mateus Bredoff
          </Link>
          <div className="col-span-4 col-start-6 max-md:col-span-12">
            <Navegacao />
          </div>
          <p
            className="p-corpo col-span-3 col-start-10 flex items-center justify-end gap-2"
            style={{ color: "var(--p-quieto)" }}
          >
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

        {/* ⚠ `flex flex-col` no main, e não só `flex-1`: o wrapper da prancha
            usa `min-h-svh` (min-height), e `height: 100%` de um filho não
            resolve contra altura MÍNIMA. Sem isto, a rota que pedia `h-full`
            ficava do tamanho do conteúdo e a sobra vertical caía toda entre ela
            e o rodapé — medido, 140px de nada na home. */}
        {/* ⚠ `min-h-0` JUNTO com `flex-1`, e em CADA elo da cadeia: sem ele o
            item flex tem `min-height: auto` e cresce com o conteúdo, de modo que
            um `overflow: hidden` mais abaixo não corta nada. Na /work isso
            esticou o documento para 8560px numa tela de 963 — a coluna de peças
            empurrou a página inteira e o gesto virou scroll de documento. */}
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>

        {/* rodapé da prancha: os três metadados que o corentin ancora na base —
            onde ele está, que horas são lá, e o ano do arquivo */}
        {/* rodapé: os três metadados que o corentin ancora na base — onde ele
            está, que horas são lá, e o ano do arquivo. Mesma grade do
            cabeçalho, pela mesma razão. */}
        <footer
          className="p-marca grid grid-cols-12 items-baseline pt-5"
          style={{ columnGap: "var(--p-gap-x)" }}
        >
          <span className="col-span-4">Brazil</span>
          <span className="col-span-4 col-start-6">
            {hora} <span style={{ opacity: 0.6 }}>(UTC−3)</span>
          </span>
          <span className="col-span-3 col-start-10 text-right">
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
