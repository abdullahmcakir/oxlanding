// /calismalar: çalışmalar, blog yazıları ve hizmetler tek akışta.
// Düzen referansı: clean-tuna-722417.framer.app/work (3 sütunlu bento ızgara).
// Çalışma kartları /calismalar/[slug] (work-data.ts), blog kartları /blog/[slug] (article-data.ts) sayfalarına bağlı.
// Kart ancak bağlandığı çalışma / yazı yayındaysa (live) görünür: içerik orada açılınca kart da kendiliğinden gelir.
// Müşteri yorumu ve müşteri listesi kartları kaldırıldı (gerçek yorum yok); gerçekleri gelince yeniden eklenebilir.

import { LIVE_ARTICLES } from "@/components/article/article-data";
import { LIVE_WORKS } from "@/components/work/work-data";

export type FeedCard =
  // Görselli kart: hover'da görsel bulanıklaşır, başlık ortada belirir. short: blog kartı boyunda
  | { type: "image"; label: "Çalışma" | "Blog"; tag: string; title: string; image: string; short?: boolean; href?: string }
  // Görselsiz blog kartı
  | { type: "post"; tag: string; title: string; meta: string; href?: string }
  | { type: "services" };

// Filtre sekmeleri. Hizmetler kartı bir türe ait değil; yalnızca "Tümü"de görünür.
// Her filtre kendi adresi, başlığı ve açıklaması olan gerçek bir sayfa (SEO: Google ayrı ayrı indeksler).
// /calismalar/projeler statik rota olduğu için /calismalar/[slug]'dan önce eşleşir; bir çalışmaya "projeler"
// slug'ı verilmemeli.
export const FILTERS = [
  {
    key: "tumu",
    label: "Tümü",
    href: "/calismalar",
    title: "Çalışmalar & yazılar",
    description: "Markalar için ürettiğimiz işler ve blog yazılarımız tek sayfada.",
  },
  {
    key: "calisma",
    label: "Çalışmalar",
    href: "/calismalar/projeler",
    title: "Çalışmalar",
    description: "Website, branding, e-ticaret ve SEO projelerimizden seçkiler: problem, çözüm ve süreç.",
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
    title: "Blog",
    description: "Reklam, tasarım, SEO ve web sitesi üzerine uygulanabilir yazılar.",
  },
] as const;

export function filterOf(key: string) {
  return FILTERS.find((f) => f.key === key) ?? FILTERS[0];
}

export type FeedFilter = (typeof FILTERS)[number]["key"];

// Her türün piksel ikonu: kart rozetlerinde ve filtre sekmelerinde aynı ikon kullanılır.
export const FILTER_ICON = { calisma: "frame", blog: "lines" } as const;

export function categoryOf(card: FeedCard): Exclude<FeedFilter, "tumu"> | null {
  if (card.type === "image") return card.label === "Çalışma" ? "calisma" : "blog";
  if (card.type === "post") return "blog";
  return null;
}

// Yayındaki çalışma ve yazıların adresleri: kartın görünüp görünmeyeceği buna bakar
const LIVE_HREFS = new Set([
  ...LIVE_WORKS.map((w) => `/calismalar/${w.slug}`),
  ...LIVE_ARTICLES.map((a) => `/blog/${a.slug}`),
]);

/** İçerik kartı yalnız bağlandığı çalışma / yazı yayındaysa görünür; hizmetler kartı her zaman. */
export function isLiveCard(card: FeedCard) {
  if (card.type === "image" || card.type === "post") return !!card.href && LIVE_HREFS.has(card.href);
  return true;
}

export const HAS_LIVE_WORKS = LIVE_WORKS.length > 0;

