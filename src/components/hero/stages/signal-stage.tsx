"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { MiniGlyph, type Glyph } from "@/components/dock/pixel-matrix";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { usePageVisible } from "@/hooks/use-page-visible";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

// Hero sahnesi "Sinyal hattı": OX logosundan çıkan mavi sinyal iki şeritten geçer (Marka → Website,
// Sosyal Medya → SEO), uğradığı kutuyu canlandırır ve en sonda "Müşteri" kutusunda biter.
// Mesaj: hepsi tek hatta, markadan müşteriye. Kayan kelime sinyalin olduğu kutuyla eşleşir (onWord).
// selectable: kutular seçilebilir; sinyal yalnız seçili kutuları canlandırır, altta seçilen hat ve "Bu planı konuşalım".
// Performans: sinyal konumu her karede doğrudan SVG'ye yazılır (React yeniden çizmez); ekrandan çıkınca ve sekme
// arka plandayken durur. "Hareketi azalt"ta bütün hat yanık ve sabit.

// Sahnenin kendi koordinatları (SVG viewBox); kutular aynı ölçekte yüzde ile konumlanır
const W = 640;
const H = 460;
const BOX = { w: 150, h: 84 };
const SOURCE = { x: 64, y: 230, size: 88 };
const TARGET = { x: 572, y: 230, w: 120, h: 104 };

type Step = { key: string; label: string; slug: string; glyph: Glyph; status: string; x: number; y: number; word: number };

// word: sol başlıktaki kayan kelimenin sırası (SIGNAL_WORDS)
const LANES: { path: string; steps: Step[]; end: number }[] = [
  {
    path: `M${SOURCE.x + 44} 230 H160 V96 H${TARGET.x} V${TARGET.y - TARGET.h / 2}`,
    steps: [
      { key: "marka", label: "Marka", slug: "branding", glyph: "star", status: "Kimlik hazır", x: 220, y: 96, word: 0 },
      { key: "website", label: "Website", slug: "website", glyph: "browser", status: "Yayında", x: 420, y: 96, word: 1 },
    ],
    end: 2,
  },
  {
    path: `M${SOURCE.x + 44} 230 H160 V364 H${TARGET.x} V${TARGET.y + TARGET.h / 2}`,
    steps: [
      { key: "sosyal", label: "Sosyal Medya", slug: "sosyal-medya", glyph: "heart", status: "Paylaşım planlandı", x: 220, y: 364, word: 3 },
      { key: "seo", label: "SEO", slug: "seo", glyph: "magnifier", status: "Aramada görünür", x: 420, y: 364, word: 4 },
    ],
    end: 5,
  },
];

/** Sol başlıkta kayan kelimeler: şerit sırasıyla, her şerit "sonuç" ile biter */
export const SIGNAL_WORDS = ["Marka", "Website", "sonuç", "Sosyal Medya", "SEO", "sonuç"];

