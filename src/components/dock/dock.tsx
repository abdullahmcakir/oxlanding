"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { CookieBadge } from "@/components/cookie/cookie-ask";
import { useConsentState } from "@/components/cookie/cookie-consent";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { useMeasuredHeight } from "@/hooks/use-measured-height";
import { openAssistant } from "@/lib/assistant";
import { cn } from "@/lib/utils";
import {
  DOCK_MESSAGES,
  GLASS,
  type DockAction,
  type DockKey,
  type DockMessage,
  type DockPresetValue,
} from "./dock-variants";
import { ToolPanel, type Face } from "./dock-tools";
import { isGlyph, MiniGlyph, PixelMatrix, type Glyph } from "./pixel-matrix";

// "OX Piksel": sağ altta sabit duran, kaydırdıkça bulunulan bölüme göre konuşan küçük piksel karakter.
// Varsayılan hâli yalnızca piksel yüz + tek cümle; eylemler hover / dokunmayla açılır.
// Sakin davranır:
// - Ekranın %60 çizgisindeki bölümün `data-dock` işaretine bakar; işaretsizse sayfanın varsayılanı görünür.
// - Yeni bölüm DWELL boyunca yerinde kalmadan ve mevcut mesaj MIN_SHOW kadar gösterilmeden değişmez.
// - Hero'da (ilk yarım ekran), footer'da ve `data-dock="hide"` bölümlerde (iletişim) görünmez.
// - Ziyaretçi küçültebilir (yalnız piksel yüz kalır); tercih sekme boyunca hatırlanır.
// - Kendiliğinden küçülmez; ilk görünüşte küçült butonunu gösteren bir ipucu balonu çıkar (ziyarette bir kez).
// - Çerez sorusu açıkken (cookie-ask.tsx) aynı köşeyi o kullanır, asistan çekilir. Cevap verilmediyse
//   köşede küçük bir kurabiye durur; tıklayınca soru yeniden açılır.

const DWELL = 700;
// Liste modunda öğe değişimi: öğe bu kadar çizgide kalmadan öne çıkmaz (hızlı kaydırırken aradakiler atlanır)
const LIST_DWELL = 450;
const MIN_SHOW = 3000;
const PROBE = 0.6;
const MIN_KEY = "ox-dock-min";
// Küçült ipucu: ziyarette bir kez, asistan ilk göründükten biraz sonra
const MIN_TIP_KEY = "ox-dock-min-tip";
const MIN_TIP_DELAY = 1200;
const MIN_TIP_SHOW = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

// "liste": `data-dock="liste"` bölümünde asistan hızlı geçiş aracına döner. Bölümün içindeki
// `data-dock-item` (id + data-title) öğeleri arasında ◀ ▶ ile gezilir; hover'da hepsi çip olarak açılır.
type Shown = DockKey | "preset" | "liste";

const isMessage = (key: Shown): key is DockKey => key in DOCK_MESSAGES;

/** Blog yazısında okuma durumu (yalnız article preset'inde) */
type Reading = { pct: number; index: number; title: string; nextId?: string };

/** Liste modunda öğeler (isteğe bağlı piksel ikonuyla: data-glyph) ve ekranın %60 çizgisindeki öğe */
type ListNav = { label: string; items: { id: string; title: string; glyph?: Glyph }[]; index: number };

const PresetContext = createContext<(preset: DockPresetValue | null) => void>(() => {});

/** Kök layout'ta: sayfaları sarar, asistanı sayfanın üstüne basar. Sayfa değişince asistan sıfırlanır. */
export function DockProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPreset] = useState<DockPresetValue | null>(null);
  const pathname = usePathname();

  return (
    <PresetContext.Provider value={setPreset}>
      {children}
      <Dock key={pathname} preset={preset} />
    </PresetContext.Provider>
  );
}

/** Sayfaya özel varsayılan mesaj (ör. çalışma sayfasında önceki / sonraki). Sayfada bir kez basılır. */
export function DockPreset({ preset }: { preset: DockPresetValue }) {
  const setPreset = useContext(PresetContext);
  const serialized = JSON.stringify(preset);

  useEffect(() => {
    setPreset(JSON.parse(serialized));
    return () => setPreset(null);
  }, [serialized, setPreset]);

  return null;
}

