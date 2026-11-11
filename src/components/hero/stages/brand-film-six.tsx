"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildAssets, type Assets } from "./brand-film";
import { OX_OUTLINE } from "./ox-outline";
import { rng, sampleImage } from "./shape-sampler";

// Hero sahnesi "Stiller 6": site sahibinin ikinci referans setinden türetilen üsluplar (Stiller 5'in altyapısı:
// çerçeve, tasarlanmış geçişler, bildirim/sticker çıkışları, vektör logo). Logo tam tur dönmez, ±30° salınır.
//   Matematik (SEO) · HUD kadran (Reklam) · Neon karalama (Sosyal Medya) · Çizgi film (İçerik) ·
//   Retro 8-bit oyun (Kampanya) · Blueprint (Marka) · Terminal + ASCII logo (Yazılım).
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta sabit kare.

type Mode =
  | "beauty" | "chrome" | "cyber" | "clay" | "pixel" | "riso" | "glitch" | "brutal"
  | "cloud" | "zine" | "neon" | "pop" | "sketch" | "tracking" | "nodes"
  | "glass" | "scanlines" | "bauhaus" | "pile" | "os" | "balloon" | "iso" | "eq" | "dither" | "grunge"
  | "math" | "hud" | "doodle" | "cartoon" | "arcade" | "blueprint2" | "terminal"
  | "refnodes" | "reftracking" | "refcloud" | "refweb" | "refseo" | "posts" | "adchat" | "serp";
const SEQUENCE: Mode[] = ["math", "hud", "doodle", "cartoon", "arcade", "blueprint2", "terminal"];
/** Sol başlıkta moda eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const SIX_WORDS = ["SEO", "Reklam", "Sosyal Medya", "İçerik", "Kampanya", "Marka", "Yazılım"];

/** Final hero: site sahibinin ekran görüntüleriyle seçtiği sahneler, sırayla (FINAL_WORDS aynı sıra) */
const BLUE_REF = "#2f6bff";
const FINAL_SEQUENCE: Mode[] = ["refnodes", "reftracking", "refcloud", "blueprint2", "refweb", "refseo", "posts", "adchat", "serp", "cyber", "glitch", "brutal", "clay", "glass", "scanlines", "pile", "os", "eq", "dither", "math", "cartoon", "arcade"];
export const FINAL_WORDS = ["Yazılım", "Reklam", "SEO", "Marka", "Website", "SEO", "Sosyal Medya", "Reklam", "SEO", "Website", "Reels", "Website", "Logo", "Marka", "Sistem", "Sosyal Medya", "Yazılım", "Reels", "Logo", "SEO", "İçerik", "Kampanya"];

