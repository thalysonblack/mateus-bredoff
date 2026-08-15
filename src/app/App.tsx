import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { initLenis, destroyLenis, scrollToTop, scrollToElement } from "../lib/lenis";
import { ScrollTrigger } from "../lib/gsap";
import Menu from "./sections/Menu";
import Home from "./pages/Home";
import WorkIndex from "./pages/WorkIndex";
import CaseStudy from "./pages/CaseStudy";
import About from "./pages/About";
import HomeV2 from "./pages/HomeV2";
import HomeV3 from "./pages/HomeV3";
import AboutV3 from "./pages/AboutV3";
import WorkIndexV3 from "./pages/WorkIndexV3";
import CaseV3 from "./pages/CaseV3";
import LabV3 from "./pages/LabV3";
import HomeV3A from "./pages/HomeV3A";
import HomeV3B from "./pages/HomeV3B";
import HomeV3C from "./pages/HomeV3C";

/**
 * Mateus Bredoff — direção editorial, agora multi-página.
 *
 * O site espelha a estrutura do CMS dele: `/`, `/work` e `/work/:slug`. O
 * roteador entrou quando o levantamento do sitemap mostrou nove rotas — antes
 * disso o projeto era uma página só, e um roteador para uma rota seria
 * arquitetura sem função.
 *
 * Os cases NÃO têm um componente por projeto: `CaseStudy` resolve o slug contra
 * a coleção em `content/work.ts`, que é a fonte única lida também pela home e
 * pelo índice.
 *
 * As primitivas vivem em ./system.tsx e os tokens em ../styles/system.css.
 */

/**
 * Ciclo de vida de rota — a parte que sempre esquece e depois dá bug fantasma.
 *
 * Três coisas obrigatórias a cada navegação:
 *  1. **Matar os ScrollTriggers da página que saiu.** Trigger órfão continua
 *     medindo posições de um DOM que não existe mais e a nova página herda
 *     animações que nunca disparam (ou disparam na hora errada).
 *  2. **Ir ao topo pelo Lenis**, nunca por `window.scrollTo` — com o scroll
 *     interpolado, `scrollTo` não move nada.
 *  3. **`refresh()` depois que a nova montou**, senão todo trigger da página
 *     nova nasce medindo a altura do documento antigo.
 */
function RouteLifecycle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());

    /* Âncora na URL (`/#contato`): ir até o alvo em vez do topo.
       Estava morto por dois motivos somados: com o Lenis no comando o pulo
       nativo por hash não acontece, e o `scrollToTop` puxava de volta assim que
       o pathname mudava.

       ⚠ E consertar isso não bastou. Resolver o alvo num rAF único funciona
       DENTRO da mesma página e erra ~1400px vindo de outra rota: um frame
       depois da troca o documento ainda está numa altura intermediária, e o
       destino sai calculado contra ela. Por isso o desvio por hash mora junto
       do `refresh()` atrasado — dois frames, o mesmo momento em que o layout já
       assentou. Testar só o clique dentro da própria home dava 0px de erro e
       escondia o caso comum, que é justamente o de fora: o item "Contact" vive
       no rodapé de TODAS as rotas. */
    let alvoRaf = 0;
    const desviar = () => {
      const alvo = hash ? document.querySelector(hash) : null;
      if (alvo) scrollToElement(alvo as HTMLElement);
      ScrollTrigger.refresh();
    };

    if (hash) {
      alvoRaf = requestAnimationFrame(() => requestAnimationFrame(desviar));
    } else {
      scrollToTop(true);
      /* Dois frames: um para o React pintar a rota nova, outro para o layout
         assentar antes de medir. */
      alvoRaf = requestAnimationFrame(() =>
        requestAnimationFrame(() => ScrollTrigger.refresh()),
      );
    }
    return () => cancelAnimationFrame(alvoRaf);
  }, [pathname, hash]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  /* A barra de metadados vive DENTRO do Hero nas páginas que TÊM hero, e é o
     Layout que a monta nas rotas internas — se as duas montarem, ela duplica.

     Desde a promoção, TODA página do site monta a própria `NavV3`. Quem ainda
     depende desta barra são só as internas da réplica arquivada, e por isso a
     condição é uma lista de exceção e não uma regra: rota nova nasce sem a
     barra duplicada, que é o defeito que este trecho existe para evitar.
     A `/arquivo/framer` (home da réplica) tem hero próprio — a barra com
     final é justamente o que a exclui. */
  const barraDaReplica = pathname.startsWith("/arquivo/framer/");

  /* O `relative` do <main> é a âncora da barra sobreposta. Sem `z-index`
     junto, não cria stacking context — o `mix-blend` das páginas segue vivo. */
  return (
    <main className="relative antialiased">
      <RouteLifecycle />
      {/* A barra é SOBREPOSTA, não faz parte do fluxo.
          No original ela flutua sobre o hero de cada rota; aqui ela estava no
          fluxo e empurrava a página inteira 57px para baixo (117px no mobile).
          Todo marco vertical das rotas internas nascia com esse deslocamento —
          e o erro não aparece olhando uma página só, porque tudo desce junto.
          Sem `z-index` no ancestral de propósito: as páginas usam
          `mix-blend-exclusion` no texto do hero, e um stacking context aqui em
          cima apagaria o blend. O empilhamento vem da ordem do DOM. */}
      {barraDaReplica ? (
        <div className="pointer-events-none absolute inset-x-0 top-0">
          <div className="pointer-events-auto">
            <Menu />
          </div>
        </div>
      ) : null}
      {children}
      {/* grão por cima de tudo — ver .grain em styles/system.css */}
      <div className="grain" aria-hidden="true" />
    </main>
  );
}

