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

  /* ⚠⚠ O ENVELOPE, e ele é OBRIGATÓRIO em todo termo de deslocamento.
     "ele se reajeita no final": ao concluir, a arte nova vira a atual e o
     progresso volta a zero — se em p=1 sobrar QUALQUER deslocamento residual,
     a imagem salta desse resíduo para zero num frame só, e é isso que se vê
     como reajuste. sin(π·p) vale exatamente 0 nas duas pontas, então a
     transição começa e termina no MESMO estado em que a arte parada vive.
     Medido: com o uDir*0.05*uP da Maré fora do envelope, o salto era de 5%
     da largura do quadro. */
  float sopro = sin(3.14159265 * uP);
  vec2 dA;
  vec2 dB;
  float frente;

  if (uModo < 1.5) {
    /* ── 1 MARÉ ─────────────────────────────────────────────────────────
       Frente lateral com a borda comida pelo ruído. Amplitude com pico no
       meio do percurso: começar e terminar nítido é o que faz parecer
       material em vez de filtro ligado. */
    float amp = 0.13 * sopro + 0.004;
    dA = base * amp * (0.6 + 0.5 * uP) + vec2(uDir * 0.05 * sopro, 0.0);
    dB = base * amp * (1.1 - 0.6 * uP) - vec2(uDir * 0.05 * sopro, 0.0);
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
    dA = radial * crista * 0.14 * sopro + base * 0.02 * crista + base * 0.004;
    dB = radial * crista * -0.09 * sopro + base * 0.004;
    frente = smoothstep(0.0, 0.22, raio - r + (n1 - 0.5) * 0.16);

  } else if (uModo < 3.5) {
    /* ── 3 TURBILHÃO ────────────────────────────────────────────────────
       Domain warping: o ruído é amostrado num UV que já foi deslocado por
       outro ruído, o que produz filamento em vez de mancha. Sem frente
       nenhuma — a imagem toda se liquefaz e volta já sendo a outra, e a
       mistura acontece no MESMO campo que distorce, não numa máscara à
       parte. */
    vec2 w = vec2(fbm(q * 1.7 + vec2(uT * 0.10, 0.0)), fbm(q * 1.7 + vec2(0.0, uT * 0.12)));
    float n3 = fbm(q * 3.1 + w * 2.4 + vec2(uT * 0.06, -uT * 0.05));
    vec2 giro = vec2(n3 - 0.5, fbm(q * 3.1 + w * 2.4 + 7.3) - 0.5);
    float amp = 0.30 * sopro * sopro + 0.004;
    dA = giro * amp + vec2(uDir * 0.02 * sopro, 0.0);
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
    /* ⚠ "mais sólido": gaussiana MAIS ESTREITA (3,2 → 4,1) e arrasto maior
       (0,20 → 0,26). Sólido não é menos deformação — é deformação mais
       LOCALIZADA: quando o estiramento se espalha, a arte inteira parece mole;
       concentrado na frente, o que se lê é uma matéria firme sendo puxada.
       A borda também fica mais crocante (0,13 → 0,085 de smoothstep) e o ruído
       que a irregulariza cai pela metade — arco boleado é uma curva, e ruído
       demais nela vira franja. */
    float perto = exp(-pow(f * 4.1, 2.0)) * sopro;  /* 1 na frente, 0 longe e nas pontas */
    dA = vec2(uDir * (0.26 * perto + 0.045 * sopro), 0.0) + base * 0.004;
    dB = vec2(-uDir * 0.17 * perto, 0.0) + base * 0.004;
    frente = smoothstep(0.0, 0.085, f + (n1 - 0.5) * 0.045);
  }

  vec3 cor = mix(
    texture2D(uA, cover(vUv + dA, uArteA)).rgb,
    texture2D(uB, cover(vUv + dB, uArteB)).rgb,
    frente);
  gl_FragColor = vec4(cor, 1.0);
}