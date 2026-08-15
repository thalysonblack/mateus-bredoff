import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { terra } from "../../content/terra";

/**
 * Globo de pontos — a Terra de verdade, girando.
 *
 * ## O que ele substituiu, e por quê
 *
 * A versão anterior era um wireframe de meridianos em SVG: quatro elipses e
 * sete cordas horizontais. Lia como gaiola, não como planeta — e uma seção
 * inteira chamada "based in Brazil, working worldwide" ficava apoiada num
 * desenho que não continha nem o Brasil nem o mundo. O pino flutuava no vazio
 * porque não havia geografia para ancorá-lo.
 *
 * Agora a massa de terra vem de dado real ([[content/terra.ts]], Natural Earth
 * em 2,7 kB de bits) e o globo GIRA: continuamente por conta própria, e mais
 * rápido enquanto a página rola. O pino do Brasil está numa coordenada de
 * verdade, some quando o planeta o leva para o outro lado e volta sozinho —
 * é o giro que conta a história de "trabalhar de longe", não uma legenda.
 *
 * ## Decisões de implementação que não são óbvias
 *
 * **Canvas, não SVG.** São ~2.600 pontos redesenhados a cada frame. Em SVG
 * seriam 2.600 nós de DOM sofrendo reflow 60×/s; em canvas é um loop de
 * `arc()` num buffer. Foi a diferença entre a seção rolar lisa e a página
 * inteira engasgar.
 *
 * **Distribuição por anel, não por grade.** Longitude a passo fixo amontoa
 * pontos nos polos e rareia no equador — o globo fica com duas manchas e uma
 * cintura vazia. Cada anel de latitude recebe `N ∝ cos(lat)` pontos, que é o
 * que dá densidade constante na superfície.
 *
 * **Um relógio só.** O desenho anda no `gsap.ticker`, nunca num `rAF` próprio:
 * é a regra deste repo (o Lenis também vive nesse ticker) e o motivo é que
 * dois relógios brigam e o scroll passa a tremer. ⚠ A referência da função
 * precisa ser guardada — `gsap.ticker.remove` só tira a MESMA função que
 * entrou, e callback inline entra e nunca mais sai.
 *
 * **`prefers-reduced-motion` corta a rotação, não o globo.** Quem pediu menos
 * movimento continua vendo o planeta e o pino, parados.
 */

/* Onde o pino crava. Centro geográfico do Brasil — o país é fato público, a
   cidade dele não se inventa (a mesma régua do resto do site). */
const BRASIL = { lat: -14.235, lon: -51.925 };

/* Passo do anel em graus. 2,2° dá ~2.600 pontos: cheio o bastante para a
   América do Sul ter forma, ralo o bastante para o desenho ser barato. */
const PASSO = 2.2;

type Ponto = { lat: number; lon: number };

function malha(): Ponto[] {
  const pts: Ponto[] = [];
  for (let lat = -88; lat <= 88; lat += PASSO) {
    const rad = (lat * Math.PI) / 180;
    /* densidade constante na esfera: o anel encolhe com cos(lat) */
    const n = Math.max(6, Math.round((360 / PASSO) * Math.cos(rad)));
    for (let i = 0; i < n; i++) {
      const lon = -180 + (360 * i) / n;
      if (terra(lat, lon)) pts.push({ lat, lon });
    }
  }
  return pts;
}

const MALHA = malha();

