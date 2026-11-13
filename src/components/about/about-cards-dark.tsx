"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Kayan şeridin koyu kutuları (Mintlify'ın özellik ızgarasından uyarlama): koyu zemin, ince çerçeve, altta başlık.
// Görseller HTML/SVG; animasyonlar yalnız kutu ekrandayken çalışır, "hareketi azalt"ta sabit kare.

type Props = { className?: string };

const SHELL = "relative flex flex-col justify-end overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111214] p-6 text-white";
const LIME = "#C5F36A";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Ekrandayken her `ms`'de bir ilerleyen sayaç (0..n-1); hareketi azalt'ta `still` */
function useCycle(n: number, ms: number, still: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [inView, reduced, n, ms]);
  return { ref, index: reduced ? still : i, running: inView && !reduced };
}

function Title({ children }: { children: React.ReactNode }) {
  return <p className="relative text-[19px] font-medium leading-[1.2] tracking-[-0.02em]">{children}</p>;
}

function Bar({ w, className }: { w: number; className?: string }) {
  return <span className={cn("block h-[6px] rounded-full bg-white/[0.07] transition-colors duration-500", className)} style={{ width: w }} />;
}

/* ───────────── 1. Hep güncel: çizgi boyunca satırlar sırayla güncellenir ───────────── */

const SYNC_ROWS = [
  { x: 22, y: 96 },
  { x: 46, y: 146 },
  { x: 68, y: 196 },
];

export function SyncCard({ className }: Props) {
  // 0..2: o satır güncelleniyor, 3: hepsi güncel (kısa bekleme), sonra başa
  const { ref, index } = useCycle(4, 1400, 3);

  return (
    <div ref={ref} className={cn(SHELL, className)}>
      <svg aria-hidden viewBox="0 0 280 380" className="absolute inset-0 size-full" fill="none">
        <path d="M14 -10 C 34 150, 110 238, 300 318" stroke={LIME} strokeOpacity={0.55} strokeWidth={1.2} />
        {/* Çizgi boyunca akan ışık */}
        <path
          d="M14 -10 C 34 150, 110 238, 300 318"
          stroke={LIME}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="40 520"
          className="animate-[sync-flow_2.8s_linear_infinite] motion-reduce:hidden"
          style={{ filter: `drop-shadow(0 0 6px ${LIME})` }}
        />
      </svg>

      {SYNC_ROWS.map((r, i) => {
        const done = index > i;
        const busy = index === i;
        return (
          <div
            key={i}
            aria-hidden
            className={cn(
              "absolute flex h-[40px] w-[180px] items-center gap-3 rounded-[12px] border bg-[#0b0c0e] px-3 transition-[border-color,box-shadow] duration-500",
              done ? "border-[#C5F36A]/25" : "border-white/[0.08]",
            )}
            style={{ left: r.x, top: r.y }}
          >
            <span className="grid size-[16px] shrink-0 place-items-center">
              {done ? (
                <motion.svg key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 22 }} viewBox="0 0 16 16" className="size-[16px]">
                  <circle cx="8" cy="8" r="8" fill={LIME} />
                  <path d="m4.8 8.2 2.1 2.1 4.3-4.4" fill="none" stroke="#111" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              ) : (
                <svg viewBox="0 0 16 16" className={cn("size-[16px]", busy && "animate-spin")}>
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={1.6} />
                  <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke="#fff" strokeOpacity={busy ? 0.7 : 0.25} strokeWidth={1.6} strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <Bar w={110} className={done ? "bg-white/25" : undefined} />
              <Bar w={70} className={done ? "bg-[#C5F36A]/40" : undefined} />
            </span>
          </div>
        );
      })}

      <Title>İçeriğin hep güncel</Title>
    </div>
  );
}

/* ───────────── 2. Erişim: vurgu üyeler arasında gezer ───────────── */

const ROLES = ["Editör", "Yönetici", "Katılımcı"];

function UserGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-[15px]", className)} fill="currentColor" aria-hidden>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4 20c.8-3.8 4-6 8-6s7.2 2.2 8 6Z" />
    </svg>
  );
}

