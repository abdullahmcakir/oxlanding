"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MiniGlyph } from "@/components/dock/pixel-matrix";
import { usePageVisible } from "@/hooks/use-page-visible";
import { cn } from "@/lib/utils";

// Hero sahnesi "Kendini kuran site": tarayıcı penceresinde bir işletme sitesi adım adım kurulur
// (adres → logo ve menü → başlık ve buton → içerik), sonra aramada görünür, sosyal medyada paylaşılır
// ve en sonda "Yeni talep" bildirimi düşer. Alttaki adımlar (Marka, Website, SEO, Sosyal Medya, Müşteri) eşlik eder.
// Döngü ekrandayken ve sekme öndeyken çalışır; "hareketi azalt"ta son hâl sabit görünür.

const STEP_AT = [0, 700, 1600, 2500, 3500, 4700, 5900]; // adımların başladığı an (ms)
const LOOP_MS = 9400;
const LAST = STEP_AT.length - 1;

// Alttaki adım çipleri: hangi sahne adımında yandıkları
const CHIPS = [
  { label: "Marka", at: 1 },
  { label: "Website", at: 2 },
  { label: "SEO", at: 4 },
  { label: "Sosyal Medya", at: 5 },
  { label: "Müşteri", at: 6 },
];

const SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;

export function BuildStage({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const running = inView && pageVisible && !reduced;
  const [cycleStep, setStep] = useState(-1);
  // "Hareketi azalt": son hâl sabit
  const step = reduced ? LAST : cycleStep;

  useEffect(() => {
    if (!running) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      setStep(-1);
      timers = STEP_AT.map((at, i) => setTimeout(() => setStep(i), at + 250));
      timers.push(setTimeout(cycle, LOOP_MS));
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [running]);

  const show = (i: number) => step >= i;
  const appear = (i: number, from: { x?: number; y?: number; scale?: number } = { y: 10 }) => ({
    initial: false as const,
    animate: show(i) ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...from },
    transition: SPRING,
  });

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative w-full [container-type:inline-size]">
        {/* Tarayıcı penceresi */}
        <div className="overflow-hidden rounded-[18px] bg-[#0d0d0d] ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(47,107,255,0.45)]">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2.5 rounded-full bg-white/15" />
              ))}
            </span>
            <span className="flex h-7 flex-1 items-center rounded-full bg-white/[0.06] px-3 font-mono text-[11px] text-white/60">
              <motion.span
                initial={false}
                animate={{ clipPath: show(0) ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                transition={{ duration: 0.6, ease: "linear" }}
                className="whitespace-nowrap"
              >
                markan.com
              </motion.span>
            </span>
          </div>

          {/* Kurulan site (açık zemin) */}
          <div className="relative aspect-[16/10] bg-[#F6F6F4] p-[4cqw]">
            {/* Menü: logo + bağlantılar */}
            <motion.div {...appear(1, { y: -8 })} className="flex items-center justify-between">
              <span className="flex items-center gap-[1.2cqw]">
                <span className="grid size-[4.2cqw] place-items-center rounded-[1cqw] bg-accent">
                  <MiniGlyph glyph="star" cell={2} className="text-white" />
                </span>
                <span className="text-[2.4cqw] font-semibold tracking-[-0.03em] text-[#111]">markan</span>
              </span>
              <span className="flex gap-[1.6cqw]" aria-hidden>
                {[7, 9, 6].map((w, i) => (
                  <span key={i} className="h-[1cqw] rounded-full bg-[#111]/15" style={{ width: `${w}cqw` }} />
                ))}
              </span>
            </motion.div>

            {/* Başlık, metin, buton + görsel */}
            <div className="mt-[5cqw] grid grid-cols-[1.1fr_0.9fr] items-center gap-[4cqw]">
              <motion.div {...appear(2, { x: -14 })}>
                <span className="block h-[3cqw] w-[90%] rounded-[0.8cqw] bg-[#111]" />
                <span className="mt-[1.4cqw] block h-[3cqw] w-[64%] rounded-[0.8cqw] bg-[#111]" />
                <span className="mt-[2.4cqw] block h-[1.1cqw] w-[80%] rounded-full bg-[#111]/15" />
                <span className="mt-[1cqw] block h-[1.1cqw] w-[70%] rounded-full bg-[#111]/15" />
                <span className="mt-[3cqw] inline-flex items-center rounded-full bg-accent px-[2.6cqw] py-[1.2cqw] text-[1.9cqw] font-semibold text-white">
                  Teklif al
                </span>
              </motion.div>
              <motion.div
                {...appear(2, { scale: 0.92 })}
                className="aspect-[4/3] rounded-[2cqw] bg-[linear-gradient(135deg,#2f6bff,#7aa2ff_55%,#c9d9ff)]"
              />
            </div>

            {/* İçerik kartları */}
            <motion.div {...appear(3, { y: 14 })} className="mt-[4cqw] grid grid-cols-3 gap-[2cqw]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block rounded-[1.4cqw] bg-white p-[1.6cqw] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                  <span className="block h-[1.2cqw] w-[60%] rounded-full bg-[#111]/70" />
                  <span className="mt-[1cqw] block h-[0.9cqw] w-[85%] rounded-full bg-[#111]/12" />
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Aramada görünür (SEO) */}
        <motion.div
          {...appear(4, { y: 16 })}
          className="absolute -bottom-[6cqw] -left-[5cqw] w-[48cqw] rounded-[2.2cqw] bg-white p-[2.4cqw] text-[#111] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          <span className="flex items-center gap-[1.4cqw] rounded-full bg-[#F1F1F1] px-[2cqw] py-[1.2cqw]">
            <MiniGlyph glyph="magnifier" cell={2} className="text-[#111]/50" />
            <span className="text-[1.8cqw] text-[#111]/60">markan web tasarım</span>
          </span>
          <span className="mt-[2cqw] block font-mono text-[1.5cqw] text-[#111]/45">markan.com</span>
          <span className="mt-[0.4cqw] block text-[2.2cqw] font-medium text-accent">Markan · Resmî site</span>
          <span className="mt-[1.6cqw] inline-flex items-center gap-[1cqw] rounded-full bg-accent/10 px-[1.6cqw] py-[0.6cqw] font-mono text-[1.4cqw] font-bold uppercase tracking-[0.08em] text-accent">
            Aramada görünür
          </span>
        </motion.div>

        {/* Sosyal medyada paylaşıldı */}
        <motion.div
          {...appear(5, { y: -16 })}
          className="absolute -right-[4cqw] -top-[5cqw] w-[26cqw] rounded-[2.2cqw] bg-white p-[1.6cqw] text-[#111] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          <span className="block aspect-square rounded-[1.4cqw] bg-[linear-gradient(160deg,#111,#2f6bff)]" />
          <span className="mt-[1.4cqw] flex items-center justify-between">
            <span className="text-[1.7cqw] font-medium">Yeni gönderi</span>
            <MiniGlyph glyph="heart" cell={2} className="text-accent" />
          </span>
        </motion.div>

        {/* Yeni talep */}
        <motion.div
          {...appear(6, { x: 24 })}
          className="absolute -right-[3cqw] bottom-[8cqw] flex items-center gap-[1.8cqw] rounded-[2.4cqw] bg-[#111] px-[2.4cqw] py-[2cqw] text-white ring-1 ring-accent/60 shadow-[0_0_60px_-10px_rgba(47,107,255,0.9)]"
        >
          <span className="grid size-[6cqw] place-items-center rounded-[1.4cqw] bg-accent">
            <MiniGlyph glyph="smile" cell={2} className="text-white" />
          </span>
          <span>
            <span className="block text-[2.1cqw] font-semibold">Yeni talep</span>
            <span className="block text-[1.6cqw] text-white/60">Ücretsiz görüşme isteği</span>
          </span>
        </motion.div>
      </div>

      {/* Adımlar */}
      <div className="mt-14 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <span
            key={c.label}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ring-1 transition-colors duration-500",
              show(c.at) ? "bg-accent/15 text-[#a9c2ff] ring-accent/50" : "text-white/30 ring-white/10",
            )}
          >
            <span className={cn("size-1.5 rounded-[1px]", show(c.at) ? "bg-accent" : "bg-white/20")} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
