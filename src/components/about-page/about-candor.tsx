import { Reveal } from "@/components/about/about-cards";
import { SplitHeading } from "@/components/ui/section-parts";
import { cn } from "@/lib/utils";
import { CANDOR } from "./about-data";

// "Net olalım": iki sütun, yaptıklarımız ve bilerek yapmadıklarımız. Abartılı vaatlerle dolu bir sektörde
// neyi yapmadığını açıkça söylemek güven verir. Açık zemin: koyu süreç bölümünden sonra sayfa nefes alsın.
// -mt-12 + yuvarlak üst köşeler: süreç bölümünün üstüne, misyondaki gibi bir sayfa olarak biner.
//
// Karşılıklı maddeler tek grid'de: masaüstünde aynı numaralı iki madde aynı satırı paylaşır (uzun olan iki tarafı
// birlikte uzatır), iki kartın zemini bu satırların arkasında tam boy durur. Mobilde zemin yok; her madde kendi
// küçük kartında, çiftler art arda (yaparız → yapmayız).

const ITEM = "text-[clamp(16px,1.2vw,19px)] leading-[1.4] tracking-[-0.015em]";
const LABEL = "hidden font-mono text-[11px] font-bold uppercase tracking-[0.12em] md:block md:px-9 md:pb-6 md:pt-9";

export function AboutCandor() {
  const rows = CANDOR.do.length;

  return (
    <section className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pb-28 pt-24 md:px-[4.5vw] md:pb-36 md:pt-32">
      <SplitHeading strong="Net olalım." soft="Ne yaptığımızı da, bilerek yapmadığımızı da söylüyoruz." />

      <Reveal className="mt-12">
        <div className="grid gap-2 md:grid-cols-2 md:gap-x-3 md:gap-y-0">
          {/* Masaüstü kart zeminleri: başlık satırından son maddeye kadar */}
          <div
            aria-hidden
            className="hidden rounded-[28px] bg-[#F1F1F1] md:col-start-1 md:block md:[grid-row:1/var(--end)]"
            style={{ "--end": rows + 2 } as React.CSSProperties}
          />
          <div
            aria-hidden
            className="hidden rounded-[28px] bg-[#111] md:col-start-2 md:block md:[grid-row:1/var(--end)]"
            style={{ "--end": rows + 2 } as React.CSSProperties}
          />

          <p className={cn(LABEL, "text-neutral-500 md:col-start-1 md:row-start-1")}>Bunu yaparız</p>
          <p className={cn(LABEL, "text-white/50 md:col-start-2 md:row-start-1")}>Bunu yapmayız</p>

          {CANDOR.do.map((item, i) => {
            const style = { "--row": i + 2 } as React.CSSProperties;
            const last = i === rows - 1;
            // Masaüstünde satır kartın içinde: yanlarda kart boşluğu, maddeler arasında ince çizgi
            const cell = cn(
              "rounded-[20px] p-5 md:rounded-none md:bg-transparent md:p-0 md:px-9 md:[grid-row:var(--row)]",
              last && "md:pb-9",
              i > 0 && "max-md:mt-3",
            );
            const inner = cn("flex h-full gap-4 md:py-4", i === 0 ? "md:pt-0" : "md:border-t", last && "md:pb-0");
            return [
              <div key={`do-${i}`} className={cn(cell, "bg-[#F1F1F1] md:col-start-1")} style={style}>
                <div className={cn(inner, "border-black/[0.07]")}>
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-accent-ink"
                  >
                    ✓
                  </span>
                  <span className={cn(ITEM, "text-[#111]")}>{item}</span>
                </div>
              </div>,
              <div key={`dont-${i}`} className={cn(cell, "bg-[#111] md:col-start-2", i > 0 && "max-md:mt-0")} style={style}>
                <div className={cn(inner, "border-white/10")}>
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[13px] font-bold text-white/70"
                  >
                    ×
                  </span>
                  <span className={cn(ITEM, "text-white")}>{CANDOR.dont[i]}</span>
                </div>
              </div>,
            ];
          })}
        </div>
      </Reveal>
    </section>
  );
}