export function AccessCard({ className }: Props) {
  const { ref, index } = useCycle(ROLES.length, 2200, 1);

  return (
    <div ref={ref} className={cn(SHELL, className)}>
      <div aria-hidden className="absolute left-[44px] right-[-16px] top-[78px] flex flex-col gap-3">
        {ROLES.map((role, i) => {
          const on = i === index;
          return (
            <motion.div
              key={role}
              animate={{ x: on ? -26 : 0, scale: on ? 1.03 : 1, opacity: on ? 1 : 0.55 }}
              transition={{ duration: 0.6, ease: EASE }}
              className={cn(
                "flex h-[46px] origin-right items-center gap-2.5 rounded-[12px] border bg-[#0b0c0e] pl-2.5 pr-5 transition-[border-color,box-shadow] duration-500",
                on ? "border-accent shadow-[0_0_0_1px_rgba(47,107,255,0.25),0_10px_30px_-12px_rgba(47,107,255,0.6)]" : "border-white/[0.08]",
              )}
            >
              <span
                className={cn(
                  "grid size-[28px] shrink-0 place-items-center rounded-[8px] border transition-colors duration-500",
                  on ? "border-transparent bg-accent/25 text-[#8fb0ff]" : "border-white/10 text-white/25",
                )}
              >
                <UserGlyph />
              </span>
              <span className="flex flex-1 flex-col gap-1.5">
                <Bar w={78} />
                <Bar w={46} />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11.5px] transition-colors duration-500",
                  on ? "border-accent/40 bg-accent/10 text-[#8fb0ff]" : "border-transparent text-white/80",
                )}
              >
                <svg viewBox="0 0 16 16" className="size-[10px]" aria-hidden>
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
                  <path d="m4.8 8.2 2.1 2.1 4.3-4.4" fill="none" stroke="#111214" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {role}
              </span>
            </motion.div>
          );
        })}
        {/* Yeni üye ekle (soluk) */}
        <div className="flex items-center gap-2.5 pl-3 opacity-30">
          <span className="grid size-[18px] place-items-center rounded-full bg-white/15 text-[13px] leading-none">+</span>
          <Bar w={90} />
        </div>
      </div>

      <Title>Erişimi siz yönetin</Title>
    </div>
  );
}

/* ───────────── 3. Ekip, siz ve yapay zekâ aynı dosyada ───────────── */

const TABS = ["Ana sayfa", "SEO", "Reklam", "Rapor"];

function OutlineCursor({ label, color, flip }: { label: string; color: string; flip?: boolean }) {
  const arrow = (
    <svg viewBox="0 0 16 16" className="size-[16px] shrink-0" aria-hidden>
      <path d="M2 1.5 14 7l-5.3 1.6L6.5 14Z" fill={`${color}33`} stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
    </svg>
  );
  return (
    <span className={cn("flex items-start", flip && "flex-row-reverse")}>
      <span className={cn(flip && "-scale-x-100")}>{arrow}</span>
      <span
        className={cn("mt-3.5 whitespace-nowrap rounded-[5px] border px-1.5 py-[3px] text-[11.5px] leading-none", flip ? "mr-0.5" : "ml-0.5")}
        style={{ color, borderColor: `${color}99`, backgroundColor: `${color}26` }}
      >
        {label}
      </span>
    </span>
  );
}

export function TeamCard({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const running = inView && !reduced;

  return (
    <div ref={ref} className={cn(SHELL, className)}>
      {/* Editör penceresi (sağdan taşar) */}
      <div aria-hidden className="absolute left-[46px] right-[-30px] top-[74px] h-[210px] overflow-hidden rounded-[12px] border border-white/10 bg-[#0c0d0f]">
        <div className="flex h-[30px] border-b border-white/[0.07] text-[10.5px] text-white/60">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={cn(
                "relative flex items-center gap-1 whitespace-nowrap border-r border-white/[0.07] px-2.5",
                i === 0 && "text-white",
              )}
            >
              <svg viewBox="0 0 16 16" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
                <path d="M4 1.5h5.5L12.5 4.5V14.5H4Z M9.5 1.5v3h3" strokeLinejoin="round" />
              </svg>
              {t}
              {i === 0 && <span className="absolute inset-x-0 bottom-0 h-[1.5px]" style={{ backgroundColor: LIME }} />}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 px-6 pt-5">
          <Bar w={26} className="h-[3px] bg-white/10" />
          <Bar w={44} className="bg-[#C5F36A]/30" />
          <Bar w={96} />
          <Bar w={132} />
          <Bar w={78} />
          <Bar w={200} />
          <Bar w={26} className="mt-2 h-[3px] bg-white/10" />
          <Bar w={44} className="bg-[#C5F36A]/30" />
          <Bar w={96} />
        </div>
      </div>

      {/* İmleçler: kişi adı değil roller */}
      <motion.div
        aria-hidden
        className="absolute left-[150px] top-[96px]"
        animate={running ? { x: [0, -30, 10, 0], y: [0, 26, 40, 0] } : undefined}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <OutlineCursor label="Yapay zekâ" color="#B48CFF" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute left-[16px] top-[150px]"
        animate={running ? { x: [0, 36, 18, 0], y: [0, -20, 24, 0] } : undefined}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <OutlineCursor label="OX Ekip" color="#5B8CFF" flip />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute right-[18px] top-[236px]"
        animate={running ? { x: [0, -44, -16, 0], y: [0, -30, 6, 0] } : undefined}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <OutlineCursor label="Sen" color="#FFA53D" flip />
      </motion.div>

      <Title>Ekip, siz ve yapay zekâ aynı işte</Title>
    </div>
  );
}
