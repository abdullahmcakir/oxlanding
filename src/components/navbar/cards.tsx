import Link from "next/link";
import { cn } from "@/lib/utils";
import { PixelIcon } from "./pixel-icon";
import { InstagramIcon, LinkedinIcon, XIcon } from "./social-icons";

// Menü ve mega panel kartlarının ortak dili: #171717 çerçeve içinde #070707 kartlar.

const SOCIALS = [
  { label: "X", href: "#", icon: XIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
];

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("rounded-[16px] bg-[#070707]", className)}>{children}</div>;
}

export function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function ContactCard({ className }: { className?: string }) {
  return (
    <Card className={cn("px-7 py-8", className)}>
      <a
        href="tel:+905000000000"
        className="font-mono text-[13px] tracking-[0.04em] text-neutral-400 transition-colors hover:text-white"
      >
        +90 (500) 000 00 00
      </a>
      <a
        href="mailto:merhaba@oxdijital.com"
        className="mt-1.5 block text-[20px] tracking-[-0.02em] text-white"
      >
        merhaba@oxdijital.com
      </a>
      <ul className="mt-6 flex gap-4">
        {SOCIALS.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="text-neutral-500 transition-colors hover:text-white"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AvailabilityCard({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Card className={cn("flex flex-col justify-between gap-8 px-7 py-8", className)}>
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 gap-[5px]" aria-hidden>
          <span className="w-[3px] rounded-full bg-accent" />
          <span className="w-[3px] rounded-full bg-accent" />
          <span className="w-[3px] rounded-full bg-neutral-800" />
        </div>
        <div>
          <p className="text-[17px] tracking-[-0.01em] text-white">2 proje slotu açık</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">Kasım dönemi için</p>
        </div>
      </div>

      <Link
        href="#iletisim"
        onClick={onNavigate}
        className="group flex items-center gap-3 font-mono text-[13px] font-bold uppercase tracking-[0.06em]"
      >
        <span>
          <span className="text-neutral-400">Toplantı</span>{" "}
          <span className="text-white">ayarla</span>
        </span>
        <span className="grid size-[30px] place-items-center rounded-full bg-[#1c2a14] transition-transform duration-300 group-hover:translate-x-1">
          <PixelIcon variant="arrow" className="size-[9px]" />
        </span>
      </Link>
    </Card>
  );
}

// Gerçek görseller gelene kadar yer tutucu.
const TONES = [
  "from-[#2a2f1c] via-[#141810] to-[#0b0b0b]",
  "from-[#2b1f19] via-[#15100d] to-[#0b0b0b]",
  "from-[#1a2230] via-[#0f131a] to-[#0b0b0b]",
  "from-[#262626] via-[#141414] to-[#0b0b0b]",
];

export function ImagePlaceholder({
  tone = 0,
  className,
}: {
  tone?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[10px] bg-gradient-to-br",
        TONES[tone % TONES.length],
        className,
      )}
    >
      <span className="absolute bottom-2.5 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
        Görsel
      </span>
    </div>
  );
}
