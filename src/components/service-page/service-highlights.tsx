"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Logo } from "@/components/navbar/logo";
import type { HighlightWidget, ServicePage } from "./service-page-data";

// Referans: art arda tam ekran fotoğraf bantları.
// Yazılmış sayfalarda (widget): ortada bandın fikrini somutlaştıran cam efektli mini arayüz, altında ortalı başlık.
// Diğerlerinde (note): solda müşteri panelinden gelen bir bildirim, sağ altta başlık.
// Bantlar yapışkan: kaydırma durur gibi olur, sonraki bant öncekinin üstüne biner.
// Sondaki bant boyu boşluk + eşit negatif margin: son bant da yapışık kalır ve sonraki bölüm onun üstüne biner,
// sayfanın toplam uzunluğu değişmez.

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const GLASS = "rounded-[22px] border border-white/20 bg-white/15 text-white backdrop-blur-xl";
const KEY = "font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/60";
// Sosyal medya ve sonrası için sade kart: koyu düz zemin, ince kenar; cam efekti yalnız hafif bir bulanıklık
const SOLID = "rounded-[22px] border border-white/10 bg-[#0c0c0c]/85 text-white backdrop-blur-sm";
const WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
// Branding bantlarındaki örnek marka "mira": tüm mini arayüzlerde aynı işaret ve palet
const SAND = "#E9DFCF";

function MiraMark({
  className,
  color = "currentColor",
  cut = SAND,
  sketch = false,
}: {
  className?: string;
  color?: string;
  /** İşaretteki küçük dairenin rengi; siyah-beyaz kullanımda beyaz */
  cut?: string;
  sketch?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {sketch ? (
        <g fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 2">
          <circle cx="12" cy="12" r="9.5" />
          <circle cx="15" cy="9" r="3.5" />
          <path d="M3 20 21 4" opacity={0.5} />
        </g>
      ) : (
        <>
          <circle cx="12" cy="12" r="10" fill={color} />
          <circle cx="15.2" cy="8.8" r="3.6" fill={cut} />
        </>
      )}
    </svg>
  );
}

// E-ticaret bantlarındaki örnek mağaza "keten.": aynı ürün (keten gömlek) her arayüzde
function Shirt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M8.5 3 3.5 5.8l1.9 3.9 1.8-.9V21h9.6V8.8l1.8.9 1.9-3.9L15.5 3c-.6 1.5-1.9 2.4-3.5 2.4S9.1 4.5 8.5 3Z"
        fill="#F3EEE4"
        stroke="#111"
        strokeOpacity={0.25}
        strokeWidth={0.6}
      />
      <path d="M12 5.4V21" stroke="#111" strokeOpacity={0.18} strokeWidth={0.6} />
    </svg>
  );
}

function StoreLogo() {
  return <span className="font-mono text-[11px] font-bold tracking-[0.04em] text-white/70">keten.</span>;
}

