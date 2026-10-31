import type { Metadata } from "next";
import { AboutBeliefs } from "@/components/about-page/about-beliefs";
import { AboutCandor } from "@/components/about-page/about-candor";
import { AboutDisciplines } from "@/components/about-page/about-disciplines";
import { AboutLetter } from "@/components/about-page/about-letter";
import { AboutShowcase } from "@/components/about-page/about-showcase";
import { Cta } from "@/components/cta/cta";
import { Footer } from "@/components/footer/footer";
import { Mission } from "@/components/mission/mission";
import { Navbar } from "@/components/navbar/navbar";
import { PageHero } from "@/components/page-hero/page-hero";
import { Process } from "@/components/process/process";
import { Statement } from "@/components/statement/statement";

export const metadata: Metadata = {
  title: "Hakkımızda · OX Dijital",
  description: "İstanbul merkezli dijital ajans. Reklam, tasarım ve yazılım tek çatı altında.",
  alternates: { canonical: "/hakkimizda" },
};

// Yaklaşım: yeni kurulmuş bir marka kendini (rakam, kadro, tarihçe) değil, duruşunu anlatır.
// Akış: ne için varız (misyon) → kurucunun imzalı yaklaşım mektubu → tek masada neler yürür (kaydırmalı kartlar) →
// neye inanıyoruz (ilkeler) → sözün somut hali (OX Panel + ölçüm mini arayüzleri) →
// birlikte nasıl çalışırız (süreç) → ne yaparız / ne yapmayız (net olalım) → nereye gidiyoruz (vizyon, fotoğraf üstünde).
// Ekip (components/team), rakam / kilometre taşı / ofis ve kendi ürünlerimiz bölümleri bu yüzden bilerek yok
// (ürünlerin kendi sayfaları var).
// Resmî şirket bilgileri footer ve yasal sayfalarda (about-data.ts COMPANY).
// Başlık, metinler ve görseller YER TUTUCU.
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
        <AboutLetter />
        <AboutDisciplines />
        <AboutBeliefs />
        <AboutShowcase />
        <Process />
        <AboutCandor />
        {/* Kapanış: fotoğrafın üstünde vizyon cümlesi */}
        <Statement />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
