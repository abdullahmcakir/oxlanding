import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { TERMS } from "@/components/legal/legal-data";

export const metadata: Metadata = {
  title: `${TERMS.title} · OX Dijital`,
  description: TERMS.description,
  alternates: { canonical: TERMS.href },
  openGraph: pageOpenGraph(TERMS.href),
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
