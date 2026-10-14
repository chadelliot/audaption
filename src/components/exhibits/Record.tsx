"use client";

/*
  02 — Data: what do we actually know about each customer?

  Four records converge into one. On the left, the four ways a company gets into
  a CRM — a sales import, a web form, an event list, a support ticket — each
  with its own spelling and its own owner. Lines run from each into a single
  point and out the other side into one profile: one name, one owner, one fit
  score, and the history of all four.

  The figures add up where they should (ARR is summed, last touch is the most
  recent), so nothing was invented in the merge. The ring is the profile's fit
  against the ideal customer profile, which is what ties this chapter to the
  one before it.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, CountUp, Illustrative, Label, Reveal } from "./ui";

const SOURCES = [
  { k: "Sales import", name: "Northwind Industrial", owner: "J. Alvarez", flag: "" },
  { k: "Web form", name: "Northwind Ind. Inc.", owner: "Unassigned", flag: "no owner" },
  { k: "Event list", name: "NORTHWIND INDUSTRIAL LLC", owner: "M. Chen", flag: "" },
  { k: "Support ticket", name: "Northwind (Chicago)", owner: "R. Patel", flag: "" },
] as const;

const FIT = 92;
const R = 34;
const C = 2 * Math.PI * R;

const METRICS = [
  { k: "Duplicate accounts", before: 18, after: 2 },
  { k: "Accounts with no owner", before: 23, after: 0 },
  { k: "Required fields complete", before: 61, after: 94 },
] as const;

/* Row geometry shared by the chips and the lines that leave them. */
const ROW = 4.4; // rem
const GAP = 0.75; // rem
const total = SOURCES.length * ROW + (SOURCES.length - 1) * GAP;
const yPct = (i: number) => ((i * (ROW + GAP) + ROW / 2) / total) * 100;

export default function Record() {
  const still = usePrefersReducedMotion();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>One company · four records · one customer</Label>
        <Illustrative>Account: Northwind Industrial</Illustrative>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,15.5rem)_minmax(3rem,1fr)_minmax(0,21rem)]">
        {/* the four records */}
        <div
          className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-[var(--rec-gap)]"
          style={{ ["--rec-gap" as string]: `${GAP}rem` }}
        >
          {SOURCES.map((s, i) => (
            <Reveal key={s.k} delay={0.15 + i * 0.12}>
              <div
                className="flex flex-col justify-center border border-dashed border-[var(--line-ink-strong)] bg-white px-3.5"
                style={{ height: `${ROW}rem` }}
              >
                <p className="annot text-[0.58rem]">{s.k}</p>
                <p className="truncate text-[0.9rem] font-semibold leading-tight text-graphite">{s.name}</p>
                <p
                  className="text-[0.76rem]"
                  style={{ color: s.flag ? "var(--color-timber-ink)" : "var(--color-mute)" }}
                >
                  {s.owner}
                  {s.flag ? ` · ${s.flag}` : ""}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the lines that bring them together */}
        <div className="relative hidden min-h-[8rem] lg:block">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            {SOURCES.map((s, i) => (
              <motion.path
                key={s.k}
                d={`M0 ${yPct(i)} C 55 ${yPct(i)}, 45 50, 100 50`}
                fill="none"
                stroke="#29a587"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                initial={still ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.7 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </svg>
          <Reveal delay={1.5} className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Chip tone="solid">4 → 1</Chip>
          </Reveal>
        </div>

        {/* the profile */}
        <Reveal delay={1.4} className="h-full">
          <Card
            tone="good"
            className="flex h-full flex-col px-5 py-4"
            style={{ borderTop: "3px solid var(--color-jade)" }}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-[5.2rem] w-[5.2rem] shrink-0">
                <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
                  <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(38,38,38,0.1)" strokeWidth="7" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r={R}
                    fill="none"
                    stroke="#29a587"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    initial={still ? false : { strokeDashoffset: C }}
                    animate={{ strokeDashoffset: C * (1 - FIT / 100) }}
                    transition={{ duration: 1.1, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <span className="font-display absolute inset-0 flex items-center justify-center text-[1.55rem] leading-none text-graphite">
                  <CountUp to={FIT} delay={1.8} />
                </span>
              </div>
              <div className="min-w-0">
                <Label tone="good">Customer profile</Label>
                <p className="font-display-mixed mt-0.5 text-[1.3rem] leading-tight text-graphite">
                  Northwind Industrial, Inc.
                </p>
                <p className="mt-1 text-[0.8rem] text-slate">Tier A · fit {FIT} of 100</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[var(--line-ink)] pt-3.5">
              {[
                ["Owner", "M. Chen"],
                ["Lifecycle", "Customer · expanding"],
                ["ARR", "$246K"],
                ["Last touch", "3 days ago"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="annot text-[0.58rem]">{k}</dt>
                  <dd className="mt-0.5 text-[0.95rem] font-medium text-graphite">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto pt-3 text-[0.76rem] leading-snug text-mute">
              ARR is summed across the records that carried it; last touch is the most recent of the
              four. All four stay as history.
            </p>
          </Card>
        </Reveal>
      </div>

      <div className="grid divide-y divide-[var(--line-ink)] border border-[var(--line-ink)] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {METRICS.map((m, i) => (
          <Reveal key={m.k} delay={2.0 + i * 0.1}>
            <div className="px-5 py-3">
              <Label>{m.k}</Label>
              <p className="mt-1 flex items-baseline gap-2.5">
                <span className="font-display text-[1.1rem] leading-none text-mute line-through decoration-1">
                  {m.before}%
                </span>
                <span className="text-mute">→</span>
                <span className="font-display text-[1.9rem] leading-none text-jade-deep">
                  <CountUp from={m.before} to={m.after} delay={2.1 + i * 0.1} />%
                </span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
