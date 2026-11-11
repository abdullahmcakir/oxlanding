"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { talepUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import "./showroom-hero.css";

// Scoped names keep this variant isolated with the project's Tailwind CSS loader.
const styles = {
  hero: "ox-vitrin-hero",
  headingLine: "ox-vitrin-headingLine",
  layout: "ox-vitrin-layout",
  copy: "ox-vitrin-copy",
  title: "ox-vitrin-title",
  titleLine: "ox-vitrin-titleLine",
  titleArrow: "ox-vitrin-titleArrow",
  diagonal: "ox-vitrin-diagonal",
  description: "ox-vitrin-description",
  actions: "ox-vitrin-actions",
  primary: "ox-vitrin-primary",
  secondary: "ox-vitrin-secondary",
  promise: "ox-vitrin-promise",
  promiseMark: "ox-vitrin-promiseMark",
  showcase: "ox-vitrin-showcase",
  showcaseLabel: "ox-vitrin-showcaseLabel",
  artboard: "ox-vitrin-artboard",
  orbit: "ox-vitrin-orbit",
  deck: "ox-vitrin-deck",
  sheet: "ox-vitrin-sheet",
  stamp: "ox-vitrin-stamp",
  conceptTag: "ox-vitrin-conceptTag",
  controls: "ox-vitrin-controls",
  tabs: "ox-vitrin-tabs",
  tab: "ox-vitrin-tab",
  selected: "ox-vitrin-selected",
  detail: "ox-vitrin-detail",
  bottomLine: "ox-vitrin-bottomLine",
  coffeeMark: "ox-vitrin-coffeeMark",
  markDot: "ox-vitrin-markDot",
  brandArtwork: "ox-vitrin-brandArtwork",
  brandTop: "ox-vitrin-brandTop",
  brandPhoto: "ox-vitrin-brandPhoto",
  brandBottom: "ox-vitrin-brandBottom",
  brandAsterisk: "ox-vitrin-brandAsterisk",
  webArtwork: "ox-vitrin-webArtwork",
  browserBar: "ox-vitrin-browserBar",
  webNav: "ox-vitrin-webNav",
  webContent: "ox-vitrin-webContent",
  webCopy: "ox-vitrin-webCopy",
  webLink: "ox-vitrin-webLink",
  webPhoto: "ox-vitrin-webPhoto",
  webFooter: "ox-vitrin-webFooter",
  campaignArtwork: "ox-vitrin-campaignArtwork",
  campaignPoster: "ox-vitrin-campaignPoster",
  campaignPhoto: "ox-vitrin-campaignPhoto",
  campaignTag: "ox-vitrin-campaignTag",
  desktopBreak: "ox-vitrin-desktopBreak",
};

const DIRECTIONS = [
  { label: "Marka", title: "İlk bakışta bir karakter.", text: "Logodan ambalaja, her yerde aynı güçlü kimlik.", href: "/hizmetler/branding", action: "Marka tasarımını keşfet" },
  { label: "Website", title: "Bir vitrinden daha fazlası.", text: "Güzel görünen, kolay kullanılan, işinize çalışan websiteler.", href: "/hizmetler/website", action: "Web tasarımını keşfet" },
  { label: "Kampanya", title: "Görülmeye değer bir hikâye.", text: "Markanızın sesini doğru insanlara taşıyan içerikler.", href: "/hizmetler/sosyal-medya", action: "Sosyal medyayı keşfet" },
] as const;
const EASE = [.22, 1, .36, 1] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? styles.diagonal : undefined}><path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CoffeeMark({ className }: { className?: string }) {
  return <span className={cn(styles.coffeeMark, className)}>ox<span>coffee</span><span className={styles.markDot}>®</span></span>;
}

function BrandArtwork() {
  return <div className={styles.brandArtwork}>
    <div className={styles.brandTop}><span>IDENTITY / 01</span><span>FRESHLY CRAFTED.</span></div>
    <div className={styles.brandPhoto}><Image src="/images/services/branding.png" alt="OX Coffee için kırmızı ve beyaz bardaklarla marka kimliği konsepti" fill sizes="(max-width: 700px) 85vw, 560px" preload /></div>
    <div className={styles.brandBottom}><CoffeeMark /><span>İyi bir gün,<br />iyi bir kahve.</span><span className={styles.brandAsterisk}>✳</span></div>
  </div>;
}

function WebArtwork() {
  return <div className={styles.webArtwork}>
    <div className={styles.browserBar}><span><i /><i /><i /></span><span>ox coffee / dijital deneyim</span><span>↗</span></div>
    <div className={styles.webNav}><CoffeeMark /><span>Hikâyemiz&nbsp;&nbsp; · &nbsp;&nbsp;Kahveler&nbsp;&nbsp; · &nbsp;&nbsp;Bize uğra</span></div>
    <div className={styles.webContent}>
      <div className={styles.webCopy}><span>GÜNÜN EN İYİ MOLASI.</span><p>Bir kahve.<br />Bin güzel<br /><em>başlangıç.</em></p><span className={styles.webLink}>Kahveni keşfet <Arrow /></span></div>
      <div className={styles.webPhoto}><Image src="/images/services/branding.png" alt="OX Coffee website konseptinde bardak tasarımı" fill sizes="(max-width: 700px) 40vw, 300px" /><span>Biraz yavaşla.<br />Tadını çıkar.</span></div>
    </div>
    <div className={styles.webFooter}><span>Özenle seçildi. Taze kavruldu.</span><span>Senin için hazır. ↗</span></div>
  </div>;
}

