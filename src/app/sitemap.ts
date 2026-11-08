import type { MetadataRoute } from "next";
import { LIVE_ARTICLES } from "@/components/article/article-data";
import { FILTERS } from "@/components/feed/feed-data";
import { LEGAL_DOCS } from "@/components/legal/legal-data";
import { BALIKESIR_PATH } from "@/components/local-landing/balikesir-data";
import { SERVICE_SLUGS } from "@/components/service-page/service-page-data";
import { LIVE_WORKS } from "@/components/work/work-data";
import { SITE_URL } from "@/lib/links";

// Tüm sayfalar veri dosyalarından üretilir: yeni hizmet, çalışma ya da yazı eklenince sitemap kendiliğinden güncellenir.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/paketler",
    "/hakkimizda",
    "/iletisim",
    // Yerel açılış sayfaları (kendi rotaları var, veri dosyasından üretilmiyor)
    BALIKESIR_PATH,
    ...FILTERS.map((f) => f.href),
    ...SERVICE_SLUGS.map((slug) => `/hizmetler/${slug}`),
    // Yalnız yayındaki (live) çalışma ve yazılar; gizli olanların sayfası zaten 404
    ...LIVE_WORKS.map((w) => `/calismalar/${w.slug}`),
    ...LIVE_ARTICLES.map((a) => `/blog/${a.slug}`),
    ...LEGAL_DOCS.map((d) => d.href),
  ];
  // Yayın/güncelleme tarihi belli olan yazılar lastModified ile bildirilir
  const modified = new Map(
    LIVE_ARTICLES.filter((a) => a.published).map((a) => [`/blog/${a.slug}`, new Date(a.modified ?? a.published!)]),
  );
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    ...(modified.has(path) && { lastModified: modified.get(path) }),
  }));
}
