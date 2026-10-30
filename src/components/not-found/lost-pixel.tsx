"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// 404'ün piksel tabelası: sitenin kare piksel dilinde "404". Açılışta pikseller karışık sırayla yanar,
// ardından son "4"ün bir pikseli düşüp altta kalır: sayfa gibi o da kaybolmuş. Düşen piksele tıklayınca
// yerine uçar. Piksel boyu (--c) sayfadan gelir. Sürekli oynayan bir şey yok; yalnız açılışta ve tıklayınca hareket eder.

// 4x5 piksel rakamlar
const DIGITS: Record<string, string[]> = {
  "4": ["X..X", "X..X", "XXXX", "...X", "...X"],
  "0": ["XXXX", "X..X", "X..X", "X..X", "XXXX"],
};

const TEXT = "404";
const ROWS = 5;
const COLS = TEXT.length * 4 + (TEXT.length - 1); // rakamlar arası bir boş sütun
// Kaybolan piksel: son "4"ün en alt pikseli
const LOST = { row: 4, col: COLS - 1 };

const lit = new Set<string>();
TEXT.split("").forEach((d, n) => {
  DIGITS[d].forEach((line, r) =>
    line.split("").forEach((ch, c) => {
      if (ch === "X") lit.add(`${r}-${n * 5 + c}`);
    }),
  );
});

const EASE = [0.22, 1, 0.36, 1] as const;

export function LostPixel({ onRestore }: { onRestore?: () => void }) {
  const [fallen, setFallen] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setFallen(true), 1500);
    return () => clearTimeout(id);
  }, []);

  const restore = () => {
    if (!fallen) return;
    setFallen(false);
    setRestored(true);
    onRestore?.();
  };

  return (
    <div
      className="grid w-max"
      style={{ gridTemplateColumns: `repeat(${COLS}, var(--c))`, gap: "calc(var(--c) * 0.24)" }}
    >
      {Array.from({ length: ROWS * COLS }, (_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const on = lit.has(`${r}-${c}`);
        const isLost = r === LOST.row && c === LOST.col;

        if (!on) return <span key={i} className="size-(--c) rounded-[18%] bg-white/[0.04]" />;

        const appear = {
          initial: { opacity: 0, scale: 0.4 },
          animate: { opacity: 1, scale: 1 },
          // Karışık sıra: asistan yüzündeki şekil değişimiyle aynı his
          transition: { duration: 0.5, delay: 0.15 + ((i * 7) % 31) * 0.025, ease: EASE },
        };

        if (!isLost) return <motion.span key={i} {...appear} className="size-(--c) rounded-[18%] bg-accent" />;

        return (
          <span key={i} className="relative size-(--c)">
            {/* Pikselin boş kalan yeri */}
            <span className="absolute inset-0 rounded-[18%] border border-dashed border-white/15" />
            <motion.button
              type="button"
              onClick={restore}
              disabled={!fallen}
              aria-label="Kayıp pikseli yerine koy"
              initial={appear.initial}
              animate={
                fallen
                  ? { opacity: 1, scale: 1, y: ["0%", "330%", "270%", "330%"], rotate: [0, 0, 8, 14] }
                  : { opacity: 1, scale: 1, y: "0%", rotate: 0 }
              }
              transition={
                fallen
                  ? { duration: 0.9, times: [0, 0.55, 0.78, 1], ease: ["easeIn", "easeOut", "easeIn"] }
                  : restored
                    ? { type: "spring", stiffness: 260, damping: 18 }
                    : appear.transition
              }
              className="absolute inset-0 rounded-[18%] bg-accent outline-none enabled:cursor-pointer enabled:hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white"
            />
          </span>
        );
      })}
    </div>
  );
}
