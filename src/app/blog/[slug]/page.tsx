import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleFaq, getArticle, ARTICLES, plainText, type Article } from "@/components/article/article-data";
import { ArticlePage, articleCrumbs } from "@/components/article/article-page";
import { DockPreset } from "@/components/dock/dock";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, jsonLdHtml, ORGANIZATION_REF, pageOpenGraph } from "@/lib/seo";

// Her blog yazısı için ayrı sayfa: /blog/meta-reklam-stratejileri …
// Sağ alttaki asistan bu sayfada okuma arkadaşı olur: ilerleme, kalan süre, o an okunan bölüm (DockPreset).

export function generateStaticParams() {
  // Gizli yazılar da üretilir ama getArticle onları bulmaz: derlemede 404 olarak kalır
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const title = article.seo?.title ?? `${article.title} · OX Dijital`;
  const description = article.seo?.description ?? article.lede[0];
  const canonical = `/blog/${slug}`;
  // Kendi paylaşım görseli olmayan yazılar ortak görseli kullanır (pageOpenGraph, og:url ile birlikte)
  if (!article.ogImage) return { title, description, alternates: { canonical }, openGraph: pageOpenGraph(canonical) };
  const image = { url: article.ogImage, width: 1200, height: 630, alt: article.imageAlt ?? article.title };
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "OX Dijital",
      locale: "tr_TR",
      title,
      description,
      images: [image],
      ...(article.published && { publishedTime: article.published, modifiedTime: article.modified ?? article.published }),
      authors: [article.author.name],
      section: article.category,
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

/** Yalnız yayın tarihi gerçek olan yazılar için (yer tutucu yazılara şema basılmaz) */
function blogPostingJsonLd(article: Article) {
  const url = absoluteUrl(`/blog/${article.slug}`);
  const isOrg = article.author.name === "OX Dijital";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.seo?.description ?? plainText(article.lede[0]),
    image: absoluteUrl(article.ogImage ?? article.image),
    datePublished: article.published,
    dateModified: article.modified ?? article.published,
    inLanguage: "tr-TR",
    articleSection: article.category,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: isOrg ? ORGANIZATION_REF : { "@type": "Person", name: article.author.name },
    publisher: { ...ORGANIZATION_REF, logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.png") } },
  };
}

// Bilinmeyen adres gerçek 404 dönsün (ayrıntı: app/hizmetler/[slug]/page.tsx).
export const instant = false;
export const ensureStatic = "navigation";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const faq = articleFaq(article).map((i) => ({ q: i.q, a: plainText(i.a) }));

  return (
    <>
      {article.published && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(blogPostingJsonLd(article))} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(articleCrumbs(article)))} />
      {faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd(faq))} />}
      <DockPreset preset={{ kind: "article", minutes: article.minutes }} />
      <Navbar />
      <main>
        <ArticlePage article={article} />
      </main>
      <Footer />
    </>
  );
}
