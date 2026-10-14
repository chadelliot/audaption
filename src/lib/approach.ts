/*
  The story: building the go-to-market strategy.

  The opening says every company has four layers — Customer Data, Customer
  Journey, Customer Experience, and Go-to-Market Strategy on top. This is the
  same four, built out, in the same order, and it is the whole argument: a
  go-to-market strategy is not a document. It is three things you have to know,
  put into one motion that sales and marketing run together.

    Data         what we know about each market and each customer: who the ideal
                 customer is, and one picture of them as a whole
    Journey      the steps a buyer takes to a first purchase and to the next
    Experience   every touchpoint and every signal it throws off, fed back in
    Strategy     the one motion sales and marketing share — and then the money
                 behind it, the proof it works, and how it compounds

  Spend, speed to lead, martech and the rest are real work and they matter, but
  they are not the plot. They are supporting chapters or, more often, deep-dive
  pages: each chapter that has one links to it (see lib/capabilities.ts).

  Every chapter is one question, one flat working exhibit, one recommendation.
  The exhibits live in components/exhibits and are illustrative; they say so in
  their corner and none is client data. An exhibit has to carry its chapter's
  claim, not just illustrate the topic: if a claim changes, change the exhibit
  with it. The opening's isometric stack is the one drawing left, on purpose.
*/

import type { ExhibitId } from "@/components/exhibits";

export type GroupId = "case" | "data" | "journey" | "experience" | "strategy";

export const GROUPS: { id: GroupId; label: string }[] = [
  { id: "case", label: "The case" },
  { id: "data", label: "Data" },
  { id: "journey", label: "Journey" },
  { id: "experience", label: "Experience" },
  { id: "strategy", label: "Strategy" },
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
  /** The deep-dive page this chapter opens onto, by slug. */
  deepDive?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "icp",
    group: "data",
    title: "Market",
    question: "Who are we selling to, market by market?",
    claim: "Know your best customer before you chase the next one.",
    body: "We profile the customers who buy, stay and expand, then score every market and account against that profile. The result is an ideal customer profile you can actually count: how many accounts fit, where they are, and which tier deserves effort first.",
    rec: "Write the ideal customer profile from the customers you keep, then point every team at its top tier.",
    exhibit: "icp",
    deepDive: "ideal-customer-profile",
  },
  {
    id: "customer",
    group: "data",
    title: "Customer",
    question: "What do we actually know about each customer?",
    claim: "One customer, seen as a whole.",
    body: "Today the same company sits in your systems as four records, under four names, with four owners and four versions of its history. We resolve them into one profile that carries what you know: who they are, what they have bought, who decides, how they have engaged. Every team then starts from the same picture.",
    rec: "Resolve the records into one profile, give every account an owner, and make that profile the source every other system reads.",
    exhibit: "record",
    deepDive: "crm-automation",
  },
  {
    id: "journey",
    group: "journey",
    title: "Journey",
    question: "How do they get to a decision, and to the next one?",
    claim: "Map the path buyers take, not the path you drew.",
    body: "We build the journey from what customers actually did: the stages, how long each takes, who joins when, and where buyers stall or leave. Then we map the road back, the steps to a second purchase, because repeat revenue is a journey of its own.",
    rec: "Design for the stage that loses the most buyers, and give the return path the same attention as the first sale.",
    exhibit: "journey",
    deepDive: "customer-journey",
  },
  {
    id: "touchpoints",
    group: "experience",
    title: "Touchpoints",
    question: "What does each touchpoint say to each buyer?",
    claim: "Make every touchpoint respond to who is on the other end.",
    body: "At every stage of the funnel there is a touchpoint, and each is a chance to meet a buyer where the journey has taken them. We design what each one says by market and role, so the same product reaches an enterprise buying group and an operations manager in the words that fit each, then we read what each one taught us.",
    rec: "Personalize the few touchpoints that carry the most pipeline before redesigning the rest.",
    exhibit: "touchpoints",
    deepDive: "website-conversion",
  },
  {
    id: "signals",
    group: "experience",
    title: "Signals",
    question: "What are buyers telling us, and when?",
    claim: "Turn every touchpoint into a signal someone acts on.",
    body: "An account leaves a trail: ads it engaged with, pages it read, funding it received, a champion who moved on. Read together on one timeline, the trail tells a seller when to call and what to say, instead of when it is convenient.",
    rec: "Agree the handful of signals that matter, who acts on each, and by when. Single-threaded deals stall; multi-threaded ones close.",
    exhibit: "sell",
    deepDive: "signal-led-selling",
  },
  {
    id: "motion",
    group: "strategy",
    title: "Motion",
    question: "How do sales and marketing run this together?",
    claim: "One motion, one plan and one scoreboard, shared.",
    body: "The three layers meet here. For each stage of the journey we set what marketing does, what sales does, and the one measure they share, so handoffs are designed rather than negotiated and nobody optimizes a number the other team cannot see.",
    rec: "Replace two plans with one: a shared target, shared stages, a shared scoreboard and a named owner for every step.",
    exhibit: "motion",
    deepDive: "go-to-market-motion",
  },
  {
    id: "fund",
    group: "strategy",
    title: "Fund",
    question: "Where should the money go?",
    claim: "Fund the motion where the next dollar earns most.",
    body: "Once the motion is clear, the money follows it. Every channel flattens, so the average return tells you little about the next dollar. We read the marginal return of each channel and move spend toward the steepest curve before the quarter closes.",
    rec: "Cap the saturated channel, fund the one with the steepest curve, and read the curves again every month.",
    exhibit: "allocate",
    deepDive: "advertising-roi",
  },
  {
    id: "prove",
    group: "strategy",
    title: "Prove",
    question: "How do we know it is working?",
    claim: "Report one number, with the range behind it.",
    body: "Platforms each claim the sale, so their totals never reconcile. We reconcile credit to finance and show each channel's return as a range, so leadership gets a number it can repeat and a read it can allocate against.",
    rec: "Report revenue reconciled to finance, and let the range guide the next allocation.",
    exhibit: "prove",
    deepDive: "marketing-analytics",
  },
  {
    id: "scale",
    group: "strategy",
    title: "Scale",
    question: "How does it compound?",
    claim: "Build in the order that unlocks automation and AI.",
    body: "AI does not skip steps. Each layer you build unlocks something it can do: a profile unlocks scoring, a journey unlocks next-best-action, signals unlock timing, a shared motion unlocks forecasting. We build in that order, so each step pays for the next.",
    rec: "Sequence the build by what each step unlocks, not by what is newest.",
    exhibit: "aipath",
    deepDive: "ai-readiness",
  },
];

