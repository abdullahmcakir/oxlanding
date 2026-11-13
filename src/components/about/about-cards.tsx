"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Her kutu bağımsız; yerleşim about.tsx'teki şeritte değiştirilir.
// Yalnız doğrulanabilir bilgi: gerçek veri gelmeden rakam, müşteri sayısı ya da yorum eklenmez.

/** color: kutunun zemin rengi (about.tsx'teki palet); verilmezse kendi varsayılanı */
type CardProps = { className?: string; color?: string };

/** Koyu zeminde açık yazı: rengin parlaklığına göre */
export function isDark(hex?: string) {
  if (!hex) return false;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
}

const CARD = "rounded-[28px] p-6";

const TICKS = 40;

export function PlanCard({ className, color }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className={cn(CARD, "flex flex-col justify-between gap-5 bg-[#F1F1F1]", className)} style={{ backgroundColor: color }}>
      <div className="relative mx-auto mt-2 grid size-[170px] shrink-0 place-items-center">
        {/* Yalnızca ekrandayken döner */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 size-full animate-[spin_24s_linear_infinite]"
          style={{ animationPlayState: inView ? "running" : "paused" }}
          aria-hidden
        >
          {Array.from({ length: TICKS }, (_, i) => {
            const angle = (i / TICKS) * Math.PI * 2;
            const long = i % 2 === 0;
            const r1 = long ? 70 : 78;
            const r2 = 96;
            // Sunucu ve tarayıcı float sonuçları son basamakta farklılaşabiliyor (hydration uyarısı); yuvarlanır.
            const r = (v: number) => Math.round(v * 100) / 100;
            // Açıya göre soluklaşan çizgiler
            const opacity = r(0.15 + 0.85 * (0.5 + 0.5 * Math.cos(angle - Math.PI / 2)));
            return (
              <line
                key={i}
                x1={r(100 + Math.cos(angle) * r1)}
                y1={r(100 + Math.sin(angle) * r1)}
                x2={r(100 + Math.cos(angle) * r2)}
                y2={r(100 + Math.sin(angle) * r2)}
                stroke="#1A1A1A"
                strokeWidth={2.4}
                strokeLinecap="round"
                opacity={opacity}
              />
            );
          })}
        </svg>
        <span className="relative grid size-16 place-items-center rounded-full bg-[#1A1A1A] text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[22px]"
            aria-hidden
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </span>
      </div>
      <div>
        <p className="text-[20px] tracking-[-0.02em] text-[#1A1A1A]">Önce plan</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
          Kapsamı ve fiyatı netleştirip projeye başlıyoruz.
        </p>
      </div>
    </div>
  );
}

// Krestin'deki "Services" kutusundan uyarlama: dağınık, eğik etiketler.
const SERVICE_PILLS = [
  { label: "Reklam", className: "bottom-[78px] left-[18px] -rotate-[14deg] bg-accent text-accent-ink" },
  { label: "Tasarım", className: "bottom-[96px] right-[16px] rotate-[12deg] bg-[#C9B8F2] text-black" },
  { label: "Yazılım", className: "bottom-[34px] left-[74px] -rotate-[4deg] bg-[#2f6bff] text-white" },
  { label: "SEO", className: "bottom-[44px] right-[30px] rotate-[8deg] bg-[#1A1A1A] text-white" },
  { label: "Sosyal Medya", className: "bottom-[-6px] left-[16px] rotate-[6deg] bg-white text-black" },
];

export function ServicesCard({ className, color }: CardProps) {
  return (
    <div className={cn(CARD, "relative overflow-hidden bg-[#F1F1F1]", className)} style={{ backgroundColor: color }}>
      <p className="text-[22px] tracking-[-0.02em] text-[#1A1A1A]">Hizmetler</p>
      <p className="mt-2 max-w-[230px] text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
        Markanızı bir sonraki adıma taşıyan dijital çözümler.
      </p>
      {SERVICE_PILLS.map((pill) => (
        <span
          key={pill.label}
          className={cn(
            "absolute whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-medium tracking-[-0.01em] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
            pill.className,
          )}
        >
          {pill.label}
        </span>
      ))}
    </div>
  );
}

