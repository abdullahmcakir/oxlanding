"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useLenis } from "lenis/react";
import { Reveal } from "@/components/about/about-cards";
import { SERVICES } from "@/components/services/services-data";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import {
  categoryOf,
  CLIENTS,
  FEED_COLUMNS,
  READING_ORDER,
  TESTIMONIALS,
  type FeedCard,
  type FeedFilter,
} from "./feed-data";
import { Badge, type BadgeKind } from "./feed-badge";
import { FeedFilters } from "./feed-filters";

// Referans: 3 sütunlu bento ızgara; her kartın sol üstünde nokta + tür etiketi, sağ üstünde
// parantez içinde mono etiket. Kart türleri karışık: görsel, metin, logo şeridi, yorum, daktilo.
// Referanstaki doygun mavinin yerine kendi paletimiz: siyah (#111) ve vurgu yeşili kartlar yan yana,
// kontrastı ikisi birlikte kuruyor. Köşeler navbar paneli kartlarıyla aynı (16px).

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const HEIGHT: Record<FeedCard["type"], string> = {
  image: "h-[480px] md:h-[620px]",
  post: "h-[320px] md:h-[370px]",
  testimonials: "h-[420px] md:h-[480px]",
  clients: "h-[230px]",
  services: "h-[230px]",
};

const JUMP_KEY = "ox-feed-jump";

const heightOf = (card: FeedCard) => (card.type === "image" && card.short ? HEIGHT.post : HEIGHT[card.type]);

const COUNTS: Record<FeedFilter, number> = {
  tumu: READING_ORDER.filter((c) => categoryOf(c)).length,
  calisma: READING_ORDER.filter((c) => categoryOf(c) === "calisma").length,
  blog: READING_ORDER.filter((c) => categoryOf(c) === "blog").length,
};

