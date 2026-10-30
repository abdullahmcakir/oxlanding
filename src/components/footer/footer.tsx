"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/navbar/logo";
import { CookieSettingsButton } from "@/components/cookie/cookie-ask";
import { LEGAL_DOCS } from "@/components/legal/legal-data";
import { useIstanbulTime } from "@/hooks/use-istanbul-time";

// Framer sitesindeki footer (clean-tuna-722417.framer.app) — katman yapısı, ölçüler ve animasyonlar
// canlı siteden ölçülerek birebir kuruldu. Alıntı Framer'daki yer tutucu; sağ alttaki bağlantılar YER TUTUCU.
const LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "X", href: "#" },
  { label: "WhatsApp", href: "#" },
];

// Toz dokusu 660×371; 495px genişlikte döşenir → bir döşeme yüksekliği:
const DUST_TILE_H = (495 * 371) / 660;
const DUST_SPEED = 25; // px/sn, yukarı

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const time = useIstanbulTime("footer");
  const lenis = useLenis();

  return (
    // Framer'daki gibi beyaz zeminde, kenarlardan 24px içeride
    <footer className="bg-background p-3 md:p-6">
      <div
        ref={ref}
        className="relative h-[clamp(440px,30.6vw,580px)] overflow-hidden rounded-[24px] bg-[#171717] text-white"
      >
        {/* Katman kutusu (Framer "AnimOne", 520px): footer'dan 13px yukarı, 40px aşağı taşar.
            Zemindeki degrade yalnızca sağ/sol 1px kenarda görünür; turuncu kısmı ve ışımanın
            parlak çekirdeği footer'ın altında kalıp kırpılır. */}
        <div
          className="absolute inset-x-0 -bottom-[40px] -top-[13px] overflow-hidden rounded-[16px]"
          style={{ background: "linear-gradient(rgb(23,23,23) 65%, rgb(206,48,0) 100%)" }}
        >
          <div className="absolute inset-x-px bottom-px top-px">
            {/* Grenli koyu zemin */}
            {/* unoptimized: WebP'ye sıkıştırınca zemindeki ince doku kayboluyor */}
            <Image
              src="/images/footer/background.png"
              alt=""
              fill
              unoptimized
              className="object-cover object-bottom"
            />

            {/* Işıma: 30px aşağı-yukarı, 6.3 sn döngü. Parlak çekirdeği footer'ın altında kalıp kırpılır. */}
            <motion.div
              className="absolute inset-0"
              animate={inView ? { y: [0, 30, 0] } : { y: 0 }}
              transition={inView ? { duration: 6.3, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            >
              {/* unoptimized: dönüştürülünce saydam ışımanın tonları değişiyor */}
              <Image src="/images/footer/glow.png" alt="" fill unoptimized className="object-cover object-bottom" />
            </motion.div>

            {/* Toz: döşenmiş parçacıklar sürekli yükselir, ışımanın üstünde color-dodge ile parlar */}
            <div className="absolute inset-0 opacity-[0.49] mix-blend-color-dodge">
              <motion.div
                className="absolute inset-0 bg-repeat"
                style={{ backgroundImage: "url(/images/footer/texture.png)", backgroundSize: "495px auto" }}
                animate={inView ? { backgroundPositionY: [0, -DUST_TILE_H] } : undefined}
                transition={{ duration: DUST_TILE_H / DUST_SPEED, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Üst satır: alıntı + saat / telif */}
        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-6 text-[16px] leading-6 md:inset-x-[21px] md:top-[21px]">
          <p>
            Buraya çok havalı bir cümle yazalım.
            <br />– OX Dijital
          </p>
          <p className="text-right tabular-nums">
            <span className="block">{time ?? " "}</span>
            {/* Yıl, tarayıcıda çalışan saatten alınır (render'da new Date() önbellekli prerender'da donar) */}
            OX Dijital © {time ? time.slice(-4) : "    "}
            <span className="mt-1 flex flex-wrap justify-end gap-x-3 text-[13px] text-white/50">
              {LEGAL_DOCS.map((d) => (
                <Link key={d.href} href={d.href} className="transition-colors hover:text-white">
                  {d.label}
                </Link>
              ))}
              <CookieSettingsButton className="transition-colors hover:text-white">Çerez tercihleri</CookieSettingsButton>
            </span>
          </p>
        </div>

        {/* Orta: logo kutusu (Framer "Large Highlight" katmanları) */}
        <div className="absolute left-1/2 top-1/2 size-[152px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-[linear-gradient(rgb(38,38,38)_0%,rgb(15,15,15)_100%)]">
          {/* Alt kenarda turuncu kenar ışığı */}
          <div className="absolute inset-0 rounded-[16px] bg-[radial-gradient(41%_40%_at_50%_100%,rgb(255,98,7)_6.3%,rgba(255,98,7,0)_100%)]" />
          {/* 1px içeride yüzey + hafif turuncu yansıma */}
          <div className="absolute inset-px rounded-[15px] bg-[#171717]" />
          <div className="absolute inset-px rounded-[15px] bg-[radial-gradient(100%_100%_at_50%_100%,rgb(255,98,7)_0%,rgba(255,98,8,0)_100%)] opacity-15" />
          <Logo className="absolute left-1/2 top-1/2 size-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Alt satır: "was here" logosu + bağlantılar + yukarı çık */}
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 md:inset-x-[21px] md:bottom-[21px]">
          <span className="relative block size-[75px]" aria-hidden>
            <Image src="/images/logo-was-here.png" alt="" fill sizes="96px" className="object-contain" />
          </span>

          <div className="flex items-center gap-3">
            <ul className="hidden flex-wrap justify-end gap-x-2.5 text-[16px] md:flex">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-opacity hover:opacity-70">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              aria-label="Sayfanın başına dön"
              onClick={() => lenis?.scrollTo(0, { duration: 1.6 })}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#2AABEE] text-white transition-transform duration-300 hover:-translate-y-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
