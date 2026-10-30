import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { KVKK } from "@/components/legal/legal-data";

export const metadata: Metadata = {
  title: `${KVKK.title} · OX Dijital`,
  description: KVKK.description,
  alternates: { canonical: KVKK.href },
};

export default function KvkkPage() {
  return <LegalPage doc={KVKK} />;
}