export default function App() {
  /* Boot: scroll primeiro, motion depois. O Lenis precisa existir antes de
     qualquer ScrollTrigger, senão os triggers se registram medindo o scroll
     nativo e ficam dessincronizados do interpolado. */
  useEffect(() => {
    initLenis();

    /* Imagem `lazy` muda a altura do documento ao decodificar e desloca todo
       trigger abaixo dela. */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      destroyLenis();
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ── O SITE ────────────────────────────────────────────────────
              A direção "portfólio como visor" (ex-`/v3`) é o site, promovida
              à raiz em 15/08 — ela era o que ele aprovou e vivia numa rota de
              laboratório, então o que estava no ar não era o que estava
              aprovado. As rotas canônicas não mudaram de NOME: `/`, `/about`,
              `/work`, `/work/:slug` são as mesmas do CMS dele e do original,
              o que muda é qual componente as monta — por isso `meta.ts` e o
              pré-render seguem valendo sem uma linha de mudança. */}
          <Route path="/" element={<HomeV3 />} />
          <Route path="/about" element={<AboutV3 />} />
          <Route path="/work" element={<WorkIndexV3 />} />
          <Route path="/work/:slug" element={<CaseV3 />} />
          <Route path="/lab" element={<LabV3 />} />

          {/* ── ARQUIVO ───────────────────────────────────────────────────
              Direção descartada não vira comentário no histórico: vira rota, e
              as versões se comparam abrindo abas. Fora do pré-render e do
              sitemap de propósito — é material de estúdio, não página do site.
              `/arquivo/framer` é a réplica fiel do Framer publicado, que foi a
              FONTE do conteúdo (medida rota a rota) e continua sendo a régua
              contra a qual se confere um fato. */}
          <Route path="/arquivo/framer" element={<Home />} />
          <Route path="/arquivo/v2" element={<HomeV2 />} />
          <Route path="/arquivo/a" element={<HomeV3A />} />
          <Route path="/arquivo/b" element={<HomeV3B />} />
          <Route path="/arquivo/c" element={<HomeV3C />} />
          <Route path="/arquivo/framer/about" element={<About />} />
          <Route path="/arquivo/framer/work" element={<WorkIndex />} />
          <Route path="/arquivo/framer/work/:slug" element={<CaseStudy />} />

          {/* Slug inexistente cai no próprio case, que trata o 404 com a
              linguagem do site em vez de tela branca. */}
          <Route path="*" element={<CaseV3 />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
