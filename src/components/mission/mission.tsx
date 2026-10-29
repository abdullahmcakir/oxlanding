"use client";

import { MotionConfig, motion } from "motion/react";
import { Logo } from "@/components/navbar/logo";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { cn } from "@/lib/utils";

// Düzen referansı: krestin.webflow.io ana sayfası, "As a leading marketing agency…" bölümü.
// Başlığın başındaki kutu Krestin'de video + logo; şimdilik hareketli yeşil degrade, video gelince değişecek.
// Kartlardaki bilgiler ana sayfadaki rakam kutularıyla (120+, %98, 15+…) çakışmasın diye farklı seçildi.
// TÜMÜ YER TUTUCU: metinler, kuruluş yılı ve disiplinler gerçek içerikle değiştirilecek.

const HEADING =
  "Dijital ajans olarak strateji, yaratıcılık ve veriyi aynı masada buluşturuyor; markaların bugünün hızlı pazarında öne çıkmasını sağlıyoruz.";

// YER TUTUCU: gerçek söz, isim, unvan ve portre gelecek.
const QUOTE = {
  text: "Her markanın dijitalde hak ettiği yeri bulması için çalışıyoruz. Bizim için iyi iş, ölçülebilen iştir.",
  name: "Ad Soyad",
  role: "Kurucu · OX Dijital",
  initials: "AS",
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Mission() {
  return (
    <MotionConfig reducedMotion="user">
      {/* -mt-12 + yuvarlak üst köşeler: ana sayfadaki gibi hero'nun üstüne binen bir sayfa (hero 48px uzatıldı). */}
      <section
        id="misyon"
        className="relative z-10 -mt-12 rounded-t-[48px] bg-background py-28 md:py-36"
      >
        <div className="px-4 md:px-[4.5vw]">
          {/* Logo kutusu sol üstte; başlığın ilk satırı kutunun altına hizalanıp yanından başlar (Krestin düzeni).
              Ölçüler em cinsinden: başlık puntosu değişince kutu da onunla ölçeklenir. */}
          <div className="relative max-w-[23em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.12] tracking-[-0.045em] text-[#111]">
            <BrandTile className="absolute left-0 top-0 h-[3.35em] w-[3.1em]" />
            {/* text-indent alt öğelere miras kalır; kelime kutularında sıfırlanmazsa her kelime içeri itiliyor */}
            <ScrollRevealText as="h2" text={HEADING} className="indent-[3.45em] pt-[2.3em] [&_span]:indent-0" />
          </div>

          <div className="mt-20 grid gap-14 md:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] lg:gap-x-24">
            {/* Kurucu sözü: Krestin'deki iki satır + paragraf yerine. Kartlarla aynı yükseklikte; söz üstte, imza altta. */}
            <figure className="flex flex-col justify-between gap-10">
              <BlurIn>
                <QuoteMark className="h-9 w-12 text-[#AFD41C]" />
                <blockquote className="mt-7 max-w-[17em] text-[clamp(24px,1.9vw,34px)] leading-[1.22] tracking-[-0.035em] text-[#111]">
                  {QUOTE.text}
                </blockquote>
              </BlurIn>
              <BlurIn index={1}>
                <figcaption className="flex items-center gap-4 border-t border-black/[0.08] pt-6">
                  {/* Yer tutucu portre: fotoğraf gelince next/image ile değişecek */}
                  <span
                    aria-hidden
                    className="grid size-14 shrink-0 place-items-center rounded-full bg-[#111] text-[15px] font-medium tracking-[-0.02em] text-white"
                  >
                    {QUOTE.initials}
                  </span>
                  <span>
                    <span className="block text-[17px] tracking-[-0.015em] text-[#111]">{QUOTE.name}</span>
                    <span className="mt-1 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                      {QUOTE.role}
                    </span>
                  </span>
                </figcaption>
              </BlurIn>
            </figure>

            <div className="grid gap-2 sm:grid-cols-2">
              <BlurIn className="flex flex-col gap-2">
                <CardHeader icon={<CalendarIcon />}>2018&apos;den beri</CardHeader>
                <BadgeCard />
              </BlurIn>
              <BlurIn index={1} className="flex flex-col gap-2">
                <CardHeader icon={<TeamIcon />}>5 disiplin, tek ekip</CardHeader>
                <DisciplinesCard />
              </BlurIn>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

/* ---------- Animasyon parçaları (Krestin'deki GSAP ayarlarının karşılığı) ---------- */

/** Kutular: bulanıklıktan netleşip hafifçe büyüyerek yukarı kayar. */
function BlurIn({
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
      initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Görsel parçalar ---------- */

/** Krestin'deki video kutusunun yerine: ipeksi, yavaşça akan yeşil degrade + OX logosu. */
function GreenSilk({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("absolute inset-0 bg-[size:260%_260%]", className)}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 30% 30%, rgb(197 243 106 / 0.55), transparent 70%), linear-gradient(115deg, #142806 0%, #3f6b0c 28%, #8fc21f 46%, #c5f36a 52%, #6a9e12 62%, #1d3507 100%)",
      }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function BrandTile({ className }: { className?: string }) {
  return (
    <BlurIn className={cn("overflow-hidden rounded-[0.3em] bg-[#1d3507]", className)}>
      <GreenSilk />
      <Logo className="absolute left-1/2 top-1/2 size-[1.15em] -translate-x-1/2 -translate-y-1/2" />
    </BlurIn>
  );
}

const CARD = "rounded-[22px] border border-black/[0.06] bg-[#F4F5F0]";

function CardHeader({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn(CARD, "flex min-h-[72px] items-center gap-4 px-6 text-[17px] tracking-[-0.01em] text-[#111]")}>
      {icon}
      {children}
    </div>
  );
}

/** Açık kart: hafif ışımanın üstünde üst üste iki kutu, öndekinde onay rozeti. Hover'da kutular açılır. */
function BadgeCard() {
  return (
    <div className={cn(CARD, "group relative flex min-h-[380px] flex-1 flex-col items-center justify-end overflow-hidden px-6 pb-7 text-center")}>
      {/* Ana sayfadaki Hakkımızda başlığının arkasındaki nokta ızgarası */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c4c4bc_1.2px,transparent_1.2px)] [background-size:22px_22px]"
        style={{ maskImage: "radial-gradient(ellipse 55% 50% at 50% 40%, #000 0%, transparent 100%)" }}
      />
      <div aria-hidden className="absolute left-1/2 top-[22%] size-56 -translate-x-1/2 rounded-full bg-accent/50 blur-3xl" />

      <div aria-hidden className="absolute left-1/2 top-[16%] size-36 -translate-x-1/2">
        <div className="absolute inset-0 -translate-x-4 -rotate-6 rounded-[26px] bg-[#111] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-8 group-hover:-rotate-12" />
        <div className="absolute inset-0 translate-x-5 translate-y-4 rotate-[14deg] rounded-[26px] border border-white/60 bg-gradient-to-br from-[#e2fba8] to-[#AFD41C] shadow-[0_20px_40px_-12px_rgb(95_143_10/0.45)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-7 group-hover:rotate-[6deg]">
          <BadgeIcon className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <p className="relative max-w-[34ch] text-[16px] leading-[1.4] tracking-[-0.01em] text-[#111]">
        Kurulduğumuz günden bu yana farklı ölçeklerden markalarla ölçülebilir işler üretiyoruz.
      </p>
    </div>
  );
}

const DISCIPLINES = [
  { label: "SEO", icon: SearchIcon, lift: "pb-0", delay: "delay-[0ms]" },
  { label: "Tasarım", icon: PenIcon, lift: "pb-7 xl:pb-10", delay: "delay-[60ms]" },
  { label: "OX Dijital", icon: null, lift: "pb-14 xl:pb-20", delay: "delay-[120ms]" },
  { label: "Yazılım", icon: CodeIcon, lift: "pb-7 xl:pb-10", delay: "delay-[180ms]" },
  { label: "Reklam", icon: MegaphoneIcon, lift: "pb-0", delay: "delay-[240ms]" },
] as const;

/** Koyu yeşil kart: Krestin'deki ortaklık logolarının yerine disiplin ikonları, ortada OX logosu (kemer düzeni). */
function DisciplinesCard() {
  return (
    <div className="group relative flex min-h-[380px] flex-1 flex-col justify-end overflow-hidden rounded-[22px] bg-[#0E1A06] px-6 pb-7 text-center">
      <GreenSilk className="opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0E1A06] via-[#0E1A06]/40 to-transparent" />

      <ul className="relative -mx-12 mb-10 flex items-end justify-center gap-3 xl:gap-5">
        {DISCIPLINES.map(({ label, icon: Icon, lift, delay }) => (
          <li key={label} className={lift}>
            <span
              title={label}
              className={cn(
                "grid place-items-center rounded-[18px] border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2",
                delay,
                Icon ? "size-12 xl:size-[68px]" : "size-16 xl:size-[88px]",
              )}
            >
              {Icon ? <Icon className="size-5 xl:size-7" /> : <Logo className="size-9 xl:size-12" />}
              <span className="sr-only">{label}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="relative mx-auto max-w-[34ch] text-[16px] leading-[1.4] tracking-[-0.01em] text-white">
        Reklam, tasarım, yazılım, içerik ve SEO aynı masada: tek muhatap, tek plan.
      </p>
    </div>
  );
}

/* ---------- İkonlar ---------- */

function QuoteMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 36" fill="currentColor" className={className} aria-hidden>
      <path d="M0 36V22.5C0 9.9 6.3 2.4 18.9 0l2.1 5.4C14.4 7.5 11.1 11.4 10.8 17.1H20.4V36H0Zm27.6 0V22.5C27.6 9.9 33.9 2.4 46.5 0l2.1 5.4c-6.6 2.1-9.9 6-10.2 11.7H48V36H27.6Z" />
    </svg>
  );
}

type IconProps = { className?: string };

const DUO = { fill: "rgb(197 243 106 / 0.45)", stroke: "#8DB51A" };

function CalendarIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0" aria-hidden>
      <rect x="4" y="6" width="24" height="22" rx="6" fill={DUO.fill} />
      <rect x="4" y="6" width="24" height="22" rx="6" stroke={DUO.stroke} strokeWidth="1.5" />
      <path d="M4 13h24M11 3.5v5M21 3.5v5" stroke={DUO.stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 19.5h.01M16 19.5h.01M21 19.5h.01M11 23.5h.01M16 23.5h.01" stroke={DUO.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8 shrink-0" aria-hidden>
      <circle cx="16" cy="11" r="5" fill={DUO.fill} stroke={DUO.stroke} strokeWidth="1.5" />
      <path d="M6 27c1.2-5 5.2-8 10-8s8.8 3 10 8" fill={DUO.fill} />
      <path d="M6 27c1.2-5 5.2-8 10-8s8.8 3 10 8" stroke={DUO.stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24.5 6.5a4 4 0 0 1 0 7.5M28.5 22.5c1 1.2 1.6 2.6 1.9 4.2M7.5 6.5a4 4 0 0 0 0 7.5M3.5 22.5c-1 1.2-1.6 2.6-1.9 4.2" stroke={DUO.stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M24 3.5 29 8l6.6-.7 1.6 6.4 5.8 3.3-2.6 6.1 2.6 6.1-5.8 3.3-1.6 6.4L29 40l-5 4.5L19 40l-6.6.7-1.6-6.4L5 31l2.6-6.1L5 18.8l5.8-3.3 1.6-6.4L19 8z"
        fill="#5F8F0A"
      />
      <path d="m16.5 24.5 5 5 10-10.5" fill="none" stroke="#e2fba8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stroke({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Stroke>
  );
}

function PenIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 19 19 12l3 3-7 7z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z" />
      <path d="m2 2 7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </Stroke>
  );
}

function CodeIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </Stroke>
  );
}

function MegaphoneIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="m3 11 15-6v14L3 13z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      <path d="M21 9v6" />
    </Stroke>
  );
}
