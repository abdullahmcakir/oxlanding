import Image from "next/image";
import { cn } from "@/lib/utils";

// Gerçek OX logosu (beyaz, saydam PNG — Framer sitesinden). Yalnızca koyu zeminlerde kullanılır.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("relative block size-10", className)} aria-hidden>
      <Image src="/images/logo.png" alt="" fill sizes="96px" className="object-contain" />
    </span>
  );
}
