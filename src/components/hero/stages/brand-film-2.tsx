"use client";

import { useEffect, useRef } from "react";
import { GLYPHS, type Glyph } from "@/components/dock/pixel-matrix";
import { cn } from "@/lib/utils";
import { buildAssets, type Assets } from "./brand-film";
import { rng } from "./shape-sampler";

// Hero sahnesi "Marka filmi 2" (Referans'ın geliştirilmiş hâli; ilki brand-film.tsx'te olduğu gibi duruyor).
// Dönen 3B OX sembolü, her sekansta OX'in gerçekten yaptığı bir işin içinde görünür; sekans kendi içinde kurulur
// (çizgiler çizilir, yazılar yazılır, öğeler sırayla belirir), sekanslar arası sert kesme + kısa bozulma:
//   Marka (yapım geometrisi, renkler, yazı tipleri) → Website (tarayıcıda site kurulur, masaüstü → tablet → telefon) →
//   SEO (nokta bulutu taranır, site ağacı "dizine eklendi") → Sosyal Medya (üç telefon: Reels, Gönderi, Hikâye) →
//   Reklam (hedef halkaları, kitleden talebe akış) → Sonuç (ışıltılı logo + "Yeni talep geldi").
// Kayan kelime sekansla eşleşir (onWord). Etiketlerde iş rakamı ya da vaat yok (sıralama, artış, sayı yok).
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta Sonuç sekansı sabit çizilir.

type Shot = "marka" | "website" | "seo" | "sosyal" | "reklam" | "sonuc";
const SEQUENCE: Shot[] = ["sonuc", "marka", "website", "seo", "sosyal", "reklam"];
/** Sol başlıkta sekansa eşlik eden kelimeler (SEQUENCE ile aynı sıra) */
export const FILM2_WORDS = ["sonuç", "Marka", "Website", "SEO", "Sosyal Medya", "Reklam"];

const SHOT_MS = 2700;
const GLITCH_MS = 120;
const LAYERS = 32;
const CAMERA = 1400;
const SPIN = 0.7;
const BLUE = "#2f6bff";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Sekans içi zamanlama: p, [a, b] aralığında 0→1 */
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => 1 - (1 - t) ** 3;

