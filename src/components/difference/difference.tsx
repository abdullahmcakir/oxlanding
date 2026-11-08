"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Reveal } from "@/components/about/about-cards";
import { Logo } from "@/components/navbar/logo";
import { SplitHeading } from "@/components/ui/section-parts";
import { cn } from "@/lib/utils";

// Düzen referansı: tbd® şablonu "case study" bento'su.
// Görsel dil: navbar menü paneli (#171717 çerçeve, #070707 kartlar, mono etiketler, yeşil çubuklar).
// Bilerek rakam, müşteri yorumu ya da doğrulanmamış başarı iddiası yok.

const TAGS = ["Reklam", "Tasarım", "Yazılım", "SEO"];

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
        soft="Birden fazla ekiple uğraşmadan, bütün dijital işlerini tek yerden yönet."
      />

      {/* Bento: navbar menü paneliyle aynı çerçeve/kart dili */}
      <Reveal className="mt-14">
        <div className="grid gap-1.5 rounded-[32px] bg-[#171717] p-1.5 lg:h-[clamp(640px,52vw,880px)] lg:grid-cols-4 lg:grid-rows-2">
          <VisualCard />
          <ProblemCard />
          <ControlCard />
          <OneRoofCard />
          <ContactCard />
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

/** Kartın alt kısmı: beyaz ana cümle + küçük açıklama */
function Statement({ title, text }: { title: string; text: string }) {
  return (
    <>
      <p className="text-[clamp(18px,1.35vw,24px)] leading-[1.3] tracking-[-0.02em] text-white">{title}</p>
      <p className="mt-3 max-w-[300px] text-[13px] leading-[1.45] text-white/60">{text}</p>
    </>
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
        <span className="text-white">Bir iş için üç farklı kişiyle görüşmek zorunda değilsin.</span> Web siten ayrı,
        reklamların ayrı, tasarım işlerin ayrı yerde olunca hepsini takip etmek de sana kalıyor.
      </p>
    </Card>
  );
}

function ControlCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Card className="min-h-[340px] justify-between">
      <Tag>Kontrol</Tag>
      <div ref={ref}>
        {/* Yeşil çubuklar sırayla dolar (menüdeki müsaitlik kartının dili) */}
        <div className="flex h-[clamp(40px,3.4vw,56px)] gap-[5px]" aria-hidden>
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
        <div className="mt-6">
          <Statement
            title="Her şey gözünün önünde."
            text="Projelerinin durumunu, taleplerini ve devam eden işleri tek panelden takip et."
          />
        </div>
      </div>
    </Card>
  );
}

function OneRoofCard() {
  return (
    <Card className="min-h-[340px] justify-between">
      <Tag>Tek çatı altında</Tag>
      <div>
        <Statement
          title="Reklam, tasarım ve yazılım aynı ekipte."
          text="İşlerin birbirinden kopmadan ilerlesin. Farklı hizmetler için sürekli yeni bir ekip aramak zorunda kalma."
        />
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

function ContactCard() {
  return (
    <Card className="min-h-[340px] justify-between bg-[#0e0e0e]">
      <Tag>İletişim</Tag>
      <div>
        <Statement
          title="Bir şey sormak için toplantı beklemene gerek yok."
          text="Talebini panelden ilet, ne aşamada olduğunu takip et. Aynı konuyu tekrar tekrar anlatmak zorunda kalma."
        />
      </div>
    </Card>
  );
}
