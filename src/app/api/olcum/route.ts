import { isIP } from "node:net";
import { after } from "next/server";
import { ATTRIBUTION_KEYS, EVENTS, type EventName } from "@/lib/analytics-events";

// Tarayıcıdaki ölçüm (lib/analytics.ts) olayları buraya yollar, burası doğrulayıp OX Panel'e ve Rybbit'e iletir.
// Neden aradan geçiyor: anahtarlar tarayıcıya inmez, reklam engelleyiciler kendi alan adımızı engellemez,
// ziyaretçinin IP'si ve tarayıcı bilgisi panele hiç gitmez; Rybbit'e yalnız onaylı ziyaretçide gider.
//
// Panel sözleşmesi: POST OX_PANEL_OLCUM_URL, "Authorization: Bearer OX_PANEL_OLCUM_KEY", gövde:
//   { site: "oxdijital.com", at: ISO zaman, e: olay, path, onay: boolean,
//     ref?, utm_source?, utm_medium?, utm_campaign?,          ← onaysızda yalnız bunlar
//     sid?, cihaz?, kaynak?: { utm_*, gclid, fbclid, giris, ref }, props? }  ← onaylıda ek olarak
//
// Rybbit (kendi sunucumuzda, RYBBIT_URL): POST /api/track, site anahtarıyla.
// - Onaysız: yalnız sayfa görüntüleme; IP ve tarayıcı bilgisi gönderilmez. Rybbit isteği bizim sunucumuzdan görür,
//   bu yüzden onaysız ziyaretler orada tek bir "ziyaretçi" gibi durur: toplam sayfa görüntüleme doğru, ziyaretçi
//   ve oturum sayıları anlamsız (bilerek: onaysız ziyaretçiyi ayırt etmiyoruz).
// - Onaylı: IP, tarayıcı ve dil iletilir; Rybbit konum, cihaz ve oturumları kendisi çıkarır. Tıklamalar özel olay.
//
// Hiçbir hedef tanımlı değilse (geliştirme) olay konsola yazılır.

const PANEL_URL = process.env.OX_PANEL_OLCUM_URL;
const PANEL_KEY = process.env.OX_PANEL_OLCUM_KEY;
const RYBBIT_URL = process.env.RYBBIT_URL;
const RYBBIT_SITE_ID = process.env.RYBBIT_SITE_ID;
const RYBBIT_API_KEY = process.env.RYBBIT_API_KEY;
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
    return { ...base, onay: false as const, ref: str(raw.ref), ...pick(raw, ["utm_source", "utm_medium", "utm_campaign"]) };
  }

  return {
    ...base,
    onay: true as const,
    sid,
    cihaz: raw.cihaz === "mobil" || raw.cihaz === "masaustu" ? raw.cihaz : undefined,
    kaynak: pick(raw.kaynak, [...ATTRIBUTION_KEYS, "giris", "ref"], 300),
    props: cleanProps(raw.props),
  };
}

type OlcumEvent = NonNullable<ReturnType<typeof normalize>>;

/** Onaylı ziyaretçinin Rybbit'e iletilecek bilgileri; onaysızda hiç okunmaz */
function visitorOf(request: Request) {
  const headers = request.headers;
  // Cloudflare arkasında gerçek IP cf-connecting-ip'te; yoksa vekilin eklediği ilk adres
  const ip = (headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0] ?? headers.get("x-real-ip"))?.trim();
  return {
    ip: ip && isIP(ip) ? ip : undefined,
    ua: str(headers.get("user-agent"), 512),
    language: str(headers.get("accept-language")?.split(/[,;]/)[0], 16),
  };
}

function toRybbit(event: OlcumEvent, host: string, visitor?: ReturnType<typeof visitorOf>) {
  // UTM ve reklam kimlikleri sorgu olarak: Rybbit kaynak raporlarını bunlardan çıkarır
  const attribution = event.onay ? event.kaynak : pick(event, ["utm_source", "utm_medium", "utm_campaign"]);
  const query = new URLSearchParams(
    Object.entries(attribution ?? {}).filter(([key, value]) => value && (ATTRIBUTION_KEYS as readonly string[]).includes(key)),
  ).toString();
  const ref = event.onay ? event.kaynak?.ref : event.ref;

  return {
    site_id: RYBBIT_SITE_ID,
    hostname: host,
    pathname: event.path,
    ...(query && { querystring: `?${query}` }),
    ...(ref && { referrer: `https://${ref}/` }),
    ...(event.e === "sayfa"
      ? { type: "pageview" }
      : { type: "custom_event", event_name: event.e, properties: JSON.stringify(event.onay ? (event.props ?? {}) : {}) }),
    // Onaysızda sabit yerel adres: IP verilmezse Rybbit konumu iletimin geçtiği sunucudan tahmin ediyor (Sofya, ABD…)
    // ve ülke raporlarını bozuyordu. 127.0.0.1 hiçbir ülkeye çözülmez, onaysız ziyaretler "bilinmiyor"da toplanır.
    ...(visitor
      ? { ip_address: visitor.ip, user_agent: visitor.ua, language: visitor.language }
      : { ip_address: "127.0.0.1" }),
  };
}

async function forward(name: string, url: string, key: string, body: object) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) console.error(`[olcum] ${name} reddetti`, res.status, (await res.text()).slice(0, 300));
  } catch (error) {
    console.error(`[olcum] ${name}'e iletilemedi`, error);
  }
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

  // Hangi kopyadan geldiği (test adresi / asıl site) Rybbit'te ayrılabilsin
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? SITE).split(":")[0];
  const visitor = event.onay ? visitorOf(request) : undefined;

  // Ziyaretçi hedeflerin cevabını beklemesin
  after(async () => {
    const jobs: Promise<void>[] = [];
    if (PANEL_URL && PANEL_KEY) jobs.push(forward("OX Panel", PANEL_URL, PANEL_KEY, event));
    if (RYBBIT_URL && RYBBIT_SITE_ID && RYBBIT_API_KEY)
      jobs.push(forward("Rybbit", `${RYBBIT_URL}/api/track`, RYBBIT_API_KEY, toRybbit(event, host, visitor)));
    if (!jobs.length && process.env.NODE_ENV === "development") console.info("[olcum]", JSON.stringify(event));
    await Promise.all(jobs);
  });

  return new Response(null, { status: 204 });
}
