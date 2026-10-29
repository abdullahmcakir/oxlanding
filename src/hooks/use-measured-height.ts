"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Elemanın yüksekliğini canlı ölçer; height: auto animasyonu için.
export function useMeasuredHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, height] as const;
}
