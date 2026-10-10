import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { criarVisorFluido, type VisorFluido } from "../../lib/visorFluido";
import { WORK } from "../../content/work";
import { PECAS } from "../../content/pecas";
import { corDe } from "../../content/cores";
import "../../styles/inicio-dispositivo.css";

/**
 * INÍCIO C — O DISPOSITIVO, rodada 2 (10/10).
 *
 * Feedback: "o restante da página não conversou; ter que clicar pra mexer não me agrada".
 * Agora o SCROLL opera o aparelho e o aparelho CONTINUA na lista:
 *   1 a hero fica presa; rolar leva a agulha pelos canais 01→08 (snap por canal),
 *     o visor troca a peça com o fluido e a cor do projeto tinge a PÁGINA inteira;
 *   2 no 08 a régua se dissolve: o fio recolhe e cada canal cai para a sua linha;
 *   3 na lista, o fio de cada linha nasce do x do seu canal na régua, e a agulha
 *     segue viva — marca a linha em hover no mesmo x e tinge a página com a cor dela.
 * Sem arrasto nem clique para operar; o teclado opera porque a página rola.
 */
const N = WORK.length;
const capa = (i: number) => PECAS[WORK[i].slug]?.[0] ?? WORK[i].cover?.src;
const nome = (i: number) => WORK[i].title.replace("®", "").trim();
const xDe = (i: number) => i / (N - 1); /* posição do canal na régua, 0–1 */

