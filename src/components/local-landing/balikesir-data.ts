import type { FaqItem } from "@/components/faq/faq";
import { SERVICES } from "@/components/services/services-data";

// /balikesir-web-sitesi: Balıkesir'den gelen "web sitesi / web tasarım" aramaları için hizmet açılış sayfası.
// Ticari niyet: hizmetler, süreç, fiyatı etkileyenler ve görüşme. Fiyat araştırmasının ayrıntısı blog rehberinde
// (/blog/balikesir-web-sitesi-fiyatlari-2026); iki sayfa birbirini tekrar etmez, birbirine bağlanır.
// Kurallar: fiziksel ofis, müşteri sayısı, başarı oranı, sıralama garantisi yok. Fiyat yalnız sitedeki gerçek
// başlangıç fiyatı (services-data.ts'teki website flyout'u); orası değişince burası da kendiliğinden değişir.

export const BALIKESIR_PATH = "/balikesir-web-sitesi";
export const PRICE_GUIDE_PATH = "/blog/balikesir-web-sitesi-fiyatlari-2026";

export const BALIKESIR_META = {
  title: "Balıkesir Web Sitesi ve Web Tasarım Hizmetleri | OX Dijital",
  description:
    "Balıkesir’de işletmeniz için modern, mobil uyumlu ve SEO altyapısı güçlü web sitesi çözümleri. OX Dijital ile projenizi planlayın, teklif alın.",
};

const websitePrice = SERVICES.find((s) => s.slug === "website")?.flyout?.price;
/** "3.499 TL" gibi; sitede başlangıç fiyatı yazılı değilse null (sayfa fiyatsız metne düşer) */
export const WEBSITE_START_PRICE = websitePrice && "amount" in websitePrice ? websitePrice.amount : null;
export const WEBSITE_PRICE_NOTE = websitePrice?.note ?? null;

export const HERO = {
  eyebrow: "Balıkesir web tasarım hizmetleri",
  // Sayfanın tek H1'i (birincil anahtar kelime başta)
  title: ["Balıkesir web sitesi tasarımı ile", "işletmenizi dijitalde büyütün."],
  lead: "Balıkesir’deki işletmeniz için profesyonel bir web sitesi.",
  description:
    "İşletmenizin dijital dünyadaki ilk izlenimini güçlü bir deneyime dönüştürün. OX Dijital olarak Balıkesir’deki işletmeler için modern tasarım, mobil uyumluluk, hızlı performans ve arama motoru dostu altyapıyı bir araya getiren web sitesi çözümleri geliştiriyoruz.",
  primary: "Web siteniz için teklif alın",
  secondary: { label: "Hizmetlerimizi keşfedin", href: "#cozumler" },
};

// Hero'daki tarayıcı maketinin kontrol satırları: sitenin kurulurken baktığımız temel başlıklar (rakam/puan yok)
export const HERO_CHECKS = ["Mobil uyumlu arayüz", "Teknik SEO temeli", "Hızlı açılan sayfalar", "Teklif ve iletişim formu"];

export const WHY = {
  title: "İşletmeniz neden profesyonel bir web sitesine ihtiyaç duyar?",
  intro:
    "Potansiyel müşteriler bir işletmeyle iletişime geçmeden önce çoğu zaman internette araştırma yapar. Profesyonel bir web sitesi, işletmenizin hizmetlerini anlaşılır biçimde sunmasına, güven oluşturmasına ve yeni müşteri talepleri toplamasına yardımcı olur.",
  items: [
    {
      title: "Güçlü ilk izlenim",
      desc: "Markanızın kimliğini yansıtan modern bir tasarımla ziyaretçilerinize profesyonel bir deneyim sunun.",
    },
    {
      title: "Mobil uyumlu deneyim",
      desc: "Telefon, tablet ve masaüstü cihazlarda sorunsuz çalışan responsive sayfalarla ziyaretçilerinize her ekranda ulaşın.",
    },
    {
      title: "Google dostu altyapı",
      desc: "Teknik SEO temelleri, anlaşılır sayfa yapısı ve performans optimizasyonlarıyla arama motorlarının sitenizi daha iyi anlamasına yardımcı olun.",
    },
    {
      title: "Dönüşüm odaklı tasarım",
      desc: "İletişim formları, anlaşılır hizmet açıklamaları ve stratejik çağrılarla ziyaretçilerin müşteriye dönüşmesini kolaylaştırın.",
    },
  ],
};

