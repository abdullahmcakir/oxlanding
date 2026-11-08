import { BALIKESIR_PATH, WEBSITE_START_PRICE } from "@/components/local-landing/balikesir-data";
import { talepUrl } from "@/lib/links";
import type { Article } from "../article-data";

// /blog/balikesir-web-sitesi-fiyatlari-2026: fiyat araştırması ve karar verme niyetine yönelik rehber.
// Hizmet sayfası (/balikesir-web-sitesi) ticari niyeti karşılar; bu yazı eğitir, karşılaştırır, bütçe planlatır.
// Kural: piyasa için TL tutarı yok (doğrulanmış güncel veri yok). Tek rakam, sitede yazılı olan OX Dijital
// başlangıç fiyatı (services-data.ts → balikesir-data.ts WEBSITE_START_PRICE); orası değişince burası da değişir.
// Okuma süresi kelime sayısından hesaplanır (article-data.ts readingMinutes).

const SLUG = "balikesir-web-sitesi-fiyatlari-2026";

const startPrice = WEBSITE_START_PRICE
  ? ` Örneğin OX Dijital’de web sitesi projeleri ${WEBSITE_START_PRICE}’den başlıyor; net fiyatı kapsam belirliyor.`
  : "";

export const BALIKESIR_PRICES: Omit<Article, "minutes"> = {
  slug: SLUG,
  live: true,
  title: "Balıkesir Web Sitesi Fiyatları 2026: Web Sitesi Yaptırma Rehberi",
  seo: {
    title: "Balıkesir Web Sitesi Fiyatları 2026 | Maliyet Rehberi",
    description:
      "Balıkesir web sitesi fiyatları 2026 yılında neye göre değişiyor? Kurumsal site, e-ticaret, hosting, SEO ve bakım maliyetlerini öğrenin.",
  },
  category: "Web Tasarım",
  published: "2026-11-03",
  modified: "2026-11-03",
  image: `/images/blog/${SLUG}.webp`,
  imageAlt:
    "Balıkesir haritası üzerinde Edremit, Ayvalık, Bandırma ve Gönen işaretleri ile web sitesi maliyet kalemlerini gösteren tarayıcı penceresi",
  ogImage: `/images/og/${SLUG}.png`,
  related: ["kucuk-isletmeler-icin-seo", "landing-page-donusum"],
  author: {
    name: "OX Dijital",
    role: "Editör ekibi",
    bio: "OX Dijital’in tasarım, yazılım ve pazarlama ekibinin ortak kaleminden; işletmelerin dijitalde doğru karar vermesine yardımcı olacak rehberler.",
  },
  lede: [
    "Balıkesir’de işletmeniz için yeni bir web sitesi yaptırmayı düşünüyorsanız ilk sorulardan biri muhtemelen maliyet olacaktır. Ancak profesyonel bir web sitesi için tek bir fiyat vermek çoğu zaman mümkün değildir.",
    "Kurumsal bir tanıtım sitesi, online satış yapan bir e-ticaret platformu ve özel yazılım gerektiren bir proje aynı kapsamda değerlendirilmez.",
    "Bu rehberde 2026 yılında Balıkesir’de web sitesi yaptırırken bütçenizi etkileyen faktörleri, karşılaşabileceğiniz ek maliyetleri ve doğru teklif alırken nelere dikkat etmeniz gerektiğini ele alıyoruz.",
  ],
  takeaways: [
    "Fiyatı belirleyen sitenin türü ve kapsamıdır; teklifleri ancak aynı kapsam üzerinden karşılaştırabilirsiniz.",
    "Domain, hosting, içerik, SEO ve bakım çoğu zaman kurulum bedelinin dışında kalır; teklifte ayrı ayrı sorun.",
    "En ucuz teklif değil, işletmenizin ihtiyacını yazılı ve eksiksiz karşılayan teklif doğru seçimdir.",
  ],
  sections: [
    {
      id: "fiyati-belirleyenler",
      title: "2026’da web sitesi fiyatlarını neler belirler?",
      blocks: [
        {
          type: "p",
          text: "İki teklif arasında büyük fark görmenizin nedeni çoğu zaman firmaların farklı işleri fiyatlandırmasıdır. Birinin “web sitesi” dediği tek sayfalık bir tanıtım, diğerininki on beş sayfalık, yönetim panelli bir kurumsal yapı olabilir. Aşağıdaki yedi başlık, bir teklifin neden o tutarda olduğunu anlamanızı sağlar.",
        },
        { type: "h3", text: "Web sitesinin türü ve kapsamı" },
        {
          type: "p",
          text: "Tek sayfalık bir tanıtım sitesi (landing page), birkaç bölümde işletmenizi anlatır ve tek bir hedefe, örneğin teklif formuna yönlendirir. Kurumsal site hizmetler, hakkımızda, referanslar ve iletişim gibi ayrı sayfalardan oluşur. E-ticaret sitesi ise ürün, sepet, ödeme ve sipariş yönetimi içerir. Tür değiştikçe tasarım, geliştirme ve test süresi de değişir.",
        },
        { type: "h3", text: "Sayfa sayısı ve içerik ihtiyacı" },
        {
          type: "p",
          text: "Her yeni sayfa ayrı bir tasarım, içerik yerleşimi ve test demektir. Örneğin her tedavisi için ayrı sayfa açmak isteyen bir klinik, tüm hizmetlerini tek sayfada listeleyen bir klinikten daha geniş bir kapsamla çalışır. Bu ayrıntı aramada görünürlük için avantaj sağlar ama bütçeye de yansır.",
        },
        { type: "h3", text: "Hazır tema veya özel tasarım" },
        {
          type: "p",
          text: "Hazır bir tema, tasarım süresini kısaltır ve başlangıç maliyetini düşürür; buna karşılık markanızı başkalarından ayırmak ve temanın sınırları dışına çıkmak zorlaşır. Özel tasarımda arayüz markanıza ve ziyaretçinizin ihtiyacına göre sıfırdan kurulur; daha fazla emek ister ama yapı tamamen size göre şekillenir.",
        },
        { type: "h3", text: "Yönetim paneli ve entegrasyonlar" },
        {
          type: "p",
          text: "Metinleri, görselleri veya kampanyaları kendiniz güncellemek istiyorsanız düzenlenebilir alanlar ya da bir yönetim paneli kurulur. Rezervasyon sistemi, CRM, ödeme altyapısı, kargo ya da muhasebe yazılımıyla bağlantı gibi entegrasyonlar her biri ayrı geliştirme ve test gerektiren kalemlerdir.",
        },
        { type: "h3", text: "Çoklu dil desteği" },
        {
          type: "p",
          text: "Özellikle Ayvalık, Edremit ve körfez çevresinde yabancı misafir ağırlayan turizm işletmeleri için ikinci bir dil çoğu zaman gereklidir. Çoklu dil yalnızca çeviri değildir: her dil için ayrı sayfa adresleri, arama motorlarına hangi sayfanın hangi dilde olduğunu bildiren işaretler ve her dilde güncel tutulması gereken içerik demektir.",
        },
        { type: "h3", text: "SEO ve performans gereksinimleri" },
        {
          type: "p",
          text: "Doğru başlık hiyerarşisi, anlaşılır adresler, site haritası, hızlı açılan sayfalar ve optimize görseller teknik SEO temelini oluşturur. Bu temel iyi bir sitede kurulumun parçası olmalıdır. Anahtar kelime araştırması, düzenli içerik ve rakip analizi ise ayrı ve süreklilik isteyen bir hizmettir; ayrıntıları [SEO hizmeti sayfamızda](/hizmetler/seo) anlattık.",
        },
        { type: "h3", text: "Bakım ve teknik destek" },
        {
          type: "p",
          text: "Yayına alınan bir sitenin yazılım güncellemeleri, yedekleri ve küçük düzenlemeleri zamanla ihtiyaç olur. Teslimden sonra ne kadar süre, hangi kapsamda destek verileceği teklifin fiyatını doğrudan etkiler.",
        },
        {
          type: "tip",
          title: "Teklifi kalem kalem isteyin",
          text: "Firmalardan sayfa listesi, tasarım yaklaşımı (hazır ya da özel), yönetim paneli, entegrasyonlar, dil sayısı ve teslim sonrası destek ayrı ayrı yazılmış bir teklif isteyin. Böylece teklifleri aynı kapsam üzerinden karşılaştırabilirsiniz.",
        },
      ],
    },
    {
      id: "kurumsal-ve-e-ticaret",
      title: "Kurumsal web sitesi ile e-ticaret sitesi arasındaki maliyet farkı",
      blocks: [
        {
          type: "p",
          text: "Kurumsal web siteleri çoğunlukla hizmetlerin, referansların ve iletişim bilgilerinin sunulmasına odaklanır. E-ticaret projelerinde ise ürün yönetimi, ödeme altyapısı, sipariş süreçleri ve güvenlik gibi ek gereksinimler ortaya çıkar.",
        },
        {
          type: "table",
          caption: "Kurumsal web sitesi ve e-ticaret sitesinin kapsam karşılaştırması",
          head: ["Özellik", "Kurumsal web sitesi", "E-ticaret sitesi"],
          rows: [
            ["Temel amaç", "Tanıtım ve müşteri talebi", "Online satış"],
            ["Ürün yönetimi", "Genellikle gerekmez", "Gerekir"],
            ["Ödeme entegrasyonu", "Genellikle gerekmez", "Gerekir"],
            ["Teknik karmaşıklık", "Kapsama bağlı", "Genellikle daha yüksek"],
            ["Bakım ihtiyacı", "Kapsama bağlı", "Genellikle daha kapsamlı"],
          ],
        },
        {
          type: "p",
          text: "Tablo genel bir çerçeve çizer; her işletmenin ihtiyacı farklıdır. Ürünlerini sergileyip siparişi telefonla ya da WhatsApp’tan alan bir işletme için kurumsal bir katalog sitesi yeterli olabilir. Stok, kargo ve iade süreçlerini online yönetmek isteyen bir mağaza ise e-ticaret altyapısına ihtiyaç duyar. Hangisinin size uyduğunu [website](/hizmetler/website) ve [e-ticaret](/hizmetler/e-ticaret) hizmet sayfalarımızdaki kapsamlarla karşılaştırabilirsiniz.",
        },
      ],
    },
    {
      id: "ornek-butce",
      title: "Balıkesir web tasarım fiyatları için örnek bütçe nasıl oluşturulur?",
      blocks: [
        {
          type: "p",
          text: "Sağlıklı bir bütçe, rakamla değil ihtiyaç listesiyle başlar. Önce sitenin hangi işi yapacağını, kaç sayfa olacağını ve hangi özelliklerin şart olduğunu yazın; ardından bu listeyi firmalara aynı şekilde gönderin. Aşağıdaki üç senaryo, farklı işletmelerin bu listeyi nasıl kurabileceğini gösteriyor. Piyasa fiyatları firmadan firmaya ve projeden projeye değiştiği için TL tutarı yerine maliyet kalemlerini veriyoruz.",
        },
        { type: "h3", text: "Senaryo 1: Yerel hizmet işletmesi" },
        {
          type: "p",
          text: "Balıkesir merkezde hizmet veren bir tesisatçı, muhasebe bürosu veya güzellik salonu düşünün. Beş sayfalı bir kurumsal site, iletişim formu, mobil uyumluluk ve temel teknik SEO çoğu zaman yeterlidir.",
        },
        {
          type: "table",
          caption: "Yerel hizmet işletmesi için maliyet kalemleri",
          head: ["Maliyet kalemi", "Bu senaryodaki karşılığı"],
          rows: [
            ["Tasarım", "Beş sayfa: ana sayfa, hizmetler, hakkımızda, sık sorulanlar, iletişim"],
            ["Geliştirme", "Mobil uyumlu yapı, iletişim formu, harita ve telefon bağlantısı"],
            ["Teknik SEO", "Başlık yapısı, site haritası, hız optimizasyonu, Search Console kurulumu"],
            ["İçerik", "Metinlerin işletme tarafından mı yoksa ajans tarafından mı hazırlanacağı"],
            ["Yıllık giderler", "Alan adı ve hosting yenilemesi"],
          ],
        },
        { type: "h3", text: "Senaryo 2: Turizm veya konaklama işletmesi" },
        {
          type: "p",
          text: "Ayvalık’ta bir butik otel ya da Edremit’te bir pansiyon için site, misafirin karar verdiği yerdir. Çok dilli içerik, oda ve hizmet tanıtımları, rezervasyon talep sistemi ve görsel ağırlıklı bir tasarım öne çıkar.",
        },
        {
          type: "table",
          caption: "Turizm veya konaklama işletmesi için maliyet kalemleri",
          head: ["Maliyet kalemi", "Bu senaryodaki karşılığı"],
          rows: [
            ["Tasarım", "Görsel ağırlıklı ana sayfa, oda ve hizmet sayfaları, galeri"],
            ["Çoklu dil", "Her dil için ayrı sayfalar, çeviri ve dil seçimi"],
            ["Rezervasyon", "Talep formu ya da mevcut rezervasyon sistemiyle entegrasyon"],
            ["Görsel üretim", "Profesyonel fotoğraf veya video çekimi ihtiyacı"],
            ["Performans", "Yoğun görsellere rağmen hızlı açılış için görsel optimizasyonu"],
          ],
        },
        { type: "h3", text: "Senaryo 3: E-ticaret işletmesi" },
        {
          type: "p",
          text: "Bandırma’da üretim yapan ve ürünlerini Türkiye geneline satmak isteyen bir işletme için ürün kataloğu, sepet, ödeme entegrasyonu, sipariş yönetimi ve güvenlik gereksinimleri bütçenin ana kalemleridir.",
        },
        {
          type: "table",
          caption: "E-ticaret işletmesi için maliyet kalemleri",
          head: ["Maliyet kalemi", "Bu senaryodaki karşılığı"],
          rows: [
            ["Katalog", "Kategori yapısı, ürün sayfaları, varyantlar ve filtreler"],
            ["Ödeme", "Sanal POS veya ödeme kuruluşu entegrasyonu"],
            ["Sipariş yönetimi", "Stok, kargo, fatura ve iade süreçleri"],
            ["Güvenlik", "SSL, güvenli ödeme akışı, düzenli güncelleme ve yedekleme"],
            ["Sürekli giderler", "Ödeme kuruluşu komisyonları, hosting kaynakları, bakım"],
          ],
        },
        {
          type: "p",
          text: `Bu senaryolar bir başlangıç noktasıdır; sizin listeniz bunların arasında bir yerde olabilir.${startPrice}`,
        },
      ],
    },
    {
      id: "ek-maliyetler",
      title: "Web sitesi yaptırırken gözden kaçan ek maliyetler",
      blocks: [
        {
          type: "p",
          text: "Tekliflerin çoğu sitenin tasarım ve geliştirme bedelini kapsar. Aşağıdaki kalemler ise kimi zaman teklife dahildir, kimi zaman ayrıca ödenir. Hangisinin kimde olduğunu baştan netleştirmek, sonradan çıkan sürprizleri önler.",
        },
        { type: "h3", text: "Domain ve hosting" },
        {
          type: "p",
          text: "Alan adı (domain) her yıl yenilenir; uzantıya ve kayıt firmasına göre ücreti değişir. Hosting, sitenizin çalıştığı sunucu kaynağıdır; ziyaretçi sayısı, depolama ve performans ihtiyacı arttıkça daha güçlü bir paket gerekebilir. İlk yıl kampanyalı olan fiyatların yenilemede değişebileceğini de hesaba katın.",
        },
        { type: "h3", text: "SSL ve güvenlik" },
        {
          type: "p",
          text: "HTTPS, ziyaretçi ile siteniz arasındaki bağlantıyı şifreler ve tarayıcıların “güvenli değil” uyarısını önler. SSL sertifikası her zaman ayrıca ücretli değildir; birçok hosting sağlayıcısı ücretsiz sertifika sunar. Güvenlik yalnızca SSL’den ibaret de değildir: yazılım güncellemeleri ve düzenli yedekleme de bu kalemin parçasıdır.",
        },
        { type: "h3", text: "İçerik üretimi" },
        {
          type: "p",
          text: "Metinlerin yazılması, profesyonel fotoğraf veya video çekimi ve lisanslı görsel kullanımı ayrı maliyetlerdir. İçerikleri kendiniz hazırlarsanız bütçe düşer, ancak takvim sizin hızınıza bağlanır. İnternetten bulunan bir görseli izinsiz kullanmak ise telif sorunu doğurabilir.",
        },
        { type: "h3", text: "SEO çalışmaları" },
        {
          type: "p",
          text: "Teknik SEO altyapısı ile sürekli SEO hizmeti farklı kapsamlardır. Altyapı, sitenin arama motorlarınca doğru okunmasını sağlar ve kurulumda bir kez yapılır. Sürekli SEO ise içerik üretimi, anahtar kelime takibi ve iyileştirmelerle aylar boyunca süren bir çalışmadır. İlk adımlar için [küçük işletmeler için SEO rehberimize](/blog/kucuk-isletmeler-icin-seo) göz atabilirsiniz.",
        },
        { type: "h3", text: "Bakım ve güncelleme" },
        {
          type: "p",
          text: "Yazılım güncellemeleri, teknik destek ve içerik değişiklikleri için bir bakım anlaşması yapılabilir ya da her iş ayrı ücretlendirilebilir. Sözleşmede teslimden sonra hangi işlerin ücretsiz, hangilerinin ücretli olduğunu ve ne kadar süre destek verileceğini yazılı olarak belirleyin.",
        },
      ],
    },
    {
      id: "ucuz-mu-profesyonel-mi",
      title: "Ucuz web sitesi mi, profesyonel web sitesi mi?",
      blocks: [
        {
          type: "p",
          text: "Yalnızca fiyata bakarak karar vermek, ilk bakışta tasarruf gibi görünür. Ancak düşük bedelin arkasında eksik bırakılmış işler varsa bu farkı sonradan, çoğu zaman daha yüksek bir maliyetle ödersiniz. Teklifleri değerlendirirken şu başlıklara bakın:",
        },
        {
          type: "list",
          items: [
            "Mobil uyumluluk: Site telefonda da okunaklı ve kullanılabilir mi, yoksa yalnızca küçülmüş bir masaüstü görünümü mü?",
            "Performans: Sayfalar mobil bağlantıda bile hızlı açılıyor mu?",
            "Güvenlik: Güncellemeler, yedekleme ve SSL kimin sorumluluğunda?",
            "Yönetilebilirlik: Basit bir metin değişikliği için her seferinde firmaya mı bağımlı kalacaksınız?",
            "SEO altyapısı: Başlık yapısı, adresler ve site haritası kurulumda hazırlanıyor mu?",
            "Teknik destek: Bir sorun çıktığında kime, nasıl ulaşacaksınız?",
            "Uzun vadeli bakım maliyeti: Birkaç yıl içinde yeniden yaptırmak zorunda kalacağınız bir yapı mı?",
          ],
        },
        {
          type: "p",
          text: "Ucuz çözümler her zaman kötü değildir. Yeni açılan ve önce varlığını göstermek isteyen bir işletme için hazır bir yapı ya da tek sayfalık bir site mantıklı bir başlangıç olabilir. Doğru seçim, bugünkü ihtiyacınızı karşılayan ve yarın büyütülebilen çözümdür.",
        },
      ],
    },
    {
      id: "firma-secimi",
      title: "Balıkesir’de web tasarım firması seçerken nelere dikkat edilmeli?",
      blocks: [
        {
          type: "p",
          text: "Görüştüğünüz firmalara aşağıdaki soruları sorun. Hepsine net, mümkünse yazılı cevap alabiliyorsanız doğru yoldasınız.",
        },
        {
          type: "list",
          check: true,
          items: [
            "Proje kapsamı yazılı olarak belirlenmiş mi?",
            "Tasarım mobil uyumlu mu?",
            "Domain ve hosting kimin adına olacak?",
            "Siteye erişim ve yönetim yetkileri nasıl teslim edilecek?",
            "SEO kapsamında hangi çalışmalar var?",
            "Revizyon ve destek koşulları açık mı?",
            "Kaynak kod ve içerik sahipliği nasıl düzenleniyor?",
            "Yayın sonrası bakım ücretleri belli mi?",
          ],
        },
        {
          type: "p",
          text: "Firmanın aynı şehirde olması bir avantaj olabilir ama tek ölçüt değildir. Bugün görüşmelerin ve proje takibinin büyük kısmı online yürüyor; asıl önemli olan iletişimin düzenli, sürecin şeffaf olmasıdır.",
        },
      ],
    },
    {
      id: "yatirimin-geri-donusu",
      title: "Web sitesi yatırımının geri dönüşü nasıl değerlendirilir?",
      blocks: [
        {
          type: "p",
          text: "Web sitesini yalnızca bir gider kalemi olarak değil, işletme hedeflerine hizmet eden bir araç olarak değerlendirmek gerekir. Bunun için yayına almadan önce neyi ölçeceğinizi belirleyin ve ölçüm araçlarını kurun. Takip edebileceğiniz göstergeler:",
        },
        {
          type: "list",
          items: [
            "Organik ziyaretçi: Arama motorlarından gelen ziyaretçi sayısı ve hangi sayfalara geldikleri",
            "İletişim formu gönderimleri",
            "Telefon veya WhatsApp üzerinden gelen talepler",
            "Teklif talepleri",
            "E-ticaret dönüşümleri: Sipariş sayısı, sepet ortalaması",
            "Müşteri edinme maliyeti: Yeni bir müşteri kazanmak için harcanan toplam bütçe",
          ],
        },
        {
          type: "p",
          text: "Trafik artışı otomatik olarak müşteri artışı anlamına gelmez. Siteye gelen kişi aradığını bulamıyor, güven duymuyor ya da size kolayca ulaşamıyorsa ziyaretler talebe dönüşmez. Bu yüzden sayfaların anlaşılır olması ve çağrıların doğru yerde durması en az trafik kadar önemlidir.",
        },
      ],
    },
    {
      id: "sss",
      title: "Sık sorulan sorular",
      blocks: [
        {
          type: "faq",
          items: [
            {
              q: "Balıkesir’de web sitesi yaptırmak kaç TL?",
              a: `Tek bir fiyat yoktur; sitenin türü, sayfa sayısı, tasarım yaklaşımı, yönetim paneli ve entegrasyonlar fiyatı belirler.${startPrice} En sağlıklı yol, ihtiyaç listenizi birkaç firmaya aynı şekilde gönderip kalem kalem teklif almaktır.`,
            },
            {
              q: "Kurumsal web sitesi mi, hazır site mi tercih edilmeli?",
              a: "Hızlı ve düşük bütçeli bir başlangıç için hazır bir yapı yeterli olabilir. Markanızı ayrıştırmak, özel ihtiyaçlarınızı karşılamak ve siteyi zamanla büyütmek istiyorsanız size özel tasarlanan kurumsal bir site daha uygun olur.",
            },
            {
              q: "Web sitesi yaptırmak ne kadar sürer?",
              a: "Kapsama bağlıdır. Tek sayfalık bir site, çok sayfalı kurumsal bir siteden veya e-ticaret projesinden daha kısa sürede tamamlanır. İçeriklerin hazır olması ve geri bildirimlerin hızı da takvimi etkiler; süreyi teklifle birlikte yazılı olarak isteyin.",
            },
            {
              q: "Web sitesi fiyatına SEO dahil midir?",
              a: "Çoğu profesyonel teklifte teknik SEO altyapısı (başlık yapısı, site haritası, hız) kuruluma dahildir. Düzenli içerik üretimi ve anahtar kelime çalışması gibi sürekli SEO hizmetleri ise genellikle ayrıca fiyatlandırılır. Teklifte hangisinin dahil olduğunu mutlaka sorun.",
            },
            {
              q: "Domain ve hosting her yıl ödenir mi?",
              a: "Evet, ikisi de genellikle yıllık yenilenir. İlk yıl kampanyalı fiyatların yenilemede değişebileceğini göz önünde bulundurun ve hesapların sizin adınıza açılmasını isteyin.",
            },
            {
              q: "Web sitesi tamamlandıktan sonra ek ücret çıkar mı?",
              a: "Domain ve hosting yenilemeleri, bakım anlaşması, yeni sayfa veya özellik talepleri ek ücret doğurabilir. Teslimden sonra hangi işlerin kapsamda olduğunu sözleşmede yazılı olarak belirlemek sürprizleri önler.",
            },
            {
              q: "Web sitesinin yönetimi işletmeye devredilir mi?",
              a: "Devredilmelidir. Alan adı, hosting ve yönetim paneli erişimlerinin işletmenin kendisinde olması, ileride firma değiştirmek isterseniz sitenizi kaybetmemenizi sağlar. Kaynak kod ve içerik sahipliğini de sözleşmede netleştirin.",
            },
          ],
        },
      ],
    },
    {
      id: "sonuc",
      title: "Balıkesir’de web sitesi yaptırmadan önce doğru planlama yapın",
      blocks: [
        {
          type: "p",
          text: "Web sitesi fiyatlarını değerlendirirken yalnızca ilk kurulum maliyetine odaklanmak yerine projenin kapsamını, yönetilebilirliğini ve uzun vadeli ihtiyaçlarını birlikte düşünmek gerekir.",
        },
        {
          type: "p",
          text: "İyi planlanmış bir web sitesi, işletmenizin dijital varlığını güçlendirebilir ve potansiyel müşterilerin size ulaşmasını kolaylaştırabilir.",
        },
        {
          type: "p",
          text: "Balıkesir’deki işletmeniz için kurumsal web sitesi, e-ticaret çözümü veya mevcut sitenizin yenilenmesi konusunda destek arıyorsanız OX Dijital’in web tasarım çözümlerini inceleyebilirsiniz.",
        },
        {
          type: "cta",
          title: "Projenizi birlikte planlayalım",
          text: "Hizmetlerimizi, sürecimizi ve fiyatı etkileyen kalemleri Balıkesir web tasarım sayfamızda topladık. Hazırsanız ücretsiz ön görüşmede ihtiyaç listenizi birlikte çıkaralım.",
          actions: [
            { label: "Balıkesir web tasarım hizmetlerimizi inceleyin", href: BALIKESIR_PATH },
            { label: "Projeniz için teklif alın", href: talepUrl({ hizmet: "website" }) },
          ],
        },
      ],
    },
  ],
};
