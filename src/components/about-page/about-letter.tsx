import { Kalam } from "next/font/google";
import { Reveal } from "@/components/about/about-cards";
import { LETTER, STORY } from "./about-data";

// Kurucunun yaklaşım mektubu. Referans: clean-tuna /services'teki "OX Dijital'in Yaklaşımı" kartı (köşede portre,
// uzun metin) + tbd'nin iki tonlu hikâye paragrafı. Bir insanın imzasıyla yazılmış metin, "bu şirketin arkasında
// biri var" hissini verir. İmza, iletişim sayfasındaki el yazısı fontuyla (Kalam).
// Açık gri blok: hemen ardından gelen ilkeler ve süreç koyu; üç koyu bölüm üst üste binmesin.

const kalam = Kalam({ weight: "400", subsets: ["latin", "latin-ext"] });

export function AboutLetter() {
  return (
    <section className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <Reveal>
        <div className="grid gap-12 rounded-[32px] bg-[#F1F1F1] p-6 md:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 lg:p-16">
          <div className="flex flex-col">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">Yaklaşımımız</p>
            <h2 className="mt-6 max-w-[14em] text-[clamp(30px,3.2vw,56px)] font-medium leading-[1.06] tracking-[-0.045em] text-[#111]">
              {STORY.lead}
            </h2>
            <p className="mt-8 max-w-[34em] text-[clamp(17px,1.25vw,21px)] leading-[1.45] tracking-[-0.015em]">
              <span className="text-[#111]">{STORY.strong}</span> <span className="text-neutral-500">{STORY.soft}</span>
            </p>
          </div>

          <article className="relative rounded-[24px] bg-white p-7 shadow-[0_24px_60px_-36px_rgb(0_0_0/0.3)] md:p-9">
            {/* Referanstaki köşedeki portre; fotoğraf gelene kadar baş harfler */}
            <span className="absolute -top-5 right-7 grid size-14 place-items-center rounded-[16px] bg-[#1F3A0B] text-[16px] font-medium text-accent shadow-lg ring-4 ring-white">
              {LETTER.initials}
            </span>
            <h3 className="text-[22px] font-medium tracking-[-0.03em] text-[#111]">{LETTER.title}</h3>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.6] text-neutral-600">
              {LETTER.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-8 border-t border-black/[0.08] pt-5">
              <p className={`${kalam.className} text-[30px] leading-none text-[#111]`}>{LETTER.name}</p>
              <p className="mt-2 text-[13px] text-neutral-500">{LETTER.role}</p>
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
