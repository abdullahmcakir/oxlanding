"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";

// Düzen referansı: "Helping teams transform…" CTA'sı (portre kemeri).
// Portreler yerine kendi işlerimizin görselleri; ekip fotoğrafları gelince IMAGES listesi değişir.
// Sitede #iletisim'e giden tüm butonlar buraya iner.

const IMAGES = [
  "/images/services/website.webp",
  "/images/services/branding.png",
  "/images/solutions/girisim.webp",
  "/images/services/sosyal-medya.png",
  "/images/services/otomasyon.png",
  "/images/solutions/kobi.webp",
  "/images/services/e-ticaret.png",
  "/images/services/seo.jpg",
  "/images/solutions/kurumsal.webp",
  "/images/services/mekanda.png",
];

// Kemer: kolon başına görsel sayısı ve dikey kayma (görsel yüksekliğinin oranı).
// Kenarlar iki görselli ve aşağıda, orta kolonlar tek görselli: ortada içerik için boşluk kalır.
const COLUMNS = [
  { n: 2, offset: 0.4 },
  { n: 2, offset: 0 },
  { n: 1, offset: 0.4 },
  { n: 1, offset: 0 },
  { n: 1, offset: 0.4 },
  { n: 1, offset: 0 },
  { n: 1, offset: 0.4 },
  { n: 2, offset: 0 },
  { n: 2, offset: 0.4 },
];

export function Cta() {
  let imageIndex = 0;
  const columns = COLUMNS.map((col) => ({
    ...col,
    images: Array.from({ length: col.n }, () => IMAGES[imageIndex++ % IMAGES.length]),
  }));

  return (
    <section
      id="iletisim"
      // İletişim bölümünün kendisi: sağ alttaki asistan burada aynı şeyi tekrar etmesin
      data-dock="hide"
      className="relative overflow-hidden bg-background px-4 pb-14 pt-10 text-[#111] md:px-[4.5vw] md:pb-16"
      // Görsel boyutu: 9 kolon + 8 aralık (12px) içeriğin genişliğine sığar
      style={{ ["--tw" as string]: "calc((100vw - 9vw - 96px) / 9)", ["--th" as string]: "calc(var(--tw) * 1.316)" }}
    >
      {/* Kemer (masaüstü) */}
      <div aria-hidden className="hidden gap-3 lg:grid lg:grid-cols-9">
        {columns.map((col, c) => (
          <div key={c} className="flex flex-col gap-3" style={{ marginTop: `calc(var(--th) * ${col.offset})` }}>
            {col.images.map((src, r) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                // Ortadan kenarlara doğru sırayla yerine oturur
                transition={{ duration: 0.9, delay: Math.abs(c - 4) * 0.07 + r * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[190/250] overflow-hidden rounded-[20px] bg-[#F1F1F1]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={85}
                  sizes="(min-width: 1024px) 18vw, 0px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.06]"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* İçerik: kemerin ortasındaki boşluğa oturur. Akışta kalır (bölüm içeriğe göre uzasın);
          kemer 2.4×görsel yüksekliğinde, içerik orta kolonların altından (1.4×) başlasın diye yukarı çekilir. */}
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center lg:mt-[calc(var(--th)*-1+108px)]">
        {/* Silik nokta dokusu (About başlığındakiyle aynı) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-40 -inset-y-24 bg-[radial-gradient(#b5b5b5_1.2px,transparent_1.2px)] [background-size:22px_22px]"
          style={{ maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 0%, transparent 100%)" }}
        />

        <p className="relative font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
          Birlikte çalışalım
        </p>
        <h2 className="relative mt-6 text-[clamp(36px,3.6vw,64px)] font-medium leading-[1.08] tracking-[-0.045em]">
          <span className="text-[#A3A3A3]">Fikrin hazırsa,</span>
          <br />
          gerisini birlikte kuralım.
        </h2>
        <p className="relative mt-6 max-w-[520px] text-[clamp(15px,1.05vw,18px)] leading-[1.6] text-neutral-500">
          Markanın hangi aşamada olduğunu anlat; sana uygun yol haritasını birlikte çıkaralım.
        </p>

        <a href={talepUrl({ konu: "proje" })} className="group relative mt-10 flex items-center gap-1.5">
          <span className="flex h-12 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white">
            Projeni başlat
          </span>
          <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-black" />
          </span>
        </a>
      </div>

    </section>
  );
}
