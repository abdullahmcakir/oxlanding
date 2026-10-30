import { FeedPage, feedMetadata } from "@/components/feed/feed-page";

// Akışın yalnız blog filtresi; aynı zamanda /blog/[slug] yazılarının üst sayfası.
export const metadata = feedMetadata("blog");

export default function BlogPage() {
  return <FeedPage filter="blog" />;
}
