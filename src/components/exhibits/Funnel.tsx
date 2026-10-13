"use client";

/*
  04 — Where growth leaks.

  The funnel as seven stage tiles with the conversion between each one printed
  on the join. Everything is calm except one place, which is timber and larger:
  the step from opportunity to closed-won. Below it the three cards read as a
  sentence — this is the bottleneck, this is the fix, this is what it is worth —
  so the exhibit ends on a decision and not on a chart.
*/

import { Card, Illustrative, Label, Reveal } from "./ui";

const STAGES = [
  { k: "Market reach", v: "1.8M", s: "Impressions" },
  { k: "Leads", v: "9,600", s: "Accounts", c: "0.5%" },
  { k: "MQL", v: "2,880", s: "30% of leads", c: "30%" },
  { k: "SQL", v: "980", s: "34% convert", c: "34%" },
  { k: "Opportunity", v: "540", s: "55% convert", c: "55%" },
  { k: "Closed-won", v: "146", s: "27% win rate", c: "27%", leak: true },
  { k: "Revenue", v: "$31.4M", s: "Trailing 12 months" },
];

export default function Funnel() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>Qualified opportunity is not the problem · deals are lost late</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[var(--line-ink)] sm:grid-cols-4 lg:grid-cols-7">
        {STAGES.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.06}>
            <div
              className="relative h-full px-3.5 py-3.5"
              style={{
                background: s.leak ? "rgba(180,136,90,0.12)" : "#fff",
                boxShadow: s.leak ? "inset 0 3px 0 var(--color-timber)" : undefined,
              }}
            >
              <Label tone={s.leak ? "leak" : undefined}>{s.k}</Label>
              <p
                className="font-display mt-1.5 leading-none text-graphite"
                style={{ fontSize: s.leak ? "2.1rem" : "1.7rem" }}
              >
                {s.v}
              </p>
              <p
                className="mt-1.5 text-[0.78rem]"
                style={{ color: s.leak ? "var(--color-timber-ink)" : "var(--color-mute)" }}
              >
                {s.s}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Reveal delay={0.5} className="h-full">
          <Card tone="leak" className="h-full px-4 py-3.5">
            <Label tone="leak">Primary bottleneck</Label>
            <p className="mt-1.5 text-[1rem] font-medium leading-snug text-graphite">
              Opportunity → closed-won, at a 27% win rate
            </p>
          </Card>
        </Reveal>
        <Arrow />
        <Reveal delay={0.6} className="h-full">
          <Card className="h-full px-4 py-3.5">
            <Label>Highest-leverage fix</Label>
            <p className="mt-1.5 text-[1rem] font-medium leading-snug text-graphite">
              Win-rate enablement on active deals: multi-threading and timing by signal
            </p>
          </Card>
        </Reveal>
        <Arrow />
        <Reveal delay={0.7} className="h-full">
          <Card tone="ink" className="h-full px-4 py-3.5">
            <Label tone="light">Expected lift</Label>
            <p className="mt-1.5 text-[1rem] font-medium leading-snug">
              +38 deals, about $8M at the 34% target
            </p>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

const Arrow = () => (
  <div aria-hidden className="hidden items-center text-[1.3rem] text-mute lg:flex">
    →
  </div>
);
