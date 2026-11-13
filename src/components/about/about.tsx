"use client";

import { motion } from "motion/react";
import { Marquee } from "@/components/ui/marquee";
import { SERVICES } from "@/components/services/services-data";
import { BubbleCard, CollabCard, FlowCard, PhotoCard, PlanCard, ServicesCard, StatCard, StatusCard } from "./about-cards";
import { AccessCard, SyncCard, TeamCard } from "./about-cards-dark";
import { HoverHeadline } from "./hover-headline";

// Metin yer tutucu.
const SUBTEXT =
  "İster yeni bir marka kuruyor olun ister mevcut işinizi büyütmek isteyin; web sitesi, reklam, tasarım ve yazılım ihtiyaçlarınızda yanınızdayız.";

// Kayan şeritteki kutular: hepsi aynı ölçüde.
// Sıra değiştirmek / kutu eklemek için aşağıdaki listeyi düzenle.
const BOX = "h-[380px] w-[280px] shrink-0";

// Kutu renkleri (deneme): sıra = şeritteki kutular (fotoğraflı kutu hariç). Denemek için PALETTE'i değiştir.
// Hizmetler, Şeffaflık ve Önce plan kutularında yazı koyu: bu üç sıraya açık renk ver.
const PALETTES = {
  pastel: ["#EAF0FF", "#EEE8FC", "#1A1A1A", "#F0FADB", "#2f6bff", "#FBEFF5", "#1A1A1A", "#EEE8FC", "#EAF0FF"],
  mavi: ["#EEF3FF", "#DCE6FF", "#0B1B3F", "#EEF3FF", "#2f6bff", "#DCE6FF", "#0B1B3F", "#EEF3FF", "#2f6bff"],
  canli: ["#C5F36A", "#C9B8F2", "#1A1A1A", "#F9A8D4", "#2f6bff", "#C5F36A", "#1A1A1A", "#C9B8F2", "#F9A8D4"],
  sicak: ["#F4EFE7", "#EDE6DA", "#1A1A1A", "#F4EFE7", "#EDE6DA", "#F4EFE7", "#1A1A1A", "#EDE6DA", "#F4EFE7"],
} as const;
const PALETTE: keyof typeof PALETTES = "pastel";
const C = PALETTES[PALETTE];

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
          <PhotoCard
            image="/images/about/ai-sonuclar.webp"
            alt="Sıra hâlinde ilerleyen ok küplerinin arasında yönü değiştiren yeşil AI küpü"
            accent="AI"
            title="ile Güçlendirilmiş Sonuçlar"
            position="55% 50%"
            className={BOX}
          />
          <ServicesCard color={C[0]} className={BOX} />
          <StatusCard color={C[1]} className={BOX} />
          <FlowCard className={BOX} />
          <CollabCard className={BOX} />
          <BubbleCard
            image="/images/about/konus.webp"
            alt="Kafede kahvesini içerken dizüstü bilgisayarına bakan takım elbiseli bir adam"
            bubbles={[
              ["Sen anlat", "#C9B8F2", 22],
              ["Biz kuralım", "#C5F36A", 50],
            ]}
            position="60% 40%"
            className={BOX}
          />
          <SyncCard className={BOX} />
          <AccessCard className={BOX} />
          <TeamCard className={BOX} />
          <StatCard value="Tek çatı" label="Reklam, tasarım ve yazılım aynı ekipte." color={C[2]} className={BOX} />
          <PlanCard color={C[3]} className={BOX} />
          <StatCard value="Ücretsiz" label="İlk görüşme ücretsiz, bağlayıcı değil." color={C[4]} className={BOX} />
          <StatCard value="Tek panel" label="Projelerini, taleplerini ve devam eden işleri tek yerden takip et." color={C[5]} className={BOX} />
          <StatCard value={`${SERVICES.length} hizmet`} label="Website'tan SEO'ya, tek ekipten." color={C[6]} className={BOX} />
          <StatCard value="QR menü" label="Mekanda ile menün, konumun ve duyuruların tek yerde." color={C[7]} className={BOX} />
          <StatCard value="Mobil uyumlu" label="Özel arayüz, SEO uyumlu teknik altyapı." color={C[8]} className={BOX} />
        </Marquee>
      </motion.div>
    </section>
  );
}
