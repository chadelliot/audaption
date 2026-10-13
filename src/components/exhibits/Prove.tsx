"use client";

/*
  08 — Strategy: how do we know it is working?

  The consolidated version. Not three ways of crediting the same sale, but the
  answer they converge on: each channel's return as a *range*, against the one
  number everybody agreed to hold themselves to.

  The dot is the modelled return, reconciled so the credit adds up to what
  finance booked. The bar is the spread between honest methods — first touch,
  last touch and the model — so a wide bar means "we do not know this channel
  well", and a bar that sits wholly right of the target line means we do. That
  is the thing a board can act on, and it uses one colour: the only question is
  whether a channel clears the line.

  The channels and their returns are the same four as the Fund chapter, so the
  two read as one argument: that chapter says where the next dollar goes, this
  one says how sure we are about the last one.
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

const verdict = (c: (typeof CHANNELS)[number]) =>
  c.lo >= TARGET
    ? { label: "Clears target", tone: "solid" as const }
    : { label: "Not yet certain", tone: "plain" as const };

const pos = (v: number) => `${(v / MAX) * 100}%`;

export default function Prove() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Return on spend, reconciled to finance · a range, not a verdict</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Reconciled to finance", <>$<CountUp to={CREDIT / 1000} delay={0.2} format={(v) => v.toFixed(2)} />M</>],
          ["Spend", <>${SPEND}K</>],
          ["Blended return", <><CountUp to={CREDIT / SPEND} delay={0.3} format={(v) => v.toFixed(1)} />×</>],
        ].map(([k, v], i) => (
          <Reveal key={String(k)} delay={i * 0.08}>
            <Card className="px-4 py-3">
              <Label>{k}</Label>
              <p className="font-display mt-1 text-[1.9rem] leading-none text-graphite">{v}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* phones: each channel on its own, with the bar under its name */}
      <Card className="divide-y divide-[var(--line-ink)] px-4 lg:hidden">
        {CHANNELS.map((c) => {
          const v = verdict(c);
          return (
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
                  className="absolute top-1/2 h-3 -translate-y-1/2 bg-jade/35"
                  style={{ left: pos(c.lo), width: `calc(${pos(c.hi)} - ${pos(c.lo)})` }}
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
                <Chip tone={v.tone}>{v.label}</Chip>
              </div>
            </div>
          );
        })}
      </Card>

      <Card className="hidden px-5 pb-4 pt-4 lg:block">
        <div className="grid grid-cols-[8.5rem_minmax(0,1fr)_11.25rem] items-end gap-x-4 pb-2">
          <Label>Channel</Label>
          <div className="relative h-4">
            {[0, 2, 4, 6, 8, 10].map((t) => (
              <span
                key={t}
                className="annot absolute -translate-x-1/2 text-[0.6rem]"
                style={{ left: pos(t) }}
              >
                {t}×
              </span>
            ))}
          </div>
          <div />
        </div>

        <div className="relative">
          {/* the target line, through every row */}
          <div className="pointer-events-none absolute inset-y-0 left-[calc(8.5rem+1rem)] right-[calc(11.25rem+1rem)]">
            <div className="absolute inset-y-0 border-l-2 border-dashed border-graphite/55" style={{ left: pos(TARGET) }}>
              <span className="annot absolute -top-0.5 left-1.5 whitespace-nowrap bg-white px-1 text-[0.58rem]">
                Target {TARGET}×
              </span>
            </div>
          </div>

          {CHANNELS.map((c, i) => {
            const v = verdict(c);
            return (
              <Reveal key={c.k} delay={0.5 + i * 0.12}>
                <div className="grid grid-cols-[8.5rem_minmax(0,1fr)_11.25rem] items-center gap-x-4 border-t border-[var(--line-ink)] py-3.5">
                  <div>
                    <p className="text-[0.95rem] font-medium leading-tight text-graphite">{c.k}</p>
                    <p className="text-[0.74rem] text-mute">${c.spend}K a month</p>
                  </div>
                  <div className="relative h-5">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[rgba(38,38,38,0.1)]" />
                    <motion.div
                      className="absolute top-1/2 h-3 -translate-y-1/2 bg-jade/35"
                      style={{ left: pos(c.lo), width: `calc(${pos(c.hi)} - ${pos(c.lo)})`, transformOrigin: "left" }}
                      initial={still ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.span
                      className="absolute top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-graphite"
                      style={{ left: pos(c.point) }}
                      initial={still ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[1.3rem] leading-none text-graphite">
                      {c.point.toFixed(1)}×
                    </span>
                    <Chip tone={v.tone}>{v.label}</Chip>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Card>

      <Reveal delay={1.7}>
        <p className="text-[0.84rem] leading-snug text-mute">
          ● reconciled return · ▬ spread across first-touch, last-touch and modelled credit. Added
          up, the platforms report ${(CREDIT * 1.38 / 1000).toFixed(2)}M: 138% of what finance booked.
        </p>
      </Reveal>
    </div>
  );
}
