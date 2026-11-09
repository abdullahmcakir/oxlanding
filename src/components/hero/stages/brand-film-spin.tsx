"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildAssets, type Assets } from "./brand-film";
import { OX_OUTLINE } from "./ox-outline";
import { rng, sampleImage } from "./shape-sampler";

// Hero sahnesi "Stiller 5": Stiller 4'ün (brand-film-ref.tsx, olduğu gibi duruyor) Referans'taki gibi dönen hâli.
// Logo kesmeler boyunca kesintisiz döner (aynı nesne, değişen üslup). İki yüzü baskılı madeni para gibi davranır:
// arkaya döndüğünde ters ("xo") görünmez; incelip yeniden genişler. Kalın (katmanlı) üsluplarda yan yüz dönüş yönüne göre
// doğru tarafta görünür. Piksel üsluplarında dönüş piksel adımlarıyla, tarama/dither/ekolayzırda ızgaranın daralmasıyla olur.
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta sabit kare.

type Mode =
  | "beauty" | "chrome" | "cyber" | "clay" | "pixel" | "riso" | "glitch" | "brutal"
  | "cloud" | "zine" | "neon" | "pop" | "sketch" | "tracking" | "nodes"
  | "glass" | "scanlines" | "bauhaus" | "pile" | "os" | "balloon" | "iso" | "eq" | "dither" | "grunge";
const SEQUENCE: Mode[] = ["beauty", "glass", "scanlines", "bauhaus", "pile", "os", "balloon", "iso", "eq", "dither", "grunge", "neon"];
/** Sol başlıkta moda eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const SPIN_WORDS = [
  "sonuç", "Marka", "Sistem", "Tasarım", "Sosyal Medya", "Yazılım", "Kampanya", "Website", "Reels", "Logo", "Reklam", "Slogan",
];

const SHOT_MS = 2300;
const TRANS_MS = 520;
const LAYERS = 40;
const CAMERA = 1500;
const CLOUD_POINTS = 5200;

/** Logo her üslupta aynı yerde ve boyda (çapa); yalnız ağ sahnesinde kutular sığsın diye küçülür */
const FRAMING: Partial<Record<Mode, number>> = {
  beauty: 1, chrome: 1, cyber: 0.9, clay: 1, pixel: 1, riso: 1, glitch: 1, brutal: 1,
  cloud: 1, zine: 1, neon: 1, pop: 1, sketch: 1, tracking: 1, nodes: 0.78,
};
/** Çerçeve dışı ışımanın rengi */
const ACCENT: Partial<Record<Mode, string>> = {
  glass: "#9fb4ff", scanlines: "#bdbdbd", bauhaus: "#e8432a", pile: "#ff5a1f", os: "#19ff9a", balloon: "#b9a6ff",
  iso: "#d9d9d7", eq: "#ff2d87", dither: "#e6e3db", grunge: "#e2ff6b",
  beauty: "#2f6bff", chrome: "#c9b8ff", cyber: "#ff2bd6", clay: "#ff8fb8", pixel: "#8a3dff", riso: "#ff48b0",
  glitch: "#22e6ff", brutal: "#ffe14d", cloud: "#22d3ee", zine: "#ff3b30", neon: "#ff4fd8", pop: "#ffd400",
  sketch: "#d9d2c3", tracking: "#ff6a3d", nodes: "#a77bff",
};

type Sticker = "heart" | "sparkle" | "fire" | "star" | "bubble";
type Icon = "user" | "pencil" | "check" | "globe" | "search" | "heart" | "play" | "target" | "chart" | "comment" | "calendar" | "bolt" | "star";
type Theme = "glass" | "dark" | "sketch" | "cyber" | "pixel" | "brutal" | "glitch" | "neon" | "os";
type Pop =
  | { kind: "notif"; at: number; x: number; y: number; theme: Theme; app: [string, string]; glyph: Icon; title: string; body: string }
  | { kind: "chat"; at: number; x: number; y: number; text: string; bg: string; fg: string; comic?: boolean }
  | { kind: "sticker"; at: number; x: number; y: number; text: string; bg: string; fg: string; rot: number }
  | { kind: "emoji"; at: number; chars: Sticker[]; n?: number };

const GREEN: [string, string] = ["#3ee27a", "#12a150"];
const VIOLET: [string, string] = ["#a77bff", "#5b3df5"];
const PINK: [string, string] = ["#ff7ac6", "#ff2d87"];
const ORANGE: [string, string] = ["#ffb347", "#ff6a1f"];
const SKY: [string, string] = ["#5fd0ff", "#2f6bff"];

const POPS: Partial<Record<Mode, Pop[]>> = {
  glass: [{ kind: "notif", at: 0.3, x: 0.62, y: -0.66, theme: "dark", app: VIOLET, glyph: "star", title: "Marka kiti hazır", body: "Logo, renkler ve yazı tipleri" }],
  scanlines: [{ kind: "notif", at: 0.4, x: 0.62, y: 0.6, theme: "dark", app: SKY, glyph: "chart", title: "Analiz tamamlandı", body: "Panelde görüntüle" }],
  bauhaus: [{ kind: "sticker", at: 0.5, x: 0.66, y: -0.62, text: "YENİ TASARIM", bg: "#1f56e0", fg: "#fff", rot: -0.08 }],
  pile: [],
  os: [{ kind: "notif", at: 0.5, x: 0.55, y: 0.5, theme: "os", app: GREEN, glyph: "check", title: "YENİ TALEP", body: "OX.EXE · ŞİMDİ" }],
  balloon: [
    { kind: "emoji", at: 0.2, chars: ["sparkle", "heart", "star"], n: 8 },
    { kind: "chat", at: 0.4, x: 0.62, y: -0.66, text: "Kampanya harika olmuş", bg: "#ffffff", fg: "#111" },
  ],
  iso: [{ kind: "notif", at: 0.42, x: 0.62, y: -0.7, theme: "brutal", app: ORANGE, glyph: "globe", title: "Site yayında", body: "oxdijital.com" }],
  eq: [
    { kind: "emoji", at: 0.3, chars: ["heart", "fire", "sparkle"], n: 9 },
    { kind: "notif", at: 0.45, x: 0.62, y: -0.7, theme: "dark", app: PINK, glyph: "play", title: "Video yayında", body: "Reels · şimdi" },
  ],
  dither: [{ kind: "sticker", at: 0.4, x: 0.64, y: -0.66, text: "LOGO ONAYLANDI", bg: "#111", fg: "#fff", rot: 0.06 }],
  grunge: [{ kind: "notif", at: 0.4, x: 0.6, y: 0.62, theme: "glass", app: ["#e2ff6b", "#9bc400"], glyph: "target", title: "Yeni talep", body: "Reklamdan geldi" }],
  beauty: [
    { kind: "notif", at: 0.14, x: 0.62, y: -0.66, theme: "glass", app: GREEN, glyph: "comment", title: "Yeni müşteri", body: "Ayşe: Fiyat alabilir miyim?" },
    { kind: "notif", at: 0.32, x: 0.72, y: -0.24, theme: "glass", app: SKY, glyph: "calendar", title: "Yeni randevu", body: "Ücretsiz görüşme · Perşembe" },
    { kind: "emoji", at: 0.46, chars: ["heart", "sparkle", "star"], n: 9 },
  ],
  chrome: [
    { kind: "sticker", at: 0.16, x: 0.62, y: -0.64, text: "YENİ LOGO", bg: "#ff4fa3", fg: "#fff", rot: -0.1 },
    { kind: "notif", at: 0.36, x: 0.62, y: 0.56, theme: "glass", app: VIOLET, glyph: "star", title: "Marka kiti hazır", body: "Logo, renkler ve yazı tipleri" },
  ],
  cyber: [{ kind: "notif", at: 0.2, x: 0.66, y: -0.6, theme: "cyber", app: ["#ff2bd6", "#7a00ff"], glyph: "bolt", title: "SİSTEM ÇEVRİMİÇİ", body: "Tüm entegrasyonlar bağlı" }],
  clay: [
    { kind: "emoji", at: 0.12, chars: ["heart", "sparkle", "heart", "star"], n: 10 },
    { kind: "chat", at: 0.34, x: 0.6, y: -0.62, text: "Bu logo çok tatlı olmuş", bg: "#ff5fa2", fg: "#fff" },
  ],
  pixel: [{ kind: "notif", at: 0.3, x: 0.62, y: -0.66, theme: "pixel", app: PINK, glyph: "heart", title: "YENİ TAKİPÇİ", body: "SENİ TAKİP ETMEYE BAŞLADI" }],
  riso: [
    { kind: "sticker", at: 0.16, x: 0.6, y: -0.64, text: "KAMPANYA BAŞLADI", bg: "#0078bf", fg: "#fff", rot: 0.08 },
    { kind: "emoji", at: 0.38, chars: ["fire", "star", "sparkle"], n: 8 },
  ],
  glitch: [
    { kind: "emoji", at: 0.12, chars: ["fire", "heart", "sparkle"], n: 9 },
    { kind: "notif", at: 0.34, x: 0.6, y: -0.64, theme: "glitch", app: ["#ff2a4d", "#22e6ff"], glyph: "play", title: "VİDEO YAYINDA", body: "REELS · ŞİMDİ" },
  ],
  brutal: [
    { kind: "notif", at: 0.16, x: 0.6, y: -0.64, theme: "brutal", app: ORANGE, glyph: "globe", title: "Site yayında", body: "oxdijital.com" },
    { kind: "sticker", at: 0.4, x: 0.7, y: 0.5, text: "CANLI", bg: "#3ee27a", fg: "#000", rot: 0.1 },
  ],
  cloud: [{ kind: "notif", at: 0.2, x: 0.62, y: -0.64, theme: "dark", app: SKY, glyph: "search", title: "Dizine eklendi", body: "Aramada görünür oldun" }],
  zine: [
    { kind: "sticker", at: 0.12, x: 0.6, y: -0.66, text: "YENİ GÖNDERİ", bg: "#ffd60a", fg: "#111", rot: -0.08 },
    { kind: "emoji", at: 0.3, chars: ["heart", "bubble", "sparkle"], n: 9 },
    { kind: "chat", at: 0.48, x: 0.66, y: 0.5, text: "Kaydettim, harika", bg: "#2f4bff", fg: "#fff" },
  ],
  neon: [{ kind: "notif", at: 0.26, x: 0.62, y: -0.64, theme: "neon", app: PINK, glyph: "comment", title: "Yeni yorum", body: "Bu slogan akılda kalıyor" }],
  pop: [
    { kind: "sticker", at: 0.14, x: 0.62, y: -0.66, text: "WOW!", bg: "#ff2a2a", fg: "#fff", rot: -0.12 },
    { kind: "chat", at: 0.34, x: 0.6, y: 0.5, text: "Reklamınızı gördüm, bilgi alabilir miyim?", bg: "#ffffff", fg: "#111", comic: true },
  ],
  sketch: [{ kind: "notif", at: 0.22, x: 0.64, y: -0.62, theme: "sketch", app: ["#555", "#222"], glyph: "pencil", title: "Taslak hazır", body: "Eskizler seni bekliyor" }],
  tracking: [{ kind: "notif", at: 0.3, x: 0.66, y: 0.56, theme: "glass", app: ORANGE, glyph: "target", title: "Yeni talep", body: "Reklamdan geldi" }],
  nodes: [{ kind: "notif", at: 0.42, x: 0, y: -0.9, theme: "dark", app: VIOLET, glyph: "chart", title: "Rapor hazır", body: "Panelde görüntüle" }],
};

/** Dönüşte ekrandaki genişlik oranı (arka yüz ters görünmez; tam yandan ince bir şerit kalır) */
const ac = (a: number) => Math.max(0.06, Math.abs(Math.cos(a)));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeBack = (t: number) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;

function tintFrom(mask: HTMLCanvasElement, color: string) {
  const c = document.createElement("canvas");
  c.width = mask.width;
  c.height = mask.height;
  const x = c.getContext("2d")!;
  x.drawImage(mask, 0, 0);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}
/** Maskeyi dikey renk geçişiyle boyar (krom) */
function gradientFrom(mask: HTMLCanvasElement, stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = mask.width;
  c.height = mask.height;
  const x = c.getContext("2d")!;
  x.drawImage(mask, 0, 0);
  x.globalCompositeOperation = "source-in";
  const g = x.createLinearGradient(0, 0, c.width * 0.25, c.height);
  for (const [o, col] of stops) g.addColorStop(o, col);
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}
/** Maskenin dışına kalın kenar (dış hat): kaydırılmış kopyalar */
function strokeFrom(mask: HTMLCanvasElement, color: string, r: number, pad: number) {
  const c = document.createElement("canvas");
  c.width = mask.width + pad * 2;
  c.height = mask.height + pad * 2;
  const x = c.getContext("2d")!;
  const t = tintFrom(mask, color);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    x.drawImage(t, pad + Math.cos(a) * r, pad + Math.sin(a) * r);
  }
  x.drawImage(t, pad, pad);
  return c;
}
/** Maske içine nokta tram */
function dotsFrom(mask: HTMLCanvasElement, color: string, step: number, r: number) {
  const c = document.createElement("canvas");
  c.width = mask.width;
  c.height = mask.height;
  const x = c.getContext("2d")!;
  x.fillStyle = color;
  for (let y = 0; y < c.height; y += step)
    for (let i = 0, xx = (y / step) % 2 ? step / 2 : 0; xx < c.width; xx += step, i++) {
      x.beginPath();
      x.arc(xx, y, r, 0, Math.PI * 2);
      x.fill();
    }
  x.globalCompositeOperation = "destination-in";
  x.drawImage(mask, 0, 0);
  return c;
}

