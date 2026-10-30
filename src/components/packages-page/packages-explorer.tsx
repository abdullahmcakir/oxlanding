"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon, type PixelIconVariant } from "@/components/navbar/pixel-icon";
import { ServiceFlyout } from "@/components/services/service-flyout";
import { SERVICES, type Service } from "@/components/services/services-data";
import { SplitHeading } from "@/components/ui/section-parts";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import {
  allExtras,
  PLAN_STEPS,
  plansOf,
  SERVICE_GLYPHS,
  STAGES,
  stagesOf,
  type Plan,
  type Stage,
} from "./packages-page-data";

// Üstte üç aşama kartı (OX Panel'deki paket kartlarının sitedeki hali; kilitli). Altında her hizmetin paketleri
// tekli liste halinde alt alta: solda koyu hizmet kartı, sağda üç paket. Hizmetler arası hızlı geçişi sağ alttaki
// asistan yapar (data-dock="liste": her hizmetin piksel ikonu tek sırada, yüz bakılan hizmetin ikonuna döner).
// Aşama kartları ve "hizmet detayı" ana sayfadaki hizmet flyout'unu açar. Fiyat yok: süre + "kapsama göre teklif".

const STEP_ICONS: PixelIconVariant[] = ["quote", "plus", "arrow"];
const pad = (n: number) => String(n).padStart(2, "0");
const blockId = (slug: string) => `paket-${slug}`;
const ALL_SERVICES = SERVICES;

