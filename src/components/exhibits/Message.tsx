"use client";

/*
  03 — Same product, different buyer.

  Two markets set side by side, row for row, so the only thing that changes down
  a row is the buyer. The left rail names the rows once and the cards answer
  them; the reader's eye can run straight across and see the same product
  being said two ways. The quotation is the part people remember, so it gets
  the jade block.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const ROWS = ["Lead with", "Sounds like", "Buying roles", "Proof"] as const;

const MARKETS = [
  {
    name: "Enterprise",
    sub: "C-suite + procurement · 7–10 month cycle",
    lead: "Business outcomes and supplier consolidation",
    says: "One partner for every site. Fewer vendors, lower risk, a clear ROI.",
    roles: [
      { who: "VP / C-suite", does: "decides" },
      { who: "VP Procurement", does: "influences" },
    ],
    proof: "Multi-site case study and a security review pack",
  },
  {
    name: "Mid-market",
    sub: "Manager + operations · 4–8 week cycle",
    lead: "Speed, simplicity and reliable service",
    says: "Orders in by noon, on the truck the same week. One number to call.",
    roles: [
      { who: "Operations manager", does: "decides" },
      { who: "Purchasing coordinator", does: "influences" },
    ],
    proof: "A two-minute demo and a same-week delivery guarantee",
  },
];

export default function Message() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>Same product · two markets · two messages</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-x-4 gap-y-3 lg:grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)]">
        {/* headers */}
        <div className="hidden lg:block" />
        {MARKETS.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <div className="border-t-[3px] border-jade bg-white px-4 pb-3 pt-3 border-x border-b border-x-[var(--line-ink)] border-b-[var(--line-ink)]">
              <p className="font-display-mixed text-[1.6rem] leading-none text-graphite">
                {m.name}
              </p>
              <p className="mt-1.5 text-[0.82rem] text-mute">{m.sub}</p>
            </div>
          </Reveal>
        ))}

        {ROWS.map((row, r) => (
          <RowGroup key={row} label={row} r={r} />
        ))}
      </div>
    </div>
  );
}

function RowGroup({ label, r }: { label: (typeof ROWS)[number]; r: number }) {
  return (
    <>
      <div className="annot pt-3 text-[0.64rem] lg:text-right">{label}</div>
      {MARKETS.map((m, i) => (
        <Reveal key={m.name + label} delay={0.15 + r * 0.06 + i * 0.03}>
          {label === "Lead with" && (
            <p className="px-1 pt-2 text-[1.05rem] font-medium leading-snug text-graphite">
              {m.lead}
            </p>
          )}
          {label === "Sounds like" && (
            <Card tone="good" className="px-4 py-3">
              <p className="text-[1rem] italic leading-snug text-graphite">“{m.says}”</p>
            </Card>
          )}
          {label === "Buying roles" && (
            <div className="flex flex-wrap gap-2 pt-1.5">
              {m.roles.map((x) => (
                <span key={x.who} className="flex items-center gap-1.5 text-[0.88rem] text-graphite">
                  {x.who}
                  <Chip tone={x.does === "decides" ? "solid" : "plain"}>{x.does}</Chip>
                </span>
              ))}
            </div>
          )}
          {label === "Proof" && (
            <p className="px-1 pt-1.5 text-[0.92rem] leading-snug text-slate">{m.proof}</p>
          )}
        </Reveal>
      ))}
    </>
  );
}
