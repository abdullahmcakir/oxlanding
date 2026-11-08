// Hizmet kartları + flyout içeriği.
// Başlık ve görseller Framer sitesinden. tagline / description / items YER TUTUCU — içerik sonra yazılacak.

export type ItemKind = "hizmet" | "modül" | "uygulama";

export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  items: { label: string; kind: ItemKind }[];
  /** Flyout'un yazılmış içeriği. Yazılmayan alan (ya da hiç flyout'u olmayan hizmet) eski düzenle görünür. */
  flyout?: ServiceFlyoutContent;
};

export type ServiceFlyoutContent = {
  /** Flyout başlığı karttakinden farklıysa (kart "E-Ticaret Sitesi", flyout "E-Ticaret") */
  title?: string;
  /** Büyük harfle yazılır (CSS uppercase Türkçede "online"ı "ONLİNE" yapıyor). Yoksa üstte "Paket · N kalem" etiketi ve tagline */
  eyebrow?: string;
  intro?: string;
  /** Yoksa tipine göre gruplu kalem listesi */
  does?: string[];
  /** Varsayılan "Neler yapıyoruz?" */
  doesTitle?: string;
  /** Listenin altında küçük not (ör. hepsinin başlangıç fiyatına dahil olmadığı) */
  doesNote?: string;
  process?: string;
  /** Varsayılan "Nasıl çalışıyoruz?" */
  processTitle?: string;
  /** Yoksa "Fiyat kapsama göre belirleniyor" kutusu */
  price?: ServicePrice;
  cta?: { label: string; note: string };
};

/** Tek başlangıç fiyatı ya da yan yana ayrı ücretler (ör. kurulum + aylık abonelik) */
export type ServicePrice =
  | {
      billing: string;
      /** amount + suffix bitişik yazılır: "3.499 TL" + "'den başlayan fiyatlarla", "9.999 TL" + " / ay'dan başlayan" */
      amount: string;
      suffix: string;
      text?: string;
      note: string;
    }
  | { parts: { label: string; amount: string; unit: string }[]; note: string };

