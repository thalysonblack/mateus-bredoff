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

const FRAG_CAPA = /* glsl */ `
precision highp float;
uniform sampler2D tMap; uniform vec4 uRect; uniform float uClipTop; uniform float uReady;
varying vec2 vUv;
void main() {
  vec2 p = vUv * uRect.zw;
  vec2 q = abs(p - uRect.zw * 0.5) - (uRect.zw * 0.5 - 4.0);
  if (length(max(q, 0.0)) > 4.0) discard;                 /* raio 4px do .rc-quadro */
  if (1.0 - vUv.y < uClipTop) discard;                    /* clip-path do reveal */
  gl_FragColor = vec4(texture2D(tMap, vUv).rgb, uReady);
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
      uniforms: { tMap: { value: new Texture(gl) }, uRect: { value: [0, 0, 1, 1] }, uView: { value: [1, 1] }, uClipTop: { value: 0 }, uReady: { value: 0 } },
    });
    const mesh = new Mesh(gl, { geometry: geoCapa, program, frustumCulled: false });
    mesh.visible = false;
    mesh.setParent(cenaFBO);
    return { quadro, img, program, mesh, carregando: false };
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

  let bend = BEND_MIN, ultimo = "";
  const tick = (_t: number, dt: number) => {
    const velocidade = Math.abs(scrollAtual - scrollAnterior) / PX_POR_INDICE;
    scrollAnterior = scrollAtual;
    bend += (BEND_MIN + Math.min(velocidade * 6, 1) * (BEND_MAX - BEND_MIN) - bend) * BEND_LERP;
    const u = progTela.uniforms;
    u.uDistort.value += (Math.min(velocidade * 3, 0.6) - u.uDistort.value) * 0.05;
    if (bend < 1e-4) bend = 0;
    if (u.uDistort.value < 1e-4) u.uDistort.value = 0;
    u.uBend.value = bend;
    u.uTime.value += dt / 1000;

    let assinatura = `${bend},${u.uDistort.value}`;
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
      assinatura += `|${r.left},${r.top},${r.width},${r.height},${pu.uClipTop.value}`;
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
    removeEventListener("resize", onResize);
    raiz.classList.remove("is-gl");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  };
}
