import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { ServiceAudiences } from "@/components/service-page/service-audiences";
import { ServiceFacts } from "@/components/service-page/service-facts";
import { ServiceFeatures } from "@/components/service-page/service-features";
import { ServiceFit } from "@/components/service-page/service-fit";
import { ServiceHero } from "@/components/service-page/service-hero";
import { ServiceHighlights } from "@/components/service-page/service-highlights";
import { ServicePackages } from "@/components/service-page/service-packages";
import { getServicePage, SERVICE_SLUGS } from "@/components/service-page/service-page-data";
import { ServiceScope } from "@/components/service-page/service-scope";
import { ServiceStatement } from "@/components/service-page/service-statement";
import { ServiceSteps } from "@/components/service-page/service-steps";
import { ServiceTestimonials } from "@/components/service-page/service-testimonials";
import { SERVICE_META } from "@/components/service-page/service-meta";
import { breadcrumbJsonLd, jsonLdHtml, pageOpenGraph, serviceJsonLd } from "@/lib/seo";

// Her hizmet için ayrı sayfa: /hizmetler/website, /hizmetler/seo …
// Sıralama referanstaki gibi; araya "Bir bakışta" ve "Neler dahil?" bilgi bölümleri eklendi.
// Kapanışta genel CTA yerine o hizmetin paketleri var.

export function generateStaticParams() {
  // Mekanda kendi sayfasında (app/hizmetler/mekanda): ürün sayfası, bu şablonu kullanmaz
  return SERVICE_SLUGS.filter((slug) => slug !== "mekanda").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/hizmetler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  const canonical = `/hizmetler/${slug}`;
  const meta = page.meta ?? SERVICE_META[slug];
  return {
    title: meta?.title ?? `${page.service.title} · OX Dijital`,
    description: meta?.description ?? page.service.description,
    alternates: { canonical },
    // og:title / og:description title ve description'dan türer; ortak alanlar ve paylaşım görseli pageOpenGraph'ta
    openGraph: pageOpenGraph(canonical),
  };
}

// Bilinmeyen adres gerçek 404 dönsün: Partial Prefetching açıkken listede olmayan slug'a önce hazır kabuk gidiyor ve
// yanıt 200 ile başlıyordu. ensureStatic = "navigation" ilk isteğin tam statik sonucu beklemesini sağlar; böylece
// notFound() akış başlamadan çalışır. İçerik sabit ve tüm hizmetler önceden üretildiği için anlık gezinme
// denetiminden (instant) çıkarmanın da maliyeti yok.
export const instant = false;
export const ensureStatic = "navigation";

export default async function ServicePageRoute({ params }: PageProps<"/hizmetler/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const path = `/hizmetler/${slug}`;
  // Şemada yalnız sayfada görünen bilgiler: hizmetin adı ve hero'daki açıklaması; SSS ise <Faq schema> ile
  const serviceLd = serviceJsonLd({ name: page.service.title, description: page.hero.description, path });
  const crumbsLd = breadcrumbJsonLd([
    { label: "Ana sayfa", href: "/" },
    { label: page.service.title, href: path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(serviceLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(crumbsLd)} />
      <Navbar />
      <main>
        <ServiceHero page={page} />
        <ServiceFeatures page={page} />
        <ServiceFacts items={page.facts} />
        <ServiceStatement text={page.statement} />
        <ServiceHighlights items={page.highlights} />
        <ServiceSteps steps={page.steps} image={page.service.image} intro={page.stepsIntro} />
        <ServiceScope page={page} />
        <ServiceAudiences items={page.audiences} intro={page.audiencesIntro} />
        {page.fit && <ServiceFit {...page.fit} slug={page.service.slug} />}
        <ServiceTestimonials items={page.testimonials} />
        <Faq items={page.faq} cta={page.faqCta} schema />
        <ServicePackages page={page} />
      </main>
      <Footer />
    </>
  );
}
