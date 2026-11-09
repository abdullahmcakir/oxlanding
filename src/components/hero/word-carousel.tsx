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
  /** Verilirse kendi zamanlayıcısı çalışmaz; bu sıradaki kelimeye (ileri yönde) kayar. Hero sahnesiyle eşleşmek için. */
  index?: number;
  className?: string;
};

export function WordCarousel({
  words,
  moveDuration = 1,
  pauseDuration = 0.05,
  visibleRows = 11,
  index,
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
  const controlled = index !== undefined;

  // Dışarıdan yönetilen mod: istenen kelimeye en kısa ileri yoldan kayar
  useEffect(() => {
    if (!controlled) return;
    const offset = (s: number) => `${-(n + s) * ROW}em`;
    const ahead = (((index - step.current) % n) + n) % n;
    if (ahead === 0) return;
    if (reducedMotion) {
      step.current = index;
      y.jump(offset(step.current));
      return;
    }
    // Bir turu aşacaksa önce görünmez şekilde başa sar
    if (step.current + ahead > 2 * n - 1) {
      step.current %= n;
      y.jump(offset(step.current));
    }
    step.current += ahead;
    const controls = animate(y, offset(step.current), { duration: moveDuration * Math.min(ahead, 2) * 0.7, ease: EASE });
    return () => controls.stop();
  }, [controlled, index, n, moveDuration, reducedMotion, y]);

  useEffect(() => {
    if (!running || controlled) return;

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
  }, [running, controlled, n, moveDuration, pauseDuration, y]);

  // Liste 3 kopya; ortadaki kopyadan başlar.
  const rows = [...words, ...words, ...words];

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        // Kısa ekranlarda alttaki/üstteki öğelere taşmasın
        height: `min(calc(var(--word-rows, ${visibleRows}) * ${ROW}em), calc(100svh - 300px))`,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 42%, #000 58%, transparent 100%)",
      }}
    >
      {/* Liste absolute olduğu için genişliği ekranda en geniş duran kelime belirler: hepsi görünmez şekilde
          üst üste konur (harf sayısına bakmak yetmiyor; "Website" ile "Yazılım" aynı uzunlukta ama farklı genişlikte) */}
      <span className="invisible grid h-0 w-max">
        {words.map((word, i) => (
          <span key={i} className="col-start-1 row-start-1 whitespace-nowrap">
            {word}
          </span>
        ))}
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
