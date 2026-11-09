"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Hero'nun arka planı: bütün zemini kaplayan soluk piksel ızgarası; ızgaranın mavi yanan karelerinden büyük bir "OX".
// Sitenin piksel dili (dock'taki OX Piksel, 404, iletişim sayfası) hero'da da sürer.
// - Açılışta pikseller karışık sırayla yanarak OX'i kurar (bir kez).
// - İmleç yaklaşınca çevresindeki kareler yumuşakça aydınlanır, uzaklaşınca söner.
// - Sürekli yanıp sönme yok: açılış bitip imleç durunca çizim de durur (döngü yalnız gerektiğinde çalışır).
// - "Hareketi azalt"ta açılış ve imleç ışığı yok, son hâl doğrudan çizilir.
// Canvas: binlerce kare için DOM yerine tek çizim yüzeyi; boyut değişince ızgara yeniden kurulur.

// 5×7 harfler, aralarında 2 sütun boşluk. "#" yanan piksel.
const GLYPH = [
  ".###...#...#",
  "#...#..#...#",
  "#...#...#.#.",
  "#...#....#..",
  "#...#...#.#.",
  "#...#..#...#",
  ".###...#...#",
];
const GLYPH_W = GLYPH[0].length;
const GLYPH_H = GLYPH.length;

const ACCENT = [47, 107, 255] as const; // --accent (#2f6bff)
const LIGHT = [170, 196, 255] as const; // imleç altındaki harf pikselinin açık tonu
const INTRO_MS = 1100; // son pikselin yanmaya başladığı an
const FADE_MS = 320; // bir pikselin yanma süresi

type Cell = { x: number; y: number; letter: boolean; delay: number; tone: number; glow: number };

/** Belirli bir tohumla sabit sözde-rastgele sayı: yeniden çizimde pikseller aynı tonda kalsın */
function seeded(n: number) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

export function PixelOx({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cells: Cell[] = [];
    let size = 0; // kare kenarı (CSS px)
    let width = 0;
    let height = 0;
    let start = performance.now();
    let introDone = reduced;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    // Izgarayı ve OX'in yerini ekran boyutuna göre kurar
    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const wide = width >= 900;
      // Geniş ekranda her harf pikseli 2×2 kare, sağda; dar ekranda 1×1, üstte ortada
      const scale = wide ? 2 : 1;
      size = wide
        ? // Soldaki yazılarla çakışmasın: OX en fazla genişliğin %38'i
          Math.max(14, Math.min(44, (width * 0.38) / (GLYPH_W * scale), (height * 0.6) / (GLYPH_H * scale)))
        : Math.max(16, Math.min(30, (width - 32) / (GLYPH_W + 2)));
      const cols = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      const glyphCols = GLYPH_W * scale;
      const glyphRows = GLYPH_H * scale;
      const col0 = wide ? cols - glyphCols - Math.max(2, Math.round((width * 0.05) / size)) : Math.floor((cols - glyphCols) / 2);
      // Geniş ekranda dikeyde ortanın biraz üstü (alttaki 48px bir sonraki bölümün altında kalır); dar ekranda navbar'ın altı
      const row0 = wide ? Math.max(3, Math.round((rows - glyphRows) / 2) - 1) : Math.ceil(120 / size);

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gr = Math.floor((r - row0) / scale);
          const gc = Math.floor((c - col0) / scale);
          const letter = r >= row0 && c >= col0 && gr < GLYPH_H && gc < GLYPH_W && GLYPH[gr][gc] === "#";
          const n = r * 1000 + c;
          cells.push({ x: c * size, y: r * size, letter, delay: seeded(n) * INTRO_MS, tone: 0.82 + seeded(n + 7) * 0.18, glow: 0 });
        }
      }
    };

    const draw = (now: number) => {
      const t = now - start;
      const gap = size * 0.12;
      const box = size - gap;
      const radius = size * 0.16;
      const reach = size * 4.2; // imleç ışığının yarıçapı
      let busy = !introDone;

      ctx.clearRect(0, 0, width, height);
      for (const cell of cells) {
        // İmleç ışığı: hedefe yumuşak yaklaşır (ani açılıp kapanmasın)
        let target = 0;
        if (pointer && !reduced) {
          const dx = cell.x + size / 2 - pointer.x;
          const dy = cell.y + size / 2 - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < reach) target = (1 - d / reach) ** 2;
        }
        cell.glow += (target - cell.glow) * 0.16;
        if (Math.abs(target - cell.glow) > 0.002) busy = true;
        else cell.glow = target;

        const x = cell.x + gap / 2;
        const y = cell.y + gap / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, box, box, radius);

        if (cell.letter) {
          const on = introDone ? 1 : Math.min(1, Math.max(0, (t - cell.delay) / FADE_MS));
          if (on > 0) {
            const g = cell.glow * 0.75;
            const [r, gr, b] = ACCENT.map((v, i) => Math.round(v + (LIGHT[i] - v) * g));
            ctx.fillStyle = `rgba(${r},${gr},${b},${on * cell.tone})`;
            ctx.fill();
          } else {
            ctx.strokeStyle = "rgba(255,255,255,0.045)";
            ctx.stroke();
          }
        } else if (cell.glow > 0.01) {
          ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${cell.glow * 0.38})`;
          ctx.fill();
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.045)";
          ctx.stroke();
        }
      }

      if (!introDone && t > INTRO_MS + FADE_MS) introDone = true;
      // Işık yerine oturunca döngü durur; imleç kıpırdayınca (pointermove) yeniden başlar
      frame = busy ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    layout();
    start = performance.now();
    wake();

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(host);
    if (!reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block", className)} />;
}
