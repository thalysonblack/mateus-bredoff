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
       Este link estava MORTO por dois motivos somados, e consertar um só não
       resolveria: (1) com o Lenis no comando, o pulo nativo por hash não
       acontece; (2) mesmo que acontecesse, o `scrollToTop` abaixo puxava a
       página de volta assim que o pathname mudava. Por isso o desvio vem
       ANTES, e é o Lenis quem move. */
    const alvo = hash ? document.querySelector(hash) : null;
    if (alvo) {
      /* Um frame para a rota nova pintar: o alvo pode ter acabado de montar, e
         medir antes disso dá a posição do documento anterior. */
      requestAnimationFrame(() => scrollToElement(alvo as HTMLElement));
    } else {
      scrollToTop(true);
    }

    /* Dois frames: um para o React pintar a rota nova, outro para o layout
       assentar antes de medir. */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  /* A barra de metadados vive DENTRO do Hero nas páginas que TÊM hero, e é o
     Layout que a monta nas rotas internas — se as duas montarem, ela duplica. */
  const temHeroProprio = pathname === "/" || pathname === "/v2";

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
      {!temHeroProprio ? (
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
          <Route path="/" element={<Home />} />
          {/* V2: a alternativa de direção própria, viva e montável. `/` é a
              réplica do Framer; esta é a outra opção sobre a mesa. */}
          <Route path="/v2" element={<HomeV2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          {/* Slug inexistente cai no próprio CaseStudy, que trata o 404 com a
              linguagem do site em vez de tela branca. */}
          <Route path="*" element={<CaseStudy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
