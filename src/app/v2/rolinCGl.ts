/**
 * ROLIN C — a coluna de capas com o WebGL do /archive (o mesmo de `lib/arquivoWebGL.ts`, pedido
 * dele: "o webgl no scroll igual nos outros"). Mesma arquitetura de duas passadas e mesmas
 * constantes: as capas são desenhadas CHAPADAS num FBO, e o FBO vira textura de UM plano curvo em
 * perspectiva. uBend 0 → 0,9 e uDistort 0 → 0,6 saem da VELOCIDADE do scroll; parado, plano e limpo.
 *
 * O que muda em relação à Work, e só porque aqui a coluna é o DOM da página:
 * - 1ª passada: cada capa vai para o FBO na posição DOM dela (getBoundingClientRect), em pixel;
 * - a tela curva preenche o frustum exato, então com bend 0 o pixel do FBO cai no pixel da <img>;
 * - a lente-base (0,08) e o grão crescem com uDistort em vez de existir parado — senão a capa
 *   parada sairia empenada contra a legenda do DOM. No pico (0,6) os valores são os da Work;
 * - velocidade: Δscroll do Lenis ÷ 420 px — os 420 px de wheel que valem 1 índice na Work.
 */
import { Renderer, Camera, Program, Mesh, Plane, Texture, Transform, RenderTarget } from "ogl";
import { gsap } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import { VERT_TELA, BEND_MIN, BEND_MAX, BEND_LERP } from "../../lib/arquivoWebGL";

const PX_POR_INDICE = 420;
/* 15/10: "tá distorcendo muito" — a Rolin C usa ~45% da curva e da lente da Work */
const FORCA = 0.45;

const VERT_CAPA = /* glsl */ `
attribute vec3 position; attribute vec2 uv;
uniform vec4 uRect; uniform vec2 uView;
varying vec2 vUv;
void main() {
  vUv = uv;
  float px = uRect.x + uv.x * uRect.z;
  float py = uRect.y + (1.0 - uv.y) * uRect.w;
  gl_Position = vec4(px / uView.x * 2.0 - 1.0, 1.0 - py / uView.y * 2.0, 0.0, 1.0);
}`;

/* 15/10: "aquele efeitinho do carrossel do work" — o fragment do cartoesWebGL com os MESMOS números
   (aberração 0,002·dist + 0,004 em movimento + 0,0004·|vel|; grão 0,03; círculo de ruído ×12 · 0,008).
   ⚠ Diferenças: base e grão multiplicam por uMov (0 parado → 1 rolando) — parado a capa sai igual à <img>;
   a velocidade (Δscroll px/quadro) é limitada a 8 e × FORCA, e o ruído só acontece sob o cursor. */
const FRAG_CAPA = /* glsl */ `
precision highp float;
uniform sampler2D tMap; uniform vec4 uRect; uniform float uClipTop; uniform float uReady; uniform float uImgAspect;
uniform float uMov; uniform float uVel; uniform float uDist; uniform float uTime; uniform float uMouseEnter; uniform vec2 uMouse;
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
void main() {
  vec2 p = vUv * uRect.zw;
  vec2 q = abs(p - uRect.zw * 0.5) - (uRect.zw * 0.5 - 4.0);
  if (length(max(q, 0.0)) > 4.0) discard;                 /* raio 4px do .rc-quadro */
  if (1.0 - vUv.y < uClipTop) discard;                    /* clip-path do reveal */
  /* object-fit: cover — a textura recorta como a <img>, nunca estica */
  float caixa = uRect.z / uRect.w;
  vec2 esc = caixa > uImgAspect ? vec2(1.0, uImgAspect / caixa) : vec2(caixa / uImgAspect, 1.0);
  vec2 uvc = (vUv - 0.5) * esc + 0.5;
  float ar = uRect.w / uRect.z;
  float circle = 1.0 - distance(vec2(uMouse.x, uMouse.y * ar), vec2(vUv.x, vUv.y * ar)) * 12.0;
  float vel = clamp(abs(uVel), 0.0, 8.0) * ${FORCA.toFixed(2)};  /* ±8 = o clamp do vertex da Work; × FORCA */
  float intensity = uMouseEnter * (1.0 + vel * 0.08);            /* o spray só onde o cursor está */
  uvc += max(circle, 0.0) * snoise(gl_FragCoord.xy + uTime * 0.5) * 0.008 * intensity;
  float ab = uMov * (uDist * 0.002 + 0.004) + vel * 0.0004;
  float r = texture2D(tMap, uvc + vec2(ab, 0.0)).r;
  float gg = texture2D(tMap, uvc).g;
  float b = texture2D(tMap, uvc - vec2(ab, 0.0)).b;
  vec3 col = vec3(r, gg, b) + snoise(gl_FragCoord.xy * 0.5 + uTime * 100.0) * 0.03 * uMov;
  gl_FragColor = vec4(col, uReady);
}`;

