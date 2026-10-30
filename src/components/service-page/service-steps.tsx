import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";
import type { ServicePage } from "./service-page-data";

// Referans: solda yapışkan başlık ("3 adımda başla"), sağda numaralı dikey zaman çizgisi ve büyük kartlar.
// Kartlardaki uygulama ekranları yerine görsel alanı (görseller sonra konacak).

export function ServiceSteps({ steps, image }: { steps: ServicePage["steps"]; image: string }) {
  return (
    <section data-dock="surec" className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 py-24 md:px-[4.5vw] md:py-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
            {steps.length} adımda
            <br />
            başlıyoruz.
          </h2>
          <p className="mt-4 text-[clamp(15px,1.05vw,18px)] tracking-[-0.01em] text-neutral-500">
            İlk görüşmeden yayına kadar her şey belli.
          </p>
        </div>

        <ol>
          {steps.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[44px_1fr] gap-5 md:gap-8">
              {/* Zaman çizgisi: numara + kesikli dikey çizgi */}
              <div className="flex flex-col items-center">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#111] font-mono text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span aria-hidden className="w-px flex-1 border-l border-dashed border-neutral-300" />
                )}
              </div>

              <Reveal className="pb-6 md:pb-8">
                <div className="overflow-hidden rounded-[28px] bg-[#F5F5F5]">
                  <div className="relative aspect-[16/8] bg-[#E9E9E9]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover opacity-90"
                    />
                  </div>
                  <div className="p-7 md:p-9">
                    <h3 className="text-[clamp(22px,1.7vw,30px)] font-medium tracking-[-0.035em] text-[#111]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