// Fotoğraflı kutu: görsel bütün kutuyu kaplar, sol üstte başlık (ilk kelimesi renkli), sağ altta OX gülen yüz.
export function PhotoCard({
  image,
  alt,
  accent,
  accentColor = "#16a34a",
  title,
  position = "center",
  className,
}: CardProps & {
  image: string;
  alt: string;
  /** Başlığın renkli ilk kısmı (ör. "AI") */
  accent: string;
  accentColor?: string;
  /** Başlığın devamı */
  title: string;
  /** Görselin kutuda hangi kısmının görüneceği (object-position) */
  position?: string;
}) {
  return (
    <div className={cn(CARD, "relative overflow-hidden bg-[#BDEBD5]", className)}>
      {/* Yatay görsel 380px yüksekliğe kaplanınca ~560px genişliğinde çizilir (kart 280px olsa da): sizes buna göre */}
      <Image src={image} alt={alt} fill sizes="560px" quality={85} className="object-cover" style={{ objectPosition: position }} />
      <p className="relative text-[21px] leading-[1.2] tracking-[-0.02em] text-[#1A1A1A]">
        <span style={{ color: accentColor }}>{accent}</span> {title}
      </p>
      <Image
        src="/images/about/ox-smile.png"
        alt=""
        width={240}
        height={217}
        className="absolute bottom-5 right-5 h-auto w-[64px]"
      />
    </div>
  );
}

// Şeffaflık kutusu: durgunken tek durum satırı (arkasında iki hayalet kart), üstüne gelince deste üç satıra açılır
// ve üstte "aktif ekip" hapı belirir. Avatarlar kişi fotoğrafı değil, hizmet rolleri (ekip fotoğrafı kullanılmıyor).
const STATUS_ROWS = [
  {
    label: "Revizeler uygulandı",
    icon: (
      <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
        <circle cx="10" cy="10" r="10" className="fill-accent" />
        <path d="m6 10.2 2.6 2.6L14 7.4" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Yayın için hazırlanıyor",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] text-[#16a34a]" fill="currentColor" aria-hidden>
        <path d="M20.6 3.4c-3.9-.3-7.6 1.3-10.2 4.3L8.6 9.8l-3.7.4-2.4 2.4 4.2 1.2 3.5 3.5 1.2 4.2 2.4-2.4.4-3.7 2.1-1.8c3-2.6 4.6-6.3 4.3-10.2ZM15.3 10.6a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Z" />
        <path d="M6.3 16.2c-1.4.2-2.6 1.4-2.8 3.9 2.5-.2 3.7-1.4 3.9-2.8l-1.1-1.1Z" />
      </svg>
    ),
  },
  {
    label: "Tasarım onayınızı bekliyor",
    icon: (
      <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
        <circle cx="10" cy="10" r="10" fill="#FACC15" />
        <circle cx="7" cy="8" r="1.2" fill="#713f12" />
        <circle cx="13" cy="8" r="1.2" fill="#713f12" />
        <path d="M6.3 11.6c1.9 2.3 5.5 2.3 7.4 0" fill="none" stroke="#713f12" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    ),
  },
];

