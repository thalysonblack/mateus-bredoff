import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { WORK } from "../../content/work";
import "../../styles/inicio-tipo.css";

/**
 * INÍCIO B — "A tipografia que se mexe", rodada 4 (10/10: "a hero não tá fazendo
 * sentido e também o menu").
 *
 * A rodada anterior passava o nome por quatro lockups em papel vazio — demonstração
 * do nome para o próprio nome, nenhum trabalho à vista — e terminava com o nome
 * virando um "projeto" da lista. Agora o nome é a MOLDURA e o trabalho é o assunto:
 *   1 HORIZONTAL  "Mateus Bredoff" gigante na base do palco.
 *   2 SPLIT       com o scroll, as duas palavras se afastam (Mateus sobe à esquerda,
 *                 Bredoff desce à direita) e o VÃO entre elas abre uma janela.
 *   3 TRABALHO    no vão passam os 8 projetos, um por passo de scroll, com nº e nome
 *                 em mono embaixo. Clique na janela abre o case.
 *   4 ATRACA      o nome voa e encolhe até o "Mateus Bredoff" do menu fixo e VIRA ele
 *                 (o do menu fica apagado até esse instante). A janela fica no palco
 *                 com o último projeto quando o pin solta, e a lista sobe embaixo.
 * O scroll opera tudo. As posições são medidas (palco, palavras, nome do menu) com as
 * transforms zeradas, e medidas de novo a cada refresh.
 */
const CAPAS = WORK.map((w) => w.cover.src);

