import type { Metadata } from "next";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { PackagesExplorer } from "@/components/packages-page/packages-explorer";
import { PLAN_FAQ } from "@/components/packages-page/packages-page-data";

export const metadata: Metadata = {
  title: "Paketler · OX Dijital",
  description: "Her hizmetin paketlerini tek sayfada gör: kapsam, süre ve içerik. Kesin teklif ücretsiz görüşmede.",
};

// Referanstaki kareli kâğıt zemin: başlık ve hizmet yığınlarının arkasında, aşağı doğru kaybolur
const GRID_BG = {
  backgroundImage:
    "linear-gradient(to right, rgb(0 0 0 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.045) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
  maskImage: "linear-gradient(to bottom, black 55%, transparent)",
} as const;

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <main className="relative bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]" style={GRID_BG} />
        {/* Asistan: başlık, aşama kartları ve aradaki boşluklar tek bölüm ("paketler"); içerideki hizmet listesi
            kendi işaretiyle (liste) öncelikli. Boşluklar işaretsizken asistan iki mesaj arasında gidip geliyordu. */}
        <div data-dock="paketler" className="relative px-4 pb-28 pt-[140px] md:px-[4.5vw] md:pb-36 md:pt-[170px]">
          <header className="mx-auto max-w-[900px] text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Paketler</p>
            <h1 className="mt-5 text-[clamp(40px,5vw,84px)] font-medium leading-[1.02] tracking-[-0.05em] text-[#111]">
              Hangi aşamadasın?
              <span className="block text-[#A3A3A3]">Paketin hazır.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[46ch] text-[clamp(15px,1.1vw,18px)] leading-[1.5] tracking-[-0.01em] text-neutral-500">
              Markanın bulunduğu aşamaya göre üç paket hazırladık. Tek bir hizmet arıyorsan aşağıda hepsi, ait olduğu
              aşamanın altında.
            </p>
          </header>
          <PackagesExplorer />
        </div>
        <Faq items={PLAN_FAQ} />
      </main>
      <Footer />
    </>
  );
}
