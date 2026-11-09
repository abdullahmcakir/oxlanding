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
      <h1 className="sr-only">OX Dijital: daha etkili {words.join(", ")}</h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8, ease: EASE_OUT }}
        className={cn(
          "flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-500",
          light ? "text-black/55" : "text-white/50",
        )}
      >
        <span className="size-2 rounded-[2px] bg-accent" aria-hidden />
        OX Dijital · Dijital ajans
      </motion.p>

      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 1, ease: EASE_OUT }}
        className="mt-5 flex min-w-0 flex-col items-start text-[40px] font-medium leading-[0.91] tracking-[-0.06em] sm:text-[52px] lg:text-[clamp(58px,5.5vw,90px)]"
      >
        <span className={cn("whitespace-nowrap transition-colors duration-500", light ? "text-black/60" : "text-white/65")}>Daha etkili</span>
        <WordCarousel
          words={words}
          visibleRows={3}
          index={wordIndex}
          className={cn("mt-1 transition-colors duration-500 [--word-rows:1] lg:[--word-rows:3]", light ? "text-[#0b0b0c]" : "text-white")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
        className="mt-7 max-w-[500px]"
      >
        <p
          className={cn(
            "max-w-[460px] text-[clamp(15px,1.05vw,18px)] leading-[1.55] tracking-[-0.015em] transition-colors duration-500",
            light ? "text-black/65" : "text-white/62",
          )}
        >
          İstanbul merkezli, Türkiye geneline hizmet veren dijital ajans. Reklam, tasarım ve yazılım tek çatı altında;
          tek ekip, tek plan.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={talepUrl()}
            className="group flex h-14 items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-[15px] font-semibold tracking-[-0.02em] text-accent-ink outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Ücretsiz görüşme
            <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
              <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-white" />
            </span>
          </a>
          <Link
            href="#hizmetler"
            className={cn(
              "flex h-14 items-center rounded-full px-6 text-[15px] font-semibold tracking-[-0.02em] ring-1 outline-none transition-colors duration-500 focus-visible:ring-2",
              light
                ? "text-[#0b0b0c] ring-black/20 hover:bg-black/[0.05] focus-visible:ring-black/50"
                : "text-white ring-white/20 hover:bg-white/[0.06] focus-visible:ring-white/60",
            )}
          >
            Hizmetleri gör
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
