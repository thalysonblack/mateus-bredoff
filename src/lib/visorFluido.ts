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
 * ## TRÊS RECEITAS, para ele escolher (17/08)
 *
 *   1 MARÉ       uma frente de onda atravessa lateralmente e a borda dela é
 *                comida pelo ruído. A nova arte INVADE a anterior. É a mais
 *                próxima do gesto da trama: tem lado, tem direção, tem avanço.
 *   2 ONDA       um anel nasce no centro (que é onde o cursor está) e se abre.
 *                A crista do anel distorce forte e a arte troca ATRÁS dela —
 *                lê como toque na superfície de um líquido parado.
 *   3 TURBILHÃO  sem frente nenhuma: a imagem inteira se liquefaz por domain
 *                warping e re-solidifica já sendo a outra. É o mais material e
 *                o menos direcional — a troca acontece na matéria, não no
 *                percurso.
 *   4 ARCO       "estica boleando na lateral": a frente NÃO é reta — o centro
 *                adianta e as pontas atrasam, então ela atravessa como um arco
 *                de barriga cheia. E junto da frente a arte é ARRASTADA em x,
 *                como pano elástico sendo puxado: o que sai estica no sentido
 *                da saída, o que entra chega comprimido e relaxa. Tem lado,
 *                como a Maré, mas com peso e elasticidade.
 *
 * Três MECÂNICAS distintas, não a mesma com números trocados: uma tem lado, uma
 * tem centro, uma não tem lugar nenhum.
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

