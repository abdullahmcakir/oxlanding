"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { usePageVisible } from "@/hooks/use-page-visible";
import { cn } from "@/lib/utils";

// Framer'daki SegmentUI "InfiniteWordCarousel" ayarlarının karşılığı.
const EASE = [0.12, 0.23, 0, 0.96] as const;
const ROW = 1.45; // satır yüksekliği (em)

type Props = {
  words: string[];
  moveDuration?: number; // sn
  pauseDuration?: number; // sn
  visibleRows?: number;
  className?: string;
};

export function WordCarousel({
  words,
  moveDuration = 1,
  pauseDuration = 0.05,
  visibleRows = 11,
  className,
}: Props) {
  const n = words.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const step = useRef(0);
  const y = useMotionValue(`${-n * ROW}em`);

  // Yalnızca ekrandayken, sekme öndeyken ve "hareketi azalt" kapalıyken çalışır.
  const inView = useInView(containerRef);
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const running = inView && pageVisible && !reducedMotion;

  useEffect(() => {
    if (!running) return;

    const offset = (s: number) => `${-(n + s) * ROW}em`;
    let controls: AnimationPlaybackControls | undefined;

    const id = setInterval(() => {
      // Bir tur bitince görünmez şekilde başa sar.
      if (step.current >= n) {
        step.current %= n;
        y.jump(offset(step.current));
      }
      step.current += 1;
      controls = animate(y, offset(step.current), { duration: moveDuration, ease: EASE });
    }, (moveDuration + pauseDuration) * 1000);

    return () => {
      clearInterval(id);
      // Yarıda durursa satır arasında kalmasın, hedef satıra otursun.
      controls?.stop();
      y.jump(offset(step.current));
    };
  }, [running, n, moveDuration, pauseDuration, y]);

  // Liste 3 kopya; ortadaki kopyadan başlar.
  const rows = [...words, ...words, ...words];

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        // Kısa ekranlarda alttaki/üstteki öğelere taşmasın
        height: `min(${visibleRows * ROW}em, calc(100svh - 300px))`,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 42%, #000 58%, transparent 100%)",
      }}
    >
      {/* Liste absolute olduğu için genişliği en uzun kelime belirler */}
      <span className="invisible block h-0 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <motion.ul
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `calc(50% - ${ROW / 2}em)`, y }}
      >
        {rows.map((word, i) => (
          <li
            key={i}
            className="whitespace-nowrap"
            style={{ height: `${ROW}em`, lineHeight: `${ROW}em` }}
          >
            {word}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
