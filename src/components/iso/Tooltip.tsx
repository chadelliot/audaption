"use client";

/*
  The tooltip used on every building block.

  Built rather than borrowed from the browser: a `title` attribute can't be
  styled, can't be reached from a keyboard, and never appears on touch. This
  opens on hover, on focus and on tap, closes on Escape, on blur and on a tap
  anywhere else, and is wired to its trigger with aria-describedby so a screen
  reader gets the description without needing the pointer at all.

  Nothing in it is required to understand the diagram — it explains a block
  that is already labelled — so it never traps focus and never blocks scroll.
*/

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface TooltipHandle {
  id: string;
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export function useTooltip(): TooltipHandle {
  const id = useId();
  const [open, setOpen] = useState(false);
  return {
    id,
    open,
    show: () => setOpen(true),
    hide: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
  };
}

/**
 * Dismisses whatever is open when the reader presses Escape or taps away.
 * One listener for the whole diagram rather than one per block.
 */
export function useDismiss(onDismiss: () => void, active: boolean) {
  const ref = useRef(onDismiss);

  useEffect(() => {
    ref.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ref.current();
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.("[data-tip-trigger]")) ref.current();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active]);
}

/**
 * The bubble itself, drawn inside the SVG so it shares the drawing's
 * coordinate space and scales with it. Placed above the block by default and
 * flipped below when there isn't room.
 */
export function TooltipBubble({
  id,
  open,
  x,
  y,
  text,
  width = 340,
  flip = false,
}: {
  id: string;
  open: boolean;
  x: number;
  y: number;
  text: string;
  width?: number;
  flip?: boolean;
}) {
  /* Wrapped by hand: foreignObject would inherit page styles unpredictably
     inside an SVG that is already being scaled. */
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  const max = Math.floor(width / 9.4);
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      lines.push(cur.trim());
      cur = w;
    } else cur = `${cur} ${w}`;
  }
  if (cur.trim()) lines.push(cur.trim());

  const pad = 16;
  const lh = 24;
  const h = lines.length * lh + pad * 2;
  const top = flip ? y + 30 : y - h - 30;

  return (
    <AnimatePresence>
      {open ? (
        <motion.g
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: flip ? -6 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: flip ? -6 : 6 }}
          transition={{ duration: 0.18 }}
          style={{ pointerEvents: "none" }}
        >
          <rect
            x={x - width / 2}
            y={top}
            width={width}
            height={h}
            fill="#262626"
            stroke="#262626"
          />
          <path
            d={
              flip
                ? `M${x - 7} ${top} L${x} ${top - 9} L${x + 7} ${top} Z`
                : `M${x - 7} ${top + h} L${x} ${top + h + 9} L${x + 7} ${top + h} Z`
            }
            fill="#262626"
          />
          {lines.map((t, i) => (
            <text
              key={i}
              x={x}
              y={top + pad + 13 + i * lh}
              textAnchor="middle"
              className="font-sans"
              fontSize={17.6}
              fill="#f0ebe3"
            >
              {t}
            </text>
          ))}
        </motion.g>
      ) : null}
    </AnimatePresence>
  );
}
