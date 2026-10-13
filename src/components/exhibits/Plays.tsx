"use client";

/*
  08 — Where to invest.

  The scenario is two plays and one total. Each play is a full card — who it
  targets, what it says, where the money goes, how it hands off to a seller, and
  what it returns — because a play without a handoff is only a campaign. The
  dark bar underneath is the sum, and it carries the sentence that keeps the
  exhibit honest: directional, not a forecast.
*/

import { Card, Chip, GrowBar, Illustrative, Label, Reveal } from "./ui";

const PLAYS = [
  {
    name: "Enterprise",
    badge: "Bigger prize",
    motion: "Increase revenue",
    target: "26 open accounts · $14.8M headroom",
    message: "Outcomes and supplier consolidation",
    mix: [
      ["Paid media", 36],
      ["ABM", 36],
      ["Events", 14],
      ["Email", 14],
    ] as [string, number][],
    handoff: "A multi-contact engagement signal, then a senior seller builds a multi-thread plan",
    budget: "$90K",
    pipeline: "$1.0M",
    revenue: "$370K",
    ret: "4.1×",
    tone: "good" as const,
  },
  {
    name: "Mid-market",
    badge: "Faster return",
    motion: "Grow market share",
    target: "138 open accounts · $5.2M headroom",
    message: "Speed, simplicity and reliable service",
    mix: [
      ["Paid media", 56],
      ["SDR outreach", 20],
      ["Workshops", 12],
      ["Email", 12],
    ] as [string, number][],
    handoff: "An MQL reaches the SQL threshold on a funding signal, then seller-led outreach",
    budget: "$60K",
    pipeline: "$0.8M",
    revenue: "$280K",
    ret: "4.7×",
    tone: "good" as const,
  },
];

const SHADE = ["bg-jade", "bg-jade/65", "bg-jade/40", "bg-jade/25"];

export default function Plays() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>$150K · two plays · one review at day 90</Label>
        <Illustrative>Directional scenario, not a forecast</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PLAYS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <Card className="relative flex h-full flex-col px-5 pb-4 pt-5" style={{ borderTop: "3px solid var(--color-jade)" }}>
              <div className="absolute right-4 top-0 -translate-y-1/2">
                <Chip tone="solid">{p.badge}</Chip>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display-mixed text-[1.6rem] leading-none text-graphite">{p.name}</p>
                <Label>{p.motion}</Label>
              </div>

              <dl className="mt-3 space-y-2 text-[0.88rem] leading-snug">
                <Fact k="Target" v={p.target} />
                <Fact k="Message" v={p.message} />
              </dl>

              <div className="mt-3">
                <div className="flex h-5 overflow-hidden">
                  {p.mix.map(([k, w], n) => (
                    <div key={k} style={{ width: `${w}%` }} className="h-full">
                      <GrowBar pct={100} delay={0.2 + n * 0.08} className={SHADE[n]} />
                    </div>
                  ))}
                </div>
                <div className="font-mono mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.62rem] uppercase tracking-[0.08em] text-mute">
                  {p.mix.map(([k, w], n) => (
                    <span key={k} className="flex items-center gap-1">
                      <span className={`inline-block h-2 w-2 ${SHADE[n]}`} />
                      {k} {w}%
                    </span>
                  ))}
                </div>
              </div>

              <dl className="mt-3 text-[0.88rem] leading-snug">
                <Fact k="Handoff" v={p.handoff} />
              </dl>

              <div className="mt-auto grid grid-cols-2 gap-px bg-[var(--line-ink)] pt-0 sm:grid-cols-4">
                {[
                  ["Budget", p.budget],
                  ["Pipeline", p.pipeline],
                  ["Revenue", p.revenue],
                  ["Return", p.ret],
                ].map(([k, v], n) => (
                  <div
                    key={k}
                    className="px-3 py-2.5"
                    style={{ background: n === 3 ? "rgba(41,165,135,0.09)" : "#fff" }}
                  >
                    <Label>{k}</Label>
                    <p
                      className="font-display mt-1 text-[1.35rem] leading-none"
                      style={{ color: n === 3 ? "var(--color-jade-deep)" : "var(--color-graphite)" }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.35}>
        <Card tone="ink" className="grid grid-cols-2 sm:grid-cols-4">
          {[
            ["Invested", "$150K"],
            ["Est. pipeline", "$1.8M"],
            ["Est. revenue", "$650K"],
            ["Blended return", "4.3×  vs 3.8× today"],
          ].map(([k, v]) => (
            <div key={k} className="px-5 py-3">
              <Label tone="light">{k}</Label>
              <p className="font-display mt-1 text-[1.5rem] leading-none text-chalk">{v}</p>
            </div>
          ))}
        </Card>
      </Reveal>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[4.2rem_minmax(0,1fr)] gap-2">
      <dt className="annot pt-0.5 text-[0.6rem]">{k}</dt>
      <dd className="text-graphite">{v}</dd>
    </div>
  );
}