// Her çözüm, kapsamını anlatan gerçek hizmet sayfasına bağlanır
export const SOLUTIONS = {
  title: "İhtiyacınıza uygun web sitesi çözümleri",
  intro:
    "Her işletmenin hedefleri farklıdır. Bu nedenle tasarım, içerik ve teknik altyapıyı projenizin ihtiyaçlarına göre planlıyoruz.",
  items: [
    {
      title: "Kurumsal web sitesi tasarımı",
      desc: "Firmanızın hizmetlerini, kurumsal kimliğini ve iletişim bilgilerini profesyonel biçimde sunan, yönetilebilir ve mobil uyumlu web siteleri.",
      link: { label: "Website hizmeti", href: "/hizmetler/website" },
    },
    {
      title: "E-ticaret web sitesi",
      desc: "Ürünlerinizi çevrimiçi satışa sunmanıza yardımcı olan, kullanıcı deneyimi ve alışveriş akışı düşünülerek tasarlanan e-ticaret çözümleri.",
      link: { label: "E-ticaret hizmeti", href: "/hizmetler/e-ticaret" },
    },
    {
      title: "Özel web tasarım ve geliştirme",
      desc: "Standart şablonların yeterli olmadığı projeler için işletmenizin ihtiyaçlarına göre planlanan özel web arayüzleri ve fonksiyonlar.",
      link: { label: "Özel yapı kapsamı", href: "/hizmetler/website#paketler" },
    },
    {
      title: "SEO uyumlu web sitesi",
      desc: "Anlaşılır URL yapısı, doğru başlık hiyerarşisi, teknik optimizasyonlar ve içerik mimarisiyle arama motoru dostu web siteleri.",
      link: { label: "SEO hizmeti", href: "/hizmetler/seo" },
    },
    {
      title: "Web sitesi yenileme",
      desc: "Eski veya yavaş web sitelerini kullanıcı deneyimi, modern tasarım ve performans açısından yeniden değerlendiren yenileme çözümleri.",
      link: { label: "Website hizmeti", href: "/hizmetler/website" },
    },
    {
      title: "Web sitesi bakım ve destek",
      desc: "İçerik güncellemeleri, teknik kontroller ve ihtiyaç duyulan geliştirmelerle web sitenizin sürdürülebilirliğini destekleyen hizmetler.",
      link: { label: "Paketleri inceleyin", href: "/paketler" },
    },
  ],
};

export const SECTORS = {
  title: "Balıkesir’in farklı sektörlerine uygun web tasarım",
  intro:
    "Balıkesir merkezden Edremit, Bandırma, Ayvalık, Burhaniye ve Gönen’e kadar farklı bölgelerde faaliyet gösteren işletmelerin dijital ihtiyaçları değişebilir. Bir turizm işletmesinin rezervasyon odaklı bir siteye, bir üretim firmasının ise güçlü bir kurumsal tanıtıma ihtiyacı olabilir.",
  places: ["Altıeylül", "Karesi", "Edremit", "Bandırma", "Ayvalık", "Burhaniye", "Gönen"],
  items: [
    {
      title: "Turizm, otel ve konaklama",
      desc: "Oda ve hizmet tanıtımları, güçlü görseller, çok dilli içerik ve rezervasyon talebini kolaylaştıran net bir iletişim akışı.",
      tags: ["Rezervasyon talebi", "Çok dilli içerik"],
    },
    {
      title: "Restoran ve kafe",
      desc: "Menü, konum, çalışma saatleri ve rezervasyon bilgisinin telefondan saniyeler içinde bulunduğu sade ve hızlı sayfalar.",
      tags: ["Menü ve konum", "Mobil öncelikli"],
    },
    {
      title: "Emlak ve gayrimenkul",
      desc: "İlanların filtrelenebildiği portföy sayfaları, bölge bilgileri ve her ilandan doğrudan iletişime geçilebilen talep formları.",
      tags: ["Portföy listesi", "İlan bazlı talep"],
    },
    {
      title: "Sağlık ve danışmanlık",
      desc: "Uzmanlık alanlarını güven veren bir dille anlatan, randevu talebini sadeleştiren ve bilgilendirici içeriklerle desteklenen siteler.",
      tags: ["Randevu talebi", "Bilgilendirici içerik"],
    },
    {
      title: "Üretim ve sanayi",
      desc: "Üretim kapasitesini, ürün gruplarını ve sertifikaları düzenli sunan; bayi ve ihracat görüşmelerinde referans olacak kurumsal tanıtım.",
      tags: ["Ürün kataloğu", "Kurumsal tanıtım"],
    },
    {
      title: "Yerel hizmet işletmeleri",
      desc: "Hizmet bölgesini, sunduğu işleri ve iletişim kanallarını açıkça gösteren; aramada ve haritada bulunmayı destekleyen kompakt siteler.",
      tags: ["Hizmet bölgesi", "Hızlı iletişim"],
    },
  ],
};