export function PackagesExplorer() {
  const [selected, setSelected] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const lastCard = useRef<HTMLElement | null>(null);

  const show = (item: Service, el: HTMLElement) => {
    lastCard.current = el;
    setSelected(item);
    setOpen(true);
  };

  return (
    <>
      <section className="mx-auto mt-14 grid max-w-[1200px] gap-3 md:mt-20 lg:grid-cols-3">
        {STAGES.map((stage, i) => (
          <Reveal key={stage.pkg.slug} index={i} className="h-full">
            <StageCard stage={stage} onOpen={(el) => show(stage.pkg, el)} />
          </Reveal>
        ))}
      </section>

      {/* Liste boyunca sağ alttaki asistan hızlı geçiş aracına döner (her hizmetin piksel ikonu tek sırada) */}
      <section
        id="hizmetler"
        data-dock="liste"
        data-dock-label="Hizmet paketleri"
        className="mx-auto mt-28 max-w-[1200px] scroll-mt-28 md:mt-40"
      >
        <SplitHeading strong="Hizmet paketleri." soft="Tek bir hizmet mi lazım? Her birinin paketleri burada." />

        {/* Paket seçmeden önce süreç: hangi paketi seçerse seçsin ilk adım ücretsiz görüşme */}
        <ol className="mt-10 grid gap-8 border-t border-black/[0.08] pt-8 md:grid-cols-3">
          {PLAN_STEPS.map((s, i) => (
            <li key={s.title}>
              <p className="flex items-center gap-2.5 text-[16px] font-medium tracking-[-0.015em] text-[#111]">
                <span className="grid size-7 place-items-center rounded-[8px] bg-[#111]">
                  <PixelIcon variant={STEP_ICONS[i]} className="size-[9px]" />
                </span>
                {s.title}
              </p>
              <p className="mt-2.5 max-w-[30ch] text-[15px] leading-[1.45] text-neutral-500">{s.text}</p>
            </li>
          ))}
        </ol>

        {/* Tekli liste: aşamalara göre gruplanmaz, yoksa hizmetler tek bir müşteri tipine özelmiş gibi okunuyor */}
        <div className="mt-12 space-y-3">
          {ALL_SERVICES.map((s) => (
            <ServiceBlock key={s.slug} service={s} onOpen={show} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[13px] text-neutral-500">Paketlere eklenebilen modül ve uygulamalar:</span>
          {allExtras().map((e) => (
            <span key={e.label} className="rounded-full bg-[#F1F1F1] px-3 py-1.5 text-[13px] text-[#333]">
              {e.label}
              <span className="ml-1.5 text-[11px] text-neutral-400">{e.kind}</span>
            </span>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="flex flex-col gap-6 rounded-[28px] bg-[#111] p-7 text-white md:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[clamp(24px,2vw,32px)] font-medium tracking-[-0.035em]">Özel proje</h3>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-[1.45] text-white/60">
                Paketlere sığmayan bir fikrin mi var? Kapsamını birlikte çizelim, tek seferlik bir proje olarak yapalım.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[14px] text-white/80">
              {["Net tanımlı kapsam", "Sabit takvim", "İki revizyon turu", "Aşama aşama güncelleme"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={talepUrl({ paket: "ozel" })}
              className="group inline-flex h-12 shrink-0 items-center gap-2.5 self-start rounded-full bg-white pl-5 pr-4 text-[15px] font-semibold tracking-[-0.01em] text-[#111] lg:self-auto"
            >
              Teklif al
              <PixelIcon
                variant="arrow"
                className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                cellClassName="fill-[#111]"
              />
            </a>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-[56ch] text-center text-[13px] leading-[1.5] text-neutral-400">
          Süreler tahminidir. Kesin kapsam, takvim ve teklif ücretsiz görüşmeden sonra netleşir.
        </p>
      </section>

      <ServiceFlyout service={selected} open={open} onOpenChange={setOpen} returnFocusTo={lastCard} />
    </>
  );
}

/** Aşama kartı: görsel başlık (etiket + ad), açıklama, içindeki hizmetler, "Paketi incele". */
function StageCard({ stage, onOpen }: { stage: Stage; onOpen: (el: HTMLElement) => void }) {
  const { pkg } = stage;
  const chips = pkg.items.map((i) => i.label);
  const visible = chips.slice(0, 3);

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-white text-left ring-1 ring-black/10 outline-none transition-shadow hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)] focus-visible:ring-4 focus-visible:ring-accent/60"
    >
      <div className="relative h-[200px] overflow-hidden bg-[#111]">
        <Image
          src={pkg.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="font-mono text-[12px] font-bold text-white/80">{pad(stage.step)}</span>
          {pkg.featured && (
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">
              Popüler
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">{pkg.tagline}</p>
          <p className="mt-1.5 text-[30px] font-medium leading-none tracking-[-0.04em] text-white">{pkg.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[15px] leading-[1.5] text-neutral-600">{pkg.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {visible.map((c) => (
            <li key={c} className="rounded-full bg-[#F1F1F1] px-3 py-1.5 text-[13px] text-[#333]">
              {c}
            </li>
          ))}
          {chips.length > visible.length && (
            <li className="rounded-full bg-[#F1F1F1] px-3 py-1.5 text-[13px] text-neutral-500">
              +{chips.length - visible.length}
            </li>
          )}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-[#111]">
            Paketi incele
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
            Süre: <span className="text-[#111]">{pkg.duration}</span>
          </span>
        </div>
      </div>
    </button>
  );
}

/** Hizmet bloğu: solda koyu hizmet kartı, sağda üç paket. Yer aldığı aşama paketi kısıtlama değil ek seçenek
 *  olarak not düşülür ("… paketinde de var"); nota tıklayınca o paketin flyout'u açılır. */
function ServiceBlock({ service, onOpen }: { service: Service; onOpen: (item: Service, el: HTMLElement) => void }) {
  const plans = plansOf(service.slug);
  const stages = stagesOf(service.slug);

  return (
    <Reveal>
      <div
        id={blockId(service.slug)}
        data-dock-item
        data-title={service.title}
        data-glyph={SERVICE_GLYPHS[service.slug]}
        className="grid scroll-mt-40 gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]"
      >
        <div className="flex flex-col overflow-hidden rounded-[28px] bg-[#111] text-white">
          <div className="relative h-[180px]">
            <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#111] via-[#111]/20 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#111]">
              İhtiyaca göre uyarlanır
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6 md:p-7">
            <h4 className="text-[clamp(28px,2.4vw,36px)] font-medium leading-[1.05] tracking-[-0.04em]">
              {service.title}
            </h4>
            <p className="mt-1 text-[15px] text-white/50">{service.tagline}</p>
            <p className="mt-4 text-[15px] leading-[1.45] text-white/70">{service.description}</p>
            {stages.map((pkg) => (
              <button
                key={pkg.slug}
                type="button"
                onClick={(e) => onOpen(pkg, e.currentTarget)}
                aria-haspopup="dialog"
                className="group mt-4 flex w-fit items-center gap-2 rounded-full bg-white/[0.07] py-1.5 pl-2.5 pr-3 text-[12px] text-white/70 transition-colors hover:bg-white/[0.12] hover:text-white"
              >
                <PixelIcon variant="diamond" className="size-[8px]" />
                <span>
                  <span className="text-white">{pkg.title}</span> paketinde de var
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </button>
            ))}
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <a
                href={talepUrl({ hizmet: service.slug })}
                className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent text-[15px] font-semibold tracking-[-0.01em] text-black transition-[filter] hover:brightness-110"
              >
                Ücretsiz görüşme
                <PixelIcon
                  variant="arrow"
                  className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                  cellClassName="fill-black"
                />
              </a>
              <button
                type="button"
                onClick={(e) => onOpen(service, e.currentTarget)}
                aria-haspopup="dialog"
                className="h-11 rounded-full bg-white/10 text-[14px] tracking-[-0.01em] text-white transition-colors hover:bg-white/15"
              >
                Hizmet detayı
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.title} plan={p} slug={service.slug} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function PlanCard({ plan, slug }: { plan: Plan; slug: string }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[28px] bg-white p-6 md:p-7",
        plan.featured ? "ring-2 ring-[#111]" : "ring-1 ring-black/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h5 className="text-[22px] font-medium tracking-[-0.03em] text-[#111]">{plan.title}</h5>
        {plan.featured && (
          <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">
            Popüler
          </span>
        )}
      </div>
      <p className="mt-1 text-[14px] leading-[1.4] text-neutral-500">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline justify-between border-y border-black/[0.08] py-3.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Süre</span>
        <span className="text-[15px] font-medium text-[#111]">{plan.duration}</span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {plan.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14px] leading-[1.4] text-[#333]">
            <span className="mt-0.5">
              <Check dark />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <a
          href={talepUrl({ hizmet: slug, paket: plan.title.toLocaleLowerCase("tr") })}
          className={cn(
            "group flex h-11 items-center justify-center gap-2 rounded-full text-[14px] font-semibold tracking-[-0.01em] transition-colors",
            plan.featured ? "bg-[#111] text-white hover:bg-black" : "bg-[#F1F1F1] text-[#111] hover:bg-[#E8E8E8]",
          )}
        >
          Bu paketi seç
          <PixelIcon
            variant="arrow"
            className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
            cellClassName={plan.featured ? "fill-accent" : "fill-[#111]"}
          />
        </a>
        <p className="mt-2.5 text-center text-[12px] text-neutral-400">Kapsama göre teklif</p>
      </div>
    </div>
  );
}

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-3.5 shrink-0", dark ? "text-[#111]" : "text-accent")}
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}
