import { Reveal } from "@/components/about/about-cards";
import { SplitHeading } from "@/components/ui/section-parts";
import { CANDOR } from "./about-data";

// "Net olalım": iki sütun, yaptıklarımız ve bilerek yapmadıklarımız. Abartılı vaatlerle dolu bir sektörde
// neyi yapmadığını açıkça söylemek güven verir. Açık zemin: koyu süreç bölümünden sonra sayfa nefes alsın.
// -mt-12 + yuvarlak üst köşeler: süreç bölümünün üstüne, misyondaki gibi bir sayfa olarak biner.

export function AboutCandor() {
  return (
    <section className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pb-28 pt-24 md:px-[4.5vw] md:pb-36 md:pt-32">
      <SplitHeading strong="Net olalım." soft="Ne yaptığımızı da, bilerek yapmadığımızı da söylüyoruz." />

      <div className="mt-12 grid gap-3 md:grid-cols-2">
        <Reveal className="rounded-[28px] bg-[#F1F1F1] p-7 md:p-9">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Bunu yaparız</p>
          <ul className="mt-6">
            {CANDOR.do.map((item) => (
              <li key={item} className="flex gap-4 border-t border-black/[0.07] py-4 first:border-0 first:pt-0">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-black"
                >
                  ✓
                </span>
                <span className="text-[clamp(16px,1.2vw,19px)] leading-[1.4] tracking-[-0.015em] text-[#111]">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={1} className="rounded-[28px] bg-[#111] p-7 md:p-9">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">Bunu yapmayız</p>
          <ul className="mt-6">
            {CANDOR.dont.map((item) => (
              <li key={item} className="flex gap-4 border-t border-white/10 py-4 first:border-0 first:pt-0">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[13px] font-bold text-white/70"
                >
                  ×
                </span>
                <span className="text-[clamp(16px,1.2vw,19px)] leading-[1.4] tracking-[-0.015em] text-white">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
