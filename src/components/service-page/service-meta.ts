// Hizmet sayfalarının arama sonucu başlığı ve açıklaması. Açıklamalar sayfanın hero metninden kısaltıldı;
// sayfada görünmeyen rakam, fiyat ya da vaat eklenmez. Listede olmayan hizmet "{Hizmet} · OX Dijital" kullanır.
export const SERVICE_META: Record<string, { title: string; description: string }> = {
  website: {
    title: "Web Sitesi Tasarımı ve Geliştirme | OX Dijital",
    description:
      "Sadece güzel görünen değil; hızlı açılan, güven veren ve ziyaretçiyi harekete geçiren web siteleri tasarlayıp geliştiriyoruz.",
  },
  "sosyal-medya": {
    title: "Sosyal Medya Yönetimi ve İçerik Üretimi | OX Dijital",
    description:
      "İçerik planlamasından fotoğraf ve video çekimine, Reels kurgusundan hesap yönetimine kadar sosyal medyanın ihtiyaçları için birlikte çalışıyoruz.",
  },
  branding: {
    title: "Marka Kimliği ve Logo Tasarımı | OX Dijital",
    description:
      "Logodan renklerine, ambalajdan sosyal medya tasarımlarına kadar birbiriyle uyumlu bir marka kimliği oluşturuyoruz.",
  },
  "e-ticaret": {
    title: "E-Ticaret Sitesi Kurulumu | OX Dijital",
    description:
      "Ürünlerini sergileyebileceğin, müşterilerinin güvenle alışveriş yapabileceği ve siparişlerini yönetebileceğin bir e-ticaret sitesi kuruyoruz.",
  },
};
