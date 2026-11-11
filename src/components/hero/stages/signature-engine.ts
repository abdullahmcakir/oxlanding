import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { OX_OUTLINE } from "./ox-outline";
import { rng } from "./shape-sampler";

export type SignatureEngine = {
  select: (chapter: number) => void;
  pause: (value: boolean) => void;
  dispose: () => void;
};

const DURATION = 6.5;
const TRANSITION = 1.8;
const smooth = (x: number) => x * x * (3 - 2 * x);

export function createSignatureEngine(canvas: HTMLCanvasElement, onChapter: (chapter: number) => void): SignatureEngine {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 30);
  camera.position.z = 4.3;
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .035);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();

  const contours = OX_OUTLINE.map((line) => {
    let points = Array.from({ length: line.length / 2 }, (_, i) => new THREE.Vector2(line[i * 2], line[i * 2 + 1]));
    // Smooth the raster-traced contour before beveling: small sampling corners
    // otherwise become visible dents in a reflective material.
    for (let pass = 0; pass < 2; pass++) {
      points = points.flatMap((point, i) => {
        const next = points[(i + 1) % points.length];
        return [point.clone().lerp(next, .25), point.clone().lerp(next, .75)];
      });
    }
    return points;
  });
  const shapes = [new THREE.Shape(contours[0]), new THREE.Shape(contours[1]), new THREE.Shape(contours[3])];
  shapes[1].holes.push(new THREE.Path(contours[2]));
  shapes[2].holes.push(new THREE.Path(contours[4]));
  const raw = new THREE.ExtrudeGeometry(shapes, { depth: .19, bevelEnabled: true, bevelThickness: .014, bevelSize: .009, bevelOffset: -.008, bevelSegments: 6, steps: 1 });
  raw.translate(0, 0, -.095);
  const geometry = toCreasedNormals(raw, .8);
  // Keep the broad front/back planes optically flat; only bevels are smoothed.
  const normals = geometry.getAttribute("normal");
  const vertices = geometry.getAttribute("position");
  for (const face of geometry.groups) {
    if (face.materialIndex !== 0) continue;
    for (let i = face.start; i < face.start + face.count; i++) {
      normals.setXYZ(i, 0, 0, vertices.getZ(i) >= 0 ? 1 : -1);
    }
  }
  normals.needsUpdate = true;
  if (raw !== geometry) raw.dispose();
  const chrome = new THREE.Color("#cbd3e5");
  const cobalt = new THREE.Color("#2f6bff");
  const material = new THREE.MeshPhysicalMaterial({ color: chrome, metalness: 1, roughness: .17, clearcoat: 1, envMapIntensity: 1.65, transparent: true });
  const solid = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(solid); scene.add(group);
  const key = new THREE.DirectionalLight("#dce7ff", 3.5);
  key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight("#477aff", 4);
  rim.position.set(4, -1, 1); scene.add(rim);

  const random = rng(41);
  const sampler = new MeshSurfaceSampler(solid).build();
  const count = window.innerWidth < 768 ? 6500 : 12000;
  const positions = new Float32Array(count * 3), seeds = new Float32Array(count);
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(point); point.toArray(positions, i * 3); seeds[i] = random();
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
  const pointsMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { opacity: { value: 0 }, time: { value: 0 }, dispersion: { value: 0 }, pixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float seed; uniform float time; uniform float dispersion; uniform float pixelRatio; varying float vSeed;
      void main(){ vSeed=seed; vec3 p=position;
        p += vec3(sin(seed*97.0+time*.22),cos(seed*63.0+time*.19),sin(seed*47.0))*dispersion*.2;
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp((1.2+seed*1.6)*pixelRatio*3.0/-mv.z,1.0,5.0);
      }`,
    fragmentShader: `uniform float opacity; varying float vSeed;
      void main(){ float d=length(gl_PointCoord-.5); float a=1.0-smoothstep(.15,.5,d);
        vec3 color=mix(vec3(.18,.38,.9),vec3(.82,.92,1.),vSeed);
        gl_FragColor=vec4(color,a*opacity*(.35+vSeed*.65));
      }`,
  });
  const particles = new THREE.Points(pointsGeometry, pointsMaterial); group.add(particles);

  const linePositions: number[] = [];
  for (let layer = 0; layer < 12; layer++) {
    const z = -.095 + layer / 11 * .19;
    for (const contour of contours) {
      contour.forEach((p, index) => { const next = contour[(index + 1) % contour.length]; linePositions.push(p.x, p.y, z, next.x, next.y, z); });
    }
  }
  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const linesMaterial = new THREE.LineBasicMaterial({ color: "#8db4ff", transparent: true, opacity: 0, depthWrite: false });
  const lines = new THREE.LineSegments(linesGeometry, linesMaterial); group.add(lines);

  let elapsed = 0, previous = 0, frame = 0, lastChapter = -1;
  let paused = false, visible = true, disposed = false;
  let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const render = () => {
    const chapter = Math.floor(elapsed / DURATION) % 4;
    const next = (chapter + 1) % 4;
    const phase = elapsed % DURATION;
    const blend = smooth(THREE.MathUtils.clamp((phase - DURATION + TRANSITION) / TRANSITION, 0, 1));
    const weights = [0, 0, 0, 0]; weights[chapter] = 1 - blend; weights[next] += blend;
    if (chapter !== lastChapter) { lastChapter = chapter; onChapter(chapter); }
    const solidWeight = weights[0] + weights[3];
    solid.visible = solidWeight > .001;
    material.opacity = solidWeight;
    const blue = weights[3] / Math.max(.001, solidWeight);
    material.color.copy(chrome).lerp(cobalt, blue);
    material.metalness = 1 - blue * .65;
    material.roughness = .17 + blue * .06;
    material.depthWrite = solidWeight > .98;
    particles.visible = weights[1] > .001;
    pointsMaterial.uniforms.opacity.value = weights[1];
    pointsMaterial.uniforms.time.value = elapsed;
    pointsMaterial.uniforms.dispersion.value = Math.sin(weights[1] * Math.PI);
    lines.visible = weights[2] > .001;
    linesMaterial.opacity = weights[2] * .55;
    if (!media.matches) {
      pointerX += (targetX - pointerX) * .045; pointerY += (targetY - pointerY) * .045;
    }
    group.rotation.set(.08 + pointerY * .16 + Math.sin(elapsed * .21) * .06, -.24 + pointerX * .3 + Math.sin(elapsed * .27) * .27, -.09 + Math.sin(elapsed * .18) * .035);
    group.position.y = Math.sin(elapsed * .35) * .035;
    renderer.render(scene, camera);
  };
  const tick = (now: number) => {
    elapsed += Math.min((now - previous) / 1000, .05); previous = now; render(); frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    if (disposed) return;
    render();
    if (!paused && !media.matches && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); }
  };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect(); if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.position.z = Math.max(3.9, 3.7 / camera.aspect);
    camera.updateProjectionMatrix(); render();
  };
  const pointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || media.matches) return;
    const rect = canvas.getBoundingClientRect();
    targetX = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5);
    targetY = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5);
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }); io.observe(canvas);
  document.addEventListener("visibilitychange", sync); media.addEventListener("change", sync);
  window.addEventListener("pointermove", pointer, { passive: true });
  resize(); sync();
  return {
    select(chapter) { elapsed = THREE.MathUtils.clamp(chapter, 0, 3) * DURATION; sync(); },
    pause(value) { paused = value; sync(); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", sync); media.removeEventListener("change", sync); window.removeEventListener("pointermove", pointer);
      geometry.dispose(); material.dispose(); pointsGeometry.dispose(); pointsMaterial.dispose(); linesGeometry.dispose(); linesMaterial.dispose(); environment.dispose(); renderer.dispose();
    },
  };
}
