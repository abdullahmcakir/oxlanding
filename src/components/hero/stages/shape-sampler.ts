// Hero sahneleri için şekil örnekleyici: bir şekli görünmeyen bir tuvale çizer, dolu pikselleri tarar ve
// istenen sayıda noktaya çevirir. Noktalar merkezlenmiş ve [-1, 1] aralığına ölçeklenmiştir (en-boy oranı korunur).
// Böylece logo, ikon ya da yazı gibi her şekil aynı sayıda parçacıkla çizilebilir ve birbirine dönüşebilir.

/** Tohumlu sözde-rastgele üreteç (mulberry32): her açılışta aynı dağılım */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 220; // örnekleme tuvalinin kenarı (px)

/**
 * `draw` ile çizilen şeklin dolu piksellerinden `count` nokta seçer.
 * Dönen dizi [x0, y0, x1, y1, …]; şekil boşsa tümü 0.
 */
export function sampleShape(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  count: number,
  seed = 1,
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx, SIZE);

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const filled: number[] = [];
  let minX = SIZE, minY = SIZE, maxX = 0, maxY = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (data[(y * SIZE + x) * 4 + 3] > 120) {
        filled.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const out = new Float32Array(count * 2);
  if (!filled.length) return out;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const half = Math.max(maxX - minX, maxY - minY) / 2 || 1;
  const random = rng(seed);
  const pixels = filled.length / 2;
  for (let i = 0; i < count; i++) {
    const p = Math.floor(random() * pixels) * 2;
    // Piksel içinde küçük sapma: noktalar ızgaraya dizilmiş görünmesin
    out[i * 2] = (filled[p] + random() - 0.5 - cx) / half;
    out[i * 2 + 1] = (filled[p + 1] + random() - 0.5 - cy) / half;
  }
  return out;
}

/** Bir görseli (ör. logo) örnekler; görsel yüklenince çağrılmalı */
export function sampleImage(img: HTMLImageElement, count: number, seed = 1) {
  return sampleShape(
    (ctx, size) => {
      const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight) * 0.92;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    },
    count,
    seed,
  );
}

/** Kalın bir yazıyı örnekler (ör. hizmet adı). `family`: sayfanın gerçek yazı tipi ailesi (next/font kendi adını üretir) */
export function sampleText(text: string, count: number, seed = 1, weight = 800, family = "Inter, system-ui, sans-serif") {
  return sampleShape(
    (ctx, size) => {
      let font = size * 0.5;
      ctx.font = `${weight} ${font}px ${family}`;
      const width = ctx.measureText(text).width;
      if (width > size * 0.94) {
        font *= (size * 0.94) / width;
        ctx.font = `${weight} ${font}px ${family}`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);
    },
    count,
    seed,
  );
}

// --- Hizmet simgeleri: kalın çizgili, okunaklı siluetler ---

export const ICONS: Record<string, (ctx: CanvasRenderingContext2D, s: number) => void> = {
  /** Website: tarayıcı penceresi */
  browser(ctx, s) {
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.roundRect(s * 0.1, s * 0.18, s * 0.8, s * 0.64, s * 0.07);
    ctx.stroke();
    ctx.fillRect(s * 0.1, s * 0.18, s * 0.8, s * 0.14);
    ctx.fillRect(s * 0.2, s * 0.44, s * 0.36, s * 0.07);
    ctx.fillRect(s * 0.2, s * 0.57, s * 0.24, s * 0.05);
    ctx.fillRect(s * 0.62, s * 0.44, s * 0.18, s * 0.26);
  },
  /** SEO: büyüteç */
  magnifier(ctx, s) {
    ctx.lineWidth = s * 0.09;
    ctx.beginPath();
    ctx.arc(s * 0.42, s * 0.42, s * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(s * 0.6, s * 0.6);
    ctx.lineTo(s * 0.84, s * 0.84);
    ctx.stroke();
  },
  /** Sosyal medya: kalp */
  heart(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.84);
    ctx.bezierCurveTo(s * 0.08, s * 0.56, s * 0.08, s * 0.16, s * 0.32, s * 0.16);
    ctx.bezierCurveTo(s * 0.43, s * 0.16, s * 0.5, s * 0.25, s * 0.5, s * 0.3);
    ctx.bezierCurveTo(s * 0.5, s * 0.25, s * 0.57, s * 0.16, s * 0.68, s * 0.16);
    ctx.bezierCurveTo(s * 0.92, s * 0.16, s * 0.92, s * 0.56, s * 0.5, s * 0.84);
    ctx.fill();
  },
  /** Marka: yıldız */
  star(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.18 : s * 0.42;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(s / 2 + Math.cos(a) * r, s / 2 + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },
  /** Müşteri: gülen yüz */
  smile(ctx, s) {
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
    ctx.stroke();
    for (const x of [0.37, 0.63]) {
      ctx.beginPath();
      ctx.arc(s * x, s * 0.42, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.52, s * 0.18, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  },
};
