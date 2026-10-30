import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";
import { Navbar } from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: "İletişim · OX Dijital",
  description: "Ücretsiz online görüşme ayarla, WhatsApp'tan soru sor ya da bize e-posta gönder.",
};

// Footer yok: sayfa tek ekranlık bir karar anı; kutuların altında dikkat dağıtacak bir şey kalmasın.
export default function ContactRoute() {
  return (
    <>
      <Navbar />
      <main>
        <ContactPage />
      </main>
    </>
  );
}
