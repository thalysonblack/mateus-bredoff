import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { initLenis, destroyLenis, scrollToTop, scrollToElement } from "../lib/lenis";
import { ScrollTrigger } from "../lib/gsap";
import TransicaoRota from "./compartilhado/TransicaoRota";
import AboutV1 from "./v1/About";
import WorkV1 from "./v1/Work";
import CaseV1 from "./v1/Case";
import HomeV1 from "./v1/Home";
import { HomeV3, HomeV4 } from "./v3/Home";
import HomeV2 from "./v2/Home";
import AboutV2 from "./v2/About";
import { WorkV2, CaseV2 } from "./v2/Work";
import Versoes from "./compartilhado/Versoes";
import SeletorVersao from "./compartilhado/SeletorVersao";

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
  /* O `relative` do <main> é a âncora da barra sobreposta. Sem `z-index`
     junto, não cria stacking context — o `mix-blend` das páginas segue vivo. */
  return (
    <main className="relative antialiased">
      <RouteLifecycle />
      {/* o obturador do visor — ver app/TransicaoRota.tsx */}
      <TransicaoRota />
      {/* A barra é SOBREPOSTA, não faz parte do fluxo.
          No original ela flutua sobre o hero de cada rota; aqui ela estava no
          fluxo e empurrava a página inteira 57px para baixo (117px no mobile).
          Todo marco vertical das rotas internas nascia com esse deslocamento —
          e o erro não aparece olhando uma página só, porque tudo desce junto.
          Sem `z-index` no ancestral de propósito: as páginas usam
          `mix-blend-exclusion` no texto do hero, e um stacking context aqui em
          cima apagaria o blend. O empilhamento vem da ordem do DOM. */}
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
          {/* V1 — o site no ar: home + as internas canônicas */}
          <Route path="/" element={<HomeV1 />} />
          <Route path="/v1" element={<HomeV1 />} />
          <Route path="/about" element={<AboutV1 />} />
          <Route path="/work" element={<WorkV1 />} />
          <Route path="/work/:slug" element={<CaseV1 />} />
          {/* V2 — site inteiro */}
          <Route path="/v2" element={<HomeV2 />} />
          <Route path="/v2/about" element={<AboutV2 />} />
          <Route path="/v2/work" element={<WorkV2 />} />
          <Route path="/v2/work/:slug" element={<CaseV2 />} />
          {/* V3 — home aberta pelo reel */}
          <Route path="/v3" element={<HomeV3 />} />
          {/* V4 — unificada (18/10, feedback do Mateus): home da V3 + about e case da V1 */}
          <Route path="/v4" element={<HomeV4 />} />
          <Route path="/v4/about" element={<AboutV1 />} />
          <Route path="/v4/work" element={<WorkV1 />} />
          <Route path="/v4/work/:slug" element={<CaseV1 />} />
          {/* as três lado a lado, para aprovação */}
          <Route path="/versoes" element={<Versoes />} />
          {/* slug inexistente cai no case da V1, que trata o 404 */}
          <Route path="*" element={<CaseV1 />} />
        </Routes>
        <SeletorVersao />
      </Layout>
    </BrowserRouter>
  );
}
