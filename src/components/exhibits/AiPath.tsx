"use client";

/*
  09 — Strategy: how does it compound?

  The previous version of this chapter was a diagnosis: here is what you have,
  here is what you lack. This is the other thing — how to get there. A stair of
  four steps, each one a layer the page has already built, and at each step the
  automation or AI it newly makes possible. It rises left to right because the
  order is the argument: you cannot skip to the top, and each step pays for the
  next one.

  Nothing here is a status. There is no "you are here", because the exhibit is
  not about the reader's company; it is about the sequence.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const STEPS = [
  {
    n: "1",
    layer: "Data",
    build: ["The ideal customer profile", "One record per customer"],
    unlocks: "Scoring",
    what: "Rank every account by how closely it fits and how ready it looks.",
  },
  {
    n: "2",
    layer: "Journey",
    build: ["The real buying path", "Stage, owner and exit rules"],
    unlocks: "Next-best-action",
    what: "Tell a seller or a campaign what to do next, for this account, at this stage.",
  },
  {
    n: "3",
    layer: "Experience",
    build: ["Touchpoints on one stream", "The signals that matter, with owners"],
    unlocks: "Timing",
    what: "Surface who to contact today, and why, before the moment passes.",
  },
  {
    n: "4",
    layer: "Strategy",
    build: ["One motion, one scoreboard", "Money moved by marginal return"],
    unlocks: "Forecasting and personalization at scale",
    what: "Call the quarter with a reason, and tailor every touchpoint to its buyer.",
  },
] as const;

/* Written out in full: Tailwind only generates classes it can read as literals. */
const HEIGHT = [
  "lg:min-h-[15.5rem]",
  "lg:min-h-[17.5rem]",
  "lg:min-h-[19.5rem]",
  "lg:min-h-[21.5rem]",
];

export default function AiPath() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The order to build in · and what each step unlocks</Label>
        <Illustrative>The sequence, not a status</Illustrative>
      </div>

      <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={0.15 + i * 0.22} className="h-full lg:h-auto">
            <Card className={`flex h-full flex-col ${HEIGHT[i]}`}>
              <div className="flex items-center justify-between border-b border-[var(--line-ink)] px-4 py-2.5">
                <p className="font-display-mixed text-[1.15rem] leading-none text-graphite">{s.layer}</p>
                <span className="font-display flex h-7 w-7 items-center justify-center bg-graphite text-[0.95rem] text-chalk">
                  {s.n}
                </span>
              </div>

              <div className="px-4 py-3">
                <Label>We build</Label>
                <ul className="mt-1.5 space-y-1 text-[0.88rem] leading-snug text-graphite">
                  {s.build.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-mute">+</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-jade/45 bg-[rgba(41,165,135,0.09)] px-4 py-3">
                <Label tone="good">Which unlocks</Label>
                <p className="font-display-mixed mt-1 text-[1.2rem] leading-tight text-jade-deep">
                  {s.unlocks}
                </p>
                <p className="mt-1 text-[0.82rem] leading-snug text-slate">{s.what}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={1.2}>
        <div className="flex flex-wrap items-center gap-3">
          <Chip tone="solid">Each step keeps everything before it</Chip>
          <p className="text-[0.88rem] text-slate">
            Skip a step and the one above it has nothing to stand on. That is where pilots stall.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
