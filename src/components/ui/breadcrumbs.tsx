import Link from "next/link";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Görünür sayfa yolu (Ana sayfa / Blog / Yazı). Aynı liste BreadcrumbList şemasına da verilir (lib/seo.ts).
// Son öğe bulunulan sayfa: bağlantı değil, aria-current ile işaretli.

export function Breadcrumbs({ items, tone = "light", className }: { items: Crumb[]; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Sayfa yolu" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em]",
          dark ? "text-white/45" : "text-neutral-400",
        )}
      >
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? "text-white/80" : "text-neutral-600"}>
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-[#111]")}>
                    {c.label}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
