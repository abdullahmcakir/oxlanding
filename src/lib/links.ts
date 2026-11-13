/** OX Panel'in adresi (env: NEXT_PUBLIC_PANEL_URL, ör. https://panel.ox-software.com) */
export const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL;

/** Panelde talep hunisinin başladığı yol: /yeni-talep (hizmet seçimi) ve /yeni-talep/[hizmet] (form) */
export const PANEL_TALEP_PATH = "/yeni-talep";

// Sitedeki hizmet adresleri (/hizmetler/[slug]) → paneldeki form adresleri (/yeni-talep/[slug]).
// Panelde lib/services.ts'teki slug'lar; biri değişirse burası da değişmeli.
const PANEL_SERVICE: Record<string, string> = {
  website: "tanitim-sitesi",
  "e-ticaret": "e-ticaret-sitesi",
  "sosyal-medya": "sosyal-medya-yonetimi",
  seo: "seo-icerik",
  branding: "branding",
  mekanda: "mekanda",
};

/**
 * Panel geçici olarak kapalıyken true: bütün "Ücretsiz görüşme" butonları panel yerine hazır mesajlı WhatsApp'a gider
 * (mesajda butonun hizmet / paket / konu bilgisi yazar) ve "Müşteri girişi" butonları gizlenir.
 * Panel tekrar açılınca false yapılıp site yeniden derlenmeli.
 */
export const PANEL_PAUSED = true;

// WhatsApp mesajında hizmetin okunur adı
const SERVICE_NAME: Record<string, string> = {
  website: "web sitesi",
  "e-ticaret": "e-ticaret sitesi",
  "sosyal-medya": "sosyal medya",
  seo: "SEO",
  branding: "marka kimliği",
  mekanda: "Mekanda",
};

/** Panel kapalıyken görüşme butonunun WhatsApp mesajı: butonun bağlamı (hizmet, paket, site) mesaja eklenir */
function talepMessage({ hizmet, paket, konu, site }: Record<string, string>) {
  if (konu === "soru") return "Merhaba, bir sorum var.";
  const details = [
    hizmet && SERVICE_NAME[hizmet] && `Hizmet: ${SERVICE_NAME[hizmet]}`,
    paket && `Paket: ${paket === "ozel" ? "özel" : paket}`,
    site && `Site: ${site}`,
    konu && konu !== "proje" && !site && `Konu: ${konu}`,
  ].filter(Boolean);
  const base = "Merhaba, ücretsiz ön görüşme ayarlamak istiyorum.";
  return details.length ? `${base} ${details.join(" · ")}` : base;
}

/**
 * Paneldeki ücretsiz görüşme / talep hunisi. `hizmet` verilirse doğrudan o hizmetin formu, yoksa hizmet seçimi açılır;
 * diğer parametreler (paket, konu…) sorgu olarak geçer, panel formu ön-doldurmak için okuyabilir.
 * Onaylı ziyaretçide oturum ve reklam kaynağı tıklama anında eklenir (lib/analytics.ts).
 * Env tanımlı değilse geçici olarak iletişim sayfasına gider (her sayfadan çalışır).
 */
export function talepUrl({ hizmet, ...params }: Record<string, string> = {}) {
  if (PANEL_PAUSED) return whatsappUrl(talepMessage({ ...params, ...(hizmet && { hizmet }) }));
  if (!PANEL_URL) return "/iletisim";
  const service = hizmet ? PANEL_SERVICE[hizmet] : undefined;
  const url = new URL(service ? `${PANEL_TALEP_PATH}/${service}` : PANEL_TALEP_PATH, PANEL_URL);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

/**
 * Mevcut müşterinin OX Panel girişi: yeni talep değil, hesabına girmek isteyen için panelin ana adresi
 * (oturum yoksa panel kendi giriş ekranını açar). Env tanımlı değilse panelin bilinen adresi.
 */
export function panelUrl() {
  return PANEL_URL ?? "https://panel.oxdijital.com";
}

/**
 * WhatsApp sohbeti, isteğe bağlı hazır mesajla: hemen soru sormak isteyen ve panele gitmek istemeyen ziyaretçi için.
 * Numara env'den (NEXT_PUBLIC_WHATSAPP_NUMBER, ör. 905001234567); tanımlı değilse yer tutucu numara.
 * Hedef: gelen mesajlar WhatsApp Business API + n8n ile OX Panel'e düşsün (tek gelen kutusu).
 */
export function whatsappUrl(text?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905000000000";
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Sitede gösterilen iletişim adresi: iletişim sayfası, menü kartı ve kurum şeması. */
export const CONTACT_EMAIL = "merhaba@oxdijital.com";

/** KVKK aydınlatma metnindeki başvuru adresi. */
export const KVKK_EMAIL = "kvkk@oxdijital.com";

/** Sitenin yayındaki adresi: canonical, sitemap ve paylaşım görselleri bununla tam adrese çevrilir. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oxdijital.com";

/** Sosyal hesaplar: footer, menü kartı, iletişim sayfası ve arama motorları için kurum bilgisi (sameAs) buradan okur. */
export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/oxdijital/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ox-dijital" },
  { label: "Behance", href: "https://www.behance.net/oxdijital" },
] as const;
