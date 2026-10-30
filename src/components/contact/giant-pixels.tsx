"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// İletişim sayfasının arka planı: sitenin piksel dilinde, bütün zemini kaplayan büyük kareler.
// Belli bir şekil çizmez; karelerin bir kısmı yanık durur, kısa aralıklarla biri söner başka rastgele bir kare yanar.
// Kareler düz div; yalnız değişen ikisinin opaklığı CSS geçişiyle değişir (ekran kartında). Tek zamanlayıcı;
// sekme arka plandayken durur, "hareketi azalt"ta sabit kalır.
// Sütun sayısı ekrana göre (6 / 10 / 14); hücre sayısı en uzun düzeni kaplayacak kadar, taşan kısım kırpılır.

const CELLS = 168;
const STEP_MS = 550;
// Aynı anda yanık kareler (sayısı sabit kalır). Sunucu ve ilk render için sabit (hydration uyumu).
const INITIAL = [3, 12, 18, 25, 31, 44, 52, 60, 67, 75, 83, 90, 99, 108, 117, 125];

export function GiantPixels({ className }: { className?: string }) {
  const [lit, setLit] = useState<number[]>(INITIAL);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setLit((prev) => {
        const off = Math.floor(Math.random() * prev.length);
        let on = Math.floor(Math.random() * CELLS);
        while (prev.includes(on)) on = (on + 1) % CELLS;
        return prev.map((cell, i) => (i === off ? on : cell));
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className={cn("grid grid-cols-6 gap-1.5 sm:grid-cols-10 lg:grid-cols-14", className)}>
      {Array.from({ length: CELLS }, (_, i) => (
        <span key={i} className="relative aspect-square">
          {/* Boş hücreler ızgarayı belli eder */}
          <span className="absolute inset-0 rounded-[14%] ring-1 ring-white/[0.035]" />
          <span
            className={cn(
              // Gölge/ışıltı yok: kare etrafında yuvarlak hale oluşturuyordu; pikseller net kalsın
              "absolute inset-0 rounded-[14%] bg-accent/[0.16] transition-opacity duration-[1400ms] ease-in-out",
              lit.includes(i) ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
      ))}
    </div>
  );
}
