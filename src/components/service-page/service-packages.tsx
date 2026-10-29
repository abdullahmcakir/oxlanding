import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { SplitHeading } from "@/components/ui/section-parts";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./service-scope";
import type { ServicePage } from "./service-page-data";

// Hizmet sayfasının kapanışı: genel CTA yerine o hizmetin paketleri.
// Kart dili ana sayfadaki Paketler bölümüyle aynı (#171717 çerçeve, #070707 panel, beyaz + yeşil buton).
// Altındaki şerit, kaldırılan CTA'nın #iletisim adresini devralır: sitedeki "Toplantı Ayarla" butonları buraya iner.

export function ServicePackages({ page }: { page: ServicePage }) {
  const { packages, service } = page;

  return (
    <section id="paketler" className="scroll-mt-28 bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <SplitHeading strong="Paketler." soft={`${service.title} için ihtiyacına uygun planı seç.`} />

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {packages.map((pkg, i) => (
          <Reveal key={pkg.title} index={i} className="h-full">
            <a
              href={talepUrl({ hizmet: service.slug, paket: pkg.title.toLocaleLowerCase("tr") })}
              className="group flex h-full min-h-[560px] flex-col rounded-[32px] bg-[#171717] p-1.5 text-white outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
            >
              <div className="flex flex-1 flex-col rounded-[26px] bg-[#070707] p-7 md:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[clamp(32px,2.4vw,40px)] leading-none tracking-[-0.03em]">0{i + 1}</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Süre: <span className="text-white">{pkg.duration}</span>
                  </span>
                </div>

                <h3 className="mt-[clamp(40px,5vw,80px)] text-[clamp(28px,2.3vw,40px)] leading-[1.15] tracking-[-0.03em]">
                  <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span>{pkg.title}.</span>
                    {pkg.featured && (
                      <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                        Popüler
                      </span>
                    )}
                  </span>
                  <span className="block text-white/45">{pkg.tagline}.</span>
                </h3>

                <ul className="mt-auto space-y-3 pt-10">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] tracking-[-0.01em] text-white/75">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-6 md:px-8">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-12 items-center rounded-[10px] px-5 text-[15px] font-semibold tracking-[-0.02em]",
                      pkg.featured ? "bg-accent text-black" : "bg-white text-[#111]",
                    )}
                  >
                    Bu paketi seç
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
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div
          id="iletisim"
          className="mt-4 flex scroll-mt-28 flex-col gap-8 rounded-[32px] bg-[#F1F1F1] p-8 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div>
            <h3 className="text-[clamp(24px,2vw,36px)] font-medium leading-[1.15] tracking-[-0.035em] text-[#111]">
              Paketlere sığmayan bir ihtiyacın mı var?
            </h3>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
              30 dakikalık ücretsiz bir görüşmede kapsamı birlikte belirleyip sana özel bir plan çıkaralım.
            </p>
          </div>
          <a
            href={talepUrl({ hizmet: service.slug })}
            className="group inline-flex shrink-0 items-center gap-2.5 self-start rounded-[14px] bg-[#111] py-3.5 pl-5 pr-4 text-[15px] font-semibold tracking-[-0.01em] text-white md:self-auto"
          >
            Görüşme ayarla
            <PixelIcon
              variant="arrow"
              className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
