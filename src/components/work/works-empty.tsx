import { PixelIcon } from "@/components/navbar/pixel-icon";
import { whatsappUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

// Yayında hiç çalışma yokken (work-data.ts LIVE_WORKS boş) ana sayfadaki çalışmalar bölümünde ve
// /calismalar sayfalarında kartların yerine görünür. Buton dili SSS'teki "Bize sor" ile aynı.

export const WORKS_EMPTY_TEXT =
  "Projelerimizi burada paylaşmaya hazırlanıyoruz. Bu sırada ne yapabileceğimizi konuşmak için görüşme ayarlayabilirsin.";

export function WorksEmpty({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-8 rounded-[28px] bg-[#F5F5F5] p-7 md:flex-row md:items-center md:justify-between md:p-10",
        className,
      )}
    >
      <div className="max-w-[640px]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Çalışmalar</p>
        <p className="mt-4 text-[clamp(20px,1.6vw,26px)] font-medium leading-[1.3] tracking-[-0.025em] text-[#111]">
          {WORKS_EMPTY_TEXT}
        </p>
      </div>
      <a
        href={whatsappUrl("Merhaba, ücretsiz ön görüşme ayarlamak istiyorum.")}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex shrink-0 items-center gap-1.5 outline-none"
      >
        <span className="flex h-12 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white group-focus-visible:ring-2 group-focus-visible:ring-accent/60">
          WhatsApp&apos;tan yaz
        </span>
        <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
          <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-accent-ink" />
        </span>
      </a>
    </div>
  );
}
