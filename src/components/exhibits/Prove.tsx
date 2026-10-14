"use client";

/*
  08 — Strategy: how do we know it is working?

  The consolidated version. Not three ways of crediting the same sale, but the
  answer they converge on, in two pieces. First one number: the blended return,
  on a dial, against the line everybody agreed to hold themselves to. Then each
  channel as a range against that same line, on a field split in two — below the
  target and clearing it — so the answer is a position on the page before it is
  a number.

  The dot is the modelled return, reconciled so the credit adds up to what
  finance booked. The bar is the spread across honest methods (first touch, last
  touch and the model): a short bar means we know the channel well, a long one
  means we do not, and a bar sitting wholly in the green is a channel that
  clears the target whichever way you count it.

  The channels are the same four as the Fund chapter, so the two read as one
  argument: that chapter says where the next dollar goes, this one says how sure
  we are about the last one.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, CountUp, Illustrative, Label, Reveal } from "./ui";

const TARGET = 3;
const MAX = 10;

/** Return on spend (×): reconciled point, and the spread across methods. */
const CHANNELS = [
  { k: "Paid search", spend: 90, point: 8.0, lo: 5.9, hi: 8.9 },
  { k: "Paid social", spend: 40, point: 6.0, lo: 3.2, hi: 7.4 },
  { k: "Online video", spend: 60, point: 3.3, lo: 1.8, hi: 4.1 },
  { k: "Display", spend: 30, point: 3.5, lo: 1.5, hi: 4.3 },
] as const;

const SPEND = CHANNELS.reduce((s, c) => s + c.spend, 0);
const CREDIT = CHANNELS.reduce((s, c) => s + c.spend * c.point, 0);
const BLENDED = CREDIT / SPEND;

const clears = (c: (typeof CHANNELS)[number]) => c.lo >= TARGET;
const pos = (v: number) => `${(v / MAX) * 100}%`;

/* the dial */
const R = 46;
const ARC = Math.PI * R; // a half circle
const ang = (v: number) => Math.PI * (1 - v / MAX); // 0 → left, MAX → right
const pt = (v: number, r: number) => ({
  x: 60 + r * Math.cos(ang(v)),
  y: 62 - r * Math.sin(ang(v)),
});

