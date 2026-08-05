/*
  Every section on the homepage, as data.

  Two lists of four run back to back on this page and they are not the same
  list. The opening names the four *layers* every company already has, in the
  order they have to be built. "What we build" then shows what we do to each of
  those layers. "Capabilities" shows the four things a client actually asks for,
  each assembled on top of all of it.

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
/* What we build                                                       */
/* ------------------------------------------------------------------ */

export type PartId = "data" | "journey" | "strategy" | "ai";

export interface SystemPart {
  id: PartId;
  ref: string;
  name: string;
  claim: string;
  body: string;
  caption: string;
  /*
    What the drawing actually shows, in words.

    On a phone the isometric drawings are replaced by cards — at 390px their
    labels render around 6.7px and need sideways scrolling, which is not a
    drawing anybody can read. These are the same objects the drawing names, so
    the small screen loses the picture but none of the content.
  */
  pointsLabel: string;
  points: string[];
  /** The one the drawing emphasises, if any. */
  pointsResult?: string;
}

/*
  Customer Experience is not one of these on purpose. It is the finish on the
  other four rather than a thing bought separately — it shows up inside the
  Artificial Intelligence drawing as a layer, and is named in the section's
  own copy so nobody thinks it was forgotten.
*/
export const SYSTEMS: SystemPart[] = [
  {
    id: "data",
    ref: "01",
    name: "Customer Data",
    claim: "One definition of the customer, in one place.",
    body: "Your systems keep disagreeing about who the customer is. We settle that once — one identity, one set of definitions, agreed across teams. Every tool you already pay for keeps doing its job.",
    caption: "Every source feeds one shared model — not another warehouse.",
    pointsLabel: "Sources we resolve",
    points: ["CRM", "Website", "Ads", "Support", "Billing", "Product"],
    pointsResult: "One customer, defined once",
  },
  {
    id: "journey",
    ref: "02",
    name: "Customer Journey",
    claim: "See where customers actually go — and where they stop.",
    body: "We map real customer progression, phase by phase, and identify the points where attention, conversion, handoffs or revenue are being lost. Most companies have a journey map. Very few have one built from what customers did rather than what the team assumed — and fewer still know which phase is costing them the most.",
    caption: "Every stop is a point we can design an intervention around.",
    pointsLabel: "Phases we map",
    points: ["Discover", "Consider", "Engage", "Convert", "Retain"],
    pointsResult: "Every stop is a point to design around",
  },
  {
    id: "strategy",
    ref: "03",
    name: "Go-to-Market Strategy",
    claim: "Know which markets are worth going after.",
    body: "Every segment, channel and customer type sized on what it is actually worth — not on who argues hardest for it. One number that finance, marketing and the board will all still stand behind next week.",
    caption: "Every market gets measured. One or two are worth the money.",
    pointsLabel: "Markets we size",
    points: ["Enterprise", "Mid-market", "EMEA", "APAC", "Partner", "SMB"],
    pointsResult: "One or two are worth the money",
  },
  {
    id: "ai",
    ref: "04",
    name: "Artificial Intelligence",
    claim: "AI only works on top of the other three.",
    body: "Trusted content and knowledge for AI to work from, and the customer experience it powers. This is why pilots stall: the company skipped the layers underneath and asked AI to stand on nothing.",
    caption: "Take a layer away and the one above it stops working.",
    pointsLabel: "What AI stands on",
    points: [
      "Customer Data",
      "Customer Journey",
      "Go-to-Market Strategy",
      "Customer Experience",
    ],
    pointsResult: "Take a layer away and the one above stops working",
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
    feeds: "Turns customer, market, and territory intelligence into a coordinated commercial motion.",
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