export function InicioDispositivo() {
  const navegar = useNavigate();
  const raiz = useRef<HTMLDivElement | null>(null);
  const agulha = useRef<HTMLDivElement | null>(null);
  const agulhaLista = useRef<HTMLDivElement | null>(null);
  const quadro = useRef<HTMLDivElement | null>(null);
  const visor = useRef<VisorFluido | null>(null);
  const pos = useRef({ v: 0 });
  const canalRef = useRef(0);
  const [canal, setCanal] = useState(0);
  const [semGL, setSemGL] = useState(false);
  const [pronto, setPronto] = useState(false); /* o visor nasce no useEffect, depois do 1º layout */
  const tween = useRef<gsap.core.Tween | null>(null);
  const geracao = useRef(0);
  const passo = useRef({ p: 0 });

  /* a tinta é da PÁGINA: o mesmo fundo une a hero e a lista */
  const tingir = (cor: string | null) => {
    const tela = raiz.current?.closest<HTMLElement>(".p-tela");
    if (!tela || prefersReducedMotion()) return;
    if (cor) tela.style.setProperty("--ic-tinta", cor);
    else tela.style.removeProperty("--ic-tinta");
  };

  const aplicar = () => {
    const el = agulha.current;
    if (el) el.style.left = `${xDe(0) + (pos.current.v / (N - 1)) * 100}%`;
    const c = Math.round(pos.current.v);
    if (c !== canalRef.current) {
      canalRef.current = c;
      setCanal(c);
    }
  };

  /* o visor WebGL: só desenha com o aparelho na tela (a lente da lista tem o seu) */
  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const v = criarVisorFluido(el, 4);
    visor.current = v;
    setSemGL(!v);
    setPronto(true);
    if (!v) return;
    void v.aquecer(WORK.map((_, i) => capa(i)).filter(Boolean) as string[]);
    let ultimo = performance.now();
    const desenha = () => {
      const agora = performance.now();
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;
      const b = el.getBoundingClientRect();
      if (b.bottom < 0 || b.top > window.innerHeight) return;
      v.passo(dt);
    };
    gsap.ticker.add(desenha);
    return () => {
      gsap.ticker.remove(desenha);
      v.destruir();
      visor.current = null;
    };
  }, []);

  /* troca de canal: o fluido leva a peça nova (mesmo ciclo do HoverFluido) */
  const anterior = useRef(-1);
  useLayoutEffect(() => {
    const v = visor.current;
    const src = capa(canal);
    raiz.current?.style.setProperty("--ic-cor", corDe(WORK[canal].slug));
    if (aparelhoAtivo.current) tingir(corDe(WORK[canal].slug));
    if (!v || !src) return;
    const dir = (canal >= anterior.current ? 1 : -1) as 1 | -1;
    anterior.current = canal;
    const meu = ++geracao.current;
    void v.garantir(src).then(() => {
      if (geracao.current !== meu) return;
      tween.current?.kill();
      v.resolver();
      v.acento(corDe(WORK[canal].slug));
      v.iniciar(src, dir);
      passo.current.p = 0;
      tween.current = gsap.to(passo.current, {
        p: 1,
        duration: prefersReducedMotion() ? 0 : 1.05,
        ease: "power3.inOut",
        onUpdate: () => v.progresso(passo.current.p),
        onComplete: () => {
          v.concluir();
          tween.current = null;
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canal, semGL, pronto]);

  /* o aparelho tinge enquanto está preso; ao soltar, a tinta passa a ser da lista */
  const aparelhoAtivo = useRef(true);

  /* SCROLL — o pin opera o aparelho; depois, a régua se desdobra na lista */
  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const reduz = prefersReducedMotion();
    const linhas = gsap.utils.toArray<HTMLElement>(".ix-lista > li");
    /* cada linha guarda o x do seu canal: o fio nasce dali e a agulha da lista para ali */
    linhas.forEach((li, i) => li.style.setProperty("--ic-x", `${xDe(i) * 100}%`));
    tingir(corDe(WORK[0].slug));

    /* ⚠ o RouteLifecycle (App.tsx) mata TODO ScrollTrigger depois que a rota monta:
       criar depois de fonts.ready, como o UmaIndice — senão o pin nasce e morre */
    const ctx = gsap.context(() => {});
    let vivo = true;
    void document.fonts.ready.then(() => { if (!vivo) return; ctx.add(() => {
      const curto = window.matchMedia("(max-width: 760px)").matches;
      const porCanal = curto ? 0.42 : 0.6; /* telas de scroll por canal */
      const T = N - 1 + 0.5 + 1; /* canais · respiro no 08 · dissolve */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 0,
          end: () => `+=${T * porCanal * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: reduz ? true : 0.6,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [...Array.from({ length: N }, (_, i) => i / T), 1],
            duration: { min: 0.2, max: 0.6 },
            ease: "power2.inOut",
            delay: 0.08,
          },
          onLeave: () => {
            aparelhoAtivo.current = false;
            tingir(null);
          },
          onEnterBack: () => {
            aparelhoAtivo.current = true;
            tingir(corDe(WORK[canalRef.current].slug));
          },
        },
      });
      tl.to(pos.current, { v: N - 1, duration: N - 1, ease: "none", onUpdate: aplicar })
        .to({}, { duration: 0.5 })
        /* DISSOLVE — os rótulos caem, o fio recolhe para os canais, a agulha desce */
        .to(".ic-marca-txt", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.03, ease: "power2.in" })
        .to(".ic-fio", { scaleX: 0, transformOrigin: "100% 50%", duration: 0.8, ease: "power2.inOut" }, "<")
        .to(".ic-marca", { y: 40, autoAlpha: 0, duration: 1, ease: "power2.in" }, "<")
        .to(".ic-agulha", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.in" }, "<0.2")
        .to(".ic-dica", { autoAlpha: 0, duration: 0.3 }, "<");

      /* LISTA — o fio de cada linha desenha a partir do x do seu canal, em cascata com o scroll */
      if (linhas.length) {
        gsap.fromTo(
          linhas,
          { "--fio": 0 },
          {
            "--fio": 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".ix-lista", start: "top 95%", end: "top 30%", scrub: reduz ? true : 0.5 },
          },
        );
      }
    }); ScrollTrigger.refresh(); });

    /* a agulha da lista: acompanha a linha em hover no x do canal dela e tinge a página */
    const ag = agulhaLista.current;
    const lista = document.querySelector<HTMLElement>(".ix-lista");
    const hero = el.closest<HTMLElement>(".ix-hero");
    let sai: number | undefined;
    const entra = (e: Event) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>(".ix-lista > li");
      if (!li || !ag) return;
      window.clearTimeout(sai);
      const i = linhas.indexOf(li);
      const h = (ag.offsetParent ?? hero ?? document.body).getBoundingClientRect();
      const b = li.getBoundingClientRect();
      const cor = corDe(WORK[i].slug);
      ag.style.setProperty("--ic-cor", cor);
      const alvo = { x: b.left - h.left + b.width * xDe(i), y: b.top - h.top, height: b.height };
      if (ag.dataset.on !== "1") gsap.set(ag, { ...alvo, scaleY: 0 });
      ag.dataset.on = "1";
      gsap.to(ag, { ...alvo, scaleY: 1, autoAlpha: 1, duration: reduzido() ? 0 : 0.55, ease: "expo.out", overwrite: "auto" });
      tingir(cor);
    };
    const reduzido = () => prefersReducedMotion();
    const deixa = () => {
      sai = window.setTimeout(() => {
        if (!ag) return;
        ag.dataset.on = "0";
        gsap.to(ag, { scaleY: 0, autoAlpha: 0, duration: 0.35, ease: "power2.in", overwrite: "auto" });
        if (!aparelhoAtivo.current) tingir(null);
      }, 60);
    };
    const pode = window.matchMedia("(hover: hover)").matches;
    if (pode) {
      lista?.addEventListener("pointerover", entra);
      lista?.addEventListener("pointerleave", deixa);
    }
    return () => {
      lista?.removeEventListener("pointerover", entra);
      lista?.removeEventListener("pointerleave", deixa);
      window.clearTimeout(sai);
      vivo = false;
      ctx.revert();
      tingir(null);
      linhas.forEach((li) => li.style.removeProperty("--ic-x"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* entrada: a etiqueta sobe, a régua desenha, o visor abre */
  useLayoutEffect(() => {
    aplicar();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(".ic-etiqueta > *", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 })
        .fromTo(".ic-fio", { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 1.3, ease: "expo.inOut", immediateRender: false }, 0.1)
        .fromTo(".ic-marca-txt", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, immediateRender: false }, 0.5)
        .fromTo(".ic-visor", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.3)
        .fromTo(".ic-leitor > *", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0.9);
    }, raiz);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const w = WORK[canal];
  return (
    <div ref={raiz} className="ic">
      <div className="ic-palco">
        <div className="ic-esq">
          <h1 className="ic-etiqueta">
            <span>Mateus</span> <span>Bredoff</span>
          </h1>
          <div className="ic-leitor" aria-live="polite">
            <p className="ic-num">{String(canal + 1).padStart(2, "0")}</p>
            <p className="ic-titulo">{nome(canal)}</p>
            <p className="p-marca ic-ficha">
              {w.disciplines.join(" · ")} — {w.year}
            </p>
            <p className="p-marca ic-dica">Scroll to tune ↓</p>
          </div>
        </div>
        <button type="button" className="ic-visor" aria-label={`Open ${nome(canal)}`} onClick={() => navegar(`/work/${w.slug}`)}>
          {semGL ? <img src={capa(canal)} alt="" draggable={false} /> : null}
          <div ref={quadro} className="ic-quadro" />
        </button>
      </div>

      <div className="ic-regua" aria-hidden="true">
        <div className="ic-fio" />
        {WORK.map((x, i) => (
          <div key={x.slug} className={`ic-marca${i === canal ? " is-on" : ""}`} style={{ left: `${xDe(i) * 100}%` }}>
            <span className="ic-marca-txt">
              <span className="p-marca">{String(i + 1).padStart(2, "0")}</span>
              <span className="ic-marca-nome">{nome(i)}</span>
            </span>
          </div>
        ))}
        <div ref={agulha} className="ic-agulha" />
      </div>

      {/* a agulha da LISTA vive na hero (posição absoluta na .ix-hero) */}
      <div ref={agulhaLista} className="ic-agulha ic-agulha--lista" aria-hidden="true" />
    </div>
  );
}
