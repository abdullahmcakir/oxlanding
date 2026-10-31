// Tarayıcı (analytics.ts) ve sunucu (app/api/olcum) arasındaki ortak sözlük. React'e bağımlı olmamalı:
// sunucudaki rota da bunu içe aktarıyor.

/** Panelin tanıdığı olay adları; /api/olcum yalnız bunları kabul eder */
export const EVENTS = [
  "sayfa",
  "gorusme_tikla",
  "whatsapp_tikla",
  "telefon_tikla",
  "eposta_tikla",
  "sosyal_tikla",
  "asistan_ac",
  "mesaj_gonder",
  "hiz_testi",
] as const;
export type EventName = (typeof EVENTS)[number];

/** Reklamdan gelişi tanımlayan adres parametreleri */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;
