// Yasal metinler: KVKK aydınlatma metni, çerez politikası, kullanım koşulları.
// TASLAK: yapı 6698 sayılı KVKK ve Aydınlatma Yükümlülüğü Tebliği'ne göre kuruldu; yayından önce bir avukatın
// gözden geçirmesi gerekir. Şirket bilgileri about-data.ts COMPANY'den gelir (YER TUTUCU).
// Çerez ve ölçüm anlatımı lib/analytics.ts ve app/api/olcum/route.ts ile birebir: biri değişirse burası da güncellenir.

import { KVKK_EMAIL } from "@/lib/links";

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

export const KVKK: LegalDoc = {
  href: "/kvkk",
  label: "KVKK",
  title: "KVKK aydınlatma metni",
  description: "OX Dijital'in kişisel verileri nasıl işlediğine dair 6698 sayılı KVKK kapsamındaki aydınlatma metni.",
  updated: "8 Kasım 2026",
  intro:
    "Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, web sitemizi ziyaret eden, OX Panel üzerinden görüşme talebi oluşturan, bizimle iletişime geçen ve hizmet alan kişilerin kişisel verilerinin hangi amaçla ve nasıl işlendiğini açıklamak için hazırlandı.",
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
        "Talep bilgileri: OX Panel'deki görüşme talebi, seçtiğiniz görüşme saati, WhatsApp ya da e-posta ile ilettiğiniz mesajların içeriği.",
        "Müşteri işlem bilgileri: teklif, sözleşme, ödeme ve fatura bilgileri.",
        "İşlem güvenliği bilgileri: IP adresi, tarayıcı ve cihaz bilgisi, ziyaret tarihi ve saati.",
        "Kullanım ve pazarlama bilgileri (yalnızca çerezlere onay vermeniz hâlinde): ziyaret ettiğiniz sayfalar, tıkladığınız butonlar, siteye geldiğiniz kaynak ve kampanya, reklam tıklama kimlikleri.",
      ],
    },
    {
      heading: "İşleme amaçları",
      list: [
        "Görüşme ve teklif taleplerinize dönüş yapmak, görüşmeleri planlamak,",
        "Hizmet sözleşmesini kurmak ve yürütmek, projeyi OX Panel üzerinden yönetmek,",
        "Ödeme, fatura ve muhasebe süreçlerini yürütmek,",
        "Web sitesinin güvenliğini sağlamak, kötüye kullanımı önlemek ve teknik sorunları gidermek,",
        "Sitenin toplam ziyaret sayısını kimseyi tanımadan ölçmek,",
        "Onay vermeniz hâlinde site kullanımını analiz etmek, reklam kampanyalarımızın etkisini ölçmek ve reklamlarımızı ilgili kişilere göstermek.",
      ],
    },
    {
      heading: "Hukuki sebepler",
      paragraphs: ["Kişisel verileriniz KVKK'nın 5. maddesindeki şu hukuki sebeplere dayanılarak işlenir:"],
      list: [
        "Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması: görüşme talebi, teklif, sözleşme ve proje yönetimi.",
        "Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi: fatura, muhasebe ve yetkili kurumların talepleri.",
        "Temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatimiz: site güvenliği ve çerezsiz toplam ziyaret sayımı.",
        "Açık rızanız: analiz ve pazarlama çerezleri ile, görüşme talebi sırasında onay verirseniz iletişim bilgilerinizin şifrelenmiş hâlinin reklam ölçümü için Meta'ya iletilmesi. Açık rızanızı istediğiniz zaman geri alabilirsiniz.",
      ],
    },
    {
      heading: "Toplama yöntemi",
      paragraphs: [
        "Verileriniz; web sitesi, OX Panel'deki formlar, görüşme planlama aracı, WhatsApp, e-posta, telefon ve çerezler aracılığıyla elektronik ortamda, otomatik ya da kısmen otomatik yollarla toplanır.",
      ],
    },
    {
      heading: "Onay vermezseniz",
      paragraphs: [
        "Çerezlere onay vermezseniz ziyaretinizle ilgili hiçbir ölçüm yapmayız: sayfa görüntülemeleri dahil hiçbir bilgi bize, OX Panel'e ya da ölçüm araçlarına gönderilmez ve tarayıcınıza yalnızca çerez tercihinizi hatırlayan zorunlu kayıtlar yazılır.",
      ],
    },
    {
      heading: "Kullandığımız hizmet sağlayıcılar",
      paragraphs: ["Verileriniz, aşağıdaki hizmetleri sunan tedarikçilerimiz tarafından bizim adımıza ve talimatlarımızla işlenir:"],
      list: [
        "Sunucu ve barındırma: web sitesi, OX Panel, ziyaret istatistikleri (Rybbit) ve görüşme planlama aracı kendi yönettiğimiz sunucularda çalışır.",
        "Supabase: OX Panel'in veritabanı ve kullanıcı girişi.",
        "Resend ve Google Workspace: bilgilendirme e-postalarının gönderimi ve e-posta yazışmaları.",
        "Cloudflare: alan adı yönetimi ve ağ güvenliği.",
        "Google (Google Analytics, Google Ads): yalnızca onay vermeniz hâlinde site kullanımının analizi ve reklam ölçümü.",
        "Meta (Meta Pixel, Dönüşümler API'si): yalnızca onay vermeniz hâlinde reklam ölçümü. Bize WhatsApp üzerinden yazdığınızda mesajlarınız WhatsApp (Meta) altyapısından geçer.",
      ],
    },
    {
      heading: "Aktarım",
      paragraphs: [
        "Verileriniz, yukarıdaki amaçlarla sınırlı olarak; hizmet sağlayıcılarımızla, muhasebe ve hukuk danışmanlarımızla ve kanunen yetkili kamu kurumlarıyla paylaşılabilir.",
        "Google, Meta, Supabase, Resend ve Cloudflare'in sunucularının bir kısmı yurt dışında bulunur. Bu hizmetlere yapılan aktarımlar KVKK'nın 9. maddesine uygun olarak; standart sözleşme gibi uygun güvencelere ya da açık rızanıza dayanılarak yapılır.",
        "Görüşme talebi sırasında onay verirseniz e-posta adresiniz ve telefon numaranız, geri döndürülemez biçimde şifrelenerek (hash) Meta'ya iletilir. Meta bu bilgiyi yalnızca reklamlarımızın talep getirip getirmediğini ölçmek için eşleştirir; açık hâliyle görmez.",
      ],
    },
    {
      heading: "Saklama süresi",
      paragraphs: [
        "Verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; süre dolduğunda silinir, yok edilir ya da anonim hâle getirilir. Çerezlerin saklama süreleri çerez politikamızda yer alır.",
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
        `Taleplerinizi ${KVKK_EMAIL} adresine ya da aşağıdaki posta adresine yazılı olarak iletebilirsiniz. Başvurunuz, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. Başvurunuzun reddedilmesi, cevabı yetersiz bulmanız ya da süresinde cevap verilmemesi hâlinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz.`,
      ],
    },
  ],
};

