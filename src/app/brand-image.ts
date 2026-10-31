import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Favicon, Apple ikonu ve paylaşım görseli aynı dil: koyu zeminde beyaz OX logosu.
// Logo saydam beyaz PNG (public/images/logo.png); data URI olarak gömülür.
export async function logoSrc() {
  const data = await readFile(join(process.cwd(), "public/images/logo.png"));
  return `data:image/png;base64,${data.toString("base64")}`;
}

export const BRAND_BG = "#070707";
export const BRAND_ACCENT = "#c5f36a";
