import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { cn } from "@/lib/utils";
import type { ArticleBlock } from "./article-data";

// Yazı gövdesinin blokları. Düz paragraf duvarı olmasın diye dönüşümlü kullanılır:
// alıntı, rakam, ipucu, liste, görsel ve sütundan taşan koyu bant (referanstaki lacivert bölüm, bizde #111).

export const PROSE = "text-[18px] leading-[1.65] tracking-[-0.005em] text-[#333]";

const LINK = "font-medium text-[#111] underline decoration-accent decoration-2 underline-offset-[3px] transition-colors hover:text-accent";

/** Metindeki [bağlantı metni](/adres) yazımını bağlantıya çevirir; site içi adresler Link ile (ön yükleme) */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return part;
        const [, label, href] = m;
        return href.startsWith("/") ? (
          <Link key={i} href={href} className={LINK}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} className={LINK}>
            {label}
          </a>
        );
      })}
    </>
  );
}

/** Site içi adres Link, panel gibi dış adres düz <a> */
function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className={PROSE}>
          <RichText text={block.text} />
        </p>
      );

    case "h3":
      return (
        <h3 className="pt-4 text-[clamp(21px,1.6vw,25px)] font-medium leading-[1.2] tracking-[-0.03em] text-[#111]">
          {block.text}
        </h3>
      );

    case "list":
      if (block.check) {
        // Kontrol listesi: maddeler ayrı satırlar, solda boş onay kutusu (okur kendi işaretler)
        return (
          <ul className="divide-y divide-black/[0.06] rounded-[24px] bg-[#F1F1F1] px-6 py-2 md:px-8">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-4 py-4 text-[17px] leading-[1.45] tracking-[-0.01em] text-[#111]">
                <span aria-hidden className="mt-[3px] size-[18px] shrink-0 rounded-[5px] border-2 border-[#111]/25 bg-white" />
                <RichText text={item} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ol className={cn(PROSE, "space-y-3")}>
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4">
              {block.ordered ? (
                <span className="w-6 shrink-0 pt-[3px] font-mono text-[13px] text-neutral-400">0{i + 1}</span>
              ) : (
                // Piksel madde işareti: sitenin piksel dili
                <span aria-hidden className="mt-[11px] size-[7px] shrink-0 bg-[#111]" />
              )}
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        // Dar ekranda tablo kendi içinde yatay kayar; sayfa taşmaz
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 overflow-hidden rounded-[20px] text-left text-[15px] leading-[1.45] ring-1 ring-black/10">
            <caption className="caption-bottom pt-3 text-left text-[13px] text-neutral-500">{block.caption}</caption>
            <thead className="bg-[#111] text-white">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="even:bg-[#F7F7F7]">
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="border-t border-black/[0.06] px-5 py-3.5 font-medium text-[#111]">
                        {cell}
                      </th>
                    ) : (
                      <td key={j} className="border-t border-black/[0.06] px-5 py-3.5 text-[#333]">
                        <RichText text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "faq":
      // Açık liste: tüm cevaplar görünür (şemadaki metinle birebir aynı), akordeon yok
      return (
        <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {block.items.map((item) => (
            <div key={item.q} className="py-6">
              <h3 className="text-[clamp(19px,1.4vw,22px)] font-medium leading-[1.25] tracking-[-0.025em] text-[#111]">{item.q}</h3>
              <p className="mt-2.5 text-[16px] leading-[1.6] text-[#333]">
                <RichText text={item.a} />
              </p>
            </div>
          ))}
        </div>
      );

    case "cta":
      return (
        <Reveal>
          <aside className="rounded-[28px] bg-[#111] p-7 text-white md:p-9">
            <p className="text-[clamp(22px,1.8vw,28px)] font-medium leading-[1.15] tracking-[-0.03em]">{block.title}</p>
            <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.55] text-white/65">{block.text}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {block.actions.map((a, i) => (
                <SmartLink
                  key={a.href}
                  href={a.href}
                  className={cn(
                    "group inline-flex items-center gap-2.5 rounded-[12px] px-4 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-[filter,background-color]",
                    i === 0 ? "bg-accent text-accent-ink hover:brightness-110" : "bg-white/10 text-white hover:bg-white/20",
                  )}
                >
                  {a.label}
                  <PixelIcon
                    variant="arrow"
                    className="size-[8px] transition-transform duration-300 group-hover:translate-x-0.5"
                    cellClassName={i === 0 ? "fill-accent-ink" : "fill-white"}
                  />
                </SmartLink>
              ))}
            </div>
          </aside>
        </Reveal>
      );

    case "quote":
      return (
        <Reveal>
          <figure className="py-4">
            <span aria-hidden className="block text-[88px] leading-[0.5] text-accent [text-shadow:0_1px_0_#111]">
              “
            </span>
            <blockquote className="mt-4 text-[clamp(24px,2.2vw,34px)] font-medium leading-[1.2] tracking-[-0.035em] text-[#111]">
              {block.text}
            </blockquote>
            {block.cite && (
              <figcaption className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                {block.cite}
              </figcaption>
            )}
          </figure>
        </Reveal>
      );

    case "stat":
      return (
        <Reveal>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3 rounded-[28px] bg-[#F1F1F1] p-7 md:p-9">
            <span className="text-[clamp(64px,7vw,112px)] font-medium leading-[0.85] tracking-[-0.055em] text-[#111]">
              {block.value}
            </span>
            <span className="max-w-[22em] pb-1 text-[16px] leading-[1.4] tracking-[-0.01em] text-neutral-500">
              {block.label}
            </span>
          </div>
        </Reveal>
      );

    case "tip":
      return (
        <Reveal>
          {/* Açık zemin: koyu bantla yan yana geldiğinde ritim bozulmasın */}
          <aside className="rounded-[28px] bg-white p-7 ring-1 ring-black/10 md:p-9">
            <p className="flex w-fit items-center gap-2 rounded-full bg-accent py-1.5 pl-2.5 pr-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-ink">
              <PixelIcon variant="plus" className="size-[9px]" cellClassName="fill-accent-ink" />
              İpucu
            </p>
            <p className="mt-4 text-[clamp(20px,1.6vw,24px)] font-medium leading-[1.2] tracking-[-0.025em] text-[#111]">
              {block.title}
            </p>
            <p className="mt-3 text-[16px] leading-[1.55] text-[#333]">
              <RichText text={block.text} />
            </p>
          </aside>
        </Reveal>
      );

    case "image":
      return (
        <Reveal>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-[#F1F1F1]">
              <Image src={block.src} alt="" fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
            </div>
            {block.caption && (
              <figcaption className="mt-3 text-[14px] leading-[1.45] text-neutral-500">{block.caption}</figcaption>
            )}
          </figure>
        </Reveal>
      );

    case "band":
      return (
        // Metin sütunundan biraz taşar (en fazla 1040px): ritmi kırar ama okumayı bölen bir duvara dönüşmez.
        // Görsel yatay ve metinle eş ağırlıkta; 1200px / dikey görselli ilk hali fazla baskın kalıyordu.
        <Reveal className="relative left-1/2 my-4 w-[min(1040px,calc(100vw-24px))] -translate-x-1/2">
          <div className="grid items-center gap-6 rounded-[32px] bg-[#111] p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10 md:p-4">
            <div className={cn("px-4 pb-4 pt-2 md:px-6 md:py-6", block.reverse && "md:order-2")}>
              <p className="flex w-fit items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
                <PixelIcon variant="arrow" className="size-[8px]" />
                Öne çıkan
              </p>
              <h3 className="mt-4 text-[clamp(24px,2vw,32px)] font-medium leading-[1.12] tracking-[-0.035em] text-white">
                {block.title}
              </h3>
              <div className="mt-4 space-y-3 text-[16px] leading-[1.6] text-white/70">
                {block.text.map((t) => (
                  <p key={t.slice(0, 24)}>{t}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#1a1a1a]">
              <Image src={block.image} alt="" fill sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      );
  }
}