export default function Prove() {
  const still = usePrefersReducedMotion();
  const t0 = pt(TARGET, R - 9);
  const t1 = pt(TARGET, R + 9);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Return on spend, reconciled to finance · a range, not a verdict</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* the one number */}
      <Reveal>
        <Card className="grid items-center gap-x-8 gap-y-3 px-6 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <div className="relative mx-auto h-[5.6rem] w-[9.2rem]">
            <svg viewBox="0 0 120 72" className="h-full w-full" aria-hidden>
              <path
                d={`M ${60 - R} 62 A ${R} ${R} 0 0 1 ${60 + R} 62`}
                fill="none"
                stroke="rgba(38,38,38,0.1)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <motion.path
                d={`M ${60 - R} 62 A ${R} ${R} 0 0 1 ${60 + R} 62`}
                fill="none"
                stroke="#29a587"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={ARC}
                initial={still ? false : { strokeDashoffset: ARC }}
                animate={{ strokeDashoffset: ARC * (1 - BLENDED / MAX) }}
                transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <line x1={t0.x} y1={t0.y} x2={t1.x} y2={t1.y} stroke="#262626" strokeWidth="2" />
            </svg>
            <p className="font-display absolute inset-x-0 bottom-0 text-center text-[1.9rem] leading-none text-graphite">
              <CountUp to={BLENDED} delay={0.4} format={(v) => v.toFixed(1)} />×
            </p>
          </div>
          <div>
            <Label>Blended return on ${SPEND}K a month</Label>
            <p className="font-display-mixed mt-1 text-[1.45rem] leading-tight text-graphite">
              ${(CREDIT / 1000).toFixed(2)}M of revenue, reconciled to what finance booked.
            </p>
            <p className="mt-1 text-[0.84rem] text-mute">
              Target {TARGET}× · the platforms, added up, report ${((CREDIT * 1.38) / 1000).toFixed(2)}M
            </p>
          </div>
          <Chip tone="solid">Clears the target</Chip>
        </Card>
      </Reveal>

      {/* phones: each channel on its own */}
      <Card className="divide-y divide-[var(--line-ink)] px-4 lg:hidden">
        {CHANNELS.map((c) => (
          <div key={c.k} className="py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[0.95rem] font-medium text-graphite">
                {c.k} <span className="text-[0.74rem] font-normal text-mute">${c.spend}K a month</span>
              </p>
              <span className="font-display text-[1.3rem] leading-none text-graphite">{c.point.toFixed(1)}×</span>
            </div>
            <div className="relative mt-2.5 h-4">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(38,38,38,0.12)]" />
              <div
                className="absolute top-1/2 h-3 -translate-y-1/2"
                style={{
                  left: pos(c.lo),
                  width: `calc(${pos(c.hi)} - ${pos(c.lo)})`,
                  background: clears(c) ? "rgba(41,165,135,0.55)" : "rgba(38,38,38,0.2)",
                }}
              />
              <span
                className="absolute top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-graphite"
                style={{ left: pos(c.point) }}
              />
              <span
                className="absolute inset-y-0 border-l-2 border-dashed border-graphite/55"
                style={{ left: pos(TARGET) }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[0.74rem] text-mute">
                {c.lo.toFixed(1)}–{c.hi.toFixed(1)}× · target {TARGET}×
              </span>
              <Chip tone={clears(c) ? "solid" : "plain"}>{clears(c) ? "Clears target" : "Not yet certain"}</Chip>
            </div>
          </div>
        ))}
      </Card>

      {/* desktop: the range chart on a split field */}
      <Card className="hidden px-5 pb-4 pt-4 lg:block">
        <div className="grid grid-cols-[8.5rem_minmax(0,1fr)_9.5rem] items-end gap-x-4 pb-2">
          <Label>Channel</Label>
          <div className="relative h-4">
            {[0, 2, 4, 6, 8, 10].map((t) => (
              <span key={t} className="annot absolute -translate-x-1/2 text-[0.6rem]" style={{ left: pos(t) }}>
                {t}×
              </span>
            ))}
          </div>
          <div />
        </div>

        <div className="relative">
          {/* the two sides of the line */}
          <div className="pointer-events-none absolute inset-y-0 left-[calc(8.5rem+1rem)] right-[calc(9.5rem+1rem)]">
            <div className="absolute inset-y-0 left-0 bg-[rgba(38,38,38,0.045)]" style={{ width: pos(TARGET) }}>
              <span className="annot absolute bottom-1 left-2 text-[0.56rem]">Below target</span>
            </div>
            <div
              className="absolute inset-y-0 bg-[rgba(41,165,135,0.07)]"
              style={{ left: pos(TARGET), right: 0 }}
            >
              <span className="annot absolute bottom-1 right-2 text-[0.56rem] text-jade-deep!">Clears</span>
            </div>
            <div className="absolute inset-y-0 border-l-2 border-graphite/70" style={{ left: pos(TARGET) }}>
              <span className="annot absolute -top-0.5 left-1.5 whitespace-nowrap bg-white px-1 text-[0.58rem] text-graphite!">
                Target {TARGET}×
              </span>
            </div>
          </div>

          {CHANNELS.map((c, i) => (
            <Reveal key={c.k} delay={0.7 + i * 0.12}>
              <div className="relative grid grid-cols-[8.5rem_minmax(0,1fr)_9.5rem] items-center gap-x-4 border-t border-[var(--line-ink)] py-3.5">
                <div>
                  <p className="text-[0.95rem] font-medium leading-tight text-graphite">{c.k}</p>
                  <p className="text-[0.74rem] text-mute">${c.spend}K a month</p>
                </div>
                <div className="relative h-6">
                  <motion.div
                    className="absolute top-1/2 h-4 -translate-y-1/2"
                    style={{
                      left: pos(c.lo),
                      width: `calc(${pos(c.hi)} - ${pos(c.lo)})`,
                      transformOrigin: "left",
                      background: clears(c) ? "rgba(41,165,135,0.6)" : "rgba(38,38,38,0.22)",
                      borderRadius: 3,
                    }}
                    initial={still ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.9 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.span
                    className="absolute top-1/2 block h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-graphite shadow"
                    style={{ left: pos(c.point) }}
                    initial={still ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[1.35rem] leading-none text-graphite">{c.point.toFixed(1)}×</span>
                  <Chip tone={clears(c) ? "solid" : "plain"}>{clears(c) ? "Clears" : "Not yet sure"}</Chip>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Card>

      <Reveal delay={1.8}>
        <p className="text-[0.82rem] leading-snug text-mute">
          ● reconciled return · ▬ spread across first-touch, last-touch and modelled credit. A bar
          wholly in the green clears the target however you count it.
        </p>
      </Reveal>
    </div>
  );
}
