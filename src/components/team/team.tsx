import Image from "next/image";
import { Reveal } from "@/components/about/about-cards";

// Düzen referansı: kalstore.com/pages/about, "Meet the founder" bölümü: üstte ince çizgi ve küçük etiket,
// altında iki eşit sütun: solda renkli blokta büyük puntolu kısa hikâye, sağda fotoğraf.
// Kurucu sözü misyon bölümünde olduğu için burada ekip anlatılıyor.
// TÜMÜ YER TUTUCU: metin ve fotoğraf (ana sayfadaki çözüm görsellerinden biri) değişecek.

export function Team() {
  return (
    <section id="ekip" className="bg-background px-4 pb-28 pt-24 md:px-[4.5vw] md:pb-36 md:pt-32">
      <Reveal className="border-t border-black/[0.08] pt-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Ekiple tanışın</p>
      </Reveal>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        <Reveal className="flex min-h-[420px] flex-col justify-between gap-10 rounded-[28px] bg-[#1F3A0B] p-7 md:p-10 lg:min-h-[600px]">
          <div>
            <p className="text-[clamp(24px,2vw,38px)] font-medium leading-[1.2] tracking-[-0.035em] text-accent">
              OX Dijital ekibi
            </p>
            <p className="mt-2 text-[clamp(24px,2vw,38px)] font-medium leading-[1.2] tracking-[-0.035em] text-white">
              Tasarımcı, yazılımcı, reklamcı ve içerik üreticilerinden oluşan küçük ama çevik bir ekibiz. İstanbul&apos;daki
              ofisimizde her projeyi aynı masada, baştan sona birlikte yürütüyoruz.
            </p>
          </div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
            İstanbul · Tasarım · Yazılım · Reklam · İçerik
          </p>
        </Reveal>

        <Reveal index={1} className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#111] lg:min-h-[600px]">
          <Image
            src="/images/solutions/girisim.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
