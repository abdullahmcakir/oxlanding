"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Reveal } from "@/components/about/about-cards";
import { cn } from "@/lib/utils";

// Düzen referansı: clean-tuna-722417.framer.app/page-2, "Markanız İçin Neler Üretiyoruz?" bölümü:
// fotoğraf zemin, beyaz başlık, dört kare kart; sol üstteki nabız düğmesine basınca kart açılır
// (zemin koyulaşır, başlık yukarı kayar, açıklama belirir).
// İçerik ana sayfadaki hizmetleri tekrar etmesin diye çalışma sürecine çevrildi.
// Zemin: hero'daki fotoğrafın başka bir kadrajı (hero'ya gönderme). Metinler YER TUTUCU.

const STEPS = [
  {
    title: "Keşif",
    desc: "Markanızı, hedef kitlenizi ve rakiplerinizi dinleyerek başlıyoruz; neyin işe yaradığını ve neyin eksik olduğunu birlikte netleştiriyoruz.",
  },
  {
    title: "Strateji",
    desc: "Hedefleri ölçülebilir metriklere çeviriyor; kanalları, bütçeyi ve takvimi tek bir yol haritasında topluyoruz.",
  },
  {
    title: "Üretim",
    desc: "Tasarım, yazılım ve içerik ekipleri aynı plan üzerinde çalışır; her teslim onayınızdan geçerek yayına çıkar.",
  },
  {
    title: "Büyüme",
    desc: "Yayından sonra veriyi izliyor, test ediyor ve iyileştiriyoruz; her ay neyi neden değiştirdiğimizi raporluyoruz.",
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Process() {
  return (
    <MotionConfig reducedMotion="user">
      {/* pb: ilkeler bölümü -mt-12 ile 48px üstüne biner; kartların altındaki 110px boşluk korunsun diye +48px. */}
      <section id="surec" className="relative overflow-hidden bg-[#111] px-4 pb-[158px] pt-[110px] md:px-[4.5vw]">
        {/* Hero fotoğrafının sağ yarısı: koşucu kadraj dışında, yalnız boş kulvarlar ve gölgeler kalır.
            Kutu bölümün iki katı genişlikte ve sağa yaslı; görsel ona göre kaplanınca sağ yarısı görünür. */}
        <div aria-hidden className="absolute inset-y-0 right-0 w-[200%]">
          <Image
            src="/images/page-hero/hakkimizda.jpg"
            alt=""
            fill
            sizes="200vw"
            className="object-cover object-[100%_45%]"
          />
        </div>
        {/* Fotoğraf hangi tonda olursa olsun başlık ve kartlar okunur kalsın */}
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative">
          <Reveal>
            <h2 className="max-w-[16em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.12] tracking-[-0.045em] text-white lg:w-1/2">
              Birlikte nasıl çalışıyoruz?
            </h2>
          </Reveal>

          <ol className="mt-8 grid gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
            {STEPS.map((step, i) => (
              <StepCard key={step.title} index={i} {...step} />
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}

function StepCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  const [open, setOpen] = useState(false);

  return (
    // Giriş: ana sayfadaki Reveal ile aynı (li'de; Reveal'in div'i ol > li yapısını bozardı)
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: (index + 1) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-60 w-full flex-col items-center justify-center rounded-[22px] px-8 text-center md:px-5 xl:px-8 transition-colors duration-500 md:aspect-square md:h-auto",
          open ? "bg-[#EBEBEB]" : "bg-[#F5F5F5] hover:bg-[#F0F0F0]",
        )}
      >
        <PulseIcon open={open} className="absolute left-4 top-4" />
        <span className="absolute right-5 top-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          0{index + 1}
        </span>

        {/* Açıklamanın yüksekliği açılırken büyür; ortalı kapsayıcı her karede yeniden ortalandığı için
            başlık kendiliğinden yukarı kayar. */}
        <span className="text-[clamp(26px,2.5vw,48px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#111]">
          {title}
        </span>
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              key="desc"
              initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="block overflow-hidden"
            >
              <span className="mx-auto block max-w-[30ch] pt-3 text-[13px] xl:text-[15px] 2xl:text-[16px] leading-[1.45] tracking-[-0.01em] text-[#333]">
                {desc}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}

/** Referanstaki "Pulse Icon": kapalıyken nabız gibi atan daire; açılınca + çarpıya döner. */
function PulseIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-[22px] place-items-center", className)}>
      {!open && <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />}
      <span className="relative grid size-[22px] place-items-center rounded-full bg-accent text-black">
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={cn(
            "size-[14px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-45",
          )}
        >
          <path d="M9 3.5v11M3.5 9h11" />
        </svg>
      </span>
    </span>
  );
}