export function BrandFilm2({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
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

    // Reklam sekansı: kitle noktaları (sabit, tohumlu)
    const audRand = rng(33);
    const AUDIENCE = Array.from({ length: 64 }, () => ({ x: audRand(), y: audRand(), pick: audRand(), seed: audRand() }));

    let assets: Assets | null = null;
    let sideDark: HTMLCanvasElement | null = null;
    let sheen: HTMLCanvasElement | null = null;
    let width = 0, height = 0, dpr = 1;
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
        ? { x0: width * 0.46, y0: 100, x1: width - width * 0.045, y1: height - 130 }
        : { x0: 16, y0: 96, x1: width - 16, y1: Math.max(340, height * 0.48) };
      cx = (region.x0 + region.x1) / 2;
      cy = (region.y0 + region.y1) / 2;
      size = Math.min(region.x1 - region.x0, region.y1 - region.y0) * (wide ? 0.46 : 0.5);
    };

    const reset = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const text = (s: string, x: number, y: number, px = 9, color = "rgba(255,255,255,0.7)", align: CanvasTextAlign = "left", family = mono, weight = "") => {
      ctx.font = `${weight} ${px}px ${family}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(s, x, y);
    };
    const glyph = (name: Glyph, x: number, y: number, cell: number, color: string) => {
      ctx.fillStyle = color;
      for (const i of GLYPHS[name]) ctx.fillRect(x + (i % 5) * cell, y + Math.floor(i / 5) * cell, cell - 1, cell - 1);
    };
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const dimsOf = (s: number) => {
      const a = assets!;
      const h = s;
      const w = (s * a.w) / a.h;
      return { w, h, depth: Math.max(w, h) * 0.13, half: Math.max(w, h) / 2 };
    };

    /** 3B logo: katmanlar uzaktan yakına; yan yüz derinliğe göre koyulaşır, en öndeki katman yüz */
    const drawSolid = (angle: number, face: HTMLCanvasElement, x0: number, y0: number, s: number, alpha = 1, side?: HTMLCanvasElement) => {
      const { w, h, depth } = dimsOf(s);
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const layers: { zr: number; z: number; k: number }[] = [];
      for (let i = 0; i < LAYERS; i++) {
        const k = i / (LAYERS - 1);
        const z = (k - 0.5) * depth;
        layers.push({ z, zr: z * cos, k });
      }
      layers.sort((p, q) => q.zr - p.zr);
      layers.forEach((l, i) => {
        const f = CAMERA / (CAMERA + l.zr);
        const front = i === layers.length - 1;
        ctx.globalAlpha = alpha * (front ? 1 : 0.55 + (i / layers.length) * 0.45);
        ctx.setTransform(dpr * cos * f, 0, 0, dpr * f, dpr * (x0 + l.z * sin * f), dpr * y0);
        ctx.drawImage(front ? face : (side ?? (i < layers.length / 2 ? sideDark! : assets!.sideBlue)), -w / 2, -h / 2, w, h);
      });
      ctx.globalAlpha = 1;
      reset();
    };

    /** Ön yüzdeki bir noktanın ekran konumu */
    const project = (px: number, py: number, angle: number, x0 = cx, y0 = cy, s = size) => {
      const { half, depth } = dimsOf(s);
      const z = -depth / 2;
      const X = px * half;
      const xr = X * Math.cos(angle) + z * Math.sin(angle);
      const zr = -X * Math.sin(angle) + z * Math.cos(angle);
      const f = CAMERA / (CAMERA + zr);
      return { x: x0 + xr * f, y: y0 + py * half * f };
    };

    /** Yüzün üstünden geçen ışık yansıması (her karede yeni bir kopya) */
    const sheenFace = (t: number) => {
      const a = assets!;
      if (!sheen) {
        sheen = document.createElement("canvas");
        sheen.width = a.w;
        sheen.height = a.h;
      }
      const s = sheen.getContext("2d")!;
      s.globalCompositeOperation = "source-over";
      s.clearRect(0, 0, a.w, a.h);
      s.drawImage(a.faceBlue, 0, 0);
      s.globalCompositeOperation = "source-atop";
      const x = ((t * 0.45) % 1.6 - 0.3) * a.w * 1.4;
      const grad = s.createLinearGradient(x - a.w * 0.25, 0, x + a.w * 0.25, a.h * 0.4);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(220,232,255,0.75)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      s.fillStyle = grad;
      s.fillRect(0, 0, a.w, a.h);
      return sheen;
    };

    const background = (color: string, glow: string | null, gx = cx, gy = cy) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      if (glow) {
        const r = size * 1.6;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        grad.addColorStop(0, glow);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
      }
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
    const vignette = () => {
      const grad = ctx.createRadialGradient(cx, cy, size * 0.6, cx, cy, Math.max(width, height) * 0.75);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };
    const gridPass = (step: number, minor: string, major: string) => {
      const { x0, y0, x1, y1 } = region;
      ctx.lineWidth = 1;
      for (let x = x0, i = 0; x <= x1; x += step, i++) {
        ctx.strokeStyle = i % 5 === 0 ? major : minor;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y0);
        ctx.lineTo(x + 0.5, y1);
        ctx.stroke();
      }
      for (let y = y0, i = 0; y <= y1; y += step, i++) {
        ctx.strokeStyle = i % 5 === 0 ? major : minor;
        ctx.beginPath();
        ctx.moveTo(x0, y + 0.5);
        ctx.lineTo(x1, y + 0.5);
        ctx.stroke();
      }
    };

    // ---------- Sekanslar (p: sekans içi ilerleme 0→1) ----------

    /** Marka: yapım geometrisi, boşluk alanı, renkler, yazı tipleri */
    const marka = (angle: number, t: number, p: number) => {
      background("#060b1c", null);
      gridPass(16, "rgba(47,107,255,0.06)", "rgba(47,107,255,0.15)");
      const { x0, y0, x1, y1 } = region;
      ctx.strokeStyle = "rgba(90,141,255,0.7)";
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1);

      const view = Math.sin(angle) * 0.25;
      const { w, h } = dimsOf(size);
      const lx = cx - (x1 - x0) * 0.08;
      // Kılavuz çizgiler (çizilerek gelir)
      const guide = ease(span(p, 0, 0.35));
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = "rgba(140,170,255,0.45)";
      ctx.beginPath();
      ctx.moveTo(x0, cy);
      ctx.lineTo(x0 + (x1 - x0) * guide, cy);
      ctx.moveTo(lx, y0);
      ctx.lineTo(lx, y0 + (y1 - y0) * guide);
      ctx.stroke();
      // Boşluk alanı (logonun çevresindeki koruma kutusu)
      const pad = h * 0.18;
      ctx.globalAlpha = ease(span(p, 0.25, 0.5));
      ctx.strokeRect(lx - w / 2 - pad, cy - h / 2 - pad, w + pad * 2, h + pad * 2);
      ctx.setLineDash([]);
      text("x", lx - w / 2 - pad / 2, cy - h / 2 - pad / 2 + 3, 9, "rgba(170,198,255,0.9)", "center");
      text("x", lx + w / 2 + pad / 2, cy + h / 2 + pad / 2 + 3, 9, "rgba(170,198,255,0.9)", "center");
      ctx.globalAlpha = 1;
      // Yapım daireleri (yay olarak çizilir)
      const arcs = ease(span(p, 0.1, 0.55));
      ctx.strokeStyle = "rgba(170,198,255,0.55)";
      for (const [ox, oy, r] of [[-0.22, 0.08, 0.3], [0.2, -0.18, 0.22], [0.05, 0.3, 0.42]]) {
        ctx.beginPath();
        ctx.arc(lx + ox * w, cy + oy * h, r * h, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * arcs);
        ctx.stroke();
      }
      // Dış hat
      ctx.setTransform(dpr * Math.cos(view), 0, 0, dpr, dpr * lx, dpr * cy);
      ctx.drawImage(assets!.outline, -w / 2, -h / 2, w, h);
      reset();

      // Renkler (sırayla belirir)
      const colors: [string, string][] = [["#2F6BFF", "OX MAVİ"], ["#0A1430", "GECE"], ["#E8EEFC", "SİS"], ["#111111", "MÜREKKEP"]];
      const sx = x1 - 132, sy = y0 + 24;
      text("RENKLER", sx, sy, 8, "rgba(170,198,255,0.75)");
      colors.forEach(([hex, name], i) => {
        const k = ease(span(p, 0.35 + i * 0.07, 0.5 + i * 0.07));
        if (!k) return;
        ctx.globalAlpha = k;
        ctx.fillStyle = hex;
        ctx.fillRect(sx, sy + 10 + i * 30, 22, 22);
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.strokeRect(sx + 0.5, sy + 10.5 + i * 30, 22, 22);
        text(hex, sx + 30, sy + 20 + i * 30, 8, "rgba(230,236,255,0.9)");
        text(name, sx + 30, sy + 30 + i * 30, 7, "rgba(170,198,255,0.6)");
      });
      ctx.globalAlpha = 1;
      // Yazı tipleri
      const k = ease(span(p, 0.6, 0.8));
      if (k) {
        ctx.globalAlpha = k;
        text("Aa", sx, y1 - 70, 34, "rgba(235,240,255,0.95)", "left", sans, "600");
        text("INTER · BAŞLIK VE METİN", sx, y1 - 50, 7, "rgba(170,198,255,0.7)");
        text("Aa", sx, y1 - 22, 22, "rgba(235,240,255,0.85)", "left", mono);
        text("SPACE MONO · ETİKET", sx, y1 - 8, 7, "rgba(170,198,255,0.7)");
        ctx.globalAlpha = 1;
      }
      text("OX DİJİTAL : MARKA KİMLİĞİ · PAFTA 01", x0 + 14, y1 - 12, 8, "rgba(170,198,255,0.85)");
      grainPass(0.05, t);
    };

    /** Website: tarayıcıda site kurulur; masaüstü → tablet → telefon */
    const website = (angle: number, t: number, p: number) => {
      background("#06070b", "rgba(47,107,255,0.08)");
      const { x0, y0, x1, y1 } = region;
      const full = (x1 - x0) * 0.9;
      const fh = (y1 - y0) * 0.86;
      const toTablet = ease(span(p, 0.55, 0.72));
      const toPhone = ease(span(p, 0.78, 0.95));
      const fw = full - (full - fh * 0.75) * toTablet - (fh * 0.75 - fh * 0.48) * toPhone;
      const fx = cx - fw / 2, fy = cy - fh / 2;
      const phone = toPhone > 0.5;
      const narrow = toTablet > 0.5;

      // Çerçeve
      roundRect(fx, fy, fw, fh, phone ? 26 : 14);
      ctx.fillStyle = "#0d0f16";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.stroke();
      ctx.save();
      roundRect(fx, fy, fw, fh, phone ? 26 : 14);
      ctx.clip();
      // Üst çubuk
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(fx, fy, fw, 26);
      [0, 1, 2].forEach((i) => {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(fx + 14 + i * 12, fy + 13, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      roundRect(fx + 56, fy + 6, Math.min(220, fw - 70), 14, 7);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fill();
      text("oxdijital.com", fx + 64, fy + 16, 8, "rgba(255,255,255,0.6)");

      const ix = fx + 18, iy = fy + 40, iw = fw - 36;
      const show = (a: number) => ease(span(p, a, a + 0.12));
      // Menü
      ctx.globalAlpha = show(0.05);
      ctx.drawImage(assets!.faceBlue, ix, iy, 22 * (assets!.w / assets!.h), 22);
      if (!narrow) [0, 1, 2, 3].forEach((i) => {
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(ix + iw - 220 + i * 46, iy + 9, 34, 4);
      });
      else [0, 1, 2].forEach((i) => {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(ix + iw - 18, iy + 4 + i * 6, 18, 2.5);
      });
      ctx.globalAlpha = 1;

      // Hero: geniş ekranda yazı solda logo sağda, dar ekranda logo üstte
      const heroH = fh * (phone ? 0.5 : 0.48);
      const logoS = Math.min(heroH * (narrow ? 0.46 : 0.62), iw * (narrow ? 0.42 : 0.28));
      const logoX = narrow ? ix + iw / 2 : ix + iw * 0.72;
      const logoY = narrow ? iy + 40 + logoS * 0.55 : iy + 40 + heroH / 2;
      ctx.globalAlpha = show(0.15);
      drawSolid(angle, assets!.faceBlue, logoX, logoY, logoS, show(0.15));
      const tx = narrow ? ix + iw * 0.1 : ix;
      const ty = narrow ? logoY + logoS * 0.75 : iy + 40 + heroH * 0.28;
      const tw = narrow ? iw * 0.8 : iw * 0.46;
      ctx.globalAlpha = show(0.22);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(tx, ty, tw * 0.9, phone ? 8 : 12);
      ctx.fillRect(tx, ty + (phone ? 14 : 20), tw * 0.6, phone ? 8 : 12);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(tx, ty + (phone ? 32 : 46), tw * 0.85, 4);
      ctx.fillRect(tx, ty + (phone ? 40 : 56), tw * 0.7, 4);
      ctx.globalAlpha = show(0.3);
      roundRect(tx, ty + (phone ? 52 : 74), phone ? 70 : 96, phone ? 18 : 26, 13);
      ctx.fillStyle = BLUE;
      ctx.fill();
      text("Teklif al", tx + (phone ? 35 : 48), ty + (phone ? 64 : 91), phone ? 8 : 10, "#fff", "center", sans, "600");
      // Kartlar
      ctx.globalAlpha = show(0.38);
      const cols = phone ? 1 : narrow ? 2 : 3;
      const cy0 = fy + fh * (phone ? 0.8 : narrow ? 0.76 : 0.7);
      const cw = (iw - (cols - 1) * 10) / cols;
      for (let c = 0; c < cols; c++) {
        roundRect(ix + c * (cw + 10), cy0, cw, fh * 0.22, 8);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(ix + c * (cw + 10) + 10, cy0 + 12, cw * 0.5, 4);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      // Kırılım etiketi
      const bp = phone ? "TELEFON · 390" : narrow ? "TABLET · 768" : "MASAÜSTÜ · 1440";
      text(bp, fx + fw, fy - 10, 8, "rgba(170,198,255,0.85)", "right");
      text("MOBİL UYUMLU · HIZLI · SEO HAZIR", fx, fy - 10, 8, "rgba(255,255,255,0.45)");
      grainPass(0.05, t);
    };

    /** SEO: nokta bulutu taranır; site ağacı taranıp dizine eklenir */
    const seo = (angle: number, t: number, p: number) => {
      background("#07080c", "rgba(47,107,255,0.05)", cx + (region.x1 - region.x0) * 0.18, cy);
      const { x0, y0, x1 } = region;
      const ox = cx + (x1 - x0) * 0.14;
      const s = size * 0.85;
      const { half, depth } = dimsOf(s);
      const pts = assets!.points;
      // Nokta bulutu öne bakar, hafifçe sallanır (yandan bakınca taranan logo okunmuyordu)
      const view = Math.sin(angle) * 0.5;
      const cos = Math.cos(view), sin = Math.sin(view);
      // Tarama çizgisi soldan sağa geçer; geçtiği noktalar parlar
      const scanX = ox - half * 1.2 + half * 2.4 * ease(span(p, 0.08, 0.7));
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
        ctx.fillRect(px, cy + Y * f, scanned ? 1.8 : 1.3, scanned ? 1.8 : 1.3);
      }
      if (p > 0.08 && p < 0.72) {
        const grad = ctx.createLinearGradient(scanX - 40, 0, scanX, 0);
        grad.addColorStop(0, "rgba(47,107,255,0)");
        grad.addColorStop(1, "rgba(47,107,255,0.35)");
        ctx.fillStyle = grad;
        ctx.fillRect(scanX - 40, cy - half * 1.1, 40, half * 2.2);
        ctx.strokeStyle = "rgba(170,198,255,0.9)";
        ctx.beginPath();
        ctx.moveTo(scanX, cy - half * 1.1);
        ctx.lineTo(scanX, cy + half * 1.1);
        ctx.stroke();
      }
      // Arama çubuğu (yazılır)
      const q = "web tasarım ajansı";
      const typed = q.slice(0, Math.round(q.length * ease(span(p, 0, 0.3))));
      roundRect(x0 + 14, y0 + 14, 230, 30, 15);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      glyph("magnifier", x0 + 26, y0 + 22, 3, "rgba(255,255,255,0.5)");
      text(typed + (Math.floor(t * 2) % 2 ? "" : "|"), x0 + 48, y0 + 33, 11, "rgba(255,255,255,0.85)", "left", sans);
      // Site ağacı: gerçek sayfalar, tarandıkça işaretlenir
      const pages = ["/", "/hizmetler", "/hizmetler/website", "/hizmetler/seo", "/paketler", "/blog", "/iletisim"];
      const tx = x0 + 20, ty = y0 + 74;
      text("SİTE HARİTASI", tx, ty, 8, "rgba(255,255,255,0.5)");
      pages.forEach((pg, i) => {
        const k = ease(span(p, 0.15 + i * 0.06, 0.25 + i * 0.06));
        if (!k) return;
        const depthLvl = pg.split("/").length - 2;
        const lx = tx + Math.max(0, depthLvl) * 14;
        const ly = ty + 18 + i * 20;
        ctx.globalAlpha = k;
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.moveTo(tx + 3, ly - 14);
        ctx.lineTo(tx + 3, ly - 4);
        ctx.lineTo(lx - 4, ly - 4);
        ctx.stroke();
        text(`oxdijital.com${pg === "/" ? "" : pg}`, lx, ly, 9, "rgba(230,236,255,0.85)");
        const done = p > 0.3 + i * 0.07;
        text(done ? "✓ DİZİNE EKLENDİ" : "TARANIYOR…", tx + 236, ly, 7, done ? "rgba(120,170,255,0.95)" : "rgba(255,255,255,0.35)");
        ctx.globalAlpha = 1;
      });
      grainPass(0.08, t);
    };

    /** Sosyal medya: yelpaze gibi üç telefon; ortadakinde 3B logo, kalpler yükselir */
    const sosyal = (angle: number, t: number, p: number) => {
      background("#05060a", "rgba(47,107,255,0.1)");
      // Üç telefon sahne alanına sığsın: yükseklik hem alanın yüksekliğine hem genişliğine göre sınırlanır
      const ph = Math.min((region.y1 - region.y0) * 0.72, ((region.x1 - region.x0) / 3.4) * (16 / 9));
      const pw = (ph * 9) / 16;
      const phones = [
        { x: cx - pw * 1.08, rot: -0.12, label: "GÖNDERİ", kind: "post" },
        { x: cx + pw * 1.08, rot: 0.12, label: "HİKÂYE", kind: "story" },
        { x: cx, rot: 0, label: "REELS", kind: "reels" },
      ];
      phones.forEach((ph0, i) => {
        const k = ease(span(p, i * 0.08, 0.2 + i * 0.08));
        ctx.save();
        ctx.globalAlpha = k;
        ctx.translate(ph0.x, cy + (1 - k) * 30);
        ctx.rotate(ph0.rot);
        roundRect(-pw / 2, -ph / 2, pw, ph, 22);
        ctx.fillStyle = "#0b0d14";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.stroke();
        ctx.save();
        roundRect(-pw / 2 + 6, -ph / 2 + 6, pw - 12, ph - 12, 17);
        ctx.clip();
        const grad = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
        grad.addColorStop(0, ph0.kind === "reels" ? "#0a1640" : "#0c1020");
        grad.addColorStop(1, ph0.kind === "reels" ? "#1c49c9" : "#121a33");
        ctx.fillStyle = grad;
        ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
        // Profil satırı
        ctx.fillStyle = BLUE;
        ctx.beginPath();
        ctx.arc(-pw / 2 + 22, -ph / 2 + 24, 8, 0, Math.PI * 2);
        ctx.fill();
        text("oxdijital", -pw / 2 + 36, -ph / 2 + 27, 9, "rgba(255,255,255,0.85)", "left", sans, "600");
        // Yan telefonlarda düz logo
        if (ph0.kind !== "reels") {
          const s = pw * 0.42;
          const lw = (s * assets!.w) / assets!.h;
          ctx.drawImage(ph0.kind === "post" ? assets!.faceGlow : assets!.outline, -lw / 2, -s / 2 - 10, lw, s);
        }
        // Alt simgeler
        glyph("heart", -pw / 2 + 16, ph / 2 - 30, 3, ph0.kind === "reels" && p > 0.45 ? "#ff6b8a" : "rgba(255,255,255,0.7)");
        glyph("bubble", -pw / 2 + 40, ph / 2 - 30, 3, "rgba(255,255,255,0.7)");
        glyph("arrow", -pw / 2 + 64, ph / 2 - 30, 3, "rgba(255,255,255,0.7)");
        ctx.restore();
        text(ph0.label, 0, -ph / 2 - 12, 8, "rgba(170,198,255,0.85)", "center");
        ctx.restore();
      });
      // Ortadaki telefonda dönen 3B logo
      const k = ease(span(p, 0.16, 0.36));
      if (k) drawSolid(angle, assets!.faceBlue, cx, cy - 10, pw * 0.5, k);
      // Kalpler yükselir
      if (p > 0.45) {
        for (let i = 0; i < 9; i++) {
          const life = ((t * 0.6 + i / 9) % 1);
          const hx = cx + pw * 0.28 + Math.sin(i * 2.1 + t * 2) * 10;
          const hy = cy + ph * 0.32 - life * ph * 0.5;
          ctx.globalAlpha = (1 - life) * ease(span(p, 0.45, 0.55));
          glyph("heart", hx, hy, 2.4, "#ff6b8a");
        }
        ctx.globalAlpha = 1;
      }
      text("İÇERİK TAKVİMİ · PAYLAŞIM PLANLANDI", region.x0 + 14, region.y1 - 12, 8, "rgba(255,255,255,0.45)");
      grainPass(0.06, t);
    };

    /** Reklam: hedef halkaları; kitleden seçilenler talebe akar */
    const reklam = (angle: number, t: number, p: number) => {
      background("#020203", null);
      const { x0, y0, x1, y1 } = region;
      const lx = cx - (x1 - x0) * 0.14;
      const s = size * 0.78;
      // Parlama + logo
      const { w, h, depth } = dimsOf(s);
      const cos = Math.cos(angle);
      const f = CAMERA / (CAMERA + (-depth / 2) * cos);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(18px)";
      ctx.setTransform(dpr * cos * f, 0, 0, dpr * f, dpr * lx, dpr * cy);
      ctx.drawImage(assets!.sideGlow, -w / 2, -h / 2, w, h);
      ctx.restore();
      reset();
      drawSolid(angle, assets!.faceGlow, lx, cy, s, 1, assets!.sideGlow);
      // Hedef halkaları
      for (let i = 0; i < 3; i++) {
        const r = s * (0.75 + i * 0.32) * (0.9 + 0.1 * Math.sin(t * 2 + i));
        ctx.strokeStyle = `rgba(90,141,255,${0.35 - i * 0.09})`;
        ctx.setLineDash(i === 2 ? [3, 6] : []);
        ctx.beginPath();
        ctx.arc(lx, cy, r, 0, Math.PI * 2 * ease(span(p, i * 0.08, 0.3 + i * 0.08)));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      text("HEDEF KİTLE", lx, cy - s * 1.45, 8, "rgba(170,198,255,0.85)", "center");
      // Talep düğümü
      const tx = x1 - 70, ty = cy;
      const tk = ease(span(p, 0.3, 0.45));
      ctx.globalAlpha = tk;
      roundRect(tx - 44, ty - 18, 88, 36, 10);
      ctx.fillStyle = "#0d1530";
      ctx.fill();
      ctx.strokeStyle = BLUE;
      ctx.stroke();
      text("TALEP", tx, ty + 4, 10, "#e6eeff", "center", mono, "700");
      ctx.globalAlpha = 1;
      // Kitle noktaları: seçilenler maviye döner ve talebe akar
      AUDIENCE.forEach((a) => {
        const ax = x0 + 20 + a.x * (x1 - x0 - 140);
        const ay = y0 + 20 + a.y * (y1 - y0 - 40);
        const chosen = a.pick < 0.32 && p > 0.35 + a.seed * 0.3;
        ctx.fillStyle = chosen ? BLUE : "rgba(255,255,255,0.22)";
        ctx.fillRect(ax - 2, ay - 2, 4, 4);
        if (chosen) {
          ctx.strokeStyle = "rgba(47,107,255,0.25)";
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.quadraticCurveTo((ax + tx) / 2, ay, tx - 44, ty);
          ctx.stroke();
          // Akan paket
          const u = (t * 0.8 + a.seed) % 1;
          const qx = (1 - u) ** 2 * ax + 2 * (1 - u) * u * ((ax + tx) / 2) + u * u * (tx - 44);
          const qy = (1 - u) ** 2 * ay + 2 * (1 - u) * u * ay + u * u * ty;
          ctx.fillStyle = "#cfe0ff";
          ctx.fillRect(qx - 1.5, qy - 1.5, 3, 3);
        }
      });
      text("KAMPANYA AKTİF", x0 + 14, y0 + 18, 8, "rgba(255,255,255,0.6)");
      const m = project(0.2, -0.3, angle, lx, cy, s);
      text(`x: ${Math.round(m.x)} y: ${Math.round(m.y)}`, m.x + 10, m.y, 8, "rgba(255,255,255,0.8)");
      grainPass(0.05, t);
    };

    /** Sonuç: ışıltılı logo + yeni talep */
    const sonuc = (angle: number, t: number, p: number) => {
      background("#030407", "rgba(47,107,255,0.16)");
      if (!reduced) {
        ctx.filter = "blur(2px)";
        drawSolid(angle - 0.08, assets!.faceBlue, cx, cy - size * 0.08, size, 0.35);
        ctx.filter = "none";
      }
      drawSolid(angle, sheenFace(t), cx, cy - size * 0.08, size);
      vignette();
      const k = ease(span(p, 0.35, 0.55));
      if (k) {
        const bw = 230, bh = 54;
        const bx = cx - bw / 2, by = cy + size * 0.62 + (1 - k) * 14;
        ctx.globalAlpha = k;
        ctx.shadowColor = "rgba(47,107,255,0.8)";
        ctx.shadowBlur = 40;
        roundRect(bx, by, bw, bh, 16);
        ctx.fillStyle = "rgba(14,18,34,0.92)";
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(90,141,255,0.7)";
        ctx.stroke();
        roundRect(bx + 10, by + 10, 34, 34, 10);
        ctx.fillStyle = BLUE;
        ctx.fill();
        glyph("smile", bx + 17, by + 17, 4, "#fff");
        text("Yeni talep geldi", bx + 56, by + 25, 14, "#ffffff", "left", sans, "600");
        text("Ücretsiz görüşme isteği", bx + 56, by + 42, 11, "rgba(255,255,255,0.6)", "left", sans);
        ctx.globalAlpha = 1;
      }
      grainPass(0.06, t);
    };

    const RENDER: Record<Shot, (angle: number, t: number, p: number) => void> = { marka, website, seo, sosyal, reklam, sonuc };

    const glitch = (strength: number, t: number) => {
      const r = rng(Math.floor(t * 1000));
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let i = 0; i < 7; i++) {
        const y = Math.floor(r() * canvas.height);
        const bh = Math.floor((6 + r() * 40) * dpr);
        const dx = Math.floor((r() - 0.5) * 70 * dpr * strength);
        ctx.drawImage(canvas, 0, y, canvas.width, bh, dx, y, canvas.width, bh);
      }
      ctx.globalAlpha = 0.12 * strength;
      ctx.fillStyle = "#cfdcff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    // Yalnız geliştirmede: localStorage "ox-film-sekans" (0-5) verilirse film o sekansta kalır (inceleme için)
    let forced = NaN;
    if (process.env.NODE_ENV === "development") {
      try {
        forced = Number(localStorage.getItem("ox-film-sekans") ?? NaN);
      } catch {}
    }

    let start = performance.now();
    let lastShot = -1;
    const draw = (now: number) => {
      if (!assets) return;
      // Kare zaman damgası başlangıçtan birkaç ms önce olabilir: süre negatif olmasın
      const elapsed = Math.max(0, now - start);
      const shot = reduced ? 0 : forced >= 0 && forced < SEQUENCE.length ? forced : Math.floor(elapsed / SHOT_MS) % SEQUENCE.length;
      if (shot !== lastShot) {
        lastShot = shot;
        onWordRef.current?.(shot);
      }
      const p = reduced ? 1 : (elapsed % SHOT_MS) / SHOT_MS;
      const target = pointer ? ((pointer.x - cx) / width) * 1.2 : 0;
      tilt += (target - tilt) * 0.05;
      const t = elapsed / 1000;
      const angle = reduced ? 0.4 : t * SPIN + tilt;
      reset();
      ctx.globalCompositeOperation = "source-over";
      // Her sekansta hafif kamera yaklaşması: sembol sekans boyunca %4 büyür
      const baseSize = size;
      size = baseSize * (1 + p * 0.04);
      RENDER[SEQUENCE[shot]](angle, t, p);
      size = baseSize;
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
      // Derinlikte koyulaşan yan yüz için ikinci, daha koyu ton
      const a = assets;
      sideDark = document.createElement("canvas");
      sideDark.width = a.w;
      sideDark.height = a.h;
      const sd = sideDark.getContext("2d")!;
      sd.drawImage(a.sideBlue, 0, 0);
      sd.globalCompositeOperation = "source-atop";
      sd.fillStyle = "rgba(4,10,40,0.55)";
      sd.fillRect(0, 0, a.w, a.h);
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