const ALL_KEYS = LANES.flatMap((l) => l.steps.map((s) => s.key));
const SPEED = 230; // px/sn (sahne koordinatında)
const HOLD_MS = 1700; // müşteri kutusunda bekleme
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function SignalStage({
  selectable = false,
  onWord,
  className,
}: {
  selectable?: boolean;
  onWord?: (index: number) => void;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const running = inView && pageVisible && !reduced;

  const [selected, setSelected] = useState<string[]>(ALL_KEYS);
  const [lit, setActive] = useState<string[]>([]);
  // "Hareketi azalt": hat baştan sona yanık ve sabit
  const active = reduced ? [...ALL_KEYS, "musteri"] : lit;
  // Döngü her çizimde yeniden kurulmasın: güncel seçim ve geri çağırma ref'te
  const selectedRef = useRef(selected);
  const onWordRef = useRef(onWord);
  useEffect(() => {
    selectedRef.current = selected;
    onWordRef.current = onWord;
  });

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let lane = 0;
    let startedAt = performance.now();
    let holdUntil = 0;
    let lit = new Set<string>();

    const nextLane = () => {
      // Seçili kutusu olmayan şerit atlanır (hiç seçili yoksa sinyal yine de dolaşır)
      const sel = selectedRef.current;
      for (let i = 1; i <= LANES.length; i++) {
        const candidate = (lane + i) % LANES.length;
        if (!sel.length || LANES[candidate].steps.some((s) => sel.includes(s.key))) return candidate;
      }
      return (lane + 1) % LANES.length;
    };

    const tick = (now: number) => {
      const path = pathRefs.current[lane];
      const trail = trailRefs.current[lane];
      const dot = dotRef.current;
      if (!path || !trail || !dot) return;
      const total = path.getTotalLength();

      if (holdUntil) {
        if (now >= holdUntil) {
          // Şerit bitti: ışıkları söndür, sıradaki şeride geç
          holdUntil = 0;
          trail.style.strokeDashoffset = `${total}`;
          lit = new Set();
          setActive([]);
          lane = nextLane();
          startedAt = now;
        }
        frame = requestAnimationFrame(tick);
        return;
      }

      const dist = Math.min(total, ((now - startedAt) / 1000) * SPEED);
      const p = path.getPointAtLength(dist);
      dot.setAttribute("cx", `${p.x}`);
      dot.setAttribute("cy", `${p.y}`);
      trail.style.strokeDasharray = `${total}`;
      trail.style.strokeDashoffset = `${total - dist}`;

      // Sinyal bir kutunun içine girince o kutu canlanır
      for (const step of LANES[lane].steps) {
        if (lit.has(step.key)) continue;
        if (Math.abs(p.x - step.x) < BOX.w / 2 && Math.abs(p.y - step.y) < BOX.h / 2) {
          lit.add(step.key);
          if (selectedRef.current.includes(step.key)) {
            setActive((a) => [...a, step.key]);
            onWordRef.current?.(step.word);
          }
        }
      }

      if (dist >= total) {
        setActive((a) => [...a, "musteri"]);
        onWordRef.current?.(LANES[lane].end);
        holdUntil = now + HOLD_MS;
      }
      frame = requestAnimationFrame(tick);
    };

    // Başlangıçta seçili kutusu olan ilk şerit
    lane = Math.max(0, LANES.findIndex((l) => l.steps.some((s) => selectedRef.current.includes(s.key))));
    startedAt = performance.now();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setActive([]);
    };
  }, [running]);

  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  const chosen = LANES.flatMap((l) => l.steps).filter((s) => selected.includes(s.key));
  const plan = chosen.map((s) => s.label).join(" + ");

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative aspect-[640/460] w-full [container-type:inline-size]">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <filter id="signal-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {LANES.map((l, i) => (
            <g key={i}>
              {/* Sönük hat (kesikli, piksel dili) */}
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={l.path}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={2}
                strokeDasharray="4 6"
              />
              {/* Sinyalin geçtiği kısım yanar */}
              <path
                ref={(el) => {
                  trailRefs.current[i] = el;
                }}
                d={l.path}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.5}
                strokeLinecap="round"
                style={{ strokeDasharray: 2000, strokeDashoffset: reduced ? 0 : 2000 }}
              />
            </g>
          ))}
          {!reduced && <circle ref={dotRef} r={6} fill="#8fb0ff" filter="url(#signal-glow)" cx={-20} cy={-20} />}
        </svg>

        {/* Kaynak: OX logosu */}
        <div
          className="absolute grid place-items-center rounded-[22%] bg-[#111] ring-1 ring-accent/50 shadow-[0_0_40px_-6px_rgba(47,107,255,0.7)]"
          style={{
            left: pct(SOURCE.x - SOURCE.size / 2, W),
            top: pct(SOURCE.y - SOURCE.size / 2, H),
            width: pct(SOURCE.size, W),
            height: pct(SOURCE.size, H),
          }}
        >
          <span className="relative block size-[62%]">
            <Image src="/images/logo.png" alt="OX Dijital" fill sizes="64px" className="object-contain" />
          </span>
        </div>

        {LANES.flatMap((l) => l.steps).map((step) => (
          <StepBox
            key={step.key}
            step={step}
            active={active.includes(step.key)}
            selected={selected.includes(step.key)}
            selectable={selectable}
            onToggle={() => toggle(step.key)}
          />
        ))}

        {/* Hedef: müşteri */}
        <div
          className={cn(
            "absolute flex flex-col items-center justify-center gap-[6%] rounded-[16px] border transition-[background-color,border-color,box-shadow] duration-500",
            active.includes("musteri")
              ? "border-accent bg-[#0e1730] shadow-[0_0_60px_-10px_rgba(47,107,255,0.8)]"
              : "border-white/10 bg-[#0d0d0d]",
          )}
          style={{
            left: pct(TARGET.x - TARGET.w / 2, W),
            top: pct(TARGET.y - TARGET.h / 2, H),
            width: pct(TARGET.w, W),
            height: pct(TARGET.h, H),
          }}
        >
          <MiniGlyph
            glyph="smile"
            cell={4}
            className={cn("transition-colors duration-500", active.includes("musteri") ? "text-accent" : "text-white/25")}
          />
          <p className="font-mono text-[max(9px,1.7cqw)] font-bold uppercase tracking-[0.12em] text-white/70">Müşteri</p>
          <AnimatePresence>
            {active.includes("musteri") && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute -bottom-[14%] whitespace-nowrap rounded-full bg-white px-[1.8cqw] py-[0.6cqw] text-[max(9px,1.7cqw)] font-semibold text-[#111]"
              >
                Yeni talep geldi
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {selectable && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-white/[0.04] p-3 pl-5 ring-1 ring-white/10">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              Kutulara dokunarak hattını seç
            </p>
            <p className="mt-1 truncate text-[15px] font-medium text-white">{plan ? `${plan} → Müşteri` : "Bir kutu seç"}</p>
          </div>
          <a
            href={talepUrl(plan ? { konu: `${plan} planı` } : {})}
            className="flex h-11 shrink-0 items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-semibold text-[#111]"
          >
            Bu planı konuşalım
            <span className="grid size-8 place-items-center rounded-full bg-accent">
              <PixelIcon variant="arrow" className="size-[9px]" cellClassName="fill-white" />
            </span>
          </a>
        </div>
      )}
    </div>
  );
}

