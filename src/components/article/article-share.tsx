"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Yazının sonundaki paylaşım butonları. Linki kopyala + X + LinkedIn.

export function ArticleShare({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => window.location.href;
  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const btn = "flex h-11 items-center justify-center rounded-full px-4 text-[14px] tracking-[-0.01em] transition-colors";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <button type="button" onClick={copy} className={cn(btn, "bg-[#111] text-white hover:bg-black")}>
        {copied ? "Kopyalandı" : "Linki kopyala"}
      </button>
      <button
        type="button"
        onClick={() => open(`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`)}
        className={cn(btn, "bg-white text-[#111] ring-1 ring-black/10 hover:bg-[#F5F5F5]")}
      >
        X
      </button>
      <button
        type="button"
        onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)}
        className={cn(btn, "bg-white text-[#111] ring-1 ring-black/10 hover:bg-[#F5F5F5]")}
      >
        LinkedIn
      </button>
    </div>
  );
}
