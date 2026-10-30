// /hakkimizda içeriği. Yaklaşım: kendimizi değil, neye inandığımızı ve nasıl çalıştığımızı anlatmak
// (yeni kurulmuş bir marka rakam ve kadro yerine duruşuyla güven verir). Rakam, ekip, kilometre taşı ve ürün bölümleri
// bilerek yok.
// TÜMÜ YER TUTUCU: metinler ve görseller gerçek içerikle değiştirilecek.

// Kurucunun imzalı "yaklaşım" mektubu ve solundaki kısa hikâye (clean-tuna /services'teki
// "OX Dijital'in Yaklaşımı" kartı + tbd'nin iki tonlu paragrafı). Bir insanın imzası, şirketin arkasında biri
// olduğunu hissettirir.
export const STORY = {
  lead: "Ekranda güzel görünen değil, arkada da çalışan işler yapıyoruz.",
  // İki tonlu paragraf: ilk cümle koyu, devamı soluk
  strong: "OX Dijital'i kurmadan önce ajans tarafında da marka tarafında da çalıştık.",
  soft: "Gördüğümüz hep aynıydı: güzel bir site teslim ediliyor, ama kimse onun ne kadar müşteri getirdiğini ölçmüyor. Biz tasarımı, yazılımı ve reklamı tek masada toplayıp her işi sonucuyla birlikte teslim etmek için yola çıktık.",
};

export const LETTER = {
  title: "OX Dijital'in yaklaşımı",
  paragraphs: [
    "\"Siteyi teslim edip geçelim\" anlayışını baştan reddediyoruz. Bizim için iş, markanın ekranda nasıl göründüğü kadar arka planda nasıl çalıştığı ve nasıl büyüdüğüdür.",
    "Tasarımı, yazılımı ve reklamı aynı masada yürütüyoruz. Çünkü güzel bir tasarım, doğru kurulmuş bir altyapı ve ölçülebilir bir reklam olmadan uzun vadede değer üretmiyor.",
    "Her projede kimin neyi, ne zaman yapacağını baştan açıkça konuşuyoruz. Süreci OX Panel'den adım adım takip ediyorsun; sürpriz yaşamıyorsun.",
  ],
  name: "Ad Soyad",
  role: "Kurucu · OX Dijital",
  initials: "AS",
};

// "Neye inanıyoruz": müşteriye dönük ilkeler; her biri bir söz gibi okunmalı.
// glyph: öne çıkan ilkede büyük piksel matrisin aldığı şekil (dock/pixel-matrix.tsx GLYPHS)
export const BELIEFS = [
  { title: "İyi iş ölçülür.", text: "Güzel görünmek başlangıç. Her işi, getirdiği sonuçla değerlendiririz.", glyph: "bars" },
  { title: "Sürpriz yok.", text: "Kapsam, takvim ve maliyet baştan nettir; her adım onayından geçer.", glyph: "check" },
  { title: "Tek masa, tek sorumluluk.", text: "Tasarım, yazılım ve reklam aynı masada. Topu kimse kimseye atmaz.", glyph: "plus" },
  { title: "Önce dinleriz.", text: "Ne istediğini anlamadan ne yapacağımıza karar vermeyiz.", glyph: "bubble" },
  { title: "Bitince bitmez.", text: "Yayına aldığımız her şeyi izler, iyileştirmeye devam ederiz.", glyph: "trend" },
] as const;

// "Net olalım": yaptıklarımız ve bilerek yapmadıklarımız. Sektörde güvensizlik abartılı vaatlerden doğar;
// neyi yapmadığını açıkça söyleyen bir ajansa daha kolay inanılır. Yapmayız listesi gerçek bir taahhüt olmalı.
export const CANDOR = {
  do: [
    "Her işi ölçülebilir bir hedefle başlatırız.",
    "Kapsamı, takvimi ve maliyeti işe başlamadan yazılı netleştiririz.",
    "Her adımı onayına sunar, süreci OX Panel'den görünür tutarız.",
    "Teslim ettiğimiz dosyalar, hesaplar ve kodlar tamamen senindir.",
  ],
  dont: [
    "Garantili \"Google'da 1. sıra\" vaat etmeyiz.",
    "Seni uzun ve çıkışı zor sözleşmelere kilitlemeyiz.",
    "Hazır şablonu özel tasarım diye satmayız.",
    "Ölçemediğimiz bir başarıyı rapora yazmayız.",
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
    text: "Hızlı açılan, kolay yönetilen, büyüdükçe yük olmayan siteler ve paneller kurarız.",
    pattern: "checker",
  },
  {
    title: "Reklam",
    text: "Bütçeyi en çok dönüş getiren kanala yönlendirir, her kampanyayı rakamlarla izleriz.",
    pattern: "bars",
  },
  {
    title: "İçerik ve sosyal medya",
    text: "Takipçiyi müşteriye çeviren içerikleri planlar, üretir ve düzenli yayında tutarız.",
    pattern: "diag",
  },
] as const;