function readMinimized() {
  try {
    return typeof window !== "undefined" && sessionStorage.getItem(MIN_KEY) === "1";
  } catch {
    return false;
  }
}

function Dock({ preset }: { preset: DockPresetValue | null }) {
  const [shown, setShown] = useState<Shown>("iletisim");
  const [minTip, setMinTip] = useState(false);
  const [visible, setVisible] = useState(false);
  // İlk render'da görünmez olduğu için sunucu/istemci farkı ekrana yansımaz
  const [minimized, setMinimized] = useState(readMinimized);
  const [reading, setReading] = useState<Reading | null>(null);
  const [list, setList] = useState<ListNav | null>(null);
  const cookie = useConsentState();
  const memo = useRef({ shown: "iletisim" as Shown, pending: null as Shown | null, since: 0, lastSwitch: 0 });

  useEffect(() => {
    const m = memo.current;
    const base: Shown = preset ? "preset" : "iletisim";
    m.lastSwitch = 0; // varsayılan değişti: ilk karar beklemeden uygulanır
    let timer: ReturnType<typeof setTimeout> | undefined;
    let listTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    // Liste: gösterilen öğe ve çizgiye yeni gelen aday
    let listCount = -1;
    let listIndex = -1;
    let listPending: number | null = null;
    let listSince = 0;

    const read = () => {
      const vh = window.innerHeight;
      const probe = vh * PROBE;
      let key: Shown = base;
      let hide = false;
      // İç içe işaretlerde içteki kazanır (belge sırasında sonra gelir); ör. /paketler sarmalayıcısı içindeki liste
      for (const el of document.querySelectorAll<HTMLElement>("[data-dock]")) {
        const r = el.getBoundingClientRect();
        if (r.top > probe || r.bottom < probe) continue;
        const k = el.dataset.dock;
        if (k === "hide") hide = true;
        else if (k === "liste") {
          key = "liste";
          readList(el, probe);
        } else if (k && k in DOCK_MESSAGES) key = k as DockKey;
      }
      const footer = document.querySelector("footer");
      const atFooter = footer ? footer.getBoundingClientRect().top < vh - 40 : false;
      // Çalışma sayfalarında gezinme taşıdığı için hemen görünür
      const pastHero = preset?.kind === "work" || window.scrollY > vh * 0.5;
      return { key, show: pastHero && !hide && !atFooter };
    };

    // Liste bölümü: öğeler ve çizgiyi son geçen öğe. Öğe listesi ilk okunduğunda hemen, sonra sıra değişimi
    // LIST_DWELL beklemesiyle güncellenir (her öğede anında değişince asistan kaydırırken titriyordu).
    const readList = (section: HTMLElement, probe: number) => {
      const els = [...section.querySelectorAll<HTMLElement>("[data-dock-item]")];
      let index = 0;
      els.forEach((e, i) => {
        if (e.getBoundingClientRect().top <= probe) index = i;
      });
      const apply = (i: number) => {
        listIndex = i;
        listPending = null;
        setList({
          label: section.dataset.dockLabel ?? "",
          items: els.map((e) => ({
            id: e.id,
            title: e.dataset.title ?? "",
            glyph: isGlyph(e.dataset.glyph) ? e.dataset.glyph : undefined,
          })),
          index: i,
        });
      };

      if (els.length !== listCount) {
        listCount = els.length;
        return apply(index);
      }
      if (index === listIndex) {
        listPending = null;
        clearTimeout(listTimer);
        return;
      }
      const now = performance.now();
      if (listPending !== index) {
        listPending = index;
        listSince = now;
      }
      const wait = LIST_DWELL - (now - listSince);
      clearTimeout(listTimer);
      if (wait <= 0) apply(index);
      else listTimer = setTimeout(onScroll, wait + 16);
    };

    // Blog yazısı: ilerleme = yazının ne kadarı %60 çizgisini geçti; bölüm = çizgiyi son geçen bölüm
    const readArticle = () => {
      const article = document.querySelector<HTMLElement>("[data-article]");
      if (!article) return;
      const probe = window.innerHeight * PROBE;
      const r = article.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (probe - r.top) / r.height));
      const sections = [...article.querySelectorAll<HTMLElement>("[data-article-section]")];
      let index = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= probe) index = i;
      });
      const next: Reading = {
        pct: Math.round(pct * 100) / 100,
        index,
        title: sections[index]?.dataset.title ?? "",
        nextId: sections[index + 1]?.id,
      };
      setReading((prev) =>
        prev && prev.pct === next.pct && prev.index === next.index ? prev : next,
      );
    };

    const commit = (key: Shown) => {
      m.shown = key;
      m.pending = null;
      m.lastSwitch = performance.now();
      setShown(key);
    };

    const decide = () => {
      clearTimeout(timer);
      if (preset?.kind === "article") readArticle();
      const { key, show } = read();
      setVisible(show);
      if (key === m.shown) {
        m.pending = null;
        return;
      }
      // Görünmüyorken ya da ilk kararda beklemeye gerek yok: değişimi kimse görmüyor
      if (!show || m.lastSwitch === 0) return commit(key);

      const now = performance.now();
      if (m.pending !== key) {
        m.pending = key;
        m.since = now;
      }
      const wait = Math.max(DWELL - (now - m.since), MIN_SHOW - (now - m.lastSwitch));
      if (wait <= 0) commit(key);
      else timer = setTimeout(decide, wait + 16);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(decide);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(timer);
      clearTimeout(listTimer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [preset]);

  // Asistan ilk göründüğünde küçültülebildiğini söyler. "Görüldü" işareti balon açılınca konur.
  // Çerez kararı bekliyorsa önce onun rozeti konuşur (iki balon üst üste binmesin); karar verilince sıra buna gelir.
  const cookiePending = cookie.ready && cookie.consent === null;
  useEffect(() => {
    if (!visible || minimized || cookiePending) return;
    try {
      if (sessionStorage.getItem(MIN_TIP_KEY) === "1") return;
    } catch {}
    const show = setTimeout(() => {
      setMinTip(true);
      try {
        sessionStorage.setItem(MIN_TIP_KEY, "1");
      } catch {}
    }, MIN_TIP_DELAY);
    const hide = setTimeout(() => setMinTip(false), MIN_TIP_DELAY + MIN_TIP_SHOW);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [visible, minimized, cookiePending]);

  const setMin = (value: boolean) => {
    setMinimized(value);
    try {
      sessionStorage.setItem(MIN_KEY, value ? "1" : "0");
    } catch {}
  };

  const isPreset = shown === "preset" && preset !== null;
  const done = preset?.kind === "article" && (reading?.pct ?? 0) >= 0.98;
  // Yazı bitince yüz gülümser
  const glyph: Glyph = isPreset
    ? preset.kind === "work"
      ? "arrow"
      : done
        ? "smile"
        : "lines"
    : shown === "liste"
      ? // Listede yüz, bakılan öğenin ikonuna toplanır (ör. SEO'da büyüteç)
        (list?.items[list.index]?.glyph ?? "diamond")
      : isMessage(shown)
        ? DOCK_MESSAGES[shown].glyph
        : "smile";
  const fill = isPreset && preset.kind === "article" && !done ? (reading?.pct ?? 0) : undefined;

  return (
    <AnimatePresence>
      {visible && !cookie.asking && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.5, ease: EASE }}
          // Navbar menüsünün karartması (z-40) açıldığında asistan arkada kalır
          className="fixed bottom-3 right-3 z-30 origin-bottom-right md:bottom-5 md:right-5"
        >
          {cookiePending && <CookieBadge />}
          <AnimatePresence>
            {minTip && !minimized && (
              <motion.span
                role="tooltip"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="pointer-events-none absolute bottom-full right-1 mb-2.5 block origin-bottom-right whitespace-nowrap rounded-[12px] bg-accent px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-black shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
              >
                İstediğin zaman buradan küçültebilirsin.
                {/* Küçült butonuna bakan kuyruk */}
                <span aria-hidden className="absolute -bottom-1 right-4 size-2.5 rotate-45 rounded-[2px] bg-accent" />
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            {minimized ? (
              <motion.button
                key="mini"
                type="button"
                onClick={() => setMin(false)}
                aria-label="Asistanı aç"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={cn(GLASS, "grid size-16 place-items-center rounded-[22px] transition-transform hover:scale-105")}
              >
                <PixelMatrix glyph={glyph} fill={fill} />
              </motion.button>
            ) : (
              <motion.div
                key="pill"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Pill
                  shown={shown}
                  preset={isPreset ? preset : null}
                  list={shown === "liste" ? list : null}
                  reading={reading}
                  glyph={glyph}
                  fill={fill}
                  done={done}
                  showMinimize={minTip}
                  onMinimize={() => {
                    setMinTip(false);
                    setMin(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Piksel yüz + tek cümle. Hover / odak / dokunmayla eylemler açılır; yükseklik yumuşakça uzar.
 * Sesli asistan mesajlarında açılınca yüz ses dalgasına döner. Yüz imlecin yönüne birkaç piksel kayar.
 */
function Pill({
  shown,
  preset,
  list,
  reading,
  glyph,
  fill,
  done,
  showMinimize = false,
  onMinimize,
}: {
  shown: Shown;
  preset: DockPresetValue | null;
  list: ListNav | null;
  reading: Reading | null;
  glyph: Glyph;
  fill?: number;
  done: boolean;
  /** İpucu balonu açıkken küçült butonu hover beklemeden görünür */
  showMinimize?: boolean;
  onMinimize: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [measureRef, height] = useMeasuredHeight<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  // Liste modunda üstüne gelinen öğe: yüz onun ikonuna döner, başlıkta "→ ad" görünür
  const [preview, setPreview] = useState<number | null>(null);
  const previewItem = list && preview !== null ? list.items[preview] : null;
  const lookX = useSpring(0, { stiffness: 180, damping: 18 });
  const lookY = useSpring(0, { stiffness: 180, damping: 18 });

  const message: DockMessage | null = preset || !isMessage(shown) ? null : DOCK_MESSAGES[shown];
  const work = preset?.kind === "work" ? preset : null;
  const article = preset?.kind === "article" ? preset : null;
  // Araç yüzü yönetir ve kullanılmaya başlanınca asistanı açık tutar; ikisi de yalnız o mesaj için geçerli
  const [toolFace, setToolFace] = useState<Face & { key: string }>({ key: "" });
  const [engagedKey, setEngagedKey] = useState("");
  // Yazıda bölüm, listede öğe değiştikçe metin yumuşakça yer değiştirir
  const contentKey = work
    ? `work-${work.next.href}`
    : article
      ? `article-${done ? "done" : (reading?.index ?? 0)}`
      : list
        ? `liste-${list.index}`
        : shown;
  const face: Face = toolFace.key === contentKey ? toolFace : {};
  // Gezinme her an lazım: çalışma sayfasında ve liste modunda eylemler hep açık; araç kullanılırken de
  const expanded = work !== null || list !== null || open || engagedKey === contentKey;
  // Liste modunda eylem satırı sabit kalır (her öğede yeniden belirmesin)
  const actionsKey = list ? "actions-liste" : `actions-${contentKey}`;

  // Dokunmatikte dışarı dokununca kapanır
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const look = (e: React.MouseEvent) => {
    // Kutu imlecin altında açıldıysa (sessiz yüze tıklayınca) mouseenter gelmez; harekette aç
    if (!open) setOpen(true);
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    // Yüzün merkezi: sol üstten ~32px
    const dx = (e.clientX - (r.left + 32)) / 140;
    const dy = (e.clientY - (r.top + 32)) / 80;
    lookX.set(Math.max(-1, Math.min(1, dx)) * 2.5);
    lookY.set(Math.max(-1, Math.min(1, dy)) * 2);
  };

  const rest = () => {
    setOpen(false);
    lookX.set(0);
    lookY.set(0);
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={rest}
      onMouseMove={look}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) rest();
      }}
      className={cn(GLASS, "group/dock relative w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-[24px]")}
    >
      <motion.div initial={false} animate={{ height: height || "auto" }} transition={{ duration: 0.5, ease: EASE }}>
        <div ref={measureRef}>
          <div onClick={() => setOpen(true)} className="flex cursor-default items-center gap-3 p-2 pr-10">
            <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-black/50">
              <PixelMatrix
                glyph={face.glyph ?? previewItem?.glyph ?? glyph}
                fill={face.fill ?? fill}
                wave={face.wave || (Boolean(message?.live) && open)}
                look={{ x: lookX, y: lookY }}
              />
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={contentKey}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: EASE }}
                className="min-w-0 flex-1"
              >
                {work ? (
                  <>
                    <span className={EYEBROW}>
                      Çalışma {pad(work.index)} / {pad(work.total)}
                    </span>
                    <span className="mt-0.5 block truncate text-[14px] tracking-[-0.01em] text-white/90">
                      Sonraki: {work.next.title}
                    </span>
                  </>
                ) : article ? (
                  done ? (
                    <>
                      <span className={EYEBROW}>Okuduğun için teşekkürler</span>
                      <span className="mt-0.5 block text-[14px] tracking-[-0.01em] text-white/90">
                        Yazının sonuna geldin.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={cn(EYEBROW, "tabular-nums")}>
                        %{Math.round((reading?.pct ?? 0) * 100)} okundu ·{" "}
                        {Math.max(1, Math.ceil(article.minutes * (1 - (reading?.pct ?? 0))))} dk kaldı
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[14px] leading-[1.3] tracking-[-0.01em] text-white/90">
                        {reading?.title}
                      </span>
                    </>
                  )
                ) : list ? (
                  <>
                    <span className={cn(EYEBROW, "tabular-nums")}>
                      {list.label} · {pad(list.index + 1)} / {pad(list.items.length)}
                    </span>
                    <span className="mt-0.5 block truncate text-[15px] tracking-[-0.015em] text-white/90">
                      {previewItem && preview !== list.index ? (
                        <>
                          <span className="text-accent">→ </span>
                          {previewItem.title}
                        </>
                      ) : (
                        list.items[list.index]?.title
                      )}
                    </span>
                  </>
                ) : (
                  message && <Typed text={message.line} />
                )}
              </motion.span>
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key={actionsKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
                className={cn("flex gap-1.5 px-2 pb-2", list && "flex-col")}
              >
                {work ? (
                  <WorkNav preset={work} />
                ) : list ? (
                  <ListActions list={list} showMore={open} onPreview={setPreview} />
                ) : article ? (
                  <ReadingActions nextId={reading?.nextId} />
                ) : message?.tool ? (
                  <div className="w-full">
                    <ToolPanel
                      tool={message.tool}
                      onFace={(f) => setToolFace({ key: contentKey, ...f })}
                      onEngage={() => setEngagedKey(contentKey)}
                    />
                  </div>
                ) : (
                  message && (
                    <>
                      <Action action={message.primary} primary />
                      {message.secondary && <Action action={message.secondary} />}
                    </>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Küçült: yalnız ilgilenene görünür */}
      <button
        type="button"
        onClick={onMinimize}
        aria-label="Asistanı küçült"
        className={cn(
          "absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full text-white/50 transition-[opacity,background-color,color] hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover/dock:opacity-100",
          showMinimize ? "bg-white/10 text-white opacity-100" : "opacity-0",
        )}
      >
        <span className="h-[1.5px] w-3 rounded-full bg-current" />
      </button>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const EYEBROW = "block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50";

/**
 * Liste modu: bütün öğeler tek sırada piksel ikonlarıyla, hep görünür (tek tıkla istenene gidilir).
 * Bulunulan öğe yeşil; üstüne gelinen öğe başlıkta ve yüzde önizlenir. "Bana sor" hover'da açılır.
 */
function ListActions({
  list,
  showMore,
  onPreview,
}: {
  list: ListNav;
  showMore: boolean;
  onPreview: (index: number | null) => void;
}) {
  const lenis = useLenis();
  const go = (i: number) => {
    const item = list.items[i];
    if (item) lenis?.scrollTo(`#${item.id}`, { offset: -110 });
  };

  return (
    <>
      <ul className="flex gap-1" onMouseLeave={() => onPreview(null)}>
        {list.items.map((item, i) => {
          const on = i === list.index;
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                onMouseEnter={() => onPreview(i)}
                onFocus={() => onPreview(i)}
                onBlur={() => onPreview(null)}
                aria-label={item.title}
                aria-current={on ? "location" : undefined}
                title={item.title}
                className={cn(
                  "grid h-11 w-full place-items-center rounded-[14px] transition-colors",
                  on ? "bg-accent text-black" : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white",
                )}
              >
                {item.glyph ? (
                  <MiniGlyph glyph={item.glyph} cell={4} />
                ) : (
                  <span className="font-mono text-[11px]">{pad(i + 1)}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence initial={false}>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <button
              type="button"
              onClick={() => openAssistant("paketler")}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-white/10 text-[14px] tracking-[-0.01em] text-white transition-colors hover:bg-white/15"
            >
              Hangisini seçeceğini bilemedin mi? Bana sor
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Blog yazısı: sonraki bölüme geç (son bölümde başa dön) + linki kopyala. */
function ReadingActions({ nextId }: { nextId?: string }) {
  const lenis = useLenis();
  const [copied, setCopied] = useState(false);

  const go = () => {
    if (nextId) lenis?.scrollTo(`#${nextId}`, { offset: -100 });
    else lenis?.scrollTo(0);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={go}
        className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-[16px] bg-accent px-4 text-[14px] font-semibold tracking-[-0.01em] text-black transition-[filter] hover:brightness-110"
      >
        {nextId ? "Sonraki bölüm" : "Başa dön"}
        <PixelIcon
          variant={nextId ? "down" : "up"}
          className="size-[8px] transition-transform duration-300 group-hover:translate-y-0.5"
          cellClassName="fill-black"
        />
      </button>
      <button
        type="button"
        onClick={copy}
        className="flex h-11 items-center justify-center rounded-[16px] bg-white/10 px-4 text-[14px] tracking-[-0.01em] text-white transition-colors hover:bg-white/15"
      >
        {copied ? "Kopyalandı" : "Linki kopyala"}
      </button>
    </>
  );
}

/** Cümle harf harf yazılır; kalan kısım görünmez yer tutar, kutu yazarken zıplamaz. */
function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), 26);
    return () => clearTimeout(t);
  }, [n, text]);

  return (
    <span className="block text-balance text-[15px] leading-[1.3] tracking-[-0.015em] text-white/90" aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="invisible">
        {text.slice(n)}
      </span>
    </span>
  );
}

function Action({ action, primary = false }: { action: DockAction; primary?: boolean }) {
  const className = cn(
    "group flex h-11 items-center justify-center gap-2 rounded-[16px] px-4 text-[14px] tracking-[-0.01em] transition-[filter,background-color]",
    primary ? "flex-1 bg-accent font-semibold text-black hover:brightness-110" : "bg-white/10 text-white hover:bg-white/15",
  );
  const arrow = primary && (
    <PixelIcon
      variant="arrow"
      className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
      cellClassName="fill-black"
    />
  );

  if ("assistant" in action) {
    return (
      <button type="button" onClick={() => openAssistant(action.assistant)} className={className}>
        {action.label}
        {arrow}
      </button>
    );
  }
  return (
    <a
      href={action.href}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {action.label}
      {arrow}
    </a>
  );
}

/** Çalışma sayfası: önceki · tüm çalışmalar · sonraki. */
function WorkNav({ preset }: { preset: Extract<DockPresetValue, { kind: "work" }> }) {
  return (
    <>
      <Link
        href={preset.prev.href}
        aria-label={`Önceki: ${preset.prev.title}`}
        title={preset.prev.title}
        className="group grid size-11 shrink-0 place-items-center rounded-[16px] bg-white/10 transition-colors hover:bg-white/15"
      >
        <PixelIcon variant="arrow" className="size-[9px] rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </Link>
      <Link
        href="/calismalar"
        className="flex h-11 flex-1 items-center justify-center rounded-[16px] bg-white/10 text-[14px] tracking-[-0.01em] transition-colors hover:bg-white/15"
      >
        Tüm çalışmalar
      </Link>
      <Link
        href={preset.next.href}
        aria-label={`Sonraki: ${preset.next.title}`}
        title={preset.next.title}
        className="group grid size-11 shrink-0 place-items-center rounded-[16px] bg-accent transition-[filter] hover:brightness-110"
      >
        <PixelIcon
          variant="arrow"
          className="size-[9px] transition-transform duration-300 group-hover:translate-x-0.5"
          cellClassName="fill-black"
        />
      </Link>
    </>
  );
}
