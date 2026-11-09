"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { MiniGlyph, type Glyph } from "@/components/dock/pixel-matrix";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { usePageVisible } from "@/hooks/use-page-visible";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

// Hero sahnesi "Kombinasyon": üç kutu, her birinde bir hizmet; üçü birlikte bir sonuç verir (= …).
// Kendi kendine birkaç saniyede bir döner ve anlamlı bir üçlüde durur. Ziyaretçi kutulara tıklayıp kendisi seçebilir
// ya da "Karıştır"a basar; seçince otomatik dönme bir süre durur. "Bu planı konuşalım" seçilen üçlüyü mesaja taşır.
// Sonuçlar dürüst ve rakamsız: ne elde edileceğini anlatır, sayı ya da garanti vermez.

type Item = { slug: string; label: string; glyph: Glyph };

const ITEMS: Item[] = [
  { slug: "branding", label: "Marka", glyph: "star" },
  { slug: "website", label: "Website", glyph: "browser" },
  { slug: "e-ticaret", label: "E-ticaret", glyph: "bag" },
  { slug: "seo", label: "SEO", glyph: "magnifier" },
  { slug: "sosyal-medya", label: "Sosyal Medya", glyph: "heart" },
  { slug: "mekanda", label: "Mekanda", glyph: "pin" },
];

// Otomatik dönmenin durduğu üçlüler ve sonuçları (sıra önemsiz)
const COMBOS: { set: [string, string, string]; result: string }[] = [
  { set: ["branding", "website", "seo"], result: "Aramada bulunan, güven veren bir marka" },
  { set: ["website", "seo", "sosyal-medya"], result: "Hem Google'da hem Instagram'da bulunan bir işletme" },
  { set: ["e-ticaret", "sosyal-medya", "seo"], result: "Takipçisini müşteriye çeviren bir online mağaza" },
  { set: ["branding", "sosyal-medya", "website"], result: "Akılda kalan ve takip edilen bir marka" },
  { set: ["mekanda", "sosyal-medya", "branding"], result: "Masadan menüye, menüden sosyale bir mekân" },
  { set: ["website", "e-ticaret", "seo"], result: "Aramada bulunan ve satış yapan bir mağaza" },
];

const bySlug = (slug: string) => ITEMS.find((i) => i.slug === slug)!;

function resultOf(slots: string[]) {
  const match = COMBOS.find((c) => c.set.every((s) => slots.includes(s)) && new Set(slots).size === 3);
  if (match) return match.result;
  const labels = slots.map((s) => bySlug(s).label);
  return `${labels[0]}, ${labels[1]} ve ${labels[2]} tek planda`;
}

const AUTO_MS = 5200; // otomatik dönme aralığı
const PAUSE_MS = 12000; // ziyaretçi seçince otomatik dönme bu kadar bekler
const STOPS = [650, 1000, 1350]; // kutuların sırayla durduğu an
const FLICK_MS = 75; // dönerken simge değişim hızı

