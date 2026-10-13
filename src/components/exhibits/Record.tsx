"use client";

/*
  02 — Data: what do we actually know about each customer?

  Four records for one company, and what they become. The four are deliberately
  ordinary: a sales import, a web form, an event list, a support ticket — the
  four ways a company gets into a CRM — each with its own spelling, owner,
  revenue and last-touch date. Merged, they are one record with one owner and
  one lifecycle stage, and the figures add up where they should (ARR is summed,
  last touch is the most recent) so the reader can see that nothing was invented
  in the merge. The three before/after tiles say what that does across the whole
  database, not just this account.
*/

import { Card, Chip, CountUp, GrowBar, Illustrative, Label, Reveal } from "./ui";

const RECORDS = [
  { name: "Northwind Industrial", src: "Sales import", owner: "J. Alvarez", arr: "$182K", touch: "14 months ago" },
  { name: "Northwind Ind. Inc.", src: "Web form", owner: "Unassigned", arr: "–", touch: "3 days ago" },
  { name: "NORTHWIND INDUSTRIAL LLC", src: "Event list", owner: "M. Chen", arr: "$64K", touch: "8 months ago" },
  { name: "Northwind (Chicago)", src: "Support ticket", owner: "R. Patel", arr: "$0", touch: "31 days ago" },
] as const;

const METRICS = [
  { k: "Duplicate accounts", before: 18, after: 2, unit: "%" },
  { k: "Accounts with no owner", before: 23, after: 0, unit: "%" },
  { k: "Required fields complete", before: 61, after: 94, unit: "%", up: true },
] as const;

export default function Record() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>One company · four records · one customer</Label>
        <Illustrative>Account: Northwind Industrial</Illustrative>
      </div>

      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)]">
        <div className="grid gap-2 sm:grid-cols-2">
          {RECORDS.map((r, i) => (
            <Reveal key={r.name} delay={0.2 + i * 0.14} className="h-full">
              <Card className="h-full px-3.5 py-3" style={{ borderStyle: "dashed" }}>
                <p className="text-[0.9rem] font-semibold leading-tight text-graphite">{r.name}</p>
                <Label className="mt-0.5">{r.src}</Label>
                <dl className="mt-2.5 space-y-1 text-[0.82rem]">
                  <Line k="Owner" v={r.owner} bad={r.owner === "Unassigned"} />
                  <Line k="ARR" v={r.arr} />
                  <Line k="Last touch" v={r.touch} />
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={1.0} className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 px-1 text-mute">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em]">Merge</span>
            <span aria-hidden className="text-[1.8rem] leading-none">→</span>
          </div>
        </Reveal>

        <Reveal delay={1.2} className="h-full">
          <Card tone="good" className="flex h-full flex-col px-5 py-4" style={{ borderTop: "3px solid var(--color-jade)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label tone="good">Customer record</Label>
                <p className="font-display-mixed mt-1 text-[1.5rem] leading-none text-graphite">
                  Northwind Industrial, Inc.
                </p>
              </div>
              <Chip tone="solid">4 → 1</Chip>
            </div>
            <dl className="mt-4 space-y-1.5 text-[0.9rem]">
              <Line k="Owner" v="M. Chen" />
              <Line k="Fit" v="Tier A · 92 of 100" />
              <Line k="Lifecycle" v="Customer · expanding" />
              <Line k="ARR" v="$246K" />
              <Line k="Last touch" v="3 days ago" />
              <Line k="Sources kept" v="All four, as history" />
            </dl>
            <p className="mt-auto pt-3 text-[0.78rem] leading-snug text-mute">
              ARR is the sum of the records that carried it. Last touch is the most recent of the
              four. Nothing is added in the merge.
            </p>
          </Card>
        </Reveal>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {METRICS.map((m, i) => (
          <Reveal key={m.k} delay={1.7 + i * 0.1}>
            <Card className="px-4 py-3">
              <Label>{m.k}</Label>
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="font-display text-[1.2rem] leading-none text-mute line-through decoration-1">
                  {m.before}
                  {m.unit}
                </span>
                <span className="text-mute">→</span>
                <span className="font-display text-[1.9rem] leading-none text-jade-deep">
                  <CountUp from={m.before} to={m.after} delay={1.8 + i * 0.1} />
                  {m.unit}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-[rgba(38,38,38,0.1)]">
                <GrowBar pct={("up" in m ? m.after : 100 - m.after) } delay={1.9 + i * 0.1} className="bg-jade" />
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Line({ k, v, bad }: { k: string; v: string; bad?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="annot text-[0.6rem]">{k}</dt>
      <dd className="text-right" style={{ color: bad ? "var(--color-timber-ink)" : "var(--color-graphite)" }}>
        {v}
      </dd>
    </div>
  );
}
