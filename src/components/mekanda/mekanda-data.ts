import type { FaqItem } from "@/components/faq/faq";

// Mekanda tanıtım sayfasının (/hizmetler/mekanda) içeriği.
// Mekanda bir ajans hizmeti değil, OX Dijital'in dijital QR menü ürünü. Bu sayfa ürünü OX'un tasarım diliyle tanıtır ve
// mekanda.menu'ye yönlendirir; ürün ekranlarının ayrıntılı gösterimi mekanda.menu'de. Üründe olmayan özellik
// (sipariş, ödeme, rezervasyon, tema rengi seçimi) bilerek yok.

export const MEKANDA_URL = "https://mekanda.menu";

/** Okutulabilir QR: https://mekanda.menu (qrcode, hata düzeltme M, 25×25). Değiştirmek için yeniden üretilmeli. */
export const QR_MATRIX = [
  "#######.#....##...#######",
  "#.....#....##.#.#.#.....#",
  "#.###.#.####.#.#..#.###.#",
  "#.###.#...######..#.###.#",
  "#.###.#..#....#...#.###.#",
  "#.....#.##...##...#.....#",
  "#######.#.#.#.#.#.#######",
  ".........#..#..##........",
  "#.#...##..##....#..#..#.#",
  "####...#....#.##..##.#.##",
  "###########..#.#..#.###.#",
  ".####..#..###.#..#.###...",
  "##.#.####..#.####.##....#",
  ".#..#..####..#.##.##...##",
  "#####.#...##...###...##.#",
  ".......#.....#..######...",
  "##.#..##..####.######..#.",
  "........#.#.#...#...#...#",
  "#######.##..###.#.#.#...#",
  "#.....#..####.###...#....",
  "#.###.#......########...#",
  "#.###.#...#..##.##..#.##.",
  "#.###.#.#.##.....#.###.##",
  "#.....#..#...#..#..##....",
  "#######.#.####..#.#..#..#",
];

/** "Bir QR'ın arkasında ne var?" görselindeki işaretler: mekanda.png üzerindeki kutucukların yaklaşık yeri (%) */
export const HOTSPOTS: { label: string; x: number; y: number }[] = [
  { label: "Konum ve yol tarifi", x: 22, y: 13 },
  { label: "Wi-Fi", x: 60, y: 9 },
  { label: "Duyurular", x: 13, y: 44 },
  { label: "Günün ürünü", x: 85, y: 50 },
  { label: "Mekân müziği", x: 12, y: 80 },
  { label: "Çalışma saatleri", x: 84, y: 86 },
];

/** Kayan soru şeritleri */
export const TICKER = [
  ["Wi-Fi şifresi neydi?", "Instagram hesabınız var mı?", "Bugün ne var?", "Kaça kadar açıksınız?"],
  ["Adresiniz neresi?", "Tatlı var mı?", "Pazar açık mısınız?", "Kampanya var mı?"],
];

export const PANEL_ACTIONS = ["Ürün düzenleme", "Fiyat güncelleme", "Kategori yönetimi", "Duyuru paylaşma", "İşletme bilgilerini güncelleme"];

export const STEPS = [
  {
    title: "Başvur",
    text: "İşletmen hakkında birkaç bilgi paylaş. İhtiyaçlarını ve Mekanda'nın sana uygun olup olmadığını konuşalım.",
  },
  { title: "Hazırlayalım", text: "Menünü, işletme bilgilerini ve kullanacağın özellikleri birlikte düzenleyelim." },
  { title: "Kullanmaya başla", text: "QR kodunu mekânında kullanıma sun. Sonrasında bilgilerini yönetim panelinden güncelle." },
];

export const PRICE_INCLUDES = [
  "QR menü erişimi",
  "İşletme yönetim paneli",
  "Menü ve işletme bilgilerini güncelleme",
  "Abonelik süresince platform erişimi",
];

export const MEKANDA_FAQ: FaqItem[] = [
  {
    q: "Mekanda nedir?",
    a: "Mekanda, restoran, kafe ve benzeri işletmeler için geliştirilmiş bir dijital QR menü platformudur. Müşterilerin QR kodu okutarak menüne, sosyal medya hesaplarına, konumuna, çalışma saatlerine ve diğer işletme bilgilerine ulaşabilir.",
  },
  {
    q: "Mekanda'nın fiyatı ne kadar?",
    a: "Mekanda'da 2.100 TL tek seferlik giriş ve kurulum ücreti, ardından aylık 840 TL abonelik bedeli bulunur. Kullanılacak özellikler ve varsa ek hizmetler başvuru sürecinde netleştirilir.",
  },
  {
    q: "Müşterilerimin uygulama indirmesi gerekiyor mu?",
    a: "Hayır. Müşterilerin telefonlarının kamerasıyla QR kodu okutarak menüne tarayıcı üzerinden ulaşabilir.",
  },
  {
    q: "Menü fiyatlarını kendim değiştirebilir miyim?",
    a: "Evet. Yönetim panelinden ürünlerini ve fiyatlarını güncelleyebilirsin. Böylece fiyat değişikliklerinde yeniden basılı menü hazırlamak zorunda kalmazsın.",
  },
  {
    q: "QR menü yalnızca ürünleri mi gösteriyor?",
    a: "Hayır. Mekanda'da menünün yanında sosyal medya, konum, çalışma saatleri, Wi-Fi bilgileri ve duyurular gibi farklı alanlar da bulunabilir.",
  },
  {
    q: "Mekanda üzerinden sipariş veya ödeme alınabiliyor mu?",
    a: "Mevcut Mekanda ürünü dijital menü ve işletme bilgilerini sunmaya odaklanıyor. Masa siparişi ve online ödeme sistemi olarak sunulmuyor.",
  },
  {
    q: "Mekanda'yı hangi işletmeler kullanabilir?",
    a: "Kafeler, restoranlar, pastaneler ve müşterilerine menü veya işletme bilgilerini QR kod üzerinden sunmak isteyen benzer işletmeler Mekanda'yı değerlendirebilir.",
  },
  {
    q: "Mekanda'ya nasıl başvurabilirim?",
    a: "Başvuru veya ücretsiz ön görüşme üzerinden bizimle iletişime geçebilirsin. İşletmeni ve ihtiyaçlarını değerlendirdikten sonra kurulum sürecinin ayrıntılarını paylaşırız.",
  },
];
