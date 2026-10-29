"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {/* "Hareketi azalt" tercihi açık kullanıcılarda transform animasyonları kapanır */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
