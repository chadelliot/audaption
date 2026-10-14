"use client";

/*
  04 — Experience: what does each touchpoint say to each buyer?

  The funnel, and what we say at every stage of it. Down the left, the same five
  stages as the Journey chapter, narrowing as buyers drop out. Pick one — or
  leave it alone and it tours them — and the right-hand side shows the
  touchpoint at that stage and, side by side, what two different buyers get from
  it. That is the personalization, shown rather than claimed: same stage, same
  product, a different first thing for an enterprise buying group and for an
  operations manager.

  Underneath each is the signal it throws back. A touchpoint is not only
  something we say; it is something we learn from, which is what the next
  chapter picks up.

  The tour stops the moment the reader clicks, and does not run at all for
  anyone who has asked for less motion.
*/

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, Illustrative, Label } from "./ui";

const STAGES = [
  {
    k: "Notice a problem",
    left: 100,
    goal: "Name the problem, and see they are not alone with it.",
    channels: ["Paid social", "Search", "Industry report"],
    ent: {
      to: "Enterprise buying group",
      h: "The hidden cost of a fragmented supplier base",
      s: "A benchmark: what multi-site operators lose to vendor sprawl.",
    },
    mid: {
      to: "Operations manager",
      h: "Why orders slip by a week",
      s: "A two-minute read on the three causes of late deliveries.",
    },
    signal: "Reads past 60% of the guide → marked as interested",
  },
  {
    k: "Compare options",
    left: 64,
    goal: "See how we differ, in their own terms.",
    channels: ["Website", "Comparison page"],
    ent: {
      to: "Enterprise buying group",
      h: "One partner for every site",
      s: "A multi-site case study and a single-contract overview.",
    },
    mid: {
      to: "Operations manager",
      h: "Orders in by noon. On the truck this week.",
      s: "A two-minute quote and a same-week delivery promise.",
    },
    signal: "Opens pricing or the case study → passed to sales with context",
  },
  {
    k: "Build the case",
    left: 41,
    goal: "Get something finance and the sponsor can sign.",
    channels: ["Email", "ROI calculator", "Seller"],
    ent: {
      to: "Enterprise buying group",
      h: "A business case your finance team can sign",
      s: "A template pre-filled with their site count and spend.",
    },
    mid: {
      to: "Operations manager",
      h: "Your quote, with the delivery date on it",
      s: "One page: price, lead time and the one number to call.",
    },
    signal: "Finishes the calculator → buying group mapped",
  },
  {
    k: "Decide",
    left: 29,
    goal: "Settle risk, terms and approvals.",
    channels: ["Seller", "Executive briefing", "Proposal"],
    ent: {
      to: "Enterprise buying group",
      h: "An executive briefing and a security review pack",
      s: "Every decider and influencer gets what they need, in their order.",
    },
    mid: {
      to: "Operations manager",
      h: "A pilot order, then a standing one",
      s: "A short call with an operations specialist, not a pitch.",
    },
    signal: "A new stakeholder joins the thread → multi-thread plan updated",
  },
  {
    k: "Adopt and expand",
    left: 24,
    goal: "Get value fast, then find the next use.",
    channels: ["Onboarding", "Check-ins", "Email"],
    ent: {
      to: "Enterprise buying group",
      h: "A quarterly review for each site",
      s: "Adoption by site, and the next site worth adding.",
    },
    mid: {
      to: "Operations manager",
      h: "Reorder reminders and delivery updates by text",
      s: "The easiest next order is a single tap away.",
    },
    signal: "Usage dips → a save play starts before renewal, not at it",
  },
] as const;

/** Funnel width, as a share of the column. It narrows less than the data does,
    because the narrowest stage still has to hold its own name. */
const WIDTH = [100, 91, 82, 73, 64];

