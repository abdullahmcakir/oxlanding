"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { useMeasuredHeight } from "@/hooks/use-measured-height";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { AboutPanel, BlogPanel, ServicesPanel, WorkPanel } from "./mega-panels";
import { MenuOverlay } from "./menu-overlay";
import { PixelIcon } from "./pixel-icon";

const ITEMS = [
  { key: "hizmetler", label: "Hizmetler", href: "#hizmetler", Panel: ServicesPanel },
  { key: "calismalar", label: "Çalışmalar", href: "#calismalar", Panel: WorkPanel },
  { key: "hakkimizda", label: "Hakkımızda", href: "#hakkimizda", Panel: AboutPanel },
  { key: "blog", label: "Blog", href: "#blog", Panel: BlogPanel },
] as const;

type Key = (typeof ITEMS)[number]["key"];

const EASE = [0.76, 0, 0.24, 1] as const;
const CLOSE_DELAY = 140;

// Paneller arası geçişte içerik, gidilen yöne doğru kayar.
const swap: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28, filter: "blur(4px)" }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -28,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

export function Navbar() {
  const [active, setActive] = useState<Key | null>(null);
  // Kapanırken içerik boşalmasın diye son açılan panel tutulur.
  const [shown, setShown] = useState<Key>("hizmetler");
  const [dir, setDir] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [contentRef, contentHeight] = useMeasuredHeight<HTMLDivElement>();
  const lenis = useLenis();

  const open = active !== null;
  const ShownPanel = ITEMS.find((i) => i.key === shown)!.Panel;

  const openPanel = (key: Key) => {
    clearTimeout(closeTimer.current);
    if (active) {
      const from = ITEMS.findIndex((i) => i.key === active);
      const to = ITEMS.findIndex((i) => i.key === key);
      setDir(Math.sign(to - from));
    } else {
      setDir(0);
    }
    setShown(key);
    setActive(key);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), CLOSE_DELAY);
  };

  const cancelClose = () => clearTimeout(closeTimer.current);

  // Panel açıkken sayfa kaydırılırsa panel kapanır.
  // (useLenis(callback) kullanılmıyor: callback'i abone olurken hemen çağırıyor, panel açılır açılmaz kapanıyordu.)
  useEffect(() => {
    if (!open || !lenis) return;
    const close = () => setActive(null);
    return lenis.on("scroll", close);
  }, [open, lenis]);

  useEffect(() => {
    if (mobileOpen) lenis?.stop();
    else lenis?.start();
  }, [mobileOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setActive(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-4 z-50 px-4 md:px-8">
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
          }}
          className={cn(
            // Kapalıyken ince, yarı saydam cam bar; panel açılınca okunurluk için koyulaşır ve köşeleri büyür
            "mx-auto max-w-[1216px] overflow-hidden backdrop-blur-[15px] transition-[background-color,border-radius] duration-500",
            open ? "rounded-[20px] bg-[#141414]/95" : "rounded-[12px] bg-black/35",
          )}
        >
          <nav className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-3 md:px-6">
            <div>
              <ul className="hidden items-center gap-2 md:flex">
                {ITEMS.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => openPanel(item.key)}
                      onFocus={() => openPanel(item.key)}
                      onClick={() => setActive(null)}
                      aria-expanded={active === item.key}
                      className={cn(
                        "relative block rounded-[6px] px-2 py-1 text-[14px] tracking-[-0.015em] text-white transition-opacity duration-300",
                        active === null || active === item.key ? "opacity-100" : "opacity-60",
                      )}
                    >
                      {active === item.key && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-[6px] bg-white/10"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              aria-label="OX Dijital anasayfa"
              onMouseEnter={scheduleClose}
              className="text-white transition-transform duration-300 hover:-rotate-6"
            >
              <Logo className="size-9" />
            </Link>

            <div className="flex items-center justify-end gap-4" onMouseEnter={scheduleClose}>
              <Link
                href="#iletisim"
                className="group hidden h-8 items-center gap-2 rounded-full bg-accent px-3.5 text-[14px] font-medium tracking-[-0.01em] text-black transition-[filter] hover:brightness-110 md:inline-flex"
              >
                Toplantı Ayarla
                <PixelIcon
                  variant="arrow"
                  className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                  cellClassName="fill-black"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="site-menu"
                className="inline-flex h-8 w-[88px] items-center justify-center gap-2 rounded-full bg-white/10 text-[14px] tracking-[-0.01em] text-white md:hidden"
              >
                <PixelIcon variant={mobileOpen ? "close" : "menu"} />
                {mobileOpen ? "Kapat" : "Menü"}
              </button>
            </div>
          </nav>

          {/* Mega panel: bar'ın kendisi aşağı uzar, içerik bu gövdenin parçası olarak açılır */}
          <motion.div
            className="hidden md:block"
            initial={false}
            animate={{ height: open ? contentHeight : 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div ref={contentRef} className="relative px-1.5 pb-1.5">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={shown}
                  custom={dir}
                  variants={swap}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <ShownPanel />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MenuOverlay onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
