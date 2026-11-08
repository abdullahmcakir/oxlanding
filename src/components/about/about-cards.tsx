"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

// Her kutu bağımsız; yerleşim about.tsx'teki şeritte değiştirilir.
// Yalnız doğrulanabilir bilgi: gerçek veri gelmeden rakam, müşteri sayısı ya da yorum eklenmez.

type CardProps = { className?: string };

const CARD = "rounded-[28px] p-6";

const TICKS = 40;

export function PlanCard({ className }: CardProps) {
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
        <p className="text-[20px] tracking-[-0.02em] text-[#1A1A1A]">Önce plan</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
          Kapsamı ve fiyatı netleştirip projeye başlıyoruz.
        </p>
      </div>
    </div>
  );
}

// Krestin'deki "Services" kutusundan uyarlama: dağınık, eğik etiketler.
const SERVICE_PILLS = [
  { label: "Reklam", className: "bottom-[78px] left-[18px] -rotate-[14deg] bg-accent text-accent-ink" },
  { label: "Tasarım", className: "bottom-[96px] right-[16px] rotate-[12deg] bg-[#C9B8F2] text-black" },
  { label: "Yazılım", className: "bottom-[34px] left-[74px] -rotate-[4deg] bg-[#2f6bff] text-white" },
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