/* ⚠⚠ NENHUMA CRASE DAQUI PARA BAIXO, nem dentro de comentário: isto é uma
   template literal, e a crase fecha a string. O erro sai como
   `Expected ";" but found "object"` apontando para o meio do GLSL, o que não
   ajuda em nada. Já quebrou o build duas vezes. */
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
uniform float uModo;   /* 1 maré · 2 onda · 3 turbilhão */

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

  /* o piso de 0,004 é a respiração de repouso: a arte parada nunca fica
     perfeitamente morta, e isso custa nada */
  vec2 base = vec2(n1 - 0.5, n2 - 0.5);
  vec2 dA;
  vec2 dB;
  float frente;

  if (uModo < 1.5) {
    /* ── 1 MARÉ ─────────────────────────────────────────────────────────
       Frente lateral com a borda comida pelo ruído. Amplitude com pico no
       meio do percurso: começar e terminar nítido é o que faz parecer
       material em vez de filtro ligado. */
    float amp = 0.13 * sin(3.14159265 * uP) + 0.004;
    dA = base * amp * (0.6 + 0.5 * uP) + vec2(uDir * 0.05 * uP, 0.0);
    dB = base * amp * (1.1 - 0.6 * uP) - vec2(uDir * 0.05 * (1.0 - uP), 0.0);
    float x = uDir > 0.0 ? 1.0 - vUv.x : vUv.x;
    frente = smoothstep(0.0, 0.5, uP * 1.5 - x - (n1 - 0.5) * 0.62);

  } else if (uModo < 2.5) {
    /* ── 2 ONDA ─────────────────────────────────────────────────────────
       Um anel que nasce no centro (onde o cursor está, já que o visor é o
       cursor) e se abre. A distorção é MÁXIMA NA CRISTA e zero longe dela —
       por isso a arte à frente e atrás do anel fica limpa, e o olho lê um
       toque na superfície de um líquido, não a tela inteira tremendo. */
    vec2 c = (vUv - 0.5) * vec2(uCaixa, 1.0);
    float r = length(c) / (0.5 * sqrt(uCaixa * uCaixa + 1.0));
    float raio = uP * 1.35;
    float crista = exp(-pow((r - raio) * 5.2, 2.0));       /* gaussiana no anel */
    vec2 radial = normalize(c + 1e-5);
    dA = radial * crista * 0.14 + base * 0.02 * crista + base * 0.004;
    dB = radial * crista * -0.09 + base * 0.004;
    frente = smoothstep(0.0, 0.22, raio - r + (n1 - 0.5) * 0.16);

  } else if (uModo < 3.5) {
    /* ── 3 TURBILHÃO ────────────────────────────────────────────────────
       Domain warping: o ruído é amostrado num UV que já foi deslocado por
       outro ruído, o que produz filamento em vez de mancha. Sem frente
       nenhuma — a imagem toda se liquefaz e volta já sendo a outra, e a
       mistura acontece no MESMO campo que distorce, não numa máscara à
       parte. */
    float sopro = sin(3.14159265 * uP);
    vec2 w = vec2(fbm(q * 1.7 + vec2(uT * 0.10, 0.0)), fbm(q * 1.7 + vec2(0.0, uT * 0.12)));
    float n3 = fbm(q * 3.1 + w * 2.4 + vec2(uT * 0.06, -uT * 0.05));
    vec2 giro = vec2(n3 - 0.5, fbm(q * 3.1 + w * 2.4 + 7.3) - 0.5);
    float amp = 0.30 * sopro * sopro + 0.004;
    dA = giro * amp + vec2(uDir * 0.02 * uP, 0.0);
    dB = giro * amp * -0.85;
    frente = smoothstep(0.28, 0.72, uP + (n3 - 0.5) * 0.9 * sopro);

  } else {
    /* ── 4 ARCO ─────────────────────────────────────────────────────────
       A frente bolea: uma parábola em y adianta o centro e atrasa as pontas,
       e o bojo só existe DURANTE o percurso (4·p·(1−p) vale 0 nas duas
       pontas e 1 no meio) — assim a arte chega e sai com a borda reta, e é no
       meio do caminho que ela incha.

       O estiramento mora numa gaussiana em volta da frente: só ali o UV é
       arrastado em x, e o resto da imagem fica parado. É o que separa "pano
       elástico sendo puxado" de "imagem inteira escorregando". A que sai é
       puxada no sentido da saída, a que entra chega comprimida e relaxa. */
    float x = uDir > 0.0 ? 1.0 - vUv.x : vUv.x;
    float y = vUv.y - 0.5;
    float bojo = 0.26 * (1.0 - 4.0 * y * y) * (4.0 * uP * (1.0 - uP));
    float f = uP * 1.42 - x + bojo;
    float perto = exp(-pow(f * 3.2, 2.0));          /* 1 na frente, 0 longe */
    dA = vec2(uDir * (0.20 * perto + 0.045 * uP), 0.0) + base * 0.004;
    dB = vec2(-uDir * 0.15 * perto * (1.0 - uP), 0.0) + base * 0.004;
    frente = smoothstep(0.0, 0.13, f + (n1 - 0.5) * 0.09);
  }

  vec3 cor = mix(
    texture2D(uA, cover(vUv + dA, uArteA)).rgb,
    texture2D(uB, cover(vUv + dB, uArteB)).rgb,
    frente);
  gl_FragColor = vec4(cor, 1.0);
}`;

export type VisorFluido = {
  /** carrega a arte na lâmina de trás; resolve quando ela está pronta na GPU */
  preparar(src: string, dir: 1 | -1): Promise<void>;
  /** 0 → 1 durante a transição; quem anima é o GSAP, de fora */
  progresso(p: number): void;
  /**
   * TRINCO DE VERIFICAÇÃO: congela a transição num ponto do percurso.
   *
   * ⚠ Existe porque não dá para julgar um efeito de 1s por screenshot: cada
   * captura do puppeteer custa 200–400ms, então "tire em 120ms" vira 500ms e o
   * meio da transição nunca aparece. Com o trinco, mede-se o frame que se quer.
   * `null` devolve o controle ao GSAP.
   */
  travar(p: number | null): void;
  /** conclui a troca: a nova vira a atual */
  concluir(): void;
  passo(dt: number): void;
  destruir(): void;
};

export function criarVisorFluido(alvo: HTMLElement, modo: 1 | 2 | 3 | 4 = 1): VisorFluido | null {
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
      uModo: { value: modo },
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
  let travado: number | null = null;
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
      if (travado !== null) return;
      program.uniforms.uP.value = v;
    },
    travar(v) {
      travado = v;
      if (v !== null) program.uniforms.uP.value = v;
    },
    concluir() {
      if (travado !== null) return;
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
