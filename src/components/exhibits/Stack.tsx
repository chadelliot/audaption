"use client";

/*
  04 — Does the signal survive the stack?

  Six tools in a row, five joints between them. Each joint passes only part of
  what reaches it, and the parts multiply. The exhibit prints the pass rate on
  every joint and then the product at the end, so the headline number — the
  share of buyer behavior that ever reaches the CRM — is arithmetic the reader
  can check, not a claim. The tiles carry how much of each licence is actually
  used, because a stack's waste and its leaks are usually in the same places.
*/

import { Card, Chip, CountUp, Illustrative, Label, Reveal } from "./ui";

const TOOLS = [
  { k: "Ad platforms", use: 88 },
  { k: "Tag + consent", use: 64 },
  { k: "Web analytics", use: 72 },
  { k: "Customer data", use: 35 },
  { k: "Automation", use: 41 },
  { k: "CRM", use: 76 },
] as const;

/** Share of signal each joint passes on, and what the joint actually is. */
const JOINTS = [
  { pass: 0.92, how: "live", note: "Click IDs kept" },
  { pass: 0.78, how: "broken", note: "Consent blocks 22%" },
  { pass: 0.85, how: "live", note: "Server events" },
  { pass: 0.7, how: "manual", note: "CSV every Monday" },
  { pass: 0.95, how: "live", note: "Native sync" },
] as const;

const REACH = JOINTS.reduce((p, j) => p * j.pass, 1);
const USED = Math.round(TOOLS.reduce((s, t) => s + t.use, 0) / TOOLS.length);

const HOW = {
  live: { tone: "good" as const, label: "Live" },
  manual: { tone: "leak" as const, label: "Manual" },
  broken: { tone: "leak" as const, label: "Leaking" },
};

export default function Stack() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Label>Six tools · five joints · what is left at the end</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <Card className="px-4 pb-5 pt-5">
        <div className="grid items-start gap-y-4 lg:grid-cols-[repeat(6,minmax(0,1fr))] lg:gap-x-0">
          {TOOLS.map((t, i) => (
            <Tool key={t.k} tool={t} i={i} joint={i < JOINTS.length ? JOINTS[i] : undefined} />
          ))}
        </div>

        <Reveal delay={1.6}>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--line-ink)] pt-3">
            <Label>Signal that reaches a seller</Label>
            <p className="text-[0.82rem] text-mute">
              {JOINTS.map((j) => `${Math.round(j.pass * 100)}%`).join(" × ")} =
            </p>
            <p className="font-display text-[2.4rem] leading-none text-timber-ink">
              <CountUp to={REACH * 100} delay={1.7} />%
            </p>
          </div>
        </Reveal>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["2 overlapping tools", "Two email platforms and two form tools doing one job each."],
          ["3 joints run by hand", "Exports and uploads that stop when someone is away."],
          [`${100 - USED}% of licences unused`, "Seats and features paid for, never switched on."],
        ].map(([h, b], i) => (
          <Reveal key={h} delay={2.0 + i * 0.1}>
            <Card tone={i === 2 ? "leak" : "plain"} className="h-full px-4 py-3">
              <p className="text-[1rem] font-medium leading-snug text-graphite">{h}</p>
              <p className="mt-1 text-[0.86rem] leading-snug text-slate">{b}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Tool({
  tool,
  i,
  joint,
}: {
  tool: (typeof TOOLS)[number];
  i: number;
  joint?: (typeof JOINTS)[number];
}) {
  return (
    <div className="relative flex flex-col px-2 first:pl-0 last:pr-0">
      <Reveal delay={0.2 + i * 0.16}>
        <div className="border border-[var(--line-ink-strong)] bg-white px-3 py-3">
          <p className="text-[0.92rem] font-semibold leading-tight text-graphite">{tool.k}</p>
          <div className="mt-2.5 h-1.5 bg-[rgba(38,38,38,0.1)]">
            <div
              className="h-full"
              style={{
                width: `${tool.use}%`,
                background: tool.use < 50 ? "var(--color-timber)" : "var(--color-jade)",
              }}
            />
          </div>
          <p className="mt-1 text-[0.72rem] text-mute">{tool.use}% of licence used</p>
        </div>
      </Reveal>

      {joint ? (
        <Reveal delay={0.5 + i * 0.16} className="mt-3 pr-2">
          <div className="flex flex-col items-start gap-1.5 border-l-2 pl-2.5" style={{ borderColor: joint.how === "live" ? "var(--color-jade)" : "var(--color-timber)" }}>
            <p className="flex items-baseline gap-1.5">
              <span className="text-mute">→</span>
              <span
                className="font-display text-[1.5rem] leading-none"
                style={{ color: joint.how === "live" ? "var(--color-jade-deep)" : "var(--color-timber-ink)" }}
              >
                {Math.round(joint.pass * 100)}%
              </span>
              <span className="text-[0.7rem] text-mute">passes on</span>
            </p>
            <Chip tone={HOW[joint.how].tone}>{HOW[joint.how].label}</Chip>
            <p className="text-[0.76rem] leading-tight text-mute">{joint.note}</p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-3 h-[3.1rem]" />
      )}
    </div>
  );
}
