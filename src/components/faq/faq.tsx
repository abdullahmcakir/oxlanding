"use client";

import { useId, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import { faqJsonLd, jsonLdHtml } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Düzen referansı: tbdstudio.framer.ai "Pre-call FAQ".
// Açık tonda kuruldu: üstteki iki koyu bloktan (Farkımız, Paketler) sonra sayfaya nefes aldırsın.
// Cevaplar sunucuda render edilir ve kapalıyken de HTML'de durur (yalnız görsel olarak daralır).
const FAQ = [
  {
    q: "OX Dijital hangi hizmetleri sunuyor?",
    a: "Web tasarımı, e-ticaret sitesi kurulumu, sosyal medya yönetimi, dijital reklamcılık, SEO ve marka kimliği tasarımı alanlarında çalışıyoruz. İhtiyacına göre tek bir hizmet alabilir veya birden fazla hizmeti birlikte planlayabilirsin.",
  },
  {
    q: "Web sitesi yaptırmak ne kadar tutar?",
    a: "Web sitesi fiyatlarımız 3.499 TL'den başlıyor. Tek sayfalık tanıtım sitelerinden çok sayfalı kurumsal web sitelerine kadar farklı ihtiyaçlara yönelik çözümler sunuyoruz. Net fiyatı sayfa sayısı, tasarım ve ek özelliklere göre belirliyoruz.",
  },
  {
    q: "Sosyal medya yönetimi fiyatları ne kadar?",
    a: "Sosyal medya hizmetlerimiz aylık 9.999 TL'den başlıyor. İçerik tasarımı, hesap yönetimi, fotoğraf ve video çekimi, kurgu ve reklam yönetimi gibi hizmetleri ihtiyacına göre planlıyoruz. Reklam bütçesi ayrıca hesaplanır.",
  },
  {
    q: "SEO çalışmaları ne kadar sürede sonuç verir?",
    a: "SEO çalışmalarının etkisi sitenin mevcut durumuna, sektörüne ve rekabet düzeyine göre değişir. Bazı iyileştirmelerin sonuçları daha erken görülebilirken, kalıcı organik görünürlük kazanmak genellikle birkaç ay süren düzenli bir çalışma gerektirir. İlk görüşmede sitenin durumunu değerlendirip gerçekçi bir plan oluşturuyoruz.",
  },
  {
    q: "Google Ads ve Instagram reklamlarını yönetiyor musunuz?",
    a: "Evet. Google Ads ve Meta üzerinden reklam kampanyalarının planlanması, kurulumu, takibi ve optimizasyonu konusunda hizmet veriyoruz. Hedef kitleni ve bütçeni birlikte belirleyerek kampanyaları işletmenin hedeflerine göre yönetiyoruz. Reklam harcamaları hizmet bedelinden ayrıdır.",
  },
  {
    q: "Hangi şehirlerdeki işletmelerle çalışıyorsunuz?",
    a: "Türkiye'nin her yerindeki işletmelerle çalışıyoruz. Resmî ofisimiz İstanbul'da; görüşmeleri ve proje takibini online yürütüyoruz. Balıkesir ve çevresindeysen yüz yüze de görüşebiliriz. Fiziksel çekim gerektiren işlerde konum ve organizasyon detaylarını ayrıca değerlendiriyoruz.",
  },
  {
    q: "Web sitem tamamlandıktan sonra güncelleme ve destek alabilir miyim?",
    a: "Evet. Web sitenin tesliminden sonra bakım, güncelleme ve yeni özellik geliştirme ihtiyaçlarını ayrıca planlayabiliriz. Destek kapsamını ve varsa devam eden hizmet ücretlerini proje başlamadan önce netleştiriyoruz.",
  },
  {
    q: "OX Dijital ile çalışmaya nasıl başlayabilirim?",
    a: "Ücretsiz ön görüşme talebi oluşturman yeterli. İşletmeni, hedeflerini ve ihtiyaçlarını konuşuyoruz. Ardından yapılacak işleri, çalışma sürecini ve fiyat teklifini paylaşıyoruz. Teklifi değerlendirdikten sonra devam edip etmeyeceğine karar verebilirsin.",
  },
];

export type FaqItem = { q: string; a: string };
export type FaqCta = { title: string; text: string; label: string };

const CTA: FaqCta = {
  title: "Aklındaki soruyu bulamadın mı?",
  text: "Merak ettiğin bir şey varsa doğrudan bize sorabilirsin. Yardımcı olmaktan memnuniyet duyarız.",
  label: "Sorunu ilet",
};

/**
 * `items` verilmezse ana sayfanın genel soruları gösterilir (hizmet sayfaları kendi sorularını verir).
 * `cta`: listenin altındaki "bize sor" alanının metinleri.
 */
export function Faq({
  items = FAQ,
  cta = CTA,
  title = "Sık sorulanlar.",
  schema = false,
}: {
  items?: FaqItem[];
  /** null: listenin altındaki "bize sor" alanı gösterilmez (sayfanın kendi kapanış CTA'sı varsa) */
  cta?: FaqCta | null;
  title?: string;
  /** true: görünen soru-cevaplarla birebir aynı FAQPage yapısal verisini de basar (sayfada tek SSS olmalı) */
  schema?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="sss" data-dock="sss" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd(items))} />}
      <h2 className="text-center text-[clamp(40px,4.6vw,88px)] font-medium leading-[1.05] tracking-[-0.045em] text-[#111]">
        {title}
      </h2>

      <Reveal className="mx-auto mt-14 max-w-[920px]">
        <div className="space-y-1.5 rounded-[28px] bg-[#F1F1F1] p-1.5">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            const buttonId = `${baseId}-${i}-soru`;
            return (
              <div key={item.q} className="flex gap-1.5">
                {/* Erişilebilir accordion: soru h3 içindeki buton, cevap ona bağlı ayrı bölge */}
                <div className="flex-1 rounded-[22px] bg-white px-6 py-6 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#111]/20 md:px-8">
                  <h3 className="text-[clamp(16px,1.2vw,19px)] font-medium tracking-[-0.015em] text-[#111]">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full text-left outline-none"
                    >
                      {item.q}
                    </button>
                  </h3>
                  {/* 0fr → 1fr: cevap kendi yüksekliği kadar yumuşakça açılır */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          "max-w-[680px] pt-3 text-[15px] leading-[1.55] text-neutral-500 transition-opacity duration-500",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>

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

      {cta && (
        <>
          {/* Soru listede yoksa: doğrudan talep */}
          <div className="mt-24 flex flex-col items-center text-center">
            <h3 className="text-[clamp(30px,2.8vw,52px)] font-medium tracking-[-0.04em] text-[#111]">
              {cta.title}
            </h3>
            <p className="mt-5 max-w-[520px] text-[clamp(15px,1.05vw,18px)] leading-[1.6] text-neutral-500">{cta.text}</p>
            <span className="mt-10 h-24 w-px bg-neutral-300" aria-hidden />
            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Bize sor
            </p>
            <a href={talepUrl({ konu: "soru" })} className="group mt-6 flex items-center gap-1.5">
              <span className="flex h-12 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white">
                {cta.label}
              </span>
              <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-accent-ink" />
              </span>
            </a>
          </div>
        </>
      )}
    </section>
  );
}
