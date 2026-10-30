"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import { FILTER_ICON, FILTERS, type FeedFilter } from "./feed-data";

// Izgaranın üstündeki filtre sekmeleri. Navbar'la aynı koyu cam hap; seçili sekmenin zemini vurgu yeşili.
// Sekmeler gerçek linkler: her filtre ayrı bir sayfa (/calismalar, /calismalar/projeler, /blog), Google takip eder.
// scroll={false}: sekme değişince sayfa başa zıplamaz, içerik yerinde değişir.

export function FeedFilters({
  value,
  counts,
  onNavigate,
}: {
  value: FeedFilter;
  counts: Record<FeedFilter, number>;
  /** Sekmeye tıklanınca (ör. ızgaranın içindeyken başına dönmek için) */
  onNavigate?: () => void;
}) {
  return (
    <nav
      aria-label="İçerik türü"
      className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-black/75 p-1 backdrop-blur-[15px] [scrollbar-width:none]"
    >
      {FILTERS.map((f) => {
        const active = f.key === value;
        return (
          <Link
            key={f.key}
            href={f.href}
            scroll={false}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] tracking-[-0.01em] transition-colors duration-300",
              active ? "text-black" : "text-white/70 hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId="feed-filter-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            )}
            {/* Kart rozetlerindeki ikonun aynısı: sekmeler aynı zamanda lejant */}
            {f.key !== "tumu" && (
              <PixelIcon
                variant={FILTER_ICON[f.key]}
                className="relative size-[9px]"
                cellClassName={active ? "fill-black" : "fill-white/60"}
              />
            )}
            <span className="relative">{f.label}</span>
            <span className={cn("relative font-mono text-[10px]", active ? "text-black/60" : "text-white/40")}>
              {String(counts[f.key]).padStart(2, "0")}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
