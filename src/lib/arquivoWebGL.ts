/**
 * A COLUNA DO ARQUIVO, em WebGL — porte do `/archive` do repo dele.
 *
 * Ele apontou `framer-assets-five.vercel.app/archive`, eu entreguei uma
 * aproximação em DOM e o veredito foi: *"a work não ficou igual cara"*, *"vc vê
 * que tem uma distorção sabe"*, **"é só vc clonar de fato"**. Então isto é o
 * clone: mesma arquitetura de duas passadas e as MESMAS constantes lidas de
 * `src/components/archive/{WebGLPreview.tsx,shaders.ts}` do repo dele.
 *
 * ## A arquitetura, e por que ela é assim
 *
 *   1. os cards são desenhados CHAPADOS num FBO (render target 1024×1440),
 *      com câmera ortográfica — nenhuma perspectiva, nenhuma curva;
 *   2. o FBO vira textura de UM plano curvo, com câmera em perspectiva.
 *
 * A distorção que ele viu mora inteira no passo 2 e é isso que a aproximação em
 * DOM não podia ter: curvar cada card separadamente daria oito curvas; curvar a
 * TELA que os contém dá uma superfície só, e é ela que se dobra.
 *
 * ## O que reage à VELOCIDADE do scroll (não à posição)
 *
 *   uBend    0 parado → 0,9 rolando   — o cilindro que envolve a tela
 *   uDistort 0 → 0,6                  — a lente barril por cima
 *
 * Parado, a tela é plana e limpa. O gesto é que entorta a superfície, e é o que
 * faz a coluna parecer matéria física em vez de lista deslizando.
 *
 * ⚠ PORTE PARA OGL, não three: o projeto já usa OGL no visor da home
 * ([[reference-transicao-fluida-em-webgl]]), e three custaria ~600KB para
 * refazer o que estas 200 linhas fazem. As constantes, a matemática do bend e a
 * ordem das passadas são as do original.
 *
 * ⚠ E aqui a coluna é INFINITA, ao contrário da referência (lá o scroll é
 * clamped e trava no último). A distância vira circular antes de virar posição.
 */
import { Renderer, Camera, Transform, Program, Mesh, Plane, Texture, RenderTarget } from "ogl";

/* ── constantes, lidas do original ─────────────────────────────────────── */
const CARD_W = 2.25;
const CARD_H = 1.8;
const CARD_SPACING = 1.81;   /* vão quase zero: os cards se encostam */
const ACTIVE_SCALE = 1.0;
const INACTIVE_SCALE = 0.95;
const ACTIVE_OPACITY = 1.0;
/* ⚠⚠ SEM FADE — "em work o projeto não deve ter esse fade" (17/08).
   O original apaga as peças fora do foco (0,35), e eu tinha subido para 0,5
   porque as artes DELE são claras e sumiam. Ele cortou a ideia inteira: peça de
   portfólio não se mostra pela metade. A hierarquia fica com a POSIÇÃO (a
   enquadrada está no centro) e com a ESCALA — que é o bastante, porque a
   coluna já diz qual é a peça da vez pela própria geometria. */
const INACTIVE_OPACITY = 1.0;
const SCALE_RANGE = 0.6;     /* quão perto (em índice) para estar cheio */
const FBO_W = 1024;
const FBO_H = 1440;
const SCREEN_W = 4.5;
const SCREEN_H = 6.0;
const BEND_MIN = 0.0;        /* plano parado */
const BEND_MAX = 0.9;        /* envolve só enquanto rola */
const BEND_LERP = 0.045;
const FRUSTUM_H = 6;

const VERT_CARD = /* glsl */ `
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG_CARD = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(uTexture, vUv);
  color.rgb = pow(color.rgb, vec3(1.05));
  color.rgb = color.rgb * 1.05 - 0.025;
  color.a = uOpacity;
  gl_FragColor = color;
}`;

const VERT_TELA = /* glsl */ `
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uBend;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 pos = position;
  float t = smoothstep(0.0, 0.05, abs(uBend));

  float angleY = pos.y * uBend;
  float radiusY = 1.0 / max(abs(uBend), 0.001);
  pos.z += radiusY * (1.0 - cos(angleY)) * t;
  pos.y = mix(pos.y, radiusY * sin(angleY), t);

  float bendX = uBend * 0.3;
  float angleX = pos.x * bendX;
  float radiusX = 1.0 / max(abs(bendX), 0.001);
  pos.z += radiusX * (1.0 - cos(angleX)) * t;
  pos.x = mix(pos.x, radiusX * sin(angleX), t);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const FRAG_TELA = /* glsl */ `
precision highp float;
uniform sampler2D uScreen;
uniform float uTime;
uniform float uDistort;
varying vec2 vUv;

