import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, ARTICLES } from "@/components/article/article-data";
import { ArticlePage } from "@/components/article/article-page";
import { DockPreset } from "@/components/dock/dock";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { pageOpenGraph } from "@/lib/seo";

// Her blog yazısı için ayrı sayfa: /blog/meta-reklam-stratejileri …
// Sağ alttaki asistan bu sayfada okuma arkadaşı olur: ilerleme, kalan süre, o an okunan bölüm (DockPreset).

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} · OX Dijital`,
    description: article.lede[0],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: pageOpenGraph(`/blog/${slug}`),
  };
}

// Bilinmeyen adres gerçek 404 dönsün (ayrıntı: app/hizmetler/[slug]/page.tsx).
export const instant = false;
export const ensureStatic = "navigation";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <DockPreset preset={{ kind: "article", minutes: article.minutes }} />
      <Navbar />
      <main>
        <ArticlePage article={article} />
      </main>
      <Footer />
    </>
  );
}
