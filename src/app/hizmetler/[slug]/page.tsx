import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { ServiceAudiences } from "@/components/service-page/service-audiences";
import { ServiceFacts } from "@/components/service-page/service-facts";
import { ServiceFeatures } from "@/components/service-page/service-features";
import { ServiceHero } from "@/components/service-page/service-hero";
import { ServiceHighlights } from "@/components/service-page/service-highlights";
import { ServicePackages } from "@/components/service-page/service-packages";
import { getServicePage, SERVICE_SLUGS } from "@/components/service-page/service-page-data";
import { ServiceScope } from "@/components/service-page/service-scope";
import { ServiceStatement } from "@/components/service-page/service-statement";
import { ServiceSteps } from "@/components/service-page/service-steps";
import { ServiceTestimonials } from "@/components/service-page/service-testimonials";

// Her hizmet için ayrı sayfa: /hizmetler/website, /hizmetler/seo …
// Sıralama referanstaki gibi; araya "Bir bakışta" ve "Neler dahil?" bilgi bölümleri eklendi.
// Kapanışta genel CTA yerine o hizmetin paketleri var.

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/hizmetler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: `${page.service.title} · OX Dijital`,
    description: page.service.description,
    alternates: { canonical: `/hizmetler/${slug}` },
  };
}

// Parametre en üstte okunuyor ki bilinmeyen adres gerçek 404 dönsün (Suspense içinde okununca 200 dönüyordu).
// İçerik sabit ve tüm hizmetler önceden üretildiği için "anlık gezinme" denetiminden çıkarmanın maliyeti yok.
export const instant = false;

export default async function ServicePageRoute({ params }: PageProps<"/hizmetler/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ServiceHero page={page} />
        <ServiceFeatures page={page} />
        <ServiceFacts items={page.facts} />
        <ServiceStatement text={page.statement} />
        <ServiceHighlights items={page.highlights} />
        <ServiceSteps steps={page.steps} image={page.service.image} />
        <ServiceScope page={page} />
        <ServiceAudiences items={page.audiences} />
        <ServiceTestimonials items={page.testimonials} />
        <Faq items={page.faq} />
        <ServicePackages page={page} />
      </main>
      <Footer />
    </>
  );
}
