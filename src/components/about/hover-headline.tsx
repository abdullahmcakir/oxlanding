"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

// Referans: wandering-walrus-889793.framer.app (Figma Community hero etkileşimi).
// Anahtar kelimenin üstüne gelince kelime maviye döner (ışıltılı) ve metnin iki yanında
// o kelimeye ait öğeler yaylanarak belirir. Tüm ölçüler em: başlık puntosuyla birlikte ölçeklenir.

const KEYWORDS = ["Reklam", "tasarım", "yazılım"];

// [[n]] işareti; ardından noktalama/ek gelebilir: "[[0]]," veya "[[2]]la"
const TOKEN = /^\[\[(\d+)\]\](.*)$/;

// Metin yer tutucu. [[n]] = KEYWORDS[n]
const TEXT =
  "Fikirleri markaya, markaları büyümeye dönüştürüyoruz. [[0]], [[1]] ve [[2]]la ölçülebilir sonuçlar üretiyoruz.";

export function HoverHeadline({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={cn("relative mx-auto w-fit", className)}>
      <Decorations active={active} />
      {/* Gri renk yalnızca anahtar kelimelere ait; metnin geri kalanı her zaman koyu */}
      <p className="max-w-[16em] text-center">
        {TEXT.split(" ").map((word, wi, words) => {
          const token = TOKEN.exec(word);
          return (
            <Fragment key={wi}>
              {token ? (
                // Anahtar kelime ile eki ("yazılım" + "la") ayrı satıra düşmesin
                <span className="whitespace-nowrap">
                  <Keyword
                    label={KEYWORDS[Number(token[1])]}
                    active={active === Number(token[1])}
                    onActive={(on) => setActive(on ? Number(token[1]) : null)}
                  />
                  {token[2]}
                </span>
              ) : (
                word
              )}
              {/* Boşluk nowrap alanın dışında: satır buradan kırılabilsin */}
              {wi < words.length - 1 && " "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}

function Keyword({
  label,
  active,
  onActive,
}: {
  label: string;
  active: boolean;
  onActive: (on: boolean) => void;
}) {
  return (
    <span
      tabIndex={0}
      onMouseEnter={() => onActive(true)}
      onMouseLeave={() => onActive(false)}
      onFocus={() => onActive(true)}
      onBlur={() => onActive(false)}
      className="relative inline-block cursor-default outline-none"
    >
      <span
        className="text-[#A3A3A3] transition-opacity duration-300"
        style={{ opacity: active ? 0 : 1 }}
      >
        {label}
      </span>
      {/* Aktif hal: mavi + üstünden geçen ışıltı */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,#2F6BFF_0%,#2F6BFF_38%,#A9C6FF_50%,#2F6BFF_62%,#2F6BFF_100%)] bg-[length:200%_100%] bg-clip-text text-transparent transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          animation: active ? "shimmer 1.8s linear infinite" : "none",
        }}
      >
        {label}
      </span>
    </span>
  );
}

/* ------------------------------ Dekor öğeleri ------------------------------ */

type Item = {
  side: "left" | "right" | "top";
  x: number; // em; sol/sağ: metin kenarından dışa uzaklık, üst: merkezden yatay kayma
  y: number; // em; sol/sağ: dikey merkezden kayma, üst: üst kenardan yukarı uzaklık
  rotate: number;
  node: React.ReactNode;
};

function Decorations({ active }: { active: number | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <AnimatePresence>
        {active !== null &&
          SETS[active].map((item, i) => (
            <div key={`${active}-${i}`} className="absolute" style={position(item)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: item.rotate - 18 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: item.rotate,
                  transition: { type: "spring", stiffness: 420, damping: 22, delay: i * 0.03 },
                }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.18 } }}
              >
                {item.node}
              </motion.div>
            </div>
          ))}
      </AnimatePresence>
    </div>
  );
}

function position(item: Item): React.CSSProperties {
  if (item.side === "top") {
    return {
      left: `calc(50% + ${item.x}em)`,
      bottom: `calc(100% + ${item.y}em)`,
      transform: "translate(-50%, 50%)",
    };
  }
  return {
    [item.side === "left" ? "right" : "left"]: `calc(100% + ${item.x}em)`,
    top: `calc(50% + ${item.y}em)`,
    transform: `translate(${item.side === "left" ? "50%" : "-50%"}, -50%)`,
  };
}

/* Görsel parçalar */

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-[1.6em] place-items-center rounded-[0.32em] border border-neutral-200 bg-white text-neutral-500 shadow-[0_0.1em_0.3em_rgba(0,0,0,0.08)]">
      <Icon className="size-[0.72em]">{children}</Icon>
    </span>
  );
}

function AppTile({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <span
      className="grid size-[1.7em] place-items-center rounded-[0.42em] text-white shadow-[0_0.12em_0.35em_rgba(0,0,0,0.18)]"
      style={{ background: gradient }}
    >
      <Icon className="size-[0.8em]">{children}</Icon>
    </span>
  );
}

