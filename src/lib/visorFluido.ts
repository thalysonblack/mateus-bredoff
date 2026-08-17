/**
 * VISOR FLUIDO — a troca de arte dentro da máscara, em WebGL (OGL).
 *
 * Duas texturas e um campo de ruído: a arte nova invade a anterior por uma
 * frente de onda que atravessa lateralmente, e a borda dessa frente é deformada
 * pelo ruído — é isso que dá a leitura de líquido, e não um blur. A distorção
 * tem pico no meio da transição (`sin(π·p)`) e cai a quase zero nas pontas:
 * começar e terminar nítido é o que faz o efeito parecer material em vez de
 * filtro ligado.
 *
 * ⚠ A DIREÇÃO É A DA LINHA. A frente entra pelo mesmo lado de onde vem a fita
 * daquele nome — o eixo da troca é o eixo da peça
 * ([[craft-trocar-por-dentro-de-uma-mascara]]).
 *
 * OGL e não three: são ~50KB para Renderer + Program + Texture, que é
 * exatamente o que este efeito usa. O relógio continua sendo de fora —
 * `passo(dt)` é chamado pelo ticker do GSAP em `HomeD`, nunca por um
 * `requestAnimationFrame` próprio (regra do CLAUDE.md deste repo: um relógio
 * só).
 */
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uP;      /* 0 = só a anterior, 1 = só a nova */
uniform float uT;      /* tempo, em segundos */
uniform float uDir;    /* +1 a nova vem da direita, -1 da esquerda */
uniform float uCaixa;  /* razão da caixa (16/9) */
uniform float uArteA;  /* razão nativa de cada arte, para o cover */
uniform float uArteB;

/* value noise: hash + interpolação suave. Quatro oitavas bastam para a borda
   ler como líquido, e custam menos que carregar uma textura de ruído. */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * ruido(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

/* object-fit:cover feito no UV: a arte preenche a caixa sem deformar.
   (⚠ sem crases neste comentário: ele vive dentro de uma template literal.) */
vec2 cover(vec2 uv, float arte) {
  vec2 s = arte > uCaixa ? vec2(uCaixa / arte, 1.0) : vec2(1.0, arte / uCaixa);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 q = vUv * vec2(uCaixa, 1.0);
  float n1 = fbm(q * 2.6 + vec2(uT * 0.13, uT * 0.09));
  float n2 = fbm(q * 5.1 - vec2(uT * 0.11, uT * 0.07));

  /* pico no meio do percurso; o 0,004 de piso é a respiração de repouso */
  float amp = 0.13 * sin(3.14159265 * uP) + 0.004;
  vec2 desloca = vec2(n1 - 0.5, n2 - 0.5) * amp;

  /* a frente de onda entra pelo lado de onde a fita vem, e o ruído come a
     borda dela — sem isso a transição seria um wipe reto */
  float x = uDir > 0.0 ? 1.0 - vUv.x : vUv.x;
  float frente = smoothstep(0.0, 0.5, uP * 1.5 - x - (n1 - 0.5) * 0.62);

  /* a que sai é empurrada para fora, a que entra chega do lado oposto */
  vec2 uvA = cover(vUv + desloca * (0.6 + 0.5 * uP) + vec2(uDir * 0.05 * uP, 0.0), uArteA);
  vec2 uvB = cover(vUv + desloca * (1.1 - 0.6 * uP) - vec2(uDir * 0.05 * (1.0 - uP), 0.0), uArteB);

  vec3 cor = mix(texture2D(uA, uvA).rgb, texture2D(uB, uvB).rgb, frente);
  gl_FragColor = vec4(cor, 1.0);
}`;

export type VisorFluido = {
  /** carrega a arte na lâmina de trás; resolve quando ela está pronta na GPU */
  preparar(src: string, dir: 1 | -1): Promise<void>;
  /** 0 → 1 durante a transição; quem anima é o GSAP, de fora */
  progresso(p: number): void;
  /** conclui a troca: a nova vira a atual */
  concluir(): void;
  passo(dt: number): void;
  destruir(): void;
};

export function criarVisorFluido(alvo: HTMLElement): VisorFluido | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
  } catch {
    return null; /* sem WebGL: quem chama cai no caminho sem efeito */
  }
  const gl = renderer.gl;
  gl.canvas.style.cssText = "display:block;width:100%;height:100%";
  alvo.appendChild(gl.canvas);

  /* ⚠ CLAMP_TO_EDGE + LINEAR sem mipmap: é o que permite textura de dimensão
     qualquer em WebGL1. Com REPEAT, uma arte 1400×1097 nem renderiza. */
  const textura = () =>
    new Texture(gl, {
      generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      flipY: true,
    });

  let texA = textura();
  let texB = textura();

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uA: { value: texA },
      uB: { value: texB },
      uP: { value: 0 },
      uT: { value: 0 },
      uDir: { value: 1 },
      uCaixa: { value: 16 / 9 },
      uArteA: { value: 16 / 9 },
      uArteB: { value: 16 / 9 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const dimensionar = () => {
    const w = alvo.clientWidth || 1;
    const h = alvo.clientHeight || 1;
    renderer.setSize(w, h);
    program.uniforms.uCaixa.value = w / h;
  };
  const ro = new ResizeObserver(dimensionar);
  ro.observe(alvo);
  dimensionar();

  let vivo = true;
  const cache = new Map<string, HTMLImageElement>();
  const carregar = (src: string) =>
    new Promise<HTMLImageElement>((ok, falha) => {
      const pronta = cache.get(src);
      if (pronta?.complete && pronta.naturalWidth) return ok(pronta);
      const im = new Image();
      im.onload = () => {
        cache.set(src, im);
        ok(im);
      };
      im.onerror = falha;
      im.src = src;
    });

  return {
    async preparar(src, dir) {
      const im = await carregar(src);
      if (!vivo) return;
      texB.image = im;
      texB.needsUpdate = true;
      program.uniforms.uArteB.value = im.naturalWidth / im.naturalHeight;
      program.uniforms.uDir.value = dir;
      program.uniforms.uP.value = 0;
    },
    progresso(v) {
      program.uniforms.uP.value = v;
    },
    concluir() {
      /* a nova vira a atual: troca os ponteiros, sem reenviar pixel à GPU */
      const t = texA;
      texA = texB;
      texB = t;
      program.uniforms.uA.value = texA;
      program.uniforms.uB.value = texB;
      program.uniforms.uArteA.value = program.uniforms.uArteB.value;
      program.uniforms.uP.value = 0;
    },
    passo(dt) {
      if (!vivo) return;
      program.uniforms.uT.value += dt;
      renderer.render({ scene: mesh });
    },
    destruir() {
      vivo = false;
      ro.disconnect();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
