import { Reveal } from "@/components/about/about-cards";
import { SplitHeading } from "@/components/ui/section-parts";
import type { ServicePage } from "./service-page-data";

// "Neler dahil?": solda kapsamdaki her kalem açıklamasıyla, sağda yapışkan koyu kartta
// teslim edilenler ve kullanılan araçlar. Koyu kart dili paket kartlarıyla aynı.

export function ServiceScope({ page }: { page: ServicePage }) {
  const { scope, deliverables, tools, service } = page;

  return (
    <section className="bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      <SplitHeading strong="Neler dahil?" soft={`${service.title} kapsamında yaptığımız her şey.`} />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <ol className="border-b border-neutral-200">
          {scope.map((item, i) => (
            <li key={item.title}>
              <Reveal className="grid grid-cols-[40px_1fr] gap-x-4 border-t border-neutral-200 py-7 md:grid-cols-[56px_1fr_auto] md:gap-x-6">
                <span className="pt-1.5 font-mono text-[12px] text-neutral-400">0{i + 1}</span>
                <div>
                  <h3 className="text-[clamp(20px,1.5vw,26px)] font-medium leading-[1.2] tracking-[-0.03em] text-[#111]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
                    {item.desc}
                  </p>
                </div>
                <span className="col-start-2 mt-4 self-start justify-self-start rounded-full bg-[#F1F1F1] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600 md:col-start-auto md:mt-1.5">
                  {item.kind}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[32px] bg-[#171717] p-1.5 text-white">
            <div className="rounded-[26px] bg-[#070707] p-7 md:p-9">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
                Teslim ettiklerimiz
              </p>
              <ul className="mt-6 space-y-3.5">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[15px] leading-[1.4] tracking-[-0.01em] text-white/80">
                    <CheckIcon />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {tools.length > 0 && (
              <div className="px-7 py-7 md:px-9">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
                  Kullandığımız araçlar
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <li key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] tracking-[-0.01em] text-white/85">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CheckIcon() {
  return (
    <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-white/10">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-2.5"
        aria-hidden
      >
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
  );
}