/* o FRAG_TELA da Work, com a lente-base e o grão proporcionais a uDistort (ver cabeçalho) */
const FRAG_TELA = /* glsl */ `
precision highp float;
uniform sampler2D uScreen; uniform float uTime; uniform float uDistort;
varying vec2 vUv;
vec2 barril(vec2 uv, float forca) { vec2 c = uv - 0.5; return c * (1.0 + dot(c, c) * forca) + 0.5; }
float grao(vec2 uv, float t) { return fract(sin(dot(uv * t, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  float k = uDistort / 0.6;
  vec2 uv = barril(vUv, 0.08 * k + uDistort * 0.5);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0); return; }
  vec4 cor = texture2D(uScreen, uv);
  cor.rgb += (grao(vUv, uTime * 0.1 + 1.0) - 0.5) * 0.025 * k;
  gl_FragColor = cor;
}`;

export function montarCapasGl(raiz: HTMLElement): (() => void) | null {
  const lenis = getLenis();
  if (!lenis || window.innerWidth < 900) return null;

  let renderer: Renderer;
  try { renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), alpha: true, premultipliedAlpha: false }); }
  catch { return null; }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "1" });
  raiz.appendChild(canvas);

  /* ── 1ª passada: capas chapadas no FBO, na posição DOM ── */
  const cenaFBO = new Transform();
  const geoCapa = new Plane(gl);
  const vista = { x: innerWidth, y: innerHeight };
  let fbo = new RenderTarget(gl, { width: 1, height: 1 });

  const planos = Array.from(raiz.querySelectorAll<HTMLElement>(".rc-quadro")).map((quadro) => {
    const img = quadro.querySelector("img")!;
    const program = new Program(gl, {
      vertex: VERT_CAPA, fragment: FRAG_CAPA, transparent: true,
      uniforms: { tMap: { value: new Texture(gl) }, uRect: { value: [0, 0, 1, 1] }, uView: { value: [1, 1] }, uClipTop: { value: 0 }, uReady: { value: 0 }, uImgAspect: { value: 1 },
        uMov: { value: 0 }, uVel: { value: 0 }, uDist: { value: 0 }, uTime: { value: 0 }, uMouseEnter: { value: 0 }, uMouse: { value: [0.5, 0.5] } },
    });
    const mesh = new Mesh(gl, { geometry: geoCapa, program, frustumCulled: false });
    mesh.visible = false;
    mesh.setParent(cenaFBO);
    return { quadro, img, program, mesh, carregando: false, dentro: false as boolean | undefined };
  });

  /* ── 2ª passada: a tela curva da Work, enchendo o frustum exato ── */
  const camTela = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
  camTela.position.z = 4;
  const alturaFrustum = 2 * 4 * Math.tan((45 / 2) * Math.PI / 180);
  const cenaTela = new Transform();
  const progTela = new Program(gl, {
    vertex: VERT_TELA, fragment: FRAG_TELA, cullFace: null, transparent: true,
    uniforms: { uScreen: { value: fbo.texture }, uBend: { value: BEND_MIN }, uDistort: { value: 0 }, uTime: { value: 0 } },
  });
  let tela: Mesh | null = null;

  /* textura sob demanda: quando a capa chega a 1 tela de distância */
  let sujo = true;
  const carregar = (pl: (typeof planos)[number]) => {
    pl.carregando = true;
    pl.img.loading = "eager";
    const fim = () => {
      pl.program.uniforms.tMap.value = new Texture(gl, { image: pl.img, generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, flipY: true });
      pl.program.uniforms.uReady.value = 1;
      pl.program.uniforms.uImgAspect.value = pl.img.naturalWidth / pl.img.naturalHeight;
      sujo = true;
    };
    pl.img.decode().then(fim, () => { if (pl.img.complete && pl.img.naturalWidth) fim(); });
  };

  const onResize = () => {
    vista.x = innerWidth; vista.y = innerHeight;
    renderer.setSize(vista.x, vista.y);
    camTela.perspective({ aspect: vista.x / vista.y });
    fbo = new RenderTarget(gl, { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight });
    progTela.uniforms.uScreen.value = fbo.texture;
    tela?.setParent(null);
    tela = new Mesh(gl, {
      geometry: new Plane(gl, { width: alturaFrustum * vista.x / vista.y, height: alturaFrustum, widthSegments: 64, heightSegments: 64 }),
      program: progTela,
    });
    tela.setParent(cenaTela);
    sujo = true;
  };
  addEventListener("resize", onResize);
  onResize();

  /* velocidade = Δscroll do evento do Lenis, em índices da Work */
  let scrollAtual = lenis.scroll, scrollAnterior = lenis.scroll;
  const onScroll = (l: { scroll: number }) => { scrollAtual = l.scroll; };
  lenis.on("scroll", onScroll);

  /* hover: o canvas não recebe ponteiro (pointer-events none), então o mouse vem da janela */
  const mouse = { x: -1, y: -1 };
  const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  addEventListener("pointermove", onMove, { passive: true });

  let bend = BEND_MIN, ultimo = "", mov = 0, velSuave = 0;
  const tick = (_t: number, dt: number) => {
    const velocidade = Math.abs(scrollAtual - scrollAnterior) / PX_POR_INDICE;
    velSuave += (scrollAtual - scrollAnterior - velSuave) * 0.1;   /* px/quadro, como o uVel da Work */
    scrollAnterior = scrollAtual;
    mov += (Math.min(velocidade * 6, 1) - mov) * BEND_LERP;
    if (mov < 1e-3) mov = 0;
    if (Math.abs(velSuave) < 1e-2) velSuave = 0;
    bend += (BEND_MIN + Math.min(velocidade * 6, 1) * (BEND_MAX - BEND_MIN) * FORCA - bend) * BEND_LERP;
    const u = progTela.uniforms;
    u.uDistort.value += (Math.min(velocidade * 3, 0.6) * FORCA - u.uDistort.value) * 0.05;
    if (bend < 1e-4) bend = 0;
    if (u.uDistort.value < 1e-4) u.uDistort.value = 0;
    u.uBend.value = bend;
    u.uTime.value += dt / 1000;

    let assinatura = `${bend},${u.uDistort.value},${mov},${velSuave}`;
    for (const pl of planos) {
      const r = pl.quadro.getBoundingClientRect();
      if (!pl.carregando && r.bottom > -vista.y && r.top < vista.y * 2) carregar(pl);
      pl.mesh.visible = r.bottom > 0 && r.top < vista.y;
      if (!pl.mesh.visible) continue;
      const clip = /inset\(([\d.]+)%/.exec(pl.quadro.style.clipPath)?.[1];
      const pu = pl.program.uniforms;
      pu.uRect.value = [r.left, r.top, r.width, r.height];
      pu.uView.value = [vista.x, vista.y];
      pu.uClipTop.value = clip ? parseFloat(clip) / 100 : 0;
      const dentro = mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
      if (dentro !== (pl.dentro ?? false)) {
        pl.dentro = dentro;
        gsap.to(pu.uMouseEnter, { value: dentro ? 1 : 0, duration: 0.6, ease: "power2.out", overwrite: true });
      }
      if (dentro) pu.uMouse.value = [(mouse.x - r.left) / r.width, (mouse.y - r.top) / r.height];
      pu.uMov.value = mov; pu.uVel.value = velSuave; pu.uTime.value = u.uTime.value;
      pu.uDist.value = Math.min(Math.abs(r.top + r.height / 2 - vista.y / 2) / (vista.y / 2 * 0.8), 1);
      /* ruído animado: enquanto há hover ou movimento, todo quadro é novo */
      const vivo = pu.uMouseEnter.value > 0 || mov > 0 ? u.uTime.value : 0;
      assinatura += `|${r.left},${r.top},${r.width},${r.height},${pu.uClipTop.value},${vivo}`;
    }
    if (assinatura === ultimo && !sujo) return;      /* parado: nem desenha */
    ultimo = assinatura; sujo = false;
    /* ⚠ ORDEM: capas → FBO, FBO → tela (igual à Work) */
    renderer.render({ scene: cenaFBO, target: fbo });
    renderer.render({ scene: cenaTela, camera: camTela });
  };
  gsap.ticker.add(tick);
  raiz.classList.add("is-gl");

  return () => {
    gsap.ticker.remove(tick);
    lenis.off("scroll", onScroll);
    removeEventListener("pointermove", onMove);
    for (const pl of planos) gsap.killTweensOf(pl.program.uniforms.uMouseEnter);
    removeEventListener("resize", onResize);
    raiz.classList.remove("is-gl");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  };
}
