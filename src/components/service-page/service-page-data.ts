import type { FaqItem } from "@/components/faq/faq";
import { SERVICES, type ItemKind, type Service } from "@/components/services/services-data";

// Hizmet detay sayfalarının (/hizmetler/[slug]) içeriği.
// Düzen referansı: clean-tuna-722417.framer.app/hizmetayrı (Framer "Stratux" şablonu).
// Metinler varsayılan olarak her hizmetin adından üretiliyor (YER TUTUCU), görseller ana sayfadaki hizmet görselleri.
// Bir hizmete özel içerik yazmak için OVERRIDES içine o hizmetin slug'ıyla istediğin alanları ekle.
// `…Intro`, `fit`, `faqCta` gibi isteğe bağlı alanlar yalnız yazılmış sayfalarda dolu; boşsa bileşen eski varsayılanı gösterir.

/** Fotoğraf bantlarındaki mini arayüz: bandın anlattığı fikri somutlaştırır (bildirim kartının yerine) */
export type HighlightWidget =
  | { kind: "roadmap"; title: string; steps: { label: string; value: string }[] }
  | { kind: "checklist"; title: string; status: string; items: string[] }
  | { kind: "stats"; title: string; badge?: string; rows: { label: string; value: string; up?: boolean }[] }
  // Haftalık içerik takvimi: işaretli günler ve o günün paylaşımı
  | { kind: "calendar"; title: string; badge?: string; posts: { day: string; title: string; type: string }[] }
  // Sade video kurgu ekranı: dikey önizleme + birkaç iz + tamamlanan adımlar
  | { kind: "editor"; title: string; status: string; tracks: string[]; done: string[] }
  // Rakamsız performans paneli: göstergeler yalnız eğilim çubuğu, altta en çok ilgi gören içerik
  | { kind: "performance"; title: string; badge: string; metrics: string[]; top: { label: string; value: string } }
  // İçerik onay ekranı: önizleme, taslak adı ve iki karar butonu
  | { kind: "approval"; title: string; badge: string; item: string; meta: string; actions: [string, string] }
  // Branding: aynı örnek marka ("Mira") dört bantta tutarlı kullanılır
  // Marka karakteri panosu: seçilebilir kelimeler (seçilenler mavi) + renk örnekleri
  | { kind: "moodboard"; title: string; badge?: string; words: { label: string; on: boolean }[]; swatches: string[] }
  // Logo çalışma alanı: eskizden renkliye artboard'lar + alternatif yerleşimler
  | { kind: "logo"; title: string; badge?: string; boards: string[]; layouts: string[] }
  // Aynı markanın dört uygulaması
  | { kind: "mockups"; title: string; badge?: string; items: string[] }
  // Teslim ekranı: klasör/dosya satırları ve format etiketleri
  | { kind: "files"; title: string; badge?: string; files: { name: string; formats: string[] }[] }
  // E-ticaret: aynı örnek mağaza ("keten.") ve aynı ürün dört bantta
  // Kategori ağacı: üst kategori ve alt kırılımlar
  | { kind: "categories"; title: string; badge?: string; tree: { label: string; children?: string[] }[] }
  // Ürün detay + sepet: görsel, ad, fiyat, beden seçimi, sepete ekle
  | { kind: "product"; title: string; badge?: string; name: string; price: string; sizes: string[]; selected: string; cta: string }
  // Sipariş durum akışı: aşamalar ve şu anki aşama
  | { kind: "orders"; title: string; badge?: string; order: string; steps: string[]; current: number }
  // Ürün yönetim satırı
  | { kind: "inventory"; title: string; badge?: string; product: { name: string; price: string; stock: string; status: string } }
  // SEO: örnek işletme "Örnek Klinik" (diş kliniği) dört bantta; hiçbir yerde hacim/puan gibi uydurma rakam yok
  // Anahtar kelime araştırması: arama kutusu + niyet türüne göre etiketlenmiş aramalar
  | { kind: "keywords"; title: string; badge?: string; query: string; rows: { term: string; intent: string }[] }
  // Teknik kontrol listesi: tamamlanan / incelenen durumlar
  | { kind: "audit"; title: string; badge?: string; items: { label: string; status: string; done: boolean }[] }
  // Arama sonucu önizlemesi + altında sayfanın bölüm yapısı
  | { kind: "serp"; title: string; badge?: string; result: { url: string; heading: string; desc: string }; outline: string[] }
  // Search Console'dan esinlenen rakamsız panel: çizgi grafik, gelişen sorgular ve sayfalar
  | { kind: "search"; title: string; badge: string; metrics: string[]; pages: string[]; queries: string[] };

export type ServicePage = {
  service: Service;
  /** Arama sonucu başlığı ve açıklaması; yoksa "{hizmet} · OX Dijital" + hizmet açıklaması */
  meta?: { title: string; description: string };
  hero: {
    title: [string, string];
    description: string;
    image: string;
    /** Varsayılan "Hizmetler · {hizmet}" */
    eyebrow?: string;
    /** Varsayılan "Projeni konuşalım" / "Paketleri gör" (#paketler) */
    primaryLabel?: string;
    secondary?: { label: string; href: string };
  };
  /** note: kartların altında kısa not (ör. hizmetlerin ayrı ayrı seçilebildiği) */
  featuresIntro?: { title: string; desc: string; note?: string };
  features: { title: string; desc: string }[];
  // "Bir bakışta": süre, teslim, destek gibi kısa bilgiler
  facts: { label: string; value: string }[];
  statement: string;
  highlights: {
    title: string;
    desc: string;
    image: string;
    /** Biri yeterli: widget varsa başlık ortalanır ve mini arayüz gösterilir, yoksa eski bildirim kartı */
    note?: { title: string; text: string; badge?: string };
    widget?: HighlightWidget;
  }[];
  stepsIntro?: { title: string; desc?: string };
  steps: { title: string; desc: string }[];
  // "Neler dahil?": kapsam kalemleri, teslim edilenler, kullanılan araçlar
  /** title yoksa "Neler dahil?" */
  scopeIntro?: { title?: string; desc: string };
  scope: { title: string; desc?: string; kind?: ItemKind }[];
  /** Sağdaki koyu kartta teslim edilenlerin yerine (ör. ihtiyaca göre eklenebilecekler) */
  scopeNote?: { title: string; text: string; foot?: string };
  deliverables: string[];
  tools: string[];
  audiencesIntro?: { title: string; desc?: string };
  audiences: { title: string; desc: string; image: string }[];
  /** Kimin için'den sonraki ara bölüm ("bu sana uygun mu?"); varsa yorumların yerini alır */
  fit?: { title: string; text: string; cta?: string };
  testimonials: { quote: string; name: string; role: string }[];
  faq: FaqItem[];
  /** SSS altındaki küçük CTA; yoksa genel metin */
  faqCta?: { title: string; text: string; label: string };
  packagesIntro?: {
    soft: string;
    desc?: string;
    note?: string;
    /** Kart butonu; varsayılan "Bu paketi seç" */
    cta?: string;
    /** Kalemlerin üstünde etiket (ör. "Örnek kapsam": kalemler kesin değil) */
    itemsLabel?: string;
    /** Başlığın altında başlangıç fiyatı ve fiyat notları */
    price?: { label: string; amount: string; suffix: string; notes: string[] };
  };
  // Sayfanın sonundaki paketler (CTA yerine)
  packages: { title: string; tagline: string; duration?: string; items: string[]; featured?: boolean }[];
};

type Details = Pick<ServicePage, "facts" | "scope" | "deliverables" | "tools">;

