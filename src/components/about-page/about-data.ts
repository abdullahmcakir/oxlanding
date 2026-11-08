// /hakkimizda içeriği. Yaklaşım: kendimizi değil, neye inandığımızı ve nasıl çalıştığımızı anlatmak
// (yeni kurulmuş bir marka rakam ve kadro yerine duruşuyla güven verir). Rakam, ekip, kilometre taşı ve ürün bölümleri
// bilerek yok.
// TÜMÜ YER TUTUCU: metinler ve görseller gerçek içerikle değiştirilecek.

// Kurucunun imzalı "yaklaşım" mektubu ve solundaki kısa hikâye (clean-tuna /services'teki
// "OX Dijital'in Yaklaşımı" kartı + tbd'nin iki tonlu paragrafı). Bir insanın imzası, şirketin arkasında biri
// olduğunu hissettirir.
export const STORY = {
  lead: "Ekranda güzel görünen değil, arkada da çalışan işler yapıyoruz.",
  // İki tonlu paragraf: ilk iki cümle koyu, devamı soluk
  strong: "Bir web sitesi güzel görünebilir, bir reklam dikkat çekebilir. Ama bunların işletmeye ne kazandırdığı da önemli.",
  soft: "OX Dijital'de tasarım, yazılım ve pazarlamayı bu yüzden birlikte düşünüyoruz. Yapılan işin yalnızca teslim edildiği gün değil, sonrasında da işe yaramasını önemsiyoruz.",
};

// İmza `name` varsa görünür; köşedeki portre rozeti ayrıca `initials` ister.
export const LETTER: { title: string; paragraphs: string[]; name?: string; role: string; initials?: string } = {
  title: "Neden OX Dijital?",
  // Kurucunun ağzından kısa manifesto (birinci tekil şahıs)
  paragraphs: [
    "Bir işletmenin dijitalde iyi görünmesi gerektiğine inanıyorum. Ama sadece iyi görünmesi yetmez. Yapılan işin bir karşılığı olmalı.",
    "Bir web sitesi gerçekten işe yaramalı. Reklama ayrılan bütçenin nereye gittiği bilinmeli. Tasarım yalnızca güzel olduğu için değil, doğru olduğu için tercih edilmeli.",
    "OX Dijital'de kurmaya çalıştığım çalışma anlayışı bu. Müşterinin ne satın aldığını bildiği, yapılan işi takip edebildiği ve karşısında gerçekten muhatap bulabildiği bir ekip.",
    "Her şeyi bildiğimizi veya her sorunu çözebileceğimizi iddia etmiyorum. Ama üstlendiğimiz işi sahiplenmek, açık konuşmak ve daha iyisini yapmak için uğraşmak konusunda ciddiyiz.",
  ],
  name: "Abdullah Çakır",
  role: "Kurucu · OX Dijital",
};

// "Neye inanıyoruz": müşteriye dönük ilkeler; her biri bir söz gibi okunmalı.
// glyph: öne çıkan ilkede büyük piksel matrisin aldığı şekil (dock/pixel-matrix.tsx GLYPHS)
export const BELIEFS = [
  { title: "İyi iş ölçülür.", text: "Güzel görünmek başlangıç. Her işi, getirdiği sonuçla değerlendiririz.", glyph: "bars" },
  { title: "Sürpriz yok.", text: "Kapsam, takvim ve maliyet baştan nettir; her adım onayından geçer.", glyph: "check" },
  { title: "Sorumluluk bizde.", text: "İşin hangi aşamada olduğunu bilirsin. Bir sorun çıktığında kiminle görüşeceğini de.", glyph: "plus" },
  { title: "Önce dinleriz.", text: "Ne istediğini anlamadan ne yapacağımıza karar vermeyiz.", glyph: "bubble" },
  { title: "Bitince bitmez.", text: "Yayına aldığımız her şeyi izler, iyileştirmeye devam ederiz.", glyph: "trend" },
] as const;

