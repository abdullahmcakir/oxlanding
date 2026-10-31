"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LostPixel } from "./lost-pixel";

// 404: iletişim sayfasıyla aynı koyu zemin. Ortada piksel "404" (bir pikseli düşmüş), altında kısa bir açıklama,
// "ox" yazarak (dokunmatikte butonla) ana sayfaya dönüş. Pikseli yerine koyan, küçük bir şaka görür.

const SECRET = "ox";

/** Klavyeden "OX" yazınca ana sayfaya döner. Kaç harfin doğru yazıldığını döndürür (tuş göstergesi için). */
function useTypeHome() {
  const router = useRouter();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let progress = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea, [contenteditable]")) return;
      const key = e.key.toLocaleLowerCase("tr");
      // Yanlış harf diziyi sıfırlar; yanlış harf "o" ise yeni bir başlangıç sayılır
      progress = key === SECRET[progress] ? progress + 1 : key === SECRET[0] ? 1 : 0;
      setTyped(progress);
      if (progress === SECRET.length) {
        window.removeEventListener("keydown", onKey);
        // Kısa bir an iki tuş da yeşil kalsın, sonra dön
        timer = setTimeout(() => router.push("/"), 450);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [router]);

  return typed;
}

export function NotFoundView() {
  const [restored, setRestored] = useState(false);
  const typed = useTypeHome();

  return (
    <section
      data-dock="hide"
      className="flex min-h-[100svh] flex-col items-center justify-center bg-[#070707] px-4 pb-16 pt-[120px] text-center [--c:clamp(12px,min(2.6vw,4.4svh),40px)] md:px-[4.5vw]"
    >
      <LostPixel onRestore={() => setRestored(true)} />

      {/* Düşen piksel bu boşluğa iner */}
      <div className="mt-[calc(var(--c)*3.4)]">
        <p className="h-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={restored ? "fixed" : "lost"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {restored ? "Piksel yerinde. Sayfa hâlâ yok." : "Hata 404 · Sayfa bulunamadı"}
            </motion.span>
          </AnimatePresence>
        </p>
        <h1 className="mt-5 text-[clamp(38px,4.4vw,72px)] font-medium leading-[1.04] tracking-[-0.05em] text-white">
          404… ama panik yok.
        </h1>

        {/* oxdijital.com'daki 404'ün esprisi: klavyeden "ox" yazınca ana sayfa. Tuşlar yazdıkça yeşil yanar. */}
        <div className="hidden [@media(pointer:fine)]:block">
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[clamp(17px,1.3vw,21px)] text-white/80">
            Klavyeden
            <span className="flex gap-1.5">
              {SECRET.split("").map((ch, i) => (
                <kbd
                  key={ch}
                  className={`grid size-9 place-items-center rounded-[9px] font-mono text-[14px] font-bold uppercase transition-colors duration-200 ${
                    i < typed ? "bg-accent text-[#111]" : "bg-white/[0.06] text-white ring-1 ring-white/15"
                  }`}
                >
                  {ch}
                </kbd>
              ))}
            </span>
            yazınca her şey normale döner.
          </p>
          <p className="mt-4 text-[15px] text-white/45">
            <Link href="/" className="text-accent underline-offset-4 hover:underline">
              Tıklamak
            </Link>{" "}
            da bir yöntem ama pek cool değil..
          </p>
        </div>

        {/* Dokunmatikte klavye yok: düz buton */}
        <div className="mt-8 [@media(pointer:fine)]:hidden">
          <Link href="/" className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-[#111]">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </section>
  );
}
