"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { lenisRef } from "@/lib/lenisInstance";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Smoothing is an enhancement, never a requirement. Anyone who has asked
    // the OS for less motion keeps their browser's own scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lerp rather than duration: duration-based smoothing replays a fixed
    // animation on every wheel event, which is what reads as lag. Lerp chases
    // the target each frame, so the page starts moving on the first notch and
    // still settles smoothly.
    const lenis = new Lenis({
      lerp: 0.16,
      wheelMultiplier: 1.15,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
