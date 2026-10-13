"use client";

/*
  07 — When does a seller act?

  One account over ninety days, four lanes: what marketing did, what the account
  did, what the system did about it, and what a seller did. Laid out together,
  the trail answers the question the chapter asks — a signal fired on day 31 and
  a play went out on day 32, so a seller was in the room on day 34. Underneath
  runs the same account without the system: first contact on day 71, after the
  opportunity was already formed. The two bracketed gaps are the argument.

  Markers appear in date order, so the reader watches ninety days happen.
*/

import { Card, Chip, Illustrative, Label, Reveal } from "./ui";

const DAYS = 90;

type Mark = { d: number; k: string; tone?: "signal" | "play" | "seller" | "touch" };

const LANES: { k: string; sub: string; marks: Mark[] }[] = [
  {
    k: "Marketing",
    sub: "What we did",
    marks: [
      { d: 3, k: "Ad click", tone: "touch" },
      { d: 15, k: "Webinar", tone: "touch" },
      { d: 27, k: "Pricing page", tone: "touch" },
      { d: 58, k: "Case study", tone: "touch" },
    ],
  },
  {
    k: "Signals",
    sub: "What the account did",
    marks: [
      { d: 31, k: "Funding received", tone: "signal" },
      { d: 45, k: "New VP Commercial", tone: "signal" },
      { d: 61, k: "Rival page viewed", tone: "signal" },
    ],
  },
  {
    k: "Plays",
    sub: "What the system did",
    marks: [
      { d: 32, k: "Target sequence", tone: "play" },
      { d: 46, k: "Briefing invite", tone: "play" },
      { d: 62, k: "Comparison pack", tone: "play" },
    ],
  },
  {
    k: "Seller",
    sub: "What a person did",
    marks: [
      { d: 34, k: "First call", tone: "seller" },
      { d: 40, k: "Meeting", tone: "seller" },
      { d: 56, k: "Proposal", tone: "seller" },
    ],
  },
];

const COLOR = {
  touch: { dot: "rgba(38,38,38,0.35)", ink: "var(--color-slate)" },
  signal: { dot: "var(--color-jade)", ink: "var(--color-jade-deep)" },
  play: { dot: "var(--color-graphite)", ink: "var(--color-graphite)" },
  seller: { dot: "var(--color-timber)", ink: "var(--color-timber-ink)" },
} as const;

/** Every marker in date order, for the list a phone gets. */
const EVENTS = [
  ...LANES.flatMap((l) =>
    l.marks.map((m) => ({
      ...m,
      lane: l.k,
      tone: m.tone ?? ("touch" as const),
      opens: false,
    })),
  ),
  { d: 37, k: "Opportunity opened", lane: "", tone: "signal" as const, opens: true },
].sort((a, b) => a.d - b.d);

const pct = (d: number) => `${(d / DAYS) * 100}%`;