// Hizmete özel "Bir bakışta" ve "Neler dahil?" içerikleri.
// Süreler, revizyon sayıları, destek süreleri ve sağlayıcı adları TASLAK: yayından önce teyit edilmeli.
const DETAILS: Record<string, Details> = {
  website: {
    facts: [
      { label: "Süre", value: "Teslim süresi kapsamına göre değişir, teklifte netleşir" },
      { label: "Revizyon", value: "Revizyon sayısı teklifte belirlenir" },
      { label: "Teslim", value: "Yönetim paneli + kaynak kod" },
      { label: "Destek", value: "3 ay teknik destek" },
    ],
    scope: [
      { title: "Keşif ve site haritası", desc: "Hedef kitleni, rakiplerini ve sitenin amacını netleştirip sayfa yapısını çıkarıyoruz.", kind: "hizmet" },
      { title: "Arayüz tasarımı", desc: "Masaüstü ve mobil için ayrı ayrı, markana özel ve dönüşüm odaklı ekranlar.", kind: "hizmet" },
      { title: "Geliştirme", desc: "Hızlı açılan, güvenli ve büyüdükçe genişleyebilen modern bir altyapı.", kind: "hizmet" },
      { title: "SEO altyapısı", desc: "Meta etiketler, site haritası, yapısal veri ve hız optimizasyonu ilk günden hazır.", kind: "hizmet" },
      { title: "Form ve CRM bağlantısı", desc: "Gelen talepler doğrudan e-postana, CRM'ine ya da WhatsApp'ına düşer.", kind: "modül" },
      { title: "Analitik kurulumu", desc: "Ziyaretçi ve dönüşüm takibini kurup hangi sayfanın işe yaradığını görünür kılıyoruz.", kind: "hizmet" },
    ],
    deliverables: [
      "Figma tasarım dosyaları",
      "Kendi alan adında, SSL'li çalışan site",
      "İçerikleri düzenleyebileceğin yönetim paneli",
      "Kaynak kod ve teknik dokümantasyon",
      "Google Analytics ve Search Console kurulumu",
      "Yönetim paneli kullanım eğitimi",
    ],
    tools: ["Figma", "Next.js", "React", "Tailwind CSS", "Vercel", "Google Analytics"],
  },
  "sosyal-medya": {
    facts: [
      { label: "Çalışma", value: "Aylık, sürekli" },
      { label: "Paylaşım", value: "İçerik sayısı pakete göre belirlenir" },
      { label: "Onay", value: "Her içerik onayınla" },
      { label: "Rapor", value: "Aylık performans raporu" },
    ],
    scope: [
      { title: "Hesap analizi ve strateji", desc: "Mevcut hesaplarını ve rakiplerini inceleyip hangi içeriğin kime gideceğini belirliyoruz.", kind: "hizmet" },
      { title: "İçerik takvimi", desc: "Bir ay önceden hazırlanan, kampanya ve özel günleri kapsayan paylaşım planı.", kind: "hizmet" },
      { title: "Görsel ve video üretimi", desc: "Reels, carousel ve story formatlarında markana uygun içerikler.", kind: "hizmet" },
      { title: "Metin yazarlığı", desc: "Markanın sesini taşıyan açıklamalar, başlıklar ve hashtag setleri.", kind: "hizmet" },
      { title: "Topluluk yönetimi", desc: "Yorum ve mesajları takip edip markanın diliyle zamanında yanıtlıyoruz.", kind: "hizmet" },
      { title: "Sosyal medya otomasyonu", desc: "Planlı paylaşım, sık sorulara otomatik yanıt ve gelen mesajların yönlendirilmesi.", kind: "modül" },
    ],
    deliverables: [
      "Aylık içerik takvimi",
      "Marka uyumlu şablon seti",
      "Yayına hazır görsel ve videolar",
      "Rakip ve sektör analizi",
      "Aylık performans raporu",
      "İçerik ve hashtag rehberi",
    ],
    tools: ["Instagram", "TikTok", "LinkedIn", "Meta Business Suite", "Figma", "CapCut"],
  },
  branding: {
    facts: [
      { label: "Süre", value: "Teslim süresi kapsamına göre değişir, teklifte netleşir" },
      { label: "Konsept", value: "Konsept sayısı teklifte belirlenir" },
      { label: "Revizyon", value: "Revizyon sayısı teklifte belirlenir" },
      { label: "Teslim", value: "Tüm formatlarda dosyalar" },
    ],
    scope: [
      { title: "Marka keşfi", desc: "Değerlerini, kitleni ve rakiplerini konuşup markanın nerede durduğunu belirliyoruz.", kind: "hizmet" },
      { title: "Logo tasarımı", desc: "Farklı yönlerde konseptler, seçtiğin yönün detaylandırılması ve kullanım varyasyonları.", kind: "hizmet" },
      { title: "Renk ve tipografi", desc: "Ekranda ve baskıda tutarlı çalışan bir renk paleti ve yazı karakteri sistemi.", kind: "hizmet" },
      { title: "Kurumsal kimlik", desc: "Kartvizit, antetli kâğıt, e-posta imzası ve sunum şablonu.", kind: "hizmet" },
      { title: "Marka dili", desc: "Nasıl konuştuğunu tarif eden ton rehberi, slogan ve ana mesajlar.", kind: "hizmet" },
      { title: "Sosyal medya kiti", desc: "Profil görselleri, kapaklar ve paylaşım şablonları.", kind: "hizmet" },
    ],
    deliverables: [
      "Logo dosyaları (SVG, PNG, PDF · açık ve koyu)",
      "Marka kılavuzu (PDF)",
      "Renk kodları ve font dosyaları",
      "Kurumsal kimlik tasarımları",
      "Sosyal medya şablonları",
      "Marka dili dokümanı",
    ],
    tools: ["Figma", "Illustrator", "Photoshop", "After Effects"],
  },
  "e-ticaret": {
    facts: [
      { label: "Süre", value: "Teslim süresi kapsamına göre değişir, teklifte netleşir" },
      { label: "Ödeme", value: "Sanal POS entegrasyonu" },
      { label: "Kargo", value: "Kargo firması bağlantısı" },
      { label: "Yönetim", value: "Ürün, stok, sipariş paneli" },
    ],
    scope: [
      { title: "Mağaza kurgusu", desc: "Kategori yapısı, filtreler ve ürün ilişkileriyle aradığını hızla bulduran bir düzen.", kind: "hizmet" },
      { title: "Ürün ve sepet deneyimi", desc: "Güven veren ürün sayfaları ve terk edilmeyen, kısa bir ödeme akışı.", kind: "hizmet" },
      { title: "Ödeme ve kargo entegrasyonu", desc: "Sanal POS, taksit seçenekleri ve kargo takip numarasının otomatik iletilmesi.", kind: "modül" },
      { title: "Ürün yükleme", desc: "Başlangıç ürünlerini görsel, açıklama ve varyantlarıyla mağazaya giriyoruz.", kind: "hizmet" },
      { title: "WhatsApp bildirim botu", desc: "Sipariş, kargo ve sepet hatırlatmaları müşterine WhatsApp'tan gider.", kind: "modül" },
      { title: "E-ticaret SEO'su ve takip", desc: "Ürün ve kategori sayfalarının aramada görünmesi, satışların reklam kanallarına bağlanması.", kind: "hizmet" },
    ],
    deliverables: [
      "Yayında çalışan mağaza",
      "Ürün, stok ve sipariş yönetim paneli",
      "Ödeme ve kargo bağlantıları",
      "Başlangıç ürünlerinin içerik girişi",
      "GA4 ve Meta Pixel dönüşüm takibi",
      "Mağaza yönetimi eğitimi",
    ],
    tools: ["Shopify", "WooCommerce", "Next.js", "iyzico", "PayTR", "GA4"],
  },
  seo: {
    facts: [
      { label: "Çalışma", value: "Aylık, en az 6 ay önerilir" },
      { label: "İlk etki", value: "SEO uzun vadeli bir yatırımdır, sonuçlar aylar içinde görünür" },
      { label: "Başlangıç", value: "Ücretsiz teknik denetim" },
      { label: "Rapor", value: "Aylık sıralama raporu" },
    ],
    scope: [
      { title: "Teknik SEO denetimi", desc: "Hız, indekslenme, Core Web Vitals ve site yapısındaki sorunları tespit edip gideriyoruz.", kind: "hizmet" },
      { title: "Anahtar kelime araştırması", desc: "Müşterilerinin gerçekten aradığı kelimeleri bulup sayfalarınla eşleştiriyoruz.", kind: "hizmet" },
      { title: "Sayfa içi optimizasyon", desc: "Başlıklar, meta açıklamalar, iç linkler ve görsellerin aramaya uygun hale getirilmesi.", kind: "hizmet" },
      { title: "İçerik üretimi", desc: "Blog yazıları ve kategori metinleriyle aranan sorulara en iyi cevabı veren sayfalar.", kind: "hizmet" },
      { title: "Yerel SEO", desc: "Google İşletme Profili ve haritalarda yakındaki müşterilerin seni bulması.", kind: "hizmet" },
      { title: "Sıralama raporu", desc: "Takip ettiğimiz kelimelerdeki yerini ve trafiğini her ay şeffafça raporluyoruz.", kind: "modül" },
    ],
    deliverables: [
      "Teknik denetim raporu",
      "Anahtar kelime haritası",
      "Optimize edilmiş sayfalar",
      "Aylık içerik planı ve yazılar",
      "Google İşletme Profili düzenlemesi",
      "Aylık sıralama ve trafik raporu",
    ],
    tools: ["Google Search Console", "GA4", "Ahrefs", "Screaming Frog", "PageSpeed Insights"],
  },
  mekanda: {
    facts: [
      { label: "Kurulum", value: "1–2 hafta" },
      { label: "Erişim", value: "QR kodla, indirme yok" },
      { label: "Güncelleme", value: "Panelden anında" },
      { label: "İçerik", value: "Girişini biz yapıyoruz" },
    ],
    scope: [
      { title: "Mekan profili", desc: "Çalışma saatleri, konum, iletişim ve menü bilgileri tek sayfada.", kind: "uygulama" },
      { title: "Tek dokunuşla Wi-Fi", desc: "Misafirlerin şifre sormadan ağına bağlanır.", kind: "uygulama" },
      { title: "Yol tarifi", desc: "Haritada mekanına tek dokunuşla yol tarifi.", kind: "uygulama" },
      { title: "Etkinlik ve duyurular", desc: "Canlı müzik, özel menü ya da kampanyalarını öne çıkar.", kind: "uygulama" },
      { title: "Etkinlik bildirimleri", desc: "Seni takip eden misafirlere yeni etkinliklerde bildirim gider.", kind: "modül" },
      { title: "Kurulum ve içerik girişi", desc: "Bilgilerini ve görsellerini biz girer, QR kodlarını hazırlarız.", kind: "hizmet" },
    ],
    deliverables: [
      "Mekana özel sayfa",
      "Masa ve kapı için QR kodlar",
      "Yönetim paneli",
      "İlk içerik girişi",
      "Kullanım eğitimi",
      "Ziyaret istatistikleri",
    ],
    tools: ["Mekanda", "QR kod", "Google Haritalar", "Web panel"],
  },
};

// Fotoğraf bantları ve "kimler için" kartları için geçici görsel havuzu
const POOL = [
  "/images/solutions/girisim.webp",
  "/images/solutions/kobi.webp",
  "/images/solutions/kurumsal.webp",
  "/images/principles/takip.jpg",
  "/images/principles/estetik.jpg",
  "/images/principles/kurgu.jpg",
];

function build(service: Service): Omit<ServicePage, "service"> {
  const name = service.title;
  const features = service.items.slice(0, 4).map((item) => ({
    title: item.label,
    desc: `${item.label} sürecini baştan sona biz yönetiyoruz; sen yalnızca sonucu görüyorsun.`,
  }));
  // Kalem sayısı 4'ten azsa ortak maddelerle tamamlanır (ızgara 2+2 düzenini korusun)
  const fillers = [
    { title: "Ölçülebilir Sonuç", desc: "Her adımı raporluyor, neyin işe yaradığını rakamlarla gösteriyoruz." },
    { title: "Tek Muhatap", desc: "Strateji, tasarım ve geliştirme aynı ekipte; kimseyi kovalamıyorsun." },
    { title: "Hızlı Teslim", desc: "Net bir takvimle çalışıyor, ilk çıktıyı birkaç hafta içinde paylaşıyoruz." },
  ];
  while (features.length < 4) features.push(fillers[features.length - service.items.length] ?? fillers[0]);

  // DETAILS'te olmayan yeni bir hizmet eklenirse kalemlerinden üretilen genel içerik
  const details: Details = DETAILS[service.slug] ?? {
    facts: [
      { label: "Süre", value: "Kapsama göre" },
      { label: "Başlangıç", value: "Ücretsiz ön görüşme" },
      { label: "Takip", value: "Müşteri paneli" },
      { label: "Destek", value: "Teslim sonrası destek" },
    ],
    scope: service.items.map((item) => ({ title: item.label, desc: features[0].desc, kind: item.kind })),
    deliverables: service.items.map((item) => item.label),
    tools: [],
  };
  const labels = service.items.map((item) => item.label);

  return {
    ...details,
    hero: {
      title: [service.tagline, `${name} ile.`],
      description: service.description,
      image: service.image,
    },
    features,
    statement: `Müşterilerin artık seni önce dijitalde tanıyor. İlk izlenim ekranda başlıyor. ${name} hizmetimiz, markanı tam o anda doğru anlatmak için kuruldu.`,
    highlights: [
      {
        title: "Strateji önce gelir",
        desc: "Ne yapacağımıza karar vermeden önce hedefini ve kitleni birlikte netleştiriyoruz.",
        image: POOL[0],
        note: { title: "OX Dijital", text: "Strateji dokümanın hazır. İncelemek için dokun." },
      },
      {
        title: "Tasarımda detay",
        desc: "Markanın diline uyan, akılda kalan ve işini kolaylaştıran tasarımlar.",
        image: POOL[4],
        note: { title: "OX Dijital", text: "Yeni tasarım taslağı onayına gönderildi.", badge: "Onay bekliyor" },
      },
      {
        title: "Yayında, ölçümde",
        desc: "Yayına aldıktan sonra veriyi izliyor, test ediyor ve iyileştiriyoruz.",
        image: POOL[5],
        note: { title: "OX Dijital", text: "Bu haftanın raporu hazır.", badge: "Rapor" },
      },
      {
        title: "Her an ulaşılabilir",
        desc: "Panelden talep aç, ilerlemeyi takip et; ekibimiz hep bir mesaj uzağında.",
        image: POOL[2],
        note: { title: "OX Dijital", text: "Talebin alındı, ekibimiz üzerinde çalışıyor.", badge: "Başarılı" },
      },
    ],
    steps: [
      { title: "Tanışalım", desc: "30 dakikalık ücretsiz bir görüşmede ihtiyacını ve hedeflerini dinliyoruz." },
      { title: "Planı kuralım", desc: "Kapsamı, takvimi ve bütçeyi netleştirip sana özel bir teklif hazırlıyoruz." },
      { title: "Üretip yayına alalım", desc: "Her adımı onayına sunarak üretiyor, yayına alıyor ve ölçmeye başlıyoruz." },
    ],
    audiences: [
      { title: "Girişimler", desc: "Fikrini hızla ayağa kaldıracak, büyüdükçe genişleyen bir temel.", image: POOL[0] },
      { title: "KOBİ'ler", desc: "Rakiplerinle aynı sahada, kendi sesini kaybetmeden var olmak.", image: POOL[1] },
      { title: "Kurumsal markalar", desc: "Karmaşık yapılar için ölçeklenebilir ve güvenilir çözümler.", image: POOL[2] },
      { title: "Restoran ve kafeler", desc: "Mekânını dijitalde de dolu tutan deneyimler.", image: "/images/services/mekanda.png" },
      { title: "E-ticaret markaları", desc: "Vitrinden ödemeye, satışa odaklı bir altyapı.", image: "/images/services/e-ticaret.png" },
    ],
    // Gerçek müşteri yorumu gelene kadar boş: liste boşsa bölüm hiç görünmez
    testimonials: [],
    faq: [
      { q: `${name} projesi ne kadar sürer?`, a: "Kapsama göre değişir. Net takvim ilk görüşmeden sonra, teklifle birlikte belli olur." },
      { q: "Fiyatlandırma nasıl yapılıyor?", a: "Sabit fiyat listemiz yok; ihtiyacına göre kapsamı birlikte belirleyip sana özel bir teklif hazırlıyoruz." },
      { q: "Süreç boyunca nasıl haberdar olacağım?", a: "Müşteri panelinden her adımı takip edebilir, onayları oradan verebilirsin. Ayrıca düzenli raporlarla ilerlemeyi paylaşıyoruz." },
      { q: "Proje bittikten sonra destek veriyor musunuz?", a: "Evet. İstersen aylık destekle birlikte büyümeye devam ediyoruz; istersen teslim edilen her şey belgelenmiş olarak sende kalıyor." },
      { q: "Başka hizmetlerle birlikte alabilir miyim?", a: "Elbette. Paketlerimiz birden fazla hizmeti tek planda topluyor; ihtiyacına göre kalem ekleyip çıkarabiliyoruz." },
    ],
    // YER TUTUCU: gerçek paket bilgileri gelince OVERRIDES ile hizmet bazında değiştirilecek
    packages: [
      {
        title: "Başlangıç",
        tagline: "İlk adımı atanlar için",
        duration: "Kısa süreli",
        items: [...labels.slice(0, 2), "Temel kurulum", "E-posta desteği"],
      },
      {
        title: "Büyüme",
        tagline: "Düzenli ilerlemek isteyenler için",
        duration: "Orta süreli",
        featured: true,
        items: [...labels, "Aylık rapor", "Öncelikli destek"],
      },
      {
        title: "Kapsamlı",
        tagline: "Her şeyi tek ekibe bırakanlar için",
        duration: "Sürekli",
        items: [...labels, "Özel entegrasyonlar", "Aylık strateji görüşmesi", "Proje yöneticisi"],
      },
    ],
  };
}

