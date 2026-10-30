"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { ServiceFlyout } from "@/components/services/service-flyout";
import { SplitHeading } from "@/components/ui/section-parts";
import { cn } from "@/lib/utils";
import { PACKAGES, type Package } from "./packages-data";

// Düzen referansı: tbdstudio.framer.ai pricing kartları. Fiyat yok; amaç müşteriyi aşamasına göre
// sınıflandırıp yol haritasını göstermek. Karta tıklayınca paketin flyout'u açılır.
// Görsel dil: navbar menü paneli (#171717 çerçeve, #070707 panel, mono etiketler, yeşil vurgu).

export function Packages() {
  const [selected, setSelected] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const lastCard = useRef<HTMLButtonElement | null>(null);

  const openPackage = (i: number, el: HTMLButtonElement) => {
    lastCard.current = el;
    setSelected(i);
    setOpen(true);
  };

  return (
    <section id="paketler" data-dock="paketler" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <SplitHeading strong="Paketler." soft="Hangi aşamadaysan, yol haritanı oradan çiziyoruz." />

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.slug} index={i}>
            <PackageCard pkg={p} index={i} onOpen={(el) => openPackage(i, el)} />
          </Reveal>
        ))}
      </div>

      <ServiceFlyout
        service={selected === null ? null : PACKAGES[selected]}
        open={open}
        onOpenChange={setOpen}
        returnFocusTo={lastCard}
      />
    </section>
  );
}

function PackageCard({
  pkg,
  index,
  onOpen,
}: {
  pkg: Package;
  index: number;
  onOpen: (el: HTMLButtonElement) => void;
}) {
  const level = index + 1;
  const withImage = index === PACKAGES.length - 1; // son paket: referanstaki gibi görselli

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-haspopup="dialog"
      className="group relative flex h-full min-h-[640px] w-full flex-col overflow-hidden rounded-[32px] bg-[#171717] p-1.5 text-left text-white outline-none focus-visible:ring-4 focus-visible:ring-accent/60 lg:h-[clamp(640px,46vw,720px)]"
    >
      {withImage && (
        <>
          {/* overflow-hidden ŞART: hover'da görsel büyür */}
          <Image
            src={pkg.image}
            alt=""
            fill
            quality={85}
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover grayscale-[1] brightness-[0.45] contrast-[1.05] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        </>
      )}

      {/* Üst panel */}
      <div
        className={cn(
          "relative flex flex-1 flex-col rounded-[26px] p-7 md:p-9",
          withImage ? "bg-transparent" : "bg-[#070707]",
        )}
      >
        <div className="flex items-start justify-between">
          {/* Numara + yol haritası noktaları (kaçıncı aşama) */}
          <div className="flex items-start gap-2.5">
            <span className="text-[clamp(32px,2.4vw,40px)] leading-none tracking-[-0.03em]">
              0{level}
            </span>
            <span className="mt-1 flex gap-1" aria-label={`${PACKAGES.length} aşamanın ${level}.`}>
              {PACKAGES.map((_, d) => (
                <span key={d} className={cn("size-[7px] rounded-full", d < level ? "bg-accent" : "bg-white/20")} />
              ))}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
            Süre: <span className="text-white">{pkg.duration}</span>
          </span>
        </div>

        <h3 className="mt-[clamp(48px,6vw,96px)] text-[clamp(28px,2.3vw,40px)] leading-[1.15] tracking-[-0.03em]">
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>{pkg.title}.</span>
            {pkg.featured && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Popüler
              </span>
            )}
          </span>
          <span className="block text-white/45">{pkg.tagline}.</span>
        </h3>

        {/* Kalemler */}
        <ul className="mt-auto space-y-3 pt-10">
          {pkg.items.map((item) => (
            <li key={item.label} className="flex items-center gap-3 text-[15px] tracking-[-0.01em] text-white/75">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/10">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-2.5"
                  aria-hidden
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Alt şerit: buton + (fiyat yerine) kapsam notu */}
      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-6 md:px-8">
        <span className="flex items-center gap-1.5">
          <span className="flex h-12 items-center rounded-[10px] bg-white px-5 text-[15px] font-semibold tracking-[-0.02em] text-[#111]">
            Paketi incele
          </span>
          <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-black" />
          </span>
        </span>
        <span className="font-mono text-[10px] font-bold uppercase leading-[1.6] tracking-[0.12em] text-white/50">
          {pkg.items.length} kalem
          <br />
          Kapsama göre teklif
        </span>
      </div>
    </button>
  );
}
