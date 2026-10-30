import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { CookieAsk } from "@/components/cookie/cookie-ask";
import { DockProvider } from "@/components/dock/dock";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
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

export const metadata: Metadata = {
  title: "OX Dijital",
  description: "OX Dijital",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-full">
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
