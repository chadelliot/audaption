"use client";

/*
  03 — Journey: how do they get to a decision, and to the next one?

  The buying path, built from what customers did. Five stages across, and four
  rows down: how many buyers are still in, who joins, how long it takes, and
  where they stall. One stage — the one that loses the most buyers — is tinted;
  everything else is calm, because the point is that the leak is in one place.

  Underneath runs the road back. Repeat purchase is not a footnote to the first
  sale, it is a journey with its own stages and its own drop-off, so it gets its
  own lane and its own number.
*/

import { Card, Chip, CountUp, GrowBar, Illustrative, Label, Reveal } from "./ui";

const STAGES = [
  { k: "Notice a problem", left: 100, who: ["Operations"], time: "3 weeks", stall: "No shared problem statement" },
  { k: "Compare options", left: 64, who: ["Operations", "Procurement"], time: "5 weeks", stall: "Hard to tell options apart" },
  { k: "Build the case", left: 41, who: ["Finance", "IT"], time: "6 weeks", stall: "No business case to sign" },
  { k: "Decide", left: 29, who: ["Executive sponsor"], time: "2 weeks", stall: "Terms and approvals" },
  { k: "Adopt and expand", left: 24, who: ["Operations", "Success"], time: "Ongoing", stall: "Low adoption" },
] as const;

const RETURN = ["Adopt", "Expand", "Renew", "Buy again"] as const;

/** The biggest step-to-step loss is the stage to look at. */
const drops = STAGES.map((s, i) => (i ? STAGES[i - 1].left - s.left : 0));
const WORST = drops.indexOf(Math.max(...drops));

const ROWS = ["Buyers still in", "Who joins", "Time in stage", "Where they stall"] as const;

export default function Journey() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The buying path · from what customers did</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      {/* phones: one card per stage, since a six-column grid does not fit */}
      <div className="space-y-2.5 lg:hidden">
        {STAGES.map((s, i) => (
          <Card key={s.k} tone={i === WORST ? "leak" : "plain"} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[1rem] font-semibold text-graphite">
                <span className="annot mr-2 text-[0.6rem]">Stage {i + 1}</span>
                {s.k}
              </p>
              <p className="font-display text-[1.5rem] leading-none text-graphite">{s.left}%</p>
            </div>
            <div className="mt-2 h-1.5 bg-[rgba(38,38,38,0.08)]">
              <div className="h-full" style={{ width: `${s.left}%`, background: i === WORST ? "var(--color-timber)" : "var(--color-jade)" }} />
            </div>
            <p className="mt-2 text-[0.84rem] text-slate">
              {s.who.join(" + ")} · {s.time}
            </p>
            <p className="mt-0.5 text-[0.84rem]" style={{ color: i === WORST ? "var(--color-timber-ink)" : "var(--color-mute)" }}>
              Stalls on: {s.stall.toLowerCase()}
            </p>
          </Card>
        ))}
      </div>

      <Card className="hidden px-4 pb-3 pt-4 lg:block">
        <div className="grid grid-cols-[6.5rem_repeat(5,minmax(0,1fr))] gap-x-2">
          <div />
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.1}>
              <div
                className="px-3 py-2.5"
                style={{
                  background: i === WORST ? "rgba(180,136,90,0.14)" : "rgba(38,38,38,0.05)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                }}
              >
                <p className="annot text-[0.58rem]">Stage {i + 1}</p>
                <p className="text-[0.92rem] font-semibold leading-tight text-graphite">{s.k}</p>
              </div>
            </Reveal>
          ))}

          {/* buyers still in */}
          <RowLabel>{ROWS[0]}</RowLabel>
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={0.5 + i * 0.1}>
              <div className="py-3 pr-2">
                <p
                  className="font-display text-[1.7rem] leading-none"
                  style={{ color: i === WORST ? "var(--color-timber-ink)" : "var(--color-graphite)" }}
                >
                  <CountUp to={s.left} delay={0.6 + i * 0.1} />%
                </p>
                <div className="mt-1.5 h-2 bg-[rgba(38,38,38,0.08)]">
                  <GrowBar
                    pct={s.left}
                    delay={0.6 + i * 0.1}
                    className={i === WORST ? "bg-timber" : "bg-jade"}
                  />
                </div>
                {i === WORST ? (
                  <p className="mt-1 text-[0.72rem] font-medium text-timber-ink">−{drops[i]} pts here</p>
                ) : null}
              </div>
            </Reveal>
          ))}

          <RowLabel>{ROWS[1]}</RowLabel>
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={0.9 + i * 0.07}>
              <div className="flex flex-wrap content-start gap-1 border-t border-[var(--line-ink)] py-2.5 pr-2">
                {s.who.map((w) => (
                  <Chip key={w}>{w}</Chip>
                ))}
              </div>
            </Reveal>
          ))}

          <RowLabel>{ROWS[2]}</RowLabel>
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={1.1 + i * 0.07}>
              <p className="border-t border-[var(--line-ink)] py-2.5 text-[0.9rem] text-graphite">{s.time}</p>
            </Reveal>
          ))}

          <RowLabel>{ROWS[3]}</RowLabel>
          {STAGES.map((s, i) => (
            <Reveal key={s.k} delay={1.3 + i * 0.07}>
              <p
                className="border-t border-[var(--line-ink)] py-2.5 pr-2 text-[0.84rem] leading-snug"
                style={{ color: i === WORST ? "var(--color-timber-ink)" : "var(--color-slate)" }}
              >
                {s.stall}
              </p>
            </Reveal>
          ))}
        </div>
      </Card>

      <Reveal delay={1.8}>
        <Card tone="good" className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5">
          <Label tone="good">The road back</Label>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {RETURN.map((r, i) => (
              <li key={r} className="flex items-center gap-2">
                <span className="text-[0.95rem] font-medium text-graphite">{r}</span>
                {i < RETURN.length - 1 ? <span className="text-mute">→</span> : <span className="text-jade-deep">↺</span>}
              </li>
            ))}
          </ol>
          <p className="ml-auto text-[0.9rem] text-graphite">
            <span className="font-display text-[1.5rem] text-jade-deep">
              <CountUp to={34} delay={1.9} />%
            </span>{" "}
            buy again within 18 months
          </p>
        </Card>
      </Reveal>
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="annot flex items-start border-t border-[var(--line-ink)] pt-3 text-[0.6rem] first:border-t-0">
      {children}
    </p>
  );
}
