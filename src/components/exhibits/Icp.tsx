"use client";

/*
  01 — Market: who are we selling to?

  An ideal customer profile you can count. On the left, what the customers who
  buy, stay and expand have in common, set against how common the same trait is
  across every account — and the ratio, because a trait only matters if it is
  more common among the winners than in the base. On the right, what that
  profile does once it scores the whole market: three tiers, and the one fact
  that makes the case — a sixth of the accounts carry nearly half the revenue.

  Calm on purpose: one accent, no alarm colour. This is the foundation, not the
  problem.
*/

import { Card, Chip, CountUp, GrowBar, Illustrative, Label, Reveal } from "./ui";

const TRAITS = [
  { k: "Industrial distribution", best: 64, all: 18 },
  { k: "250–2,000 employees", best: 71, all: 33 },
  { k: "Multi-site operations", best: 58, all: 14 },
  { k: "Runs ERP and e-procurement", best: 49, all: 12 },
  { k: "New commercial leader this year", best: 31, all: 9 },
] as const;

const TIERS = [
  { t: "A", accounts: 412, share: 6, win: 41, rev: 46, deal: "$186K", note: "Work these first" },
  { t: "B", accounts: 1930, share: 28, win: 27, rev: 41, deal: "$74K", note: "Nurture to A" },
  { t: "C", accounts: 4560, share: 66, win: 9, rev: 13, deal: "$21K", note: "Low touch" },
] as const;

export default function Icp() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>Ideal customer profile · built from the customers who stay</Label>
        <Illustrative>$120M B2B manufacturer</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card className="px-5 pb-4 pt-4">
          <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1.6fr)_3.2rem] items-end gap-x-4 border-b border-[var(--line-ink)] pb-2">
            <Label>Trait</Label>
            <div className="flex gap-4">
              <Legend swatch="bg-jade" text="Best customers" />
              <Legend swatch="bg-[rgba(38,38,38,0.22)]" text="All accounts" />
            </div>
            <Label className="text-right">Lift</Label>
          </div>

          <div className="divide-y divide-[var(--line-ink)]">
            {TRAITS.map((t, i) => (
              <Reveal key={t.k} delay={0.2 + i * 0.12}>
                <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1.6fr)_3.2rem] items-center gap-x-4 py-3">
                  <p className="text-[0.92rem] leading-tight text-graphite">{t.k}</p>
                  <div className="space-y-1.5">
                    <Bar pct={t.best} delay={0.3 + i * 0.12} className="bg-jade" label={`${t.best}%`} strong />
                    <Bar pct={t.all} delay={0.4 + i * 0.12} className="bg-[rgba(38,38,38,0.22)]" label={`${t.all}%`} />
                  </div>
                  <p className="font-display text-right text-[1.2rem] leading-none text-jade-deep">
                    {(t.best / t.all).toFixed(1)}×
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.t} delay={0.9 + i * 0.14}>
              <Card
                tone={i === 0 ? "good" : "plain"}
                className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-x-3.5 px-4 py-3"
              >
                <span
                  className="font-display flex h-9 w-9 items-center justify-center text-[1.2rem]"
                  style={{
                    background: i === 0 ? "var(--color-jade)" : "transparent",
                    color: i === 0 ? "#fff" : "var(--color-slate)",
                    border: i === 0 ? "none" : "1px solid var(--line-ink-strong)",
                  }}
                >
                  {t.t}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="text-[0.98rem] font-medium text-graphite">
                      {t.accounts.toLocaleString()} accounts
                      <span className="ml-2 text-[0.8rem] font-normal text-mute">{t.share}% of the base</span>
                    </p>
                    <Chip tone={i === 0 ? "solid" : "plain"}>{t.note}</Chip>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 text-[0.82rem] text-slate">
                    <span>
                      Win rate <b className="font-semibold text-graphite">{t.win}%</b>
                    </span>
                    <span>
                      Avg deal <b className="font-semibold text-graphite">{t.deal}</b>
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-[rgba(38,38,38,0.1)]">
                      <GrowBar pct={t.rev} delay={1.1 + i * 0.14} className={i === 0 ? "bg-jade" : "bg-[rgba(38,38,38,0.4)]"} />
                    </div>
                    <span className="annot w-24 text-right text-[0.6rem]">{t.rev}% of revenue</span>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}

          <Reveal delay={1.6}>
            <p className="text-[0.95rem] leading-snug text-graphite">
              <span className="font-display text-[1.6rem] text-jade-deep">
                <CountUp to={6} delay={1.7} />%
              </span>{" "}
              of accounts carry{" "}
              <span className="font-display text-[1.6rem] text-jade-deep">
                <CountUp to={46} delay={1.7} />%
              </span>{" "}
              of revenue. That is where effort goes first.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Bar({
  pct,
  delay,
  className,
  label,
  strong,
}: {
  pct: number;
  delay: number;
  className: string;
  label: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 bg-[rgba(38,38,38,0.06)]">
        <GrowBar pct={pct} delay={delay} className={className} />
      </div>
      <span
        className="w-9 text-right text-[0.8rem] tabular-nums"
        style={{ color: strong ? "var(--color-graphite)" : "var(--color-mute)", fontWeight: strong ? 600 : 400 }}
      >
        {label}
      </span>
    </div>
  );
}

function Legend({ swatch, text }: { swatch: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.72rem] text-slate">
      <span className={`inline-block h-2 w-3.5 ${swatch}`} />
      {text}
    </span>
  );
}
