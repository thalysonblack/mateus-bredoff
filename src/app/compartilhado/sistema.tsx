import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router";
import { CONTATO, EMAIL } from "../../content/contato";
import { getLenis } from "../../lib/lenis";
import "../../styles/base.css";
import "../../styles/v1.css";


/* as folhas do acervo, na ordem — a nav é isto, e o número de cada rota
   também sai daqui: uma lista, não dois lugares para editar */
/* ⚠ AS ROTAS SÃO AS CANÔNICAS desde a promoção de 17/08 — `/`, `/work`,
   `/about`, `/lab`, as mesmas do CMS dele. Não voltar para `/v2/*`: o `/v2`
   segue existindo só como material de estúdio. */
export const PRANCHAS = [
  { n: "01", nome: "Index", to: "/" },
  { n: "02", nome: "Work", to: "/work" },
  { n: "03", nome: "About", to: "/about" },
] as const;

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
  /* ⭐ o print dele (12/09): WORK · ABOUT · CONTACT empilhados à direita, em
     caixa alta, com um ■ ao lado do item ativo. Contact entra como item da
     lista — é um link, não um campo. "No menu adicionar Index" (12/09): a home
     entra como primeiro item, com o mesmo ■ quando é a página atual. */
  const itens = [
    ...PRANCHAS.map((p) => ({ nome: p.nome, to: p.to, href: undefined as string | undefined })),
    { nome: "Contact", to: "", href: `mailto:${EMAIL}` },
  ];
  return (
    <nav className="p-menu-nav" aria-label="Site">
      {itens.map((p) => {
        const atual = !!p.to && (pathname === p.to || pathname.startsWith(p.to + "/"));
        const miolo = (
          <>
            {/* o ■ do ativo, à ESQUERDA do nome ("botar o pixel pro lado esquerdo",
                12/09): o mesmo quadrado que o sistema já usa; some nos outros */}
            <i aria-hidden="true" className="p-menu-ponto" style={{ visibility: atual ? "visible" : "hidden" }} />
            {p.nome}
          </>
        );
        return p.href ? (
          <a key={p.nome} href={p.href} className="p-link">
            {miolo}
          </a>
        ) : (
          <Link key={p.nome} to={p.to} className="p-link" aria-current={atual ? "page" : undefined}>
            {miolo}
          </Link>
        );
      })}
    </nav>
  );
}

/** o menu aberto no celular: nav grande, depois ofício, hora e status */
function MenuPainel({ hora, status, fechar }: { hora: string; status?: string; fechar: () => void }) {
  const painel = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const corpo = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    painel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key !== "Tab" || !painel.current) return;
      const alvos = painel.current.querySelectorAll<HTMLElement>("a, button");
      const [a, z] = [alvos[0], alvos[alvos.length - 1]];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = corpo;
      lenis?.start();
    };
  }, [fechar]);
  const itens = [
    ...PRANCHAS.map((p) => ({ n: p.n, nome: p.nome, to: p.to as string, href: undefined as string | undefined })),
    { n: "04", nome: "Contact", to: "", href: `mailto:${EMAIL}` },
  ];
  return (
    <div ref={painel} id="p-menu-painel" className="p-menu-painel" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="p-menu-painel-topo">
        <Link to="/" onClick={fechar}>Mateus Bredoff</Link>
        <button type="button" className="p-menu-botao" onClick={fechar}>Close</button>
      </div>
      <nav className="p-menu-painel-nav" aria-label="Site">
        {itens.map((p) => {
          const atual = !!p.to && (pathname === p.to || (p.to !== "/" && pathname.startsWith(p.to + "/")));
          const miolo = (<><span className="p-marca">{p.n}</span>{p.nome}</>);
          return p.href ? (
            <a key={p.nome} href={p.href}>{miolo}</a>
          ) : (
            <Link key={p.nome} to={p.to} onClick={fechar} aria-current={atual ? "page" : undefined}>{miolo}</Link>
          );
        })}
      </nav>
      <div className="p-menu-painel-pe">
        <p><span>Brand Designer</span><span>Brazil</span></p>
        <p><span>{hora} BRT</span><span>{new Date().toLocaleDateString("en-GB")}</span></p>
        <p><span>Currently</span><span>{status ?? "Available for work"}</span></p>
      </div>
    </div>
  );
}

