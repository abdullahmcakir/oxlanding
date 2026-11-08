import type { Metadata } from "next";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import {
  BALIKESIR_META,
  BALIKESIR_PATH,
  FAQ,
  HERO,
  WEBSITE_START_PRICE,
} from "@/components/local-landing/balikesir-data";
import { BalikesirHero } from "@/components/local-landing/balikesir-hero";
import {
  BalikesirFinalCta,
  BalikesirPricing,
  BalikesirProcess,
  BalikesirSectors,
  BalikesirSolutions,
  BalikesirWhy,
  BalikesirWhyOx,
} from "@/components/local-landing/balikesir-sections";
import { Navbar } from "@/components/navbar/navbar";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, jsonLdHtml, ORGANIZATION_REF, type Crumb } from "@/lib/seo";

// Balıkesir'e yönelik web sitesi hizmet sayfası (yerel SEO açılış sayfası). İçerik balikesir-data.ts'te.
// Kardeş sayfası fiyat rehberi: /blog/balikesir-web-sitesi-fiyatlari-2026 (karşılıklı bağlantılı).

const OG_IMAGE = { url: "/images/og/balikesir-web-sitesi.png", width: 1200, height: 630, alt: "Balıkesir web sitesi ve web tasarım hizmetleri · OX Dijital" };

export const metadata: Metadata = {
  title: BALIKESIR_META.title,
  description: BALIKESIR_META.description,
  alternates: { canonical: BALIKESIR_PATH },
  // openGraph nesnesi kökteki varsayılanı tümüyle ezer: siteName, locale ve görsel burada yeniden veriliyor
  openGraph: {
    type: "website",
    url: BALIKESIR_PATH,
    siteName: "OX Dijital",
    locale: "tr_TR",
    title: BALIKESIR_META.title,
    description: BALIKESIR_META.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: BALIKESIR_META.title,
    description: BALIKESIR_META.description,
    images: [OG_IMAGE.url],
  },
};

const CRUMBS: Crumb[] = [
  { label: "Ana sayfa", href: "/" },
  { label: "Balıkesir web sitesi", href: BALIKESIR_PATH },
];

// Yalnız doğrulanmış bilgi: hizmet türü, sağlayıcı (kurum @id ile), hizmet bölgesi ve sitedeki başlangıç fiyatı.
// Adres, puan, yorum, LocalBusiness yok (fiziksel ofis doğrulanmadı).
const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${absoluteUrl(BALIKESIR_PATH)}#service`,
  name: "Balıkesir web sitesi tasarımı",
  serviceType: "Web tasarım ve web sitesi geliştirme",
  description: HERO.description,
  url: absoluteUrl(BALIKESIR_PATH),
  provider: ORGANIZATION_REF,
  areaServed: [
    { "@type": "AdministrativeArea", name: "Balıkesir" },
    { "@type": "Country", name: "Türkiye" },
  ],
  availableChannel: { "@type": "ServiceChannel", serviceUrl: absoluteUrl("/iletisim") },
  ...(WEBSITE_START_PRICE && {
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "PriceSpecification",
        // "3.499 TL" → 3499 (başlangıç fiyatı; net fiyat kapsama göre)
        minPrice: Number(WEBSITE_START_PRICE.replace(/[^\d]/g, "")),
        priceCurrency: "TRY",
      },
    },
  }),
};

export default function BalikesirWebSitesiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(SERVICE_LD)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(CRUMBS))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd(FAQ))} />
      <Navbar />
      <main>
        <BalikesirHero crumbs={CRUMBS} />
        <BalikesirWhy />
        <BalikesirSolutions />
        <BalikesirSectors />
        <BalikesirProcess />
        <BalikesirPricing />
        <BalikesirWhyOx />
        <Faq items={FAQ} title="Sık sorulan sorular." cta={null} />
        <BalikesirFinalCta />
      </main>
      <Footer />
    </>
  );
}
