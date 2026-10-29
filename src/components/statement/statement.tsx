import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";

// Düzen referansı: kalstore.com/pages/about, "Take notes like a human." bölümü:
// tam genişlikte tek fotoğraf, sol altında kısa bir cümle. Bilerek sade: kart yok, yalnız giriş animasyonu.
// Fotoğraf YER TUTUCU (ilkeler görsellerinden biri); yatay, koyu tonlu bir fotoğraf gelince değişecek.

export function Statement() {
  return (
    // Süreç bölümünün üstüne, misyondaki gibi yuvarlak köşeli bir sayfa olarak biner.
    <section className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 pt-16 md:px-[4.5vw] md:pt-24">
      <Reveal className="relative h-[clamp(480px,78svh,860px)] overflow-hidden rounded-[28px] bg-[#111]">
        <Image
          src="/images/principles/kurgu.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        {/* Yazı sol altta; fotoğraf açık tonlu olsa da okunsun */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="max-w-[16em] text-[clamp(28px,2.8vw,52px)] font-medium leading-[1.12] tracking-[-0.04em] text-white">
            Sözden eyleme geçtiğimiz yer.
            <span className="block text-white/60">Hiçbir şeyi tesadüfe bırakmıyoruz.</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
