import type { Metadata } from "next";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { MEKANDA_FAQ } from "@/components/mekanda/mekanda-data";
import {
  MekandaControl,
  MekandaFinalCta,
  MekandaHero,
  MekandaPeek,
  MekandaPricing,
  MekandaTicker,
} from "@/components/mekanda/mekanda-page";
import { Navbar } from "@/components/navbar/navbar";
import { breadcrumbJsonLd, jsonLdHtml, pageOpenGraph, serviceJsonLd } from "@/lib/seo";

// Mekanda bir ajans hizmeti değil, OX Dijital'in dijital QR menü ürünü. Bu sayfa ürünü OX'un tasarım diliyle tanıtır ve
// mekanda.menu'ye yönlendirir; diğer hizmet sayfalarının şablonunu ([slug]) kullanmaz. Sabit segment [slug]'dan önce gelir.
// Akış: okutulabilir QR'lı hero → müşteri soruları şeridi → QR'ın arkası (gerçek görsel, devamı mekanda.menu'de) →
// işletmenin kontrolü → fiyat ve başlangıç adımları → SSS → dev mekanda.menu bağlantısı.

export const metadata: Metadata = {
  title: "Mekanda | Dijital QR Menü Sistemi ve Fiyatları - OX Dijital",
  description:
    "Mekanda ile restoran ve kafeler için dijital QR menü oluşturun. Menü, Wi-Fi, sosyal medya ve işletme bilgileri tek sayfada. 2.100 TL kurulum ve aylık 840 TL.",
  alternates: { canonical: "/hizmetler/mekanda" },
  openGraph: pageOpenGraph("/hizmetler/mekanda"),
};

const SERVICE_LD = serviceJsonLd({
  name: "Mekanda dijital QR menü",
  description: "Restoran ve kafeler için dijital QR menü: menü, Wi-Fi, sosyal medya ve işletme bilgileri tek sayfada.",
  path: "/hizmetler/mekanda",
});
const CRUMBS_LD = breadcrumbJsonLd([
  { label: "Ana sayfa", href: "/" },
  { label: "Mekanda", href: "/hizmetler/mekanda" },
]);

export default function MekandaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(SERVICE_LD)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(CRUMBS_LD)} />
      <Navbar />
      <main>
        <MekandaHero />
        <MekandaTicker />
        <MekandaPeek />
        <MekandaControl />
        <MekandaPricing />
        <Faq items={MEKANDA_FAQ} title="Merak ettiklerin." cta={null} schema />
        <MekandaFinalCta />
      </main>
      <Footer />
    </>
  );
}
