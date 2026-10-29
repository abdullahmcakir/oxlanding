"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ServicePage } from "./service-page-data";

// Referans: "Built for the Global Workforce": ortada büyük kart, iki yanda komşu kartlar taşar.
// Kartlar ortaya oturacak şekilde (snap-center) kayar; ortadaki dışındakiler hafifçe soluk.

export function ServiceAudiences({ items }: { items: ServicePage["audiences"] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Ortaya en yakın kart aktif sayılır
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      [...el.children].forEach((child, i) => {
        const c = child as HTMLElement;
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  const go = (i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <section className="bg-background pb-24 md:pb-32">
      <div className="px-4 text-center md:px-[4.5vw]">
        <h2 className="text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
          Kimler için?
        </h2>
        <p className="mt-4 text-[clamp(15px,1.05vw,18px)] tracking-[-0.01em] text-neutral-500">
          Ölçeği ne olursa olsun, büyümek isteyen her marka için.
        </p>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100vw-min(86vw,900px))/2)]"
      >
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => go(i)}
            className={cn(
              "relative aspect-[16/11] w-[min(86vw,900px)] shrink-0 snap-center overflow-hidden rounded-[28px] bg-[#111] text-left transition-opacity duration-500",
              i === active ? "opacity-100" : "opacity-50",
            )}
          >
            <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 900px, 86vw" className="object-cover" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />
            <span className="absolute left-6 top-6 right-6 md:left-10 md:top-10">
              <span className="block text-[clamp(26px,2.4vw,44px)] font-medium tracking-[-0.04em] text-white">
                {item.title}
              </span>
              <span className="mt-2 block max-w-[28em] text-[clamp(14px,1vw,17px)] leading-[1.45] text-white/80">
                {item.desc}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Konum noktaları */}
      <div className="mt-8 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={item.title}
            onClick={() => go(i)}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-500",
              i === active ? "w-8 bg-[#111]" : "w-1.5 bg-neutral-300",
            )}
          />
        ))}
      </div>
    </section>
  );
}
