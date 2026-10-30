import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/navbar";
import { NotFoundView } from "@/components/not-found/not-found-view";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı · OX Dijital",
};

// Footer yok: iletişim sayfası gibi tek ekranlık; yönlendirmeler sayfanın içinde.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <NotFoundView />
      </main>
    </>
  );
}
