"use client";

/*
  09 — Strategy: how does it compound?

  A staircase, literally. Four steps, each one a layer the page has already
  built, rising left to right; on every tread a flag says what that step newly
  makes possible. The previous version of this chapter was a diagnosis — what you
  have, what you lack. This is the other thing, how to get there, and the shape
  is the argument: you cannot start on the fourth step, and every step you stand
  on holds up the one above it.

  Nothing here is a status. There is no "you are here", because the exhibit is
  about the sequence, not about the reader's company.
*/

import { Chip, Illustrative, Label, Reveal } from "./ui";

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
const RISE = ["lg:h-[6.5rem]", "lg:h-[9.5rem]", "lg:h-[12.5rem]", "lg:h-[15.5rem]"] as const;
const TREAD = [
  { bg: "rgba(41,165,135,0.20)", fg: "#262626" },
  { bg: "rgba(41,165,135,0.42)", fg: "#262626" },
  { bg: "rgba(41,165,135,0.72)", fg: "#ffffff" },
  { bg: "#1d7a63", fg: "#ffffff" },
] as const;

export default function AiPath() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The order to build in · and what each step unlocks</Label>
        <Illustrative>The sequence, not a status</Illustrative>
      </div>

      {/* phones: a list, since a staircase needs the width */}
      <div className="space-y-2.5 lg:hidden">
        {STEPS.map((s) => (
          <div key={s.n} className="border border-[var(--line-ink)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--line-ink)] px-4 py-2.5">
              <p className="font-display-mixed text-[1.15rem] leading-none text-graphite">{s.layer}</p>
              <span className="font-display flex h-7 w-7 items-center justify-center bg-graphite text-[0.95rem] text-chalk">
                {s.n}
              </span>
            </div>
            <div className="px-4 py-3">
              <ul className="space-y-1 text-[0.88rem] leading-snug text-graphite">
                {s.build.map((b) => (
                  <li key={b}>+ {b}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-jade/45 bg-[rgba(41,165,135,0.09)] px-4 py-3">
              <Label tone="good">Which unlocks</Label>
              <p className="font-display-mixed mt-1 text-[1.15rem] text-jade-deep">{s.unlocks}</p>
              <p className="mt-1 text-[0.82rem] leading-snug text-slate">{s.what}</p>
            </div>
          </div>
        ))}
      </div>

      {/* desktop: the staircase */}
      <div className="hidden items-end lg:grid lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex flex-col justify-end">
            {/* the flag planted on the tread */}
            <Reveal delay={0.55 + i * 0.3} className="px-1.5 pb-2.5">
              <div className="relative border border-jade/45 bg-white px-4 py-3">
                <Label tone="good">Unlocks</Label>
                <p className="font-display-mixed mt-0.5 text-[1.2rem] leading-tight text-jade-deep">{s.unlocks}</p>
                <p className="mt-1 text-[0.8rem] leading-snug text-slate">{s.what}</p>
                <span
                  aria-hidden
                  className="absolute -bottom-[6px] left-6 h-3 w-3 rotate-45 border-b border-r border-jade/45 bg-white"
                />
              </div>
            </Reveal>

            {/* the step itself */}
            <Reveal delay={0.15 + i * 0.3}>
              <div
                className={`relative flex flex-col justify-between px-4 py-3.5 ${RISE[i]}`}
                style={{ background: TREAD[i].bg, color: TREAD[i].fg }}
              >
                <div>
                  <p className="font-display-mixed text-[1.25rem] leading-none">{s.layer}</p>
                  <ul className="mt-2 space-y-0.5 text-[0.82rem] leading-snug opacity-90">
                    {s.build.map((b) => (
                      <li key={b}>+ {b}</li>
                    ))}
                  </ul>
                </div>
                <span
                  aria-hidden
                  className="font-display absolute bottom-2 right-3 text-[3.4rem] leading-none opacity-25"
                >
                  {s.n}
                </span>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <div aria-hidden className="hidden h-px bg-[var(--line-ink-strong)] lg:block" />

      <Reveal delay={1.5}>
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
