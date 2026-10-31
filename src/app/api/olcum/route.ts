import { after } from "next/server";
import { ATTRIBUTION_KEYS, EVENTS, type EventName } from "@/lib/analytics-events";

// Tarayıcıdaki ölçüm (lib/analytics.ts) olayları buraya yollar, burası doğrulayıp OX Panel'e iletir.
// Neden aradan geçiyor: panel anahtarı tarayıcıya inmez, reklam engelleyiciler kendi alan adımızı engellemez,
// ziyaretçinin IP'si ve tarayıcı bilgisi panele hiç gitmez (yalnız bot elemek için burada okunur).
//
// Panel sözleşmesi: POST OX_PANEL_OLCUM_URL, "Authorization: Bearer OX_PANEL_OLCUM_KEY", gövde:
//   { site: "oxdijital.com", at: ISO zaman, e: olay, path, onay: boolean,
//     ref?, utm_source?, utm_medium?, utm_campaign?,          ← onaysızda yalnız bunlar
//     sid?, cihaz?, kaynak?: { utm_*, gclid, fbclid, giris, ref }, props? }  ← onaylıda ek olarak
// Env tanımlı değilse (geliştirme) olay konsola yazılır.

const PANEL_URL = process.env.OX_PANEL_OLCUM_URL;
const PANEL_KEY = process.env.OX_PANEL_OLCUM_KEY;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : "oxdijital.com";

const MAX_BODY = 4_000;
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp/i;

const str = (value: unknown, max = 200) => (typeof value === "string" && value ? value.slice(0, max) : undefined);

function pick(source: unknown, keys: readonly string[], max = 200) {
  if (!source || typeof source !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = str((source as Record<string, unknown>)[key], max);
    if (value) out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Olay özellikleri: düz anahtar → kısa metin/sayı, en fazla 12 alan */
function cleanProps(source: unknown) {
  if (!source || typeof source !== "object") return undefined;
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(source).slice(0, 12)) {
    if (!/^[a-z_]{1,32}$/i.test(key)) continue;
    if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "string") out[key] = value.slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
}

function normalize(raw: Record<string, unknown>) {
  const e = raw.e as EventName;
  const path = str(raw.path, 300);
  if (!EVENTS.includes(e) || !path?.startsWith("/")) return null;

  const base = { site: SITE, at: new Date().toISOString(), e, path };
  const sid = str(raw.sid, 64);

  // Oturum kimliği yoksa onaysız olaydır: yalnız sayfa görüntüleme ve kaynak bilgisi geçer
  if (!sid) {
    if (e !== "sayfa") return null;
    return { ...base, onay: false, ref: str(raw.ref), ...pick(raw, ["utm_source", "utm_medium", "utm_campaign"]) };
  }

  return {
    ...base,
    onay: true,
    sid,
    cihaz: raw.cihaz === "mobil" || raw.cihaz === "masaustu" ? raw.cihaz : undefined,
    kaynak: pick(raw.kaynak, [...ATTRIBUTION_KEYS, "giris", "ref"], 300),
    props: cleanProps(raw.props),
  };
}

export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  const text = await request.text();
  if (text.length > MAX_BODY) return new Response(null, { status: 413 });

  let event: ReturnType<typeof normalize>;
  try {
    event = normalize(JSON.parse(text));
  } catch {
    event = null;
  }
  if (!event) return new Response(null, { status: 400 });

  // Ziyaretçi panelin cevabını beklemesin
  after(async () => {
    if (!PANEL_URL || !PANEL_KEY) {
      if (process.env.NODE_ENV === "development") console.info("[olcum]", JSON.stringify(event));
      return;
    }
    try {
      await fetch(PANEL_URL, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${PANEL_KEY}` },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(5_000),
      });
    } catch (error) {
      console.error("[olcum] OX Panel'e iletilemedi", error);
    }
  });

  return new Response(null, { status: 204 });
}
