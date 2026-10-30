"use client";

import { useId, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

// Düzen referansı: tbdstudio.framer.ai "Pre-call FAQ".
// Açık tonda kuruldu: üstteki iki koyu bloktan (Farkımız, Paketler) sonra sayfaya nefes aldırsın.
// Sorular ve cevaplar YER TUTUCU.
const FAQ = [
  {
    q: "Başlamadan önce net bir planımız olması gerekiyor mu?",
    a: "Hayır. Çoğu müşterimiz “bir şeyler eksik” hissiyle gelir. İlk görüşmede ihtiyaçlarınızı birlikte çıkarır, önceliklendirilmiş bir yol haritasına dönüştürürüz.",
  },
  {
    q: "Sonuçları ne kadar sürede görmeye başlarız?",
    a: "Paket ve kapsama göre değişir; çoğu projede ilk somut çıktıları ilk 2–4 hafta içinde paylaşırız.",
  },
  {
    q: "Hangi paketin bize uygun olduğunu nasıl anlarız?",
    a: "Paketler bir başlangıç noktası. Görüşmede işletmenizin aşamasına göre kalemleri ekleyip çıkararak size özel bir kapsam oluştururuz.",
  },
  {
    q: "Verilerimiz ve hesaplarımız ne oluyor?",
    a: "Reklam hesapları, alan adı, site ve tüm içerikler sizin adınıza açılır ve size aittir. Biz yalnızca yetkilendirilmiş erişimle çalışırız.",
  },
  {
    q: "Proje bitince size bağlı mı kalıyoruz?",
    a: "Hayır. Teslim edilen her şey belgelenir; isterseniz kendi ekibinizle devam edersiniz, isterseniz aylık destekle birlikte büyümeye devam ederiz.",
  },
  {
    q: "Bir şey bozulursa ne oluyor?",
    a: "Destek kapsamındaki projelerde sorunları panel üzerinden bildirirsiniz; ekibimiz öncelik sırasına göre hızlıca müdahale eder.",
  },
];

export type FaqItem = { q: string; a: string };

/** `items` verilmezse ana sayfanın genel soruları gösterilir (hizmet sayfaları kendi sorularını verir). */
export function Faq({ items = FAQ }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="sss" data-dock="sss" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <h2 className="text-center text-[clamp(40px,4.6vw,88px)] font-medium leading-[1.05] tracking-[-0.045em] text-[#111]">
        Sık sorulanlar.
      </h2>

      <Reveal className="mx-auto mt-14 max-w-[920px]">
        <div className="space-y-1.5 rounded-[28px] bg-[#F1F1F1] p-1.5">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              <div key={item.q} className="flex gap-1.5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex flex-1 flex-col rounded-[22px] bg-white px-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#111]/20 md:px-8"
                >
                  <span className="text-[clamp(16px,1.2vw,19px)] font-medium tracking-[-0.015em] text-[#111]">
                    {item.q}
                  </span>
                  {/* 0fr → 1fr: cevap kendi yüksekliği kadar yumuşakça açılır */}
                  <span
                    id={panelId}
                    role="region"
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span
                        className={cn(
                          "block max-w-[680px] pt-3 text-[15px] leading-[1.55] text-neutral-500 transition-opacity duration-500",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {item.a}
                      </span>
                    </span>
                  </span>
                </button>

                {/* Kare ikon hücresi: piksel ok aşağı ↔ yukarı dönüşür */}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "grid w-[72px] shrink-0 place-items-center rounded-[22px] transition-colors duration-300 md:w-[84px]",
                    isOpen ? "bg-[#111]" : "bg-white hover:bg-neutral-50",
                  )}
                >
                  <PixelIcon
                    variant={isOpen ? "up" : "down"}
                    className="size-[11px]"
                    cellClassName={isOpen ? "fill-accent" : "fill-[#111]"}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Listeyi atla: doğrudan talep */}
      <div className="mt-24 flex flex-col items-center text-center">
        <h3 className="text-[clamp(30px,2.8vw,52px)] font-medium tracking-[-0.04em] text-[#111]">
          Listeyi atlamak mı istersin?
        </h3>
        <span className="mt-10 h-24 w-px bg-neutral-300" aria-hidden />
        <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
          Doğrudan ekibimizle konuş.
        </p>
        <a href={talepUrl({ konu: "soru" })} className="group mt-6 flex items-center gap-1.5">
          <span className="flex h-12 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white">
            Soru sor
          </span>
          <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-black" />
          </span>
        </a>
      </div>
    </section>
  );
}
