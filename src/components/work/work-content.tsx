import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/about/about-cards";
import { Badge } from "@/components/feed/feed-badge";
import { SERVICES } from "@/components/services/services-data";
import { cn } from "@/lib/utils";
import { CollabMark } from "./collab-mark";
import type { Work, WorkBlock } from "./work-data";

// Referans: portorocha.com proje içeriği. 8px aralıklı koyu paneller; bizde altı bölüm
// (id'leri kenar çubuğundaki içindekilerle aynı): genel bakış, problem/çözüm, süreç, sonuçlar,
// tasarım dili, müşteri yorumu. Büyük anlatım panelleri ile küçük ve yazı yoğun kartlar dönüşümlü;
// renk ritmi: koyu paneller, yeşil vurgu kartları, proje renginde kartlar.

const PANEL = "rounded-[16px] bg-[#171717] p-4 md:p-5";
const LABEL = "text-[14px] text-white/50";
const STATEMENT = "text-[clamp(19px,1.55vw,24px)] leading-[1.18] tracking-[-0.01em] text-white";
const SECTION = "flex scroll-mt-[92px] flex-col gap-2";

export function WorkContent({ work }: { work: Work }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <section id="genel" className={SECTION}>
        {/* Hero bilerek ekranın altında bitiyor: yanındaki ve altındaki kartlar sayfanın devam ettiğini gösterir */}
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <Hero work={work} />
          <Reveal index={1} className={PANEL}>
            <Facts work={work} />
          </Reveal>
        </div>
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <Reveal className={PANEL}>
            <p className={LABEL}>Proje hakkında</p>
            <div className="mt-3 max-w-[64ch] space-y-3.5 text-[15px] leading-[1.45] tracking-[-0.005em] text-white/85">
              {work.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal index={1} className="rounded-[16px] bg-accent p-4 text-black md:p-5">
            <p className="text-[14px] text-black/60">Hedefler</p>
            <ol className="mt-3 space-y-3">
              {work.goals.map((g, i) => (
                <li key={g} className="flex gap-3 text-[16px] leading-[1.3] tracking-[-0.015em]">
                  <span className="pt-0.5 font-mono text-[11px] text-black/50">0{i + 1}</span>
                  {g}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="problem" className="grid scroll-mt-[92px] gap-2 md:grid-cols-2">
        <Reveal className={cn(PANEL, "md:min-h-[320px]")}>
          <p className={LABEL}>Problem</p>
          <p className={cn(STATEMENT, "mt-3 max-w-[30em]")}>{work.challenge}</p>
        </Reveal>
        <Reveal index={1} className={cn(PANEL, "md:min-h-[320px]")}>
          <p className={LABEL}>Çözüm</p>
          <p className="mt-3 text-[clamp(26px,2.2vw,36px)] font-medium leading-[1.08] tracking-[-0.035em] text-white">
            {work.solution.lead}
          </p>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.45] text-white/70">{work.solution.body}</p>
        </Reveal>
      </section>

      <section id="surec" className={SECTION}>
        <Reveal className={PANEL}>
          <div className="flex items-baseline justify-between gap-4">
            <p className={LABEL}>Süreç</p>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
              Toplam: <span className="text-white">{work.duration}</span>
            </p>
          </div>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {work.timeline.map((t, i) => (
              <li key={t.phase} className="border-t border-white/10 pt-4">
                <span className="relative -mt-[21px] mb-3 block size-2.5 rounded-full bg-accent" style={{ opacity: 1 - i * 0.18 }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">{t.weeks}</p>
                <p className="mt-1.5 text-[20px] font-medium tracking-[-0.025em] text-white">{t.phase}</p>
                <p className="mt-1.5 text-[14px] leading-[1.35] text-white/60">{t.desc}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <div className="grid gap-2 md:grid-cols-3">
          <Reveal className={PANEL}>
            <p className={LABEL}>Teslim edilenler</p>
            <ul className="mt-4 space-y-2.5">
              {work.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-[14px] leading-[1.35] text-white/85">
                  <span aria-hidden className="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} className={PANEL}>
            <p className={LABEL}>Araçlar</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {work.tools.map((t) => (
                <li key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] text-white/85">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={2} className={PANEL}>
            <p className={LABEL}>Ekip</p>
            <dl className="mt-4 space-y-2.5 text-[14px] leading-[1.3]">
              {work.credits.map((c) => (
                <div key={c.role} className="flex justify-between gap-4">
                  <dt className="text-white/50">{c.role}</dt>
                  <dd className="text-right text-white/85">{c.names.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section id="sonuclar" className="grid scroll-mt-[92px] grid-cols-2 gap-2 lg:grid-cols-4">
        {work.results.map((r, i) => (
          <Reveal
            key={r.label}
            index={i}
            className={cn(
              "flex min-h-[180px] flex-col justify-between gap-6 rounded-[16px] p-4 md:p-5",
              i === 0 ? "bg-accent text-black" : "bg-[#171717] text-white",
            )}
          >
            <p className={cn("text-[14px]", i === 0 ? "text-black/60" : "text-white/50")}>Sonuç 0{i + 1}</p>
            <div>
              <p className="text-[clamp(40px,4vw,64px)] font-medium leading-none tracking-[-0.05em]">{r.value}</p>
              <p className={cn("mt-2 text-[14px] leading-[1.3]", i === 0 ? "text-black/70" : "text-white/60")}>
                {r.label}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <section id="tasarim" className={SECTION}>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <Reveal className={PANEL}>
            <p className={LABEL}>Renk paleti</p>
            <ul className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {work.palette.map((c) => (
                <li key={c.hex}>
                  <span className="block h-28 rounded-[10px] ring-1 ring-white/10" style={{ backgroundColor: c.hex }} />
                  <p className="mt-2 text-[14px] text-white">{c.name}</p>
                  <p className="font-mono text-[11px] uppercase text-white/50">{c.hex}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} className={cn(PANEL, "flex flex-col justify-between gap-6")}>
            <p className={LABEL}>Tipografi</p>
            <p aria-hidden className="text-[clamp(72px,7vw,120px)] font-medium leading-none tracking-[-0.05em] text-white">
              Aa
            </p>
            <dl className="space-y-2 text-[14px]">
              {work.fonts.map((f) => (
                <div key={f.name} className="flex justify-between gap-4 border-t border-white/10 pt-2">
                  <dt className="text-white">{f.name}</dt>
                  <dd className="text-white/50">{f.use}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        {work.blocks.map((block, i) => (
          <Block key={i} block={block} work={work} />
        ))}
      </section>

      <section id="yorum" className={SECTION}>
        <Reveal>
          <figure
            className="flex min-h-[360px] flex-col justify-between gap-10 rounded-[16px] p-6 text-white md:p-10"
            style={{ backgroundColor: work.color }}
          >
            <span aria-hidden className="text-[72px] leading-[0.6] text-white/60">
              “
            </span>
            <blockquote className="max-w-[24em] text-[clamp(24px,2.4vw,40px)] font-medium leading-[1.15] tracking-[-0.035em]">
              {work.testimonial.quote}
            </blockquote>
            <figcaption className="flex flex-wrap items-end justify-between gap-4">
              <span className="text-[14px] leading-[1.35]">
                {work.testimonial.name}
                <span className="block text-white/60">
                  {work.testimonial.role}, {work.title}
                </span>
              </span>
              <CollabMark work={work} size="sm" />
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </div>
  );
}

function Hero({ work }: { work: Work }) {
  return (
    <div
      className="relative h-[clamp(420px,58svh,600px)] overflow-hidden rounded-[16px]"
      style={{ backgroundColor: work.color }}
    >
      <Image src={work.image} alt="" fill preload sizes="(min-width: 1024px) 50vw, 100vw" quality={85} className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <Badge kind="calisma" label={work.tag} />
        <h1 className="mt-4 text-[clamp(40px,4.6vw,80px)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
          {work.title}
        </h1>
        <p className="mt-3 max-w-[32em] text-[clamp(15px,1.05vw,17px)] leading-[1.4] tracking-[-0.01em] text-white/75">
          {work.summary}
        </p>
      </div>
    </div>
  );
}

/** Künye: müşteri ve proje bilgileri, iki sütunlu kısa satırlar. */
function Facts({ work }: { work: Work }) {
  const services = work.services
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s) => s !== undefined);
  const rows = [
    ["Müşteri", work.title],
    ["Sektör", work.sector],
    ["Konum", work.client.location],
    ["Kuruluş", work.client.founded],
    ["Ölçek", work.client.size],
    ["Yıl", work.year],
    ["Süre", work.duration],
  ];

  return (
    <div className="flex h-full flex-col">
      <p className={LABEL}>Künye</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 text-[14px] leading-[1.3]">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-white/50">{label}</dt>
            <dd className="text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-auto space-y-3.5 border-t border-white/10 pt-4 text-[14px] leading-[1.3]">
        <div>
          <dt className="text-white/50">Hizmetler</dt>
          <dd className="text-white">
            {services.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && ", "}
                <Link
                  href={`/hizmetler/${s.slug}`}
                  className="underline decoration-white/30 underline-offset-[3px] transition-colors hover:decoration-white"
                >
                  {s.title}
                </Link>
              </span>
            ))}
          </dd>
        </div>
        {work.client.website && (
          <div>
            <dt className="text-white/50">Web sitesi</dt>
            <dd>
              <a
                href={`https://${work.client.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-[3px] transition-colors hover:decoration-white"
              >
                {work.client.website} ↗
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function Block({ block, work }: { block: WorkBlock; work: Work }) {
  switch (block.type) {
    case "image":
      return (
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-[#111]">
          <Image src={block.src} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        </Reveal>
      );
    case "duo":
      return (
        <div className="grid gap-2 md:grid-cols-2">
          {block.images.map((src, i) => (
            <Reveal key={src} index={i} className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#111]">
              <Image src={src} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
            </Reveal>
          ))}
        </div>
      );
    case "split":
      return (
        <div className="grid gap-2 md:grid-cols-2">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#111]">
            <Image src={block.image} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
          </Reveal>
          {/* Referanstaki marka paneli: proje renginde zemin, ortada büyük cümle */}
          <Reveal index={1} className="aspect-[4/5]">
            <div
              className="grid h-full place-items-center rounded-[16px] p-8 text-center"
              style={{ backgroundColor: work.color }}
            >
              <p className="max-w-[12em] text-[clamp(28px,3vw,52px)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
                {block.statement}
              </p>
            </div>
          </Reveal>
        </div>
      );
    case "text":
      return (
        <Reveal className={cn(PANEL, "grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:py-10")}>
          <div>
            <p className={LABEL}>{block.label}</p>
            <h2 className="mt-3 text-[clamp(26px,2.4vw,40px)] font-medium leading-[1.1] tracking-[-0.035em] text-white">
              {block.title}
            </h2>
          </div>
          <p className={cn(STATEMENT, "text-white/85 md:pt-8")}>{block.body}</p>
        </Reveal>
      );
  }
}
