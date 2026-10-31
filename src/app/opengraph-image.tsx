import { ImageResponse } from "next/og";
import { BRAND_ACCENT, BRAND_BG, logoSrc } from "./brand-image";

// Bağlantı paylaşıldığında (WhatsApp, LinkedIn, X…) çıkan varsayılan görsel; alt sayfalar da bunu kullanır.
// Metin bilerek yalnız alan adı: slogan yazılınca buraya eklenebilir.
export const alt = "OX Dijital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: 36, background: BRAND_BG }}>
        {/* ImageResponse next/image desteklemez */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={await logoSrc()} width={260} height={260} alt="" />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, letterSpacing: 3, color: "rgba(255,255,255,0.6)" }}>
          <div style={{ width: 14, height: 14, background: BRAND_ACCENT }} />
          OXDIJITAL.COM
        </div>
      </div>
    ),
    size,
  );
}
