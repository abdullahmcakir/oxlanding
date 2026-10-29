"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Ölçüler canlı Framer sitesinden alındı (clean-tuna-722417.framer.app).
export function QuestionCard({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "[font-variation-settings:'opsz'_32] flex w-[min(324px,calc(100vw-32px))] flex-col gap-3.5 rounded-[28px] bg-[#FFFFF7] px-2 pb-2 pt-4",
        className,
      )}
    >
      <div className="flex flex-col gap-2 pl-2">
        <p className="text-[32px] font-medium leading-[1.1] tracking-[-1px] text-[#0E0D0A]">
          Sorularınız mı var?
        </p>
        <p className="text-[12px] font-medium leading-[1.2] tracking-[-0.4px] text-[#525252]">
          Online Toplantı aracılığıyla aklınıza takılanları sorabilirsiniz
        </p>
      </div>

      <Link
        href="#iletisim"
        className="group flex h-14 items-center justify-between rounded-full bg-[#0E0D0A] py-2 pl-6 pr-2 text-[14px] font-semibold tracking-[-0.4px] text-white"
      >
        İletişime Geç
        <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#AFD41C] text-[#0E0D0A] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          {/* Hover'da ok sağa çıkar, yenisi soldan gelir */}
          <span className="relative block size-4">
            {[0, 1].map((i) => (
              <svg
                key={i}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={cn(
                  "absolute inset-0 size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  i === 0 ? "group-hover:translate-x-[180%]" : "-translate-x-[180%] group-hover:translate-x-0",
                )}
              >
                <path d="m5.5 2 6 6-6 6" />
              </svg>
            ))}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
