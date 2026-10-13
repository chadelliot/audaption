/*
  The approach, as a sequence of decisions.

  This replaces the old tour of four layers and four marketing capabilities,
  which read as a list of services. A commercial growth strategy is not a list:
  it is an order of questions, each one answered before the next is asked, each
  ending in a recommendation. The marketing capabilities are not the headline
  any more; they are the plays that sit inside the answers, so each one now
  appears as the drawing for the question it actually helps answer.

  Every chapter pairs one question with one drawing:

    01 Scoreboard    Marketing Analytics blueprint
    02 Segmentation  Go-to-Market Strategy drawing
    03 Message       Content Marketing blueprint
    04 Funnel        Customer Journey drawing
    05 Signals       Customer Data drawing
    06 Scale         Artificial Intelligence drawing
    07 Invest        Unified Go-to-Market Motion blueprint

  Website Experience has no chapter of its own. It is the surface the funnel
  and signals chapters act on, and its blueprint is still in
  components/iso/Blueprint.tsx and lib/systems.ts if it earns one back.

  No numbers appear here that are not Audaption's to claim. The structure is
  borrowed from the approach page; the figures on that page belong to its
  fictional case and stay there.
*/

export type GroupId = "case" | "diagnose" | "act";

export const GROUPS: { id: GroupId; label: string }[] = [
  { id: "case", label: "The case" },
  { id: "diagnose", label: "Diagnose" },
  { id: "act", label: "Act" },
];

export type DrawingId =
  | "analytics"
  | "strategy"
  | "content"
  | "journey"
  | "data"
  | "ai"
  | "gtm";

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
  /** What the drawing shows, in words — what a phone gets instead of it. */
  points: string[];
  /** Which drawing the chapter is built around. Absent for text chapters. */
  drawing?: DrawingId;
  /**
   * `stack` puts the copy in a band above a wide drawing. `split` puts it
   * beside a tall one. Blueprints are 1.74:1 and need the width; the AI
   * drawing is nearly square and needs the height.
   */
  layout: "stack" | "split";
}

