"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import type { ServicePage } from "./service-page-data";

// Referans: tam ekran fotoğraf, solda iki satırlık başlık, alt metin ve iki buton.
// Ana sayfa hero'su gibi 48px uzun: sonraki bölüm yuvarlak köşeleriyle üstüne biner.

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function ServiceHero({ page }: { page: ServicePage }) {
  const { hero, service } = page;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex h-[calc(100svh+48px)] min-h-[688px] items-center overflow-hidden bg-black pb-12">
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          <Image src={hero.image} alt="" fill preload sizes="100vw" quality={85} className="object-cover" />
        </motion.div>
        {/* Yazılar her fotoğrafta okunsun */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative px-4 md:px-[4.5vw]">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
            Hizmetler · {service.title}
          </p>
          <h1 className="mt-5 max-w-[12em] text-[clamp(40px,5.2vw,100px)] font-medium leading-[1.04] tracking-[-0.045em] text-white">
            {hero.title.map((line, i) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 + i * 0.09, duration: 1, ease: EASE_OUT }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: EASE_OUT }}
            className="mt-6 max-w-[34em] text-[clamp(15px,1.05vw,18px)] leading-[1.5] tracking-[-0.01em] text-white/75"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE_OUT }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href={talepUrl({ hizmet: service.slug })}
              className="group inline-flex items-center gap-2.5 rounded-[14px] bg-accent py-3.5 pl-5 pr-4 text-[15px] font-semibold tracking-[-0.01em] text-black transition-[filter] hover:brightness-110"
            >
              Projeni konuşalım
              <PixelIcon
                variant="arrow"
                className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                cellClassName="fill-black"
              />
            </a>
            <Link
              href="#paketler"
              className="inline-flex items-center rounded-[14px] border border-white/20 bg-white/10 px-5 py-3.5 text-[15px] font-semibold tracking-[-0.01em] text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Paketleri gör
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
