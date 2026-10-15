import { Renderer, Camera, Transform, Program, Mesh, Plane, Texture, Vec2 } from "ogl";
import { gsap } from "./gsap";

/* ── constantes, lidas do original ─────────────────────────────────────── */
const GAP = 30;
const HIGHLIGHT = 0.15;
const BARREL_STR = 120;
const BARREL_UP = 0.4;
const BARREL_DOWN = 1.0;
const BOWL_STR = 2.0;
const BOWL_RADIUS = 2.0;
const BOWL_SMOOTH = 0.1;
const BOWL_FALLOFF = 1.5;
const CHROMA_BASE = 0.002;
const CHROMA_SCROLL = 0.004;
const LERP = 0.1;
const SNAP_DUR = 1.2;
const SLOTS = 13;
const FOV = 45;
/* o card do original mede 480 px numa tela de ~1440 (um terço); "maior"
   (16/09): 44% da largura, com teto para não estourar a altura do palco */
const CARD_FRAC = 0.44;
const CARD_MIN = 280;
const CARD_MAX = 900;
const ASPECTO = 3 / 2;

const VERT = /* glsl */ `
#define PI 3.141592653589793
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uCard;
uniform float uHover;
uniform float uScale;
uniform float uBarrel;
uniform float uWorldX;
uniform float uHalfView;
uniform float uVel;
uniform float uBowl;
varying vec2 vUv;
void main() {
  vUv = uv;
  float s = uScale + uHover * 0.02;
  vec3 pos = vec3(position.xy * uCard * s, 0.0);
  float nx = (uWorldX + pos.x) / uHalfView;
  float vel = clamp(uVel, -8.0, 8.0);
  pos.y -= sin(nx * PI * 0.5) * vel * -1.5;
  pos.z -= nx * nx * ${BARREL_STR.toFixed(1)} * uBarrel;
  float ly = pos.y / (uCard.y * 0.5 * s);
  float d = sqrt(nx * nx + ly * ly);
  float fall = max(0.0, 1.0 - d / ${BOWL_RADIUS.toFixed(1)});
  pos.z += pow(sin(fall * PI * 0.5), ${BOWL_FALLOFF.toFixed(1)}) * uBowl;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform float uTexAspect;
uniform float uDist;
uniform float uOpacity;
uniform float uBarrel;
uniform float uTime;
uniform float uVel;
uniform float uMouseEnter;
uniform vec2 uMouse;
varying vec2 vUv;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
const float CARD_ASPECT = 1.5;
vec2 coverUV(vec2 uv, float texAspect) {
  vec2 s = vec2(1.0);
  if (texAspect > CARD_ASPECT) s.x = CARD_ASPECT / texAspect; else s.y = texAspect / CARD_ASPECT;
  return (uv - 0.5) * s + 0.5;
}
void main() {
  vec2 uv = coverUV(vUv, uTexAspect);
  float ar = 1.0 / 1.5;
  float circle = 1.0 - distance(vec2(uMouse.x, (1.0 - uMouse.y) * ar), vec2(vUv.x, vUv.y * ar)) * 12.0;
  float noise = snoise(gl_FragCoord.xy + uTime * 0.5);
  float intensity = uMouseEnter + abs(uVel) * 0.08;
  uv += circle * noise * 0.008 * intensity;
  float ab = uDist * ${CHROMA_BASE} + uBarrel * ${CHROMA_SCROLL} + abs(uVel) * 0.0004;
  float r = texture2D(uTexture, uv + vec2(ab, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(ab, 0.0)).b;
  vec3 col = vec3(r, g, b) + snoise(gl_FragCoord.xy * 0.5 + uTime * 100.0) * 0.03;
  gl_FragColor = vec4(col, uOpacity);
}`;

export type CartoesWebGL = {
  destruir(): void;
  /** leva a fita até o projeto i (índice da lista) */
  irPara(i: number): void;
};
/** um card na tela, neste quadro: projeto, centro em px a partir do meio, escala, opacidade */
export type QuadroCard = { proj: number; x: number; sc: number; op: number };
export type Ponteiro = { centro: boolean; x: number; y: number; proj: number } | null;

