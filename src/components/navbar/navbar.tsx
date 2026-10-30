"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { useMeasuredHeight } from "@/hooks/use-measured-height";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ServicesPanel, WorkPanel } from "./mega-panels";
import { MenuOverlay } from "./menu-overlay";
import { PixelIcon } from "./pixel-icon";

// Logo dilinin şekli (96×18): üstte bara içbükey köşelerle (r=8) bağlanır, altta yuvarlanır (r=10)
const TAB_PATH = "M0 0H96Q88 0 88 8V8Q88 18 78 18H18Q8 18 8 8V8Q8 0 0 0Z";

// Panel'i olmayan öğeler (Paketler, Hakkımızda, İletişim) düz link: üstüne gelince açık panel kapanır ve
// yazının yanında küçük bir piksel ok belirir (panel açanlarda vurgu, gidenlerde ok: fark hover'da anlaşılır).
// Hakkımızda paneli kaldırıldı: sayfanın bölümlerine kısayol vermekten öte iş görmüyordu.
// Hizmetler'in ayrı bir liste sayfası yok: tüm hizmetler paketleriyle /paketler'de.
// Blog ayrı öğe değil: Çalışmalar paneli yazıları da gösterir, akışın /blog filtresine sekmeden geçilir.
const ITEMS = [
  { key: "hizmetler", label: "Hizmetler", href: "/paketler#hizmetler", Panel: ServicesPanel },
  { key: "paketler", label: "Paketler", href: "/paketler" },
  { key: "calismalar", label: "Çalışmalar", href: "/calismalar", Panel: WorkPanel },
  { key: "hakkimizda", label: "Hakkımızda", href: "/hakkimizda" },
  { key: "iletisim", label: "İletişim", href: "/iletisim" },
] as const;

type Item = (typeof ITEMS)[number];
type PanelItem = Extract<Item, { Panel: unknown }>;
type Key = PanelItem["key"];

const hasPanel = (item: Item): item is PanelItem => "Panel" in item;

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
  // Logo dili yalnız bar sade hâldeyken görünür
  const compact = open || mobileOpen;
  const ShownPanel = ITEMS.filter(hasPanel).find((i) => i.key === shown)!.Panel;

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
        <div className="relative mx-auto max-w-[1216px]">
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
            }}
            className={cn(
              // Kapalıyken ince, yarı saydam cam bar; panel açılınca okunurluk için koyulaşır ve köşeleri büyür
              "overflow-hidden backdrop-blur-[15px] transition-[background-color,border-radius] duration-500",
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
                        onMouseEnter={() => (hasPanel(item) ? openPanel(item.key) : scheduleClose())}
                        onFocus={() => (hasPanel(item) ? openPanel(item.key) : setActive(null))}
                        onClick={() => setActive(null)}
                        aria-expanded={hasPanel(item) ? active === item.key : undefined}
                        className={cn(
                          "group/nav relative block rounded-[6px] px-2 py-1 text-[14px] tracking-[-0.015em] text-white transition-opacity duration-300",
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
                        {!hasPanel(item) && (
                          <PixelIcon
                            variant="arrow"
                            className="pointer-events-none absolute right-[-3px] top-1/2 size-[6px] -translate-x-1 -translate-y-1/2 opacity-0 transition-[opacity,translate] duration-300 group-hover/nav:translate-x-0 group-hover/nav:opacity-100 group-focus-visible/nav:translate-x-0 group-focus-visible/nav:opacity-100"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Logo barın dışında (aşağıdaki dil); burada yalnız ortadaki yeri tutar */}
              <span aria-hidden className="w-[96px]" />

              <div className="flex items-center justify-end gap-4" onMouseEnter={scheduleClose}>
                {/* Ana hedef: OX Panel'de ücretsiz görüşme (panel adresi tanımlı değilse iletişim sayfası) */}
                <a
                  href={talepUrl()}
                  className="group hidden h-8 items-center gap-2 rounded-full bg-accent px-3.5 text-[14px] font-medium tracking-[-0.01em] text-black transition-[filter] hover:brightness-110 md:inline-flex"
                >
                  Ücretsiz görüşme
                  <PixelIcon
                    variant="arrow"
                    className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                    cellClassName="fill-black"
                  />
                </a>
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

          {/* Logo dili: bar ince kalsın diye logo büyürken barın ortasından aşağı sarkan küçük cam çıkıntıya taşar.
              Panel ya da mobil menü açılınca dil içeri çekilir, logo bara sığacak boya küçülür. */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ scaleY: compact ? 0 : 1, opacity: compact ? 0 : 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ clipPath: `path("${TAB_PATH}")` }}
            className="pointer-events-none absolute left-1/2 top-14 h-[18px] w-[96px] -translate-x-1/2 origin-top bg-black/35 backdrop-blur-[15px]"
          />
          <motion.div
            initial={false}
            animate={{ scale: compact ? 0.6 : 1, y: compact ? -9 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute left-1/2 top-[7px] -ml-[30px]"
          >
            <Link
              href="/"
              aria-label="OX Dijital anasayfa"
              onMouseEnter={scheduleClose}
              className="block text-white transition-transform duration-300 hover:-rotate-6"
            >
              <Logo className="size-[60px]" />
            </Link>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MenuOverlay onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
