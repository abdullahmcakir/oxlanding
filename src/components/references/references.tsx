"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/about/about-cards";
import { CarouselNav, Chevron, SplitHeading, TRACK_CLASS } from "@/components/ui/section-parts";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { cn } from "@/lib/utils";

// Kart düzeni referansı: mintlify.com "Powering businesses of all sizes" müşteri hikayeleri.
// TÜMÜ YER TUTUCU: marka adları, başlıklar, rakamlar ve görseller gerçek referanslarla değiştirilecek.
const REFERENCES = [
  {
    brand: "Kafe Zinciri",
    headline: "için dijital menü ve sosyal medyayla erişimi 3 ayda ikiye katladık.",
    stats: [
      { value: "2x", label: "Sosyal medya erişimi" },
      { value: "%40", label: "Daha fazla rezervasyon" },
    ],
    color: "#C44120",
    image: "/images/services/mekanda.png",
  },
  {
    brand: "Moda Markası",
    headline: "için satışa odaklı e-ticaret altyapısını sıfırdan kurduk.",
    stats: [
      { value: "3.2x", label: "Online satış artışı" },
      { value: "%28", label: "Daha düşük reklam maliyeti" },
    ],
    color: "#1E3A8A",
    image: "/images/services/e-ticaret.png",
  },
  {
    brand: "Teknoloji Girişimi",
    headline: "için lansmana hazır web sitesi ve marka kimliğini 6 haftada teslim ettik.",
    stats: [
      { value: "6 hf", label: "Fikirden yayına" },
      { value: "12k", label: "İlk ay ziyaretçi" },
    ],
    color: "#14532D",
    image: "/images/services/website.webp",
  },
  {
    brand: "Restoran Grubu",
    headline: "için akılda kalan bir marka kimliği ve ambalaj sistemi tasarladık.",
    stats: [
      { value: "8", label: "Şubede yeni kimlik" },
      { value: "%35", label: "Marka bilinirliği artışı" },
    ],
    color: "#4C1D95",
    image: "/images/services/branding.png",
  },
];

const GAP = 16;

// Kart görünür alanın ~%82'si; sağda bir sonraki kart görünür (mobilde %88).
function fitCardWidth(visible: number) {
  return Math.round(visible * (visible < 768 ? 0.88 : 0.82));
}

export function References() {
  const { trackRef, edges, cardW, scroll } = useSnapCarousel({
    fit: fitCardWidth,
    gap: GAP,
    initialWidth: 1056,
  });
  // Mintlify oranı ~2.24:1; içerik sığsın diye alt sınır 460px
  const cardH = Math.max(460, Math.round(cardW / 2.24));

  return (
    <section id="calismalar" className="bg-background pb-28 md:pb-36">
      <div className="flex flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-[4.5vw]">
        <SplitHeading
          strong="Referanslar."
          soft="Farklı ölçeklerden markalarla, ölçülebilir sonuçlar ürettik."
        />
        <CarouselNav edges={edges} onScroll={scroll} allHref="#calismalar" allLabel="Tüm çalışmalar" />
      </div>

      <div ref={trackRef} className={TRACK_CLASS}>
        {REFERENCES.map((ref, i) => (
          // Son kart sağ kenara oturur; yoksa şeridin sonuna ulaşılamaz (snap geri çeker)
          <Reveal
            key={ref.brand}
            index={i}
            className={cn("shrink-0", i === REFERENCES.length - 1 ? "snap-end" : "snap-start")}
          >
            <Link
              href="#calismalar"
              data-card
              style={{ width: cardW, ["--card-h" as string]: `${cardH}px` }}
              className="group grid overflow-hidden rounded-[28px] text-white outline-none focus-visible:ring-4 focus-visible:ring-accent/60 md:h-[var(--card-h)] md:grid-cols-[51fr_49fr]"
            >
              {/* Sol: renkli panel */}
              <div
                className="relative flex flex-col justify-between gap-10 overflow-hidden p-7 md:p-10"
                style={{ background: ref.color }}
              >
                {/* Silik nokta dokusu, sağ alta doğru kaybolur */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:18px_18px]"
                  style={{ maskImage: "linear-gradient(135deg, #000 0%, transparent 70%)" }}
                />

                <div className="relative">
                  <p className="text-[15px] font-bold uppercase tracking-[0.14em]">{ref.brand}</p>
                  <h3 className="mt-6 text-[clamp(24px,2.3vw,36px)] font-medium leading-[1.14] tracking-[-0.02em] text-white/70">
                    <span className="text-white">{ref.brand}</span> {ref.headline}
                  </h3>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-2 gap-6">
                    {ref.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-[clamp(36px,3vw,48px)] leading-none tracking-[-0.02em]">{s.value}</p>
                        <p className="mt-2 text-[15px] leading-[1.4] text-white/85">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-semibold tracking-[-0.02em] text-[#111]">
                    Hikayeyi oku
                    <span className="grid size-9 place-items-center rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                      <Chevron />
                    </span>
                  </span>
                </div>
              </div>

              {/* Sağ: görsel (mobilde üstte) */}
              <div className="relative order-first h-56 overflow-hidden md:order-none md:h-auto">
                <Image
                  src={ref.image}
                  alt=""
                  fill
                  quality={85}
                  sizes={`${Math.round(cardW * 0.65)}px`}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
