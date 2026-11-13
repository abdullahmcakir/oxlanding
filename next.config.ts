import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// İçerik güvenlik politikası (CSP). Sayfalar statik üretildiği için nonce kullanılamıyor (nonce dinamik render ister);
// Next rehberindeki "nonce olmadan" yöntemi: satır içi betiklere izin var, dış kaynaklar tek tek sayılır.
// Yeni bir dış kaynak (betik, ölçüm, video, gömülü içerik) eklenince buraya da eklenmeli; yoksa tarayıcı sessizce engeller.
const CSP = [
  "default-src 'self'",
  // GA4 + Google Ads (gtag.js), Meta Pixel. Geliştirmede React hata ayıklaması için eval gerekir.
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.googleadservices.com https://connect.facebook.net${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Ölçüm pikselleri (GA4, Google Ads dönüşümleri, Meta) görsel isteğiyle de gider
  "img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://www.google.com.tr https://www.googleadservices.com https://*.doubleclick.net https://www.facebook.com",
  "font-src 'self' data:",
  // Ölçüm uçları + asistandaki hız testi (PageSpeed API). Rybbit ve OX Panel ölçümü /api/olcum üzerinden (aynı köken).
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://www.google.com.tr https://www.googleadservices.com https://*.doubleclick.net https://www.facebook.com https://connect.facebook.net https://www.googleapis.com",
  // Hero videosu Cloudinary'den
  "media-src 'self' https://res.cloudinary.com",
  // Google Ads dönüşüm etiketi gizli iframe kullanabilir
  "frame-src https://td.doubleclick.net https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Yalnız HTTPS üzerinden gelen yanıtta geçerlidir. Alt alan adları (panel vb.) bilerek dahil değil.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors'ı desteklemeyen eski tarayıcılar için
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Mikrofon kendi sayfamıza açık: sesli asistan (ElevenLabs) bağlanınca gerekecek
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  // Dokploy'da Docker ile: yalnız gereken dosyalar .next/standalone'a kopyalanır, imaj küçük kalır (Dockerfile)
  output: "standalone",
  // Yanıtlarda "X-Powered-By: Next.js" gönderilmesin
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Next 16: izin verilmeyen quality değerleri yok sayılır (varsayılan yalnız 75).
    qualities: [75, 85],
  },
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