const PIX_HEART = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
const PIX_BUBBLE = ["XXXXXXX", "X.....X", "X.X.X.X", "X.....X", "XXXXXXX", ".X....."];

type Extra = Record<
  | "faceCyan" | "faceRed" | "faceTeal" | "faceWhite" | "faceChrome" | "faceClay" | "faceBlack" | "facePink" | "faceRisoBlue"
  | "risoDots" | "popFace" | "popDots" | "hatch" | "pencil" | "sheen" | "neonTube" | "neonCore" | "blackStroke" | "whiteStroke",
  HTMLCanvasElement
> & {
  ref: RefAssets;
  pad: number;
  blueSides: HTMLCanvasElement[];
  graySides: HTMLCanvasElement[];
  glowSides: HTMLCanvasElement[];
  magentaSides: HTMLCanvasElement[];
  chromeSides: HTMLCanvasElement[];
  claySides: HTMLCanvasElement[];
  cloud: Float32Array;
  cloudZ: Float32Array;
  cells: { cols: number; rows: number; on: Uint8Array };
};

/** Referans üslupları için hazırlıklar: vektör logo (parça parça), kabartma yükseklik haritası, piksel maske, aşınma deseni */
type RefAssets = {
  logo: Path2D;
  /** X, O, gülüş (OX_OUTLINE sırası) */
  parts: Path2D[];
  hm: Float32Array;
  hmW: number;
  hmH: number;
  gw: number;
  gh: number;
  mk: Uint8Array;
  speckle: HTMLCanvasElement;
};
function insidePoly(x: number, y: number, poly: number[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
function buildRef(a: Assets): RefAssets {
  // Vektör logo: yükseklik 1 birim, merkez 0, y aşağı
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const l of OX_OUTLINE)
    for (let i = 0; i < l.length; i += 2) {
      minX = Math.min(minX, l[i]);
      maxX = Math.max(maxX, l[i]);
      minY = Math.min(minY, l[i + 1]);
      maxY = Math.max(maxY, l[i + 1]);
    }
  const H = maxY - minY, mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
  const addLoop = (p: Path2D, l: number[]) => {
    for (let i = 0; i < l.length; i += 2) {
      const x = (l[i] - mx) / H, y = -(l[i + 1] - my) / H;
      if (i) p.lineTo(x, y);
      else p.moveTo(x, y);
    }
    p.closePath();
  };
  const parent = OX_OUTLINE.map((l, i) => OX_OUTLINE.findIndex((m, j) => j !== i && insidePoly(l[0], l[1], m)));
  const parts = OX_OUTLINE.map((_, i) => i)
    .filter((i) => parent[i] === -1)
    .map((i) => {
      const p = new Path2D();
      addLoop(p, OX_OUTLINE[i]);
      OX_OUTLINE.forEach((l, j) => parent[j] === i && addLoop(p, l));
      return p;
    });
  const logo = new Path2D();
  parts.forEach((p) => logo.addPath(p));

  // Kabartma yükseklik haritası (bulanık maske) ve keskin piksel maske
  const gw = 120;
  const gh = Math.round((gw * a.h) / a.w);
  const pad = 14;
  const hmW = gw + pad * 2, hmH = gh + pad * 2;
  const hc = document.createElement("canvas");
  hc.width = hmW;
  hc.height = hmH;
  const hx = hc.getContext("2d", { willReadFrequently: true })!;
  hx.filter = "blur(3px)";
  hx.drawImage(a.faceBlue, pad, pad, gw, gh);
  hx.drawImage(a.faceBlue, pad, pad, gw, gh);
  const hd = hx.getImageData(0, 0, hmW, hmH).data;
  const hm = new Float32Array(hmW * hmH);
  for (let i = 0; i < hm.length; i++) hm[i] = Math.min(1, (hd[i * 4 + 3] / 255) * 1.15) ** 0.85;
  const mc = document.createElement("canvas");
  mc.width = gw;
  mc.height = gh;
  const mx2 = mc.getContext("2d", { willReadFrequently: true })!;
  mx2.drawImage(a.faceBlue, 0, 0, gw, gh);
  const md = mx2.getImageData(0, 0, gw, gh).data;
  const mk = new Uint8Array(gw * gh);
  for (let i = 0; i < mk.length; i++) mk[i] = md[i * 4 + 3] > 90 ? 1 : 0;

  const speckle = document.createElement("canvas");
  speckle.width = speckle.height = 220;
  const sx = speckle.getContext("2d")!;
  const r = rng(29);
  for (let i = 0; i < 1100; i++) {
    sx.fillStyle = `rgba(42,40,33,${0.5 + r() * 0.5})`;
    sx.beginPath();
    sx.arc(r() * 220, r() * 220, 0.4 + r() * r() * 2.4, 0, Math.PI * 2);
    sx.fill();
  }
  return { logo, parts, hm, hmW, hmH, gw, gh, mk, speckle };
}

export function BrandFilmSpin({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onWordRef = useRef(onWord);
  useEffect(() => {
    onWordRef.current = onWord;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue("--font-space-mono").trim() || "ui-monospace, monospace";
    const sans = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

    const grain = document.createElement("canvas");
    grain.width = grain.height = 160;
    const g = grain.getContext("2d")!;
    const gimg = g.createImageData(160, 160);
    const noise = rng(9);
    for (let i = 0; i < gimg.data.length; i += 4) {
      const v = Math.floor(noise() * 255);
      gimg.data[i] = gimg.data[i + 1] = gimg.data[i + 2] = v;
      gimg.data[i + 3] = 255;
    }
    g.putImageData(gimg, 0, 0);
    const grainPattern = ctx.createPattern(grain, "repeat")!;

    let assets: Assets | null = null;
    let extra: Extra | null = null;
    let width = 0, height = 0, dpr = 1;
    let baseX = 0, baseY = 0, baseSize = 1;
    let cx = 0, cy = 0, size = 1;
    let region = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let frame = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let pointer: { x: number; y: number } | null = null;
    let tilt = 0;
    let curAngle = 0; // o karedeki dönüş açısı (ızgara ve piksel üsluplar için)

    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const wide = width >= 1024;
      frame = wide
        ? { x0: width * 0.5, y0: 92, x1: width - width * 0.045, y1: height - 108 }
        : { x0: 16, y0: 84, x1: width - 16, y1: Math.max(300, height * 0.42) };
      region = { x0: frame.x0 + 24, y0: frame.y0 + 40, x1: frame.x1 - 24, y1: frame.y1 - 36 };
      baseX = (frame.x0 + frame.x1) / 2;
      baseY = (frame.y0 + frame.y1) / 2 + 6;
      baseSize = Math.min(frame.x1 - frame.x0, frame.y1 - frame.y0) * (wide ? 0.46 : 0.5);
    };

    const reset = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const label = (s: string, x: number, y: number, color = "rgba(255,255,255,0.55)", align: CanvasTextAlign = "left", px = 10) => {
      ctx.font = `${px}px ${mono}`;
      ctx.letterSpacing = "1.2px";
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(s, x, y);
      ctx.letterSpacing = "0px";
    };

    const dims = () => {
      const a = assets!;
      const h = size;
      const w = (size * a.w) / a.h;
      return { w, h, depth: Math.max(w, h) * 0.12, half: Math.max(w, h) / 2 };
    };

    const sheenFace = (face: HTMLCanvasElement, p: number, strength: number) => {
      const s = extra!.sheen;
      const x = s.getContext("2d")!;
      x.globalCompositeOperation = "source-over";
      x.clearRect(0, 0, s.width, s.height);
      x.drawImage(face, 0, 0);
      x.globalCompositeOperation = "source-atop";
      const bx = (p * 1.8 - 0.4) * s.width;
      const grad = x.createLinearGradient(bx - s.width * 0.25, 0, bx + s.width * 0.25, s.height * 0.4);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, `rgba(255,255,255,${strength})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = grad;
      x.fillRect(0, 0, s.width, s.height);
      return s;
    };

    const drawSolid = (angle: number, face: HTMLCanvasElement, sides: HTMLCanvasElement[], alpha = 1) => {
      const { w, h, depth } = dims();
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const layers: { k: number; z: number; zr: number }[] = [];
      for (let k = 0; k < LAYERS; k++) {
        const z = (k / (LAYERS - 1) - 0.5) * depth;
        layers.push({ k, z, zr: z * cos });
      }
      layers.sort((p, q) => q.zr - p.zr);
      ctx.globalAlpha = alpha;
      layers.forEach((l, idx) => {
        const f = CAMERA / (CAMERA + l.zr);
        const x = cx + l.z * sin * f;
        ctx.setTransform(dpr * Math.max(0.06, Math.abs(cos)) * f, 0, 0, dpr * f, dpr * x, dpr * cy);
        const rank = cos >= 0 ? l.k : LAYERS - 1 - l.k;
        const img = idx === layers.length - 1 ? face : sides[Math.min(sides.length - 1, Math.floor((rank / LAYERS) * sides.length))];
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      });
      ctx.globalAlpha = 1;
      reset();
    };

    /** Düz yüz (dönüşle daralır). padded: kenarlı (dış hatlı) kopyalar için kenar payı */
    const drawFlat = (img: HTMLCanvasElement, angle: number, dx = 0, dy = 0, alpha = 1, padded = false) => {
      const { w, h } = dims();
      const k = w / assets!.w;
      const pw = padded ? extra!.pad * k : 0;
      ctx.globalAlpha = alpha;
      ctx.setTransform(dpr * ac(angle), 0, 0, dpr, dpr * (cx + dx), dpr * (cy + dy));
      ctx.drawImage(img, -w / 2 - pw, -h / 2 - pw, w + pw * 2, h + pw * 2);
      ctx.globalAlpha = 1;
      reset();
    };

    const reflection = (angle: number, face: HTMLCanvasElement, floor: string, alpha: number) => {
      const { w, h } = dims();
      const top = cy + h / 2 + size * 0.05;
      const k = 0.55;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.setTransform(dpr * ac(angle), 0, 0, -dpr * k, dpr * cx, dpr * (top + (h * k) / 2));
      ctx.drawImage(face, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      const grad = ctx.createLinearGradient(0, top, 0, top + h * k);
      grad.addColorStop(0, floor.replace("1)", "0.2)"));
      grad.addColorStop(0.7, floor);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - w, top, w * 2, h * k + 2);
    };

    const project = (px: number, py: number, angle: number) => {
      const { half, depth } = dims();
      const z = -depth / 2;
      const X = px * half;
      const xr = X * ac(angle) + z * Math.sin(angle);
      const zr = -X * Math.sin(angle) + z * Math.cos(angle);
      const f = CAMERA / (CAMERA + zr);
      return { x: cx + xr * f, y: cy + py * half * f };
    };

    const fill = (top: string, bottom: string, light: string | null = null) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, top);
      grad.addColorStop(1, bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      if (light) {
        const r = size * 1.7;
        const rg = ctx.createRadialGradient(cx, cy - size * 0.1, 0, cx, cy - size * 0.1, r);
        rg.addColorStop(0, light);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    };

    const finish = (grainAlpha: number, t: number, vignette = 0.5) => {
      const r = Math.max(width, height) * 0.75;
      const v = ctx.createRadialGradient(baseX, baseY, r * 0.35, baseX, baseY, r);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, `rgba(0,0,0,${vignette})`);
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = grainAlpha;
      ctx.globalCompositeOperation = "overlay";
      ctx.translate((t * 9301) % 160, (t * 4973) % 160);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(-160, -160, width + 320, height + 320);
      ctx.restore();
    };

    const corners = (x0: number, y0: number, x1: number, y1: number, len: number, color: string, lw = 1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      for (const [x, y, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x1, y1, -1, -1], [x0, y1, 1, -1]]) {
        ctx.moveTo(x + 0.5, y + sy * len + 0.5);
        ctx.lineTo(x + 0.5, y + 0.5);
        ctx.lineTo(x + sx * len + 0.5, y + 0.5);
      }
      ctx.stroke();
    };

    const sparkle = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    };

    /* ───────────── İkonlar ───────────── */

    const icon = (name: Icon, x: number, y: number, s: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 24, s / 24);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      switch (name) {
        case "user":
          ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
          ctx.moveTo(-8, 9);
          ctx.bezierCurveTo(-8, 2, 8, 2, 8, 9);
          ctx.stroke();
          break;
        case "pencil":
          ctx.moveTo(-8, 8);
          ctx.lineTo(-7, 3);
          ctx.lineTo(5, -9);
          ctx.lineTo(9, -5);
          ctx.lineTo(-3, 7);
          ctx.closePath();
          ctx.stroke();
          break;
        case "check":
          ctx.moveTo(-7, 0);
          ctx.lineTo(-2, 5);
          ctx.lineTo(8, -6);
          ctx.stroke();
          break;
        case "globe":
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.moveTo(-9, 0);
          ctx.lineTo(9, 0);
          ctx.ellipse(0, 0, 4, 9, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "search":
          ctx.arc(-2, -2, 6.5, 0, Math.PI * 2);
          ctx.moveTo(3, 3);
          ctx.lineTo(8, 8);
          ctx.stroke();
          break;
        case "heart":
          ctx.moveTo(0, 8);
          ctx.bezierCurveTo(-11, 1, -8, -10, 0, -4);
          ctx.bezierCurveTo(8, -10, 11, 1, 0, 8);
          ctx.fill();
          break;
        case "comment":
          ctx.moveTo(9, -1);
          ctx.arc(0, -1, 9, 0, Math.PI * 1.75, true);
          ctx.lineTo(-9, 9);
          ctx.lineTo(-4, 7);
          ctx.closePath();
          ctx.fill();
          break;
        case "play":
          ctx.moveTo(-5, -8);
          ctx.lineTo(8, 0);
          ctx.lineTo(-5, 8);
          ctx.closePath();
          ctx.fill();
          break;
        case "target":
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.moveTo(5, 0);
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "chart":
          ctx.moveTo(-8, 8);
          ctx.lineTo(8, 8);
          ctx.moveTo(-5, 8);
          ctx.lineTo(-5, 1);
          ctx.moveTo(0, 8);
          ctx.lineTo(0, -6);
          ctx.moveTo(5, 8);
          ctx.lineTo(5, -2);
          ctx.stroke();
          break;
        case "calendar":
          ctx.roundRect(-8, -7, 16, 15, 3);
          ctx.moveTo(-8, -2);
          ctx.lineTo(8, -2);
          ctx.moveTo(-4, -10);
          ctx.lineTo(-4, -5);
          ctx.moveTo(4, -10);
          ctx.lineTo(4, -5);
          ctx.stroke();
          break;
        case "bolt":
          ctx.moveTo(2, -10);
          ctx.lineTo(-6, 2);
          ctx.lineTo(0, 2);
          ctx.lineTo(-2, 10);
          ctx.lineTo(6, -2);
          ctx.lineTo(0, -2);
          ctx.closePath();
          ctx.fill();
          break;
        case "star":
          for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 ? 4 : 9.5;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    };

    const bitmap = (rows: string[], x: number, y: number, cell: number, color: string) => {
      ctx.fillStyle = color;
      rows.forEach((r, j) => {
        for (let i = 0; i < r.length; i++) if (r[i] === "X") ctx.fillRect(Math.round(x + i * cell), Math.round(y + j * cell), cell, cell);
      });
    };

    const sketchRect = (x: number, y: number, w: number, h: number, seed: number) => {
      const r = rng(seed);
      const j = () => (r() - 0.5) * 3;
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        ctx.moveTo(x + j(), y + j());
        ctx.lineTo(x + w + j(), y + j());
        ctx.lineTo(x + w + j(), y + h + j());
        ctx.lineTo(x + j(), y + h + j());
        ctx.closePath();
        ctx.stroke();
      }
    };

    /* ───────────── Çıkışlar: bildirim, sohbet, sticker, emoji ───────────── */

    /** Sembolden fırlayıp yerine yaylanarak oturma: konum, ölçek, dönüş, saydamlık */
    /** Sembolden çıkıp hafif bir yay çizerek yerine oturma (dönme yok) */
    const launch = (p: number, at: number, tx: number, ty: number, t: number, i: number) => {
      const k = span(p, at, at + 0.24);
      if (k <= 0) return null;
      const e = 1 - (1 - k) ** 4;
      const arc = Math.sin(k * Math.PI);
      const x = cx + (tx - cx) * e + arc * 18 * (i % 2 ? 1 : -1);
      const y = cy + (ty - cy) * e - arc * 26 + (k >= 1 ? Math.sin(t * 1.7 + i) * 2 : 0);
      return { x, y, s: 0.55 + 0.45 * easeBack(k), rot: 0, a: Math.min(1, k * 4) };
    };

    const notif = (pop: Extract<Pop, { kind: "notif" }>, t: number) => {
      const w = 276, h = 68;
      const x0 = -w / 2, y0 = -h / 2;
      const th = pop.theme;
      const pixel = th === "pixel" || th === "os";
      const r = th === "glass" || th === "dark" ? 20 : th === "brutal" ? 14 : th === "neon" ? 16 : pixel || th === "sketch" ? 0 : 6;
      const bg: Record<Theme, string> = {
        glass: "rgba(255,255,255,0.9)",
        dark: "rgba(22,23,28,0.95)",
        sketch: "#f6f3ec",
        cyber: "rgba(14,4,26,0.94)",
        pixel: "#0b0f2a",
        brutal: "#ffffff",
        glitch: "#050505",
        neon: "rgba(26,8,20,0.92)",
        os: "#034d47",
      };
      const fg = th === "os" ? "#19ff9a" : th === "glass" || th === "brutal" || th === "sketch" ? "#0b0b0c" : "#ffffff";
      const sub = th === "glass" || th === "brutal" || th === "sketch" ? "rgba(0,0,0,0.55)" : th === "cyber" ? "#ff8bea" : th === "neon" ? "#ffb3ef" : "rgba(255,255,255,0.6)";
      // Gölge / ışıma
      if (th === "brutal") {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.roundRect(x0 + 7, y0 + 7, w, h, r);
        ctx.fill();
      } else if (th === "cyber" || th === "neon") {
        ctx.shadowColor = th === "cyber" ? "#33f0ff" : "#ff4fd8";
        ctx.shadowBlur = 26;
      } else if (!pixel) {
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 14;
      }
      ctx.fillStyle = bg[th];
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, r);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      // Kenar
      if (th === "brutal") {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (th === "cyber" || th === "neon") {
        ctx.strokeStyle = th === "cyber" ? "#33f0ff" : "#ff4fd8";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (pixel) {
        ctx.fillStyle = th === "os" ? "#19ff9a" : "#fff";
        ctx.fillRect(x0 + 3, y0, w - 6, 3);
        ctx.fillRect(x0 + 3, y0 + h - 3, w - 6, 3);
        ctx.fillRect(x0, y0 + 3, 3, h - 6);
        ctx.fillRect(x0 + w - 3, y0 + 3, 3, h - 6);
      } else if (th === "sketch") {
        ctx.strokeStyle = "#232327";
        ctx.lineWidth = 1.4;
        sketchRect(x0, y0, w, h, Math.floor(t * 8));
      } else if (th === "glitch") {
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (th === "dark") {
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Uygulama ikonu
      const ix = x0 + 13, iy = y0 + 13, is = 42;
      if (th === "os") {
        ctx.fillStyle = "#19ff9a";
        ctx.fillRect(ix, iy, is, is);
        icon(pop.glyph, ix + is / 2, iy + is / 2, 22, "#034d47");
      } else if (pixel) {
        bitmap(PIX_HEART, ix + 7, iy + 9, 4, "#ff4d6d");
      } else {
        const gr = ctx.createLinearGradient(ix, iy, ix + is, iy + is);
        gr.addColorStop(0, pop.app[0]);
        gr.addColorStop(1, pop.app[1]);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.roundRect(ix, iy, is, is, th === "brutal" ? 10 : th === "sketch" ? 0 : 12);
        ctx.fill();
        if (th === "brutal") {
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        icon(pop.glyph, ix + is / 2, iy + is / 2, 22, "#fff");
      }
      // Yazılar
      const tx = x0 + 68;
      const titleFont =
        th === "pixel" || th === "os" || th === "cyber" || th === "glitch" ? `700 13px ${mono}` : th === "sketch" ? `italic 650 15px ${sans}` : `650 15px ${sans}`;
      const bodyFont = th === "pixel" || th === "os" || th === "cyber" || th === "glitch" ? `10.5px ${mono}` : th === "sketch" ? `italic 13px ${sans}` : `13px ${sans}`;
      const drawText = (col: string, subCol: string, ox = 0) => {
        ctx.textAlign = "left";
        ctx.font = titleFont;
        ctx.fillStyle = col;
        ctx.fillText(pop.title, tx + ox, y0 + 29);
        ctx.font = bodyFont;
        ctx.fillStyle = subCol;
        ctx.fillText(pop.body, tx + ox, y0 + 49);
        if (!pixel && th !== "glitch" && th !== "cyber") {
          ctx.font = `11px ${sans}`;
          ctx.textAlign = "right";
          ctx.fillStyle = subCol;
          ctx.fillText("şimdi", x0 + w - 14, y0 + 27);
        }
      };
      if (th === "glitch") {
        const j = Math.floor(t * 14) % 3 === 0 ? 3 : 1;
        ctx.globalCompositeOperation = "lighter";
        drawText("#ff2a4d", "#ff2a4d", -j);
        drawText("#22e6ff", "#22e6ff", j);
        ctx.globalCompositeOperation = "source-over";
      }
      drawText(fg, sub);
    };

    const chat = (pop: Extract<Pop, { kind: "chat" }>) => {
      ctx.font = `${pop.comic ? "800 italic 16px" : "600 15px"} ${sans}`;
      const tw = Math.min(260, ctx.measureText(pop.text).width);
      const lines: string[] = [];
      {
        // basit satır kırma
        let line = "";
        for (const word of pop.text.split(" ")) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > 240 && line) {
            lines.push(line);
            line = word;
          } else line = test;
        }
        lines.push(line);
      }
      const w = Math.min(tw, 240) + 34, h = 22 + lines.length * 20;
      const x0 = -w / 2, y0 = -h / 2;
      if (pop.comic) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(5, 5, w / 2 + 12, h / 2 + 10, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
      }
      ctx.fillStyle = pop.bg;
      ctx.beginPath();
      if (pop.comic) ctx.ellipse(0, 0, w / 2 + 12, h / 2 + 10, 0, 0, Math.PI * 2);
      else ctx.roundRect(x0, y0, w, h, 20);
      ctx.fill();
      // kuyruk
      ctx.beginPath();
      ctx.moveTo(x0 + 18, y0 + h - 6);
      ctx.lineTo(x0 + 2, y0 + h + 12);
      ctx.lineTo(x0 + 34, y0 + h - 2);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      if (pop.comic) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2 + 12, h / 2 + 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = pop.fg;
      ctx.textAlign = "center";
      lines.forEach((l, i) => ctx.fillText(l, 0, y0 + 26 + i * 20));
    };

    const sticker = (pop: Extract<Pop, { kind: "sticker" }>) => {
      ctx.rotate(pop.rot);
      ctx.font = `900 22px ${sans}`;
      ctx.letterSpacing = "0.5px";
      const w = ctx.measureText(pop.text).width + 40, h = 50;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 18);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = pop.bg;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 13);
      ctx.fill();
      ctx.fillStyle = pop.fg;
      ctx.textAlign = "center";
      ctx.fillText(pop.text, 0, 8);
      ctx.letterSpacing = "0px";
    };

    /** Kendi sticker setimiz: beyaz kenar, renk geçişi, parlama noktası (sistem emojisi yok) */
    const STICKER_COLORS: Record<Sticker, [string, string]> = {
      heart: ["#ff9cbc", "#ff2d6f"],
      sparkle: ["#fff6b8", "#ffc400"],
      fire: ["#ffd166", "#ff4d1f"],
      star: ["#ffe789", "#ff9f1c"],
      bubble: ["#a8d4ff", "#2f6bff"],
    };
    const stickerPath = (kind: Sticker) => {
      const p = new Path2D();
      switch (kind) {
        case "heart":
          p.moveTo(0, 15);
          p.bezierCurveTo(-24, 0, -15, -21, 0, -8);
          p.bezierCurveTo(15, -21, 24, 0, 0, 15);
          break;
        case "sparkle":
          p.moveTo(0, -19);
          p.quadraticCurveTo(2, -2, 19, 0);
          p.quadraticCurveTo(2, 2, 0, 19);
          p.quadraticCurveTo(-2, 2, -19, 0);
          p.quadraticCurveTo(-2, -2, 0, -19);
          break;
        case "star":
          for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 ? 8 : 18;
            if (i) p.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            else p.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          p.closePath();
          break;
        case "fire":
          p.moveTo(0, -19);
          p.bezierCurveTo(11, -7, 15, 1, 13, 8);
          p.bezierCurveTo(11, 16, 5, 18, 0, 18);
          p.bezierCurveTo(-5, 18, -12, 15, -13, 7);
          p.bezierCurveTo(-14, 0, -7, -3, -5, -9);
          p.bezierCurveTo(-2, -4, 3, -7, 0, -19);
          break;
        case "bubble":
          p.roundRect(-18, -14, 36, 25, 11);
          p.moveTo(-8, 10);
          p.lineTo(-13, 18);
          p.lineTo(0, 11);
          break;
      }
      return p;
    };
    const drawSticker = (kind: Sticker, s: number) => {
      const path = stickerPath(kind);
      const [c0, c1] = STICKER_COLORS[kind];
      ctx.save();
      ctx.scale(s / 40, s / 40);
      ctx.lineJoin = "round";
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.28)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.stroke(path);
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#ffffff";
      ctx.fill(path);
      const g = ctx.createLinearGradient(0, -19, 0, 19);
      g.addColorStop(0, c0);
      g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.fill(path);
      ctx.clip(path);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(-6, -9, 7, 3.6, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const emojiBurst = (pop: Extract<Pop, { kind: "emoji" }>, p: number, angle: number) => {
      const n = pop.n ?? 9;
      const r = rng(pop.at * 1000 + 3);
      const pts = assets!.points;
      for (let i = 0; i < n; i++) {
        const at = pop.at + r() * 0.16;
        const dir = -Math.PI / 2 + (r() - 0.5) * 2.4;
        const dist = size * (0.5 + r() * 0.5);
        const px = 30 + r() * 20;
        const spin = (r() - 0.5) * 0.7;
        const k = (i * 233) % 2600;
        const kind = pop.chars[i % pop.chars.length];
        const u = span(p, at, at + 0.46);
        if (u <= 0 || u >= 1) continue;
        const from = project(pts[k * 2] * 0.6, pts[k * 2 + 1] * 0.6, angle);
        const e = easeOut(u);
        const x = from.x + Math.cos(dir) * dist * e;
        const y = from.y + Math.sin(dir) * dist * e - size * 0.12 * u;
        const sc = u < 0.22 ? easeBack(u / 0.22) : 1 - (u > 0.75 ? (u - 0.75) / 0.25 : 0) * 0.4;
        ctx.save();
        ctx.globalAlpha = u > 0.75 ? (1 - u) / 0.25 : 1;
        ctx.translate(x, y);
        ctx.rotate(spin * e);
        drawSticker(kind, px * sc);
        ctx.restore();
      }
    };

    const pops = (mode: Mode, p: number, t: number, angle: number) => {
      // Emojiler kartların altında kalsın: önce onlar çizilir
      [...(POPS[mode] ?? [])].sort((x, y) => Number(y.kind === "emoji") - Number(x.kind === "emoji")).forEach((pop, i) => {
        reset();
        if (pop.kind === "emoji") return emojiBurst(pop, p, angle);
        // Hedef konum çerçevenin içinde kalsın
        const half = pop.kind === "notif" ? 146 : pop.kind === "chat" ? 150 : 110;
        const tx = Math.min(frame.x1 - half - 14, Math.max(frame.x0 + half + 14, cx + pop.x * size));
        const ty = Math.min(frame.y1 - 56, Math.max(frame.y0 + 64, cy + pop.y * size));
        const m = launch(p, pop.at, tx, ty, t, i);
        if (!m) return;
        ctx.save();
        ctx.globalAlpha = m.a;
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        ctx.scale(m.s, m.s);
        if (pop.kind === "notif") notif(pop, t);
        else if (pop.kind === "chat") chat(pop);
        else sticker(pop);
        ctx.restore();
      });
      reset();
    };

    /** Sembolden süzülen küçük ikonlar (piksel kalp/yorum ya da çizgi ikon) */
    const emit = (angle: number, p: number, style: "pixel" | "line", n = 9) => {
      const pts = assets!.points;
      const r = rng(77);
      for (let i = 0; i < n; i++) {
        const t0 = 0.08 + r() * 0.62;
        const k = (i * 211) % 2600;
        const side = r() - 0.5;
        const isHeart = r() < 0.65;
        const u = span(p, t0, t0 + 0.38);
        if (u <= 0 || u >= 1) continue;
        const from = project(pts[k * 2], pts[k * 2 + 1], angle);
        let x = from.x + side * size * 0.8 * easeOut(u) + Math.sin(u * 7 + i) * 8;
        let y = from.y - size * 0.75 * easeOut(u);
        const s = 0.6 + 0.4 * easeOut(Math.min(1, u * 3));
        if (style === "pixel") {
          const cell = 4;
          x = Math.round(x / cell) * cell;
          y = Math.round(y / cell) * cell;
          if (u > 0.8 && Math.floor(u * 30) % 2) continue;
          bitmap(isHeart ? PIX_HEART : PIX_BUBBLE, x, y, cell, isHeart ? "#ff4d6d" : "#ffffff");
        } else {
          ctx.globalAlpha = Math.min(1, u * 5) * (1 - u);
          icon(isHeart ? "heart" : "comment", x, y, 26 * s, isHeart ? "#ff3b5c" : "#ffffff");
          ctx.globalAlpha = 1;
        }
      }
    };

    /* ───────────── Üsluplar ───────────── */

    const beauty = (angle: number, t: number, p: number) => {
      fill("#060912", "#020203", "rgba(47,107,255,0.2)");
      reflection(angle, assets!.faceBlue, "rgba(2,2,3,1)", 0.16);
      drawSolid(angle, sheenFace(assets!.faceBlue, p, 0.55), extra!.blueSides);
      finish(0.05, t);
    };

    // Y2K krom: holografik zemin, sıvı krom sembol, parıltılar
    const chrome = (angle: number, t: number, p: number) => {
      const cg = ctx.createConicGradient(t * 0.35, cx, cy);
      for (const [o, c] of [[0, "#ffd6f5"], [0.2, "#c9f2ff"], [0.4, "#e3d6ff"], [0.6, "#fff1c4"], [0.8, "#cdfbe8"], [1, "#ffd6f5"]] as const)
        cg.addColorStop(o, c);
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, width, height);
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.4);
      rg.addColorStop(0, "rgba(255,255,255,0.75)");
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, width, height);
      // Zemin gölgesi
      ctx.fillStyle = "rgba(90,60,140,0.18)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.62, size * 0.55, size * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      drawSolid(angle, sheenFace(extra!.faceChrome, p, 0.9), extra!.chromeSides);
      const r = rng(13);
      for (let i = 0; i < 9; i++) {
        const x = cx + (r() - 0.5) * size * 1.9;
        const y = cy + (r() - 0.5) * size * 1.5;
        const tw = Math.max(0, Math.sin(t * 3 + i * 1.7));
        sparkle(x, y, (5 + r() * 9) * tw, "rgba(255,255,255,0.95)");
      }
      finish(0.07, t, 0.15);
    };

    const cyber = (angle: number, t: number, p: number) => {
      const { x0, x1, y1 } = region;
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#0a0214");
      bg.addColorStop(0.6, "#1a0430");
      bg.addColorStop(1, "#06010c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      const horizon = cy + size * 0.42;
      const sr = size * 0.62;
      const sy = horizon - sr * 0.35;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, sy, sr, 0, Math.PI * 2);
      ctx.clip();
      const sg = ctx.createLinearGradient(0, sy - sr, 0, sy + sr);
      sg.addColorStop(0, "#ffd34d");
      sg.addColorStop(0.55, "#ff5a8a");
      sg.addColorStop(1, "#c41fd6");
      ctx.fillStyle = sg;
      ctx.fillRect(cx - sr, sy - sr, sr * 2, sr * 2);
      ctx.fillStyle = "#1a0430";
      for (let i = 0; i < 6; i++) {
        const yy = sy + sr * (0.1 + i * 0.16) + ((t * 18) % (sr * 0.16));
        ctx.fillRect(cx - sr, yy, sr * 2, 2 + i * 1.6);
      }
      ctx.restore();
      ctx.globalAlpha = 0.35;
      ctx.filter = "blur(30px)";
      ctx.fillStyle = "#ff2bd6";
      ctx.beginPath();
      ctx.arc(cx, sy, sr * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#07010e";
      ctx.fillRect(x0 - 40, horizon, x1 - x0 + 80, height - horizon);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0 - 40, horizon, x1 - x0 + 80, y1 + 140 - horizon);
      ctx.clip();
      ctx.strokeStyle = "rgba(255,43,214,0.7)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "#ff2bd6";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const phase = (t * 0.8) % 1;
      for (let i = 0; i < 12; i++) {
        const k = (i + phase) / 12;
        const yy = horizon + (height - horizon) * k * k;
        ctx.moveTo(x0 - 40, yy);
        ctx.lineTo(x1 + 40, yy);
      }
      for (let i = -14; i <= 14; i++) {
        ctx.moveTo(cx + i * 10, horizon);
        ctx.lineTo(cx + i * 120, height);
      }
      ctx.stroke();
      ctx.restore();
      const { w, h } = dims();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.6;
      ctx.filter = "blur(16px)";
      ctx.setTransform(dpr * ac(angle), 0, 0, dpr, dpr * cx, dpr * cy);
      ctx.drawImage(extra!.faceCyan, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, sheenFace(extra!.faceCyan, p, 0.6), extra!.magentaSides);
      finish(0.08, t, 0.45);
    };

    // Şişkin kil: pastel zemin, yumuşak gölgeli pembe sembol, süzülen kil damlaları
    const clay = (angle: number, t: number) => {
      fill("#ffe0cf", "#e4d2ff");
      const r = rng(31);
      for (let i = 0; i < 5; i++) {
        const bx = cx + (r() - 0.5) * size * 2.1;
        const by = cy + (r() - 0.5) * size * 1.6 + Math.sin(t * 1.4 + i) * 6;
        const br = size * (0.06 + r() * 0.08);
        const col = ["#ffd166", "#7bdff2", "#b5a8ff", "#ff9bb3", "#9ef0b8"][i];
        const gg = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.35, br * 0.1, bx, by, br);
        gg.addColorStop(0, "#ffffff");
        gg.addColorStop(0.25, col);
        gg.addColorStop(1, col);
        ctx.shadowColor = "rgba(120,70,120,0.25)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = "rgba(140,70,110,0.2)";
      ctx.filter = "blur(10px)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.6, size * 0.55, size * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
      const bob = Math.sin(t * 2) * 5;
      cy += bob;
      drawSolid(angle, extra!.faceClay, extra!.claySides);
      cy -= bob;
      finish(0.06, t, 0.1);
    };

    const pixel = (angle: number, t: number, p: number) => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#130b3a";
      ctx.fillRect(0, 0, width, height);
      const { x0, y0, x1, y1 } = region;
      const ps = Math.max(4, Math.round(size / extra!.cells.rows));
      const r = rng(5);
      for (let i = 0; i < 46; i++) {
        const sx = Math.round((x0 + r() * (x1 - x0)) / ps) * ps;
        const sy = Math.round((y0 + r() * (y1 - y0)) / ps) * ps;
        const on = (Math.floor(t * 4) + i) % 5 !== 0;
        ctx.fillStyle = on ? ["#ffffff", "#ffe066", "#7cf9ff"][i % 3] : "rgba(255,255,255,0.2)";
        ctx.fillRect(sx, sy, ps / 2, ps / 2);
      }
      const groundY = Math.round((cy + size * 0.62) / ps) * ps;
      for (let x = Math.floor(x0 / ps) * ps; x < x1; x += ps) {
        ctx.fillStyle = (x / ps) % 2 ? "#3ddc84" : "#2fbf6f";
        ctx.fillRect(x, groundY, ps, ps);
        ctx.fillStyle = "#7a4a2a";
        ctx.fillRect(x, groundY + ps, ps, ps * 3);
      }
      const { cols, rows, on } = extra!.cells;
      const bob = Math.floor(t * 3) % 2 ? -ps : 0;
      const sx = Math.max(0.12, Math.round(ac(angle) * 6) / 6);
      const lx = Math.round((cx - (cols * ps * sx) / 2) / ps) * ps;
      const ly = Math.round((cy - (rows * ps) / 2) / ps) * ps + bob;
      const cw = Math.max(2, Math.round(ps * sx));
      const dir = Math.sin(angle) >= 0 ? 1 : -1;
      const filled = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows && on[j * cols + i] === 1;
      for (let d = 2; d >= 1; d--) {
        ctx.fillStyle = d === 2 ? "#7a1fa8" : "#b02fd6";
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (filled(i, j)) ctx.fillRect(lx + i * cw + dir * d * (ps / 2), ly + j * ps + d * (ps / 2), cw, ps);
      }
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          if (!filled(i, j)) continue;
          ctx.fillStyle = !filled(i, j - 1) ? "#ffe066" : !filled(i - 1, j) ? "#ffb347" : "#ff8a3d";
          ctx.fillRect(lx + i * cw, ly + j * ps, cw, ps);
        }
      emit(angle, p, "pixel", 12);
      ctx.imageSmoothingEnabled = true;
    };

    // Risograf: kâğıt, sarı daire, mavi düz baskı + pembe nokta tram, kayık baskı
    const riso = (angle: number, t: number) => {
      fill("#f3eee3", "#ece5d6");
      const view = angle;
      const mis = Math.floor(t * 4) % 2 ? 4 : 2;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "#ffe800";
      ctx.beginPath();
      ctx.arc(cx + size * 0.18, cy - size * 0.1, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      drawFlat(extra!.faceRisoBlue, view, mis, mis * 0.5, 0.92);
      drawFlat(extra!.risoDots, view, -mis, -mis * 0.5, 1);
      drawFlat(extra!.facePink, view, -mis * 2.2, mis * 1.6, 0.35);
      ctx.globalCompositeOperation = "source-over";
      // Kesim işaretleri
      const { x0, y0, x1, y1 } = region;
      ctx.strokeStyle = "rgba(255,72,176,0.7)";
      ctx.lineWidth = 1;
      corners(x0 + 20, y0 + 20, x1 - 20, y1 - 20, 22, "rgba(0,120,191,0.6)");
      finish(0.22, t, 0.12);
    };

    const glitch = (angle: number, t: number, p: number) => {
      fill("#050505", "#020202");
      const view = angle;
      const tick = Math.floor(t * 12);
      const r = rng(tick);
      const amt = 4 + (tick % 4 === 0 ? 10 : 0);
      ctx.globalCompositeOperation = "lighter";
      drawFlat(extra!.faceRed, view, -amt, 0, 0.9);
      drawFlat(extra!.faceTeal, view, amt, 0, 0.9);
      ctx.globalCompositeOperation = "source-over";
      drawFlat(extra!.faceWhite, view, 0, 0, 0.85);
      const { h } = dims();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 0; i < 5; i++) {
        const sx = Math.floor((cx + (r() - 0.5) * size * 0.9) * dpr);
        const sy = Math.floor((cy + (r() - 0.2) * h * 0.5) * dpr);
        const sw = Math.floor((6 + r() * 40) * dpr);
        ctx.globalAlpha = 0.55;
        ctx.drawImage(canvas, sx, sy, sw, 1, sx, sy, sw, Math.floor((40 + r() * 120) * dpr));
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 7; i++) {
        const y = Math.floor((cy - h / 2 + r() * h) * dpr);
        const bh = Math.floor((3 + r() * 22) * dpr);
        const dx = Math.floor((r() - 0.5) * 70 * dpr);
        ctx.drawImage(canvas, 0, y, canvas.width, bh, dx, y, canvas.width, bh);
      }
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      for (let y = region.y0; y < region.y1; y += 3) ctx.fillRect(region.x0, y, region.x1 - region.x0, 1);
      emit(angle, p, "line", 8);
      finish(0.14, t, 0.6);
    };

    // Neo-brutalizm: sarı zemin, siyah kalın kenar, sert gölge, basit şekiller
    const brutal = (angle: number, t: number) => {
      fill("#ffe14d", "#ffd23a");
      const { x0, y0, x1, y1 } = region;
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = x0; x < x1; x += 32) {
        ctx.moveTo(x + 0.5, y0 - 60);
        ctx.lineTo(x + 0.5, y1 + 60);
      }
      for (let y = y0 - 60; y < y1 + 60; y += 32) {
        ctx.moveTo(x0, y + 0.5);
        ctx.lineTo(x1, y + 0.5);
      }
      ctx.stroke();
      // Şekiller
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#7c5cff";
      ctx.beginPath();
      ctx.arc(cx - size * 0.85, cy + size * 0.45, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(cx + size * 0.9, cy - size * 0.1);
      ctx.rotate(t * 0.8);
      ctx.fillStyle = "#3ee27a";
      ctx.fillRect(-size * 0.08, -size * 0.08, size * 0.16, size * 0.16);
      ctx.strokeRect(-size * 0.08, -size * 0.08, size * 0.16, size * 0.16);
      ctx.restore();
      const view = angle;
      drawFlat(extra!.blackStroke, view, 12, 12, 1, true);
      drawFlat(extra!.blackStroke, view, 0, 0, 1, true);
      drawFlat(extra!.facePink, view);
      finish(0.06, t, 0.1);
    };

    const cloud = (angle: number, t: number) => {
      fill("#061018", "#020407", "rgba(0,200,255,0.1)");
      const { w, h, depth, half } = dims();
      const pts = extra!.cloud;
      const zs = extra!.cloudZ;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const cols = ["rgba(80,120,255,0.35)", "rgba(80,200,255,0.55)", "rgba(120,255,220,0.75)", "rgba(230,255,250,0.95)"];
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = cols[b];
        const s = 1 + b * 0.4;
        for (let i = 0; i < CLOUD_POINTS; i++) {
          const z = zs[i] * depth * 0.5;
          const X = pts[i * 2] * half;
          const xr = X * cos + z * sin;
          const zr = -X * sin + z * cos;
          const near = Math.min(3, Math.max(0, Math.floor(((-zr / (half * 0.6)) * 0.5 + 0.5) * 4)));
          if (near !== b) continue;
          const f = CAMERA / (CAMERA + zr);
          ctx.fillRect(cx + xr * f - s / 2, cy + pts[i * 2 + 1] * half * f - s / 2, s, s);
        }
      }
      corners(cx - w * 0.62, cy - h * 0.62, cx + w * 0.62, cy + h * 0.62, 16, "rgba(160,255,230,0.5)");
      finish(0.08, t);
    };

    // Kolaj / fanzin: gazete kâğıdı, yırtık renkli parçalar, bant, kesilmiş sembol
    const zine = (angle: number, t: number) => {
      fill("#ece7dc", "#e2dccd");
      const torn = (x: number, y: number, w: number, h: number, rot: number, color: string, seed: number) => {
        const r = rng(seed);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0,0,0,0.18)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.beginPath();
        const step = 9;
        ctx.moveTo(-w / 2, -h / 2);
        for (let i = 0; i <= w; i += step) ctx.lineTo(-w / 2 + i, -h / 2 + (r() - 0.5) * 5);
        for (let i = 0; i <= h; i += step) ctx.lineTo(w / 2 + (r() - 0.5) * 5, -h / 2 + i);
        for (let i = w; i >= 0; i -= step) ctx.lineTo(-w / 2 + i, h / 2 + (r() - 0.5) * 5);
        for (let i = h; i >= 0; i -= step) ctx.lineTo(-w / 2 + (r() - 0.5) * 5, -h / 2 + i);
        ctx.fill();
        ctx.restore();
      };
      // Gazete satırları
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      const r = rng(61);
      for (let y = region.y0; y < region.y1; y += 9) {
        const lw = (region.x1 - region.x0) * (0.3 + r() * 0.6);
        ctx.fillRect(region.x0 + 10, y, lw, 3);
      }
      torn(cx - size * 0.35, cy - size * 0.25, size * 1.05, size * 0.8, -0.08, "#ff3b30", 1);
      torn(cx + size * 0.4, cy + size * 0.22, size * 0.9, size * 0.7, 0.07, "#2f4bff", 2);
      torn(cx + size * 0.55, cy - size * 0.5, size * 0.42, size * 0.3, 0.2, "#ffd60a", 3);
      // Bantlar
      ctx.fillStyle = "rgba(255,250,220,0.65)";
      for (const [tx, ty, rot] of [[-0.75, -0.62, -0.5], [0.8, 0.55, 0.4]] as const) {
        ctx.save();
        ctx.translate(cx + tx * size, cy + ty * size);
        ctx.rotate(rot);
        ctx.fillRect(-size * 0.16, -size * 0.04, size * 0.32, size * 0.08);
        ctx.restore();
      }
      const view = angle + Math.sin(t * 6) * 0.01;
      drawFlat(extra!.whiteStroke, view, 6, 8, 0.35, true);
      drawFlat(extra!.whiteStroke, view, 0, 0, 1, true);
      drawFlat(extra!.faceBlack, view);
      finish(0.18, t, 0.12);
    };

    // Neon tabela: koyu tuğla duvar, pembe neon tüp, ara sıra titreme
    const neon = (angle: number, t: number) => {
      ctx.fillStyle = "#150b0d";
      ctx.fillRect(0, 0, width, height);
      const bh = 26, bw = 62;
      const r = rng(71);
      for (let row = 0, y = region.y0 - 40; y < region.y1 + 60; y += bh, row++)
        for (let x = region.x0 - 60 + (row % 2) * (bw / 2); x < region.x1 + 60; x += bw) {
          const v = 26 + Math.floor(r() * 12);
          ctx.fillStyle = `rgb(${v + 14},${v - 6},${v - 4})`;
          ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
        }
      const flick = rng(Math.floor(t * 18))() < 0.07;
      const on = flick ? 0.25 : 1;
      // Duvara vuran ışık
      const wg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.3);
      wg.addColorStop(0, `rgba(255,60,200,${0.32 * on})`);
      wg.addColorStop(1, "rgba(255,60,200,0)");
      ctx.fillStyle = wg;
      ctx.fillRect(0, 0, width, height);
      const view = angle;
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(14px)";
      drawFlat(extra!.neonTube, view, 0, 0, 0.9 * on, true);
      ctx.filter = "blur(4px)";
      drawFlat(extra!.neonTube, view, 0, 0, 0.9 * on, true);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      drawFlat(extra!.neonCore, view, 0, 0, 0.35 + 0.65 * on, true);
      // Küçük camgöbeği tabela
      ctx.font = `italic 700 26px ${sans}`;
      ctx.textAlign = "left";
      ctx.shadowColor = "#33f0ff";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#c9fbff";
      ctx.fillText("açığız", cx + size * 0.55, cy + size * 0.68);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      finish(0.1, t, 0.65);
    };

    // Pop-art: sarı zemin, dönen ışın patlaması, kırmızı tram, kalın siyah kenarlı mavi sembol + beyaz noktalar
    const pop = (angle: number, t: number) => {
      ctx.fillStyle = "#ffd400";
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.25);
      ctx.fillStyle = "#ffe866";
      for (let i = 0; i < 16; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, Math.max(width, height), (i / 16) * Math.PI * 2, ((i + 0.5) / 16) * Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      // Kenarlarda kırmızı tram
      ctx.fillStyle = "rgba(255,40,60,0.55)";
      for (let y = region.y0 - 40; y < region.y1 + 80; y += 12)
        for (let x = region.x0 - 40; x < region.x1 + 40; x += 12) {
          const d = Math.hypot(x - cx, y - cy) / (size * 1.6);
          const rr = Math.max(0, Math.min(4.5, (d - 0.55) * 6));
          if (rr <= 0.2) continue;
          ctx.beginPath();
          ctx.arc(x + ((y / 12) % 2) * 6, y, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      const view = angle;
      drawFlat(extra!.blackStroke, view, 9, 9, 1, true);
      drawFlat(extra!.blackStroke, view, 0, 0, 1, true);
      drawFlat(extra!.popFace, view);
      drawFlat(extra!.popDots, view, 0, 0, 0.55);
      finish(0.06, t, 0.08);
    };

    const sketch = (angle: number, t: number, p: number) => {
      fill("#0c0c0d", "#060606");
      const { x0, y0, x1, y1 } = region;
      const pw = (x1 - x0) * 0.86, ph = (y1 - y0) * 0.92;
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate(-0.035);
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      ctx.fillStyle = "#ebe6db";
      ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      ctx.shadowColor = "transparent";
      const r = rng(41);
      for (let i = 0; i < 7; i++) {
        const sx = (r() - 0.5) * pw, sy = (r() - 0.5) * ph, sr = 30 + r() * 90;
        const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        rg.addColorStop(0, `rgba(120,100,70,${0.05 + r() * 0.06})`);
        rg.addColorStop(1, "rgba(120,100,70,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      }
      ctx.strokeStyle = "rgba(60,60,70,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = -ph / 2 + 28; y < ph / 2; y += 28) {
        ctx.moveTo(-pw / 2 + 18, y);
        ctx.lineTo(pw / 2 - 18, y);
      }
      ctx.stroke();
      ctx.restore();
      reset();
      const { w, h } = dims();
      const draw = span(p, 0, 0.5);
      ctx.strokeStyle = "rgba(40,40,45,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(w, h) * 0.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * draw);
      ctx.moveTo(cx - w * 0.75, cy);
      ctx.lineTo(cx - w * 0.75 + w * 1.5 * draw, cy);
      ctx.stroke();
      const view = angle;
      drawFlat(extra!.hatch, view, 0, 0, 0.55 + 0.45 * span(p, 0.15, 0.6));
      const boil = rng(Math.floor(t * 8));
      for (let i = 0; i < 3; i++) drawFlat(extra!.pencil, view, (boil() - 0.5) * 3, (boil() - 0.5) * 3, 0.55);
      finish(0.12, t, 0.45);
    };

    const tracking = (angle: number, t: number, p: number) => {
      fill("#0b0306", "#020102", "rgba(255,90,40,0.12)");
      const { w, h, depth } = dims();
      const cos = Math.cos(angle);
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(28px)";
      ctx.setTransform(dpr * cos, 0, 0, dpr, dpr * cx, dpr * cy);
      ctx.drawImage(assets!.sideGlow, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, sheenFace(assets!.faceGlow, p, 0.4), extra!.glowSides);
      const bw = (w * Math.abs(cos) + depth * Math.abs(Math.sin(angle))) / 2 + 22;
      const bh = h / 2 + 22;
      const lock = Math.min(1, p / 0.3);
      const pad = (1 - lock) ** 2 * 40;
      corners(cx - bw - pad, cy - bh - pad, cx + bw + pad, cy + bh + pad, 18, lock >= 1 ? "#ff7a3d" : "rgba(255,255,255,0.9)", 2);
      finish(0.05, t);
    };

    const NODE_NAMES = ["Website", "Panel", "WhatsApp", "Form", "Analitik"];
    const NODE_COLORS = ["#2f6bff", "#a77bff", "#3ee27a", "#ffb347", "#ff4fa3"];
    const NODE_POS = [
      [-0.98, -0.5],
      [0.98, -0.62],
      [1.04, 0.16],
      [-1.04, 0.5],
      [0.86, 0.84],
    ];
    const nodes = (angle: number, t: number, p: number) => {
      fill("#0d0e12", "#060608", "rgba(255,255,255,0.05)");
      reflection(angle, assets!.faceGray, "rgba(6,6,8,1)", 0.1);
      drawSolid(angle, sheenFace(assets!.faceGray, p, 0.7), extra!.graySides);
      const pts = assets!.points;
      const rx = (region.x1 - region.x0) / 2;
      const ry = (region.y1 - region.y0) / 2;
      NODE_NAMES.forEach((name, i) => {
        const appear = clamp01((p - i * 0.05) / 0.22);
        if (appear <= 0) return;
        const [nx0, ny0] = NODE_POS[i];
        const nx = baseX + nx0 * rx * 0.78;
        const ny = baseY + ny0 * ry * 0.78;
        const bw = 128, bh = 44;
        const left = nx0 < 0;
        const ax = left ? nx + bw / 2 : nx - bw / 2;
        const k = (i * 517) % 2600;
        const target = project(pts[k * 2] * 0.85, pts[k * 2 + 1] * 0.85, angle);
        const c1x = ax + (left ? 60 : -60);
        const c2x = target.x + (left ? -40 : 40);
        ctx.globalAlpha = appear;
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ny);
        ctx.bezierCurveTo(c1x, ny, c2x, target.y, target.x, target.y);
        ctx.stroke();
        const u = (t * 0.55 + i * 0.23) % 1;
        const iu = 1 - u;
        const dx = iu ** 3 * ax + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u ** 3 * target.x;
        const dy = iu ** 3 * ny + 3 * iu * iu * u * ny + 3 * iu * u * u * target.y + u ** 3 * target.y;
        ctx.fillStyle = NODE_COLORS[i];
        ctx.beginPath();
        ctx.arc(dx, dy, 2.6, 0, Math.PI * 2);
        ctx.fill();
        const y = ny - bh / 2 + (1 - appear) * 8;
        ctx.fillStyle = "rgba(18,19,24,0.92)";
        ctx.beginPath();
        ctx.roundRect(nx - bw / 2, y, bw, bh, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();
        ctx.fillStyle = NODE_COLORS[i];
        ctx.beginPath();
        ctx.roundRect(nx - bw / 2 + 10, y + 10, 24, 24, 7);
        ctx.fill();
        ctx.font = `600 13px ${sans}`;
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.textAlign = "left";
        ctx.fillText(name, nx - bw / 2 + 42, y + 20);
        label("BAĞLI", nx - bw / 2 + 42, y + 34, "#4ade80", "left", 9);
        ctx.globalAlpha = 1;
      });
      finish(0.08, t);
    };

    /* ───────────── Referanslardan türetilen üsluplar ───────────── */

    /** Vektör logo dönüşümü: yükseklik = size (logo birimi 1), x dönüşle daralır */
    const logoT = (view: number, scale = 1, dx = 0, dy = 0) =>
      ctx.setTransform(dpr * size * scale * ac(view), 0, 0, dpr * size * scale, dpr * (cx + dx), dpr * (cy + dy));
    const hmSample = (gx: number, gy: number) => {
      const R = extra!.ref;
      const ix = gx | 0, iy = gy | 0;
      if (ix < 0 || iy < 0 || ix >= R.hmW || iy >= R.hmH) return 0;
      return R.hm[iy * R.hmW + ix];
    };
    /** Yükseklik haritası ızgarasının ekrandaki yeri */
    const hmFrame = () => {
      const R = extra!.ref;
      const { w } = dims();
      const cell = w / R.gw;
      const cellX = cell * ac(curAngle);
      const W = R.hmW * cellX, H = R.hmH * cell;
      return { cell, cellX, W, H, x0: cx - W / 2, y0: cy - H / 2 };
    };

    // Tarama çizgileri (Geo Shapes): logo, yatay çizgilerin kabarmasıyla 3B bir yüzey olarak belirir
    const scanlines = (angle: number, t: number, p: number) => {
      fill("#000000", "#000000");
      const { cell, cellX, W, H, x0, y0 } = hmFrame();
      const amp = size * 0.15 * (0.8 + 0.2 * Math.sin(t * 1.6)) * easeOut(span(p, 0, 0.4));
      const shear = Math.sin(angle) * size * 0.08;
      ctx.lineWidth = 1.15;
      ctx.lineJoin = "round";
      const xs: number[] = [], ys: number[] = [], vs: number[] = [];
      for (let y = y0 - 10; y < y0 + H + 10; y += 4.5) {
        xs.length = ys.length = vs.length = 0;
        const gy = (y - y0) / cell;
        for (let x = x0 - 20; x <= x0 + W + 20; x += 3) {
          const v = hmSample((x - x0) / cellX, gy);
          xs.push(x + v * shear);
          ys.push(y - v * amp - Math.sin(x * 0.05 + t * 3 + y * 0.03) * v * 5);
          vs.push(v);
        }
        // Arkadaki çizgileri örtmek için çizginin altı siyaha boyanır
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(xs[0], y + 5);
        for (let i = 0; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
        ctx.lineTo(xs[xs.length - 1], y + 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(236,236,236,0.92)";
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i < xs.length; i++) {
          if (vs[i] > 0.035) {
            if (pen) ctx.lineTo(xs[i], ys[i]);
            else ctx.moveTo(xs[i], ys[i]);
            pen = true;
          } else pen = false;
        }
        ctx.stroke();
      }
      finish(0.08, t, 0.4);
    };

    // Noktalama / dither (Dark Aesthetic): kâğıt üstünde siyah piksellerle gölgelenmiş kabartma logo
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const dither = (angle: number, t: number) => {
      fill("#efede8", "#e6e3db");
      const { cell, cellX, W, H, x0, y0 } = hmFrame();
      const c = 3;
      const lx = Math.cos(t * 0.9) * 0.8, ly = -0.55;
      const shift = Math.sin(angle) * size * 0.05;
      ctx.fillStyle = "#111";
      ctx.beginPath();
      let j = 0;
      for (let y = y0; y < y0 + H; y += c, j++) {
        let i = 0;
        for (let x = x0; x < x0 + W; x += c, i++) {
          const gx = (x - x0 - shift) / cellX, gy = (y - y0) / cell;
          const v = hmSample(gx, gy);
          let d: number;
          if (v > 0.06) {
            const nx = hmSample(gx + 1, gy) - hmSample(gx - 1, gy);
            const ny = hmSample(gx, gy + 1) - hmSample(gx, gy - 1);
            const lam = clamp01(0.5 - (nx * lx + ny * ly) * 7);
            d = clamp01(0.3 + (1 - lam) * 0.85) * clamp01(v * 3);
          } else {
            const sv = hmSample(gx - 7, gy - 7);
            d = sv > 0.1 ? sv * 0.35 : 0;
          }
          if (d * 16 > BAYER[(i & 3) + (j & 3) * 4] + 0.5) ctx.rect(x, y, c, c);
        }
      }
      ctx.fill();
      finish(0.16, t, 0.12);
    };

    // Cam (cam objeler): şeffaf gövde, kenarda renk ayrışması, içinde süzülen parlama; etrafta cam halka, yay, damla
    const glassShape = (kind: number, x: number, y: number, s: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.lineCap = "round";
      const edge = (lw: number, a: number) => {
        ctx.lineWidth = lw;
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.stroke();
      };
      ctx.beginPath();
      if (kind === 0) ctx.ellipse(0, 0, s, s * 0.42, 0, 0, Math.PI * 2);
      else if (kind === 1) for (let i = 0; i < 7; i++) ctx.ellipse(i * s * 0.16 - s * 0.5, 0, s * 0.12, s * 0.38, 0, 0, Math.PI * 2);
      else {
        ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
        ctx.moveTo(s * 0.62, s * 0.2);
        ctx.arc(s * 0.32, s * 0.2, s * 0.3, 0, Math.PI * 2);
      }
      edge(s * 0.12, 0.05);
      edge(1.2, 0.55);
      ctx.restore();
    };
    const glass = (angle: number, t: number, p: number) => {
      fill("#0b0b0e", "#000000");
      const R = extra!.ref;
      const r = rng(19);
      for (let i = 0; i < 6; i++) {
        const gx = cx + (r() - 0.5) * size * 2.2;
        const gy = cy + (r() - 0.5) * size * 1.7 + Math.sin(t * 0.9 + i) * 8;
        glassShape(i % 3, gx, gy, size * (0.12 + r() * 0.1), r() * 3 + t * 0.2 * (i % 2 ? 1 : -1));
      }
      const view = angle;
      logoT(view);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fill(R.logo, "evenodd");
      ctx.save();
      ctx.clip(R.logo, "evenodd");
      ctx.lineWidth = 0.03;
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.stroke(R.logo);
      const sx = -0.9 + 1.8 * ((p * 1.2 + 0.1) % 1);
      const sg = ctx.createRadialGradient(sx, -0.15, 0, sx, -0.15, 0.35);
      sg.addColorStop(0, "rgba(255,255,255,0.55)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
      ctx.globalCompositeOperation = "lighter";
      for (const [col, ox] of [["rgba(255,70,110,0.7)", -0.005], ["rgba(70,200,255,0.7)", 0.005]] as const) {
        logoT(view, 1, ox * size, 0);
        ctx.lineWidth = 0.006;
        ctx.strokeStyle = col;
        ctx.stroke(R.logo);
      }
      ctx.globalCompositeOperation = "source-over";
      logoT(view);
      const lg = ctx.createLinearGradient(-0.6, -0.5, 0.6, 0.5);
      lg.addColorStop(0, "rgba(255,255,255,0.95)");
      lg.addColorStop(1, "rgba(255,255,255,0.25)");
      ctx.lineWidth = 0.004;
      ctx.strokeStyle = lg;
      ctx.stroke(R.logo);
      reset();
      finish(0.06, t, 0.5);
    };

    // İzometrik (Isometrik): logo, gri zeminde kat kat yükselen çizgili bir duvar; büyük kırmızı yazı
    const iso = (_angle: number, t: number, p: number) => {
      fill("#dadad7", "#d3d3cf");
      const { x0, y0, x1, y1 } = region;
      ctx.strokeStyle = "rgba(0,0,0,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const k30 = Math.tan(Math.PI / 6);
      for (let x = x0 - (y1 - y0); x < x1; x += 22) {
        ctx.moveTo(x, y1);
        ctx.lineTo(x + (y1 - y0) / k30, y0);
        ctx.moveTo(x, y0);
        ctx.lineTo(x + (y1 - y0) / k30, y1);
      }
      ctx.stroke();
      const R = extra!.ref;
      const s = size * 0.95;
      const c30 = Math.cos(Math.PI / 6), s30 = Math.sin(Math.PI / 6);
      const n = Math.round(18 * easeOut(span(p, 0, 0.55)));
      const step = size * 0.016;
      const ox = cx + size * 0.08, oy = cy - size * 0.02 + Math.sin(t * 1.2) * 3;
      for (let k = n; k >= 0; k--) {
        ctx.setTransform(dpr * s * c30 * ac(curAngle), dpr * s * s30 * ac(curAngle), 0, dpr * s, dpr * (ox + c30 * step * k), dpr * (oy - s30 * step * k));
        ctx.fillStyle = k === 0 ? "#f4f4f2" : "#e4e4e1";
        ctx.fill(R.logo, "evenodd");
        ctx.lineWidth = (k === 0 ? 1.7 : 0.9) / s;
        ctx.strokeStyle = k === 0 ? "#111" : "#5a5a5a";
        ctx.stroke(R.logo);
      }
      reset();
      ctx.textAlign = "left";
      ctx.fillStyle = "#111";
      ctx.font = `600 13px ${sans}`;
      ctx.fillText("/// OX Dijital", x0 + 8, y0 + 8);
      ctx.fillText("İzometrik", x0 + 8, y0 + 26);
      ctx.fillStyle = "#ff3d3d";
      ctx.font = `800 ${Math.round(size * 0.3)}px ${sans}`;
      ctx.letterSpacing = "-2px";
      ctx.fillText("WEBSITE", x0 + 4, y1 - 6);
      ctx.letterSpacing = "0px";
      finish(0.07, t, 0.08);
    };

    // Şişme folyo balon: logonun üç parçası ayrı renkte, katman katman tüp gölgesi, parıltı çizgileri
    const BALLOON: [string, string, string][] = [
      ["#5b1fd6", "#7c3cff", "#d4bcff"],
      ["#0b9b86", "#1fd8bb", "#c4fff4"],
      ["#c75c08", "#ff9f2e", "#ffe2b8"],
    ];
    const balloon = (angle: number, t: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#c9cdf4");
      sky.addColorStop(1, "#ebe8fb");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);
      ctx.filter = "blur(24px)";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      const r = rng(23);
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + (r() - 0.5) * size * 2.4 + t * 6, cy + (r() - 0.5) * size * 1.6, size * (0.25 + r() * 0.3), size * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.filter = "none";
      const R = extra!.ref;
      const view = angle;
      const bob = Math.sin(t * 1.8) * 6;
      const fat = 0.08;
      ctx.lineJoin = "round";
      // Gülüş, O, X sırasıyla (X en önde)
      for (const idx of [2, 1, 0]) {
        const part = R.parts[idx];
        const [dark, base, light] = BALLOON[idx % 3];
        logoT(view, 0.92, 0, bob + idx * 2);
        ctx.shadowColor = "rgba(70,40,140,0.35)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 22;
        ctx.fillStyle = ctx.strokeStyle = dark;
        ctx.lineWidth = fat;
        ctx.fill(part, "evenodd");
        ctx.stroke(part);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.filter = "blur(2px)";
        ctx.fillStyle = ctx.strokeStyle = base;
        ctx.lineWidth = fat * 0.55;
        ctx.fill(part, "evenodd");
        ctx.stroke(part);
        ctx.filter = "blur(3px)";
        logoT(view, 0.92, -size * 0.008, bob + idx * 2 - size * 0.01);
        ctx.fillStyle = ctx.strokeStyle = light;
        ctx.lineWidth = fat * 0.12;
        ctx.globalAlpha = 0.8;
        ctx.fill(part, "evenodd");
        ctx.stroke(part);
        ctx.filter = "none";
        ctx.globalAlpha = 0.9;
        logoT(view, 0.92, -size * 0.014, bob + idx * 2 - size * 0.018);
        ctx.setLineDash([0.02, 0.07]);
        ctx.lineDashOffset = -t * 0.05;
        ctx.lineWidth = 0.007;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke(part);
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      reset();
      finish(0.05, t, 0.08);
    };

    // Bauhaus (Moduliks): krem zemin, kayarak gelen geometrik şekiller, beton blok, siyah logo, büyük başlık
    const bauhaus = (angle: number, t: number, p: number) => {
      fill("#f2ead6", "#ede3c9");
      const k = (a: number, b: number) => easeOut(span(p, a, b));
      ctx.fillStyle = "#e8432a";
      ctx.beginPath();
      ctx.arc(cx + size * 0.32, cy - size * 0.05, size * 0.62 * k(0, 0.3), 0, Math.PI * 2);
      ctx.fill();
      // Beton blok
      const by = cy + size * 0.12 + (1 - k(0.08, 0.4)) * size;
      ctx.fillStyle = "#8f8b84";
      ctx.fillRect(cx + size * 0.12, by, size * 0.85, size * 0.9);
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = grainPattern;
      ctx.fillRect(cx + size * 0.12, by, size * 0.85, size * 0.9);
      ctx.restore();
      ctx.fillStyle = "#111";
      for (let i = 0; i < 4; i++) ctx.fillRect(cx + size * (0.6 + i * 0.07), by + size * 0.12, size * 0.035, size * 0.4);
      ctx.fillStyle = "#1f56e0";
      ctx.fillRect(cx - size * 0.62 - (1 - k(0.14, 0.45)) * size, cy + size * 0.28, size * 0.48, size * 0.6);
      ctx.fillStyle = "#ffcb05";
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.95, cy + size * 0.95);
      ctx.arc(cx - size * 0.95, cy + size * 0.95, size * 0.48 * k(0.2, 0.5), -Math.PI / 2, 0);
      ctx.fill();
      ctx.fillStyle = "#ff8fc2";
      ctx.beginPath();
      const tk = k(0.26, 0.55);
      ctx.moveTo(cx + size * 0.12, cy + size * 0.95);
      ctx.lineTo(cx + size * (0.12 + 0.5 * tk), cy + size * 0.95);
      ctx.lineTo(cx + size * 0.12, cy + size * (0.95 - 0.5 * tk));
      ctx.fill();
      ctx.fillStyle = "#1c8a4a";
      ctx.beginPath();
      ctx.arc(cx - size * 0.15, cy + size * 0.95, size * 0.2 * k(0.3, 0.6), Math.PI, 0);
      ctx.fill();
      const R = extra!.ref;
      logoT(angle, 0.9, -size * 0.05, -size * 0.05);
      ctx.fillStyle = ctx.strokeStyle = "#111";
      ctx.lineWidth = 0.022;
      ctx.lineJoin = "round";
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      reset();
      ctx.fillStyle = "#111";
      ctx.textAlign = "left";
      ctx.font = `900 ${Math.round(size * 0.24)}px ${sans}`;
      ctx.letterSpacing = "-1px";
      ctx.fillText("TASARIM", region.x0 + 6, region.y0 + size * 0.2);
      ctx.letterSpacing = "0px";
      finish(0.12, t, 0.06);
    };

    /** Piksel kutu: siyah kenar + sert gölge + dolgu + üst ışık */
    const snap = (v: number, c: number) => Math.round(v / c) * c;
    const pixBox = (x: number, y: number, w: number, h: number, color: string, c: number) => {
      x = snap(x, c);
      y = snap(y, c);
      w = snap(w, c);
      h = snap(h, c);
      ctx.fillStyle = "#000";
      ctx.fillRect(x + c, y + c, w + c, h + c);
      ctx.fillRect(x - c, y - c, w + 2 * c, h + 2 * c);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillRect(x, y, w, c);
    };
    const pixCircle = (x: number, y: number, rr: number, color: string, c: number) => {
      const n = Math.ceil(rr / c);
      for (const [pass, col] of [[1, "#000"], [0, color]] as const)
        for (let j = -n - 1; j <= n + 1; j++)
          for (let i = -n - 1; i <= n + 1; i++) {
            const d = Math.hypot(i, j) * c;
            if (d <= rr + pass * c) {
              ctx.fillStyle = col;
              ctx.fillRect(snap(x, c) + i * c + pass * c * 0, snap(y, c) + j * c, c, c);
            }
          }
    };
    const pixText = (s: string, x: number, y: number, px: number, color: string) => {
      ctx.font = `700 ${px}px ${mono}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(s, x, y);
    };
    const pixLogo = (x: number, y: number, ps: number, fillCol: string, outline: string | null) => {
      const { cols, rows, on } = extra!.cells;
      // Dönüş piksel adımlarıyla: sütun genişliği daralır
      const cw = Math.max(1, Math.round(ps * Math.max(0.12, Math.round(ac(curAngle) * 6) / 6)));
      const lx = snap(x - (cols * cw) / 2, ps), ly = snap(y - (rows * ps) / 2, ps);
      const filled = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows && on[j * cols + i] === 1;
      if (outline) {
        ctx.fillStyle = outline;
        for (let j = -1; j <= rows; j++)
          for (let i = -1; i <= cols; i++)
            if (filled(i, j) || filled(i - 1, j) || filled(i + 1, j) || filled(i, j - 1) || filled(i, j + 1)) {
              ctx.fillRect(lx + i * cw + ps, ly + j * ps + ps, cw, ps);
              ctx.fillRect(lx + i * cw, ly + j * ps, cw, ps);
            }
      }
      ctx.fillStyle = fillCol;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (filled(i, j)) ctx.fillRect(lx + i * cw, ly + j * ps, cw, ps);
    };

    // Piksel yığını (ERROR): turuncu zeminde siyah kenarlı piksel stickerlar sırayla yığılır, ortada piksel logo
    const pile = (_angle: number, t: number, p: number) => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#ff5a1f";
      ctx.fillRect(0, 0, width, height);
      const c = Math.max(3, Math.round(size / 70));
      const S = size * 0.92;
      const at = (i: number) => span(p, 0.04 + i * 0.05, 0.1 + i * 0.05) > 0;
      const X = (v: number) => cx + v * S, Y = (v: number) => cy + v * S;
      // mor zemin parçası
      if (at(0)) pixBox(X(-0.55), Y(-0.28), S * 1.1, S * 0.62, "#a974ff", c);
      if (at(1)) {
        pixBox(X(-0.7), Y(-0.92), S * 0.42, S * 0.3, "#ffc21a", c);
        pixBox(X(-0.7), Y(-0.98), S * 0.16, S * 0.08, "#ffc21a", c);
      }
      if (at(2)) {
        for (let k2 = 2; k2 >= 0; k2--) pixBox(X(-1.02 + k2 * 0.04), Y(-0.42 + k2 * 0.04), S * 0.3, S * 0.42, k2 ? "#5cff5c" : "#ffffff", c);
        bitmap(PIX_HEART, snap(X(-0.95), c), snap(Y(-0.3), c), c * 1.6, "#ff2a2a");
      }
      if (at(3)) {
        pixCircle(X(0.58), Y(-0.86), S * 0.13, "#ffd21f", c);
        ctx.fillStyle = "#000";
        ctx.fillRect(snap(X(0.53), c), snap(Y(-0.9), c), c, c * 2);
        ctx.fillRect(snap(X(0.62), c), snap(Y(-0.9), c), c, c * 2);
        ctx.fillRect(snap(X(0.52), c), snap(Y(-0.81), c), snap(S * 0.13, c), c);
      }
      if (at(4)) {
        pixBox(X(0.66), Y(-0.6), S * 0.42, S * 0.22, "#5cff5c", c);
        pixText("WOW", X(0.87), Y(-0.44), Math.round(S * 0.11), "#000");
      }
      if (at(5)) {
        pixCircle(X(-0.92), Y(0.66), S * 0.15, "#bfe6ff", c);
        pixCircle(X(-0.92), Y(0.66), S * 0.03, "#ffffff", c);
      }
      if (at(6)) {
        pixBox(X(-0.42), Y(0.62), S * 0.56, S * 0.2, "#bfe6ff", c);
        pixText("OK?", X(-0.14), Y(0.77), Math.round(S * 0.12), "#000");
      }
      if (at(7)) {
        pixBox(X(0.32), Y(0.38), S * 0.62, S * 0.48, "#ff3d1f", c);
        ctx.fillStyle = "#000";
        ctx.fillRect(snap(X(0.32), c), snap(Y(0.38), c), snap(S * 0.62, c), snap(S * 0.08, c));
        pixText("YENİ MESAJ", X(0.63), Y(0.68), Math.round(S * 0.07), "#fff");
      }
      // Ortada piksel logo (açık mavi, siyah kenar, sert gölge), adım adım zıplar
      const bob = Math.floor(t * 3) % 2 ? -c : 0;
      pixLogo(cx - S * 0.02, cy - S * 0.06 + bob, Math.max(3, Math.round((S * 0.9) / extra!.cells.cols)), "#bfe6ff", "#000");
      if (at(8)) {
        // imleç
        const cxp = snap(X(0.06), c), cyp = snap(Y(0.7), c);
        for (let j = 0; j < 9; j++) {
          ctx.fillStyle = "#000";
          ctx.fillRect(cxp - c, cyp + j * c - c, (j + 3) * c * 0.6 + 2 * c, c * 1.2);
          ctx.fillStyle = "#fff";
          ctx.fillRect(cxp, cyp + j * c, Math.max(c, ((j + 1) * c * 0.6) | 0), c);
        }
      }
      ctx.imageSmoothingEnabled = true;
    };

    // Retro pencereler (yeşil tek renk): pencereler sırayla açılır; OX.EXE'de logo, dönen tel küre, mesaj
    const os = (_angle: number, t: number, p: number) => {
      ctx.imageSmoothingEnabled = false;
      const L = "#19ff9a", D = "#034d47";
      ctx.fillStyle = "#00ad7c";
      ctx.fillRect(0, 0, width, height);
      const S = size * 0.9;
      const win = (x: number, y: number, w: number, h: number, title: string, i: number) => {
        if (span(p, 0.04 + i * 0.07, 0.1 + i * 0.07) <= 0) return null;
        x = snap(cx + x * S, 3);
        y = snap(cy + y * S, 3);
        w = snap(w * S, 3);
        h = snap(h * S, 3);
        ctx.fillStyle = D;
        ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
        ctx.fillStyle = L;
        ctx.fillRect(x, y, w, 26);
        ctx.fillStyle = D;
        ctx.fillRect(x + 3, y + 29, w - 6, h - 32);
        ctx.font = `700 13px ${mono}`;
        ctx.textAlign = "left";
        ctx.fillText(title, x + 10, y + 18);
        for (let k = 0; k < 3; k++) {
          ctx.strokeStyle = D;
          ctx.lineWidth = 2;
          ctx.strokeRect(x + w - 22 - k * 18, y + 7, 11, 11);
        }
        return { x, y: y + 29, w, h: h - 29 };
      };
      const w1 = win(-1.02, -0.4, 0.85, 0.82, "PENCERE-1", 0);
      if (w1) {
        const gx = w1.x + w1.w / 2, gy = w1.y + w1.h / 2, gr = Math.min(w1.w, w1.h) * 0.38;
        ctx.strokeStyle = L;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        for (let k = 0; k < 4; k++) {
          const rx = Math.abs(Math.cos(t * 0.8 + (k * Math.PI) / 4)) * gr;
          ctx.moveTo(gx + rx, gy);
          ctx.ellipse(gx, gy, rx, gr, 0, 0, Math.PI * 2);
        }
        for (const yy of [-0.5, 0, 0.5]) {
          const hw = Math.sqrt(1 - yy * yy) * gr;
          ctx.moveTo(gx - hw, gy + yy * gr);
          ctx.lineTo(gx + hw, gy + yy * gr);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const w3 = win(-0.5, -0.98, 1.3, 0.34, "PENCERE-3", 1);
      if (w3) {
        ctx.fillStyle = L;
        ctx.font = `700 ${Math.round(S * 0.075)}px ${mono}`;
        ctx.textAlign = "left";
        ctx.fillText("Yeni talep alındı.", w3.x + 16, w3.y + w3.h * 0.66);
      }
      const w2 = win(-0.05, -0.5, 0.86, 1.08, "OX.EXE", 2);
      if (w2) {
        const ps = Math.max(3, Math.round((w2.w * 0.78) / extra!.cells.cols));
        pixLogo(w2.x + w2.w / 2, w2.y + w2.h * 0.44, ps, L, null);
        ctx.fillStyle = L;
        ctx.fillRect(w2.x + w2.w * 0.12, w2.y + w2.h - 46, w2.w * 0.76, 30);
        ctx.fillStyle = D;
        ctx.font = `700 13px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillText(Math.floor(t * 2) % 2 ? "BAĞLANDI" : "BAĞLANDI_", w2.x + w2.w / 2, w2.y + w2.h - 26);
      }
      if (span(p, 0.3, 0.35) > 0) {
        const bx = snap(cx + S * 0.92, 3), by = snap(cy - S * 0.55, 3), bw = snap(S * 0.14, 3), bh = snap(S * 1.0, 3);
        ctx.fillStyle = D;
        ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);
        ctx.fillStyle = L;
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = D;
        const off = (t * 30) % 18;
        for (let y = by - 18 + off; y < by + bh; y += 18) ctx.fillRect(bx + 3, Math.max(by, y), bw - 6, 6);
      }
      win(-0.62, 0.7, 1.45, 0.17, "PENCERE-4", 4);
      ctx.imageSmoothingEnabled = true;
    };

    // Ekolayzır (Colorful Equalizer): logo dikey gökkuşağı çubuklarından; çubuklar müzik gibi uzayıp kısalır
    const eq = (angle: number, t: number, p: number) => {
      fill("#050505", "#000000");
      const R = extra!.ref;
      const { w, h } = dims();
      const g = ctx.createLinearGradient(0, cy - h * 0.7, 0, cy + h * 0.7);
      g.addColorStop(0, "#1e6bff");
      g.addColorStop(0.3, "#ff2d87");
      g.addColorStop(0.5, "#ff3b30");
      g.addColorStop(0.72, "#ffd60a");
      g.addColorStop(1, "#46e36b");
      // Arkada soluk dalgalar
      ctx.strokeStyle = g;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = region.x0; x < region.x1; x += 7) {
        const a = (Math.sin(x * 0.012 + t * 1.6) * 0.5 + 0.5) * size * 0.25;
        ctx.moveTo(x, region.y0 + size * 0.1);
        ctx.lineTo(x, region.y0 + size * 0.1 + a);
        ctx.moveTo(x, region.y1 - size * 0.1);
        ctx.lineTo(x, region.y1 - size * 0.1 - a);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      const cell = w / R.gw;
      const sx = ac(angle);
      const reveal = easeOut(span(p, 0, 0.45));
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2, cell * 1.3);
      ctx.beginPath();
      for (let i = 0; i < R.gw; i += 2) {
        if (i / R.gw > reveal) break;
        const x = cx + (i - R.gw / 2) * cell * sx;
        let a = -1;
        for (let j = 0; j <= R.gh; j++) {
          const on = j < R.gh && R.mk[j * R.gw + i] === 1;
          if (on && a < 0) a = j;
          if (!on && a >= 0) {
            const ext = (Math.sin(i * 0.22 + t * 6) * 0.5 + 0.5) * size * 0.035 + (Math.sin(i * 0.07 - t * 3) * 0.5 + 0.5) * size * 0.015;
            ctx.moveTo(x, cy + (a - R.gh / 2) * cell - ext);
            ctx.lineTo(x, cy + (j - R.gh / 2) * cell + ext);
            a = -1;
          }
        }
      }
      ctx.strokeStyle = g;
      ctx.stroke();
      finish(0.06, t, 0.4);
    };

    // Grunge fırça (Slide): kirli koyu zemin, dev neon-sarı yazı satırları, aşınmış logo
    const grunge = (angle: number, t: number) => {
      fill("#3b3a32", "#1f1e19");
      const R = extra!.ref;
      const lime = "#e2ff6b";
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.06);
      ctx.fillStyle = lime;
      ctx.font = `italic 900 ${Math.round(size * 0.46)}px ${sans}`;
      ctx.letterSpacing = "-4px";
      ctx.textAlign = "center";
      for (let row = -1; row <= 1; row++) {
        const off = (row % 2 ? 1 : -1) * ((t * 22) % 60);
        ctx.fillText("REKLAM", off, row * size * 0.44 + size * 0.16);
      }
      ctx.letterSpacing = "0px";
      ctx.restore();
      // Logo (koyu, kalın), titreşim
      const j = rng(Math.floor(t * 10));
      logoT(angle, 0.95, (j() - 0.5) * 3, (j() - 0.5) * 3);
      ctx.fillStyle = ctx.strokeStyle = "#141410";
      ctx.lineWidth = 0.05;
      ctx.lineJoin = "round";
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      ctx.fillStyle = ctx.strokeStyle = lime;
      ctx.lineWidth = 0.018;
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      reset();
      // Aşınma: zemin renginde benekler
      ctx.save();
      ctx.fillStyle = ctx.createPattern(R.speckle, "repeat")!;
      ctx.translate((t * 40) % 7, 0);
      ctx.fillRect(region.x0 - 30, region.y0 - 50, region.x1 - region.x0 + 60, region.y1 - region.y0 + 100);
      ctx.restore();
      ctx.save();
      ctx.translate(region.x1 - 4, cy);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = lime;
      ctx.font = `700 13px ${mono}`;
      ctx.letterSpacing = "4px";
      ctx.textAlign = "center";
      ctx.fillText("OX DİJİTAL", 0, 0);
      ctx.letterSpacing = "0px";
      ctx.restore();
      finish(0.3, t, 0.55);
    };

    const RENDER: Record<Mode, (angle: number, t: number, p: number) => void> = {
      beauty, chrome, cyber, clay, pixel, riso, glitch, brutal, cloud, zine, neon, pop, sketch, tracking, nodes,
      glass, scanlines, bauhaus, pile, os, balloon, iso, eq, dither, grunge,
    };

    let forced = -1;
    try {
      if (process.env.NODE_ENV === "development") forced = Number(localStorage.getItem("ox-film-sekans") ?? -1);
    } catch {}

    let start = performance.now();
    let lastShot = -1;
    const draw = (now: number) => {
      if (!assets || !extra) return;
      const elapsed = Math.max(0, now - start);
      let shot = reduced ? 0 : Math.floor(elapsed / SHOT_MS) % SEQUENCE.length;
      if (forced >= 0 && forced < SEQUENCE.length) shot = forced;
      if (shot !== lastShot) {
        lastShot = shot;
        onWordRef.current?.(shot);
      }
      const p = reduced ? 0.85 : (elapsed % SHOT_MS) / SHOT_MS;
      const target = pointer ? ((pointer.x - baseX) / width) * 0.8 : 0;
      tilt += (target - tilt) * 0.05;
      const t = elapsed / 1000;
      const angle = reduced ? 0.4 : t * 1.05 + tilt * 0.6;
      curAngle = angle;
      const mode = SEQUENCE[shot];
      const fw = frame.x1 - frame.x0, fh = frame.y1 - frame.y0;
      const scene = (m: Mode, pp: number) => {
        size = baseSize * (FRAMING[m] ?? 1) * (1 + pp * 0.035);
        cx = baseX;
        cy = baseY;
        reset();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.filter = "none";
        RENDER[m](angle, t, pp);
      };

      reset();
      ctx.clearRect(0, 0, width, height);
      // Çerçevenin dışında sahnenin renginden yumuşak ışıma
      ctx.save();
      ctx.shadowColor = ACCENT[mode] ?? "#2f6bff";
      ctx.shadowBlur = 90;
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "#030304";
      ctx.beginPath();
      ctx.roundRect(frame.x0 + 30, frame.y0 + 30, fw - 60, fh - 60, 28);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frame.x0, frame.y0, fw, fh, 28);
      ctx.clip();
      const since = elapsed % SHOT_MS;
      const transit = !reduced && forced < 0 && elapsed > SHOT_MS && since < TRANS_MS;
      if (transit) {
        // Önceki üslup altta, yenisi tasarlanmış bir şekille açılır
        const prev = SEQUENCE[(shot - 1 + SEQUENCE.length) % SEQUENCE.length];
        scene(prev, 1);
        const k = since / TRANS_MS;
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        const kind = shot % 3;
        const irisR = e * Math.hypot(fw, fh) * 0.75;
        const d = (fw + fh) * e;
        reset();
        ctx.save();
        ctx.beginPath();
        if (kind === 0) ctx.arc(baseX, baseY, irisR, 0, Math.PI * 2);
        else if (kind === 1) {
          ctx.moveTo(frame.x0 - fh, frame.y0);
          ctx.lineTo(frame.x0 + d, frame.y0);
          ctx.lineTo(frame.x0 + d - fh, frame.y1);
          ctx.lineTo(frame.x0 - fh, frame.y1);
          ctx.closePath();
        } else {
          const bands = 7;
          const bh = fh / bands;
          for (let i = 0; i < bands; i++) ctx.rect(frame.x0, frame.y0 + i * bh, fw * clamp01(e * 1.5 - i * 0.07), bh + 1);
        }
        ctx.clip();
        scene(mode, p);
        pops(mode, p, t, angle);
        ctx.restore();
        // Geçiş kenarında ince ışık
        reset();
        if (kind !== 2) {
          ctx.strokeStyle = "rgba(255,255,255,0.75)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (kind === 0) ctx.arc(baseX, baseY, irisR, 0, Math.PI * 2);
          else {
            ctx.moveTo(frame.x0 + d, frame.y0);
            ctx.lineTo(frame.x0 + d - fh, frame.y1);
          }
          ctx.stroke();
        }
      } else {
        scene(mode, p);
        pops(mode, p, t, angle);
      }

      ctx.restore();

      // Çerçeve kenarı
      reset();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(frame.x0 + 0.5, frame.y0 + 0.5, fw - 1, fh - 1, 28);
      ctx.stroke();
    };

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const run = () => {
      if (!raf && !reduced && assets) raf = requestAnimationFrame(loop);
    };

    const logo = new Image();
    logo.onload = () => {
      const a = buildAssets(logo);
      const mask = a.faceBlue;
      const ramp = (colors: string[]) => colors.map((c) => tintFrom(mask, c));
      const sheen = document.createElement("canvas");
      sheen.width = a.w;
      sheen.height = a.h;
      const r = rng(17);
      const cloudZ = new Float32Array(CLOUD_POINTS);
      for (let i = 0; i < CLOUD_POINTS; i++) cloudZ[i] = r() * 2 - 1;

      const hatch = document.createElement("canvas");
      hatch.width = a.w;
      hatch.height = a.h;
      const hx = hatch.getContext("2d")!;
      hx.strokeStyle = "rgba(35,35,40,0.75)";
      hx.lineWidth = 1.2;
      hx.beginPath();
      for (let d = -a.h; d < a.w; d += 6) {
        hx.moveTo(d, a.h);
        hx.lineTo(d + a.h, 0);
      }
      hx.stroke();
      hx.globalCompositeOperation = "destination-in";
      hx.drawImage(mask, 0, 0);

      const cols = 30;
      const rows = Math.max(8, Math.round((cols * a.h) / a.w));
      const small = document.createElement("canvas");
      small.width = cols;
      small.height = rows;
      const sx = small.getContext("2d", { willReadFrequently: true })!;
      sx.drawImage(mask, 0, 0, cols, rows);
      const data = sx.getImageData(0, 0, cols, rows).data;
      const on = new Uint8Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) on[i] = data[i * 4 + 3] > 70 ? 1 : 0;

      // Kil: pembe yüze iç ışık (sol üst kenar) ve iç gölge (sağ alt kenar)
      const clayFace = tintFrom(mask, "#ff7fb0");
      {
        const d = Math.round(a.w * 0.012);
        const rim = (color: string, ox: number) => {
          const c = tintFrom(mask, color);
          const x = c.getContext("2d")!;
          x.globalCompositeOperation = "destination-out";
          x.drawImage(mask, ox, ox);
          return c;
        };
        const cx2 = clayFace.getContext("2d")!;
        cx2.globalCompositeOperation = "source-atop";
        cx2.filter = `blur(${Math.max(2, d * 0.8)}px)`;
        cx2.globalAlpha = 0.85;
        cx2.drawImage(rim("#ffffff", d), 0, 0);
        cx2.globalAlpha = 0.45;
        cx2.drawImage(rim("#9c1f5a", -d), 0, 0);
      }

      const pad = Math.round(a.w * 0.02);
      const neonTube = document.createElement("canvas");
      neonTube.width = a.w + pad * 2;
      neonTube.height = a.h + pad * 2;
      {
        const x = neonTube.getContext("2d")!;
        x.drawImage(strokeFrom(mask, "#ff4fd8", Math.round(a.w * 0.008), pad), 0, 0);
        x.globalCompositeOperation = "destination-out";
        x.drawImage(strokeFrom(mask, "#000", 0, pad), 0, 0);
      }
      const neonCore = tintFrom(neonTube, "#ffe3fa");

      extra = {
        blueSides: ramp(["#2a5fe6", "#2150c8", "#1a42a8", "#14348a", "#0f286c", "#0a1d50"]),
        graySides: ramp(["#b9bfcb", "#9ba2b0", "#808797", "#676e7d", "#4f5563", "#3a3f4b"]),
        glowSides: ramp(["#ffb08a", "#ff8a5c", "#ff6a3d", "#e8532a", "#c4401e", "#9c2f14"]),
        magentaSides: ramp(["#ff3fdc", "#d81fb8", "#ac1a93", "#80146f", "#56104c", "#330a2e"]),
        chromeSides: ramp(["#d9dee8", "#b4bbc9", "#8d95a6", "#6a7283", "#4b5262", "#323846"]),
        claySides: ramp(["#ff6aa2", "#f05592", "#dc4682", "#c43a72", "#a83062", "#8a2752"]),
        faceCyan: tintFrom(mask, "#62f3ff"),
        faceRed: tintFrom(mask, "#ff2a4d"),
        faceTeal: tintFrom(mask, "#22e6ff"),
        faceWhite: tintFrom(mask, "#f2f2f2"),
        faceChrome: gradientFrom(mask, [[0, "#ffffff"], [0.3, "#b8c0d2"], [0.48, "#2a2f3a"], [0.54, "#6c7488"], [0.75, "#f1f4fa"], [1, "#9aa3b6"]]),
        faceClay: clayFace,
        faceBlack: tintFrom(mask, "#111111"),
        facePink: tintFrom(mask, "#ff48b0"),
        faceRisoBlue: tintFrom(mask, "#0078bf"),
        risoDots: dotsFrom(mask, "#ff48b0", 9, 3.4),
        popFace: tintFrom(mask, "#1f8bff"),
        popDots: dotsFrom(mask, "#ffffff", 12, 2.6),
        hatch,
        pencil: tintFrom(a.outline, "#232327"),
        sheen,
        neonTube,
        neonCore,
        blackStroke: strokeFrom(mask, "#000000", Math.round(a.w * 0.014), pad),
        whiteStroke: strokeFrom(mask, "#ffffff", Math.round(a.w * 0.018), pad),
        pad,
        ref: buildRef(a),
        cloud: sampleImage(logo, CLOUD_POINTS, 5),
        cloudZ,
        cells: { cols, rows, on },
      };
      assets = a;
      start = performance.now();
      if (reduced) draw(performance.now());
      else run();
    };
    logo.src = "/images/logo.png";

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) draw(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
    });
    io.observe(host);
    const onVisibility = () => !document.hidden && visible && run();
    document.addEventListener("visibilitychange", onVisibility);
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (pointer = null);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      logo.onload = null;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block", className)} />;
}