export default function Touchpoints() {
  const still = usePrefersReducedMotion();
  const [on, setOn] = useState(0);
  const [touring, setTouring] = useState(true);

  useEffect(() => {
    if (still || !touring) return;
    const t = setInterval(() => setOn((n) => (n + 1) % STAGES.length), 4600);
    return () => clearInterval(t);
  }, [still, touring]);

  const s = STAGES[on];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The funnel · what we say at each stage</Label>
        <Illustrative>Same product, two buyers</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        {/* the funnel */}
        <div className="flex flex-col items-center gap-1.5 py-1" role="tablist" aria-label="Funnel stages">
          {STAGES.map((st, i) => {
            const active = i === on;
            return (
              <button
                key={st.k}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setOn(i);
                  setTouring(false);
                }}
                className="group relative flex h-[3.1rem] items-center justify-between gap-3 px-4 text-left transition-colors duration-300"
                style={{
                  width: `${WIDTH[i]}%`,
                  background: active ? "#29a587" : "rgba(38,38,38,0.07)",
                  color: active ? "#fff" : "#262626",
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 10px 100%)",
                }}
              >
                <span className="min-w-0">
                  <span
                    className="annot block text-[0.54rem] leading-none"
                    style={{ color: active ? "rgba(255,255,255,0.8)" : undefined }}
                  >
                    Stage {i + 1}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.9rem] font-semibold leading-tight">{st.k}</span>
                </span>
                <span
                  className="font-display shrink-0 text-[1.15rem] leading-none"
                  style={{ opacity: active ? 1 : 0.6 }}
                >
                  {st.left}%
                </span>
              </button>
            );
          })}
          <p className="annot mt-1 text-[0.58rem]">
            Buyers still in · {touring && !still ? "touring, or click a stage" : "click any stage"}
          </p>
        </div>

        {/* what we say, to whom */}
        <Card className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={on}
              initial={still ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="flex h-full flex-col"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--line-ink)] px-5 py-3.5">
                <div>
                  <Label tone="good">Stage {on + 1}</Label>
                  <p className="font-display-mixed mt-0.5 text-[1.4rem] leading-none text-graphite">{s.k}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Label>Touchpoints</Label>
                  {s.channels.map((c) => (
                    <Chip key={c} tone="solid">
                      {c}
                    </Chip>
                  ))}
                </div>
              </div>

              <p className="px-5 pt-3 text-[0.9rem] leading-snug text-slate">
                <span className="font-medium text-graphite">The buyer is trying to:</span> {s.goal}
              </p>

              <div className="grid gap-3 px-5 pb-4 pt-3 sm:grid-cols-2">
                {[
                  { who: s.ent, tone: "dark" as const },
                  { who: s.mid, tone: "light" as const },
                ].map(({ who, tone }) => (
                  <div
                    key={who.to}
                    className="flex flex-col border px-4 py-3.5"
                    style={{
                      borderColor: tone === "dark" ? "var(--color-graphite)" : "rgba(41,165,135,0.5)",
                      background: tone === "dark" ? "var(--color-graphite)" : "rgba(41,165,135,0.07)",
                      color: tone === "dark" ? "var(--color-chalk)" : "var(--color-graphite)",
                    }}
                  >
                    <p
                      className="annot text-[0.58rem]"
                      style={{ color: tone === "dark" ? "var(--color-glass)" : "var(--color-jade-deep)" }}
                    >
                      To the {who.to.toLowerCase()}
                    </p>
                    <p className="font-display-mixed mt-1.5 text-[1.2rem] leading-[1.12]">{who.h}</p>
                    <p
                      className="mt-1.5 text-[0.84rem] leading-snug"
                      style={{ color: tone === "dark" ? "var(--color-glass)" : "var(--color-slate)" }}
                    >
                      {who.s}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3 border-t border-[var(--line-ink)] bg-[rgba(41,165,135,0.06)] px-5 py-2.5">
                <Label tone="good">What it tells us</Label>
                <p className="text-[0.88rem] text-graphite">{s.signal}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
