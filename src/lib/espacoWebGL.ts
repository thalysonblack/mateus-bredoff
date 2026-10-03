/**
 * O ESPAÇO — as peças do Mateus como PRANCHAS IMPRESSAS em 3D, guiadas pelo
 * scroll (03/10, "faz algo como fez no Florén").
 *
 * No Florén o objeto era a marca (o símbolo em aço). O Bredoff não tem símbolo
 * — a matéria dele é o TRABALHO. Então o objeto são as oito pranchas, com
 * espessura e luz de estúdio (RoomEnvironment), e o scroll as leva por quatro
 * estados:
 *   0 PILHA     empilhadas, giro lento
 *   1 LEQUE     a pilha se abre num arco
 *   2 CORREDOR  espalhadas em profundidade; a câmera atravessa
 *   3 GRADE     pousam numa grade 4×2 à frente da câmera
 *
 * O progresso (0→1) vem de FORA (ScrollTrigger na página); aqui só se
 * interpola entre os layouts. Relógio único: `passo()` é chamado pelo ticker
 * do GSAP, nunca por um rAF próprio (regra do CLAUDE.md deste repo).
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type Espaco = {
  progresso(p: number): void;
  passo(dt: number): void;
  /** índice da prancha mais perto do centro no corredor (−1 fora dele) */
  emFoco(): number;
  destruir(): void;
};

type Pose = { p: THREE.Vector3; r: THREE.Euler };

const W = 1.5;
const H = 1.0;
const D = 0.025;
const PASSO_Z = 2.4;

const suave = (t: number) => t * t * (3 - 2 * t);
const faixa = (p: number, a: number, b: number) => suave(Math.min(Math.max((p - a) / (b - a), 0), 1));

