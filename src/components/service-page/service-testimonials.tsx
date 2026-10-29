import { Marquee } from "@/components/ui/marquee";
import type { ServicePage } from "./service-page-data";

// Referans: "What Our Customers Say": iki sıra yorum kartı, zıt yönlerde sonsuz kayar.
// Yorumlar YER TUTUCU; gerçek müşteri yorumları gelene kadar isimler genel bırakıldı.

type Testimonial = ServicePage["testimonials"][number];

export function ServiceTestimonials({ items }: { items: Testimonial[] }) {
  const half = Math.ceil(items.length / 2);

  return (
    <section className="bg-background pb-24 md:pb-32">
      <div className="px-4 text-center md:px-[4.5vw]">
        <h2 className="text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
          Müşterilerimiz ne diyor?
        </h2>
        <p className="mt-4 text-[clamp(15px,1.05vw,18px)] tracking-[-0.01em] text-neutral-500">
          Birlikte çalıştığımız markalardan kısa notlar.
        </p>
      </div>

      {/* Kenarlarda yumuşak kaybolma */}
      <div className="mt-14 space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee speed={30}>
          {items.slice(0, half).map((t, i) => (
            <Card key={i} {...t} />
          ))}
        </Marquee>
        <Marquee speed={30} reverse>
          {items.slice(half).map((t, i) => (
            <Card key={i} {...t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Card({ quote, name, role }: Testimonial) {
  return (
    <figure className="flex w-[min(380px,82vw)] shrink-0 flex-col justify-between gap-8 rounded-[24px] bg-[#F5F5F5] p-6 md:p-7">
      <div>
        <div className="flex gap-1" aria-label="5 üzerinden 5">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 20 20" className="size-4 fill-[#AFD41C]" aria-hidden>
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
            </svg>
          ))}
        </div>
        <blockquote className="mt-4 text-[16px] leading-[1.45] tracking-[-0.015em] text-[#111]">{quote}</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <span aria-hidden className="grid size-10 place-items-center rounded-full bg-[#111] text-[13px] font-medium text-white">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
        <span>
          <span className="block text-[15px] tracking-[-0.01em] text-[#111]">{name}</span>
          <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