export const CHAPTERS: Chapter[] = [
  {
    id: "scoreboard",
    group: "diagnose",
    title: "Scoreboard",
    question: "What defines success?",
    claim: "Agree on one scoreboard before fixing anything.",
    body: "Most teams track a dozen numbers and argue about the one that is off. We settle the metrics, the definitions and the source of truth first, then find the single number that is holding the rest back.",
    rec: "Prioritize the metric that gates the rest. Protect what is already healthy rather than optimizing it further.",
    points: [
      "Customer and revenue data, campaign and channel performance",
      "One measurement model, one set of definitions",
      "Performance analysis and an executive view",
      "Trusted visibility, clearer investment decisions",
    ],
    drawing: "analytics",
    layout: "stack",
  },
  {
    id: "segmentation",
    group: "diagnose",
    title: "Segmentation",
    question: "Where should we compete?",
    claim: "You cannot win everywhere, so rank where you can.",
    body: "Every segment, channel and customer type sized on what it is actually worth: deal size, buying committee, sales cycle, room to expand. A national ranking is not a plan, so we test it market by market.",
    rec: "Fund the largest open pool first and sequence the rest behind it. One or two markets are worth the money.",
    points: ["Enterprise", "Mid-market", "EMEA", "APAC", "Partner", "SMB"],
    drawing: "strategy",
    layout: "stack",
  },
  {
    id: "message",
    group: "diagnose",
    title: "Message",
    question: "Who gets the message, and where?",
    claim: "Same product, different buyer.",
    body: "Messaging is built per market and per buying role, not per tier. The market changes what you lead with: outcomes and supplier consolidation for an enterprise committee, speed and a reliable service for an operations manager.",
    rec: "Write one message per market and buyer, then retire the generic deck.",
    points: [
      "Customer research, growth priorities, competitive landscape",
      "Customer intelligence and prospect intent",
      "One content strategy per market",
      "Organic visibility, sales enablement, qualified pipeline",
    ],
    drawing: "content",
    layout: "stack",
  },
  {
    id: "funnel",
    group: "diagnose",
    title: "Funnel",
    question: "Where does growth leak?",
    claim: "Find where qualified buyers stall.",
    body: "Opportunity is rarely the problem. We map real customer progression, phase by phase, and find where attention, conversion, handoffs or revenue are lost. It is usually late, and usually in a handoff.",
    rec: "Fund win-rate enablement before adding top-of-funnel spend.",
    points: ["Discover", "Consider", "Engage", "Convert", "Retain"],
    drawing: "journey",
    layout: "stack",
  },
  {
    id: "signals",
    group: "act",
    title: "Signals",
    question: "When should we act?",
    claim: "Act on timing, not guesswork.",
    body: "Every stage throws off signals: new funding, an executive hire, a champion who leaves, a competitive evaluation, spend that starts to fall. With one customer record, each signal triggers a marketing play and a sales play.",
    rec: "Define the handful of signals that matter and who acts on each. Single-threaded deals stall; multi-threaded ones close.",
    points: ["CRM", "Website", "Ads", "Support", "Billing", "Product"],
    drawing: "data",
    layout: "stack",
  },
  {
    id: "scale",
    group: "act",
    title: "Scale",
    question: "What makes it scale?",
    claim: "AI only works on top of the other layers.",
    body: "Trusted data and knowledge for AI to work from, and the customer experience it powers. This is why pilots stall: the company skipped the layers underneath and asked AI to stand on nothing.",
    rec: "Build the layers first, then let AI act on them.",
    points: [
      "Customer Data",
      "Customer Journey",
      "Go-to-Market Strategy",
      "Customer Experience",
    ],
    drawing: "ai",
    layout: "split",
  },
  {
    id: "invest",
    group: "act",
    title: "Invest",
    question: "Where should we invest?",
    claim: "Fund two plays, then follow the returns.",
    body: "A unified go-to-market motion connects segmentation, lifecycle design and commercial orchestration, so Sales and Marketing share territory, routing, timing and handoffs. Start with the largest open pool and the fastest payback.",
    rec: "Fund both plays now. At day 90, move budget to whichever earns more.",
    points: [
      "Ideal customer profile, market opportunity, territories",
      "Segmentation, lifecycle design, commercial orchestration",
      "Win rates up, better forecasting, revenue growth",
    ],
    drawing: "gtm",
    layout: "stack",
  },
];

/* ------------------------------------------------------------------ */
/* The two chapters that are text, not drawings                        */
/* ------------------------------------------------------------------ */

export const SUMMARY = {
  id: "summary",
  group: "case" as GroupId,
  title: "Executive summary",
  eyebrow: "The case · Executive summary",
  headline: "A plan to stop growth from leaking.",
  lede: "Audaption designs the commercial system behind the role you are hiring for: what you measure, where you compete, what you say, where deals stall and when to act. Marketing capabilities are the plays inside that system, not the strategy.",
  plan: [
    {
      name: "Focus",
      line: "Pick the one number that gates the rest, and the one or two markets worth the money.",
    },
    {
      name: "Fix",
      line: "Find where qualified buyers stall and win more of the opportunities you already have.",
    },
    {
      name: "Align",
      line: "Run Marketing and Sales off one scoreboard, one set of signals and a 90-day plan.",
    },
  ],
};

export const ROADMAP = {
  id: "roadmap",
  group: "act" as GroupId,
  title: "First 90 days",
  eyebrow: "Act · The first 90 days",
  headline: "Align, activate, optimize.",
  steps: [
    {
      days: "Days 1–30",
      name: "Align",
      line: "Confirm the scoreboard, validate the segments, set baselines and assign data ownership.",
    },
    {
      days: "Days 31–60",
      name: "Activate",
      line: "Launch the first signal-driven plays, one campaign per market, with talk tracks for Sales.",
    },
    {
      days: "Days 61–90",
      name: "Optimize",
      line: "Shift budget toward the stronger market, scale what works and set the next quarter.",
    },
  ],
  ask: "Fund the first plays now, review returns at day 90, and move budget to whichever market earns more.",
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
