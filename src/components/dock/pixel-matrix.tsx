"use client";

import { useEffect, useState } from "react";
import { motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

// "OX Piksel": sitenin 3x3 piksel ikon dilinin 5x5 hali; sağ alttaki asistanın yüzü.
// - Boştayken sabit durur; sürekli yanıp sönen bir dalga dikkat dağıtıyordu.
// - Şekil değişince pikseller karışık sırayla söner/yanar: dağılıp yeni şekle toplanıyormuş gibi.
// - `wave`: ses dalgası (ekolayzer). Sesli asistan bağlanınca konuşmaya göre oynayacak; şimdilik rastgele.
// - `look`: imlecin olduğu yöne birkaç piksel kayar ("bakar").

// Hücreler 0-24, soldan sağa / yukarıdan aşağıya
export const GLYPHS = {
  smile: [6, 8, 15, 19, 21, 22, 23],
  plus: [2, 7, 10, 11, 12, 13, 14, 17, 22],
  diamond: [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 22],
  frame: [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24],
  arrow: [2, 8, 10, 11, 12, 13, 14, 18, 22],
  question: [1, 2, 3, 8, 12, 22],
  lines: [0, 1, 2, 3, 4, 10, 11, 12, 13, 20, 21, 22],
  // Hizmet ikonları
  browser: [0, 1, 2, 3, 4, 5, 7, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24],
  heart: [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 22],
  star: [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 21, 23],
  gear: [1, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 21, 23],
  bag: [1, 2, 3, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  magnifier: [0, 1, 2, 5, 7, 10, 11, 12, 18, 24],
  pin: [1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 22],
  // Hakkımızda ilkeleri
  bars: [9, 13, 14, 17, 18, 19, 21, 22, 23, 24],
  check: [9, 13, 15, 17, 21],
  bubble: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 21],
  trend: [2, 3, 4, 8, 9, 12, 14, 16, 20],
  // Çerez sorusu: yuvarlak kurabiye (sönük pikseller çikolata parçası) ve yenme adımları
  cookie: [1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 14, 15, 17, 18, 19, 21, 22, 23],
  cookieBite: [1, 2, 5, 6, 8, 10, 11, 12, 15, 17, 18, 19, 21, 22, 23],
  cookieHalf: [1, 5, 6, 10, 11, 15, 16, 21, 22],
  crumbs: [15, 21, 23],
} satisfies Record<string, number[]>;

export type Glyph = keyof typeof GLYPHS;

export function isGlyph(value: string | undefined): value is Glyph {
  return value !== undefined && value in GLYPHS;
}

/**
 * Küçük, animasyonsuz piksel ikon (buton ve etiketlerde). Hareket yok: listede yedisi birden dursa bile yük olmaz.
 * Renk `className` ile verilir (text-*), pikseller currentColor kullanır.
 */
export function MiniGlyph({ glyph, cell = 3, className }: { glyph: Glyph; cell?: number; className?: string }) {
  const on = new Set<number>(GLYPHS[glyph]);
  return (
    <span aria-hidden className={cn("grid grid-cols-5 gap-px", className)}>
      {Array.from({ length: 25 }, (_, i) => (
        <span key={i} style={{ width: cell, height: cell }} className={cn("bg-current", !on.has(i) && "opacity-0")} />
      ))}
    </span>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sütun yükseklikleri (1-5) → alttan dolan ekolayzer hücreleri */
function bars(heights: number[]) {
  const on = new Set<number>();
  heights.forEach((h, col) => {
    for (let row = 5 - h; row < 5; row++) on.add(row * 5 + col);
  });
  return on;
}

/** Dolma sırası: alt satırdan başlayıp yukarı, her satır soldan sağa (bardak dolar gibi) */
const FILL_ORDER = [4, 3, 2, 1, 0].flatMap((row) => [0, 1, 2, 3, 4].map((col) => row * 5 + col));

export function PixelMatrix({
  glyph,
  wave = false,
  fill,
  look,
  cell = 5,
  className,
}: {
  glyph: Glyph;
  wave?: boolean;
  /** 0-1: verilirse şekil yerine matris alttan bu oranda dolar (ör. okuma ilerlemesi) */
  fill?: number;
  look?: { x: MotionValue<number>; y: MotionValue<number> };
  /** Piksel boyu (px). Asistanda 5; büyük kullanımlarda (ör. Hakkımızda ilkeleri) büyütülür. */
  cell?: number;
  className?: string;
}) {
  const [heights, setHeights] = useState([2, 4, 5, 3, 2]);

  useEffect(() => {
    if (!wave) return;
    // Ortası yüksek, kenarları alçak: konuşan bir ses gibi
    const id = setInterval(() => {
      setHeights([0, 1, 2, 1, 0].map((bias) => Math.min(5, 1 + bias + Math.floor(Math.random() * 3))));
    }, 140);
    return () => clearInterval(id);
  }, [wave]);

  const filling = fill !== undefined && !wave;
  const on = wave
    ? bars(heights)
    : filling
      ? new Set(FILL_ORDER.slice(0, Math.round(fill * 25)))
      : new Set<number>(GLYPHS[glyph]);
  const fast = wave || filling;

  return (
    <motion.div
      style={{ ...look, gap: Math.max(2, Math.round(cell * 0.4)) }}
      aria-hidden
      className={cn("grid grid-cols-5", className)}
    >
      {Array.from({ length: 25 }, (_, i) => {
        const active = on.has(i);
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ opacity: active ? 1 : 0.08, scale: active ? 1 : 0.6 }}
            // Karışık sıra (i*7 mod 25): pikseller rastgele dağılıp toplanıyormuş gibi görünür
            transition={{ duration: fast ? 0.18 : 0.4, delay: fast ? 0 : ((i * 7) % 25) * 0.014, ease: EASE }}
            style={{ width: cell, height: cell, borderRadius: Math.max(1, cell * 0.2) }}
            className="block bg-accent"
          />
        );
      })}
    </motion.div>
  );
}
