"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { CarouselNav, SplitHeading, TRACK_CLASS } from "@/components/ui/section-parts";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { cn } from "@/lib/utils";
import { ServiceFlyout } from "./service-flyout";
import { SERVICES } from "./services-data";

// Düzen referansı: mintlify.com "Enabling the next generation of startups" bölümü.
// Kart verisi + flyout içeriği: services-data.ts

const GAP = 16;
const TARGET_CARD = 350; // kartların yaklaşık genişliği (Framer'daki kartlar 350×600)
const CARD_RATIO = 600 / 350;

// Görünür alana N tam + 1 yarım kart sığacak genişliği bulur; N, kart 350px'e en yakın olacak şekilde seçilir.
function fitCardWidth(visible: number) {
  if (visible < 600) return Math.round(visible * 0.8); // mobil: ~1.2 kart
  let best = TARGET_CARD;
  for (let n = 1; n < 10; n++) {
    const w = (visible - n * GAP) / (n + 0.5);
    if (Math.abs(w - TARGET_CARD) < Math.abs(best - TARGET_CARD) || n === 1) best = w;
  }
  return Math.round(best);
}

export function Services() {
  const { trackRef, edges, cardW, scroll } = useSnapCarousel({
    fit: fitCardWidth,
    gap: GAP,
    initialWidth: TARGET_CARD,
  });

  // Flyout: seçili hizmet + detay paneli
  const [selected, setSelected] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const lastCard = useRef<HTMLButtonElement | null>(null);

  const openService = (i: number, el: HTMLButtonElement) => {
    lastCard.current = el;
    setSelected(i);
    setDetailOpen(true);
  };

  return (
    <section id="hizmetler" data-dock="hizmetler" className="bg-background pb-28 md:pb-36">
      <div className="flex flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-[4.5vw]">
        <SplitHeading
          strong="Hizmetlerimiz."
          soft="Markanı büyütmek için ihtiyaç duyduğun her şey, tek çatı altında."
        />
        <CarouselNav edges={edges} onScroll={scroll} allHref="#hizmetler" allLabel="Tüm hizmetler" />
      </div>

      {/* Kayan şerit: içerik hizasından başlar, sağda bir kart yarım görünür */}
      <div ref={trackRef} className={TRACK_CLASS}>
        {SERVICES.map((s, i) => (
          // Son kart sağ kenara oturur; yoksa şeridin sonuna ulaşılamaz (snap geri çeker)
          <Reveal
            key={s.title}
            index={i}
            className={cn("shrink-0", i === SERVICES.length - 1 ? "snap-end" : "snap-start")}
          >
            <button
              type="button"
              data-card
              onClick={(e) => openService(i, e.currentTarget)}
              aria-haspopup="dialog"
              style={{ width: cardW }}
              className="group relative block aspect-[350/600] overflow-hidden rounded-[28px] bg-[#0B0B0C] text-left text-white outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
            >
              {/* Görsel kartı yükseklikten doldurur (yatay görseller kart genişliğinin ~2.6 katı çizilir);
                  sizes buna göre verilir ki küçük sürüm indirilip bulanıklaşmasın. */}
              <Image
                src={s.image}
                alt={s.title}
                fill
                quality={85}
                sizes={`${Math.round(cardW * CARD_RATIO * 1.5)}px`}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
              />
              {/* Framer'daki %35 karartma; hover'da açılır */}
              <div className="absolute inset-0 bg-black/35 transition-colors duration-700 group-hover:bg-black/10 group-focus-visible:bg-black/10" />
              {/* Başlık her görselde okunur kalsın */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

              <h3 className="absolute left-6 top-6 text-[28px] leading-none tracking-[-0.03em]">
                {s.title}
              </h3>

              <span className="absolute bottom-5 left-5 grid size-[54px] place-items-center rounded-[16px] bg-[#AFD41C] text-[#0E0D0A] shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[22px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45"
                  aria-hidden
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <ServiceFlyout
        service={selected === null ? null : SERVICES[selected]}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        returnFocusTo={lastCard}
      />
    </section>
  );
}
