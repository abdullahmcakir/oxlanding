import Link from "next/link";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";
import {
  FINAL_CTA,
  PRICE_GUIDE_PATH,
  PRICING,
  PROCESS,
  SECTORS,
  SOLUTIONS,
  WEBSITE_PRICE_NOTE,
  WEBSITE_START_PRICE,
  WHY,
  WHY_OX,
} from "./balikesir-data";

// /balikesir-web-sitesi bölümleri. Hizmet sayfalarının dili: #111 metin, #F5F5F5 kartlar, 28–32px köşeler,
// mono büyük harf etiketler, piksel ikonlar, Reveal ile hafif giriş animasyonu (hareketi azalt tercihine uyar).
// Ritim: açık (neden) → açık kartlar (çözümler) → koyu blok (sektörler) → açık (süreç, fiyat) → gri (neden OX)
// → SSS → koyu kapanış.

const H2 = "text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em]";
const LEAD = "text-[clamp(15px,1.05vw,18px)] leading-[1.55] tracking-[-0.01em]";
const LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.12em]";
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Hero'nun üstüne yuvarlak köşeyle biner (hizmet sayfalarındaki ilk bölüm gibi) */
export function BalikesirWhy() {
  return (
    <section className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pb-20 pt-24 md:px-[4.5vw] md:pb-28 md:pt-32">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 className={`${H2} max-w-[15em] text-[#111]`}>{WHY.title}</h2>
          <p className={`${LEAD} max-w-[38em] text-neutral-500`}>{WHY.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5">
          {WHY.items.map((item, i) => (
            <li key={item.title} className="h-full">
              <Reveal index={i} className="flex h-full min-h-[260px] flex-col justify-between gap-10 rounded-[28px] bg-[#F5F5F5] p-7 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-white">
                    <PixelIcon variant="arrow" className="size-[10px] -rotate-45" cellClassName="fill-[#111]" />
                  </span>
                  <span className="font-mono text-[12px] text-neutral-400">{pad(i)}</span>
                </div>
                <div>
                  <h3 className="text-[clamp(20px,1.5vw,26px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">{item.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BalikesirSolutions() {
  return (
    // Hız ölçümü aracı (dock) bu bölümde: yenileme düşünen ziyaretçi mevcut sitesini ölçebilir
    <section id="cozumler" data-dock="hizmetler" className="scroll-mt-24 bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className={`${LABEL} text-neutral-500`}>Web tasarım çözümlerimiz</p>
          <h2 className={`${H2} mt-5 max-w-[14em] text-[#111]`}>{SOLUTIONS.title}</h2>
          <p className={`${LEAD} mt-5 max-w-[40em] text-neutral-500`}>{SOLUTIONS.intro}</p>
        </Reveal>

        <ul className="mt-14 grid gap-3 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {SOLUTIONS.items.map((item, i) => (
            <li key={item.title} className="h-full">
              <Reveal index={i % 3} className="group flex h-full flex-col rounded-[28px] bg-white p-7 ring-1 ring-black/[0.08] transition-colors duration-300 hover:bg-[#F5F5F5] md:p-8">
                <span className="font-mono text-[12px] text-neutral-400">{pad(i)}</span>
                <h3 className="mt-8 text-[clamp(21px,1.6vw,27px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.55] tracking-[-0.01em] text-neutral-500">{item.desc}</p>
                <Link
                  href={item.link.href}
                  className="mt-8 inline-flex w-fit items-center gap-2 text-[14px] font-semibold tracking-[-0.01em] text-[#111] underline-offset-4 hover:underline"
                >
                  {item.link.label}
                  <PixelIcon variant="arrow" className="size-[8px]" cellClassName="fill-accent" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BalikesirSectors() {
  return (
    <section className="bg-background px-3 pb-24 md:px-5 md:pb-32">
      <Reveal>
        <div className="rounded-[32px] bg-[#111] px-5 py-16 text-white md:px-[4.5vw] md:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div>
                <p className={`${LABEL} flex items-center gap-2 text-accent`}>
                  <PixelIcon variant="frame" className="size-[9px]" />
                  Sektörler
                </p>
                <h2 className={`${H2} mt-5 max-w-[13em]`}>{SECTORS.title}</h2>
              </div>
              <div>
                <p className={`${LEAD} max-w-[38em] text-white/60`}>{SECTORS.intro}</p>
                <ul aria-label="Bölgeler" className="mt-6 flex flex-wrap gap-2">
                  {SECTORS.places.map((p) => (
                    <li key={p} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white/70">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="mt-14 grid gap-px overflow-hidden rounded-[24px] bg-white/10 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {SECTORS.items.map((item, i) => (
                <li key={item.title} className="flex flex-col bg-[#111] p-7 md:p-8">
                  <span className="font-mono text-[12px] text-white/35">{pad(i)}</span>
                  <h3 className="mt-6 text-[clamp(20px,1.5vw,25px)] font-medium leading-[1.15] tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-white/60">{item.desc}</p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <li key={t} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[12px] text-white/75">
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function BalikesirProcess() {
  return (
    <section data-dock="surec" className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className={`${LABEL} text-neutral-500`}>Süreç</p>
          <h2 className={`${H2} mt-5 max-w-[14em] text-[#111]`}>{PROCESS.title}</h2>
          <p className={`${LEAD} mt-5 max-w-[40em] text-neutral-500`}>{PROCESS.intro}</p>
        </Reveal>

        {/* Masaüstünde yatay zaman çizgisi (numaralar bir çizgi üstünde), mobilde dikey */}
        <ol className="relative mt-14 grid gap-3 lg:mt-20 lg:grid-cols-5 lg:gap-4">
          <span aria-hidden className="absolute left-[22px] top-0 hidden h-px w-[calc(100%-44px)] translate-y-[22px] border-t border-dashed border-neutral-300 lg:block" />
          {PROCESS.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <Reveal index={i} className="grid grid-cols-[44px_1fr] gap-5 lg:block">
                <span className="relative grid size-11 place-items-center rounded-full bg-[#111] font-mono text-[13px] font-bold text-white">
                  {i + 1}
                </span>
                <div className="rounded-[24px] bg-[#F5F5F5] p-6 lg:mt-6 lg:min-h-[190px]">
                  <h3 className="text-[clamp(19px,1.35vw,23px)] font-medium tracking-[-0.03em] text-[#111]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">{step.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BalikesirPricing() {
  return (
    <section id="fiyat" className="scroll-mt-24 bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className={`${LABEL} text-neutral-500`}>Fiyatlar</p>
          <h2 className={`${H2} mt-5 max-w-[12em] text-[#111]`}>{PRICING.title}</h2>
          <p className={`${LEAD} mt-5 max-w-[34em] text-neutral-500`}>{PRICING.text}</p>
          {WEBSITE_START_PRICE && (
            <div className="mt-8 rounded-[24px] bg-[#F5F5F5] p-6">
              <p className={`${LABEL} text-neutral-500`}>OX Dijital · Website</p>
              <p className="mt-3 text-[clamp(28px,2.4vw,40px)] font-medium leading-none tracking-[-0.04em] text-[#111]">
                {WEBSITE_START_PRICE}
                <span className="text-[16px] font-normal tracking-[-0.01em] text-neutral-500">’den başlayan fiyatlarla</span>
              </p>
              {WEBSITE_PRICE_NOTE && <p className="mt-3 text-[14px] leading-[1.5] text-neutral-500">{WEBSITE_PRICE_NOTE}</p>}
            </div>
          )}
        </Reveal>

        <div>
          <ol className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {PRICING.factors.map((f, i) => (
              <li key={f.title}>
                <Reveal className="grid grid-cols-[40px_1fr] gap-4 py-6 md:grid-cols-[56px_1fr] md:py-7">
                  <span className="pt-1 font-mono text-[12px] text-neutral-400">{pad(i)}</span>
                  <div>
                    <h3 className="text-[clamp(19px,1.35vw,23px)] font-medium tracking-[-0.03em] text-[#111]">{f.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-[1.55] tracking-[-0.01em] text-neutral-500">{f.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Fiyat rehberine güçlü iç bağlantı: fiyat araştırmasının ayrıntısı blog yazısında */}
          <Reveal className="mt-8">
            <Link
              href={PRICE_GUIDE_PATH}
              className="group flex flex-col gap-6 rounded-[28px] bg-accent p-7 text-accent-ink md:flex-row md:items-end md:justify-between md:p-8"
            >
              <span>
                <span className={`${LABEL} text-white/70`}>Rehber · Blog</span>
                <span className="mt-3 block max-w-[20em] text-[clamp(21px,1.6vw,27px)] font-medium leading-[1.15] tracking-[-0.03em]">
                  {PRICING.guide.label}
                </span>
                <span className="mt-3 block max-w-[34em] text-[15px] leading-[1.5] text-white/80">{PRICING.guide.text}</span>
              </span>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-accent" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function BalikesirWhyOx() {
  return (
    <section className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <Reveal>
        <div className="rounded-[32px] bg-[#F1F1F1] px-6 py-16 text-center md:px-12 md:py-24">
          <p className={`${LABEL} text-neutral-500`}>Neden OX Dijital?</p>
          <h2 className={`${H2} mx-auto mt-5 max-w-[15em] text-[#111]`}>{WHY_OX.title}</h2>
          <p className={`${LEAD} mx-auto mt-6 max-w-[44em] text-neutral-500`}>{WHY_OX.text}</p>
          <ul className="mx-auto mt-10 flex max-w-[900px] flex-wrap justify-center gap-2">
            {WHY_OX.items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-full bg-white py-2.5 pl-3 pr-4 text-[15px] tracking-[-0.01em] text-[#111]"
              >
                <span className="grid size-5 place-items-center rounded-full bg-accent">
                  <PixelIcon variant="plus" className="size-[7px]" cellClassName="fill-accent-ink" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export function BalikesirFinalCta() {
  return (
    // Kapanış zaten görüşme çağrısı: sağ alttaki asistan aynı şeyi tekrar etmesin
    <section data-dock="hide" className="bg-background px-3 pb-6 md:px-5">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-[#070707] px-6 py-20 text-center text-white md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1/2 mx-auto h-full w-[80%] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.35),transparent)] blur-2xl"
          />
          <h2 className={`${H2} relative mx-auto max-w-[16em]`}>{FINAL_CTA.title}</h2>
          <p className={`${LEAD} relative mx-auto mt-6 max-w-[36em] text-white/65`}>{FINAL_CTA.text}</p>
          <a href={talepUrl({ hizmet: "website" })} className="group relative mt-10 inline-flex items-center gap-1.5">
            <span className="flex h-12 items-center rounded-[10px] bg-white px-5 text-[15px] font-semibold tracking-[-0.02em] text-[#111]">
              {FINAL_CTA.label}
            </span>
            <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
              <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-accent-ink" />
            </span>
          </a>
          <p className={`${LABEL} relative mt-6 text-white/40`}>{FINAL_CTA.note}</p>
        </div>
      </Reveal>
    </section>
  );
}
