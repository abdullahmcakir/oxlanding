import type { FaqItem } from "@/components/faq/faq";
import { SERVICES, type ItemKind, type Service } from "@/components/services/services-data";

// Hizmet detay sayfalarının (/hizmetler/[slug]) içeriği.
// Düzen referansı: clean-tuna-722417.framer.app/hizmetayrı (Framer "Stratux" şablonu).
// TÜMÜ YER TUTUCU: metinler her hizmetin adından üretiliyor, görseller ana sayfadaki hizmet görselleri.
// Bir hizmete özel içerik yazmak için OVERRIDES içine o hizmetin slug'ıyla istediğin alanları ekle.

export type ServicePage = {
  service: Service;
  hero: { title: [string, string]; description: string; image: string };
  features: { title: string; desc: string }[];
  // "Bir bakışta": süre, teslim, destek gibi kısa bilgiler
  facts: { label: string; value: string }[];
  statement: string;
  highlights: {
    title: string;
    desc: string;
    image: string;
    note: { title: string; text: string; badge?: string };
  }[];
  steps: { title: string; desc: string }[];
  // "Neler dahil?": kapsam kalemleri, teslim edilenler, kullanılan araçlar
  scope: { title: string; desc: string; kind: ItemKind }[];
  deliverables: string[];
  tools: string[];
  audiences: { title: string; desc: string; image: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  faq: FaqItem[];
  // Sayfanın sonundaki paketler (CTA yerine)
  packages: { title: string; tagline: string; duration: string; items: string[]; featured?: boolean }[];
};

type Details = Pick<ServicePage, "facts" | "scope" | "deliverables" | "tools">;

// Hizmete özel "Bir bakışta" ve "Neler dahil?" içerikleri.
// Süreler, revizyon sayıları, destek süreleri ve sağlayıcı adları TASLAK: yayından önce teyit edilmeli.
const DETAILS: Record<string, Details> = {
  website: {
    facts: [
      { label: "Süre", value: "3–6 hafta" },
      { label: "Revizyon", value: "2 tur tasarım" },
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
      { label: "Paylaşım", value: "Ayda 12–20 içerik" },
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
      { label: "Süre", value: "3–5 hafta" },
      { label: "Konsept", value: "3 farklı logo yönü" },
      { label: "Revizyon", value: "2 tur" },
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
  otomasyon: {
    facts: [
      { label: "Süre", value: "2–6 hafta" },
      { label: "Başlangıç", value: "Ücretsiz süreç analizi" },
      { label: "Altyapı", value: "Bulutta ya da kendi sunucunda" },
      { label: "Destek", value: "İzleme ve bakım" },
    ],
    scope: [
      { title: "Süreç analizi", desc: "Ekibinin her gün tekrar ettiği işleri çıkarıp en çok zaman kazandıracak olanları seçiyoruz.", kind: "hizmet" },
      { title: "Akış tasarımı", desc: "Hangi olayın neyi tetikleyeceğini, hataların nasıl yakalanacağını baştan çiziyoruz.", kind: "hizmet" },
      { title: "Entegrasyonlar", desc: "CRM, muhasebe, e-posta, form ve WhatsApp gibi araçlarını birbirine bağlıyoruz.", kind: "hizmet" },
      { title: "Fatura otomasyonu", desc: "Satış ya da sipariş oluştuğunda faturanın kesilip müşteriye gönderilmesi.", kind: "modül" },
      { title: "Rapor ve analitik", desc: "Dağınık verileri tek panoda toplayıp düzenli raporları otomatik hazırlıyoruz.", kind: "modül" },
      { title: "Ekip eğitimi", desc: "Akışları ekibinin rahatça kullanıp gerektiğinde düzenleyebilmesi için eğitim.", kind: "hizmet" },
    ],
    deliverables: [
      "Süreç haritası",
      "Çalışır durumda otomasyon akışları",
      "Entegrasyon dokümantasyonu",
      "Hata bildirimi ve izleme",
      "Rapor panosu",
      "Ekip eğitimi",
    ],
    tools: ["n8n", "Make", "Google Workspace", "WhatsApp Business API", "Airtable", "Slack"],
  },
  "e-ticaret": {
    facts: [
      { label: "Süre", value: "6–10 hafta" },
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
      { label: "İlk etki", value: "Genelde 2–3 ay içinde" },
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
        note: { title: "OX Dijital", text: "Bu hafta ziyaretçi sayın %24 arttı.", badge: "Rapor" },
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
    // Yer tutucu: gerçek müşteri yorumları gelene kadar isimler bilerek genel bırakıldı
    testimonials: [
      { quote: `${name} sürecinde her adımda ne olduğunu biliyorduk. Sonuç beklediğimizden iyi oldu.`, name: "Müşteri Adı", role: "Kurucu, E-ticaret" },
      { quote: "Tek bir ekiple çalışmak işimizi inanılmaz hızlandırdı.", name: "Müşteri Adı", role: "Pazarlama Müdürü, Perakende" },
      { quote: "İlk ayın sonunda farkı rakamlarda görmeye başladık.", name: "Müşteri Adı", role: "İşletme Sahibi, Restoran" },
      { quote: "Teslim tarihine birebir uydular, iletişim hep açıktı.", name: "Müşteri Adı", role: "Genel Müdür, Hizmet" },
      { quote: "Markamızı ilk defa bu kadar net anlatabildik.", name: "Müşteri Adı", role: "Kurucu Ortak, Girişim" },
      { quote: "Panel sayesinde neyin nerede olduğunu hep takip edebildik.", name: "Müşteri Adı", role: "Operasyon Sorumlusu, KOBİ" },
    ],
    faq: [
      { q: `${name} projesi ne kadar sürer?`, a: "Kapsama göre değişir; çoğu projede ilk somut çıktıyı 2–4 hafta içinde paylaşıyoruz. Net takvim ilk görüşmeden sonra belli olur." },
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
  // ör. website: { statement: "…", hero: { title: ["…", "…"], description: "…", image: "/images/…" } },
};

export function getServicePage(slug: string): ServicePage | null {
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  return { service, ...build(service), ...OVERRIDES[slug] };
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
