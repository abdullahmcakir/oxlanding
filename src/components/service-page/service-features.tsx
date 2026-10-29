import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import type { ServicePage } from "./service-page-data";

// Referans: ortada telefon maketi, iki yanında ikişer özellik kartı.
// Maket yerine hizmetin görseli; kartlar hizmetin kalemleri. Hero'nun üstüne yuvarlak köşeli biner.

export function ServiceFeatures({ page }: { page: ServicePage }) {
  const [a, b, c, d] = page.features;

  return (
    <section id="ozellikler" className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pb-12 pt-24 md:px-[4.5vw] md:pb-16 md:pt-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-3 lg:grid-cols-[1fr_minmax(0,1.05fr)_1fr] lg:gap-5">
        <div className="grid gap-3 lg:gap-5">
          <FeatureCard index={0} {...a} />
          <FeatureCard index={1} {...c} />
        </div>

        <Reveal index={1} className="relative order-first aspect-[4/5] overflow-hidden rounded-[32px] bg-[#111] lg:order-none">
          <Image src={page.service.image} alt="" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
        </Reveal>

        <div className="grid gap-3 lg:gap-5">
          <FeatureCard index={2} {...b} />
          <FeatureCard index={3} {...d} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <Reveal index={index} className="flex min-h-[260px] flex-col justify-between gap-10 rounded-[28px] bg-[#F5F5F5] p-7 md:p-8">
      <span className="grid size-12 place-items-center rounded-full bg-white">
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
