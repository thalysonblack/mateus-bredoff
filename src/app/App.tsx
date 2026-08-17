import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { initLenis, destroyLenis, scrollToTop, scrollToElement } from "../lib/lenis";
import { ScrollTrigger } from "../lib/gsap";
import Menu from "./sections/Menu";
import TransicaoRota from "./TransicaoRota";
import Home from "./pages/Home";
import WorkIndex from "./pages/WorkIndex";
import CaseStudy from "./pages/CaseStudy";
import About from "./pages/About";
import HomeAutoral from "./pages/HomeV2";
import PranchaIndex from "./v2/Home";
import PranchaAbout from "./v2/About";
import AboutB from "./v2/AboutB";
import PranchaWork from "./v2/Work";
import PranchaCase from "./v2/Case";
import PranchaLab from "./v2/Lab";
import HomeA from "./v2/HomeA";
import HomeB from "./v2/HomeB";
import HomeC from "./v2/HomeC";
import HomeD from "./v2/HomeD";
import HomeE from "./v2/HomeE";
import HomeF from "./v2/HomeF";
import HomeG from "./v2/HomeG";
import HomeH from "./v2/HomeH";
import HomeI from "./v2/HomeI";
import HomeV3 from "./pages/HomeV3";
import AboutV3 from "./pages/AboutV3";
import WorkIndexV3 from "./pages/WorkIndexV3";
import CaseV3 from "./pages/CaseV3";
import LabV3 from "./pages/LabV3";

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
          {/* ⭐ 17/08 — A PRANCHA (V2) VIROU O SITE: "pode tornar a página
              inicial". A home é a TRAMA com o visor fluido no modo Arco, que é
              o que ele aprovou depois de quatro receitas comparadas em rota.
              De novo o mesmo princípio da promoção anterior: aprovado que não é
              alcançável não conta, e as rotas canônicas não mudam de NOME —
              `/`, `/about`, `/work`, `/work/:slug`, `/lab` são as do CMS dele e
              do original, muda só quem as monta. Por isso `content/meta.ts` e o
              pré-render seguem valendo sem uma linha alterada. */}
          <Route path="/" element={<HomeD fluidoModo={4} />} />
          <Route path="/about" element={<PranchaAbout />} />
          <Route path="/work" element={<PranchaWork />} />
          <Route path="/work/:slug" element={<PranchaCase />} />
          <Route path="/lab" element={<PranchaLab />} />

          {/* ── ARQUIVO ───────────────────────────────────────────────────
              O que sobra aqui tem função ATIVA, não sentimental.
              `/arquivo/framer` é a réplica fiel do publicado: foi a FONTE do
              conteúdo, medida rota a rota, e segue sendo a régua contra a qual
              se confere um fato do cliente. `/arquivo/v2` é a direção autoral
              inteira, a única alternativa real de partido que resta.
              Fora do pré-render de propósito — material de estúdio não aparece
              em busca nem em unfurl.

              As três homes de partido (`/arquivo/a` "a arte é o ambiente",
              `/arquivo/b` "cartaz", `/arquivo/c` "noturno, uma luz") foram
              APAGADAS a pedido dele em 15/08, depois de abertas lado a lado com
              o site no ar. Serviram para escolher, a escolha foi feita e o
              melhor da A já está DENTRO da home canônica — o hero de capas em
              tela cheia é dela. Rota de arquivo se mantém enquanto responde uma
              pergunta; deixar as três seria guardar pergunta já respondida.
              Voltam com `git show 5309550` se algum dia forem precisas. */}
          {/* A alternativa de Selected Work: a mesma home com a seção em
              ENXAME em vez da tira com snap. Rota, e não branch, porque é assim
              que se compara aqui — duas abas lado a lado. */}
          {/* ⚠ A direção "o portfólio como visor" (a V3) foi a canônica entre
              15 e 17/08 e agora é arquivo. Continua montável inteira — é a
              única alternativa de partido com subpáginas prontas. */}
          <Route path="/arquivo/visor" element={<HomeV3 />} />
          <Route path="/arquivo/visor/about" element={<AboutV3 />} />
          <Route path="/arquivo/visor/work" element={<WorkIndexV3 />} />
          <Route path="/arquivo/visor/work/:slug" element={<CaseV3 />} />
          <Route path="/arquivo/visor/lab" element={<LabV3 />} />
          <Route path="/arquivo/enxame" element={<HomeV3 work="enxame" />} />
          <Route path="/arquivo/framer" element={<Home />} />
          {/* ⚠ A direção autoral trocou de endereço: era `/arquivo/v2` e virou
              `/arquivo/autoral`, porque `/v2` passou a ser a DIREÇÃO NOVA (a
              prancha). Dois "v2" no mesmo site é confusão garantida na próxima
              vez que ele pedir "abre a v2". */}
          <Route path="/arquivo/autoral" element={<HomeAutoral />} />
          <Route path="/arquivo/framer/about" element={<About />} />
          <Route path="/arquivo/framer/work" element={<WorkIndex />} />
          <Route path="/arquivo/framer/work/:slug" element={<CaseStudy />} />

          {/* ── V2: "A PRANCHA" ──────────────────────────────────────────
              Direção nova pedida em 17/08 ("bora uma v2 seguindo esse estilo,
              subpáginas"), a partir de corentinbernadou.com, artemshcherban.com
              e revelatio.studio. Vive em rota própria COM as subpáginas — o
              partido só se julga com o site inteiro de pé, não com uma home
              solta. Ver `styles/v2.css` para o que foi medido em cada uma. */}
          <Route path="/v2" element={<PranchaIndex />} />
          <Route path="/v2/work" element={<PranchaWork />} />
          <Route path="/v2/work/:slug" element={<PranchaCase />} />
          <Route path="/v2/about" element={<PranchaAbout />} />
          {/* a segunda proposta da about, da capa para baixo — "outra proposta
              da segunda section pra baixo". A capa é a mesma nas duas. */}
          <Route path="/v2/about-b" element={<AboutB />} />
          <Route path="/v2/lab" element={<PranchaLab />} />

          {/* ── AS TRÊS HOMES DE PARTIDO ─────────────────────────────────
              "gostei mas nao da home" (17/08) — as subpáginas ficaram e a home
              está na quarta tentativa. Em vez de chutar a quinta, três partidos
              DIFERENTES em rota, para fechar por eliminação lado a lado, que é
              como este projeto já resolveu isso uma vez (as homes /arquivo/a,
              /b e /c de agosto, apagadas depois da escolha).
              A quarta em comparação é a própria `/v2` (a folha de espécimes). */}
          <Route path="/v2/a" element={<HomeA />} />
          <Route path="/v2/b" element={<HomeB />} />
          <Route path="/v2/c" element={<HomeC />} />
          <Route path="/v2/d" element={<HomeD />} />
          {/* as três receitas do visor fluido, lado a lado para ele escolher —
              mesma home, só troca a mecânica da transição */}
          <Route path="/v2/d1" element={<HomeD fluidoModo={1} comparando />} />
          <Route path="/v2/d2" element={<HomeD fluidoModo={2} comparando />} />
          <Route path="/v2/d3" element={<HomeD fluidoModo={3} comparando />} />
          <Route path="/v2/d4" element={<HomeD fluidoModo={4} comparando />} />
          <Route path="/v2/e" element={<HomeE />} />
          <Route path="/v2/f" element={<HomeF />} />
          <Route path="/v2/g" element={<HomeG />} />
          <Route path="/v2/h" element={<HomeH />} />
          <Route path="/v2/i" element={<HomeI />} />

          {/* Slug inexistente cai no próprio case, que trata o 404 com a
              linguagem do site em vez de tela branca. */}
          <Route path="*" element={<PranchaCase />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
