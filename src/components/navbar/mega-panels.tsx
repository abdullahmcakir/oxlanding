"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SERVICES } from "@/components/services/services-data";
import { cn } from "@/lib/utils";
import { PixelIcon } from "./pixel-icon";
import {
  AvailabilityCard,
  Card,
  ContactCard,
  ImagePlaceholder,
  Label,
} from "./cards";

// İçerikler yer tutucu; gerçek metinler/görseller gelince güncellenecek.

const WORKS = [
  { title: "E-ticaret markası için yeniden konumlandırma", tags: "Tasarım · Yazılım" },
  { title: "Lansman kampanyası ile 3 ayda 4x dönüşüm", tags: "Reklam" },
  { title: "Restoran zinciri için sosyal medya kimliği", tags: "İçerik · Tasarım" },
];

const BLOG_CATEGORIES = [
  { title: "Blog", desc: "Reklam, tasarım ve yazılım üzerine yazılar." },
  { title: "Rehberler", desc: "Adım adım uygulanabilir pratik rehberler." },
  { title: "Vaka analizleri", desc: "Projelerin perde arkası ve sonuçları." },
];

const ARTICLES = [
  "2026'da Meta reklamlarında işe yarayan 5 strateji",
  "Landing page dönüşüm oranını artırmanın 7 yolu",
];

const ABOUT_LINKS = ["Ekip", "Süreç", "Kariyer", "İletişim"];

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-neutral-400 transition-colors hover:text-white"
    >
      {children}
      <PixelIcon
        variant="arrow"
        className="size-[8px] transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

// Solda hizmet listesi, sağda tüm hizmetlerin görselleri yan yana şeritler halinde.
// Üzerine gelinen hizmetin (listede ya da görselde) şeridi genişler, başlık ve sloganı görselin üstüne yazılır;
// diğerleri dar kalır. Böylece referanstaki farklı genişlikteki görsel dizilimi kendiliğinden oluşur.
export function ServicesPanel() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,2.25fr)] gap-1.5">
      <Card className="p-8">
        <Label>Hizmetler</Label>
        <ul className="mt-6 space-y-1">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/hizmetler/${s.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "flex items-baseline gap-3 py-1 text-[19px] tracking-[-0.02em] transition-colors duration-300",
                  active === i ? "text-white" : "text-neutral-500 hover:text-white",
                )}
              >
                <span className="font-mono text-[11px] text-neutral-600">0{i + 1}</span>
                <span
                  className={cn(
                    "transition-transform duration-300",
                    active === i && "translate-x-1",
                  )}
                >
                  {s.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex min-h-[400px] gap-1.5 p-1.5">
        {SERVICES.map((s, i) => (
          <Link
            key={s.slug}
            href={`/hizmetler/${s.slug}`}
            onMouseEnter={() => setActive(i)}
            tabIndex={-1}
            aria-hidden
            style={{ flexGrow: active === i ? 7 : 1 }}
            className="relative min-w-0 basis-0 overflow-hidden rounded-[10px] bg-[#111] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="480px"
              className={cn(
                "object-cover transition-[filter,transform] duration-700",
                active === i ? "scale-100 brightness-100" : "scale-110 brightness-[0.55]",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 transition-opacity duration-500",
                active === i ? "opacity-100 delay-200" : "opacity-0",
              )}
            >
              {/* Genişlik animasyonu sırasında satır kırılıp zıplamasın diye sabit genişlik */}
              <div className="w-[320px]">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                  0{i + 1} · {s.tagline}
                </p>
                <p className="mt-2 text-[28px] font-medium leading-[1.1] tracking-[-0.035em] text-white">
                  {s.title}
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-white/70">{s.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
}

export function WorkPanel() {
  return (
    <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr] gap-1.5">
      <Card className="flex flex-col justify-between p-8">
        <div>
          <Label>Son çalışmalar</Label>
          <p className="mt-4 text-[19px] leading-snug tracking-[-0.02em] text-white">
            Markalar için ürettiğimiz işlerden seçkiler.
          </p>
        </div>
        <MoreLink href="#calismalar">Tümünü gör</MoreLink>
      </Card>
      {WORKS.map((w, i) => (
        <Card key={w.title} className="p-2.5">
          <Link href="#calismalar" className="group block">
            <ImagePlaceholder
              tone={i}
              className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[0.98]"
            />
            <div className="px-2 pb-2 pt-3.5">
              <Label className="text-[10px] text-neutral-600">{w.tags}</Label>
              <p className="mt-1.5 text-[15px] leading-snug tracking-[-0.01em] text-white">
                {w.title}
              </p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export function AboutPanel() {
  return (
    <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-1.5">
      <Card className="flex flex-col justify-between gap-10 p-8">
        <div>
          <Label>Ajans</Label>
          <p className="mt-4 max-w-[340px] text-[22px] leading-[1.25] tracking-[-0.02em] text-white">
            Reklam, tasarım ve yazılımı tek çatı altında topluyoruz.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {ABOUT_LINKS.map((label) => (
            <li key={label}>
              <Link
                href="#hakkimizda"
                className="font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-neutral-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <ContactCard />
      <AvailabilityCard />
    </div>
  );
}

export function BlogPanel() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-1.5">
      <Card className="p-8">
        <Label>Kaynaklar</Label>
        <ul className="mt-6 space-y-6">
          {BLOG_CATEGORIES.map((c) => (
            <li key={c.title}>
              <Link href="#blog" className="group block">
                <span className="block text-[17px] tracking-[-0.01em] text-white transition-transform duration-300 group-hover:translate-x-1">
                  {c.title}
                </span>
                <span className="mt-1 block text-[13.5px] leading-snug text-neutral-500 transition-colors group-hover:text-neutral-300">
                  {c.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      {ARTICLES.map((title, i) => (
        <Card key={title} className="p-2.5">
          <Link href="#blog" className="group block">
            <ImagePlaceholder
              tone={i + 1}
              className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[0.98]"
            />
            <div className="px-2 pb-2 pt-3.5">
              <Label className="text-[10px] text-neutral-600">Son yazı</Label>
              <p className="mt-1.5 text-[16px] leading-snug tracking-[-0.01em] text-white">
                {title}
              </p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
