"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildAssets, type Assets } from "./brand-film";
import { rng, sampleImage } from "./shape-sampler";

// Hero sahnesi "Stiller": Referans+'nın (brand-film-plus.tsx, olduğu gibi duruyor) çeşitlendirilmiş hâli.
// Aynı OX sembolü her kesmede başka bir sanat üslubunda görünür; her üslup bir hizmete bağlıdır ve sembolden o
// hizmete ait bir bildirim (ve bazı üsluplarda ikonlar) çıkar. Bildirim kartları da üsluba göre giydirilir:
//   Stüdyo (sonuç: "Yeni müşteri geldi") · Eskiz/grunge (Tasarım: "Taslak hazır") · Teknik çizim (Marka: "Logo onaylandı") ·
//   Cyberpunk (Website: "Site yayında") · Nokta bulutu (SEO: "Dizine eklendi") · 8-bit (Sosyal Medya: piksel kalpler,
//   yorumlar, "Yeni takipçi") · Glitch art (İçerik: kalp/yorum ikonları, "Yeni video yayında") ·
//   Hedef takibi (Reklam: "Yeni talep") · Ağ (Yazılım: "Rapor hazır").
// Sembol ±35° salınır (arka yüz görünmez). Bildirimlerde rakam ya da vaat yok.
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta sabit kare.

