import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";
import { MiniGlyph, type Glyph } from "@/components/dock/pixel-matrix";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { Marquee } from "@/components/ui/marquee";
import { SplitHeading } from "@/components/ui/section-parts";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { HOTSPOTS, MEKANDA_URL, PANEL_ACTIONS, PRICE_INCLUDES, STEPS, TICKER } from "./mekanda-data";
import { PixelQr } from "./mekanda-qr";

// Mekanda tanıtım sayfasının bölümleri. Amaç merak uyandırıp ziyaretçiyi mekanda.menu'ye göndermek; ürünün
// ayrıntılı gösterimi orada. Diğer hizmet sayfalarından ayrışan üç fikir:
// 1) Hero'da gerçekten okutulabilen QR: masaüstündeki ziyaretçi telefonuyla okutunca mekanda.menu açılır.
// 2) Müşteri sorularının kayan şeridi: ürünün çözdüğü sorunu tek bakışta anlatır.
// 3) Gerçek ürün görselinin üstünde işaretler, alt yarısı kapalı: "tamamını mekanda.menu'de gör".
// Dil OX'un: #070707/#171717 koyu yüzeyler, mono etiketler, piksel ikonlar, siyah + mavi ok butonlar.
// Mekanda'ya özgü vurgu, logosunun nane yeşili (MINT).

const MINT = "#A8CFA4";
const APPLY = talepUrl({ hizmet: "mekanda" });
const H2 = "text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em]";
const LEAD = "text-[clamp(15px,1.05vw,18px)] leading-[1.55] tracking-[-0.01em]";
const MONO = "font-mono text-[10px] font-bold uppercase tracking-[0.12em]";

/** Paket kartlarındaki buton dili: metin kutusu + mavi ok kutusu */
function ArrowButton({
  href,
  children,
  tone = "dark",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  external?: boolean;
}) {
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} className="group inline-flex items-center gap-1.5">
      <span
        className={cn(
          "flex h-12 items-center rounded-[10px] px-5 text-[15px] font-semibold tracking-[-0.02em]",
          tone === "light" ? "bg-white text-[#111]" : "bg-[#111] text-white",
        )}
      >
        {children}
      </span>
      <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
        <PixelIcon variant="arrow" className={cn("size-[10px]", external && "-rotate-45")} cellClassName="fill-accent-ink" />
      </span>
    </a>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-12 items-center rounded-[10px] border border-white/20 bg-white/[0.06] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white transition-colors hover:bg-white/[0.12]"
    >
      {children}
    </a>
  );
}

function GlyphBadge({ glyph, className }: { glyph: Glyph; className?: string }) {
  return (
    <span className={cn("grid size-10 shrink-0 place-items-center rounded-[12px] bg-accent text-accent-ink", className)}>
      <MiniGlyph glyph={glyph} cell={3} />
    </span>
  );
}

/* ───────────── 1. Hero: okutulabilir QR ───────────── */

