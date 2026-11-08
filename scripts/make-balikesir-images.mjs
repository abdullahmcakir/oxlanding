// Balıkesir sayfaları için kapak + paylaşım görselleri: SVG çizilir, sharp ile WebP/PNG'ye çevrilir.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.argv[2];
const require = createRequire(join(ROOT, "package.json"));
const sharp = require("sharp");

const BLUE = "#2f6bff";
const FONT = "Segoe UI, Arial, sans-serif";
const MONO = "Consolas, Courier New, monospace";

// İlçeler: boylam 26.6–28.1, enlem 39.25–40.4 → kutu içinde konum
const PINS = [
  ["Bandırma", 27.97, 40.35],
  ["Gönen", 27.65, 40.1],
  ["Balıkesir", 27.88, 39.65, true],
  ["Edremit", 27.02, 39.6],
  ["Burhaniye", 26.97, 39.5],
  ["Ayvalık", 26.69, 39.32],
];

function map(x0, y0, w, h, scale = 1) {
  return PINS.map(([name, lon, lat, main]) => {
    const x = x0 + ((lon - 26.6) / 1.5) * w;
    const y = y0 + ((40.4 - lat) / 1.15) * h;
    const flip = (lon - 26.6) / 1.5 > 0.6;
    const s = main ? 16 * scale : 11 * scale;
    // Merkez etiketi noktanın üstünde ortalı: yanındaki ilçelerin etiketleriyle çakışmasın
    const tx = main ? x : flip ? x - 18 * scale : x + 18 * scale;
    const ty = main ? y - 34 * scale : y + 7 * scale;
    const anchor = main ? "middle" : flip ? "end" : "start";
    return `
      ${main ? `<rect x="${x - 20 * scale}" y="${y - 20 * scale}" width="${40 * scale}" height="${40 * scale}" fill="${BLUE}" opacity="0.25"/>` : ""}
      <rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="${main ? BLUE : "#ffffff"}" opacity="${main ? 1 : 0.8}"/>
      <text x="${tx}" y="${ty}" text-anchor="${anchor}" font-family="${MONO}" font-size="${(main ? 22 : 19) * scale}" font-weight="${main ? 700 : 400}" letter-spacing="${2 * scale}" fill="${main ? "#fff" : "rgba(255,255,255,0.6)"}">${name.toLocaleUpperCase("tr-TR")}</text>`;
  }).join("");
}

function browser(x, y, w, s = 1) {
  const rows = [
    ["Sayfa sayısı", 0.72],
    ["Tasarım yaklaşımı", 0.9],
    ["Yönetim paneli", 0.55],
    ["Entegrasyonlar", 0.66],
    ["Çoklu dil", 0.4],
    ["Bakım ve destek", 0.6],
  ];
  const rowH = 74 * s;
  const h = 150 * s + rows.length * rowH;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${28 * s}" fill="#0f0f0f" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <circle cx="${x + 36 * s}" cy="${y + 38 * s}" r="${7 * s}" fill="rgba(255,255,255,0.25)"/>
      <circle cx="${x + 60 * s}" cy="${y + 38 * s}" r="${7 * s}" fill="rgba(255,255,255,0.18)"/>
      <circle cx="${x + 84 * s}" cy="${y + 38 * s}" r="${7 * s}" fill="rgba(255,255,255,0.12)"/>
      <rect x="${x + 118 * s}" y="${y + 22 * s}" width="${w - 150 * s}" height="${32 * s}" rx="${16 * s}" fill="rgba(255,255,255,0.06)"/>
      <text x="${x + 138 * s}" y="${y + 44 * s}" font-family="${MONO}" font-size="${17 * s}" fill="rgba(255,255,255,0.45)">oxdijital.com/blog</text>
      <text x="${x + 36 * s}" y="${y + 112 * s}" font-family="${MONO}" font-size="${17 * s}" font-weight="700" letter-spacing="${2.5 * s}" fill="rgba(255,255,255,0.45)">MALİYETİ BELİRLEYEN KALEMLER</text>
      ${rows
        .map(([label, v], i) => {
          const ry = y + 150 * s + i * rowH;
          const bw = (w - 72 * s) * 0.42;
          const bx = x + w - 36 * s - bw;
          return `
          <line x1="${x + 36 * s}" x2="${x + w - 36 * s}" y1="${ry}" y2="${ry}" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>
          <text x="${x + 36 * s}" y="${ry + 46 * s}" font-family="${FONT}" font-size="${25 * s}" fill="#fff">${label}</text>
          <rect x="${bx}" y="${ry + 28 * s}" width="${bw}" height="${14 * s}" rx="${7 * s}" fill="rgba(255,255,255,0.08)"/>
          <rect x="${bx}" y="${ry + 28 * s}" width="${bw * v}" height="${14 * s}" rx="${7 * s}" fill="${i === 1 ? BLUE : "rgba(255,255,255,0.55)"}"/>`;
        })
        .join("")}
    </g>`;
}

function defs(w, h) {
  return `
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="rgba(255,255,255,0.10)"/></pattern>
    <radialGradient id="glow" cx="0.78" cy="1" r="0.75"><stop offset="0" stop-color="${BLUE}" stop-opacity="0.45"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#070707"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>`;
}