vec2 barril(vec2 uv, float forca) {
  vec2 c = uv - 0.5;
  return c * (1.0 + dot(c, c) * forca) + 0.5;
}
float grao(vec2 uv, float t) {
  return fract(sin(dot(uv * t, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float forca = 0.08 + uDistort * 0.5;
  vec2 uv = barril(vUv, forca);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec4 cor = texture2D(uScreen, uv);
  cor.rgb += (grao(vUv, uTime * 0.1 + 1.0) - 0.5) * 0.025;
  gl_FragColor = cor;
}`;

export type ArquivoWebGL = {
  /** índice flutuante da peça enquadrada (2,35 = entre a 3ª e a 4ª) */
  scroll(f: number): void;
  passo(dt: number): void;
  destruir(): void;
};

export function criarArquivoWebGL(alvo: HTMLElement, fontes: string[]): ArquivoWebGL | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.canvas.style.cssText = "display:block;width:100%;height:100%";
  alvo.appendChild(gl.canvas);

  const n = fontes.length;

  /* ── 1ª passada: os cards, chapados, em câmera ortográfica ───────────── */
  const aspecto = FBO_W / FBO_H;
  const camFBO = new Camera(gl, {
    left: (-FRUSTUM_H * aspecto) / 2,
    right: (FRUSTUM_H * aspecto) / 2,
    top: FRUSTUM_H / 2,
    bottom: -FRUSTUM_H / 2,
    near: 0.1,
    far: 100,
  });
  camFBO.position.z = 5;
  const cenaFBO = new Transform();
  const fbo = new RenderTarget(gl, { width: FBO_W, height: FBO_H });

  const geoCard = new Plane(gl, { width: CARD_W, height: CARD_H });
  const cards = fontes.map((_, i) => {
    const tex = new Texture(gl, {
      generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      flipY: true,
    });
    const program = new Program(gl, {
      vertex: VERT_CARD,
      fragment: FRAG_CARD,
      uniforms: { uTexture: { value: tex }, uOpacity: { value: i === 0 ? ACTIVE_OPACITY : INACTIVE_OPACITY } },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: geoCard, program });
    mesh.setParent(cenaFBO);
    return { mesh, program, tex };
  });

  /* ── 2ª passada: a tela curva mostrando o FBO ────────────────────────── */
  const camTela = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
  camTela.position.z = 4;
  const cenaTela = new Transform();
  const progTela = new Program(gl, {
    vertex: VERT_TELA,
    fragment: FRAG_TELA,
    uniforms: {
      uScreen: { value: fbo.texture },
      uBend: { value: BEND_MIN },
      uDistort: { value: 0 },
      uTime: { value: 0 },
    },
    cullFace: null, /* DoubleSide: a tela dobrada mostra o verso nas bordas */
    transparent: true,
  });
  new Mesh(gl, {
    geometry: new Plane(gl, { width: SCREEN_W, height: SCREEN_H, widthSegments: 64, heightSegments: 64 }),
    program: progTela,
  }).setParent(cenaTela);

  /* ── texturas ────────────────────────────────────────────────────────── */
  const carregadas: string[] = [];
  fontes.forEach((src, i) => {
    const im = new Image();
    im.onload = () => {
      cards[i].tex.image = im;
      cards[i].tex.needsUpdate = true;
      carregadas[i] = `${im.naturalWidth}x${im.naturalHeight}`;
    };
    im.onerror = () => {
      carregadas[i] = "ERRO";
    };
    im.src = src;
  });
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__arquivo = {
      estado: () => ({
        passos,
        carregadas,
        comTextura: cards.map((c) => !!c.tex.image),
        opacidades: cards.map((c) => +(c.program.uniforms.uOpacity.value as number).toFixed(2)),
        visiveis: cards.map((c) => c.mesh.visible),
        y: cards.map((c) => +c.mesh.position.y.toFixed(2)),
      }),
    };
  }

  const dimensionar = () => {
    const w = alvo.clientWidth || 1;
    const h = alvo.clientHeight || 1;
    renderer.setSize(w, h);
    camTela.perspective({ aspect: w / h });
  };
  const ro = new ResizeObserver(dimensionar);
  ro.observe(alvo);
  dimensionar();

  let sf = 0;
  let sfAnterior = 0;
  let bend = BEND_MIN;
  let vivo = true;
  let passos = 0;

  return {
    scroll(f) {
      sf = f;
    },
    passo(dt) {
      if (!vivo) return;
      passos++;
      progTela.uniforms.uTime.value += dt;

      /* ⭐ BEND E DISTORÇÃO SAEM DA VELOCIDADE, não da posição: parado a tela é
         plana e limpa, e é o GESTO que entorta a superfície. */
      const velocidade = Math.abs(sf - sfAnterior);
      sfAnterior = sf;
      const alvoBend = BEND_MIN + Math.min(velocidade * 6, 1) * (BEND_MAX - BEND_MIN);
      bend += (alvoBend - bend) * BEND_LERP;
      progTela.uniforms.uBend.value = bend;
      progTela.uniforms.uDistort.value +=
        (Math.min(velocidade * 3, 0.6) - progTela.uniforms.uDistort.value) * 0.05;

      cards.forEach(({ mesh, program }, i) => {
        /* ⚠ DISTÂNCIA CIRCULAR: é o que torna a coluna infinita com N meshes
           só. O original usa `i - sf` cru e por isso trava nas pontas. */
        let d = (((i - sf) % n) + n) % n;
        if (d > n / 2) d -= n;

        mesh.position.y = -d * CARD_SPACING;
        const prox = 1 - Math.min(Math.abs(d) / SCALE_RANGE, 1);
        const escala = INACTIVE_SCALE + (ACTIVE_SCALE - INACTIVE_SCALE) * prox;
        mesh.scale.set(escala, escala, 1);
        program.uniforms.uOpacity.value = INACTIVE_OPACITY + (ACTIVE_OPACITY - INACTIVE_OPACITY) * prox;
        mesh.visible = Math.abs(d) < 3;
      });

      /* ⚠ ORDEM DAS PASSADAS: cards → FBO, FBO → tela. Inverter mostra o frame
         anterior. */
      renderer.render({ scene: cenaFBO, camera: camFBO, target: fbo });
      renderer.render({ scene: cenaTela, camera: camTela });
    },
    destruir() {
      vivo = false;
      ro.disconnect();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
