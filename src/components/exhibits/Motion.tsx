"use client";

/*
  06 — Strategy: how do sales and marketing run this together?

  The crux of the page, drawn as one machine rather than a grid. Two lanes run
  across it — marketing above, sales below — and between them a single jade
  spine: the one measure the two teams share at each stage. Every action hangs
  off the spine by a short stem, so you can see that nothing marketing does at a
  stage is separate from what sales does, and that both are answerable to the
  same number.

  Read down any column and the handoff is designed rather than negotiated;
  read along the spine and there is one scoreboard instead of two.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const STAGES = [
  {
    k: "Attract",
    mkt: "Reach Tier A accounts with the message written for their market.",
    sales: "Warm the named list. Connect first; pitch later.",
    measure: "Tier A accounts engaged",
    owner: "Marketing lead",
  },
  {
    k: "Qualify",
    mkt: "Score on fit and signal, and pass the account over with its full context.",
    sales: "Respond inside the promise and confirm the problem.",
    measure: "Qualified pipeline",
    owner: "Revenue operations",
  },
  {
    k: "Decide",
    mkt: "Supply the proof each buying role needs, in the order they need it.",
    sales: "Multi-thread: engage every decider and every influencer.",
    measure: "Win rate",
    owner: "Sales lead",
  },
  {
    k: "Expand",
    mkt: "Drive adoption and open the case for the next use.",
    sales: "Run the account plan toward the second purchase.",
    measure: "Net revenue retention",
    owner: "Customer success",
  },
] as const;

const COLS = "grid grid-cols-[5.5rem_repeat(4,minmax(0,1fr))] gap-x-3";

export default function Motion() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Label>One plan for</Label>
          <Chip tone="solid">Tier A accounts</Chip>
          <Chip tone="good">One message per market</Chip>
          <Chip tone="good">One scoreboard</Chip>
        </div>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: one card per stage */}
      <div className="space-y-2.5 lg:hidden">
        {STAGES.map((s, i) => (
          <Card key={s.k} className="overflow-hidden">
            <div className="border-b border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-4 py-2.5">
              <p className="annot text-[0.58rem]">Stage {i + 1}</p>
              <p className="font-display-mixed text-[1.15rem] leading-tight text-graphite">{s.k}</p>
            </div>
            <dl className="space-y-2.5 px-4 py-3 text-[0.9rem] leading-snug">
              <div>
                <dt className="annot text-[0.58rem]">Marketing does</dt>
                <dd className="text-graphite">{s.mkt}</dd>
              </div>
              <div>
                <dt className="annot text-[0.58rem]">They share</dt>
                <dd className="font-semibold text-jade-deep">{s.measure}</dd>
              </div>
              <div>
                <dt className="annot text-[0.58rem]">Sales does</dt>
                <dd className="text-graphite">{s.sales}</dd>
              </div>
              <div>
                <dt className="annot text-[0.58rem]">Owned by</dt>
                <dd className="text-slate">{s.owner}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      {/* desktop: two lanes and a spine */}
      <Card className="hidden px-5 pb-5 pt-4 lg:block">
        {/* the stages, as one direction of travel */}
        <div className={COLS}>
          <div />
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.12}>
              <div
                className="flex items-center gap-2 bg-[rgba(38,38,38,0.06)] py-2 pl-4 pr-6"
                style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" }}
              >
                <span className="font-mono text-[0.68rem] text-mute">{i + 1}</span>
                <span className="font-display-mixed text-[1.1rem] leading-none text-graphite">{s.k}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* marketing lane */}
        <Lane label="Marketing" tint="mkt" row={0}>
          {STAGES.map((s) => s.mkt)}
        </Lane>

        <Stems />

        {/* the spine */}
        <div className={`${COLS} relative items-center`}>
          <div className="annot text-[0.6rem] text-jade-deep!">They share</div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[5.5rem] right-0 flex items-center">
            <span className="h-[3px] w-full bg-jade/45" />
          </div>
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={0.9 + i * 0.12} className="relative z-10">
              <div className="mx-auto w-full bg-jade px-3 py-2.5 text-center shadow-[0_0_0_4px_#fff]" style={{ borderRadius: 999 }}>
                <p className="text-[0.92rem] font-semibold leading-tight text-white">{s.measure}</p>
              </div>
              <p className="mt-1.5 text-center text-[0.72rem] text-mute">{s.owner}</p>
            </Reveal>
          ))}
        </div>

        <Stems />

        {/* sales lane */}
        <Lane label="Sales" tint="sales" row={1}>
          {STAGES.map((s) => s.sales)}
        </Lane>
      </Card>

      <Reveal delay={1.9}>
        <p className="text-[0.92rem] leading-snug text-slate">
          <span className="font-semibold text-graphite">One scoreboard, three numbers:</span> pipeline
          created, win rate and net revenue retention, reported to both teams and owned by both.
        </p>
      </Reveal>
    </div>
  );
}

/** A lane of four actions, one per stage. */
function Lane({
  label,
  tint,
  row,
  children,
}: {
  label: string;
  tint: "mkt" | "sales";
  row: 0 | 1;
  children: string[];
}) {
  return (
    <div className={`${COLS} items-stretch`}>
      <div className="flex items-center">
        <span className="annot text-[0.62rem]">{label}</span>
      </div>
      {children.map((text, i) => (
        <Reveal key={i} delay={0.45 + row * 1.0 + i * 0.1} className="h-full">
          <div
            className="h-full px-3.5 py-3 text-[0.88rem] leading-snug text-graphite"
            style={{
              background: tint === "mkt" ? "rgba(38,38,38,0.05)" : "#fff",
              border: tint === "mkt" ? "1px solid transparent" : "1px solid var(--line-ink-strong)",
              borderRadius: 10,
            }}
          >
            {text}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Short stems joining a lane to the spine. */
function Stems() {
  return (
    <div className={`${COLS} h-4`} aria-hidden>
      <div />
      {STAGES.map((s) => (
        <div key={s.k} className="flex justify-center">
          <span className="h-full w-[2px] bg-jade/45" />
        </div>
      ))}
    </div>
  );
}
