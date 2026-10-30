import { FeedPage, feedMetadata } from "@/components/feed/feed-page";

// Akışın yalnız çalışmalar filtresi. Statik rota olduğu için /calismalar/[slug]'dan önce eşleşir.
export const metadata = feedMetadata("calisma");

export default function ProjectsPage() {
  return <FeedPage filter="calisma" />;
}