// "Net olalım": yaptıklarımız ve bilerek yapmadıklarımız. Sektörde güvensizlik abartılı vaatlerden doğar;
// neyi yapmadığını açıkça söyleyen bir ajansa daha kolay inanılır. Yapmayız listesi gerçek bir taahhüt olmalı.
// Aynı sıradaki maddeler karşılıklıdır: masaüstünde aynı satırda, mobilde art arda gösterilir (sayılar eşit kalmalı).
export const CANDOR = {
  do: [
    "Beğenmediğin tasarımı neden beğenmediğini konuşur, birlikte düzeltiriz.",
    "Küçük bir değişiklik için de ulaşabileceğin bir muhatabın olur.",
    "Yapamayacağımız bir iş varsa en baştan söyleriz.",
    "İhtiyacına uygun çözümü öneririz; bazen daha basiti yeterlidir.",
    "Sadece istediğin işi yapmakla kalmaz, o işten daha fazla verim alman için neler yapabileceğimizi de konuşuruz.",
  ],
  dont: [
    "\"Biz tasarımcıyız, doğrusu bu\" diyerek istemediğin bir işi sana kabul ettirmeyiz.",
    "İki satır yazı değişecek diye seni günlerce peşimizden koşturmayız.",
    "Sırf müşteriyi kaçırmamak için her işe \"hallederiz\" demeyiz.",
    "İki sayfalık bir iş için sana gereksiz yere koca bir sistem satmayız.",
    "\"İstediğin işi yaptık, gerisi sana kalmış.\" deyip işin içinden çıkmayız.",
  ],
};

// Vizyon: sayfanın kapanış cümlesi; Statement bölümünde fotoğrafın üstünde gösterilir
export const VISION = "Her işletmenin, büyük markalarla aynı dijital imkânlara sahip olduğu bir dünya.";

// Resmî şirket bilgileri: Hakkımızda'da değil, footer ve yasal sayfalarda (KVKK, kullanım koşulları) gösterilecek.
export const COMPANY = [
  { label: "Ticari ünvan", value: "OX Dijital Ltd. Şti." },
  { label: "MERSİS no", value: "0000 0000 0000 0000" },
  { label: "Vergi dairesi / no", value: "Örnek V.D. · 000 000 0000" },
  { label: "Ticaret sicil no", value: "000000-0" },
  { label: "Adres", value: "Örnek Mah. Örnek Cad. No: 1, İstanbul" },
];

// "Tek masa" kaydırmalı kartları: aynı masada yürüyen işler. pattern: kartın üst şeridindeki piksel deseni
export const DISCIPLINES = [
  {
    title: "Strateji",
    text: "Kime, neyi, hangi kanaldan anlatacağını baştan netleştiririz. Sonraki her karar bu plana dayanır.",
    pattern: "dots",
  },
  {
    title: "Tasarım",
    text: "Markanın her ekranda aynı sesle konuşmasını sağlarız: logodan siteye, sosyal medyadan reklam görseline.",
    pattern: "plus",
  },
  {
    title: "Yazılım",
    text: "İşletmenin ihtiyaçlarına göre yazılımlar geliştirir, mevcut sistemleri birbirine bağlar ve iş süreçlerini kolaylaştırırız. Teknolojiyi işine uydururuz, işini teknolojiye değil.",
    pattern: "checker",
  },
  {
    title: "Reklam",
    text: "Hedef kitleni ve bütçeni dikkate alarak kampanyalarını planlar, sonuçlarını takip eder ve gerektiğinde düzenlemeler yaparız.",
    pattern: "bars",
  },
  {
    title: "İçerik ve sosyal medya",
    text: "Markanın diline uygun içerikler planlar ve üretiriz. Sosyal medya hesaplarının düzenli ve tutarlı bir şekilde yönetilmesini sağlarız.",
    pattern: "diag",
  },
] as const;
