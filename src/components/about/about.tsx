"use client";

import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import { SERVICES } from "@/components/services/services-data";
import { PlanCard, ServicesCard, StatCard } from "./about-cards";
import { HoverHeadline } from "./hover-headline";

// Metin yer tutucu.
const SUBTEXT =
  "İster yeni bir marka kuruyor olun ister mevcut işinizi büyütmek isteyin; web sitesi, reklam, tasarım ve yazılım ihtiyaçlarınızda yanınızdayız.";

// Kayan şeritteki kutular: hepsi aynı ölçüde.
// Sıra değiştirmek / kutu eklemek için aşağıdaki listeyi düzenle.
const BOX = "h-[380px] w-[280px] shrink-0";

export function About() {
  return (
    // -mt-12 + yuvarlak üst köşeler: hero'nun üstüne binen bir sayfa gibi (hero 48px uzatıldı).
    // Köşe yarıçapı binme miktarından büyük olmamalı, yoksa köşelerin dışında beyaz kertik görünür.
    <section
      id="hakkimizda"
      className="relative z-10 -mt-12 rounded-t-[48px] bg-background py-28 md:py-36"
    >
      <div className="relative px-4 text-center md:px-[4.5vw]">
        {/* Başlığın arkasında çok silik nokta ızgarası; kenarlara doğru kaybolur.
            Metin bloğuna bağlı: alttaki kayan kutulara taşmaz. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-10 -top-20 bg-[radial-gradient(#b5b5b5_1.2px,transparent_1.2px)] [background-size:22px_22px]"
          style={{
            maskImage: "radial-gradient(ellipse 45% 55% at 50% 50%, #000 0%, transparent 100%)",
          }}
        />

        {/* Başlık: anahtar kelimelerin üstüne gelince yanlarda öğeler belirir */}
        <HoverHeadline className="text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.12] tracking-[-0.045em] text-[#111]" />
        <p className="relative mx-auto mt-10 max-w-[640px] text-[clamp(16px,1.05vw,19px)] leading-[1.6] tracking-[-0.01em] text-[#222]">
          {SUBTEXT}
        </p>
      </div>

      {/* Krestin hero'sundaki kayan kutular: kenardan kenara */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16"
      >
        <Marquee>
          <ServicesCard className={BOX} />
          <StatCard value="Tek çatı" label="Reklam, tasarım ve yazılım aynı ekipte." tone="dark" className={BOX} />
          <PlanCard className={BOX} />
          <StatCard value="Ücretsiz" label="İlk görüşme ücretsiz, bağlayıcı değil." tone="outline" className={BOX} />
          <StatCard value="Tek panel" label="Projelerini, taleplerini ve devam eden işleri tek yerden takip et." className={BOX} />
          <StatCard value={`${SERVICES.length} hizmet`} label="Website'tan SEO'ya, tek ekipten." tone="dark" className={BOX} />
          <StatCard value="QR menü" label="Mekanda ile menün, konumun ve duyuruların tek yerde." tone="outline" className={BOX} />
          <StatCard value="Mobil uyumlu" label="Özel arayüz, SEO uyumlu teknik altyapı." className={BOX} />
        </Marquee>
      </motion.div>
    </section>
  );
}