export function MekandaHero() {
  return (
    <section className="relative overflow-hidden bg-[#070707] px-4 pb-24 pt-36 text-white md:px-[4.5vw] md:pb-32 md:pt-44">
      {/* Arkada çok silik nokta ızgarası, QR tarafına doğru belirginleşir */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:22px_22px]"
        style={{ maskImage: "radial-gradient(ellipse 55% 60% at 75% 55%, #000 0%, transparent 100%)" }}
      />
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <p className={cn(MONO, "flex items-center gap-2 text-[11px] text-neutral-400")}>
            <span className="size-1.5 rounded-full" style={{ background: MINT }} />
            Mekanda · Dijital QR menü
          </p>
          <h1 className="mt-6 max-w-[9em] text-[clamp(48px,6.4vw,120px)] font-medium leading-[0.98] tracking-[-0.055em]">
            Menüden biraz <span style={{ color: MINT }}>daha fazlası.</span>
          </h1>
          <p className={cn(LEAD, "mt-8 max-w-[34em] text-white/70")}>
            Menün, sosyal medya hesapların, Wi-Fi bilgilerin, duyuruların ve mekânına dair diğer detaylar tek bir sayfada.
            Müşterilerin QR kodu okutsun, ihtiyaç duydukları her şeye kolayca ulaşsın.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ArrowButton href={MEKANDA_URL} tone="light" external>
              mekanda.menu&apos;yu incele
            </ArrowButton>
            <GhostButton href={APPLY}>Ücretsiz görüşme</GhostButton>
          </div>
          <p className="mt-8 text-[13px] text-neutral-500">Mekanda, OX Dijital&apos;in geliştirdiği bir üründür.</p>
        </div>

        {/* Okutulabilir QR: telefonla okutunca mekanda.menu açılır; dokunmatik ekranda bağlantı olarak çalışır */}
        <Reveal index={1} className="mx-auto w-full max-w-[440px]">
          <a
            href={MEKANDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-[36px] bg-[#171717] p-1.5 outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
          >
            <div className="rounded-[30px] bg-white p-8 text-[#111] md:p-10">
              <PixelQr className="aspect-square w-full" />
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/[0.08] pt-6">
                <span>
                  <span className="block text-[17px] font-semibold tracking-[-0.02em]">
                    <span className="max-md:hidden">Telefonunla okut</span>
                    <span className="md:hidden">Dokun, aç</span>
                  </span>
                  <span className="block text-[13px] text-neutral-500">Gerçek bir Mekanda sayfası açılsın.</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#111] text-white transition-transform duration-500 group-hover:-rotate-45">
                  <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-white" />
                </span>
              </div>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── 2. Sorular şeridi ───────────── */

export function MekandaTicker() {
  return (
    <section className="relative z-10 -mt-12 overflow-hidden rounded-t-[48px] bg-background pb-28 pt-24 md:pb-36 md:pt-32">
      <div className="space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        {TICKER.map((row, ri) => (
          <Marquee key={ri} speed={ri === 0 ? 34 : 28} reverse={ri === 1}>
            {row.map((q, qi) => (
              <span
                key={q}
                className={cn(
                  "shrink-0 rounded-full px-7 py-4 text-[clamp(22px,2.4vw,40px)] font-medium tracking-[-0.035em]",
                  (qi + ri) % 2 === 0 ? "bg-[#F1F1F1] text-[#111]" : "bg-[#111] text-white",
                )}
              >
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </Marquee>
        ))}
      </div>
      <Reveal className="mt-16 px-4 text-center md:px-[4.5vw]">
        <h2 className={cn(H2, "mx-auto max-w-[16em] text-[#111]")}>
          Bu soruların cevabı <span className="text-[#A3A3A3]">zaten masada duruyor.</span>
        </h2>
        <p className={cn(LEAD, "mx-auto mt-6 max-w-[38em] text-neutral-500")}>
          İşletmelerin gün içinde tekrar tekrar cevapladığı küçük sorular var. Mekanda, bu bilgileri müşterinin kolayca ulaşabileceği
          bir yerde topluyor.
        </p>
      </Reveal>
    </section>
  );
}

/* ───────────── 3. Bir QR'ın arkasında ne var? ───────────── */

export function MekandaPeek() {
  return (
    <section className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SplitHeading strong="QR kodu okuttular." soft="Sonra ne görüyorlar?" />
        <p className={cn(LEAD, "max-w-[30em] text-neutral-500 lg:text-right")}>
          Çoğu QR menü yalnızca ürünleri ve fiyatları gösterir. Mekanda müşterinin merak edebileceği her şeyi aynı sayfada toplar.
        </p>
      </div>

      <Reveal className="mt-14">
        <div className="grid gap-1.5 rounded-[32px] bg-[#171717] p-1.5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          {/* Sol: merak cümlesi ve çıkış */}
          <div className="flex flex-col justify-between gap-12 rounded-[26px] bg-[#070707] p-7 text-white md:p-10">
            <span className={cn(MONO, "w-fit rounded-full bg-white/[0.07] px-2.5 py-1 text-white/70")}>Gerçek ürün görüntüsü</span>
            <div>
              <p className="text-[clamp(30px,3vw,52px)] font-medium leading-[1.06] tracking-[-0.045em]">
                Gerisini görmek için <span style={{ color: MINT }}>okutman yeterli.</span>
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {HOTSPOTS.map((h) => (
                  <li key={h.label} className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-white/80">
                    <span className="size-1.5 rounded-full" style={{ background: MINT }} />
                    {h.label}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ArrowButton href={MEKANDA_URL} tone="light" external>
                  Tamamını mekanda.menu&apos;de gör
                </ArrowButton>
              </div>
            </div>
          </div>

          {/* Sağ: kare ürün görseli, üstünde işaretler; alt kenar karararak kapanır (devamı mekanda.menu'de) */}
          <div className="relative aspect-square overflow-hidden rounded-[26px] bg-[#070707]">
            <Image
              src="/images/services/mekanda.png"
              alt="Mekanda müşteri sayfasının menü, Wi-Fi, duyuru, konum ve çalışma saatleri kutucuklarından oluşan görünümü"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070707] to-transparent" />
            {HOTSPOTS.map((h) => (
              <span key={h.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <span className="group/hs relative grid size-5 place-items-center">
                  <span aria-hidden className="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping" style={{ background: MINT }} />
                  <span className="relative size-3 rounded-full ring-2 ring-black/50" style={{ background: MINT }} />
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur md:block">
                    {h.label}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────── 4. İşletmenin kontrolü sende ───────────── */

/** Hakkımızda'daki mini arayüz dili: gri zemin, içinde beyaz panel, altında kalın vurgulu açıklama */
function Tile({ strong, rest, children }: { strong: string; rest: string; children: React.ReactNode }) {
  return (
    <figure>
      <div className="grid h-[260px] place-items-center rounded-[28px] bg-[#F1F1F1] p-5 md:p-6">{children}</div>
      <figcaption className="mt-5 max-w-[40ch] text-[15px] leading-[1.45] text-neutral-500">
        <b className="font-semibold text-[#111]">{strong}</b> {rest}
      </figcaption>
    </figure>
  );
}

function Panel({ title, meta, children }: { title: string; meta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[400px] rounded-[20px] bg-white p-4 text-[14px] text-[#111]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={cn(MONO, "text-neutral-400")}>{title}</span>
        {meta}
      </div>
      {children}
    </div>
  );
}

function Pill({ tone = "muted", children }: { tone?: "accent" | "green" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium",
        tone === "accent" && "bg-accent/10 text-accent",
        tone === "green" && "bg-green-600/10 text-green-700",
        tone === "muted" && "bg-[#F1F1F1] text-neutral-500",
      )}
    >
      {children}
    </span>
  );
}

export function MekandaControl() {
  return (
    <section className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <p className="flex items-center gap-3 text-[15px] tracking-[-0.01em] text-[#111]">
            <GlyphBadge glyph="gear" className="size-9 rounded-[11px]" />
            İşletmenin kontrolü sende
          </p>
          <h2 className={cn(H2, "mt-8 max-w-[11em] text-[#111]")}>Fiyat değiştiyse, menün de değişsin.</h2>
          <p className={cn(LEAD, "mt-6 max-w-[30em] text-neutral-500")}>
            Yeni ürün eklemek, fiyat güncellemek veya bir duyuru paylaşmak için her seferinde yeniden menü bastırmana gerek yok.
            Mekanda&apos;nın yönetim panelinden bilgilerini güncelleyebilirsin.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {PANEL_ACTIONS.map((a) => (
              <li key={a} className="rounded-full bg-[#F1F1F1] px-3 py-1.5 text-[13px] text-[#333]">
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal index={1}>
            <Tile strong="Fiyatı panelden güncellersin;" rest="müşterinin okuttuğu menüde yeni fiyat görünür.">
              <Panel title="Ürünü düzenle" meta={<Pill tone="green">Kaydedildi</Pill>}>
                <div className="flex items-center justify-between rounded-[12px] bg-[#F6F6F6] px-3 py-3">
                  <span>
                    <span className="block font-medium">Cappuccino</span>
                    <span className="block text-[12px] text-neutral-400">Kahveler</span>
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="text-[13px] text-neutral-400 line-through">₺120</span>
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-accent">₺135</span>
                  </span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <span className="flex-1 rounded-full border border-black/10 py-2 text-center text-[13px] text-neutral-500">Vazgeç</span>
                  <span className="flex-1 rounded-full bg-accent py-2 text-center text-[13px] font-medium text-accent-ink">Kaydet</span>
                </div>
              </Panel>
            </Tile>
          </Reveal>
          <Reveal index={2}>
            <Tile strong="Duyurunu paylaşırsın;" rest="yeni ürün ya da kampanya menüyü açan herkese görünür.">
              <Panel title="Duyuru" meta={<Pill tone="accent">Yayında</Pill>}>
                <p className="rounded-[12px] bg-[#F6F6F6] px-3 py-3 leading-[1.45]">Bu hafta yeni demleme kahvelerimiz menüde.</p>
                <div className="mt-3 flex items-center justify-between text-[13px] text-neutral-500">
                  <span>Duyuruyu göster</span>
                  <span aria-hidden className="flex h-5 w-9 items-center justify-end rounded-full bg-accent p-0.5">
                    <span className="size-4 rounded-full bg-white" />
                  </span>
                </div>
              </Panel>
            </Tile>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 5. Fiyat + nasıl başlanır (tek blok) ───────────── */

export function MekandaPricing() {
  return (
    <section id="fiyat" className="scroll-mt-28 bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <SplitHeading strong="İşletmen için Mekanda." soft="Kurulumu bir kez öde, aboneliğinle kullanmaya devam et." />

      <Reveal className="mt-14">
        <div className="rounded-[32px] bg-[#171717] p-1.5 text-white">
          {/* İki ayrı kalem: bir kez ödenen kurulum ve her ay ödenen abonelik */}
          <div className="grid gap-1.5 md:grid-cols-2">
            <div className="rounded-[26px] bg-[#070707] p-7 md:p-10">
              <span className={cn(MONO, "rounded-full bg-white/[0.07] px-2.5 py-1 text-white/70")}>Bir kez ödenir</span>
              <p className="mt-10 text-[clamp(52px,5.4vw,92px)] font-medium leading-none tracking-[-0.05em]">2.100 TL</p>
              <p className="mt-4 text-[16px] text-white/60">Tek seferlik giriş ve kurulum ücreti</p>
            </div>
            <div className="rounded-[26px] bg-[#070707] p-7 md:p-10">
              <span className={cn(MONO, "rounded-full px-2.5 py-1 text-[#0b1a0d]")} style={{ background: MINT }}>
                Her ay
              </span>
              <p className="mt-10 leading-none">
                <span className="text-[clamp(52px,5.4vw,92px)] font-medium tracking-[-0.05em]">840 TL</span>
                <span className="text-[20px] text-white/50"> / ay</span>
              </p>
              <p className="mt-4 text-[16px] text-white/60">Aylık abonelik</p>
            </div>
          </div>

          {/* Nasıl başlanır: üç kısa adım */}
          <ol className="grid gap-1.5 pt-1.5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-[26px] bg-[#070707] p-7">
                <span className="font-mono text-[12px] font-bold" style={{ color: MINT }}>
                  0{i + 1}
                </span>
                <p className="mt-3 text-[20px] font-medium tracking-[-0.025em]">{s.title}</p>
                <p className="mt-2 text-[14px] leading-[1.5] text-white/55">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-8 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8">
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {PRICE_INCLUDES.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-white/80">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/10 text-[10px]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
              <ArrowButton href={APPLY} tone="light">
                Mekanda için başvur
              </ArrowButton>
              <a
                href={MEKANDA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Özellikleri mekanda.menu&apos;da incele ↗
              </a>
            </div>
          </div>
        </div>
      </Reveal>
      <p className="mt-5 max-w-[64ch] text-[14px] leading-[1.5] text-neutral-500">
        Kurulum ve aylık abonelik ücretleri ayrı kalemlerdir. Kapsama dahil özellikler ve varsa ek hizmetler görüşmede netleştirilir.
      </p>
    </section>
  );
}

/* ───────────── 7. Son CTA: dev mekanda.menu bağlantısı ───────────── */

export function MekandaFinalCta() {
  return (
    <section data-dock="hide" className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <Reveal>
        <div className="overflow-hidden rounded-[32px] bg-[#070707] px-7 pb-10 pt-16 text-white md:px-14 md:pt-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[13em] text-[clamp(30px,3.4vw,56px)] font-medium leading-[1.06] tracking-[-0.045em]">
              Masanın üstündeki küçük kod, <span className="text-white/45">çok şey anlatabilir.</span>
            </h2>
            <GhostButton href={APPLY}>Mekanda&apos;ya başvur</GhostButton>
          </div>
          {/* Tek büyük hedef: sayfanın asıl çıkışı */}
          <a
            href={MEKANDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-14 flex items-end justify-between gap-6 border-t border-white/10 pt-8 md:mt-20"
          >
            <span className="text-[clamp(52px,12vw,220px)] font-medium leading-[0.85] tracking-[-0.06em] transition-colors duration-500 group-hover:text-[#A8CFA4]">
              mekanda.menu
            </span>
            <span className="mb-[1.5vw] grid size-[clamp(48px,6vw,104px)] shrink-0 place-items-center rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45">
              <PixelIcon variant="arrow" className="size-[28%]" cellClassName="fill-accent-ink" />
            </span>
          </a>
          <p className="mt-6 text-[14px] text-white/45">
            Menün hazır. Mekânın hazır. Şimdi hepsini müşterilerinin kolayca ulaşabileceği bir yerde toplayalım.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
