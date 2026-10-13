"use client";

/*
  06 — How fast does it reach a person?

  A bar chart and a stopwatch. The bars are win rate by how long the buyer
  waited, indexed to the fastest bucket; the timber bar is where this company
  actually sits today, and the jade one is the promise. The right-hand column is
  what has to be automated to make the promise keepable, each step stamped with
  the second it should land — because the point of automation here is not
  convenience, it is that every step before the first human touch happens in
  under three minutes without anyone remembering to do it.
*/

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, CountUp, Illustrative, Label, Reveal } from "./ui";

const BUCKETS = [
  { k: "< 5 min", v: 100 },
  { k: "5–30 min", v: 78 },
  { k: "30 min – 4 hrs", v: 51, today: true },
  { k: "4–24 hrs", v: 34 },
  { k: "> 24 hrs", v: 19 },
] as const;

const STEPS = [
  { at: "0:00", k: "Buyer submits the form", auto: true },
  { at: "0:01", k: "Record matched, enriched and scored", auto: true },
  { at: "0:02", k: "Routed by segment and territory", auto: true },
  { at: "0:02", k: "Task created, response clock starts", auto: true },
  { at: "≤ 5:00", k: "First human touch", auto: false },
] as const;

export default function Route() {
  const still = usePrefersReducedMotion();
  const today = BUCKETS.find((b) => "today" in b)!;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Win rate by how long the buyer waited · indexed to the fastest</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card className="px-5 pb-4 pt-5">
          <div className="flex h-[13.5rem] items-end gap-3">
            {BUCKETS.map((b, i) => {
              const isToday = "today" in b;
              const fastest = i === 0;
              return (
                <div key={b.k} className="flex h-full flex-1 flex-col justify-end">
                  <p
                    className="font-display mb-1.5 text-center text-[1.35rem] leading-none"
                    style={{
                      color: isToday ? "var(--color-timber-ink)" : fastest ? "var(--color-jade-deep)" : "var(--color-graphite)",
                    }}
                  >
                    <CountUp to={b.v} delay={0.3 + i * 0.12} />
                  </p>
                  <motion.div
                    initial={still ? false : { height: 0 }}
                    animate={{ height: `${b.v}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: isToday ? "var(--color-timber)" : fastest ? "var(--color-jade)" : "rgba(38,38,38,0.18)",
                      maxHeight: "10.5rem",
                      boxShadow: isToday ? "inset 0 0 0 2px rgba(138,98,52,0.5)" : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-3 border-t border-[var(--line-ink-strong)] pt-2">
            {BUCKETS.map((b) => (
              <p key={b.k} className="annot flex-1 text-center text-[0.62rem] leading-tight">
                {b.k}
              </p>
            ))}
          </div>

          <Reveal delay={1.3}>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--line-ink)] pt-3">
              <Chip tone="leak">Today · median 3 hrs 12 min</Chip>
              <span className="text-mute">→</span>
              <Chip tone="solid">Promise · under 5 min</Chip>
              <span className="text-[0.84rem] text-slate">
                from an index of {today.v} to 100 on the same leads.
              </span>
            </div>
          </Reveal>
        </Card>

        <Card className="px-5 py-4">
          <Label>What has to happen on its own</Label>
          <ol className="mt-3 space-y-0">
            {STEPS.map((s, i) => (
              <Reveal key={s.k} delay={0.5 + i * 0.22}>
                <li className="relative flex gap-3.5 pb-3.5 last:pb-0">
                  {i < STEPS.length - 1 ? (
                    <span aria-hidden className="absolute left-[2.55rem] top-5 h-full w-px bg-[var(--line-ink-strong)]" />
                  ) : null}
                  <span className="font-mono w-[3.6rem] shrink-0 pt-0.5 text-right text-[0.78rem] text-mute">
                    {s.at}
                  </span>
                  <span
                    aria-hidden
                    className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2"
                    style={{
                      borderColor: s.auto ? "var(--color-jade)" : "var(--color-graphite)",
                      background: s.auto ? "var(--color-jade)" : "#fff",
                    }}
                  />
                  <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-[0.95rem] leading-snug text-graphite">{s.k}</span>
                    <Chip tone={s.auto ? "good" : "plain"}>{s.auto ? "Automated" : "A person"}</Chip>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
