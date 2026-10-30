// Çalışma detay sayfaları (/calismalar/[slug]).
// Düzen referansı: portorocha.com proje sayfaları (solda sabit kenar çubuğu, sağda koyu paneller).
// TÜMÜ YER TUTUCU: müşteri bilgileri, metinler, ekip ve görseller gerçek projelerle değiştirilecek.
// `results` içindeki rakamlar ÖRNEKTİR: gerçek ölçümlerle değiştirilmeden yayına çıkmamalı.
// /calismalar akışındaki çalışma kartları buraya `href` ile bağlanır (feed-data.ts).

export type WorkBlock =
  // Tam genişlik görsel
  | { type: "image"; src: string }
  // Yan yana iki görsel
  | { type: "duo"; images: [string, string] }
  // Solda görsel, sağda proje renginde büyük cümle
  | { type: "split"; image: string; statement: string }
  // Tam genişlik metin paneli (başlık + paragraf)
  | { type: "text"; label: string; title: string; body: string };

export type Work = {
  slug: string;
  title: string;
  /** Hero ve kenar çubuğundaki kısa açıklama */
  summary: string;
  sector: string;
  tag: string;
  image: string;
  /** Hero zemini, "split" paneli ve marka vurgusu */
  color: string;
  year: string;
  duration: string;
  /** /hizmetler/[slug] adresleri */
  services: string[];
  client: {
    location: string;
    founded: string;
    size: string;
    website?: string;
    /** Saydam logo dosyası; yoksa adı yazı olarak basılır */
    logo?: string;
  };
  goals: string[];
  challenge: string;
  solution: { lead: string; body: string };
  timeline: { phase: string; weeks: string; desc: string }[];
  deliverables: string[];
  tools: string[];
  results: { value: string; label: string }[];
  palette: { hex: string; name: string }[];
  fonts: { name: string; use: string }[];
  blocks: WorkBlock[];
  testimonial: { quote: string; name: string; role: string };
  about: string[];
  credits: { role: string; names: string[] }[];
};

// Kenar çubuğundaki içindekiler; work-content'teki bölüm id'leriyle aynı
export const WORK_SECTIONS = [
  { id: "genel", label: "Genel bakış" },
  { id: "problem", label: "Problem ve çözüm" },
  { id: "surec", label: "Süreç" },
  { id: "sonuclar", label: "Sonuçlar" },
  { id: "tasarim", label: "Tasarım dili" },
  { id: "yorum", label: "Müşteri yorumu" },
] as const;

// Müşteri logoları gelene kadar OX logosu yer tutucu (beyaz, saydam PNG)
const DEMO_LOGO = "/images/logo.png";

const TEAM = [
  { role: "Kreatif Yönetim", names: ["Ekip Üyesi"] },
  { role: "Tasarım", names: ["Ekip Üyesi", "Ekip Üyesi"] },
  { role: "Geliştirme", names: ["Ekip Üyesi"] },
  { role: "Strateji ve Metin", names: ["Ekip Üyesi"] },
  { role: "Proje Yönetimi", names: ["Ekip Üyesi"] },
];