const OVERRIDES: Partial<Record<string, Partial<Omit<ServicePage, "service">>>> = {
  website: {
    hero: {
      eyebrow: "Website",
      title: ["Markanın dijital vitrini,", "işini anlatan bir website ile kurulur."],
      description:
        "OX Dijital olarak sadece güzel görünen değil; hızlı açılan, güven veren ve ziyaretçiyi harekete geçiren web siteleri tasarlayıp geliştiriyoruz. Website'in yayında durması değil, işine katkı sağlaması bizim için önemli.",
      image: "/images/services/website.webp",
      primaryLabel: "Ücretsiz görüşme",
      secondary: { label: "Kapsamı gör", href: "#kapsam" },
    },
    featuresIntro: {
      title: "Website yayında durmaz, çalışır.",
      desc: "İyi bir website yalnızca \"biz de varız\" demek için kurulmaz. Güven vermek, işini net anlatmak ve doğru kişiyi sana ulaştırmak için kurulur.",
    },
    features: [
      { title: "Hızlı açılır", desc: "Ziyaretçiyi bekletmeyen, akıcı bir deneyim sunar." },
      { title: "Mobil uyumludur", desc: "Trafiğin büyük kısmı mobilden gelir; deneyim her ekranda temiz kalır." },
      { title: "Güven verir", desc: "İlk izlenimde markanı daha derli toplu ve profesyonel gösterir." },
      { title: "Talep toplar", desc: "Formlar, butonlar ve akışlar boş durmaz; ziyaretçiyi yönlendirir." },
      { title: "SEO temeli hazırdır", desc: "Arama motorlarında görünürlük için sağlam bir altyapıyla kurulur." },
      { title: "Kolay yönetilir", desc: "Gereken alanlar düzenlenebilir olur; her küçük değişiklik için bağımlı kalmazsın." },
    ],
    highlights: [
      {
        title: "Strateji önce gelir",
        desc: "Website'e tasarımla değil, netlikle başlarız. Kimi çağırdığını, ne anlattığını ve ziyaretçiden hangi adımı beklediğini baştan birlikte belirleriz.",
        image: POOL[0],
        widget: {
          kind: "roadmap",
          title: "Website planı",
          steps: [
            { label: "Amaç", value: "Talep toplamak" },
            { label: "Hedef kitle", value: "Doğru kişiye net anlatım" },
            { label: "İlk adım", value: "Mesaj ve sayfa kurgusu" },
          ],
        },
      },
      {
        title: "Tasarımda detay",
        desc: "İyi tasarım süs değildir. Ziyaretçinin nerede duracağını, neyi okuyacağını ve hangi adıma geçeceğini belirleyen şey detaydır.",
        image: POOL[4],
        widget: {
          kind: "checklist",
          title: "Kalite kontrol",
          status: "4 / 4",
          items: ["Ana sayfa akışı", "Mobil görünüm", "Metin hiyerarşisi", "CTA yerleşimi"],
        },
      },
      {
        title: "Yayında, ölçümde",
        desc: "Site yayına çıkınca iş bitmez. Hangi sayfa daha çok ilgi görüyor, nerede çıkış oluyor, hangi form çalışıyor; takip eder, yorumlar ve gerekirse iyileştiririz.",
        image: POOL[5],
        widget: {
          kind: "stats",
          title: "Son 30 gün",
          badge: "Rapor",
          rows: [
            { label: "Form gönderimi", value: "Artışta", up: true },
            { label: "Açılış hızı", value: "İyi" },
            { label: "En çok görüntülenen", value: "Ana sayfa" },
            { label: "Görünürlük", value: "Daha net", up: true },
          ],
        },
      },
      {
        title: "Her an ulaşılabilir",
        desc: "İş teslim edilip ortadan kaybolmayız. Bir düzenleme gerektiğinde, soru sormak istediğinde ya da yeni bir ihtiyaç çıktığında ulaşabileceğin bir ekip hep vardır.",
        image: POOL[2],
        widget: {
          kind: "stats",
          title: "Destek",
          badge: "Çevrimiçi",
          rows: [
            { label: "Muhatabın", value: "Tek kişi" },
            { label: "Açık talepler", value: "1" },
            { label: "Son güncelleme", value: "Bugün 11:40" },
          ],
        },
      },
    ],
    stepsIntro: { title: "3 adımda kuruyor, birlikte büyütüyoruz." },
    steps: [
      { title: "Keşif", desc: "İşini, hedef kitleni ve beklentini netleştiriyoruz." },
      { title: "Kurulum", desc: "Tasarımı, altyapıyı ve içerikleri tek planla hayata geçiriyoruz." },
      { title: "Yayın ve gelişim", desc: "Siteyi yayına alıyor, ölçüyor ve gerektiğinde iyileştiriyoruz." },
    ],
    scopeIntro: {
      desc: "Website kapsamı projeye göre değişir ama çoğu işte temel yapı şu kalemlerden oluşur:",
    },
    scope: [
      { title: "Arayüz tasarımı" },
      { title: "Mobil uyumlu geliştirme" },
      { title: "Ana sayfa ve temel iç sayfalar" },
      { title: "İletişim / teklif formu kurulumu" },
      { title: "Temel SEO altyapısı" },
      { title: "Hız optimizasyonu" },
      { title: "Analytics / pixel kurulumu" },
      { title: "Güvenli yayın süreci" },
    ],
    scopeNote: {
      title: "İhtiyaca göre eklenebilir",
      text: "İhtiyaca göre blog, çoklu dil, referans alanı, ekip sayfaları, özel formlar, katalog yapısı, randevu akışı ve farklı entegrasyonlar da eklenebilir.",
    },
    deliverables: [],
    tools: [],
    audiencesIntro: { title: "Kimin için?" },
    audiences: [
      { title: "Girişim", desc: "Yeni başlayan ya da dijitalde daha düzgün görünmek isteyen markalar için.", image: POOL[0] },
      { title: "KOBİ", desc: "İşini daha net anlatmak ve düzenli talep toplamak isteyen işletmeler için.", image: POOL[1] },
      { title: "Kurumsal", desc: "Daha güçlü güven veren, daha temiz anlatılan bir dijital yapı isteyen ekipler için.", image: POOL[2] },
    ],
    fit: {
      title: "Website, yalnızca görünmek için değil; güven vermek ve dönüş almak için kurulur.",
      text: "Eğer insanlar seni ilk kez internette görüyorsa, işini dağınık değil net anlatmak istiyorsan ve ziyaretçiyi müşteriye çevirecek daha güçlü bir yapı arıyorsan, doğru yerdesin.",
    },
    testimonials: [],
    faq: [
      {
        q: "Website ne kadar sürede yayına çıkar?",
        a: "Kapsama göre değişir ama çoğu projede ilk teslim birkaç hafta içinde çıkar. Sayfa sayısı, içerik yoğunluğu ve özel geliştirmeler varsa süreyi en başta netleştiririz.",
      },
      {
        q: "İçerikleri kim hazırlıyor?",
        a: "İstersen hazır içeriklerinle ilerleriz, istersen metinleri birlikte şekillendiririz. Gerekirse sana doğru soruları sorup içerik tarafını da biz toparlarız.",
      },
      {
        q: "Ben sonradan güncelleme yapabilir miyim?",
        a: "Evet. Projenin yapısına göre düzenlenebilir alanları sana açıyoruz. Her küçük değişiklik için bize bağımlı kalmazsın.",
      },
      {
        q: "Domain ve hosting kimde oluyor?",
        a: "Tercihen senin adına kuruyoruz. Böylece alan adı, hesaplar ve erişimler sende kalır.",
      },
      {
        q: "Yayına çıktıktan sonra destek veriyor musunuz?",
        a: "Evet. Teknik destek, düzenleme ve geliştirme ihtiyaçlarında yanında olmaya devam ediyoruz.",
      },
      {
        q: "SEO'ya uygun mu kuruluyor?",
        a: "Evet. Teknik SEO için gerekli temel yapı kurulur; sayfa yapısı, hız ve içerik düzeni buna göre hazırlanır.",
      },
    ],
    faqCta: {
      title: "Aklında soru varsa, listeleri atlayalım.",
      text: "İşini kısaca anlat; sana nasıl bir website yapısının uygun olduğunu birlikte netleştirelim.",
      label: "Sorunu anlat",
    },
    packagesIntro: {
      soft: "Website için ihtiyacına uygun planı birlikte netleştiriyoruz.",
      desc: "Sabit şablonlara sıkışmak yerine, ihtiyacına göre doğru kapsamı çıkarıyoruz.",
      note: "Kapsamı birlikte netleştiriyor, teklifi ona göre çıkarıyoruz. Yani ihtiyacın olmayan kalemlere para ödemezsin.",
    },
    packages: [
      {
        title: "Başlangıç",
        tagline: "Hızlı ve temiz bir başlangıç yapmak isteyenler için",
        items: ["Tek sayfa yapı veya temel kurulum", "Mobil uyum", "İletişim formu", "Temel SEO altyapısı"],
      },
      {
        title: "Kurumsal",
        tagline: "İşini daha kapsamlı anlatmak isteyenler için",
        items: ["Ana sayfa + iç sayfalar", "Yönetilebilir yapı", "Gelişmiş içerik alanları", "Daha güçlü kurumsal anlatım"],
      },
      {
        title: "Özel yapı",
        tagline: "Standart yapının ötesine geçen ihtiyaçlar için",
        items: ["Özel akışlar", "Entegrasyonlar", "Gelişmiş formlar", "İhtiyaca göre özel geliştirme"],
      },
    ],
  },
  "sosyal-medya": {
    hero: {
      eyebrow: "Sosyal Medya",
      title: ["Markanın sosyal medyada", "söyleyecek çok şeyi var."],
      description:
        "İçerik planlamasından fotoğraf ve video çekimine, Reels kurgusundan hesap yönetimine kadar sosyal medyanın farklı ihtiyaçları için birlikte çalışıyoruz. Bir markanın sadece paylaşım yapmasını değil, insanlara doğru şekilde ulaşmasını önemsiyoruz.",
      image: "/images/services/sosyal-medya.png",
      primaryLabel: "Ücretsiz görüşme",
      secondary: { label: "Hizmetleri keşfet", href: "#kapsam" },
    },
    featuresIntro: {
      title: "Sosyal medyada yalnızca paylaşım yapmak yetmez.",
      desc: "Ne paylaştığın, kime ulaştığın ve insanların markanı nasıl gördüğü bir bütün. Biz de çalışmalarımızı buna göre planlıyoruz.",
      note: "Bunların hepsini birlikte almak zorunda değilsin; ihtiyacın olanları ayrı ayrı seçebilirsin.",
    },
    features: [
      { title: "İçerik planlaması", desc: "Ne zaman, ne paylaşılacağını önceden belirleriz. Hesap son dakika hazırlanmış içeriklerle ilerlemez." },
      { title: "Tasarım", desc: "Markanın görsel diline uygun, birbiriyle tutarlı paylaşımlar hazırlarız." },
      { title: "Fotoğraf ve video", desc: "İşletmeni, ürünlerini ve hizmetlerini anlatan çekimler planlar ve gerçekleştiririz." },
      { title: "Reels ve kurgu", desc: "Ham görüntüleri izlenebilir, akıcı ve platforma uygun videolara dönüştürürüz." },
      { title: "Hesap yönetimi", desc: "Paylaşımların hazırlanmasını, planlanmasını ve yayın sürecini üstlenebiliriz." },
      { title: "Reklam yönetimi", desc: "İçeriklerini doğru hedef kitlelere ulaştırmak için Meta reklam kampanyaları planlar ve yönetiriz." },
    ],
    highlights: [
      {
        title: "Önce ne anlatacağımızı belirleriz.",
        desc: "Her gün bir şey paylaşmak zorunda değilsin. Önemli olan, doğru içeriği doğru zamanda paylaşmak. Markanı, hedef kitleni ve neye ulaşmak istediğini öğrenerek başlıyoruz.",
        image: POOL[3],
        widget: {
          kind: "calendar",
          title: "Bu haftanın planı",
          badge: "3 paylaşım",
          posts: [
            { day: "Pzt", title: "Ürün tanıtımı", type: "Post" },
            { day: "Çar", title: "Perde arkası", type: "Reels" },
            { day: "Cum", title: "Kampanya duyurusu", type: "Story" },
          ],
        },
      },
      {
        title: "İyi içerik tesadüfen çıkmaz.",
        desc: "Bir fotoğrafın ışığından videonun son kesimine kadar detaylarla ilgileniyoruz. İster sıfırdan çekim yapalım ister elindeki görüntüleri kullanalım, ortaya markana yakışan işler çıkarıyoruz.",
        image: POOL[4],
        widget: {
          kind: "editor",
          title: "Reels kurgusu",
          status: "Kurgu tamamlandı",
          tracks: ["Video", "Altyazı", "Müzik"],
          done: ["Renk düzenleme", "Altyazı"],
        },
      },
      {
        title: "Hazırladık, paylaştık, bitti değil.",
        desc: "İçeriğin nasıl karşılandığını, hangi paylaşımların ilgi gördüğünü ve neleri değiştirmemiz gerektiğini takip ediyoruz. Sonraki içerikleri bu bilgilerle planlıyoruz.",
        image: POOL[5],
        widget: {
          kind: "performance",
          title: "İçerik performansı",
          badge: "Örnek görünüm",
          metrics: ["Erişim", "Etkileşim", "Profil ziyaretleri"],
          top: { label: "En çok ilgi gören içerik", value: "Reels · Perde arkası" },
        },
      },
      {
        title: "İçeriğin son sözünü sen söylersin.",
        desc: "Hazırlanan tasarımları ve videoları seninle paylaşıyor, görüşlerini alıyoruz. Markanı tanıyorsun; ortaya çıkan işin içine sinmesi bizim için de önemli.",
        image: POOL[1],
        widget: {
          kind: "approval",
          title: "Onay bekleyen",
          badge: "1 içerik",
          item: "Yeni Reels taslağı",
          meta: "Önizleme hazır · 0:24",
          actions: ["Revizyon iste", "Onayla"],
        },
      },
    ],
    stepsIntro: { title: "3 adımda birlikte çalışmaya başlıyoruz." },
    steps: [
      {
        title: "Tanışma",
        desc: "İşletmeni, hedef kitleni ve sosyal medyadan beklentilerini konuşuyoruz. Hangi hizmetlere ihtiyacın olduğunu birlikte belirliyoruz.",
      },
      {
        title: "Planlama ve üretim",
        desc: "İçerik takvimini, çekimleri, tasarımları ve gerekiyorsa reklam çalışmalarını planlıyoruz. Ardından üretime geçiyoruz.",
      },
      {
        title: "Yayın ve takip",
        desc: "Onaylanan içerikleri yayınlıyor, sonuçlarını takip ediyoruz. Düzenli çalışmalarda sonraki ayın planını elde ettiğimiz verilere göre güncelliyoruz.",
      },
    ],
    scopeIntro: {
      title: "Sosyal medya için neler yapabiliriz?",
      desc: "Her işletmenin ihtiyacı aynı değil. Kimisi çekim istiyor, kimisi hazır videolarını düzenletmek, kimisi de hesabının bütün yönetimini bize bırakmak.",
    },
    scope: [
      { title: "Sosyal medya içerik planlaması" },
      { title: "Instagram ve Facebook hesap yönetimi" },
      { title: "Post ve carousel tasarımları" },
      { title: "Hikâye tasarımları" },
      { title: "Fotoğraf ve video çekimi" },
      { title: "Reels montaj ve video kurgu" },
      { title: "İçerik metinleri ve paylaşım hazırlığı" },
      { title: "Meta reklam yönetimi" },
      { title: "Performans takibi ve raporlama" },
    ],
    scopeNote: {
      title: "Hepsini almak zorunda değilsin",
      text: "Elinde hazır görüntüler varsa yalnızca kurgu desteği alabilirsin. İçeriklerini kendin hazırlıyorsan reklam yönetimi için çalışabiliriz. Hesabınla hiç ilgilenmek istemiyorsan daha kapsamlı bir yönetim planı oluşturabiliriz.",
      foot: "Hangi hizmetlerin pakete dahil olacağı ön görüşmede netleştirilir.",
    },
    deliverables: [],
    tools: [],
    audiencesIntro: { title: "Kimin için?" },
    audiences: [
      { title: "Girişim", desc: "Markasını yeni kuran, sosyal medya hesaplarını doğru bir başlangıçla oluşturmak isteyenler için.", image: POOL[0] },
      { title: "KOBİ", desc: "İşletmesiyle ilgilenirken düzenli içerik hazırlamaya vakit bulamayanlar için.", image: POOL[1] },
      { title: "Kurumsal", desc: "Marka dilini koruyarak birden fazla platformda düzenli ve planlı iletişim yürütmek isteyen ekipler için.", image: POOL[2] },
    ],
    fit: {
      title: "Sosyal medyaya ayıracak vaktin olmayabilir.",
      text: "İçerik hazırlamak, çekim yapmak, paylaşım planlamak ve reklamları takip etmek zaman istiyor. Hangi işleri bize bırakmak istediğini konuşalım.",
      cta: "İhtiyacımı konuşalım",
    },
    testimonials: [],
    faq: [
      {
        q: "Sosyal medya yönetimi fiyatları ne kadar?",
        a: "Sosyal medya hizmetlerimiz aylık 9.999 TL'den başlıyor. Fiyat; içerik sayısına, çekim ihtiyacına, video kurgu çalışmalarına ve hesap yönetiminin kapsamına göre değişiyor. Görüşmenin ardından ihtiyacına uygun bir teklif hazırlıyoruz.",
      },
      {
        q: "Sosyal medya yönetimi paketine neler dahil?",
        a: "İçerik planlama, tasarım, yayınlama ve hesap yönetimi gibi hizmetleri ihtiyacına göre bir araya getiriyoruz. Çekim, video kurgu ve reklam yönetimi gibi çalışmaların pakete dahil olup olmayacağını işe başlamadan önce netleştiriyoruz.",
      },
      {
        q: "Fotoğraf ve video çekimi yapıyor musunuz?",
        a: "Evet. Ürün, mekân ve sosyal medya içerikleri için fotoğraf ve video çekimleri planlayabiliyoruz. Çekimin yapılacağı yer, süresi ve kapsamına göre ayrı bir teklif hazırlıyoruz.",
      },
      {
        q: "Elimde hazır videolar var, yalnızca Reels kurgusu yaptırabilir miyim?",
        a: "Evet. Hazır görüntülerini göndererek yalnızca montaj, altyazı, renk düzenleme ve Reels hazırlama hizmeti alabilirsin. Bunun için aylık hesap yönetimi satın alman gerekmiyor.",
      },
      {
        q: "Instagram reklamlarını da yönetiyor musunuz?",
        a: "Evet. Instagram ve Facebook için Meta reklam kampanyaları oluşturuyor, hedef kitle ve bütçe planlaması yapıyor, kampanya performansını takip ediyoruz. Reklam harcamaları hizmet bedelinden ayrı hesaplanıyor.",
      },
      {
        q: "Paylaşılacak içerikleri önceden görebilir miyim?",
        a: "Evet. Hazırlanan içerikleri yayınlanmadan önce inceleyebilir, görüşlerini iletebilirsin. Yayın ve onay sürecinin ayrıntılarını çalışma planında belirliyoruz.",
      },
      {
        q: "Sosyal medya yönetimi ne kadar sürede sonuç verir?",
        a: "Bu, hesabının mevcut durumuna, sektöre, içeriklere ve hedeflerine göre değişir. İlk dönemde hangi içeriklerin nasıl performans gösterdiğini anlamaya odaklanırız. Düzenli çalışmaların sonuçlarını takip ederek içerik planını geliştiririz. Belirli takipçi veya satış artışı garantisi vermiyoruz.",
      },
      {
        q: "Sosyal medya hesaplarımın şifrelerini vermem gerekiyor mu?",
        a: "Mümkün olduğunda Meta Business Suite gibi platformların sunduğu yetkilendirme yöntemlerini kullanırız. Böylece hesaplarının sahipliği sende kalırken gerekli yönetim izinlerini paylaşabilirsin.",
      },
    ],
    faqCta: {
      title: "Aklındaki soruyu bulamadın mı?",
      text: "Sadece bir video düzenletmek veya bütün hesap yönetimini devretmek istiyor olabilirsin. Ne düşündüğünü anlat, birlikte değerlendirelim.",
      label: "Bize sor",
    },
    packagesIntro: {
      soft: "Sosyal medya için ihtiyacına uygun çalışma planını oluşturalım.",
      desc: "Tek seferlik içerik işlerinden düzenli hesap yönetimine kadar farklı çalışma seçeneklerimiz var.",
      cta: "Paketimi konuşalım",
      itemsLabel: "Örnek kapsam",
      price: {
        label: "Aylık sosyal medya hizmetleri",
        amount: "9.999 TL",
        suffix: " / ay'dan başlayan",
        notes: [
          "Tek seferlik çekim ve kurgu gibi hizmetler için kapsamına göre teklif verilir.",
          "Reklam bütçesi hizmet bedeline dahil değildir.",
        ],
      },
      note: "Paketlerdeki kalemler örnek kapsamdır; hangi hizmetlerin dahil olacağını ön görüşmede birlikte netleştiriyoruz.",
    },
    packages: [
      {
        title: "İçerik desteği",
        tagline: "İçeriklerini kendisi yöneten ama üretim desteğine ihtiyaç duyanlar için",
        items: ["Post ve hikâye tasarımı", "Reels montajı", "Video kurgu", "İçerik düzenlemeleri"],
      },
      {
        title: "Sosyal medya yönetimi",
        tagline: "Sosyal medya hesaplarını düzenli ve planlı şekilde yönetmek isteyenler için",
        featured: true,
        items: ["İçerik takvimi", "Post ve hikâye tasarımları", "Paylaşım planlaması", "Hesap yönetimi", "Performans raporlaması"],
      },
      {
        title: "Kapsamlı yönetim",
        tagline: "İçerik üretiminden reklam çalışmalarına kadar daha geniş destek isteyenler için",
        items: ["Sosyal medya yönetimi", "Fotoğraf ve video çekimi", "Reels ve içerik üretimi", "Meta reklam yönetimi", "Performans analizi"],
      },
    ],
  },
  // Paket kartları henüz yazılmadı (metin yarıda kesildi): şimdilik varsayılan paketler görünür
  branding: {
    hero: {
      eyebrow: "Branding",
      title: ["İyi bir marka,", "logosundan fazlasıdır."],
      description:
        "Markanı ilk kez gören biri ne iş yaptığını, nasıl bir işletme olduğunu ve seni diğerlerinden ayıran şeyleri anlayabilmeli. Logodan renklerine, ambalajdan sosyal medya tasarımlarına kadar birbiriyle uyumlu bir marka kimliği oluşturuyoruz.",
      image: "/images/services/branding.png",
      primaryLabel: "Ücretsiz görüşme",
      secondary: { label: "Neler yapıyoruz?", href: "#kapsam" },
    },
    featuresIntro: {
      title: "Markanın her yerde kendisi gibi görünmeli.",
      desc: "Kartvizitinde başka, Instagram hesabında başka, web sitende bambaşka görünmek zorunda değilsin. İyi hazırlanmış bir marka kimliği, nerede kullanılırsa kullanılsın kendini belli eder.",
      note: "Bunların hepsi her projede gerekmez; hangilerinin yapılacağını ihtiyacına göre birlikte belirleriz.",
    },
    features: [
      { title: "Logo tasarımı", desc: "Markanın karakterini yansıtan, farklı boyutlarda ve alanlarda kullanılabilen bir logo tasarlarız." },
      { title: "Renk ve tipografi", desc: "Markana uygun renkleri ve yazı karakterlerini belirler, birlikte nasıl kullanılacaklarını planlarız." },
      { title: "Görsel kimlik", desc: "Logo, renk, yazı ve diğer tasarım öğelerinin birbiriyle uyumlu olmasını sağlarız." },
      { title: "Kurumsal materyaller", desc: "Kartvizit, antetli kâğıt, sunum ve ihtiyaç duyduğun diğer kurumsal tasarımları hazırlarız." },
      { title: "Ambalaj ve etiket", desc: "Ürünlerinin rafta, pakette veya müşterinin elinde nasıl görüneceğini tasarlarız." },
      { title: "Marka kullanım kılavuzu", desc: "Hazırlanan kimliğin farklı alanlarda doğru kullanılabilmesi için gerekli kuralları bir araya getiririz." },
    ],
    highlights: [
      {
        title: "Önce markanı tanırız.",
        desc: "Ne yaptığını, kimlere ulaşmak istediğini ve insanların seni nasıl tanımasını istediğini konuşuyoruz. Tasarıma başlamadan önce markanın nasıl bir karaktere sahip olması gerektiğini birlikte belirliyoruz.",
        image: POOL[0],
        widget: {
          kind: "moodboard",
          title: "Marka karakteri",
          badge: "4 seçildi",
          words: [
            { label: "Sade", on: true },
            { label: "Samimi", on: true },
            { label: "Modern", on: true },
            { label: "Güvenilir", on: true },
            { label: "Lüks", on: false },
            { label: "Eğlenceli", on: false },
            { label: "Klasik", on: false },
          ],
          swatches: ["#2f6bff", "#111111", "#E9DFCF", "#FFFFFF"],
        },
      },
      {
        title: "Her çizginin bir nedeni var.",
        desc: "Logonun biçiminden renklerin uyumuna kadar tasarım kararlarını markanın kimliğine göre veriyoruz. Sadece güzel göründüğü için değil, markana yakıştığı için bir tasarımı seçiyoruz.",
        image: POOL[5],
        widget: {
          kind: "logo",
          title: "Logo çalışması",
          badge: "Taslak 3",
          boards: ["Eskiz", "Siyah-beyaz", "Renkli"],
          layouts: ["Yatay", "Dikey", "İkon"],
        },
      },
      {
        title: "Markan her yerde aynı dili konuşur.",
        desc: "Hazırladığımız görsel kimliği yalnızca bir logo dosyası olarak bırakmıyoruz. İhtiyacına göre kartvizitten ambalaja, sosyal medyadan dijital ekranlara kadar farklı alanlara uyarlıyoruz.",
        image: POOL[4],
        widget: {
          kind: "mockups",
          title: "Uygulamalar",
          badge: "Örnek marka",
          items: ["Kartvizit", "Ambalaj", "Sosyal medya", "Web sitesi"],
        },
      },
      {
        title: "Dosyaları teslim eder, kullanmayı da gösteririz.",
        desc: "Hazırlanan tasarımları ihtiyaç duyacağın formatlarda teslim ediyoruz. Hangi logonun nerede kullanılacağını, renkleri ve yazı karakterlerini nasıl uygulayacağını da açıkça anlatıyoruz.",
        image: POOL[2],
        widget: {
          kind: "files",
          title: "Marka dosyaları",
          badge: "Örnek teslim",
          files: [
            { name: "Logo dosyaları", formats: ["SVG", "PNG", "PDF"] },
            { name: "Renk kodları", formats: ["PDF"] },
            { name: "Tipografi", formats: ["PDF"] },
            { name: "Marka kullanım kılavuzu", formats: ["PDF"] },
          ],
        },
      },
    ],
    stepsIntro: { title: "3 adımda markanı şekillendiriyoruz." },
    steps: [
      {
        title: "Tanışma",
        desc: "İşletmeni, hedef kitleni ve tasarımdan beklentilerini konuşuyoruz. Mevcut bir markan varsa nelerin korunacağını, nelerin değişmesi gerektiğini birlikte değerlendiriyoruz.",
      },
      {
        title: "Tasarım",
        desc: "Belirlediğimiz doğrultuda tasarım çalışmalarına başlıyoruz. Önerilerimizi seninle paylaşıyor, görüşlerini alıyor ve seçilen yaklaşımı geliştiriyoruz.",
      },
      {
        title: "Teslim",
        desc: "Onaylanan tasarımları kullanılacakları alanlara uygun şekilde hazırlıyoruz. Kapsama dahil olan dosyaları ve kullanım bilgilerini teslim ediyoruz.",
      },
    ],
    scopeIntro: {
      title: "Markan için neler tasarlayabiliriz?",
      desc: "Bazen yalnızca yeni bir logoya, bazen de sıfırdan oluşturulmuş bir marka kimliğine ihtiyaç duyarsın. Yapılacak işleri buna göre belirliyoruz.",
    },
    scope: [
      { title: "Logo tasarımı" },
      { title: "Logo yenileme ve yeniden tasarım" },
      { title: "Kurumsal kimlik tasarımı" },
      { title: "Renk paleti ve tipografi" },
      { title: "Marka kullanım kılavuzu" },
      { title: "Kartvizit ve kurumsal evrak tasarımları" },
      { title: "Sosyal medya şablonları" },
      { title: "Sunum ve tanıtım materyalleri" },
      { title: "Ambalaj ve etiket tasarımı" },
      { title: "Marka uygulamaları ve mockup çalışmaları" },
    ],
    scopeNote: {
      title: "Her markanın ihtiyacı farklı",
      text: "Yeni kurulan bir işletmenin sıfırdan kimlik oluşturması gerekebilir. Mevcut bir marka ise yalnızca logosunu yenilemek veya görsel dilini toparlamak isteyebilir. Neye ihtiyacın olduğunu belirliyor, tasarım kapsamını ona göre oluşturuyoruz.",
    },
    deliverables: [],
    tools: [],
    audiencesIntro: { title: "Kimin için?" },
    audiences: [
      { title: "Girişim", desc: "İlk günden itibaren kendine ait, tutarlı bir marka görünümü oluşturmak isteyenler için.", image: POOL[0] },
      { title: "KOBİ", desc: "İşini büyütürken eskiyen veya birbirinden kopuk tasarımlarını yenilemek isteyen işletmeler için.", image: POOL[1] },
      { title: "Kurumsal", desc: "Farklı ekiplerde, mecralarda ve materyallerde aynı marka kimliğini korumak isteyen organizasyonlar için.", image: POOL[2] },
    ],
    fit: {
      title: "Markanın görünümünden memnun musun?",
      text: "Belki logon eskidi, belki de bugüne kadar kullandığın tasarımlar birbiriyle hiç uyuşmadı. Neyi değiştirmek istediğini anlat, birlikte değerlendirelim.",
      cta: "Markamı konuşalım",
    },
    testimonials: [],
    faq: [
      {
        q: "Logo ve kurumsal kimlik tasarımı fiyatları ne kadar?",
        a: "Branding hizmetlerimiz 16.499 TL'den başlıyor. Yalnızca logo tasarımı ile kapsamlı bir kurumsal kimlik çalışmasının ihtiyaçları farklı olduğu için fiyatı yapılacak işlere göre belirliyoruz. Görüşmenin ardından kapsamı ve teklifimizi paylaşıyoruz.",
      },
      {
        q: "Logo tasarımı ile kurumsal kimlik tasarımı arasındaki fark nedir?",
        a: "Logo, markanın en önemli görsel öğelerinden biridir. Kurumsal kimlik ise logonun yanı sıra renkleri, yazı karakterlerini, görsel kullanım kurallarını ve ihtiyaç duyulan diğer tasarımları kapsar. Böylece marka farklı alanlarda tutarlı bir görünüme sahip olur.",
      },
      {
        q: "Mevcut logomu değiştirmeden marka kimliği oluşturabilir miyiz?",
        a: "Evet. Logonu koruyarak renk paleti, tipografi, sosyal medya şablonları ve diğer marka materyalleri üzerinde çalışabiliriz. Önce mevcut tasarımları inceler, nelerin korunması gerektiğini birlikte değerlendiririz.",
      },
      {
        q: "Logo tasarım sürecinde fikrimi değiştirebilir miyim?",
        a: "Tasarım sürecinde hazırladığımız çalışmaları seninle paylaşıyor ve görüşlerini alıyoruz. Revizyon sayısını ve kapsamını projeye başlamadan önce netleştiriyoruz. Böylece hangi değişikliklerin çalışma kapsamında olduğunu baştan biliyorsun.",
      },
      {
        q: "Logo ve kurumsal kimlik tasarımı ne kadar sürer?",
        a: "Süre, hazırlanacak tasarımların sayısına ve revizyon ihtiyaçlarına göre değişir. Yalnızca logo çalışması ile ambalaj, sosyal medya ve kurumsal materyalleri de içeren bir projenin teslim süreleri aynı olmaz. Proje başlamadan önce sana bir çalışma takvimi sunuyoruz.",
      },
      {
        q: "Logo tasarımını hangi dosya formatlarında teslim ediyorsunuz?",
        a: "Teslim formatlarını kullanım ihtiyacına göre belirliyoruz. Web ortamı, baskı ve farklı tasarım uygulamaları için SVG, PNG ve PDF gibi formatlar kullanılabilir. Hangi dosyaların teslim edileceği teklif kapsamında açıkça belirtilir.",
      },
      {
        q: "Marka kullanım kılavuzu nedir?",
        a: "Markanın logosunun, renklerinin, yazı karakterlerinin ve diğer görsel öğelerinin nasıl kullanılacağını açıklayan bir dokümandır. Farklı tasarımcıların veya ekiplerin aynı marka dilini korumasını kolaylaştırır.",
      },
      {
        q: "Sadece ambalaj veya sosyal medya tasarımı yaptırabilir miyim?",
        a: "Evet. Mevcut marka kimliğini kullanarak yalnızca ihtiyaç duyduğun tasarımlar üzerinde de çalışabiliriz. Her proje için sıfırdan logo veya kurumsal kimlik satın alman gerekmiyor.",
      },
    ],
    faqCta: {
      title: "Aklındaki soruyu bulamadın mı?",
      text: "Yeni bir marka mı kuruyorsun, mevcut tasarımlarını mı yenilemek istiyorsun? Ne düşündüğünü anlat, birlikte bakalım.",
      label: "Bize sor",
    },
    packagesIntro: {
      soft: "Markanın ihtiyacı kadar tasarım.",
      desc: "Tek bir logodan kapsamlı bir marka kimliğine kadar, yapılacak işleri birlikte belirliyoruz.",
    },
  },
  "e-ticaret": {
    hero: {
      eyebrow: "E-Ticaret",
      title: ["Ürünlerin hazırsa,", "online mağazanı da hazırlayalım."],
      description:
        "Ürünlerini kolayca sergileyebileceğin, müşterilerinin güvenle alışveriş yapabileceği ve siparişlerini rahatça yönetebileceğin bir e-ticaret sitesi kuruyoruz. Tasarımdan ödeme altyapısına kadar ihtiyaçlarını birlikte planlıyoruz.",
      image: "/images/services/e-ticaret.png",
      primaryLabel: "Ücretsiz görüşme",
      secondary: { label: "Neler yapıyoruz?", href: "#kapsam" },
    },
    featuresIntro: {
      title: "İyi bir e-ticaret sitesi, alışverişi kolaylaştırır.",
      desc: "Müşterinin aradığı ürünü bulması, detaylarını incelemesi ve siparişini tamamlaması kolay olmalı. Sen de mağazanı yönetirken gereksiz işlerle uğraşmamalısın.",
      note: "Bu özelliklerin hepsi başlangıç fiyatına dahil değildir; kullanılabilirlikleri ve maliyetleri seçilen platforma göre değişebilir.",
    },
    features: [
      { title: "Ürün yönetimi", desc: "Ürünlerini, fiyatlarını, kategorilerini ve stok bilgilerini düzenleyebileceğin bir mağaza yapısı kurarız." },
      { title: "Mobil alışveriş", desc: "Müşterilerin telefonlarından da ürünlerini rahatça inceleyip satın alabilsin." },
      { title: "Sepet ve ödeme", desc: "Ürün seçiminden ödeme adımına kadar anlaşılır ve güvenilir bir alışveriş akışı oluştururuz." },
      { title: "Sipariş takibi", desc: "Gelen siparişleri, durumlarını ve müşteri bilgilerini yönetebileceğin bir altyapı hazırlarız." },
      { title: "Kargo entegrasyonları", desc: "İhtiyacına ve seçilen platforma göre kargo süreçlerini kolaylaştıran bağlantılar kurabiliriz." },
      { title: "Geliştirilebilir altyapı", desc: "Ürünlerin ve ihtiyaçların arttığında mağazanı yeniden kurmak zorunda kalmadan geliştirebileceğin bir yapı hedefleriz." },
    ],
    highlights: [
      {
        title: "Önce ne sattığını anlarız.",
        desc: "Kaç ürünün var, müşterilerin nasıl alışveriş yapıyor, hangi özelliklere ihtiyacın olacak? Bunları konuşup mağazanın yapısını belirliyoruz. Gereksiz özellikler eklemek yerine işini kolaylaştıracak şeylere odaklanıyoruz.",
        image: POOL[3],
        widget: {
          kind: "categories",
          title: "Kategoriler",
          badge: "Örnek mağaza",
          tree: [
            { label: "Tüm ürünler", children: ["Yeni gelenler", "Çok satanlar"] },
            { label: "Koleksiyonlar", children: ["Yaz keteni", "Ev tekstili"] },
          ],
        },
      },
      {
        title: "Ürünü beğenmek kolay. Satın almak da öyle olmalı.",
        desc: "Müşterinin ürünleri rahatça inceleyebilmesi, seçenekleri karşılaştırabilmesi ve siparişini zorlanmadan tamamlayabilmesi için çalışıyoruz.",
        image: POOL[4],
        widget: {
          kind: "product",
          title: "Ürün sayfası",
          badge: "Örnek ürün",
          name: "Keten gömlek",
          price: "899 TL",
          sizes: ["S", "M", "L", "XL"],
          selected: "M",
          cta: "Sepete ekle",
        },
      },
      {
        title: "Siparişin her adımı belli olsun.",
        desc: "Ödeme, sipariş onayı ve kargo süreçlerinin düzgün işlemesi en az mağazanın görünümü kadar önemli. Müşterinin alışverişini tamamlayabildiği, senin de siparişlerini takip edebildiğin bir yapı kuruyoruz.",
        image: POOL[5],
        widget: {
          kind: "orders",
          title: "Sipariş durumu",
          badge: "Örnek sipariş",
          order: "Keten gömlek · M",
          steps: ["Yeni sipariş", "Ödeme alındı", "Hazırlanıyor", "Kargoya verildi"],
          current: 2,
        },
      },
      {
        title: "Mağazanı yönetmek de kolay olsun.",
        desc: "Yeni ürün eklemek, fiyat değiştirmek veya stokları kontrol etmek için sürekli teknik destek beklememelisin. Seçtiğimiz altyapının sunduğu yönetim araçlarını kullanabileceğin şekilde mağazanı hazırlıyoruz.",
        image: POOL[1],
        widget: {
          kind: "inventory",
          title: "Ürünler",
          badge: "Örnek ürün",
          product: { name: "Keten gömlek", price: "899 TL", stock: "24 adet", status: "Yayında" },
        },
      },
    ],
    stepsIntro: { title: "3 adımda mağazanı satışa hazırlıyoruz." },
    steps: [
      {
        title: "İhtiyaçlarını belirliyoruz",
        desc: "Ürünlerini, iş modelini ve mağazandan beklentilerini konuşuyoruz. İhtiyacına uygun e-ticaret altyapısını ve yapılacak işleri belirliyoruz.",
      },
      {
        title: "Mağazanı kuruyoruz",
        desc: "Tasarımı, ürün ve kategori yapısını, ödeme ve gerekli entegrasyonları hazırlıyoruz. Önemli aşamalarda görüşünü ve onayını alıyoruz.",
      },
      {
        title: "Test edip yayına alıyoruz",
        desc: "Sepet, ödeme ve sipariş süreçlerini kontrol ediyoruz. Mağazanı yayına hazırlıyor, yönetim alanını nasıl kullanacağını gösteriyoruz.",
      },
    ],
    scopeIntro: {
      title: "Online mağazan için neler yapabiliriz?",
      desc: "Her mağazanın ürün sayısı, satış şekli ve teknik ihtiyaçları farklı. Yapılacak işleri buna göre belirliyoruz.",
    },
    scope: [
      { title: "E-ticaret sitesi tasarımı" },
      { title: "E-ticaret altyapısı kurulumu" },
      { title: "Ürün ve kategori sayfaları" },
      { title: "Mobil uyumlu mağaza" },
      { title: "Sepet ve ödeme entegrasyonları" },
      { title: "Kargo entegrasyonları" },
      { title: "Sipariş ve stok yönetimi" },
      { title: "Teknik SEO altyapısı" },
      { title: "Kampanya ve indirim alanları" },
      { title: "Analytics ve dönüşüm takibi kurulumu" },
      { title: "İhtiyaca özel geliştirmeler ve entegrasyonlar" },
    ],
    scopeNote: {
      title: "Her mağazaya aynı sistemi kurmuyoruz",
      text: "On ürün satan bir butik ile binlerce ürünü yöneten bir işletmenin ihtiyaçları aynı değil. Ürün sayını, satış kanallarını ve bütçeni dikkate alarak sana uygun altyapıyı ve özellikleri birlikte seçiyoruz.",
    },
    deliverables: [],
    tools: [],
    audiencesIntro: { title: "Kimin için?" },
    audiences: [
      { title: "Girişim", desc: "Ürünlerini ilk kez internette satmaya başlayacak ve kendi online mağazasını kurmak isteyenler için.", image: POOL[0] },
      { title: "KOBİ", desc: "Mevcut satışlarını internet üzerinden de sürdürmek, siparişlerini daha düzenli yönetmek isteyen işletmeler için.", image: POOL[1] },
      { title: "Kurumsal", desc: "Geniş ürün katalogları, farklı satış süreçleri veya özel entegrasyon ihtiyaçları bulunan işletmeler için.", image: POOL[2] },
    ],
    fit: {
      title: "Online satışa başlamak düşündüğün kadar karmaşık olmak zorunda değil.",
      text: "Hangi altyapıyı kullanacağını, ödeme sistemini nasıl kuracağını veya ürünlerini nasıl yöneteceğini bilmiyor olabilirsin. Ürünlerini ve ihtiyaçlarını anlat, nereden başlayacağımızı birlikte belirleyelim.",
      cta: "Mağazamı konuşalım",
    },
    testimonials: [],
    faq: [
      {
        q: "E-ticaret sitesi yaptırmak ne kadar tutar?",
        a: "E-ticaret sitesi hizmetlerimiz 18.499 TL'den başlıyor. Fiyat; ürün sayısına, tasarımın kapsamına, kullanılacak altyapıya ve ihtiyaç duyulan entegrasyonlara göre değişiyor. İhtiyaçlarını belirledikten sonra sana özel teklif hazırlıyoruz.",
      },
      {
        q: "E-ticaret sitesi kurmak için şirket sahibi olmak gerekiyor mu?",
        a: "Türkiye'de ticari faaliyet kapsamında internet üzerinden satış yaparken vergi ve faturalandırma yükümlülüklerin bulunabilir. Ayrıca ödeme sağlayıcılarının işletme bilgileriyle ilgili şartları vardır. Şirket kuruluşu ve yasal yükümlülükler için mali müşavirinden destek almanı öneriyoruz.",
      },
      {
        q: "Shopify mı, WooCommerce mi kullanıyorsunuz?",
        a: "Projenin ihtiyaçlarına göre farklı altyapıları değerlendirebiliriz. Shopify, WooCommerce veya başka bir çözümün uygunluğu; ürün sayısı, bütçe, entegrasyonlar ve yönetim ihtiyaçlarına bağlıdır. Kullanılacak platformu proje başlamadan önce birlikte netleştiriyoruz.",
      },
      {
        q: "E-ticaret siteme ürünleri kendim ekleyebilir miyim?",
        a: "Evet. Kurduğumuz mağazanın yönetim alanından ürün ekleme, fiyat güncelleme ve stok düzenleme gibi işlemleri yapabilmeni hedefliyoruz. Kullanacağın yönetim araçları seçilen altyapıya göre değişir.",
      },
      {
        q: "Sanal POS ve ödeme sistemi kurulumunu yapıyor musunuz?",
        a: "Seçilen altyapının desteklediği ödeme sağlayıcılarının entegrasyonunda yardımcı olabiliriz. Ödeme kuruluşunun üyelik, onay ve komisyon koşulları ayrıca geçerlidir.",
      },
      {
        q: "Kargo firmalarıyla entegrasyon yapılabilir mi?",
        a: "Evet, uygun platform ve entegrasyon seçenekleri üzerinden kargo süreçleri mağazaya bağlanabilir. Kullanılabilecek firmalar ve olası ek maliyetler proje kapsamında belirlenir.",
      },
      {
        q: "E-ticaret sitem ne kadar sürede hazır olur?",
        a: "Süre; ürün sayısına, tasarımın kapsamına, içeriklerin hazır olup olmamasına ve entegrasyon ihtiyaçlarına göre değişir. Proje başlamadan önce yapılacak işleri ve tahmini teslim takvimini netleştiriyoruz.",
      },
      {
        q: "Ürün fotoğraflarını ve açıklamalarını da hazırlıyor musunuz?",
        a: "İhtiyaç duyulursa ürün fotoğrafı çekimi, görsel düzenleme ve ürün açıklaması hazırlama gibi çalışmaları da projeye ekleyebiliriz. Bunların kapsamı ve maliyeti ayrıca belirlenir.",
      },
      {
        q: "E-ticaret sitem Google'da görünür mü?",
        a: "Mağazanı teknik SEO açısından uygun bir yapıyla hazırlıyoruz. Ürün sayfaları, kategori yapısı ve temel arama motoru ayarlarını dikkate alıyoruz. Ancak belirli bir sıralama veya organik trafik garantisi vermiyoruz. Daha kapsamlı SEO çalışmaları ayrıca planlanabilir.",
      },
      {
        q: "E-ticaret sitesi kurulumundan sonra başka ücretler olacak mı?",
        a: "Seçilen altyapıya göre platform aboneliği, hosting, alan adı, ödeme komisyonları ve ücretli uygulamalar gibi devam eden maliyetler olabilir. Bu kalemleri proje başlamadan önce mümkün olduğunca netleştiriyoruz.",
      },
    ],
    faqCta: {
      title: "Aklındaki soruyu bulamadın mı?",
      text: "Ürün sayından ödeme sistemine kadar merak ettiğin bir şey varsa bize sorabilirsin. İhtiyacına göre birlikte değerlendirelim.",
      label: "Bize sor",
    },
    packagesIntro: {
      soft: "Online satış için doğru yerden başlayalım.",
      desc: "Yeni bir mağaza kuruyor veya mevcut e-ticaret altyapını geliştirmek istiyor olabilirsin. İhtiyacına göre çalışma kapsamını birlikte belirliyoruz.",
      cta: "Mağazamı konuşalım",
      itemsLabel: "Örnek kapsam",
      price: {
        label: "Tek seferlik kurulum ve geliştirme hizmet bedeli",
        amount: "18.499 TL",
        suffix: "'den başlayan fiyatlarla",
        notes: [
          "Fiyat; mağazanın kapsamına, ürün sayısına ve entegrasyon ihtiyaçlarına göre değişir.",
          "Platform abonelikleri, ödeme komisyonları ve üçüncü taraf hizmet bedelleri OX Dijital hizmet bedelinden ayrıdır.",
        ],
      },
      note: "Paketlerdeki kalemler örnek kapsamdır; hangi hizmetlerin dahil olacağını ön görüşmede birlikte netleştiriyoruz.",
    },
    packages: [
      {
        title: "Başlangıç mağazası",
        tagline: "Az sayıda ürünle online satışa başlamak isteyenler için",
        items: [
          "E-ticaret altyapısı kurulumu",
          "Hazır tema uyarlaması veya temel tasarım",
          "Ürün ve kategori yapısı",
          "Ödeme entegrasyonu",
          "Mobil uyum",
        ],
      },
      {
        title: "Gelişmiş mağaza",
        tagline: "Daha kapsamlı ürün kataloğu ve satış ihtiyaçları bulunan işletmeler için",
        featured: true,
        items: [
          "Markaya uyarlanmış mağaza tasarımı",
          "Ürün ve kategori yönetimi",
          "Ödeme ve kargo entegrasyonları",
          "Kampanya ve indirim alanları",
          "Analytics kurulumu",
          "Teknik SEO düzenlemeleri",
        ],
      },
      {
        title: "Özel e-ticaret",
        tagline: "Standart mağaza yapısının ötesinde ihtiyaçları bulunan işletmeler için",
        items: [
          "Özel arayüz ve alışveriş akışları",
          "Gelişmiş entegrasyonlar",
          "Özel ürün ve sipariş süreçleri",
          "İhtiyaca uygun otomasyonlar",
          "Ek yazılım geliştirmeleri",
        ],
      },
    ],
  },
  seo: {
    meta: {
      title: "SEO Hizmeti ve Arama Motoru Optimizasyonu | OX Dijital",
      description:
        "Teknik SEO, içerik optimizasyonu, anahtar kelime analizi ve yerel SEO hizmetleri. OX Dijital ile SEO çalışmalarını keşfet. Aylık 21.499 TL'den başlayan fiyatlarla.",
    },
    hero: {
      eyebrow: "SEO — Arama motoru optimizasyonu",
      title: ["Müşterilerin seni arıyor.", "Peki bulabiliyor mu?"],
      description:
        "Google'da görünür olmak için yalnızca bir web sitesine sahip olmak yetmiyor. Sitenin teknik altyapısını, içeriklerini ve arama sonuçlarındaki performansını birlikte ele alıyor; doğru aramalarda daha görünür olman için çalışıyoruz.",
      image: "/images/services/seo.jpg",
      primaryLabel: "Ücretsiz görüşme",
      secondary: { label: "SEO çalışmalarını keşfet", href: "#kapsam" },
    },
    featuresIntro: {
      title: "Google'ın siteni anlaması, müşterilerin de seni bulması gerekiyor.",
      desc: "SEO tek bir ayardan ibaret değil. Sitenin nasıl kurulduğundan hangi sorulara cevap verdiğine kadar pek çok ayrıntı arama sonuçlarındaki görünürlüğünü etkileyebilir.",
      note: "Bunlar SEO çalışmalarının genel kapsamı; her projenin başlangıcında hepsi yer almak zorunda değil.",
    },
    features: [
      { title: "Teknik SEO", desc: "Arama motorlarının siteni taramasını ve anlamasını zorlaştıran teknik sorunları tespit edip iyileştiririz." },
      { title: "Anahtar kelime araştırması", desc: "Müşterilerinin hangi kelimelerle arama yaptığını araştırır, çalışmalarımızı bu aramalara göre planlarız." },
      { title: "Site içi SEO", desc: "Sayfa başlıklarını, açıklamaları, bağlantıları ve içerik yapısını arama motorları ve ziyaretçiler için düzenleriz." },
      { title: "İçerik optimizasyonu", desc: "Mevcut sayfalarını geliştirir, ihtiyaç duyulan konularda yeni içerik çalışmalarını planlarız." },
      { title: "Yerel SEO", desc: "Bölgesindeki müşterilere ulaşmak isteyen işletmelerin Google aramalarındaki ve Haritalar'daki görünürlüğü üzerine çalışırız." },
      { title: "Performans takibi", desc: "Organik trafik, arama sorguları ve sayfa performansını takip ederek hangi çalışmaların karşılık bulduğunu inceleriz." },
    ],
    highlights: [
      {
        title: "Müşterin ne arıyorsa, oradan başlarız.",
        desc: "Senin işini nasıl anlattığınla müşterinin Google'a ne yazdığı her zaman aynı olmayabilir. İnsanların hangi sorulara cevap aradığını, hangi hizmetlerle ilgilendiğini ve rakiplerini nasıl bulduğunu araştırıyoruz.",
        image: POOL[3],
        widget: {
          kind: "keywords",
          title: "Arama araştırması",
          badge: "Örnek işletme",
          query: "diş kliniği",
          rows: [
            { term: "Balıkesir diş kliniği", intent: "Yerel arama" },
            { term: "Diş beyazlatma fiyatları", intent: "Bilgi arama" },
            { term: "Diş kliniği randevu", intent: "Hizmet arama" },
          ],
        },
      },
      {
        title: "Görünmeyen sorunları da çözeriz.",
        desc: "Yavaş açılan sayfalar, bozuk bağlantılar veya arama motorlarının erişemediği içerikler sitenin performansını etkileyebilir. Teknik sorunları tespit edip önceliklerine göre düzenliyoruz.",
        image: POOL[5],
        widget: {
          kind: "audit",
          title: "Teknik kontrol",
          badge: "3 / 4",
          items: [
            { label: "Sayfa başlıkları", status: "Kontrol edildi", done: true },
            { label: "Site haritası", status: "Mevcut", done: true },
            { label: "Bozuk bağlantılar", status: "İnceleniyor", done: false },
            { label: "Mobil kullanılabilirlik", status: "Kontrol edildi", done: true },
          ],
        },
      },
      {
        title: "Doğru soruya, doğru sayfada cevap veririz.",
        desc: "İnsanların aradığı bilgiyi bulamadığı bir sayfanın güzel görünmesi tek başına yeterli değil. Hizmetlerini, ürünlerini ve uzmanlığını ziyaretçinin anlayacağı şekilde anlatan içerikler üzerinde çalışıyoruz.",
        image: POOL[4],
        widget: {
          kind: "serp",
          title: "Arama sonucu ve sayfa",
          badge: "Örnek işletme",
          result: {
            url: "ornekklinik.com › dis-beyazlatma",
            heading: "Diş Beyazlatma | Örnek Klinik",
            desc: "Diş beyazlatma işlemi, uygulama süreci ve merak edilenler hakkında bilgi alın.",
          },
          outline: ["İşlem hakkında", "Kimler için uygun?", "Sık sorulan sorular", "Randevu ve iletişim"],
        },
      },
      {
        title: "Neyin değiştiğini birlikte görürüz.",
        desc: "Hangi aramalardan ziyaretçi geldiğini, hangi sayfaların geliştiğini ve nerelerde hâlâ çalışmamız gerektiğini takip ediyoruz. Sonraki adımları tahminlere değil, elde ettiğimiz verilere göre belirliyoruz.",
        image: POOL[1],
        widget: {
          kind: "search",
          title: "Arama performansı",
          badge: "Örnek görünüm",
          metrics: ["Organik tıklamalar", "Arama gösterimleri"],
          pages: ["/dis-beyazlatma", "/randevu"],
          queries: ["diş beyazlatma balıkesir", "implant fiyatları"],
        },
      },
    ],
    stepsIntro: { title: "3 adımda SEO çalışmalarına başlıyoruz." },
    steps: [
      {
        title: "Analiz",
        desc: "Sitenin mevcut durumunu, rakiplerini ve hangi aramalarda görünmek istediğini inceliyoruz. Öncelikli sorunları ve fırsatları belirliyoruz.",
      },
      {
        title: "İyileştirme",
        desc: "Teknik düzenlemelerden içerik çalışmalarına kadar belirlediğimiz planı uyguluyoruz. Yapılacak işleri önem sırasına göre ele alıyoruz.",
      },
      {
        title: "Takip",
        desc: "Arama performansını düzenli olarak inceliyoruz. Hangi çalışmaların karşılık bulduğunu değerlendiriyor, sonraki adımları buna göre planlıyoruz.",
      },
    ],
    scopeIntro: {
      title: "SEO için neler yapabiliriz?",
      desc: "Her sitenin aynı çalışmaya ihtiyacı yok. Kimisinin teknik sorunları var, kimisinin içerikleri eksik, kimisi de bulunduğu bölgede yeterince görünür değil.",
    },
    scope: [
      { title: "SEO analizi ve site denetimi" },
      { title: "Anahtar kelime araştırması" },
      { title: "Rakip analizi" },
      { title: "Teknik SEO iyileştirmeleri" },
      { title: "Site içi SEO düzenlemeleri" },
      { title: "İçerik stratejisi" },
      { title: "Mevcut içeriklerin optimizasyonu" },
      { title: "Yerel SEO çalışmaları" },
      { title: "Google İşletme Profili optimizasyonu" },
      { title: "Google Search Console kurulumu ve takibi" },
      { title: "Organik trafik ve performans raporlaması" },
      { title: "İhtiyaca göre ek SEO çalışmaları" },
    ],
    scopeNote: {
      title: "Önce sorunun nerede olduğuna bakalım",
      text: "Siten yeterince ziyaretçi almıyor olabilir. Belki doğru aramalarda görünmüyorsun, belki de mevcut sayfaların ziyaretçilerin aradığı bilgiyi vermiyor. Önce bunu anlamaya çalışıyor, ardından hangi işlere öncelik vereceğimizi belirliyoruz.",
      foot: "Listedeki çalışmalar ihtiyaca göre seçilir; her SEO çalışmasında hepsi yapılmaz.",
    },
    deliverables: [],
    tools: [],
    audiencesIntro: { title: "Kimin için?" },
    audiences: [
      {
        title: "Girişim",
        desc: "Yeni web sitesinin arama motorları tarafından doğru anlaşılmasını ve zamanla organik görünürlük kazanmasını isteyen işletmeler için.",
        image: POOL[0],
      },
      {
        title: "KOBİ",
        desc: "Google üzerinden daha fazla potansiyel müşteriye ulaşmak ve bulunduğu bölgede daha görünür olmak isteyen işletmeler için.",
        image: POOL[1],
      },
      {
        title: "Kurumsal",
        desc: "Çok sayıda sayfası, geniş içerik yapısı veya rekabetçi arama hedefleri bulunan markalar için.",
        image: POOL[2],
      },
    ],
    fit: {
      title: "Google'da neden görünmediğini merak ediyor musun?",
      text: "Belki teknik bir sorun var, belki rakiplerin daha kapsamlı içeriklere sahip. Siteni birlikte değerlendirelim, nereden başlayabileceğimizi konuşalım.",
      cta: "Sitemi konuşalım",
    },
    testimonials: [],
    faq: [
      {
        q: "SEO nedir, ne işe yarar?",
        a: "SEO, web sitenin Google gibi arama motorlarında daha iyi anlaşılması ve ilgili aramalarda daha görünür olması için yapılan çalışmalardır. Teknik düzenlemeler, içerik geliştirme ve site yapısının iyileştirilmesi bu çalışmaların parçalarıdır. Amaç, sunduğun ürün veya hizmetlerle ilgilenen kişilerin siteni daha kolay bulmasını sağlamaktır.",
      },
      {
        q: "SEO fiyatları ne kadar?",
        a: "SEO hizmetlerimiz aylık 21.499 TL'den başlıyor. Fiyat; web sitenin büyüklüğüne, sektöründeki rekabete ve yapılacak çalışmaların kapsamına göre değişiyor. İlk görüşmenin ardından ihtiyaçlarını değerlendirip sana özel teklif hazırlıyoruz.",
      },
      {
        q: "SEO çalışmaları ne kadar sürede sonuç verir?",
        a: "SEO sonuçları sitenin mevcut durumuna, rekabet düzeyine ve yapılan çalışmaların kapsamına göre değişir. Bazı teknik iyileştirmeler daha kısa sürede etkisini gösterebilirken, organik görünürlüğün gelişmesi birkaç ay veya daha uzun sürebilir. Belirli bir süre içinde sıralama ya da trafik artışı garantisi vermiyoruz.",
      },
      {
        q: "SEO ile Google Ads arasındaki fark nedir?",
        a: "Google Ads, reklam bütçesi kullanarak arama sonuçlarında reklam yayınlamanı sağlar. SEO ise sitenin organik arama sonuçlarındaki görünürlüğünü geliştirmeye odaklanır. İkisi farklı çalışma yöntemleridir ve işletmenin hedeflerine göre birlikte de kullanılabilir.",
      },
      {
        q: "Google'da ilk sıraya çıkacağımı garanti ediyor musunuz?",
        a: "Hayır. Google sıralamaları rekabet, içerik kalitesi, arama niyeti ve birçok farklı etkene bağlıdır. Hiçbir ajans Google'da kalıcı bir birincilik garantisi veremez. Biz yapılacak çalışmaları, hedefleri ve elde edilen sonuçları açıkça paylaşmaya odaklanıyoruz.",
      },
      {
        q: "Web sitemin SEO'ya uygun olup olmadığını nasıl anlarım?",
        a: "Teknik altyapı, sayfa yapısı, içerikler, indekslenme durumu ve arama performansı gibi alanlar incelenerek sitenin güçlü ve geliştirilmesi gereken yönleri belirlenebilir. İlk görüşmede mevcut durumunu konuşup detaylı bir çalışma gerekip gerekmediğini değerlendirebiliriz.",
      },
      {
        q: "Yerel SEO nedir? Balıkesir'deki işletmeler için çalışıyor musunuz?",
        a: "Yerel SEO, belirli bir şehirde veya bölgede hizmet veren işletmelerin ilgili aramalarda daha kolay bulunmasına yönelik çalışmalardır. Balıkesir ve çevresindeki işletmeler için Google İşletme Profili, konum bilgileri ve yerel arama görünürlüğü üzerine çalışmalar planlayabiliyoruz.",
      },
      {
        q: "Google Haritalar'da görünmek için ne yapmalıyım?",
        a: "Uygun işletmeler için Google İşletme Profili oluşturmak veya mevcut profili doğrulayıp düzenlemek önemli bir adımdır. İşletme kategorisi, iletişim bilgileri, çalışma saatleri ve profilin güncelliği gibi konuları değerlendiriyoruz. Haritalar'da belirli bir sıra garantisi vermiyoruz.",
      },
      {
        q: "SEO çalışmaları için web sitemi yeniden yaptırmam gerekir mi?",
        a: "Her zaman değil. Mevcut sitenin altyapısı uygunsa teknik düzenlemeler ve içerik iyileştirmeleriyle ilerleyebiliriz. Ancak bazı teknik sorunlar mevcut sistemde çözülemiyorsa daha kapsamlı geliştirmeler gerekebilir. Önce mevcut yapıyı değerlendiriyoruz.",
      },
      {
        q: "SEO çalışmaları sırasında hangi raporları alacağım?",
        a: "Çalışma kapsamına göre organik trafik, arama sorguları, sayfa performansı ve tamamlanan iyileştirmeler gibi bilgileri raporlayabiliriz. Amacımız yalnızca rakam paylaşmak değil, nelerin değiştiğini ve bir sonraki dönemde neye odaklanacağımızı anlaşılır şekilde göstermek.",
      },
      {
        q: "SEO için her ay ödeme yapmak gerekiyor mu?",
        a: "SEO düzenli takip ve iyileştirme gerektiren bir çalışma alanıdır. Aylık yönetim hizmetlerimizin başlangıç bedeli 21.499 TL'dir. Yalnızca belirli bir teknik sorun veya sınırlı kapsamlı SEO çalışması için desteğe ihtiyacın varsa bunu ayrıca değerlendirip proje bazlı teklif hazırlayabiliriz.",
      },
      {
        q: "SEO çalışmaları bittikten sonra sıralamam korunur mu?",
        a: "Belirli bir sıralamanın sürekli korunacağı garanti edilemez. Rakiplerin çalışmaları, arama algoritmalarındaki değişiklikler ve sitenin güncelliği sonuçları etkileyebilir. Bu nedenle SEO performansını zaman içinde takip etmek önemlidir.",
      },
    ],
    faqCta: {
      title: "Aklındaki soruyu bulamadın mı?",
      text: "Sitenle ilgili merak ettiğin bir şey varsa doğrudan sorabilirsin. Ne yapmak istediğini konuşup birlikte değerlendirelim.",
      label: "Bize sor",
    },
    packagesIntro: {
      soft: "SEO çalışmalarını sitenin ihtiyacına göre planlayalım.",
      desc: "Küçük bir işletme sitesiyle yüzlerce sayfası olan bir e-ticaret mağazasının ihtiyaçları aynı değil. Çalışmanın kapsamını buna göre belirliyoruz.",
      cta: "SEO'yu konuşalım",
      itemsLabel: "Örnek kapsam",
      price: {
        label: "Aylık SEO yönetimi",
        amount: "21.499 TL",
        suffix: " / ay'dan başlayan",
        notes: [
          "Sınırlı kapsamlı veya tek seferlik SEO çalışmaları için kapsama göre teklif verilir.",
          "Fiyat, sitenin büyüklüğüne, rekabet düzeyine ve çalışmanın kapsamına göre değişir. İçerik üretimi veya ek yazılım geliştirmelerinin bedeli ayrıca belirlenebilir.",
        ],
      },
      note: "Paketlerdeki kalemler örnek kapsamdır; hangi çalışmaların dahil olacağını ön görüşmede birlikte netleştiriyoruz.",
    },
    packages: [
      {
        title: "SEO temeli",
        tagline: "Teknik sorunlarını gidermek ve arama motorları için daha sağlam bir başlangıç yapmak isteyen siteler için",
        items: [
          "SEO analizi",
          "Teknik SEO kontrolü",
          "Site içi SEO düzenlemeleri",
          "Temel anahtar kelime araştırması",
          "Search Console kurulumu veya kontrolü",
        ],
      },
      {
        title: "SEO yönetimi",
        tagline: "Organik görünürlüğünü düzenli çalışmalarla geliştirmek isteyen işletmeler için",
        featured: true,
        items: ["Teknik SEO takibi", "Anahtar kelime ve rakip analizi", "Site içi optimizasyon", "İçerik planlaması", "Performans raporlaması"],
      },
      {
        title: "Kapsamlı SEO",
        tagline: "Geniş web siteleri, rekabetçi sektörler ve daha kapsamlı organik büyüme hedefleri bulunan işletmeler için",
        items: [
          "Kapsamlı teknik SEO",
          "Gelişmiş anahtar kelime araştırması",
          "İçerik stratejisi ve optimizasyon",
          "Rakip ve arama performansı analizi",
          "Sürekli iyileştirme planlaması",
          "İhtiyaca özel ek SEO çalışmaları",
        ],
      },
    ],
  },
};

export function getServicePage(slug: string): ServicePage | null {
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  return { service, ...build(service), ...OVERRIDES[slug] };
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
