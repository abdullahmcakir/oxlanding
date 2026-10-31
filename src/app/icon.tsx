import { ImageResponse } from "next/og";
import { BRAND_BG, logoSrc } from "./brand-image";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: BRAND_BG, borderRadius: 14 }}>
        {/* ImageResponse next/image desteklemez */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={await logoSrc()} width={64} height={64} alt="" />
      </div>
    ),
    size,
  );
}
