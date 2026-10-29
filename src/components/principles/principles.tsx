"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { SplitHeading } from "@/components/ui/section-parts";
import { cn } from "@/lib/utils";

// İçerik ve fotoğraflar: oxdijital.com/neden-biz, "Uygulama · Sözden Eyleme Geçtiğimiz Yer" bölümü.
// Orada üç görselli kart; art arda üçüncü kart dizisi olmasın diye yapışkan düzene çevrildi:
// masaüstünde fotoğraf solda sabit durur, kaydırdıkça ekranın ortasına gelen ilke koyulaşır
// ve fotoğraf yumuşakça onunkine geçer. Bilerek sade: yalnız renk ve opaklık geçişi.

const PRINCIPLES = [
  {
    title: "Her adımı birlikte takip ediyoruz.",
    desc: "Projenin her aşamasında bilgilendiriyor, sizi sürecin tam merkezine konumlandırıyoruz.",
    image: "/images/principles/takip.jpg",
  },
  {
    title: "Estetikten ödün vermeden güç üretiyoruz.",
    desc: "Hem görsel olarak etkileyici hem de yüksek performanslı ürünler sunuyoruz; tasarım ve işlev el ele.",
    image: "/images/principles/estetik.jpg",
  },
  {
    title: "Hiçbir şey tesadüfe bırakılmaz.",
    desc: "Süreçlerimiz, projenizin hiçbir noktasında aksamayacak şekilde en verimli hâliyle kurgulanır.",
    image: "/images/principles/kurgu.jpg",
  },
];

export function Principles() {
  const [active, setActive] = useState(0);

  return (
    // Süreç bölümünün üstüne, misyondaki gibi yuvarlak köşeli bir sayfa olarak biner.
    <section
      id="ilkeler"
      className="relative z-10 -mt-12 rounded-t-[48px] bg-background px-4 py-28 md:px-[4.5vw] md:py-36"
    >
      <SplitHeading strong="Sözden eyleme geçtiğimiz yer." soft="Her projede bağlı kaldığımız üç ilke." />

      <div className="mt-16 grid gap-16 md:mt-20 lg:grid-cols-2 lg:gap-24">
        {/* Yapışkan fotoğraf (masaüstü) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100svh-8rem)] overflow-hidden rounded-[28px] bg-[#111]">
            {PRINCIPLES.map((p, i) => (
              <Image
                key={p.image}
                src={p.image}
                alt=""
                fill
                sizes="50vw"
                className={cn(
                  "object-cover transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>

        <ol>
          {PRINCIPLES.map((p, i) => (
            <PrincipleItem key={p.title} index={i} active={i === active} onActive={setActive} {...p} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function PrincipleItem({
  index,
  active,
  onActive,
  title,
  desc,
  image,
}: {
  index: number;
  active: boolean;
  onActive: (i: number) => void;
  title: string;
  desc: string;
  image: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Ekranın dikey ortasındaki ince bant: o banda giren ilke aktif olur.
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    // Masaüstünde her ilke yapışkan fotoğrafla aynı yükseklikte: metin hep fotoğrafın dikey ortasına denk gelir.
    <li ref={ref} className="flex flex-col justify-center lg:min-h-[calc(100svh-8rem)]">
      {/* Mobilde yapışkan fotoğraf yok; her ilkenin fotoğrafı kendi metninin üstünde */}
      <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[24px] lg:hidden">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div
        className={cn(
          "transition-opacity duration-500 ease-out lg:opacity-25",
          active && "lg:opacity-100",
        )}
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          0{index + 1}
        </span>
        <h3 className="mt-4 max-w-[14em] text-[clamp(28px,2.4vw,46px)] font-medium leading-[1.1] tracking-[-0.04em] text-[#111]">
          {title}
        </h3>
        <p className="mt-5 max-w-[30em] text-[clamp(16px,1.1vw,19px)] leading-[1.55] tracking-[-0.01em] text-[#555]">
          {desc}
        </p>
      </div>
    </li>
  );
}
