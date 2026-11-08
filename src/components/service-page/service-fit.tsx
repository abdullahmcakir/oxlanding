import { Reveal } from "@/components/about/about-cards";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { talepUrl } from "@/lib/links";

// "Kimin için"den sonraki ara bölüm: hizmetin kime uygun olduğunu tek cümleyle söyler.
// Açık gri blok (Hakkımızda'daki yaklaşım bloğuyla aynı zemin), ortalı büyük başlık + kısa metin.
// `cta` verilirse altında görüşme butonu (hizmet sayfasının talep bağlantısı).

export function ServiceFit({ title, text, cta, slug }: { title: string; text: string; cta?: string; slug: string }) {
  return (
    <section className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <Reveal>
        <div className="rounded-[32px] bg-[#F1F1F1] px-6 py-16 text-center md:px-12 md:py-24">
          <h2 className="mx-auto max-w-[18em] text-[clamp(30px,3vw,54px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-[44em] text-[clamp(15px,1.1vw,19px)] leading-[1.55] tracking-[-0.01em] text-neutral-500">
            {text}
          </p>
          {cta && (
            <a
              href={talepUrl({ hizmet: slug })}
              className="group mt-10 inline-flex items-center gap-1.5"
            >
              <span className="flex h-12 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-semibold tracking-[-0.02em] text-white">
                {cta}
              </span>
              <span className="grid size-12 place-items-center rounded-[10px] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                <PixelIcon variant="arrow" className="size-[10px]" cellClassName="fill-accent-ink" />
              </span>
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}
