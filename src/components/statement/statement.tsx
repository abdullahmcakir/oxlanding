import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";
import { VISION } from "@/components/about-page/about-data";

// Düzen referansı: kalstore.com/pages/about, "Take notes like a human." bölümü:
// tam genişlikte tek fotoğraf, sol altında kısa bir cümle. Bilerek sade: kart yok, yalnız giriş animasyonu.
// Hakkımızda'nın kapanışı: fotoğrafın üstünde vizyon cümlesi (tek başına cümlesiz fotoğraf süs gibi kalıyordu,
// ayrı bir vizyon bölümü de sade duruyordu; ikisi birleşti).
// Fotoğraf YER TUTUCU (ilkeler görsellerinden biri); yatay, koyu tonlu bir fotoğraf gelince değişecek.

export function Statement() {
  return (
    <section className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <Reveal className="relative h-[clamp(480px,78svh,860px)] overflow-hidden rounded-[28px] bg-[#111]">
        <Image
          src="/images/principles/kurgu.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        {/* Yazı sol altta; fotoğraf açık tonlu olsa da okunsun */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-tr from-black/75 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">Vizyonumuz</p>
          <p className="mt-5 max-w-[16em] text-[clamp(30px,3.4vw,64px)] font-medium leading-[1.06] tracking-[-0.045em] text-white">
            {VISION}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
