"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import { HeroCopy } from "./hero-copy";
import { BrandFilm, FILM_WORDS } from "./stages/brand-film";
import { BrandFilm2, FILM2_WORDS } from "./stages/brand-film-2";
import { BrandFilmPlus, FILM_PLUS_WORDS } from "./stages/brand-film-plus";
import { BrandFilmStyles, STYLE_WORDS } from "./stages/brand-film-styles";
import { BrandFilmPop, POP_WORDS } from "./stages/brand-film-pop";
import { BrandFilmStudio, STUDIO_WORDS } from "./stages/brand-film-studio";
import { BrandFilmRef, REF_WORDS } from "./stages/brand-film-ref";
import { BrandFilmSix, FINAL_WORDS, SIX_WORDS } from "./stages/brand-film-six";
import { BrandFilm3, FILM3_WORDS } from "./stages/brand-film-3";
import { PREMIUM_WORDS, PremiumStage } from "./stages/premium-stage";
import { SIGNATURE_WORDS, SignatureStage } from "./stages/signature-stage";
import { ShowroomHero } from "./showroom-hero";

// Hero denemeleri (video sonraya bırakıldı; eski geçici video: Cloudinary "reels/k9wv5dzwdcxfga6orb2o").
// Solda hepsinde aynı metin (HeroCopy), sahne değişir:
//   Vitrin, Signature, Final — Studio – Codex denemeleri (showroom-hero.tsx, signature-stage.tsx, brand-film-six refined); kullanılmayacak, karşılaştırma için duruyor
//   Final – site sahibinin ekran görüntüleriyle seçtiği sahneler, Stiller 6 Tam yapısında (FINAL_SEQUENCE, brand-film-six.tsx)
//   Stiller 6 Tam – Stiller 6 çerçevesiz: sahne bütün hero'yu kaplar, metnin arkasında sahne renginde örtü, açık sahnede metin koyulaşır
//   Stiller 6 – ikinci referans seti: matematik, HUD, neon karalama, çizgi film, 8-bit oyun, blueprint, terminal (brand-film-six.tsx)
//   Stiller 4 – site sahibinin referans görsellerinden türetilen üsluplar (brand-film-ref.tsx)
//   Stiller 3 – Stiller 2'nin stüdyo işçiliği: çerçeve, sabit logo, tasarlanmış geçişler, kendi sticker seti (brand-film-studio.tsx)
//   Stiller 2 – Stiller renkli ve çekici hâli (brand-film-pop.tsx): 15 üslup, bildirim/sohbet/sticker/emoji çıkışları
//   Stiller – Referans+ çeşitlendirilmiş: her kesme başka üslup (eskiz, cyberpunk, 8-bit, glitch…) + hizmete özel bildirim
//   Referans+ – Referans'ın premium hâli (brand-film-plus.tsx): salınan gölgeli sembol, yansıma, kadraj değişimi, temiz kesme
//   Premium – gerçek HTML ile sade, premium kompozisyonlar (premium-stage.tsx); neon/ızgara/kod etiketi yok
//   3D – Referans 2'nin gerçek 3B hâli (three.js + GSAP; motor film3-engine.ts, ayrı parça olarak yüklenir)
//   Referans 2 – Marka filmi 2: OX sembolü her sekansta bir işin içinde (Marka, Website, SEO, Sosyal Medya, Reklam, Sonuç)
//   Referans – Marka filmi (ilk hâli, olduğu gibi): site sahibinin verdiği referans videoya göre görüntüleme modları
// Karar verilince yalnız seçilen kalır; DEFAULT o olur ve geliştirme seçicisi kaldırılır.

type Variant = "Final" | "Stiller 6 Tam" | "Stiller 6" | "Stiller 4" | "Stiller 3" | "Stiller 2" | "Stiller" | "Referans+" | "Premium" | "3D" | "Referans 2" | "Referans" | "Vitrin" | "Signature" | "Final — Studio";
const VARIANTS: Variant[] = ["Final", "Stiller 6 Tam", "Stiller 6", "Stiller 4", "Stiller 3", "Stiller 2", "Stiller", "Referans+", "Premium", "3D", "Referans 2", "Referans", "Vitrin", "Signature", "Final — Studio"];
// Seçici geliştirmede ve NOINDEX=1 test sitesinde açık (next.config.ts → HERO_DENEME); asıl sitede kapalı ve hep Referans 2
const SWITCH = process.env.NODE_ENV === "development" || process.env.HERO_DENEME === "1";
const DEFAULT: Variant = SWITCH ? "Final" : "Referans 2";
const STORE_KEY = "ox-hero-deneme";

// Seçilen deneme tarayıcıda hatırlanır (seçici kapalıyken hep DEFAULT)
const CHANGE = "ox-hero-deneme";
function readVariant(): Variant {
  try {
    const saved = localStorage.getItem(STORE_KEY) as Variant | null;
    return saved && VARIANTS.includes(saved) ? saved : DEFAULT;
  } catch {
    return DEFAULT;
  }
}
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  return () => window.removeEventListener(CHANGE, onChange);
}

