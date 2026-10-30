/**
 * Müşteri panelindeki yeni talep sayfası. Adres env'den (NEXT_PUBLIC_PANEL_TALEP_URL).
 * `params` sorgu olarak eklenir (ör. { hizmet: "website" }); panel isterse formu ön-doldurabilir.
 * Env tanımlı değilse geçici olarak iletişim sayfasına gider (her sayfadan çalışır; eskiden ana sayfadaki
 * #iletisim bölümüne gidiyordu, o bölümün olmadığı sayfalarda buton boşa düşüyordu).
 */
export function talepUrl(params: Record<string, string> = {}) {
  const base = process.env.NEXT_PUBLIC_PANEL_TALEP_URL;
  if (!base) return "/iletisim";
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
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