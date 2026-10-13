"use client";

/*
  04 — Experience: what does each touchpoint say to each buyer?

  One address, two visitors, and almost nothing else. An earlier version of this
  exhibit carried a row of "signals read on arrival", placeholder content blocks,
  variant tags and a separate results line, and the argument got lost in the
  furniture. This keeps only what makes the point: the same page opens with a
  different first thing for a different buyer, there is a rule that says which,
  and it measurably did better.
*/

import { Card, Illustrative, Label, Reveal } from "./ui";

const VARIANTS = [
  {
    who: "Enterprise buyers",
    eyebrow: "For multi-site operations",
    head: "One partner for every site.",
    sub: "Fewer vendors, lower risk and a clear ROI your finance team can sign off.",
    cta: "See the multi-site case study",
    rule: "Company over 1,000 staff, or viewed the security page",
    rate: "3.1%",
    base: "1.8%",
  },
  {
    who: "Mid-market buyers",
    eyebrow: "For growing teams",
    head: "Orders in by noon. On the truck this week.",
    sub: "Simple ordering, reliable service and one number to call.",
    cta: "Get a quote in two minutes",
    rule: "Company under 1,000 staff, or arrived from a pricing search",
    rate: "4.4%",
    base: "2.6%",
  },
];

export default function Website() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The same page, opening two ways</Label>
        <Illustrative>yourcompany.com/solutions</Illustrative>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {VARIANTS.map((v, i) => (
          <Reveal key={v.who} delay={i * 0.12} className="h-full">
            <Card className="flex h-full flex-col">
              <div className="flex-1 px-7 pb-6 pt-7">
                <Label tone="good">{v.eyebrow}</Label>
                <p className="font-display-mixed mt-3 text-[2.15rem] leading-[1.05] text-graphite">
                  {v.head}
                </p>
                <p className="mt-3 max-w-[27rem] text-[1rem] leading-snug text-slate">{v.sub}</p>
                <p className="font-mono mt-6 inline-block bg-jade px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.12em] text-white">
                  {v.cta} →
                </p>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-t border-[var(--line-ink)] bg-[rgba(41,165,135,0.05)] px-7 py-4">
                <div>
                  <Label>Shown to {v.who.toLowerCase()}</Label>
                  <p className="mt-1 text-[0.86rem] leading-snug text-slate">
                    If {v.rule.charAt(0).toLowerCase() + v.rule.slice(1)}
                  </p>
                </div>
                <p className="text-right">
                  <span className="font-display text-[1.9rem] leading-none text-jade-deep">{v.rate}</span>
                  <span className="mt-0.5 block text-[0.74rem] text-mute">vs {v.base} on the default</span>
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