export const SERVICES: Service[] = [
  {
    slug: "website",
    title: "Website",
    tagline: "Markanın dijital vitrini",
    description: "Hızlı, modern ve dönüşüm odaklı web siteleri tasarlayıp geliştiriyoruz.",
    image: "/images/services/website.webp",
    items: [
      { label: "Arayüz Tasarımı", kind: "hizmet" },
      { label: "Geliştirme", kind: "hizmet" },
      { label: "SEO Altyapısı", kind: "hizmet" },
      { label: "Form & CRM Bağlantısı", kind: "modül" },
    ],
    flyout: {
      eyebrow: "WEB TASARIM & GELİŞTİRME",
      intro: "İşini doğru anlatan, ziyaretçilerini müşteriye dönüştürmeye odaklanan web siteleri.",
      does: [
        "Landing page (tek sayfalık web sitesi)",
        "Çok sayfalı kurumsal web siteleri",
        "Mobil uyumlu, özel arayüz tasarımları",
        "SEO uyumlu teknik altyapı",
        "İletişim formları ve entegrasyonlar",
      ],
      process:
        "Önce neye ihtiyacın olduğunu konuşuyoruz. Ardından kapsamı ve fiyatı netleştirip projeye başlıyoruz. Süreci müşteri panelinden takip edebiliyorsun.",
      price: {
        billing: "Tek seferlik ödeme",
        amount: "3.499 TL",
        suffix: "'den başlayan fiyatlarla",
        note: "Fiyat, sayfa sayısına ve projenin ihtiyaçlarına göre değişir.",
      },
      cta: { label: "Projemi konuşalım", note: "Ücretsiz ön görüşme · Bağlayıcı değil" },
    },
  },
  {
    slug: "sosyal-medya",
    title: "Sosyal Medya",
    tagline: "Markanın sesi",
    description: "İçerik üretiminden topluluk yönetimine, markanın sesini sosyal medyada büyütüyoruz.",
    image: "/images/services/sosyal-medya.png",
    items: [
      { label: "İçerik Üretimi", kind: "hizmet" },
      { label: "Sosyal Medya Yönetimi", kind: "hizmet" },
      { label: "Sosyal Medya Otomasyonu", kind: "modül" },
    ],
    flyout: {
      price: {
        billing: "Aylık hizmet bedeli",
        amount: "9.999 TL",
        suffix: " / ay'dan başlayan",
        text: "İçerik tasarımı, hesap yönetimi, video kurgu veya çekim... İhtiyacın olan hizmetleri birlikte belirleyelim.",
        note: "Fiyat; içerik sayısı, çekim ve reklam yönetimi gibi ek hizmetlere göre değişir. Reklam bütçesi ayrıca hesaplanır.",
      },
      cta: { label: "İhtiyacımı konuşalım", note: "Ücretsiz ön görüşme · Bağlayıcı değil" },
    },
  },
  {
    slug: "branding",
    title: "Branding",
    tagline: "Akılda kalan kimlik",
    description: "Logo, kimlik ve marka dili: seni akılda kalıcı kılan bütün sistemi kuruyoruz.",
    image: "/images/services/branding.png",
    items: [
      { label: "Logo", kind: "hizmet" },
      { label: "Kurumsal Kimlik", kind: "hizmet" },
      { label: "Marka Dili", kind: "hizmet" },
    ],
    flyout: {
      eyebrow: "MARKA KİMLİĞİ & TASARIM",
      intro:
        "İyi bir marka yalnızca güzel bir logodan ibaret değil. İşini doğru yansıtan, her yerde kendini belli eden bir marka kimliği tasarlıyoruz.",
      does: [
        "Logo tasarımı",
        "Kurumsal kimlik tasarımı",
        "Renk paleti ve tipografi",
        "Marka kullanım kılavuzu (Brand Guidelines)",
        "Kartvizit, antetli kağıt ve basılı materyal tasarımları",
        "Sosyal medya için marka şablonları",
        "Ambalaj ve etiket tasarımı",
      ],
      doesNote: "Liste, sunulabilecek hizmetleri tanımlar; tüm kalemlerin başlangıç fiyatına dahil olduğu anlamına gelmez.",
      process:
        "Önce markanı, hedef kitleni ve nasıl görünmek istediğini konuşuyoruz. Ardından tasarım yönünü belirliyor, seçtiğimiz yaklaşımı birlikte geliştiriyor ve onayladığın tasarımları kullanıma hazır şekilde teslim ediyoruz.",
      price: {
        billing: "Tek seferlik ödeme",
        amount: "16.499 TL",
        suffix: "'den başlayan fiyatlarla",
        note: "Fiyat, ihtiyaç duyulan tasarımlara ve projenin kapsamına göre değişir.",
      },
      cta: { label: "Markamı konuşalım", note: "Ücretsiz ön görüşme · Bağlayıcı değil" },
    },
  },
  {
    slug: "e-ticaret",
    title: "E-Ticaret Sitesi",
    tagline: "Online satışa geç",
    description: "Satışa odaklı, yönetimi kolay e-ticaret altyapıları kuruyoruz.",
    image: "/images/services/e-ticaret.png",
    items: [
      { label: "E-ticaret Sitesi", kind: "hizmet" },
      { label: "Ödeme & Kargo Entegrasyonu", kind: "modül" },
      { label: "WhatsApp Bildirim Botu", kind: "modül" },
    ],
    flyout: {
      title: "E-Ticaret",
      eyebrow: "E-TİCARET & ONLINE SATIŞ",
      intro:
        "Ürünlerini internette satmaya başlamak veya mevcut mağazanı geliştirmek mi istiyorsun? Tasarımından ödeme altyapısına kadar satışa hazır bir online mağaza oluşturuyoruz.",
      does: [
        "E-ticaret sitesi tasarımı ve kurulumu",
        "Ürün ve kategori sayfaları",
        "Sepet ve ödeme sistemi entegrasyonları",
        "Kargo ve sipariş yönetimi entegrasyonları",
        "Mobil uyumlu mağaza tasarımı",
        "Temel teknik SEO düzenlemeleri",
        "İhtiyaca özel ek özellikler ve entegrasyonlar",
      ],
      doesNote: "Listedeki hizmetlerin tamamı başlangıç fiyatına dahil olmak zorunda değildir.",
      process:
        "Önce ne sattığını, ürün sayını ve mağazandan beklentilerini öğreniyoruz. Ardından ihtiyacına uygun altyapıyı seçiyor, mağazanı tasarlıyor ve satışa hazır hâle getiriyoruz. Yayına çıkmadan önce ödeme, sipariş ve diğer temel süreçleri birlikte kontrol ediyoruz.",
      price: {
        billing: "Tek seferlik hizmet bedeli",
        amount: "18.499 TL",
        suffix: "'den başlayan fiyatlarla",
        note: "Fiyat, mağazanın kapsamına ve ihtiyaç duyulan entegrasyonlara göre değişir. Platform abonelikleri ve üçüncü taraf hizmet bedelleri ayrıca ücretlendirilebilir.",
      },
      cta: { label: "Mağazamı konuşalım", note: "Ücretsiz ön görüşme · Bağlayıcı değil" },
    },
  },
  {
    slug: "seo",
    title: "SEO",
    tagline: "Aramada görünür ol",
    description: "Google'da üst sıralara çıkman için teknik ve içerik tarafını birlikte ele alıyoruz.",
    image: "/images/services/seo-google.png",
    items: [
      { label: "Teknik SEO", kind: "hizmet" },
      { label: "SEO & İçerik", kind: "hizmet" },
      { label: "Sıralama Raporu", kind: "modül" },
    ],
    flyout: {
      eyebrow: "ARAMA MOTORU OPTİMİZASYONU",
      intro:
        "Müşterilerin seni Google'da aradığında bulabilsin. Web sitenin arama sonuçlarındaki görünürlüğünü artırmak ve daha fazla potansiyel müşteriye ulaşmak için çalışıyoruz.",
      does: [
        "SEO analizi ve mevcut durum değerlendirmesi",
        "Anahtar kelime ve rakip araştırması",
        "Teknik SEO iyileştirmeleri",
        "Site içi SEO düzenlemeleri",
        "İçerik stratejisi ve optimizasyonu",
        "Yerel SEO ve Google İşletme Profili optimizasyonu",
        "Performans takibi ve düzenli raporlama",
      ],
      doesNote:
        "Listedeki çalışmalar projenin ihtiyaçlarına göre belirlenir. Tüm kalemler başlangıç fiyatına dahil olmak zorunda değildir.",
      process:
        "Önce web sitenin mevcut durumunu ve hangi aramalarda görünmek istediğini inceliyoruz. Ardından öncelikli iyileştirmeleri belirleyip çalışmaya başlıyoruz. Sonuçları düzenli olarak takip ediyor, elde ettiğimiz verilere göre çalışmalarımızı güncelliyoruz.",
      price: {
        billing: "Aylık hizmet bedeli",
        amount: "21.499 TL",
        suffix: " / ay'dan başlayan",
        note: "Fiyat; web sitenin büyüklüğüne, rekabet düzeyine ve yapılacak çalışmaların kapsamına göre değişir.",
      },
      cta: { label: "SEO'yu konuşalım", note: "Ücretsiz ön görüşme · Bağlayıcı değil" },
    },
  },
  {
    slug: "mekanda",
    title: "Mekanda",
    tagline: "Mekanlar için dijital deneyim",
    description: "Mekanlar için Wi-Fi, yol tarifi, çalışma saatleri ve etkinlikleri tek uygulamada topluyoruz.",
    image: "/images/services/mekanda.png",
    items: [
      { label: "Mekanda", kind: "uygulama" },
      { label: "Kurulum & İçerik Girişi", kind: "hizmet" },
      { label: "Etkinlik Bildirimleri", kind: "modül" },
    ],
    flyout: {
      eyebrow: "DİJİTAL QR MENÜ",
      intro:
        "Menün, sosyal medya hesapların, konumun ve işletmenle ilgili tüm bilgiler tek bir yerde. Müşterilerin QR kodu okutarak ihtiyaç duydukları her şeye kolayca ulaşsın.",
      doesTitle: "Neler sunuyoruz?",
      does: [
        "QR kod ile dijital menü",
        "Sosyal medya ve iletişim bağlantıları",
        "Konum ve yol tarifi",
        "Wi-Fi bilgileri",
        "Duyurular ve kampanyalar",
        "Çalışma saatleri",
        "İşletmeye özel yönetim paneli",
        "Ziyaret istatistikleri",
      ],
      processTitle: "Nasıl çalışıyor?",
      process:
        "İşletmenin bilgilerini ve menünü hazırlıyoruz. Sana özel sayfanı oluşturup QR kodunu kullanıma sunuyoruz. Sonrasında menünü, fiyatlarını ve duyurularını yönetim panelinden istediğin zaman güncelleyebiliyorsun.",
      price: {
        parts: [
          { label: "Kurulum ücreti", amount: "2.100 TL", unit: "Tek seferlik" },
          { label: "Aylık abonelik", amount: "840 TL", unit: "/ ay" },
        ],
        note: "Kurulum ücretini bir kez ödersin. Aylık aboneliğinle dijital menünü ve yönetim panelini kullanmaya devam edersin.",
      },
      cta: { label: "Mekanda'yı kullanmaya başla", note: "İşletmene özel dijital menü" },
    },
  },
];
