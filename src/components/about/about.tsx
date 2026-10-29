"use client";

import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import {
  ClientsCard,
  MultiplierCard,
  QuoteCard,
  RatingCard,
  RevenueCard,
  ServicesCard,
  SpeedCard,
  StatCard,
} from "./about-cards";
import { HoverHeadline } from "./hover-headline";

// Metin yer tutucu.
const SUBTEXT =
  "Strateji, yaratıcılık ve teknolojiyi bir araya getirerek markaların dijitalde daha görünür ve daha etkili olmasını sağlıyoruz.";

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
          <RevenueCard className={BOX} />
          <QuoteCard className={BOX} />
          <ClientsCard className={BOX} />
          <SpeedCard className={BOX} />
          <StatCard value="15+" label="Farklı sektörde deneyim." className={BOX} />
          <RatingCard className={BOX} />
          <MultiplierCard className={BOX} />
          <StatCard value="7/24" label="Kampanya takibi ve raporlama." tone="dark" className={BOX} />
          <StatCard value="%98" label="Müşteri memnuniyeti." tone="outline" className={BOX} />
        </Marquee>
      </motion.div>
    </section>
  );
}
