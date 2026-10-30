"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { CollabMark } from "./collab-mark";
import { neighbours, WORK_SECTIONS, type Work } from "./work-data";

// Referans: portorocha.com kenar çubuğu, bizim ihtiyacımıza göre: üstte "OX × müşteri" iş birliği imzası,
// ortada içindekiler (kaydırdıkça bulunulan bölüm vurgulanır), altta sonraki çalışma + yeni proje çağrısı.
// "Tüm çalışmalar / önceki / sonraki" sağ alttaki asistanda (DockPreset, page.tsx). Mobilde içeriğin altına düşer.

export function WorkSidebar({ work }: { work: Work }) {
  const { next } = neighbours(work.slug);

  return (
    <aside className="order-last flex flex-col gap-2 lg:sticky lg:top-[84px] lg:order-none lg:h-[calc(100svh-92px)] lg:self-start">
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <Collab work={work} />
        <Contents />

        <Link
          href={`/calismalar/${next.slug}`}
          className="group flex items-center gap-4 rounded-[16px] bg-[#171717] p-3 transition-colors hover:bg-[#1f1f1f]"
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-[10px] bg-[#111]">
            <Image src={next.image} alt="" fill sizes="64px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] text-white/50">Sonraki çalışma</span>
            <span className="block truncate text-[16px] tracking-[-0.01em] text-white">{next.title}</span>
          </span>
          <span className="mr-2 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
            <PixelIcon variant="arrow" className="size-[9px]" />
          </span>
        </Link>
        <a
          href={talepUrl({ hizmet: work.services[0] })}
          className="group flex h-12 items-center justify-center gap-2.5 rounded-[16px] bg-accent text-[15px] font-semibold tracking-[-0.01em] text-black transition-[filter] hover:brightness-110"
        >
          Benzer bir proje başlat
          <PixelIcon
            variant="arrow"
            className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
            cellClassName="fill-black"
          />
        </a>
      </div>
    </aside>
  );
}

/** Referanstaki "stüdyo adı + saat" alanı: kartsız, siyah zeminde ortalı "OX × müşteri" imzası. */
function Collab({ work }: { work: Work }) {
  return (
    <div className="flex flex-col items-center px-5 py-6 text-center lg:py-10">
      <CollabMark work={work} />
      <p className="mt-6 text-[clamp(20px,1.5vw,24px)] leading-[1.15] tracking-[-0.02em] text-white">
        OX Dijital × {work.title}
      </p>
      <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
        İş birliği · {work.year}
      </p>
    </div>
  );
}

/** İçindekiler: ekranın ortasından geçen bölüm vurgulanır; tıklayınca o bölüme kayar. */
function Contents() {
  const lenis = useLenis();
  const [active, setActive] = useState<string>(WORK_SECTIONS[0].id);

  useEffect(() => {
    const els = WORK_SECTIONS.map((s) => document.getElementById(s.id)).filter((el) => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="İçindekiler" className="hidden min-h-0 flex-1 flex-col rounded-[16px] bg-[#171717] p-2 lg:flex">
      <p className="px-3 pb-2 pt-2.5 text-[14px] text-white/50">Bu sayfada</p>
      <ol>
        {WORK_SECTIONS.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  if (!lenis) return;
                  e.preventDefault();
                  lenis.scrollTo(`#${s.id}`, { offset: -92 });
                }}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] tracking-[-0.01em] transition-colors duration-300",
                  on ? "text-white" : "text-white/40 hover:text-white/80",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="work-contents-pill"
                    className="absolute inset-0 rounded-[12px] bg-white/[0.07]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <span className={cn("relative font-mono text-[11px]", on ? "text-accent" : "text-white/30")}>
                  0{i + 1}
                </span>
                <span className="relative">{s.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