// Sütunlar elle dengelenir (masonry): her sütunun kart yükseklikleri toplamı eşit olmalı.
// Yükseklikler: image 620 · post / kısa image 370 · services 230
// "Tümü" bu düzeni yalnız içindeki bütün kartlar yayındayken kullanır (BENTO_READY); bir kart bile gizliyse
// denge bozulacağı için eşit yükseklikli düz ızgaraya geçer. Gerçek içerik gelince sütunları yeniden dengele.
export const FEED_COLUMNS: FeedCard[][] = [
  [
    // Okuma süresi yazının kelime sayısından hesaplanır (article-data.ts readingMinutes); yazı değişirse burayı da güncelle
    { type: "post", tag: "Web Tasarım", title: "Balıkesir web sitesi fiyatları 2026: web sitesi yaptırma rehberi", meta: "10 dk okuma · 3 Kasım 2026", href: "/blog/balikesir-web-sitesi-fiyatlari-2026" },
    { type: "image", label: "Çalışma", tag: "E-ticaret", title: "Moda Markası", image: "/images/services/e-ticaret.png", href: "/calismalar/moda-markasi" },
    { type: "image", label: "Blog", tag: "Sosyal medya", title: "Reels mi carousel mı?", image: "/images/services/sosyal-medya.png", short: true, href: "/blog/reels-mi-carousel-mi" },
  ],
  [
    { type: "image", label: "Çalışma", tag: "Website", title: "Teknoloji Girişimi", image: "/images/services/website.webp", href: "/calismalar/teknoloji-girisimi" },
    { type: "services" },
    { type: "image", label: "Blog", tag: "Tasarım", title: "Landing page dönüşümünü artırmanın 7 yolu", image: "/images/solutions/kobi.webp", short: true, href: "/blog/landing-page-donusum" },
    { type: "image", label: "Blog", tag: "Otomasyon", title: "Tekrar eden işleri otomatiğe almak", image: "/images/services/otomasyon.png", href: "/blog/tekrar-eden-isleri-otomatige-almak" },
  ],
  [
    { type: "image", label: "Çalışma", tag: "Branding", title: "Kafe Zinciri", image: "/images/services/branding.png", href: "/calismalar/kafe-zinciri" },
    { type: "post", tag: "SEO", title: "Küçük işletmeler için SEO: ilk 90 günde ne yapmalı?", meta: "6 dk okuma · 29 Eylül 2026", href: "/blog/kucuk-isletmeler-icin-seo" },
    { type: "image", label: "Çalışma", tag: "Mekanda", title: "Butik Otel", image: "/images/services/mekanda.png", href: "/calismalar/butik-otel" },
  ],
];

// Dengeli bento'ya sığmayan kartlar: "Tümü"de görünmez ama filtreli listelerde (ör. /blog) ve sayaçlarda yer alır.
// Yeni bir yazı bento'da bir kartın yerini aldığında yerinden çıkan kart buraya taşınır.
const OVERFLOW: FeedCard[] = [
  { type: "post", tag: "Reklam", title: "2026'da Meta reklamlarında işe yarayan 5 strateji", meta: "9 dk okuma · 14 Ekim 2026", href: "/blog/meta-reklam-stratejileri" },
];

// Satır sırası (soldan sağa, yukarıdan aşağı): filtreli ızgara bu sırayla dizilir; ilk kartlar "en yeni" sayılır.
// Yalnız yayındaki kartlar.
const ROWS = Math.max(...FEED_COLUMNS.map((c) => c.length));
export const READING_ORDER = [
  ...Array.from({ length: ROWS }, (_, r) => FEED_COLUMNS.map((c) => c[r]))
    .flat()
    .filter(Boolean),
  ...OVERFLOW,
].filter(isLiveCard);

/** Elle dengelenmiş bento ancak içindeki her kart yayındaysa kullanılır */
export const BENTO_READY = FEED_COLUMNS.flat().every(isLiveCard);

export type FeedItem = Extract<FeedCard, { type: "image" | "post" }>;

// Navbar'ın Çalışmalar paneli: akıştaki en yeni 3 paylaşım (çalışma ya da blog).
// İçlerinde çalışma yoksa ve yayında bir çalışma varsa sonuncusu en yeni çalışmayla değişir.
const ITEMS = READING_ORDER.filter((c): c is FeedItem => categoryOf(c) !== null);
const firstThree = ITEMS.slice(0, 3);
const firstWork = ITEMS.find((c) => categoryOf(c) === "calisma");
export const LATEST_ITEMS: FeedItem[] =
  firstWork && !firstThree.includes(firstWork) ? [...firstThree.slice(0, 2), firstWork] : firstThree;