export function InicioTipo() {
  const caixa = useRef<HTMLDivElement | null>(null);
  const [i, setI] = useState(0);

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el || prefersReducedMotion()) return;
    const [mateus, bredoff] = Array.from(el.querySelectorAll<HTMLElement>(".it-palavra"));
    const janela = el.querySelector<HTMLElement>(".it-janela");
    const imgs = Array.from(el.querySelectorAll<HTMLElement>(".it-janela img"));
    const legenda = el.querySelector<HTMLElement>(".it-legenda");
    if (!mateus || !bredoff || !janela) return;

    type Medida = { split: { m: [number, number]; b: [number, number]; s: number }; doca: { m: [number, number]; s: number }; faixa: number; cruza: boolean };
    let medida: Medida | null = null;
    const nomeMenu = () => document.querySelector<HTMLElement>(".p-menu a.p-menu-campo > span:first-child");

    const medir = (): Medida => {
      if (medida) return medida;
      const guard = [mateus, bredoff].map((p) => p.style.transform);
      [mateus, bredoff].forEach((p) => (p.style.transform = "none"));
      const S = el.getBoundingClientRect();
      const m = mateus.getBoundingClientRect();
      const b = bredoff.getBoundingClientRect();
      const fsHero = parseFloat(getComputedStyle(mateus).fontSize);
      const t = nomeMenu()?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);
      const fsMenu = parseFloat(getComputedStyle(nomeMenu() ?? document.body).fontSize);
      const menuFim = document.querySelector(".p-menu")?.getBoundingClientRect().bottom ?? 80;
      const quadro = el.querySelector(".it-quadro")?.getBoundingClientRect();
      [mateus, bredoff].forEach((p, k) => (p.style.transform = guard[k]));
      const ss = 0.82;
      const sd = fsMenu / fsHero;
      /* o box do menu tem line-height maior: desce meio do excesso para o glifo bater */
      const dy = ((1.09 - 0.82) / 2) * fsMenu;
      medida = {
        split: { s: ss, m: [S.left - m.left, S.top - m.top], b: [S.right - b.width * ss - b.left, S.bottom - b.height * ss - b.top] },
        doca: { s: sd, m: [t.left - m.left, t.top + dy - m.top] },
        /* a faixa logo abaixo do menu, por onde "Bredoff" corre para a esquerda sem passar
           por cima dos textos do menu */
        faixa: menuFim + 10 - b.top,
        /* no Split, "Bredoff" fica na mesma coluna da janela? (celular) então subir a cruzaria */
        cruza: !!quadro && S.right - b.width * ss < quadro.right,
      };
      return medida;
    };
    const zerar = () => { medida = null; };
    ScrollTrigger.addEventListener("refreshInit", zerar);

    const ctx = gsap.context(() => {
      gsap.fromTo(".it-letra", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.03 });
      gsap.fromTo(".it-dica", { autoAlpha: 0 }, { autoAlpha: 0.62, duration: 0.6, delay: 0.9 });

      /* o App mata os ScrollTriggers depois que a rota monta: o pin nasce depois das fontes */
      void document.fonts.ready.then(() => {
        ctx.add(() => {
          const menu = nomeMenu();
          if (menu) gsap.set(menu, { opacity: 0 });
          gsap.set([mateus, bredoff], { transformOrigin: "0 0" });
          gsap.set(janela, { clipPath: "inset(50% 50% 50% 50%)" });
          gsap.set(imgs.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(legenda, { autoAlpha: 0 });

          /* a irmã de baixo (a lista), lida ANTES do pin: depois o GSAP embrulha o palco num
             pin-spacer e o nextElementSibling dele vira null */
          const lista = el.nextElementSibling as HTMLElement | null;
          const PASSO = 0.6;
          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: el,
              start: () => `top ${el.getBoundingClientRect().top + window.scrollY}px`,
              end: () => `+=${duracao()}`,
              pin: true,
              /* SEM espaçador: a lista (irmã logo abaixo) nasce empurrada por uma margem medida
                 e SOBE POR DENTRO do palco preso durante a atracação — chega ao topo, sob o menu,
                 no instante em que o pin solta. Com espaçador sobrava uma tela de papel vazio. */
              pinSpacing: false,
              scrub: 0.6,
              refreshPriority: 1,
              invalidateOnRefresh: true,
              /* preso, o palco fica ACIMA do menu (o fundo de papel dele esconderia o nome
                 atracando); solto, volta para baixo, senão a janela rolaria por cima do menu */
              onToggle: (st) => { el.style.zIndex = st.isActive ? "11" : ""; },
            },
            onUpdate: () => {
              const n = Math.min(CAPAS.length - 1, Math.max(0, Math.floor((tl.time() - 1) / PASSO + 0.5)));
              setI((v) => (v === n ? v : n));
            },
          });
          /* 1→2 o nome se abre e a janela nasce no vão */
          tl.to(".it-dica", { autoAlpha: 0, duration: 0.3 }, 0)
            .to(mateus, { x: () => medir().split.m[0], y: () => medir().split.m[1], scale: () => medir().split.s, duration: 1 }, 0)
            .to(bredoff, { x: () => medir().split.b[0], y: () => medir().split.b[1], scale: () => medir().split.s, duration: 1 }, 0)
            .to(janela, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, 0.25)
            .to(legenda, { autoAlpha: 1, duration: 0.3 }, 0.8);
          /* 3 o trabalho passa no vão, um projeto por passo */
          imgs.slice(1).forEach((img, k) => {
            tl.to(img, { clipPath: "inset(0% 0% 0% 0%)", duration: PASSO * 0.7, ease: "power3.inOut" }, 1 + k * PASSO + PASSO * 0.3);
          });
          /* 4 o nome atraca no menu e vira ele */
          const t4 = 1 + (imgs.length - 1) * PASSO + 0.5;
          /* a janela NÃO fecha: na atracação ela sobe junto com a lista, como a primeira peça
             do índice rolando — assim não sobra papel vazio no meio (ver o gatilho abaixo) */
          tl.to(mateus, { x: () => medir().doca.m[0], y: () => medir().doca.m[1], scale: () => medir().doca.s, duration: 1, ease: "power3.inOut" }, t4)
            /* "Bredoff" sai da base PRIMEIRO (a lista vem subindo atrás dele) e sobe pela direita
               da janela até a faixa sob o menu, encolhendo — e ali se apaga. Correr para a
               esquerda o faria cruzar a janela, que sobe junto; o menu acende o nome inteiro */
            .to(bredoff, { y: () => medir().faixa, scale: () => medir().doca.s * 1.6, duration: 0.55, ease: "power2.out" }, t4)
            .to(bredoff, { autoAlpha: 0, duration: 0.25, ease: "none" }, t4 + 0.45)
            .to(mateus, { autoAlpha: 0, duration: 0.15, ease: "none" }, t4 + 0.9);
          /* no celular "Bredoff" está na coluna da janela: subir a cruzaria — ele se recolhe
             no lugar e só "Mateus" voa; o menu acende o nome inteiro no fim */
          if (medir().cruza) tl.to(bredoff, { autoAlpha: 0, duration: 0.25, ease: "none" }, t4);
          if (menu) tl.to(menu, { opacity: 1, duration: 0.15, ease: "none" }, t4 + 0.9);
          tl.to({}, { duration: 0.3 });

          /* a conta do pin: o trecho final (da janela fechando até o fim) dura exatamente a
             altura do palco em scroll — é o caminho que a lista percorre da base ao topo */
          const T = tl.duration();
          const tSobe = t4; /* a lista entra junto com a partida do nome; "Bredoff" sai da base na frente dela */
          function duracao() { return (el!.offsetHeight * T) / (T - tSobe); }
          const margem = () => { if (lista) lista.style.marginTop = `${duracao() - el.offsetHeight}px`; };
          margem();
          ScrollTrigger.addEventListener("refreshInit", margem);
          /* a janela sobe com a lista no MESMO ritmo do scroll (sem o scrub da timeline,
             senão as duas descolam): do início da atracação ao fim do pin, uma altura de palco */
          const quadro = el.querySelector<HTMLElement>(".it-quadro");
          const menuFim = () => (document.querySelector(".p-menu")?.getBoundingClientRect().bottom ?? 0) + 14;
          const inicioPin = () => el.getBoundingClientRect().top + window.scrollY;
          if (quadro) ScrollTrigger.create({
            start: () => inicioPin() + (duracao() * tSobe) / T,
            end: () => inicioPin() + duracao(),
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              gsap.set(quadro, { y: -st.progress * el.offsetHeight });
              /* preso, o palco está ACIMA do menu (por causa do nome): a janela subindo passaria
                 por cima dele — corta a parte dela que entra na faixa do menu */
              const corte = Math.max(0, menuFim() - quadro.getBoundingClientRect().top);
              quadro.style.clipPath = corte ? `inset(${corte}px 0 0 0)` : "";
            },
            onLeaveBack: () => { gsap.set(quadro, { y: 0 }); quadro.style.clipPath = ""; },
          });
          ctx.add(() => () => {
            ScrollTrigger.removeEventListener("refreshInit", margem);
            if (lista) lista.style.marginTop = "";
          });
          ScrollTrigger.refresh();
        });
      });
    }, el);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", zerar);
      ctx.revert();
    };
  }, []);

  const w = WORK[i];
  return (
    <div ref={caixa} className="it-caixa">
      <h1 className="it-nome" aria-label="Mateus Bredoff">
        {["Mateus", "Bredoff"].map((p) => (
          <span key={p} className="it-palavra" aria-hidden="true">
            {[...p].map((c, k) => (
              <span key={k} className="it-mascara">
                <span className="it-letra">{c}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>
      {/* o quadro tem a medida; a janela (com clip-path) e a legenda moram nele —
          a legenda fora da janela, senão o clip a cortaria */}
      <div className="it-quadro">
        <Link to={`/work/${w.slug}`} className="it-janela" aria-label={`${w.title.replace("®", "").trim()} — case`}>
          {CAPAS.map((src, k) => (
            <img key={src} src={src} alt="" decoding="async" draggable={false} style={{ zIndex: k }} />
          ))}
        </Link>
        <p className="p-marca it-legenda" aria-hidden="true">
          <span>{String(i + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")} — {w.title.replace("®", "").trim()}</span>
          <span>{w.disciplines.slice(0, 2).join(" · ")}</span>
        </p>
      </div>
      <p className="p-marca it-dica" aria-hidden="true">Scroll ↓</p>
    </div>
  );
}