export function criarEspaco(
  canvas: HTMLCanvasElement,
  fontes: string[],
  aoClicar: (i: number) => void,
): Espaco | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
  const pmrem = new THREE.PMREMGenerator(renderer);
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const chave = new THREE.DirectionalLight(0xffffff, 1.6);
  chave.position.set(-3, 5, 4);
  cena.add(chave);

  const n = fontes.length;
  const loader = new THREE.TextureLoader();
  const geo = new THREE.BoxGeometry(W, H, D);
  const borda = new THREE.MeshStandardMaterial({ color: 0xe9e3e1, roughness: 0.6, metalness: 0 });
  const cartas: THREE.Mesh[] = fontes.map((src, i) => {
    const tex = loader.load(src, (t) => {
      /* cover: recorta a arte para a proporção da prancha */
      const img = t.image as HTMLImageElement;
      const a = img.width / img.height;
      const alvo = W / H;
      if (a > alvo) {
        t.repeat.set(alvo / a, 1);
        t.offset.set((1 - alvo / a) / 2, 0);
      } else {
        t.repeat.set(1, a / alvo);
        t.offset.set(0, (1 - a / alvo) / 2);
      }
      t.needsUpdate = true;
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const frente = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.42, metalness: 0.05 });
    const verso = new THREE.MeshStandardMaterial({ color: 0x1a1d1d, roughness: 0.8 });
    /* BoxGeometry: +x −x +y −y +z(frente) −z(verso) */
    const m = new THREE.Mesh(geo, [borda, borda, borda, borda, frente, verso]);
    m.userData.i = i;
    cena.add(m);
    return m;
  });

  /* ── os quatro layouts ────────────────────────────────────────────────── */
  const pilha: Pose[] = cartas.map((_, i) => ({
    p: new THREE.Vector3((i % 2 ? 1 : -1) * 0.04 * i, -0.15 - 0.02 * i, 2.2 + 0.035 * i),
    r: new THREE.Euler(-0.55, 0.18, ((i * 37) % 9 - 4) * 0.012),
  }));
  const leque: Pose[] = cartas.map((_, i) => {
    const a = THREE.MathUtils.degToRad(-42 + (84 * i) / (n - 1));
    return {
      p: new THREE.Vector3(Math.sin(a) * 2.6, Math.cos(a) * 2.6 - 2.4, 0.02 * i),
      r: new THREE.Euler(-0.12, 0, -a),
    };
  });
  const corredor: Pose[] = cartas.map((_, i) => {
    const lado = i % 2 ? 1 : -1;
    return {
      p: new THREE.Vector3(lado * 0.95, (i % 3 - 1) * 0.18, -i * PASSO_Z - 1),
      r: new THREE.Euler(0, -lado * 0.38, lado * 0.03),
    };
  });
  const zFim = -(n - 1) * PASSO_Z - 1;
  const grade: Pose[] = cartas.map((_, i) => {
    const c = i % 4;
    const l = Math.floor(i / 4);
    return {
      p: new THREE.Vector3((c - 1.5) * 1.62, (0.5 - l) * 1.1, zFim - 6.4),
      r: new THREE.Euler(0, 0, 0),
    };
  });

  let p = 0;
  let tempo = 0;
  let foco = -1;
  const tmpP = new THREE.Vector3();
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();

  const misturar = (a: Pose, b: Pose, t: number, m: THREE.Mesh) => {
    tmpP.lerpVectors(a.p, b.p, t);
    m.position.copy(tmpP);
    qa.setFromEuler(a.r);
    qb.setFromEuler(b.r);
    m.quaternion.slerpQuaternions(qa, qb, t);
  };

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

  /* clique (sem arrasto) numa prancha abre o case */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let x0 = 0;
  let y0 = 0;
  const onDown = (e: PointerEvent) => {
    x0 = e.clientX;
    y0 = e.clientY;
  };
  const alvoSob = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(cartas, false)[0];
    return hit ? (hit.object.userData.i as number) : -1;
  };
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - x0, e.clientY - y0) > 6) return;
    const i = alvoSob(e);
    if (i >= 0) aoClicar(i);
  };
  const onMove = (e: PointerEvent) => {
    canvas.style.cursor = alvoSob(e) >= 0 ? "pointer" : "default";
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointermove", onMove);

  return {
    progresso(v) {
      p = v;
    },
    emFoco: () => foco,
    passo(dt) {
      tempo += dt;
      /* fases do scroll */
      const tLeque = faixa(p, 0.1, 0.24);
      const tCorr = faixa(p, 0.26, 0.38);
      const tViagem = faixa(p, 0.36, 0.8);
      const tGrade = faixa(p, 0.8, 0.94);

      cartas.forEach((m, i) => {
        if (tCorr <= 0) {
          misturar(pilha[i], leque[i], tLeque, m);
          /* giro lento da pilha enquanto parada */
          if (tLeque < 0.01) m.rotation.y += Math.sin(tempo * 0.4 + i * 0.3) * 0.12;
        } else if (tGrade <= 0) {
          misturar(leque[i], corredor[i], tCorr, m);
        } else {
          misturar(corredor[i], grade[i], tGrade, m);
        }
      });

      /* câmera: parada no palco; atravessa o corredor; recua para ver a grade */
      const camZ0 = 6.2;
      const camZViagem = zFim + 1.2;
      const z = THREE.MathUtils.lerp(camZ0, camZViagem, tViagem);
      camera.position.set(Math.sin(tempo * 0.25) * 0.08 * (1 - tViagem), 0.02, z);
      camera.lookAt(0, 0, z - 6);

      /* em foco: a prancha do corredor mais perto da câmera, à frente dela */
      foco = -1;
      if (tCorr > 0.6 && tGrade < 0.3) {
        let melhor = Infinity;
        cartas.forEach((m, i) => {
          const d = z - m.position.z;
          if (d > 1.0 && d < melhor) {
            melhor = d;
            foco = i;
          }
        });
      }
      renderer.render(cena, camera);
    },
    destruir() {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointermove", onMove);
      cartas.forEach((m) => {
        (m.material as THREE.Material[]).forEach((mt) => {
          const map = (mt as THREE.MeshStandardMaterial).map;
          map?.dispose();
          mt.dispose();
        });
      });
      geo.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
