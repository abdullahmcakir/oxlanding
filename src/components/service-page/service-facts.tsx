import { Reveal } from "@/components/about/about-cards";
import type { ServicePage } from "./service-page-data";

// "Bir bakışta": süre, teslim, destek gibi karar verirken ilk bakılan bilgiler.
// Kutu dili SSS ile aynı: #F1F1F1 çerçeve içinde beyaz hücreler.

export function ServiceFacts({ items }: { items: ServicePage["facts"] }) {
  return (
    <section className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <Reveal className="mx-auto max-w-[1320px]">
        <dl className="grid gap-1.5 rounded-[28px] bg-[#F1F1F1] p-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col justify-between gap-8 rounded-[22px] bg-white p-6 md:p-7">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                {item.label}
              </dt>
              <dd className="text-[clamp(19px,1.45vw,26px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