export const WORKS: Work[] = [
  {
    slug: "teknoloji-girisimi",
    title: "Teknoloji Girişimi",
    summary: "Lansmana hazır web sitesi ve dijital vitrin",
    sector: "Teknoloji",
    tag: "Website",
    image: "/images/services/website.webp",
    color: "#1E3A8A",
    year: "2026",
    duration: "6 hafta",
    services: ["website", "branding", "seo"],
    client: { location: "İstanbul", founded: "2023", size: "12 kişi", website: "ornek.com", logo: DEMO_LOGO },
    goals: [
      "Ürünü ilk 10 saniyede anlatmak",
      "Yatırım turu öncesi güven veren bir vitrin",
      "Demo talebini sitenin ana hedefi yapmak",
    ],
    challenge:
      "Ürünleri hazırdı ama anlatamıyorlardı. Yatırımcı sunumları ile web sitesi farklı şeyler söylüyor, ziyaretçiler ürünün ne işe yaradığını anlamadan sayfayı terk ediyordu.",
    solution: {
      lead: "Önce anlat, sonra göster.",
      body: "Tek cümlelik bir değer önerisi etrafında, ürünü üç adımda anlatan ve her bölümü bir sonraki adıma bağlayan bir site kurguladık.",
    },
    timeline: [
      { phase: "Keşif", weeks: "1. hafta", desc: "Ekip görüşmeleri, rakip analizi, değer önerisi" },
      { phase: "Kurgu", weeks: "2. hafta", desc: "Site haritası, metinler, kullanıcı akışı" },
      { phase: "Tasarım", weeks: "3–4. hafta", desc: "Arayüz, mobil uyarlama, prototip" },
      { phase: "Geliştirme", weeks: "5–6. hafta", desc: "Kodlama, SEO altyapısı, yayın" },
    ],
    deliverables: ["8 sayfalık web sitesi", "Yönetim paneli", "Mobil uyumlu arayüz", "SEO altyapısı", "Analitik kurulumu"],
    tools: ["Figma", "Next.js", "Tailwind CSS", "Vercel", "GA4"],
    results: [
      { value: "%42", label: "Daha fazla demo talebi" },
      { value: "1.2 sn", label: "Ortalama açılış süresi" },
      { value: "2.4x", label: "Sayfada kalma süresi" },
      { value: "6 hf", label: "Fikirden yayına" },
    ],
    palette: [
      { hex: "#1E3A8A", name: "Gece mavisi" },
      { hex: "#C5F36A", name: "Sinyal yeşili" },
      { hex: "#F5F5F5", name: "Kâğıt" },
      { hex: "#111111", name: "Mürekkep" },
    ],
    fonts: [
      { name: "Inter", use: "Başlık ve metin" },
      { name: "Space Mono", use: "Etiketler" },
    ],
    blocks: [
      { type: "image", src: "/images/solutions/girisim.webp" },
      { type: "split", image: "/images/services/seo.jpg", statement: "Üç adımda anlaşılan bir ürün." },
      {
        type: "text",
        label: "Arayüz",
        title: "Her ekranda tek bir iş",
        body: "Her sayfa yalnızca bir soruyu yanıtlıyor ve bir sonraki adıma yönlendiriyor. Mobilde aynı akış, parmak ucuyla rahat kullanılacak şekilde yeniden düzenlendi.",
      },
      { type: "duo", images: ["/images/principles/kurgu.jpg", "/images/principles/takip.jpg"] },
    ],
    testimonial: {
      quote: "Yatırımcı görüşmelerinde artık siteyi açıp gösteriyoruz. Ürünü bizden daha iyi anlatıyor.",
      name: "Müşteri Adı",
      role: "Kurucu Ortak",
    },
    about: [
      "Teknoloji Girişimi, ürününü yatırım turuna hazırlarken dijital vitrinini de baştan kurmak istedi. Mevcut site ürünün eski bir sürümünü anlatıyordu ve yeni özellikleri hiçbir yerde göstermiyordu.",
      "Keşif aşamasında ekiple birlikte ürünün neden var olduğunu tek cümleye indirdik. Site haritasını bu cümlenin etrafında kurduk; her bölüm o cümleyi destekleyen bir kanıt sunuyor.",
    ],
    credits: TEAM,
  },
  {
    slug: "kafe-zinciri",
    title: "Kafe Zinciri",
    summary: "Yeni marka kimliği ve ambalaj sistemi",
    sector: "Yeme & İçme",
    tag: "Branding",
    image: "/images/services/branding.png",
    color: "#C44120",
    year: "2026",
    duration: "5 hafta",
    services: ["branding", "sosyal-medya"],
    client: { location: "İzmir", founded: "2019", size: "5 şube", logo: DEMO_LOGO },
    goals: [
      "Beş şubeyi tek bir marka gibi göstermek",
      "Yeni şubelerin markayı kendi uygulayabilmesi",
      "Ambalajı sosyal medyada paylaşılır kılmak",
    ],
    challenge:
      "Beş şubeye ulaşan zincir, her şubede farklı görünen bardaklar, menüler ve tabelalarla tek bir marka gibi değil, beş ayrı kafe gibi algılanıyordu.",
    solution: {
      lead: "Bir bakışta tanınan bir bardak.",
      body: "Logodan bardağa, menüden tabelaya kadar tek bir sistem kurduk. Sıcak bir turuncu, el yazısı karakterli bir logo ve her ambalajda tekrar eden bir desen markayı her şubede aynı yapıyor.",
    },
    timeline: [
      { phase: "Keşif", weeks: "1. hafta", desc: "Şube ziyaretleri, müşteri görüşmeleri" },
      { phase: "Konsept", weeks: "2. hafta", desc: "Üç farklı logo ve kimlik yönü" },
      { phase: "Sistem", weeks: "3–4. hafta", desc: "Renk, desen, tipografi, ambalaj" },
      { phase: "Kılavuz", weeks: "5. hafta", desc: "Marka kılavuzu ve şablonlar" },
    ],
    deliverables: ["Logo ve varyasyonları", "Bardak ve ambalaj seti", "Menü ve tabela tasarımı", "Marka kılavuzu", "Sosyal medya şablonları"],
    tools: ["Figma", "Illustrator", "Photoshop", "After Effects"],
    results: [
      { value: "5/5", label: "Şubede aynı kimlik" },
      { value: "3x", label: "Ambalaj paylaşımı" },
      { value: "%27", label: "Sosyal medya etkileşimi" },
      { value: "1 gün", label: "Yeni şube kurulumu" },
    ],
    palette: [
      { hex: "#C44120", name: "Kavrulmuş turuncu" },
      { hex: "#F3E9DC", name: "Süt köpüğü" },
      { hex: "#3B2416", name: "Espresso" },
      { hex: "#FFFFFF", name: "Bardak beyazı" },
    ],
    fonts: [
      { name: "El yazısı logo", use: "Logo ve vurgular" },
      { name: "Inter", use: "Menü ve metin" },
    ],
    blocks: [
      { type: "image", src: "/images/services/branding.png" },
      { type: "split", image: "/images/principles/estetik.jpg", statement: "Her şubede aynı sıcaklık." },
      {
        type: "text",
        label: "Ambalaj",
        title: "Desen, markanın ikinci logosu",
        body: "Logonun kıvrımlarından türeyen desen; bardaklarda, kese kâğıtlarında ve sosyal medya şablonlarında tekrar ediyor. Logo görünmediğinde bile marka tanınıyor.",
      },
      { type: "duo", images: ["/images/solutions/kobi.webp", "/images/services/mekanda.png"] },
    ],
    testimonial: {
      quote: "Müşterilerimiz artık bardağımızı fotoğraflayıp paylaşıyor. Beş şube ilk defa tek bir marka gibi hissettiriyor.",
      name: "Müşteri Adı",
      role: "İşletme Sahibi",
    },
    about: [
      "Kafe Zinciri hızla büyürken her yeni şube kendi tasarımlarını üretmişti. Müşteriler aynı zincirin şubelerini birbirinden ayrı işletmeler sanıyordu.",
      "Marka keşfinde zincirin en güçlü yanının samimiyet olduğunu gördük. Kimliği bu duygu üzerine kurduk: sıcak renkler, el yazısı karakteri ve insan ölçeğinde bir dil.",
    ],
    credits: TEAM,
  },
  {
    slug: "moda-markasi",
    title: "Moda Markası",
    summary: "Satışa odaklı e-ticaret altyapısı",
    sector: "Moda",
    tag: "E-ticaret",
    image: "/images/services/e-ticaret.png",
    color: "#14532D",
    year: "2025",
    duration: "9 hafta",
    services: ["e-ticaret", "otomasyon", "seo"],
    client: { location: "İstanbul", founded: "2021", size: "8 kişi", website: "ornek.com", logo: DEMO_LOGO },
    goals: [
      "Instagram siparişlerini mağazaya taşımak",
      "Sipariş ve kargoyu otomatiğe bağlamak",
      "Sepet terkini azaltmak",
    ],
    challenge:
      "Satışlarının büyük kısmı Instagram mesajlarından geliyordu. Siparişler elle takip ediliyor, stok ve kargo bilgisi müşteriye geç ulaşıyordu.",
    solution: {
      lead: "Mesaj kutusundan mağazaya.",
      body: "Ürün, stok ve siparişin tek panelden yönetildiği bir mağaza kurduk. Ödeme ve kargo entegrasyonları, sipariş durumunu müşteriye WhatsApp'tan otomatik iletiyor.",
    },
    timeline: [
      { phase: "Keşif", weeks: "1. hafta", desc: "Satış süreci, ürün yapısı, entegrasyonlar" },
      { phase: "Tasarım", weeks: "2–4. hafta", desc: "Mağaza kurgusu, ürün ve ödeme sayfaları" },
      { phase: "Geliştirme", weeks: "5–8. hafta", desc: "Mağaza, ödeme, kargo ve bildirimler" },
      { phase: "Yayın", weeks: "9. hafta", desc: "Ürün girişi, test, ekip eğitimi" },
    ],
    deliverables: ["E-ticaret mağazası", "Ürün, stok ve sipariş paneli", "Ödeme ve kargo entegrasyonu", "WhatsApp bildirim botu", "Dönüşüm takibi"],
    tools: ["Shopify", "iyzico", "WhatsApp Business API", "n8n", "GA4"],
    results: [
      { value: "3.2x", label: "Online satış" },
      { value: "%31", label: "Daha az sepet terki" },
      { value: "4 sa", label: "Günlük kazanılan zaman" },
      { value: "%0", label: "Elle sipariş takibi" },
    ],
    palette: [
      { hex: "#14532D", name: "Orman" },
      { hex: "#EDE6DA", name: "Keten" },
      { hex: "#1A1A1A", name: "Kömür" },
      { hex: "#C5F36A", name: "Etiket yeşili" },
    ],
    fonts: [
      { name: "Inter", use: "Arayüz" },
      { name: "Serif başlık", use: "Kampanya başlıkları" },
    ],
    blocks: [
      { type: "image", src: "/images/services/e-ticaret.png" },
      { type: "split", image: "/images/services/sosyal-medya.png", statement: "Sepetten kapıya, tek akış." },
      {
        type: "text",
        label: "Ödeme akışı",
        title: "Üç adımda sipariş",
        body: "Ödeme sayfasını üç adıma indirdik ve misafir alışverişi ekledik. Sepet hatırlatmaları, yarım kalan alışverişleri WhatsApp üzerinden geri kazandırıyor.",
      },
      { type: "duo", images: ["/images/solutions/kurumsal.webp", "/images/services/otomasyon.png"] },
    ],
    testimonial: {
      quote: "Eskiden günümüz mesajlara cevap vermekle geçiyordu. Şimdi siparişler kendiliğinden akıyor, biz ürüne odaklanıyoruz.",
      name: "Müşteri Adı",
      role: "Kurucu",
    },
    about: [
      "Moda Markası sosyal medyada güçlü bir kitleye sahipti ama satış süreci tamamen elle yürüyordu. Her sipariş mesajlaşma, ödeme linki ve kargo takibi demekti.",
      "Mağazayı markanın Instagram'daki görsel diliyle kurduk; ürün sayfaları, takipçilerin alışık olduğu gibi büyük görseller ve kısa açıklamalarla ilerliyor.",
    ],
    credits: TEAM,
  },
  {
    slug: "butik-otel",
    title: "Butik Otel",
    summary: "Misafirler için Mekanda dijital deneyimi",
    sector: "Konaklama",
    tag: "Mekanda",
    image: "/images/services/mekanda.png",
    color: "#3F2A1E",
    year: "2025",
    duration: "2 hafta",
    services: ["mekanda", "sosyal-medya"],
    client: { location: "Bodrum", founded: "2017", size: "24 oda", logo: DEMO_LOGO },
    goals: [
      "Resepsiyonun tekrar eden sorularını azaltmak",
      "Etkinlikleri misafirlere duyurmak",
      "Basılı broşürden kurtulmak",
    ],
    challenge:
      "Resepsiyon gün boyu aynı soruları yanıtlıyordu: Wi-Fi şifresi, kahvaltı saati, yakındaki restoranlar. Otelin etkinlikleri de misafirlere ulaşmıyordu.",
    solution: {
      lead: "Odadaki QR kod, cebindeki resepsiyon.",
      body: "Mekanda ile otelin tüm bilgilerini tek bir sayfada topladık. Misafirler uygulama indirmeden Wi-Fi'ye bağlanıyor, etkinlikleri görüyor ve yol tarifi alıyor.",
    },
    timeline: [
      { phase: "Keşif", weeks: "1–2. gün", desc: "Resepsiyon soruları, otel bilgileri" },
      { phase: "Kurulum", weeks: "1. hafta", desc: "Mekanda profili, içerik girişi" },
      { phase: "QR", weeks: "2. hafta", desc: "Oda ve ortak alan QR kodları" },
      { phase: "Eğitim", weeks: "2. hafta", desc: "Ekip eğitimi, yayın" },
    ],
    deliverables: ["Mekanda otel sayfası", "Oda ve masa QR kodları", "Etkinlik bildirimleri", "Yönetim paneli", "Ekip eğitimi"],
    tools: ["Mekanda", "QR kod", "Google Haritalar"],
    results: [
      { value: "%60", label: "Daha az tekrar eden soru" },
      { value: "2x", label: "Etkinlik katılımı" },
      { value: "0", label: "Basılı broşür" },
      { value: "2 hf", label: "Kurulum süresi" },
    ],
    palette: [
      { hex: "#3F2A1E", name: "Ceviz" },
      { hex: "#E8DCC8", name: "Kum" },
      { hex: "#7A8B6F", name: "Zeytin" },
      { hex: "#FFFFFF", name: "Çarşaf" },
    ],
    fonts: [
      { name: "Serif başlık", use: "Otel adı ve başlıklar" },
      { name: "Inter", use: "Bilgi ve menü" },
    ],
    blocks: [
      { type: "image", src: "/images/services/mekanda.png" },
      { type: "split", image: "/images/solutions/kurumsal.webp", statement: "Sorulmadan cevaplanan sorular." },
      {
        type: "text",
        label: "Etkinlikler",
        title: "Akşam programı herkesin cebinde",
        body: "Canlı müzik ve tadım akşamları artık panelden tek dokunuşla duyuruluyor. Seni takip eden misafirlere yeni etkinliklerde bildirim gidiyor.",
      },
      { type: "duo", images: ["/images/principles/takip.jpg", "/images/page-hero/hakkimizda.jpg"] },
    ],
    testimonial: {
      quote: "Resepsiyonumuz artık misafirle sohbet etmeye vakit buluyor. Wi-Fi şifresini soran kalmadı.",
      name: "Müşteri Adı",
      role: "Genel Müdür",
    },
    about: [
      "Butik Otel, misafir deneyimini bozmadan resepsiyonun yükünü azaltmak istiyordu. Basılı broşürler sürekli eskiyor, güncellenmesi de zaman alıyordu.",
      "Mekanda kurulumunu, otelin tüm bilgilerini ve görsellerini biz girerek iki hafta içinde tamamladık. Odalara ve ortak alanlara QR kodlar yerleştirildi.",
    ],
    credits: TEAM,
  },
];

export function getWork(slug: string) {
  return WORKS.find((w) => w.slug === slug) ?? null;
}

/** Önceki / sonraki çalışma (döngüsel). */
export function neighbours(slug: string) {
  const i = WORKS.findIndex((w) => w.slug === slug);
  const n = WORKS.length;
  return { prev: WORKS[(i - 1 + n) % n], next: WORKS[(i + 1) % n] };
}
