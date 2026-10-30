import type { Metadata } from "next";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { filterOf, type FeedFilter } from "./feed-data";
import { FeedGrid } from "./feed-grid";
import { FeedHero } from "./feed-hero";

// Akışın üç sayfası (/calismalar, /calismalar/projeler, /blog) aynı düzeni paylaşır; yalnız filtre,
// başlık ve açıklama değişir. Her biri kendi adresi ve metadata'sıyla Google'da ayrı sayfa olarak görünür.

export function feedMetadata(key: FeedFilter): Metadata {
  const f = filterOf(key);
  return {
    title: `${f.title} · OX Dijital`,
    description: f.description,
    alternates: { canonical: f.href },
  };
}

export function FeedPage({ filter }: { filter: FeedFilter }) {
  const f = filterOf(filter);
  return (
    <>
      <Navbar />
      <main>
        {/* Görsel YER TUTUCU */}
        <FeedHero title={f.title} image="/images/principles/estetik.jpg" scrollTarget="#akis" />
        <FeedGrid id="akis" filter={filter} />
      </main>
      <Footer />
    </>
  );
}
