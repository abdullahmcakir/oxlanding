"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// 3x3 piksel ızgarası. Hücreler 0-8, soldan sağa / yukarıdan aşağıya.
const PATTERNS = {
  menu: [0, 4, 6, 8],
  close: [0, 2, 4, 6, 8],
  arrow: [0, 4, 6],
  down: [0, 2, 4],
  up: [4, 6, 8],
  // /calismalar tür rozetleri
  frame: [0, 1, 2, 3, 5, 6, 7, 8],
  lines: [0, 1, 2, 6, 7],
  quote: [0, 2, 3, 5],
  diamond: [1, 3, 5, 7],
  plus: [1, 3, 4, 5, 7],
} as const;

export type PixelIconVariant = keyof typeof PATTERNS;

type Props = {
  variant: PixelIconVariant;
  className?: string;
  cellClassName?: string;
};

export function PixelIcon({ variant, className, cellClassName }: Props) {
  const active = PATTERNS[variant] as readonly number[];
  return (
    <svg viewBox="0 0 9 9" className={cn("size-3", className)} aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <motion.rect
          key={i}
          x={(i % 3) * 3}
          y={Math.floor(i / 3) * 3}
          width={3}
          height={3}
          className={cn("fill-accent", cellClassName)}
          initial={false}
          animate={{ opacity: active.includes(i) ? 1 : 0 }}
          transition={{ duration: 0.15, delay: i * 0.02 }}
        />
      ))}
    </svg>
  );
}
