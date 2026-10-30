"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { GLASS } from "@/components/dock/dock-variants";
import { MiniGlyph, PixelMatrix, type Glyph } from "@/components/dock/pixel-matrix";
import { cn } from "@/lib/utils";
import { closeCookieAsk, initConsent, openCookieAsk, saveConsent, useConsentState, type Consent } from "./cookie-consent";

// Çerez sorusunu sağ alttaki asistan sorar: ayrı bir banner yerine aynı piksel karakter, aynı yerde.
// - Yüz kurabiyeye dönüşür. Butonlar şekli önizler: "Kabul et" tam kurabiye, "Yalnız zorunlu" bir ısırığı eksik.
// - Kabul edilince kurabiye piksel piksel yenir ve yüz gülümser; zorunluda tek ısırık alınır, yüz tike döner.
// - İki seçenek baştan açık ve eşit ağırlıkta (KVKK: reddetmek kabul etmek kadar kolay olmalı).
// - Kendiliğinden açıldıysa ve cevapsız kalırsa (AUTO_CLOSE ya da yaklaşık bir ekran kaydırma) geri çekilir;
//   tercih yazılmaz, asistanın köşesinde küçük bir kurabiye kalır.

const AUTO_CLOSE = 10_000;
const EASE = [0.22, 1, 0.36, 1] as const;

// Seçimden sonra yüzün geçtiği kareler (ms)
const SEQUENCE: Record<Consent, { at: number; glyph: Glyph }[]> = {
  all: [
    { at: 0, glyph: "cookieBite" },
    { at: 450, glyph: "cookieHalf" },
    { at: 900, glyph: "crumbs" },
    { at: 1350, glyph: "smile" },
  ],
  necessary: [
    { at: 0, glyph: "cookieBite" },
    { at: 550, glyph: "check" },
  ],
};
const CLOSE_AFTER: Record<Consent, number> = { all: 2500, necessary: 2100 };

const DONE_TEXT: Record<Consent, { eyebrow: string; line: string }> = {
  all: { eyebrow: "Teşekkürler", line: "Afiyet olsun. Tercihini kaydettik." },
  necessary: { eyebrow: "Tamam", line: "Yalnız zorunlu çerezler. Fikrini footer'dan değiştirebilirsin." },
};

/** Kök layout'ta: tercihi ilk açılışta okur, soru açıkken asistanın yerinde görünür */
export function CookieAsk() {
  const { asking } = useConsentState();

  useEffect(() => {
    // Sayfa açılışıyla aynı anda zıplamasın
    const id = setTimeout(initConsent, 700);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {asking && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.5, ease: EASE }}
          // Asistanla aynı köşe; navbar menüsünün karartması (z-40) açılınca arkada kalır
          className="fixed bottom-3 right-3 z-[35] origin-bottom-right md:bottom-5 md:right-5"
        >
          <AskPanel auto={asking === "auto"} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AskPanel({ auto }: { auto: boolean }) {
  const [choice, setChoice] = useState<Consent | null>(null);
  const [frame, setFrame] = useState<Glyph>("cookie");
  const [preview, setPreview] = useState<Glyph | null>(null);
  const [hovering, setHovering] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Kendiliğinden açıldıysa: cevapsız kalırsa çekil (üstündeyken bekler) ya da ziyaretçi sayfada ilerleyince
  useEffect(() => {
    if (!auto || choice || hovering) return;
    const id = setTimeout(closeCookieAsk, AUTO_CLOSE);
    const start = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - start) > window.innerHeight * 0.9) closeCookieAsk();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, [auto, choice, hovering]);

  const choose = (value: Consent) => {
    saveConsent(value);
    setChoice(value);
    setPreview(null);
    timers.current = [
      ...SEQUENCE[value].map((s) => setTimeout(() => setFrame(s.glyph), s.at)),
      setTimeout(closeCookieAsk, CLOSE_AFTER[value]),
    ];
  };

  const glyph = choice ? frame : (preview ?? "cookie");
  const done = choice ? DONE_TEXT[choice] : null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihi"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(GLASS, "group/ask relative w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-[24px]")}
    >
      <div className="flex items-center gap-3 p-2 pr-10">
        <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-black/50">
          <PixelMatrix glyph={glyph} />
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={choice ?? "ask"}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="min-w-0 flex-1"
          >
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
              {done ? done.eyebrow : "Çerez tercihi"}
            </span>
            <span className="mt-0.5 block text-[14px] leading-[1.3] tracking-[-0.01em] text-white/90">
              {done ? (
                done.line
              ) : (
                <>
                  Çerez ister misin? Siteyi iyileştirmek için kullanırız.{" "}
                  <Link href="/cerez-politikasi" className="text-white/55 underline underline-offset-2 hover:text-accent">
                    Ayrıntılar
                  </Link>
                </>
              )}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {!choice && (
          <motion.div
            initial={false}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1.5 px-2 pb-2 text-[14px] tracking-[-0.01em]">
              <button
                type="button"
                onClick={() => choose("necessary")}
                onMouseEnter={() => setPreview("cookieBite")}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview("cookieBite")}
                onBlur={() => setPreview(null)}
                className="h-11 rounded-[16px] bg-white/10 px-3 text-white transition-colors hover:bg-white/15"
              >
                Yalnız zorunlu
              </button>
              <button
                type="button"
                onClick={() => choose("all")}
                onMouseEnter={() => setPreview("cookie")}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview("cookie")}
                onBlur={() => setPreview(null)}
                className="h-11 rounded-[16px] bg-accent px-3 font-semibold text-black transition-[filter] hover:brightness-110"
              >
                Kabul et
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sonraya bırak: tercih yazılmaz, asistanın köşesinde kurabiye kalır */}
      {!choice && (
        <button
          type="button"
          onClick={closeCookieAsk}
          aria-label="Sonra karar ver"
          title="Sonra karar ver"
          className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="h-[1.5px] w-3 rounded-full bg-current" />
        </button>
      )}
    </div>
  );
}

