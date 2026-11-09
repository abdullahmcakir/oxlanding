"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { MiniGlyph } from "@/components/dock/pixel-matrix";
import { usePageVisible } from "@/hooks/use-page-visible";
import { cn } from "@/lib/utils";

// Hero sahnesi C · "Cam kartlar ve ışık izi": derinlikte süzülen buzlu cam kartlar; kuyruklu yıldız gibi bir ışık
// izi kartların arasından kıvrılarak geçer. Uğradığı kart parlar ve içindeki mini arayüz canlanır
// (Marka → Website → SEO → Sosyal Medya), iz en sonda "Yeni talep" bildiriminde biter. Kayan kelime eşleşir (onWord).
// İmleç kartları derinliklerine göre kaydırır (parallax). Ekrandan çıkınca ve sekme arka plandayken durur;
// "hareketi azalt"ta bütün kartlar açık ve iz tamamen çizili.

const W = 600;
const H = 540;
const PATH =
  "M30 36 C 120 6, 60 112, 130 118 C 230 126, 330 52, 432 150 C 530 244, 270 226, 172 334 C 92 424, 360 300, 446 388 C 512 452, 400 512, 300 506";
const TRAVEL_MS = 7200;
const HOLD_MS = 2200;
const TAIL = 150; // iz uzunluğu (sahne birimi)

