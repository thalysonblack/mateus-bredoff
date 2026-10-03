/**
 * O ESTUDO EM 3D — a escultura de gesso da hero (03/10, direção escolhida
 * entre três: "o estudo (gesso)").
 *
 * A série "o estudo" já aprovada nas cenas do método (about, 16/09) tem cinco
 * formas, uma por etapa: a ESFERA que mergulha (imersão), o CUBO que se aparta
 * (posicionamento), o LEQUE de lâminas (direção visual), o DISCO cortado da
 * placa (criação da identidade) e a PILHA de folhas (entrega). Aqui elas
 * nascem MONTADAS num objeto só — e o scroll desmonta, etapa por etapa.
 *
 * Matéria: gesso fosco (roughness 0.96), uma luz de recorte com sombra longa
 * e suave, chão que recebe sombra, campo petróleo — o duotom da série.
 * O progresso vem de fora; relógio único no ticker do GSAP.
 */
import * as THREE from "three";

export type Estudo = {
  progresso(p: number): void;
  passo(dt: number): void;
  destruir(): void;
};

const PETROLEO = 0x2c4648;
const GESSO = 0xd3dad6;

const suave = (t: number) => t * t * (3 - 2 * t);
const faixa = (p: number, a: number, b: number) => suave(Math.min(Math.max((p - a) / (b - a), 0), 1));
const lerp = THREE.MathUtils.lerp;

