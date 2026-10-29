import type { Service } from "@/components/services/services-data";

// Paketler: müşteri panelindeki BUNDLES verisi (paket-flyout-handoff.md); metinler birebir.
// Landing'e özel: görseller yerel dosyalar, `duration` ve `featured` YER TUTUCU.
export type Package = Service & {
  duration: string;
  featured?: boolean;
};

export const PACKAGES: Package[] = [
  {
    slug: "sifirdan-basla",
    title: "Sıfırdan Başla",
    tagline: "Yeni işletmeler için",
    description: "Dijitalde hiç yoksan: markanı kur, siteni aç, arama ve sosyalde görünür ol.",
    image: "/images/services/branding.png",
    duration: "4–6 hafta",
    items: [
      { label: "Branding", kind: "hizmet" },
      { label: "Tanıtım Sitesi", kind: "hizmet" },
      { label: "SEO & İçerik", kind: "hizmet" },
      { label: "Sosyal Medya Yönetimi", kind: "hizmet" },
      { label: "Sosyal Medya Otomasyonu", kind: "modül" },
    ],
  },
  {
    slug: "satisa-gec",
    title: "Satışa Geç",
    tagline: "Gelir kanalı kuranlar için",
    description: "Online satışa başla, gelen müşteriyi takip et, iletişimi otomatiğe bağla.",
    image: "/images/services/e-ticaret.png",
    duration: "6–10 hafta",
    featured: true,
    items: [
      { label: "E-ticaret Sitesi", kind: "hizmet" },
      { label: "Mekanda", kind: "hizmet" },
      { label: "Müşteri Takip Otomasyonu", kind: "modül" },
      { label: "WhatsApp Bildirim Botu", kind: "modül" },
    ],
  },
  {
    slug: "olcekle",
    title: "Ölçekle",
    tagline: "Büyüyen ekipler için",
    description: "Tekrar eden işleri otomatiğe al, raporlarını topla, kendi araçlarını çalıştır.",
    image: "/images/solutions/girisim.webp",
    duration: "Sürekli",
    items: [
      { label: "Otomasyon", kind: "hizmet" },
      { label: "Fatura Otomasyon", kind: "modül" },
      { label: "Rapor & Analitik", kind: "modül" },
      { label: "n8n", kind: "uygulama" },
      { label: "Nextcloud", kind: "uygulama" },
    ],
  },
];
