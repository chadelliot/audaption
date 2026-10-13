"use client";

/*
  01 — The scoreboard.

  One metric is below target and it is the one the rest depend on. The exhibit
  gives it the whole top of the frame and a gauge with the gap drawn in, then
  shows the other seven as a quiet row: healthy, protected, not the problem.
  The argument is in the proportions — one loud number, seven calm ones.
*/

import { Card, GrowBar, Illustrative, Label, Reveal } from "./ui";

const BOARD = [
  { k: "Revenue growth", v: "11%", s: "Above the 9% target", ok: true },
  { k: "Market share", v: "14%", s: "Up 1.2 pts", ok: true },
  { k: "New customers", v: "142", s: "Trailing 12 months", ok: true },
  { k: "Net revenue retention", v: "106%", s: "Expanding base", ok: true },
  { k: "Pipeline", v: "$41M", s: "2.9× coverage · watch", ok: false },
  { k: "Customer LTV", v: "$31K", s: "Above the $28K goal", ok: true },
  { k: "Marketing ROI", v: "4.6×", s: "Above the 4× target", ok: true },
];

const MAX = 50;
const WIN = 27;
const TARGET = 34;

export default function Scoreboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>One scoreboard · eight numbers</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <Reveal>
        <Card tone="leak" className="grid items-center gap-6 px-6 py-5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10">
          <div>
            <Label tone="leak">Win rate · opportunities that close</Label>
            <p className="font-display mt-1 text-[4.4rem] leading-none text-graphite">
              {WIN}%
            </p>
            <p className="mt-2 text-[0.95rem] text-timber-ink">
              ▼ {TARGET - WIN} pts below the {TARGET}% target
            </p>
          </div>

          <div>
            <div className="relative h-7 bg-[rgba(38,38,38,0.07)]">
              <div className="absolute inset-y-0 left-0" style={{ width: `${(WIN / MAX) * 100}%` }}>
                <GrowBar pct={100} className="bg-jade" />
              </div>
              {/* the gap, hatched: what the number is short of */}
              <div
                className="absolute inset-y-0"
                style={{
                  left: `${(WIN / MAX) * 100}%`,
                  width: `${((TARGET - WIN) / MAX) * 100}%`,
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(180,136,90,0.55) 0 2px, transparent 2px 6px)",
                  border: "1px solid rgba(180,136,90,0.55)",
                }}
              />
              <div
                className="absolute -inset-y-1.5 w-[2px] bg-graphite"
                style={{ left: `${(TARGET / MAX) * 100}%` }}
              />
            </div>
            <div className="font-mono relative mt-2 h-4 text-[0.66rem] uppercase tracking-[0.1em] text-mute">
              <span className="absolute left-0">0%</span>
              <span
                className="absolute -translate-x-1/2 text-graphite"
                style={{ left: `${(TARGET / MAX) * 100}%` }}
              >
                {TARGET}% target
              </span>
              <span className="absolute right-0">{MAX}%</span>
            </div>
          </div>
        </Card>
      </Reveal>

      <div>
        <Label className="mb-2">The rest of the board · seven numbers</Label>
        <div className="grid grid-cols-2 gap-px bg-[var(--line-ink)] sm:grid-cols-4 lg:grid-cols-7">
          {BOARD.map((m, i) => (
            <Reveal key={m.k} delay={0.15 + i * 0.04}>
              <div
                className="h-full px-3.5 py-3"
                style={{
                  background: m.ok ? "#fff" : "rgba(180,136,90,0.09)",
                }}
              >
                <p className="annot flex items-center gap-1.5 text-[0.6rem] leading-tight">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: m.ok ? "var(--color-jade)" : "var(--color-timber)" }}
                  />
                  {m.k}
                </p>
                <p className="font-display mt-1.5 text-[1.7rem] leading-none text-graphite">
                  {m.v}
                </p>
                <p
                  className="mt-1.5 text-[0.78rem] leading-snug"
                  style={{ color: m.ok ? "var(--color-slate)" : "var(--color-timber-ink)" }}
                >
                  {m.s}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <p className="annot text-[0.66rem]">
        Win rate and pipeline gate everything else on the board.
      </p>
    </div>
  );
}
