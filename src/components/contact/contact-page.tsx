import { Kalam } from "next/font/google";
import { Reveal } from "@/components/about/about-cards";
import { MiniGlyph, PixelMatrix } from "@/components/dock/pixel-matrix";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { SOCIALS, talepUrl } from "@/lib/links";
import { ContactComposer } from "./contact-composer";
import { GiantPixels } from "./giant-pixels";

// Referans: clean-tuna-722417.framer.app/contact. Koyu zemin + renkli ışıltı, ortada "Büyük işler bir merhaba
// ile başlar", altında kutular. Referanstaki iki kutu (form + görüşme) bizde üç:
// hızlı soru (WhatsApp'a hazır mesaj) · ücretsiz görüşme (ana hedef, ortada ve açık renk) · iletişim bilgileri.
// Referanstaki renkli gradient yerine sitenin piksel dili: bütün zemini kaplayan büyük kare ızgara,
// rastgele kareleri yanıp sönerek canlı durur (GiantPixels).
// Harita gömülmez (sayfa açılır açılmaz Google'a veri gitmesin, çerez onayı gerekmesin): piksel harita + bağlantı.
// Telefon ve adres YER TUTUCU.

const CONTACT = {
  email: "merhaba@oxdijital.com",
  phone: "+90 (500) 000 00 00",
  phoneHref: "tel:+905000000000",
  address: "Örnek Mah. Örnek Cad. No: 1, İstanbul",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Istanbul",
  hours: "Hafta içi 09:00–18:00",
  socials: SOCIALS,
};

const LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.12em]";

// Referanstaki el yazısı "merhaba": yalnız bu sayfada yüklenir (next/font, import edildiği yerde)
const kalam = Kalam({ weight: "400", subsets: ["latin"] });

export function ContactPage() {
  return (
    <section data-dock="hide" className="relative isolate min-h-[100svh] overflow-hidden bg-[#070707] px-4 pb-20 pt-[132px] md:px-[4.5vw] md:pt-[150px]">
      {/* Bütün zemini kaplayan piksel ızgarası, rastgele kareler yanıp söner. Başka katman yok:
          yuvarlak ışıltı, koyulaşma ve gren dokusu ızgaranın üstünde leke / toz gibi duruyordu. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <GiantPixels className="absolute inset-x-1.5 top-1.5" />
      </div>

      <header className="mx-auto max-w-[900px] text-center">
        <p className={`${LABEL} text-white/50`}>İletişim</p>
        <h1 className="mt-5 text-[clamp(40px,4.6vw,76px)] font-medium leading-[1.04] tracking-[-0.05em] text-white">
          Büyük işler
          <span className="block">
            bir <em className={`${kalam.className} px-1 not-italic tracking-normal text-accent`}>merhaba</em> ile başlar.
          </span>
        </h1>
      </header>

      <div className="mx-auto mt-12 grid max-w-[1200px] gap-3 md:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <Reveal className="h-full">
          <div className="flex h-full flex-col rounded-[28px] bg-[#111] p-6 ring-1 ring-white/[0.08] md:p-7">
            <p className={`${LABEL} text-white/50`}>Hızlı soru</p>
            <p className="mb-6 mt-2 text-[20px] font-medium leading-[1.2] tracking-[-0.025em] text-white">
              Aklındakini yaz, hemen dönelim.
            </p>
            <ContactComposer />
          </div>
        </Reveal>

        <Reveal index={1} className="h-full">
          <div className="flex h-full flex-col rounded-[28px] bg-[#F7F7F7] p-6 md:p-7">
            <div className="flex items-start justify-between">
              {/* Referanstaki kişi fotoğrafı yerine OX Piksel el sallar */}
              <span className="grid size-16 place-items-center rounded-[20px] bg-[#111]">
                <PixelMatrix glyph="smile" />
              </span>
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                Önerilen
              </span>
            </div>
            <p className="mt-7 text-[clamp(20px,1.6vw,24px)] leading-[1.25] tracking-[-0.025em] text-[#111]">
              <span className="font-medium">Konuşarak mı ilerleyelim?</span>{" "}
              <span className="text-neutral-500">
                Ücretsiz online görüşmede projeni dinleyelim, yol haritanı birlikte çizelim.
              </span>
            </p>
            <span className="mt-4 w-fit rounded-full bg-white px-3 py-1.5 text-[13px] text-neutral-600 ring-1 ring-black/[0.06]">
              yaklaşık 30 dakika · bağlayıcı değil
            </span>
            <ul className="mt-6 space-y-2.5 text-[14px] text-[#333]">
              {["OX Panel'den sana uyan saati seç", "İhtiyacını ve hedefini konuşalım", "Görüşme sonunda net bir plan al"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span aria-hidden className="size-[6px] bg-[#111]" />
                    {t}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-auto pt-8">
              <a
                href={talepUrl()}
                className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#111] text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors hover:bg-black"
              >
                Ücretsiz görüşme ayarla
                <PixelIcon
                  variant="arrow"
                  className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal index={2} className="h-full">
          {/* Düz zemin: cam (backdrop-blur) arkadaki yanan kareleri bulanık yuvarlak lekeye çeviriyordu */}
          <div className="flex h-full flex-col rounded-[28px] bg-[#161616] p-6 text-white ring-1 ring-white/10 md:p-7">
            <p className={`${LABEL} text-white/50`}>İletişim bilgileri</p>
            <dl className="mt-5 space-y-4 text-[15px] tracking-[-0.01em]">
              <div>
                <dt className="text-[13px] text-white/50">E-posta</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`} className="underline-offset-4 hover:underline">
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-white/50">Telefon</dt>
                <dd>
                  <a href={CONTACT.phoneHref} className="tabular-nums underline-offset-4 hover:underline">
                    {CONTACT.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-white/50">Çalışma saatleri</dt>
                <dd>{CONTACT.hours}</dd>
              </div>
            </dl>

            {/* Piksel harita: gömülü harita yerine; tıklayınca Google Haritalar'da açılır */}
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 block overflow-hidden rounded-[20px] ring-1 ring-white/10"
            >
              <span
                className="relative grid h-[120px] place-items-center bg-[#0d0d0d]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgb(255 255 255 / 0.12) 1px, transparent 1.2px)",
                  backgroundSize: "12px 12px",
                }}
              >
                <span className="transition-transform duration-500 group-hover:-translate-y-1">
                  <MiniGlyph glyph="pin" cell={7} className="text-accent" />
                </span>
              </span>
              <span className="flex items-center justify-between gap-3 bg-white/[0.04] px-4 py-3 text-[13px]">
                <span className="text-white/80">{CONTACT.address}</span>
                <span className="shrink-0 text-white/50 transition-colors group-hover:text-white">Haritada aç ↗</span>
              </span>
            </a>

            <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
              {CONTACT.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full bg-white/10 px-3.5 py-2 text-[13px] text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