/** opções da fita — o padrão é a /work; a home (28/09) liga a faixa "plana" */
export type OpcoesCartoes = {
  /** o card do centro em escala 1 e os outros menores (padrão: sim) */
  destaque?: boolean;
  /** chips de disciplina assados na textura (padrão: sim) */
  tags?: boolean;
  /** fração da largura que um card ocupa (padrão 0,44) */
  fracao?: number;
  /** a roda em QUALQUER ponto da janela anda a fita (home, que não rola) */
  rodaGlobal?: boolean;
  /** multiplica o barril e a tigela — a CURVATURA dos cards (padrão 1) */
  curva?: number;
  /** página que ROLA (home one page): a roda vertical é da página; a fita só
      anda por arrasto e pela rolagem horizontal do trackpad */
  soHorizontal?: boolean;
};

export type Carta = { src: string; nome: string; tags: string[] };

const TEX_W = 1800;
const TEX_H = TEX_W / ASPECTO;
const K = TEX_W / 634;
function assarCarta(im: HTMLImageElement, carta: Carta, comTags = true): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d")!;
  /* a capa em cover */
  const ia = im.naturalWidth / im.naturalHeight;
  let dw = TEX_W;
  let dh = TEX_H;
  if (ia > ASPECTO) dw = TEX_H * ia;
  else dh = TEX_W / ia;
  ctx.drawImage(im, (TEX_W - dw) / 2, (TEX_H - dh) / 2, dw, dh);
  const pad = 12 * K;
  /* chips, da direita para a esquerda */
  ctx.font = `500 ${12 * K}px Geist, ui-sans-serif, sans-serif`;
  ctx.textBaseline = "middle";
  const chipH = (12 * 1.25 + 10) * K;
  let x = TEX_W - pad;
  const cy = TEX_H - pad - chipH / 2;
  for (const t of comTags ? [...carta.tags].reverse() : []) {
    const tw = ctx.measureText(t).width + 16 * K;
    x -= tw;
    ctx.fillStyle = "rgba(0,0,0,0.54)";
    ctx.beginPath();
    ctx.roundRect(x, cy - chipH / 2, tw, chipH, 3 * K);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(t, x + 8 * K, cy + 0.5 * K);
    x -= 8 * K;
  }
  /* o nome, com a sombra difusa que lê em capa clara e escura */
  ctx.font = `500 ${20 * K}px Geist, ui-sans-serif, sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 14 * K;
  ctx.shadowOffsetY = 1 * K;
  ctx.fillStyle = "#fff";
  ctx.fillText(carta.nome, pad, TEX_H - pad - 6 * K);
  return c;
}

export function criarCartoesWebGL(
  alvo: HTMLElement,
  fontes: Carta[],
  ganchos: {
    aoMudarAtivo: (i: number) => void;
    aoAbrir: (i: number) => void;
    /** a cada quadro: onde cada card está — quem desenha rótulo em DOM lê daqui */
    aoQuadro?: (cards: QuadroCard[], card: { w: number; h: number }) => void;
    /** o ponteiro sobre um card (centro ou não) ou fora de todos */
    aoPonteiro?: (p: Ponteiro) => void;
  },
  opcoes: OpcoesCartoes = {},
): CartoesWebGL | null {
  const { aoMudarAtivo, aoAbrir, aoQuadro, aoPonteiro } = ganchos;
  const destaque = opcoes.destaque ?? true;
  const comTags = opcoes.tags ?? true;
  const fracao = opcoes.fracao ?? CARD_FRAC;
  const curva = opcoes.curva ?? 1;
  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y";
  alvo.appendChild(canvas);

  const n = fontes.length;
  const camera = new Camera(gl, { fov: FOV, near: 1, far: 6000 });
  const cena = new Transform();
  /* geometria UNITÁRIA (1 × 1); o tamanho em px (3:2) entra por uniform e
     multiplica x e y, então o resize não recria geometria */
  const geo = new Plane(gl, { width: 1, height: 1, widthSegments: 64, heightSegments: 32 });

  /* ⚠ mipmaps ligados: a textura de 1800 cai para 280–900 px na tela e, sem
     eles, o texto do rótulo cintila. O OGL abre WebGL2 quando há, e lá
     mipmap não exige potência de dois. */
  const fontePronta = document.fonts.load("500 20px Geist").catch(() => []);
  const texturas = fontes.map((carta) => {
    const tex = new Texture(gl, { generateMipmaps: true, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE, minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR, flipY: true });
    const im = new Image();
    im.onload = () => {
      fontePronta.then(() => {
        tex.image = assarCarta(im, carta, comTags);
        tex.needsUpdate = true;
        (tex as Texture & { aspecto?: number }).aspecto = ASPECTO;
      });
    };
    im.src = carta.src;
    return tex;
  });

  const card = { w: 480, h: 270 };
  const slots = Array.from({ length: SLOTS }, () => {
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      cullFace: null,
      uniforms: {
        uTexture: { value: texturas[0] },
        uTexAspect: { value: ASPECTO },
        uCard: { value: [card.w, card.h] },
        uDist: { value: 0 },
        uHover: { value: 0 },
        uOpacity: { value: 0 },
        uScale: { value: 1 },
        uBarrel: { value: 0 },
        uWorldX: { value: 0 },
        uHalfView: { value: 700 },
        uTime: { value: 0 },
        uVel: { value: 0 },
        uBowl: { value: 0 },
        uMouseEnter: { value: 0 },
        uMouse: { value: new Vec2(0.5, 0.5) },
      },
    });
    const mesh = new Mesh(gl, { geometry: geo, program });
    /* ⚠ o OGL faz frustum culling pela geometria — que aqui é 1×1 px, porque o
       tamanho real entra por uniform. Sem desligar, o card que só ENTRA pela
       borda da tela era cortado inteiro ("bugou na direita e na esquerda, ele
       some"): o centro dele está fora do frustum, o corpo não. */
    mesh.frustumCulled = false;
    mesh.setParent(cena);
    return { mesh, program, proj: 0 };
  });

  /* ── tamanho: unidade = pixel ─────────────────────────────────────────── */
  let halfW = 700;
  const dimensionar = () => {
    const w = alvo.clientWidth || 1;
    const h = alvo.clientHeight || 1;
    renderer.setSize(w, h);
    camera.perspective({ aspect: w / h });
    camera.position.z = h / 2 / Math.tan((FOV / 2) * (Math.PI / 180));
    halfW = w / 2;
    card.w = Math.min(CARD_MAX, Math.max(destaque ? CARD_MIN : 120, w * fracao), (h * (destaque ? 0.78 : 0.96)) * ASPECTO);
    card.h = card.w / ASPECTO;
    slots.forEach((s) => (s.program.uniforms.uCard.value = [card.w, card.h]));
    /* a legenda em DOM se pendura logo abaixo do card do centro */
    alvo.style.setProperty("--card-h", `${Math.round(card.h)}px`);
    alvo.style.setProperty("--card-w", `${Math.round(card.w)}px`);
  };
  const ro = new ResizeObserver(dimensionar);
  ro.observe(alvo);
  dimensionar();

  /* ── estado do scroll ─────────────────────────────────────────────────── */
  const passo = () => card.w + GAP;
  /* começa no PRIMEIRO projeto no centro (o original começa no segundo) */
  let alvoS = 0;
  let atualS = 0;
  let anteriorS = 0;
  let velSuave = 0;
  let arrastando = false;
  let snap: gsap.core.Tween | null = null;
  let barrilTw: gsap.core.Tween | null = null;
  const barril = { v: 0 };
  const tigela = { v: 0 };
  const histVel: number[] = [];
  let picoVel = 0;
  let framesDesacel = 0;
  let tempo = 0;
  let ativo = -1;
  let passoAnterior = passo();
  let vivo = true;

  const snapPara = (destino: number, dur: number) => {
    snap?.kill();
    const st = { x: alvoS };
    snap = gsap.to(st, { x: destino, duration: dur, ease: "power4.out", onUpdate: () => (alvoS = st.x), onComplete: () => (snap = null) });
  };
  const snapMaisProximo = (proj = 0, dur = SNAP_DUR) => {
    const tw = passo();
    snapPara(Math.round((alvoS + proj) / tw) * tw, dur);
  };
  const barrilSobe = (dur: number) => {
    if (barril.v >= 0.5) return;
    barrilTw?.kill();
    barrilTw = gsap.to(barril, { v: 1, duration: dur, ease: "power2.out" });
  };
  const barrilDesce = (delay = 0) => {
    barrilTw?.kill();
    barrilTw = gsap.to(barril, { v: 0, duration: BARREL_DOWN, ease: "power2.inOut", delay });
  };

  /* ── o quadro ─────────────────────────────────────────────────────────── */
  const tick = (_t: number, dtMs: number) => {
    if (!vivo) return;
    tempo += dtMs / 1000;
    if (!snap) atualS += (alvoS - atualS) * (arrastando ? 0.25 : LERP);
    const velInst = atualS - anteriorS;
    anteriorS = atualS;
    velSuave += (velInst - velSuave) * 0.1;

    /* tigela: pico de velocidade (Codegrid) */
    const absVel = Math.abs(velSuave);
    histVel.push(absVel);
    if (histVel.length > 5) histVel.shift();
    const media = histVel.reduce((a, b) => a + b, 0) / histVel.length;
    if (media < picoVel * 0.95) framesDesacel++;
    else {
      framesDesacel = 0;
      picoVel = media;
    }
    const dir = velSuave > 0 ? 1 : velSuave < 0 ? -1 : 0;
    const alvoTigela = dir * Math.min(absVel * BOWL_STR, BOWL_STR * 50);
    if (framesDesacel < 3) tigela.v += (alvoTigela - tigela.v) * BOWL_SMOOTH;
    else {
      tigela.v += (0 - tigela.v) * BOWL_SMOOTH * 0.5;
      if (Math.abs(tigela.v) < 0.01) {
        tigela.v = 0;
        picoVel = 0;
        framesDesacel = 0;
        histVel.length = 0;
      }
    }

    /* o passo muda no resize: reescala o scroll para o card do centro ficar */
    const tw = passo();
    if (tw !== passoAnterior && passoAnterior > 0) {
      const r = tw / passoAnterior;
      alvoS *= r;
      atualS *= r;
      anteriorS *= r;
    }
    passoAnterior = tw;
    const total = n * tw;
    const wrapped = ((atualS % total) + total) % total;
    const slotCentro = Math.floor(wrapped / tw);
    const offset = wrapped - slotCentro * tw;
    const meio = Math.floor(SLOTS / 2);

    const escalas: number[] = new Array(SLOTS);
    for (let s = 0; s < SLOTS; s++) {
      const so = s - meio;
      slots[s].proj = (((slotCentro + so) % n) + n) % n;
      const rawX = so * tw - offset;
      const d = Math.min(Math.abs(rawX) / (halfW * 0.8), 1);
      escalas[s] = destaque ? 1 - d * HIGHLIGHT : 1;
    }
    /* borda a borda a partir do centro: o gap é visual, não de passo */
    const pos: number[] = new Array(SLOTS);
    pos[meio] = -offset;
    for (let s = meio + 1; s < SLOTS; s++) pos[s] = pos[s - 1] + (card.w * escalas[s - 1]) / 2 + GAP + (card.w * escalas[s]) / 2;
    for (let s = meio - 1; s >= 0; s--) pos[s] = pos[s + 1] - (card.w * escalas[s + 1]) / 2 - GAP - (card.w * escalas[s]) / 2;

    let maisPerto = 0;
    let distMin = Infinity;
    for (let s = 0; s < SLOTS; s++) {
      const { mesh, program, proj } = slots[s];
      const u = program.uniforms;
      const tex = texturas[proj] as Texture & { aspecto?: number };
      u.uTexture.value = tex;
      if (tex.aspecto) u.uTexAspect.value = tex.aspecto;
      const x = pos[s];
      mesh.position.x = x;
      mesh.position.y = 0;
      u.uScale.value = escalas[s];
      u.uDist.value = Math.min(Math.abs(x) / (halfW * 0.8), 1);
      const borda = Math.abs(x) / halfW;
      const op = borda < 1.2 ? 1 : borda > 2 ? 0 : 1 - (borda - 1.2) / 0.8;
      u.uOpacity.value = tex.image ? op : 0;
      u.uBarrel.value = barril.v * curva;
      u.uWorldX.value = x;
      u.uHalfView.value = halfW * 1.2;
      u.uTime.value = tempo;
      u.uVel.value = velSuave;
      u.uBowl.value = tigela.v * curva;
      mesh.visible = op > 0;
      if (Math.abs(x) < distMin) {
        distMin = Math.abs(x);
        maisPerto = proj;
      }
    }
    if (maisPerto !== ativo) {
      ativo = maisPerto;
      aoMudarAtivo(ativo);
    }
    aoQuadro?.(
      slots.filter((k) => k.mesh.visible).map((k) => ({ proj: k.proj, x: k.mesh.position.x, sc: k.program.uniforms.uScale.value as number, op: k.program.uniforms.uOpacity.value as number })),
      card,
    );
    renderer.render({ scene: cena, camera });
    if (import.meta.env.DEV || (window as unknown as { __sonda?: boolean }).__sonda) {
      (window as unknown as Record<string, unknown>).__cartoes = {
        halfW,
        card: { ...card },
        slots: slots.map((k) => ({ proj: k.proj, x: +k.mesh.position.x.toFixed(0), sc: +(k.program.uniforms.uScale.value as number).toFixed(3), op: +(k.program.uniforms.uOpacity.value as number).toFixed(2), vis: k.mesh.visible, tex: !!(k.program.uniforms.uTexture.value as Texture).image })),
      };
    }
  };
  gsap.ticker.add(tick);

  /* ── ponteiro: arrasto, hover, clique ─────────────────────────────────── */
  /* sem raycast: a unidade do mundo é o pixel e a câmera olha reto, então o
     ponto do ponteiro em z=0 é o deslocamento até o centro do canvas — e cada
     card é um retângulo (posição × escala) nesse plano */
  let hover: (typeof slots)[number] | null = null;
  let x0 = 0;
  let s0 = 0;
  let ultX = 0;
  let ultT = 0;
  let vel = 0;
  let moveu = 0;

  const slotSob = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left - r.width / 2;
    const py = r.height / 2 - (e.clientY - r.top);
    let melhor: { slot: (typeof slots)[number]; uv: Vec2; dist: number } | null = null;
    for (const slot of slots) {
      if (!slot.mesh.visible) continue;
      const sc = slot.program.uniforms.uScale.value as number;
      const w = card.w * sc;
      const h = card.h * sc;
      const dx = px - slot.mesh.position.x;
      if (Math.abs(dx) > w / 2 || Math.abs(py) > h / 2) continue;
      const dist = Math.abs(slot.mesh.position.x);
      if (!melhor || dist < melhor.dist) melhor = { slot, uv: new Vec2(dx / w + 0.5, py / h + 0.5), dist };
    }
    return melhor;
  };

  const onDown = (e: PointerEvent) => {
    arrastando = true;
    moveu = 0;
    x0 = e.clientX;
    s0 = alvoS;
    ultX = x0;
    ultT = performance.now();
    vel = 0;
    snap?.kill();
    snap = null;
    barrilSobe(BARREL_UP);
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    if (arrastando) {
      const dx = e.clientX - x0;
      moveu = Math.max(moveu, Math.abs(dx));
      alvoS = s0 - dx;
      const agora = performance.now();
      const dt = agora - ultT;
      if (dt > 0) vel = (ultX - e.clientX) / dt;
      ultX = e.clientX;
      ultT = agora;
      return;
    }
    const sob = slotSob(e);
    const novo = sob?.slot ?? null;
    if (novo !== hover) {
      if (hover) {
        gsap.to(hover.program.uniforms.uHover, { value: 0, duration: 0.3 });
        gsap.to(hover.program.uniforms.uMouseEnter, { value: 0, duration: 0.6, ease: "power2.out" });
      }
      hover = novo;
      if (hover) {
        gsap.to(hover.program.uniforms.uHover, { value: 1, duration: 0.3 });
        gsap.to(hover.program.uniforms.uMouseEnter, { value: 1, duration: 0.6, ease: "power2.out" });
      }
    }
    if (hover && sob?.uv) (hover.program.uniforms.uMouse.value as Vec2).set(sob.uv.x, sob.uv.y);
    /* sem destaque não existe "o do centro": todo card é igual e abre no clique */
    const noCentro = destaque && !!hover && Math.abs(hover.mesh.position.x) < card.w / 2;
    /* no centro o cursor nativo some: o "View Case" em DOM é o cursor */
    canvas.style.cursor = noCentro ? "none" : hover ? "pointer" : "grab";
    aoPonteiro?.(hover ? { centro: noCentro, x: e.clientX, y: e.clientY, proj: hover.proj } : null);
  };
  const onLeave = () => aoPonteiro?.(null);
  const onUp = (e: PointerEvent) => {
    if (!arrastando) return;
    arrastando = false;
    canvas.style.cursor = "grab";
    /* clique (sem arrasto): centro abre; lateral vai até lá */
    if (moveu < 6) {
      const sob = slotSob(e);
      if (sob) {
        const x = sob.slot.mesh.position.x;
        if (!destaque || Math.abs(x) < card.w / 2) {
          barrilDesce();
          aoAbrir(sob.slot.proj);
          return;
        }
        snapPara(alvoS + x, SNAP_DUR);
        barrilDesce(0.15);
        return;
      }
    }
    const tw = passo();
    const projetado = alvoS + vel * 400;
    const destino = Math.round(projetado / tw) * tw;
    const dur = Math.max(SNAP_DUR, Math.min(Math.abs(destino - alvoS) / 400, 2.5));
    snapPara(destino, dur);
    barrilDesce(0.15);
  };
  let rodaTimer: ReturnType<typeof setTimeout> | null = null;
  const onWheel = (e: WheelEvent) => {
    if (opcoes.soHorizontal && Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    snap?.kill();
    snap = null;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    alvoS += d;
    barrilSobe(0.3);
    if (rodaTimer) clearTimeout(rodaTimer);
    rodaTimer = setTimeout(() => {
      barrilDesce();
      snapMaisProximo();
    }, 200);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  const alvoRoda: HTMLElement | Window = opcoes.rodaGlobal ? window : canvas;
  alvoRoda.addEventListener("wheel", onWheel as EventListener, { passive: false });

  return {
    irPara(i) {
      const tw = passo();
      const total = n * tw;
      /* o slot do centro é o índice `round(atualS/tw) mod n`; anda o menor caminho */
      const atualIdx = Math.round(alvoS / tw);
      let delta = i - ((((atualIdx) % n) + n) % n);
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      void total;
      snapPara((atualIdx + delta) * tw, SNAP_DUR);
    },
    destruir() {
      vivo = false;
      gsap.ticker.remove(tick);
      snap?.kill();
      barrilTw?.kill();
      if (rodaTimer) clearTimeout(rodaTimer);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      alvoRoda.removeEventListener("wheel", onWheel as EventListener);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
