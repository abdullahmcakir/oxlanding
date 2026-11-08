"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { QR_MATRIX } from "./mekanda-data";

// Okutulabilir QR (https://mekanda.menu), OX piksel dilinde: kare modüller arasında ince boşluk.
// Ekrana girince modüller merkezden dışa doğru belirir, üstünden tarama çizgisi geçer.
// Okunabilirlik için: modül boşluğu küçük (hücrenin ~%12'si), köşe işaretleri tam dolu, çevrede beyaz boşluk.
// "Hareketi azalt" açıksa animasyon yok (motion-reduce).

const N = QR_MATRIX.length;

export function PixelQr({ className, scan = true }: { className?: string; scan?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const shown = useInView(ref, { once: true, margin: "-10%" });
  const c = (N - 1) / 2;

  return (
    <div className={cn("relative", className)}>
      <svg ref={ref} viewBox={`0 0 ${N} ${N}`} className="block size-full" shapeRendering="crispEdges" role="img" aria-label="mekanda.menu adresine giden QR kod">
        {QR_MATRIX.flatMap((row, y) =>
          [...row].map((cell, x) => {
            if (cell !== "#") return null;
            const delay = Math.hypot(x - c, y - c) * 28;
            return (
              <rect
                key={`${x}-${y}`}
                x={x + 0.06}
                y={y + 0.06}
                width={0.88}
                height={0.88}
                rx={0.12}
                fill="#111"
                className={cn(
                  "transition-opacity duration-500 motion-reduce:transition-none",
                  shown ? "opacity-100" : "opacity-0 motion-reduce:opacity-100",
                )}
                style={{ transitionDelay: `${delay}ms` }}
              />
            );
          }),
        )}
      </svg>
      {/* Tarama çizgisi: QR belirdikten sonra yavaşça aşağı-yukarı geçer */}
      {scan && shown && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[-6%] top-0 h-[3px] rounded-full bg-[#A8CFA4] shadow-[0_0_0_1px_rgba(168,207,164,0.25)] motion-safe:animate-[mekanda-scan_3.6s_ease-in-out_0.9s_infinite] motion-reduce:hidden"
        />
      )}
    </div>
  );
}
