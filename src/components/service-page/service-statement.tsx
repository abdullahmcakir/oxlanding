import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";

// Referans: koyu zeminde büyük metin; kaydırdıkça harfler soluktan beyaza dolar.

export function ServiceStatement({ text }: { text: string }) {
  return (
    <section className="bg-[#111] px-4 py-32 md:px-[4.5vw] md:py-48">
      <ScrollRevealText
        as="h2"
        text={text}
        className="mx-auto max-w-[20em] text-[clamp(30px,3.4vw,64px)] font-medium leading-[1.15] tracking-[-0.04em] text-white"
      />
    </section>
  );
}
