"use client";

/*
  02 — Where to compete.

  Four segments, ranked. The top two carry a jade rule because the argument is
  that one or two are worth the money; the other two are present and visibly
  secondary. Each card ends in the open pool and how much of it is already held,
  because a segment's size means nothing without the room left in it — which is
  the difference between a national ranking and a plan.
*/

import { Card, Chip, GrowBar, Illustrative, Label, Reveal } from "./ui";

const SEGMENTS = [
  {
    rank: 1,
    name: "Enterprise",
    verdict: "Increase",
    acv: "$300K–$1.2M",
    cycle: "7–10 months",
    buyers: "C-suite + procurement",
    expand: 4,
    open: "$14.8M",
    held: 24,
  },
  {
    rank: 2,
    name: "Growth",
    verdict: "Increase",
    acv: "$60K–$300K",
    cycle: "3–5 months",
    buyers: "VP + category owner",
    expand: 3,
    open: "$9.1M",
    held: 33,
  },
  {
    rank: 3,
    name: "Mid-market",
    verdict: "Maintain",
    acv: "$12K–$60K",
    cycle: "4–8 weeks",
    buyers: "Manager + operations",
    expand: 2,
    open: "$5.2M",
    held: 46,
  },
  {
    rank: 4,
    name: "Emerging",
    verdict: "Selective",
    acv: "Under $12K",
    cycle: "2–4 weeks",
    buyers: "Owner-operator",
    expand: 1,
    open: "$1.3M",
    held: 52,
  },
] as const;

export default function Segments() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>Four segments · ranked by deal size, cycle and room to expand</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SEGMENTS.map((s, i) => {
          const top = s.rank <= 2;
          return (
            <Reveal key={s.name} delay={i * 0.07} className="h-full">
              <Card
                tone="plain"
                className="relative flex h-full flex-col px-4 pb-4 pt-5"
                style={{ borderTop: top ? "3px solid var(--color-jade)" : undefined }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="font-mono flex h-6 w-6 items-center justify-center text-[0.75rem]"
                      style={{
                        background: top ? "var(--color-jade)" : "transparent",
                        color: top ? "#fff" : "var(--color-slate)",
                        border: top ? "none" : "1px solid var(--line-ink-strong)",
                      }}
                    >
                      {s.rank}
                    </span>
                    <span className="font-display-mixed text-[1.35rem] leading-none text-graphite">
                      {s.name}
                    </span>
                  </span>
                  <Chip tone={s.verdict === "Increase" ? "good" : s.verdict === "Selective" ? "leak" : "plain"}>
                    {s.verdict}
                  </Chip>
                </div>

                <p className="font-display mt-4 text-[1.75rem] leading-none text-graphite">
                  {s.acv}
                </p>
                <Label className="mt-1">Typical deal size (ACV)</Label>

                <dl className="mt-4 space-y-2.5 border-t border-[var(--line-ink)] pt-3 text-[0.88rem]">
                  <Row k="Sales cycle" v={s.cycle} />
                  <Row k="Buyers" v={s.buyers} />
                  <div className="flex items-center justify-between gap-3">
                    <dt className="annot text-[0.62rem]">Expansion</dt>
                    <dd className="flex gap-1" aria-label={`${s.expand} of 4`}>
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          key={n}
                          className="h-1.5 w-5"
                          style={{
                            background: n <= s.expand ? "var(--color-jade)" : "rgba(38,38,38,0.12)",
                          }}
                        />
                      ))}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4">
                  <div className="flex items-baseline justify-between">
                    <Label>Open pool</Label>
                    <p className="font-display text-[1.15rem] leading-none text-graphite">
                      {s.open}
                    </p>
                  </div>
                  <div className="mt-2 flex h-2 bg-[rgba(38,38,38,0.1)]">
                    <GrowBar pct={s.held} delay={0.3 + i * 0.07} className="bg-graphite/55" />
                  </div>
                  <p className="mt-1 text-[0.74rem] text-mute">{s.held}% of accounts already held</p>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <p className="annot text-[0.66rem]">
        One or two segments are worth the money. A national ranking is the start of a
        plan, not the plan.
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="annot text-[0.62rem]">{k}</dt>
      <dd className="text-right text-graphite">{v}</dd>
    </div>
  );
}
