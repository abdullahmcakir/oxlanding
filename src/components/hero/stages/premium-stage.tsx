"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { usePageVisible } from "@/hooks/use-page-visible";
import { CONTACT_EMAIL } from "@/lib/links";
import { cn } from "@/lib/utils";

// Hero sahnesi "Premium": tuval çizimi yerine gerçek HTML (sitenin kendi yazı tipi, gerçek gölgeler, keskin yazı).
// Bilinçli olarak yok: neon parlama, ızgara, tarama çizgisi, nokta bulutu, köşe kod etiketleri, gri iskelet çubuklar.
// Her sekans tek bir sakin kompozisyon; geçişler yumuşak (bulanıklaşarak çıkış, yükselerek giriş).
// Sıra Referans 2 ile aynı: Sonuç → Marka → Website → SEO → Sosyal Medya → Reklam. Yazılarda rakam ya da vaat yok.
// Ekrandan çıkınca ve sekme arka plandayken durur; "hareketi azalt"ta Sonuç sabit kalır.

export const PREMIUM_WORDS = ["sonuç", "Marka", "Website", "SEO", "Sosyal Medya", "Reklam"];
const SHOT_MS = 3600;
const W = 640; // çizim tahtası (ekrana sığacak şekilde ölçeklenir)
const H = 600;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Yükselerek, bulanıktan netleşerek giriş */
const rise = (delay = 0, y = 18) => ({
  initial: { opacity: 0, y, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay, duration: 0.9, ease: EASE },
});

export function PremiumStage({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const [shot, setShot] = useState(0);
  const shotRef = useRef(0);
  const onWordRef = useRef(onWord);
  useEffect(() => {
    onWordRef.current = onWord;
  });

  useEffect(() => {
    if (!inView || !pageVisible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      // Geliştirmede tek sekansı kilitlemek için: localStorage "ox-film-sekans" = 0–5
      let next = (shotRef.current + 1) % SHOTS.length;
      try {
        const forced = Number(localStorage.getItem("ox-film-sekans") ?? NaN);
        if (process.env.NODE_ENV === "development" && forced >= 0 && forced < SHOTS.length) next = forced;
      } catch {}
      if (next === shotRef.current) return;
      shotRef.current = next;
      setShot(next);
      onWordRef.current?.(next);
    }, SHOT_MS);
    return () => clearInterval(id);
  }, [inView, pageVisible]);

  const Shot = SHOTS[shot];
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("pointer-events-none", className)} aria-hidden>
        {/* Çok hafif ortam ışığı: parlama değil, derinlik */}
        <div className="absolute right-[-10%] top-[10%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(47,107,255,0.13),transparent)] max-lg:left-0 max-lg:top-0 max-lg:h-1/2 max-lg:w-full" />
        <div
          ref={ref}
          className="absolute inset-x-4 top-[76px] h-[40svh] lg:inset-x-auto lg:bottom-28 lg:left-[47%] lg:right-[4.5vw] lg:top-24 lg:h-auto"
        >
          <Artboard>
            <AnimatePresence mode="wait">
              <motion.div
                key={shot}
                className="absolute inset-0"
                exit={{ opacity: 0, scale: 0.985, filter: "blur(10px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Shot />
              </motion.div>
            </AnimatePresence>
          </Artboard>
        </div>
      </div>
    </MotionConfig>
  );
}

/** Sabit ölçülü çizim tahtası, kutusuna sığacak şekilde ölçeklenir */
function Artboard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / W, e.contentRect.height / H, 1.3)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative size-full">
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, translate: "-50% -50%", scale }}>
        {children}
      </div>
    </div>
  );
}

/* ───────────── Küçük parçalar ───────────── */