// Kapak: 2400×1350 (16:9). Masaüstünde 16:7'ye kırpılır; içerik dikeyde ortadaki bantta.
function cover() {
  const W = 2400, H = 1350;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(W, H)}
  <g>
    <rect x="200" y="420" width="14" height="14" fill="${BLUE}"/>
    <text x="232" y="434" font-family="${MONO}" font-size="24" font-weight="700" letter-spacing="4" fill="${BLUE}">OX DİJİTAL · REHBER</text>
    <text font-family="${FONT}" font-size="112" font-weight="600" letter-spacing="-4" fill="#fff">
      <tspan x="194" y="580">Balıkesir web sitesi</tspan>
      <tspan x="194" y="706">fiyatları <tspan fill="${BLUE}">2026</tspan></tspan>
    </text>
    <text x="200" y="800" font-family="${FONT}" font-size="38" fill="rgba(255,255,255,0.6)">Kurumsal site, e-ticaret ve ek maliyetler</text>
  </g>
  <g opacity="0.95">${map(1560, 200, 560, 240)}</g>
  ${browser(1480, 470, 760)}
</svg>`;
}

// Paylaşım görselleri: 1200×630
function og({ eyebrow, lines, accent, sub }) {
  const W = 1200, H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(W, H)}
  <rect x="72" y="86" width="10" height="10" fill="${BLUE}"/>
  <text x="94" y="96" font-family="${MONO}" font-size="17" font-weight="700" letter-spacing="3" fill="${BLUE}">${eyebrow}</text>
  <text font-family="${FONT}" font-size="64" font-weight="600" letter-spacing="-2" fill="#fff">
    ${lines.map((l, i) => `<tspan x="68" y="${200 + i * 76}">${l}${i === lines.length - 1 && accent ? ` <tspan fill="${BLUE}">${accent}</tspan>` : ""}</tspan>`).join("")}
  </text>
  <text x="72" y="${200 + lines.length * 76 + 20}" font-family="${FONT}" font-size="25" fill="rgba(255,255,255,0.6)">${sub}</text>
  <g>${map(760, 170, 360, 300, 0.75)}</g>
  <text x="72" y="566" font-family="${MONO}" font-size="18" letter-spacing="3" fill="rgba(255,255,255,0.45)">OXDIJITAL.COM</text>
</svg>`;
}

async function write(svg, out, format) {
  const img = sharp(Buffer.from(svg));
  await (format === "webp" ? img.webp({ quality: 86 }) : img.png({ compressionLevel: 9 })).toFile(out);
  console.log("wrote", out);
}

mkdirSync(join(ROOT, "public/images/blog"), { recursive: true });
mkdirSync(join(ROOT, "public/images/og"), { recursive: true });
await write(cover(), join(ROOT, "public/images/blog/balikesir-web-sitesi-fiyatlari-2026.webp"), "webp");
await write(
  og({ eyebrow: "OX DİJİTAL · REHBER", lines: ["Balıkesir web sitesi", "fiyatları"], accent: "2026", sub: "Kurumsal site, e-ticaret, hosting, SEO ve bakım" }),
  join(ROOT, "public/images/og/balikesir-web-sitesi-fiyatlari-2026.png"),
  "png",
);
await write(
  og({ eyebrow: "BALIKESİR WEB TASARIM HİZMETLERİ", lines: ["Balıkesir web sitesi", "ve web"], accent: "tasarım", sub: "Modern, mobil uyumlu, SEO altyapısı güçlü siteler" }),
  join(ROOT, "public/images/og/balikesir-web-sitesi.png"),
  "png",
);