function StepBox({
  step,
  active,
  selected,
  selectable,
  onToggle,
}: {
  step: Step;
  active: boolean;
  selected: boolean;
  selectable: boolean;
  onToggle: () => void;
}) {
  const style = {
    left: pct(step.x - BOX.w / 2, W),
    top: pct(step.y - BOX.h / 2, H),
    width: pct(BOX.w, W),
    height: pct(BOX.h, H),
  };
  const classes = cn(
    "absolute flex flex-col justify-between rounded-[14px] border p-[1.6cqw] text-left transition-[background-color,border-color,box-shadow,opacity] duration-500 outline-none focus-visible:ring-2 focus-visible:ring-white/60",
    active
      ? "border-accent bg-[#0e1730] shadow-[0_0_40px_-10px_rgba(47,107,255,0.8)]"
      : "border-white/10 bg-[#0d0d0d] hover:border-white/25",
    selectable && !selected && "opacity-35",
  );
  const content = (
    <>
      <span className="flex items-center gap-[1.2cqw]">
        <MiniGlyph glyph={step.glyph} cell={3} className={cn("transition-colors duration-500", active ? "text-accent" : "text-white/40")} />
        <span className="text-[max(10px,2.1cqw)] font-medium tracking-[-0.01em] text-white">{step.label}</span>
      </span>
      <span
        className={cn(
          "flex items-center gap-[0.8cqw] font-mono text-[max(8px,1.45cqw)] font-bold uppercase tracking-[0.08em] transition-colors duration-500",
          active ? "text-[#a9c2ff]" : "text-white/25",
        )}
      >
        <span className={cn("size-[0.9cqw] min-h-1 min-w-1 rounded-[1px]", active ? "bg-accent" : "bg-white/20")} />
        {active ? step.status : selectable && !selected ? "Seçilmedi" : "Bekliyor"}
      </span>
    </>
  );

  return selectable ? (
    <button type="button" onClick={onToggle} aria-pressed={selected} className={classes} style={style}>
      {content}
    </button>
  ) : (
    <Link href={`/hizmetler/${step.slug}`} className={classes} style={style}>
      {content}
    </Link>
  );
}
