"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

// Sonsuz yatay kayan şerit. İçerik iki kez basılır, ilk kopyanın genişliği kadar kayıp başa sarar.
// Hover'da durur (Krestin'deki gibi), ekran dışındayken çalışmaz.
export function Marquee({
  children,
  speed = 24, // px / sn
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  /** Sağa doğru kayar (iki şeridi zıt yönlerde akıtmak için). */
  reverse?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const [hovered, setHovered] = useState(false);
  const [duration, setDuration] = useState(0);

  // Süre içerik genişliğinden hesaplanır ki hız her ekran boyunda sabit kalsın.
  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setDuration(entry.contentRect.width / speed));
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  const running = inView && !hovered && duration > 0;

  return (
    <div
      ref={rootRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex w-max animate-[marquee_linear_infinite] will-change-transform motion-reduce:animate-none"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: running ? "running" : "paused",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {/* Aralık padding ile verilir; iki kopya birebir aynı genişlikte olsun diye */}
        <div ref={setRef} className="flex shrink-0 [&>*]:mr-2">
          {children}
        </div>
        <div className="flex shrink-0 [&>*]:mr-2" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
