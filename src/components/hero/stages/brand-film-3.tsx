"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandFilm2 } from "./brand-film-2";

// Hero sahnesi "3D" (Referans 2'nin gerçek 3B hâli; three.js + GSAP, motor film3-engine.ts'te).
// Sekanslar Referans 2 ile aynı sırada: Sonuç → Marka → Website → SEO → Sosyal Medya → Reklam.
// three.js ilk sayfa koduna girmez: motor bu bileşen tarayıcıda açılınca ayrı parça olarak indirilir.
// WebGL yoksa ya da motor açılamazsa Referans 2 (2B tuval) gösterilir.
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta Sonuç sekansı sabit çizilir.

export const FILM3_WORDS = ["sonuç", "Marka", "Website", "SEO", "Sosyal Medya", "Reklam"];

export function BrandFilm3({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onWordRef = useRef(onWord);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    onWordRef.current = onWord;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || failed) return;
    let cancelled = false;
    let film: import("./film3-engine").Film3 | undefined;
    let io: IntersectionObserver | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let inView = true;
    const sync = () => {
      if (!film) return;
      if (reduced) film.still();
      else if (inView && document.visibilityState === "visible") film.play();
      else film.pause();
    };

    (async () => {
      try {
        const { createFilm3 } = await import("./film3-engine");
        if (cancelled) return;
        // Geliştirmede tek sekansı kilitlemek için: localStorage "ox-film-sekans" = 0–5
        // ve "ox-film-an" = saniye ile sekans içi anı dondurmak için
        let forcedShot: number | undefined;
        let frozenAt: number | undefined;
        try {
          const v = Number(localStorage.getItem("ox-film-sekans") ?? NaN);
          const at = Number(localStorage.getItem("ox-film-an") ?? NaN);
          if (process.env.NODE_ENV === "development" && Number.isInteger(v)) forcedShot = v;
          if (process.env.NODE_ENV === "development" && Number.isFinite(at)) frozenAt = at;
        } catch {}
        const mono =
          getComputedStyle(document.documentElement).getPropertyValue("--font-space-mono").trim() || "ui-monospace, monospace";
        const sans = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
        const created = await createFilm3(canvas, {
          fonts: { sans, mono },
          onShot: (i) => onWordRef.current?.(i),
          forcedShot,
          frozenAt,
        });
        if (cancelled) return created.dispose();
        film = created;
        setReady(true);
        io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        io.observe(canvas);
        sync();
      } catch (err) {
        console.error("3D hero açılamadı, 2B sürüm gösteriliyor", err);
        if (!cancelled) setFailed(true);
      }
    })();

    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", sync);
      io?.disconnect();
      film?.dispose();
    };
  }, [failed]);

  if (failed) return <BrandFilm2 onWord={onWord} className={className} />;
  return (
    <div className={cn("overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("block size-full transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
