"use client"; // Hata sınırları client bileşeni olmak zorunda

import { useEffect } from "react";
import Link from "next/link";

// Sayfa içinde beklenmeyen bir hata olursa: 404 ile aynı koyu, tek ekranlık görünüm.
// Menü bilerek yok: hata menünün kendisinden de gelmiş olabilir. Ziyaretçiye teknik ayrıntı gösterilmez;
// yayında sunucu hatalarının mesajı zaten gizlenir, eşleştirmek için yalnız digest konsola yazılır.

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      data-dock="hide"
      className="flex min-h-[100svh] flex-col items-center justify-center bg-[#070707] px-4 text-center md:px-[4.5vw]"
    >
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">Beklenmeyen hata</p>
      <h1 className="mt-5 text-[clamp(38px,4.4vw,72px)] font-medium leading-[1.04] tracking-[-0.05em] text-white">
        Bir şeyler ters gitti.
      </h1>
      <p className="mt-6 max-w-[44ch] text-[clamp(16px,1.2vw,19px)] leading-[1.5] text-white/60">
        Sayfa yüklenirken bir sorun oluştu. Tekrar denemek çoğu zaman yeterli olur.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-ink outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-[15px] font-medium text-white ring-1 ring-white/20 outline-none hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
