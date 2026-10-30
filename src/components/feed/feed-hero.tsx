"use client";

import Image from "next/image";
import { useRef } from "react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";

// Referans: 600px yüksekliğinde bulanık fotoğraf, alttan koyulaşan örtü, sol altta dev başlık,
// sağ altta aşağı ok. Fotoğraf kaydırırken yavaş kayar (parallax); bu yüzden kutudan taşkın.

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function FeedHero({ title, image, scrollTarget }: { title: string; image: string; scrollTarget: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} className="relative h-[600px] overflow-hidden bg-[#090909] text-white">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[90px] h-[780px]">
          <Image src={image} alt="" fill preload sizes="100vw" quality={80} className="object-cover blur-[5px]" />
        </motion.div>
        {/* Alt üçte ikisi koyulaşır, başlık her fotoğrafta okunur */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-transparent from-35% to-[#090909]" />

        <div className="relative flex h-full items-end justify-between gap-6 px-4 pb-8 md:px-[34px] md:pb-9">
          {/* Satır maskesi alta uzatıldı: "Ç, ş, y" gibi harflerin kuyruğu kesilmesin */}
          <h1 className="-mb-[0.2em] overflow-hidden pb-[0.2em] text-[clamp(52px,8.5vw,128px)] font-semibold leading-[0.95] tracking-[-0.045em]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15, duration: 1, ease: EASE_OUT }}
            >
              {title}
            </motion.span>
          </h1>
          <a
            href={scrollTarget}
            aria-label="İçeriğe kaydır"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
          >
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <PixelIcon variant="arrow" className="size-[16px] rotate-90" cellClassName="fill-white" />
            </motion.span>
          </a>
        </div>
      </section>
    </MotionConfig>
  );
}
