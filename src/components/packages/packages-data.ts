import type { Service } from "@/components/services/services-data";

// Paketler: müşteri panelindeki BUNDLES verisi (paket-flyout-handoff.md); metinler birebir.
// Landing'e özel: görseller yerel dosyalar. Süre şimdilik yok: kapsama göre belirleniyor.
export type Package = Service & {
  duration?: string;
  featured?: boolean;
};

export const PACKAGES: Package[] = [
  {
    slug: "sifirdan-basla",
    title: "Sıfırdan Başla",
    tagline: "Yeni işletmeler için",
    description: "Dijitalde hiç yoksan: markanı kur, siteni aç, arama ve sosyalde görünür ol.",
    image: "/images/services/branding.png",
    items: [
      { label: "Marka kimliği ve logo", kind: "hizmet" },
      { label: "Web sitesi", kind: "hizmet" },
      { label: "Sosyal medya kurulumu", kind: "hizmet" },
      { label: "İlk reklam kampanyası", kind: "hizmet" },
    ],
  },
  {
    slug: "satisa-gec",
    title: "Satışa Geç",
    tagline: "Daha fazla müşteriye ulaşmak isteyenler için",
    description: "Online satışa başla, gelen müşteriyi takip et, iletişimi otomatiğe bağla.",
    image: "/images/services/e-ticaret.png",
    featured: true,
    items: [
      { label: "Web sitesi veya e-ticaret", kind: "hizmet" },
      { label: "Google ve Meta reklamları", kind: "hizmet" },
      { label: "SEO çalışmaları", kind: "hizmet" },
      { label: "Performans takibi", kind: "hizmet" },
    ],
  },
  {
    slug: "olcekle",
    title: "Ölçekle",
    tagline: "Büyüyen işletmeler için",
    description: "Tekrar eden işleri otomatiğe al, raporlarını topla, kendi araçlarını çalıştır.",
    image: "/images/solutions/girisim.webp",
    items: [
      { label: "Dijital strateji ve danışmanlık", kind: "hizmet" },
      { label: "Reklam ve içerik yönetimi", kind: "hizmet" },
      { label: "Özel yazılım ve entegrasyonlar", kind: "hizmet" },
      { label: "Raporlama ve analiz", kind: "hizmet" },
    ],
  },
];
