/*
  The story: follow one dollar.

  The approach on aboutchad.com is a diagnosis — one company, one scorecard, a
  sequence of analytical questions. This is a different story on purpose. It
  follows a single dollar of growth spend through the commercial system, gate by
  gate, from the moment it is allocated to the moment it is proven and spent
  again. At every gate that dollar either compounds or leaks, and the argument
  is that the leaks are almost never where a team is looking.

  Nine gates, in three movements:

    Goes out        01 Allocate   02 Reach   03 Convert
    Gets captured   04 Capture    05 Record  06 Route
    Comes back      07 Sell       08 Prove   09 Scale

  Each gate is one question, one flat working exhibit, and one recommendation.
  Each also stands for a body of work Audaption does — advertising ROI, content
  and creative, website and conversion, martech, CRM, automation, signal-led
  selling, analytics, AI — which is why every chapter is also the front door to a
  deeper page about that work.

  The exhibits live in components/exhibits and are illustrative. They say so in
  their corner and none is client data. Every exhibit has to carry its chapter's
  claim, not just illustrate the topic; if a claim changes, change the exhibit
  with it. The opening's isometric stack is the one drawing left on the page, on
  purpose.
*/

import type { ExhibitId } from "@/components/exhibits";

export type GroupId = "case" | "out" | "in" | "back";

export const GROUPS: { id: GroupId; label: string }[] = [
  { id: "case", label: "The dollar" },
  { id: "out", label: "Goes out" },
  { id: "in", label: "Gets captured" },
  { id: "back", label: "Comes back" },
];

export interface Chapter {
  id: string;
  group: GroupId;
  /** Shown in the rail and the footer bar. */
  title: string;
  /** The question the chapter answers. */
  question: string;
  claim: string;
  body: string;
  /** The one-line recommendation every chapter ends on. */
  rec: string;
  /** The working exhibit the chapter is built around. */
  exhibit: ExhibitId;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "allocate",
    group: "out",
    title: "Allocate",
    question: "Where does the first dollar go?",
    claim: "Spend where the next dollar earns most, not where the last one did.",
    body: "Every channel flattens. Past a point, more spend buys less. We read the marginal return of each channel, find the ones past their knee, and move money before the quarter closes rather than after it.",
    rec: "Cap the saturated channel, fund the one with the steepest curve, and read the curves again every month.",
    exhibit: "allocate",
  },
  {
    id: "reach",
    group: "out",
    title: "Reach",
    question: "What does it say, and to whom?",
    claim: "Test the message against the audience, not just the channel.",
    body: "A message that wins with one buyer loses with the next. We run message-by-audience tests and keep what works where, so creative stops being a matter of taste and becomes a library with results attached.",
    rec: "Retire the generic message. Fund the three combinations that clear the bar and test the rest.",
    exhibit: "reach",
  },
  {
    id: "convert",
    group: "out",
    title: "Convert",
    question: "What happens when they arrive?",
    claim: "Make the page respond to the buyer in front of it.",
    body: "The website is where the message meets behavior. We design how structure, content and interactions help each buyer finish the task they came for, adapt it by market and lifecycle stage, and measure how far each visit progresses.",
    rec: "Personalize the few pages that carry the most pipeline before redesigning the rest.",
    exhibit: "website",
  },
  {
    id: "capture",
    group: "in",
    title: "Capture",
    question: "Does the signal survive the stack?",
    claim: "Most of what a dollar learns is lost between the tools.",
    body: "Consent gaps, broken tags, overlapping platforms and integrations nobody owns decide how much of a buyer's behavior ever reaches a person who can act on it. The stack is not a list of tools; it is a pipe, and pipes leak at joints.",
    rec: "Retire the overlapping tools and connect the few integrations that carry signal. Do not buy another platform first.",
    exhibit: "stack",
  },
  {
    id: "record",
    group: "in",
    title: "Record",
    question: "Who is this customer?",
    claim: "One account, one record, one owner.",
    body: "The same company sits in the CRM four times, under four names, with four owners and four versions of its history. Until it is one record with one lifecycle stage, nothing downstream can be trusted, including the AI.",
    rec: "Merge the duplicates, give every account an owner, and make the record the only place a lifecycle stage is set.",
    exhibit: "record",
  },
  {
    id: "route",
    group: "in",
    title: "Route",
    question: "How fast does it reach a person?",
    claim: "Speed to lead is a system, not a habit.",
    body: "Win rate falls away in the first hours after a buyer raises a hand. Automation does the work that should never wait on a human: score, route, start the clock, and hand over a record that is already complete.",
    rec: "Set a response-time promise by segment and automate everything that happens before the first human touch.",
    exhibit: "route",
  },
  {
    id: "sell",
    group: "back",
    title: "Sell",
    question: "When does a seller act?",
    claim: "Put the right signal in front of the right seller at the right moment.",
    body: "An account leaves a trail: ads it engaged with, pages it read, funding it received, a champion who moved on. Read together on one timeline, the trail tells a seller when to call and what to say, instead of when it is convenient.",
    rec: "Agree the handful of signals that matter, who acts on each, and by when. Single-threaded deals stall; multi-threaded ones close.",
    exhibit: "sell",
  },
  {
    id: "prove",
    group: "back",
    title: "Prove",
    question: "What did the dollar do?",
    claim: "One number leadership trusts.",
    body: "Every platform claims the sale. Added together they claim more revenue than the company booked. We reconcile attribution to finance, show credit as a range rather than a verdict, and give the board one number it can repeat.",
    rec: "Report revenue reconciled to finance, and treat attribution as a range that informs the next allocation.",
    exhibit: "prove",
  },
  {
    id: "scale",
    group: "back",
    title: "Scale",
    question: "What makes it compound?",
    claim: "AI works on top of the layers, not instead of them.",
    body: "Trusted data and knowledge for AI to work from, and the experience it powers. This is why pilots stall: the company skipped the layers underneath and asked AI to stand on nothing.",
    rec: "Close the gaps in the layers first, then let AI act on them.",
    exhibit: "ai",
  },
];

