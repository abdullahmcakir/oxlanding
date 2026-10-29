import { About } from "@/components/about/about";
import { Blog } from "@/components/blog/blog";
import { Cta } from "@/components/cta/cta";
import { Difference } from "@/components/difference/difference";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { Navbar } from "@/components/navbar/navbar";
import { Packages } from "@/components/packages/packages";
import { References } from "@/components/references/references";
import { Services } from "@/components/services/services";
import { Solutions } from "@/components/solutions/solutions";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Solutions />
        <Services />
        <References />
        <Difference />
        <Packages />
        <Blog />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
