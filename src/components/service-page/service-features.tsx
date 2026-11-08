import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import type { ServicePage } from "./service-page-data";

// Referans: ortada telefon maketi, iki yanında özellik kartları.
// Maket yerine hizmetin görseli; kartlar sırayla sol / sağ sütuna dağılır (4 kartta 2+2, 6 kartta 3+3).
// Yazılmış sayfalarda üstte başlık + açıklama. Hero'nun üstüne yuvarlak köşeli biner.

export function ServiceFeatures({ page }: { page: ServicePage }) {
  const { features, featuresIntro } = page;
  const left = features.filter((_, i) => i % 2 === 0);
  const right = features.filter((_, i) => i % 2 === 1);
  // Kart sayısı arttıkça görselin boyuna sığsınlar
  const compact = features.length > 4;

  return (
    <section id="ozellikler" className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pb-12 pt-24 md:px-[4.5vw] md:pb-16 md:pt-32">
      {featuresIntro && (
        <Reveal className="mx-auto mb-14 max-w-[1320px] md:mb-20">
          <h2 className="max-w-[14em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
            {featuresIntro.title}
          </h2>
          <p className="mt-5 max-w-[40em] text-[clamp(15px,1.05vw,18px)] leading-[1.5] tracking-[-0.01em] text-neutral-500">
            {featuresIntro.desc}
          </p>
        </Reveal>
      )}

      <div
        className={cn(
          "mx-auto grid max-w-[1320px] gap-3 lg:grid-cols-[1fr_minmax(0,1.05fr)_1fr] lg:gap-5",
          compact ? "items-stretch" : "items-center",
        )}
      >
        <div className="grid gap-3 lg:gap-5">
          {left.map((f, i) => (
            <FeatureCard key={f.title} index={i * 2} compact={compact} {...f} />
          ))}
        </div>

        <Reveal
          index={1}
          className={cn(
            "relative order-first aspect-[4/5] overflow-hidden rounded-[32px] bg-[#111] lg:order-none",
            // Kartlar görselden uzunsa görsel sütun boyunca uzar
            compact && "lg:aspect-auto",
          )}
        >
          <Image src={page.service.image} alt="" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
        </Reveal>

        <div className="grid gap-3 lg:gap-5">
          {right.map((f, i) => (
            <FeatureCard key={f.title} index={i * 2 + 1} compact={compact} {...f} />
          ))}
        </div>
      </div>

      {featuresIntro?.note && (
        <p className="mx-auto mt-6 max-w-[1320px] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
          {featuresIntro.note}
        </p>
      )}
    </section>
  );
}

function FeatureCard({ index, title, desc, compact }: { index: number; title: string; desc: string; compact: boolean }) {
  return (
    <Reveal
      index={index}
      className={cn(
        "flex flex-col justify-between rounded-[28px] bg-[#F5F5F5] p-7 md:p-8",
        compact ? "min-h-[200px] gap-6" : "min-h-[260px] gap-10",
      )}
    >
      <span className={cn("grid place-items-center rounded-full bg-white", compact ? "size-10" : "size-12")}>
        <PixelIcon variant="arrow" className="size-[10px] -rotate-45" cellClassName="fill-[#111]" />
      </span>
      <div>
        <h3 className="text-[clamp(20px,1.5vw,26px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
          {title}
        </h3>
        <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">{desc}</p>
      </div>
    </Reveal>
  );
}
