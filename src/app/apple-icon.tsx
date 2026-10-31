import { ImageResponse } from "next/og";
import { BRAND_BG, logoSrc } from "./brand-image";

// iOS köşeleri kendisi yuvarlar: kare zemin
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: BRAND_BG }}>
        {/* ImageResponse next/image desteklemez */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={await logoSrc()} width={168} height={168} alt="" />
      </div>
    ),
    size,
  );
}