export function Prancha({
  n,
  nome,
  superficie = "papel",
  status,
  tela = false,
  rodape = "regua",
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
  /**
   * ⭐ O RODAPÉ COMPLETO — "preciso de um footer maneiro pra outras páginas".
   *
   * Rota de TELA (index, work) fecha com a régua de metadado, que é tudo o que
   * cabe: a página não rola, e um rodapé alto roubaria a altura do conteúdo.
   * Rota que ROLA termina de verdade, e um site que acaba numa linha de 9px
   * termina no vazio — o fim da leitura é o único lugar em que a pessoa que
   * gostou vai procurar como falar com ele.
   */
  rodape?: "regua" | "completo";
  children: ReactNode;
}) {
  const hora = useHora();
  /* menu do celular: topo com nome + "Menu"; a nav, a hora e o status abrem em tela cheia */
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();
  useEffect(() => setAberto(false), [pathname]);
  const fecharMenu = useCallback(() => setAberto(false), []);
  const primeiraVez = useRef(true);
  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return; }
    if (!aberto) botaoMenu.current?.focus();
  }, [aberto]);
  /* ⭐ A ALTURA DO MENU É MEDIDA, não escrita. A hero da about começa por
     baixo do header com um margin-top negativo — e ele estava hardcoded para
     18px, a altura do header ANTIGO. Quando o menu virou quatro linhas (a nav
     vertical), sobrou uma faixa de papel de ~72px acima da foto: "bugou".
     Um ResizeObserver escreve `--p-menu-h` na `.p-tela`; quem precisa subir
     por baixo do menu lê a variável. */
  const raizTela = useRef<HTMLDivElement | null>(null);
  const menu = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const t = raizTela.current;
    const m = menu.current;
    if (!t || !m) return;
    const medir = () => t.style.setProperty("--p-menu-h", `${Math.round(m.getBoundingClientRect().height)}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(m);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={raizTela}
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
        {/* ⭐ O MENU GERAL, no estilo do node 630:1721 (12/09): quatro campos de
            duas linhas em Geist Medium 15px — a barra do topo da home original
            dele. Primeira linha acesa, segunda a 50%. Adaptado ao lugar: a
            barra do node diz local · hora · disponível · contato; o menu diz
            marca+ofício · nav+página atual · hora+disponível · contato.
            A cor obedece à superfície (ver `.p-menu` no CSS): tinta sólida no
            papel e no branco; branco em `difference` na tinta e sobre foto. */}
        {/* `sticky` e não `fixed` ("fixar", 16/09): fica no fluxo, então a hero
            continua subindo por baixo dele via `--p-menu-h`, e o `top` é a
            própria margem — ele não pula ao grudar. */}
        <header ref={menu} className="p-menu sticky top-[var(--p-margem-y)] z-10">
          {/* campos do node 630:1721, exceto o primeiro: em 12/09 ele pediu o
              node literal ("Brazil based · Working globally"); em 16/09 pediu
              a marca nesse campo — "Mateus Bredoff / Brand Designer". O nome
              leva pra home. Medium em tudo, só a
              primeira letra maiúscula. */}
          {/* o nome é o caminho de volta pra home (16/09) */}
          <Link to="/" className="p-menu-campo">
            <span>Mateus Bredoff</span>
            <span>Brand Designer</span>
          </Link>
          <div className="p-menu-campo">
            <span>{hora} BRT</span>
            <span>{new Date().toLocaleDateString("en-GB")}</span>
          </div>
          <div className="p-menu-campo">
            <span>Currently</span>
            <span>{status ?? "Available for work"}</span>
          </div>
          <Navegacao />
          <button
            ref={botaoMenu}
            type="button"
            className="p-menu-botao"
            aria-expanded={aberto}
            aria-controls="p-menu-painel"
            onClick={() => setAberto(true)}
          >
            Menu
          </button>
        </header>
        {aberto ? <MenuPainel hora={hora} status={status} fechar={fecharMenu} /> : null}

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

        {/* ── O RODAPÉ ─────────────────────────────────────────────────
            `regua`   os três metadados na base — onde ele está, que horas são
                      lá, e o número da folha. É o que cabe numa rota de tela.
            `completo` o fim de verdade: o convite em corpo grande, os canais,
                      o índice do site e a régua embaixo. ⚠ O e-mail é o maior
                      elemento porque é a ÚNICA ação que a página pede — quem
                      chegou ao fim já viu o trabalho. */}
        {rodape === "completo" ? (
          <footer className="p-rodape">
            {/* ⭐ O RODAPÉ no registro do Figma (Contact, 12/09): rótulo à esquerda,
                "Let's talk" aceso e os canais em display quietos a partir de um
                terço — a mesma grade das folhas da about — e o índice do site à
                direita, como a nav do frame. A régua de baixo é do sistema e fica. */}
            <div className="p-rodape-grade">
              <p className="p-rotulo">Contact</p>
              <div className="p-rodape-miolo">
                <ul className="p-rodape-canais">
                  <li>
                    <a href={`mailto:${EMAIL}`} className="p-servico-nome p-rodape-canal p-rodape-canal--aceso">
                      Let's talk
                    </a>
                  </li>
                  {CONTATO.map((c) => (
                    <li key={c.label}>
                      {c.href ? (
                        <a
                          href={c.href}
                          target={c.href.startsWith("http") ? "_blank" : undefined}
                          rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="p-servico-nome p-rodape-canal"
                        >
                          {c.label === "Email" ? "E-mail" : c.label}
                        </a>
                      ) : (
                        <span className="p-servico-nome p-rodape-canal">{c.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <nav className="p-rodape-indice" aria-label="Site">
                  <ul>
                    {PRANCHAS.map((p) => (
                      <li key={p.to}>
                        <Link to={p.to} className="p-corpo p-link">
                          <span className="p-marca">{p.n}</span> {p.nome}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <p className="p-marca p-rodape-regua">
              <span>Brazil</span>
              <span>
                {hora} (UTC−3)
              </span>
              {/* crédito do estúdio ("no rodapé colocar créditos", 16/09) */}
              <span>
                UI & Dev{" "}
                <a href="https://thegoodtaste.cc/" target="_blank" rel="noopener noreferrer">
                  Goodtaste®
                </a>
              </span>
              <span>
                {n} / {nome.toUpperCase()}
              </span>
            </p>
          </footer>
        ) : (
          <footer
            className="p-marca grid grid-cols-12 items-baseline pt-5"
            style={{ columnGap: "var(--p-gap-x)" }}
          >
            <span className="col-span-4">Brazil</span>
            <span className="col-span-4 col-start-6">
              {hora} (UTC−3)
            </span>
            <span className="col-span-3 col-start-10 text-right">
              {n} / {nome.toUpperCase()}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
}

/**
 * Bloco de ficha: rótulo mono minúsculo em cima, conteúdo embaixo.
 * É a unidade de composição: a repetição dele faz a coluna ler como documento.
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
