// Blog detay sayfaları (/blog/[slug]).
// Düzen referansı: clean-tuna-722417.framer.app/blogayrı (büyük başlık + geniş görsel, büyük puntolu giriş,
// koyu zemin üstünde zikzak metin/görsel, sonda kişi kartları). Uzun yazılar için bloklarla çeşitlendirildi.
// TÜMÜ YER TUTUCU (demo): yazılar, rakamlar, yazar bilgileri ve görseller gerçek içerikle değiştirilecek.
// /calismalar akışındaki blog kartları buraya `href` ile bağlanır (feed-data.ts).

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  // Yeşil tırnaklı büyük alıntı
  | { type: "quote"; text: string; cite?: string }
  // Tek büyük rakam + açıklama
  | { type: "stat"; value: string; label: string }
  // Uygulanabilir tek öneri
  | { type: "tip"; title: string; text: string }
  | { type: "image"; src: string; caption?: string }
  // Koyu, sütun dışına taşan bant: metin + görsel (reverse: görsel solda)
  | { type: "band"; title: string; text: string[]; image: string; reverse?: boolean };

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  /** Okuma süresi (dakika) */
  minutes: number;
  image: string;
  /** Büyük puntolu açılış paragrafları */
  lede: string[];
  /** "Kısaca" kartı: yazının üç ana fikri */
  takeaways: string[];
  author: { name: string; role: string; bio: string };
  sections: { id: string; title: string; blocks: ArticleBlock[] }[];
};

const AUTHOR = {
  name: "Yazar Adı",
  role: "Performans Pazarlama, OX Dijital",
  bio: "Markaların reklam bütçesini ölçülebilir büyümeye çeviriyor. Meta ve Google kampanyalarında altı yıllık deneyim.",
};