export function criarEstudo(canvas: HTMLCanvasElement): Estudo | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  cena.background = new THREE.Color(PETROLEO);
  cena.fog = new THREE.Fog(PETROLEO, 9, 22);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  /* luz: um recorte alto à esquerda (sombra longa para a direita), um
     preenchimento frio fraco, e o ambiente baixo — como a série */
  cena.add(new THREE.HemisphereLight(0xcfe0de, 0x1c2e30, 0.55));
  const recorte = new THREE.SpotLight(0xf1efe9, 140, 30, Math.PI / 6.5, 0.85, 1.6);
  recorte.position.set(-5.5, 7.5, 4.5);
  recorte.castShadow = true;
  recorte.shadow.mapSize.set(2048, 2048);
  recorte.shadow.radius = 6;
  recorte.shadow.bias = -0.0004;
  cena.add(recorte);
  cena.add(recorte.target);

  const gesso = new THREE.MeshStandardMaterial({ color: GESSO, roughness: 0.96, metalness: 0 });
  const chaoMat = new THREE.MeshStandardMaterial({ color: 0x8fa3a2, roughness: 1 });
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), chaoMat);
  chao.rotation.x = -Math.PI / 2;
  chao.receiveShadow = true;
  cena.add(chao);

  const peca = (g: THREE.BufferGeometry) => {
    const m = new THREE.Mesh(g, gesso);
    m.castShadow = true;
    m.receiveShadow = true;
    cena.add(m);
    return m;
  };

  /* ── as cinco formas ─────────────────────────────────────────────────── */
  /* 5 · PILHA — a base: folhas finas empilhadas, levemente desalinhadas */
  const folhas: THREE.Mesh[] = [];
  const NF = 14;
  for (let i = 0; i < NF; i++) {
    const f = peca(new THREE.BoxGeometry(2.3, 0.045, 1.5));
    folhas.push(f);
  }
  /* 4 · CORTE — a placa com o furo redondo, de pé sobre a pilha; o disco é
     o que saiu do furo */
  const forma = new THREE.Shape();
  forma.moveTo(-1.0, 0);
  forma.lineTo(1.0, 0);
  forma.lineTo(1.0, 1.3);
  forma.lineTo(-1.0, 1.3);
  forma.lineTo(-1.0, 0);
  const furo = new THREE.Path();
  furo.absarc(0.12, 0.64, 0.4, 0, Math.PI * 2, true);
  forma.holes.push(furo);
  const placaGeo = new THREE.ExtrudeGeometry(forma, { depth: 0.32, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 48 });
  placaGeo.translate(0, 0, -0.16);
  const placa = peca(placaGeo);
  const disco = peca(new THREE.CylinderGeometry(0.39, 0.39, 0.3, 64));
  /* 1 · MERGULHO — a esfera pousada no topo da placa */
  const esfera = peca(new THREE.SphereGeometry(0.36, 64, 48));
  /* 2 · APARTA — o cubo encostado na lateral */
  const cubo = peca(new THREE.BoxGeometry(0.42, 0.42, 0.42));
  /* 3 · LEQUE — seis lâminas fechadas atrás da placa */
  const laminas: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) laminas.push(peca(new THREE.BoxGeometry(0.16, 1.15, 0.9)));

  const base = 0.045 * NF;

  /* pose de cada forma: MONTADA (p=0) e na sua etapa (desmontada) */
  const poses = () => {
    const t1 = faixa(p, 0.1, 0.26); /* imersão */
    const t2 = faixa(p, 0.26, 0.42); /* posicionamento */
    const t3 = faixa(p, 0.42, 0.58); /* direção visual */
    const t4 = faixa(p, 0.58, 0.74); /* criação */
    const t5 = faixa(p, 0.74, 0.9); /* entrega */

    folhas.forEach((f, i) => {
      const y0 = 0.0225 + i * 0.045;
      /* a entrega: a pilha se abre em altura, folha por folha */
      const y = y0 + t5 * i * 0.085;
      f.position.set(Math.sin(i * 1.7) * 0.03 + t5 * Math.sin(i * 0.9) * 0.12, y, Math.cos(i * 1.3) * 0.02);
      f.rotation.set(0, (i % 3 - 1) * 0.012 + t5 * (i % 2 ? 0.05 : -0.05), 0);
    });
    const topo = base + t5 * (NF - 1) * 0.085;

    /* a placa fica de pé no topo da pilha; o disco sai do furo e rola à esquerda */
    placa.position.set(0, topo, 0);
    placa.rotation.set(0, 0, 0);
    disco.position.set(lerp(0.12, -2.4, t4), lerp(topo + 0.64, 0.39, t4), lerp(0, 0.9, t4));
    /* de pé, como uma roda (a face voltada para a câmera) — como na cena 04 */
    disco.rotation.set(Math.PI / 2, 0, 0);

    /* a esfera: do topo da placa até afundar no chão, à frente-esquerda */
    /* primeiro sai para a FRENTE da placa, só depois desce — na diagonal
       ela atravessava a face da placa */
    const frente = Math.min(1, t1 / 0.35);
    const desce = Math.min(Math.max((t1 - 0.3) / 0.7, 0), 1);
    const ex = lerp(0, -1.6, desce);
    const ey = lerp(topo + 1.3 + 0.36, 0.08, desce) + Math.sin(frente * Math.PI) * 0.15 * (1 - desce);
    esfera.position.set(ex, ey, lerp(0, 1.5, frente));

    /* o cubo: encostado à direita da placa, aparta-se para longe */
    cubo.position.set(lerp(0.78, 3.1, t2), lerp(topo + 0.21, 0.21, Math.min(1, t2 * 1.4)), lerp(0.48, 0.9, t2));
    cubo.rotation.set(0, lerp(0, -0.5, t2), 0);

    /* o leque: lâminas fechadas atrás da placa; abrem em arco */
    laminas.forEach((l, i) => {
      const a = (i - 2.5) * 0.32 * t3;
      /* fechadas: atrás da placa, mais baixas que ela — invisíveis de frente */
      l.position.set(lerp(-0.45 + i * 0.17, -0.2 + Math.sin(a) * 1.2, t3), lerp(topo + 0.575, 0.575, t3), lerp(-0.62, -1.4, t3));
      l.rotation.set(0, 0, -a);
    });

    /* câmera: orbita devagar; aproxima no meio do percurso, recua no fim */
    const orb = lerp(-0.35, 0.55, faixa(p, 0, 1));
    const raio = lerp(7.4, 8.8, faixa(p, 0.6, 1));
    camera.position.set(Math.sin(orb + tempo * 0.04) * raio, lerp(2.6, 3.3, faixa(p, 0.6, 1)), Math.cos(orb + tempo * 0.04) * raio);
    camera.lookAt(0, lerp(1.2, 1.0, faixa(p, 0.6, 1)), 0);
    recorte.target.position.set(0, 0.8, 0);
  };

  let p = 0;
  let tempo = 0;

  const dimensionar = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(dimensionar);
  ro.observe(canvas);
  dimensionar();

  return {
    progresso(v) {
      p = v;
    },
    passo(dt) {
      tempo += dt;
      poses();
      renderer.render(cena, camera);
    },
    destruir() {
      ro.disconnect();
      cena.traverse((o) => {
        if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose();
      });
      gesso.dispose();
      chaoMat.dispose();
      renderer.dispose();
    },
  };
}
