import type { Glyph } from "@/components/dock/pixel-matrix";
import type { FaqItem } from "@/components/faq/faq";
import { PACKAGES, type Package } from "@/components/packages/packages-data";
import { getServicePage, type ServicePage } from "@/components/service-page/service-page-data";

export type Plan = ServicePage["packages"][number];

/** Her hizmetin piksel ikonu: seçicide ve sağ alttaki asistanın hızlı geçiş sırasında. */
export const SERVICE_GLYPHS: Record<string, Glyph> = {
  website: "browser",
  "sosyal-medya": "heart",
  branding: "star",
  otomasyon: "gear",
  "e-ticaret": "bag",
  seo: "magnifier",
  mekanda: "pin",
};

/** Bir hizmetin paketleri (hizmet sayfasındaki paketlerle aynı veri). */
export function plansOf(slug: string): Plan[] {
  return getServicePage(slug)?.packages ?? [];
}

// /paketler: müşteri önce hangi aşamada olduğunu seçer (OX Panel'deki üç paket = üç aşama),
// tek bir hizmet arayan da aşağıda her hizmetin paketlerini tekli liste halinde, alt alta bulur.
// Aşama kartları ve "hizmet detayı" butonları ana sayfadaki hizmet flyout'unu açar (ServiceFlyout).
// Paket içerikleri YER TUTUCU: setler packages-data'dan, hizmetler services-data'dan gelir;
// oralar güncellenince bu sayfa da kendiliğinden güncellenir.

export type Stage = {
  pkg: Package;
  /** Aşama sırası: kart numarası */
  step: number;
};

// Hizmetlerin hangi aşama paketinde yer aldığı. Aşağıdaki hizmet listesi bilerek aşamalara göre gruplanmaz
// ("Website sadece yeni markalar için" gibi okunuyordu); bu eşleşme yalnız "… paketinde de var" notunu besler.
const MEMBERS: Record<string, string[]> = {
  "sifirdan-basla": ["website", "branding", "sosyal-medya", "seo"],
  "satisa-gec": ["e-ticaret", "mekanda"],
  olcekle: ["otomasyon"],
};

/** Hizmetin yer aldığı paket(ler): tekli listede "… paketinde de var" notu için. */
export function stagesOf(slug: string) {
  return PACKAGES.filter((pkg) => MEMBERS[pkg.slug]?.includes(slug));
}

/** Bütün aşamaların hizmet olmayan kalemleri (modül / uygulama), tekrarsız. */
export function allExtras() {
  const seen = new Set<string>();
  return PACKAGES.flatMap((p) => p.items).filter((item) => {
    if (item.kind === "hizmet" || seen.has(item.label)) return false;
    seen.add(item.label);
    return true;
  });
}

export const STAGES: Stage[] = PACKAGES.map((pkg, i) => ({ pkg, step: i + 1 }));

export const PLAN_STEPS = [
  { title: "Ücretsiz görüşme", text: "OX Panel'den online bir görüşme ayarla; ihtiyacını ve hedefini dinleyelim." },
  { title: "Planı birlikte kuralım", text: "Paketi ihtiyacına göre uyarlayıp kapsamı, takvimi ve teklifi netleştirelim." },
  { title: "Üretip yayına alalım", text: "Her adımı onayına sunarak üretiyor, yayına alıyor ve ölçmeye başlıyoruz." },
];

export const PLAN_FAQ: FaqItem[] = [
  { q: "Hangi aşamada olduğumu nasıl anlarım?", a: "Dijitalde henüz yoksan Sıfırdan Başla, online satış ya da müşteri takibi kurmak istiyorsan Satışa Geç, tekrar eden işler ekibini yavaşlatıyorsa Ölçekle. Emin değilsen ücretsiz görüşmede birlikte karar veririz." },
  { q: "Paketlerin içeriğini değiştirebilir miyim?", a: "Evet. Paketler başlangıç noktası; kalem ekleyip çıkararak ihtiyacına göre uyarlayabiliyoruz." },
  { q: "Sadece tek bir hizmet alabilir miyim?", a: "Elbette. Aşağıdaki listeden istediğin hizmeti seçip tek başına da çalışabiliriz; paket şart değil." },
  { q: "Fiyatlar neden sayfada yazmıyor?", a: "Her projenin kapsamı farklı. Gereksiz kalem için ödeme yapmaman için teklifi ihtiyacına göre, görüşmeden sonra hazırlıyoruz." },
  { q: "Süreler neye göre belirleniyor?", a: "Yazan süreler tahminidir. Kesin takvim, kapsam netleştikten sonra teklifle birlikte paylaşılır." },
];