export const ARTICLES: Article[] = [
  {
    slug: "meta-reklam-stratejileri",
    title: "2026'da Meta reklamlarında işe yarayan 5 strateji",
    category: "Reklam",
    date: "14 Ekim 2026",
    minutes: 9,
    image: "/images/services/sosyal-medya.png",
    lede: [
      "Algoritma değişti, maliyetler arttı, kitleler daraldı. Ama Meta hâlâ küçük ve orta ölçekli markalar için en hızlı büyüme kanalı.",
      "Fark, bütçeyi nereye koyduğunda değil; neyi test ettiğinde ve neyi bıraktığında. Bu yazıda son bir yılda müşterilerimizin kampanyalarında gerçekten işe yarayan beş yaklaşımı topladık.",
    ],
    takeaways: [
      "Kitleyi daraltmak yerine kreatifi çeşitlendir; hedeflemeyi algoritmaya bırak.",
      "Her hafta en az üç yeni kreatif test et, kazananı ölçekle.",
      "Dönüşüm verisini sunucu tarafında gönder; ölçemediğin şeyi optimize edemezsin.",
    ],
    author: AUTHOR,
    sections: [
      {
        id: "kreatif-hedefleme",
        title: "Kreatif, yeni hedefleme",
        blocks: [
          {
            type: "p",
            text: "Birkaç yıl önce başarılı bir kampanyanın sırrı doğru ilgi alanlarını bulmaktı. Bugün Meta'nın algoritması kimin satın alacağını senden daha iyi tahmin ediyor. Senin işin ona doğru sinyalleri vermek; en güçlü sinyal de kreatifin kendisi.",
          },
          {
            type: "p",
            text: "Farklı açılardan konuşan kreatifler, farklı insanlara ulaşır. Fiyata duyarlı biri indirimi vurgulayan videoya, kaliteye bakan biri ürünün detayını gösteren karuselde durur. Algoritma bu tepkilerden kimin kim olduğunu öğrenir.",
          },
          {
            type: "quote",
            text: "Hedeflemeyi daraltmak, algoritmanın elini bağlamak demek. Kreatifi çeşitlendirmek ise ona yeni kapılar açmak.",
          },
          {
            type: "list",
            items: [
              "Aynı ürün için en az üç farklı açı hazırla: fiyat, kalite, kullanım anı.",
              "Geniş kitle (yaş + konum) ile başla, ilgi alanı eklemeden önce iki hafta veri topla.",
              "Kreatif başlığını görselin içine de yaz; sesi kapalı izleyen çoğunluk.",
            ],
          },
        ],
      },
      {
        id: "haftalik-test",
        title: "Haftalık test ritmi",
        blocks: [
          {
            type: "p",
            text: "Reklam yorgunluğu eskisinden çok daha hızlı geliyor. İyi giden bir kreatif üç dört hafta içinde etkisini kaybedebiliyor. Bu yüzden 'kazanan reklamı bul ve bırak' dönemi bitti; yerine sürekli bir test ritmi geldi.",
          },
          { type: "stat", value: "3", label: "Her hafta test edilmesi önerilen yeni kreatif sayısı" },
          {
            type: "band",
            title: "Küçük bütçe, net karar",
            text: [
              "Test için büyük bütçeye gerek yok. Her yeni kreatife birkaç günlük, kontrollü bir bütçe ayır ve önceden belirlediğin tek bir metriğe bak.",
              "Tıklama maliyeti mi, sepete ekleme mi, satın alma mı? Hangisine bakacağına testten önce karar ver; sonra rakamlar seni ikna etmeye çalışırken yönünü kaybetmezsin.",
            ],
            image: "/images/principles/kurgu.jpg",
          },
          {
            type: "tip",
            title: "Kazananı kopyalama, büyüt",
            text: "Kazanan kreatifin aynısını yeni bir kampanyaya taşımak öğrenme sürecini sıfırlar. Bütçeyi mevcut reklam setinde kademeli olarak (günde en fazla %20) artır.",
          },
        ],
      },
      {
        id: "olcum",
        title: "Ölçemediğini optimize edemezsin",
        blocks: [
          {
            type: "p",
            text: "Tarayıcı kısıtlamaları ve çerez onayları yüzünden pikselin gördüğü dönüşüm sayısı gerçeğin gerisinde kalıyor. Algoritma eksik veriyle öğrenince yanlış insanlara gösteriyor.",
          },
          {
            type: "p",
            text: "Çözüm, dönüşümleri sunucu tarafından da göndermek. Böylece Meta satın alma, form ve arama gibi olayları tarayıcıdan bağımsız olarak görür; kampanya daha doğru kişilere, daha düşük maliyetle ulaşır.",
          },
          {
            type: "image",
            src: "/images/principles/takip.jpg",
            caption: "Sunucu tarafı ölçüm, piksele görünmeyen dönüşümleri de kampanyaya geri kazandırır.",
          },
        ],
      },
      {
        id: "huni",
        title: "Tek reklam değil, bir yolculuk",
        blocks: [
          {
            type: "p",
            text: "Markanı ilk kez gören biri nadiren hemen satın alır. Onu tanıtan bir video, ardından güven veren bir yorum, sonra da teklifi hatırlatan bir reklam görmesi gerekir.",
          },
          {
            type: "band",
            title: "Üç adımlı kurgu",
            text: [
              "Tanıt: geniş kitleye kısa ve merak uyandıran videolar. Burada amaç satış değil, izlenme ve etkileşim.",
              "İkna et: videoyu izleyenlere müşteri yorumları ve ürün detayları. Hatırlat: sepetini bırakanlara sınırlı süreli teklif.",
            ],
            image: "/images/solutions/kobi.webp",
            reverse: true,
          },
          {
            type: "list",
            ordered: true,
            items: ["Tanıt: video ve geniş kitle", "İkna et: yorumlar ve detay", "Hatırlat: yeniden hedefleme ve teklif"],
          },
        ],
      },
      {
        id: "sonuc",
        title: "Nereden başlamalı?",
        blocks: [
          {
            type: "p",
            text: "Hepsini aynı anda kurmak zorunda değilsin. Önce ölçümü düzelt, sonra kreatif çeşitliliğini artır, en son huniyi kur. Her adım bir sonrakinin verimini artırır.",
          },
          {
            type: "quote",
            text: "Bütçeyi artırmadan önce ölçümü düzeltmek, çoğu zaman en ucuz büyüme yoludur.",
            cite: "OX Dijital performans ekibi",
          },
        ],
      },
    ],
  },
  {
    slug: "kucuk-isletmeler-icin-seo",
    title: "Küçük işletmeler için SEO: ilk 90 günde ne yapmalı?",
    category: "SEO",
    date: "29 Eylül 2026",
    minutes: 6,
    image: "/images/services/seo.jpg",
    lede: [
      "SEO uzun vadeli bir iş, doğru. Ama ilk üç ayda atılan adımlar, sonraki bir yılın nasıl geçeceğini belirliyor.",
    ],
    takeaways: [
      "Önce teknik sorunları çöz: hız, indekslenme ve mobil uyum.",
      "Google İşletme Profili, yerel aramada en hızlı kazanç.",
      "Her ay müşterinin sorduğu bir soruyu yanıtlayan bir içerik yayınla.",
    ],
    author: AUTHOR,
    sections: [
      {
        id: "teknik",
        title: "İlk ay: teknik temel",
        blocks: [
          { type: "p", text: "Sitenin yavaş açılması ya da bazı sayfaların Google'da hiç görünmemesi, en iyi içeriği bile görünmez kılar. İlk ayı bu sorunları bulup çözmeye ayır." },
          { type: "list", items: ["Search Console'u kur, indekslenmeyen sayfalara bak", "Görselleri sıkıştır, açılış süresini ölç", "Mobilde her sayfayı tek tek kontrol et"] },
        ],
      },
      {
        id: "yerel",
        title: "İkinci ay: yerel görünürlük",
        blocks: [
          { type: "p", text: "Çevrendeki müşteriler seni haritada arıyor. Google İşletme Profilini eksiksiz doldurmak, yorum toplamak ve düzenli fotoğraf eklemek yerel aramada hızlı sonuç verir." },
          { type: "stat", value: "%46", label: "Google aramalarının yerel bir niyet taşıdığı tahmin ediliyor" },
          { type: "tip", title: "Yorumlara cevap ver", text: "Olumlu ya da olumsuz her yoruma kısa ve kişisel bir cevap yaz. Hem güven verir hem de profilinin aktif olduğunu gösterir." },
        ],
      },
      {
        id: "icerik",
        title: "Üçüncü ay: soruları yanıtla",
        blocks: [
          { type: "p", text: "Müşterilerin sana telefonda en çok ne soruyor? Her soru bir blog yazısı fikri. Bu sorulara en iyi cevabı veren sayfa, aramada üst sıralara yerleşir." },
          { type: "band", title: "Bir soru, bir sayfa", text: ["Her içerik tek bir soruyu yanıtlasın. Başlıkta soruyu sor, ilk paragrafta kısaca cevapla, devamında detaylandır."], image: "/images/principles/kurgu.jpg" },
        ],
      },
    ],
  },
  {
    slug: "reels-mi-carousel-mi",
    title: "Reels mi carousel mı? Hangi format ne zaman işe yarar",
    category: "Sosyal medya",
    date: "22 Eylül 2026",
    minutes: 4,
    image: "/images/services/sosyal-medya.png",
    lede: ["İkisi de işe yarıyor, ama aynı işe değil. Reels yeni insanlara ulaştırır, carousel ise var olan takipçiyi derinleştirir."],
    takeaways: ["Erişim için Reels, kaydetme ve paylaşım için carousel.", "İlk saniye Reels'te, ilk kare carousel'de her şeydir.", "İkisini aynı fikrin iki versiyonu olarak düşün."],
    author: AUTHOR,
    sections: [
      {
        id: "reels",
        title: "Reels: yeni kitleye kapı",
        blocks: [
          { type: "p", text: "Reels, seni takip etmeyen insanlara gösterilen formatların başında geliyor. Amaç bilinirlikse ilk tercih bu olmalı." },
          { type: "tip", title: "İlk saniyeyi kazan", text: "Videoya en ilginç anla başla. Giriş, logo ve selamlama sona kalsın." },
        ],
      },
      {
        id: "carousel",
        title: "Carousel: kaydedilen içerik",
        blocks: [
          { type: "p", text: "Adım adım rehberler, karşılaştırmalar ve listeler carousel'de daha çok kaydediliyor. Kaydedilen içerik algoritmaya 'değerli' sinyali verir." },
          { type: "band", title: "Aynı fikir, iki format", text: ["Bir Reels'in senaryosunu carousel'e, carousel'in adımlarını Reels'e çevir. Tek fikirden iki içerik çıkar."], image: "/images/principles/estetik.jpg", reverse: true },
        ],
      },
    ],
  },
  {
    slug: "landing-page-donusum",
    title: "Landing page dönüşümünü artırmanın 7 yolu",
    category: "Tasarım",
    date: "7 Ekim 2026",
    minutes: 5,
    image: "/images/solutions/kobi.webp",
    lede: ["Reklama tıklayan herkes bir fırsat. Landing page ise o fırsatı ya satışa ya da geri tuşuna çeviriyor."],
    takeaways: ["Tek sayfa, tek hedef, tek buton.", "İlk ekranda ne sunduğunu ve kime sunduğunu söyle.", "Güven unsurlarını butonun hemen yanına koy."],
    author: AUTHOR,
    sections: [
      {
        id: "tek-hedef",
        title: "Tek hedef",
        blocks: [
          { type: "p", text: "Ziyaretçiye ne kadar çok seçenek sunarsan, karar vermesi o kadar zorlaşır. Landing page'in tek bir işi olmalı." },
          { type: "list", ordered: true, items: ["Menüyü kaldır", "Tek bir eylem butonu kullan", "Formu en az alanla tut"] },
        ],
      },
      {
        id: "guven",
        title: "Güveni butona yaklaştır",
        blocks: [
          { type: "p", text: "Müşteri yorumları, garanti ve güvenli ödeme ikonları sayfanın en altında değil, butonun hemen yanında olmalı." },
          { type: "quote", text: "Karar anında görülen tek bir yorum, sayfanın başındaki on yorumdan daha etkilidir." },
        ],
      },
    ],
  },
  {
    slug: "tekrar-eden-isleri-otomatige-almak",
    title: "Tekrar eden işleri otomatiğe almak",
    category: "Otomasyon",
    date: "15 Eylül 2026",
    minutes: 5,
    image: "/images/services/otomasyon.png",
    lede: ["Ekibin her gün aynı işi elle yapıyorsa, o iş muhtemelen otomatiğe alınabilir. Asıl soru nereden başlanacağı."],
    takeaways: ["Önce en sık tekrar eden ve en az karar gerektiren işi seç.", "Küçük bir akışla başla, çalıştığını gördükçe büyüt.", "Her otomasyonun bir sahibi ve hata bildirimi olsun."],
    author: AUTHOR,
    sections: [
      {
        id: "secim",
        title: "Hangi iş otomatiğe uygun?",
        blocks: [
          { type: "p", text: "Sık tekrar eden, kuralları belli ve az karar gerektiren işler otomasyon için en iyi adaylar: fatura kesmek, form verisini tabloya aktarmak, sipariş bildirimi göndermek." },
          { type: "stat", value: "4 sa", label: "Küçük bir ekibin haftada elle veri taşımaya harcadığı ortalama süre (örnek)" },
        ],
      },
      {
        id: "baslangic",
        title: "Küçük başla",
        blocks: [
          { type: "p", text: "İlk otomasyonun tek bir adım olsun. Çalıştığını gördükçe yeni adımlar ekle." },
          { type: "band", title: "Bir sahibi olsun", text: ["Her akışın ekipte bir sorumlusu ve bir hata bildirimi olsun. Sessizce bozulan otomasyon, hiç olmamasından daha zararlıdır."], image: "/images/principles/takip.jpg" },
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

/** Yazının altındaki "Diğer yazılar": kendisi hariç ilk üç yazı. */
export function relatedArticles(slug: string) {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);
}
