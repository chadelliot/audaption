"use client";

/*
  06 — Strategy: how do sales and marketing run this together?

  The crux of the page. The three layers — who the customer is, how they buy,
  what they touch — all land in one grid: the stages of the journey across the
  top, and down the side what marketing does, what sales does, the one measure
  they share at that stage, and who owns it. Two teams, one plan.

  Read down any column and the handoff is designed rather than negotiated:
  marketing's last act in a stage is the context sales needs for its first. Read
  along the bottom and there is one scoreboard instead of two, which is the part
  most organisations never get to.
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

const ROWS = [
  { k: "Marketing does", f: "mkt" },
  { k: "Sales does", f: "sales" },
  { k: "They share", f: "measure" },
  { k: "Owned by", f: "owner" },
] as const;

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
              {ROWS.map((r) => (
                <div key={r.f}>
                  <dt className="annot text-[0.58rem]">{r.k}</dt>
                  <dd className={r.f === "measure" ? "font-semibold text-jade-deep" : "text-graphite"}>{s[r.f]}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>

      <Card className="hidden overflow-hidden lg:block">
        <div className="grid grid-cols-[6.8rem_repeat(4,minmax(0,1fr))]">
          {/* stage headers */}
          <div className="border-b border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)]" />
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.1}>
              <div className="border-b border-l border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-4 py-2.5">
                <p className="annot text-[0.58rem]">Stage {i + 1}</p>
                <p className="font-display-mixed text-[1.15rem] leading-tight text-graphite">{s.k}</p>
              </div>
            </Reveal>
          ))}

          {ROWS.map((row, r) => (
            <RowCells key={row.k} row={row} r={r} />
          ))}
        </div>
      </Card>

      <Reveal delay={2.0}>
        <p className="text-[0.92rem] leading-snug text-slate">
          <span className="font-semibold text-graphite">One scoreboard, three numbers:</span>{" "}
          pipeline created, win rate and net revenue retention, reported to both teams, owned by
          both.
        </p>
      </Reveal>
    </div>
  );
}

function RowCells({ row, r }: { row: (typeof ROWS)[number]; r: number }) {
  const shared = row.f === "measure";
  return (
    <>
      <div
        className="flex items-center border-b border-[var(--line-ink)] px-3 py-3"
        style={{ background: shared ? "rgba(41,165,135,0.09)" : undefined }}
      >
        <Label tone={shared ? "good" : undefined}>{row.k}</Label>
      </div>
      {STAGES.map((s, i) => (
        <Reveal key={s.k + row.f} delay={0.45 + r * 0.22 + i * 0.05}>
          <div
            className="h-full border-b border-l border-[var(--line-ink)] px-4 py-3"
            style={{ background: shared ? "rgba(41,165,135,0.09)" : undefined }}
          >
            {shared ? (
              <p className="font-display-mixed text-[1.05rem] leading-tight text-jade-deep">{s[row.f]}</p>
            ) : row.f === "owner" ? (
              <p className="text-[0.86rem] text-slate">{s[row.f]}</p>
            ) : (
              <p className="text-[0.9rem] leading-snug text-graphite">{s[row.f]}</p>
            )}
          </div>
        </Reveal>
      ))}
    </>
  );
}
