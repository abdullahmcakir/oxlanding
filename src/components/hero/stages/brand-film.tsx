"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { rng, sampleImage } from "./shape-sampler";

// Hero sahnesi "Marka filmi" (site sahibinin verdiği referans videoya göre): dönen 3B OX sembolü, ~1,5 sn'de bir sert
// kesmeyle farklı bir "görüntüleme moduna" geçer; dönüş kesmeler boyunca sürer (aynı nesne, farklı bakış):
//   güzel çekim (mavi, hareket bulanıklığı) → veri ağı (gri metal + veri kutuları ve bağlantılar) →
//   takip (parlayan logo, köşe işaretleri, koordinatlar) → teknik çizim (lacivert ızgara, dış hat, başlık bloğu) →
//   nokta bulutu (noktalardan logo, 3B kutu) → yeniden güzel çekim.
// Modlar hizmetlerle eşleşir; kayan kelime moda göre değişir (onWord). Etiketlerdeki değerler gerçektir
// (ekran koordinatı, dönüş açısı, nokta sayısı); iş rakamı ya da vaat yok.
// 3B logo kütüphanesiz: mavi boyanmış logo katmanları derinlik boyunca perspektifle üst üste dizilir.
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta güzel çekim sabit çizilir.

type Mode = "beauty" | "nodes" | "tracking" | "blueprint" | "cloud";
const SEQUENCE: Mode[] = ["beauty", "nodes", "tracking", "blueprint", "cloud"];
/** Sol başlıkta moda eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const FILM_WORDS = ["sonuç", "Yazılım", "Reklam", "Marka", "Website"];

const SHOT_MS = 1500; // bir modun ekranda kalma süresi
const GLITCH_MS = 110; // kesme anındaki bozulma
const LAYERS = 24; // 3B kalınlık için üst üste dizilen katman sayısı
const POINTS = 2600; // nokta bulutu
const CAMERA = 1400; // perspektif uzaklığı (px)
const SPIN = 0.85; // dönüş hızı (rad/sn)

const BLUE = "#2f6bff";

export type Assets = {
  w: number; // kırpılmış logonun en/boy oranı için kaynak ölçüleri
  h: number;
  faceBlue: HTMLCanvasElement;
  sideBlue: HTMLCanvasElement;
  faceGray: HTMLCanvasElement;
  sideGray: HTMLCanvasElement;
  faceGlow: HTMLCanvasElement;
  sideGlow: HTMLCanvasElement;
  outline: HTMLCanvasElement;
  points: Float32Array;
};

/** Logoyu kırpar (saydam kenarlar atılır) ve her mod için boyanmış kopyalarını hazırlar */
export function buildAssets(logo: HTMLImageElement): Assets {
  const L = 640;
  const base = document.createElement("canvas");
  base.width = base.height = L;
  const bctx = base.getContext("2d", { willReadFrequently: true })!;
  const scale = Math.min(L / logo.naturalWidth, L / logo.naturalHeight) * 0.9;
  bctx.drawImage(logo, (L - logo.naturalWidth * scale) / 2, (L - logo.naturalHeight * scale) / 2, logo.naturalWidth * scale, logo.naturalHeight * scale);
  const data = bctx.getImageData(0, 0, L, L).data;
  let minX = L, minY = L, maxX = 0, maxY = 0;
  for (let y = 0; y < L; y++)
    for (let x = 0; x < L; x++)
      if (data[(y * L + x) * 4 + 3] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const pad = 6;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  mask.getContext("2d")!.drawImage(base, minX - pad, minY - pad, w, h, 0, 0, w, h);

  const tint = (color: string) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d")!;
    x.drawImage(mask, 0, 0);
    x.globalCompositeOperation = "source-in";
    x.fillStyle = color;
    x.fillRect(0, 0, w, h);
    return c;
  };

  // Teknik çizim için dış hat: kenara doğru kaydırılmış kopyalardan iç kısım çıkarılır
  const outline = document.createElement("canvas");
  outline.width = w;
  outline.height = h;
  const o = outline.getContext("2d")!;
  const line = tint("#5a8dff");
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    o.drawImage(line, Math.cos(a) * 1.8, Math.sin(a) * 1.8);
  }
  o.globalCompositeOperation = "destination-out";
  o.drawImage(mask, 0, 0);

  return {
    w,
    h,
    faceBlue: tint("#3f7cff"),
    sideBlue: tint("#14348f"),
    faceGray: tint("#eceff4"),
    sideGray: tint("#6e7584"),
    faceGlow: tint("#e6eeff"),
    sideGlow: tint("#3f72ff"),
    outline,
    points: sampleImage(logo, POINTS, 5),
  };
}

