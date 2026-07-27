import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { initLenis, destroyLenis, scrollToTop } from "../lib/lenis";
import { ScrollTrigger } from "../lib/gsap";
import Menu from "./sections/Menu";
import Home from "./pages/Home";
import WorkIndex from "./pages/WorkIndex";
import CaseStudy from "./pages/CaseStudy";
import WorkVariants from "./lab/WorkVariants";
import HomeV3 from "./lab/v3/HomeV3";
import HomeV4 from "./lab/v4/HomeV4";
import HomeV5 from "./lab/v5/HomeV5";
import HomeV6 from "./lab/v6/HomeV6";
import HomeV7 from "./lab/v7/HomeV7";

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
  const { pathname } = useLocation();

  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    scrollToTop(true);

    /* Dois frames: um para o React pintar a rota nova, outro para o layout
       assentar antes de medir. */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  /* A barra de metadados vive DENTRO do Hero nas páginas que TÊM hero, e é o
     Layout que a monta nas rotas internas. Sem listar a variação da home aqui, a
     barra aparecia duas vezes em `/lab/home-v2` — o Layout montava a sua e o
     HeroV2 montava a dele. */
  const temHeroProprio = pathname === "/" || pathname.startsWith("/lab/home");

  return (
    <main className="antialiased">
      <RouteLifecycle />
      {!temHeroProprio ? (
        <div className="on-paper w-full">
          <Menu />
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
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          {/* laboratório: opções do índice de trabalho — sai depois da escolha */}
          <Route path="/lab/work" element={<WorkVariants />} />
          <Route path="/lab/home-v3" element={<HomeV3 />} />
          <Route path="/lab/home-v4" element={<HomeV4 />} />
          <Route path="/lab/home-v5" element={<HomeV5 />} />
          <Route path="/lab/home-v6" element={<HomeV6 />} />
          <Route path="/lab/home-v7" element={<HomeV7 />} />
          {/* Slug inexistente cai no próprio CaseStudy, que trata o 404 com a
              linguagem do site em vez de tela branca. */}
          <Route path="*" element={<CaseStudy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
