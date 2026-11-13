"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import { HeroCopy } from "./hero-copy";
import { BrandFilmSix, FINAL_WORDS } from "./stages/brand-film-six";

// Hero: tam ekran marka filmi (brand-film-six.tsx, Final sırası) arkada, metin sol altta.
// Sahne açık zemine geçince onTone ile metin koyulaşır; her sahnenin kelimesi onWord ile soldaki çarka gider.

// Metin sol alta oturur (ortada havada durmaz); alt kenarı künye satırının üstünde sabit bir boşlukla biter
const COPY_WRAP = "relative z-10 flex min-h-[calc(100svh)] items-end px-4 pb-24 pt-28 md:px-[4.5vw] md:pb-[118px]";

export function Hero() {
  const [word, setWord] = useState(0);
  const [tone, setTone] = useState<"light" | "dark">("dark");

  return (
    // Alttaki beyaz bölüm, hero'nun son 48px'inin üstüne yuvarlak köşeli bir sayfa gibi biner.
    <section className="relative min-h-[calc(100svh+48px)] overflow-hidden bg-[#030304] text-white">
      <BrandFilmSix bleed final onTone={setTone} onWord={setWord} className="absolute inset-0" />
      <div className={COPY_WRAP}>
        <HeroCopy words={FINAL_WORDS} wordIndex={word} tone={tone} className="w-full min-w-0 lg:w-[45%]" />
      </div>

      {/* Alt satır: künye + kaydırma işareti (alttaki 48px'in hemen üstünde) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className={cn(
          "absolute inset-x-4 bottom-[72px] z-20 hidden items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 md:inset-x-[4.5vw] md:flex",
          tone === "light" ? "text-black/45" : "text-white/35",
        )}
      >
        <span>İstanbul merkezli dijital ajans</span>
        <a href="#hakkimizda" aria-label="Aşağı kaydır" className="flex items-center gap-2.5 transition-colors hover:text-white">
          Kaydır
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <PixelIcon variant="arrow" className="size-[9px] rotate-90" />
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
}
