"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildAssets, type Assets } from "./brand-film";
import { rng, sampleImage } from "./shape-sampler";

// Hero sahnesi "Referans+": Referans'ın (brand-film.tsx, olduğu gibi duruyor) premium hâli. Aynı fikir: tek OX nesnesi,
// sert kesmelerle değişen görüntüleme modları. Farklar:
//   · Sembol tam tur dönmez, ±35° salınır: arka yüz (ters "xo") hiç görünmez. Yan yüz derinliğe göre gölgelenir,
//     ön yüzde ışık süzülür, altında zemin yansıması var.
//   · Her kesme farklı kadraj (geniş / orta / yakın), çekim içinde yavaş yaklaşma. Kesmeler temiz (bant bozulması yok).
//   · Etiketler tek tipografik düzende, az ve gerçek (ekrandaki ölçü, açı, nokta sayısı); sahte veri kutuları yok.
//   · Ağ modunda kutular gerçek parçalar: Website, Panel, WhatsApp, Form, Analitik → hepsi tek yere (OX) akar.
// Kayan kelime moda göre değişir (onWord). Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta sabit kare.

type Mode = "beauty" | "nodes" | "tracking" | "blueprint" | "cloud";
const SEQUENCE: Mode[] = ["beauty", "nodes", "tracking", "blueprint", "cloud"];
/** Sol başlıkta moda eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const FILM_PLUS_WORDS = ["sonuç", "Yazılım", "Reklam", "Marka", "Website"];

const SHOT_MS = 1800;
const LAYERS = 40;
const CAMERA = 1500;
const CLOUD_POINTS = 5200;
const BLUE = "#2f6bff";

/** Mod başına kadraj: ölçek, merkez kayması (logo boyu cinsinden) */
const FRAMING: Record<Mode, { scale: number; dx: number; dy: number }> = {
  beauty: { scale: 1, dx: 0, dy: -0.04 },
  nodes: { scale: 0.74, dx: 0, dy: -0.02 },
  tracking: { scale: 1.32, dx: -0.06, dy: 0.04 },
  blueprint: { scale: 0.86, dx: 0, dy: 0 },
  cloud: { scale: 1.08, dx: 0.04, dy: -0.02 },
};

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

type Extra = {
  blueSides: HTMLCanvasElement[];
  graySides: HTMLCanvasElement[];
  glowSides: HTMLCanvasElement[];
  sheen: HTMLCanvasElement;
  cloud: Float32Array;
  cloudZ: Float32Array;
};

