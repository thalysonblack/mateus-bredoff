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
/* ⭐ OS SHADERS MORAM EM ARQUIVO PRÓPRIO, e isso é correção de causa: enquanto o
   GLSL vivia numa template literal aqui dentro, uma crase em COMENTÁRIO fechava
   a string e o build quebrava com "Expected ; but found object" apontando para
   o meio do shader. Aconteceu três vezes no mesmo dia. Em `.glsl` com `?raw`
   não há string para fechar — e o editor ainda colore a sintaxe. */
import VERT from "./visor.vert.glsl?raw";
import FRAG from "./visor.frag.glsl?raw";

export type VisorFluido = {
  /**
   * Garante a arte na GPU. NÃO toca em nada do que está na tela.
   *
   * ⚠ A separação entre isto e `iniciar` é o que mata uma corrida real: se o
   * carregamento já instalasse a lâmina de trás, o `concluir()` de uma
   * transição AINDA EM CURSO poderia promover a arte nova sem animação nenhuma
   * — e a troca seguinte animaria de X para X, ou seja, sem efeito.
   */
  garantir(src: string): Promise<void>;
  /** instala a arte como lâmina de trás e zera o progresso. Síncrono, de propósito. */
  iniciar(src: string, dir: 1 | -1): void;
  /** a cor do fio da crista — vem do token `--p-acento` da superfície */
  acento(css: string): void;
  /** sobe todas as artes para a GPU antes do primeiro hover */
  aquecer(fontes: string[]): Promise<void>;
  /** 0 → 1 durante a transição; quem anima é o GSAP, de fora */
  progresso(p: number): void;
  /**
   * AMOSTRA DO FRAMEBUFFER: uma grade 16×9 de pixels do que está na tela.
   *
   * É o instrumento para provar que a transição não SALTA: a diferença entre
   * amostras de frames consecutivos tem de ser suave, e um reajuste aparece
   * como um pico isolado. Prova por screenshot não serve aqui — cada captura
   * do puppeteer custa 200–400ms e o pulo dura um frame.
   */
  amostra(): number[];
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

  /* ⚠ UMA TEXTURA POR ARTE, CACHEADA. Antes o `preparar` reenviava a arte para
     a GPU a cada hover (`texImage2D` de um WebP de 2200px), e o upload
     acontecia no meio do frame: medido, 8 frames acima de 32ms numa varredura
     de 278. Varrer a trama é o gesto natural da peça, então isso era engasgo
     em uso normal, não em caso extremo.

     Agora cada arte vira textura UMA vez, já reduzida à largura de exibição —
     e trocar de peça passa a ser trocar um ponteiro de uniform, que custa
     zero. */
  const texturas = new Map<string, Texture>();
  const vazia = textura();
  let texA = vazia;
  let texB = vazia;
  let razaoA = 16 / 9;
  let razaoB = 16 / 9;

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
      uAcento: { value: [0.15, 0.47, 0.59] },
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

  /* reduz a arte à largura em que ela é EXIBIDA antes de subir para a GPU:
     enviar 2200px para desenhar 760 é pagar 8× de banda e de VRAM por pixel
     que ninguém vê */
  const encolher = (im: HTMLImageElement) => {
    const largura = Math.min(im.naturalWidth, Math.ceil((alvo.clientWidth || 380) * 2));
    if (largura >= im.naturalWidth) return im;
    const c = document.createElement("canvas");
    c.width = largura;
    c.height = Math.round((largura / im.naturalWidth) * im.naturalHeight);
    c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
    return c;
  };

  const daTextura = async (src: string) => {
    const guardada = texturas.get(src);
    if (guardada) return guardada;
    const im = await carregar(src);
    const t = textura();
    t.image = encolher(im) as TexImageSource;
    t.needsUpdate = true;
    (t as unknown as { razao: number }).razao = im.naturalWidth / im.naturalHeight;
    texturas.set(src, t);
    return t;
  };

  return {
    async garantir(src) {
      await daTextura(src);
    },
    iniciar(src, dir) {
      const t = texturas.get(src);
      if (!t || !vivo) return;
      texB = t;
      razaoB = (t as unknown as { razao: number }).razao;
      program.uniforms.uB.value = texB;
      program.uniforms.uArteB.value = razaoB;
      program.uniforms.uDir.value = dir;
      program.uniforms.uP.value = 0;
    },
    /** sobe as artes para a GPU antes do primeiro hover, fora do caminho crítico */
    async aquecer(fontes) {
      for (const src of fontes) {
        if (!vivo) return;
        await daTextura(src);
        await new Promise((r) => setTimeout(r, 0)); /* uma por vez, sem prender o frame */
      }
    },
    acento(css) {
      const m = css.trim().match(/^#?([0-9a-f]{6})$/i);
      if (!m) return;
      const n = parseInt(m[1], 16);
      /* sRGB → linear: o shader mistura em linear, e jogar o valor cru deixa o
         fio claro demais */
      const canal = (v: number) => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      program.uniforms.uAcento.value = [canal((n >> 16) & 255), canal((n >> 8) & 255), canal(n & 255)];
    },
    progresso(v) {
      if (travado !== null) return;
      program.uniforms.uP.value = v;
    },
    amostra() {
      const px = new Uint8Array(16 * 9 * 4);
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      const fora: number[] = [];
      for (let j = 0; j < 9; j++) {
        for (let i = 0; i < 16; i++) {
          const um = new Uint8Array(4);
          gl.readPixels(
            Math.floor(((i + 0.5) / 16) * w), Math.floor(((j + 0.5) / 9) * h),
            1, 1, gl.RGBA, gl.UNSIGNED_BYTE, um);
          fora.push(um[0], um[1], um[2]);
        }
      }
      void px;
      return fora;
    },
    travar(v) {
      travado = v;
      if (v !== null) program.uniforms.uP.value = v;
    },
    concluir() {
      if (travado !== null) return;
      /* a nova vira a atual: só ponteiro, nenhum pixel sobe para a GPU */
      texA = texB;
      razaoA = razaoB;
      program.uniforms.uA.value = texA;
      program.uniforms.uArteA.value = razaoA;
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
      texturas.clear();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