const SHOT_MS = 2300;
const TRANS_MS = 950;
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
  math: "#e6e4e0", hud: "#36e07a", doodle: "#ff2bd6", cartoon: "#2b3ff2", arcade: "#ff2bd6", blueprint2: "#2257b8", terminal: "#39ff88",
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
  math: [{ kind: "notif", at: 0.5, x: 0.6, y: 0.62, theme: "glass", app: SKY, glyph: "search", title: "Analiz hazır", body: "Anahtar kelime haritası" }],
  hud: [{ kind: "notif", at: 0.4, x: 0.66, y: -0.98, theme: "os", app: GREEN, glyph: "target", title: "HEDEF KİLİTLENDİ", body: "KAMPANYA AKTİF" }],
  doodle: [
    { kind: "emoji", at: 0.3, chars: ["heart", "star", "sparkle"], n: 9 },
    { kind: "chat", at: 0.45, x: 0.55, y: 0.62, text: "Bunu paylaşmam lazım", bg: "#ff2bd6", fg: "#fff" },
  ],
  cartoon: [
    { kind: "sticker", at: 0.35, x: 0.62, y: -0.66, text: "YENİ BÖLÜM!", bg: "#ffd21f", fg: "#111", rot: -0.1 },
    { kind: "emoji", at: 0.5, chars: ["heart", "star"], n: 7 },
  ],
  arcade: [],
  blueprint2: [{ kind: "sticker", at: 0.62, x: -0.55, y: -0.78, text: "ONAYLANDI", bg: "#ffffff", fg: "#1d4ea8", rot: -0.08 }],
  terminal: [{ kind: "notif", at: 0.78, x: -0.45, y: 0.85, theme: "os", app: GREEN, glyph: "check", title: "DEPLOY TAMAM", body: "OXDIJITAL.COM · ŞİMDİ" }],
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
  cyber: [{ kind: "notif", at: 0.2, x: 0.66, y: -0.6, theme: "cyber", app: ["#ff2bd6", "#7a00ff"], glyph: "globe", title: "SİTE YAYINDA", body: "oxdijital.com" }],
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
    { kind: "notif", at: 0.34, x: 0.6, y: -0.64, theme: "glitch", app: ["#ff2a4d", "#22e6ff"], glyph: "play", title: "YENİ VİDEO YAYINDA", body: "REELS" },
  ],
  brutal: [
    { kind: "notif", at: 0.16, x: 0.6, y: -0.64, theme: "brutal", app: ORANGE, glyph: "globe", title: "Site yayında", body: "oxdijital.com" },
    { kind: "sticker", at: 0.4, x: 0.7, y: 0.5, text: "CANLI ●", bg: "#3ee27a", fg: "#000", rot: 0.1 },
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

/** Tam ekranda metnin arkasındaki örtü: sahnenin kendi zemin rengi (siyaha çamurlaşmasın) */
const SCRIM: Partial<Record<Mode, string>> = {
  refnodes: "#0b0c10",
  reftracking: "#020203",
  refcloud: "#08090c",
  refweb: "#06070b",
  refseo: "#07080c",
  posts: "#050608",
  adchat: "#050608",
  serp: "#050608",
  cyber: "#10031d",
  brutal: "#ffdc45",
  clay: "#f6dcd6",
  glass: "#060608",
  scanlines: "#000000",
  pile: "#f0521a",
  os: "#00a674",
  eq: "#030303",
  dither: "#ebe9e3",
  glitch: "#050505",
  math: "#e4e2de", hud: "#050705", doodle: "#06030b", cartoon: "#2232c8", arcade: "#2a0b2e", blueprint2: "#1b48a3", terminal: "#090c0a",
};
/** Açık zeminli sahnelerde soldaki metin koyulaşır */
const TONE: Partial<Record<Mode, "light" | "dark">> = { math: "light", brutal: "light", clay: "light", dither: "light" };
const withAlpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function BrandFilmSix({
  onWord,
  onTone,
  bleed = false,
  final = false,
  refined = false,
  className,
}: {
  onWord?: (index: number) => void;
  /** Tam ekranda sahnenin zemini açık mı koyu mu (soldaki metnin rengi için) */
  onTone?: (tone: "light" | "dark") => void;
  /** true: çerçeve yok, sahne bütün hero'yu kaplar; logo ve süslemeler sağda, metnin arkasında sahne renginde örtü */
  bleed?: boolean;
  /** true: Final hero sırası (FINAL_SEQUENCE) */
  final?: boolean;
  /** Final — Studio: aynı sekanslar, rafine malzeme, kompozisyon ve kurgu. */
  refined?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onWordRef = useRef(onWord);
  const onToneRef = useRef(onTone);
  useEffect(() => {
    onWordRef.current = onWord;
    onToneRef.current = onTone;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    const shotMs = refined ? 3400 : SHOT_MS;
    const transitionMs = refined ? 600 : TRANS_MS;
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
      if (bleed) {
        // Tam ekran: sahne bütün hero'da; logo ve süslemeler sağdaki bölgede (dar ekranda üstte)
        const area = wide
          ? { x0: width * 0.47, y0: 100, x1: width - width * 0.045, y1: height - 120 }
          : { x0: 16, y0: 88, x1: width - 16, y1: Math.max(300, height * 0.44) };
        frame = { x0: 0, y0: 0, x1: width, y1: height };
        region = area;
        baseX = (area.x0 + area.x1) / 2;
        baseY = (area.y0 + area.y1) / 2;
        baseSize = Math.min(area.x1 - area.x0, area.y1 - area.y0) * (wide ? 0.5 : 0.52);
        return;
      }
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
      ctx.globalAlpha = refined ? Math.min(grainAlpha * 0.25, 0.025) : grainAlpha;
      ctx.globalCompositeOperation = "overlay";
      ctx.translate(refined ? 0 : (t * 9301) % 160, refined ? 0 : (t * 4973) % 160);
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
      // Tam ekranda neon zemin bütün hero boyunca uzanır
      const y1 = region.y1;
      const x0 = bleed ? 40 : region.x0, x1 = bleed ? width - 40 : region.x1;
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
      ctx.shadowBlur = refined ? 2 : 8;
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
      if (!refined) label("NEO-İSTANBUL · 2077", region.x1 - 4, region.y0 + 4, "rgba(255,111,230,0.8)", "right");
      finish(0.08, t, 0.45);
    };

    // Şişkin kil: pastel zemin, yumuşak gölgeli pembe sembol, süzülen kil damlaları
    const clay = (angle: number, t: number) => {
      fill(refined ? "#efdfdc" : "#ffe0cf", refined ? "#d7c8d1" : "#e4d2ff");
      const r = rng(31);
      for (let i = 0; i < (refined ? 2 : 5); i++) {
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
      const amt = refined ? 1.2 + (tick % 16 === 0 ? 4 : 0) : 4 + (tick % 4 === 0 ? 10 : 0);
      ctx.globalCompositeOperation = "lighter";
      drawFlat(extra!.faceRed, view, -amt, 0, 0.9);
      drawFlat(extra!.faceTeal, view, amt, 0, 0.9);
      ctx.globalCompositeOperation = "source-over";
      drawFlat(extra!.faceWhite, view, 0, 0, 0.85);
      const { h } = dims();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 0; i < (refined ? 0 : 5); i++) {
        const sx = Math.floor((cx + (r() - 0.5) * size * 0.9) * dpr);
        const sy = Math.floor((cy + (r() - 0.2) * h * 0.5) * dpr);
        const sw = Math.floor((6 + r() * 40) * dpr);
        ctx.globalAlpha = 0.55;
        ctx.drawImage(canvas, sx, sy, sw, 1, sx, sy, sw, Math.floor((40 + r() * 120) * dpr));
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < (refined ? (tick % 16 === 0 ? 2 : 0) : 7); i++) {
        const y = Math.floor((cy - h / 2 + r() * h) * dpr);
        const bh = Math.floor((3 + r() * 22) * dpr);
        const dx = Math.floor((r() - 0.5) * 70 * dpr);
        ctx.drawImage(canvas, 0, y, canvas.width, bh, dx, y, canvas.width, bh);
      }
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      for (let y = region.y0; y < region.y1; y += 3) ctx.fillRect(region.x0, y, region.x1 - region.x0, 1);
      if (!refined) emit(angle, p, "line", 8);
      label(`REC ● ${String(Math.floor((t / 60) % 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`, region.x1 - 4, region.y0 + 4, "rgba(255,80,100,0.9)", "right");
      finish(0.14, t, 0.6);
    };

    // Neo-brutalizm: sarı zemin, siyah kalın kenar, sert gölge, basit şekiller
    const brutal = (angle: number, t: number) => {
      fill("#ffe14d", "#ffd23a");
      // Tam ekranda ızgara bütün hero boyunca
      const { y0, y1 } = region;
      const x0 = bleed ? 0 : region.x0, x1 = bleed ? width : region.x1;
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
      for (let i = 0; i < (refined ? 2 : 6); i++) {
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
      for (let x = bleed ? 0 : region.x0; x < (bleed ? width : region.x1); x += 7) {
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

    /* ───────────── Stiller 6 üslupları ───────────── */

    const rx = (f: number) => region.x0 + f * (region.x1 - region.x0);
    const ry = (f: number) => region.y0 + f * (region.y1 - region.y0);
    /** Renk kaymalı (kırmızı/camgöbeği) üç kat çizim */
    const chroma = (draw: (col: string) => void, amt: number, main: string) => {
      ctx.save();
      ctx.translate(-amt, 0);
      draw("rgba(255,40,70,0.55)");
      ctx.translate(amt * 2, 0);
      draw("rgba(0,190,255,0.55)");
      ctx.restore();
      draw(main);
    };

    // Matematik: açık tahtada el yazısı formüller yazılır, grafik ve tel küp çizilir, logo kalemle çizilir
    const MATH = [
      { s: "sin²x + cos²x = 1", x: 0.5, y: 0.13, at: 0.0 },
      { s: "F(x) = ∫ f(x) dx", x: 0.02, y: 0.1, at: 0.08 },
      { s: "R = a√3 / 3", x: 0.02, y: 0.6, at: 0.2 },
      { s: "Σ k = n(n+1) / 2", x: 0.5, y: 0.95, at: 0.3 },
      { s: "O × X = ∞", x: 0.66, y: 0.66, at: 0.42 },
    ];
    const math = (angle: number, t: number, p: number) => {
      fill("#ecebe8", "#dcdad6");
      const r = rng(81);
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.25})`;
        ctx.beginPath();
        ctx.arc(rx(r()), ry(r()), 18 + r() * 50, 0, Math.PI * 2);
        ctx.fill();
      }
      const px = Math.round(size * 0.1);
      for (const f of MATH) {
        const k = easeOut(span(p, f.at, f.at + 0.3));
        if (k <= 0) continue;
        ctx.font = `italic ${px}px "Times New Roman", Georgia, serif`;
        ctx.textAlign = "left";
        const x = rx(f.x), y = ry(f.y);
        const w = ctx.measureText(f.s).width;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - 6, y - px * 1.1, (w + 12) * k, px * 1.5);
        ctx.clip();
        chroma((col) => {
          ctx.fillStyle = col;
          ctx.fillText(f.s, x, y);
        }, 1.6, "#1c1c1f");
        ctx.restore();
      }
      // Grafik: eksenler ve parabol çizilerek
      const gk = span(p, 0.1, 0.5);
      const gx = rx(0.78), gy = ry(0.36), gw = (region.x1 - region.x0) * 0.2;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      chroma((col) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.moveTo(gx - gw, gy);
        ctx.lineTo(gx - gw + gw * 2 * gk, gy);
        ctx.moveTo(gx, gy + gw * 0.5);
        ctx.lineTo(gx, gy + gw * 0.5 - gw * 1.3 * gk);
        for (let i = 0; i <= 40 * gk; i++) {
          const u = -1 + (i / 40) * 2;
          const X = gx + u * gw * 0.8, Y = gy - gw * 0.35 + u * u * gw * 0.55;
          if (i) ctx.lineTo(X, Y);
          else ctx.moveTo(X, Y);
        }
        ctx.stroke();
      }, 1.4, "#1c1c1f");
      // Tel küp
      const ck = span(p, 0.25, 0.6);
      const kx = rx(0.12), ky = ry(0.84), ks = size * 0.16;
      const V = [[0, 0], [1, 0], [1, 1], [0, 1]].flatMap(([a, b]) => [[a, b, 0], [a, b, 1]]);
      const pr = ([a, b, c]: number[]) => [kx + (a - c * 0.45) * ks, ky - (b + c * 0.35) * ks] as const;
      const E = [[0, 2], [2, 4], [4, 6], [6, 0], [1, 3], [3, 5], [5, 7], [7, 1], [0, 1], [2, 3], [4, 5], [6, 7]];
      chroma((col) => {
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.beginPath();
        E.slice(0, Math.ceil(E.length * ck)).forEach(([a, b]) => {
          const [ax, ay] = pr(V[a]), [bx, by] = pr(V[b]);
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
        });
        ctx.stroke();
        if (ck > 0.5)
          V.forEach((v) => {
            const [vx, vy] = pr(v);
            ctx.beginPath();
            ctx.arc(vx, vy, 4, 0, Math.PI * 2);
            ctx.fill();
          });
      }, 1.4, "#1c1c1f");
      // Logo: kalemle çizilir (kesik çizgi uzunluğu büyür)
      const R = extra!.ref;
      const lk = easeOut(span(p, 0.04, 0.6));
      chroma((col) => {
        logoT(angle, 0.86);
        ctx.setLineDash([22 * lk, 22]);
        ctx.lineWidth = 0.014;
        ctx.lineJoin = "round";
        ctx.strokeStyle = col;
        ctx.stroke(R.logo);
        ctx.setLineDash([]);
        reset();
      }, 2, "#141416");
      finish(0.1, t, 0.12);
    };

    // HUD: yeşil fosforlu kadran, hizmet dilimleri, dolaşan ibre, dijital sayaç, ortada logo, CRT çizgileri
    const HUD_LABELS = ["SEO", "WEB", "SOSYAL", "REKLAM", "MARKA", "YAZILIM"];
    const hud = (angle: number, t: number, p: number) => {
      fill("#070a08", "#030403");
      const G = "#36e07a";
      const flick = rng(Math.floor(t * 20))() < 0.05 ? 0.6 : 1;
      ctx.globalAlpha = flick;
      ctx.shadowColor = G;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = G;
      ctx.fillStyle = G;
      const R0 = size * 0.82, R1 = R0 * 0.6;
      const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
      ctx.lineWidth = 2;
      // Dış yay parçaları
      for (let i = 0; i < 6; i++) {
        const s = a0 + ((a1 - a0) / 6) * i + 0.03, e = a0 + ((a1 - a0) / 6) * (i + 1) - 0.03;
        ctx.beginPath();
        ctx.arc(cx, cy, R0 + 14, s, e);
        ctx.stroke();
      }
      // Segmentli şerit (dolar)
      const lit = Math.floor(48 * (0.5 + 0.5 * Math.sin(t * 0.9)));
      for (let i = 0; i < 48; i++) {
        const a = a0 + ((a1 - a0) * i) / 47;
        ctx.globalAlpha = flick * (i < lit ? 1 : 0.2);
        ctx.save();
        ctx.translate(cx + Math.cos(a) * (R0 + 26), cy + Math.sin(a) * (R0 + 26));
        ctx.rotate(a);
        ctx.fillRect(-3, -2.5, 8, 5);
        ctx.restore();
      }
      ctx.globalAlpha = flick;
      ctx.beginPath();
      ctx.arc(cx, cy, R0, a0, a1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, R1, 0, Math.PI * 2);
      ctx.stroke();
      // Dilimler ve etiketler
      const seg = (a1 - a0) / HUD_LABELS.length;
      const needle = a0 + (a1 - a0) * (0.5 + 0.45 * Math.sin(t * 0.8 + Math.sin(t * 2.1) * 0.3));
      const active = Math.min(HUD_LABELS.length - 1, Math.max(0, Math.floor((needle - a0) / seg)));
      HUD_LABELS.forEach((lab, i) => {
        const s = a0 + seg * i;
        if (i === active) {
          ctx.globalAlpha = flick * 0.28;
          ctx.beginPath();
          ctx.arc(cx, cy, R0, s, s + seg);
          ctx.arc(cx, cy, R1, s + seg, s, true);
          ctx.fill();
          ctx.globalAlpha = flick;
        }
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(s) * R1, cy + Math.sin(s) * R1);
        ctx.lineTo(cx + Math.cos(s) * R0, cy + Math.sin(s) * R0);
        ctx.stroke();
        const m = s + seg / 2, rr = (R0 + R1) / 2;
        ctx.save();
        ctx.translate(cx + Math.cos(m) * rr, cy + Math.sin(m) * rr);
        ctx.rotate(m + Math.PI / 2);
        ctx.font = `700 ${Math.round(size * 0.065)}px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillText(lab, 0, 4);
        ctx.restore();
      });
      // İbre (dış halkada)
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(needle) * R1, cy + Math.sin(needle) * R1);
      ctx.lineTo(cx + Math.cos(needle) * (R0 + 4), cy + Math.sin(needle) * (R0 + 4));
      ctx.stroke();
      // Sayaç
      ctx.font = `700 ${Math.round(size * 0.15)}px ${mono}`;
      ctx.textAlign = "center";
      const sec = Math.floor(t * 10) % 1000;
      ctx.font = `700 ${Math.round(size * 0.1)}px ${mono}`;
      ctx.fillText(`OX/${String(sec).padStart(3, "0")}`, cx, cy + R0 * 0.74);
      // Alt göstergeler
      for (const sx of [-1, 1]) {
        const gx = cx + sx * R0 * 0.85, gy = cy + R0 * 0.78, gr = size * 0.1;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, t * 2 * sx, t * 2 * sx + Math.PI * 1.3);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(gx, gy, gr * 0.45, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#ff4a4a";
      ctx.shadowColor = "#ff4a4a";
      ctx.font = `700 ${Math.round(size * 0.07)}px ${mono}`;
      ctx.fillText("CANLI", cx, cy + R0 * 0.97);
      // Ortada logo
      const R = extra!.ref;
      ctx.shadowColor = G;
      logoT(angle, 0.5);
      ctx.fillStyle = "rgba(54,224,122,0.14)";
      ctx.fill(R.logo, "evenodd");
      ctx.lineWidth = 0.014;
      ctx.strokeStyle = G;
      ctx.stroke(R.logo);
      reset();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.globalAlpha = 1;
      // CRT çizgileri
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      for (let y = region.y0 - 40; y < region.y1 + 40; y += 3) ctx.fillRect(region.x0 - 30, y, region.x1 - region.x0 + 60, 1);
      void p;
      finish(0.12, t, 0.6);
    };

    // Neon karalama: titreyen neon kalem çizimleri (iki renk kaymalı), logo da neon kalemle
    const wobble = (pts: number[][], closed: boolean, colA: string, colB: string, k: number, seed: number) => {
      const n = Math.max(2, Math.ceil(pts.length * k));
      const boil = rng(seed + Math.floor(performance.now() / 125));
      const path = new Path2D();
      for (let i = 0; i < n; i++) {
        const [x, y] = pts[i];
        const jx = x + (boil() - 0.5) * 2.4, jy = y + (boil() - 0.5) * 2.4;
        if (i) path.lineTo(jx, jy);
        else path.moveTo(jx, jy);
      }
      if (closed && k >= 1) path.closePath();
      ctx.save();
      ctx.lineWidth = 3.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 12;
      ctx.shadowColor = colA;
      ctx.strokeStyle = colA;
      ctx.translate(-2, 0);
      ctx.stroke(path);
      ctx.shadowColor = colB;
      ctx.strokeStyle = colB;
      ctx.translate(4, 1.5);
      ctx.stroke(path);
      ctx.restore();
    };
    const circ = (x: number, y: number, r: number, n = 28, sy = 1) =>
      Array.from({ length: n + 1 }, (_, i) => [x + Math.cos((i / n) * Math.PI * 2) * r, y + Math.sin((i / n) * Math.PI * 2) * r * sy]);
    const poly = (x: number, y: number, pts: number[][], s: number) => pts.map(([a, b]) => [x + a * s, y + b * s]);
    const doodle = (angle: number, t: number, p: number) => {
      fill("#08040e", "#04020a");
      const s = size * 0.2;
      const items: { pts: number[][]; closed: boolean; a: string; b: string; at: number }[] = [];
      const add = (pts: number[][], closed: boolean, a: string, b: string, at: number) => items.push({ pts, closed, a, b, at });
      // göz
      add(circ(rx(0.16), ry(0.2), s * 0.9, 30, 0.5), true, "#c8ff3d", "#ff2bd6", 0.02);
      add(circ(rx(0.16), ry(0.2), s * 0.32), true, "#ffe600", "#ff3b30", 0.08);
      // TV
      add(poly(rx(0.8), ry(0.16), [[-1.2, -0.8], [1.2, -0.8], [1.2, 0.8], [-1.2, 0.8], [-1.2, -0.8]], s), false, "#ff2bd6", "#3df0ff", 0.05);
      add(poly(rx(0.8), ry(0.16), [[-0.5, -0.8], [-0.9, -1.3], [0.5, -0.8], [0.9, -1.3]], s), false, "#3df0ff", "#ff2bd6", 0.12);
      // megafon
      add(poly(rx(0.12), ry(0.78), [[-0.9, -0.3], [0.2, -0.3], [1, -0.8], [1, 0.8], [0.2, 0.3], [-0.9, 0.3], [-0.9, -0.3]], s), false, "#ff3b30", "#ffe600", 0.15);
      // gözlük
      add([...circ(rx(0.85), ry(0.82), s * 0.42), ...circ(rx(0.85) + s, ry(0.82), s * 0.42)], false, "#ff2bd6", "#5b6bff", 0.2);
      // çiçek
      add(circ(rx(0.55), ry(0.9), s * 0.25), true, "#3df0ff", "#c8ff3d", 0.25);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(circ(rx(0.55) + Math.cos(a) * s * 0.45, ry(0.9) + Math.sin(a) * s * 0.45, s * 0.2, 14), true, "#3df0ff", "#c8ff3d", 0.27 + i * 0.01);
      }
      // kalp ve yıldız
      const heart = Array.from({ length: 30 }, (_, i) => {
        const u = (i / 29) * Math.PI * 2;
        return [16 * Math.sin(u) ** 3 / 16, -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) / 16];
      });
      add(poly(rx(0.36), ry(0.12), heart, s * 0.6), true, "#ff2bd6", "#ff3b30", 0.3);
      const star = Array.from({ length: 11 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 0.45 : 1;
        return [Math.cos(a) * r, Math.sin(a) * r];
      });
      add(poly(rx(0.95), ry(0.5), star, s * 0.5), false, "#ffe600", "#ff3b30", 0.34);
      items.forEach((it, i) => wobble(it.pts, it.closed, it.a, it.b, easeOut(span(p, it.at, it.at + 0.3)), i * 7));
      // TV yazısı
      if (p > 0.2) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.font = `800 italic ${Math.round(s * 0.42)}px ${sans}`;
        ctx.textAlign = "center";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#c8ff3d";
        ctx.fillStyle = "#c8ff3d";
        ctx.fillText("YENİ", rx(0.8) - 2, ry(0.16) - s * 0.05);
        ctx.fillText("MESAJ", rx(0.8) - 2, ry(0.16) + s * 0.45);
        ctx.restore();
      }
      // Logo: neon kalem
      const R = extra!.ref;
      const j = rng(Math.floor(t * 8));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const [col, ox, oy] of [["#3df0ff", -3, 0], ["#ff2bd6", 3, 2], ["#ffffff", 0, 0]] as const) {
        logoT(angle, 0.8, ox + (j() - 0.5) * 2, oy + (j() - 0.5) * 2);
        ctx.shadowBlur = 16;
        ctx.shadowColor = col;
        ctx.lineWidth = col === "#ffffff" ? 0.006 : 0.012;
        ctx.strokeStyle = col;
        ctx.stroke(R.logo);
      }
      ctx.restore();
      reset();
      finish(0.1, t, 0.5);
    };

    // Çizgi film: doygun mavi, mor sıçrama, koyu kenarlı gölgeli yeşil logo, süzülen göz küreleri ve atıştırmalıklar
    const INK = "#1a1446";
    const outlineFill = (path: Path2D | (() => void), fillCol: string, lw = 3) => {
      ctx.lineWidth = lw;
      ctx.strokeStyle = INK;
      ctx.fillStyle = fillCol;
      if (typeof path === "function") {
        ctx.beginPath();
        path();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill(path);
        ctx.stroke(path);
      }
    };
    const eyeball = (x: number, y: number, r: number, look: number) => {
      outlineFill(() => ctx.arc(x, y, r, 0, Math.PI * 2), "#ffffff");
      ctx.fillStyle = "rgba(26,20,70,0.12)";
      ctx.beginPath();
      ctx.arc(x + r * 0.15, y + r * 0.15, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      const ix = x + Math.cos(look) * r * 0.35, iy = y + Math.sin(look) * r * 0.35;
      outlineFill(() => ctx.arc(ix, iy, r * 0.42, 0, Math.PI * 2), "#ff6a2a", 2);
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(ix, iy, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ix - r * 0.1, iy - r * 0.12, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    };
    const candy = (x: number, y: number, s: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      outlineFill(() => {
        ctx.moveTo(-s * 0.55, 0);
        ctx.lineTo(-s * 0.95, -s * 0.28);
        ctx.lineTo(-s * 0.95, s * 0.28);
        ctx.closePath();
        ctx.moveTo(s * 0.55, 0);
        ctx.lineTo(s * 0.95, -s * 0.28);
        ctx.lineTo(s * 0.95, s * 0.28);
        ctx.closePath();
      }, "#ff8a2a", 2.5);
      outlineFill(() => ctx.ellipse(0, 0, s * 0.6, s * 0.3, 0, 0, Math.PI * 2), "#ff7a1a", 2.5);
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.12);
      ctx.lineTo(s * 0.1, -s * 0.18);
      ctx.stroke();
      ctx.restore();
    };
    const carton = (x: number, y: number, s: number, rot: number, col: string, spot: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      outlineFill(() => ctx.rect(-s * 0.35, -s * 0.5, s * 0.7, s), col);
      outlineFill(() => {
        ctx.moveTo(-s * 0.35, -s * 0.5);
        ctx.lineTo(0, -s * 0.78);
        ctx.lineTo(s * 0.35, -s * 0.5);
        ctx.closePath();
      }, col);
      ctx.fillStyle = spot;
      for (const [a, b, r] of [[-0.12, -0.15, 0.12], [0.15, 0.2, 0.1], [-0.1, 0.3, 0.07]]) {
        ctx.beginPath();
        ctx.ellipse(a * s, b * s, r * s, r * s * 0.7, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };
    const cartoon = (angle: number, t: number, p: number) => {
      fill("#2b3ff2", "#2131c4");
      // Mor sıçrama
      const r = rng(91);
      ctx.fillStyle = "rgba(205,150,255,0.85)";
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        const rr = size * (0.85 + (r() - 0.5) * 0.35 + Math.sin(a * 5 + t) * 0.05);
        const X = cx + Math.cos(a) * rr * 1.1, Y = cy + Math.sin(a) * rr * 0.75;
        if (i) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(170,110,255,0.9)";
      ctx.lineWidth = 2;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        let X = rx(0.05 + k * 0.35), Y = ry(0.92 - k * 0.3);
        ctx.moveTo(X, Y);
        for (let i = 0; i < 8; i++) {
          X += size * 0.08;
          Y += (i % 2 ? 1 : -1) * size * 0.06;
          ctx.lineTo(X, Y);
        }
        ctx.stroke();
      }
      // Süzülen nesneler (sırayla belirir)
      const show = (i: number) => span(p, i * 0.05, i * 0.05 + 0.1) > 0;
      const fl = (i: number) => Math.sin(t * 1.6 + i) * 6;
      if (show(0)) eyeball(rx(0.1), ry(0.2) + fl(0), size * 0.12, t * 1.5);
      if (show(1)) candy(rx(0.88), ry(0.12) + fl(1), size * 0.22, -0.5 + Math.sin(t) * 0.2);
      if (show(2)) carton(rx(0.82), ry(0.72) + fl(2), size * 0.32, 0.35, "#7ee8ff", "#e8d27a");
      if (show(3)) eyeball(rx(0.9), ry(0.45) + fl(3), size * 0.08, -t * 2);
      if (show(4)) candy(rx(0.12), ry(0.85) + fl(4), size * 0.2, 0.6);
      if (show(5)) carton(rx(0.2), ry(0.52) + fl(5), size * 0.26, -0.3, "#ff8a4a", "#ffe0b0");
      if (show(6)) eyeball(rx(0.55), ry(0.08) + fl(6), size * 0.07, t);
      // Logo: koyu kenar, yeşil gövde, açık şerit, parlama
      const R = extra!.ref;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const bob = Math.sin(t * 2.2) * 5;
      logoT(angle, 0.92, 0, bob);
      ctx.strokeStyle = ctx.fillStyle = INK;
      ctx.lineWidth = 0.085;
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      ctx.strokeStyle = ctx.fillStyle = "#2fbf43";
      ctx.lineWidth = 0.062;
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      logoT(angle, 0.92, -size * 0.008, bob - size * 0.01);
      ctx.strokeStyle = ctx.fillStyle = "#5fe36a";
      ctx.lineWidth = 0.03;
      ctx.fill(R.logo, "evenodd");
      ctx.stroke(R.logo);
      logoT(angle, 0.92, -size * 0.016, bob - size * 0.02);
      ctx.setLineDash([0.02, 0.12]);
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 0.012;
      ctx.stroke(R.logo);
      ctx.setLineDash([]);
      reset();
      finish(0.08, t, 0.15);
    };

    // Retro 8-bit oyun: dönen psikedelik ışınlar, glitch bantları, piksel logo, LEVEL UP rozetleri, Evet/Hayır, kalp ve para
    const arcade = (_angle: number, t: number, p: number) => {
      ctx.imageSmoothingEnabled = false;
      const cols = ["#ff2bd6", "#26e0c9", "#ff3b30", "#ffcf33", "#ff2bd6", "#26e0c9"];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);
      const n = 22;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, Math.max(width, height), (i / n) * Math.PI * 2, ((i + 1) / n) * Math.PI * 2 + 0.01);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,230,80,0.8)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        for (let k = 0; k < 30; k++) {
          const a = (i / 10) * Math.PI * 2 + Math.sin(k * 0.5 + t * 3) * 0.05;
          const rr = size * 0.3 + k * size * 0.06;
          if (k) ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
          else ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.stroke();
      }
      ctx.restore();
      const c = Math.max(3, Math.round(size / 70));
      // Glitch bantları
      const g = rng(Math.floor(t * 8));
      for (let i = 0; i < 4; i++) {
        const y = snap(ry(g()), c);
        const h = snap(4 + g() * 12, c);
        const x = rx(g() * 0.3);
        const w = (region.x1 - region.x0) * (0.4 + g() * 0.7);
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y - c, w, h + 2 * c);
        ctx.fillStyle = ["#e6f03a", "#ffffff", "#3d63ff", "#ff2d87", "#6bff5a"][i % 5];
        ctx.fillRect(x, y, w, h);
      }
      // Piksel logo (ten rengi, siyah kenar), bantların önünde
      const ps = Math.max(3, Math.round((size * 1.0) / extra!.cells.cols));
      pixLogo(cx, cy + (Math.floor(t * 4) % 2 ? -ps : 0), ps, "#e9c27c", "#111");
      // LEVEL UP rozetleri
      const badge = (x: number, y: number, bg: string, k: number) => {
        if (k <= 0) return;
        pixBox(x, y, size * 0.6, size * 0.14, bg, c);
        pixText("LEVEL UP", x + size * 0.3, y + size * 0.1, Math.round(size * 0.08), "#111");
      };
      badge(rx(0.6), ry(0.08), "#e6f03a", span(p, 0.2, 0.25));
      badge(rx(0.52), ry(0.2), "#ff2d87", span(p, 0.32, 0.37));
      // Evet / Hayır balonları
      if (p > 0.45) {
        pixBox(rx(0.3), ry(0.86), size * 0.26, size * 0.13, "#ffffff", c);
        pixText("Evet", rx(0.3) + size * 0.13, ry(0.86) + size * 0.095, Math.round(size * 0.07), "#111");
      }
      if (p > 0.55) {
        pixBox(rx(0.74), ry(0.74), size * 0.28, size * 0.13, "#ffffff", c);
        pixText("Hayır", rx(0.74) + size * 0.14, ry(0.74) + size * 0.095, Math.round(size * 0.07), "#111");
      }
      // Kalpler ve paralar
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.6 + i * 0.25) % 1;
        bitmap(PIX_HEART, snap(rx(0.08 + i * 0.05), c), snap(ry(0.7 - u * 0.5), c), c * 1.4, "#ff2d87");
      }
      for (let i = 0; i < 3; i++) {
        const x = rx(0.06) + i * size * 0.16, y = ry(0.42);
        const sq = Math.abs(Math.cos(t * 4 + i));
        ctx.fillStyle = "#111";
        ctx.fillRect(snap(x - size * 0.07 * sq, c) - c, snap(y - size * 0.07, c) - c, snap(size * 0.14 * sq, c) + 2 * c, snap(size * 0.14, c) + 2 * c);
        ctx.fillStyle = "#ffcf33";
        ctx.fillRect(snap(x - size * 0.07 * sq, c), snap(y - size * 0.07, c), snap(size * 0.14 * sq, c), snap(size * 0.14, c));
      }
      ctx.imageSmoothingEnabled = true;
      finish(0.14, t, 0.2);
    };

    // Blueprint: mavi kâğıt, beyaz çizgiler; çizilerek beliren logo, derinlik hattı, ölçüler, pafta
    const blueprint2 = (angle: number, t: number, p: number) => {
      fill("#2257b8", "#173f93");
      const { x0, y0, x1, y1 } = region;
      ctx.lineWidth = 1;
      for (let i = 0, x = x0 - 20; x <= x1 + 20; x += 18, i++) {
        ctx.strokeStyle = i % 5 === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y0 - 40);
        ctx.lineTo(x + 0.5, y1 + 40);
        ctx.stroke();
      }
      for (let i = 0, y = y0 - 40; y <= y1 + 40; y += 18, i++) {
        ctx.strokeStyle = i % 5 === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(x0 - 20, y + 0.5);
        ctx.lineTo(x1 + 20, y + 0.5);
        ctx.stroke();
      }
      const R = extra!.ref;
      const k = easeOut(span(p, 0, 0.55));
      const W = dims().w * 0.86 * ac(angle), H = size * 0.86;
      // Yapım daireleri ve eksenler
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(W, H) * 0.62, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
      ctx.moveTo(cx - W * 0.8, cy);
      ctx.lineTo(cx - W * 0.8 + W * 1.6 * k, cy);
      ctx.moveTo(cx, cy - H * 0.75);
      ctx.lineTo(cx, cy - H * 0.75 + H * 1.5 * k);
      ctx.stroke();
      ctx.setLineDash([]);
      // Logo, çizilerek (tek çizim; arkadaki soluk kopya "iki logo" gibi duruyordu)
      for (const [ox, oy, a, lw] of [[0, 0, 1, 0.006]] as const) {
        logoT(angle, 0.86, ox, oy);
        ctx.setLineDash([22 * k, 22]);
        ctx.lineWidth = lw;
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.stroke(R.logo);
        ctx.setLineDash([]);
      }
      reset();
      // Ölçüler
      if (k > 0.6) {
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = "#fff";
        ctx.lineWidth = 1;
        const ty = cy - H / 2 - 26, lx = cx - W / 2 - 26;
        const arrow = (x: number, y: number, dx: number, dy: number) => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + dx * 7 - dy * 3, y + dy * 7 + dx * 3);
          ctx.lineTo(x + dx * 7 + dy * 3, y + dy * 7 - dx * 3);
          ctx.fill();
        };
        ctx.beginPath();
        ctx.moveTo(cx - W / 2, ty);
        ctx.lineTo(cx + W / 2, ty);
        ctx.moveTo(lx, cy - H / 2);
        ctx.lineTo(lx, cy + H / 2);
        ctx.stroke();
        arrow(cx - W / 2, ty, 1, 0);
        arrow(cx + W / 2, ty, -1, 0);
        arrow(lx, cy - H / 2, 0, 1);
        arrow(lx, cy + H / 2, 0, -1);
        label(`${Math.round(W)} PX`, cx, ty - 8, "#ffffff", "center", 10);
        ctx.save();
        ctx.translate(lx - 10, cy);
        ctx.rotate(-Math.PI / 2);
        label(`${Math.round(H)} PX`, 0, 0, "#ffffff", "center", 10);
        ctx.restore();
      }
      // Pafta
      const tb = { w: 200, h: 54 };
      const tx = x0 + 6, tyy = y1 - tb.h - 4;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(tx + 0.5, tyy + 0.5, tb.w, tb.h);
      ctx.beginPath();
      ctx.moveTo(tx, tyy + 26.5);
      ctx.lineTo(tx + tb.w, tyy + 26.5);
      ctx.stroke();
      label("OX DİJİTAL · SEMBOL", tx + 10, tyy + 18, "#ffffff");
      label("MARKA KİMLİĞİ · PAFTA 02", tx + 10, tyy + 44, "rgba(255,255,255,0.75)", "left", 9);
      // Koruma alanı: logonun çevresinde kesik çizgili kutu ve köşelerde "x"
      {
        const ck = easeOut(span(p, 0.25, 0.5));
        if (ck > 0) {
          const pad = H * 0.18;
          ctx.globalAlpha = ck;
          ctx.setLineDash([4, 5]);
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - W / 2 - pad, cy - H / 2 - pad, W + pad * 2, H + pad * 2);
          ctx.setLineDash([]);
          label("x", cx - W / 2 - pad / 2, cy - H / 2 - pad / 2 + 3, "rgba(255,255,255,0.85)", "center", 10);
          label("x", cx + W / 2 + pad / 2, cy + H / 2 + pad / 2 + 3, "rgba(255,255,255,0.85)", "center", 10);
          ctx.globalAlpha = 1;
        }
      }
      // Renkler (sağ üst, sırayla belirir)
      const swatches: [string, string][] = [["#2F6BFF", "OX MAVİ"], ["#0A1430", "GECE"], ["#E8EEFC", "SİS"], ["#111111", "MÜREKKEP"]];
      const sx = x1 - 128, sy = y0 + 6;
      label("RENKLER", sx, sy, "rgba(255,255,255,0.75)", "left", 9);
      swatches.forEach(([hex, name], i) => {
        const k = easeOut(span(p, 0.35 + i * 0.07, 0.5 + i * 0.07));
        if (!k) return;
        ctx.globalAlpha = k;
        ctx.fillStyle = hex;
        ctx.fillRect(sx, sy + 12 + i * 34, 26, 26);
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 0.5, sy + 12.5 + i * 34, 26, 26);
        label(hex, sx + 34, sy + 24 + i * 34, "rgba(255,255,255,0.95)", "left", 9);
        label(name, sx + 34, sy + 36 + i * 34, "rgba(255,255,255,0.6)", "left", 8);
      });
      ctx.globalAlpha = 1;
      // Yazı tipleri (sağ alt)
      {
        const fk = easeOut(span(p, 0.6, 0.8));
        if (fk) {
          ctx.globalAlpha = fk;
          const fx = x1 - 170;
          ctx.textAlign = "left";
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.font = `600 40px ${sans}`;
          ctx.fillText("Aa", fx, y1 - 92);
          label("INTER · BAŞLIK VE METİN", fx, y1 - 72, "rgba(255,255,255,0.65)", "left", 8);
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.font = `26px ${mono}`;
          ctx.fillText("Aa", fx, y1 - 30);
          label("SPACE MONO · ETİKET", fx, y1 - 12, "rgba(255,255,255,0.65)", "left", 8);
          ctx.globalAlpha = 1;
        }
      }
      finish(0.14, t, 0.3);
    };

    // Terminal: komutlar yazılır, logo ASCII karakterlerle belirir
    const TERM = [
      "$ ox build --marka",
      "> logo.svg ............ ✓",
      "> renkler.json ........ ✓",
      "> site.tsx ............ ✓",
      "$ ox deploy",
      "> yayında: oxdijital.com",
    ];
    const ASCII = " .:-=+*#%@";
    const terminal = (angle: number, t: number, p: number) => {
      fill("#0b0e0c", "#060807");
      const G = "#39ff88";
      const { x0, y0, x1 } = region;
      // Pencere çubuğu
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x0 - 10, y0 - 22, x1 - x0 + 20, 26);
      ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x0 + 6 + i * 16, y0 - 9, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      label("ox@dijital: ~/marka", (x0 + x1) / 2, y0 - 5, "rgba(255,255,255,0.45)", "center", 10);
      // Yazılan satırlar
      const px = Math.round(size * 0.058);
      ctx.font = `${px}px ${mono}`;
      ctx.textAlign = "left";
      const total = TERM.join("").length;
      let budget = Math.floor(total * span(p, 0.02, 0.75));
      TERM.forEach((line, i) => {
        if (budget <= 0) return;
        const shown = line.slice(0, budget);
        budget -= line.length;
        ctx.fillStyle = line.startsWith("$") ? "#ffffff" : line.includes("yayında") ? G : "rgba(57,255,136,0.75)";
        ctx.fillText(shown, x0 + 4, y0 + 24 + i * px * 1.6);
        if (budget <= 0 && Math.floor(t * 2.5) % 2) ctx.fillRect(x0 + 4 + ctx.measureText(shown).width + 2, y0 + 24 + i * px * 1.6 - px * 0.8, px * 0.55, px);
      });
      // ASCII logo (sağ altta), ızgara dönüşle daralır
      const R = extra!.ref;
      const ak = span(p, 0.15, 0.6);
      const cw = size * 0.022, chH = cw * 1.9;
      const step = 2;
      const cols = Math.floor(R.gw / step), rows = Math.floor(R.gh / (step * 1.9));
      const sx = ac(angle);
      const ox = cx + size * 0.28 - (cols * cw * sx) / 2, oy = cy + size * 0.22 - (rows * chH) / 2;
      ctx.font = `700 ${Math.round(chH)}px ${mono}`;
      ctx.fillStyle = G;
      ctx.shadowColor = G;
      ctx.shadowBlur = 6;
      ctx.textAlign = "center";
      for (let j = 0; j < rows; j++) {
        if (j / rows > ak) break;
        for (let i = 0; i < cols; i++) {
          const v = R.hm[(Math.floor(j * step * 1.9) + 14) * R.hmW + i * step + 14];
          if (v < 0.12) continue;
          ctx.fillText(ASCII[Math.min(ASCII.length - 1, Math.floor(v * ASCII.length))], ox + (i + 0.5) * cw * sx, oy + j * chH);
        }
      }
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = region.y0 - 40; y < region.y1 + 40; y += 3) ctx.fillRect(region.x0 - 30, y, region.x1 - region.x0 + 60, 1);
      finish(0.1, t, 0.5);
    };

    // İlk Referans'ın "ağ" sahnesi: gri metal sembol, perspektif zemin ızgarası, veri kutuları ve logoya eğri bağlantılar
    const nodeRand = rng(21);
    const REF_NODES = Array.from({ length: 11 }, (_, i) => ({
      angle: (i / 11) * Math.PI * 2 + nodeRand() * 0.4,
      radius: 0.95 + nodeRand() * 0.45,
      rows: 3 + Math.floor(nodeRand() * 5),
      seed: nodeRand(),
    }));
    const refText = (str: string, x: number, y: number, px: number, color: string) => {
      ctx.font = `${px}px ${mono}`;
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.fillText(str, x, y);
    };
    const refnodes = (angle: number, t: number) => {
      ctx.fillStyle = "#0b0c10";
      ctx.fillRect(0, 0, width, height);
      // Perspektif zemin ızgarası
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      const horizon = cy - size * 0.2;
      for (let i = 1; i < 14; i++) {
        const y = horizon + (height - horizon) * (i / 14) ** 1.8;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let i = -16; i <= 16; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 18, horizon);
        ctx.lineTo(cx + i * 160, height);
        ctx.stroke();
      }
      drawSolid(angle, assets!.faceGray, [assets!.sideGray]);
      // Veri kutuları ve bağlantıları
      const rxx = (region.x1 - region.x0) * 0.42;
      const ryy = (region.y1 - region.y0) * 0.42;
      ctx.lineWidth = 1;
      REF_NODES.forEach((n, i) => {
        const a = n.angle + Math.sin(t * 0.4 + i) * 0.05;
        const nx = cx + Math.cos(a) * rxx * n.radius;
        const ny = cy + Math.sin(a) * ryy * n.radius;
        const pnt = project(((i * 0.37) % 1) * 1.6 - 0.8, ((i * 0.61) % 1) * 1.6 - 0.8, angle);
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.bezierCurveTo(nx + (cx - nx) * 0.2, ny - 60, pnt.x + (nx - pnt.x) * 0.3, pnt.y + 40, pnt.x, pnt.y);
        ctx.stroke();
        const bw = 64, bh = 12 + n.rows * 9;
        ctx.fillStyle = "rgba(10,14,30,0.78)";
        ctx.fillRect(nx - bw / 2, ny - bh / 2, bw, bh);
        ctx.strokeStyle = "rgba(47,107,255,0.75)";
        ctx.strokeRect(nx - bw / 2 + 0.5, ny - bh / 2 + 0.5, bw - 1, bh - 1);
        for (let r = 0; r < n.rows; r++) {
          const v = Math.floor((n.seed * 9973 + r * 131 + Math.floor(t * 4) * 7) % 999);
          refText(`${String.fromCharCode(97 + ((r + i) % 6))}: ${v}`, nx - bw / 2 + 5, ny - bh / 2 + 13 + r * 9, 8, "rgba(220,228,255,0.7)");
        }
        refText(`x: ${Math.round(nx)} y: ${Math.round(ny)}`, nx - bw / 2, ny + bh / 2 + 11, 9, "rgba(255,255,255,0.5)");
      });
      refText("nesne: 00 · ox sembol · ağ", cx - size * 0.45, cy - size * 0.62, 10, "rgba(255,255,255,0.78)");
      finish(0.16, t, 0.35);
    };

    // İlk Referans'ın "takip" sahnesi: beyaz yüzlü, mavi kenarlı ışıyan sembol; köşe işaretleri, takip noktaları, kenarlara çizgiler
    const reftracking = (angle: number, t: number) => {
      ctx.fillStyle = "#020203";
      ctx.fillRect(0, 0, width, height);
      const { w, h, depth } = dims();
      const cos = Math.cos(angle);
      const zf = (-depth / 2) * cos;
      const f = CAMERA / (CAMERA + zf);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(18px)";
      ctx.setTransform(dpr * ac(angle) * f, 0, 0, dpr * f, dpr * (cx + (-depth / 2) * Math.sin(angle) * f), dpr * cy);
      ctx.drawImage(assets!.sideGlow, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, assets!.faceGlow, [assets!.sideGlow]);
      // Takip noktaları ve koordinatlar (değerler ekrandaki gerçek konum)
      const pts = assets!.points;
      const marks = [0, 1, 2, 3, 4, 5].map((k) => project(pts[k * 431 * 2], pts[k * 431 * 2 + 1], angle));
      ctx.lineWidth = 1;
      marks.forEach((m, k) => {
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.strokeRect(m.x - 4, m.y - 4, 8, 8);
        if (k % 2 === 0) {
          ctx.fillStyle = BLUE_REF;
          ctx.fillRect(m.x + 8, m.y - 12, 7, 7);
        }
        refText(`x: ${Math.round(m.x)} y: ${Math.round(m.y)}`, m.x + 10, m.y + 3, 9, "rgba(255,255,255,0.85)");
      });
      // Kenarlara uzanan ince çizgiler
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.moveTo(marks[0].x, marks[0].y);
      ctx.lineTo(cx + (region.x1 - cx) * 0.2, 0);
      ctx.moveTo(marks[3].x, marks[3].y);
      ctx.lineTo(region.x0 - 120, height);
      ctx.moveTo(marks[5].x, marks[5].y);
      ctx.lineTo(width, cy + size * 0.1);
      ctx.stroke();
      // Köşe işaretleri: logonun ekrandaki kutusu
      const bw = (w * ac(angle) + depth * Math.abs(Math.sin(angle))) / 2 + 14;
      const bh = h / 2 + 14;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        ctx.beginPath();
        ctx.moveTo(cx + sx * bw, cy + sy * (bh - 16));
        ctx.lineTo(cx + sx * bw, cy + sy * bh);
        ctx.lineTo(cx + sx * (bw - 16), cy + sy * bh);
        ctx.stroke();
      }
      finish(0.05, t, 0.3);
    };

    // İlk Referans'ın "nokta bulutu" sahnesi (tel kafes kutu, bilgi satırları, ölçek çubuğu); noktalar derinliğe göre
    // maviden yeşilimsi turkuaza ve beyaza (yakın noktalar parlak ve iri)
    const REFCLOUD_COLORS = ["rgba(80,120,255,0.35)", "rgba(80,200,255,0.55)", "rgba(120,255,220,0.75)", "rgba(230,255,250,0.95)"];
    const refcloud = (angle: number, t: number) => {
      ctx.fillStyle = "#08090c";
      ctx.fillRect(0, 0, width, height);
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      rg.addColorStop(0, "rgba(40,200,180,0.07)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, width, height);
      const { w, h, depth, half } = dims();
      const pts = extra!.cloud;
      const zs = extra!.cloudZ;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = REFCLOUD_COLORS[b];
        const sz = 1.1 + b * 0.4;
        for (let i = 0; i < CLOUD_POINTS; i++) {
          const z = zs[i] * depth * 0.5;
          const X = pts[i * 2] * half;
          const xr = X * cos + z * sin;
          const zr = -X * sin + z * cos;
          const near = Math.min(3, Math.max(0, Math.floor(((-zr / (half * 0.6)) * 0.5 + 0.5) * 4)));
          if (near !== b) continue;
          const f = CAMERA / (CAMERA + zr);
          ctx.fillRect(cx + xr * f - sz / 2, cy + pts[i * 2 + 1] * half * f - sz / 2, sz, sz);
        }
      }
      // Tel kafes kutu
      const corners3: [number, number][] = [];
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const X = (sx * w) / 2 + sx * 18;
        const Y = (sy * h) / 2 + sy * 18;
        const z = (sz * depth) / 2 + sz * 18;
        const xr = X * cos + z * sin;
        const zr = -X * sin + z * cos;
        const f = CAMERA / (CAMERA + zr);
        corners3.push([cx + xr * f, cy + Y * f]);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < 8; a++)
        for (let b = a + 1; b < 8; b++) {
          const diff = a ^ b;
          if (diff === 1 || diff === 2 || diff === 4) {
            ctx.moveTo(corners3[a][0], corners3[a][1]);
            ctx.lineTo(corners3[b][0], corners3[b][1]);
          }
        }
      ctx.stroke();
      // Bilgi satırları (değerler gerçek: nokta sayısı, dönüş açısı)
      const lx = region.x0 + 4, ly = region.y0 + 6;
      const degNow = ((((angle * 180) / Math.PI) % 360) + 360) % 360;
      ["NOKTA BULUTU", `NOKTA     ${CLOUD_POINTS}`, `DÖNÜŞ     ${degNow.toFixed(1)}°`, "MOD       TEL KAFES"].forEach((str, i) =>
        refText(str, lx, ly + i * 13, 9, i ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.85)"),
      );
      // Ölçek çubuğu
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(region.x1 - 150, region.y1 - 14.5);
      ctx.lineTo(region.x1 - 20, region.y1 - 14.5);
      ctx.stroke();
      refText("0.0", region.x1 - 150, region.y1 - 2, 8, "rgba(255,255,255,0.45)");
      ctx.textAlign = "right";
      ctx.fillText("10.0", region.x1 - 20, region.y1 - 2);
      ctx.textAlign = "left";
      finish(0.1, t, 0.35);
    };

    // Referans 2'nin "Website" sekansı: site tarayıcıda kurulur; pencere masaüstü → tablet → telefon olarak daralır
    const refweb = (angle: number, t: number, p: number) => {
      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, width, height);
      const glowR = size * 1.6;
      const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      gg.addColorStop(0, "rgba(47,107,255,0.1)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);
      const { x0, y0, x1, y1 } = region;
      const full = (x1 - x0) * 0.9;
      const fh = (y1 - y0) * 0.86;
      const toTablet = easeOut(span(p, 0.5, 0.66));
      const toPhone = easeOut(span(p, 0.74, 0.9));
      const fw = full - (full - fh * 0.75) * toTablet - (fh * 0.75 - fh * 0.48) * toPhone;
      const fx = cx - fw / 2, fy = cy - fh / 2;
      const phone = toPhone > 0.5;
      const narrow = toTablet > 0.5;
      const rr = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
      };
      // Çerçeve
      rr(fx, fy, fw, fh, phone ? 26 : 14);
      ctx.fillStyle = "#0d0f16";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.save();
      rr(fx, fy, fw, fh, phone ? 26 : 14);
      ctx.clip();
      // Üst çubuk
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(fx, fy, fw, 26);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(fx + 14 + i * 12, fy + 13, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      rr(fx + 56, fy + 6, Math.min(220, fw - 70), 14, 7);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fill();
      refText("oxdijital.com", fx + 64, fy + 16, 8, "rgba(255,255,255,0.6)");
      const ix = fx + 18, iy = fy + 40, iw = fw - 36;
      const show = (a: number) => easeOut(span(p, a, a + 0.12));
      // Menü
      ctx.globalAlpha = show(0.05);
      ctx.drawImage(assets!.faceBlue, ix, iy, 22 * (assets!.w / assets!.h), 22);
      if (!narrow)
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillRect(ix + iw - 220 + i * 46, iy + 9, 34, 4);
        }
      else
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillRect(ix + iw - 18, iy + 4 + i * 6, 18, 2.5);
        }
      ctx.globalAlpha = 1;
      // Hero: geniş ekranda yazı solda logo sağda, dar ekranda logo üstte
      const heroH = fh * (phone ? 0.5 : 0.48);
      const logoS = Math.min(heroH * (narrow ? 0.46 : 0.62), iw * (narrow ? 0.42 : 0.28));
      const logoX = narrow ? ix + iw / 2 : ix + iw * 0.72;
      const logoY = narrow ? iy + 40 + logoS * 0.55 : iy + 40 + heroH / 2;
      {
        const keep = { cx, cy, size };
        cx = logoX;
        cy = logoY;
        size = logoS;
        drawSolid(angle, assets!.faceBlue, extra!.blueSides, show(0.15));
        cx = keep.cx;
        cy = keep.cy;
        size = keep.size;
      }
      const tx = narrow ? ix + iw * 0.1 : ix;
      const ty = narrow ? logoY + logoS * 0.75 : iy + 40 + heroH * 0.28;
      const tw = narrow ? iw * 0.8 : iw * 0.46;
      ctx.globalAlpha = show(0.22);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      if (refined) {
        const fontSize = Math.min(phone ? 21 : 32, tw / 5.7);
        ctx.font = `500 ${fontSize}px ${sans}`;
        ctx.textAlign = "left";
        ctx.fillText("Daha etkili.", tx, ty + fontSize * .7);
        ctx.fillText("Daha sen.", tx, ty + fontSize * 1.75);
        ctx.font = `${Math.max(7, fontSize * .3)}px ${sans}`;
        ctx.fillStyle = "rgba(255,255,255,.46)";
        ctx.fillText("Fikirden dijital deneyime.", tx, ty + (phone ? 44 : 63));
      } else {
        ctx.fillRect(tx, ty, tw * 0.9, phone ? 8 : 12);
        ctx.fillRect(tx, ty + (phone ? 14 : 20), tw * 0.6, phone ? 8 : 12);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(tx, ty + (phone ? 32 : 46), tw * 0.85, 4);
        ctx.fillRect(tx, ty + (phone ? 40 : 56), tw * 0.7, 4);
      }
      ctx.globalAlpha = show(0.3);
      rr(tx, ty + (phone ? 52 : 74), phone ? 70 : 96, phone ? 18 : 26, 13);
      ctx.fillStyle = "#2f6bff";
      ctx.fill();
      ctx.font = `600 ${phone ? 8 : 10}px ${sans}`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("Teklif al", tx + (phone ? 35 : 48), ty + (phone ? 64 : 91));
      ctx.textAlign = "left";
      // Kartlar
      ctx.globalAlpha = show(0.38);
      const cols = phone ? 1 : narrow ? 2 : 3;
      const cardY = fy + fh * (phone ? 0.8 : narrow ? 0.76 : 0.7);
      const cw = (iw - (cols - 1) * 10) / cols;
      for (let c = 0; c < cols; c++) {
        rr(ix + c * (cw + 10), cardY, cw, fh * 0.22, 8);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(ix + c * (cw + 10) + 10, cardY + 12, cw * 0.5, 4);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      // Kırılım etiketi
      const bp = phone ? "TELEFON · 390" : narrow ? "TABLET · 768" : "MASAÜSTÜ · 1440";
      ctx.font = `8px ${mono}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(170,198,255,0.85)";
      ctx.fillText(bp, fx + fw, fy - 10);
      ctx.textAlign = "left";
      refText("MOBİL UYUMLU · HIZLI · SEO HAZIR", fx, fy - 10, 8, "rgba(255,255,255,0.45)");
      finish(0.05, t, 0.35);
    };

    // Referans 2'nin "SEO" sekansı: arama yazılır, site haritası sayfa sayfa dizine eklenir, nokta bulutu logo taranır
    const REF_PAGES = ["/", "/hizmetler", "/hizmetler/website", "/hizmetler/seo", "/paketler", "/blog", "/iletisim"];
    const refseo = (angle: number, t: number, p: number) => {
      const { x0, y0, x1 } = region;
      const ox = cx + (x1 - x0) * 0.14;
      ctx.fillStyle = "#07080c";
      ctx.fillRect(0, 0, width, height);
      const gR = size * 1.6;
      const gg = ctx.createRadialGradient(ox, cy, 0, ox, cy, gR);
      gg.addColorStop(0, "rgba(47,107,255,0.06)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(ox - gR, cy - gR, gR * 2, gR * 2);
      const sLogo = size * 0.85;
      const a = assets!;
      const half = Math.max((sLogo * a.w) / a.h, sLogo) / 2;
      const depth = half * 2 * 0.13;
      const pts = a.points;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      // Tarama çizgisi soldan sağa geçer; geçtiği noktalar parlar
      const scanX = ox - half * 1.2 + half * 2.4 * easeOut(span(p, 0.08, 0.7));
      for (let i = 0; i < pts.length / 2; i++) {
        const X = pts[i * 2] * half;
        const Y = pts[i * 2 + 1] * half;
        const z = ((i % 3) - 1) * (depth / 2);
        const xr = X * cos + z * sin;
        const zr = -X * sin + z * cos;
        const f = CAMERA / (CAMERA + zr);
        const px = ox + xr * f;
        const scanned = px < scanX;
        ctx.fillStyle = scanned ? "rgba(140,175,255,0.95)" : "rgba(200,216,255,0.35)";
        ctx.fillRect(px, cy + Y * f, scanned ? 2 : 1.4, scanned ? 2 : 1.4);
      }
      if (p > 0.08 && p < 0.72) {
        const grad = ctx.createLinearGradient(scanX - 40, 0, scanX, 0);
        grad.addColorStop(0, "rgba(47,107,255,0)");
        grad.addColorStop(1, "rgba(47,107,255,0.35)");
        ctx.fillStyle = grad;
        ctx.fillRect(scanX - 40, cy - half * 1.1, 40, half * 2.2);
        ctx.strokeStyle = "rgba(170,198,255,0.9)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scanX, cy - half * 1.1);
        ctx.lineTo(scanX, cy + half * 1.1);
        ctx.stroke();
      }
      // Arama çubuğu (yazılır)
      const q = "web tasarım ajansı";
      const typed = q.slice(0, Math.round(q.length * easeOut(span(p, 0, 0.3))));
      ctx.beginPath();
      ctx.roundRect(x0 + 14, y0 + 6, 250, 32, 16);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      icon("search", x0 + 34, y0 + 22, 14, "rgba(255,255,255,0.55)");
      ctx.font = `12px ${sans}`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.textAlign = "left";
      ctx.fillText(typed + (Math.floor(t * 2) % 2 ? "" : "|"), x0 + 52, y0 + 26);
      // Site ağacı: gerçek sayfalar, tarandıkça işaretlenir
      const tx = x0 + 20, ty = y0 + 68;
      refText("SİTE HARİTASI", tx, ty, 8, "rgba(255,255,255,0.5)");
      REF_PAGES.forEach((pg, i) => {
        const k = easeOut(span(p, 0.15 + i * 0.06, 0.25 + i * 0.06));
        if (!k) return;
        const lvl = pg.split("/").length - 2;
        const lx = tx + Math.max(0, lvl) * 14;
        const ly = ty + 18 + i * 21;
        ctx.globalAlpha = k;
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.moveTo(tx + 3, ly - 14);
        ctx.lineTo(tx + 3, ly - 4);
        ctx.lineTo(lx - 4, ly - 4);
        ctx.stroke();
        refText(`oxdijital.com${pg === "/" ? "" : pg}`, lx, ly, 10, "rgba(230,236,255,0.85)");
        const done = p > 0.3 + i * 0.07;
        refText(done ? "✓ DİZİNE EKLENDİ" : "TARANIYOR…", tx + 260, ly, 8, done ? "rgba(120,170,255,0.95)" : "rgba(255,255,255,0.35)");
        ctx.globalAlpha = 1;
      });
      finish(0.08, t, 0.35);
    };

    // Premium'un "Sosyal Medya" sahnesi: üç gönderi kartı (kâğıt "Daha etkili.", mavi + beyaz logo, siyah + mavi logo);
    // kartlar sırayla yükselir, ortadaki beğenilir (büyük kalp, kalp ikonu kırmızıya döner)
    const heartPath = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.35);
      ctx.bezierCurveTo(x - s * 0.95, y - s * 0.25, x - s * 0.45, y - s * 0.9, x, y - s * 0.38);
      ctx.bezierCurveTo(x + s * 0.45, y - s * 0.9, x + s * 0.95, y - s * 0.25, x, y + s * 0.35);
      ctx.closePath();
    };
    const postCard = (w: number, kind: 0 | 1 | 2, liked: number, angle: number) => {
      const head = w * 0.17, img = w * 1.25, foot = w * 0.17;
      const h = head + img + foot;
      const x0 = -w / 2, y0 = -h / 2;
      ctx.shadowColor = "rgba(0,0,0,0.75)";
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 24;
      ctx.fillStyle = "#121214";
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, w * 0.08);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Başlık: avatar + ad
      const av = head * 0.62;
      const ag = ctx.createLinearGradient(x0 + 16, y0, x0 + 16 + av, y0 + av);
      ag.addColorStop(0, "#4f84ff");
      ag.addColorStop(1, "#2152dc");
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(x0 + w * 0.06 + av / 2, y0 + head / 2, av / 2, 0, Math.PI * 2);
      ctx.fill();
      const lw = av * 0.62 * (assets!.w / assets!.h);
      ctx.drawImage(extra!.faceWhite, x0 + w * 0.06 + av / 2 - lw / 2, y0 + head / 2 - av * 0.31, lw, av * 0.62);
      ctx.font = `600 ${Math.round(w * 0.055)}px ${sans}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText("oxdijital", x0 + w * 0.06 + av + w * 0.04, y0 + head / 2 + w * 0.02);
      // Görsel
      const iy = y0 + head;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, iy, w, img);
      ctx.clip();
      if (kind === 0) {
        const pg = ctx.createLinearGradient(x0, 0, x0 + w, 0);
        pg.addColorStop(0, "#d9d6cf");
        pg.addColorStop(0.5, "#f2f0eb");
        pg.addColorStop(1, "#cfccc4");
        ctx.fillStyle = pg;
        ctx.fillRect(x0, iy, w, img);
        ctx.fillStyle = "#0b0b0c";
        ctx.font = `500 ${Math.round(w * 0.16)}px ${sans}`;
        ctx.letterSpacing = `${-w * 0.008}px`;
        ctx.fillText("Daha", x0 + w * 0.12, iy + img * 0.8);
        ctx.fillText("etkili.", x0 + w * 0.12, iy + img * 0.8 + w * 0.15);
        ctx.letterSpacing = "0px";
      } else {
        if (kind === 1) {
          const bg = ctx.createLinearGradient(x0, iy, x0 + w * 0.3, iy + img);
          bg.addColorStop(0, "#4f84ff");
          bg.addColorStop(0.45, "#2f6bff");
          bg.addColorStop(1, "#2152dc");
          ctx.fillStyle = bg;
        } else ctx.fillStyle = "#0b0b0c";
        ctx.fillRect(x0, iy, w, img);
        const lh = w * 0.42, lwi = lh * (assets!.w / assets!.h) * (kind === 1 ? ac(angle) : 1);
        ctx.drawImage(kind === 1 ? extra!.faceWhite : assets!.faceBlue, -lwi / 2, iy + img / 2 - lh / 2, lwi, lh);
        if (kind === 1 && liked > 0 && liked < 1) {
          // Büyük kalp (çift dokunuş)
          const sc = liked < 0.25 ? easeBack(liked / 0.25) : 1;
          ctx.globalAlpha = liked > 0.7 ? (1 - liked) / 0.3 : 1;
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(0,0,0,0.35)";
          ctx.shadowBlur = 30;
          heartPath(0, iy + img / 2 + w * 0.04, w * 0.32 * sc);
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();
      // Alt: beğen, yorum, gönder
      const fy = iy + img + foot / 2, isz = foot * 0.36;
      const red = kind === 1 && liked > 0;
      ctx.lineWidth = Math.max(1.6, w * 0.007);
      ctx.lineJoin = "round";
      ctx.strokeStyle = red ? "#ff3b5c" : "rgba(255,255,255,0.85)";
      ctx.fillStyle = "#ff3b5c";
      const hb = red && liked < 0.3 ? 1 + Math.sin((liked / 0.3) * Math.PI) * 0.35 : 1;
      heartPath(x0 + w * 0.1, fy + isz * 0.1, isz * 1.15 * hb);
      if (red) ctx.fill();
      else ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(x0 + w * 0.22, fy, isz * 0.62, Math.PI * 0.75, Math.PI * 2.55);
      ctx.lineTo(x0 + w * 0.22 - isz * 0.7, fy + isz * 0.7);
      ctx.closePath();
      ctx.stroke();
      const px = x0 + w * 0.33;
      ctx.beginPath();
      ctx.moveTo(px - isz * 0.6, fy - isz * 0.1);
      ctx.lineTo(px + isz * 0.7, fy - isz * 0.7);
      ctx.lineTo(px + isz * 0.1, fy + isz * 0.7);
      ctx.lineTo(px - isz * 0.05, fy + isz * 0.05);
      ctx.closePath();
      ctx.moveTo(px - isz * 0.05, fy + isz * 0.05);
      ctx.lineTo(px + isz * 0.7, fy - isz * 0.7);
      ctx.stroke();
      return h;
    };
    const posts = (angle: number, t: number, p: number) => {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);
      const gR = size * 1.8;
      const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, gR);
      gg.addColorStop(0, "rgba(47,107,255,0.1)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(cx - gR, cy - gR, gR * 2, gR * 2);
      const rw = region.x1 - region.x0, rh = region.y1 - region.y0;
      const w = Math.min(rw * 0.33, (rh * 0.88) / 1.59);
      const liked = refined ? 0 : span(p, 0.55, 0.95);
      // Sol, sağ, sonra ortadaki (önde)
      const cards: { kind: 0 | 1 | 2; dx: number; dy: number; rot: number; sc: number; at: number }[] = [
        { kind: 0, dx: -w * 0.95, dy: w * 0.1, rot: -0.07, sc: 1, at: 0.08 },
        { kind: 2, dx: w * 0.95, dy: w * 0.1, rot: 0.07, sc: 1, at: 0.16 },
        { kind: 1, dx: 0, dy: -w * 0.04, rot: 0, sc: 1.12, at: 0 },
      ];
      for (const c of cards) {
        const k = easeOut(span(p, c.at, c.at + 0.32));
        if (k <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.min(1, k * 1.5);
        ctx.translate(cx + c.dx, cy + c.dy + (1 - k) * w * 0.35 + Math.sin(t * 1.4 + c.dx) * 3);
        ctx.rotate(c.rot);
        ctx.scale(c.sc * (0.96 + 0.04 * k), c.sc * (0.96 + 0.04 * k));
        postCard(w, c.kind, liked, angle);
        ctx.restore();
      }
      finish(0.05, t, 0.35);
    };

    // Premium'un "Reklam" sahnesi: sponsorlu gönderi → "Mesaj gönder"e dokunuş → sohbet penceresi, mesajlar, yazıyor
    const avatar = (x: number, y: number, r: number) => {
      const ag = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
      ag.addColorStop(0, "#4f84ff");
      ag.addColorStop(1, "#2152dc");
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      const lh = r * 1.2, lw = lh * (assets!.w / assets!.h);
      ctx.drawImage(extra!.faceWhite, x - lw / 2, y - lh / 2, lw, lh);
    };
    const softShadow = (on: boolean) => {
      ctx.shadowColor = on ? "rgba(0,0,0,0.7)" : "transparent";
      ctx.shadowBlur = on ? 50 : 0;
      ctx.shadowOffsetY = on ? 24 : 0;
    };
    const adchat = (angle: number, t: number, p: number) => {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);
      const gR = size * 1.8;
      const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, gR);
      gg.addColorStop(0, "rgba(47,107,255,0.1)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(cx - gR, cy - gR, gR * 2, gR * 2);
      const rw = region.x1 - region.x0, rh = region.y1 - region.y0;
      const aw = Math.min(rw * 0.44, (rh * 0.9) / 1.4);
      const head = aw * 0.19, img = aw, foot = aw * 0.19;
      const ah = head + img + foot;
      // Reklam kartı
      const ak = easeOut(span(p, 0, 0.3));
      const ax = cx - rw * 0.2 - aw / 2, ay = cy - ah / 2 - aw * 0.06 + (1 - ak) * aw * 0.3;
      ctx.save();
      ctx.globalAlpha = ak;
      softShadow(true);
      ctx.fillStyle = "#121214";
      ctx.beginPath();
      ctx.roundRect(ax, ay, aw, ah, aw * 0.08);
      ctx.fill();
      softShadow(false);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(ax, ay, aw, ah, aw * 0.08);
      ctx.clip();
      avatar(ax + aw * 0.1, ay + head / 2, head * 0.32);
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.font = `600 ${Math.round(aw * 0.05)}px ${sans}`;
      ctx.fillText("oxdijital", ax + aw * 0.18, ay + head * 0.45);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = `${Math.round(aw * 0.042)}px ${sans}`;
      ctx.fillText("Sponsorlu", ax + aw * 0.18, ay + head * 0.78);
      const iy = ay + head;
      const bg = ctx.createLinearGradient(ax, iy, ax + aw * 0.4, iy + img);
      bg.addColorStop(0, "#4f84ff");
      bg.addColorStop(0.45, "#2f6bff");
      bg.addColorStop(1, "#2152dc");
      ctx.fillStyle = bg;
      ctx.fillRect(ax, iy, aw, img);
      const lh = aw * 0.17, lw = lh * (assets!.w / assets!.h) * ac(angle);
      ctx.drawImage(extra!.faceWhite, ax + aw * 0.09, iy + aw * 0.09, lw, lh);
      ctx.fillStyle = "#ffffff";
      ctx.font = `500 ${Math.round(aw * 0.1)}px ${sans}`;
      ctx.letterSpacing = `${-aw * 0.005}px`;
      ctx.fillText("Markanı birlikte", ax + aw * 0.07, iy + img * 0.8);
      ctx.fillText("kuralım.", ax + aw * 0.07, iy + img * 0.8 + aw * 0.1);
      ctx.letterSpacing = "0px";
      // CTA çubuğu + dokunuş dalgası
      const fy = iy + img;
      ctx.fillStyle = "#1b1b1f";
      ctx.fillRect(ax, fy, aw, foot);
      const tap = span(p, 0.32, 0.5);
      if (tap > 0 && tap < 1) {
        ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - tap)})`;
        ctx.beginPath();
        ctx.arc(ax + aw * 0.4, fy + foot / 2, aw * 0.5 * easeOut(tap), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 ${Math.round(aw * 0.048)}px ${sans}`;
      ctx.fillText("Mesaj gönder", ax + aw * 0.07, fy + foot * 0.6);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ax + aw * 0.9, fy + foot * 0.36);
      ctx.lineTo(ax + aw * 0.93, fy + foot * 0.5);
      ctx.lineTo(ax + aw * 0.9, fy + foot * 0.64);
      ctx.stroke();
      ctx.restore();
      // Sohbet penceresi
      const ck = easeOut(span(p, 0.42, 0.65));
      if (ck > 0) {
        const cw = aw * 1.02, ch = aw * 0.68;
        const chx = cx + rw * 0.2 - cw / 2 + (1 - ck) * aw * 0.25, chy = cy - ch / 2 + aw * 0.22;
        ctx.save();
        ctx.globalAlpha = ck;
        softShadow(true);
        ctx.fillStyle = "#f2f2ee";
        ctx.beginPath();
        ctx.roundRect(chx, chy, cw, ch, aw * 0.07);
        ctx.fill();
        softShadow(false);
        const hh = ch * 0.27;
        avatar(chx + cw * 0.1, chy + hh / 2, hh * 0.3);
        ctx.textAlign = "left";
        ctx.fillStyle = "#0b0b0c";
        ctx.font = `600 ${Math.round(aw * 0.05)}px ${sans}`;
        ctx.fillText("OX Dijital", chx + cw * 0.19, chy + hh * 0.48);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.font = `${Math.round(aw * 0.04)}px ${sans}`;
        ctx.fillText("çevrimiçi", chx + cw * 0.19, chy + hh * 0.78);
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.fillRect(chx, chy + hh, cw, 1);
        const bubble = (text: string, by: number, k: number) => {
          if (k <= 0) return;
          ctx.font = `${Math.round(aw * 0.047)}px ${sans}`;
          const tw = ctx.measureText(text).width;
          const bw = tw + aw * 0.1, bh = aw * 0.105;
          const bx = chx + cw - cw * 0.05 - bw;
          ctx.globalAlpha = ck * Math.min(1, k * 2);
          ctx.fillStyle = "#2f6bff";
          ctx.beginPath();
          ctx.roundRect(bx, by + (1 - k) * 8, bw, bh, [bh / 2, bh / 2, bh * 0.15, bh / 2]);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, bx + aw * 0.05, by + (1 - k) * 8 + bh * 0.66);
          ctx.globalAlpha = ck;
        };
        bubble("Merhaba, reklamınızı gördüm.", chy + hh + ch * 0.08, easeOut(span(p, 0.55, 0.65)));
        bubble("Bilgi alabilir miyim?", chy + hh + ch * 0.08 + aw * 0.13, easeOut(span(p, 0.65, 0.75)));
        // Yazıyor noktaları
        const tk = span(p, 0.78, 0.85);
        if (tk > 0) {
          const dx = chx + cw * 0.05, dy = chy + ch - ch * 0.16;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(dx, dy - aw * 0.045, aw * 0.16, aw * 0.09, aw * 0.045);
          ctx.fill();
          for (let i = 0; i < 3; i++) {
            ctx.fillStyle = `rgba(0,0,0,${0.25 + 0.4 * (0.5 + 0.5 * Math.sin(t * 6 - i * 0.8))})`;
            ctx.beginPath();
            ctx.arc(dx + aw * 0.045 + i * aw * 0.035, dy, aw * 0.011, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }
      finish(0.05, t, 0.35);
    };

    // Premium'un "SEO" sahnesi: arama yazılır, OX Dijital'in sonucu ve alt bağlantıları bulanıktan netleşerek belirir
    const SERP_LINKS: [string, string][] = [
      ["Hizmetler", "Website, SEO, sosyal medya, reklam"],
      ["Paketler", "İhtiyaca göre hazırlanan planlar"],
      ["Çalışmalar", "Yaptığımız işler"],
      ["İletişim", "Ücretsiz görüşme ayarla"],
    ];
    const serp = (_angle: number, t: number, p: number) => {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);
      const gR = size * 1.8;
      const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, gR);
      gg.addColorStop(0, "rgba(47,107,255,0.1)");
      gg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(cx - gR, cy - gR, gR * 2, gR * 2);
      const rw = region.x1 - region.x0;
      const w = Math.min(rw * 0.96, 640);
      const u = w / 600;
      const h = 375 * u;
      const k0 = easeOut(span(p, 0, 0.25));
      const x0 = cx - w / 2, y0 = cy - h / 2 - 20 * u + (1 - k0) * 30 * u;
      // Arkadaki soluk kart
      ctx.globalAlpha = easeOut(span(p, 0.08, 0.35));
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x0 + 26 * u, y0 + 48 * u, w - 52 * u, h, 26 * u);
      ctx.fill();
      ctx.stroke();
      // Ana kart
      ctx.globalAlpha = k0;
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 26;
      const cg = ctx.createLinearGradient(x0, y0, x0 + w, y0 + h);
      cg.addColorStop(0, "#d8d6d0");
      cg.addColorStop(0.35, "#f4f3ef");
      cg.addColorStop(1, "#e6e4de");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, 26 * u);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      // Arama kutusu, yazılır
      const pad = 24 * u;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.beginPath();
      ctx.roundRect(x0 + pad, y0 + pad, w - pad * 2, 48 * u, 24 * u);
      ctx.fill();
      ctx.stroke();
      icon("search", x0 + pad + 28 * u, y0 + pad + 24 * u, 16 * u, "rgba(0,0,0,0.45)");
      const q = "istanbul dijital ajans";
      const typed = q.slice(0, Math.round(q.length * span(p, 0.06, 0.38)));
      ctx.font = `${Math.round(16 * u)}px ${sans}`;
      ctx.textAlign = "left";
      ctx.fillStyle = "#0b0b0c";
      const qx = x0 + pad + 50 * u, qy = y0 + pad + 30 * u;
      ctx.fillText(typed, qx, qy);
      if (Math.floor(t * 2.2) % 2 === 0) {
        ctx.fillStyle = "#2f6bff";
        ctx.fillRect(qx + ctx.measureText(typed).width + 2, qy - 14 * u, 1.5, 18 * u);
      }
      // Sonuç (bulanıktan netleşir)
      const rise = (a: number) => easeOut(span(p, a, a + 0.18));
      const blurIn = (k: number) => (ctx.filter = k < 1 ? `blur(${((1 - k) * 8).toFixed(1)}px)` : "none");
      const rk = rise(0.4);
      const ry = y0 + pad + 72 * u;
      if (rk > 0) {
        ctx.save();
        ctx.globalAlpha = k0 * rk;
        ctx.translate(0, (1 - rk) * 12 * u);
        blurIn(rk);
        avatar(x0 + pad + 20 * u, ry + 20 * u, 20 * u);
        ctx.fillStyle = "#0b0b0c";
        ctx.font = `500 ${Math.round(14 * u)}px ${sans}`;
        ctx.fillText("OX Dijital", x0 + pad + 54 * u, ry + 16 * u);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.font = `${Math.round(13 * u)}px ${sans}`;
        ctx.fillText("oxdijital.com", x0 + pad + 54 * u, ry + 34 * u);
        ctx.fillStyle = "#1d3fbf";
        ctx.font = `500 ${Math.round(22 * u)}px ${sans}`;
        ctx.letterSpacing = `${-0.4 * u}px`;
        ctx.fillText("OX Dijital · Website, SEO ve Reklam", x0 + pad, ry + 82 * u);
        ctx.letterSpacing = "0px";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.font = `${Math.round(14 * u)}px ${sans}`;
        ctx.fillText("İstanbul merkezli dijital ajans. Website, sosyal medya, SEO ve reklam tek çatı", x0 + pad, ry + 112 * u);
        ctx.fillText("altında; tek ekip, tek plan.", x0 + pad, ry + 134 * u);
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(x0 + pad, ry + 156 * u, w - pad * 2, 1);
        ctx.restore();
        // Alt bağlantılar
        SERP_LINKS.forEach(([title, desc], i) => {
          const lk = rise(0.55 + i * 0.07);
          if (lk <= 0) return;
          ctx.save();
          ctx.globalAlpha = k0 * lk;
          blurIn(lk);
          const lx = x0 + pad + (i % 2) * (w - pad * 2) * 0.52;
          const ly = ry + 188 * u + Math.floor(i / 2) * 64 * u + (1 - lk) * 8 * u;
          ctx.fillStyle = "#1d3fbf";
          ctx.font = `500 ${Math.round(16 * u)}px ${sans}`;
          ctx.fillText(title, lx, ly);
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.font = `${Math.round(13.5 * u)}px ${sans}`;
          ctx.fillText(desc, lx, ly + 22 * u);
          ctx.restore();
        });
      }
      ctx.globalAlpha = 1;
      ctx.filter = "none";
      finish(0.05, t, 0.35);
    };

    // Studio uses the same logo assets and scene vocabulary as Final.
    // These shots receive dedicated art direction; the remaining shots use
    // the original renderers with the shared restrained motion/finishing pass.
    const studioCaption = (title: string, detail: string) => {
      if (width < 600) return;
      const y = region.y1 - 8;
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(region.x0 + 24, y - 22); ctx.lineTo(region.x1 - 24, y - 22); ctx.stroke();
      label(title, region.x0 + 24, y, "rgba(255,255,255,0.65)", "left", 9);
      label(detail, region.x1 - 24, y, "rgba(255,255,255,0.3)", "right", 8);
    };

    const studioNodes = (angle: number, t: number, p: number) => {
      fill("#0b0c10", "#08090c", "rgba(91,117,163,0.09)");
      const rw = region.x1 - region.x0, rh = region.y1 - region.y0;
      const compact = width < 600;
      const names = ["Website", "Otomasyon", "Veri", "İçerik", "SEO", "Reklam"];
      const offsets = [[-.34, -.29], [.33, -.29], [.39, .04], [.29, .32], [-.31, .29], [-.4, -.02]];
      offsets.forEach(([x, y], i) => {
        const nx = cx + rw * x, ny = cy + rh * y;
        const point = project(x * 1.7, y * 1.8, angle);
        const k = easeOut(span(p, i * .035, .26 + i * .035));
        const controlX = nx * .45 + point.x * .55;
        ctx.save();
        ctx.globalAlpha = k;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(174,194,226,0.23)";
        ctx.beginPath(); ctx.moveTo(nx, ny); ctx.bezierCurveTo(controlX, ny, controlX, point.y, point.x, point.y); ctx.stroke();
        const q = (t * .22 + i / 6) % 1, u = 1 - q;
        const sx = u ** 3 * nx + 3 * u * u * q * controlX + 3 * u * q * q * controlX + q ** 3 * point.x;
        const sy = u ** 3 * ny + 3 * u * u * q * ny + 3 * u * q * q * point.y + q ** 3 * point.y;
        ctx.fillStyle = "#9dbdff"; ctx.beginPath(); ctx.arc(sx, sy, 1.8, 0, Math.PI * 2); ctx.fill();
        const bw = compact ? 58 : 92, bh = compact ? 28 : 39;
        ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
        ctx.fillStyle = "#12161d"; ctx.beginPath(); ctx.roundRect(nx - bw / 2, ny - bh / 2, bw, bh, 5); ctx.fill();
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.strokeStyle = "rgba(190,209,238,0.17)"; ctx.stroke();
        ctx.font = `500 ${compact ? 8 : 11}px ${sans}`; ctx.textAlign = "center"; ctx.fillStyle = "#c5cfdf"; ctx.fillText(names[i], nx, ny + 4);
        ctx.restore();
      });
      ctx.save(); ctx.globalAlpha = .2; ctx.filter = "blur(20px)";
      drawFlat(extra!.faceBlack, angle, 12, size * .13); ctx.restore(); reset();
      drawSolid(angle, sheenFace(extra!.faceChrome, p * .7 + .15, .2), extra!.chromeSides);
      studioCaption("BAĞLANTILI BİR SİSTEM", "STRATEJİ → UYGULAMA");
      finish(.035, t, .28);
    };

    const studioTracking = (angle: number, t: number, p: number) => {
      fill("#080a10", "#050609", "rgba(47,107,255,0.075)");
      const { w, h } = dims();
      const bw = w * ac(angle) / 2 + 26, bh = h / 2 + 26;
      ctx.strokeStyle = "rgba(153,178,219,0.09)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - bw, region.y0 + 36); ctx.lineTo(cx - bw, region.y1 - 48);
      ctx.moveTo(cx + bw, region.y0 + 36); ctx.lineTo(cx + bw, region.y1 - 48);
      ctx.moveTo(region.x0 + 20, cy - bh); ctx.lineTo(region.x1 - 20, cy - bh);
      ctx.moveTo(region.x0 + 20, cy + bh); ctx.lineTo(region.x1 - 20, cy + bh); ctx.stroke();
      drawSolid(angle, sheenFace(extra!.faceWhite, p, .12), extra!.blueSides);
      corners(cx - bw, cy - bh, cx + bw, cy + bh, 14, "rgba(157,188,255,0.65)");
      for (let i = 0; i < 3; i++) {
        const pt = project(assets!.points[i * 862], assets!.points[i * 862 + 1], angle);
        ctx.fillStyle = "#2f6bff"; ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2); ctx.fill();
        if (width >= 600) label(`0${i + 1}`, pt.x + 10, pt.y - 9, "rgba(180,199,230,.65)", "left", 8);
      }
      studioCaption("DOĞRU ODAK. NET ETKİ.", "REKLAM / TAKİP");
      finish(.025, t, .25);
    };

    const studioCloud = (angle: number, t: number, p: number) => {
      fill("#08090c", "#050609", "rgba(47,107,255,0.07)");
      const { half, depth } = dims();
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const settle = 1 - easeOut(span(p, 0, .38));
      const palette = ["rgba(70,105,180,.3)", "rgba(100,151,232,.5)", "rgba(166,206,255,.75)", "rgba(236,246,255,.95)"];
      for (let band = 0; band < 4; band++) {
        ctx.fillStyle = palette[band];
        ctx.beginPath();
        for (let i = 0; i < CLOUD_POINTS; i++) {
          const z = extra!.cloudZ[i] * depth;
          const x = extra!.cloud[i * 2] * half;
          const zz = -x * sin + z * cos;
          const near = Math.min(3, Math.max(0, Math.floor((.5 - zz / half * .5) * 4)));
          if (near !== band) continue;
          const f = CAMERA / (CAMERA + zz);
          const px = cx + (x * cos + z * sin) * f + Math.sin(i * 2.3) * settle * size * .16;
          const py = cy + extra!.cloud[i * 2 + 1] * half * f + Math.cos(i * 1.7) * settle * size * .1;
          const radius = Math.max(.45, size / 310) * (.45 + band * .2);
          ctx.moveTo(px + radius, py); ctx.arc(px, py, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      studioCaption("HER DETAY BİR BÜTÜNÜ KURAR", `${CLOUD_POINTS} NOKTA / OX`);
      finish(.025, t, .3);
    };

    const STUDIO_RENDER: Partial<Record<Mode, (angle: number, t: number, p: number) => void>> = {
      refnodes: studioNodes, reftracking: studioTracking, refcloud: studioCloud,
    };

    const RENDER: Record<Mode, (angle: number, t: number, p: number) => void> = {
      beauty, chrome, cyber, clay, pixel, riso, glitch, brutal, cloud, zine, neon, pop, sketch, tracking, nodes,
      glass, scanlines, bauhaus, pile, os, balloon, iso, eq, dither, grunge,
      math, hud, doodle, cartoon, arcade, blueprint2, terminal,
      refnodes,
      reftracking,
      refcloud,
      refweb,
      refseo,
      posts,
      adchat,
      serp,
    };

    let forced = -1;
    try {
      if (process.env.NODE_ENV === "development") forced = Number(localStorage.getItem("ox-film-sekans") ?? -1);
    } catch {}

    const seq = final ? FINAL_SEQUENCE : SEQUENCE;
    let start = performance.now();
    let lastShot = -1;
    let lastTone = "";
    // Geçiş: önceki sahnenin son karesi yakalanır, yeni sahnenin üstünde yumuşak maskeyle çözülür
    const lastFrame = document.createElement("canvas");
    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d")!;
    let snapReady = false;
    const draw = (now: number) => {
      if (!assets || !extra) return;
      const elapsed = Math.max(0, now - start);
      let shot = reduced ? 0 : Math.floor(elapsed / shotMs) % seq.length;
      if (forced >= 0 && forced < seq.length) shot = forced;
      if (shot !== lastShot) {
        if (lastShot >= 0 && !reduced && forced < 0) {
          // Tuvalde hâlâ önceki sahnenin son karesi var
          for (const c of [lastFrame, mask])
            if (c.width !== canvas.width || c.height !== canvas.height) {
              c.width = canvas.width;
              c.height = canvas.height;
            }
          lastFrame.getContext("2d")!.drawImage(canvas, 0, 0);
          snapReady = true;
        }
        lastShot = shot;
        onWordRef.current?.(shot);
      }
      // Soldaki metnin rengi geçişin ortasında döner (zemin o an değişiyor)
      const sinceCut = elapsed % shotMs;
      if (!snapReady || sinceCut > transitionMs * 0.45) {
        const tone = TONE[seq[shot]] ?? "dark";
        if (tone !== lastTone) {
          lastTone = tone;
          onToneRef.current?.(tone);
        }
      }
      const p = reduced ? 0.85 : (elapsed % shotMs) / shotMs;
      const target = pointer ? ((pointer.x - baseX) / width) * 0.8 : 0;
      tilt += (target - tilt) * 0.05;
      const t = elapsed / 1000 * (refined ? 0.65 : 1);
      const angle = reduced ? 0.3 : Math.sin(t * (refined ? 0.42 : 0.6)) * (refined ? 0.32 : 0.52) + tilt * 0.3;
      curAngle = angle;
      const mode = seq[shot];
      const fw = frame.x1 - frame.x0, fh = frame.y1 - frame.y0;
      const scene = (m: Mode, pp: number) => {
        const studioScale = ["refnodes", "reftracking", "refcloud", "clay", "glass", "dither"].includes(m) ? 1.12 : 1;
        size = baseSize * (FRAMING[m] ?? 1) * (refined ? studioScale * (1 + easeOut(pp) * 0.018) : 1 + pp * 0.035);
        cx = baseX;
        cy = baseY;
        reset();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.filter = "none";
        (refined && STUDIO_RENDER[m] ? STUDIO_RENDER[m]! : RENDER[m])(angle, t, pp);
      };

      reset();
      ctx.clearRect(0, 0, width, height);
      // Çerçevenin dışında sahnenin renginden yumuşak ışıma
      ctx.save();
      ctx.shadowColor = ACCENT[mode] ?? "#2f6bff";
      ctx.shadowBlur = 90;
      ctx.globalAlpha = bleed ? 0 : 0.32;
      ctx.fillStyle = "#030304";
      ctx.beginPath();
      ctx.roundRect(frame.x0 + 30, frame.y0 + 30, fw - 60, fh - 60, 28);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frame.x0, frame.y0, fw, fh, bleed ? 0 : 28);
      ctx.clip();
      scene(mode, p);
      if (!refined) pops(mode, p, t, angle);

      ctx.restore();

      /** Önceki sahne, yeni sahnenin üstünde tüylü kenarlı iris, eğik silme ya da büyüyüp bulanıklaşarak çözülür */
      const overlay = () => {
        if (!snapReady || reduced || forced >= 0 || sinceCut >= transitionMs) return;
        const k = sinceCut / transitionMs;
        const e = 0.5 - 0.5 * Math.cos(Math.PI * k);
        if (refined) {
          // The registered logo stays in place across a clean optical dissolve.
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = 1 - e;
          ctx.drawImage(lastFrame, 0, 0);
          ctx.restore();
          return;
        }
        const W = canvas.width, H = canvas.height;
        const kind = shot % 3;
        const m = maskCtx;
        m.setTransform(1, 0, 0, 1, 0, 0);
        m.globalCompositeOperation = "source-over";
        m.globalAlpha = 1;
        m.filter = "none";
        m.clearRect(0, 0, W, H);
        if (kind === 2) {
          const sc = 1 + 0.06 * e;
          m.globalAlpha = 1 - e;
          m.filter = `blur(${(e * 10 * dpr).toFixed(1)}px)`;
          m.drawImage(lastFrame, (W * (1 - sc)) / 2, (H * (1 - sc)) / 2, W * sc, H * sc);
        } else {
          const sc = 1 + 0.035 * e;
          m.drawImage(lastFrame, (W * (1 - sc)) / 2, (H * (1 - sc)) / 2, W * sc, H * sc);
          m.globalCompositeOperation = "destination-out";
          const feather = Math.max(W, H) * 0.2;
          let g: CanvasGradient;
          if (kind === 0) {
            const ox = baseX * dpr, oy = baseY * dpr;
            const maxR = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) + feather;
            const r = e * maxR;
            g = m.createRadialGradient(ox, oy, Math.max(0, r - feather), ox, oy, Math.max(1, r));
          } else {
            const a = 0.32, dx = Math.cos(a), dy = Math.sin(a);
            const pos = e * (W * dx + H * dy + feather);
            g = m.createLinearGradient(dx * (pos - feather), dy * (pos - feather), dx * pos, dy * pos);
          }
          g.addColorStop(0, "rgba(0,0,0,1)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          m.fillStyle = g;
          m.fillRect(0, 0, W, H);
        }
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.filter = "none";
        ctx.drawImage(mask, 0, 0);
        ctx.restore();
      };

      reset();
      if (bleed) {
        // Metnin arkasına sahnenin kendi renginde örtü (geniş ekranda soldan, dar ekranda alttan)
        const c = SCRIM[mode] ?? "#030304";
        const wideScreen = width >= 1024;
        const g = wideScreen ? ctx.createLinearGradient(0, 0, width * 0.58, 0) : ctx.createLinearGradient(0, height * 0.4, 0, height * 0.66);
        if (wideScreen) {
          g.addColorStop(0, withAlpha(c, 0.94));
          g.addColorStop(0.55, withAlpha(c, 0.78));
          g.addColorStop(1, withAlpha(c, 0));
        } else {
          g.addColorStop(0, withAlpha(c, 0));
          g.addColorStop(1, withAlpha(c, 0.96));
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
        overlay();
        return;
      }

      // Çerçeve kenarı
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(frame.x0 + 0.5, frame.y0 + 0.5, fw - 1, fh - 1, 28);
      ctx.stroke();
      overlay();
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
      const clayFace = tintFrom(mask, refined ? "#caa6ae" : "#ff7fb0");
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
        claySides: ramp(refined ? ["#b99099", "#ad828e", "#9d7481", "#8b6573", "#795664", "#684957"] : ["#ff6aa2", "#f05592", "#dc4682", "#c43a72", "#a83062", "#8a2752"]),
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
  }, [bleed, final, refined]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block", className)} />;
}