/* ------------------------------------------------------------------ */
/* The two steps that are text, not exhibits                           */
/* ------------------------------------------------------------------ */

export const SUMMARY = {
  id: "summary",
  group: "case" as GroupId,
  title: "The dollar",
  eyebrow: "The case · Follow one dollar",
  headline: "Follow one dollar through your growth system.",
  lede: "A dollar of growth spend crosses nine gates before it comes back as revenue. At every one it can compound or leak, and the leaks are rarely where a team is looking. Audaption finds them and builds the system that closes them.",
  plan: [
    {
      name: "Goes out",
      line: "Put the first dollar where the next one earns most, say the right thing to the right buyer, and make the page answer.",
    },
    {
      name: "Gets captured",
      line: "Keep every signal the dollar produced: through the stack, into one record, and in front of a person fast.",
    },
    {
      name: "Comes back",
      line: "Act on the moment, report one number leadership trusts, and spend it again with more confidence.",
    },
  ],
};

export const ROADMAP = {
  id: "roadmap",
  group: "back" as GroupId,
  title: "First 90 days",
  eyebrow: "Comes back · The first 90 days",
  headline: "Baseline, fix, reinvest.",
  steps: [
    {
      days: "Days 1–30",
      name: "Baseline",
      line: "Map where the dollar goes, audit the stack and the record, and set the one number everyone agrees to.",
    },
    {
      days: "Days 31–60",
      name: "Fix",
      line: "Close the two biggest leaks: move the saturated spend, connect the integrations that carry signal, set the response-time promise.",
    },
    {
      days: "Days 61–90",
      name: "Reinvest",
      line: "Read the new curves, shift budget again, and put the next quarter's plan on the reconciled number.",
    },
  ],
  ask: "Fund the baseline, fix the two biggest leaks, and review the reconciled return at day 90.",
};

/** The deck in reading order. Drives the rail, the controls and the keyboard. */
export type Step =
  | { kind: "summary" }
  | { kind: "chapter"; chapter: Chapter; n: number }
  | { kind: "roadmap" };

export const STEPS: Step[] = [
  { kind: "summary" },
  ...CHAPTERS.map((chapter, i) => ({
    kind: "chapter" as const,
    chapter,
    n: i + 1,
  })),
  { kind: "roadmap" },
];

export const stepMeta = (s: Step) =>
  s.kind === "summary"
    ? { id: SUMMARY.id, group: SUMMARY.group, title: SUMMARY.title, num: "" }
    : s.kind === "roadmap"
      ? { id: ROADMAP.id, group: ROADMAP.group, title: ROADMAP.title, num: "" }
      : {
          id: s.chapter.id,
          group: s.chapter.group,
          title: s.chapter.title,
          num: String(s.n).padStart(2, "0"),
        };
