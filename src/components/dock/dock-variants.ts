import { talepUrl, whatsappUrl } from "@/lib/links";
import type { DockTool } from "./dock-tools";
import type { Glyph } from "./pixel-matrix";

// Sağ alttaki asistanın (OX Piksel) mesajları. Bölümler `data-dock="<anahtar>"` ile hangi mesajı istediğini söyler;
// işaretsiz yerlerde sayfanın varsayılanı ("iletisim" ya da sayfaya özel preset) görünür.
// Kural: tek cümle, birinci tekil şahıs (karakter konuşur; reklam değil yardım teklifi), en fazla iki eylem.
// Eylemler yalnızca ilgilenene görünür (hover / dokunma), varsayılan hâlde sadece piksel yüz + cümle var.
// Israr etmesin diye: çoğu bölümde eylem yerine bir araç (dock-tools.tsx) sunar; önce fayda, görüşme sonra.
// Ana eylem hep OX Panel'deki ücretsiz online görüşme. Hemen soru sormak isteyene iki rahat yol: "Bana sor"
// (asistan; yazılı öncelikli, ses isteğe bağlı) ve bir insanla konuşmak isteyene WhatsApp.
// Kanallar çok, gelen kutusu tek: hedef hepsinin OX Panel'e düşmesi (lib/links.ts, lib/assistant.ts).

export type DockAction =
  | { label: string; href: string; external?: boolean }
  | { label: string; assistant: string }; // asistanı bu konu için açar (lib/assistant.ts)

export type DockMessage = {
  /** Piksel yüzün şekli: bölümün konusunu bir bakışta söyler */
  glyph: Glyph;
  line: string;
  /** Sesli asistan eylemi: hover'da yüz ses dalgasına döner */
  live?: boolean;
  primary: DockAction;
  secondary?: DockAction;
  /** Varsa eylemler yerine bu araç açılır (eylemler araç içinde, sonuçtan sonra) */
  tool?: DockTool;
};

const MEETING: DockAction = { label: "Ücretsiz görüşme", href: talepUrl() };
const WHATSAPP: DockAction = {
  label: "WhatsApp",
  href: whatsappUrl("Merhaba, bir sorum var."),
  external: true,
};

export const DOCK_MESSAGES = {
  // İşaretsiz bölümlerin varsayılanı
  iletisim: {
    glyph: "smile",
    line: "Aklında bir proje mi var? Konuşalım.",
    primary: MEETING,
    secondary: WHATSAPP,
  },
  hizmetler: {
    glyph: "magnifier",
    line: "Siten ne kadar hızlı? Adresini yaz, ölçeyim.",
    primary: MEETING,
    tool: "speed",
  },
  paketler: {
    glyph: "diamond",
    line: "2 soruda sana uygun paketi bulalım.",
    primary: MEETING,
    tool: "quiz",
  },
  calismalar: {
    glyph: "frame",
    line: "Sektörünü seç, sana en yakın işi göstereyim.",
    primary: MEETING,
    tool: "sector",
  },
  surec: {
    glyph: "arrow",
    line: "Ne kadar sürer? İşini seç, söyleyeyim.",
    primary: MEETING,
    tool: "timeline",
  },
  sss: {
    glyph: "question",
    line: "Cevabını bulamadın mı? Bana sor.",
    live: true,
    primary: { label: "Bana sor", assistant: "sık sorulan sorular" },
    secondary: WHATSAPP,
  },
} satisfies Record<string, DockMessage>;

export type DockKey = keyof typeof DOCK_MESSAGES;

/** Sayfanın kendine özel varsayılanı (işaretsiz bölümlerde görünür). */
export type DockPresetValue =
  | {
      kind: "work";
      index: number;
      total: number;
      prev: { href: string; title: string };
      next: { href: string; title: string };
    }
  // Blog yazısı: okuma arkadaşı. İlerleme ve bölüm `data-article` / `data-article-section` işaretlerinden okunur.
  | { kind: "article"; minutes: number };

/** Asistanın cam yüzeyi (çerez sorusu da aynı yüzeyi kullanır) */
export const GLASS =
  "bg-[#141414]/90 text-white shadow-[0_20px_60px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-[15px]";
