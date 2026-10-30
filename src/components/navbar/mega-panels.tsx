"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/feed/feed-badge";
import { categoryOf, LATEST_ITEMS, type FeedItem } from "@/components/feed/feed-data";
import { SERVICES } from "@/components/services/services-data";
import { cn } from "@/lib/utils";
import { PixelIcon } from "./pixel-icon";
import { Card, Label } from "./cards";

// Paneller sitedeki gerçek sayfalara bağlı; içerikleri o sayfaların verisinden gelir.

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

// /calismalar akışının en yeni 3 paylaşımı (en az biri çalışma).
// Veri sayfanın kendisinden (feed-data) geliyor; akış güncellenince panel de güncellenir.
// Rozetler sayfadakiyle aynı: çalışma yeşil, blog beyaz.
export function WorkPanel() {
  return (
    <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr] gap-1.5">
      <Card className="flex flex-col justify-between p-8">
        <div>
          <Label>Çalışmalar & yazılar</Label>
          <p className="mt-4 text-[19px] leading-snug tracking-[-0.02em] text-white">
            İşlerimiz ve yazılarımız tek akışta. En yenileri burada.
          </p>
        </div>
        <MoreLink href="/calismalar">Tümünü gör</MoreLink>
      </Card>

      {LATEST_ITEMS.map((item) => (
        <FeedPreview key={item.title} item={item} />
      ))}
    </div>
  );
}

/** Çalışmalar panelindeki önizleme kartı: üstte görsel alanı (rozetiyle), altında küçük etiket + başlık. */
function FeedPreview({ item }: { item: FeedItem }) {
  // Görselsiz yazıda başlık zaten kutunun içinde; altta tekrarlanmasın
  const kicker = item.type === "post" ? item.meta : item.tag;
  const title = item.type === "post" ? "Devamını oku" : item.title;

  return (
    <Card className="p-2.5">
      <Link href={item.href ?? "/calismalar"} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#111]">
          {item.type === "image" ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="320px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            // Görselsiz yazı: sayfadaki gri blog kartının küçüğü
            <div className="absolute inset-0 grid place-items-center bg-[#F5F5F5] px-6 pt-8 text-center">
              <p className="text-[17px] font-medium leading-[1.2] tracking-[-0.025em] text-[#111]">{item.title}</p>
            </div>
          )}
          <Badge kind={categoryOf(item) === "calisma" ? "calisma" : "blog"} className="absolute left-2.5 top-2.5" />
        </div>
        <div className="px-2 pb-2 pt-3.5">
          <Label className="truncate text-[10px] text-neutral-600">{kicker}</Label>
          <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug tracking-[-0.01em] text-white">{title}</p>
        </div>
      </Link>
    </Card>
  );
}