export const PROCESS = {
  title: "Fikirden yayına: web sitenizi nasıl hazırlıyoruz?",
  intro: "Her adımın çıktısı belli; ne yapıldığını ve sırada ne olduğunu süreç boyunca görürsünüz.",
  steps: [
    { title: "İhtiyaç analizi", desc: "İşletmenizi, hedef kitlenizi ve beklentilerinizi anlıyoruz." },
    { title: "Planlama", desc: "Sayfa mimarisini, içerikleri ve tasarım yaklaşımını belirliyoruz." },
    { title: "Tasarım", desc: "Markanıza uygun, kullanıcı dostu arayüzü hazırlıyoruz." },
    { title: "Geliştirme ve test", desc: "Mobil uyumluluk, performans ve fonksiyon kontrollerini gerçekleştiriyoruz." },
    { title: "Yayın ve destek", desc: "Siteyi yayına alıyor, proje kapsamına uygun destek sunuyoruz." },
  ],
};

export const PRICING = {
  title: "Balıkesir’de web sitesi yaptırmak ne kadar?",
  text: "Web sitesi maliyetleri; sayfa sayısı, tasarımın özgünlüğü, içerik ihtiyaçları, yönetim paneli, e-ticaret özellikleri ve özel entegrasyonlara göre değişir. Bu nedenle her proje için tek bir sabit fiyat vermek doğru olmayabilir.",
  factors: [
    { title: "Sayfa sayısı ve yapı", desc: "Tek sayfalık bir tanıtım ile onlarca iç sayfası olan kurumsal site aynı emeği gerektirmez." },
    { title: "Tasarımın özgünlüğü", desc: "Markaya özel arayüz, hazır bir yapıyı uyarlamaktan daha fazla tasarım süresi ister." },
    { title: "İçerik ihtiyacı", desc: "Metinlerin, fotoğrafların ve görsellerin hazır olması ya da sıfırdan üretilmesi bütçeyi değiştirir." },
    { title: "Yönetim paneli", desc: "İçerikleri kendiniz güncelleyecekseniz düzenlenebilir alanlar kurulur." },
    { title: "E-ticaret özellikleri", desc: "Ürün yönetimi, sepet, ödeme ve sipariş akışı ayrı bir geliştirme kapsamıdır." },
    { title: "Entegrasyonlar ve çoklu dil", desc: "Rezervasyon, CRM, ödeme altyapısı veya ikinci bir dil projeye ek iş kalemleri ekler." },
  ],
  guide: {
    label: "Balıkesir Web Sitesi Fiyatları 2026: Detaylı rehberi inceleyin",
    text: "Kurumsal site ile e-ticaret arasındaki maliyet farkını, örnek bütçe senaryolarını ve gözden kaçan ek maliyetleri rehberde ayrıntılı anlattık.",
  },
};

