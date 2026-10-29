/**
 * Müşteri panelindeki yeni talep sayfası. Adres env'den (NEXT_PUBLIC_PANEL_TALEP_URL).
 * `params` sorgu olarak eklenir (ör. { hizmet: "website" }); panel isterse formu ön-doldurabilir.
 * Env tanımlı değilse geçici olarak iletişim bölümüne gider.
 */
export function talepUrl(params: Record<string, string> = {}) {
  const base = process.env.NEXT_PUBLIC_PANEL_TALEP_URL;
  if (!base) return "#iletisim";
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}
