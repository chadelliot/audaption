"use client";

/*
  04 — Experience: what does each touchpoint say to each buyer?

  The funnel, and at every stage of it the touchpoint itself — not a description
  of it. Down the left, the same five stages as the Journey chapter. Pick one, or
  leave it alone and it tours them, and on the right are two rendered examples of
  the real thing as two different buyers would meet it: a paid social post, a
  website, an email, a proposal, a review dashboard or a text thread, each in an
  enterprise version and an operations-manager version.

  They are mockups of the same kind of object saying different things on purpose.
  That is the personalization: not a promise that content adapts, but the two
  artefacts side by side. Underneath is the signal each throws back, which is
  what the next chapter picks up.

  The tour stops the moment the reader clicks, and does not run at all for
  anyone who has asked for less motion.
*/

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { Card, Chip, Illustrative, Label } from "./ui";
import { Icon, NorthbridgeMark } from "./icons";

/* ------------------------------------------------------------------ */
/* The mockups                                                         */
/* ------------------------------------------------------------------ */

const BRAND = "Northbridge Supply";

type Social = { kind: "social"; tag: string; caption: string; headline: string; cta: string };
type Web = { kind: "web"; url: string; eyebrow: string; headline: string; sub: string; cta: string };
type Email = {
  kind: "email";
  to: string;
  subject: string;
  lines: string[];
  button: string;
  attach?: string;
};
type Doc = { kind: "doc"; title: string; kicker: string; rows: [string, string][]; cta: string };
type Dash = { kind: "dash"; title: string; rows: [string, number][]; next: string };
type Sms = { kind: "sms"; thread: { you?: boolean; text: string }[] };
type Mock = Social | Web | Email | Doc | Dash | Sms;

