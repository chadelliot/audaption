"use client";

/*
  06 — Act on timing, not guesswork.

  A signal explorer. Left, the signals grouped by where they land; right, the
  one you have chosen: what it means, what Marketing does, what Sales does, and
  which systems feed it. The last line is the point of the chapter — a signal is
  only usable if it lands on one customer record — so it is stated on every
  signal rather than once at the bottom.

  It is a real control, not a picture of one: it opens on the first signal and
  every row is a button.
*/

import { useState } from "react";
import { Card, Chip, Illustrative, Label } from "./ui";

type Stage = "Act now" | "Engage" | "Qualified" | "At risk" | "Expand";

const SIGNALS: {
  id: string;
  name: string;
  within: string;
  stage: Stage;
  means: string;
  marketing: string;
  sales: string;
  from: string[];
}[] = [
  {
    id: "funding",
    within: "48 hours",
    name: "Funding received",
    stage: "Act now",
    means: "A target account has new money and a window in which to spend it.",
    marketing: "Run a targeted campaign into the buying group this week.",
    sales: "Priority outreach within 48 hours, led by a senior seller.",
    from: ["News feed", "CRM"],
  },
  {
    id: "exec",
    within: "First 90 days",
    name: "Executive hire",
    stage: "Engage",
    means: "A new commercial leader is rebuilding their vendor list in the first 90 days.",
    marketing: "Introduce the point of view, not the product.",
    sales: "Reach them early; offer a short working session.",
    from: ["News feed", "CRM"],
  },
  {
    id: "intent",
    within: "24 hours",
    name: "Active intent",
    stage: "Engage",
    means: "Someone in the account is researching the category now, not next quarter.",
    marketing: "Retarget the buying group with proof for their market.",
    sales: "Follow up faster than anyone else will.",
    from: ["Website", "Ads"],
  },
  {
    id: "budget",
    within: "This quarter",
    name: "Budget confirmed",
    stage: "Qualified",
    means: "The money exists. The question has moved from whether to with whom.",
    marketing: "Send the business case, built for a finance reader.",
    sales: "Move to proposal and name the next step with a date.",
    from: ["CRM", "Billing"],
  },
  {
    id: "champion",
    within: "Two weeks",
    name: "Champion change",
    stage: "At risk",
    means: "The person who was selling for you has left or moved. The deal has lost its voice.",
    marketing: "Re-engage the account with fresh proof points.",
    sales: "Secure a new champion before the next review.",
    from: ["CRM", "Support"],
  },
  {
    id: "compete",
    within: "This week",
    name: "Competitive evaluation",
    stage: "At risk",
    means: "A rival is in the room. Silence now reads as agreement.",
    marketing: "Put differentiation assets in front of the committee.",
    sales: "Address the objections directly, in writing, this week.",
    from: ["CRM", "Website"],
  },
  {
    id: "spend",
    within: "Before renewal",
    name: "Declining spend",
    stage: "At risk",
    means: "An existing customer is quietly buying less.",
    marketing: "Run a re-engagement offer, not a newsletter.",
    sales: "Schedule a save call before renewal, not at it.",
    from: ["Billing", "Product"],
  },
  {
    id: "gap",
    within: "Next account review",
    name: "Cross-sell gap",
    stage: "Expand",
    means: "A healthy account is missing a category it clearly could use.",
    marketing: "Send a personalized offer for the missing category.",
    sales: "A seller-led introduction to the second product line.",
    from: ["Billing", "CRM"],
  },
];

const TONE: Record<Stage, "good" | "leak" | "plain" | "solid"> = {
  "Act now": "solid",
  Engage: "good",
  Qualified: "good",
  "At risk": "leak",
  Expand: "plain",
};

export default function Signals() {
  const [open, setOpen] = useState(SIGNALS[0].id);
  const s = SIGNALS.find((x) => x.id === open) ?? SIGNALS[0];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Eight signals · each with a marketing play and a sales play</Label>
        <Illustrative>Click a signal</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        <ul className="border border-[var(--line-ink)] bg-white" role="tablist" aria-label="Signals">
          {SIGNALS.map((x, i) => {
            const on = x.id === open;
            return (
              <li key={x.id} className={i ? "border-t border-[var(--line-ink)]" : ""}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setOpen(x.id)}
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors"
                  style={{
                    background: on ? "rgba(41,165,135,0.09)" : "transparent",
                    boxShadow: on ? "inset 3px 0 0 var(--color-jade)" : undefined,
                  }}
                >
                  <span
                    className="text-[0.92rem]"
                    style={{
                      color: on ? "var(--color-graphite)" : "var(--color-slate)",
                      fontWeight: on ? 500 : 400,
                    }}
                  >
                    {x.name}
                  </span>
                  <Chip tone={TONE[x.stage]}>{x.stage}</Chip>
                </button>
              </li>
            );
          })}
        </ul>

        <Card key={s.id} className="flex flex-col px-6 py-5" style={{ minHeight: "100%" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display-mixed text-[1.7rem] leading-none text-graphite">{s.name}</p>
            <Chip tone={TONE[s.stage]}>{s.stage}</Chip>
          </div>
          <p className="mt-3 max-w-[40rem] text-[1rem] leading-snug text-slate">{s.means}</p>

          <div className="mt-4 flex items-baseline gap-3 border-y border-[var(--line-ink)] py-2.5">
            <Label>Act within</Label>
            <p className="font-display text-[1.5rem] leading-none text-graphite">{s.within}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Play who="Marketing" what={s.marketing} tone="good" />
            <Play who="Sales" what={s.sales} tone="plain" />
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[var(--line-ink)] pt-3">
            <Label>Fires from the one customer record, fed by</Label>
            {s.from.map((f) => (
              <Chip key={f}>{f}</Chip>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Play({ who, what, tone }: { who: string; what: string; tone: "good" | "plain" }) {
  return (
    <Card tone={tone} className="px-4 py-3">
      <Label tone={tone === "good" ? "good" : undefined}>{who}</Label>
      <p className="mt-1.5 text-[0.98rem] leading-snug text-graphite">{what}</p>
    </Card>
  );
}