export default function Sell() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>One account · ninety days · four lanes</Label>
        <Illustrative>Account: Northwind Industrial</Illustrative>
      </div>

      <Card className="relative hidden px-5 pb-4 pt-4 lg:block">
        {/* day axis */}
        <div className="flex gap-4">
          <div className="w-[7.5rem] shrink-0" />
          <div className="relative h-5 flex-1">
            {[0, 15, 30, 45, 60, 75, 90].map((d) => (
              <span
                key={d}
                className="annot absolute -translate-x-1/2 text-[0.6rem]"
                style={{ left: pct(d) }}
              >
                {d === 0 ? "Day 0" : d}
              </span>
            ))}
          </div>
        </div>

        {LANES.map((lane, li) => (
          <Lane key={lane.k} lane={lane} li={li} />
        ))}

        {/* the same account without the system */}
        <div className="flex gap-4 border-t border-[var(--line-ink)]">
          <div className="w-[7.5rem] shrink-0 py-2.5">
            <p className="text-[0.88rem] font-semibold leading-tight text-timber-ink">No signals</p>
            <p className="text-[0.72rem] text-mute">Same account</p>
          </div>
          <div className="relative h-[3.6rem] flex-1">
            <Reveal delay={2.4}>
              <Marker d={71} label="First contact" tone="seller" dashed />
            </Reveal>
          </div>
        </div>

        {/* the opportunity line, drawn through every lane */}
        <div className="pointer-events-none absolute inset-y-4 left-[calc(1.25rem+7.5rem+1rem)] right-5">
          <Reveal delay={1.6} className="h-full">
            <div
              className="absolute inset-y-0 border-l-2 border-dashed border-jade-deep/50"
              style={{ left: pct(37) }}
            >
              <span className="annot absolute left-1.5 top-5 whitespace-nowrap bg-white px-1 text-[0.58rem] text-jade-deep!">
                Opportunity opened · day 37
              </span>
            </div>
          </Reveal>
        </div>
      </Card>

      {/* phones: the same ninety days as a list, since four lanes of labels
          cannot share 335px */}
      <Card className="px-4 py-3 lg:hidden">
        <ol className="space-y-2.5">
          {EVENTS.map((e) =>
            e.opens ? (
              <li
                key={e.k}
                className="flex items-baseline gap-3 border-y border-dashed border-jade-deep/50 py-2"
              >
                <span className="font-mono w-14 shrink-0 text-[0.72rem] text-jade-deep">Day {e.d}</span>
                <span className="text-[0.92rem] font-medium text-jade-deep">{e.k}</span>
              </li>
            ) : (
              <li key={e.d + e.k} className="flex items-baseline gap-3">
                <span className="font-mono w-14 shrink-0 text-[0.72rem] text-mute">Day {e.d}</span>
                <span
                  aria-hidden
                  className="mt-1 h-2.5 w-2.5 shrink-0 self-start rounded-full"
                  style={{ background: COLOR[e.tone].dot }}
                />
                <span className="text-[0.92rem] leading-snug text-graphite">
                  {e.k}
                  <span className="annot ml-2 text-[0.58rem]">{e.lane}</span>
                </span>
              </li>
            ),
          )}
          <li className="flex items-baseline gap-3 border-t border-[var(--line-ink)] pt-2.5">
            <span className="font-mono w-14 shrink-0 text-[0.72rem] text-timber-ink">Day 71</span>
            <span className="text-[0.92rem] text-timber-ink">Without signals: first contact</span>
          </li>
        </ol>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Reveal delay={2.6}>
          <Card tone="good" className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="solid">48 hours</Chip>
              <p className="text-[0.92rem] leading-snug text-graphite">
                from funding signal to a seller on the phone.
              </p>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={2.7}>
          <Card tone="leak" className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="leak">34 days later</Chip>
              <p className="text-[0.92rem] leading-snug text-graphite">
                is when the same account was first contacted without it.
              </p>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function Lane({ lane, li }: { lane: (typeof LANES)[number]; li: number }) {
  return (
    <div className="flex gap-4 border-t border-[var(--line-ink)]">
      <div className="flex w-[7.5rem] shrink-0 flex-col justify-center py-2.5">
        <p className="text-[0.88rem] font-semibold leading-tight text-graphite">{lane.k}</p>
        <p className="text-[0.72rem] text-mute">{lane.sub}</p>
      </div>
      <div className="relative h-[3.6rem] flex-1">
        {lane.marks.map((m) => (
          <Reveal key={m.k} delay={0.25 + (m.d / DAYS) * 1.7 + li * 0.04}>
            <Marker d={m.d} label={m.k} tone={m.tone ?? "touch"} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Marker({
  d,
  label,
  tone,
  dashed,
}: {
  d: number;
  label: string;
  tone: keyof typeof COLOR;
  dashed?: boolean;
}) {
  const c = COLOR[tone];
  return (
    <div className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: pct(d) }}>
      <span
        className="mt-2.5 block h-3 w-3 rounded-full"
        style={{
          background: dashed ? "#fff" : c.dot,
          border: dashed ? `2px solid ${c.dot}` : "none",
        }}
      />
      <span
        className="mt-1 whitespace-nowrap text-[0.74rem] font-medium leading-none"
        style={{ color: c.ink }}
      >
        {label}
      </span>
    </div>
  );
}