export default function GloboTerra({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const giro = useRef(0);
  /* velocidade extra vinda do scroll — decai sozinha, então o globo acelera
     quando a pessoa rola e volta ao passeio quando ela para */
  const impulso = useRef(0);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lado = 0;

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lado = cv.clientWidth;
      cv.width = Math.round(lado * dpr);
      cv.height = Math.round(lado * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(cv);

    /* o petróleo e o acento vêm dos tokens: seção nova não inventa cor */
    const css = getComputedStyle(document.documentElement);
    const tinta = css.getPropertyValue("--fr-petroleo").trim() || "#142126";
    const acento = css.getPropertyValue("--v3-acento").trim() || "#a53a0b";

    const desenhar = () => {
      const R = lado / 2 - 2;
      const C = lado / 2;
      ctx.clearRect(0, 0, lado, lado);

      /* o disco do horizonte: fio fino, o único traço contínuo do desenho */
      ctx.beginPath();
      ctx.arc(C, C, R, 0, Math.PI * 2);
      ctx.strokeStyle = tinta;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      ctx.stroke();

      const rot = (giro.current * Math.PI) / 180;
      ctx.fillStyle = tinta;

      for (let i = 0; i < MALHA.length; i++) {
        const p = MALHA[i];
        const la = (p.lat * Math.PI) / 180;
        const lo = (p.lon * Math.PI) / 180 + rot;
        /* ortográfica: cos(lat)·sin(lon) é o x, sin(lat) o y, e cos(lon) diz
           se o ponto está na face virada para cá */
        const cosLa = Math.cos(la);
        const z = cosLa * Math.cos(lo);
        if (z <= 0) continue;
        const x = C + R * cosLa * Math.sin(lo);
        const y = C - R * Math.sin(la);
        /* profundidade: quem está na borda desaparece, quem está de frente
           pesa. Sem isto o globo lê como adesivo, não como esfera.
           ⚠ O piso é 0,32 e não 0,18: medido na tela, o valor baixo fazia o
           planeta inteiro sumir ao lado da manchete — a seção voltava a ter um
           fantasma no meio. Profundidade é o GRADIENTE, não a fraqueza. */
        ctx.globalAlpha = 0.32 + 0.6 * z;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      /* o pino: mesma projeção dos pontos, então ele PERTENCE ao globo —
         some quando o Brasil passa para o outro lado e volta sozinho */
      const pla = (BRASIL.lat * Math.PI) / 180;
      const plo = (BRASIL.lon * Math.PI) / 180 + rot;
      const pz = Math.cos(pla) * Math.cos(plo);
      if (pz > 0) {
        const px = C + R * Math.cos(pla) * Math.sin(plo);
        const py = C - R * Math.sin(pla);
        ctx.globalAlpha = Math.min(1, 0.35 + pz);
        ctx.fillStyle = acento;
        ctx.fillRect(px - 3, py - 3, 6, 6);
        ctx.strokeStyle = acento;
        ctx.globalAlpha = Math.min(1, 0.25 + pz * 0.7);
        ctx.lineWidth = 1;
        ctx.strokeRect(px - 8.5, py - 8.5, 17, 17);
        /* fio até a borda + rótulo: a etiqueta segue o ponto, não a moldura */
        ctx.beginPath();
        ctx.moveTo(px + 9, py);
        ctx.lineTo(px + 34, py);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, 0.45 + pz * 0.55);
        ctx.fillStyle = tinta;
        ctx.font = "600 10px 'Martian Mono', ui-monospace, monospace";
        ctx.textBaseline = "middle";
        ctx.fillText("BRA — GMT−3", px + 40, py);
        ctx.fillStyle = acento;
      }
      ctx.globalAlpha = 1;
    };

    /* ── o relógio ─────────────────────────────────────────────────────── */
    const passo = () => {
      const dt = gsap.ticker.deltaRatio(60);
      giro.current += (0.055 + impulso.current) * dt;
      impulso.current *= 0.94; /* o empurrão do scroll morre em ~1s */
      desenhar();
    };

    if (quieto) {
      desenhar();
    } else {
      gsap.ticker.add(passo);
    }

    /* o scroll empurra o giro — sem pin, sem travar a rolagem: a página segue
       livre e o globo só REAGE a ela */
    const st = quieto
      ? null
      : ScrollTrigger.create({
          trigger: cv,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            impulso.current = Math.min(1.6, Math.abs(self.getVelocity()) / 900);
          },
        });

    return () => {
      /* a MESMA referência que entrou — inline aqui vazaria o ticker */
      gsap.ticker.remove(passo);
      st?.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Globo terrestre girando, com o Brasil marcado"
    />
  );
}
