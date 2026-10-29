import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { Chevron, SplitHeading } from "@/components/ui/section-parts";

// TÜMÜ YER TUTUCU: başlıklar, özetler, tarihler ve görseller gerçek yazılarla değiştirilecek.
// İlk iki başlık navbar'daki Blog panelindekiyle aynı (mega-panels.tsx) — ikisi birlikte güncellenmeli.
const POSTS = [
  {
    title: "2026'da Meta reklamlarında işe yarayan 5 strateji",
    excerpt:
      "Algoritma değişti, maliyetler arttı. Reklam bütçesini boşa harcamadan dönüşüm getiren kampanya kurgularını derledik.",
    category: "Reklam",
    date: "14 Ekim 2026",
    read: "6 dk",
    image: "/images/services/sosyal-medya.png",
  },
  {
    title: "Landing page dönüşüm oranını artırmanın 7 yolu",
    category: "Tasarım",
    date: "7 Ekim 2026",
    read: "5 dk",
    image: "/images/services/website.webp",
  },
  {
    title: "Küçük işletmeler için SEO: ilk 90 günde ne yapmalı?",
    category: "SEO",
    date: "29 Eylül 2026",
    read: "8 dk",
    image: "/images/services/seo.jpg",
  },
  {
    title: "Tekrar eden işleri otomatiğe almanın en kolay 3 adımı",
    category: "Otomasyon",
    date: "18 Eylül 2026",
    read: "4 dk",
    image: "/images/services/otomasyon.png",
  },
];

// Başlığın altı hover'da soldan sağa çizilir
const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]";

function Meta({ category, date, read }: { category: string; date: string; read: string }) {
  return (
    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
      <span className="text-[#111]">{category}</span> · {date} · {read}
    </p>
  );
}

export function Blog() {
  const [featured, ...rest] = POSTS;

  return (
    <section id="blog" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SplitHeading strong="Blog." soft="Reklam, tasarım ve yazılım üzerine sahadan notlar." />
        <Link
          href="#blog"
          className="group inline-flex h-12 shrink-0 items-center gap-3 self-start rounded-full bg-[#111] py-1.5 pl-5 pr-1.5 text-[14px] font-semibold tracking-[-0.02em] text-white md:self-auto"
        >
          Tüm yazılar
          <span className="grid size-9 place-items-center rounded-full bg-accent text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
            <Chevron />
          </span>
        </Link>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* Öne çıkan yazı */}
        <Reveal>
          <Link href="#blog" className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#F1F1F1]">
              <Image
                src={featured.image}
                alt=""
                fill
                quality={85}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111] backdrop-blur">
                Öne çıkan
              </span>
            </div>
            <div className="mt-6">
              <Meta category={featured.category} date={featured.date} read={featured.read} />
              <h3 className="mt-4 text-[clamp(26px,2.2vw,38px)] font-medium leading-[1.15] tracking-[-0.03em] text-[#111]">
                <span className={UNDERLINE}>{featured.title}</span>
              </h3>
              <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-neutral-500">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-[#111]">
                Yazıyı oku
                <span className="grid size-7 place-items-center rounded-[8px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  <PixelIcon variant="arrow" className="size-[8px]" cellClassName="fill-black" />
                </span>
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Son yazılar */}
        <ul className="flex flex-col">
          {rest.map((post, i) => (
            <li key={post.title} className="border-t border-neutral-200 first:border-t-0 lg:first:border-t">
              <Reveal index={i + 1}>
                <Link href="#blog" className="group grid grid-cols-[120px_1fr] items-center gap-5 py-6 md:grid-cols-[168px_1fr] md:gap-6">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#F1F1F1]">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      quality={85}
                      sizes="(min-width: 768px) 260px, 200px"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div>
                    <Meta category={post.category} date={post.date} read={post.read} />
                    <h3 className="mt-3 text-[clamp(17px,1.35vw,22px)] font-medium leading-[1.3] tracking-[-0.02em] text-[#111]">
                      <span className={UNDERLINE}>{post.title}</span>
                    </h3>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