// Rozetin ipucu bu ziyarette bir kez kendiliğinden görünür (sonra yalnız üstüne gelince)
const TIP_KEY = "ox-cookie-tip";
const TIP_SHOW = 4500;

/**
 * Cevap verilmediyse asistanın köşesinde: tıklayınca soru yeniden açılır.
 * Rozet ilk belirdiğinde küçük bir ipucu balonu ne işe yaradığını söyler; sonra yalnız hover / odakta.
 */
export function CookieBadge() {
  const [auto, setAuto] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TIP_KEY) === "1";
    } catch {}
    if (seen) return;
    // Asistan yerine otursun, sonra ipucu belirsin. "Görüldü" işareti ancak balon gerçekten açılınca konur
    // (effect iptal edilip yeniden çalışırsa ipucu kaybolmasın).
    const show = setTimeout(() => {
      setAuto(true);
      try {
        sessionStorage.setItem(TIP_KEY, "1");
      } catch {}
    }, 600);
    const hide = setTimeout(() => setAuto(false), 600 + TIP_SHOW);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="absolute -left-2 -top-2 z-10">
      <AnimatePresence>
        {(auto || hover) && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none absolute bottom-full left-0 mb-2.5 block w-max origin-bottom-left whitespace-nowrap rounded-[12px] bg-accent px-3 py-2 text-[13px] font-medium leading-[1.3] tracking-[-0.01em] text-black shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
          >
            Çerez tercihini buradan seçebilirsin.
            {/* Rozete bakan küçük kuyruk */}
            <span aria-hidden className="absolute -bottom-1 left-3 size-2.5 rotate-45 rounded-[2px] bg-accent" />
          </motion.span>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => openCookieAsk()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Çerez tercihini seç"
        className="grid size-7 place-items-center rounded-full bg-accent text-black shadow-[0_6px_16px_-6px_rgb(0_0_0/0.6)] ring-[3px] ring-[#141414] transition-transform hover:scale-110"
      >
        <MiniGlyph glyph="cookie" cell={2} />
      </button>
    </div>
  );
}

/** Footer ve çerez politikası sayfası: soruyu yeniden açar (tercih değiştirme / onayı geri alma) */
export function CookieSettingsButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => openCookieAsk()}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-85"
      }
    >
      {children ?? "Çerez tercihlerini değiştir"}
    </button>
  );
}
