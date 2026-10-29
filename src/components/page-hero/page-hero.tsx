"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";

// Ana sayfa dışındaki sayfaların ortak hero'su.
// Düzen referansı: Behance "Carter & Partners" hero'su: üstte kenarı düz kesilmiş fotoğraf şeridi,
// altında düz renkli alan, büyük başlık ve alt metin.
//
// Taşma efekti (`cutout`): aynı fotoğrafın yalnızca taşacak öğenin kaldığı, arka planı silinmiş PNG'si.
// İki görsel aynı ölçü ve konumda üst üste durur; zemin fotoğrafı şerit yüksekliğinde kırpılır,
// cutout kırpılmaz. Böylece öğe şeritten koyu alana iniyormuş gibi görünür.
// İki dosyanın en-boy oranı ve kadrajı birebir aynı olmalı, yoksa katmanlar kayar.
//
// Kadraj `anchor` ile verilir: fotoğrafın yukarıdan bu oranındaki çizgi şeridin alt kenarına oturur.
// Yüzdelik object-position yerine bu kullanılıyor; fotoğraf genişliğe, şerit ekran yüksekliğine göre
// ölçeklendiği için yüzdelik kadrajda taşan kısım her ekranda farklı çıkıyordu.

type PageHeroProps = {
  /** Başlık satırları; her eleman ayrı satır. */
  title: string[];
  description: string;
  image: string;
  cutout?: string;
  /** Fotoğrafın en-boy oranı (genişlik / yükseklik). */
  aspect: number;
  /** Fotoğrafın yukarıdan hangi oranı (0–1) şeridin alt kenarına gelsin. */
  anchor?: number;
  /** Başlığın üst kenarı fotoğrafın hangi oranına (0–1) denk gelsin. anchor'dan büyük olmalı. */
  titleAnchor?: number;
  /** Alttaki künye satırının sol metni (ör. "Hakkımızda · İstanbul, TR"). */
  meta: string;
  /** "Kaydır" bağlantısının hedefi. */
  scrollTarget?: string;
  className?: string;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Görsel genişliği en az bölüm genişliği; dar/dikey ekranlarda şeridi üstten boşluksuz dolduracak kadar
// büyür (yatayda ortalanır). top: anchor çizgisini şeridin kenarına getirir.
const IMG_STYLE = {
  width: "var(--img-w)",
  height: "auto",
  top: "calc(var(--photo-h) - var(--anchor) * var(--img-w) / var(--aspect))",
} as const;
const IMG_CLASS = "absolute left-1/2 max-w-none -translate-x-1/2";

export function PageHero({
  title,
  description,
  image,
  cutout,
  aspect,
  anchor = 0.6,
  titleAnchor = anchor + 0.1,
  meta,
  scrollTarget = "#icerik",
  className,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // İki katman birlikte kayar; aralarındaki hiza bozulmaz.
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120]);
  const intrinsic = { width: 2400, height: Math.round(2400 / aspect) };

  return (
    // reducedMotion="user": hareketi azalt açıksa kayma/ölçek animasyonları atlanır.
    // (initial değerleri useReducedMotion'a bağlamak hydration uyuşmazlığı veriyordu: sunucuda tercih bilinmiyor.)
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        className={cn(
          // Sonraki bölüm -mt-12 ile 48px üstüne biner (ana sayfa düzeni); hero o kadar uzun, ilk ekran değişmez.
          // isolate: iç katmanların z-index'i binen bölümle yarışmasın.
          "@container relative isolate min-h-[calc(max(100svh,720px)+48px)] overflow-hidden bg-[#111] text-white",
          // --photo-h: görünen fotoğraf şeridi · --img-w: anchor çizgisi şeridin altında kalmayacak kadar geniş
          "[--photo-h:max(52svh,320px)] [--img-w:max(100cqw,calc(var(--photo-h)*var(--aspect)/var(--anchor)))]",
          "[--title-top:calc(var(--photo-h)+(var(--title-anchor)-var(--anchor))*var(--img-w)/var(--aspect))]",
          className,
        )}
        style={{
          ["--aspect" as string]: aspect,
          ["--anchor" as string]: anchor,
          ["--title-anchor" as string]: titleAnchor,
        }}
      >
        {/* Katman sırası: fotoğraf < cutout < yazı. Cutout başlığın arkasından geçer, derinlik buradan gelir. */}
        <ArtLayer y={artY} className="z-0">
          <div className="absolute inset-x-0 top-0 h-(--photo-h) overflow-hidden">
            <Image
              src={image}
              alt=""
              {...intrinsic}
              loading="eager"
              quality={85}
              sizes="max(100vw, 900px)"
              className={IMG_CLASS}
              style={IMG_STYLE}
            />
          </div>
        </ArtLayer>

        {/* Başlığın üstü fotoğrafın `titleAnchor` oranına denk gelir; boyutu da genişliğe göre ölçeklenir.
            Böylece cutout her ekranda başlığın aynı harflerine, aynı miktarda biner. */}
        <div className="relative z-10 flex min-h-[calc(max(100svh,720px)+48px)] flex-col px-4 pb-20 pt-(--title-top) md:px-[4.5vw] md:pb-[88px]">
          {/* Gölge koyu zeminde görünmez; yalnız harfler beyaz paraşütün üstüne gelince kenarlarını belirginleştirir. */}
          <h1 className="text-[clamp(40px,5.2vw,120px)] font-medium leading-[1.02] tracking-[-0.045em] [text-shadow:0_2px_18px_rgb(0_0_0/0.3)]">
            {title.map((line, i) => (
              // Satır maskesi: alt kısım biraz uzatıldı, "g/ş" gibi harflerin kuyruğu kesilmesin
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
            className="mt-6 max-w-[520px] text-[clamp(15px,1.05vw,18px)] leading-[1.45] tracking-[-0.01em] text-white/75"
          >
            {description}
          </motion.p>

          {/* Künye satırı: ana sayfa hero'sundaki künye + "Kaydır" dili. Bölümün dibine yaslanır,
              içerik uzarsa en az 48px aşağı itilir. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-auto pt-12"
          >
            <div className="flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[11px] font-bold uppercase text-neutral-500">
              <span className="tracking-[0.12em]">{meta}</span>
              <a
                href={scrollTarget}
                className="group flex items-center gap-2.5 tracking-[0.16em] transition-colors hover:text-white"
              >
                Kaydır
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PixelIcon variant="arrow" className="size-[9px] rotate-90" />
                </motion.span>
              </a>
            </div>
          </motion.div>
        </div>

        {cutout && (
          <ArtLayer y={artY} className="pointer-events-none z-[5]">
            <Image
              src={cutout}
              alt=""
              {...intrinsic}
              loading="eager"
              quality={85}
              sizes="max(100vw, 900px)"
              className={IMG_CLASS}
              style={IMG_STYLE}
            />
          </ArtLayer>
        )}
      </section>
    </MotionConfig>
  );
}

/** Fotoğraf ve cutout katmanı: ikisi ayrı katmanda (aralarında yazı var) ama aynı kayma ve ölçekle hareket eder. */
function ArtLayer({
  y,
  className,
  children,
}: {
  y: MotionValue<number>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div aria-hidden style={{ y }} className={cn("absolute inset-0", className)}>
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
        className="absolute inset-0 origin-top"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