type CardKey = "marka" | "website" | "seo" | "sosyal";
// at: izin karta ulaştığı oran (0-1); word: kayan kelimenin sırası (GLASS_WORDS)
const CARDS: { key: CardKey; label: string; x: number; y: number; w: number; h: number; depth: number; at: number; word: number }[] = [
  { key: "marka", label: "Marka", x: 130, y: 118, w: 200, h: 128, depth: 0.55, at: 0.16, word: 0 },
  { key: "website", label: "Website", x: 432, y: 150, w: 236, h: 158, depth: 1, at: 0.37, word: 1 },
  { key: "seo", label: "SEO", x: 172, y: 334, w: 220, h: 138, depth: 0.8, at: 0.6, word: 2 },
  { key: "sosyal", label: "Sosyal Medya", x: 446, y: 388, w: 190, h: 150, depth: 0.65, at: 0.8, word: 3 },
];
export const GLASS_WORDS = ["Marka", "Website", "SEO", "Sosyal Medya", "sonuç"];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function GlassStage({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const running = inView && pageVisible && !reduced;
  const [lit, setLit] = useState<string[]>([]);
  const onWordRef = useRef(onWord);
  useEffect(() => {
    onWordRef.current = onWord;
  });
  const active = reduced ? [...CARDS.map((c) => c.key), "talep"] : lit;

  // Işık izi: baş noktası yol boyunca ilerler, arkasında solan bir kuyruk bırakır
  useEffect(() => {
    if (!running) return;
    const path = pathRef.current;
    const trail = trailRef.current;
    const glow = glowRef.current;
    const head = headRef.current;
    if (!path || !trail || !glow || !head) return;
    const total = path.getTotalLength();
    let frame = 0;
    let start = performance.now();
    let reached = new Set<string>();

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed > TRAVEL_MS + HOLD_MS) {
        // Tur bitti: kartlar söner, iz baştan
        start = now;
        reached = new Set();
        setLit([]);
      }
      const p = Math.min(1, (now - start) / TRAVEL_MS);
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      const dist = e * total;
      const point = path.getPointAtLength(dist);
      head.setAttribute("cx", `${point.x}`);
      head.setAttribute("cy", `${point.y}`);
      head.style.opacity = p >= 1 ? "0" : "1";
      // Kuyruk: yalnız başın arkasındaki TAIL uzunluğunda parça görünür
      const dash = `0 ${Math.max(0, dist - TAIL)} ${Math.min(TAIL, dist)} ${total}`;
      trail.style.strokeDasharray = dash;
      glow.style.strokeDasharray = dash;

      for (const card of CARDS) {
        if (!reached.has(card.key) && e >= card.at) {
          reached.add(card.key);
          setLit((l) => [...l, card.key]);
          onWordRef.current?.(card.word);
        }
      }
      if (p >= 1 && !reached.has("talep")) {
        reached.add("talep");
        setLit((l) => [...l, "talep"]);
        onWordRef.current?.(4);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setLit([]);
    };
  }, [running]);

  // Parallax: imleç konumu CSS değişkenlerine yazılır, kartlar derinliklerine göre kayar
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${(e.clientX - rect.left) / rect.width - 0.5}`);
    e.currentTarget.style.setProperty("--my", `${(e.clientY - rect.top) / rect.height - 0.5}`);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative w-full [--mx:0] [--my:0]", className)}
    >
      <div className="relative aspect-[600/540] w-full [container-type:inline-size]">
        {/* Aurora: yavaş kayan bulanık mavi ışıklar */}
        <div aria-hidden className="pointer-events-none absolute -inset-[12%] overflow-hidden">
          <div className="absolute left-[10%] top-[8%] size-[55%] animate-[aurora_14s_ease-in-out_infinite] rounded-full bg-accent/25 blur-[80px] motion-reduce:animate-none" />
          <div className="absolute bottom-[6%] right-[4%] size-[50%] animate-[aurora_18s_ease-in-out_infinite_reverse] rounded-full bg-[#6f9bff]/20 blur-[90px] motion-reduce:animate-none" />
        </div>

        {/* Işık izi (kartların arkasında; cam kartların bulanığından süzülür) */}
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="trail-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6f9bff" />
              <stop offset="1" stopColor="#2f6bff" />
            </linearGradient>
            <filter id="trail-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <path ref={pathRef} d={PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} strokeDasharray="2 7" />
          <path
            ref={glowRef}
            d={PATH}
            fill="none"
            stroke="#2f6bff"
            strokeWidth={14}
            strokeLinecap="round"
            filter="url(#trail-blur)"
            opacity={0.9}
            style={{ strokeDasharray: reduced ? "none" : "0 99999" }}
          />
          <path
            ref={trailRef}
            d={PATH}
            fill="none"
            stroke="url(#trail-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ strokeDasharray: reduced ? "none" : "0 99999" }}
          />
          {!reduced && <circle ref={headRef} r={5} fill="#e6eeff" filter="drop-shadow(0 0 8px #8fb0ff)" cx={30} cy={36} />}
        </svg>

        {CARDS.map((card) => (
          <GlassCard key={card.key} card={card} active={active.includes(card.key)} />
        ))}

        {/* İzin sonu: yeni talep */}
        <div
          className={cn(
            "absolute flex items-center gap-[2cqw] rounded-[2.6cqw] px-[2.6cqw] py-[2cqw] backdrop-blur-xl transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            active.includes("talep")
              ? "translate-y-0 bg-[#0d1530]/80 opacity-100 ring-1 ring-accent/70 shadow-[0_0_80px_-12px_rgba(47,107,255,0.95)]"
              : "translate-y-[2cqw] bg-white/[0.04] opacity-0 ring-1 ring-white/10",
          )}
          style={{ left: pct(300 - 120, W), top: pct(506 - 30, H), width: pct(240, W) }}
        >
          <span className="grid size-[7cqw] shrink-0 place-items-center rounded-[1.8cqw] bg-accent">
            <MiniGlyph glyph="smile" cell={3} className="text-white" />
          </span>
          <span className="min-w-0">
            <span className="block text-[2.6cqw] font-semibold text-white">Yeni talep geldi</span>
            <span className="block text-[2cqw] text-white/60">Ücretsiz görüşme isteği</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function GlassCard({ card, active }: { card: (typeof CARDS)[number]; active: boolean }) {
  return (
    <div
      className="absolute"
      style={{
        left: pct(card.x - card.w / 2, W),
        top: pct(card.y - card.h / 2, H),
        width: pct(card.w, W),
        height: pct(card.h, H),
        // Derinlik: yakındaki kart imleçle daha çok kayar
        transform: `translate(calc(var(--mx) * ${card.depth * 22}px), calc(var(--my) * ${card.depth * 16}px))`,
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        className={cn(
          "relative flex size-full flex-col overflow-hidden rounded-[3cqw] p-[2.2cqw] backdrop-blur-xl transition-[box-shadow,background-color] duration-700",
          active
            ? "bg-white/[0.09] shadow-[0_0_0_1px_rgba(111,155,255,0.65),0_20px_80px_-20px_rgba(47,107,255,0.9)]"
            : "bg-white/[0.045] shadow-[0_0_0_1px_rgba(255,255,255,0.09)]",
        )}
      >
        {/* Camın üst kenarındaki ışık yansıması */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" />
        <span className="relative flex items-center justify-between font-mono text-[max(8px,1.5cqw)] font-bold uppercase tracking-[0.14em] text-white/55">
          {card.label}
          <span className={cn("size-[1.2cqw] min-h-1.5 min-w-1.5 rounded-full transition-colors duration-500", active ? "bg-accent shadow-[0_0_10px_#2f6bff]" : "bg-white/15")} />
        </span>
        <div className="relative mt-[1.6cqw] flex-1">
          {card.key === "marka" && <BrandUi active={active} />}
          {card.key === "website" && <SiteUi active={active} />}
          {card.key === "seo" && <SearchUi active={active} />}
          {card.key === "sosyal" && <PostUi active={active} />}
        </div>
      </div>
    </div>
  );
}

const reveal = (active: boolean, delay = 0) => ({
  className: cn("transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", active ? "opacity-100 translate-y-0" : "opacity-30 translate-y-[0.8cqw]"),
  style: { transitionDelay: active ? `${delay}ms` : "0ms" },
});

function BrandUi({ active }: { active: boolean }) {
  return (
    <div className="flex h-full items-center gap-[2.4cqw]">
      <span {...reveal(active)} className={cn(reveal(active).className, "grid size-[10cqw] place-items-center rounded-[2cqw] bg-accent")}>
        <MiniGlyph glyph="star" cell={3} className="text-white" />
      </span>
      <div className="flex flex-col gap-[1.2cqw]">
        <span {...reveal(active, 120)} className={cn(reveal(active, 120).className, "flex gap-[0.8cqw]")}>
          {["#2f6bff", "#0d1b3d", "#e8eefc", "#6f9bff"].map((c) => (
            <span key={c} className="size-[3.4cqw] rounded-full ring-1 ring-white/20" style={{ background: c }} />
          ))}
        </span>
        <span {...reveal(active, 220)} className={cn(reveal(active, 220).className, "text-[4.4cqw] font-semibold leading-none tracking-[-0.04em] text-white")}>
          Aa
        </span>
      </div>
    </div>
  );
}

function SiteUi({ active }: { active: boolean }) {
  return (
    <div className="h-full overflow-hidden rounded-[1.6cqw] bg-[#F5F5F3]">
      <div className="flex items-center gap-[0.6cqw] bg-[#e9e9e6] px-[1.4cqw] py-[1cqw]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[0.9cqw] rounded-full bg-black/20" />
        ))}
      </div>
      <div className="p-[1.8cqw]">
        <span {...reveal(active)} className={cn(reveal(active).className, "block h-[2cqw] w-[78%] rounded-[0.5cqw] bg-[#111]")} />
        <span {...reveal(active, 100)} className={cn(reveal(active, 100).className, "mt-[1cqw] block h-[2cqw] w-[52%] rounded-[0.5cqw] bg-[#111]")} />
        <span {...reveal(active, 180)} className={cn(reveal(active, 180).className, "mt-[1.6cqw] block h-[0.9cqw] w-[70%] rounded-full bg-black/15")} />
        <span {...reveal(active, 260)} className={cn(reveal(active, 260).className, "mt-[1.8cqw] inline-block rounded-full bg-accent px-[1.8cqw] py-[0.8cqw] text-[1.6cqw] font-semibold text-white")}>
          Teklif al
        </span>
      </div>
    </div>
  );
}

function SearchUi({ active }: { active: boolean }) {
  // Bizim sonuç (mavi) aktifken listenin en üstüne çıkar
  const rows = [
    { ours: false, w: "72%" },
    { ours: true, w: "64%" },
    { ours: false, w: "58%" },
  ];
  return (
    <div className="relative h-full">
      <span className="flex items-center gap-[1cqw] rounded-full bg-white/[0.08] px-[1.6cqw] py-[0.9cqw]">
        <MiniGlyph glyph="magnifier" cell={2} className="text-white/50" />
        <span className="text-[1.7cqw] text-white/55">markan web tasarım</span>
      </span>
      <div className="relative mt-[1.4cqw] h-[16cqw]">
        {rows.map((r, i) => {
          const slot = r.ours ? (active ? 0 : 1) : i === 0 ? (active ? 1 : 0) : 2;
          return (
            <span
              key={i}
              className={cn(
                "absolute inset-x-0 flex flex-col gap-[0.6cqw] rounded-[1.2cqw] px-[1.4cqw] py-[1cqw] transition-[top,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                r.ours && active ? "bg-accent/20 ring-1 ring-accent/50" : "bg-transparent",
              )}
              style={{ top: `${slot * 5.4}cqw` }}
            >
              <span className={cn("block h-[1.1cqw] rounded-full", r.ours ? "bg-[#8fb0ff]" : "bg-white/25")} style={{ width: r.w }} />
              <span className="block h-[0.7cqw] w-[85%] rounded-full bg-white/10" />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PostUi({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col gap-[1.2cqw]">
      <span className="block flex-1 rounded-[1.6cqw] bg-[linear-gradient(150deg,#1b2b55,#2f6bff_70%,#9db8ff)]" />
      <span className="flex items-center justify-between">
        <span
          className={cn(
            "transition-transform duration-500 ease-[cubic-bezier(0.34,1.8,0.64,1)]",
            active ? "scale-125 text-[#ff6b8a]" : "scale-100 text-white/40",
          )}
        >
          <MiniGlyph glyph="heart" cell={3} />
        </span>
        <span {...reveal(active, 200)} className={cn(reveal(active, 200).className, "rounded-full bg-white/10 px-[1.4cqw] py-[0.6cqw] text-[1.6cqw] font-medium text-white")}>
          Yeni beğeni
        </span>
      </span>
    </div>
  );
}
