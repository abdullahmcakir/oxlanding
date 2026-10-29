import type { Metadata } from "next";
import { Cta } from "@/components/cta/cta";
import { Footer } from "@/components/footer/footer";
import { Mission } from "@/components/mission/mission";
import { Navbar } from "@/components/navbar/navbar";
import { PageHero } from "@/components/page-hero/page-hero";
import { Process } from "@/components/process/process";
import { Statement } from "@/components/statement/statement";
import { Team } from "@/components/team/team";

export const metadata: Metadata = {
  title: "Hakkımızda · OX Dijital",
  description: "İstanbul merkezli dijital ajans. Reklam, tasarım ve yazılım tek çatı altında.",
};

// Başlık ve metin YER TUTUCU; gerçek içerikle değiştirilecek.
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          title={["Dijitalde büyümenin", "yeni standardı"]}
          description="Strateji, yaratıcılık ve teknolojiyi bir araya getirerek markaların dijitalde daha görünür ve daha etkili olmasını sağlıyoruz."
          image="/images/page-hero/hakkimizda.jpg"
          cutout="/images/page-hero/hakkimizda-cutout.png"
          aspect={4 / 3}
          // Paraşüt fotoğrafın %62–73'ünde: üst ~üçte biri şeritte kalır, kalanı koyu alana sarkar
          // ve ucu başlığın ilk satırının üst yarısına biner.
          anchor={0.65}
          titleAnchor={0.69}
          meta="Hakkımızda · İstanbul, TR"
          scrollTarget="#misyon"
        />
        <Mission />
        <Process />
        {/* İlkeler bölümü (components/principles) denendi, yerine fotoğraf + cümle ve ekip bloğu kondu */}
        <Statement />
        <Team />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
