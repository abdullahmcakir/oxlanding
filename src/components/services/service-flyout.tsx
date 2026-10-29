"use client";

import Image from "next/image";
import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLenis } from "lenis/react";
import { talepUrl } from "@/lib/links";
import type { ItemKind, Service } from "./services-data";

// Kaynak: OX Dijital müşteri paneli "Paket" flyout'u (paket-flyout-handoff.md).
// Görünüm ve metinler birebir; yalnızca bu projenin yığınına uyarlandı
// (lucide yerine satır içi SVG, <img> yerine next/image).
// Landing farkı: Cal.com takvim paneli yok; CTA müşteri panelindeki "yeni talep" sayfasına gider.

/** Kalem tipinin müşteriye ne ifade ettiği. */
const KIND_META: Record<ItemKind, { label: string; blurb: string; color: string }> = {
  hizmet: {
    label: "Hizmetler",
    blurb: "Ekibimizin sizin için ürettiği işler",
    color: "#fde68a",
  },
  modül: {
    label: "Otomasyonlar",
    blurb: "Kurulup arka planda çalışan modüller",
    color: "#bbf7d0",
  },
  uygulama: {
    label: "Uygulamalar",
    blurb: "Sizin adınıza kurulan yazılımlar",
    color: "#a5b4fc",
  },
};

const KIND_ORDER: ItemKind[] = ["hizmet", "modül", "uygulama"];

/** Landing sürümü: ziyaretçinin henüz paneli yok. */
const NEXT_STEPS = [
  "Uygun bir saat seçersiniz, ekibimiz sizi arar.",
  "Görüşmede paketi ihtiyacınıza göre birlikte şekillendiririz.",
  "Kapsam netleşince size bir teklif ve müşteri paneli erişimi gönderiyoruz.",
  "Ödeme sonrası kalemler tek tek açılır, ilerlemeyi panelden takip edersiniz.",
];

/* ─────────────────────── Ortak panel kabuğu ─────────────────────── */

/**
 * Sağdan açılan panel. Radix Dialog: ESC, overlay tıklaması, focus trap ve scroll kilidi hazır.
 * `returnFocusTo`: kontrollü açıldığı için (Dialog.Trigger yok) kapanınca odak elle karta döner.
 */
function SidePanel({
  open,
  onOpenChange,
  title,
  className = "",
  style,
  closeClassName = "text-white/70 hover:text-white",
  returnFocusTo,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  closeClassName?: string;
  returnFocusTo?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  // Panel açıkken sayfanın yumuşak kaydırması durur (Radix'in kaydırma kilidi Lenis'i durdurmuyor)
  const lenis = useLenis();
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ox-overlay fixed inset-0 z-[60] bg-black/80" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            if (!returnFocusTo?.current) return;
            e.preventDefault();
            returnFocusTo.current.focus();
          }}
          className={`ox-panel fixed inset-y-0 right-0 z-[60] flex h-full w-full flex-col overflow-hidden shadow-lg focus:outline-none ${className}`}
          style={style}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            className={`absolute right-4 top-4 z-10 rounded-sm transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${closeClassName}`}
          >
            <Icon className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </Icon>
            <span className="sr-only">Kapat</span>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ─────────────────────────── Detay paneli (koyu) ─────────────────────────── */

