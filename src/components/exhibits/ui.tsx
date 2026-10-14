"use client";

/*
  The vocabulary every exhibit is built from.

  The exhibits are flat and data-led — the register of a board pack, not of a
  drawing — but they are still Audaption's: hairline rules, mono annotation,
  Anton for the numbers that matter, jade for what is healthy and timber for
  what is leaking. Timber means the same thing here as it does in the opening:
  something weak, inherited or unowned. Nothing else is allowed to use it.

  Every exhibit is an *illustrative* example, and says so in its corner. These
  are not client results. They exist so a reader can see what the work produces.
*/

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { animate, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";

export type Tone = "plain" | "good" | "leak" | "ink";

const TONE: Record<Tone, string> = {
  plain: "border-[var(--line-ink)] bg-white",
  good: "border-jade/45 bg-[rgba(41,165,135,0.06)]",
  leak: "border-[rgba(180,136,90,0.55)] bg-[rgba(180,136,90,0.09)]",
  ink: "border-graphite bg-graphite text-chalk",
};

export function Card({
  tone = "plain",
  className = "",
  children,
  style,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className={`border ${TONE[tone]} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** A mono annotation. `leak` is timber-ink, `good` is deep jade. */
export function Label({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone?: "leak" | "good" | "light";
  className?: string;
}) {
  const c =
    tone === "leak"
      ? "text-timber-ink!"
      : tone === "good"
        ? "text-jade-deep!"
        : tone === "light"
          ? "text-glass!"
          : "";
  return (
    <p className={`annot text-[0.66rem] leading-snug ${c} ${className}`}>{children}</p>
  );
}

/** The corner tag every exhibit carries. */
export function Illustrative({ children }: { children?: ReactNode }) {
  return (
    <p className="annot text-[0.62rem] text-right">
      <span className="mr-2 inline-block border border-[var(--line-ink-strong)] px-1.5 py-px">
        Illustrative
      </span>
      {children}
    </p>
  );
}

/** A small status chip. */
export function Chip({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "good" | "leak" | "solid";
}) {
  const t =
    tone === "good"
      ? "border-jade/50 text-jade-deep bg-[rgba(41,165,135,0.08)]"
      : tone === "leak"
        ? "border-[rgba(180,136,90,0.6)] text-timber-ink bg-[rgba(180,136,90,0.1)]"
        : tone === "solid"
          ? "border-jade bg-jade text-white"
          : "border-[var(--line-ink-strong)] text-slate bg-white";
  return (
    <span
      className={`font-mono inline-block whitespace-nowrap border px-2 py-[0.15rem] text-[0.62rem] uppercase leading-none tracking-[0.12em] ${t}`}
    >
      {children}
    </span>
  );
}

/** Fades and rises on mount, so a chapter's exhibit builds rather than appears. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = usePrefersReducedMotion();
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: still ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A bar that grows to its value. `pct` is 0–100. */
export function GrowBar({
  pct,
  delay = 0,
  className = "bg-jade",
}: {
  pct: number;
  delay?: number;
  className?: string;
}) {
  const still = usePrefersReducedMotion();
  return (
    <motion.div
      initial={still ? false : { width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, delay: still ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full ${className}`}
    />
  );
}

/** A number that counts up to its value as its chapter arrives. */
export function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 1.1,
  format = (v: number) => String(Math.round(v)),
}: {
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  format?: (v: number) => string;
}) {
  const still = usePrefersReducedMotion();
  const [v, setV] = useState(from);
  useEffect(() => {
    if (still) return;
    const c = animate(from, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setV,
    });
    return () => c.stop();
  }, [to, from, delay, duration, still]);
  /* Someone who asked for less motion gets the finished number, not a count. */
  return <>{format(still ? to : v)}</>;
}

/*
  Fit-to-stage.

  The exhibits are laid out at their natural size and this scales them down to
  the stage if — and only if — they would otherwise be taller than it. That is
  the guarantee the whole deck rests on: an exhibit can be made denser or wordier
  and the worst that happens is it renders a little smaller. It cannot run off
  the bottom of a 13" screen, because it is never allowed to be bigger than the
  box it was given.

  It iterates to a fixed point, because changing the scale changes the width,
  which changes the wrapping, which changes the height: at 0.8 the content is
  laid out 25% wider and comes out shorter than a single pass predicts.
*/
const MIN_SCALE = 0.62;
/* Small exhibits grow into spare room, a little, so a short one does not float. */
const MAX_SCALE = 1.18;

export function FitBox({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const last = useRef({ w: 0, h: 0, nat: 0 });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    const measure = () => {
      const W = o.clientWidth;
      const H = o.clientHeight;
      if (!W || !H) return;

      const clamp = (v: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, v));
      const heightAt = (k: number) => {
        i.style.width = `${W / k}px`;
        return Math.max(i.scrollHeight, 1);
      };

      /* Each scale changes the width, which changes the wrapping, which changes
         the height — so iterate to a fixed point rather than trusting one pass. */
      let k = 1;
      for (let n = 0; n < 6; n++) {
        const next = clamp(H / heightAt(k));
        const done = Math.abs(next - k) < 0.004;
        k = next;
        if (done) break;
      }
      /* The loop can settle a hair too large. Never leave it overflowing. */
      let guard = 0;
      while (heightAt(k) * k > H + 0.5 && k > MIN_SCALE && guard++ < 12) {
        k = Math.max(MIN_SCALE, k * 0.98);
      }
      i.style.width = `${W / k}px`;

      const nat = i.scrollHeight;
      if (last.current.w === W && last.current.h === H && Math.abs(last.current.nat - nat) < 2) return;
      last.current = { w: W, h: H, nat };
      setScale(k);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="relative h-full w-full overflow-hidden">
      <div
        ref={inner}
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/*
  A live miniature.

  Renders a real exhibit at its natural width and scales the whole thing down to
  fit a box, so a menu can show what a page is about by showing the page's own
  exhibit rather than a picture of it. It is decorative and inert: it cannot be
  focused or clicked, and it is hidden from assistive technology, because the
  link beside it already says everything it says.
*/
export function Thumb({
  children,
  natural = 1120,
  className = "",
}: {
  children: ReactNode;
  /** The width the exhibit is designed for. */
  natural?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setS(el.clientWidth / natural);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [natural]);

  return (
    <div ref={box} aria-hidden className={`pointer-events-none relative overflow-hidden ${className}`}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: natural, transform: `scale(${s})` }}
      >
        {children}
      </div>
    </div>
  );
}
