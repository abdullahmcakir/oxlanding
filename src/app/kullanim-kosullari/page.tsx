import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { TERMS } from "@/components/legal/legal-data";

export const metadata: Metadata = {
  title: `${TERMS.title} · OX Dijital`,
  description: TERMS.description,
  alternates: { canonical: TERMS.href },
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