export function BrandFilm({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
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

    // Film greni: küçük bir gürültü dokusu, her karede farklı kaydırılarak serilir
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

    // Veri ağı kutularının içerikleri (sabit, tohumlu)
    const nodeRand = rng(21);
    const NODES = Array.from({ length: 11 }, (_, i) => ({
      angle: (i / 11) * Math.PI * 2 + nodeRand() * 0.4,
      radius: 0.95 + nodeRand() * 0.45,
      rows: 3 + Math.floor(nodeRand() * 5),
      seed: nodeRand(),
    }));

    let assets: Assets | null = null;
    let width = 0, height = 0, dpr = 1;
    let cx = 0, cy = 0, size = 1; // logo merkezi ve yüksekliği (px)
    let region = { x0: 0, y0: 0, x1: 0, y1: 0 }; // sahnenin kullandığı alan
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
        ? { x0: width * 0.46, y0: 100, x1: width - width * 0.045, y1: height - 130 }
        : { x0: 16, y0: 96, x1: width - 16, y1: Math.max(320, height * 0.46) };
      cx = (region.x0 + region.x1) / 2;
      cy = (region.y0 + region.y1) / 2;
      size = Math.min(region.x1 - region.x0, region.y1 - region.y0) * (wide ? 0.5 : 0.56);
    };

    const reset = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const text = (s: string, x: number, y: number, px = 9, color = "rgba(255,255,255,0.7)", align: CanvasTextAlign = "left") => {
      ctx.font = `${px}px ${mono}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(s, x, y);
    };

    /** Logo ölçüleri (ekranda) ve derinlik */
    const dims = () => {
      const a = assets!;
      const h = size;
      const w = (size * a.w) / a.h;
      return { w, h, depth: Math.max(w, h) * 0.13, half: Math.max(w, h) / 2 };
    };

    /** 3B logo: katmanlar uzaktan yakına çizilir; en öndeki katman yüz, diğerleri yan yüz rengi */
    const drawSolid = (angle: number, face: HTMLCanvasElement, side: HTMLCanvasElement, alpha = 1) => {
      const { w, h, depth } = dims();
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const layers: { zr: number; z: number }[] = [];
      for (let i = 0; i < LAYERS; i++) {
        const z = (i / (LAYERS - 1) - 0.5) * depth;
        layers.push({ z, zr: z * cos });
      }
      layers.sort((p, q) => q.zr - p.zr);
      ctx.globalAlpha = alpha;
      layers.forEach((l, i) => {
        const f = CAMERA / (CAMERA + l.zr);
        const x = cx + l.z * sin * f;
        ctx.setTransform(dpr * cos * f, 0, 0, dpr * f, dpr * x, dpr * cy);
        ctx.drawImage(i === layers.length - 1 ? face : side, -w / 2, -h / 2, w, h);
      });
      ctx.globalAlpha = 1;
      reset();
    };

    /** Logo üstündeki bir noktanın (örneklenmiş, [-1,1]) ön yüzdeki ekran konumu */
    const project = (px: number, py: number, angle: number) => {
      const { half, depth } = dims();
      const z = -depth / 2;
      const X = px * half;
      const xr = X * Math.cos(angle) + z * Math.sin(angle);
      const zr = -X * Math.sin(angle) + z * Math.cos(angle);
      const f = CAMERA / (CAMERA + zr);
      return { x: cx + xr * f, y: cy + py * half * f };
    };

    const grainPass = (alpha: number, t: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = "overlay";
      ctx.translate((t * 9301) % 160, (t * 4973) % 160);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(-160, -160, width + 320, height + 320);
      ctx.restore();
    };

    const background = (color: string, glow: string | null) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      if (glow) {
        const r = size * 1.5;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, glow);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    };

    // --- Modlar ---

    const beauty = (angle: number, t: number) => {
      background("#030407", "rgba(47,107,255,0.12)");
      // Hareket bulanıklığı: bir önceki açıdan soluk bir kopya
      if (!reduced) {
        ctx.filter = "blur(2px)";
        drawSolid(angle - 0.09, assets!.faceBlue, assets!.sideBlue, 0.45);
        ctx.filter = "none";
      }
      drawSolid(angle, assets!.faceBlue, assets!.sideBlue);
      grainPass(0.06, t);
    };

    const nodes = (angle: number, t: number) => {
      background("#0b0c10", null);
      // Perspektif zemin ızgarası
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      const horizon = cy - size * 0.2;
      for (let i = 1; i < 14; i++) {
        const y = horizon + (height - horizon) * (i / 14) ** 1.8;
        ctx.beginPath();
        ctx.moveTo(region.x0 - 200, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 18, horizon);
        ctx.lineTo(cx + i * 160, height);
        ctx.stroke();
      }
      drawSolid(angle, assets!.faceGray, assets!.sideGray);

      // Veri kutuları ve bağlantıları
      const rx = (region.x1 - region.x0) * 0.42;
      const ry = (region.y1 - region.y0) * 0.42;
      ctx.lineWidth = 1;
      NODES.forEach((n, i) => {
        const a = n.angle + Math.sin(t * 0.4 + i) * 0.05;
        const nx = cx + Math.cos(a) * rx * n.radius;
        const ny = cy + Math.sin(a) * ry * n.radius;
        const p = project(((i * 0.37) % 1) * 1.6 - 0.8, ((i * 0.61) % 1) * 1.6 - 0.8, angle);
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.bezierCurveTo(nx + (cx - nx) * 0.2, ny - 60, p.x + (nx - p.x) * 0.3, p.y + 40, p.x, p.y);
        ctx.stroke();
        // Kutu
        const bw = 52, bh = 10 + n.rows * 7;
        ctx.fillStyle = "rgba(10,14,30,0.75)";
        ctx.fillRect(nx - bw / 2, ny - bh / 2, bw, bh);
        ctx.strokeStyle = "rgba(47,107,255,0.75)";
        ctx.strokeRect(nx - bw / 2 + 0.5, ny - bh / 2 + 0.5, bw - 1, bh - 1);
        for (let r = 0; r < n.rows; r++) {
          const v = Math.floor((n.seed * 9973 + r * 131 + Math.floor(t * 4) * 7) % 999);
          text(`${String.fromCharCode(97 + ((r + i) % 6))}: ${v}`, nx - bw / 2 + 4, ny - bh / 2 + 10 + r * 7, 6, "rgba(220,228,255,0.65)");
        }
        text(`x: ${Math.round(nx)} y: ${Math.round(ny)}`, nx - bw / 2, ny + bh / 2 + 9, 7, "rgba(255,255,255,0.5)");
      });
      text("nesne: 00 · ox sembol · ağ", cx - size * 0.45, cy - size * 0.62, 8, "rgba(255,255,255,0.75)");
      grainPass(0.16, t);
    };

    const tracking = (angle: number, t: number) => {
      background("#020203", null);
      // Parlama: ön yüzün bulanık kopyası, sonra katı logo
      const { w, h, depth } = dims();
      const cos = Math.cos(angle);
      const zf = (-depth / 2) * cos;
      const f = CAMERA / (CAMERA + zf);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(18px)";
      ctx.setTransform(dpr * cos * f, 0, 0, dpr * f, dpr * (cx + (-depth / 2) * Math.sin(angle) * f), dpr * cy);
      ctx.drawImage(assets!.sideGlow, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, assets!.faceGlow, assets!.sideGlow);

      // Takip noktaları ve koordinatlar (değerler ekrandaki gerçek konum)
      const pts = assets!.points;
      const marks = [0, 1, 2, 3, 4, 5].map((k) => project(pts[k * 431 * 2], pts[k * 431 * 2 + 1], angle));
      ctx.lineWidth = 1;
      marks.forEach((m, k) => {
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.strokeRect(m.x - 4, m.y - 4, 8, 8);
        if (k % 2 === 0) {
          ctx.fillStyle = BLUE;
          ctx.fillRect(m.x + 8, m.y - 12, 7, 7);
        }
        text(`x: ${Math.round(m.x)} y: ${Math.round(m.y)}`, m.x + 10, m.y + 3, 8, "rgba(255,255,255,0.85)");
      });
      // Kenarlara uzanan ince çizgiler
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.moveTo(marks[0].x, marks[0].y);
      ctx.lineTo(cx + (region.x1 - cx) * 0.2, region.y0 - 60);
      ctx.moveTo(marks[3].x, marks[3].y);
      ctx.lineTo(region.x0 - 40, region.y1 + 40);
      ctx.moveTo(marks[5].x, marks[5].y);
      ctx.lineTo(region.x1 + 40, cy + size * 0.1);
      ctx.stroke();
      // Köşe işaretleri: logonun ekrandaki kutusu
      const bw = (w * Math.abs(cos) + depth * Math.abs(Math.sin(angle))) / 2 + 14;
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
      grainPass(0.05, t);
    };

    const blueprint = (angle: number, t: number) => {
      background("#060b1c", null);
      // Teknik çizimde sembol öne bakar, yalnız hafifçe sallanır (yandan ince bir şerit gibi okunmasın)
      const view = Math.sin(angle) * 0.45;
      const { x0, y0, x1, y1 } = region;
      // Izgara
      ctx.lineWidth = 1;
      for (let x = x0; x <= x1; x += 16) {
        ctx.strokeStyle = (x - x0) % 80 === 0 ? "rgba(47,107,255,0.16)" : "rgba(47,107,255,0.07)";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y0);
        ctx.lineTo(x + 0.5, y1);
        ctx.stroke();
      }
      for (let y = y0; y <= y1; y += 16) {
        ctx.strokeStyle = (y - y0) % 80 === 0 ? "rgba(47,107,255,0.16)" : "rgba(47,107,255,0.07)";
        ctx.beginPath();
        ctx.moveTo(x0, y + 0.5);
        ctx.lineTo(x1, y + 0.5);
        ctx.stroke();
      }
      // Çerçeve (çift çizgi)
      ctx.strokeStyle = "rgba(90,141,255,0.7)";
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1);
      ctx.strokeStyle = "rgba(90,141,255,0.35)";
      ctx.strokeRect(x0 + 6.5, y0 + 6.5, x1 - x0 - 13, y1 - y0 - 13);

      // Logo dış hattı (düz düzlem, dönüşle daralır)
      const { w, h } = dims();
      const cos = Math.cos(view);
      ctx.setTransform(dpr * cos, 0, 0, dpr, dpr * cx, dpr * cy);
      ctx.drawImage(assets!.outline, -w / 2, -h / 2, w, h);
      reset();

      // Ölçü işaretleri
      const pts = assets!.points;
      const labels = ["R 24.00", "Y 36.00", "X 52.00"];
      [3, 11, 19].forEach((k, j) => {
        const p = project(pts[k * 97 * 2], pts[k * 97 * 2 + 1], view);
        ctx.strokeStyle = "rgba(160,190,255,0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.stroke();
        const lx = p.x + (j % 2 ? -50 : 46);
        const ly = p.y + (j === 1 ? -34 : 30);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(lx, ly);
        ctx.stroke();
        text(labels[j], lx + (j % 2 ? -4 : 4), ly + 3, 8, "rgba(170,198,255,0.9)", j % 2 ? "right" : "left");
      });

      // Sol üst: küçük görünüş
      const ib = { x: x0 + 18, y: y0 + 18, w: 92, h: 70 };
      ctx.strokeStyle = "rgba(90,141,255,0.6)";
      ctx.strokeRect(ib.x + 0.5, ib.y + 0.5, ib.w, ib.h);
      const iw = (ib.h - 22) * (assets!.w / assets!.h);
      ctx.drawImage(assets!.outline, ib.x + (ib.w - iw) / 2, ib.y + 8, iw, ib.h - 22);
      text("ÖN", ib.x + ib.w / 2, ib.y + ib.h - 4, 7, "rgba(170,198,255,0.8)", "center");

      // Sağ üst: canlı açı
      const deg = ((((angle * 180) / Math.PI) % 360) + 360) % 360;
      text(`DÖNÜŞ ${deg.toFixed(1)}°`, x1 - 18, y0 + 26, 8, "rgba(170,198,255,0.85)", "right");

      // Sağ alt: başlık bloğu
      const tb = { w: 220, h: 62 };
      const tx = x1 - tb.w - 14, ty = y1 - tb.h - 14;
      ctx.strokeStyle = "rgba(90,141,255,0.7)";
      ctx.strokeRect(tx + 0.5, ty + 0.5, tb.w, tb.h);
      ctx.beginPath();
      ctx.moveTo(tx, ty + 24.5);
      ctx.lineTo(tx + tb.w, ty + 24.5);
      ctx.moveTo(tx + tb.w / 2 + 0.5, ty + 24);
      ctx.lineTo(tx + tb.w / 2 + 0.5, ty + tb.h);
      ctx.stroke();
      text("OX DİJİTAL : SEMBOL", tx + 8, ty + 16, 9, "rgba(220,230,255,0.95)");
      text("ÖLÇEK 1:1", tx + 8, ty + 40, 7, "rgba(170,198,255,0.8)");
      text("PAFTA 01", tx + 8, ty + 52, 7, "rgba(170,198,255,0.8)");
      text("MARKA KİMLİĞİ", tx + tb.w / 2 + 8, ty + 40, 7, "rgba(170,198,255,0.8)");
      text("İSTANBUL", tx + tb.w / 2 + 8, ty + 52, 7, "rgba(170,198,255,0.8)");
      grainPass(0.05, t);
    };

    const cloud = (angle: number, t: number) => {
      background("#08090c", "rgba(47,107,255,0.05)");
      const { w, h, depth, half } = dims();
      const pts = assets!.points;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      ctx.fillStyle = "rgba(200,216,255,0.75)";
      for (let i = 0; i < POINTS; i++) {
        const X = pts[i * 2] * half;
        const Y = pts[i * 2 + 1] * half;
        const z = ((i % 3) - 1) * (depth / 2);
        const xr = X * cos + z * sin;
        const zr = -X * sin + z * cos;
        const f = CAMERA / (CAMERA + zr);
        ctx.fillRect(cx + xr * f, cy + Y * f, 1.4, 1.4);
      }
      // Tel kafes kutu
      const corners: [number, number][] = [];
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const X = (sx * w) / 2 + sx * 18;
        const Y = (sy * h) / 2 + sy * 18;
        const z = (sz * depth) / 2 + sz * 18;
        const xr = X * cos + z * sin;
        const zr = -X * sin + z * cos;
        const f = CAMERA / (CAMERA + zr);
        corners.push([cx + xr * f, cy + Y * f]);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < 8; a++)
        for (let b = a + 1; b < 8; b++) {
          const diff = a ^ b;
          if (diff === 1 || diff === 2 || diff === 4) {
            ctx.moveTo(corners[a][0], corners[a][1]);
            ctx.lineTo(corners[b][0], corners[b][1]);
          }
        }
      ctx.stroke();
      // Sol üst bilgiler
      const lx = region.x0 + 14, ly = region.y0 + 20;
      const deg = ((((angle * 180) / Math.PI) % 360) + 360) % 360;
      ["NOKTA BULUTU", `NOKTA     ${POINTS}`, `DÖNÜŞ     ${deg.toFixed(1)}°`, "MOD       TEL KAFES"].forEach((s, i) =>
        text(s, lx, ly + i * 12, 8, i ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.85)"),
      );
      // Sağ alt ölçek çubuğu
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(region.x1 - 150, region.y1 - 20.5);
      ctx.lineTo(region.x1 - 20, region.y1 - 20.5);
      ctx.stroke();
      text("0.0", region.x1 - 150, region.y1 - 8, 7, "rgba(255,255,255,0.45)");
      text("10.0", region.x1 - 20, region.y1 - 8, 7, "rgba(255,255,255,0.45)", "right");
      grainPass(0.1, t);
    };

    const RENDER: Record<Mode, (angle: number, t: number) => void> = { beauty, nodes, tracking, blueprint, cloud };

    // Kesme anında bozulma: rastgele yatay bantlar kayar, kısa bir parlama
    const glitch = (strength: number, t: number) => {
      const r = rng(Math.floor(t * 1000));
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 0; i < 6; i++) {
        const y = Math.floor(r() * canvas.height);
        const bh = Math.floor((8 + r() * 40) * dpr);
        const dx = Math.floor((r() - 0.5) * 60 * dpr * strength);
        ctx.drawImage(canvas, 0, y, canvas.width, bh, dx, y, canvas.width, bh);
      }
      ctx.globalAlpha = 0.1 * strength;
      ctx.fillStyle = "#cfdcff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    let start = performance.now();
    let lastShot = -1;
    const draw = (now: number) => {
      if (!assets) return;
      // Kare zaman damgası, logo yüklenince alınan başlangıçtan birkaç ms önce olabilir: negatif süre mod sırasını
      // -1 yapıp döngüyü ilk karede çökertiyordu
      const elapsed = Math.max(0, now - start);
      const shot = reduced ? 0 : Math.floor(elapsed / SHOT_MS) % SEQUENCE.length;
      if (shot !== lastShot) {
        lastShot = shot;
        onWordRef.current?.(shot);
      }
      // İmleç dönüşü biraz hızlandırıp yavaşlatır (yumuşak)
      const target = pointer ? ((pointer.x - cx) / width) * 1.2 : 0;
      tilt += (target - tilt) * 0.05;
      const t = elapsed / 1000;
      const angle = reduced ? 0.45 : t * SPIN + tilt;
      reset();
      ctx.globalCompositeOperation = "source-over";
      RENDER[SEQUENCE[shot]](angle, t);
      const sinceCut = elapsed % SHOT_MS;
      if (!reduced && sinceCut < GLITCH_MS && elapsed > SHOT_MS) glitch(1 - sinceCut / GLITCH_MS, t);
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
      assets = buildAssets(logo);
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
