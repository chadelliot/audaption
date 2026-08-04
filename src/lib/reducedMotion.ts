"use client";

import { useSyncExternalStore } from "react";

/*
  Whether the reader has asked their OS for less motion.

  Read through useSyncExternalStore rather than an effect: the server has no
  opinion, so it renders the moving version and the client corrects on hydrate
  in one pass. Anything that animates on its own — the flow on Sheet 07 — has
  to consult this. Scroll-driven drawings do not: those only move because the
  reader moved, and the global CSS already flattens their transitions.
*/

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