/** Logo: beyaz PNG; renkli istenirse maske ile boyanır */
function Mark({ className, tone = "white" }: { className?: string; tone?: "white" | "blue" | "ink" }) {
  if (tone === "white") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/images/logo.png" alt="" className={cn("block object-contain", className)} draggable={false} />;
  }
  return (
    <span
      className={cn("block", tone === "blue" ? "bg-accent" : "bg-[#0b0b0c]", className)}
      style={{
        maskImage: "url(/images/logo.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

const SHADOW = "shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9),0_18px_36px_-18px_rgba(0,0,0,0.7)]";
const BLUE_TILE = "bg-[linear-gradient(160deg,#4f84ff_0%,#2f6bff_42%,#2152dc_100%)]";

function Heart({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 20.5s-7.5-4.4-9.3-9.2C1.5 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.6 3.5 4.4 6.8-1.8 4.8-9.3 9.2-9.3 9.2Z" strokeLinejoin="round" />
    </svg>
  );
}
function Comment({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5Z" strokeLinejoin="round" />
    </svg>
  );
}
function Send({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" strokeLinejoin="round" />
    </svg>
  );
}
function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────────── Sekanslar ───────────── */

// 1 · Sonuç: marka karosu ve üst üste gelen gerçek bildirimler
function Sonuc() {
  return (
    <>
      <motion.div {...rise(0, 24)} className="absolute left-[120px] top-[170px]">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={cn("grid size-[340px] place-items-center rounded-[48px] ring-1 ring-inset ring-white/15", BLUE_TILE, SHADOW)}
        >
          <Mark className="size-[200px]" />
        </motion.div>
      </motion.div>
      {[
        { title: "Yeni görüşme talebi", body: "Web sitesinden · şimdi", delay: 0.8, top: 92, left: 262, z: 2 },
        { title: "Yeni mesaj", body: "Merhaba, bilgi almak istiyorum.", delay: 1.5, top: 176, left: 300, z: 1 },
      ].map((n) => (
        <motion.div
          key={n.title}
          initial={{ opacity: 0, y: -22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: n.delay, type: "spring", stiffness: 260, damping: 26 }}
          className={cn("absolute flex w-[318px] items-center gap-3.5 rounded-[22px] bg-[#f4f4f1]/95 p-3.5 pr-5 text-[#0b0b0c] backdrop-blur", SHADOW)}
          style={{ top: n.top, left: n.left, zIndex: n.z }}
        >
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-[12px]", BLUE_TILE)}>
            <Mark className="size-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-semibold tracking-[-0.02em]">{n.title}</span>
              <span className="text-[12px] text-black/40">şimdi</span>
            </span>
            <span className="block truncate text-[13.5px] text-black/55">{n.body}</span>
          </span>
        </motion.div>
      ))}
    </>
  );
}

// 2 · Marka: kimlik panosu (sembol, renkler, yazı tipi, kartvizit)
function Marka() {
  const tile = "relative overflow-hidden rounded-[26px]";
  const s = (i: number) => rise(i * 0.09, 22);
  return (
    <div className="absolute inset-x-[10px] inset-y-[30px] grid grid-cols-3 grid-rows-3 gap-3">
      <motion.div {...s(0)} className={cn(tile, "col-span-2 row-span-2 grid place-items-center ring-1 ring-inset ring-white/15", BLUE_TILE, SHADOW)}>
        <Mark className="size-[190px]" />
        <span className="absolute bottom-5 left-6 text-[13px] font-medium text-white/70">Sembol</span>
      </motion.div>
      <motion.div {...s(1)} className={cn(tile, "flex flex-col justify-between bg-[#f2f0eb] p-5 text-[#0b0b0c]", SHADOW)}>
        <Mark tone="blue" className="size-14" />
        <span className="text-[20px] font-semibold tracking-[-0.04em]">OX Dijital</span>
      </motion.div>
      <motion.div {...s(2)} className={cn(tile, "flex flex-col justify-between bg-[#111113] p-5 ring-1 ring-inset ring-white/[0.07]", SHADOW)}>
        <span className="text-[86px] font-medium leading-none tracking-[-0.06em] text-white">Aa</span>
        <span className="flex justify-between text-[13px] text-white/50">
          <span>Inter</span>
          <span>Space Mono</span>
        </span>
      </motion.div>
      <motion.div {...s(3)} className={cn(tile, "flex flex-col", SHADOW)}>
        {[
          ["#2f6bff", "#2F6BFF", "text-white"],
          ["#0b0b0c", "#0B0B0C", "text-white/70"],
          ["#f2f0eb", "#F2F0EB", "text-black/60"],
        ].map(([bg, hex, ink]) => (
          <span key={hex} className={cn("flex flex-1 items-end px-4 pb-2 font-mono text-[11px]", ink)} style={{ background: bg }}>
            {hex}
          </span>
        ))}
      </motion.div>
      <motion.div {...s(4)} className={cn(tile, "col-span-2 grid place-items-center bg-[#1a1a1d]", SHADOW)}>
        <motion.div
          initial={{ rotate: -14, y: 30, opacity: 0 }}
          animate={{ rotate: -5, y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.1, ease: EASE }}
          className="flex h-[118px] w-[236px] flex-col justify-between rounded-[10px] bg-[#f7f6f2] p-4 text-[#0b0b0c] shadow-[0_24px_40px_-14px_rgba(0,0,0,0.8)]"
        >
          <Mark tone="blue" className="size-9" />
          <span>
            <span className="block text-[13px] font-semibold tracking-[-0.02em]">OX Dijital</span>
            <span className="block text-[11px] text-black/50">{CONTACT_EMAIL}</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Website sekansında tarayıcıda ve telefonda kayan açık renkli site */
function SitePage({ compact }: { compact?: boolean }) {
  return (
    <div className="bg-[#f7f6f2] text-[#0b0b0c]">
      <div className={cn("flex items-center justify-between", compact ? "px-4 py-3" : "px-7 py-4")}>
        <span className="flex items-center gap-2">
          <Mark tone="blue" className={compact ? "size-5" : "size-6"} />
          <span className={cn("font-semibold tracking-[-0.03em]", compact ? "text-[11px]" : "text-[13px]")}>OX Dijital</span>
        </span>
        {!compact && (
          <span className="flex items-center gap-5 text-[11px] text-black/55">
            <span>Hizmetler</span>
            <span>Paketler</span>
            <span>İletişim</span>
            <span className="rounded-full bg-[#0b0b0c] px-3 py-1.5 text-white">Görüşme</span>
          </span>
        )}
      </div>
      <div className={compact ? "px-4 pt-4" : "px-7 pt-8"}>
        <p className={cn("font-medium leading-[0.95] tracking-[-0.055em]", compact ? "text-[26px]" : "text-[46px]")}>
          Daha etkili
          <br />
          <span className="text-accent">website.</span>
        </p>
        <p className={cn("max-w-[300px] text-black/55", compact ? "mt-2 text-[9px]" : "mt-3 text-[12px]")}>
          Markana özel tasarım, sade ve hızlı bir altyapı. Tek ekip, tek plan.
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-accent font-medium text-white",
            compact ? "mt-3 px-3 py-1.5 text-[9px]" : "mt-4 px-4 py-2 text-[11px]",
          )}
        >
          Ücretsiz görüşme <Chevron className="size-3" />
        </span>
      </div>
      <div className={compact ? "px-4 pt-5" : "px-7 pt-7"}>
        <div className={cn("grid place-items-center rounded-[16px]", BLUE_TILE, compact ? "h-[130px]" : "h-[230px]")}>
          <Mark className={compact ? "size-16" : "size-28"} />
        </div>
      </div>
      <div className={cn("grid gap-3", compact ? "grid-cols-1 px-4 py-5" : "grid-cols-3 px-7 py-7")}>
        {[
          ["Tasarım", "Marka diline uygun arayüz"],
          ["Geliştirme", "Hızlı ve güvenli altyapı"],
          ["SEO", "Aramada bulunur yapı"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-[12px] bg-white p-3.5 ring-1 ring-black/[0.06]">
            <span className="block text-[12px] font-semibold tracking-[-0.02em]">{t}</span>
            <span className="mt-1 block text-[10px] text-black/50">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 · Website: tarayıcı penceresinde site yavaşça kayar, telefon sürümü öne gelir
function Website() {
  return (
    <>
      <motion.div {...rise(0, 26)} className={cn("absolute left-0 top-[56px] w-[560px] overflow-hidden rounded-[18px] bg-[#141416] ring-1 ring-white/10", SHADOW)}>
        <div className="flex h-10 items-center gap-2 px-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-white/15" />
          ))}
          <span className="mx-auto flex h-6 w-[220px] items-center justify-center rounded-md bg-white/[0.06] text-[11px] text-white/55">
            oxdijital.com
          </span>
        </div>
        <div className="h-[390px] overflow-hidden">
          <motion.div initial={{ y: 0 }} animate={{ y: -250 }} transition={{ delay: 0.9, duration: 2.4, ease: [0.65, 0, 0.35, 1] }}>
            <SitePage />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.1, duration: 1, ease: EASE }}
        className={cn("absolute right-[6px] top-[214px] h-[360px] w-[176px] overflow-hidden rounded-[34px] bg-[#0b0b0c] p-[7px] ring-1 ring-white/15", SHADOW)}
      >
        <div className="relative h-full overflow-hidden rounded-[28px]">
          <span className="absolute left-1/2 top-2 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-black" />
          <motion.div initial={{ y: 0 }} animate={{ y: -120 }} transition={{ delay: 1.6, duration: 1.8, ease: [0.65, 0, 0.35, 1] }} className="pt-5">
            <SitePage compact />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

// 4 · SEO: arama yazılır, OX'in zengin sonucu belirir (sıra ya da vaat yok)
function Seo() {
  const query = "istanbul dijital ajans";
  return (
    <>
      <motion.div
        {...rise(0.15, 30)}
        className="absolute left-[46px] top-[118px] h-[400px] w-[548px] rounded-[26px] bg-white/[0.04] ring-1 ring-white/[0.06]"
      />
      <motion.div {...rise(0, 22)} className={cn("absolute left-[20px] top-[70px] w-[600px] rounded-[26px] bg-[#f7f6f2] p-6 text-[#0b0b0c]", SHADOW)}>
        <div className="flex h-12 items-center gap-3 rounded-full bg-white px-5 ring-1 ring-black/[0.07]">
          <svg viewBox="0 0 24 24" className="size-4 text-black/40" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <span className="flex text-[15px] tracking-[-0.01em]">
            {query.split("").map((ch, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.035, duration: 0.01 }}>
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="ml-0.5 inline-block h-[18px] w-px translate-y-0.5 bg-accent"
            />
          </span>
        </div>
        <motion.div {...rise(1.3, 14)} className="mt-6 px-1">
          <div className="flex items-center gap-3">
            <span className={cn("grid size-8 place-items-center rounded-full", BLUE_TILE)}>
              <Mark className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-medium">OX Dijital</span>
              <span className="block text-[12px] text-black/45">oxdijital.com</span>
            </span>
          </div>
          <p className="mt-3 text-[21px] font-medium tracking-[-0.03em] text-[#1d3fbf]">OX Dijital · Website, SEO ve Reklam</p>
          <p className="mt-1.5 max-w-[500px] text-[13.5px] leading-[1.5] text-black/60">
            İstanbul merkezli dijital ajans. Website, sosyal medya, SEO ve reklam tek çatı altında; tek ekip, tek plan.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-black/[0.07] pt-4">
            {[
              ["Hizmetler", "Website, SEO, sosyal medya, reklam"],
              ["Paketler", "İhtiyaca göre hazırlanan planlar"],
              ["Çalışmalar", "Yaptığımız işler"],
              ["İletişim", "Ücretsiz görüşme ayarla"],
            ].map(([t, d], i) => (
              <motion.span key={t} {...rise(1.7 + i * 0.08, 8)} className="block">
                <span className="block text-[14px] font-medium text-[#1d3fbf]">{t}</span>
                <span className="block text-[12px] text-black/50">{d}</span>
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/** Sosyal medya gönderisi */
function Post({ children, liked, className }: { children: React.ReactNode; liked?: boolean; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[22px] bg-[#121214] ring-1 ring-white/[0.08]", SHADOW, className)}>
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <span className={cn("grid size-7 place-items-center rounded-full", BLUE_TILE)}>
          <Mark className="size-4" />
        </span>
        <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-white">oxdijital</span>
      </div>
      <div className="relative aspect-[4/5]">{children}</div>
      <div className="flex items-center gap-3.5 px-3.5 py-3 text-white/85">
        <motion.span
          animate={liked ? { scale: [1, 1.35, 1] } : undefined}
          transition={{ delay: 1.75, duration: 0.45 }}
          className={liked ? "text-[#ff3b5c]" : undefined}
        >
          <Heart filled={liked} className="size-[19px]" />
        </motion.span>
        <Comment className="size-[19px]" />
        <Send className="size-[18px]" />
      </div>
    </div>
  );
}

// 5 · Sosyal medya: üç gönderi, ortadaki beğenilir
function Sosyal() {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLiked(true), 1650);
    return () => clearTimeout(id);
  }, []);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 30 }}
        transition={{ delay: 0.15, duration: 1.2, ease: EASE }}
        className="absolute left-0 top-[40px] w-[200px] -rotate-[4deg]"
      >
        <Post>
          <div className="absolute inset-0 flex flex-col justify-end bg-[#f2f0eb] p-4">
            <span className="text-[34px] font-medium leading-[0.92] tracking-[-0.06em] text-[#0b0b0c]">
              Daha
              <br />
              etkili.
            </span>
          </div>
        </Post>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 30 }}
        transition={{ delay: 0.3, duration: 1.2, ease: EASE }}
        className="absolute right-0 top-[40px] w-[200px] rotate-[4deg]"
      >
        <Post>
          <div className="absolute inset-0 grid place-items-center bg-[#0b0b0c]">
            <Mark tone="blue" className="size-24" />
          </div>
        </Post>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute left-1/2 top-[30px] z-10 w-[250px] -translate-x-1/2"
      >
        <Post liked={liked}>
          <div className={cn("absolute inset-0 grid place-items-center", BLUE_TILE)}>
            <Mark className="size-32" />
            {liked && (
              <motion.span
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 1.05] }}
                transition={{ duration: 1.1, times: [0, 0.25, 0.7, 1] }}
                className="absolute text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              >
                <Heart filled className="size-24" />
              </motion.span>
            )}
          </div>
        </Post>
      </motion.div>
    </>
  );
}

// 6 · Reklam: sponsorlu gönderi → dokunuş → mesaj gelir
function Reklam() {
  return (
    <>
      <motion.div {...rise(0, 26)} className="absolute left-[40px] top-[36px] w-[290px]">
        <div className={cn("overflow-hidden rounded-[22px] bg-[#121214] ring-1 ring-white/[0.08]", SHADOW)}>
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <span className={cn("grid size-7 place-items-center rounded-full", BLUE_TILE)}>
              <Mark className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[12.5px] font-semibold text-white">oxdijital</span>
              <span className="block text-[10.5px] text-white/45">Sponsorlu</span>
            </span>
          </div>
          <div className={cn("relative flex aspect-square flex-col justify-between p-5", BLUE_TILE)}>
            <Mark className="size-16" />
            <span className="text-[32px] font-medium leading-[0.95] tracking-[-0.055em] text-white">
              Markanı birlikte
              <br />
              kuralım.
            </span>
          </div>
          <div className="relative flex items-center justify-between overflow-hidden bg-[#1b1b1f] px-4 py-3.5 text-[13px] font-semibold text-white">
            Mesaj gönder
            <Chevron className="size-4 text-white/60" />
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.35, 0], scale: [0, 1, 1.4] }}
              transition={{ delay: 1.15, duration: 0.7 }}
              className="absolute left-[40%] top-1/2 size-28 -translate-y-1/2 rounded-full bg-white"
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.45, duration: 0.9, ease: EASE }}
        className={cn("absolute right-[10px] top-[210px] w-[300px] overflow-hidden rounded-[24px] bg-[#f4f4f1] text-[#0b0b0c]", SHADOW)}
      >
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
          <span className={cn("grid size-8 place-items-center rounded-full", BLUE_TILE)}>
            <Mark className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-semibold">OX Dijital</span>
            <span className="block text-[11px] text-black/45">çevrimiçi</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <motion.span
            {...rise(1.85, 8)}
            className="self-end rounded-[16px] rounded-br-[5px] bg-accent px-3.5 py-2 text-[13px] text-white"
          >
            Merhaba, reklamınızı gördüm.
          </motion.span>
          <motion.span
            {...rise(2.15, 8)}
            className="self-end rounded-[16px] rounded-br-[5px] bg-accent px-3.5 py-2 text-[13px] text-white"
          >
            Bilgi alabilir miyim?
          </motion.span>
          <motion.span {...rise(2.6, 8)} className="flex w-fit gap-1 rounded-[16px] rounded-bl-[5px] bg-white px-3.5 py-3 ring-1 ring-black/[0.05]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                className="size-1.5 rounded-full bg-black/60"
              />
            ))}
          </motion.span>
        </div>
      </motion.div>
    </>
  );
}

const SHOTS = [Sonuc, Marka, Website, Seo, Sosyal, Reklam];
