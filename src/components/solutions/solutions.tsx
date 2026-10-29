"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { cn } from "@/lib/utils";

// Metinler yer tutucu. Görseller gelince `image` alanına yol yazılır (ör. "/images/solutions/girisim.jpg").
const SOLUTIONS: {
  title: string;
  desc: string;
  items: string[];
  icon: React.ReactNode;
  image?: string;
  tone: string;
}[] = [
  {
    title: "Girişim",
    image: "/images/solutions/girisim.webp",
    desc: "Fikrin var, zamanın yok. Seni hızlıca ayağa kaldıracak, büyüdükçe yanında duracak bir dijital temel kuruyoruz.",
    items: ["Marka kimliği ve logo", "Landing page", "Sosyal medya kurulumu", "İlk reklam kampanyaları"],
    icon: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
    tone: "bg-[radial-gradient(ellipse_at_30%_20%,#5a6b3a_0%,#2a3320_45%,#121510_100%)]",
  },
  {
    title: "KOBİ",
    image: "/images/solutions/kobi.webp",
    desc: "İşin büyüdü, dijitalin geride kaldı. Rakiplerinle aynı sahada, kendi sesini kaybetmeden var olmanı sağlıyoruz.",
    items: ["Kurumsal web sitesi", "SEO ve Google Ads", "Sosyal medya yönetimi", "Performans raporlama"],
    icon: (
      <>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
        <path d="M5 13v8h14v-8" />
        <path d="M10 21v-5h4v5" />
      </>
    ),
    tone: "bg-[radial-gradient(ellipse_at_70%_25%,#7a5638_0%,#3a2a1e_45%,#151010_100%)]",
  },
  {
    title: "Kurumsal",
    image: "/images/solutions/kurumsal.webp",
    desc: "Yapı karmaşık, beklenti yüksek. Büyük organizasyonların dijital ihtiyaçlarını sessiz sedasız çözüyoruz.",
    items: ["Özel yazılım ve entegrasyon", "Kampanya stratejisi", "Çok kanallı reklam yönetimi", "Özel ekip ve SLA"],
    icon: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1" />
        <path d="M10 22v-4h4v4" />
      </>
    ),
    tone: "bg-[radial-gradient(ellipse_at_40%_20%,#3f5370_0%,#1f2838_45%,#0e1117_100%)]",
  },
];

export function Solutions() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="cozumler" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-[15em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.12] tracking-[-0.045em] text-[#111]">
          Ölçeği ne olursa olsun, sana göre bir çözümümüz var.
        </h2>
        <ArrowButton href="#hizmetler">Tüm hizmetler</ArrowButton>
      </div>

      {/* Kartlar: üzerine gelinen genişler, diğerleri daralır */}
      <div
        className="mt-14 flex flex-col gap-3.5 lg:h-[clamp(500px,40vw,640px)] lg:flex-row"
        onMouseLeave={() => setHovered(null)}
      >
        {SOLUTIONS.map((s, i) => (
          <Reveal
            key={s.title}
            index={i}
            className={cn(
              "h-[520px] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-full lg:min-w-0",
              hovered === i ? "lg:flex-[1.7]" : "lg:flex-1",
            )}
          >
            <Link
              href="#iletisim"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-6 text-white outline-none md:p-7"
            >
              {/* Görsel (veya yer tutucu) */}
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                {s.image ? (
                  <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <div className={cn("size-full", s.tone)} />
                )}
              </div>
              {/* Yazılar okunur kalsın; hover'da biraz daha koyulaşır */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Üst: ikon */}
              <div className="relative flex items-start">
                <span className="grid size-12 place-items-center rounded-[14px] bg-black/25 text-accent backdrop-blur-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                    aria-hidden
                  >
                    {s.icon}
                  </svg>
                </span>
              </div>

              {/* Alt: başlık, açıklama ve hover'da açılan içerik */}
              <div className="relative">
                <h3 className="text-[clamp(28px,2.2vw,38px)] font-medium leading-none tracking-[-0.03em]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[460px] text-[15px] leading-[1.5] tracking-[-0.01em] text-white/85">
                  {s.desc}
                </p>

                {/* 0fr → 1fr: içerik yüksekliği kadar yumuşakça açılır */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] max-lg:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="translate-y-3 opacity-0 transition-[opacity,translate] delay-100 duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.items.map((item) => (
                          <li
                            key={item}
                            className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] tracking-[-0.01em] backdrop-blur-md"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-semibold tracking-[-0.02em] text-[#111]">
                        Paketi incele
                        <span className="grid size-9 place-items-center rounded-full bg-accent">
                          <Chevron />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ArrowButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-14 shrink-0 items-center gap-4 self-start rounded-full bg-[#111] py-2 pl-6 pr-2 text-[15px] font-semibold tracking-[-0.02em] text-white md:self-auto"
    >
      {children}
      <span className="grid size-10 place-items-center rounded-full bg-accent text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:scale-105">
        <Chevron />
      </span>
    </Link>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="m5.5 2 6 6-6 6" />
    </svg>
  );
}