type Mode = "beauty" | "sketch" | "blueprint" | "cyber" | "cloud" | "pixel" | "glitch" | "tracking" | "nodes";
const SEQUENCE: Mode[] = ["beauty", "sketch", "blueprint", "cyber", "cloud", "pixel", "glitch", "tracking", "nodes"];
/** Sol başlıkta moda eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const STYLE_WORDS = ["sonuç", "Tasarım", "Marka", "Website", "SEO", "Sosyal Medya", "İçerik", "Reklam", "Yazılım"];

const SHOT_MS = 2000;
const LAYERS = 40;
const CAMERA = 1500;
const CLOUD_POINTS = 5200;
const BLUE = "#2f6bff";

const FRAMING: Record<Mode, { scale: number; dx: number; dy: number }> = {
  beauty: { scale: 0.92, dx: -0.08, dy: 0.02 },
  sketch: { scale: 0.78, dx: -0.06, dy: 0.04 },
  blueprint: { scale: 0.8, dx: -0.04, dy: 0.02 },
  cyber: { scale: 0.74, dx: -0.04, dy: -0.12 },
  cloud: { scale: 0.96, dx: -0.06, dy: 0.02 },
  pixel: { scale: 0.86, dx: -0.04, dy: 0.04 },
  glitch: { scale: 1.02, dx: -0.04, dy: 0 },
  tracking: { scale: 1.1, dx: -0.1, dy: 0.06 },
  nodes: { scale: 0.7, dx: 0, dy: -0.02 },
};

type Skin = "modern" | "dark" | "sketch" | "blueprint" | "cyber" | "pixel" | "glitch";
type Icon = "user" | "pencil" | "check" | "globe" | "search" | "heart" | "play" | "target" | "chart" | "comment";
/** Sembolden çıkan bildirim: konum sembol boyu cinsinden (merkeze göre) */
const CARDS: Record<Mode, { skin: Skin; icon: Icon; title: string; sub: string; x: number; y: number }> = {
  beauty: { skin: "modern", icon: "user", title: "Yeni müşteri geldi", sub: "Web sitesinden · şimdi", x: 0.62, y: -0.62 },
  sketch: { skin: "sketch", icon: "pencil", title: "Taslak hazır", sub: "Logo eskizleri", x: 0.66, y: -0.58 },
  blueprint: { skin: "blueprint", icon: "check", title: "LOGO ONAYLANDI", sub: "MARKA KİMLİĞİ · PAFTA 01", x: 0.64, y: -0.66 },
  cyber: { skin: "cyber", icon: "globe", title: "SİTE YAYINDA", sub: "oxdijital.com", x: 0.7, y: -0.5 },
  cloud: { skin: "dark", icon: "search", title: "Dizine eklendi", sub: "Arama motoru · şimdi", x: 0.62, y: -0.6 },
  pixel: { skin: "pixel", icon: "heart", title: "YENİ TAKİPÇİ", sub: "AZ ÖNCE", x: 0.64, y: -0.66 },
  glitch: { skin: "glitch", icon: "play", title: "YENİ VİDEO YAYINDA", sub: "REELS", x: 0.6, y: -0.62 },
  tracking: { skin: "modern", icon: "target", title: "Yeni talep", sub: "Reklamdan geldi · şimdi", x: 0.72, y: 0.46 },
  nodes: { skin: "dark", icon: "chart", title: "Rapor hazır", sub: "Panelde görüntüle", x: 0.02, y: -0.8 },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

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

const PIX_HEART = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
const PIX_BUBBLE = ["XXXXXXX", "X.....X", "X.X.X.X", "X.....X", "XXXXXXX", ".X....."];

type Extra = {
  blueSides: HTMLCanvasElement[];
  graySides: HTMLCanvasElement[];
  glowSides: HTMLCanvasElement[];
  magentaSides: HTMLCanvasElement[];
  faceCyan: HTMLCanvasElement;
  faceRed: HTMLCanvasElement;
  faceTeal: HTMLCanvasElement;
  faceWhite: HTMLCanvasElement;
  hatch: HTMLCanvasElement;
  pencil: HTMLCanvasElement;
  sheen: HTMLCanvasElement;
  cloud: Float32Array;
  cloudZ: Float32Array;
  cells: { cols: number; rows: number; on: Uint8Array };
};

export function BrandFilmStyles({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
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
    let pointer: { x: number; y: number } | null = null;
    let tilt = 0;

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
      region = wide
        ? { x0: width * 0.47, y0: 104, x1: width - width * 0.045, y1: height - 132 }
        : { x0: 16, y0: 96, x1: width - 16, y1: Math.max(320, height * 0.46) };
      baseX = (region.x0 + region.x1) / 2;
      baseY = (region.y0 + region.y1) / 2;
      baseSize = Math.min(region.x1 - region.x0, region.y1 - region.y0) * (wide ? 0.5 : 0.56);
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
      for (const l of layers) {
        const f = CAMERA / (CAMERA + l.zr);
        const x = cx + l.z * sin * f;
        ctx.setTransform(dpr * cos * f, 0, 0, dpr * f, dpr * x, dpr * cy);
        const img = l.k === 0 ? face : sides[Math.min(sides.length - 1, Math.floor((l.k / LAYERS) * sides.length))];
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      }
      ctx.globalAlpha = 1;
      reset();
    };

    /** Düz yüz (dönüşle daralır), isteğe bağlı kayma */
    const drawFlat = (img: HTMLCanvasElement, angle: number, dx = 0, dy = 0, alpha = 1) => {
      const { w, h } = dims();
      ctx.globalAlpha = alpha;
      ctx.setTransform(dpr * Math.cos(angle), 0, 0, dpr, dpr * (cx + dx), dpr * (cy + dy));
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.globalAlpha = 1;
      reset();
    };

    const reflection = (angle: number, face: HTMLCanvasElement, floor: string, alpha: number) => {
      const { w, h } = dims();
      const top = cy + h / 2 + size * 0.05;
      const k = 0.55;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.setTransform(dpr * Math.cos(angle), 0, 0, -dpr * k, dpr * cx, dpr * (top + (h * k) / 2));
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
      const xr = X * Math.cos(angle) + z * Math.sin(angle);
      const zr = -X * Math.sin(angle) + z * Math.cos(angle);
      const f = CAMERA / (CAMERA + zr);
      return { x: cx + xr * f, y: cy + py * half * f };
    };

    const studio = (top: string, bottom: string, light: string | null) => {
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

    const finish = (grainAlpha: number, t: number, vignette = 0.55) => {
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

    const deg = (a: number) => ((((a * 180) / Math.PI) % 360) + 360) % 360;

    /* ───────────── İkonlar ───────────── */

    const icon = (name: Icon, x: number, y: number, s: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 24, s / 24);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
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
          ctx.moveTo(2, -6);
          ctx.lineTo(6, -2);
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
          ctx.stroke();
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
          ctx.arc(0, 0, 1.6, 0, Math.PI * 2);
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
      }
      ctx.restore();
    };

    const bitmap = (rows: string[], x: number, y: number, cell: number, color: string) => {
      ctx.fillStyle = color;
      rows.forEach((r, j) => {
        for (let i = 0; i < r.length; i++) if (r[i] === "X") ctx.fillRect(Math.round(x + i * cell), Math.round(y + j * cell), cell, cell);
      });
    };

    /** Titrek (elle çizilmiş) dikdörtgen */
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

    /* ───────────── Bildirim kartı ───────────── */

    const card = (mode: Mode, p: number, t: number, start = 0.22) => {
      const c = CARDS[mode];
      const k = span(p, start, start + 0.28);
      if (k <= 0) return;
      const e = easeBack(k);
      const tx = cx + c.x * size;
      const ty = cy + c.y * size;
      const x = cx + (tx - cx) * easeOut(k);
      const y = cy + (ty - cy) * easeOut(k);
      const s = 0.25 + 0.75 * e;
      const w = 236, h = 58;
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 2.5);
      // Sembolden karta ince iz (yalnız çıkarken)
      if (k < 1 && c.skin !== "pixel") {
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.translate(x, y);
      ctx.scale(s, s);
      const x0 = -w / 2, y0 = -h / 2;
      const text = (title: string, sub: string, tc: string, sc: string, font: string, subFont: string, ox = 58) => {
        ctx.textAlign = "left";
        ctx.font = font;
        ctx.fillStyle = tc;
        ctx.fillText(title, x0 + ox, y0 + 25);
        ctx.font = subFont;
        ctx.fillStyle = sc;
        ctx.fillText(sub, x0 + ox, y0 + 43);
      };
      switch (c.skin) {
        case "modern":
        case "dark": {
          const light = c.skin === "modern";
          ctx.shadowColor = "rgba(0,0,0,0.55)";
          ctx.shadowBlur = 30;
          ctx.shadowOffsetY = 12;
          ctx.fillStyle = light ? "rgba(246,246,243,0.97)" : "rgba(22,23,28,0.96)";
          ctx.beginPath();
          ctx.roundRect(x0, y0, w, h, 16);
          ctx.fill();
          ctx.shadowColor = "transparent";
          if (!light) {
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.stroke();
          }
          ctx.fillStyle = BLUE;
          ctx.beginPath();
          ctx.roundRect(x0 + 12, y0 + 11, 36, 36, 10);
          ctx.fill();
          icon(c.icon, x0 + 30, y0 + 29, 18, "#fff");
          text(c.title, c.sub, light ? "#0b0b0c" : "#fff", light ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)", `600 14px ${sans}`, `12px ${sans}`);
          break;
        }
        case "sketch": {
          ctx.fillStyle = "#f6f3ec";
          ctx.fillRect(x0, y0, w, h);
          ctx.strokeStyle = "#2a2a2c";
          ctx.lineWidth = 1.4;
          sketchRect(x0, y0, w, h, Math.floor(t * 8));
          sketchRect(x0 + 12, y0 + 11, 36, 36, Math.floor(t * 8) + 3);
          icon(c.icon, x0 + 30, y0 + 29, 18, "#2a2a2c");
          text(c.title, c.sub, "#1d1d1f", "rgba(29,29,31,0.55)", `italic 600 15px ${sans}`, `italic 12px ${sans}`);
          break;
        }
        case "blueprint": {
          ctx.fillStyle = "rgba(8,17,48,0.95)";
          ctx.fillRect(x0, y0, w, h);
          ctx.strokeStyle = "rgba(160,190,255,0.8)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x0 + 0.5, y0 + 0.5, w, h);
          ctx.strokeRect(x0 + 12.5, y0 + 11.5, 36, 36);
          icon(c.icon, x0 + 30, y0 + 29, 18, "#cfe0ff");
          ctx.letterSpacing = "1px";
          text(c.title, c.sub, "#e2ebff", "rgba(170,198,255,0.75)", `11px ${mono}`, `9px ${mono}`);
          ctx.letterSpacing = "0px";
          break;
        }
        case "cyber": {
          const ch = 12;
          ctx.fillStyle = "rgba(14,4,26,0.92)";
          ctx.beginPath();
          ctx.moveTo(x0 + ch, y0);
          ctx.lineTo(x0 + w, y0);
          ctx.lineTo(x0 + w, y0 + h - ch);
          ctx.lineTo(x0 + w - ch, y0 + h);
          ctx.lineTo(x0, y0 + h);
          ctx.lineTo(x0, y0 + ch);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = "#33f0ff";
          ctx.shadowBlur = 14;
          ctx.strokeStyle = "#33f0ff";
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.shadowColor = "transparent";
          ctx.fillStyle = "#ff2bd6";
          ctx.fillRect(x0 + 6, y0 + 14, 3, h - 28);
          icon(c.icon, x0 + 32, y0 + 29, 20, "#33f0ff");
          ctx.letterSpacing = "1.5px";
          text(c.title, c.sub, "#e9fdff", "#ff6fe6", `700 12px ${mono}`, `10px ${mono}`);
          ctx.letterSpacing = "0px";
          break;
        }
        case "pixel": {
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = "#0b0f2a";
          ctx.fillRect(x0, y0, w, h);
          ctx.fillStyle = "#fff";
          ctx.fillRect(x0 + 3, y0, w - 6, 3);
          ctx.fillRect(x0 + 3, y0 + h - 3, w - 6, 3);
          ctx.fillRect(x0, y0 + 3, 3, h - 6);
          ctx.fillRect(x0 + w - 3, y0 + 3, 3, h - 6);
          bitmap(PIX_HEART, x0 + 16, y0 + 17, 4, "#ff4d6d");
          ctx.letterSpacing = "1px";
          text(c.title, c.sub, "#ffffff", "#8fb0ff", `700 13px ${mono}`, `10px ${mono}`);
          ctx.letterSpacing = "0px";
          break;
        }
        case "glitch": {
          const jitter = Math.floor(t * 14) % 3 === 0 ? 3 : 0;
          ctx.fillStyle = "#050505";
          ctx.fillRect(x0, y0, w, h);
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.strokeRect(x0 + 0.5, y0 + 0.5, w, h);
          ctx.globalCompositeOperation = "lighter";
          ctx.letterSpacing = "1px";
          for (const [col, ox] of [["#ff2a4d", -jitter - 1], ["#22e6ff", jitter + 1], ["#ffffff", 0]] as const) {
            ctx.save();
            ctx.translate(ox, 0);
            icon(c.icon, x0 + 30, y0 + 29, 18, col);
            text(c.title, c.sub, col, col === "#ffffff" ? "rgba(255,255,255,0.55)" : col, `700 12px ${mono}`, `10px ${mono}`);
            ctx.restore();
          }
          ctx.letterSpacing = "0px";
          ctx.globalCompositeOperation = "source-over";
          break;
        }
      }
      ctx.restore();
    };

    /** Sembolden çıkan ikonlar (kalp, yorum): sembol üstünde bir noktadan yukarı süzülür */
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
          if (u > 0.8 && Math.floor(u * 30) % 2) continue; // piksel tarzı yanıp sönerek kaybolur
          bitmap(isHeart ? PIX_HEART : PIX_BUBBLE, x, y, cell, isHeart ? "#ff4d6d" : "#ffffff");
        } else {
          ctx.globalAlpha = Math.min(1, u * 5) * (1 - u);
          icon(isHeart ? "heart" : "comment", x, y, 26 * s, isHeart ? "#ff3b5c" : "#ffffff");
          ctx.globalAlpha = 1;
        }
      }
    };

    /* ───────────── Modlar ───────────── */

    const beauty = (angle: number, t: number, p: number) => {
      studio("#060912", "#020203", "rgba(47,107,255,0.16)");
      reflection(angle, assets!.faceBlue, "rgba(2,2,3,1)", 0.16);
      drawSolid(angle, sheenFace(assets!.faceBlue, p, 0.55), extra!.blueSides);
      finish(0.05, t);
      card("beauty", p, t);
    };

    // Eskiz / grunge: koyu masada eğik bir kâğıt; tarama dolgu, "kaynayan" kurşun kalem hatları, yapım çizgileri
    const sketch = (angle: number, t: number, p: number) => {
      studio("#0c0c0d", "#060606", null);
      const { x0, y0, x1, y1 } = region;
      const pw = (x1 - x0) * 0.86, ph = (y1 - y0) * 0.92;
      ctx.save();
      ctx.translate(cx + size * 0.06, cy);
      ctx.rotate(-0.035);
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      ctx.fillStyle = "#ebe6db";
      ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      ctx.shadowColor = "transparent";
      // Lekeler (grunge)
      const r = rng(41);
      for (let i = 0; i < 7; i++) {
        const sx = (r() - 0.5) * pw, sy = (r() - 0.5) * ph, sr = 30 + r() * 90;
        const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        rg.addColorStop(0, `rgba(120,100,70,${0.05 + r() * 0.06})`);
        rg.addColorStop(1, "rgba(120,100,70,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      }
      // Kılavuz çizgiler
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
      // Yapım çizgileri (kalemle)
      const { w, h } = dims();
      const draw = span(p, 0, 0.5);
      ctx.strokeStyle = "rgba(40,40,45,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(w, h) * 0.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * draw);
      ctx.moveTo(cx - w * 0.75, cy);
      ctx.lineTo(cx - w * 0.75 + w * 1.5 * draw, cy);
      ctx.stroke();
      // Tarama dolgu, sonra titreyen hatlar (8 kare/sn "kaynama")
      const view = angle * 0.3;
      drawFlat(extra!.hatch, view, 0, 0, 0.55 + 0.45 * span(p, 0.15, 0.6));
      const boil = rng(Math.floor(t * 8));
      for (let i = 0; i < 3; i++) drawFlat(extra!.pencil, view, (boil() - 0.5) * 3, (boil() - 0.5) * 3, 0.55);
      label("ESKİZ 03 · OX SEMBOL", cx - pw * 0.42, cy + ph * 0.42, "rgba(40,40,45,0.6)", "left", 9);
      finish(0.12, t, 0.45);
      card("sketch", p, t);
    };

    const blueprint = (angle: number, t: number, p: number) => {
      studio("#081130", "#050b1f", null);
      const view = angle * 0.35;
      const { x0, y0, x1, y1 } = region;
      ctx.lineWidth = 1;
      for (let i = 0, x = x0; x <= x1; x += 20, i++) {
        ctx.strokeStyle = i % 5 === 0 ? "rgba(120,160,255,0.1)" : "rgba(120,160,255,0.04)";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y0);
        ctx.lineTo(x + 0.5, y1);
        ctx.stroke();
      }
      for (let i = 0, y = y0; y <= y1; y += 20, i++) {
        ctx.strokeStyle = i % 5 === 0 ? "rgba(120,160,255,0.1)" : "rgba(120,160,255,0.04)";
        ctx.beginPath();
        ctx.moveTo(x0, y + 0.5);
        ctx.lineTo(x1, y + 0.5);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(140,175,255,0.45)";
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1);
      const { w, h } = dims();
      const cos = Math.cos(view);
      drawFlat(assets!.outline, view);
      ctx.strokeStyle = "rgba(140,175,255,0.28)";
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(w * cos, h) * 0.58, 0, Math.PI * 2);
      ctx.moveTo(cx - w * 0.7, cy + 0.5);
      ctx.lineTo(cx + w * 0.7, cy + 0.5);
      ctx.moveTo(cx + 0.5, cy - h * 0.7);
      ctx.lineTo(cx + 0.5, cy + h * 0.7);
      ctx.stroke();
      ctx.setLineDash([]);
      const ww = w * cos;
      ctx.strokeStyle = "rgba(170,198,255,0.75)";
      ctx.beginPath();
      ctx.moveTo(cx - ww / 2, cy + h / 2 + 22);
      ctx.lineTo(cx + ww / 2, cy + h / 2 + 22);
      ctx.moveTo(cx - ww / 2, cy + h / 2 + 18);
      ctx.lineTo(cx - ww / 2, cy + h / 2 + 26);
      ctx.moveTo(cx + ww / 2, cy + h / 2 + 18);
      ctx.lineTo(cx + ww / 2, cy + h / 2 + 26);
      ctx.stroke();
      label(`${Math.round(ww)} PX`, cx, cy + h / 2 + 38, "rgba(190,210,255,0.85)", "center", 9);
      finish(0.05, t);
      card("blueprint", p, t);
    };

    // Cyberpunk: neon güneş, akan ızgara zemin, camgöbeği yüz + eflatun yan
    const cyber = (angle: number, t: number, p: number) => {
      const { x0, x1, y1 } = region;
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#0a0214");
      bg.addColorStop(0.6, "#1a0430");
      bg.addColorStop(1, "#06010c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      const horizon = cy + size * 0.42;
      // Güneş (alt yarısı şeritli)
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
      // Zemin
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
      const bottom = height;
      const phase = (t * 0.8) % 1;
      for (let i = 0; i < 12; i++) {
        const k = (i + phase) / 12;
        const yy = horizon + (bottom - horizon) * k * k;
        ctx.moveTo(x0 - 40, yy);
        ctx.lineTo(x1 + 40, yy);
      }
      for (let i = -14; i <= 14; i++) {
        ctx.moveTo(cx + i * 10, horizon);
        ctx.lineTo(cx + i * 120, bottom);
      }
      ctx.stroke();
      ctx.restore();
      // Ufuk ışığı
      const hg = ctx.createLinearGradient(0, horizon - 2, 0, horizon + 30);
      hg.addColorStop(0, "rgba(255,120,230,0.6)");
      hg.addColorStop(1, "rgba(255,120,230,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(x0 - 40, horizon - 2, x1 - x0 + 80, 32);
      // Sembol: neon hale + katı
      const { w, h } = dims();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.6;
      ctx.filter = "blur(16px)";
      ctx.setTransform(dpr * Math.cos(angle), 0, 0, dpr, dpr * cx, dpr * cy);
      ctx.drawImage(extra!.faceCyan, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, sheenFace(extra!.faceCyan, p, 0.6), extra!.magentaSides);
      label("NEO-İSTANBUL · 2077", region.x0 + 4, region.y0 + 4, "rgba(255,111,230,0.8)");
      finish(0.08, t, 0.5);
      card("cyber", p, t);
    };

    const cloud = (angle: number, t: number, p: number) => {
      studio("#07080b", "#030304", "rgba(47,107,255,0.06)");
      const { w, h, depth, half } = dims();
      const pts = extra!.cloud;
      const zs = extra!.cloudZ;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = `rgba(${190 + b * 15},${205 + b * 12},255,${0.25 + b * 0.22})`;
        const s = 1 + b * 0.35;
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
      corners(cx - w * 0.62, cy - h * 0.62, cx + w * 0.62, cy + h * 0.62, 16, "rgba(255,255,255,0.45)");
      label(`${CLOUD_POINTS} NOKTA · ${deg(angle).toFixed(1)}°`, cx - w * 0.62, cy + h * 0.62 + 18, "rgba(255,255,255,0.45)", "left", 9);
      finish(0.08, t);
      card("cloud", p, t);
    };

    // 8-bit: piksel yıldızlar, bloklardan sembol (kalınlık blok gölgesiyle), adım adım zıplama
    const pixel = (angle: number, t: number, p: number) => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#0b0f2a";
      ctx.fillRect(0, 0, width, height);
      const { x0, y0, x1, y1 } = region;
      const ps = Math.max(4, Math.round(size / extra!.cells.rows));
      const r = rng(5);
      for (let i = 0; i < 46; i++) {
        const sx = Math.round((x0 + r() * (x1 - x0)) / ps) * ps;
        const sy = Math.round((y0 + r() * (y1 - y0)) / ps) * ps;
        const on = (Math.floor(t * 4) + i) % 5 !== 0;
        ctx.fillStyle = on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)";
        ctx.fillRect(sx, sy, ps / 2, ps / 2);
      }
      // Zemin şeridi
      const groundY = Math.round((cy + size * 0.62) / ps) * ps;
      for (let x = Math.floor(x0 / ps) * ps; x < x1; x += ps) {
        ctx.fillStyle = (x / ps) % 2 ? "#1c2a6b" : "#16225a";
        ctx.fillRect(x, groundY, ps, ps);
        ctx.fillStyle = "#0e1640";
        ctx.fillRect(x, groundY + ps, ps, ps * 3);
      }
      const { cols, rows, on } = extra!.cells;
      const bob = Math.floor(t * 3) % 2 ? -ps : 0;
      // Salınım: piksel genişliği adım adım daralır
      const sx = Math.max(0.55, Math.round(Math.cos(angle) * 4) / 4);
      const lx = Math.round((cx - (cols * ps * sx) / 2) / ps) * ps;
      const ly = Math.round((cy - (rows * ps) / 2) / ps) * ps + bob;
      const cw = Math.max(2, Math.round(ps * sx));
      const dir = Math.sin(angle) >= 0 ? 1 : -1;
      const filled = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows && on[j * cols + i] === 1;
      for (let d = 2; d >= 1; d--) {
        ctx.fillStyle = d === 2 ? "#0f1d5c" : "#1a2f8a";
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (filled(i, j)) ctx.fillRect(lx + i * cw + dir * d * (ps / 2), ly + j * ps + d * (ps / 2), cw, ps);
      }
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          if (!filled(i, j)) continue;
          ctx.fillStyle = !filled(i, j - 1) ? "#9fbcff" : !filled(i - 1, j) ? "#6f9bff" : "#3f78ff";
          ctx.fillRect(lx + i * cw, ly + j * ps, cw, ps);
        }
      emit(angle, p, "pixel", 10);
      label("1P · OX DİJİTAL", x0 + 4, y0 + 4, "#8fb0ff");
      ctx.imageSmoothingEnabled = true;
      card("pixel", p, t, 0.3);
    };

    // Glitch art: RGB kayması, kayan dilimler, aşağı akan piksel sıralama izleri
    const glitch = (angle: number, t: number, p: number) => {
      studio("#050505", "#020202", null);
      const view = angle * 0.6;
      const tick = Math.floor(t * 12);
      const r = rng(tick);
      const amt = 4 + (tick % 4 === 0 ? 10 : 0);
      ctx.globalCompositeOperation = "lighter";
      drawFlat(extra!.faceRed, view, -amt, 0, 0.9);
      drawFlat(extra!.faceTeal, view, amt, 0, 0.9);
      ctx.globalCompositeOperation = "source-over";
      drawFlat(extra!.faceWhite, view, 0, 0, 0.85);
      const { h } = dims();
      // Piksel sıralama: logodan aşağı uzayan ince izler
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 0; i < 5; i++) {
        const sx = Math.floor((cx + (r() - 0.5) * size * 0.9) * dpr);
        const sy = Math.floor((cy + (r() - 0.2) * h * 0.5) * dpr);
        const sw = Math.floor((6 + r() * 40) * dpr);
        ctx.globalAlpha = 0.55;
        ctx.drawImage(canvas, sx, sy, sw, 1, sx, sy, sw, Math.floor((40 + r() * 120) * dpr));
      }
      // Kayan dilimler
      ctx.globalAlpha = 1;
      for (let i = 0; i < 7; i++) {
        const y = Math.floor((cy - h / 2 + r() * h) * dpr);
        const bh = Math.floor((3 + r() * 22) * dpr);
        const dx = Math.floor((r() - 0.5) * 70 * dpr);
        ctx.drawImage(canvas, 0, y, canvas.width, bh, dx, y, canvas.width, bh);
      }
      ctx.restore();
      // Tarama çizgileri
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      for (let y = region.y0; y < region.y1; y += 3) ctx.fillRect(region.x0, y, region.x1 - region.x0, 1);
      emit(angle, p, "line", 8);
      label(`REC ● ${String(Math.floor(t % 60)).padStart(2, "0")}:${String(Math.floor((t * 24) % 24)).padStart(2, "0")}`, region.x0 + 4, region.y0 + 4, "rgba(255,80,100,0.9)");
      finish(0.14, t, 0.6);
      card("glitch", p, t, 0.32);
    };

    const tracking = (angle: number, t: number, p: number) => {
      studio("#030304", "#010102", null);
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
      corners(cx - bw - pad, cy - bh - pad, cx + bw + pad, cy + bh + pad, 18, "rgba(255,255,255,0.9)", 1.5);
      label("HEDEF KİTLE KİLİTLENDİ", cx - bw - pad, cy - bh - pad - 12, "rgba(255,255,255,0.85)");
      const pts = assets!.points;
      [431, 1290, 2150].forEach((k, j) => {
        const m = project(pts[k * 2], pts[k * 2 + 1], angle);
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1;
        ctx.strokeRect(m.x - 4.5, m.y - 4.5, 9, 9);
        if (j === 1) {
          ctx.fillStyle = BLUE;
          ctx.fillRect(m.x - 2, m.y - 2, 4, 4);
        }
      });
      finish(0.05, t);
      card("tracking", p, t, 0.34);
    };

    const NODE_NAMES = ["Website", "Panel", "WhatsApp", "Form", "Analitik"];
    const NODE_POS = [
      [-0.98, -0.5],
      [0.98, -0.62],
      [1.04, 0.16],
      [-1.04, 0.5],
      [0.86, 0.84],
    ];
    const nodes = (angle: number, t: number, p: number) => {
      studio("#0d0e12", "#060608", "rgba(255,255,255,0.05)");
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
        ctx.fillStyle = BLUE;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
        ctx.fill();
        const y = ny - bh / 2 + (1 - appear) * 8;
        ctx.fillStyle = "rgba(18,19,24,0.92)";
        ctx.beginPath();
        ctx.roundRect(nx - bw / 2, y, bw, bh, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();
        ctx.font = `600 13px ${sans}`;
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.textAlign = "left";
        ctx.fillText(name, nx - bw / 2 + 14, y + 19);
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.arc(nx - bw / 2 + 17, y + 31, 2.5, 0, Math.PI * 2);
        ctx.fill();
        label("BAĞLI", nx - bw / 2 + 25, y + 34.5, "rgba(255,255,255,0.45)", "left", 9);
        ctx.globalAlpha = 1;
      });
      finish(0.08, t);
      card("nodes", p, t, 0.45);
    };

    const RENDER: Record<Mode, (angle: number, t: number, p: number) => void> = {
      beauty,
      sketch,
      blueprint,
      cyber,
      cloud,
      pixel,
      glitch,
      tracking,
      nodes,
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
      const angle = reduced ? 0.35 : Math.sin(t * 0.55) * 0.6 + tilt * 0.4;
      const mode = SEQUENCE[shot];
      const fr = FRAMING[mode];
      const wide = width >= 1024;
      size = baseSize * fr.scale * (1 + p * 0.04);
      cx = baseX + (wide ? fr.dx : 0) * baseSize;
      cy = baseY + fr.dy * baseSize;
      reset();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.filter = "none";
      RENDER[mode](angle, t, p);
      const since = elapsed % SHOT_MS;
      if (!reduced && elapsed > SHOT_MS && since < 60) {
        reset();
        ctx.fillStyle = `rgba(220,230,255,${0.07 * (1 - since / 60)})`;
        ctx.fillRect(0, 0, width, height);
      }
    };

    let frame = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const run = () => {
      if (!frame && !reduced && assets) frame = requestAnimationFrame(loop);
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

      // Eskiz: çapraz tarama dolgu (yalnız logonun içinde) ve grafit hatlar
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
      const pencil = tintFrom(a.outline, "#232327");

      // 8-bit: logonun kaba piksel ızgarası
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

      extra = {
        blueSides: ramp(["#2a5fe6", "#2150c8", "#1a42a8", "#14348a", "#0f286c", "#0a1d50"]),
        graySides: ramp(["#b9bfcb", "#9ba2b0", "#808797", "#676e7d", "#4f5563", "#3a3f4b"]),
        glowSides: ramp(["#8fb0ff", "#6a93ff", "#4f7dff", "#3a68f0", "#2b55d6", "#2045b8"]),
        magentaSides: ramp(["#ff3fdc", "#d81fb8", "#ac1a93", "#80146f", "#56104c", "#330a2e"]),
        faceCyan: tintFrom(mask, "#62f3ff"),
        faceRed: tintFrom(mask, "#ff2a4d"),
        faceTeal: tintFrom(mask, "#22e6ff"),
        faceWhite: tintFrom(mask, "#f2f2f2"),
        hatch,
        pencil,
        sheen,
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
      cancelAnimationFrame(frame);
      frame = 0;
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
