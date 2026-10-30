"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PACKAGES } from "@/components/packages/packages-data";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { WORKS } from "@/components/work/work-data";
import { openAssistant } from "@/lib/assistant";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { Glyph } from "./pixel-matrix";

// Asistanın bölüme göre sunduğu küçük araçlar. Amaç ısrar değil fayda: önce bir şey verir (paket önerisi,
// hız puanı, benzer iş, süre tahmini), görüşme önerisi ancak ondan sonra gelir. "Bana sor" (ElevenLabs ajanı)
// her araçta farklı bir bağlamla ikinci yol olarak durur.
// Araç yüzü yönetir (onFace) ve kullanılmaya başlanınca asistanın açık kalmasını ister (onEngage).
// Metinler, süreler ve eşleşmeler YER TUTUCU.

export type DockTool = "quiz" | "speed" | "sector" | "timeline";
export type Face = { glyph?: Glyph; fill?: number; wave?: boolean };
type ToolProps = { onFace: (face: Face) => void; onEngage: () => void };

export function ToolPanel({ tool, ...props }: ToolProps & { tool: DockTool }) {
  if (tool === "quiz") return <PackageQuiz {...props} />;
  if (tool === "speed") return <SpeedCheck {...props} />;
  if (tool === "sector") return <SectorPick {...props} />;
  return <Timeline {...props} />;
}

/* --- Ortak parçalar --- */

const EYEBROW = "block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/50";
const CHIP =
  "flex h-9 items-center rounded-[12px] bg-white/10 px-3 text-[13px] tracking-[-0.01em] text-white transition-colors hover:bg-white/20";

function Primary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-[16px] bg-accent px-4 text-[14px] font-semibold tracking-[-0.01em] text-black transition-[filter] hover:brightness-110"
    >
      {children}
      <PixelIcon
        variant="arrow"
        className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
        cellClassName="fill-black"
      />
    </a>
  );
}

function Ask({ topic, children = "Bana sor" }: { topic: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => openAssistant(topic)}
      className="flex h-11 items-center justify-center rounded-[16px] bg-white/10 px-4 text-[14px] tracking-[-0.01em] text-white transition-colors hover:bg-white/15"
    >
      {children}
    </button>
  );
}

function Back({ onClick, children = "Baştan" }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="text-[12px] text-white/45 transition-colors hover:text-white">
      ← {children}
    </button>
  );
}

/* --- Paketler: 2 soruda paket önerisi --- */

// Her cevap bir aşamaya (PACKAGES sırası) işaret eder; öneri ikisinden ileri olan aşama.
const QUIZ = [
  {
    q: "Şu an neredesin?",
    options: [
      { label: "Yeni başlıyorum", stage: 0 },
      { label: "Satışa geçmek istiyorum", stage: 1 },
      { label: "Büyüyorum, ekibim var", stage: 2 },
    ],
  },
  {
    q: "En çok neye ihtiyacın var?",
    options: [
      { label: "Görünür olmak", stage: 0 },
      { label: "Online satış", stage: 1 },
      { label: "Zaman kazanmak", stage: 2 },
    ],
  },
];

