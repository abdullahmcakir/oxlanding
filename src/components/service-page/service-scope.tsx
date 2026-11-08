import { Reveal } from "@/components/about/about-cards";
import { SplitHeading } from "@/components/ui/section-parts";
import type { ServicePage } from "./service-page-data";

// "Neler dahil?": solda kapsamdaki her kalem (açıklamalı ya da yalnız başlık), sağda yapışkan koyu kartta
// teslim edilenler ve kullanılan araçlar ya da yazılmış sayfalarda "ihtiyaca göre eklenebilir" notu.
// Koyu kart dili paket kartlarıyla aynı. #kapsam: hero'daki "Kapsamı gör" buraya iner.

export function ServiceScope({ page }: { page: ServicePage }) {
  const { scope, scopeIntro, scopeNote, deliverables, tools, service } = page;
  const brief = scope.every((item) => !item.desc);

  return (
    <section id="kapsam" className="scroll-mt-28 bg-background px-4 pb-24 md:px-[4.5vw] md:pb-32">
      {scopeIntro ? (
        <>
          <h2 className="max-w-[16em] text-[clamp(32px,3.2vw,60px)] font-medium leading-[1.08] tracking-[-0.045em] text-[#111]">
            {scopeIntro.title ?? "Neler dahil?"}
          </h2>
          <p className="mt-5 max-w-[40em] text-[clamp(15px,1.05vw,18px)] leading-[1.5] tracking-[-0.01em] text-neutral-500">
            {scopeIntro.desc}
          </p>
        </>
      ) : (
        <SplitHeading strong="Neler dahil?" soft={`${service.title} kapsamında yaptığımız her şey.`} />
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <ol className="border-b border-neutral-200">
          {scope.map((item, i) => (
            <li key={item.title}>
              <Reveal
                className={`grid grid-cols-[40px_1fr] gap-x-4 border-t border-neutral-200 md:grid-cols-[56px_1fr_auto] md:gap-x-6 ${brief ? "py-5" : "py-7"}`}
              >
                <span className="pt-1.5 font-mono text-[12px] text-neutral-400">0{i + 1}</span>
                <div>
                  <h3 className="text-[clamp(20px,1.5vw,26px)] font-medium leading-[1.2] tracking-[-0.03em] text-[#111]">
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-neutral-500">
                      {item.desc}
                    </p>
                  )}
                </div>
                {item.kind && (
                  <span className="col-start-2 mt-4 self-start justify-self-start rounded-full bg-[#F1F1F1] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600 md:col-start-auto md:mt-1.5">
                    {item.kind}
                  </span>
                )}
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[32px] bg-[#171717] p-1.5 text-white">
            {scopeNote && (
              <div className="rounded-[26px] bg-[#070707] p-7 md:p-9">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">{scopeNote.title}</p>
                <p className="mt-5 text-[clamp(17px,1.3vw,21px)] leading-[1.45] tracking-[-0.015em] text-white/85">
                  {scopeNote.text}
                </p>
                {scopeNote.foot && (
                  <p className="mt-5 border-t border-white/10 pt-5 text-[14px] leading-[1.5] text-white/55">{scopeNote.foot}</p>
                )}
              </div>
            )}
            {deliverables.length > 0 && (
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
            )}

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
