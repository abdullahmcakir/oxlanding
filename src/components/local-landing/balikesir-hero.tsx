"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { talepUrl } from "@/lib/links";
import type { Crumb } from "@/lib/seo";
import { HERO, HERO_CHECKS, SECTORS } from "./balikesir-data";

// Hizmet sayfası hero'larıyla aynı iskelet (koyu tam ekran, büyük iki satırlık başlık, iki buton, alttan biner)
// ama fotoğraf yerine kodla çizilen bir "bölge haritası": Balıkesir'in ilçeleri gerçek konumlarına göre
// noktalı ızgarada işaretli. Ofis iddiası değil, hizmet verdiğimiz bölgenin gösterimi (etiket bunu söylüyor).
// Görsel dosyası yok: LCP metnin kendisi, sayfa hızlı açılır.

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Yaklaşık enlem/boylamdan ızgaradaki konuma (0–1): boylam 26.6–28.1, enlem 39.25–40.4
const PINS = [
  { name: "Bandırma", lon: 27.97, lat: 40.35 },
  { name: "Gönen", lon: 27.65, lat: 40.1 },
  { name: "Balıkesir", lon: 27.88, lat: 39.65, main: true },
  { name: "Edremit", lon: 27.02, lat: 39.6 },
  { name: "Burhaniye", lon: 26.97, lat: 39.5 },
  { name: "Ayvalık", lon: 26.69, lat: 39.32 },
].map((p) => ({ ...p, x: (p.lon - 26.6) / 1.5, y: (40.4 - p.lat) / 1.15 }));

export function BalikesirHero({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden bg-[#070707] pb-24 pt-[120px] md:pb-28 md:pt-[150px] lg:flex lg:min-h-[calc(100svh+48px)] lg:items-center">
        {/* Silik ızgara + alttan mavi ışıma: footer'daki ışığın aynı tonu */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:24px_24px]"
          style={{ maskImage: "radial-gradient(ellipse 70% 60% at 70% 45%, #000 10%, transparent 75%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-1/3 right-[-10%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.28),transparent)] blur-2xl"
        />

        <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-14 px-4 md:px-[4.5vw] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Breadcrumbs items={crumbs} tone="dark" />
            <p className="mt-8 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              <PixelIcon variant="plus" className="size-[9px]" />
              {/* CSS uppercase Türkçede "i"yi "I" yapıyor; etiket büyük harfle yazılı gelsin diye toLocaleUpperCase */}
              {HERO.eyebrow.toLocaleUpperCase("tr-TR")}
            </p>
            <h1 className="mt-5 max-w-[17em] text-[clamp(36px,3.9vw,72px)] font-medium leading-[1.04] tracking-[-0.045em] text-white">
              {HERO.title.map((line, i) => (
                <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.09, duration: 1, ease: EASE_OUT }}
                  >
                    {line}
                  </motion.span>
                  {/* Satırlar blok span: boşluk olmadan metin "ileişletmenizi" diye bitişik okunur (H1, arama motoru) */}
                  {i < HERO.title.length - 1 && " "}
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
            >
              <p className="mt-6 text-[clamp(18px,1.4vw,24px)] font-medium leading-[1.3] tracking-[-0.025em] text-white">
                {HERO.lead}
              </p>
              <p className="mt-3 max-w-[38em] text-[clamp(15px,1.05vw,18px)] leading-[1.55] tracking-[-0.01em] text-white/65">
                {HERO.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.9, ease: EASE_OUT }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={talepUrl({ hizmet: "website" })}
                className="group inline-flex items-center gap-2.5 rounded-[14px] bg-accent py-3.5 pl-5 pr-4 text-[15px] font-semibold tracking-[-0.01em] text-accent-ink transition-[filter] hover:brightness-110"
              >
                {HERO.primary}
                <PixelIcon
                  variant="arrow"
                  className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                  cellClassName="fill-accent-ink"
                />
              </a>
              <Link
                href={HERO.secondary.href}
                className="inline-flex items-center rounded-[14px] border border-white/20 bg-white/10 px-5 py-3.5 text-[15px] font-semibold tracking-[-0.01em] text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                {HERO.secondary.label}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 1.1, ease: EASE_OUT }}
            className="relative"
          >
            <RegionMap />
            {/* Haritanın üstüne binen kontrol kartı: sitenin kurulurken baktığımız temel başlıklar */}
            <div className="relative -mt-16 ml-4 w-[min(300px,85%)] rounded-[22px] border border-white/10 bg-[#0c0c0c]/90 p-5 text-white shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-md sm:ml-8 lg:-ml-10">
              <p className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Yayın öncesi kontrol
                <span className="rounded-full bg-accent px-2 py-0.5 text-accent-ink">{HERO_CHECKS.length} / {HERO_CHECKS.length}</span>
              </p>
              <ul className="mt-4 space-y-2.5">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px] tracking-[-0.01em] text-white/85">
                    <span className="grid size-5 shrink-0 place-items-center rounded-[6px] bg-white/10">
                      <PixelIcon variant="plus" className="size-[7px]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}

function RegionMap() {
  return (
    <figure className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-5 pb-20 md:p-7 md:pb-24">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
        <span>Hizmet bölgesi · Balıkesir ve çevresi</span>
        <span className="text-white/30">39.65° K · 27.88° D</span>
      </figcaption>
      <div className="relative mt-5 aspect-[4/3]">
        <div
          aria-hidden
          className="absolute inset-0 rounded-[18px] bg-[radial-gradient(rgb(255_255_255/0.16)_1.2px,transparent_1.2px)] [background-size:16px_16px]"
        />
        <ul>
          {PINS.map((p, i) => {
            // Nokta tam konumda durur; sağ yarıdaki ilçelerin etiketi sola açılır, kenardan taşmasın
            const pos = 8 + p.x * 84;
            const flip = p.x > 0.6;
            return (
            <motion.li
              key={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.6, ease: EASE_OUT }}
              className={`absolute flex -translate-y-1/2 items-center gap-2 ${flip ? "flex-row-reverse" : ""}`}
              style={{
                top: `${8 + p.y * 84}%`,
                ...(flip ? { right: `calc(${100 - pos}% - 6px)` } : { left: `calc(${pos}% - 6px)` }),
              }}
            >
              <span className="relative grid size-3 place-items-center">
                {p.main && <span className="absolute inset-[-6px] animate-ping rounded-[3px] bg-accent/40 motion-reduce:animate-none" />}
                <span className={p.main ? "size-3 bg-accent" : "size-2 bg-white/80"} />
              </span>
              {/* Merkezin etiketi noktanın üstünde ortalı: dar ekranda Edremit/Burhaniye etiketleriyle çakışmasın */}
              <span
                className={
                  p.main
                    ? "absolute bottom-full right-[6px] mb-2.5 translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                    : "font-mono text-[10px] uppercase tracking-[0.1em] text-white/55"
                }
              >
                {p.name}
              </span>
            </motion.li>
            );
          })}
        </ul>
      </div>
      <p className="sr-only">Hizmet verdiğimiz bölgeler: {SECTORS.places.join(", ")} ve Türkiye geneli (online).</p>
    </figure>
  );
}
