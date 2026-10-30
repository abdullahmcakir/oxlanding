import { FeedPage, feedMetadata } from "@/components/feed/feed-page";

// Çalışmalar, blog, yorumlar ve hizmetler tek akışta (Tümü). Filtreli halleri: /calismalar/projeler, /blog
export const metadata = feedMetadata("tumu");

export default function WorkPage() {
  return <FeedPage filter="tumu" />;
}
