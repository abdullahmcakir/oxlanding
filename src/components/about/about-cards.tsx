"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

// Her kutu bağımsız; yerleşim about.tsx'teki ızgarada değiştirilir.
// Kutular ~190px yükseklikteki kompakt hücrelere göre ölçülendirildi.
// Rakamlar ve metinler YER TUTUCU — gerçek verilerle değiştirilecek.

type CardProps = { className?: string };

const CARD = "rounded-[28px] p-6";

export function RevenueCard({ className }: CardProps) {
  return (
    <div className={cn(CARD, "flex flex-col justify-between bg-[#1A1A1A] text-white", className)}>
      <span className="grid size-11 place-items-center rounded-[13px] bg-white text-[#1A1A1A]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden
        >
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      </span>
      <div>
        <p className="text-[40px] leading-none tracking-[-0.04em]">120+</p>
        <p className="mt-2 text-[14px] font-medium leading-[1.35] tracking-[-0.01em] text-white/85">
          Farklı sektörlerden markalarla tamamlanan proje.
        </p>
      </div>
    </div>
  );
}

const AVATARS = [
  { initials: "AY", bg: "from-[#9BC6A4] to-[#4E7F5B]" },
  { initials: "MK", bg: "from-[#C9B8F2] to-[#7D64C8]" },
  { initials: "EŞ", bg: "from-[#F6E56B] to-[#D9B81F]" },
  { initials: "DT", bg: "from-[#7D86C9] to-[#3E4592]" },
];

export function ClientsCard({ className }: CardProps) {
  return (
    <div
      className={cn(
        CARD,
        "flex flex-col items-center justify-center gap-3.5 border border-dashed border-neutral-400",
        className,
      )}
    >
      {/* Gerçek müşteri/ekip fotoğrafları gelince img ile değişecek */}
      <div className="flex -space-x-2.5">
        {AVATARS.map((a) => (
          <span
            key={a.initials}
            className={cn(
              "grid size-12 place-items-center rounded-full bg-gradient-to-br text-[12px] font-semibold text-white ring-[3px] ring-white",
              a.bg,
            )}
          >
            {a.initials}
          </span>
        ))}
      </div>
      <p className="text-[15px] tracking-[-0.01em] text-[#1A1A1A]">
        <span className="font-semibold">40+</span> mutlu müşteri
      </p>
    </div>
  );
}

export function MultiplierCard({ className }: CardProps) {
  return (
    <div className={cn(CARD, "flex flex-col justify-end bg-[#F1F1F1]", className)}>
      <p className="text-[64px] leading-none tracking-[-0.04em] text-[#1A1A1A]">3x</p>
      <p className="mt-3 text-[15px] leading-[1.4] tracking-[-0.01em] text-neutral-600">
        Ortalama reklam getirisi artışı.
      </p>
    </div>
  );
}

const TICKS = 40;

export function SpeedCard({ className }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className={cn(CARD, "flex flex-col justify-between gap-5 bg-[#F1F1F1]", className)}>
      <div className="relative mx-auto mt-2 grid size-[170px] shrink-0 place-items-center">
        {/* Yalnızca ekrandayken döner */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 size-full animate-[spin_24s_linear_infinite]"
          style={{ animationPlayState: inView ? "running" : "paused" }}
          aria-hidden
        >
          {Array.from({ length: TICKS }, (_, i) => {
            const angle = (i / TICKS) * Math.PI * 2;
            const long = i % 2 === 0;
            const r1 = long ? 70 : 78;
            const r2 = 96;
            // Sunucu ve tarayıcı float sonuçları son basamakta farklılaşabiliyor (hydration uyarısı); yuvarlanır.
            const r = (v: number) => Math.round(v * 100) / 100;
            // Açıya göre soluklaşan çizgiler
            const opacity = r(0.15 + 0.85 * (0.5 + 0.5 * Math.cos(angle - Math.PI / 2)));
            return (
              <line
                key={i}
                x1={r(100 + Math.cos(angle) * r1)}
                y1={r(100 + Math.sin(angle) * r1)}
                x2={r(100 + Math.cos(angle) * r2)}
                y2={r(100 + Math.sin(angle) * r2)}
                stroke="#1A1A1A"
                strokeWidth={2.4}
                strokeLinecap="round"
                opacity={opacity}
              />
            );
          })}
        </svg>
        <span className="relative grid size-16 place-items-center rounded-full bg-[#1A1A1A] text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[22px]"
            aria-hidden
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </span>
      </div>
      <div>
        <p className="text-[20px] tracking-[-0.02em] text-[#1A1A1A]">Hızlı teslim</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
          Fikirden yayına haftalar değil, günler içinde.
        </p>
      </div>
    </div>
  );
}

