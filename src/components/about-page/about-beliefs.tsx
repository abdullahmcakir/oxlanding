"use client";

import { useState } from "react";
import { PixelMatrix } from "@/components/dock/pixel-matrix";
import { Reveal } from "@/components/about/about-cards";
import { cn } from "@/lib/utils";
import { BELIEFS } from "./about-data";

// "Neye inanıyoruz": kendimizi anlatmak yerine duruşumuz. Koyu blokta solda başlık ve büyük piksel matris,
// sağda ilkeler. Aynı anda tek bir ilke öne çıkar (parlak başlık, yeşil numara, açılan açıklama); diğerleri
// soluklaşır. Üstüne gelince / dokununca o ilke öne çıkar ve matris pikselleri dağıtıp ilkenin şekline toplanır
// (asistanın yüzüyle aynı dil). Kaydırmaya bağlı değil: yalnız ziyaretçi etkileşince hareket eder.

export function AboutBeliefs() {
  const [active, setActive] = useState(0);
  const current = BELIEFS[active];

  return (
    <section id="ilkeler" className="scroll-mt-24 bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <Reveal>
        <div className="grid gap-12 rounded-[32px] bg-[#111] p-6 md:p-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 lg:p-16">
          <div className="flex flex-col">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">Neye inanıyoruz</p>
            <h2 className="mt-6 text-[clamp(34px,3.6vw,64px)] font-medium leading-[1.02] tracking-[-0.05em] text-white">
              {BELIEFS.length} basit ilke.
            </h2>
            <p className="mt-5 max-w-[30ch] text-[clamp(16px,1.15vw,19px)] leading-[1.45] text-white/50">
              Her projede, her müşteriyle aynı sözleri tutarız.
            </p>

            {/* Öne çıkan ilkenin piksel şekli */}
            <div className="mt-10 flex items-end gap-5 lg:mt-auto">
              <span className="grid size-[148px] shrink-0 place-items-center rounded-[28px] bg-black/60 ring-1 ring-white/10 md:size-[188px]">
                <PixelMatrix glyph={current.glyph} cell={20} className="max-md:scale-[0.78]" />
              </span>
              <span className="pb-1 font-mono text-[12px] font-bold text-white/40">
                <span className="text-accent">0{active + 1}</span> / 0{BELIEFS.length}
              </span>
            </div>
          </div>

          <ol className="border-b border-white/10">
            {BELIEFS.map((b, i) => {
              const on = i === active;
              return (
                <li key={b.title} className="border-t border-white/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="grid w-full grid-cols-[40px_1fr] gap-x-4 py-6 text-left outline-none md:grid-cols-[56px_1fr] md:py-7"
                  >
                    <span
                      className={cn(
                        "pt-2.5 font-mono text-[12px] transition-colors duration-300",
                        on ? "text-accent" : "text-white/30",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-[clamp(26px,2.6vw,44px)] font-medium leading-[1.08] tracking-[-0.045em] transition-colors duration-300",
                          on ? "text-white" : "text-white/30",
                        )}
                      >
                        {b.title}
                      </span>
                      {/* Açıklama yalnız öne çıkan ilkede açılır (grid-rows ile yumuşak yükseklik) */}
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-[44ch] pt-3 text-[17px] leading-[1.5] text-white/60">{b.text}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
