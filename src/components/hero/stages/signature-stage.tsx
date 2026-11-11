"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OX_OUTLINE } from "./ox-outline";
import type { SignatureEngine } from "./signature-engine";

export const SIGNATURE_WORDS = ["Marka", "Yazılım", "Tasarım", "Website"];
const CHAPTERS = ["Kimlik", "Sistem", "Tasarım", "Deneyim"];
const PATH = OX_OUTLINE.map((points) => `M${Array.from({ length: points.length / 2 }, (_, i) => `${120 + points[i * 2] * 100},${120 - points[i * 2 + 1] * 100}`).join("L")}Z`).join("");

export function SignatureStage({ onWord, className }: { onWord?: (index: number) => void; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SignatureEngine | null>(null);
  const onWordRef = useRef(onWord);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => { onWordRef.current = onWord; });
  useEffect(() => {
    let cancelled = false;
    import("./signature-engine").then(({ createSignatureEngine }) => {
      if (cancelled || !canvasRef.current) return;
      engineRef.current = createSignatureEngine(canvasRef.current, (next) => { setChapter(next); onWordRef.current?.(next); });
      setReady(true);
    }).catch(() => { /* Static vector cover stays visible when WebGL is unavailable. */ });
    return () => { cancelled = true; engineRef.current?.dispose(); engineRef.current = null; };
  }, []);
  useEffect(() => { engineRef.current?.pause(paused); }, [paused, ready]);

  return (
    <div className={cn("overflow-hidden bg-[#07080b]", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_44%,#172235_0%,#0c1018_28%,#07080b_58%)]" />
      <div className="absolute inset-x-3 top-[74px] h-[39svh] lg:inset-x-auto lg:bottom-[21%] lg:left-[45%] lg:right-[1%] lg:top-[12%] lg:h-auto">
        <div aria-hidden className="pointer-events-none absolute bottom-[7%] left-[25%] h-[7%] w-[50%] rounded-[100%] bg-black/40 blur-xl" />
        <svg aria-hidden viewBox="0 0 240 240" className={cn("absolute inset-0 size-full p-[10%] transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}>
          <defs><linearGradient id="signature-cover" x1="0" y1="0" x2=".7" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#ecf0f8" /><stop offset=".42" stopColor="#8894ac" /><stop offset=".53" stopColor="#323e56" /><stop offset="1" stopColor="#cad8ee" /></linearGradient></defs>
          <path d={PATH} fill="url(#signature-cover)" fillRule="evenodd" />
        </svg>
        <canvas ref={canvasRef} aria-hidden className={cn("relative block size-full transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")} />
      </div>
      <div aria-hidden className="absolute right-[5.5%] top-[15%] hidden font-mono text-[9px] tracking-[.18em] text-white/30 lg:block">OX / FORM STUDIES</div>
      <div className="absolute bottom-[16%] left-[51%] right-[6%] z-30 hidden lg:block">
        <div className="mb-5 flex items-center justify-between text-[11px] text-white/45"><span>Tek bir fikir. Birçok ifade.</span><span className="font-mono text-[9px]">0{chapter + 1} / 04</span></div>
        <div className="flex gap-1 border-t border-white/15 pt-3">
          {CHAPTERS.map((label, index) => <button key={label} disabled={!ready} type="button" aria-pressed={chapter === index} onClick={() => engineRef.current?.select(index)} className={cn("flex-1 py-2 text-left text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400", chapter === index ? "text-white" : "text-white/35 hover:text-white/75")}><span className={cn("mr-2 inline-block size-1 rounded-full", chapter === index ? "bg-[#82a6ff]" : "bg-white/20")} />{label}</button>)}
        </div>
      </div>
      {ready && <button type="button" aria-label={paused ? "Hero animasyonunu oynat" : "Hero animasyonunu duraklat"} aria-pressed={paused} onClick={() => setPaused(!paused)} className="absolute right-5 top-[90px] z-30 grid size-10 place-items-center rounded-full border border-white/15 text-xs text-white/60 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-400 lg:right-[6%] lg:top-[22%]">{paused ? "▶" : "Ⅱ"}</button>}
    </div>
  );
}