export function QuoteCard({ className }: CardProps) {
  return (
    <div
      className={cn(
        CARD,
        "flex flex-col justify-between gap-6 border border-neutral-200 bg-white",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <svg viewBox="0 0 44 32" className="h-6 w-8 text-[#1A1A1A]" fill="currentColor" aria-hidden>
          <path d="M0 4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12c0 8-4 14-12 16l-2-4c4-1.5 6-4.5 6-8H4a4 4 0 0 1-4-4V4Zm24 0a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12c0 8-4 14-12 16l-2-4c4-1.5 6-4.5 6-8h-8a4 4 0 0 1-4-4V4Z" />
        </svg>
        {/* Müşteri logosu gelince değişecek */}
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">
          Müşteri logosu
        </span>
      </div>
      <div>
        <p className="text-[19px] leading-[1.45] tracking-[-0.02em] text-[#1A1A1A]">
          OX Dijital ile çalışmaya başladıktan sonra reklam maliyetimiz yarıya indi,
          satışlarımız ikiye katlandı.
        </p>
        <p className="mt-4 flex items-center gap-2.5 text-[14px] text-neutral-500">
          <span className="size-1 rounded-full bg-neutral-500" />
          Kurucu, Marka Adı
        </p>
      </div>
    </div>
  );
}

export function RatingCard({ className }: CardProps) {
  return (
    <div className={cn(CARD, "flex flex-col justify-between bg-[#F1F1F1]", className)}>
      <div className="flex gap-0.5 text-[#1A1A1A]" aria-label="5 üzerinden 5 yıldız">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
          </svg>
        ))}
      </div>
      <div>
        <p className="text-[40px] leading-none tracking-[-0.04em] text-[#1A1A1A]">4.9</p>
        <p className="mt-2 text-[14px] leading-[1.35] tracking-[-0.01em] text-neutral-500">
          Google&apos;da 60+ müşteri yorumu.
        </p>
      </div>
    </div>
  );
}

// Krestin'deki "Services" kutusundan uyarlama: dağınık, eğik etiketler.
const SERVICE_PILLS = [
  { label: "Reklam", className: "bottom-[78px] left-[18px] -rotate-[14deg] bg-accent text-black" },
  { label: "Tasarım", className: "bottom-[96px] right-[16px] rotate-[12deg] bg-[#C9B8F2] text-black" },
  { label: "Yazılım", className: "bottom-[34px] left-[74px] -rotate-[4deg] bg-[#2F6BFF] text-white" },
  { label: "SEO", className: "bottom-[44px] right-[30px] rotate-[8deg] bg-[#1A1A1A] text-white" },
  { label: "Sosyal Medya", className: "bottom-[-6px] left-[16px] rotate-[6deg] bg-white text-black" },
];

export function ServicesCard({ className }: CardProps) {
  return (
    <div className={cn(CARD, "relative overflow-hidden bg-[#F1F1F1]", className)}>
      <p className="text-[22px] tracking-[-0.02em] text-[#1A1A1A]">Hizmetler</p>
      <p className="mt-2 max-w-[230px] text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
        Markanızı bir sonraki adıma taşıyan dijital çözümler.
      </p>
      {SERVICE_PILLS.map((pill) => (
        <span
          key={pill.label}
          className={cn(
            "absolute whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-medium tracking-[-0.01em] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
            pill.className,
          )}
        >
          {pill.label}
        </span>
      ))}
    </div>
  );
}

// Yeni kutu eklemenin en kısa yolu: değer + açıklama.
const STAT_TONES = {
  light: "bg-[#F1F1F1] text-[#1A1A1A]",
  dark: "bg-[#1A1A1A] text-white",
  outline: "border border-neutral-200 bg-white text-[#1A1A1A]",
} as const;

export function StatCard({
  value,
  label,
  tone = "light",
  className,
}: CardProps & {
  value: string;
  label: string;
  tone?: keyof typeof STAT_TONES;
}) {
  return (
    <div className={cn(CARD, "flex flex-col justify-end", STAT_TONES[tone], className)}>
      <p className="text-[40px] leading-none tracking-[-0.04em]">{value}</p>
      <p
        className={cn(
          "mt-2 text-[14px] leading-[1.35] tracking-[-0.01em]",
          tone === "dark" ? "text-white/70" : "text-neutral-500",
        )}
      >
        {label}
      </p>
    </div>
  );
}

// Izgarada sırayla aşağıdan gelme
export function Reveal({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
