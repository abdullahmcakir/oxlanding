import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { WorkContent } from "@/components/work/work-content";
import { DockPreset } from "@/components/dock/dock";
import { getWork, neighbours, WORKS } from "@/components/work/work-data";
import { WorkSidebar } from "@/components/work/work-sidebar";

// Her çalışma için ayrı sayfa: /calismalar/teknoloji-girisimi …
// Masaüstünde solda sabit kenar çubuğu, sağda kayan paneller; mobilde kenar çubuğu içeriğin altına düşer.
// Çalışmalar arası gezinme sağ alttaki asistanda (DockPreset).

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calismalar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  return { title: `${work.title} · OX Dijital`, description: `${work.summary}. ${work.challenge}` };
}

// Hizmet sayfalarındaki gibi: bilinmeyen adres gerçek 404 dönsün diye parametre en üstte okunuyor.
export const instant = false;

export default async function WorkPage({ params }: PageProps<"/calismalar/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const { prev, next } = neighbours(work.slug);

  return (
    <>
      {/* Tüm çalışmalar / önceki / sonraki: sağ alttaki asistanda */}
      <DockPreset
        preset={{
          kind: "work",
          index: WORKS.indexOf(work) + 1,
          total: WORKS.length,
          prev: { href: `/calismalar/${prev.slug}`, title: prev.title },
          next: { href: `/calismalar/${next.slug}`, title: next.title },
        }}
      />
      <Navbar />
      {/* Navbar sabit ve yüzer: içerik onun altından (84px) başlar */}
      <main className="bg-[#070707] px-2 pb-2 pt-[84px]">
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[400px_minmax(0,1fr)]">
          <WorkSidebar work={work} />
          <WorkContent work={work} />
        </div>
      </main>
      <Footer />
    </>
  );
}
