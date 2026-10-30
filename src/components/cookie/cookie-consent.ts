import { useSyncExternalStore } from "react";

// Çerez tercihi: tarayıcıda saklanır (zorunlu kayıt). Analiz / pazarlama betikleri eklendiğinde yalnız
// hasConsent("all") doğruysa yüklenmeli. Cevapsız kalmak onay sayılmaz: tercih yazılmaz, betikler kapalı kalır.
//
// Soruyu sağ alttaki asistan sorar (cookie-ask.tsx). Ortak durum burada tutulur; asistan soru açıkken
// kendini gizler, cevap verilmediyse köşesinde küçük bir kurabiye gösterir.
// - asking "auto": siteye o oturumda ilk girişte kendiliğinden açıldı (bir süre cevapsız kalırsa çekilir)
// - asking "manual": ziyaretçi açtı (asistandaki kurabiye, footer linki, çerez politikası butonu); çekilmez

export type Consent = "all" | "necessary";
type State = { ready: boolean; consent: Consent | null; asking: false | "auto" | "manual" };

const KEY = "ox-cookie-consent";
// Aynı ziyarette her sayfada yeniden sorulmasın
const ASKED_KEY = "ox-cookie-asked";

const SERVER: State = { ready: false, consent: null, asking: false };
let state: State = SERVER;
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useConsentState() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

/** İlk açılışta bir kez: kayıtlı tercihi okur; bu ziyarette hiç sorulmadıysa soruyu açar */
export function initConsent() {
  if (state.ready) return;
  const consent = readConsent();
  let asked = false;
  try {
    asked = sessionStorage.getItem(ASKED_KEY) === "1";
  } catch {}
  set({ ready: true, consent });
  if (consent === null && !asked) openCookieAsk("auto");
}

export function openCookieAsk(mode: "auto" | "manual" = "manual") {
  try {
    sessionStorage.setItem(ASKED_KEY, "1");
  } catch {}
  set({ asking: mode });
}

export function closeCookieAsk() {
  set({ asking: false });
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
  set({ consent: value });
}

export function hasConsent(value: Consent) {
  return readConsent() === value;
}
