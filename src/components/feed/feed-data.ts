// /calismalar: çalışmalar, blog yazıları, yorumlar ve hizmetler tek akışta.
// Düzen referansı: clean-tuna-722417.framer.app/work (3 sütunlu bento ızgara).
// TÜMÜ YER TUTUCU: başlıklar, müşteri adları, yorumlar ve görseller gerçek içerikle değiştirilecek.
// Çalışma kartları /calismalar/[slug] (work-data.ts), blog kartları /blog/[slug] (article-data.ts) sayfalarına bağlı.

export type FeedCard =
  // Görselli kart: hover'da görsel bulanıklaşır, başlık ortada belirir. short: blog kartı boyunda
  | { type: "image"; label: "Çalışma" | "Blog"; tag: string; title: string; image: string; short?: boolean; href?: string }
  // Görselsiz blog kartı
  | { type: "post"; tag: string; title: string; meta: string; href?: string }
  | { type: "clients" }
  | { type: "testimonials" }
  | { type: "services" };

// Filtre sekmeleri. Yorum, müşteri ve hizmet kartları bir türe ait değil; yalnızca "Tümü"de görünür.
// Her filtre kendi adresi, başlığı ve açıklaması olan gerçek bir sayfa (SEO: Google ayrı ayrı indeksler).
// /calismalar/projeler statik rota olduğu için /calismalar/[slug]'dan önce eşleşir; bir çalışmaya "projeler"
// slug'ı verilmemeli.
export const FILTERS = [
  {
    key: "tumu",
    label: "Tümü",
    href: "/calismalar",
    title: "Çalışmalar & yazılar",
    description: "Markalar için ürettiğimiz işler, blog yazılarımız ve müşterilerimizin yorumları tek sayfada.",
  },
  {
    key: "calisma",
    label: "Çalışmalar",
    href: "/calismalar/projeler",
    title: "Çalışmalar",
    description: "Website, branding, e-ticaret ve otomasyon projelerimizden seçkiler: problem, çözüm ve sonuçlar.",
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
    title: "Blog",
    description: "Reklam, tasarım, SEO ve otomasyon üzerine uygulanabilir yazılar.",
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

export const CLIENTS = [
  "Kafe Zinciri",
  "Moda Markası",
  "Teknoloji Girişimi",
  "Butik Otel",
  "Diş Kliniği",
  "Mimarlık Ofisi",
  "Spor Salonu",
];

export const TESTIMONIALS = [
  { quote: "Tek bir ekiple çalışmak işimizi inanılmaz hızlandırdı. Her adımda ne olduğunu biliyorduk.", name: "Müşteri Adı", role: "Kurucu, E-ticaret" },
  { quote: "İlk ayın sonunda farkı rakamlarda görmeye başladık. Raporlar net ve anlaşılırdı.", name: "Müşteri Adı", role: "İşletme Sahibi, Restoran" },
  { quote: "Markamızı ilk defa bu kadar net anlatabildik. Tasarım da süreç de beklediğimizden iyiydi.", name: "Müşteri Adı", role: "Kurucu Ortak, Girişim" },
  { quote: "Teslim tarihine birebir uydular, iletişim baştan sona açıktı.", name: "Müşteri Adı", role: "Genel Müdür, Hizmet" },
];

// Sütunlar elle dengelendi (masonry): her sütunun kart yükseklikleri toplamı eşit.
// Yükseklikler: image 620 · post / kısa image 370 · testimonials 480 · clients / services 230
// Renk ritmi: gri metin kartları az ve farklı sütunlarda; siyah yorum kartı yeşil hizmetler kartının yanında.
export const FEED_COLUMNS: FeedCard[][] = [
  [
    { type: "post", tag: "Reklam", title: "2026'da Meta reklamlarında işe yarayan 5 strateji", meta: "9 dk okuma · 14 Ekim 2026", href: "/blog/meta-reklam-stratejileri" },
    { type: "testimonials" },
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
    { type: "clients" },
    { type: "image", label: "Çalışma", tag: "Branding", title: "Kafe Zinciri", image: "/images/services/branding.png", href: "/calismalar/kafe-zinciri" },
    { type: "post", tag: "SEO", title: "Küçük işletmeler için SEO: ilk 90 günde ne yapmalı?", meta: "6 dk okuma · 29 Eylül 2026", href: "/blog/kucuk-isletmeler-icin-seo" },
    { type: "image", label: "Çalışma", tag: "Mekanda", title: "Butik Otel", image: "/images/services/mekanda.png", href: "/calismalar/butik-otel" },
  ],
];

// Satır sırası (soldan sağa, yukarıdan aşağı): filtreli ızgara bu sırayla dizilir; ilk kartlar "en yeni" sayılır.
const ROWS = Math.max(...FEED_COLUMNS.map((c) => c.length));
export const READING_ORDER = Array.from({ length: ROWS }, (_, r) => FEED_COLUMNS.map((c) => c[r]))
  .flat()
  .filter(Boolean);

export type FeedItem = Extract<FeedCard, { type: "image" | "post" }>;

// Navbar'ın Çalışmalar paneli: akıştaki en yeni 3 paylaşım (çalışma ya da blog).
// İçlerinde çalışma yoksa sonuncusu en yeni çalışmayla değişir; panelde hep en az bir çalışma olur.
const ITEMS = READING_ORDER.filter((c): c is FeedItem => categoryOf(c) !== null);
const firstThree = ITEMS.slice(0, 3);
export const LATEST_ITEMS: FeedItem[] = firstThree.some((c) => categoryOf(c) === "calisma")
  ? firstThree
  : [...firstThree.slice(0, 2), ITEMS.find((c) => categoryOf(c) === "calisma")!];