/** Filtre sayfadan gelir: her filtre ayrı bir rota (/calismalar, /calismalar/projeler, /blog). */
export function FeedGrid({ id, filter }: { id: string; filter: FeedFilter }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Sekmeyle başka filtreye geçilince yeni sayfa ızgaranın başında açılır (kısa listede boşluğa bakakalınmasın).
  // Kaydırma tıklama anında değil, yeni sayfa açıldıktan sonra ve animasyonsuz yapılır: geçiş sırasında sayfa
  // yüksekliği değiştiği için yumuşak kaydırma eski hedefe gidip yanlış yerde (ör. footer'da) duruyordu.
  const markJump = () => {
    try {
      sessionStorage.setItem(JUMP_KEY, "1");
    } catch {}
  };

  useEffect(() => {
    let jump = false;
    try {
      jump = sessionStorage.getItem(JUMP_KEY) === "1";
      sessionStorage.removeItem(JUMP_KEY);
    } catch {}
    const el = sectionRef.current;
    if (!jump || !el || !lenis) return;
    lenis.scrollTo(el, { offset: -40, immediate: true });
  }, [lenis]);

  return (
    <section ref={sectionRef} id={id} data-dock="calismalar" className="scroll-mt-20 bg-background px-3 pb-16 pt-10 md:px-5 md:pb-[100px] md:pt-14">
      {/* Navbar'ın hemen altında yapışık kalır */}
      <div className="sticky top-[84px] z-20 mb-8 flex justify-center md:mb-10">
        <FeedFilters value={filter} counts={COUNTS} onNavigate={markJump} />
      </div>

      <div aria-live="polite">
        {filter === "tumu" ? (
          // Elle dengelenmiş bento: her sütunun toplam yüksekliği eşit
          <div className="flex flex-col gap-4 md:flex-row">
            {FEED_COLUMNS.map((column, c) => (
              <div key={c} className="flex min-w-0 flex-1 flex-col gap-4">
                {column.map((card, i) => (
                  <Reveal key={i} index={c} className={heightOf(card)}>
                    <Card card={card} />
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Tek türde bento dengesiz kalıyor: eşit yükseklikte düz ızgara
          <div key={filter} className="grid gap-4 md:grid-cols-3">
            {READING_ORDER.filter((card) => categoryOf(card) === filter).map((card, i) => (
              <Reveal key={i} index={i % 3} className="h-[420px] md:h-[520px]">
                <Card card={card} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ card }: { card: FeedCard }) {
  switch (card.type) {
    case "image":
      return <ImageCard {...card} />;
    case "post":
      return <PostCard {...card} />;
    case "clients":
      return <ClientsCard />;
    case "testimonials":
      return <TestimonialsCard />;
    case "services":
      return <ServicesCard />;
  }
}

type Tone = "light" | "dark" | "accent";

const TONE: Record<Tone, string> = {
  light: "bg-[#F5F5F5] text-[#111]",
  dark: "bg-[#111] text-white",
  accent: "bg-accent text-black",
};

/** Ortak kart kabuğu: tam yükseklik, yuvarlak köşe, üstte rozet satırı. href varsa link olur. */
function Shell({
  tone,
  badge,
  tag,
  href,
  className,
  children,
}: {
  tone: Tone;
  badge: BadgeKind;
  tag?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn("group relative block h-full overflow-hidden rounded-[16px]", TONE[tone], className);
  const content = (
    <>
      {children}
      <div className="pointer-events-none relative z-10 flex items-center justify-between gap-4 p-4">
        <Badge kind={badge} />
        {tag && (
          <span className={cn("font-mono text-[10px] uppercase", tone === "light" ? "text-neutral-500" : "opacity-70")}>
            ({tag})
          </span>
        )}
      </div>
    </>
  );

  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

function ImageCard({ label, tag, title, image, href }: Omit<Extract<FeedCard, { type: "image" }>, "type">) {
  return (
    <Shell tone="dark" badge={label === "Çalışma" ? "calisma" : "blog"} tag={tag} href={href}>
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:blur-[6px]"
      />
      {/* Etiket satırı açık görsellerde de okunsun */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/65 to-transparent" />
      <div className="absolute inset-0 grid place-items-center bg-black/0 p-8 transition-colors duration-500 group-hover:bg-black/30">
        <p className="translate-y-3 text-center text-[clamp(28px,2.6vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          {title}
        </p>
      </div>
    </Shell>
  );
}

function PostCard({ tag, title, meta, href }: Extract<FeedCard, { type: "post" }>) {
  return (
    <Shell tone="light" badge="blog" tag={tag} href={href}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center md:px-12">
        <p className="max-w-[22em] text-[clamp(18px,1.35vw,22px)] font-medium leading-[1.2] tracking-[-0.025em]">
          {title}
        </p>
        <p className="mt-3 text-[13px] tracking-[-0.01em] text-neutral-500">{meta}</p>
        <span className="mt-5 text-[14px] tracking-[-0.01em] underline-offset-4 group-hover:underline">
          Devamını oku
        </span>
      </div>
    </Shell>
  );
}

function ClientsCard() {
  return (
    <Shell tone="accent" badge="musteri" tag={String(CLIENTS.length).padStart(2, "0")}>
      <div className="absolute inset-0 flex items-center">
        <Marquee speed={36} className="w-full">
          {CLIENTS.map((name) => (
            <span key={name} className="whitespace-nowrap px-5 text-[clamp(22px,1.8vw,30px)] font-semibold tracking-[-0.04em]">
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </Shell>
  );
}

const SLIDE_MS = 4500;

function TestimonialsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, inView, paused]);

  const item = TESTIMONIALS[index];

  return (
    <Shell tone="dark" badge="yorum" tag={`${index + 1}/${TESTIMONIALS.length}`}>
      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-8 pb-10 md:px-10"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.figure
            key={index}
            initial={{ x: "70%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-70%", opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="text-center"
          >
            <span aria-hidden className="block text-[56px] leading-[0.6] text-accent">“</span>
            <blockquote className="mt-3 text-[clamp(17px,1.25vw,20px)] font-medium leading-[1.25] tracking-[-0.02em]">
              {item.quote}
            </blockquote>
            <figcaption className="mt-4 text-[13px] leading-[1.35]">
              {item.name}
              <span className="block text-white/50">{item.role}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="absolute bottom-5 flex gap-1 rounded-full bg-white/10 p-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}. yorum`}
              aria-current={i === index}
              className={cn("size-1.5 rounded-full transition-colors", i === index ? "bg-accent" : "bg-white/30")}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

// Daktilo: harf harf yazar, bekler, siler, sıradaki hizmete geçer.
const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1500;

function ServicesCard() {
  const [word, setWord] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const service = SERVICES[word];
  const full = service.title;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && chars < full.length) t = setTimeout(() => setChars(chars + 1), TYPE_MS);
    else if (!deleting) t = setTimeout(() => setDeleting(true), HOLD_MS);
    else if (chars > 0) t = setTimeout(() => setChars(chars - 1), DELETE_MS);
    else
      t = setTimeout(() => {
        setDeleting(false);
        setWord((w) => (w + 1) % SERVICES.length);
      }, TYPE_MS);
    return () => clearTimeout(t);
  }, [chars, deleting, full]);

  return (
    <Shell
      tone="accent"
      badge="hizmet"
      tag={String(SERVICES.length).padStart(2, "0")}
      href={`/hizmetler/${service.slug}`}
    >
      <div className="absolute inset-0 flex items-center justify-center px-6 pt-6">
        <p className="flex items-center text-[clamp(28px,2.4vw,40px)] font-medium tracking-[-0.04em]" aria-label={full}>
          {full.slice(0, chars)}.
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            className="ml-1 inline-block h-[1.1em] w-[2px] bg-current"
          />
        </p>
      </div>
    </Shell>
  );
}
