import { Link } from "react-router";
import { scrollToTop } from "../../../lib/lenis";

/**
 * Rodapé da réplica — o mesmo bloco em TODAS as rotas do original.
 *
 * Medido idêntico em `/work`, `/about` e nos seis cases: bloco petróleo de
 * **100vh**, `padding: 42px 24px 24px`, fio no topo, e três colunas —
 * rótulo (400px) · conteúdo · nav (200px encostada à direita).
 *
 * 100vh é medida, não estilo: com viewport de 700px o bloco mediu 700, com 1000
 * mediu 1000. Fixar 1000px reproduziria o print e erraria toda tela que não
 * fosse a do print.
 *
 * ⚠ Este componente também serve a HOME. Ele nasceu aqui porque as rotas
 * internas não existem sem ele, mas o rodapé é um só no original — se a home
 * montar um segundo, os dois divergem no primeiro ajuste. Importe este.
 */

const CONTATO = [
  { label: "Email", href: "mailto:hello@mateusbredoff.com" },
  { label: "Behance", href: "https://www.behance.net/mateusbredoff" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "X.com", href: "https://x.com/" },
];

const NAV = [
  { i: "01", label: "Home", to: "/" },
  { i: "02", label: "Works", to: "/work" },
  { i: "03", label: "About", to: "/about" },
  { i: "04", label: "Contact", to: "/#contato" },
];

export default function RodapeFramer() {
  return (
    <footer
      className="fr-tinta relative flex min-h-svh w-full flex-col"
      style={{ padding: "42px var(--fr-margem) var(--fr-margem)" }}
    >
      <div className="flex flex-1 flex-col border-t border-white/12 pt-[33px]">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[var(--fr-rotulo-col)_minmax(0,1fr)_200px]">
          <p className="fr-secao-rotulo text-white/50">Contact</p>

          <div className="flex flex-col">
            {/* 64px/76.8 é o `.fr-display-solto` que já vive em framer.css —
                o mesmo corpo da lista de disciplinas. Não é token novo. */}
            <h2 className="fr-display-solto">Let&apos;s Talk</h2>

            {/* 42px entre o título e a lista, 10px entre os links: medido igual
                em 1600 e em 390, então é gap fixo e não proporção. */}
            <ul className="flex flex-col gap-[10px] pt-[42px]">
              {CONTATO.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    /* #616b6f no lugar do #5e686c do original: aquele mede
                       2,88:1 sobre o petróleo e reprova em AA mesmo no mínimo
                       de texto grande (3:1). Este mede 3,01:1. Ver a nota do
                       --fr-cinza em framer.css — não reverter para "ficar
                       fiel". */
                    className="fr-display-solto text-[#616b6f] block transition-colors duration-300 hover:text-[var(--fr-creme)]"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Navegação do rodapé" className="self-start">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className="flex h-[55px] items-center justify-between border-b border-white/12"
              >
                <span className="fr-nav-indice text-white/50">{n.i}</span>
                <span className="fr-nav-rodape text-white">{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* `mt-auto` em vez de posição absoluta: a linha fica colada no fundo do
            bloco de 100vh sem sair do fluxo, e continua embaixo do conteúdo se
            a tela for baixa demais para caber tudo. */}
        {/* 48% e não os 45% do original: 45% mede 4,39:1 sobre o petróleo e
            reprova em AA. Passei antes por `/46`, que o Tailwind compila para
            alpha 0x75 = 45,88% e mede 4,509:1 — passava por 0,009, folga que
            some no primeiro arredondamento que alguém encostar. `/48` mede
            ~4,7:1 e sobrevive a mexida. */}
        <div className="fr-micro mt-auto flex items-end justify-between pt-16 text-white/48">
          <span>© 2026</span>
          {/* `scrollToTop` do Lenis: com scroll interpolado, `window.scrollTo`
              não move nada e o link vira botão morto. */}
          <button type="button" onClick={() => scrollToTop()} className="fr-micro">
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
