import { initAnalytics, trackPage } from "@/lib/analytics";

// Next'in istemci ölçüm dosyası: hidrasyondan önce bir kez çalışır. Ölçüm hatası siteyi asla bozmasın.
try {
  initAnalytics();
} catch {}

export function onRouterTransitionStart(url: string) {
  try {
    trackPage(url);
  } catch {}
}
