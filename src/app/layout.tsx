import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { CookieAsk } from "@/components/cookie/cookie-ask";
import { DockProvider } from "@/components/dock/dock";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SITE_URL, SOCIALS } from "@/lib/links";
import "./globals.css";

// opsz ekseni: büyük puntolarda tarayıcı otomatik olarak "Inter Display" kesimine geçer.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

// Sayfalar kendi başlık, açıklama ve canonical'ını verir; burası ana sayfanın ve ortak alanların varsayılanı.
// Açıklama şimdilik hakkımızda sayfasından; ana sayfa metinleri yazılınca güncellenecek.
const DESCRIPTION = "İstanbul merkezli dijital ajans. Reklam, tasarım ve yazılım tek çatı altında.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "OX Dijital",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Başlık ve açıklama verilmiyor: paylaşımlarda her sayfanın kendi <title> ve açıklaması kullanılsın.
  // Görsel app/opengraph-image.tsx'ten gelir.
  openGraph: { type: "website", siteName: "OX Dijital", locale: "tr_TR" },
  twitter: { card: "summary_large_image" },
  // Vercel yalnız demo (oxlanding.vercel.app); asıl site Dokploy'da. Demo, oxdijital.com'un kopyası olarak indekslenmesin.
  ...(process.env.VERCEL && { robots: { index: false, follow: false } }),
};

// Arama motorları için kurum bilgisi: ad, logo, iletişim ve sosyal hesaplar (sameAs) tek varlıkta birleşir.
// Adres ve vergi bilgileri gerçekleşince eklenebilir (about-data.ts COMPANY).
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OX Dijital",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: "merhaba@oxdijital.com",
  sameAs: SOCIALS.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
        />
        <SmoothScroll>
          {/* Sağ alttaki bağlama duyarlı asistan her sayfada; bölümler data-dock ile mesajını seçer */}
          <DockProvider>{children}</DockProvider>
          {/* Çerez sorusunu asistan sorar; analiz / pazarlama çerezleri yalnız onayla (cookie-consent.ts) */}
          <CookieAsk />
        </SmoothScroll>
      </body>
    </html>
  );
}
