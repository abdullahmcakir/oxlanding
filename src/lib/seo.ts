import { SITE_URL } from "@/lib/links";

// Yapısal veri (JSON-LD) yardımcıları. Kurum bilgisi (Organization) layout.tsx'te; sayfalar buradaki
// yardımcılarla kendi Service / BlogPosting / BreadcrumbList / FAQPage verisini ekler.
// Kural: şemaya yalnız sayfada görünen ve doğrulanmış bilgi girer (adres, puan, yorum yok).

/** Göreli yolu sitenin tam adresine çevirir: "/blog" → "https://oxdijital.com/blog" */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/** layout.tsx'teki Organization ile aynı varlığa bağlanmak için (@id) */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const ORGANIZATION_REF = { "@type": "Organization", "@id": ORGANIZATION_ID, name: "OX Dijital", url: SITE_URL };

export type Crumb = { label: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

/**
 * Hizmet sayfaları için Service: yalnız sayfada görünen ad ve açıklama, sağlayıcı olarak kurum (@id ile).
 * Fiyat, puan, bölge eklenmez; bunlar sayfada doğrulanmış olarak görünmüyorsa şemaya da girmez.
 */
export function serviceJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: ORGANIZATION_REF,
  };
}

/** Görünür SSS metniyle birebir aynı soru-cevaplar (zengin sonuç gösterimi Google'ın kararı, garanti değil) */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** <script type="application/ld+json"> içeriği: "<" kaçırılır (Next.js JSON-LD rehberindeki XSS önlemi) */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
