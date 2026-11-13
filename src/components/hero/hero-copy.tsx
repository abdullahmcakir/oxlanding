"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { WordCarousel } from "./word-carousel";

// Hero'nun sol sütunu: kim olduğumuz, kayan kelimeler ve iki yol. Bütün hero sahneleri bunu paylaşır.

export const HERO_WORDS = [
  "Website",
  "SEO",
  "Sosyal Medya",
  "Reklam",
  "Tasarım",
  "Yazılım",
  "Logo",
  "Sistem",
  "Slogan",
  "Hizmet",
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function HeroCopy({
  words = HERO_WORDS,
  wordIndex,
  tone = "dark",
  className,
}: {
  words?: string[];
  /** Zemin açıksa metin koyulaşır (tam ekran hero sahnelerinde) */
  tone?: "light" | "dark";
  /** Verilirse kayan kelime sahneyle eşleşir (ör. sinyal hangi kutudaysa o kelime) */
  wordIndex?: number;
  className?: string;
}) {
  const light = tone === "light";

  return (
    <div className={cn("relative z-10", className)}>
      {/* Çark: "Daha etkili" ortadaki satırla hizalı, üst ve alttaki kelimeler sönerek görünür (ilk hero'daki gibi yatay).
          H1 görünen "Daha etkili" + dönen kelimelerin yerine okunan sabit tamamlama (sahneden bağımsız, liste değil);
          çark kendisi aria-hidden. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 1, ease: EASE_OUT }}
        className="flex min-w-0 flex-col items-start text-[34px] font-medium leading-[1] tracking-[-0.045em] sm:flex-row sm:items-center sm:gap-[0.32em] sm:text-[clamp(32px,2.9vw,52px)]"
      >
        <h1 className={cn("whitespace-nowrap transition-colors duration-500", light ? "text-black/55" : "text-white/55")}>
          Daha etkili<span className="sr-only"> web sitesi, SEO, sosyal medya ve reklam</span>
        </h1>
        <WordCarousel
          words={words}
          visibleRows={5}
          index={wordIndex}
          className={cn(
            "transition-colors duration-500 [--word-rows:1] sm:[--word-rows:5]",
            light ? "text-[#0b0b0c]" : "text-white",
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
        className="mt-6 max-w-[480px] sm:mt-4"
      >
        {/* Tanım: parçalar sönük, onları bağlayan "sistem" satırı parlak */}
        <p
          className={cn(
            "text-[clamp(19px,1.45vw,24px)] font-medium leading-[1.3] tracking-[-0.035em] transition-colors duration-500",
            light ? "text-black/40" : "text-white/40",
          )}
        >
          Bir site, bir reklam, bir logo değil;
          <br className="hidden sm:block" />{" "}
          <span className={cn("transition-colors duration-500", light ? "text-[#0b0b0c]" : "text-white")}>
            hepsini birbirine bağlayan bir sistem.
          </span>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={talepUrl()}
            className="group flex h-14 items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-[15px] font-semibold tracking-[-0.02em] text-accent-ink outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Ücretsiz görüşme
            <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
              <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-white" />
            </span>
          </a>
          {/* İkinci yol hap değil, altı çizili bağlantı: iki eş ağırlıklı buton yerine net bir öncelik */}
          <Link
            href="#hizmetler"
            className={cn(
              "group relative flex items-center gap-2.5 py-2 text-[15px] font-semibold tracking-[-0.02em] outline-none transition-colors duration-500",
              light ? "text-[#0b0b0c]" : "text-white",
            )}
          >
            Hizmetleri gör
            <PixelIcon
              variant="arrow"
              className="size-[9px] rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5"
              cellClassName={light ? "fill-[#0b0b0c]" : "fill-white"}
            />
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 bottom-0.5 h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-0 group-focus-visible:scale-x-0",
                light ? "bg-black/30" : "bg-white/30",
              )}
            />
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

