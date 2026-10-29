"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { QuestionCard } from "./question-card";
import { WordCarousel } from "./word-carousel";

const WORDS = [
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

// Geçici video; tasarım bitince kendi dosyamızla değişecek.
const HERO_VIDEO =
  "https://res.cloudinary.com/durdzswls/video/upload/q_90/v1/reels/k9wv5dzwdcxfga6orb2o?_a=DATAg1AAZAA0";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    // Alttaki beyaz bölüm, hero'nun son 48px'inin üstüne yuvarlak köşeli bir sayfa gibi biner.
    // Hero bu yüzden 48px uzun; ilk ekrandaki görünüm değişmez, alt öğeler 48px yukarıda konumlanır.
    <section className="relative h-[calc(100svh+48px)] min-h-[688px] overflow-hidden bg-black">
      <video
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-1000",
          videoReady ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Video açık tonlara girdiğinde yazılar okunur kalsın */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      <h1 className="sr-only">Daha etkili {WORDS.join(", ")}</h1>

      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1, ease: EASE_OUT }}
        className="absolute bottom-12 top-0 left-4 flex items-center gap-[0.5em] text-[clamp(28px,2.35vw,46px)] tracking-[-0.025em] text-[#E3DBD8] md:left-6"
      >
        <span className="whitespace-nowrap">Daha etkili</span>
        <WordCarousel words={WORDS} />
      </motion.div>

      {/* Sol alt: tanım + künye */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE_OUT }}
        className="absolute bottom-18 left-6 hidden max-w-[360px] md:block"
      >
        <p className="text-[15px] leading-[1.45] tracking-[-0.01em] text-neutral-300">
          İstanbul merkezli dijital ajans. Reklam, tasarım ve yazılım tek çatı
          altında.
        </p>
        <div className="mt-4 border-t border-white/10 pt-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          Showreel 2026 · İstanbul, TR
        </div>
      </motion.div>

      {/* Alt orta: kaydırma işareti */}
      <motion.a
        href="#hakkimizda"
        aria-label="Aşağı kaydır"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="group absolute bottom-18 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-white md:flex"
      >
        Kaydır
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelIcon variant="arrow" className="size-[9px] rotate-90" />
        </motion.span>
      </motion.a>

      <QuestionCard className="absolute bottom-15 right-4" />
    </section>
  );
}