export function BrandFilmPlus({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
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

    // Film greni
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
    let baseX = 0, baseY = 0, baseSize = 1; // kadrajsız merkez ve logo boyu
    let cx = 0, cy = 0, size = 1; // o anki kadraj
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
    /** Tek tip etiket: mono, büyük harf, aralıklı */
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

    /** Ön yüzde süzülen ışık: yüzün kopyasına eğik bir parlak bant (yalnız logonun üstünde) */
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

    /** 3B sembol: katmanlar uzaktan yakına; yan yüz arkaya doğru koyulaşır */
    const drawSolid = (angle: number, face: HTMLCanvasElement, sides: HTMLCanvasElement[], alpha = 1) => {
      const { w, h, depth } = dims();
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const layers: { k: number; z: number; zr: number }[] = [];
      for (let k = 0; k < LAYERS; k++) {
        const z = (k / (LAYERS - 1) - 0.5) * depth; // k=0 ön yüz
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

    /** Zemin yansıması: ters çevrilmiş yüz, aşağı doğru zeminde kaybolur */
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

    /** Stüdyo zemini: dikey ton, arkada yumuşak ışık, kenarlarda kararma */
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

    const finish = (grainAlpha: number, t: number) => {
      // Kenar kararması (sahne bölgesine göre)
      const r = Math.max(width, height) * 0.75;
      const v = ctx.createRadialGradient(baseX, baseY, r * 0.35, baseX, baseY, r);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
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

    // Köşe işaretleri (bir kutunun dört köşesi)
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
    const signedDeg = (a: number) => (a * 180) / Math.PI;

    // --- Modlar ---

    const beauty = (angle: number, t: number, p: number) => {
      studio("#060912", "#020203", "rgba(47,107,255,0.16)");
      const face = sheenFace(assets!.faceBlue, p, 0.55);
      reflection(angle, assets!.faceBlue, "rgba(2,2,3,1)", 0.16);
      drawSolid(angle, face, extra!.blueSides);
      finish(0.05, t);
    };

    const NODE_NAMES = ["Website", "Panel", "WhatsApp", "Form", "Analitik"];
    const NODE_POS = [
      [-0.98, -0.62],
      [0.98, -0.7],
      [1.04, 0.12],
      [-1.04, 0.5],
      [0.86, 0.82],
    ];
    const nodes = (angle: number, t: number, p: number) => {
      studio("#0d0e12", "#060608", "rgba(255,255,255,0.05)");
      const face = sheenFace(assets!.faceGray, p, 0.7);
      reflection(angle, assets!.faceGray, "rgba(6,6,8,1)", 0.1);
      drawSolid(angle, face, extra!.graySides);
      const pts = assets!.points;
      const rx = (region.x1 - region.x0) / 2;
      const ry = (region.y1 - region.y0) / 2;
      NODE_NAMES.forEach((name, i) => {
        const appear = Math.min(1, Math.max(0, (p - i * 0.06) / 0.25));
        if (appear <= 0) return;
        const [nx0, ny0] = NODE_POS[i];
        const nx = baseX + nx0 * rx * 0.78;
        const ny = baseY + ny0 * ry * 0.78;
        const bw = 128, bh = 44;
        const left = nx0 < 0;
        const ax = left ? nx + bw / 2 : nx - bw / 2;
        const target = project(pts[(i * 517) % 2600 * 2] * 0.85, pts[((i * 517) % 2600) * 2 + 1] * 0.85, angle);
        // Bağlantı ve üzerinde akan nokta
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
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(target.x, target.y, 2, 0, Math.PI * 2);
        ctx.fill();
        // Kart
        const y = ny - bh / 2 + (1 - appear) * 8;
        ctx.fillStyle = "rgba(18,19,24,0.92)";
        ctx.beginPath();
        ctx.roundRect(nx - bw / 2, y, bw, bh, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();
        ctx.font = `600 13px ${sans}`;
        ctx.letterSpacing = "-0.2px";
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.textAlign = "left";
        ctx.fillText(name, nx - bw / 2 + 14, y + 19);
        ctx.letterSpacing = "0px";
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.arc(nx - bw / 2 + 17, y + 31, 2.5, 0, Math.PI * 2);
        ctx.fill();
        label("BAĞLI", nx - bw / 2 + 25, y + 34.5, "rgba(255,255,255,0.45)", "left", 9);
        ctx.globalAlpha = 1;
      });
      label("TEK SİSTEM · TEK GELEN KUTUSU", region.x0 + 4, region.y0 + 4, "rgba(255,255,255,0.5)");
      finish(0.08, t);
    };

    const tracking = (angle: number, t: number, p: number) => {
      studio("#030304", "#010102", null);
      const { w, h, depth } = dims();
      // Yumuşak hale (neon değil): yüzün geniş bulanık kopyası
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

      // Hedef kutusu: logonun ekrandaki gerçek sınırları
      const bw = (w * Math.abs(cos) + depth * Math.abs(Math.sin(angle))) / 2 + 22;
      const bh = h / 2 + 22;
      const lock = Math.min(1, p / 0.3);
      const pad = (1 - lock) ** 2 * 40; // kutu dışarıdan içeri kilitlenir
      corners(cx - bw - pad, cy - bh - pad, cx + bw + pad, cy + bh + pad, 18, "rgba(255,255,255,0.9)", 1.5);
      label(`HEDEF KİLİTLENDİ`, cx - bw - pad, cy - bh - pad - 12, "rgba(255,255,255,0.85)");
      label(`${Math.round(bw * 2)} × ${Math.round(bh * 2)} PX`, cx + bw + pad, cy - bh - pad - 12, "rgba(255,255,255,0.45)", "right");
      // Üç takip noktası, konumları gerçek
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
        label(`${Math.round(m.x)}, ${Math.round(m.y)}`, m.x + 12, m.y + 3.5, "rgba(255,255,255,0.7)", "left", 9);
      });
      finish(0.05, t);
    };

    const blueprint = (angle: number, t: number) => {
      studio("#081130", "#050b1f", null);
      const view = angle * 0.35;
      const { x0, y0, x1, y1 } = region;
      // İnce ızgara (çok soluk), her 5. çizgi biraz belirgin
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

      // Dış hat
      const { w, h } = dims();
      const cos = Math.cos(view);
      ctx.setTransform(dpr * cos, 0, 0, dpr, dpr * cx, dpr * cy);
      ctx.drawImage(assets!.outline, -w / 2, -h / 2, w, h);
      reset();

      // Yapım dairesi ve eksenler
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

      // Ölçü çizgileri: ekrandaki gerçek genişlik ve yükseklik
      const ww = w * cos;
      const dimLine = (ax: number, ay: number, bx: number, by: number, text: string, vertical: boolean) => {
        ctx.strokeStyle = "rgba(170,198,255,0.75)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        for (const [px, py] of [[ax, ay], [bx, by]]) {
          if (vertical) {
            ctx.moveTo(px - 4, py);
            ctx.lineTo(px + 4, py);
          } else {
            ctx.moveTo(px, py - 4);
            ctx.lineTo(px, py + 4);
          }
        }
        ctx.stroke();
        if (vertical) {
          ctx.save();
          ctx.translate(ax - 10, (ay + by) / 2);
          ctx.rotate(-Math.PI / 2);
          label(text, 0, 0, "rgba(190,210,255,0.85)", "center", 9);
          ctx.restore();
        } else label(text, (ax + bx) / 2, ay - 8, "rgba(190,210,255,0.85)", "center", 9);
      };
      dimLine(cx - ww / 2, cy - h / 2 - 22, cx + ww / 2, cy - h / 2 - 22, `${Math.round(ww)} PX`, false);
      dimLine(cx - ww / 2 - 22, cy - h / 2, cx - ww / 2 - 22, cy + h / 2, `${Math.round(h)} PX`, true);

      // Başlık bloğu
      const tb = { w: 210, h: 54 };
      const tx = x1 - tb.w - 16, ty = y1 - tb.h - 16;
      ctx.strokeStyle = "rgba(140,175,255,0.55)";
      ctx.strokeRect(tx + 0.5, ty + 0.5, tb.w, tb.h);
      ctx.beginPath();
      ctx.moveTo(tx, ty + 26.5);
      ctx.lineTo(tx + tb.w, ty + 26.5);
      ctx.stroke();
      label("OX DİJİTAL · SEMBOL", tx + 10, ty + 17, "rgba(225,234,255,0.95)");
      label(`MARKA KİMLİĞİ   ${signedDeg(view).toFixed(1)}°`, tx + 10, ty + 43, "rgba(170,198,255,0.7)", "left", 9);
      finish(0.05, t);
    };

    const cloud = (angle: number, t: number) => {
      studio("#07080b", "#030304", "rgba(47,107,255,0.06)");
      const { w, h, depth, half } = dims();
      const pts = extra!.cloud;
      const zs = extra!.cloudZ;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      // Derinliğe göre parlaklık: yakın noktalar parlak ve iri
      const buckets = 4;
      for (let b = 0; b < buckets; b++) {
        ctx.fillStyle = `rgba(${190 + b * 15},${205 + b * 12},255,${0.25 + b * 0.22})`;
        const s = 1 + b * 0.35;
        for (let i = 0; i < CLOUD_POINTS; i++) {
          const z = zs[i] * depth * 0.5;
          const X = pts[i * 2] * half;
          const xr = X * cos + z * sin;
          const zr = -X * sin + z * cos;
          const near = Math.min(buckets - 1, Math.max(0, Math.floor(((-zr / (half * 0.6)) * 0.5 + 0.5) * buckets)));
          if (near !== b) continue;
          const f = CAMERA / (CAMERA + zr);
          ctx.fillRect(cx + xr * f - s / 2, cy + pts[i * 2 + 1] * half * f - s / 2, s, s);
        }
      }
      // Kutu: yalnız köşelerde kısa çizgiler (tam tel kafes değil)
      const cs: [number, number][] = [];
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const X = (sx * w) / 2 + sx * 20;
        const Y = (sy * h) / 2 + sy * 20;
        const z = (sz * depth) / 2 + sz * 20;
        const xr = X * cos + z * sin;
        const zr = -X * sin + z * cos;
        const f = CAMERA / (CAMERA + zr);
        cs.push([cx + xr * f, cy + Y * f]);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < 8; a++)
        for (let b = a + 1; b < 8; b++) {
          const diff = a ^ b;
          if (diff !== 1 && diff !== 2 && diff !== 4) continue;
          const [ax, ay] = cs[a], [bx, by] = cs[b];
          for (const k of [0, 0.82]) {
            ctx.moveTo(ax + (bx - ax) * k, ay + (by - ay) * k);
            ctx.lineTo(ax + (bx - ax) * (k + 0.18), ay + (by - ay) * (k + 0.18));
          }
        }
      ctx.stroke();
      label("NOKTA BULUTU", region.x0 + 4, region.y0 + 4, "rgba(255,255,255,0.75)");
      label(`${CLOUD_POINTS} NOKTA · ${deg(angle).toFixed(1)}°`, region.x0 + 4, region.y0 + 20, "rgba(255,255,255,0.45)", "left", 9);
      finish(0.08, t);
    };

    const RENDER: Record<Mode, (angle: number, t: number, p: number) => void> = { beauty, nodes, tracking, blueprint, cloud };

    // Geliştirmede tek modu kilitlemek için: localStorage "ox-film-sekans" = 0–4
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
      const p = reduced ? 0.5 : (elapsed % SHOT_MS) / SHOT_MS;
      const target = pointer ? ((pointer.x - baseX) / width) * 0.8 : 0;
      tilt += (target - tilt) * 0.05;
      const t = elapsed / 1000;
      // Salınım: ±35°, hiç arkaya dönmez
      const angle = reduced ? 0.35 : Math.sin(t * 0.55) * 0.6 + tilt * 0.4;
      const mode = SEQUENCE[shot];
      const fr = FRAMING[mode];
      const push = 1 + p * 0.045; // çekim içinde yavaş yaklaşma
      size = baseSize * fr.scale * push;
      cx = baseX + fr.dx * baseSize;
      cy = baseY + fr.dy * baseSize;
      reset();
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
      RENDER[mode](angle, t, p);
      // Temiz kesme: ilk iki karede çok kısa bir pozlama parlaması
      const since = elapsed % SHOT_MS;
      if (!reduced && elapsed > SHOT_MS && since < 60) {
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
      extra = {
        blueSides: ramp(["#2a5fe6", "#2150c8", "#1a42a8", "#14348a", "#0f286c", "#0a1d50"]),
        graySides: ramp(["#b9bfcb", "#9ba2b0", "#808797", "#676e7d", "#4f5563", "#3a3f4b"]),
        glowSides: ramp(["#8fb0ff", "#6a93ff", "#4f7dff", "#3a68f0", "#2b55d6", "#2045b8"]),
        sheen,
        cloud: sampleImage(logo, CLOUD_POINTS, 5),
        cloudZ,
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