export function ComboStage({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const running = inView && pageVisible && !reduced;

  const [slots, setSlots] = useState<string[]>(COMBOS[0].set);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [settled, setSettled] = useState(true);
  // Dönerken her simge değişimi yeni bir animasyon anahtarı alsın
  const [tick, setTick] = useState(0);
  const spinningRef = useRef([false, false, false]);
  // Ziyaretçi seçince otomatik dönme bir süre durur
  const paused = useRef(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const comboIndex = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const spinTo = (target: string[]) => {
    clearTimers();
    if (reduced) {
      setSlots(target);
      return;
    }
    setSettled(false);
    setSpinning([true, true, true]);
    // Dönerken kutular hızla karışık simge gösterir
    const flick = setInterval(() => {
      setSlots((prev) => prev.map((s, i) => (spinningRef.current[i] ? ITEMS[Math.floor(Math.random() * ITEMS.length)].slug : s)));
      setTick((t) => t + 1);
    }, FLICK_MS);
    timers.current.push(flick as unknown as ReturnType<typeof setTimeout>);
    STOPS.forEach((at, i) => {
      timers.current.push(
        setTimeout(() => {
          spinningRef.current[i] = false;
          setSpinning((s) => s.map((v, j) => (j === i ? false : v)));
          setSlots((prev) => prev.map((s, j) => (j === i ? target[i] : s)));
          if (i === STOPS.length - 1) {
            clearInterval(flick);
            setSettled(true);
          }
        }, at),
      );
    });
    spinningRef.current = [true, true, true];
  };

  // Otomatik dönme: sıradaki anlamlı üçlüye
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (paused.current) return;
      comboIndex.current = (comboIndex.current + 1) % COMBOS.length;
      spinTo(COMBOS[comboIndex.current].set);
    }, AUTO_MS);
    return () => clearInterval(id);
    // spinTo her çizimde yeniden oluşur ama yalnız ref ve setState kullanır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(
    () => () => {
      clearTimers();
      clearTimeout(pauseTimer.current);
    },
    [],
  );

  const pause = () => {
    paused.current = true;
    clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => (paused.current = false), PAUSE_MS);
  };

  const pick = (i: number) => {
    if (!settled) return;
    pause();
    setSlots((prev) => {
      // Aynı hizmet iki kutuda olmasın: sıradaki kullanılmayan hizmete geç
      const start = ITEMS.findIndex((it) => it.slug === prev[i]);
      for (let k = 1; k <= ITEMS.length; k++) {
        const next = ITEMS[(start + k) % ITEMS.length].slug;
        if (!prev.some((s, j) => j !== i && s === next)) return prev.map((s, j) => (j === i ? next : s));
      }
      return prev;
    });
  };

  const shuffle = () => {
    pause();
    // Sıradaki üçlü (aynısı tekrar gelmez)
    const next = (comboIndex.current + 1) % COMBOS.length;
    comboIndex.current = next;
    spinTo(COMBOS[next].set);
  };

  const result = resultOf(slots);
  const plan = slots.map((s) => bySlug(s).label).join(" + ");

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {/* Üç eşit kutu, aralarında "+" */}
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 md:gap-3">
        {slots.map((slug, i) => (
          <Fragment key={i}>
            <button
              type="button"
              onClick={() => pick(i)}
              aria-label={`${i + 1}. kutu: ${bySlug(slug).label}. Değiştirmek için dokun`}
              className={cn(
                "group relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-[20px] border bg-[#0d0d0d] outline-none transition-[border-color,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-white/60",
                settled ? "border-accent/60 shadow-[0_0_50px_-14px_rgba(47,107,255,0.9)]" : "border-white/10",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={spinning[i] ? `${slug}-${tick}` : slug}
                  initial={{ y: spinning[i] ? "-60%" : "-30%", opacity: 0, filter: spinning[i] ? "blur(3px)" : "blur(0px)" }}
                  animate={{ y: 0, opacity: 1, filter: spinning[i] ? "blur(2px)" : "blur(0px)" }}
                  exit={{ y: "60%", opacity: 0 }}
                  transition={spinning[i] ? { duration: 0.07 } : { type: "spring", stiffness: 380, damping: 22 }}
                  className="flex flex-col items-center gap-3"
                >
                  <MiniGlyph glyph={bySlug(slug).glyph} cell={7} className={cn(settled ? "text-accent" : "text-white/70")} />
                  <span className="text-[clamp(13px,1.05vw,17px)] font-medium tracking-[-0.01em] text-white">
                    {bySlug(slug).label}
                  </span>
                </motion.span>
              </AnimatePresence>
              <span className="pointer-events-none absolute bottom-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/0 transition-colors group-hover:text-white/40">
                Değiştir
              </span>
            </button>
            {i < 2 && <span className="text-[clamp(18px,1.6vw,28px)] font-medium text-white/30">+</span>}
          </Fragment>
        ))}
      </div>

      {/* = sonuç */}
      <div className="mt-4 flex items-stretch gap-3">
        <span className="grid w-12 shrink-0 place-items-center rounded-[20px] bg-white/[0.04] text-[28px] font-medium text-white/40 ring-1 ring-white/10 md:w-16">
          =
        </span>
        <div
          className={cn(
            "flex min-h-[132px] flex-1 flex-col justify-between gap-4 rounded-[20px] p-5 transition-colors duration-500 md:p-6",
            settled ? "bg-accent text-white" : "bg-white/[0.04] text-white/40 ring-1 ring-white/10",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={settled ? result : "spin"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[clamp(20px,1.7vw,28px)] font-medium leading-[1.15] tracking-[-0.03em]"
            >
              {settled ? result : "Plan hazırlanıyor…"}
            </motion.p>
          </AnimatePresence>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={talepUrl({ konu: `${plan} planı` })}
              className={cn(
                "flex h-11 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[14px] font-semibold transition-opacity",
                settled ? "bg-white text-[#111]" : "pointer-events-none bg-white/10 text-white/40",
              )}
            >
              Bu planı konuşalım
              <span className="grid size-8 place-items-center rounded-full bg-accent">
                <PixelIcon variant="arrow" className="size-[9px]" cellClassName="fill-white" />
              </span>
            </a>
            <button
              type="button"
              onClick={shuffle}
              disabled={!settled}
              className="h-11 rounded-full px-5 text-[14px] font-semibold ring-1 ring-current/30 transition-opacity disabled:opacity-40"
            >
              Karıştır ↻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