// Sahne bütün hero'yu kapladığında metin okunur kalsın: solu (dar ekranda altı) koyulaştırır
const SHADE =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,4,0.98)_0%,rgba(3,3,4,0.82)_31%,rgba(3,3,4,0.08)_56%,transparent_100%)] max-lg:bg-[linear-gradient(180deg,transparent_0%,rgba(3,3,4,0.08)_34%,rgba(3,3,4,0.96)_62%,#030304_100%)]";
// Çerçeveli sahnede geniş ekranda gölge gerekmez (sahne metnin yanında); dar ekranda metin altta, alt koyulaşma kalır
const SHADE_MOBILE =
  "pointer-events-none absolute inset-0 lg:hidden bg-[linear-gradient(180deg,transparent_0%,transparent_40%,rgba(3,3,4,0.96)_58%,#030304_100%)]";
const COPY_WRAP = "relative z-10 flex min-h-[calc(100svh)] items-end px-4 pb-24 pt-28 md:px-[4.5vw] md:pb-32 lg:items-center lg:pb-20";

export function Hero() {
  const variant = useSyncExternalStore(subscribe, SWITCH ? readVariant : () => DEFAULT, () => DEFAULT);
  const [word, setWord] = useState(0);
  const [tone, setTone] = useState<"light" | "dark">("dark");

  const choose = (v: Variant) => {
    setWord(0);
    setTone("dark");
    try {
      localStorage.setItem(STORE_KEY, v);
    } catch {}
    window.dispatchEvent(new Event(CHANGE));
  };

  // Tam ekran sahneler: sahne arkada, metin solda
  const fullBleed = (stage: React.ReactNode, words: string[], shade = SHADE) => (
    <>
      {stage}
      <div className={shade} />
      <div className={COPY_WRAP}>
        <HeroCopy words={words} wordIndex={word} tone={tone} className="w-full min-w-0 lg:w-[45%]" />
      </div>
    </>
  );

  return (
    // Alttaki beyaz bölüm, hero'nun son 48px'inin üstüne yuvarlak köşeli bir sayfa gibi biner.
    <section className="relative min-h-[calc(100svh+48px)] overflow-hidden bg-[#030304] text-white">
      {variant === "Vitrin" && <ShowroomHero />}
      {variant === "Signature" &&
        fullBleed(<SignatureStage key="signature" onWord={setWord} className="absolute inset-0" />, SIGNATURE_WORDS, "pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#07080b_0%,transparent_57%)] max-lg:bg-[linear-gradient(180deg,transparent_30%,#07080b_54%)]")}
      {variant === "Final" &&
        fullBleed(<BrandFilmSix key="final" bleed final onTone={setTone} onWord={setWord} className="absolute inset-0" />, FINAL_WORDS, "")}
      {variant === "Final — Studio" &&
        fullBleed(<BrandFilmSix key="final-studio" bleed final refined onTone={setTone} onWord={setWord} className="absolute inset-0" />, FINAL_WORDS, "")}
      {variant === "Stiller 6 Tam" &&
        fullBleed(<BrandFilmSix key="stiller6tam" bleed onTone={setTone} onWord={setWord} className="absolute inset-0" />, SIX_WORDS, "")}
      {variant === "Stiller 6" && fullBleed(<BrandFilmSix key="stiller6" onWord={setWord} className="absolute inset-0" />, SIX_WORDS, SHADE_MOBILE)}
      {variant === "Stiller 4" && fullBleed(<BrandFilmRef key="stiller4" onWord={setWord} className="absolute inset-0" />, REF_WORDS, SHADE_MOBILE)}
      {variant === "Stiller 3" && fullBleed(<BrandFilmStudio key="stiller3" onWord={setWord} className="absolute inset-0" />, STUDIO_WORDS, SHADE_MOBILE)}
      {variant === "Stiller 2" && fullBleed(<BrandFilmPop key="stiller2" onWord={setWord} className="absolute inset-0" />, POP_WORDS)}
      {variant === "Stiller" && fullBleed(<BrandFilmStyles key="stiller" onWord={setWord} className="absolute inset-0" />, STYLE_WORDS)}
      {variant === "Referans+" && fullBleed(<BrandFilmPlus key="refplus" onWord={setWord} className="absolute inset-0" />, FILM_PLUS_WORDS)}
      {variant === "Premium" && fullBleed(<PremiumStage key="premium" onWord={setWord} className="absolute inset-0" />, PREMIUM_WORDS)}
      {variant === "3D" && fullBleed(<BrandFilm3 key="3d" onWord={setWord} className="absolute inset-0" />, FILM3_WORDS)}
      {variant === "Referans 2" && fullBleed(<BrandFilm2 key="ref2" onWord={setWord} className="absolute inset-0" />, FILM2_WORDS)}
      {variant === "Referans" && fullBleed(<BrandFilm key="ref" onWord={setWord} className="absolute inset-0" />, FILM_WORDS)}

      {/* Alt satır: künye + kaydırma işareti (alttaki 48px'in hemen üstünde) */}
      {variant !== "Vitrin" && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className={cn(
          "absolute inset-x-4 bottom-[72px] z-20 hidden items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 md:inset-x-[4.5vw] md:flex",
          tone === "light" ? "text-black/45" : "text-white/35",
        )}
      >
        <span>İstanbul · Türkiye geneli</span>
        <a href="#hakkimizda" aria-label="Aşağı kaydır" className="flex items-center gap-2.5 transition-colors hover:text-white">
          Kaydır
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <PixelIcon variant="arrow" className="size-[9px] rotate-90" />
          </motion.span>
        </a>
      </motion.div>}

      {/* Geliştirmede ve test sitesinde: denemeler arasında geçiş */}
      {SWITCH && (
        <div className="fixed bottom-4 left-1/2 z-[60] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-white p-1 text-[13px] font-semibold text-[#111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          <span className="px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">Hero</span>
          {VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => choose(v)}
              className={cn("h-8 whitespace-nowrap rounded-full px-3 transition-colors", variant === v ? "bg-accent text-white" : "hover:bg-neutral-100")}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