function PackageQuiz({ onFace, onEngage }: ToolProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUIZ.length;
  const stage = done ? Math.max(answers[0], answers[1]) : 0;
  const pkg = PACKAGES[stage];

  const answer = (value: number) => {
    onEngage();
    const next = [...answers, value];
    setAnswers(next);
    // Sorarken düşünen yüz, sonuçta elmas (paket)
    onFace({ glyph: next.length === QUIZ.length ? "diamond" : "question" });
  };

  if (done && pkg)
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-[16px] bg-white/[0.06] px-3.5 py-3">
          <span className={EYEBROW}>Sana önerim</span>
          <span className="mt-1 block text-[17px] font-medium tracking-[-0.02em] text-white">{pkg.title}</span>
          <span className="block text-[13px] text-white/55">{pkg.tagline}</span>
        </div>
        <div className="flex gap-1.5">
          <Primary href="/paketler">Paketi incele</Primary>
          <Ask topic={`${pkg.title} paketi`} />
        </div>
        <span className="px-1">
          <Back
            onClick={() => {
              setAnswers([]);
              onFace({});
            }}
          />
        </span>
      </div>
    );

  const current = QUIZ[step];
  return (
    <div className="flex flex-col gap-2 px-1 pb-1">
      <span className={cn(EYEBROW, "tabular-nums")}>
        Soru {step + 1} / {QUIZ.length} · {current.q}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {current.options.map((o) => (
          <button key={o.label} type="button" onClick={() => answer(o.stage)} className={CHIP}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* --- Hizmetler: site hız ölçümü (Google PageSpeed Insights, mobil) --- */

// Anahtarsız da çalışır ama günlük limiti düşük; yayında ücretsiz bir Google API anahtarı verilmeli.
const PAGESPEED_KEY = process.env.NEXT_PUBLIC_PAGESPEED_KEY;

type Speed =
  | { state: "idle" }
  | { state: "loading"; url: string }
  | { state: "done"; url: string; score: number; lcp?: string }
  | { state: "error"; message: string }
  // Kota doldu (anahtarsız kullanımda sık): ölçümü ekibe bırakma yolu
  | { state: "busy"; url: string };

function normalizeUrl(input: string) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function verdict(score: number) {
  if (score >= 90) return "Çok iyi, hız senin için sorun değil.";
  if (score >= 50) return "Fena değil ama müşteri kaybettiren bir yavaşlık var.";
  return "Yavaş: ziyaretçilerin önemli bir kısmı beklemeden çıkıyor.";
}

function SpeedCheck({ onFace, onEngage }: ToolProps) {
  const [value, setValue] = useState("");
  const [speed, setSpeed] = useState<Speed>({ state: "idle" });
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = normalizeUrl(value);
    if (!url) {
      setSpeed({ state: "error", message: "Adresi anlayamadım, örn. markan.com" });
      return;
    }
    onEngage();
    abort.current?.abort();
    abort.current = new AbortController();
    setSpeed({ state: "loading", url });
    onFace({ wave: true });
    try {
      const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      api.searchParams.set("url", url);
      api.searchParams.set("strategy", "mobile");
      api.searchParams.set("category", "performance");
      if (PAGESPEED_KEY) api.searchParams.set("key", PAGESPEED_KEY);
      const res = await fetch(api, { signal: abort.current.signal });
      if (res.status === 429) {
        setSpeed({ state: "busy", url });
        onFace({ glyph: "smile" });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const score = Math.round((data?.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
      const lcp: string | undefined = data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue;
      setSpeed({ state: "done", url, score, lcp: lcp?.replace(/\s?s$/, " sn").replace(".", ",") });
      // Yüz puan kadar dolar
      onFace({ fill: score / 100 });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSpeed({ state: "error", message: "Şu an ölçemedim. Adresi kontrol edip tekrar dene." });
      onFace({ glyph: "question" });
    }
  };

  if (speed.state === "loading")
    return (
      <div className="px-1 pb-1">
        <span className={EYEBROW}>Ölçüyorum</span>
        <span className="mt-1 block truncate text-[13px] text-white/70">{new URL(speed.url).hostname}</span>
        <span className="mt-0.5 block text-[12px] text-white/40">20–30 saniye sürebilir.</span>
      </div>
    );

  if (speed.state === "busy") {
    const host = new URL(speed.url).hostname;
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-[16px] bg-white/[0.06] px-3.5 py-3">
          <span className={EYEBROW}>Ölçüm şu an yoğun</span>
          <span className="mt-1 block text-[13px] leading-[1.35] text-white/75">
            {host} için ölçümü biz yapıp sonucu sana iletelim.
          </span>
        </div>
        <div className="flex gap-1.5">
          <Primary href={talepUrl({ konu: "site-hizi", site: host })}>Ölçüp dönün</Primary>
          <Ask topic={`${host} sitemin hızı`} />
        </div>
      </div>
    );
  }

  if (speed.state === "done") {
    const host = new URL(speed.url).hostname;
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-[16px] bg-white/[0.06] px-3.5 py-3">
          <span className={EYEBROW}>Mobil hız · {host}</span>
          <span className="mt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-medium leading-none tracking-[-0.04em] text-white tabular-nums">
              {speed.score}
            </span>
            <span className="text-[13px] text-white/45">/ 100{speed.lcp && ` · açılış ${speed.lcp}`}</span>
          </span>
          <span className="mt-1.5 block text-[13px] leading-[1.35] text-white/70">{verdict(speed.score)}</span>
        </div>
        <div className="flex gap-1.5">
          <Primary href={talepUrl({ konu: "site-hizi", site: host, puan: String(speed.score) })}>
            {speed.score >= 90 ? "Görüşelim" : "Birlikte hızlandıralım"}
          </Primary>
          <Ask topic={`sitemin hız sonucu (${speed.score}/100)`}>Yorumlat</Ask>
        </div>
        <span className="px-1">
          <Back
            onClick={() => {
              setSpeed({ state: "idle" });
              onFace({});
            }}
          >
            Başka site
          </Back>
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={run} className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={onEngage}
          inputMode="url"
          autoComplete="url"
          placeholder="markan.com"
          aria-label="Site adresi"
          className="h-11 min-w-0 flex-1 rounded-[16px] bg-white/10 px-4 text-[14px] text-white outline-none ring-accent/60 placeholder:text-white/35 focus:ring-2"
        />
        <button
          type="submit"
          className="h-11 rounded-[16px] bg-accent px-4 text-[14px] font-semibold text-black transition-[filter] hover:brightness-110"
        >
          Ölç
        </button>
      </div>
      <span className={cn("px-1 text-[11px]", speed.state === "error" ? "text-accent" : "text-white/35")}>
        {speed.state === "error" ? speed.message : "Google PageSpeed ile, mobil için ölçülür."}
      </span>
    </form>
  );
}

/* --- Çalışmalar: sektöre göre en yakın iş --- */

const SECTORS = [...new Map(WORKS.map((w) => [w.sector, w])).values()];

function SectorPick({ onFace }: ToolProps) {
  return (
    <div className="flex flex-col gap-2 px-1 pb-1">
      <div className="flex flex-wrap gap-1.5" onMouseLeave={() => onFace({})}>
        {SECTORS.map((w) => (
          <Link
            key={w.sector}
            href={`/calismalar/${w.slug}`}
            onMouseEnter={() => onFace({ glyph: "arrow" })}
            onFocus={() => onFace({ glyph: "arrow" })}
            className={CHIP}
          >
            {w.sector}
          </Link>
        ))}
      </div>
      <button
        type="button"
        onClick={() => openAssistant("benim sektörümde yaptığınız işler")}
        className="self-start text-[12px] text-white/45 transition-colors hover:text-white"
      >
        Sektörün listede yok mu? Bana sor →
      </button>
    </div>
  );
}

/* --- Süreç: iş türüne göre yaklaşık süre --- */

const DURATIONS = [
  { label: "Web sitesi", total: "4–6 hafta", phases: ["Keşif 1 hf", "Tasarım 2 hf", "Yazılım 2 hf", "Yayın"] },
  { label: "E-ticaret", total: "6–8 hafta", phases: ["Keşif 1 hf", "Tasarım 2 hf", "Kurulum 3 hf", "Yayın"] },
  { label: "Marka kimliği", total: "3–4 hafta", phases: ["Keşif 1 hf", "Konsept 1 hf", "Tasarım 2 hf"] },
  { label: "Sosyal medya", total: "2 hafta", phases: ["Strateji 1 hf", "İlk içerikler 1 hf", "Sonra her ay"] },
  { label: "Reklam", total: "1 hafta", phases: ["Kurulum 3 gün", "Yayın", "Haftalık optimizasyon"] },
];

function Timeline({ onFace, onEngage }: ToolProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const item = picked !== null ? DURATIONS[picked] : null;

  if (item)
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-[16px] bg-white/[0.06] px-3.5 py-3">
          <span className={EYEBROW}>{item.label} · genelde</span>
          <span className="mt-1 block text-[22px] font-medium leading-none tracking-[-0.03em] text-white">
            {item.total}
          </span>
          <span className="mt-2 flex flex-wrap gap-x-1.5 gap-y-1 text-[12px] text-white/55">
            {item.phases.map((p, i) => (
              <span key={p}>
                {i > 0 && <span className="mr-1.5 text-white/25">→</span>}
                {p}
              </span>
            ))}
          </span>
        </div>
        <div className="flex gap-1.5">
          <Primary href={talepUrl({ konu: item.label })}>Takvimi netleştirelim</Primary>
          <Ask topic={`${item.label} süreci`} />
        </div>
        <span className="px-1">
          <Back
            onClick={() => {
              setPicked(null);
              onFace({});
            }}
          >
            Başka iş
          </Back>
        </span>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-1.5 px-1 pb-1">
      {DURATIONS.map((d, i) => (
        <button
          key={d.label}
          type="button"
          onClick={() => {
            onEngage();
            setPicked(i);
            onFace({ glyph: "check" });
          }}
          className={CHIP}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
