"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

// [[n]] işareti; ardından noktalama/ek gelebilir: "[[0]]," veya "[[2]]la"
const TOKEN = /^\[\[(\d+)\]\](.*)$/;

// Kaydırdıkça harfler soluk griden koyuya sırayla dolar.
// Metne [[0]], [[1]] ... yazılırsa o noktaya `slots` dizisindeki öğe gömülür
// (ör. etkileşimli anahtar kelime); öğe de sırası gelince belirir.
export function ScrollRevealText({
  text,
  slots = [],
  plainSlots = [],
  as: Tag = "p",
  className,
}: {
  text: string;
  slots?: React.ReactNode[];
  /** Ekran okuyucular için slotların düz metin karşılığı */
  plainSlots?: string[];
  /** Bölüm başlığı olarak kullanılacaksa "h2". */
  as?: "p" | "h2";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");
  // Slot ilerleme hesabında 1 karakter + eki kadar sayılır
  const lengths = words.map((w) => {
    const t = TOKEN.exec(w);
    return t ? 1 + t[2].length : w.length;
  });
  const total = lengths.reduce((a, b) => a + b, 0) + words.length - 1;
  // Her kelimenin metindeki başlangıç indeksi
  const starts = lengths.map((_, wi) =>
    lengths.slice(0, wi).reduce((sum, l) => sum + l + 1, 0),
  );
  const plainText = words
    .map((w) => {
      const t = TOKEN.exec(w);
      return t ? (plainSlots[Number(t[1])] ?? "") + t[2] : w;
    })
    .join(" ");

  const chars = (str: string, from: number) =>
    Array.from(str).map((char, ci) => {
      const i = from + ci;
      return (
        <Char key={ci} progress={scrollYProgress} range={[i / total, (i + 1) / total]}>
          {char}
        </Char>
      );
    });

  return (
    <Tag ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{plainText}</span>
      <span aria-hidden>
        {words.map((word, wi) => {
          const start = starts[wi];
          const token = TOKEN.exec(word);
          return (
            // Kelime içinde satır kırılmasın
            <span key={wi} className="inline-block whitespace-nowrap">
              {token ? (
                <>
                  <Slot progress={scrollYProgress} range={[start / total, (start + 1) / total]}>
                    {slots[Number(token[1])]}
                  </Slot>
                  {chars(token[2], start + 1)}
                </>
              ) : (
                chars(word, start)
              )}
              {wi < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

function Char({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function Slot({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
