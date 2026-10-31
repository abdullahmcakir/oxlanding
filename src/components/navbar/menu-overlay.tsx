"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { LEGAL_DOCS } from "@/components/legal/legal-data";
import { useIstanbulTime } from "@/hooks/use-istanbul-time";
import { cn } from "@/lib/utils";
import { AvailabilityCard, ContactCard } from "./cards";

// Masaüstü navbar'la aynı sayfalar (navbar.tsx ITEMS)
const MAIN_LINKS = [
  { label: "anasayfa", href: "/" },
  { label: "hizmetler", href: "/paketler#hizmetler" },
  { label: "paketler", href: "/paketler" },
  { label: "çalışmalar", href: "/calismalar" },
  { label: "hakkımızda", href: "/hakkimizda" },
  { label: "iletişim", href: "/iletisim" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

const panel: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0% round 28px)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 28px)",
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0% round 28px)",
    transition: { duration: 0.5, ease: EASE, delay: 0.1 },
  },
};

const list: Variants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const rise: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: EASE } },
  exit: { y: "110%", transition: { duration: 0.3, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const datetime = useIstanbulTime("datetime");
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 0.15 } }}
        onClick={onClose}
      />

      <motion.div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        data-lenis-prevent
        variants={panel}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-x-0 top-[86px] z-40 mx-auto max-h-[calc(100dvh-98px)] w-[min(624px,calc(100%-16px))] no-scrollbar overflow-y-auto rounded-[28px] bg-[#171717] p-1.5"
      >
        {/* Ana kart */}
        <div className="rounded-[24px] bg-[#070707] px-7 pb-8 pt-9 sm:px-10 sm:pb-9 sm:pt-10">
          <motion.div
            variants={fade}
            className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400"
          >
            <span>Menü · 2026</span>
            <span className="tabular-nums">{datetime ?? " "}</span>
          </motion.div>

          <motion.ul
            variants={list}
            className="mt-5"
            onMouseLeave={() => setHovered(null)}
          >
            {MAIN_LINKS.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <motion.div variants={rise}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(i)}
                    className={cn(
                      "block text-[clamp(28px,5.4vh,40px)] leading-[1.22] tracking-[-0.02em] transition-[color,translate] duration-300",
                      hovered === null || hovered === i
                        ? "text-white"
                        : "text-neutral-600",
                      hovered === i && "translate-x-2",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </motion.ul>

          <motion.ul variants={fade} className="mt-10 space-y-1.5">
            {LEGAL_DOCS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-[14px] font-medium tracking-[-0.01em] text-neutral-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={fade} className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
          <ContactCard className="rounded-[24px]" />
          <AvailabilityCard className="rounded-[24px]" onNavigate={onClose} />
        </motion.div>

        <motion.p
          variants={fade}
          className="py-3.5 text-center text-[11px] text-neutral-500"
        >
          © 2026 OX Dijital®
        </motion.p>
      </motion.div>
    </>
  );
}
