import { onConsentChange, readConsent, type Consent } from "@/components/cookie/cookie-consent";
import { ATTRIBUTION_KEYS, type EventName } from "./analytics-events";

// Ölçüm: her olay OX Panel'e gider (/api/olcum üzerinden), onay varsa Meta, GA4 ve Google Ads'e de.
//
// İki mod, çerez tercihine göre:
// - Onaysız (cevapsız ya da "yalnız zorunlu"): yalnız sayfa görüntüleme sayılır. Çerez, depolama, oturum kimliği,
//   cihaz bilgisi yok; sunucu IP'yi panele iletmez. Gönderilen: sayfa yolu, gelinen sitenin alan adı, adresteki UTM.
//   GEÇİCİ KARAR: yayından önce site sahibinden bir kez daha onay alınacak.
// - Onaylı ("all"): oturum kimliği (sekme kapanınca silinir), ilk geliş kaynağı (UTM, gclid, fbclid), tıklamalar,
//   cihaz türü; reklam etiketleri yüklenir. Görüşme butonuna basınca bu bilgiler panel adresine eklenir,
//   böylece panel talebi hangi ziyaret ve reklamın getirdiğini bilir.
//
// Kimlikler env'den; tanımlı olmayan araç hiç yüklenmez:
// NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_GOOGLE_ADS_TALEP_LABEL

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADS_TALEP_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_TALEP_LABEL;

const SESSION_KEY = "ox-olcum-oturum";
const FIRST_TOUCH_KEY = "ox-olcum-kaynak";

type Props = Record<string, string | number>;
type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const full = () => readConsent() === "all";

function storage<T>(key: string, create: () => T): T {
  try {
    const saved = sessionStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
    const value = create();
    sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch {
    return create();
  }
}

const sessionId = () => storage(SESSION_KEY, () => crypto.randomUUID());

/** Gelinen sitenin alan adı; site içi gezinmede boş */
function referrerHost() {
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    return host === location.hostname ? "" : host;
  } catch {
    return "";
  }
}

function urlAttribution(keys: readonly string[], url = new URL(location.href)) {
  const params = url.searchParams;
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

/** Oturumun ilk geliş kaynağı (yalnız onaylıda saklanır): sonraki sayfalarda adres temiz olsa da reklam bilinsin */
const firstTouch = () =>
  storage(FIRST_TOUCH_KEY, () => ({
    ...urlAttribution(ATTRIBUTION_KEYS),
    giris: location.pathname,
    ...(referrerHost() ? { ref: referrerHost() } : {}),
  }));

function send(payload: object) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.("/api/olcum", body)) return;
  } catch {}
  fetch("/api/olcum", { method: "POST", body, keepalive: true }).catch(() => {});
}

// Gelinen site yalnız ziyaretin ilk sayfasında anlamlı; site içi gezinmede document.referrer değişmez
let landed = false;

/**
 * Bir olayı kaydeder. Onaysızken sayfa görüntüleme dışındaki her şey yok sayılır.
 * `at`: olayın sayfası. Gezinmede adres çubuğu geç güncellendiği için sayfa görüntülemede hedef adres verilir.
 */
export function track(name: EventName, props: Props = {}, at = new URL(location.href)) {
  if (typeof window === "undefined" || navigator.webdriver) return;
  const ref = name === "sayfa" && !landed ? referrerHost() : "";
  if (name === "sayfa") landed = true;

  if (!full()) {
    if (name !== "sayfa") return;
    send({ e: name, path: at.pathname, ref, ...urlAttribution(["utm_source", "utm_medium", "utm_campaign"], at) });
    return;
  }

  send({
    e: name,
    path: at.pathname,
    sid: sessionId(),
    cihaz: matchMedia("(max-width: 767px)").matches ? "mobil" : "masaustu",
    kaynak: firstTouch(),
    props,
  });
  sendToTags(name, props, at);
}

let lastPage = "";

/** Sayfa görüntüleme: ilk açılışta ve her site içi gezinmede (yalnız yol değişince; # ve sorgu değişimi sayılmaz) */
export function trackPage(url = location.href) {
  const at = new URL(url, location.href);
  if (at.pathname === lastPage) return;
  lastPage = at.pathname;
  track("sayfa", {}, at);
}

// --- Reklam ve analiz etiketleri (yalnız onaylı) ---

function sendToTags(name: EventName, props: Props, at = new URL(location.href)) {
  const { gtag, fbq } = window;
  if (name === "sayfa") {
    gtag?.("event", "page_view", { page_location: at.href });
    fbq?.("track", "PageView");
    return;
  }
  gtag?.("event", name, props);
  if (name === "gorusme_tikla") {
    fbq?.("trackCustom", "GorusmeTikla", props);
    if (ADS_ID && ADS_TALEP_LABEL) gtag?.("event", "conversion", { send_to: `${ADS_ID}/${ADS_TALEP_LABEL}` });
  } else if (name === "whatsapp_tikla" || name === "telefon_tikla" || name === "eposta_tikla" || name === "mesaj_gonder") {
    fbq?.("track", "Contact", { yol: name });
  } else {
    fbq?.("trackCustom", name, props);
  }
}

function loadScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

let tagsLoaded = false;

function loadTags() {
  if (tagsLoaded) return;
  tagsLoaded = true;

  const googleId = GA4_ID ?? ADS_ID;
  if (googleId) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js "arguments" nesnesini bekler, dizi değil
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    // Sayfa görüntülemeyi biz gönderiyoruz (trackPage); otomatik olan çift saymasın
    // Yerel geliştirme "geliştirici trafiği" sayılır: GA4'te DebugView'da görünür, veri filtresiyle raporlardan çıkar
    if (GA4_ID)
      window.gtag("config", GA4_ID, {
        send_page_view: false,
        ...(process.env.NODE_ENV !== "production" && { debug_mode: true }),
      });
    if (ADS_ID) window.gtag("config", ADS_ID);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${googleId}`);
  }

  if (META_PIXEL_ID) {
    // Meta'nın resmî yükleyicisiyle aynı: betik gelene kadar çağrılar kuyrukta bekler, gelince betik
    // callMethod'u tanımlar ve sonraki çağrılar doğrudan ona gider (yoksa kuyrukta kalıp hiç gönderilmez)
    const fbq: Fbq = (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    };
    fbq.push = fbq;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = window._fbq = fbq;
    // Otomatik yapılandırma kapalı: Meta buton tıklamalarını ve sayfa bilgilerini kendi tahminiyle olay saymasın,
    // yalnız bizim gönderdiğimiz olaylar gitsin (init'ten önce çağrılmalı)
    window.fbq("set", "autoConfig", false, META_PIXEL_ID);
    window.fbq("init", META_PIXEL_ID);
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
  }
}

function revokeTags() {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.fbq?.("consent", "revoke");
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(FIRST_TOUCH_KEY);
  } catch {}
}

function applyConsent(consent: Consent | null, { initial = false } = {}) {
  if (consent === "all") {
    const firstLoad = !tagsLoaded;
    loadTags();
    window.gtag?.("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
    window.fbq?.("consent", "grant");
    // Onay sayfa ortasında verildiyse açık sayfa etiketlere bildirilsin (panel onu zaten anonim saydı)
    if (!initial && firstLoad) sendToTags("sayfa", {});
  } else if (!initial) {
    revokeTags();
  }
}

// --- Görüşme bağlantısına kaynak ekleme ve tıklama yakalama ---

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_TALEP_URL;

function isPanelLink(url: URL) {
  if (!PANEL_URL) return false;
  const panel = new URL(PANEL_URL);
  return url.origin === panel.origin && url.pathname.startsWith(panel.pathname);
}

/** Onaylıysa panel bağlantısına oturum ve reklam kaynağını ekler; panel talebi ziyaretle eşleştirir */
function decoratePanelLink(anchor: HTMLAnchorElement, url: URL) {
  if (!full()) return;
  url.searchParams.set("ox_sid", sessionId());
  for (const [key, value] of Object.entries(firstTouch())) url.searchParams.set(key, value);
  anchor.href = url.toString();
}

/** Tüm sayfadaki bağlantı tıklamaları tek dinleyiciyle: bileşenlerin ölçümle uğraşması gerekmez */
function onClick(event: MouseEvent) {
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;
  let url: URL;
  try {
    url = new URL(anchor.href, location.href);
  } catch {
    return;
  }
  const from = { sayfa: location.pathname };

  if (isPanelLink(url)) {
    // Butonun kendi parametreleri (ör. hizmet), kaynak eklenmeden önce
    const params = Object.fromEntries(url.searchParams);
    decoratePanelLink(anchor, url);
    track("gorusme_tikla", { ...from, ...params });
  } else if (url.hostname === "wa.me") {
    track("whatsapp_tikla", from);
  } else if (url.protocol === "tel:") {
    track("telefon_tikla", from);
  } else if (url.protocol === "mailto:") {
    track("eposta_tikla", from);
  } else if (/(^|\.)(instagram|linkedin|behance)\.(com|net)$/.test(url.hostname)) {
    track("sosyal_tikla", { ...from, hedef: url.hostname.replace(/^www\./, "") });
  }
}

/** instrumentation-client.ts'ten bir kez çağrılır */
export function initAnalytics() {
  applyConsent(readConsent(), { initial: true });
  onConsentChange((consent) => applyConsent(consent));
  // Yakalama aşaması: bağlantı açılmadan önce adres güncellenebilsin
  document.addEventListener("click", onClick, true);
  // Orta tık / yeni sekmede açma
  document.addEventListener("auxclick", onClick, true);
  trackPage();
}