export function ServiceFlyout({
  service,
  open,
  onOpenChange,
  returnFocusTo,
}: {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusTo?: React.RefObject<HTMLElement | null>;
}) {
  if (!service) return null;

  const groups = KIND_ORDER.map((kind) => ({
    kind,
    meta: KIND_META[kind],
    list: service.items.filter((i) => i.kind === kind),
  })).filter((g) => g.list.length > 0);

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title={service.title}
      returnFocusTo={returnFocusTo}
      className="text-white sm:max-w-[560px]"
      style={{
        background: `
          radial-gradient(at 10% 0%, rgba(253, 230, 138, 0.22) 0%, transparent 45%),
          radial-gradient(at 90% 8%, rgba(120, 53, 15, 0.55) 0%, transparent 50%),
          radial-gradient(at 50% 104%, rgba(253, 230, 138, 0.14) 0%, transparent 55%),
          linear-gradient(160deg, #14110d 0%, #0c0a08 60%, #060505 100%)
        `,
      }}
    >
      {/* Hero */}
      <div className="relative h-52 w-full flex-shrink-0">
        <Image src={service.image} alt="" fill sizes="(min-width: 640px) 560px, 100vw" quality={85} className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(12,10,8,0.75) 55%, #0c0a08 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
            style={{ background: "#fde68a", color: "#78350f" }}
          >
            Paket · {service.items.length} kalem
          </span>
          <h2
            className="mt-2.5 text-[30px] font-light leading-tight text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            {service.title}
          </h2>
          <p className="mt-1 text-[12.5px] text-white/60">{service.tagline}</p>
        </div>
      </div>

      {/* data-lenis-prevent: Lenis bu alanın tekerlek olaylarını yutmasın, liste kendi içinde kaysın */}
      {/* Kaydırma çubuğu koyu panele uygun: ince, yarı saydam (Windows'ta beyaz sistem çubuğu çıkıyordu) */}
      <div
        data-lenis-prevent
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5 [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin]"
      >
        <p className="text-[14px] leading-relaxed text-white/75">{service.description}</p>

        {/* KAPSAM — tipine göre gruplu. Satırlarda ikon / "dahil" rozeti bilerek yok; tek vurgu grubun rengi. */}
        {groups.map((g) => (
          <div key={g.kind} className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase" style={{ color: g.meta.color }}>
                {g.meta.label}
              </span>
              <span className="text-[11px] text-white/35">{g.list.length} kalem</span>
            </div>
            <p className="mt-1 text-[11.5px] leading-snug text-white/40">{g.meta.blurb}</p>

            <div
              className="mt-3 overflow-hidden rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "0.5px solid rgba(255,255,255,0.09)",
              }}
            >
              {g.list.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderTop: i === 0 ? "none" : "0.5px solid rgba(255,255,255,0.07)" }}
                >
                  <span
                    className="h-4 w-1 flex-shrink-0 rounded-full"
                    style={{ background: g.meta.color, opacity: 0.7 }}
                  />
                  <span className="text-[14.5px] leading-snug text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Fiyat neden yok — söylenmezse "gizleniyor" hissi veriyor. */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "rgba(253,230,138,0.08)",
            border: "0.5px solid rgba(253,230,138,0.22)",
          }}
        >
          <p className="text-[13px] font-semibold" style={{ color: "#fde68a" }}>
            Fiyat kapsama göre belirleniyor
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">
            Paket sabit değil: kalemlerin bir kısmını çıkarabilir, başkalarını ekleyebilirsiniz.
            Görüşmede ihtiyacınıza göre netleştirip size teklif gönderiyoruz.
          </p>
        </div>

        <div className="px-1">
          <p className="mb-3 text-[10px] font-medium uppercase text-white/40">Sonra ne oluyor?</p>
          <ol className="space-y-2.5">
            {NEXT_STEPS.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[12.5px] leading-snug text-white/60">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CTA altta sabit: liste uzadıkça kaybolmasın. */}
      <div
        className="flex-shrink-0 px-6 pb-6 pt-4"
        style={{ background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <a
          href={talepUrl({ hizmet: service.slug })}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[13.5px] font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: "#fde68a", color: "#78350f", boxShadow: "0 6px 20px rgba(253,230,138,0.25)" }}
        >
          Paketi Konuşalım
          <Icon className="h-4 w-4" strokeWidth={2}>
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </Icon>
        </a>
        <p className="mt-2.5 text-center text-[11px] text-white/40">Görüşme ~30 dakika · bağlayıcı değil</p>
      </div>
    </SidePanel>
  );
}

function Icon({
  className,
  strokeWidth = 2,
  children,
}: {
  className?: string;
  strokeWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}
