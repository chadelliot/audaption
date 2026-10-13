/*
  The opening's four layers, and the four capability blueprints.

  The layers are what every company already has, in the order they have to be
  built. The capabilities are the plays that sit on top of them: each is the
  drawing for one chapter of the approach (see lib/approach.ts), not a section
  of its own.

  Naming is deliberate and load-bearing: Go-to-Market **Strategy** is a layer,
  Unified Go-to-Market **Motion** is a capability built on it. If those two ever
  collapse into the same words, the page starts claiming the same thing twice.
*/

/* ------------------------------------------------------------------ */
/* The opening — four layers, bottom-up                                */
/* ------------------------------------------------------------------ */

export interface TierBand {
  id: string;
  n: string;
  name: string;
  line: string;
}

/** Landing order, and therefore build order: nothing lands on nothing. */
export const TIERS: TierBand[] = [
  {
    id: "data",
    n: "01",
    name: "Customer Data",
    line: "One customer, defined once. Everything above this depends on it, and almost nobody owns it.",
  },
  {
    id: "journey",
    n: "02",
    name: "Customer Journey",
    line: "The path a customer actually takes — not the one drawn on a whiteboard two years ago.",
  },
  {
    id: "experience",
    n: "03",
    name: "Customer Experience",
    line: "What that journey feels like at every touchpoint. The only layer a customer ever sees.",
  },
  {
    id: "strategy",
    n: "04",
    name: "Go-to-Market Strategy",
    line: "Which markets you go after, what you won't do, and where growth is supposed to come from.",
  },
];

/* ------------------------------------------------------------------ */
/* Capabilities built on one foundation                                */
/* ------------------------------------------------------------------ */

/*
  One blueprint, four sets of labels. The grammar never changes — business
  inputs on the left, the unified data layer underneath, three building blocks
  that turn intelligence into an operating capability, the capability named on
  the bar above it, and business outcomes on the right.

  A visitor who reads one of these diagrams can read all four, which is the
  entire reason they share a component.
*/

export interface BuildingBlock {
  title: string;
  tooltip: string;
}

export interface Capability {
  id: string;
  /** Rail and tab label. */
  name: string;
  /** Set on the floating bar above the blocks. Kept short — it is drawn small. */
  bar: string;
  inputs: string[];
  blocks: [BuildingBlock, BuildingBlock, BuildingBlock];
  outcomes: string[];
  /**
   * One line on how this capability strengthens the rest of the system. The
   * long explanations that used to sit here duplicated the diagram directly
   * above them — the blocks, their labels and their tooltips carry that.
   */
  feeds: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: "content",
    name: "Content Marketing",
    bar: "CONTENT MARKETING",
    inputs: ["Customer Research", "Growth Priorities", "Competitive Landscape"],
    blocks: [
      {
        title: "Customer Intelligence",
        tooltip:
          "What existing customers value, purchase, ask about, and struggle with.",
      },
      {
        title: "Prospect Intent",
        tooltip:
          "What prospective audiences search for, engage with, compare, and signal before becoming customers.",
      },
      {
        title: "Content Strategy",
        tooltip:
          "How customer and prospect intelligence becomes themes, narratives, formats, channels, and activation priorities.",
      },
    ],
    outcomes: ["Organic Visibility ↑", "Sales Enablement", "Qualified Pipeline ↑"],
    feeds: "Applies content and audience learning to Website Experience.",
  },
  {
    id: "website",
    name: "Website Experience",
    bar: "WEBSITE EXPERIENCE",
    inputs: ["Behavior Analytics", "Voice of Customer", "Journey Mapping"],
    blocks: [
      {
        title: "Experience Design",
        tooltip:
          "How the website's structure, content, interface, and interactions help visitors understand and complete important tasks.",
      },
      {
        title: "Personalization",
        tooltip:
          "How content, pathways, recommendations, and experiences adapt to audience context, behavior, lifecycle stage, or known customer information.",
      },
      {
        title: "Measurement",
        tooltip:
          "How engagement, conversion, journey progression, and experience performance are tracked and used to improve the site.",
      },
    ],
    outcomes: ["Conversion ↑", "Deeper Engagement", "Personalized Experiences"],
    feeds: "Produces behavioral data for Marketing Analytics.",
  },
  {
    id: "gtm",
    name: "Unified Go-to-Market Motion",
    bar: "GO-TO-MARKET MOTION",
    inputs: [
      "Ideal Customer Profile",
      "Market Opportunity",
      "Territories",
      "Commercial Priorities",
    ],
    blocks: [
      {
        title: "Segmentation",
        tooltip:
          "How customers, prospects, markets, accounts, and opportunities are grouped so the organization can focus resources and tailor its approach.",
      },
      {
        title: "Lifecycle Design",
        tooltip:
          "How prospects and customers progress across stages, handoffs, experiences, and decisions throughout the commercial relationship.",
      },
      {
        title: "Commercial Orchestration",
        tooltip:
          "How Sales and Marketing motions, ownership, routing, timing, handoffs, activation, and measurement are designed to work together.",
      },
    ],
    outcomes: ["Win Rates ↑", "Better Forecasting", "Revenue Growth ↑"],
    feeds: "Same product, different buyer: each market gets its own message, signal and handoff, so deals stop stalling late.",
  },
  {
    id: "analytics",
    name: "Marketing Analytics",
    bar: "MARKETING ANALYTICS",
    inputs: [
      "Customer + Revenue Data",
      "Campaign + Channel Performance",
      "CRM + Marketing Platforms",
      "Executive Questions",
    ],
    blocks: [
      {
        title: "Unified Measurement Model",
        tooltip:
          "How shared metrics, definitions, calculations, sources, and relationships create one trusted way to measure marketing and commercial performance.",
      },
      {
        title: "Performance Analysis",
        tooltip:
          "How campaign, channel, customer, pipeline, and revenue performance are interpreted to identify drivers, friction, opportunities, and tradeoffs.",
      },
      {
        title: "Executive Reporting",
        tooltip:
          "How performance, context, risk, opportunity, and recommended action are translated into a clear leadership view.",
      },
    ],
    outcomes: ["Trusted Visibility", "Clearer Investment Decisions", "Faster Optimization"],
    feeds: "Sharpens investment, activation, and Go-to-Market decisions.",
  },
];

export const FOUNDATION_LABEL = "UNIFIED DATA LAYER";
