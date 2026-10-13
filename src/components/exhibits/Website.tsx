"use client";

/*
  05 — The site responds.

  One address, two visitors. The strip across the top is what the site reads the
  moment someone arrives; the two wireframes are what it then shows them; the
  rule under each is the reason. Nothing here is a screenshot of a real site —
  the point is that the same page says a different first thing to a different
  buyer, and that the choice is a rule somebody wrote down.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const READ = ["Industry", "Company size", "Pages already viewed", "New or returning"];

const VARIANTS = [
  {
    tag: "Variant A",
    who: "Enterprise buyer",
    eyebrow: "For multi-site operations",
    head: "One partner for every site.",
    sub: "Fewer vendors, lower risk, and a clear ROI your finance team can sign off.",
    cta: "See the multi-site case study",
    rule: "Company over 1,000 staff, or viewed the security page",
    result: "Conversion 3.1% vs 1.8% on the default page",
  },
  {
    tag: "Variant B",
    who: "Mid-market buyer",
    eyebrow: "For growing teams",
    head: "Orders in by noon. On the truck this week.",
    sub: "Simple ordering, reliable service, and one number to call.",
    cta: "Get a quote in two minutes",
    rule: "Company under 1,000 staff, or arrived from a pricing search",
    result: "Conversion 4.4% vs 2.6% on the default page",
  },
];

export default function Website() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label>Read on arrival</Label>
          {READ.map((r) => (
            <Chip key={r}>{r}</Chip>
          ))}
        </div>
        <Illustrative>Same URL · two visitors</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {VARIANTS.map((v, i) => (
          <Reveal key={v.tag} delay={i * 0.1} className="h-full">
            <Card className="flex h-full flex-col">
              {/* a browser, flattened */}
              <div className="flex items-center gap-2 border-b border-[var(--line-ink)] px-3 py-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-2 w-2 rounded-full bg-[rgba(38,38,38,0.16)]" />
                  ))}
                </span>
                <span className="font-mono flex-1 truncate bg-[rgba(38,38,38,0.05)] px-2.5 py-1 text-[0.68rem] text-mute">
                  yourcompany.com/solutions
                </span>
                <Chip tone={i === 0 ? "solid" : "plain"}>{v.tag}</Chip>
              </div>

              <div className="flex-1 px-6 py-5">
                <Label tone="good">{v.eyebrow}</Label>
                <p className="font-display-mixed mt-2 text-[1.9rem] leading-[1.05] text-graphite">
                  {v.head}
                </p>
                <p className="mt-2 max-w-[28rem] text-[0.92rem] leading-snug text-slate">
                  {v.sub}
                </p>
                <p className="font-mono mt-4 inline-block bg-jade px-4 py-2 text-[0.7rem] uppercase tracking-[0.12em] text-white">
                  {v.cta} →
                </p>
                <div className="mt-4 flex gap-2">
                  {[0, 1, 2, 3].map((b) => (
                    <span key={b} className="h-5 flex-1 bg-[rgba(38,38,38,0.07)]" />
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--line-ink)] bg-[rgba(41,165,135,0.05)] px-6 py-3">
                <Label>Shown to · {v.who}</Label>
                <p className="mt-1 text-[0.86rem] leading-snug text-graphite">
                  <span className="text-mute">If </span>
                  {v.rule}
                </p>
                <p className="mt-1 text-[0.86rem] font-medium text-jade-deep">{v.result}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
