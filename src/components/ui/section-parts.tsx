import Link from "next/link";
import { cn } from "@/lib/utils";

// Hizmetler / Referanslar gibi kaydırmalı bölümlerin ortak başlık ve gezinme parçaları.

/** Solunda yeşil vurgu çizgisi olan iki tonlu başlık (mintlify düzeni). */
export function SplitHeading({ strong, soft }: { strong: string; soft: string }) {
  return (
    <div className="relative pl-5 md:pl-7">
      <span className="absolute left-0 top-[0.2em] h-[1.1em] w-[3px] rounded-full bg-[#AFD41C] text-[clamp(32px,3.2vw,60px)]" />
      <h2 className="max-w-[17em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.12] tracking-[-0.045em] text-[#111]">
        {strong} <span className="text-[#A3A3A3]">{soft}</span>
      </h2>
    </div>
  );
}

/** Geri / ileri butonları + sağdaki "Tümü" butonu. */
export function CarouselNav({
  edges,
  onScroll,
  allHref,
  allLabel,
}: {
  edges: { start: boolean; end: boolean };
  onScroll: (dir: 1 | -1) => void;
  allHref: string;
  allLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <NavButton label="Önceki" dir={-1} disabled={edges.start} onClick={() => onScroll(-1)} />
      <NavButton label="Sonraki" dir={1} disabled={edges.end} onClick={() => onScroll(1)} />
      <Link
        href={allHref}
        className="group ml-2 hidden h-12 items-center gap-3 rounded-full bg-[#111] py-1.5 pl-5 pr-1.5 text-[14px] font-semibold tracking-[-0.02em] text-white sm:inline-flex"
      >
        {allLabel}
        <span className="grid size-9 place-items-center rounded-full bg-accent text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
          <Chevron />
        </span>
      </Link>
    </div>
  );
}

function NavButton({
  label,
  dir,
  disabled,
  onClick,
}: {
  label: string;
  dir: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-12 place-items-center rounded-full transition-[opacity,transform] duration-300 enabled:hover:scale-105 disabled:opacity-30",
        dir === 1 ? "bg-accent text-black" : "bg-[#111] text-white",
      )}
    >
      <Chevron className={cn(dir === -1 && "rotate-180")} />
    </button>
  );
}

export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      aria-hidden
    >
      <path d="m5.5 2 6 6-6 6" />
    </svg>
  );
}

/** Kayan şeridin ortak sınıfları: içerik hizasından başlar, sağda ekran kenarına taşar. */
export const TRACK_CLASS =
  "mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:scroll-px-[4.5vw] md:px-[4.5vw] [&::-webkit-scrollbar]:hidden";