function MiraLogo({ className, color, cut, word = true }: { className?: string; color?: string; cut?: string; word?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium tracking-[-0.04em] ${className ?? ""}`} style={{ color }}>
      <MiraMark className="size-[1.1em]" color={color} cut={cut} />
      {word && <span>mira</span>}
    </span>
  );
}

export function ServiceHighlights({ items }: { items: ServicePage["highlights"] }) {
  return (
    <section id="one-cikanlar" className="-mb-[max(100svh,640px)] bg-[#111]">
      {items.map((item, i) => (
        <Band key={item.title} index={i} {...item} />
      ))}
      {/* Dolgu değil ayrı öğe: sticky, ebeveynin padding alanında yapışık kalmıyor */}
      <div aria-hidden className="h-[max(100svh,640px)]" />
    </section>
  );
}

function Band({
  index,
  title,
  desc,
  image,
  note,
  widget,
}: ServicePage["highlights"][number] & { index: number }) {
  return (
    <div className="sticky top-0 h-[max(100svh,640px)] overflow-hidden">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

      {widget ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-4 text-center md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="w-full max-w-[560px] text-left"
          >
            <Widget widget={widget} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ delay: 0.15, duration: 0.9, ease: EASE_OUT }}
          >
            <h2 className="text-[clamp(34px,3.6vw,68px)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-[36em] text-[clamp(15px,1.1vw,19px)] leading-[1.45] tracking-[-0.01em] text-white/80">
              {desc}
            </p>
          </motion.div>
        </div>
      ) : (
        <>
          {note && <NoteCard index={index} {...note} />}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ delay: 0.15, duration: 0.9, ease: EASE_OUT }}
            className="absolute bottom-12 left-4 right-4 md:bottom-20 md:left-[50%] md:right-[6vw]"
          >
            <h2 className="text-[clamp(34px,3.6vw,68px)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
              {title}
            </h2>
            <p className="mt-3 max-w-[32em] text-[clamp(15px,1.1vw,19px)] leading-[1.45] tracking-[-0.01em] text-white/80">
              {desc}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

/** Eski düzen: müşteri panelinden gelen bildirim, sırayla sol üst / sol orta */
function NoteCard({ index, title, text, badge }: NonNullable<ServicePage["highlights"][number]["note"]> & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className={
        `absolute left-4 w-[min(360px,calc(100%-32px))] p-4 md:left-[11vw] ${GLASS} ` +
        (index % 2 === 0 ? "top-[22%]" : "top-[46%]")
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#111]">
          <Logo className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.01em]">{title}</p>
            <span className="font-mono text-[10px] text-white/60">12:03</span>
          </div>
          <p className="mt-0.5 text-[14px] leading-[1.35] tracking-[-0.01em] text-white/85">{text}</p>
          {badge && (
            <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
              {badge}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* --- Mini arayüzler: aynı cam kart, üstte OX logosu + başlık + sağda kısa durum --- */

function WidgetHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[#111]">
        <Logo className="size-6" />
      </span>
      <p className="text-[15px] font-semibold tracking-[-0.01em]">{title}</p>
      {badge && (
        <span className="ml-auto rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-ink">{badge}</span>
      )}
    </div>
  );
}

function CheckDot() {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="m2.5 6.2 2.2 2.2 4.8-4.8" />
      </svg>
    </span>
  );
}

function Widget({ widget }: { widget: HighlightWidget }) {
  if (widget.kind === "roadmap") {
    // Üç adımlı yol haritası: masaüstünde yan yana, aralarında ok; mobilde alt alta
    return (
      <div className={GLASS}>
        <WidgetHeader title={widget.title} />
        <ol className="grid sm:grid-cols-3">
          {widget.steps.map((s, i) => (
            <li
              key={s.label}
              className={`relative border-white/15 px-5 py-4 max-sm:border-t max-sm:first:border-0 sm:border-l sm:first:border-0 ${i > 0 ? "sm:pl-8" : ""}`}
            >
              <p className={KEY}>
                <span className="text-accent">0{i + 1}</span> · {s.label}
              </p>
              <p className="mt-2 text-[15px] leading-[1.3] tracking-[-0.01em]">{s.value}</p>
              {i < widget.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-2.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 place-items-center rounded-full bg-accent text-[11px] text-accent-ink sm:grid"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (widget.kind === "checklist") {
    return (
      <div className={GLASS}>
        <WidgetHeader title={widget.title} badge={widget.status} />
        <ul className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
          {widget.items.map((item) => (
            <li key={item} className="flex items-center gap-3 py-2.5 text-[15px] tracking-[-0.01em]">
              <CheckDot />
              {item}
              <span className="ml-auto text-[12px] text-white/60">Onaylandı</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "calendar") {
    const marked = new Map(widget.posts.map((p) => [p.day, p]));
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        {/* Hafta şeridi: paylaşım olan günler mavi */}
        <div className="grid grid-cols-7 gap-1 px-5 pt-4">
          {WEEK.map((d) => (
            <span
              key={d}
              className={`rounded-[10px] py-2 text-center font-mono text-[11px] font-bold ${marked.has(d) ? "bg-accent text-accent-ink" : "bg-white/[0.06] text-white/45"}`}
            >
              {d}
            </span>
          ))}
        </div>
        <ul className="px-5 py-3">
          {widget.posts.map((p) => (
            <li key={p.day} className="flex items-center gap-3 border-t border-white/10 py-2.5 first:border-0">
              <span className="w-8 shrink-0 font-mono text-[11px] font-bold text-white/50">{p.day}</span>
              <span className="text-[15px] tracking-[-0.01em]">{p.title}</span>
              <span className="ml-auto rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
                {p.type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "editor") {
    // İz başına birkaç klip; ilk iz (video) dolu mavi, diğerleri soluk
    const clips = [
      [18, 30, 22, 26],
      [26, 14, 30, 18],
      [62, 34],
    ];
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.status} />
        <div className="flex gap-4 p-5">
          {/* Dikey (9:16) önizleme */}
          <div className="relative grid aspect-[9/16] w-[72px] shrink-0 place-items-center overflow-hidden rounded-[12px] bg-gradient-to-b from-[#2b2b2b] to-[#151515] sm:w-[84px]">
            <span className="grid size-7 place-items-center rounded-full bg-white/90 text-[10px] text-[#111]">▶</span>
            <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-white/20">
              <span className="block h-full w-2/3 rounded-full bg-accent" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="space-y-2">
              {widget.tracks.map((t, ti) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">{t}</span>
                  <div className="flex h-5 flex-1 gap-1">
                    {(clips[ti] ?? clips[0]).map((w, ci) => (
                      <span
                        key={ci}
                        className={`h-full rounded-[5px] ${ti === 0 ? "bg-accent" : "bg-white/20"}`}
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {widget.done.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] py-1 pl-1 pr-2.5 text-[12px]">
                  <CheckDot />
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (widget.kind === "performance") {
    // Rakam yok: her gösterge yalnız haftalık eğilimi anlatan küçük çubuklar
    const trend = [40, 55, 48, 62, 58, 70, 66];
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="grid gap-px border-b border-white/10 sm:grid-cols-3">
          {widget.metrics.map((m, mi) => (
            <div key={m} className="px-5 py-4 sm:border-l sm:border-white/10 sm:first:border-0">
              <p className={KEY}>{m}</p>
              <div aria-hidden className="mt-3 flex h-8 items-end gap-1">
                {trend.map((h, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-t-[3px] ${i === trend.length - 1 ? "bg-accent" : "bg-white/20"}`}
                    style={{ height: `${Math.max(20, h - mi * 8 + (i % 2) * 6)}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-5 py-3.5">
          <span className="grid aspect-[9/16] w-5 shrink-0 place-items-center rounded-[4px] bg-accent text-[7px] text-accent-ink">▶</span>
          <span className={KEY}>{widget.top.label}</span>
          <span className="ml-auto truncate text-[14px]">{widget.top.value}</span>
        </div>
      </div>
    );
  }

  if (widget.kind === "approval") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex items-center gap-4 p-5">
          <div className="relative grid aspect-[9/16] w-14 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-b from-accent/70 to-[#111]">
            <span className="grid size-6 place-items-center rounded-full bg-white/90 text-[9px] text-[#111]">▶</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[16px] tracking-[-0.01em]">{widget.item}</p>
            <p className="mt-1 text-[13px] text-white/55">{widget.meta}</p>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <span className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-[14px] font-medium text-white/85">
            {widget.actions[0]}
          </span>
          <span className="flex-1 rounded-full bg-accent py-2.5 text-center text-[14px] font-medium text-accent-ink">
            {widget.actions[1]}
          </span>
        </div>
      </div>
    );
  }

  if (widget.kind === "moodboard") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {widget.words.map((w) => (
            <span
              key={w.label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] ${w.on ? "bg-accent text-accent-ink" : "border border-white/15 text-white/45"}`}
            >
              {w.on ? "✓" : "+"} {w.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
          <span className={KEY}>Renkler</span>
          <div className="ml-auto flex gap-2">
            {widget.swatches.map((c) => (
              <span key={c} className="flex flex-col items-center gap-1">
                <span className="size-8 rounded-[9px] border border-white/15" style={{ background: c }} />
                <span className="font-mono text-[9px] text-white/45">{c.replace("#", "").toUpperCase()}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (widget.kind === "logo") {
    // Eskizden renkliye üç artboard; artboard zemini Figma'daki gibi açık, işaret boyutu sabit
    const boards: Record<string, { bg: string; node: React.ReactNode }> = {
      Eskiz: { bg: "bg-white/[0.06]", node: <MiraMark className="size-12" color="rgba(255,255,255,0.55)" sketch /> },
      "Siyah-beyaz": { bg: "bg-white", node: <MiraLogo className="text-[22px]" color="#111" cut="#fff" /> },
      Renkli: { bg: "", node: <MiraLogo className="text-[22px]" color="#2f6bff" /> },
    };
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex gap-3 p-4">
          {/* Araç çubuğu */}
          <div aria-hidden className="hidden flex-col gap-1.5 rounded-[12px] bg-white/[0.06] p-1.5 sm:flex">
            {["↖", "✎", "◯", "T"].map((t, ti) => (
              <span
                key={t}
                className={`grid size-7 place-items-center rounded-[8px] text-[12px] ${ti === 1 ? "bg-accent text-accent-ink" : "text-white/60"}`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {widget.boards.map((b, bi) => (
              <div key={b}>
                <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white/45">{b}</p>
                <div
                  className={`grid aspect-square place-items-center rounded-[10px] ${boards[b]?.bg ?? "bg-white"} ${bi === widget.boards.length - 1 ? "ring-2 ring-accent" : ""}`}
                  style={boards[b]?.bg === "" ? { background: SAND } : undefined}
                >
                  {boards[b]?.node}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3">
          <span className={KEY}>Yerleşim</span>
          <div className="ml-auto flex gap-1.5">
            {widget.layouts.map((l) => (
              <span key={l} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[12px]">
                {l === "Dikey" ? (
                  <span className="flex flex-col items-center gap-px leading-none">
                    <MiraMark className="size-2.5" color="#fff" />
                    <span className="text-[6px] font-medium">mira</span>
                  </span>
                ) : (
                  <MiraLogo className="text-[11px]" color="#fff" word={l !== "İkon"} />
                )}
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (widget.kind === "mockups") {
    const art: Record<string, React.ReactNode> = {
      Kartvizit: (
        <div className="flex h-[58%] w-[82%] flex-col justify-between rounded-[6px] p-2 shadow-lg" style={{ background: SAND }}>
          <MiraLogo className="text-[11px]" color="#111" />
          <span className="h-1 w-1/2 rounded-full bg-[#111]/25" />
        </div>
      ),
      Ambalaj: (
        <div className="flex h-[78%] w-[52%] flex-col items-center justify-center gap-1.5 rounded-b-[10px] rounded-t-[4px] bg-accent shadow-lg">
          <MiraMark className="size-6" color="#fff" />
          <span className="text-[9px] font-medium tracking-[0.08em] text-white">MIRA</span>
        </div>
      ),
      "Sosyal medya": (
        <div className="flex aspect-square w-[74%] flex-col justify-between rounded-[8px] bg-[#111] p-2">
          <MiraMark className="size-4" color="#2f6bff" />
          <span className="space-y-1">
            <span className="block h-1 w-4/5 rounded-full" style={{ background: SAND }} />
            <span className="block h-1 w-1/2 rounded-full bg-white/40" />
          </span>
        </div>
      ),
      "Web sitesi": (
        <div className="w-[86%] overflow-hidden rounded-[6px] bg-white shadow-lg">
          <div className="flex gap-0.5 bg-[#eee] px-1.5 py-1">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1 rounded-full bg-[#bbb]" />
            ))}
          </div>
          <div className="space-y-1.5 p-2">
            <MiraLogo className="text-[9px]" color="#111" />
            <span className="block h-1.5 w-4/5 rounded-full bg-[#111]/80" />
            <span className="block h-2.5 w-1/3 rounded-full bg-accent" />
          </div>
        </div>
      ),
    };
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
          {widget.items.map((it) => (
            <figure key={it}>
              <div className="grid aspect-square place-items-center rounded-[12px] bg-white/[0.07]">{art[it]}</div>
              <figcaption className="mt-1.5 text-center text-[12px] text-white/70">{it}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  if (widget.kind === "files") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <ul className="px-5 py-2">
          {widget.files.map((f, fi) => (
            <li key={f.name} className="flex items-center gap-3 border-t border-white/10 py-3 first:border-0">
              {/* İlk satır klasör (logo dosyaları), diğerleri tek doküman */}
              <span
                aria-hidden
                className={`grid size-8 shrink-0 place-items-center rounded-[9px] ${fi === 0 ? "bg-accent text-accent-ink" : "bg-white/[0.08] text-white/70"}`}
              >
                {fi === 0 ? <MiraMark className="size-4" color="currentColor" /> : <span className="text-[13px]">▤</span>}
              </span>
              <span className="text-[15px] tracking-[-0.01em]">{f.name}</span>
              <span className="ml-auto flex gap-1">
                {f.formats.map((x) => (
                  <span key={x} className="rounded-[6px] border border-white/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/70">
                    {x}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "categories") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex items-center justify-between px-5 pt-4">
          <StoreLogo />
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-white/75">+ Kategori</span>
        </div>
        <ul className="px-5 py-3">
          {widget.tree.map((node) => (
            <li key={node.label} className="py-1.5">
              <div className="flex items-center gap-2.5 rounded-[10px] bg-white/[0.06] px-3 py-2">
                <span aria-hidden className="text-[10px] text-white/50">▾</span>
                <span className="text-[15px] tracking-[-0.01em]">{node.label}</span>
                <span aria-hidden className="ml-auto grid grid-cols-2 gap-[3px] opacity-40">
                  {Array.from({ length: 6 }, (_, k) => (
                    <span key={k} className="size-[3px] rounded-full bg-white" />
                  ))}
                </span>
              </div>
              {node.children && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-white/15 pl-4">
                  {node.children.map((c) => (
                    <li key={c} className="flex items-center gap-2 py-1.5 text-[14px] text-white/75">
                      <span aria-hidden className="h-px w-2.5 bg-white/25" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "product") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex gap-4 p-5">
          <div className="grid aspect-[4/5] w-[38%] shrink-0 place-items-center rounded-[14px] bg-[#E9E3D8]">
            <Shirt className="w-3/4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <StoreLogo />
            <p className="mt-1.5 text-[18px] tracking-[-0.02em]">{widget.name}</p>
            <p className="mt-0.5 text-[15px] text-white/70">{widget.price}</p>
            <p className={`${KEY} mt-4`}>Beden</p>
            <div className="mt-2 flex gap-1.5">
              {widget.sizes.map((sz) => (
                <span
                  key={sz}
                  className={`grid h-8 min-w-8 place-items-center rounded-[8px] px-2 text-[13px] font-medium ${sz === widget.selected ? "bg-white text-[#111]" : "border border-white/15 text-white/60"}`}
                >
                  {sz}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-4">
              <span className="flex-1 rounded-full bg-accent py-2.5 text-center text-[14px] font-medium text-accent-ink">
                {widget.cta}
              </span>
              {/* Sepete eklenince sepet rozeti 1 olur: seçim → sepet akışı */}
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-[14px]">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
                  <path d="M9 8a3 3 0 0 1 6 0" />
                </svg>
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-[#111]">
                  1
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (widget.kind === "orders") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="flex items-center gap-3 px-5 pt-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-[#E9E3D8]">
            <Shirt className="size-7" />
          </span>
          <span className="text-[15px] tracking-[-0.01em]">{widget.order}</span>
          <span className="ml-auto">
            <StoreLogo />
          </span>
        </div>
        {/* Durum akışı: tamamlananlar dolu, şu anki halkalı, sıradakiler soluk */}
        <ol className="relative grid grid-cols-4 px-3 pb-5 pt-6">
          <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[34px] h-0.5 bg-white/15" />
          <span
            aria-hidden
            className="absolute left-[12.5%] top-[34px] h-0.5 bg-accent"
            style={{ width: `${(widget.current / (widget.steps.length - 1)) * 75}%` }}
          />
          {widget.steps.map((st, si) => (
            <li key={st} className="relative flex flex-col items-center gap-2 text-center">
              {si < widget.current ? (
                <CheckDot />
              ) : si === widget.current ? (
                <span className="grid size-5 place-items-center rounded-full border-2 border-accent bg-[#0c0c0c]">
                  <span className="size-2 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="size-5 rounded-full border-2 border-white/20 bg-[#0c0c0c]" />
              )}
              <span className={`text-[12px] leading-tight ${si > widget.current ? "text-white/40" : "text-white/85"}`}>{st}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (widget.kind === "inventory") {
    const { product } = widget;
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 border-b border-white/10 px-5 py-2.5 sm:grid">
          {["Ürün", "Fiyat", "Stok", "Durum"].map((h) => (
            <span key={h} className={KEY}>
              {h}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 items-center gap-3 px-5 py-4 sm:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <span className="col-span-2 flex items-center gap-3 sm:col-span-1">
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#E9E3D8]">
              <Shirt className="size-8" />
            </span>
            <span className="text-[15px] tracking-[-0.01em]">{product.name}</span>
          </span>
          <span className="text-[15px]">{product.price}</span>
          <span className="text-[15px] text-white/80">{product.stock}</span>
          <span>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[12px] font-medium text-accent-ink">{product.status}</span>
          </span>
        </div>
        <div className="flex gap-2 border-t border-white/10 px-5 py-3.5">
          <span className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#111]">Düzenle</span>
          <span className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/75">Stok güncelle</span>
          <span className="ml-auto grid size-9 place-items-center rounded-full border border-white/15 text-white/60">⋯</span>
        </div>
      </div>
    );
  }

  if (widget.kind === "keywords") {
    // Niyet türü renkle ayrılır; hacim / rekabet gibi rakam bilerek yok
    const tone: Record<string, string> = {
      "Yerel arama": "bg-accent text-accent-ink",
      "Bilgi arama": "bg-white text-[#111]",
      "Hizmet arama": "border border-white/25 text-white/85",
    };
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 pl-3.5 pr-1.5">
            <svg viewBox="0 0 24 24" className="size-4 text-white/50" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <span className="text-[14px] text-white/85">{widget.query}</span>
            <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">İlgili aramalar</span>
          </div>
        </div>
        <ul className="px-5 py-3">
          {widget.rows.map((r) => (
            <li key={r.term} className="flex items-center gap-3 border-t border-white/10 py-2.5 first:border-0">
              <span className="text-[15px] tracking-[-0.01em]">{r.term}</span>
              <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tone[r.intent] ?? tone["Hizmet arama"]}`}>
                {r.intent}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "audit") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <ul className="px-5 py-2">
          {widget.items.map((it) => (
            <li key={it.label} className="flex items-center gap-3 border-t border-white/10 py-3 first:border-0">
              {it.done ? (
                <CheckDot />
              ) : (
                <span aria-hidden className="size-5 shrink-0 rounded-full border-2 border-dashed border-accent" />
              )}
              <span className="text-[15px] tracking-[-0.01em]">{it.label}</span>
              <span className={`ml-auto text-[13px] ${it.done ? "text-white/60" : "font-medium text-accent"}`}>{it.status}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.kind === "serp") {
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        {/* Arama sonucu: site adı, adres, başlık, açıklama */}
        <div className="px-5 pt-4">
          <div className="rounded-[14px] bg-white p-4 text-[#111]">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-accent">Ö</span>
              <span className="leading-tight">
                <span className="block text-[12px]">Örnek Klinik</span>
                <span className="block text-[11px] text-neutral-500">{widget.result.url}</span>
              </span>
            </div>
            <p className="mt-2 text-[16px] font-medium leading-snug text-accent">{widget.result.heading}</p>
            <p className="mt-1 text-[13px] leading-snug text-neutral-600">{widget.result.desc}</p>
          </div>
        </div>
        {/* Tıklanınca açılan sayfanın yapısı: aranan soruya cevap veren bölümler */}
        <div className="px-5 pb-5 pt-3">
          <p className={KEY}>Sayfa yapısı</p>
          <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {widget.outline.map((o) => (
              <li key={o} className="flex items-center gap-2 rounded-[10px] bg-white/[0.06] px-3 py-2 text-[13px]">
                <span className="font-mono text-[10px] font-bold text-accent">H2</span>
                {o}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (widget.kind === "search") {
    // İki çizgi: tıklamalar (mavi) ve gösterimler (soluk); eksen ve rakam yok
    const clicks = "0,40 14,36 28,38 42,30 56,32 70,24 84,22 100,14";
    const views = "0,30 14,28 28,24 42,26 56,18 70,20 84,12 100,8";
    return (
      <div className={SOLID}>
        <WidgetHeader title={widget.title} badge={widget.badge} />
        <div className="px-5 pt-4">
          <div className="flex flex-wrap gap-2">
            {widget.metrics.map((m, mi) => (
              <span key={m} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-[12px] text-white/80">
                <span className={`h-0.5 w-3 rounded-full ${mi === 0 ? "bg-accent" : "bg-white/50"}`} />
                {m}
              </span>
            ))}
          </div>
          <svg viewBox="0 0 100 46" preserveAspectRatio="none" className="mt-3 h-16 w-full" aria-hidden>
            {[12, 24, 36].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            <polyline points={views} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <polyline points={clicks} fill="none" stroke="#2f6bff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="grid border-t border-white/10 sm:grid-cols-2">
          {[
            { label: "En çok ziyaret alan sayfalar", list: widget.pages },
            { label: "Gelişen arama sorguları", list: widget.queries },
          ].map((col, ci) => (
            <div key={col.label} className={`px-5 py-3.5 ${ci === 1 ? "border-white/10 max-sm:border-t sm:border-l" : ""}`}>
              <p className={KEY}>{col.label}</p>
              <ul className="mt-2 space-y-1.5">
                {col.list.map((x) => (
                  <li key={x} className="flex items-center gap-2 text-[13px]">
                    <span
                      aria-label="gelişiyor"
                      className="grid size-4 shrink-0 place-items-center rounded-full bg-accent text-[9px] text-accent-ink"
                    >
                      ↑
                    </span>
                    <span className="truncate">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={GLASS}>
      <WidgetHeader title={widget.title} badge={widget.badge} />
      <dl className="grid sm:grid-cols-2">
        {widget.rows.map((r, i) => (
          <div
            key={r.label}
            className={`border-white/15 px-5 py-3.5 ${i > 0 ? "border-t" : ""} ${i === 1 ? "sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""}`}
          >
            <dt className={KEY}>{r.label}</dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-[16px] tracking-[-0.01em]">
              {r.up && (
                <span
                  aria-label="artışta"
                  className="grid size-4 place-items-center rounded-full bg-accent text-[10px] text-accent-ink"
                >
                  ↑
                </span>
              )}
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
