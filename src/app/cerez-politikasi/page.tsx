import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import { CookieSettingsButton } from "@/components/cookie/cookie-ask";
import { LegalPage } from "@/components/legal/legal-page";
import { COOKIES } from "@/components/legal/legal-data";

export const metadata: Metadata = {
  title: `${COOKIES.title} · OX Dijital`,
  description: COOKIES.description,
  alternates: { canonical: COOKIES.href },
  openGraph: pageOpenGraph(COOKIES.href),
};

export default function CookiePolicyPage() {
  return (
    <LegalPage doc={COOKIES}>
      <CookieSettingsButton />
    </LegalPage>
  );
}
