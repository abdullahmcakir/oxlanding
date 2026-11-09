import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { OX_OUTLINE } from "./ox-outline";

// "3D" hero filminin motoru (three.js + GSAP). Yalnız brand-film-3.tsx içinden, hero ekrana gelince ayrı parça olarak yüklenir.
// OX sembolü logonun gerçek dış hatlarından (ox-outline.ts) yuvarlatılmış kenarlı katı bir nesne olarak üretilir;
// stüdyo ortam ışığı, parlama (bloom), film greni ve kesmelerde kısa renk kayması var.
// Her sekansın kendi nesneleri, kendi kamera yolu ve duraklatılmış bir GSAP zaman çizelgesi vardır; her karede
// çizelge sekans içi zamana sarılır (tl.time), böylece duraklatma, "hareketi azalt" sabit karesi ve sekans kilidi kolaydır.

export const SHOT_SEC = 3.4;
const BLUE = "#2f6bff";
const INK = "#e9edf5"; // beyaz yerine: parlama eşiğinin altında kalsın, yazılar ışımasın

type Fonts = { sans: string; mono: string };
type Rig = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };
type Shot = { group: THREE.Group; tl: gsap.core.Timeline; rig: Rig; update: (local: number, time: number) => void };

export type Film3 = {
  /** Oynatmayı başlatır/sürdürür */
  play: () => void;
  pause: () => void;
  /** Hareketsiz tek kare (hareketi azalt) */
  still: () => void;
  dispose: () => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ───────────── Geometri ───────────── */

function inside(x: number, y: number, poly: number[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const toPoints = (l: number[]) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < l.length; i += 2) pts.push(new THREE.Vector2(l[i], l[i + 1]));
  return pts;
};

/** Logo hatlarından parçalar: başka hattın içinde kalan hat deliktir (O'nun içi, dilin çizgisi) */
function logoShapes() {
  const parent = OX_OUTLINE.map((l, i) => OX_OUTLINE.findIndex((m, j) => j !== i && inside(l[0], l[1], m)));
  const shapes = new Map<number, THREE.Shape>();
  OX_OUTLINE.forEach((l, i) => parent[i] === -1 && shapes.set(i, new THREE.Shape(toPoints(l))));
  OX_OUTLINE.forEach((l, i) => parent[i] !== -1 && shapes.get(parent[i])?.holes.push(new THREE.Path(toPoints(l))));
  return [...shapes.values()];
}

function logoGeometry() {
  const geo = new THREE.ExtrudeGeometry(logoShapes(), {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.026,
    bevelOffset: -0.022,
    bevelSegments: 6,
    curveSegments: 1,
    steps: 1,
  });
  geo.center();
  return toCreasedNormals(geo, 0.9);
}

/** Yuvarlak köşeli ince levha (cihaz gövdesi, kart) */
function slabGeometry(w: number, h: number, depth: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const b = Math.min(depth * 0.35, 0.025);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: Math.max(0.001, depth - 2 * b),
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: 3,
    curveSegments: 8,
  });
  geo.center();
  return toCreasedNormals(geo, 0.8);
}

/** Yuvarlak köşeli düz yüz (ekran); UV 0–1 */
function roundedPlane(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const geo = new THREE.ShapeGeometry(s, 8);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return geo;
}

/* ───────────── Malzemeler ───────────── */

const matBlue = () =>
  new THREE.MeshPhysicalMaterial({
    color: BLUE,
    metalness: 0.15,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 0.9,
    transparent: true,
  });
const matChrome = () =>
  new THREE.MeshPhysicalMaterial({ color: "#c7d3f5", metalness: 1, roughness: 0.13, envMapIntensity: 1.35, transparent: true });
const matBody = () =>
  new THREE.MeshPhysicalMaterial({
    color: "#0d1017",
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
    transparent: true,
  });
const glow = (k: number) => new THREE.Color(BLUE).multiplyScalar(k);

function setOpacity(obj: THREE.Object3D, a: number) {
  obj.visible = a > 0.002;
  obj.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    for (const mm of Array.isArray(m) ? m : [m]) {
      const base = (mm.userData.base as number | undefined) ?? (mm.userData.base = mm.opacity);
      mm.opacity = base * a;
    }
  });
}

/* ───────────── Tuval dokuları ───────────── */

type Painter = (c: CanvasRenderingContext2D, w: number, h: number) => void;
function canvasTexture(w: number, h: number, paint?: Painter) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  paint?.(c, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { tex, c, canvas };
}

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

/** Yazı düzlemi: yükseklik dünya biriminde, genişlik yazıdan */
function textPlane(text: string, height: number, font: string, weight = 400, color = INK, tracking = 0) {
  const px = 96;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `${weight} ${px}px ${font}`;
  probe.letterSpacing = `${tracking}px`;
  const w = Math.ceil(probe.measureText(text).width + px * 0.4);
  const h = Math.ceil(px * 1.4);
  const { tex } = canvasTexture(w, h, (c) => {
    c.font = `${weight} ${px}px ${font}`;
    c.letterSpacing = `${tracking}px`;
    c.fillStyle = color;
    c.textBaseline = "middle";
    c.fillText(text, px * 0.2, h / 2);
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry((height * w) / h, height),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  );
  return mesh;
}

/** Gövde + dokulu ekran (cihaz ya da kart) */
function device(w: number, h: number, depth: number, r: number, map: THREE.Texture, bezel = 0.035) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(slabGeometry(w, h, depth, r), matBody()));
  const screen = new THREE.Mesh(
    roundedPlane(w - bezel * 2, h - bezel * 2, Math.max(0.005, r - bezel)),
    new THREE.MeshBasicMaterial({ map, transparent: true }),
  );
  screen.position.z = depth / 2 + 0.002;
  g.add(screen);
  return g;
}

/* ───────────── Motor ───────────── */

