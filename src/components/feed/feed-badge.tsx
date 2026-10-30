import { PixelIcon, type PixelIconVariant } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import { FILTER_ICON } from "./feed-data";

// Tür rozetleri: kaydırırken kartın ne olduğu rengi ve piksel ikonundan bir bakışta anlaşılsın.
// En çok göze çarpan ayrım çalışma (yeşil) ve blog (beyaz); ikonlar filtre sekmeleriyle aynı.
// /calismalar ızgarası ve navbar'ın Çalışmalar paneli birlikte kullanır.

export type BadgeKind = "calisma" | "blog" | "yorum" | "musteri" | "hizmet";

const BADGES: Record<BadgeKind, { label: string; icon: PixelIconVariant; className: string; iconClass: string }> = {
  calisma: { label: "Çalışma", icon: FILTER_ICON.calisma, className: "bg-accent text-black", iconClass: "fill-black" },
  blog: { label: "Blog", icon: FILTER_ICON.blog, className: "bg-white text-[#111] ring-1 ring-black/10", iconClass: "fill-[#111]" },
  yorum: { label: "Yorumlar", icon: "quote", className: "bg-white/10 text-white", iconClass: "fill-accent" },
  musteri: { label: "Müşteriler", icon: "diamond", className: "bg-black text-white", iconClass: "fill-accent" },
  hizmet: { label: "Hizmetler", icon: "plus", className: "bg-black text-white", iconClass: "fill-accent" },
};

export function Badge({ kind, label, className }: { kind: BadgeKind; label?: string; className?: string }) {
  const b = BADGES[kind];
  return (
    <span
      className={cn(
        "flex h-8 w-fit items-center gap-2 rounded-full pl-3 pr-3.5 text-[14px] font-medium tracking-[-0.01em]",
        b.className,
        className,
      )}
    >
      <PixelIcon variant={b.icon} className="size-[10px]" cellClassName={b.iconClass} />
      {label ?? b.label}
    </span>
  );
}
