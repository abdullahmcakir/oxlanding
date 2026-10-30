// Yasal metinler: KVKK aydınlatma metni, çerez politikası, kullanım koşulları.
// TASLAK: yapı 6698 sayılı KVKK ve Aydınlatma Yükümlülüğü Tebliği'ne göre kuruldu; yayından önce bir avukatın
// gözden geçirmesi gerekir. Şirket bilgileri about-data.ts COMPANY'den gelir (YER TUTUCU).

export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[] };

export type LegalDoc = {
  href: string;
  label: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const CONTACT_EMAIL = "kvkk@oxdijital.com";

export const KVKK: LegalDoc = {
  href: "/kvkk",
  label: "KVKK",
  title: "KVKK aydınlatma metni",
  description: "OX Dijital'in kişisel verileri nasıl işlediğine dair 6698 sayılı KVKK kapsamındaki aydınlatma metni.",
  updated: "30 Ekim 2026",
  intro:
    "Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, web sitemizi ziyaret eden, bizimle iletişime geçen ve hizmet alan kişilerin kişisel verilerinin hangi amaçla ve nasıl işlendiğini açıklamak için hazırlandı.",
  sections: [
    {
      heading: "Veri sorumlusu",
      paragraphs: [
        "Kişisel verileriniz, veri sorumlusu sıfatıyla OX Dijital tarafından aşağıda açıklanan kapsamda işlenir. Şirket bilgilerimiz bu sayfanın sonunda yer alır.",
      ],
    },
    {
      heading: "İşlenen kişisel veriler",
      list: [
        "Kimlik ve iletişim bilgileri: ad, soyad, e-posta adresi, telefon numarası, şirket adı.",
        "Talep bilgileri: görüşme talebi, WhatsApp ya da e-posta ile ilettiğiniz mesajların içeriği.",
        "Müşteri işlem bilgileri: teklif, sözleşme ve fatura bilgileri.",
        "İşlem güvenliği bilgileri: IP adresi, tarayıcı bilgisi, ziyaret tarihi ve saati.",
        "Pazarlama bilgileri: yalnızca onay vermeniz hâlinde çerezlerle elde edilen kullanım verileri.",
      ],
    },
    {
      heading: "İşleme amaçları",
      list: [
        "Görüşme ve teklif taleplerinize dönüş yapmak,",
        "Hizmet sözleşmesini kurmak ve yürütmek, projeyi OX Panel üzerinden yönetmek,",
        "Fatura ve muhasebe süreçlerini yürütmek,",
        "Web sitesinin güvenliğini sağlamak ve teknik sorunları gidermek,",
        "Onay vermeniz hâlinde site kullanımını analiz etmek ve hizmetlerimizi iyileştirmek.",
      ],
    },
    {
      heading: "Hukuki sebepler",
      paragraphs: [
        "Kişisel verileriniz KVKK'nın 5. maddesinde yer alan; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi, ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat ve açık rıza hukuki sebeplerine dayanılarak işlenir. Analiz ve pazarlama çerezleri yalnızca açık rızanızla kullanılır.",
      ],
    },
    {
      heading: "Toplama yöntemi",
      paragraphs: [
        "Verileriniz; web sitesindeki formlar, OX Panel, WhatsApp, e-posta, telefon ve çerezler aracılığıyla elektronik ortamda, otomatik ya da kısmen otomatik yollarla toplanır.",
      ],
    },
    {
      heading: "Aktarım",
      paragraphs: [
        "Verileriniz, yukarıdaki amaçlarla sınırlı olarak; barındırma, e-posta ve mesajlaşma hizmeti aldığımız tedarikçilerle, muhasebe ve hukuk danışmanlarımızla ve kanunen yetkili kamu kurumlarıyla paylaşılabilir. Bu tedarikçilerin bir kısmının sunucuları yurt dışında bulunabilir; yurt dışına aktarım KVKK'nın 9. maddesindeki şartlara uygun yapılır.",
      ],
    },
    {
      heading: "Saklama süresi",
      paragraphs: [
        "Verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; süre dolduğunda silinir, yok edilir ya da anonim hâle getirilir.",
      ],
    },
    {
      heading: "Haklarınız",
      paragraphs: ["KVKK'nın 11. maddesi uyarınca bize başvurarak:"],
      list: [
        "Kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,",
        "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
        "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,",
        "Eksik veya yanlış işlenmişse düzeltilmesini, şartları oluşmuşsa silinmesini veya yok edilmesini isteme,",
        "Bu işlemlerin verinin aktarıldığı üçüncü kişilere bildirilmesini isteme,",
        "Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,",
        "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
      ],
    },
    {
      heading: "Başvuru",
      paragraphs: [
        `Taleplerinizi ${CONTACT_EMAIL} adresine ya da aşağıdaki posta adresine yazılı olarak iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
      ],
    },
  ],
};

export const COOKIES: LegalDoc = {
  href: "/cerez-politikasi",
  label: "Çerez politikası",
  title: "Çerez politikası",
  description: "OX Dijital web sitesinde hangi çerezlerin, hangi amaçla kullanıldığı ve tercihlerinizi nasıl yönetebileceğiniz.",
  updated: "30 Ekim 2026",
  intro:
    "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Bu sayfa, sitemizde hangi çerezleri neden kullandığımızı ve tercihinizi nasıl değiştirebileceğinizi anlatır.",
  sections: [
    {
      heading: "Zorunlu çerezler",
      paragraphs: [
        "Sitenin çalışması için gereklidir ve kapatılamaz. Örneğin çerez tercihinizi hatırlamak için tarayıcınızda küçük bir kayıt tutarız.",
      ],
    },
    {
      heading: "Analiz çerezleri",
      paragraphs: [
        "Sitemizin nasıl kullanıldığını anlamamıza yardımcı olur: hangi sayfaların ziyaret edildiği, ziyaretçilerin siteye nereden geldiği gibi. Yalnızca \"Kabul et\" seçeneğiyle onay vermeniz hâlinde çalışır.",
      ],
    },
    {
      heading: "Pazarlama çerezleri",
      paragraphs: [
        "Reklam kampanyalarımızın etkisini ölçmek ve size daha ilgili reklamlar göstermek için kullanılır. Yalnızca onay vermeniz hâlinde çalışır.",
      ],
    },
    {
      heading: "Tercihlerinizi yönetmek",
      paragraphs: [
        "Çerez tercihinizi istediğiniz zaman bu sayfadaki \"Çerez tercihlerini değiştir\" butonuyla güncelleyebilirsiniz. Ayrıca tarayıcınızın ayarlarından çerezleri silebilir ya da engelleyebilirsiniz; zorunlu çerezleri engellemek sitenin bazı bölümlerinin çalışmamasına neden olabilir.",
      ],
    },
    {
      heading: "Kişisel veriler",
      paragraphs: [
        "Çerezler aracılığıyla işlenen kişisel verilere ilişkin ayrıntılar ve haklarınız için KVKK aydınlatma metnimizi inceleyebilirsiniz.",
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  href: "/kullanim-kosullari",
  label: "Kullanım koşulları",
  title: "Kullanım koşulları",
  description: "OX Dijital web sitesinin kullanımına ilişkin koşullar.",
  updated: "30 Ekim 2026",
  intro:
    "Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Hizmet aldığınızda geçerli olan şartlar, sizinle imzaladığımız sözleşmede ayrıca belirlenir.",
  sections: [
    {
      heading: "Sitenin amacı",
      paragraphs: [
        "Bu site, OX Dijital'in hizmetleri, paketleri ve çalışmaları hakkında bilgi vermek amacıyla yayınlanır. Sitedeki bilgiler genel niteliktedir; fiyat ve kapsam, görüşme sonrası hazırlanan teklifle kesinleşir.",
      ],
    },
    {
      heading: "Fikri mülkiyet",
      paragraphs: [
        "Sitedeki tasarım, metin, görsel, logo ve yazılımlar OX Dijital'e ya da izin aldığımız hak sahiplerine aittir. Yazılı iznimiz olmadan kopyalanamaz, çoğaltılamaz ve ticari amaçla kullanılamaz. Çalışmalar bölümündeki müşteri markaları ilgili şirketlere aittir.",
      ],
    },
    {
      heading: "Kullanım kuralları",
      list: [
        "Siteyi hukuka aykırı amaçlarla kullanamazsınız.",
        "Sitenin güvenliğini tehlikeye atacak, işleyişini bozacak girişimlerde bulunamazsınız.",
        "Formlar ve iletişim kanalları üzerinden yanıltıcı ya da başkasına ait bilgi gönderemezsiniz.",
      ],
    },
    {
      heading: "Sorumluluğun sınırı",
      paragraphs: [
        "Sitedeki bilgilerin doğru ve güncel olması için özen gösteririz; ancak bilgilerin kullanımından doğabilecek doğrudan ya da dolaylı zararlardan sorumlu tutulamayız. Sitenin kesintisiz ve hatasız çalışacağını garanti etmeyiz.",
      ],
    },
    {
      heading: "Üçüncü taraf bağlantıları",
      paragraphs: [
        "Site; WhatsApp, sosyal medya ve OX Panel gibi başka hizmetlere bağlantılar içerir. Bu hizmetlerin içerik ve gizlilik uygulamalarından ilgili hizmet sağlayıcılar sorumludur.",
      ],
    },
    {
      heading: "Değişiklikler ve uygulanacak hukuk",
      paragraphs: [
        "Bu koşulları önceden haber vermeksizin güncelleyebiliriz; güncel hâli her zaman bu sayfada yer alır. Koşullar Türkiye Cumhuriyeti hukukuna tabidir; uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir.",
      ],
    },
  ],
};

export const LEGAL_DOCS = [KVKK, COOKIES, TERMS];
