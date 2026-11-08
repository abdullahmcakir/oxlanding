import { Kalam } from "next/font/google";
import { Reveal } from "@/components/about/about-cards";
import { PixelMatrix } from "@/components/dock/pixel-matrix";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { CONTACT_EMAIL, SOCIALS, talepUrl } from "@/lib/links";
import { ContactComposer } from "./contact-composer";
import { GiantPixels } from "./giant-pixels";

// Referans: clean-tuna-722417.framer.app/contact. Koyu zemin + renkli ışıltı, ortada "Büyük işler bir merhaba
// ile başlar", altında kutular. Referanstaki iki kutu (form + görüşme) bizde üç:
// hızlı soru (WhatsApp'a hazır mesaj) · ücretsiz görüşme (ana hedef, ortada ve açık renk) · iletişim bilgileri.
// Referanstaki renkli gradient yerine sitenin piksel dili: bütün zemini kaplayan büyük kare ızgara,
// rastgele kareleri yanıp sönerek canlı durur (GiantPixels).
// Yalnız doğrulanmış bilgiler gösterilir: telefon, çalışma saatleri ve ofis adresi tanımlanınca CONTACT'a eklenir
// (yer tutucu numara / adres bilerek yok). Harita bu yüzden şimdilik yok.

const CONTACT = {
  email: CONTACT_EMAIL,
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
        {/* Ana aksiyon: HTML'de ilk (mobilde ve klavyede ilk sırada), masaüstünde ortada */}
        <Reveal index={1} className="h-full lg:order-2">
          <div className="flex h-full flex-col rounded-[28px] bg-[#F7F7F7] p-6 md:p-7">
            <div className="flex items-start justify-between">
              {/* Referanstaki kişi fotoğrafı yerine OX Piksel el sallar */}
              <span className="grid size-16 place-items-center rounded-[20px] bg-[#111]">
                <PixelMatrix glyph="smile" />
              </span>
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent-ink">
                Ücretsiz ön görüşme
              </span>
            </div>
            <h2 className="mt-7 text-[clamp(22px,1.8vw,28px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
              Önce bir tanışalım.
            </h2>
            <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
              İşini, aklındaki projeyi veya çözmek istediğin sorunu konuşalım. Neye ihtiyacın olduğunu birlikte değerlendirir, nasıl
              ilerleyebileceğimizi netleştiririz.
            </p>
            <span className="mt-4 w-fit rounded-full bg-white px-3 py-1.5 text-[13px] text-neutral-600 ring-1 ring-black/[0.06]">
              Yaklaşık 30 dakika · Ücretsiz
            </span>
            <ul className="mt-6 space-y-2.5 text-[14px] text-[#333]">
              {["Sana uygun bir görüşme saati seç.", "Projeni ve beklentilerini konuşalım.", "Sonraki adımları birlikte netleştirelim."].map(
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
                className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#111] text-[15px] font-semibold tracking-[-0.01em] text-white outline-none transition-colors hover:bg-black focus-visible:ring-4 focus-visible:ring-accent/50"
              >
                Ücretsiz görüşme planla
                <PixelIcon
                  variant="arrow"
                  className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="h-full lg:order-1">
          <div className="flex h-full flex-col rounded-[28px] bg-[#111] p-6 ring-1 ring-white/[0.08] md:p-7">
            <p className={`${LABEL} text-white/50`}>Hızlı soru</p>
            <h2 className="mt-2 text-[20px] font-medium leading-[1.2] tracking-[-0.025em] text-white">Bir şey mi soracaktın?</h2>
            <p className="mb-6 mt-2 text-[14px] leading-[1.5] text-white/55">
              Projenle ilgili bir detay olabilir, yalnızca fiyat öğrenmek istiyor olabilirsin. Aklındakini yaz, WhatsApp üzerinden
              konuşalım.
            </p>
            <ContactComposer />
          </div>
        </Reveal>

        <Reveal index={2} className="h-full lg:order-3">
          {/* Düz zemin: cam (backdrop-blur) arkadaki yanan kareleri bulanık yuvarlak lekeye çeviriyordu */}
          <div className="flex h-full flex-col rounded-[28px] bg-[#161616] p-6 text-white ring-1 ring-white/10 md:p-7">
            <p className={`${LABEL} text-white/50`}>İletişim bilgileri</p>
            <dl className="mt-5 text-[15px] tracking-[-0.01em]">
              <dt className="text-[13px] text-white/50">E-posta</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="rounded-sm text-[clamp(17px,1.3vw,20px)] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {CONTACT.email}
                </a>
              </dd>
            </dl>

            {/* Kartlar eşit boyda: sosyal medya kartın dibinde, e-postayla arası boş kalır */}
            <p className="mt-8 text-[13px] text-white/50 lg:mt-auto">Sosyal medya</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {CONTACT.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full bg-white/10 px-3.5 py-2 text-[13px] text-white/80 outline-none transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-accent/60"
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
