import Link from "next/link";
import { COMPANY } from "@/components/about-page/about-data";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { cn } from "@/lib/utils";
import { LEGAL_DOCS, type LegalDoc } from "./legal-data";

// Yasal sayfaların ortak şablonu: sade, okunaklı metin. Solda üç yasal sayfa arasında geçiş, sağda metin,
// sonda resmî şirket bilgileri. `children`: metnin altına sayfaya özel ek (ör. çerez tercih butonu).

const LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500";

export function LegalPage({ doc, children }: { doc: LegalDoc; children?: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-background px-4 pb-28 pt-[140px] md:px-[4.5vw] md:pb-36 md:pt-[170px]">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <nav aria-label="Yasal sayfalar" className="lg:sticky lg:top-32 lg:self-start">
            <p className={LABEL}>Yasal</p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {LEGAL_DOCS.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    aria-current={d.href === doc.href ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-[15px] transition-colors lg:rounded-[12px]",
                      d.href === doc.href ? "bg-[#111] text-white" : "bg-[#F1F1F1] text-[#111] hover:bg-[#E8E8E8] lg:bg-transparent",
                    )}
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="max-w-[720px]">
            <h1 className="text-[clamp(36px,4vw,64px)] font-medium leading-[1.04] tracking-[-0.05em] text-[#111]">
              {doc.title}
            </h1>
            <p className="mt-4 font-mono text-[12px] text-neutral-400">Son güncelleme: {doc.updated}</p>
            <p className="mt-8 text-[clamp(17px,1.25vw,20px)] leading-[1.55] tracking-[-0.01em] text-[#111]">{doc.intro}</p>

            <div className="mt-14 space-y-12">
              {doc.sections.map((s, i) => (
                <section key={s.heading}>
                  <h2 className="flex items-baseline gap-4 text-[22px] font-medium tracking-[-0.03em] text-[#111]">
                    <span className="font-mono text-[12px] font-normal text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-neutral-600">
                    {s.paragraphs?.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
                    {s.list && (
                      <ul className="space-y-2.5">
                        {s.list.map((item) => (
                          <li key={item.slice(0, 32)} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-[1px] bg-[#111]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {children && <div className="mt-12">{children}</div>}

            <div className="mt-16 rounded-[24px] bg-[#F1F1F1] p-6 md:p-8">
              <p className={LABEL}>Şirket bilgileri</p>
              <dl className="mt-5 grid gap-x-8 gap-y-4 text-[15px] sm:grid-cols-2">
                {COMPANY.map((c) => (
                  <div key={c.label}>
                    <dt className="text-neutral-500">{c.label}</dt>
                    <dd className="mt-0.5 text-[#111]">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
