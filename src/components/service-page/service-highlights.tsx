"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Logo } from "@/components/navbar/logo";
import type { ServicePage } from "./service-page-data";

// Referans: art arda tam ekran fotoğraf bantları; her birinde solda cam efektli bir bildirim kartı,
// sağ altta başlık ve kısa açıklama. Uygulama bildirimi yerine müşteri panelinden gelen bildirimler.
// Bantlar yapışkan: kaydırma durur gibi olur, sonraki bant öncekinin üstüne biner.
// Sondaki bant boyu boşluk + eşit negatif margin: son bant da yapışık kalır ve sonraki bölüm onun üstüne biner,
// sayfanın toplam uzunluğu değişmez.

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function ServiceHighlights({ items }: { items: ServicePage["highlights"] }) {
  return (
    <section id="one-cikanlar" className="-mb-[max(100svh,640px)] bg-[#111]">
      {items.map((item, i) => (
        <Band key={item.title} index={i} {...item} />
      ))}
      {/* Dolgu değil ayrı öğe: sticky, ebeveynin padding alanında yapışık kalmıyor */}
      <div aria-hidden className="h-[max(100svh,640px)]" />
    </section>
  );
}

function Band({
  index,
  title,
  desc,
  image,
  note,
}: ServicePage["highlights"][number] & { index: number }) {
  return (
    <div className="sticky top-0 h-[max(100svh,640px)] overflow-hidden">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Bildirim kartı: sırayla sol üst / sol orta */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className={
          "absolute left-4 w-[min(360px,calc(100%-32px))] rounded-[22px] border border-white/20 bg-white/15 p-4 text-white backdrop-blur-xl md:left-[11vw] " +
          (index % 2 === 0 ? "top-[22%]" : "top-[46%]")
        }
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#111]">
            <Logo className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[15px] font-semibold tracking-[-0.01em]">{note.title}</p>
              <span className="font-mono text-[10px] text-white/60">12:03</span>
            </div>
            <p className="mt-0.5 text-[14px] leading-[1.35] tracking-[-0.01em] text-white/85">{note.text}</p>
            {note.badge && (
              <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-black">
                {note.badge}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ delay: 0.15, duration: 0.9, ease: EASE_OUT }}
        className="absolute bottom-12 left-4 right-4 md:bottom-20 md:left-[50%] md:right-[6vw]"
      >
        <h2 className="text-[clamp(34px,3.6vw,68px)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
          {title}
        </h2>
        <p className="mt-3 max-w-[32em] text-[clamp(15px,1.1vw,19px)] leading-[1.45] tracking-[-0.01em] text-white/80">
          {desc}
        </p>
      </motion.div>
    </div>
  );
}
