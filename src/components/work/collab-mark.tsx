import Image from "next/image";
import { Logo } from "@/components/navbar/logo";
import { cn } from "@/lib/utils";
import type { Work } from "./work-data";

// İş birliği imzası: "OX logosu × müşteri logosu". Kenar çubuğunda büyük, yorum kartında küçük.
// Müşteri logosu yoksa adı yazı olarak basılır.

const SIZE = {
  lg: { logo: "size-16", client: "size-16", x: "text-[28px]", text: "text-[26px]" },
  sm: { logo: "size-8", client: "size-8", x: "text-[15px]", text: "text-[15px]" },
};

export function CollabMark({ work, size = "lg", className }: { work: Work; size?: keyof typeof SIZE; className?: string }) {
  const s = SIZE[size];
  return (
    <span className={cn("flex items-center", size === "lg" ? "gap-5" : "gap-3", className)}>
      <Logo className={s.logo} />
      <span aria-hidden className={cn("font-light text-white/40", s.x)}>
        ×
      </span>
      {work.client.logo ? (
        <span className={cn("relative block", s.client)}>
          <Image src={work.client.logo} alt={work.title} fill sizes="96px" className="object-contain" />
        </span>
      ) : (
        <span className={cn("font-semibold leading-none tracking-[-0.04em] text-white", s.text)}>{work.title}</span>
      )}
    </span>
  );
}
