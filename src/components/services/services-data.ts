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
};

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
  },
  {
    slug: "otomasyon",
    title: "Otomasyon",
    tagline: "Tekrar eden işler otomatiğe",
    description: "Tekrarlayan işleri otomatikleştirip ekibine zaman kazandırıyoruz.",
    image: "/images/services/otomasyon.png",
    items: [
      { label: "Süreç Analizi", kind: "hizmet" },
      { label: "Fatura Otomasyon", kind: "modül" },
      { label: "Rapor & Analitik", kind: "modül" },
      { label: "n8n", kind: "uygulama" },
    ],
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
  },
  {
    slug: "seo",
    title: "SEO",
    tagline: "Aramada görünür ol",
    description: "Google'da üst sıralara çıkman için teknik ve içerik tarafını birlikte ele alıyoruz.",
    image: "/images/services/seo.jpg",
    items: [
      { label: "Teknik SEO", kind: "hizmet" },
      { label: "SEO & İçerik", kind: "hizmet" },
      { label: "Sıralama Raporu", kind: "modül" },
    ],
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
  },
];