/* ------------------------------------------------------------------ */
/* The two steps that are text, not exhibits                           */
/* ------------------------------------------------------------------ */

export const SUMMARY = {
  id: "summary",
  group: "case" as GroupId,
  title: "The strategy",
  eyebrow: "The case · Go-to-market strategy",
  headline: "Build the go-to-market strategy sales and marketing can run together.",
  lede: "A go-to-market strategy is not a deck. It is what you know about each market and customer, how those customers really buy, and every touchpoint and signal along the way, built into one motion that sales and marketing run together. We build all three, then the motion on top of them.",
  layers: [
    {
      name: "Data",
      line: "Who your ideal customer is, market by market, and one picture of each customer as a whole.",
    },
    {
      name: "Journey",
      line: "The steps a buyer takes to a first purchase, and to the next one.",
    },
    {
      name: "Experience",
      line: "Every touchpoint and signal, fed back in so each one makes the next sharper.",
    },
  ],
  result: "One go-to-market strategy: sales and marketing aligned in a single motion.",
};

export const ROADMAP = {
  id: "roadmap",
  group: "strategy" as GroupId,
  title: "How we build it",
  eyebrow: "Strategy · How we build it",
  headline: "Map it, align it, build it, run it.",
  steps: [
    {
      n: "01",
      name: "Map",
      line: "Profile the market and the customer, trace the real journey, and audit every touchpoint and signal.",
    },
    {
      n: "02",
      name: "Align",
      line: "Turn what we found into one motion for sales and marketing: shared stages, plays, owners and scoreboard.",
    },
    {
      n: "03",
      name: "Build",
      line: "Put it into the systems: the customer record, the routing, the touchpoints and the reporting.",
    },
    {
      n: "04",
      name: "Run",
      line: "Operate it with you, read the results against finance, and move money and effort to what is working.",
    },
  ],
  ask: "Start with the map. It shows which of the three layers is holding your strategy back, and what to build first.",
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
