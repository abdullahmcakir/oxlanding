"use client"; // Hata sınırları client bileşeni olmak zorunda

import { useEffect } from "react";

// Kök layout'un kendisi hata verirse bu dosya onun yerine geçer: kendi <html>/<body>'sini kurar,
// globals.css ve fontlar yüklenmez. Bu yüzden stiller satır içi ve sistem fontuyla; renkler sitedeki koyu 404 ile aynı.
// metadata desteklenmez, başlık React'in <title> bileşeniyle verilir.

const ACCENT = "#2f6bff";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          textAlign: "center",
          background: "#070707",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <title>Bir şeyler ters gitti · OX Dijital</title>
        <h1 style={{ margin: 0, fontSize: "clamp(34px, 4.4vw, 64px)", fontWeight: 500, letterSpacing: "-0.04em" }}>
          Bir şeyler ters gitti.
        </h1>
        <p style={{ marginTop: 20, maxWidth: "44ch", fontSize: 17, lineHeight: 1.5, color: "rgb(255 255 255 / 0.6)" }}>
          Sayfa yüklenirken bir sorun oluştu. Tekrar denemek çoğu zaman yeterli olur.
        </p>
        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 500,
              background: ACCENT,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
          {/* Kök layout çalışmıyor: istemci yönlendiricisi yerine tam sayfa yüklemesi */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              textDecoration: "none",
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.2)",
            }}
          >
            Ana sayfaya dön
          </a>
        </div>
      </body>
    </html>
  );
}
