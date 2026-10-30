"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { cn } from "@/lib/utils";
import { DISCIPLINES } from "./about-data";

// "Tek masa": aynı masada yürüyen işler, yatay kaydırmalı kartlar. Referans: Echo şablonunun "Everything in sync"
// bölümü (renkli desenli şeritli kartlar + nokta göstergesi). Desenler sitenin piksel dilinde; renkler paletten.
// Kaydırma yerel (scroll-snap): dokunmatikte parmakla, masaüstünde sürükleyerek ya da noktalara tıklayarak.

type Pattern = (typeof DISCIPLINES)[number]["pattern"];

const COLS = 34;
const ROWS = 7;
const CELL = 12;

/** Basit sabit "rastgele": her render'da aynı desen (hidrasyon uyuşmazlığı olmasın) */
function noise(c: number, r: number) {
  const x = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Desen → [sütun, satır, opaklık] hücreleri */
function cells(pattern: Pattern): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let c = 0; c < COLS; c++) {
    // Ortası güçlü, kenarlara doğru sönen yoğunluk
    const fade = 1 - Math.abs(c - COLS / 2) / (COLS / 2);
    for (let r = 0; r < ROWS; r++) {
      let o = 0;
      if (pattern === "dots") o = noise(c, r) > 0.35 ? 0.15 + fade * 0.75 * noise(r, c) : 0;
      if (pattern === "checker") o = (Math.floor(c / 2) + Math.floor(r / 2)) % 2 === 0 ? 0.2 + fade * 0.6 : 0.06;
      if (pattern === "bars") {
        const h = 1 + Math.floor(noise(c, 1) * (2 + fade * 5));
        o = r >= ROWS - h ? 0.25 + fade * 0.7 : 0;
      }
      if (pattern === "plus") {
        const cx = c % 6;
        const cy = (r + (Math.floor(c / 6) % 2) * 3) % 6;
        o = (cx === 2 && cy >= 1 && cy <= 3) || (cy === 2 && cx >= 1 && cx <= 3) ? 0.25 + fade * 0.7 : 0;
      }
      if (pattern === "diag") o = (c + r) % 5 === 0 || (c + r) % 5 === 1 ? 0.15 + fade * 0.75 : 0;
      // İki ondalığa yuvarla: sunucu ve tarayıcıdaki Math.sin son basamaklarda farklılaşabiliyor (hidrasyon)
      if (o > 0) out.push([c, r, Math.round(o * 100) / 100]);
    }
  }
  return out;
}

// Şerit renkleri sırayla: limon, koyu, gri, koyu yeşil (piksel rengi zemine göre)
const TONES = [
  { bg: "bg-accent", px: "#111" },
  { bg: "bg-[#111]", px: "#c5f36a" },
  { bg: "bg-[#E4E4E4]", px: "#111" },
  { bg: "bg-[#1F3A0B]", px: "#c5f36a" },
];

function Band({ pattern, tone }: { pattern: Pattern; tone: (typeof TONES)[number] }) {
  return (
    <div className={cn("h-20 overflow-hidden", tone.bg)}>
      <svg
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        aria-hidden
      >
        {cells(pattern).map(([c, r, o]) => (
          <rect key={`${c}-${r}`} x={c * CELL + 3} y={r * CELL + 3} width={6} height={6} rx={1} fill={tone.px} opacity={o} />
        ))}
      </svg>
    </div>
  );
}

export function AboutDisciplines() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [active, setActive] = useState(0);

  const step = () => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return 1;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    // Sona gelince son nokta yansın (son kartlar tam başa hizalanamaz)
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(atEnd ? DISCIPLINES.length - 1 : Math.round(el.scrollLeft / step()));
  };

  const goTo = (i: number) => track.current?.scrollTo({ left: i * step(), behavior: "smooth" });

  // Masaüstünde fareyle sürükleme (dokunmatik ve trackpad zaten yerel kaydırıyor)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft };
    track.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    track.current.scrollLeft = d.left - (e.clientX - d.x);
  };
  const endDrag = () => {
    if (!drag.current || !track.current) return;
    drag.current = null;
    const el = track.current;
    el.style.scrollSnapType = "";
    goTo(Math.round(el.scrollLeft / step()));
  };

  return (
    <section data-dock="hizmetler" className="overflow-hidden bg-background pb-28 md:pb-36">
      <Reveal className="px-4 md:px-[4.5vw]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Tek masa</p>
        <h2 className="mt-8 max-w-[17em] text-[clamp(32px,3.4vw,60px)] font-medium leading-[1.04] tracking-[-0.05em] text-[#111]">
          Markanın ihtiyacı olan her şey aynı masada, sıradaki adım hep belli.
        </h2>
      </Reveal>

      <Reveal index={1}>
        <div
          ref={track}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="no-scrollbar mt-14 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-2 select-none active:cursor-grabbing md:mt-20 md:scroll-px-[calc(4.5vw+8vw)] md:px-[calc(4.5vw+8vw)] max-md:scroll-px-4"
        >
          {DISCIPLINES.map((d, i) => (
            <article
              key={d.title}
              className="flex w-[min(400px,82vw)] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_2px_4px_rgb(0_0_0/0.04),0_18px_40px_-24px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.05]"
            >
              <Band pattern={d.pattern} tone={TONES[i % TONES.length]} />
              <div className="flex min-h-[240px] flex-col p-7 md:p-8">
                <span className="font-mono text-[12px] text-neutral-400">0{i + 1}</span>
                <h3 className="mt-3 text-[clamp(24px,1.9vw,30px)] font-medium leading-[1.12] tracking-[-0.035em] text-[#111]">
                  {d.title}
                </h3>
                <p className="mt-5 text-[17px] leading-[1.55] text-neutral-500">{d.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1">
          {DISCIPLINES.map((d, i) => (
            <button
              key={d.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${d.title} kartına git`}
              className="grid size-6 place-items-center"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  i === active ? "w-5 bg-[#111]" : "w-2 bg-neutral-300 hover:bg-neutral-400",
                )}
              />
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