function CampaignArtwork() {
  return <div className={styles.campaignArtwork}>
    <div className={styles.campaignPoster}><CoffeeMark /><p>Bugün<br />bir mola<br /><em>ver.</em></p><span>HER GÜZEL FİKRİN BİR MOLASI VAR.</span><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M15 20v32c0 35 48 35 48 0V20H15ZM64 25h7c28 0 28 33-6 33M12 84h60" fill="none" stroke="currentColor" strokeWidth="4" /></svg></div>
    <div className={styles.campaignPhoto}><Image src="/images/services/branding.png" alt="OX Coffee sosyal medya kampanya konsepti" fill sizes="(max-width: 700px) 45vw, 320px" /><div><span>GOOD COFFEE.<br />GOOD COMPANY.</span><CoffeeMark /></div></div>
    <span className={styles.campaignTag}>Sosyalde karşılaşalım. ↗</span>
  </div>;
}

const ARTWORKS = [BrandArtwork, WebArtwork, CampaignArtwork];

export function ShowroomHero() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 95, damping: 24 });
  const rotateY = useSpring(x, { stiffness: 95, damping: 24 });
  const direction = DIRECTIONS[active];

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % DIRECTIONS.length;
    else if (event.key === "ArrowLeft") next = (index + DIRECTIONS.length - 1) % DIRECTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = DIRECTIONS.length - 1;
    else return;
    event.preventDefault(); setActive(next); tabRefs.current[next]?.focus();
  };

  return <div className={styles.hero}>
    <div className={styles.headingLine}><span>OX DİJİTAL — YARATICI DİJİTAL AJANS</span><span>İSTANBUL / TÜRKİYE GENELİ</span></div>
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h1 className={styles.title}>
          {["İşiniz iyi.", "Şimdi herkes", "görsün."].map((line, i) => <span key={line} className={styles.titleLine}><motion.span initial={reduced ? false : { y: "110%" }} animate={{ y: "0%" }} transition={{ duration: .95, delay: .1 + i * .12, ease: EASE }}>{line}{i === 2 && <span className={styles.titleArrow}><Arrow diagonal /></span>}</motion.span></span>)}
        </h1>
        <p className={styles.description}>İşinizin değerini görünür kılan markalar,<br className={styles.desktopBreak} /> websiteler ve dijital kampanyalar tasarlıyoruz.<br className={styles.desktopBreak} /> Fikirden yayına, aynı ekiple.</p>
        <div className={styles.actions}><a className={styles.primary} href={talepUrl()}>Birlikte başlayalım <span><Arrow diagonal /></span></a><a className={styles.secondary} href="#hizmetler">Neler yapıyoruz? <Arrow /></a></div>
        <div className={styles.promise}><span className={styles.promiseMark}>↳</span><p>İyi tasarım dikkat çeker.<br /><strong>Doğru kurgu, işe dönüştürür.</strong></p></div>
      </div>

      <div className={styles.showcase}>
        <div className={styles.showcaseLabel}><span><i /> BİR MARKA, BÜTÜN BİR DÜNYA.</span><span>01 — 03</span></div>
        <div className={styles.artboard}
          onPointerMove={event => { if (reduced || event.pointerType !== "mouse") return; const rect = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX - rect.left) / rect.width - .5) * 6); y.set(-((event.clientY - rect.top) / rect.height - .5) * 4); }}
          onPointerLeave={() => { x.set(0); y.set(0); }}>
          <span className={styles.orbit} aria-hidden />
          <motion.div className={styles.deck} style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
            {ARTWORKS.map((Artwork, index) => {
              const rank = (index - active + ARTWORKS.length) % ARTWORKS.length;
              return <motion.div key={index} className={styles.sheet} aria-hidden={index !== active}
                initial={reduced ? false : { y: 70, opacity: 0, rotate: 0 }}
                animate={{ x: rank === 0 ? "-2%" : rank === 1 ? "5%" : "9%", y: rank === 0 ? "8%" : rank === 1 ? "0%" : "-5%", rotate: rank === 0 ? -7 : rank === 1 ? 4 : 10, opacity: 1, scale: rank === 0 ? 1 : rank === 1 ? .97 : .94 }}
                transition={{ duration: reduced ? 0 : .85, ease: EASE }} style={{ zIndex: 3 - rank }}>
                <Artwork />
              </motion.div>;
            })}
          </motion.div>
          <span className={styles.stamp} aria-hidden><span>FİKİRDEN<br />HAYATA.</span><Arrow diagonal /></span>
          <div className={styles.conceptTag}><span>OX Coffee</span><span>Konsept çalışma ↗</span></div>
        </div>

        <div className={styles.controls}>
          <div role="tablist" aria-label="Tasarım disiplinini keşfet" className={styles.tabs}>
            {DIRECTIONS.map((item, index) => <button type="button" role="tab" key={item.label} id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} ref={element => { tabRefs.current[index] = element; }} onKeyDown={event => handleKey(event, index)} onClick={() => setActive(index)} className={cn(styles.tab, active === index && styles.selected)}><span>0{index + 1}</span>{item.label}<Arrow diagonal /></button>)}
          </div>
          <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className={styles.detail}>
            <div><p>{direction.title}</p><span>{direction.text}</span></div><Link href={direction.href} aria-label={direction.action}><Arrow diagonal /></Link>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.bottomLine}><span>Stratejiden tasarıma. Tasarımdan etkiye.</span><a href="#hakkimizda">Bizi tanıyın <span>↓</span></a></div>
  </div>;
}