export const WHY_OX = {
  title: "Web siteniz sadece güzel görünmekle kalmamalı.",
  text: "Başarılı bir web sitesi; tasarım, hız, kullanıcı deneyimi ve işletme hedeflerinin birlikte düşünülmesiyle ortaya çıkar. OX Dijital’de amacımız yalnızca bir internet sitesi hazırlamak değil, işletmenizin dijital hedeflerine uygun bir altyapı oluşturmaktır.",
  items: [
    "İşletmeye özel planlama",
    "Modern ve responsive tasarım",
    "Teknik SEO temelleri",
    "Kullanıcı deneyimi",
    "Ölçeklenebilir altyapı",
    "İletişim ve dönüşüm odaklı yaklaşım",
  ],
};

const priceSentence = WEBSITE_START_PRICE
  ? `OX Dijital’de web sitesi projeleri ${WEBSITE_START_PRICE}’den başlıyor. `
  : "";

export const FAQ: FaqItem[] = [
  {
    q: "Balıkesir’de web sitesi yaptırmak ne kadar?",
    a: `${priceSentence}Net fiyat; sayfa sayısına, tasarımın özgünlüğüne, içerik ihtiyacına, yönetim paneline ve e-ticaret ya da entegrasyon gibi ek özelliklere göre belirlenir. Ön görüşmede kapsamı birlikte netleştirip yazılı teklif hazırlıyoruz.`,
  },
  {
    q: "Profesyonel web sitesi kaç günde hazırlanır?",
    a: "Süre kapsama bağlıdır. Tek sayfalık bir tanıtım sitesi, çok sayfalı kurumsal bir siteden veya e-ticaret projesinden daha kısa sürede tamamlanır. İçeriklerin hazır olması ve geri bildirimlerin hızı da takvimi etkiler. Projeye özel süreyi teklifle birlikte yazılı olarak paylaşıyoruz.",
  },
  {
    q: "Web sitesi Google’da hemen görünür mü?",
    a: "Yayına alınan bir sitenin Google tarafından keşfedilmesi ve dizine eklenmesi zaman alabilir; bu süreyi kimse kesin olarak garanti edemez. Site haritasını ve Search Console kurulumunu yaparak keşfi kolaylaştırıyoruz. Hangi aramalarda, hangi sırada görüneceğiniz ise rekabete, içeriğe ve zamanla oluşan güvene bağlıdır.",
  },
  {
    q: "Web sitesi mobil uyumlu olur mu?",
    a: "Evet. Tasarımı telefon, tablet ve masaüstü için ayrı ayrı düşünüyor, yayına almadan önce farklı ekran boyutlarında test ediyoruz.",
  },
  {
    q: "Web sitesi tamamlandıktan sonra güncellenebilir mi?",
    a: "Evet. Projenin yapısına göre düzenlenebilir alanları size açıyoruz; metin ve görsel gibi içerikleri kendiniz güncelleyebilirsiniz. Yeni sayfa, özellik veya bakım ihtiyaçlarını da ayrıca planlayabiliyoruz; varsa devam eden ücretleri proje başlamadan netleştiriyoruz.",
  },
  {
    q: "Balıkesir dışında olsanız da hizmet verebilir misiniz?",
    a: "Evet. Balıkesir ve çevresindeki işletmelerin yanı sıra Türkiye’nin farklı şehirlerindeki markalarla da çalışıyoruz. Görüşmeleri ve proje takibini online yürütüyoruz; süreci müşteri panelinden izleyebiliyorsunuz.",
  },
  {
    q: "Web sitesi için SEO çalışması gerekli mi?",
    a: "Her sitede teknik SEO temeli kurulmalıdır: doğru başlık yapısı, anlaşılır adresler, hız ve site haritası gibi. Rekabetçi aramalarda üst sıralarda görünmek istiyorsanız buna ek olarak düzenli içerik ve SEO çalışması gerekir; bu, site kurulumundan ayrı bir hizmettir.",
  },
];

export const FINAL_CTA = {
  title: "Balıkesir’deki işletmeniz için yeni bir web sitesi planlayalım.",
  text: "Yeni bir web sitesi kurmak veya mevcut sitenizi yenilemek istiyorsanız projenizin ihtiyaçlarını birlikte değerlendirelim.",
  label: "Ücretsiz ön görüşme talep edin",
  note: "Ücretsiz ön görüşme · Bağlayıcı değil",
};
