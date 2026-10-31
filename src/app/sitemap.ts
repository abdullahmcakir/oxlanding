import type { MetadataRoute } from "next";
import { ARTICLES } from "@/components/article/article-data";
import { FILTERS } from "@/components/feed/feed-data";
import { LEGAL_DOCS } from "@/components/legal/legal-data";
import { SERVICE_SLUGS } from "@/components/service-page/service-page-data";
import { WORKS } from "@/components/work/work-data";
import { SITE_URL } from "@/lib/links";

// Tüm sayfalar veri dosyalarından üretilir: yeni hizmet, çalışma ya da yazı eklenince sitemap kendiliğinden güncellenir.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/paketler",
    "/hakkimizda",
    "/iletisim",
    ...FILTERS.map((f) => f.href),
    ...SERVICE_SLUGS.map((slug) => `/hizmetler/${slug}`),
    ...WORKS.map((w) => `/calismalar/${w.slug}`),
    ...ARTICLES.map((a) => `/blog/${a.slug}`),
    ...LEGAL_DOCS.map((d) => d.href),
  ];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
