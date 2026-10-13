"use client";

/*
  02 — What it says, and to whom.

  A message-by-audience grid. Each cell is the share of that audience who booked
  a meeting after seeing that message. The shading is the data; the outlines
  are the decision. Read across a row and one message wins and loses by a wide
  margin depending on who is reading it — which is the whole argument for
  testing audience against message and not channel against channel.

  The three winning combinations are outlined and listed beside the grid; the
  cells below the retire line are left visibly spent, because a library that
  only records winners teaches nothing.
*/

import { Card, CountUp, Illustrative, Label, Reveal } from "./ui";

const AUDIENCES = ["Procurement", "Operations", "Finance", "Executive"] as const;

const MESSAGES = [
  { k: "Cut total cost", v: [4.1, 1.2, 3.8, 1.9] },
  { k: "Reduce supplier risk", v: [3.2, 2.0, 2.7, 4.6] },
  { k: "Faster delivery", v: [1.4, 5.2, 0.9, 2.1] },
  { k: "One vendor for everything", v: [4.9, 2.2, 2.4, 3.3] },
] as const;

const BAR = 4.5; // clears the bar
const RETIRE = 1.5; // below this the combination is retired

const wins = MESSAGES.flatMap((m, r) =>
  m.v.map((v, c) => ({ r, c, v, msg: m.k, aud: AUDIENCES[c] })),
)
  .filter((x) => x.v >= BAR)
  .sort((a, b) => b.v - a.v);

const best = MESSAGES[2]; // “Faster delivery” has the widest spread
const hi = Math.max(...best.v);
const lo = Math.min(...best.v);

/* One tint, two levels. The winners are the only cells that carry colour;
   everything else is a quiet grey, and a retired cell is just a lighter number.
   The earlier version shaded every cell by intensity and read as a heat map,
   which is a chart for analysts, not for the people who choose the message. */
const shade = (v: number) => (v >= BAR ? "rgba(41,165,135,0.22)" : "rgba(38,38,38,0.045)");

export default function Reach() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Meetings booked per 100 who saw it · message × audience</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="px-4 pb-4 pt-3">
          <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))] gap-1.5">
            <div />
            {AUDIENCES.map((a) => (
              <Label key={a} className="pb-1 text-center tracking-[0.04em]!">
                {a}
              </Label>
            ))}

            {MESSAGES.map((m, r) => (
              <Row key={m.k} m={m} r={r} />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[var(--line-ink)] pt-2.5">
            <Key swatch={<span className="inline-block h-3 w-5 bg-[rgba(41,165,135,0.3)] ring-2 ring-jade-deep" />}>
              Clears the bar ({BAR}+)
            </Key>
            <Key swatch={<span className="inline-block h-3 w-5 bg-[rgba(38,38,38,0.07)]" />}>
              Keep testing
            </Key>
            <Key swatch={<span className="inline-block h-3 w-5 border border-dashed border-[var(--line-ink-strong)]" />}>
              Retired (under {RETIRE})
            </Key>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Reveal delay={1.0}>
            <Card className="px-5 py-4">
              <Label>Fund these three</Label>
              <ol className="mt-2 space-y-2">
                {wins.slice(0, 3).map((w, i) => (
                  <li key={w.msg + w.aud} className="flex items-baseline gap-3">
                    <span className="font-display w-14 text-[1.5rem] leading-none text-jade-deep">
                      <CountUp to={w.v} delay={1.1 + i * 0.12} format={(v) => v.toFixed(1)} />
                    </span>
                    <span className="text-[0.92rem] leading-snug text-graphite">
                      <span className="font-medium">{w.msg}</span>
                      <span className="text-mute"> → </span>
                      {w.aud}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>

          <Reveal delay={1.5}>
            <Card className="px-5 py-4">
              <Label>Same message, different reader</Label>
              <p className="mt-1.5 text-[0.95rem] leading-snug text-graphite">
                “{best.k}” books{" "}
                <span className="font-semibold text-jade-deep">{hi.toFixed(1)}</span> per 100 with
                Operations and{" "}
                <span className="font-semibold text-timber-ink">{lo.toFixed(1)}</span> with Finance:
                a <span className="font-semibold">{(hi / lo).toFixed(1)}×</span> spread from the
                audience alone.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Row({ m, r }: { m: (typeof MESSAGES)[number]; r: number }) {
  return (
    <>
      <p className="flex items-center pr-2 text-[0.92rem] font-medium leading-tight text-graphite">
        {m.k}
      </p>
      {m.v.map((v, c) => {
        const win = v >= BAR;
        return (
          <Reveal key={c} delay={0.25 + (r * 4 + c) * 0.045}>
            <div
              className="flex h-[3.4rem] items-center justify-center"
              style={{
                background: shade(v),
                boxShadow: win ? "inset 0 0 0 2px var(--color-jade-deep)" : undefined,
              }}
            >
              <span
                className="font-display text-[1.45rem] leading-none"
                style={{
                  color: win ? "var(--color-graphite)" : "var(--color-slate)",
                  opacity: v < RETIRE ? 0.45 : 1,
                }}
              >
                {v.toFixed(1)}
              </span>
            </div>
          </Reveal>
        );
      })}
    </>
  );
}

function Key({ swatch, children }: { swatch: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[0.78rem] text-slate">
      {swatch}
      {children}
    </span>
  );
}