export const ROLE_AVATARS = [
  { bg: "#C9B8F2", fg: "#1A1A1A", d: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" }, // tasarım
  { bg: "#1A1A1A", fg: "#ffffff", d: "m8 8-4 4 4 4M16 8l4 4-4 4" }, // yazılım
  { bg: "#F9A8D4", fg: "#1A1A1A", d: "M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1ZM15 9a3 3 0 0 1 0 6" }, // reklam
  { bg: "#C5F36A", fg: "#1A1A1A", d: "M4 20V10M10 20V4M16 20v-7M22 20H2" }, // SEO / sonuç
];

const EASE_CSS = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function StatusCard({ className, color }: CardProps) {
  return (
    <div
      className={cn(CARD, "group/status relative flex flex-col justify-end overflow-hidden bg-[#F1F1F1]", className)}
      style={{ backgroundColor: color }}
    >
      {/* Aktif ekip hapı: üstten iner */}
      <div
        className={cn(
          "absolute left-1/2 top-4 flex -translate-x-1/2 -translate-y-3 items-center gap-2.5 whitespace-nowrap rounded-full bg-accent py-1 pl-1 pr-3.5 opacity-0 shadow-[0_8px_20px_-8px_rgba(47,107,255,0.7)] transition-[opacity,translate] duration-500 group-hover/status:translate-y-0 group-hover/status:opacity-100",
          EASE_CSS,
        )}
      >
        <span className="flex">
          {ROLE_AVATARS.map((a, i) => (
            <span
              key={i}
              className="-ml-1.5 grid size-[26px] place-items-center rounded-full ring-2 ring-accent first:ml-0"
              style={{ backgroundColor: a.bg }}
            >
              <svg viewBox="0 0 24 24" className="size-[13px]" fill="none" stroke={a.fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={a.d} />
              </svg>
            </span>
          ))}
        </span>
        <span className="text-[13px] font-medium tracking-[-0.01em] text-accent-ink">Aktif ekip üyeleri</span>
      </div>

      {/* Durum destesi: durgunken üst üste (öndeki tam, arkadakiler küçük ve soluk), hover'da üç satıra açılır */}
      <div className="absolute inset-x-4 top-[150px]">
        {STATUS_ROWS.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "absolute inset-x-0 top-0 flex h-11 items-center justify-between rounded-[14px] bg-white px-4 transition-[translate,scale,opacity,box-shadow] duration-500",
              EASE_CSS,
              i === 0 && "z-30 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.18)] group-hover/status:-translate-y-[52px] group-hover/status:shadow-none",
              i === 1 && "z-20 translate-y-[9px] scale-x-[0.93] opacity-80 group-hover/status:translate-y-0 group-hover/status:scale-x-100 group-hover/status:opacity-100",
              i === 2 && "z-10 translate-y-[18px] scale-x-[0.86] opacity-60 group-hover/status:translate-y-[52px] group-hover/status:scale-x-100 group-hover/status:opacity-100",
            )}
          >
            <span
              className={cn(
                "text-[15px] tracking-[-0.015em] text-[#1A1A1A] transition-opacity duration-300",
                i > 0 && "opacity-0 group-hover/status:opacity-100 group-hover/status:delay-150",
              )}
            >
              {row.label}
            </span>
            <span className={cn("transition-opacity duration-300", i > 0 && "opacity-0 group-hover/status:opacity-100 group-hover/status:delay-150")}>
              {row.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="relative">
        <p className="text-[20px] tracking-[-0.02em] text-[#1A1A1A]">Her Adımda Şeffaflık</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
          Tasarım, geliştirme ve teslim süreçlerinde her detayı sizinle anlık olarak paylaşıyoruz.
        </p>
      </div>
    </div>
  );
}

// Otomasyon kutusu: dört adım bir hatla bağlı, sırayla işlenir. Aktif adımda dönen sarı ışın ve hapın altında dolan
// çizgi; biten adım beyaz tik, bekleyen boş halka. Hepsi bitince kısa bir duraklamadan sonra baştan başlar.
const FLOW_STEPS = ["Talepler otomatik toplanır", "Yapay zekâ ile analiz", "İşler anında sınıflanır", "Düzenli rapor hazır"];
const FLOW_STEP_MS = 1500;

export function FlowCard({ className }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    // Hepsi bitince (active === adım sayısı) biraz bekleyip başa döner
    const id = setTimeout(
      () => setActive((a) => (a >= FLOW_STEPS.length ? 0 : a + 1)),
      active >= FLOW_STEPS.length ? 1400 : FLOW_STEP_MS,
    );
    return () => clearTimeout(id);
  }, [active, inView, reduced]);

  const current = reduced ? 2 : active;

  return (
    <div
      ref={ref}
      className={cn(CARD, "relative flex flex-col justify-end overflow-hidden text-white", className)}
      style={{
        background:
          "radial-gradient(120% 70% at 85% -10%, #b9ceff 0%, #6f97ff 22%, rgba(47,107,255,0) 55%), linear-gradient(180deg, #2f6bff 0%, #1f4fd6 100%)",
      }}
    >
      {/* Nokta dokusu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(180deg,#000,transparent_70%)]"
        style={{ backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)", backgroundSize: "7px 7px" }}
      />

      <div aria-hidden className="absolute inset-x-0 top-6 flex flex-col items-center">
        {FLOW_STEPS.map((step, i) => {
          const done = i < current;
          const running = i === current;
          return (
            <div key={step} className="flex flex-col items-center">
              {i > 0 && (
                <span className="relative flex h-[22px] w-px items-center justify-center bg-[#0b1f5c]/45">
                  <span className="absolute grid size-[9px] place-items-center rounded-full border border-[#0b1f5c]/50 bg-[#2a5ff0]">
                    <svg viewBox="0 0 8 8" className="size-[5px]" aria-hidden>
                      <path d="m2 3 2 2 2-2" fill="none" stroke="#0b1f5c" strokeOpacity={0.7} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              )}
              <div className="relative flex h-[34px] items-center gap-2 overflow-hidden rounded-full bg-[#071640]/55 pl-2.5 pr-4 backdrop-blur-[2px]">
                <span className="grid size-[16px] place-items-center">
                  {done ? (
                    <motion.svg
                      key="done"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      viewBox="0 0 16 16"
                      className="size-[16px]"
                    >
                      <circle cx="8" cy="8" r="8" fill="#fff" />
                      <path d="m4.8 8.2 2.1 2.1 4.3-4.4" fill="none" stroke="#1f4fd6" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  ) : running ? (
                    <svg viewBox="0 0 16 16" className="size-[15px] animate-[spin_1.6s_steps(8)_infinite]">
                      {Array.from({ length: 8 }, (_, k) => {
                        const ang = (k / 8) * Math.PI * 2;
                        const r = (v: number) => Math.round(v * 100) / 100;
                        return (
                          <line
                            key={k}
                            x1={r(8 + Math.cos(ang) * 3.4)}
                            y1={r(8 + Math.sin(ang) * 3.4)}
                            x2={r(8 + Math.cos(ang) * 7)}
                            y2={r(8 + Math.sin(ang) * 7)}
                            stroke="#FACC15"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            opacity={r(0.35 + (k / 8) * 0.65)}
                          />
                        );
                      })}
                    </svg>
                  ) : (
                    <span className="size-[14px] rounded-full border border-white/35" />
                  )}
                </span>
                <span className={cn("whitespace-nowrap text-[12.5px] tracking-[-0.01em] transition-colors duration-300", done || running ? "text-white" : "text-white/70")}>
                  {step}
                </span>
                {running && !reduced && (
                  <motion.span
                    key={`bar-${active}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: FLOW_STEP_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-4 bottom-0 h-[1.5px] origin-left bg-[#FACC15]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <p className="text-[20px] tracking-[-0.02em]">Akıllı otomasyon</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-white/80">
          Tekrarlayan işleri yapay zekâ destekli akışlara devrediyoruz; ekip asıl işe odaklanıyor.
        </p>
      </div>
    </div>
  );
}

// Canlı iş birliği kutusu: panelde bir görev kartı; başlık harf harf yazılıp silinir, "Sen" ve "OX Ekip" imleçleri
// kartın üstünde dolaşır. İmleçlerde kişi adı yok (uydurma ekip üyesi gösterilmez): müşteri ve ekip.
const COLLAB_TITLES = ["Ana sayfa revizyonu", "Kampanya görselleri", "Aylık SEO raporu"];

function useTyping(words: string[], running: boolean) {
  const [state, setState] = useState({ word: 0, len: 0, phase: "type" as "type" | "hold" | "erase" });
  useEffect(() => {
    if (!running) return;
    const full = words[state.word];
    const id = setTimeout(
      () =>
        setState((s) => {
          if (s.phase === "type") return s.len < full.length ? { ...s, len: s.len + 1 } : { ...s, phase: "hold" };
          if (s.phase === "hold") return { ...s, phase: "erase" };
          return s.len > 0 ? { ...s, len: s.len - 1 } : { word: (s.word + 1) % words.length, len: 0, phase: "type" };
        }),
      state.phase === "type" ? 85 : state.phase === "hold" ? 1600 : 35,
    );
    return () => clearTimeout(id);
  }, [state, running, words]);
  return words[state.word].slice(0, running ? state.len : words[state.word].length);
}

function Cursor({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span className="flex items-start">
      <svg viewBox="0 0 16 16" className="size-[15px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" aria-hidden>
        <path d="M2 1.5 14 7l-5.3 1.6L6.5 14Z" fill={bg} stroke="#000" strokeOpacity={0.25} strokeWidth={0.8} strokeLinejoin="round" />
      </svg>
      <span className="ml-0.5 mt-3 rounded-[6px] px-2 py-[3px] text-[12px] font-semibold leading-none tracking-[-0.01em]" style={{ backgroundColor: bg, color: fg }}>
        {label}
      </span>
    </span>
  );
}

export function CollabCard({ className, color }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const running = inView && !reduced;
  const title = useTyping(COLLAB_TITLES, running);

  return (
    <div
      ref={ref}
      className={cn(CARD, "relative flex flex-col justify-end overflow-hidden bg-[#1A1A1A] text-white", className)}
      style={{ backgroundColor: color }}
    >
      {/* Görev kartı */}
      <div aria-hidden className="absolute inset-x-[18px] top-[34px] rounded-[16px] border border-white/[0.07] bg-[#232323] p-3.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] text-white/45">
            <svg viewBox="0 0 24 24" className="size-[13px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            Bugün
          </span>
          <span className="rounded-full border border-[#FACC15]/30 bg-[#FACC15]/10 px-2 py-0.5 text-[11px] font-medium text-[#FACC15]">Öncelikli</span>
        </div>
        <p className="mt-3 flex h-[30px] items-center rounded-[6px] bg-white/[0.06] px-2 text-[15px] tracking-[-0.015em]">
          {title}
          <span className="ml-px inline-block h-[17px] w-px animate-[blink_1s_steps(1)_infinite] bg-white/80" />
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex">
            {ROLE_AVATARS.slice(0, 2).map((a, i) => (
              <span key={i} className="-ml-1.5 grid size-[26px] place-items-center rounded-full ring-2 ring-[#232323] first:ml-0" style={{ backgroundColor: a.bg }}>
                <svg viewBox="0 0 24 24" className="size-[13px]" fill="none" stroke={a.fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={a.d} />
                </svg>
              </span>
            ))}
          </span>
          <span className="flex gap-1.5">
            {[
              { n: 3, d: "m21 11-8.6 8.6a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.6a1.7 1.7 0 0 1-2.4-2.4L15.6 7" },
              { n: 2, d: "M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5.1A8 8 0 1 1 21 12Z" },
            ].map((c) => (
              <span key={c.n} className="flex h-[26px] items-center gap-1 rounded-full border border-white/10 px-2 text-[12px] text-white/75">
                <svg viewBox="0 0 24 24" className="size-[12px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={c.d} />
                </svg>
                {c.n}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* İmleçler: kartın üstünde yavaşça dolaşır */}
      <motion.div
        aria-hidden
        className="absolute left-[14px] top-[14px]"
        animate={running ? { x: [0, 46, 22, 0], y: [0, 52, 18, 0] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cursor label="Sen" bg="#C5F36A" fg="#111" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute right-[34px] top-[132px]"
        animate={running ? { x: [0, -60, -20, 0], y: [0, -38, 10, 0] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <Cursor label="OX Ekip" bg="#2f6bff" fg="#fff" />
      </motion.div>

      <div className="relative">
        <p className="text-[20px] tracking-[-0.02em]">Canlı iş birliği</p>
        <p className="mt-1.5 text-[14px] leading-[1.4] tracking-[-0.01em] text-white/60">
          Siz ve ekibimiz aynı panelde; güncellemeler, yorumlar ve bildirimler anında.
        </p>
      </div>
    </div>
  );
}

// Baloncuklu fotoğraf kutusu: fotoğraf bütün kutuyu kaplar, kutu ekrana girince iki konuşma baloncuğu sırayla
// yaylanarak çıkar (mesaj gelmiş gibi). Baloncuklar kişinin yüzüne değmesin diye sol altta.
export function BubbleCard({
  image,
  alt,
  bubbles,
  position = "center",
  className,
}: CardProps & {
  image: string;
  alt: string;
  /** Üstten alta: [metin, zemin rengi, kuyruğun yatay konumu (%)] */
  bubbles: [string, string, number][];
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={cn(CARD, "relative overflow-hidden bg-[#111]", className)}>
      <Image src={image} alt={alt} fill sizes="280px" quality={85} className="object-cover" style={{ objectPosition: position }} />
      <div className="absolute bottom-[46px] left-4 flex flex-col items-start gap-2">
        {bubbles.map(([text, bg, tail], i) => (
          <motion.span
            key={text}
            initial={reduced ? false : { opacity: 0, scale: 0.5, y: 10 }}
            animate={inView || reduced ? { opacity: 1, scale: 1, y: 0 } : undefined}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.3 + i * 0.55 }}
            className={cn("relative rounded-full px-4 py-2 text-[16px] leading-none tracking-[-0.02em] text-[#111]", i % 2 && "ml-3")}
            style={{ backgroundColor: bg, transformOrigin: `${tail}% 100%` }}
          >
            {text}
            {/* Kuyruk */}
            <svg viewBox="0 0 12 8" className="absolute -bottom-[6px] h-[8px] w-[12px]" style={{ left: `calc(${tail}% - 6px)` }} aria-hidden>
              <path d="M0 0h12L5 8Z" fill={bg} />
            </svg>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// Yeni kutu eklemenin en kısa yolu: değer + açıklama.
const STAT_TONES = {
  light: "bg-[#F1F1F1] text-[#1A1A1A]",
  dark: "bg-[#1A1A1A] text-white",
  outline: "border border-neutral-200 bg-white text-[#1A1A1A]",
} as const;

export function StatCard({
  value,
  label,
  tone = "light",
  color,
  className,
}: CardProps & {
  value: string;
  label: string;
  tone?: keyof typeof STAT_TONES;
}) {
  // Paletten renk gelirse ton rengin parlaklığından belirlenir (çerçeve kalkar)
  const t = color ? (isDark(color) ? "dark" : "light") : tone;
  return (
    <div className={cn(CARD, "flex flex-col justify-end", STAT_TONES[t], className)} style={{ backgroundColor: color }}>
      <p className="text-[40px] leading-none tracking-[-0.04em]">{value}</p>
      <p
        className={cn(
          "mt-2 text-[14px] leading-[1.35] tracking-[-0.01em]",
          t === "dark" ? "text-white/70" : color ? "text-black/55" : "text-neutral-500",
        )}
      >
        {label}
      </p>
    </div>
  );
}

// Izgarada sırayla aşağıdan gelme
export function Reveal({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
