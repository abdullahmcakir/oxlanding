"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { Reveal } from "@/components/about/about-cards";
import { Logo } from "@/components/navbar/logo";
import { SplitHeading } from "@/components/ui/section-parts";
import { cn } from "@/lib/utils";

// Düzen referansı: tbd® şablonu "case study" bento'su.
// Görsel dil: navbar menü paneli (#171717 çerçeve, #070707 kartlar, mono etiketler, yeşil çubuklar).
// Metinler, rakam ve yorum YER TUTUCU.

const TAGS = ["Reklam", "Tasarım", "Yazılım", "SEO", "Otomasyon"];

// Barkod çizgi genişlikleri (px)
const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 1, 2, 3, 1, 2, 1, 1, 3];

// Görsele hafif film greni (SVG gürültü)
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export function Difference() {
  return (
    <section id="farkimiz" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <SplitHeading
        strong="Farkımız."
        soft="Diğer dijital ajanslardan ayrıldığımız yer burası."
      />

      {/* Bento: navbar menü paneliyle aynı çerçeve/kart dili */}
      <Reveal className="mt-14">
        <div className="grid gap-1.5 rounded-[32px] bg-[#171717] p-1.5 lg:h-[clamp(640px,52vw,880px)] lg:grid-cols-4 lg:grid-rows-2">
          <VisualCard />
          <ProblemCard />
          <ImpactCard />
          <OneRoofCard />
          <ReviewCard />
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────────── Kartlar ───────────────────────────── */

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-[26px] bg-[#070707] p-7 text-white md:p-8", className)}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-white/[0.07] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
      {children}
    </span>
  );
}

function VisualCard() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[#111] lg:col-span-2 lg:row-span-2 lg:min-h-0">
      <Image
        src="/images/solutions/kurumsal.webp"
        alt=""
        fill
        quality={85}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover grayscale-[1] contrast-[1.1] brightness-[0.8]"
      />
      {/* Film greni + kenar karartması */}
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {/* Üst: logo + mono künye */}
      <div className="absolute left-7 top-7 text-white md:left-8 md:top-8">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <span className="text-[18px] font-medium tracking-[-0.02em]">OX Dijital</span>
        </div>
        <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
          Farkımız · Tek çatı · 2026
        </p>
      </div>

      {/* Sol alt: nokta dokusu */}
      <div
        aria-hidden
        className="absolute bottom-6 left-6 h-[38%] w-[30%] bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:14px_14px]"
        style={{ maskImage: "linear-gradient(45deg, #000 20%, transparent 80%)" }}
      />

      {/* Sağ alt: barkod */}
      <div aria-hidden className="absolute bottom-7 right-7 flex h-4 items-stretch gap-[2px] md:bottom-8 md:right-8">
        {BARCODE.map((w, i) => (
          <span key={i} className="bg-white/85" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

function ProblemCard() {
  return (
    <Card className="min-h-[340px] justify-between">
      <Tag>Sorun</Tag>
      <p className="text-[clamp(18px,1.35vw,24px)] leading-[1.3] tracking-[-0.02em] text-white/45">
        <span className="text-white">Ajanslar parça parça çalışır.</span> Reklamı biri, siteyi
        biri, tasarımı bir başkası yapar; sonuçtan kimse sorumlu olmaz.
      </p>
    </Card>
  );
}

function ImpactCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${v.toFixed(1)}x`);

  // Ekrana girince sıfırdan sayarak yükselir
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, 3.2, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <Card className="min-h-[340px] justify-between">
      <Tag>Etki</Tag>
      <div ref={ref}>
        <div className="flex items-center gap-5">
          {/* Yeşil çubuklar sırayla dolar (menüdeki müsaitlik kartının dili) */}
          <div className="flex h-[clamp(48px,4.2vw,72px)] gap-[5px]" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => (
              <motion.span
                key={i}
                className={cn("w-[3px] origin-bottom rounded-full", i < 6 ? "bg-accent" : "bg-white/15")}
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
          <motion.p className="text-[clamp(52px,4.6vw,84px)] leading-none tracking-[-0.04em] tabular-nums">
            {text}
          </motion.p>
        </div>
        <p className="mt-4 max-w-[240px] text-[13px] leading-[1.45] text-white/60">
          Tek ekip, tek hedef: müşterilerimizde ortalama dönüşüm artışı.
        </p>
      </div>
    </Card>
  );
}

function OneRoofCard() {
  return (
    <Card className="min-h-[340px] justify-between">
      <Tag>Tek çatı altında</Tag>
      <div>
        <p className="max-w-[300px] text-[13px] leading-[1.45] text-white/60">
          Reklam, tasarım ve yazılım aynı masada. Yeni bir ekip ya da yeni bir araç öğrenmenize gerek yok.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/25 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/85"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function ReviewCard() {
  return (
    <Card className="min-h-[340px] justify-between bg-[#0e0e0e]">
      <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
        <span className="flex items-center gap-2 text-white">
          <span className="flex gap-0.5 text-white" aria-label="5 üzerinden 5 yıldız">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="size-3" fill="currentColor" aria-hidden>
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
            ))}
          </span>
          5.0/5
        </span>
        <span className="text-white/45">Doğrulanmış yorum</span>
      </div>

      <div>
        <p className="text-[clamp(18px,1.35vw,24px)] leading-[1.3] tracking-[-0.02em] text-white/45">
          <span className="text-white">&ldquo;Üç ayrı ajansla uğraşmayı bıraktık,</span> her şey tek
          ekipte ve sonuçlar ilk aydan görünür oldu.&rdquo;
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#C9B8F2] to-[#7D64C8] text-[12px] font-semibold">
            AY
          </span>
          <div>
            <p className="text-[14px] font-medium leading-tight">Ad Soyad</p>
            <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
              Pazarlama müdürü
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