export const COOKIES: LegalDoc = {
  href: "/cerez-politikasi",
  label: "Çerez politikası",
  title: "Çerez politikası",
  description: "OX Dijital web sitesinde hangi çerezlerin, hangi amaçla ve ne kadar süreyle kullanıldığı ve tercihlerinizi nasıl yönetebileceğiniz.",
  updated: "8 Kasım 2026",
  intro:
    "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Bu sayfada \"çerez\" derken tarayıcı depolaması gibi benzer teknolojileri de kastediyoruz. Aşağıda sitemizde neyi, neden ve ne kadar süreyle kullandığımızı anlatıyoruz.",
  sections: [
    {
      heading: "Onay vermezseniz",
      paragraphs: [
        "Siteye ilk girdiğinizde sağ alttaki asistan çerez tercihinizi sorar. Cevap vermemek onay sayılmaz. Onay vermediğiniz sürece yalnızca aşağıdaki zorunlu kayıtlar kullanılır; analiz ve pazarlama araçları hiç yüklenmez.",
        "Bu durumda ziyaretinizle ilgili hiçbir ölçüm yapılmaz; sayfa görüntülemeleri de sayılmaz.",
      ],
    },
    {
      heading: "Zorunlu kayıtlar",
      paragraphs: ["Sitenin çalışması için gereklidir ve kapatılamaz:"],
      list: [
        "ox-cookie-consent (tarayıcı depolaması): çerez tercihinizi hatırlar. Siz silene kadar saklanır.",
        "ox-cookie-asked (oturum depolaması): aynı ziyarette her sayfada yeniden sorulmamanızı sağlar. Sekmeyi kapatınca silinir.",
      ],
    },
    {
      heading: "Analiz çerezleri",
      paragraphs: [
        "Sitemizin nasıl kullanıldığını anlamamıza yardımcı olur: hangi sayfaların ziyaret edildiği, ziyaretçilerin siteye nereden geldiği, hangi butonlara tıklandığı gibi. Yalnızca \"Kabul et\" seçeneğiyle onay vermeniz hâlinde çalışır:",
      ],
      list: [
        "_ga, _ga_* (Google Analytics): ziyaretçileri birbirinden ayırt eder. 2 yıl saklanır.",
        "ox-olcum-oturum (oturum depolaması): aynı ziyaretteki sayfa görüntülemelerini birbirine bağlar. Sekmeyi kapatınca silinir.",
        "ox-olcum-kaynak (oturum depolaması): siteye hangi kaynak ya da kampanyadan geldiğinizi hatırlar; görüşme talebi oluşturursanız talebinizle eşleştirilir. Sekmeyi kapatınca silinir.",
        "Rybbit: kendi sunucumuzda çalışan ziyaret istatistikleri aracıdır ve tarayıcınıza çerez yazmaz. Onay verdiğinizde IP adresiniz, tarayıcı ve dil bilginiz konum ve cihaz istatistikleri çıkarmak için ona iletilir.",
      ],
    },
    {
      heading: "Pazarlama çerezleri",
      paragraphs: [
        "Reklam kampanyalarımızın talep getirip getirmediğini ölçmek ve reklamlarımızı ilgili kişilere göstermek için kullanılır. Yalnızca onay vermeniz hâlinde çalışır:",
      ],
      list: [
        "_fbp, _fbc (Meta Pixel): tarayıcınızı ve bir Meta reklamından gelip gelmediğinizi tanır. 90 gün saklanır.",
        "_gcl_au ve Google Ads çerezleri: bir Google reklamından gelip gelmediğinizi ve sonrasında görüşme talebi oluşturup oluşturmadığınızı ölçer. 90 gün saklanır.",
      ],
    },
    {
      heading: "Üçüncü taraflar",
      paragraphs: [
        "Google ve Meta çerezleri bu şirketler tarafından yerleştirilir ve topladıkları veriler yurt dışındaki sunucularında işlenir. Bu şirketlerin veriyi nasıl kullandığı kendi gizlilik politikalarında anlatılır. Yurt dışına aktarıma ilişkin ayrıntılar KVKK aydınlatma metnimizde yer alır.",
      ],
    },
    {
      heading: "Tercihlerinizi yönetmek",
      paragraphs: [
        "Çerez tercihinizi istediğiniz zaman bu sayfadaki \"Çerez tercihlerini değiştir\" butonuyla güncelleyebilirsiniz. Onayınızı geri aldığınızda analiz ve pazarlama araçları veri göndermeyi durdurur ve oturum kayıtlarımız silinir; daha önce yerleştirilmiş Google ve Meta çerezlerini tarayıcınızın ayarlarından silebilirsiniz.",
        "Tarayıcınızın ayarlarından çerezleri tümüyle engelleyebilirsiniz; zorunlu kayıtları engellemek tercihinizin hatırlanmamasına neden olur.",
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