/** A frame every mockup sits in, so the two always have the same footprint. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="h-[14.25rem] overflow-hidden border border-[var(--line-ink-strong)] bg-white">{children}</div>;
}

function MockView({ m, tone }: { m: Mock; tone: "dark" | "light" }) {
  if (m.kind === "social") {
    return (
      <Frame>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <NorthbridgeMark size={28} />
            <div>
              <p className="text-[0.74rem] font-semibold leading-tight text-graphite">{BRAND}</p>
              <p className="text-[0.62rem] leading-tight text-mute">Sponsored</p>
            </div>
          </div>
          <p className="px-3 pb-2 text-[0.76rem] leading-snug text-slate">{m.caption}</p>
          <div
            className="relative flex flex-1 flex-col justify-end p-3.5"
            style={{ background: tone === "dark" ? "#262626" : "#29a587" }}
          >
            <span className="font-mono absolute left-3.5 top-3 text-[0.6rem] uppercase tracking-[0.14em] text-white/70">
              {m.tag}
            </span>
            <p className="font-display-mixed text-[1.3rem] leading-[1.08] text-white">{m.headline}</p>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-3 py-2">
            <span className="text-[0.64rem] text-mute">northbridgesupply.com</span>
            <span className="text-[0.72rem] font-semibold text-jade-deep">{m.cta} →</span>
          </div>
        </div>
      </Frame>
    );
  }

  if (m.kind === "web") {
    return (
      <Frame>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-3 py-1.5">
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 rounded-full bg-[rgba(38,38,38,0.2)]" />
              ))}
            </span>
            <span className="font-mono flex-1 truncate bg-white px-2 py-0.5 text-[0.6rem] text-mute">{m.url}</span>
          </div>
          <div className="flex items-center gap-3 border-b border-[var(--line-ink)] px-4 py-2">
            <span className="flex items-center gap-1.5 text-[0.74rem] font-semibold text-graphite">
              <NorthbridgeMark size={16} />
              {BRAND}
            </span>
            <span className="ml-auto flex gap-3 text-[0.62rem] text-mute">
              <span>Solutions</span>
              <span>Industries</span>
              <span>Contact</span>
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center px-5 py-3">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-jade-deep">{m.eyebrow}</p>
            <p className="font-display-mixed mt-1.5 text-[1.45rem] leading-[1.05] text-graphite">{m.headline}</p>
            <p className="mt-1.5 text-[0.76rem] leading-snug text-slate">{m.sub}</p>
            <p className="font-mono mt-3 inline-block w-fit bg-jade px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-white">
              {m.cta} →
            </p>
          </div>
        </div>
      </Frame>
    );
  }

  if (m.kind === "email") {
    return (
      <Frame>
        <div className="flex h-full flex-col">
          <div className="space-y-0.5 border-b border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-3.5 py-2 text-[0.66rem] leading-snug">
            <p>
              <span className="text-mute">From </span>
              <span className="inline-flex items-center gap-1 align-middle font-medium text-graphite">
                <NorthbridgeMark size={13} />
                Dana at {BRAND}
              </span>
            </p>
            <p>
              <span className="text-mute">To </span>
              <span className="text-slate">{m.to}</span>
            </p>
            <p className="pt-0.5 text-[0.8rem] font-semibold text-graphite">{m.subject}</p>
          </div>
          <div className="flex flex-1 flex-col px-3.5 py-2.5 text-[0.74rem] leading-snug text-slate">
            {m.lines.map((l, i) => (
              <p key={i} className={i ? "mt-1.5" : ""}>
                {l}
              </p>
            ))}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
              <span className="font-mono bg-jade px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white">
                {m.button}
              </span>
              {m.attach ? (
                <span className="inline-flex items-center gap-1 border border-[var(--line-ink-strong)] px-2 py-1 text-[0.62rem] text-slate">
                  <Icon name="sheet" size={12} /> {m.attach}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  if (m.kind === "doc") {
    return (
      <Frame>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--line-ink)] bg-[rgba(38,38,38,0.03)] px-3.5 py-2">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-mute">{m.kicker}</span>
            <span className="inline-flex items-center gap-1 text-[0.62rem] text-mute">
              <NorthbridgeMark size={13} />
              {BRAND}
            </span>
          </div>
          <div className="flex flex-1 flex-col px-4 py-3">
            <p className="font-display-mixed text-[1.3rem] leading-tight text-graphite">{m.title}</p>
            <ul className="mt-2.5 divide-y divide-[var(--line-ink)] border-y border-[var(--line-ink)] text-[0.74rem]">
              {m.rows.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-slate">{k}</span>
                  <span className="font-medium text-jade-deep">{v}</span>
                </li>
              ))}
            </ul>
            <p className="font-mono mt-auto inline-block w-fit bg-graphite px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white">
              {m.cta}
            </p>
          </div>
        </div>
      </Frame>
    );
  }

  if (m.kind === "dash") {
    return (
      <Frame>
        <div className="flex h-full flex-col px-4 py-3">
          <div className="flex items-baseline justify-between">
            <p className="font-display-mixed text-[1.15rem] leading-tight text-graphite">{m.title}</p>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-mute">Adoption by site</span>
          </div>
          <ul className="mt-2.5 space-y-2">
            {m.rows.map(([site, pct]) => (
              <li key={site}>
                <div className="flex justify-between text-[0.72rem]">
                  <span className="text-graphite">{site}</span>
                  <span className="font-semibold text-slate">{pct}%</span>
                </div>
                <div className="mt-0.5 h-1.5 bg-[rgba(38,38,38,0.08)]">
                  <div className="h-full" style={{ width: `${pct}%`, background: pct < 60 ? "#b4885a" : "#29a587" }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-auto border-t border-[var(--line-ink)] pt-2 text-[0.7rem] text-slate">
            <span className="font-semibold text-jade-deep">Next: </span>
            {m.next}
          </p>
        </div>
      </Frame>
    );
  }

  /* sms */
  return (
    <Frame>
      <div className="flex h-full flex-col bg-[rgba(38,38,38,0.03)]">
        <div className="flex items-center justify-center border-b border-[var(--line-ink)] bg-white py-2">
          <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-graphite">
            <NorthbridgeMark size={16} />
            {BRAND}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-1.5 px-3.5 py-3">
          {m.thread.map((b, i) => (
            <p
              key={i}
              className="max-w-[82%] px-3 py-1.5 text-[0.76rem] leading-snug"
              style={{
                alignSelf: b.you ? "flex-end" : "flex-start",
                background: b.you ? "#29a587" : "#fff",
                color: b.you ? "#fff" : "#262626",
                border: b.you ? "none" : "1px solid rgba(38,38,38,0.14)",
                borderRadius: b.you ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              }}
            >
              {b.text}
            </p>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* The stages                                                          */
/* ------------------------------------------------------------------ */

const STAGES: {
  k: string;
  left: number;
  goal: string;
  channels: string[];
  ent: Mock;
  mid: Mock;
  signal: string;
}[] = [
  {
    k: "Notice a problem",
    left: 100,
    goal: "Name the problem, and see they are not alone with it.",
    channels: ["Paid social", "Industry report"],
    ent: {
      kind: "social",
      tag: "Benchmark report",
      caption: "Multi-site operators lose more to vendor sprawl than to price. See where.",
      headline: "The hidden cost of a fragmented supplier base",
      cta: "Get the benchmark",
    },
    mid: {
      kind: "social",
      tag: "2-minute read",
      caption: "Three things cause most late deliveries, and none is the carrier.",
      headline: "Why orders slip by a week",
      cta: "Read it now",
    },
    signal: "Reads past 60% of the guide → marked as interested",
  },
  {
    k: "Compare options",
    left: 64,
    goal: "See how we differ, in their own terms.",
    channels: ["Website"],
    ent: {
      kind: "web",
      url: "northbridgesupply.com/multi-site",
      eyebrow: "For multi-site operations",
      headline: "One partner for every site.",
      sub: "Fewer vendors, lower risk and a clear ROI your finance team can sign off.",
      cta: "See the multi-site case study",
    },
    mid: {
      kind: "web",
      url: "northbridgesupply.com/quote",
      eyebrow: "For growing teams",
      headline: "Orders in by noon. On the truck this week.",
      sub: "Simple ordering, reliable service and one number to call.",
      cta: "Get a quote in two minutes",
    },
    signal: "Opens pricing or the case study → passed to sales with context",
  },
  {
    k: "Build the case",
    left: 41,
    goal: "Get something finance and the sponsor can sign.",
    channels: ["Email", "ROI calculator"],
    ent: {
      kind: "email",
      to: "VP Operations, Procurement, Finance",
      subject: "A business case for your 14 sites",
      lines: [
        "Hi Priya,",
        "Based on your 14 sites and last year's spend, here is a business case your finance team can review without a meeting.",
      ],
      button: "Open the business case",
      attach: "Business-case.xlsx",
    },
    mid: {
      kind: "email",
      to: "Operations manager",
      subject: "Your quote, with the delivery date on it",
      lines: [
        "Hi Marcus,",
        "$4,820 for the order you sketched, delivered Thursday. If anything changes, reply here and I will sort it today.",
      ],
      button: "Approve the quote",
    },
    signal: "Finishes the calculator → buying group mapped",
  },
  {
    k: "Decide",
    left: 29,
    goal: "Settle risk, terms and approvals.",
    channels: ["Seller", "Proposal"],
    ent: {
      kind: "doc",
      kicker: "Executive briefing",
      title: "Consolidating 14 sites onto one partner",
      rows: [
        ["Security review pack", "Attached"],
        ["Contract terms, one agreement", "Ready"],
        ["Rollout by site", "6 weeks"],
      ],
      cta: "Schedule the briefing",
    },
    mid: {
      kind: "doc",
      kicker: "Pilot order",
      title: "A first order, to see us work",
      rows: [
        ["Two pallets, standard lines", "$4,820"],
        ["Delivery", "Thursday"],
        ["Then a standing order", "Optional"],
      ],
      cta: "Approve the pilot",
    },
    signal: "A new stakeholder joins the thread → multi-thread plan updated",
  },
  {
    k: "Adopt & expand",
    left: 24,
    goal: "Get value fast, then find the next use.",
    channels: ["Success reviews", "Text"],
    ent: {
      kind: "dash",
      title: "Quarterly review",
      rows: [
        ["Chicago", 92],
        ["Dallas", 78],
        ["Atlanta", 64],
        ["Phoenix", 41],
      ],
      next: "Phoenix is the site with the most room to grow.",
    },
    mid: {
      kind: "sms",
      thread: [
        { text: "Your order ships tomorrow and lands Thursday." },
        { text: "Same again next week? Reply YES to reorder." },
        { you: true, text: "YES" },
        { text: "Done. Delivery Thursday." },
      ],
    },
    signal: "Usage dips → a save play starts before renewal, not at it",
  },
];

/** Funnel width, as a share of the column. It narrows less than the data does,
    because the narrowest stage still has to hold its own name. */
const WIDTH = [100, 91, 82, 73, 64];

export default function Touchpoints() {
  const still = usePrefersReducedMotion();
  const [on, setOn] = useState(0);
  const [touring, setTouring] = useState(true);
  /* On a phone the two buyers do not fit side by side, so one is shown at a time. */
  const [buyer, setBuyer] = useState(0);

  useEffect(() => {
    if (still || !touring) return;
    const t = setInterval(() => setOn((n) => (n + 1) % STAGES.length), 5200);
    return () => clearInterval(t);
  }, [still, touring]);

  const s = STAGES[on];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-6">
        <Label>The funnel · what we say at each stage</Label>
        <Illustrative>Same product, two buyers</Illustrative>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,18.75rem)_minmax(0,1fr)]">
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
                <span className="min-w-0 flex-1">
                  <span
                    className="annot block text-[0.54rem] leading-none"
                    style={{ color: active ? "rgba(255,255,255,0.8)" : undefined }}
                  >
                    Stage {i + 1}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.9rem] font-semibold leading-tight">{st.k}</span>
                </span>
                <span className="font-display shrink-0 text-[1.15rem] leading-none" style={{ opacity: active ? 1 : 0.6 }}>
                  {st.left}%
                </span>
              </button>
            );
          })}
          <p className="annot mt-1 text-center text-[0.58rem]">
            Buyers still in · {touring && !still ? "touring, or click a stage" : "click any stage"}
          </p>
        </div>

        {/* what we say, to whom: the touchpoint itself */}
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
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-[var(--line-ink)] px-5 py-3">
                <div>
                  <Label tone="good">Stage {on + 1}</Label>
                  <p className="font-display-mixed mt-0.5 text-[1.35rem] leading-none text-graphite">{s.k}</p>
                  <p className="mt-1.5 text-[0.82rem] leading-snug text-slate">
                    <span className="font-medium text-graphite">The buyer is trying to:</span> {s.goal}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Label>The touchpoint</Label>
                  {s.channels.map((c) => (
                    <Chip key={c} tone="solid">
                      {c}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 px-5 pt-3 sm:hidden" role="tablist" aria-label="Buyer">
                {["Enterprise buying group", "Operations manager"].map((l, k) => (
                  <button
                    key={l}
                    type="button"
                    role="tab"
                    aria-selected={buyer === k}
                    onClick={() => setBuyer(k)}
                    className="font-mono flex flex-1 items-center justify-center gap-2 border px-2 py-2 text-[0.6rem] uppercase leading-tight tracking-[0.08em]"
                    style={{
                      borderColor: buyer === k ? (k ? "#29a587" : "#262626") : "rgba(38,38,38,0.2)",
                      background: buyer === k ? (k ? "#29a587" : "#262626") : "transparent",
                      color: buyer === k ? "#fff" : "#56605a",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 px-5 pb-3 pt-3 sm:grid-cols-2">
                {[
                  { label: "Enterprise buying group", tone: "dark" as const, m: s.ent },
                  { label: "Operations manager", tone: "light" as const, m: s.mid },
                ].map(({ label, tone, m }, k) => (
                  <div key={label} className={`${buyer === k ? "" : "hidden"} sm:block`}>
                    <p className="mb-1.5 flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5"
                        style={{ background: tone === "dark" ? "#262626" : "#29a587" }}
                      />
                      <span className="annot text-[0.6rem] text-graphite!">{label}</span>
                    </p>
                    <MockView m={m} tone={tone} />
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3 border-t border-[var(--line-ink)] bg-[rgba(41,165,135,0.06)] px-5 py-2.5">
                <Icon name="signal" size={16} className="text-jade-deep" />
                <Label tone="good">What it tells us</Label>
                <p className="text-[0.86rem] text-graphite">{s.signal}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
