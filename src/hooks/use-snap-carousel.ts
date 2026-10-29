"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Yatay snap'li kart şeridi (Hizmetler, Referanslar).
 * - `fit(görünür genişlik)`: kart genişliğini döner (ör. sağda bir kart yarım görünsün diye).
 * - `edges`: başta/sonda gezinme butonları pasifleşsin diye.
 * - `scroll(dir)`: bir kart kaydırır; hızlı art arda tıklamalarda her tıklama bir öncekinin
 *   hedefine eklenir (yoksa devam eden animasyon kesilip snap geri çeker).
 */
export function useSnapCarousel({
  fit,
  gap,
  initialWidth,
}: {
  fit: (visible: number) => number;
  gap: number;
  initialWidth: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [cardW, setCardW] = useState(initialWidth);
  const target = useRef<number | null>(null);
  const fitRef = useRef(fit);

  useEffect(() => {
    fitRef.current = fit;
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const updateEdges = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    // Görünür alan: şeridin sol iç boşluğundan ekranın sağ kenarına kadar
    const updateWidth = () => {
      const padLeft = parseFloat(getComputedStyle(el).paddingLeft);
      setCardW(fitRef.current(el.clientWidth - padLeft));
      updateEdges();
    };
    const reset = () => (target.current = null);

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    el.addEventListener("scroll", updateEdges, { passive: true });
    el.addEventListener("scrollend", reset);
    // Kullanıcı elle kaydırırsa da hedef sıfırlansın
    el.addEventListener("pointerdown", reset);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateEdges);
      el.removeEventListener("scrollend", reset);
      el.removeEventListener("pointerdown", reset);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const step = card.offsetWidth + gap;
    const max = el.scrollWidth - el.clientWidth;
    const base = target.current ?? el.scrollLeft;
    const next = Math.min(max, Math.max(0, (Math.round(base / step) + dir) * step));
    target.current = next;
    el.scrollTo({ left: next, behavior: "smooth" });
  };

  return { trackRef, edges, cardW, scroll };
}