export async function createFilm3(
  canvas: HTMLCanvasElement,
  opts: { fonts: Fonts; onShot: (index: number) => void; forcedShot?: number; frozenAt?: number },
): Promise<Film3> {
  const { fonts } = opts;
  const logoImg = new Image();
  logoImg.src = "/images/logo.png";
  await Promise.all([logoImg.decode(), document.fonts?.ready]);

  // Mavi boyanmış logo (koyu zeminde)
  const blueLogo = document.createElement("canvas");
  blueLogo.width = blueLogo.height = 512;
  {
    const c = blueLogo.getContext("2d")!;
    c.drawImage(logoImg, 0, 0, 512, 512);
    c.globalCompositeOperation = "source-in";
    c.fillStyle = BLUE;
    c.fillRect(0, 0, 512, 512);
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor("#030304", 1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#030304", 0.035);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);

  // Işıklar: anahtar, mavi arka kontur, yumuşak dolgu
  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(3, 4, 6);
  const rim = new THREE.DirectionalLight("#5b86ff", 3.2);
  rim.position.set(-4, 2, -5);
  scene.add(key, rim, new THREE.AmbientLight("#1a2240", 0.6));

  // Ortam: arkada yumuşak mavi ışıma + uçuşan toz
  const auraTex = canvasTexture(256, 256, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(47,107,255,0.16)");
    g.addColorStop(0.45, "rgba(47,107,255,0.04)");
    g.addColorStop(1, "rgba(47,107,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }).tex;
  const aura = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshBasicMaterial({ map: auraTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
  );
  aura.position.set(0.4, 0.2, -7);
  aura.scale.setScalar(0.7);
  scene.add(aura);

  const dotTex = canvasTexture(64, 64, (c, w) => {
    const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, w);
  }).tex;
  const dust = (() => {
    const r = rand(3);
    const n = 700;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (r() - 0.5) * 18;
      pos[i * 3 + 1] = (r() - 0.5) * 11;
      pos[i * 3 + 2] = -9 + r() * 13;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.035,
        map: dotTex,
        color: "#8fa9ff",
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
  })();
  scene.add(dust);

  const logoGeo = logoGeometry();
  const pixel = { value: 600 }; // nokta boyutu için ekran ölçeği (resize günceller)

  /* ── Sekanslar ── */

  // 1 · Sonuç: parlak mavi logo, kayan ışık, halka ve "Yeni talep geldi" bildirimi
  function shotSonuc(): Shot {
    const group = new THREE.Group();
    const logo = new THREE.Mesh(logoGeo, matBlue());
    group.add(logo);
    const rings = [1.55, 1.78].map((r, i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, i ? 0.004 : 0.007, 8, 220),
        new THREE.MeshBasicMaterial({ color: glow(i ? 1.2 : 2.4), transparent: true, opacity: i ? 0.45 : 0.85 }),
      );
      m.position.z = -0.45 - i * 0.3;
      group.add(m);
      return m;
    });
    const sweep = new THREE.PointLight("#b9ccff", 40, 0, 2);
    group.add(sweep);

    const toastTex = canvasTexture(780, 220, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      c.fillStyle = BLUE;
      rr(c, 34, 50, 120, 120, 30);
      c.fill();
      c.drawImage(logoImg, 52, 68, 84, 84);
      c.fillStyle = INK;
      c.font = `600 50px ${fonts.sans}`;
      c.fillText("Yeni talep geldi", 186, 108);
      c.fillStyle = "rgba(233,237,245,0.55)";
      c.font = `30px ${fonts.mono}`;
      c.fillText("ŞİMDİ · OX DİJİTAL", 188, 158);
      c.fillStyle = "#4ade80";
      c.beginPath();
      c.arc(w - 60, h / 2, 12, 0, Math.PI * 2);
      c.fill();
    }).tex;
    const toast = device(1.95, 0.55, 0.05, 0.16, toastTex, 0.0);
    toast.position.set(0.55, -1.2, 0.75);
    group.add(toast);

    const s = { rotY: -0.9, rotX: 0.28, rise: -0.25, halo: 0, sweep: -4, toast: 0 };
    const rig: Rig = { px: 1.4, py: 0.4, pz: 9.6, tx: 0, ty: -0.05, tz: 0 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(s, { rotY: -0.9, rotX: 0.28, rise: -0.25 }, { rotY: 0.3, rotX: -0.06, rise: 0, duration: SHOT_SEC, ease: "power3.out" }, 0)
      .fromTo(rig, { px: 1.4, py: 0.4, pz: 9.6 }, { px: -0.5, py: 0.05, pz: 7.6, duration: SHOT_SEC, ease: "power2.inOut" }, 0)
      .fromTo(s, { halo: 0 }, { halo: 1, duration: 1.5, ease: "expo.out" }, 0.15)
      .fromTo(s, { sweep: -4.5 }, { sweep: 4.5, duration: 2.8, ease: "sine.inOut" }, 0.05)
      .fromTo(s, { toast: 0 }, { toast: 1, duration: 1, ease: "expo.out" }, 1.4);
    return {
      group,
      tl,
      rig,
      update(local) {
        logo.rotation.set(s.rotX, s.rotY + Math.sin(local * 0.8) * 0.03, 0);
        logo.position.y = s.rise;
        rings.forEach((m, i) => {
          m.scale.setScalar(0.72 + 0.28 * s.halo + i * 0.02 * Math.sin(local * 2));
          setOpacity(m, s.halo);
          m.rotation.z = local * (i ? -0.12 : 0.08);
        });
        sweep.position.set(s.sweep, 1.1, 2.4);
        toast.position.y = -1.62 + 0.42 * s.toast;
        toast.rotation.set(0.25 * (1 - s.toast), -0.12 - 0.4 * (1 - s.toast), 0);
        setOpacity(toast, s.toast);
      },
    };
  }

  // 2 · Marka: patlatılmış yapım görünümü (çizim katmanı · krom logo · tel kafes) + renk kartları
  function shotMarka(): Shot {
    const group = new THREE.Group();
    const stack = new THREE.Group();
    group.add(stack);

    // Arka katman: logo dış hatları ve yapım çizgileri, çizilerek belirir
    const back = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: glow(1.3), transparent: true });
    const drawn: THREE.BufferGeometry[] = [];
    const addLine = (pts: THREE.Vector3[], loop = false, mat: THREE.Material = lineMat) => {
      const geo = new THREE.BufferGeometry().setFromPoints(loop ? [...pts, pts[0]] : pts);
      const line = new THREE.Line(geo, mat);
      back.add(line);
      drawn.push(geo);
      return line;
    };
    for (const l of OX_OUTLINE) addLine(toPoints(l).map((p) => new THREE.Vector3(p.x, p.y, 0)), true);
    const circle = (cx: number, cy: number, r: number) =>
      Array.from({ length: 121 }, (_, i) => new THREE.Vector3(cx + Math.cos((i / 120) * Math.PI * 2) * r, cy + Math.sin((i / 120) * Math.PI * 2) * r, 0));
    const guideMat = new THREE.LineBasicMaterial({ color: "#3a4560", transparent: true });
    addLine(circle(0, 0, 1.42), false, guideMat);
    addLine(circle(-0.58, 0.02, 0.5), false, guideMat);
    addLine([new THREE.Vector3(-1.8, 0, 0), new THREE.Vector3(1.8, 0, 0)], false, guideMat);
    addLine([new THREE.Vector3(0, -1.8, 0), new THREE.Vector3(0, 1.8, 0)], false, guideMat);
    const dashMat = new THREE.LineDashedMaterial({ color: "#56627f", dashSize: 0.06, gapSize: 0.05, transparent: true });
    addLine(
      [new THREE.Vector3(-1.3, -1.3, 0), new THREE.Vector3(1.3, -1.3, 0), new THREE.Vector3(1.3, 1.3, 0), new THREE.Vector3(-1.3, 1.3, 0)],
      true,
      dashMat,
    ).computeLineDistances();
    stack.add(back);

    const solid = new THREE.Mesh(logoGeo, matChrome());
    stack.add(solid);
    const wire = new THREE.Mesh(
      logoGeo,
      new THREE.MeshBasicMaterial({ color: glow(0.9), wireframe: true, transparent: true, opacity: 0.35, depthWrite: false }),
    );
    stack.add(wire);

    // Renk kartları (Pantone kartı gibi: üstte renk, altta ad ve kod)
    const swatches = [
      ["OX MAVİ", "#2F6BFF", BLUE],
      ["GECE", "#030304", "#030304"],
      ["KAĞIT", "#FFFFFF", "#ffffff"],
      ["TAŞ", "#8A8F98", "#8a8f98"],
    ].map(([name, hex, col], i) => {
      const tex = canvasTexture(360, 540, (c, w, h) => {
        c.fillStyle = "#eef1f6";
        rr(c, 0, 0, w, h, 26);
        c.fill();
        c.fillStyle = col;
        rr(c, 18, 18, w - 36, h * 0.66, 14);
        c.fill();
        c.fillStyle = "#14161c";
        c.font = `700 34px ${fonts.mono}`;
        c.fillText(name, 26, h * 0.66 + 82);
        c.fillStyle = "#5b6070";
        c.font = `30px ${fonts.mono}`;
        c.fillText(hex, 26, h * 0.66 + 128);
      }).tex;
      const card = device(0.44, 0.66, 0.02, 0.032, tex, 0.002);
      card.position.set(-0.75 + i * 0.5, -1.0, 1.1);
      group.add(card);
      return card;
    });

    const s = { sep: 0, draw: 0, cards: 0, wire: 0, spin: -0.35 };
    const rig: Rig = { px: 0, py: 0.1, pz: 8.6, tx: 0.1, ty: -0.2, tz: 0 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(rig, { px: -0.6, py: 0.1, pz: 8.4 }, { px: 3.7, py: 1.1, pz: 7.4, duration: SHOT_SEC, ease: "power2.inOut" }, 0)
      .fromTo(s, { draw: 0 }, { draw: 1, duration: 1.3, ease: "power2.inOut" }, 0)
      .fromTo(s, { sep: 0 }, { sep: 1, duration: 1.6, ease: "expo.inOut" }, 0.5)
      .fromTo(s, { wire: 0 }, { wire: 1, duration: 0.8, ease: "power2.out" }, 0.9)
      .fromTo(s, { spin: -0.35 }, { spin: 0.15, duration: SHOT_SEC, ease: "power1.inOut" }, 0)
      .fromTo(s, { cards: 0 }, { cards: 1, duration: 1.4, ease: "power3.out" }, 1.5);
    return {
      group,
      tl,
      rig,
      update() {
        stack.rotation.y = s.spin;
        back.position.z = -0.95 * s.sep;
        wire.position.z = 0.95 * s.sep;
        wire.scale.setScalar(1 + 0.04 * s.sep);
        setOpacity(wire, s.wire);
        drawn.forEach((geo, i) => {
          const k = span(s.draw, i * 0.04, 0.55 + i * 0.04);
          geo.setDrawRange(0, Math.floor(geo.attributes.position.count * k));
        });
        swatches.forEach((card, i) => {
          const k = easeOut(span(s.cards, i * 0.14, 0.55 + i * 0.14));
          card.position.y = -1.85 + 0.85 * k;
          card.rotation.set(-0.9 * (1 - k), 0, (i - 1.5) * 0.06 + 0.5 * (1 - k));
          setOpacity(card, k);
        });
      },
    };
  }

  // 3 · Website: site tarayıcıda kurulur; kamera geri çekilince tablet ve telefon derinlikte belirir
  function shotWebsite(): Shot {
    const group = new THREE.Group();
    const paintSite = (c: CanvasRenderingContext2D, W: number, H: number, p: number, narrow: boolean) => {
      const u = W / (narrow ? 420 : 1280);
      c.fillStyle = "#0a0c11";
      c.fillRect(0, 0, W, H);
      const step = (a: number, b: number, fn: (k: number) => void) => {
        const k = easeOut(span(p, a, b));
        if (k <= 0) return;
        c.save();
        c.globalAlpha = k;
        c.translate(0, (1 - k) * 18 * u);
        fn(k);
        c.restore();
      };
      // üst menü
      step(0.02, 0.18, () => {
        c.drawImage(blueLogo, 34 * u, 24 * u, 40 * u, 40 * u);
        c.fillStyle = INK;
        c.font = `600 ${20 * u}px ${fonts.sans}`;
        c.fillText("OX Dijital", 84 * u, 51 * u);
        if (!narrow) {
          c.fillStyle = "rgba(233,237,245,0.5)";
          c.font = `${17 * u}px ${fonts.sans}`;
          ["Hizmetler", "İşler", "Hakkımızda"].forEach((t, i) => c.fillText(t, (560 + i * 130) * u, 50 * u));
          c.fillStyle = BLUE;
          rr(c, W - 230 * u, 22 * u, 196 * u, 46 * u, 23 * u);
          c.fill();
          c.fillStyle = "#fff";
          c.font = `600 ${16 * u}px ${fonts.sans}`;
          c.fillText("Ücretsiz görüşme", W - 205 * u, 51 * u);
        } else {
          c.fillStyle = "rgba(233,237,245,0.7)";
          for (let i = 0; i < 3; i++) c.fillRect(W - 60 * u, (34 + i * 9) * u, 26 * u, 3 * u);
        }
      });
      const x0 = 34 * u;
      const top = narrow ? 120 * u : 170 * u;
      const big = narrow ? 50 * u : 92 * u;
      step(0.14, 0.34, () => {
        c.fillStyle = "rgba(233,237,245,0.45)";
        c.font = `${14 * u}px ${fonts.mono}`;
        c.fillText("DİJİTAL AJANS", x0, top);
      });
      step(0.18, 0.42, (k) => {
        c.save();
        c.beginPath();
        c.rect(x0, top + 10 * u, (narrow ? W : 640 * u) * k, big * 2.3);
        c.clip();
        c.font = `500 ${big}px ${fonts.sans}`;
        c.fillStyle = "rgba(233,237,245,0.6)";
        c.fillText("Daha etkili", x0, top + big * 1.05);
        c.fillStyle = INK;
        c.fillText("Website", x0, top + big * 2.05);
        c.restore();
      });
      step(0.36, 0.55, () => {
        c.fillStyle = "rgba(233,237,245,0.22)";
        const lw = narrow ? W - 2 * x0 : 440 * u;
        for (let i = 0; i < 3; i++) {
          rr(c, x0, top + big * 2.45 + i * 22 * u, lw * (i === 2 ? 0.6 : 1), 9 * u, 4 * u);
          c.fill();
        }
      });
      step(0.46, 0.62, () => {
        c.fillStyle = BLUE;
        rr(c, x0, top + big * 2.45 + 90 * u, 190 * u, 50 * u, 25 * u);
        c.fill();
        c.fillStyle = "#fff";
        c.font = `600 ${16 * u}px ${fonts.sans}`;
        c.fillText("Ücretsiz görüşme", x0 + 26 * u, top + big * 2.45 + 121 * u);
      });
      // görsel blok
      step(0.3, 0.6, () => {
        const bx = narrow ? x0 : 760 * u;
        const by = narrow ? top + big * 2.45 + 170 * u : 130 * u;
        const bw = narrow ? W - 2 * x0 : 486 * u;
        const bh = narrow ? bw * 0.9 : 400 * u;
        const g = c.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, "#2f6bff");
        g.addColorStop(1, "#0d1b4d");
        c.fillStyle = g;
        rr(c, bx, by, bw, bh, 22 * u);
        c.fill();
        const ls = Math.min(bw, bh) * 0.55;
        c.drawImage(logoImg, bx + (bw - ls) / 2, by + (bh - ls) / 2, ls, ls);
      });
      // kartlar
      if (!narrow)
        for (let i = 0; i < 3; i++)
          step(0.6 + i * 0.07, 0.8 + i * 0.07, () => {
            const cx = x0 + i * 410 * u;
            c.fillStyle = "#12151d";
            rr(c, cx, 590 * u, 384 * u, 170 * u, 18 * u);
            c.fill();
            c.fillStyle = i === 0 ? BLUE : "#232838";
            rr(c, cx + 24 * u, 614 * u, 44 * u, 44 * u, 10 * u);
            c.fill();
            c.fillStyle = "rgba(233,237,245,0.75)";
            c.font = `600 ${20 * u}px ${fonts.sans}`;
            c.fillText(["Website", "SEO", "Reklam"][i], cx + 24 * u, 700 * u);
            c.fillStyle = "rgba(233,237,245,0.2)";
            rr(c, cx + 24 * u, 722 * u, 250 * u, 8 * u, 4 * u);
            c.fill();
          });
    };

    const desk = canvasTexture(1280, 800);
    let deskStep = -1;
    const desktop = device(3.0, 1.875, 0.06, 0.07, desk.tex, 0.04);
    desktop.position.set(0, 0.15, 0);
    group.add(desktop);

    const tabTex = canvasTexture(768, 1024, (c, w, h) => paintSite(c, w, h, 1, true)).tex;
    const tablet = device(1.2, 1.6, 0.06, 0.09, tabTex, 0.05);
    group.add(tablet);
    const phoneTex = canvasTexture(420, 900, (c, w, h) => paintSite(c, w, h, 1, true)).tex;
    const phone = device(0.62, 1.32, 0.06, 0.1, phoneTex, 0.03);
    group.add(phone);

    const s = { build: 0, tab: 0, ph: 0, tilt: 0 };
    const rig: Rig = { px: 0.15, py: 0.2, pz: 4.4, tx: 0, ty: 0.15, tz: 0 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(s, { build: 0 }, { build: 1, duration: 1.7, ease: "none" }, 0)
      .fromTo(
        rig,
        { px: 0.15, py: 0.2, pz: 4.3, tx: 0, ty: 0.15 },
        { px: 2.5, py: 0.7, pz: 9.2, tx: 0.15, ty: -0.15, duration: 2.4, ease: "power3.inOut" },
        0.7,
      )
      .fromTo(s, { tilt: 0 }, { tilt: 1, duration: 2.4, ease: "power2.inOut" }, 0.7)
      .fromTo(s, { tab: 0 }, { tab: 1, duration: 1.3, ease: "expo.out" }, 1.35)
      .fromTo(s, { ph: 0 }, { ph: 1, duration: 1.3, ease: "expo.out" }, 1.65);
    return {
      group,
      tl,
      rig,
      update() {
        const q = Math.round(s.build * 40);
        if (q !== deskStep) {
          deskStep = q;
          paintSite(desk.c, 1280, 800, q / 40, false);
          desk.tex.needsUpdate = true;
        }
        desktop.rotation.y = -0.18 * s.tilt;
        tablet.position.set(1.9, -0.45, 0.9 - 2.6 * (1 - s.tab));
        tablet.rotation.set(0, -0.42, 0);
        setOpacity(tablet, s.tab);
        phone.position.set(-1.7, -0.75, 1.15 - 2.6 * (1 - s.ph));
        phone.rotation.set(0, 0.45, 0);
        setOpacity(phone, s.ph);
      },
    };
  }

  // 4 · SEO: logo nokta bulutu taranır; site ağacının sayfaları sırayla "dizine eklendi"
  function shotSeo(): Shot {
    const group = new THREE.Group();
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(logoGeo)).build();
    const n = 9000;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    const v = new THREE.Vector3();
    const r = rand(11);
    for (let i = 0; i < n; i++) {
      sampler.sample(v);
      pos.set([v.x, v.y, v.z], i * 3);
      rnd[i] = r();
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    cloudGeo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    const cloudMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uScan: { value: -2 }, uSize: { value: 0.022 }, uPix: pixel, uOpacity: { value: 1 }, uColor: { value: glow(1) } },
      vertexShader: `
        uniform float uScan; uniform float uSize; uniform float uPix;
        attribute float aRand; varying float vGlow; varying float vDone;
        void main() {
          float d = position.x - uScan;
          vGlow = exp(-d * d * 90.0);
          vDone = step(position.x, uScan);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * uPix * (1.0 + vGlow * 1.8) * (0.6 + aRand * 0.8) / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uOpacity; varying float vGlow; varying float vDone;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          if (r > 0.5) discard;
          float a = smoothstep(0.5, 0.0, r);
          vec3 col = mix(vec3(0.16, 0.18, 0.24), uColor * 1.5, vDone) + vec3(0.7, 0.8, 1.0) * vGlow * 1.6;
          gl_FragColor = vec4(col, a * uOpacity * (0.45 + 0.55 * max(vDone, vGlow)));
        }`,
    });
    const cloud = new THREE.Points(cloudGeo, cloudMat);
    const cloudWrap = new THREE.Group();
    cloudWrap.add(cloud);
    cloudWrap.position.x = -0.95;
    group.add(cloudWrap);

    const scanner = new THREE.Group();
    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 2.6),
      new THREE.MeshBasicMaterial({ color: glow(0.6), transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    sheet.rotation.y = Math.PI / 2;
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.006, 2.6, 0.006), new THREE.MeshBasicMaterial({ color: glow(3), transparent: true }));
    scanner.add(sheet, edge);
    cloud.add(scanner);

    // Site ağacı
    const pages = ["oxdijital.com", "/hizmetler", "/isler", "/iletisim"];
    const paintCard = (label: string, done: boolean) =>
      canvasTexture(640, 200, (c, w, h) => {
        c.fillStyle = "#10131b";
        rr(c, 0, 0, w, h, 26);
        c.fill();
        c.fillStyle = INK;
        c.font = `600 44px ${fonts.sans}`;
        c.fillText(label, 34, 82);
        c.font = `26px ${fonts.mono}`;
        c.fillStyle = done ? "#7fa2ff" : "rgba(233,237,245,0.35)";
        c.fillText(done ? "✓ DİZİNE EKLENDİ" : "TARANIYOR…", 34, 148);
        if (done) {
          c.fillStyle = BLUE;
          c.beginPath();
          c.arc(w - 50, 66, 14, 0, Math.PI * 2);
          c.fill();
        }
      }).tex;
    const tree = new THREE.Group();
    tree.position.set(1.15, 0, 0.3);
    tree.scale.setScalar(0.92);
    group.add(tree);
    const cards = pages.map((p, i) => {
      const pending = paintCard(p, false);
      const done = paintCard(p, true);
      const card = device(1.28, 0.4, 0.04, 0.06, pending, 0.0);
      const screen = card.children[1] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
      card.position.set(i === 0 ? 0 : 0.28, i === 0 ? 1.15 : 0.45 - (i - 1) * 0.62, 0);
      tree.add(card);
      return { card, screen, pending, done };
    });
    const branchGeo = new THREE.BufferGeometry().setFromPoints(
      [1, 2, 3].flatMap((i) => {
        const y = 0.45 - (i - 1) * 0.62;
        return [new THREE.Vector3(-0.5, 0.95, -0.02), new THREE.Vector3(-0.5, y, -0.02), new THREE.Vector3(-0.5, y, -0.02), new THREE.Vector3(-0.36, y, -0.02)];
      }),
    );
    const branches = new THREE.LineSegments(branchGeo, new THREE.LineBasicMaterial({ color: "#5872c0", transparent: true }));
    tree.add(branches);

    const s = { scan: 0, spin: -0.5, cards: 0, idx: 0 };
    const rig: Rig = { px: -1.6, py: 0.5, pz: 8.6, tx: 0.35, ty: 0, tz: 0 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(rig, { px: -1.8, py: 0.6, pz: 8.9 }, { px: 1.0, py: 0.15, pz: 8.0, duration: SHOT_SEC, ease: "power2.inOut" }, 0)
      .fromTo(s, { spin: -0.55 }, { spin: 0.25, duration: SHOT_SEC, ease: "power1.inOut" }, 0)
      .fromTo(s, { scan: 0 }, { scan: 1, duration: 1.8, ease: "power2.inOut" }, 0.2)
      .fromTo(s, { cards: 0 }, { cards: 1, duration: 0.9, ease: "expo.out" }, 0.5)
      .fromTo(s, { idx: 0 }, { idx: 4, duration: 1.5, ease: "none" }, 1.5);
    return {
      group,
      tl,
      rig,
      update(local) {
        cloudWrap.rotation.set(0.12, s.spin, 0);
        cloudMat.uniforms.uScan.value = -1.15 + 2.3 * s.scan;
        scanner.position.x = -1.15 + 2.3 * s.scan;
        setOpacity(scanner, Math.sin(Math.PI * clamp01(s.scan * 1.02)) * 1);
        cloudWrap.position.y = Math.sin(local * 1.2) * 0.03;
        cards.forEach(({ card, screen, pending, done }, i) => {
          const k = easeOut(span(s.cards, i * 0.12, 0.6 + i * 0.12));
          card.position.x = (i === 0 ? 0 : 0.28) + 0.8 * (1 - k);
          setOpacity(card, k);
          const map = s.idx > i + 0.5 ? done : pending;
          if (screen.material.map !== map) {
            screen.material.map = map;
            screen.material.needsUpdate = true;
          }
        });
        setOpacity(branches, s.cards);
        tree.rotation.y = -0.25;
      },
    };
  }

  // 5 · Sosyal medya: üç telefon (Reels, Gönderi, Hikâye) yelpaze açar, kalpler yükselir
  function shotSosyal(): Shot {
    const group = new THREE.Group();
    const W = 540, H = 1110;
    const status = (c: CanvasRenderingContext2D) => {
      c.fillStyle = "rgba(255,255,255,0.8)";
      c.font = `600 22px ${fonts.sans}`;
      c.fillText("9:41", 40, 52);
      rr(c, W / 2 - 60, 26, 120, 34, 17);
      c.fillStyle = "#000";
      c.fill();
    };
    const reels = canvasTexture(W, H, (c) => {
      const g = c.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#2f6bff");
      g.addColorStop(1, "#071233");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.drawImage(logoImg, W / 2 - 150, H / 2 - 210, 300, 300);
      c.fillStyle = "rgba(255,255,255,0.9)";
      c.beginPath();
      c.moveTo(W / 2 - 30, H / 2 + 150);
      c.lineTo(W / 2 + 40, H / 2 + 190);
      c.lineTo(W / 2 - 30, H / 2 + 230);
      c.fill();
      c.font = `700 28px ${fonts.sans}`;
      c.fillText("Reels", 40, 120);
      for (let i = 0; i < 3; i++) {
        c.fillStyle = "rgba(255,255,255,0.85)";
        c.beginPath();
        c.arc(W - 60, H - 380 + i * 96, 24, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = "#fff";
      c.font = `600 26px ${fonts.sans}`;
      c.fillText("oxdijital", 40, H - 150);
      c.fillStyle = "rgba(255,255,255,0.5)";
      rr(c, 40, H - 120, 330, 14, 7);
      c.fill();
      status(c);
    }).tex;
    const post = canvasTexture(W, H, (c) => {
      c.fillStyle = "#0b0d12";
      c.fillRect(0, 0, W, H);
      status(c);
      c.fillStyle = BLUE;
      c.beginPath();
      c.arc(66, 160, 30, 0, Math.PI * 2);
      c.fill();
      c.drawImage(logoImg, 44, 138, 44, 44);
      c.fillStyle = INK;
      c.font = `600 26px ${fonts.sans}`;
      c.fillText("oxdijital", 112, 170);
      const g = c.createLinearGradient(0, 220, W, 220 + W);
      g.addColorStop(0, "#1b2340");
      g.addColorStop(1, "#2f6bff");
      c.fillStyle = g;
      c.fillRect(0, 220, W, W);
      c.drawImage(logoImg, W / 2 - 130, 220 + W / 2 - 130, 260, 260);
      // beğen, yorum, gönder
      c.fillStyle = "#ff4d6d";
      heartPath(c, 60, 220 + W + 50, 30);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 4;
      c.beginPath();
      c.arc(140, 220 + W + 50, 20, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(196, 220 + W + 34);
      c.lineTo(240, 220 + W + 50);
      c.lineTo(196, 220 + W + 66);
      c.closePath();
      c.stroke();
      c.fillStyle = "rgba(233,237,245,0.28)";
      rr(c, 40, 220 + W + 110, 420, 14, 7);
      c.fill();
      rr(c, 40, 220 + W + 142, 300, 14, 7);
      c.fill();
    }).tex;
    const story = canvasTexture(W, H, (c) => {
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#111a35");
      g.addColorStop(0.55, "#2f6bff");
      g.addColorStop(1, "#9fb8ff");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      for (let i = 0; i < 3; i++) {
        c.fillStyle = i === 0 ? "#fff" : "rgba(255,255,255,0.35)";
        rr(c, 24 + i * 166, 80, 156, 6, 3);
        c.fill();
      }
      c.fillStyle = "#fff";
      c.font = `600 24px ${fonts.sans}`;
      c.fillText("oxdijital", 40, 140);
      c.drawImage(logoImg, W / 2 - 170, H / 2 - 250, 340, 340);
      c.fillStyle = "#fff";
      rr(c, W / 2 - 150, H - 230, 300, 72, 36);
      c.fill();
      c.fillStyle = "#0b0d12";
      c.font = `600 26px ${fonts.sans}`;
      c.textAlign = "center";
      c.fillText("Mesaj gönder", W / 2, H - 184);
      c.textAlign = "start";
    }).tex;

    const phones = [reels, post, story].map((tex) => {
      const p = device(0.95, 1.95, 0.08, 0.14, tex, 0.03);
      group.add(p);
      return p;
    });

    // Kalpler
    const heartTex = canvasTexture(128, 128, (c) => {
      c.fillStyle = "#ff4d6d";
      heartPath(c, 64, 70, 54);
      c.fill();
    }).tex;
    const hr = rand(21);
    const hearts = Array.from({ length: 18 }, () => {
      const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false }));
      m.userData = { t0: 1.0 + hr() * 2.0, x: 0.2 + (hr() - 0.5) * 0.5, drift: (hr() - 0.5) * 0.8, size: 0.1 + hr() * 0.12 };
      group.add(m);
      return m;
    });

    const s = { fan: 0, spin: 0 };
    const rig: Rig = { px: 0.6, py: 0.6, pz: 8.8, tx: 0, ty: 0.05, tz: 0.2 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(s, { fan: 0 }, { fan: 1, duration: 1.5, ease: "power3.out" }, 0)
      .fromTo(rig, { px: 0.9, py: 0.9, pz: 9.2 }, { px: -0.9, py: -0.1, pz: 7.4, duration: SHOT_SEC, ease: "power2.inOut" }, 0)
      .fromTo(s, { spin: 0 }, { spin: 1, duration: SHOT_SEC, ease: "none" }, 0);
    return {
      group,
      tl,
      rig,
      update(local) {
        phones.forEach((p, i) => {
          const k = easeOut(span(s.fan, i * 0.15, 0.7 + i * 0.15));
          const side = i - 1;
          p.position.set(side * 1.12 * k, (side === 0 ? 0.12 : -0.02) - 2.8 * (1 - k), side === 0 ? 0.5 : 0);
          p.rotation.set(0.7 * (1 - k), -side * 0.34 * k + (s.spin - 0.5) * 0.12, side * 0.04);
          setOpacity(p, k);
        });
        hearts.forEach((h) => {
          const { t0, x, drift, size } = h.userData as { t0: number; x: number; drift: number; size: number };
          const u = (local - t0) / 1.6;
          h.visible = u >= 0 && u <= 1;
          if (!h.visible) return;
          h.position.set(x + drift * u + Math.sin(u * 9 + x * 10) * 0.05, -0.75 + u * 2.2, 0.62);
          h.scale.setScalar(size * (0.6 + 0.4 * easeOut(Math.min(1, u * 4))));
          (h.material as THREE.SpriteMaterial).opacity = Math.min(1, u * 6) * (1 - u);
        });
      },
    };
  }

  // 6 · Reklam: parlayan logo, hedef halkaları; kitle noktaları eğrilerle logoya akar
  function shotReklam(): Shot {
    const group = new THREE.Group();
    const logoMat = matBlue();
    logoMat.emissive = new THREE.Color(BLUE);
    const logo = new THREE.Mesh(logoGeo, logoMat);
    group.add(logo);

    const target = new THREE.Group();
    target.rotation.set(-1.15, 0, 0.1);
    target.position.y = -0.2;
    group.add(target);
    const rings = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.006, 8, 200), new THREE.MeshBasicMaterial({ color: glow(2.2), transparent: true }));
      target.add(m);
      return m;
    });
    const cross = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.6, 0, 0),
        new THREE.Vector3(2.6, 0, 0),
        new THREE.Vector3(0, -2.6, 0),
        new THREE.Vector3(0, 2.6, 0),
      ]),
      new THREE.LineBasicMaterial({ color: "#2a3554", transparent: true }),
    );
    target.add(cross);

    // Kitle
    const n = 520;
    const r = rand(5);
    const paths = Array.from({ length: n }, () => {
      const a = r() * Math.PI * 2;
      const rad = 4 + r() * 2.6;
      const start = new THREE.Vector3(Math.cos(a) * rad, (r() - 0.5) * 3.6, -2.5 + Math.sin(a) * rad * 0.45);
      const ctrl = start.clone().multiplyScalar(0.4).add(new THREE.Vector3(-Math.sin(a) * 1.4, (r() - 0.5) * 1.2, 0));
      const end = new THREE.Vector3((r() - 0.5) * 0.5, (r() - 0.5) * 0.5, 0);
      return { start, ctrl, end, t0: 0.35 + r() * 2.2, dur: 0.9 + r() * 0.8 };
    });
    const ppos = new Float32Array(n * 3);
    const pcol = new Float32Array(n * 3);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(ppos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pcol, 3));
    const crowd = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ size: 0.15, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    group.add(crowd);
    const gray = new THREE.Color("#c3cbe0");
    const blue = glow(3);
    const tmp = new THREE.Color();

    const audience = textPlane("HEDEF KİTLE", 0.13, fonts.mono, 600, "rgba(233,237,245,0.55)", 6);
    audience.position.set(-1.7, 1.35, -0.4);
    const demand = textPlane("TALEP", 0.16, fonts.mono, 700, "#9db6ff", 8);
    demand.position.set(0, -1.2, 0.6);
    group.add(audience, demand);

    const s = { intro: 0, glow: 0 };
    const rig: Rig = { px: 0.6, py: 1.6, pz: 10, tx: 0, ty: 0, tz: 0 };
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(rig, { px: 0.8, py: 1.8, pz: 10.4 }, { px: -0.4, py: 0.35, pz: 7.6, duration: SHOT_SEC, ease: "power2.inOut" }, 0)
      .fromTo(s, { intro: 0 }, { intro: 1, duration: 1, ease: "power2.out" }, 0)
      .fromTo(s, { glow: 0 }, { glow: 1, duration: 2.2, ease: "power2.in" }, 0.6);
    return {
      group,
      tl,
      rig,
      update(local) {
        logo.rotation.set(0.05, -0.25 + local * 0.12, 0);
        let arriving = 0;
        paths.forEach((p, i) => {
          const u = clamp01((local - p.t0) / p.dur);
          const e = u ** 1.7;
          const a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c2 = e * e;
          const drift = u === 0 ? Math.sin(local * 0.7 + i) * 0.08 : 0;
          ppos[i * 3] = p.start.x * a + p.ctrl.x * b + p.end.x * c2 + drift;
          ppos[i * 3 + 1] = p.start.y * a + p.ctrl.y * b + p.end.y * c2;
          ppos[i * 3 + 2] = p.start.z * a + p.ctrl.z * b + p.end.z * c2;
          if (u > 0.9 && u < 1) arriving++;
          const vis = u >= 1 ? 0 : s.intro * (u === 0 ? 0.5 : 1);
          tmp.copy(gray).lerp(blue, Math.min(1, u * 1.4)).multiplyScalar(vis);
          pcol.set([tmp.r, tmp.g, tmp.b], i * 3);
        });
        pGeo.attributes.position.needsUpdate = true;
        pGeo.attributes.color.needsUpdate = true;
        logoMat.emissiveIntensity = 0.08 + s.glow * 0.5 + Math.min(0.8, arriving * 0.05);
        rings.forEach((m, i) => {
          const ph = (local * 0.42 + i / 3) % 1;
          m.scale.setScalar(0.85 + ph * 1.35);
          (m.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.9 * s.intro;
        });
        setOpacity(cross, s.intro);
        setOpacity(audience, span(local, 0.4, 1.0));
        setOpacity(demand, span(local, 1.4, 2.0));
      },
    };
  }

  const shots = [shotSonuc(), shotMarka(), shotWebsite(), shotSeo(), shotSosyal(), shotReklam()];
  for (const s of shots) {
    s.group.visible = false;
    scene.add(s.group);
  }

  /* ── Son işlem: parlama, renk kayması, gren, vinyet ── */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.62, 0.55, 0.98);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uShift: { value: 0 },
      uFlash: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTime, uShift, uFlash; uniform vec2 uRes, uCenter; varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec2 uv = vUv;
        float band = hash(vec2(floor(uv.y * 34.0), floor(uTime * 24.0)));
        uv.x += (step(0.72, band) - 0.28) * 0.035 * uShift;
        vec2 dir = uv - uCenter;
        vec3 col;
        col.r = texture2D(tDiffuse, uv + dir * 0.012 * uShift).r;
        col.g = texture2D(tDiffuse, uv).g;
        col.b = texture2D(tDiffuse, uv - dir * 0.012 * uShift).b;
        float vig = smoothstep(1.15, 0.3, length((vUv - uCenter) * vec2(1.0, 1.2)));
        col *= mix(0.6, 1.0, vig);
        col += uFlash * vec3(0.35, 0.45, 0.85);
        col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.05;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  composer.addPass(finish);

  /* ── Boyut ve yerleşim ── */
  let fit = 1;
  const resize = () => {
    const host = canvas.parentElement!;
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    const wide = w / h > 1.05;
    // Geniş ekranda sahne sağa (metin solda), dar ekranda yukarı (metin altta) kayar
    if (wide) camera.setViewOffset(w, h, -w * 0.21, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    camera.updateProjectionMatrix();
    fit = wide ? Math.max(1, 1.45 / (w / h)) : Math.max(1.3, 1.25 / (w / h));
    finish.uniforms.uRes.value.set(w, h);
    finish.uniforms.uCenter.value.set(wide ? 0.7 : 0.5, wide ? 0.5 : 0.7);
    const pix = (h * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    pixel.value = pix;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement!);

  /* ── Döngü ── */
  let current = -1;
  const cutAt = { t: -10 };
  const render = (time: number) => {
    const total = SHOT_SEC * shots.length;
    const forced = opts.forcedShot;
    const idx = forced !== undefined && forced >= 0 && forced < shots.length ? forced : Math.floor((time % total) / SHOT_SEC);
    const local = forced !== undefined && forced >= 0 ? time % SHOT_SEC : (time % total) - idx * SHOT_SEC;
    if (idx !== current) {
      if (current >= 0) {
        shots[current].group.visible = false;
        cutAt.t = time;
      }
      current = idx;
      shots[idx].group.visible = true;
      opts.onShot(idx);
    }
    const shot = shots[idx];
    shot.tl.time(local);
    shot.update(local, time);
    const { px, py, pz, tx, ty, tz } = shot.rig;
    camera.position.set(tx + (px - tx) * fit, ty + (py - ty) * fit, tz + (pz - tz) * fit);
    camera.lookAt(tx, ty, tz);
    dust.rotation.y = time * 0.01;
    dust.position.y = Math.sin(time * 0.2) * 0.15;
    const since = time - cutAt.t;
    finish.uniforms.uTime.value = time;
    finish.uniforms.uShift.value = since < 0.22 ? 1 - since / 0.22 : 0;
    finish.uniforms.uFlash.value = since < 0.35 ? 0.22 * (1 - since / 0.35) ** 2 : 0;
    composer.render();
  };

  let raf = 0;
  let clock = 0; // oynatılan toplam süre (sn); durunca ilerlemez
  let last = 0;
  const loop = (now: number) => {
    clock += Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    render(opts.frozenAt ?? clock);
    raf = requestAnimationFrame(loop);
  };

  return {
    play() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    pause() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    still() {
      cancelAnimationFrame(raf);
      raf = 0;
      cutAt.t = -10;
      render(SHOT_SEC * 0.9);
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        for (const mm of m ? (Array.isArray(m) ? m : [m]) : []) {
          for (const v of Object.values(mm)) if (v instanceof THREE.Texture) v.dispose();
          mm.dispose();
        }
      });
      envTex.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}

function heartPath(c: CanvasRenderingContext2D, x: number, y: number, s: number) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.45, y - s * 0.85, x, y - s * 0.4);
  c.bezierCurveTo(x + s * 0.45, y - s * 0.85, x + s * 0.9, y - s * 0.2, x, y + s * 0.35);
  c.closePath();
}