function BarCards({ a, b }: { a: string; b: string }) {
  const card = (dot: string, bar: string) => (
    <span className="flex h-[0.95em] w-[3.1em] items-center gap-[0.22em] rounded-[0.22em] border border-neutral-200 bg-white px-[0.28em] shadow-[0_0.1em_0.3em_rgba(0,0,0,0.08)]">
      <span className="size-[0.3em] shrink-0 rounded-full" style={{ background: dot }} />
      <span className="h-[0.2em] w-[1.7em] rounded-full" style={{ background: bar }} />
    </span>
  );
  return (
    <span className="relative block h-[1.55em] w-[3.5em]">
      <span className="absolute left-0 top-0">{card(a, a)}</span>
      <span className="absolute left-[0.38em] top-[0.55em]">{card(b, b)}</span>
    </span>
  );
}

function PlainIcon({ children }: { children: React.ReactNode }) {
  return <Icon className="size-[0.85em] text-neutral-400">{children}</Icon>;
}

function Icon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

const I = {
  megaphone: (
    <>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  chart: (
    <>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </>
  ),
  click: (
    <>
      <path d="M9 9l5 12 1.8-5.2L21 14Z" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="m5.1 8-2.9-.8" />
      <path d="M14 4.1 12 6" />
      <path d="m6 12-1.9 2" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  palette: (
    <>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.5-2 3-3.5 3H16a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10.5" cy="7" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 10 5-10 5L2 7z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </>
  ),
  shapes: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <circle cx="17" cy="17" r="4" />
      <path d="M17 3l4 7h-8z" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  type: (
    <>
      <path d="M4 7V5h16v2" />
      <path d="M12 5v14" />
      <path d="M9 19h6" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </>
  ),
  braces: (
    <>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </>
  ),
  terminal: (
    <>
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
    </>
  ),
  git: (
    <>
      <path d="M6 3v12" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  cpu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
    </>
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
};

// Kelime başına öğe setleri (sıra: KEYWORDS)
const SETS: Item[][] = [
  // Reklam: beyaz kartlarda ikonlar + çubuk kartlar (referanstaki "libraries")
  [
    { side: "left", x: 2.3, y: -1.15, rotate: -12, node: <IconTile>{I.megaphone}</IconTile> },
    { side: "left", x: 1.05, y: -0.8, rotate: 10, node: <IconTile>{I.target}</IconTile> },
    { side: "left", x: 1.5, y: 1.0, rotate: 4, node: <BarCards a="#F9A8D4" b="#9333EA" /> },
    { side: "right", x: 1.05, y: -0.95, rotate: -9, node: <IconTile>{I.chart}</IconTile> },
    { side: "right", x: 2.35, y: -1.25, rotate: 9, node: <IconTile>{I.click}</IconTile> },
    { side: "right", x: 1.5, y: 1.05, rotate: -3, node: <BarCards a="#C5F36A" b="#2F6BFF" /> },
  ],
  // Tasarım: renkli uygulama ikonları (referanstaki "plugins")
  [
    { side: "left", x: 2.5, y: -1.1, rotate: -10, node: <AppTile gradient="linear-gradient(135deg,#FF9A8B,#FF6A88)">{I.pen}</AppTile> },
    { side: "left", x: 1.05, y: -1.35, rotate: 12, node: <AppTile gradient="conic-gradient(from 200deg,#FF5F6D,#FFC371,#47E5BC,#5B8CFF,#B06AB3,#FF5F6D)">{I.palette}</AppTile> },
    { side: "left", x: 1.7, y: 0.95, rotate: -6, node: <AppTile gradient="linear-gradient(135deg,#F472B6,#8B5CF6)">{I.layers}</AppTile> },
    { side: "right", x: 1.05, y: -1.35, rotate: -10, node: <AppTile gradient="linear-gradient(135deg,#3B82F6,#1D4ED8)">{I.shapes}</AppTile> },
    { side: "right", x: 2.55, y: -0.95, rotate: 12, node: <AppTile gradient="linear-gradient(135deg,#A78BFA,#7C3AED)">{I.grid}</AppTile> },
    { side: "right", x: 1.55, y: 1.0, rotate: 6, node: <AppTile gradient="linear-gradient(135deg,#FDE047,#22C55E 60%,#3B82F6)">{I.type}</AppTile> },
  ],
  // Yazılım: arka plansız çizgi ikonlar, üst taraf dahil dağınık (referanstaki "icon-sets")
  [
    { side: "left", x: 2.6, y: -1.4, rotate: 0, node: <PlainIcon>{I.code}</PlainIcon> },
    { side: "left", x: 0.9, y: 0.15, rotate: -8, node: <PlainIcon>{I.terminal}</PlainIcon> },
    { side: "left", x: 2.1, y: 1.6, rotate: 0, node: <PlainIcon>{I.braces}</PlainIcon> },
    { side: "right", x: 1.0, y: -1.35, rotate: 8, node: <PlainIcon>{I.git}</PlainIcon> },
    { side: "right", x: 2.6, y: 0.2, rotate: 0, node: <PlainIcon>{I.database}</PlainIcon> },
    { side: "right", x: 1.3, y: 1.65, rotate: -6, node: <PlainIcon>{I.cpu}</PlainIcon> },
    { side: "top", x: -4.2, y: 0.55, rotate: 0, node: <PlainIcon>{I.globe}</PlainIcon> },
    { side: "top", x: 0, y: 0.75, rotate: 0, node: <PlainIcon>{I.click}</PlainIcon> },
    { side: "top", x: 4.2, y: 0.5, rotate: 8, node: <PlainIcon>{I.zap}</PlainIcon> },
  ],
];
